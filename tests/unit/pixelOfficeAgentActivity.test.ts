import { describe, expect, it } from "vitest";

import type { OfficeAgent } from "@/features/retro-office/core/types";
import type { OfficeAnimationState } from "@/lib/office/eventTriggers";
import {
  buildPixelAgentInputs,
  isCleaningActive,
} from "@/features/pixel-office/buildPixelInputs";

const makeAgent = (
  status: OfficeAgent["status"] = "idle",
): OfficeAgent => ({
  id: "agent-1",
  name: "NEX",
  status,
  color: "#7c3aed",
  item: "laptop",
});

const makeAnimationState = (
  overrides: Partial<OfficeAnimationState> = {},
): OfficeAnimationState => ({
  awaitingApprovalByAgentId: {},
  cleaningCues: [],
  danceUntilByAgentId: {},
  deskHoldByAgentId: {},
  githubHoldByAgentId: {},
  gymHoldByAgentId: {},
  jukeboxHoldByAgentId: {},
  manualGymUntilByAgentId: {},
  pendingStandupRequest: null,
  phoneBoothHoldByAgentId: {},
  phoneCallByAgentId: {},
  qaHoldByAgentId: {},
  smsBoothHoldByAgentId: {},
  skillGymHoldByAgentId: {},
  streamingByAgentId: {},
  textMessageByAgentId: {},
  thinkingByAgentId: {},
  workingUntilByAgentId: {},
  ...overrides,
});

describe("pixel office agent activity mapping", () => {
  it("preserves working, idle, and error roster statuses without animation cues", () => {
    const agents = [
      makeAgent("working"),
      { ...makeAgent("idle"), id: "agent-2" },
      { ...makeAgent("error"), id: "agent-3" },
    ];

    const inputs = buildPixelAgentInputs({
      agents,
      animationState: null,
      nowMs: 10_000,
    });

    expect(inputs.map(({ status }) => status)).toEqual([
      "working",
      "idle",
      "error",
    ]);
    expect(inputs.every((input) => input.hold === null)).toBe(true);
  });

  it("keeps an idle agent working while a desk hold or working latch is active", () => {
    const animationState = makeAnimationState({
      deskHoldByAgentId: { "agent-1": true },
      workingUntilByAgentId: { "agent-2": 12_000 },
    });
    const agents = [
      makeAgent("idle"),
      { ...makeAgent("idle"), id: "agent-2" },
      { ...makeAgent("idle"), id: "agent-3" },
    ];

    const inputs = buildPixelAgentInputs({
      agents,
      animationState,
      nowMs: 10_000,
    });

    expect(inputs.map(({ status }) => status)).toEqual([
      "working",
      "working",
      "idle",
    ]);
  });

  it("does not hide an error behind a desk or working latch", () => {
    const input = buildPixelAgentInputs({
      agents: [makeAgent("error")],
      animationState: makeAnimationState({
        deskHoldByAgentId: { "agent-1": true },
        workingUntilByAgentId: { "agent-1": 20_000 },
      }),
      nowMs: 10_000,
    })[0];

    expect(input.status).toBe("error");
  });

  it("expires a working latch at its exact deadline", () => {
    const input = buildPixelAgentInputs({
      agents: [makeAgent("idle")],
      animationState: makeAnimationState({
        workingUntilByAgentId: { "agent-1": 10_000 },
      }),
      nowMs: 10_000,
    })[0];

    expect(input.status).toBe("idle");
  });

  it("uses the documented hold priority when multiple directives overlap", () => {
    const input = buildPixelAgentInputs({
      agents: [makeAgent()],
      animationState: makeAnimationState({
        phoneBoothHoldByAgentId: { "agent-1": true },
        smsBoothHoldByAgentId: { "agent-1": true },
        gymHoldByAgentId: { "agent-1": true },
        qaHoldByAgentId: { "agent-1": true },
        githubHoldByAgentId: { "agent-1": true },
        jukeboxHoldByAgentId: { "agent-1": true },
      }),
      nowMs: 10_000,
    })[0];

    expect(input.hold).toBe("phone_booth");
  });

  it("forwards live streaming, thinking, approval, dance, and standup cues", () => {
    const input = buildPixelAgentInputs({
      agents: [makeAgent()],
      animationState: makeAnimationState({
        awaitingApprovalByAgentId: { "agent-1": true },
        danceUntilByAgentId: { "agent-1": 11_000 },
        pendingStandupRequest: {
          key: "standup-1",
          message: "Daily standup",
          requestedAt: 9_500,
        },
        streamingByAgentId: { "agent-1": true },
        thinkingByAgentId: { "agent-1": true },
      }),
      nowMs: 10_000,
    })[0];

    expect(input).toMatchObject({
      streaming: true,
      thinking: true,
      awaitingApproval: true,
      dancing: true,
      standup: true,
    });
  });
});

describe("pixel office cleaning cue mapping", () => {
  it("only activates the janitor while at least one cleaning cue exists", () => {
    expect(isCleaningActive(null)).toBe(false);
    expect(isCleaningActive(makeAnimationState())).toBe(false);
    expect(
      isCleaningActive(
        makeAnimationState({
          cleaningCues: [\n            { id: "clean-1", agentId: "agent-1", agentName: "NEX", ts: 10_000 },\n          ],
        }),
      ),
    ).toBe(true);
  });
});
