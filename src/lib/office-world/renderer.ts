import {
  BUILDING_OVERVIEW_CAMERA,
  FLOOR_CAMERA_OFFSET,
  getLevelCenter,
  type CameraPreset,
  type OfficeLevelId,
  type WorldVector3,
} from "./world";

export type Vector3Tuple = readonly [number, number, number];

export type OrthographicCameraConfig = Readonly<{
  kind: "orthographic";
  position: Vector3Tuple;
  target: Vector3Tuple;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  near: number;
  far: number;
}>;

export type OfficeLightingConfig = Readonly<{
  hemisphere: Readonly<{
    skyColor: string;
    groundColor: string;
    intensity: number;
  }>;
  ambient: Readonly<{ color: string; intensity: number }>;
  key: Readonly<{
    color: string;
    intensity: number;
    position: Vector3Tuple;
    castShadow: boolean;
  }>;
  fill: Readonly<{
    color: string;
    intensity: number;
    position: Vector3Tuple;
  }>;
}>;

const toTuple = (value: WorldVector3): Vector3Tuple =>
  [value.x, value.y, value.z] as const;

export const OFFICE_LIGHTING: OfficeLightingConfig = Object.freeze({
  hemisphere: Object.freeze({
    skyColor: "#fff1d6",
    groundColor: "#776b62",
    intensity: 1.35,
  }),
  ambient: Object.freeze({ color: "#ffffff", intensity: 0.45 }),
  key: Object.freeze({
    color: "#fff0d2",
    intensity: 2.1,
    position: [18, 28, 12] as const,
    castShadow: true,
  }),
  fill: Object.freeze({
    color: "#d7e7ff",
    intensity: 0.65,
    position: [-16, 12, -18] as const,
  }),
});

const cameraFromPreset = (preset: CameraPreset): OrthographicCameraConfig =>
  Object.freeze({
    kind: "orthographic",
    position: toTuple(preset.position),
    target: toTuple(preset.target),
    zoom: preset.zoom,
    minZoom: preset.minZoom,
    maxZoom: preset.maxZoom,
    near: 0.1,
    far: 160,
  });

export const BUILDING_CAMERA_CONFIG = cameraFromPreset(
  BUILDING_OVERVIEW_CAMERA,
);

export const getFloorCameraConfig = (
  levelId: OfficeLevelId,
): OrthographicCameraConfig => {
  const center = getLevelCenter(levelId);
  const position = {
    x: center.x + FLOOR_CAMERA_OFFSET.x,
    y: center.y + FLOOR_CAMERA_OFFSET.y,
    z: center.z + FLOOR_CAMERA_OFFSET.z,
  };

  return Object.freeze({
    kind: "orthographic",
    position: toTuple(position),
    target: toTuple(center),
    zoom: 34,
    minZoom: 20,
    maxZoom: 52,
    near: 0.1,
    far: 100,
  });
};

/** Clamp a requested zoom so touch gestures cannot lose the world. */
export const clampWorldZoom = (
  requestedZoom: number,
  camera: Pick<OrthographicCameraConfig, "minZoom" | "maxZoom"> =
    BUILDING_CAMERA_CONFIG,
): number => {
  if (!Number.isFinite(requestedZoom)) return camera.zoom ?? 24;
  return Math.min(camera.maxZoom, Math.max(camera.minZoom, requestedZoom));
};
