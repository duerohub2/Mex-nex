import { describe, expect, it } from "vitest";
import {
  BUILDING_CAMERA_CONFIG,
  clampWorldZoom,
  getFloorCameraConfig,
  OFFICE_LIGHTING,
} from "./renderer";
import { getLevelCenter, isPointInsideBounds, getOfficeLevel } from "./world";

describe("world renderer configuration", () => {
  it("uses an orthographic camera for the building overview", () => {
    expect(BUILDING_CAMERA_CONFIG.kind).toBe("orthographic");
    expect(BUILDING_CAMERA_CONFIG.position).toEqual([34, 29, 34]);
    expect(BUILDING_CAMERA_CONFIG.zoom).toBeGreaterThanOrEqual(
      BUILDING_CAMERA_CONFIG.minZoom,
    );
  });

  it("aims each floor camera at that floor's centre", () => {
    for (const id of ["basement", "floor-1", "floor-2", "floor-3", "floor-4", "rooftop"] as const) {
      const camera = getFloorCameraConfig(id);
      expect(camera.target[1]).toBe(getLevelCenter(id).y);
      expect(camera.position[1]).toBeGreaterThan(camera.target[1]);
      expect(
        isPointInsideBounds(getLevelCenter(id), getOfficeLevel(id).bounds),
      ).toBe(true);
    }
  });

  it("clamps zoom and safely handles non-finite values", () => {
    expect(clampWorldZoom(-100)).toBe(BUILDING_CAMERA_CONFIG.minZoom);
    expect(clampWorldZoom(1000)).toBe(BUILDING_CAMERA_CONFIG.maxZoom);
    expect(clampWorldZoom(Number.NaN)).toBe(BUILDING_CAMERA_CONFIG.zoom);
  });

  it("provides balanced warm key and cool fill lighting", () => {
    expect(OFFICE_LIGHTING.key.castShadow).toBe(true);
    expect(OFFICE_LIGHTING.key.intensity).toBeGreaterThan(0);
    expect(OFFICE_LIGHTING.fill.intensity).toBeGreaterThan(0);
    expect(OFFICE_LIGHTING.hemisphere.intensity).toBeGreaterThan(0);
  });
});
