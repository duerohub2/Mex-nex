import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { executeTool, TOOL_DEFINITIONS } from "../../../lib/agent-tools.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dataDir = path.resolve(process.cwd(), process.env.MEX_NEX_DATA_DIR || ".data");
const sessionsFile = path.join(dataDir, "ai-sessions.json");
const officeFile = path.join(dataDir, "office.json");

function providerConfig() {
  const provider = (process.env.AI_PROVIDER || "hermes").toLowerCase();
  const configs = {
    hermes: { label: "Hermes Agent", baseUrl: process.env.HERMES_BASE_URL, model: process.env.HERMES_MODEL, apiKey: process.env.HERMES_API_KEY },
    local: { label: "Model AI Lokal", baseUrl: process.env.LOCAL_MODEL_BASE_URL, model: process.env.LOCAL_MODEL_NAME, apiKey: process.env.LOCAL_MODEL_API_KEY },
    external: { label: "Provider Eksternal", baseUrl: process.env.EXTERNAL_AI_BASE_URL, model: process.env.EXTERNAL_AI_MODEL, apiKey: process.env.EXTERNAL_AI_API_KEY }
  };
  return { provider, ...(configs[provider] || configs.hermes) };
}

function safeStatus(config) {
  let endpointValid = false;
  try { endpointValid = Boolean(config.baseUrl && ["http:", "https:"].includes(new URL(config.baseUrl).protocol)); } catch {}
  return {
    provider: config.provider,
    label: config.label,
    configured: endpointValid && Boolean(config.model),
    endpointValid,
    modelConfigured: Boolean(config.model),
    message: endpointValid && config.model ? "Runtime siap menerima permintaan." : "Runtime belum dikonfigurasi. Isi URL endpoint dan nama model di .env.local."
  };
}

