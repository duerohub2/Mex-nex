import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dataDirectory = path.resolve(process.cwd(), process.env.MEX_NEX_DATA_DIR || ".data");
const dataFile = path.join(dataDirectory, "office.json");

const seed = {
  version: 1,
  departments: [
    { id: "management", name: "Management", icon: "◈", description: "Koordinasi dan arah operasional kantor." },
    { id: "research", name: "Research", icon: "⌕", description: "Riset, analisis, dan pengumpulan informasi." },
    { id: "development", name: "Development", icon: "⌘", description: "Pengembangan produk dan teknologi." },
    { id: "creative", name: "Creative", icon: "✳", description: "Ide, desain, dan produksi konten." },
    { id: "quality", name: "Quality Assurance", icon: "✓", description: "Pemeriksaan dan validasi hasil pekerjaan." }
  ],
  agents: [
    { id: "manager-01", name: "Nexa", role: "AI Operations Manager", departmentId: "management", departmentName: "Management", avatar: "N", status: "Siap", description: "Koordinator operasional kantor. Integrasi AI menyusul." },
    { id: "research-01", name: "Aria", role: "Research Analyst", departmentId: "research", departmentName: "Research", avatar: "A", status: "Siap", description: "Spesialis riset dan analisis informasi." },
    { id: "dev-01", name: "Dex", role: "Software Developer", departmentId: "development", departmentName: "Development", avatar: "D", status: "Siap", description: "Spesialis pengembangan dan pemecahan masalah teknis." },
    { id: "creative-01", name: "Mika", role: "Creative Strategist", departmentId: "creative", departmentName: "Creative", avatar: "M", status: "Siap", description: "Spesialis konsep kreatif dan komunikasi visual." },
    { id: "qa-01", name: "Quinn", role: "QA Specialist", departmentId: "quality", departmentName: "Quality Assurance", avatar: "Q", status: "Siap", description: "Spesialis pemeriksaan kualitas hasil pekerjaan." }
  ],
  tasks: [],
  messages: [],
  activity: []
};

let writeQueue = Promise.resolve();

async function readState() {
  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw);
    return { ...seed, ...parsed };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await persist(seed);
    return seed;
  }
}

async function persist(state) {
  await mkdir(dataDirectory, { recursive: true });
  const temporaryFile = dataFile + ".tmp";
  await writeFile(temporaryFile, JSON.stringify(state, null, 2) + "\n", "utf8");
  await rename(temporaryFile, dataFile);
}

export async function GET() {
  try {
    return Response.json(await readState(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Gagal membaca penyimpanan kantor." }, { status: 500 });
  }
}

export async function POST(request) {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 16_000) return Response.json({ error: "Permintaan terlalu besar." }, { status: 413 });

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Format JSON tidak valid." }, { status: 400 });
  }

  const operation = async () => {
    const state = await readState();
    const now = new Date().toISOString();

    if (payload.action === "message") {
      const text = String(payload.text || "").trim();
      if (!text || text.length > 4000) throw new Error("Instruksi harus berisi 1–4.000 karakter.");
      state.messages.push({ id: randomUUID(), text, createdAt: now });
      state.activity.unshift({ id: randomUUID(), type: "message", description: "Instruksi baru disimpan", createdAt: now });
    } else if (payload.action === "add-task") {
      const title = String(payload.title || "").trim();
      if (!title || title.length > 240) throw new Error("Judul tugas harus berisi 1–240 karakter.");
      state.tasks.unshift({ id: randomUUID(), title, status: "todo", assignee: null, createdAt: now, updatedAt: now });
      state.activity.unshift({ id: randomUUID(), type: "task", description: "Tugas baru dibuat", createdAt: now });
    } else {
      throw new Error("Aksi tidak dikenal.");
    }

    state.activity = state.activity.slice(0, 100);
    await persist(state);
    return state;
  };

  const result = writeQueue.then(operation, operation);
  writeQueue = result.then(() => undefined, () => undefined);

  try {
    return Response.json(await result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: error.message || "Gagal menyimpan data." }, { status: 400 });
  }
}
