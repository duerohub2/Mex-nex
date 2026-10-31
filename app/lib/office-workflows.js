export const MEETING_TYPES = ["standup", "planning", "review", "incident", "sync"];
export const MEETING_STATUSES = ["scheduled", "gathering", "in_progress", "decision", "completed", "cancelled", "archived"];

export function normalizeMeeting(meeting = {}) {
  const type = MEETING_TYPES.includes(meeting.type) ? meeting.type : "sync";
  const status = MEETING_STATUSES.includes(meeting.status) ? meeting.status : "scheduled";
  return {
    ...meeting,
    type,
    status,
    phase: status === "completed" ? "complete" : status,
    participantAgentIds: Array.isArray(meeting.participantAgentIds) ? meeting.participantAgentIds : [],
    arrivedAgentIds: Array.isArray(meeting.arrivedAgentIds) ? meeting.arrivedAgentIds : [],
    blockers: Array.isArray(meeting.blockers) ? meeting.blockers : [],
    decisions: Array.isArray(meeting.decisions) ? meeting.decisions : [],
    actionItems: Array.isArray(meeting.actionItems) ? meeting.actionItems : [],
    summary: meeting.summary || meeting.notes || "",
  };
}

export function normalizeWhiteboard(board = {}) {
  const blocks = Array.isArray(board.blocks)
    ? board.blocks
    : board.content
      ? [{ id: board.id + "-legacy-note", type: "note", title: "Catatan", body: board.content, createdAt: board.createdAt || new Date(0).toISOString(), updatedAt: board.updatedAt || board.createdAt || new Date(0).toISOString(), authorType: "human" }]
      : [];
  return {
    ...board,
    mode: ["planning", "meeting", "architecture", "org", "freeform"].includes(board.mode) ? board.mode : "freeform",
    archived: Boolean(board.archived),
    blocks,
  };
}
