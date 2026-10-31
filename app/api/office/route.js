import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dataDirectory = path.resolve(process.cwd(), process.env.MEX_NEX_DATA_DIR || ".data");
const dataFile = path.join(dataDirectory, "office.json");

const seed = {
  version: 2,
  departments: [
    { id: "management", name: "Management", icon: "◈", description: "Koordinasi dan arah operasional kantor." },
    { id: "research", name: "Research", icon: "⌕", description: "Riset, analisis, dan pengumpulan informasi." },
    { id: "development", name: "Development", icon: "⌘", description: "Pengembangan produk dan teknologi." },
    { id: "creative", name: "Creative", icon: "✳", description: "Ide, desain, dan produksi konten." },
    { id: "quality", name: "Quality Assurance", icon: "✓", description: "Pemeriksaan dan validasi hasil pekerjaan." }
  ],
  agents: [
    { id: "manager-01", name: "Nexa", role: "AI Operations Manager", departmentId: "management", avatar: "N", status: "Siap", description: "Koordinator operasional dan pembagian pekerjaan.", managerId: null },
    { id: "research-01", name: "Aria", role: "Research Analyst", departmentId: "research", avatar: "A", status: "Siap", description: "Riset dan analisis informasi.", managerId: "manager-01" },
    { id: "dev-01", name: "Dex", role: "Software Developer", departmentId: "development", avatar: "D", status: "Siap", description: "Pengembangan dan pemecahan masalah teknis.", managerId: "manager-01" },
    { id: "creative-01", name: "Mika", role: "Creative Strategist", departmentId: "creative", avatar: "M", status: "Siap", description: "Konsep kreatif dan komunikasi visual.", managerId: "manager-01" },
    { id: "qa-01", name: "Quinn", role: "QA Specialist", departmentId: "quality", avatar: "Q", status: "Siap", description: "Pemeriksaan kualitas hasil pekerjaan.", managerId: "manager-01" }
  ],
  tasks: [], messages: [], activity: [], meetings: [], whiteboards: [], bulletins: [], qaReviews: []
};

let writeQueue = Promise.resolve();

function normalize(state) {
  const merged = { ...seed, ...state };
  merged.departments = Array.isArray(merged.departments) ? merged.departments : [];
  merged.agents = Array.isArray(merged.agents) ? merged.agents : [];
  merged.tasks = Array.isArray(merged.tasks) ? merged.tasks : [];
  merged.messages = Array.isArray(merged.messages) ? merged.messages : [];
  merged.activity = Array.isArray(merged.activity) ? merged.activity : [];
  for (const key of ["meetings", "whiteboards", "bulletins", "qaReviews"]) merged[key] = Array.isArray(merged[key]) ? merged[key] : [];
  merged.agents = merged.agents.map(agent => ({
    ...agent, managerId: agent.managerId || null,
    departmentName: merged.departments.find(d => d.id === agent.departmentId)?.name || agent.departmentName || "Tanpa departemen",
    managerName: merged.agents.find(a => a.id === agent.managerId)?.name || null
  }));
  merged.tasks = merged.tasks.map(task => ({
    ...task, status: ["todo", "in_progress", "done"].includes(task.status) ? task.status : "todo",
    assigneeId: task.assigneeId || null,
    assigneeName: merged.agents.find(a => a.id === task.assigneeId)?.name || task.assignee || null
  }));
  merged.version = 2;
  return merged;
}

async function readState() {
  try { return normalize(JSON.parse(await readFile(dataFile, "utf8"))); }
  catch (error) {
    if (error.code !== "ENOENT") throw error;
    const initial = normalize(seed);
    await persist(initial);
    return initial;
  }
}

async function persist(state) {
  await mkdir(dataDirectory, { recursive: true });
  const temp = dataFile + ".tmp";
  await writeFile(temp, JSON.stringify(state, null, 2) + "\n", "utf8");
  await rename(temp, dataFile);
}

function record(state, type, description, now) {
  state.activity.unshift({ id: randomUUID(), type, description, createdAt: now });
  state.activity = state.activity.slice(0, 200);
}

function clean(value, max, label, required = true) {
  const result = String(value ?? "").trim();
  if (required && !result) throw new Error(label + " wajib diisi.");
  if (result.length > max) throw new Error(label + " maksimal " + max + " karakter.");
  return result;
}

export async function GET() {
  try { return Response.json(await readState(), { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ error: "Gagal membaca penyimpanan kantor." }, { status: 500 }); }
}

