import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { getQaReadiness, normalizeQaReview, QA_STATUSES, QA_SEVERITIES } from "../../lib/qa.js";
import { normalizeMeeting, normalizeWhiteboard, MEETING_TYPES, MEETING_STATUSES } from "../../lib/office-workflows.js";

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
  merged.meetings = merged.meetings.map(normalizeMeeting);
  merged.whiteboards = merged.whiteboards.map(normalizeWhiteboard);
  merged.qaReviews = merged.qaReviews.map(normalizeQaReview);
  merged.qaReadiness = getQaReadiness(merged.qaReviews);
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

function syncMeetingOutputs(state, meeting, now) {
  const notes = clean(meeting.notes, 5000, "Catatan meeting", false);
  const actions = meeting.actionItems.map(item => item.text);
  const content = [
    "Agenda",
    meeting.agenda || "Tidak ada agenda",
    "",
    "Catatan dan keputusan",
    notes || "Belum ada catatan",
    "",
    "Tindak lanjut",
    actions.length ? actions.map(item => "- " + item).join("\n") : "Belum ada tindak lanjut",
  ].join("\n");

  let board = state.whiteboards.find(item => item.sourceMeetingId === meeting.id);
  if (!board) {
    board = {
      id: randomUUID(),
      sourceMeetingId: meeting.id,
      title: "Hasil Meeting · " + meeting.title,
      mode: "meeting",
      content,
      blocks: [
        { id: randomUUID(), type: "heading", title: "Agenda", body: meeting.agenda || "", createdAt: now, updatedAt: now, authorType: "system" },
        { id: randomUUID(), type: "note", title: "Catatan dan keputusan", body: notes, createdAt: now, updatedAt: now, authorType: "system" },
        ...meeting.actionItems.map(item => ({ id: randomUUID(), type: "action", title: item.text, body: "", linkedTaskId: item.linkedTaskId || null, createdAt: now, updatedAt: now, authorType: "system" })),
      ],
      createdAt: now,
      updatedAt: now,
      archived: false,
    };
    state.whiteboards.unshift(board);
  } else {
    board.content = content;
    board.updatedAt = now;
    const systemNotes = board.blocks.find(block => block.title === "Catatan dan keputusan" && block.authorType === "system");
    if (systemNotes) { systemNotes.body = notes; systemNotes.updatedAt = now; }
    board.blocks = board.blocks.filter(block => !(block.type === "action" && block.authorType === "system"));
    board.blocks.push(...meeting.actionItems.map(item => ({ id: randomUUID(), type: "action", title: item.text, body: "", linkedTaskId: item.linkedTaskId || null, createdAt: now, updatedAt: now, authorType: "system" })));
  }

  const cardBody = [meeting.agenda, notes, actions.length ? "Tindak lanjut:\n" + actions.map(item => "- " + item).join("\n") : ""].filter(Boolean).join("\n\n");
  const card = state.bulletins.find(item => item.sourceMeetingId === meeting.id);
  if (card) {
    card.body = cardBody;
    card.category = "Meeting";
    card.type = "meeting_note";
    card.updatedAt = now;
    card.archived = false;
  } else {
    state.bulletins.unshift({ id: randomUUID(), sourceMeetingId: meeting.id, title: "Hasil meeting: " + meeting.title, body: cardBody, category: "Meeting", type: "meeting_note", priority: "normal", pinned: false, createdAt: now, updatedAt: now, archived: false });
  }
}

