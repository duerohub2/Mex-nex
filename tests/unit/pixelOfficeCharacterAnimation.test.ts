import { describe, expect, it } from "vitest";

import { buildHermesHqMap } from "@/features/pixel-office/map/hermesHqMap";
import { createPixelSimulation } from "@/features/pixel-office/sim/agentSimulation";
import type { PixelAgentInput, PixelAgentPose } from "@/features/pixel-office/types";

const map = buildHermesHqMap();

const makeInput = (
  overrides: Partial<PixelAgentInput> = {},
): PixelAgentInput => ({
  id: "agent-animation",
  name: "NEX",
  status: "idle",
  color: "#7c3aed",
  streaming: false,
  thinking: false,
  awaitingApproval: false,
  dancing: false,
  hold: null,
  standup: false,
  ...overrides,
});

const tickUntil = (
  simulation: ReturnType<typeof createPixelSimulation>,
  input: PixelAgentInput,
  predicate: (pose: PixelAgentPose) => boolean,
  maxTicks = 800,
): PixelAgentPose => {
  let pose = simulation.tick({
    inputs: [input],
    nowMs: 0,
    dtMs: 100,
    cleaningActive: false,
  })[0];

  for (let tick = 1; tick < maxTicks && !predicate(pose); tick += 1) {
    pose = simulation.tick({
      inputs: [input],
      nowMs: tick * 100,
      dtMs: 100,
      cleaningActive: false,
    })[0];
  }
  return pose;
};

describe("pixel office character animation states", () => {
  it("uses a walking pose while an agent travels to its assigned desk", () => {
    const simulation = createPixelSimulation(map);
    const pose = simulation.tick({
      inputs: [makeInput({ status: "working" })],
      nowMs: 0,
      dtMs: 100,
      cleaningActive: false,
    })[0];

    expect(pose.activity).toBe("walking");
    expect(pose.moving).toBe(true);
    expect(pose.deskId).toBeTruthy();
  });

  it("settles working agents into a seated desk pose", () => {
    const simulation = createPixelSimulation(map);
    const pose = tickUntil(
      simulation,
      makeInput({ status: "working" }),
      (current) => current.activity === "sitting_desk",
    );

    expect(pose.activity).toBe("sitting_desk");
    expect(pose.moving).toBe(false);
    expect(pose.deskId).toBeTruthy();
  });

  it("routes error agents to a desk without losing the error status upstream", () => {
    const simulation = createPixelSimulation(map);
    const pose = tickUntil(
      simulation,
      makeInput({ status: "error" }),
      (current) => current.activity === "sitting_desk",
    );

    expect(pose.activity).toBe("sitting_desk");
    expect(pose.deskId).toBeTruthy();
  });

  it("gathers agents at meeting seats and emits a meeting pose", () => {
    const simulation = createPixelSimulation(map);
    const pose = tickUntil(
      simulation,
      makeInput({ standup: true }),
      (current) => current.activity === "meeting",
    );

    expect(pose.activity).toBe("meeting");
    expect(pose.moving).toBe(false);
    expect(pose.stationId).toBeTruthy();
  });

  it("keeps dance animation in place instead of starting a walk cycle", () => {
    const simulation = createPixelSimulation(map);
    const pose = simulation.tick({
      inputs: [makeInput({ dancing: true })],
      nowMs: 0,
      dtMs: 100,
      cleaningActive: false,
    })[0];

    expect(pose.activity).toBe("dancing");
    expect(pose.moving).toBe(false);
  });

  it("returns idle agents to a non-moving rest pose after reaching a station", () => {
    const simulation = createPixelSimulation(map);
    const pose = tickUntil(
      simulation,
      makeInput(),
      (current) => current.activity === "station",
    );

    expect(pose.activity).toBe("station");
    expect(pose.moving).toBe(false);
    expect(pose.stationId).toBeTruthy();
  });

  it("releases the meeting pose after the standup cue ends", () => {
    const simulation = createPixelSimulation(map);
    const input = makeInput({ standup: true });
    const meetingPose = tickUntil(
      simulation,
      input,
      (current) => current.activity === "meeting",
    );
    expect(meetingPose.activity).toBe("meeting");

    const released = simulation.tick({
      inputs: [makeInput()],
      nowMs: 90_000,
      dtMs: 100,
      cleaningActive: false,
    })[0];

    expect(released.activity).not.toBe("meeting");
  });
});
