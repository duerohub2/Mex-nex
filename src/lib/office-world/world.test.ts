import { describe, expect, it } from "vitest";
import {
  BUILDING_OVERVIEW_CAMERA,
  DEFAULT_LEVEL_ID,
  EMPTY_LEVEL_ASSET_MANIFESTS,
  getLevelCenter,
  getOfficeLevel,
  isOfficeLevelId,
  isPointInsideBounds,
  OFFICE_LEVELS,
  resolveLevelForElevation,
  SCENE_LAYERS,
  WORLD_BUILDING_BOUNDS,
} from "./world";

describe("MEX-NEX world model", () => {
  it("defines the basement, four floors, and rooftop in vertical order", () => {
    expect(OFFICE_LEVELS.map((level) => level.id)).toEqual([
      "basement",
      "floor-1",
      "floor-2",
      "floor-3",
      "floor-4",
      "rooftop",
    ]);
    expect(
      OFFICE_LEVELS.every(
        (level, index, levels) =>
          index === 0 || level.elevation > levels[index - 1].elevation,
      ),
    ).toBe(true);
  });

  it("uses the ground floor as the default level and validates level ids", () => {
    expect(DEFAULT_LEVEL_ID).toBe("floor-1");
    expect(isOfficeLevelId("floor-4")).toBe(true);
    expect(isOfficeLevelId("floor-9")).toBe(false);
    expect(getOfficeLevel("floor-2").elevation).toBe(4.5);
  });

  it("returns a centre point inside each level bounds", () => {
    for (const level of OFFICE_LEVELS) {
      expect(isPointInsideBounds(getLevelCenter(level.id), level.bounds)).toBe(
        true,
      );
    }
  });

  it("maps elevations to the expected level", () => {
    expect(resolveLevelForElevation(-20)).toBe("basement");
    expect(resolveLevelForElevation(0)).toBe("floor-1");
    expect(resolveLevelForElevation(7)).toBe("floor-2");
    expect(resolveLevelForElevation(20)).toBe("rooftop");
  });

  it("keeps scene layer ordering deterministic", () => {
    expect(SCENE_LAYERS.map((layer) => layer.order)).toEqual([
      0, 10, 20, 30, 40, 50, 60,
    ]);
    expect(SCENE_LAYERS.find((layer) => layer.id === "agents")?.optionalOnLowPower)
      .toBe(false);
  });

  it("registers an independent, empty asset group for every level", () => {
    expect(EMPTY_LEVEL_ASSET_MANIFESTS).toHaveLength(OFFICE_LEVELS.length);
    expect(new Set(EMPTY_LEVEL_ASSET_MANIFESTS.map((item) => item.group)).size)
      .toBe(OFFICE_LEVELS.length);
    expect(
      EMPTY_LEVEL_ASSET_MANIFESTS.every(
        (manifest) =>
          manifest.required.length === 0 && manifest.optional.length === 0,
      ),
    ).toBe(true);
  });

  it("provides an orthographic overview camera within supported zoom bounds", () => {
    expect(BUILDING_OVERVIEW_CAMERA.zoom).toBeGreaterThanOrEqual(
      BUILDING_OVERVIEW_CAMERA.minZoom,
    );
    expect(BUILDING_OVERVIEW_CAMERA.zoom).toBeLessThanOrEqual(
      BUILDING_OVERVIEW_CAMERA.maxZoom,
    );
    expect(isPointInsideBounds(BUILDING_OVERVIEW_CAMERA.target, WORLD_BUILDING_BOUNDS))
      .toBe(true);
  });
});