async function readJson(file, fallback) {
  try { return JSON.parse(await readFile(file, "utf8")); }
  catch (error) { if (error.code === "ENOENT") return fallback; throw error; }
}
async function saveJson(file, data) {
  await mkdir(dataDir, { recursive: true });
  const temp = file + "." + randomUUID() + ".tmp";
  await writeFile(temp, JSON.stringify(data, null, 2) + "\n", "utf8");
  await rename(temp, file);
}
async function readAgents() {
  const office = await readJson(officeFile, { agents: [], departments: [] });
  return (office.agents || []).map(agent => ({
    ...agent,
    departmentName: office.departments?.find(dep => dep.id === agent.departmentId)?.name || agent.departmentName || "Tanpa departemen"
  }));
}
function clean(value, max = 6000) {
  const text = String(value ?? "").trim();
  if (!text) throw new Error("Pesan tidak boleh kosong.");
  if (text.length > max) throw new Error("Pesan terlalu panjang (maksimal " + max + " karakter).");
  return text;
}
function agentPrompt(agent) {
  return [
    "Kamu adalah " + agent.name + ", AI Agent yang bekerja di kantor virtual MEX-NEX.",
    "Jabatan: " + agent.role + ". Departemen: " + agent.departmentName + ".",
    "Tanggung jawab: " + (agent.description || agent.role) + ".",
    "Jawab dalam bahasa yang digunakan pengguna. Berikan hasil yang konkret, jujur, dan terstruktur.",
    "Kamu dapat menggunakan tool MEX-NEX yang disediakan secara eksplisit. Jangan mengaku melakukan tindakan yang belum dikonfirmasi tool."
  ].join("\n");
}
async function callModel(messages, config) {
  const url = config.baseUrl.replace(/\/+$/, "") + "/v1/chat/completions";
  const headers = { "Content-Type": "application/json" };
  if (config.apiKey) headers.Authorization = "Bearer " + config.apiKey;
  const response = await fetch(url, {
    method: "POST", headers,
    body: JSON.stringify({ model: config.model, messages, temperature: 0.4 }),
    signal: AbortSignal.timeout(Number(process.env.AI_REQUEST_TIMEOUT_MS || 120000))
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error?.message || body.message || ("Provider AI merespons HTTP " + response.status));
  const answer = body.choices?.[0]?.message?.content;
  if (typeof answer !== "string" || !answer.trim()) throw new Error("Provider tidak mengembalikan teks jawaban yang valid.");
  return answer.trim();
}
function parsePlan(text, agents) {
  const raw = text.replace(/^\s*```(?:json)?/i, "").replace(/```\s*$/i, "").trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("AI Manager tidak mengembalikan rencana JSON yang valid. Coba ulangi instruksi lebih spesifik.");
  const parsed = JSON.parse(raw.slice(start, end + 1));
  if (!Array.isArray(parsed.tasks) || parsed.tasks.length < 1 || parsed.tasks.length > 5) throw new Error("Rencana harus berisi 1 sampai 5 tugas.");
  const known = new Map(agents.map(agent => [agent.id, agent]));
  return parsed.tasks.map(item => {
    const agent = known.get(String(item.agentId || ""));
    if (!agent) throw new Error("AI Manager memilih Agent yang tidak terdaftar. Rencana dibatalkan.");
    return { id: randomUUID(), title: clean(item.title, 240), agentId: agent.id, agentName: agent.name };
  });
}

export async function GET() {
  const config = providerConfig();
  return Response.json({ runtime: safeStatus(config), agents: await readAgents().catch(() => []) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request) {
  let payload;
  try { payload = await request.json(); } catch { return Response.json({ error: "JSON tidak valid." }, { status: 400 }); }
  const config = providerConfig();
  const status = safeStatus(config);
  if (!status.configured) return Response.json({ error: status.message, runtime: status }, { status: 503 });
  try {
    const agents = await readAgents();
    if (!agents.length) throw new Error("Belum ada Agent di organisasi.");
    const userText = clean(payload.message);
    const sessions = await readJson(sessionsFile, { conversations: [], dispatches: [] });
    const now = new Date().toISOString();

    if (payload.action === "chat") {
      const agent = agents.find(item => item.id === payload.agentId);
      if (!agent) throw new Error("Agent yang dipilih tidak ditemukan.");
      const conversationId = String(payload.conversationId || randomUUID());
      const previous = sessions.conversations.find(item => item.id === conversationId && item.agentId === agent.id);
      const history = (previous?.messages || []).slice(-16).map(item => ({ role: item.role, content: item.content }));
      const answer = await callModel([{ role: "system", content: agentPrompt(agent) }, ...history, { role: "user", content: userText }], config);
      const conversation = previous || { id: conversationId, agentId: agent.id, agentName: agent.name, messages: [], createdAt: now };
      conversation.messages.push({ role: "user", content: userText, createdAt: now }, { role: "assistant", content: answer, createdAt: new Date().toISOString() });
      conversation.updatedAt = new Date().toISOString();
      if (!previous) sessions.conversations.unshift(conversation);
      sessions.conversations = sessions.conversations.slice(0, 100);
      await saveJson(sessionsFile, sessions);
      return Response.json({ conversationId, agent: { id: agent.id, name: agent.name }, answer, runtime: safeStatus(config) });
    }

    if (payload.action === "agent-run") {
      const agent = agents.find(item => item.id === payload.agentId);
      if (!agent) throw new Error("Agent yang dipilih tidak ditemukan.");
      const allowedTools = TOOL_DEFINITIONS;
      const system = [
        agentPrompt(agent),
        "Kamu bekerja dalam workspace terbatas MEX-NEX. Kamu boleh memakai tool berikut untuk menyelesaikan tugas.",
        "Panggil maksimal 5 tool secara berurutan. Balas dengan HANYA JSON: {\"tool\":\"nama.tool\",\"arguments\":{...}} untuk pemanggilan tool, atau {\"final\":\"jawaban akhir\"} jika selesai.",
        "Tool yang tersedia: " + JSON.stringify(allowedTools),
        "Jangan mengarang hasil tool. Jangan mencoba akses path di luar workspace."
      ].join("\n");
      const transcript = [{ role: "system", content: system }, { role: "user", content: userText }];
      const toolResults = [];
      let answer = "";
      for (let step=0; step<6; step++) {
        const output = await callModel(transcript, config);
        let instruction;
        try {
          const raw=output.replace(/^\s*```(?:json)?/i,"").replace(/```\s*$/i,"").trim();
          instruction=JSON.parse(raw.slice(raw.indexOf("{"),raw.lastIndexOf("}")+1));
        } catch { answer=output; break; }
        if (typeof instruction.final === "string") { answer=instruction.final; break; }
        if (typeof instruction.tool !== "string" || !allowedTools.some(tool=>tool.name===instruction.tool)) throw new Error("Agent meminta tool yang tidak tersedia. Eksekusi dihentikan.");
        const result=await executeTool(instruction.tool,instruction.arguments||{});
        toolResults.push({tool:instruction.tool,result});
        transcript.push({role:"assistant",content:output},{role:"user",content:"Hasil tool "+instruction.tool+": "+JSON.stringify(result)+"\nLanjutkan pekerjaan. Jika sudah selesai, berikan JSON {\"final\":\"...\"}."});
        if(step===5) answer="Batas lima pemanggilan tool tercapai. Hasil tool: "+JSON.stringify(toolResults);
      }
      if(!answer) answer="Agent menyelesaikan pemanggilan tool.";
      return Response.json({agent:{id:agent.id,name:agent.name},answer,toolResults,runtime:safeStatus(config)});
    }

    if (payload.action === "dispatch") {
      const manager = agents.find(agent => agent.role.toLowerCase().includes("manager") || agent.role.toLowerCase().includes("director")) || agents[0];
      const roster = agents.map(agent => ({ id: agent.id, name: agent.name, role: agent.role, department: agent.departmentName, description: agent.description }));
      const plannerPrompt = [
        "Kamu adalah " + manager.name + ", AI Operations Manager di MEX-NEX.",
        "Bagi instruksi pengguna menjadi 1 sampai 5 pekerjaan yang bisa dikerjakan oleh Agent yang tersedia.",
        "Pilih agentId hanya dari daftar yang diberikan. Jangan membuat Agent baru.",
        "Kembalikan HANYA JSON valid dengan format: {\"summary\":\"ringkasan\",\"tasks\":[{\"title\":\"pekerjaan spesifik\",\"agentId\":\"ID_AGENT\"}]}",
        "Tidak ada tool eksekusi eksternal. Agent hanya dapat menghasilkan jawaban berbasis model."
      ].join("\n");
      const planText = await callModel([
        { role: "system", content: plannerPrompt },
        { role: "user", content: "Daftar Agent:\n" + JSON.stringify(roster) + "\n\nInstruksi kantor:\n" + userText }
      ], config);
      const plannedTasks = parsePlan(planText, agents);
      const results = [];
      for (const task of plannedTasks) {
        const agent = agents.find(item => item.id === task.agentId);
        const answer = await callModel([
          { role: "system", content: agentPrompt(agent) },
          { role: "user", content: "Kamu menerima tugas dari AI Manager. Judul tugas: " + task.title + "\nInstruksi utama pengguna: " + userText + "\nBerikan hasil pekerjaan yang bisa ditinjau QA." }
        ], config);
        results.push({ ...task, answer, status: "completed", completedAt: new Date().toISOString() });
      }
      const run = { id: randomUUID(), instruction: userText, manager: manager.name, summary: "Rencana dibuat dan " + results.length + " Agent menyelesaikan respons berbasis AI.", tasks: results, createdAt: now, status: "completed" };
      sessions.dispatches.unshift(run);
      sessions.dispatches = sessions.dispatches.slice(0, 50);
      await saveJson(sessionsFile, sessions);
      return Response.json({ run, runtime: safeStatus(config) });
    }
    throw new Error("Aksi runtime tidak dikenal.");
  } catch (error) {
    const message = error.name === "TimeoutError" ? "Permintaan ke AI melewati batas waktu. Coba lagi." : (error.message || "Runtime AI gagal.");
    return Response.json({ error: message }, { status: 502 });
  }
}
