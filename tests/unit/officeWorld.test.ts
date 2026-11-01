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
} from "../../src/lib/office-world/world";
import {
  BUILDING_CAMERA_CONFIG,
  clampWorldZoom,
  getFloorCameraConfig,
  OFFICE_LIGHTING,
} from "../../src/lib/office-world/renderer";

describe("MEX-NEX Living HQ world model", () => {
  it("defines basement, four floors, and rooftop in vertical order", () => {
    expect(OFFICE_LEVELS.map((level) => level.id)).toEqual([
      "basement", "floor-1", "floor-2", "floor-3", "floor-4", "rooftop",
    ]);
    expect(OFFICE_LEVELS.every((level, index, levels) =>
      index === 0 || level.elevation > levels[index - 1].elevation,
    )).toBe(true);
  });

  it("validates level ids and uses floor one as the default", () => {
    expect(DEFAULT_LEVEL_ID).toBe("floor-1");
    expect(isOfficeLevelId("floor-4")).toBe(true);
    expect(isOfficeLevelId("floor-9")).toBe(false);
    expect(getOfficeLevel("floor-2").elevation).toBe(4.5);
  });

  it("places each level centre inside its own bounds", () => {
    for (const level of OFFICE_LEVELS) {
      expect(isPointInsideBounds(getLevelCenter(level.id), level.bounds)).toBe(true);
    }
  });

  it("resolves elevations to the expected level", () => {
    expect(resolveLevelForElevation(-20)).toBe("basement");
    expect(resolveLevelForElevation(0)).toBe("floor-1");
    expect(resolveLevelForElevation(7)).toBe("floor-2");
    expect(resolveLevelForElevation(20)).toBe("rooftop");
  });

  it("keeps scene layers ordered and preserves essential layers on low-power devices", () => {
    expect(SCENE_LAYERS.map((layer) => layer.order)).toEqual([0, 10, 20, 30, 40, 50, 60]);
    expect(SCENE_LAYERS.filter((layer) => !layer.optionalOnLowPower).map((layer) => layer.id))
      .toEqual(["environment", "building-shell", "interiors", "agents", "ui"]);
  });

  it("registers an independent asset group for every level without speculative paths", () => {
    expect(EMPTY_LEVEL_ASSET_MANIFESTS).toHaveLength(OFFICE_LEVELS.length);
    expect(new Set(EMPTY_LEVEL_ASSET_MANIFESTS.map((item) => item.group)).size)
      .toBe(OFFICE_LEVELS.length);
    expect(EMPTY_LEVEL_ASSET_MANIFESTS.every((item) =>
      item.required.length === 0 && item.optional.length === 0,
    )).toBe(true);
  });

  it("defines an orthographic overview camera within world bounds", () => {
    expect(BUILDING_OVERVIEW_CAMERA.zoom).toBeGreaterThanOrEqual(BUILDING_OVERVIEW_CAMERA.minZoom);
    expect(BUILDING_OVERVIEW_CAMERA.zoom).toBeLessThanOrEqual(BUILDING_OVERVIEW_CAMERA.maxZoom);
    expect(isPointInsideBounds(BUILDING_OVERVIEW_CAMERA.target, WORLD_BUILDING_BOUNDS)).toBe(true);
    expect(BUILDING_CAMERA_CONFIG.kind).toBe("orthographic");
  });

  it("aims each floor camera at the corresponding floor centre", () => {
    for (const level of OFFICE_LEVELS) {
      const camera = getFloorCameraConfig(level.id);
      expect(camera.target[1]).toBe(getLevelCenter(level.id).y);
      expect(camera.position[1]).toBeGreaterThan(camera.target[1]);
    }
  });

  it("clamps zoom and handles non-finite values", () => {
    expect(clampWorldZoom(-100)).toBe(BUILDING_CAMERA_CONFIG.minZoom);
    expect(clampWorldZoom(1000)).toBe(BUILDING_CAMERA_CONFIG.maxZoom);
    expect(clampWorldZoom(Number.NaN)).toBe(BUILDING_CAMERA_CONFIG.zoom);
  });

  it("provides a warm key light and balanced fill lighting", () => {
    expect(OFFICE_LIGHTING.key.castShadow).toBe(true);
    expect(OFFICE_LIGHTING.key.intensity).toBeGreaterThan(0);
    expect(OFFICE_LIGHTING.fill.intensity).toBeGreaterThan(0);
    expect(OFFICE_LIGHTING.hemisphere.intensity).toBeGreaterThan(0);
  });
});
