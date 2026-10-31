import type { OfficeAgent } from "@/features/retro-office/core/types";

/**
 * Shared status contract for both office renderers.
 * Activity cues may keep an idle roster entry visibly working, but an
 * explicit runtime error always takes precedence.
 */
export const resolveOfficeVisualStatus = (
  status: OfficeAgent["status"],
  hasWorkingCue: boolean,
): OfficeAgent["status"] => {
  if (status === "error") return "error";
  return status === "working" || hasWorkingCue ? "working" : "idle";
};
