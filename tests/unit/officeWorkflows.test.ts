import { describe, expect, it } from "vitest";
import { normalizeMeeting, normalizeWhiteboard } from "../../app/lib/office-workflows.js";

describe("MEX-NEX office workflow migration", () => {
  it("preserves legacy meeting data and supplies workflow defaults", () => {
    const meeting = normalizeMeeting({ title: "Weekly sync", status: "completed", notes: "Decisions" });
    expect(meeting.type).toBe("sync");
    expect(meeting.phase).toBe("complete");
    expect(meeting.summary).toBe("Decisions");
    expect(meeting.participantAgentIds).toEqual([]);
  });

  it("preserves legacy whiteboard content as an editable note block", () => {
    const board = normalizeWhiteboard({ id: "board-1", title: "Draft", content: "Keep this note" });
    expect(board.mode).toBe("freeform");
    expect(board.blocks).toHaveLength(1);
    expect(board.blocks[0].body).toBe("Keep this note");
  });

  it("does not replace existing structured whiteboard blocks", () => {
    const blocks = [{ id: "b1", type: "decision", body: "Use adapter" }];
    expect(normalizeWhiteboard({ blocks }).blocks).toEqual(blocks);
  });
});
