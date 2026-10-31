// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

let api;
let dataDirectory;

beforeAll(async () => {
  dataDirectory = await mkdtemp(join(tmpdir(), "mex-nex-stage-five-"));
  process.env.MEX_NEX_DATA_DIR = dataDirectory;
  api = await import("../../app/api/office/route.js");
});

afterAll(async () => {
  await rm(dataDirectory, { recursive: true, force: true });
  delete process.env.MEX_NEX_DATA_DIR;
});

async function post(payload) {
  const response = await api.POST(new Request("http://localhost/api/office", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Office API request failed");
  return body;
}

describe("MEX-NEX Stage 5 office API integration", () => {
  it("publishes meeting outcomes to Whiteboard and Bulletin Board", async () => {
    const created = await post({
      action: "meeting-create",
      title: "Review Tahap 5",
      type: "review",
      agenda: "Memeriksa hasil implementasi",
      participantAgentIds: ["manager-01", "qa-01"],
    });
    const meeting = created.meetings[0];

    const completed = await post({
      action: "meeting-update",
      meetingId: meeting.id,
      status: "completed",
      notes: "Build dan tes berhasil.",
      actionItems: ["Tinjau hasil QA", "Siapkan catatan rilis"],
    });

    const board = completed.whiteboards.find(item => item.sourceMeetingId === meeting.id);
    const bulletin = completed.bulletins.find(item => item.sourceMeetingId === meeting.id);
    expect(board).toBeTruthy();
    expect(board.mode).toBe("meeting");
    expect(board.blocks.some(block => block.type === "action")).toBe(true);
    expect(bulletin.type).toBe("meeting_note");
    expect(bulletin.body).toContain("Build dan tes berhasil.");
  });

  it("links QA to tasks, raises blockers, and clears readiness after verification", async () => {
    const taskState = await post({ action: "add-task", title: "Periksa alur meeting" });
    const task = taskState.tasks[0];
    const qaState = await post({
      action: "qa-create",
      title: "Validasi alur meeting",
      detail: "Pastikan hasil rapat tersimpan.",
      linkedTaskId: task.id,
      assignedReviewerAgentId: "qa-01",
    });
    const review = qaState.qaReviews[0];
    expect(review.status).toBe("queued");
    expect(review.linkedTaskId).toBe(task.id);

    const withIssue = await post({
      action: "qa-add-issue",
      reviewId: review.id,
      title: "Output tidak lengkap",
      body: "Catatan hasil rapat hilang.",
      severity: "critical",
    });
    expect(withIssue.qaReadiness).toBe("red");
    expect(withIssue.bulletins.some(card => card.sourceQaReviewId === review.id && card.type === "blocker" && card.pinned)).toBe(true);

    const resolved = await post({ action: "qa-resolve-issue", reviewId: review.id, issueId: withIssue.qaReviews[0].issues[0].id });
    const verified = await post({ action: "qa-update", reviewId: review.id, status: "verified" });
    expect(resolved.qaReviews[0].issues[0].resolved).toBe(true);
    expect(verified.qaReadiness).toBe("green");
    expect(verified.bulletins.find(card => card.sourceQaReviewId === review.id).archived).toBe(true);
  });
  it("supports structured Whiteboard blocks and Bulletin card lifecycle", async () => {
    const created = await post({ action: "whiteboard-create", title: "Rencana produk", mode: "planning", content: "Tujuan awal" });
    const board = created.whiteboards[0];
    expect(board.blocks.length).toBeGreaterThan(1);

    const added = await post({ action: "whiteboard-add-block", boardId: board.id, type: "decision", title: "Pilihan teknologi", body: "Gunakan adapter modular." });
    const block = added.whiteboards[0].blocks.find(item => item.title === "Pilihan teknologi");
    expect(block).toBeTruthy();

    const updated = await post({ action: "whiteboard-update-block", boardId: board.id, blockId: block.id, body: "Gunakan adapter modular dan teruji." });
    expect(updated.whiteboards[0].blocks.find(item => item.id === block.id).body).toContain("teruji");

    const deleted = await post({ action: "whiteboard-delete-block", boardId: board.id, blockId: block.id });
    expect(deleted.whiteboards[0].blocks.some(item => item.id === block.id)).toBe(false);

    const duplicated = await post({ action: "whiteboard-duplicate", boardId: board.id });
    expect(duplicated.whiteboards[0].title).toContain("Salinan");
    const archived = await post({ action: "whiteboard-archive", boardId: board.id, archived: true });
    expect(archived.whiteboards.find(item => item.id === board.id).archived).toBe(true);

    const bulletin = await post({ action: "bulletin-create", title: "Rilis internal", body: "Rilis menunggu pemeriksaan.", type: "goal", priority: "high" });
    const card = bulletin.bulletins.find(item => item.title === "Rilis internal");
    const pinned = await post({ action: "bulletin-pin", cardId: card.id, pinned: true });
    expect(pinned.bulletins.find(item => item.id === card.id).pinned).toBe(true);
    const bulletinArchived = await post({ action: "bulletin-archive", cardId: card.id, archived: true });
    expect(bulletinArchived.bulletins.find(item => item.id === card.id).archived).toBe(true);
  });

});
