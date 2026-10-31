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
});
