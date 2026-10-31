export const QA_STATUSES = [
  "queued",
  "in_review",
  "changes_requested",
  "blocked",
  "approved",
  "failed",
  "verified",
];

export const QA_SEVERITIES = ["low", "medium", "high", "critical"];

export function normalizeQaReview(item = {}) {
  const legacyStatus = item.status === "open" ? "queued" : item.status === "passed" ? "verified" : item.status;
  const status = QA_STATUSES.includes(legacyStatus) ? legacyStatus : "queued";
  const legacyPriority = QA_SEVERITIES.includes(item.priority) ? item.priority : "medium";

  return {
    ...item,
    status,
    priority: legacyPriority,
    linkedTaskId: item.linkedTaskId || null,
    assignedReviewerAgentId: item.assignedReviewerAgentId || null,
    summary: item.summary || item.detail || "",
    issues: Array.isArray(item.issues)
      ? item.issues.map((issue) => ({
          ...issue,
          severity: QA_SEVERITIES.includes(issue.severity) ? issue.severity : "medium",
          resolved: Boolean(issue.resolved),
        }))
      : [],
  };
}

export function getQaReadiness(reviews = []) {
  const normalized = reviews.map(normalizeQaReview);
  const hasBlocker = normalized.some((review) =>
    ["blocked", "failed"].includes(review.status) ||
    review.issues.some((issue) => !issue.resolved && ["high", "critical"].includes(issue.severity))
  );
  if (hasBlocker) return "red";

  const needsAttention = normalized.some((review) =>
    ["queued", "in_review", "changes_requested"].includes(review.status) ||
    review.issues.some((issue) => !issue.resolved)
  );
  return needsAttention ? "yellow" : "green";
}