function syncQaBulletin(state, review, now) {
  const unresolved = review.issues.filter(issue => !issue.resolved);
  const blocked = ["blocked", "failed"].includes(review.status) || unresolved.some(issue => ["high", "critical"].includes(issue.severity));
  const changesNeeded = review.status === "changes_requested";
  const existing = state.bulletins.find(card => card.sourceQaReviewId === review.id);
  if (!blocked && !changesNeeded) {
    if (existing) { existing.archived = true; existing.updatedAt = now; }
    return;
  }
  const category = blocked ? "QA · Blocker" : "QA · Handoff";
  const issueText = unresolved.map(issue => "- " + issue.title + " (" + issue.severity + ")").join("\n");
  const body = [review.summary || review.title, issueText].filter(Boolean).join("\n\n");
  if (existing) {
    existing.title = review.title;
    existing.body = body;
    existing.category = category;
    existing.type = blocked ? "blocker" : "handoff";
    existing.priority = blocked ? "high" : "normal";
    existing.pinned = blocked;
    existing.archived = false;
    existing.updatedAt = now;
  } else {
    state.bulletins.unshift({ id: randomUUID(), sourceQaReviewId: review.id, title: review.title, body, category, type: blocked ? "blocker" : "handoff", priority: blocked ? "high" : "normal", pinned: blocked, createdAt: now, updatedAt: now, archived: false });
  }
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
        const type = MEETING_TYPES.includes(payload.type) ? payload.type : "sync";
        const participantAgentIds = Array.isArray(payload.participantAgentIds) ? [...new Set(payload.participantAgentIds)] : [];
        if (participantAgentIds.some(id => !state.agents.some(agent => agent.id === id))) throw new Error("Daftar peserta meeting berisi Agent yang tidak ditemukan.");
        state.meetings.unshift(normalizeMeeting({ id: randomUUID(), title, type, agenda, scheduledAt, notes: "", status: "scheduled", participantAgentIds, arrivedAgentIds: [], blockers: [], decisions: [], actionItems: [], createdAt: now, updatedAt: now }));
        record(state, "meeting", "Meeting dibuat: " + title, now);
        break;
      }
      case "meeting-update": {
        const item = state.meetings.find(x => x.id === payload.meetingId);
        if (!item) throw new Error("Meeting tidak ditemukan.");
        if (payload.notes !== undefined) item.notes = clean(payload.notes, 5000, "Catatan meeting", false);
        if (payload.summary !== undefined) item.summary = clean(payload.summary, 4000, "Ringkasan meeting", false);
        if (payload.actionItems !== undefined) {
          if (!Array.isArray(payload.actionItems) || payload.actionItems.length > 30) throw new Error("Daftar tindak lanjut meeting tidak valid.");
          item.actionItems = payload.actionItems.map(text => ({ id: randomUUID(), text: clean(text, 240, "Tindak lanjut"), status: "open", linkedTaskId: null }));
        }
        if (payload.status !== undefined) {
          if (!MEETING_STATUSES.includes(payload.status)) throw new Error("Status meeting tidak valid.");
          item.status = payload.status;
          item.phase = payload.status === "completed" ? "complete" : payload.status;
        }
        item.updatedAt = now;
        if (item.status === "completed") syncMeetingOutputs(state, item, now);
        record(state, "meeting-update", "Meeting diperbarui: " + item.title, now);
        break;
      }
      case "whiteboard-create": {
        const title = clean(payload.title, 120, "Judul whiteboard");
        const mode = ["planning", "meeting", "architecture", "org", "freeform"].includes(payload.mode) ? payload.mode : "freeform";
        const content = clean(payload.content, 8000, "Isi whiteboard", false);
        const templateSections = {
          meeting: ["Peserta", "Agenda", "Keputusan", "Hambatan", "Tindak lanjut"],
          planning: ["Masalah", "Pilihan solusi", "Risiko", "Arah terpilih", "Tugas"],
          architecture: ["Tujuan sistem", "Komponen", "Alur data", "Integrasi", "Risiko teknis"],
          org: ["Tujuan tim", "Departemen", "Peran", "Tanggung jawab", "Handoff"],
        };
        const blocks = (templateSections[mode] || []).map(section => ({ id: randomUUID(), type: "heading", title: section, body: "", createdAt: now, updatedAt: now, authorType: "system" }));
        if (content) blocks.push({ id: randomUUID(), type: "note", title: "Catatan awal", body: content, createdAt: now, updatedAt: now, authorType: "human" });
        state.whiteboards.unshift({ id: randomUUID(), title, mode, content, blocks, archived: false, createdAt: now, updatedAt: now });
        record(state, "whiteboard", "Whiteboard dibuat: " + title, now);
        break;
      }
      case "whiteboard-update": {
        const item = state.whiteboards.find(x => x.id === payload.boardId);
        if (!item) throw new Error("Whiteboard tidak ditemukan.");
        item.content = clean(payload.content, 8000, "Isi whiteboard", false);
        item.blocks = [{ id: randomUUID(), type: "note", title: "Catatan", body: item.content, createdAt: now, updatedAt: now, authorType: "human" }];
        item.updatedAt = now;
        record(state, "whiteboard-update", "Whiteboard diperbarui: " + item.title, now);
        break;
      }
      case "whiteboard-add-block": {
        const item = state.whiteboards.find(x => x.id === payload.boardId);
        if (!item) throw new Error("Whiteboard tidak ditemukan.");
        if (item.archived) throw new Error("Whiteboard yang diarsipkan tidak dapat diubah.");
        const type = ["heading", "note", "decision", "question", "action", "group"].includes(payload.type) ? payload.type : "note";
        const title = clean(payload.title, 160, "Judul blok", false);
        const body = clean(payload.body, 4000, "Isi blok", false);
        if (!title && !body) throw new Error("Judul atau isi blok wajib diisi.");
        item.blocks.push({ id: randomUUID(), type, title, body, createdAt: now, updatedAt: now, authorType: "human" });
        item.updatedAt = now;
        record(state, "whiteboard-block", "Blok ditambahkan ke: " + item.title, now);
        break;
      }
      case "whiteboard-update-block": {
        const item = state.whiteboards.find(x => x.id === payload.boardId);
        const block = item?.blocks.find(x => x.id === payload.blockId);
        if (!item || !block) throw new Error("Blok whiteboard tidak ditemukan.");
        if (item.archived) throw new Error("Whiteboard yang diarsipkan tidak dapat diubah.");
        if (payload.title !== undefined) block.title = clean(payload.title, 160, "Judul blok", false);
        if (payload.body !== undefined) block.body = clean(payload.body, 4000, "Isi blok", false);
        if (payload.type !== undefined && ["heading", "note", "decision", "question", "action", "group"].includes(payload.type)) block.type = payload.type;
        block.updatedAt = now;
        item.updatedAt = now;
        record(state, "whiteboard-block-update", "Blok whiteboard diperbarui: " + item.title, now);
        break;
      }
      case "whiteboard-delete-block": {
        const item = state.whiteboards.find(x => x.id === payload.boardId);
        if (!item || !item.blocks.some(x => x.id === payload.blockId)) throw new Error("Blok whiteboard tidak ditemukan.");
        if (item.archived) throw new Error("Whiteboard yang diarsipkan tidak dapat diubah.");
        item.blocks = item.blocks.filter(x => x.id !== payload.blockId);
        item.updatedAt = now;
        record(state, "whiteboard-block-delete", "Blok dihapus dari: " + item.title, now);
        break;
      }
      case "whiteboard-archive": {
        const item = state.whiteboards.find(x => x.id === payload.boardId);
        if (!item) throw new Error("Whiteboard tidak ditemukan.");
        item.archived = payload.archived !== false;
        item.updatedAt = now;
        record(state, "whiteboard-archive", (item.archived ? "Whiteboard diarsipkan: " : "Whiteboard dibuka kembali: ") + item.title, now);
        break;
      }
      case "whiteboard-duplicate": {
        const source = state.whiteboards.find(x => x.id === payload.boardId);
        if (!source) throw new Error("Whiteboard tidak ditemukan.");
        const copy = { ...source, id: randomUUID(), sourceMeetingId: null, title: source.title + " (Salinan)", archived: false, createdAt: now, updatedAt: now, blocks: source.blocks.map(block => ({ ...block, id: randomUUID(), createdAt: now, updatedAt: now })) };
        state.whiteboards.unshift(copy);
        record(state, "whiteboard-duplicate", "Whiteboard disalin: " + source.title, now);
        break;
      }
      case "bulletin-create": {
        const title = clean(payload.title, 120, "Judul pengumuman");
        const body = clean(payload.body, 4000, "Isi pengumuman");
        const category = clean(payload.category, 40, "Kategori", false) || "Umum";
        const type = ["goal", "announcement", "blocker", "handoff", "meeting_note"].includes(payload.type) ? payload.type : "announcement";
        const priority = ["low", "normal", "high"].includes(payload.priority) ? payload.priority : "normal";
        const taskId = payload.taskId || null;
        const agentId = payload.agentId || null;
        if (taskId && !state.tasks.some(task => task.id === taskId)) throw new Error("Tugas yang ditautkan tidak ditemukan.");
        if (agentId && !state.agents.some(agent => agent.id === agentId)) throw new Error("Agent yang ditautkan tidak ditemukan.");
        state.bulletins.unshift({ id: randomUUID(), title, body, category, type, priority, taskId, agentId, authorType: "human", pinned: false, archived: false, createdAt: now, updatedAt: now });
        record(state, "bulletin", "Pengumuman diterbitkan: " + title, now);
        break;
      }
      case "bulletin-update": {
        const item = state.bulletins.find(x => x.id === payload.cardId);
        if (!item) throw new Error("Kartu bulletin tidak ditemukan.");
        if (payload.title !== undefined) item.title = clean(payload.title, 120, "Judul kartu");
        if (payload.body !== undefined) item.body = clean(payload.body, 4000, "Isi kartu");
        if (payload.category !== undefined) item.category = clean(payload.category, 40, "Kategori", false) || "Umum";
        if (payload.priority !== undefined) {
          if (!["low", "normal", "high"].includes(payload.priority)) throw new Error("Prioritas bulletin tidak valid.");
          item.priority = payload.priority;
        }
        item.updatedAt = now;
        record(state, "bulletin-update", "Kartu bulletin diperbarui: " + item.title, now);
        break;
      }
      case "bulletin-pin": {
        const item = state.bulletins.find(x => x.id === payload.cardId);
        if (!item) throw new Error("Kartu bulletin tidak ditemukan.");
        item.pinned = payload.pinned !== false;
        item.updatedAt = now;
        record(state, "bulletin-pin", (item.pinned ? "Kartu dipasang: " : "Kartu dilepas: ") + item.title, now);
        break;
      }
      case "bulletin-archive": {
        const item = state.bulletins.find(x => x.id === payload.cardId);
        if (!item) throw new Error("Kartu bulletin tidak ditemukan.");
        item.archived = payload.archived !== false;
        item.updatedAt = now;
        record(state, "bulletin-archive", (item.archived ? "Kartu diarsipkan: " : "Kartu dipulihkan: ") + item.title, now);
        break;
      }
      case "qa-create": {
        const title = clean(payload.title, 160, "Judul pemeriksaan");
        const detail = clean(payload.detail, 4000, "Detail pemeriksaan");
        const priority = QA_SEVERITIES.includes(payload.priority) ? payload.priority : "medium";
        const linkedTaskId = payload.linkedTaskId || null;
        if (linkedTaskId && !state.tasks.some(task => task.id === linkedTaskId)) throw new Error("Tugas yang ditautkan tidak ditemukan.");
        const assignedReviewerAgentId = payload.assignedReviewerAgentId || null;
        if (assignedReviewerAgentId && !state.agents.some(agent => agent.id === assignedReviewerAgentId)) throw new Error("Agent QA yang dipilih tidak ditemukan.");
        const item = normalizeQaReview({ id: randomUUID(), title, detail, summary: detail, priority, status: "queued", linkedTaskId, assignedReviewerAgentId, issues: [], createdAt: now, updatedAt: now });
        state.qaReviews.unshift(item);
        record(state, "qa", "Pemeriksaan QA masuk antrean: " + title, now);
        break;
      }
      case "qa-update": {
        const item = state.qaReviews.find(x => x.id === payload.reviewId);
        if (!item) throw new Error("Pemeriksaan QA tidak ditemukan.");
        if (!QA_STATUSES.includes(payload.status)) throw new Error("Status QA tidak valid.");
        item.status = payload.status;
        if (payload.summary !== undefined) item.summary = clean(payload.summary, 4000, "Ringkasan QA", false);
        item.updatedAt = now;
        syncQaBulletin(state, item, now);
        record(state, "qa-update", "Status QA diperbarui: " + item.title + " → " + payload.status, now);
        break;
      }
      case "qa-add-issue": {
        const item = state.qaReviews.find(x => x.id === payload.reviewId);
        if (!item) throw new Error("Pemeriksaan QA tidak ditemukan.");
        const title = clean(payload.title, 160, "Judul temuan");
        const body = clean(payload.body, 2000, "Detail temuan", false);
        const severity = QA_SEVERITIES.includes(payload.severity) ? payload.severity : "medium";
        item.issues.push({ id: randomUUID(), title, body, severity, resolved: false, createdAt: now, updatedAt: now });
        item.updatedAt = now;
        syncQaBulletin(state, item, now);
        record(state, "qa-issue", "Temuan QA ditambahkan: " + title, now);
        break;
      }
      case "qa-resolve-issue": {
        const item = state.qaReviews.find(x => x.id === payload.reviewId);
        const issue = item?.issues.find(x => x.id === payload.issueId);
        if (!item || !issue) throw new Error("Temuan QA tidak ditemukan.");
        issue.resolved = true;
        issue.updatedAt = now;
        item.updatedAt = now;
        syncQaBulletin(state, item, now);
        record(state, "qa-issue-resolved", "Temuan QA diselesaikan: " + issue.title, now);
        break;
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
