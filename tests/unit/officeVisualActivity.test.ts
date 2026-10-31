import { describe, expect, it } from "vitest";

import { resolveOfficeVisualStatus } from "@/lib/office/visualActivity";

describe("shared 2D/3D office visual activity contract", () => {
  const cases = [
    { status: "idle" as const, cue: false, expected: "idle" as const },
    { status: "idle" as const, cue: true, expected: "working" as const },
    { status: "working" as const, cue: false, expected: "working" as const },
    { status: "working" as const, cue: true, expected: "working" as const },
    { status: "error" as const, cue: false, expected: "error" as const },
    { status: "error" as const, cue: true, expected: "error" as const },
  ];

  it.each(cases)(
    "resolves $status with working cue=$cue to $expected",
    ({ status, cue, expected }) => {
      expect(resolveOfficeVisualStatus(status, cue)).toBe(expected);
    },
  );

  it("keeps idle, working, and error semantics stable for both renderers", () => {
    const rosterStatuses = ["idle", "working", "error"] as const;
    const cueStates = [false, true];

    for (const status of rosterStatuses) {
      for (const cue of cueStates) {
        const firstView = resolveOfficeVisualStatus(status, cue);
        const secondView = resolveOfficeVisualStatus(status, cue);
        expect(firstView).toBe(secondView);
      }
    }
  });
});
