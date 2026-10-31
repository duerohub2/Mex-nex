import { describe, expect, it } from "vitest";
import { getQaReadiness, normalizeQaReview } from "../../app/lib/qa.js";

describe("MEX-NEX QA workflow", () => {
  it("migrates legacy open reviews to queued and preserves details", () => {
    const review = normalizeQaReview({ status: "open", detail: "Periksa hasil build" });
    expect(review.status).toBe("queued");
    expect(review.summary).toBe("Periksa hasil build");
    expect(review.issues).toEqual([]);
  });

  it("reports green when no review is blocking or pending", () => {
    expect(getQaReadiness([{ status: "verified" }, { status: "approved" }])).toBe("green");
    expect(getQaReadiness([])).toBe("green");
  });

  it("reports yellow for pending work and unresolved medium issues", () => {
    expect(getQaReadiness([{ status: "queued" }])).toBe("yellow");
    expect(getQaReadiness([{ status: "verified", issues: [{ severity: "medium", resolved: false }] }])).toBe("yellow");
  });

  it("reports red for blocked or failed reviews", () => {
    expect(getQaReadiness([{ status: "blocked" }])).toBe("red");
    expect(getQaReadiness([{ status: "failed" }])).toBe("red");
  });

  it("reports red for unresolved high or critical issues", () => {
    expect(getQaReadiness([{ status: "verified", issues: [{ severity: "critical", resolved: false }] }])).toBe("red");
    expect(getQaReadiness([{ status: "verified", issues: [{ severity: "high", resolved: false }] }])).toBe("red");
  });

  it("clears readiness after a blocking issue is resolved", () => {
    expect(getQaReadiness([{ status: "verified", issues: [{ severity: "critical", resolved: true }] }])).toBe("green");
  });
});
