/**
 * MEX-NEX Living HQ world contract.
 *
 * This module is deliberately renderer-agnostic: domain/world coordinates
 * remain stable even if the 3D renderer or asset pipeline changes.
 */

export type WorldVector3 = Readonly<{ x: number; y: number; z: number }>;
export type WorldBounds = Readonly<{
  min: WorldVector3;
  max: WorldVector3;
}>;

export type OfficeLevelId =
  | "basement"
  | "floor-1"
  | "floor-2"
  | "floor-3"
  | "floor-4"
  | "rooftop";

export type OfficeLevelDefinition = Readonly<{
  id: OfficeLevelId;
  label: string;
  shortLabel: string;
  elevation: number;
  height: number;
  bounds: WorldBounds;
  assetGroup: string;
}>;

/**
 * Canonical world units are metres. X = east/west, Y = vertical, Z = north/south.
 * The building origin is at the centre of the ground-floor slab.
 */
export const WORLD_UNITS = "metres" as const;
export const WORLD_ORIGIN: WorldVector3 = Object.freeze({ x: 0, y: 0, z: 0 });
export const WORLD_BUILDING_BOUNDS: WorldBounds = Object.freeze({
  min: Object.freeze({ x: -18, y: -8, z: -14 }),
  max: Object.freeze({ x: 18, y: 25, z: 14 }),
});

const BUILDING_HALF_WIDTH = 18;
const BUILDING_HALF_DEPTH = 14;
const LEVEL_HEIGHT = 4.5;

const createBounds = (elevation: number, height = LEVEL_HEIGHT): WorldBounds =>
  Object.freeze({
    min: Object.freeze({
      x: -BUILDING_HALF_WIDTH,
      y: elevation,
      z: -BUILDING_HALF_DEPTH,
    }),
    max: Object.freeze({
      x: BUILDING_HALF_WIDTH,
      y: elevation + height,
      z: BUILDING_HALF_DEPTH,
    }),
  });

export const OFFICE_LEVELS: readonly OfficeLevelDefinition[] = Object.freeze([
  {
    id: "basement",
    label: "Basement",
    shortLabel: "B",
    elevation: -4.5,
    height: LEVEL_HEIGHT,
    bounds: createBounds(-4.5),
    assetGroup: "office-level-basement",
  },
  {
    id: "floor-1",
    label: "Lantai 1",
    shortLabel: "01",
    elevation: 0,
    height: LEVEL_HEIGHT,
    bounds: createBounds(0),
    assetGroup: "office-level-1",
  },
  {
    id: "floor-2",
    label: "Lantai 2",
    shortLabel: "02",
    elevation: 4.5,
    height: LEVEL_HEIGHT,
    bounds: createBounds(4.5),
    assetGroup: "office-level-2",
  },
  {
    id: "floor-3",
    label: "Lantai 3",
    shortLabel: "03",
    elevation: 9,
    height: LEVEL_HEIGHT,
    bounds: createBounds(9),
    assetGroup: "office-level-3",
  },
  {
    id: "floor-4",
    label: "Lantai 4",
    shortLabel: "04",
    elevation: 13.5,
    height: LEVEL_HEIGHT,
    bounds: createBounds(13.5),
    assetGroup: "office-level-4",
  },
  {
    id: "rooftop",
    label: "Rooftop",
    shortLabel: "RF",
    elevation: 18,
    height: 3.5,
    bounds: createBounds(18, 3.5),
    assetGroup: "office-level-rooftop",
  },
]);

export const DEFAULT_LEVEL_ID: OfficeLevelId = "floor-1";

export type CameraPreset = Readonly<{
  position: WorldVector3;
  target: WorldVector3;
  zoom: number;
  minZoom: number;
  maxZoom: number;
}>;

/** Orthographic camera preset for a readable isometric building overview. */
export const BUILDING_OVERVIEW_CAMERA: CameraPreset = Object.freeze({
  position: Object.freeze({ x: 34, y: 29, z: 34 }),
  target: Object.freeze({ x: 0, y: 7.5, z: 0 }),
  // Portrait mobile screens need a much wider overview framing.
  zoom: 6.5,
  minZoom: 4,
  maxZoom: 12,
});

/** Per-floor camera target; camera position is derived by the renderer. */
export const FLOOR_CAMERA_OFFSET: WorldVector3 = Object.freeze({
  x: 15,
  y: 12,
  z: 15,
});

export type SceneLayerId =
  | "environment"
  | "building-shell"
  | "interiors"
  | "furniture"
  | "agents"
  | "effects"
  | "ui";

export type SceneLayerDefinition = Readonly<{
  id: SceneLayerId;
  order: number;
  /** Layers that can be omitted from a low-power/mobile render profile. */
  optionalOnLowPower: boolean;
}>;

export const SCENE_LAYERS: readonly SceneLayerDefinition[] = Object.freeze([
  { id: "environment", order: 0, optionalOnLowPower: false },
  { id: "building-shell", order: 10, optionalOnLowPower: false },
  { id: "interiors", order: 20, optionalOnLowPower: false },
  { id: "furniture", order: 30, optionalOnLowPower: true },
  { id: "agents", order: 40, optionalOnLowPower: false },
  { id: "effects", order: 50, optionalOnLowPower: true },
  { id: "ui", order: 60, optionalOnLowPower: false },
]);

export type AssetLoadState = "not-requested" | "loading" | "ready" | "error";

export type LevelAssetManifest = Readonly<{
  levelId: OfficeLevelId;
  group: string;
  /** Asset paths are registered later; no network URL is assumed here. */
  required: readonly string[];
  optional: readonly string[];
}>;

export const EMPTY_LEVEL_ASSET_MANIFESTS: readonly LevelAssetManifest[] =
  Object.freeze(
    OFFICE_LEVELS.map((level) =>
      Object.freeze({
        levelId: level.id,
        group: level.assetGroup,
        required: Object.freeze([] as string[]),
        optional: Object.freeze([] as string[]),
      }),
    ),
  );

export const getOfficeLevel = (
  levelId: OfficeLevelId,
): OfficeLevelDefinition =>
  OFFICE_LEVELS.find((level) => level.id === levelId) ?? OFFICE_LEVELS[1];

export const isOfficeLevelId = (value: string): value is OfficeLevelId =>
  OFFICE_LEVELS.some((level) => level.id === value);

export const getLevelCenter = (levelId: OfficeLevelId): WorldVector3 => {
  const level = getOfficeLevel(levelId);
  return {
    x: 0,
    y: level.elevation + level.height / 2,
    z: 0,
  };
};

export const isPointInsideBounds = (
  point: WorldVector3,
  bounds: WorldBounds,
): boolean =>
  point.x >= bounds.min.x &&
  point.x <= bounds.max.x &&
  point.y >= bounds.min.y &&
  point.y <= bounds.max.y &&
  point.z >= bounds.min.z &&
  point.z <= bounds.max.z;

export const resolveLevelForElevation = (
  elevation: number,
): OfficeLevelId => {
  const matching = [...OFFICE_LEVELS]
    .reverse()
    .find((level) => elevation >= level.elevation);
  return matching?.id ?? "basement";
};