export async function POST(request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 16000) return Response.json({ error: "Permintaan terlalu besar." }, { status: 413 });
  let payload;
  try { payload = await request.json(); }
  catch { return Response.json({ error: "Format JSON tidak valid." }, { status: 400 }); }

  const operation = async () => {
    const state = await readState();
    const now = new Date().toISOString();
    switch (payload.action) {
      case "message": {
        const text = clean(payload.text, 4000, "Instruksi");
        state.messages.push({ id: randomUUID(), text, createdAt: now });
        record(state, "message", "Instruksi baru disimpan", now);
        break;
      }
      case "add-task": {
        const title = clean(payload.title, 240, "Judul tugas");
        const assigneeId = payload.assigneeId || null;
        const assignee = assigneeId ? state.agents.find(a => a.id === assigneeId) : null;
        if (assigneeId && !assignee) throw new Error("Agent yang dipilih tidak ditemukan.");
        state.tasks.unshift({ id: randomUUID(), title, status: "todo", assigneeId, assignee: assignee?.name || null, createdAt: now, updatedAt: now });
        record(state, "task", "Tugas dibuat: " + title, now);
        break;
      }
      case "create-agent": {
        const name = clean(payload.name, 60, "Nama Agent");
        const role = clean(payload.role, 80, "Jabatan");
        const department = state.departments.find(d => d.id === payload.departmentId);
        if (!department) throw new Error("Departemen tidak valid.");
        const managerId = payload.managerId || null;
        if (managerId && !state.agents.some(a => a.id === managerId)) throw new Error("Atasan tidak ditemukan.");
        const id = randomUUID();
        state.agents.push({ id, name, role, departmentId: department.id, departmentName: department.name, managerId, managerName: state.agents.find(a => a.id === managerId)?.name || null, avatar: name.slice(0,1).toUpperCase(), status: "Siap", description: clean(payload.description, 500, "Deskripsi", false) });
        record(state, "agent", "Agent baru ditambahkan: " + name, now);
        break;
      }
      case "create-department": {
        const name = clean(payload.name, 80, "Nama departemen");
        if (state.departments.some(d => d.name.toLowerCase() === name.toLowerCase())) throw new Error("Nama departemen sudah digunakan.");
        const description = clean(payload.description, 500, "Deskripsi", false);
        state.departments.push({ id: randomUUID(), name, icon: "▦", description });
        record(state, "department", "Departemen baru dibuat: " + name, now);
        break;
      }
      case "assign-task": {
        const task = state.tasks.find(t => t.id === payload.taskId);
        const agent = state.agents.find(a => a.id === payload.agentId);
        if (!task || !agent) throw new Error("Tugas atau Agent tidak ditemukan.");
        task.assigneeId = agent.id; task.assignee = agent.name; task.updatedAt = now;
        record(state, "delegation", "Tugas didelegasikan kepada " + agent.name, now);
        break;
      }
      case "task-status": {
        const task = state.tasks.find(t => t.id === payload.taskId);
        if (!task) throw new Error("Tugas tidak ditemukan.");
        if (!["todo", "in_progress", "done"].includes(payload.status)) throw new Error("Status tugas tidak valid.");
        task.status = payload.status; task.updatedAt = now;
        record(state, "task-status", "Status tugas diperbarui: " + task.title, now);
        break;
      }
      case "meeting-create": {
        const title = clean(payload.title, 120, "Judul meeting");
        const agenda = clean(payload.agenda, 3000, "Agenda", false);
        const scheduledAt = clean(payload.scheduledAt, 40, "Waktu meeting", false);
        state.meetings.unshift({ id: randomUUID(), title, agenda, scheduledAt, notes: "", status: "scheduled", createdAt: now, updatedAt: now });
        record(state, "meeting", "Meeting dibuat: " + title, now); break;
      }
      case "meeting-update": {
        const item = state.meetings.find(x => x.id === payload.meetingId);
        if (!item) throw new Error("Meeting tidak ditemukan.");
        if (payload.notes !== undefined) item.notes = clean(payload.notes, 5000, "Catatan meeting", false);
        if (payload.status !== undefined) { if (!["scheduled", "completed", "cancelled"].includes(payload.status)) throw new Error("Status meeting tidak valid."); item.status = payload.status; }
        item.updatedAt = now; record(state, "meeting-update", "Meeting diperbarui: " + item.title, now); break;
      }
      case "whiteboard-create": {
        const title = clean(payload.title, 120, "Judul whiteboard");
        const content = clean(payload.content, 8000, "Isi whiteboard", false);
        state.whiteboards.unshift({ id: randomUUID(), title, content, createdAt: now, updatedAt: now });
        record(state, "whiteboard", "Whiteboard dibuat: " + title, now); break;
      }
      case "whiteboard-update": {
        const item = state.whiteboards.find(x => x.id === payload.boardId);
        if (!item) throw new Error("Whiteboard tidak ditemukan.");
        item.content = clean(payload.content, 8000, "Isi whiteboard", false); item.updatedAt = now;
        record(state, "whiteboard-update", "Whiteboard diperbarui: " + item.title, now); break;
      }
      case "bulletin-create": {
        const title = clean(payload.title, 120, "Judul pengumuman");
        const body = clean(payload.body, 4000, "Isi pengumuman");
        const category = clean(payload.category, 40, "Kategori", false) || "Umum";
        state.bulletins.unshift({ id: randomUUID(), title, body, category, createdAt: now });
        record(state, "bulletin", "Pengumuman diterbitkan: " + title, now); break;
      }
      case "qa-create": {
        const title = clean(payload.title, 160, "Judul pemeriksaan");
        const detail = clean(payload.detail, 4000, "Detail pemeriksaan");
        const priority = ["low", "medium", "high"].includes(payload.priority) ? payload.priority : "medium";
        state.qaReviews.unshift({ id: randomUUID(), title, detail, priority, status: "open", createdAt: now, updatedAt: now });
        record(state, "qa", "Pemeriksaan QA dibuat: " + title, now); break;
      }
      case "qa-update": {
        const item = state.qaReviews.find(x => x.id === payload.reviewId);
        if (!item) throw new Error("Pemeriksaan QA tidak ditemukan.");
        if (!["open", "in_review", "passed", "failed"].includes(payload.status)) throw new Error("Status QA tidak valid.");
        item.status = payload.status; item.updatedAt = now;
        record(state, "qa-update", "Status QA diperbarui: " + item.title + " → " + payload.status, now); break;
      }
      default: throw new Error("Aksi tidak dikenal.");
    }
    await persist(state);
    return normalize(state);
  };

  const result = writeQueue.then(operation, operation);
  writeQueue = result.then(() => undefined, () => undefined);
  try { return Response.json(await result, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return Response.json({ error: error.message || "Gagal menyimpan data." }, { status: 400 }); }
}
