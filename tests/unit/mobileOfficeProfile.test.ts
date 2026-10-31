import { describe, expect, it } from "vitest";

import {
  getGraphicsQualityConfig,
  isTouchOptimizedDevice,
} from "@/features/retro-office/core/graphicsQuality";

describe("mobile office graphics profile", () => {
  it("keeps desktop presets unchanged", () => {
    expect(getGraphicsQualityConfig("balanced")).toMatchObject({
      maxDpr: 1.5,
      shadowMapSize: 2048,
      postProcessing: true,
      shadows: true,
      ambientOcclusion: true,
      bloom: true,
    });
  });

  it("reduces balanced rendering costs on touch devices", () => {
    expect(getGraphicsQualityConfig("balanced", true)).toMatchObject({
      maxDpr: 1,
      shadowMapSize: 1024,
      postProcessing: false,
      shadows: false,
      ambientOcclusion: false,
      bloom: false,
      smaa: false,
    });
  });

  it("caps ultra mode on touch devices without changing the desktop preset", () => {
    expect(getGraphicsQualityConfig("ultra", true)).toMatchObject({
      maxDpr: 1.25,
      shadowMapSize: 2048,
      postProcessing: true,
      shadows: true,
      aoQuality: "low",
    });
    expect(getGraphicsQualityConfig("ultra").maxDpr).toBe(2);
  });

  it("detects coarse-pointer or touch-capable browsers safely", () => {
    expect(isTouchOptimizedDevice()).toBe(false);
  });
});
