"use client";

import { OFFICE_LEVELS, type OfficeLevelId } from "@/lib/office-world/world";

type OfficeBuildingProps = {
  visibleLevels?: readonly OfficeLevelId[];
  showStructure?: boolean;
  interiorMode?: boolean;
};

const MATERIALS = {
  shell: "#ead8bd",
  slab: "#c8a987",
  trim: "#8b6652",
  glass: "#9fc5c9",
  accent: "#e77d4b",
  dark: "#55483f",
  roof: "#d7b995",
} as const;

function Box({
  position,
  size,
  color,
  opacity = 1,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  opacity?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.78}
        metalness={0.04}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}

function FloorPlate({ elevation, rooftop = false }: { elevation: number; rooftop?: boolean }) {
  return (
    <group position={[0, elevation, 0]}>
      <Box position={[0, 0, 0]} size={[36, 0.34, 28]} color={rooftop ? MATERIALS.roof : MATERIALS.slab} />
      <Box position={[0, 0.2, 0]} size={[36, 0.12, 0.28]} color={MATERIALS.trim} />
      <Box position={[0, 0.2, -13.86]} size={[36, 0.12, 0.28]} color={MATERIALS.trim} />
      <Box position={[-17.86, 0.2, 0]} size={[0.28, 0.12, 28]} color={MATERIALS.trim} />
      <Box position={[17.86, 0.2, 0]} size={[0.28, 0.12, 28]} color={MATERIALS.trim} />
    </group>
  );
}

function StructuralFrame({ elevation, height }: { elevation: number; height: number }) {
  const columns: [number, number][] = [
    [-17, -13], [0, -13], [17, -13],
    [-17, 0], [17, 0],
    [-17, 13], [0, 13], [17, 13],
  ];
  return (
    <group>
      {columns.map(([x, z]) => (
        <Box key={`${x}:${z}:${elevation}`} position={[x, elevation + height / 2, z]} size={[0.48, height, 0.48]} color={MATERIALS.trim} />
      ))}
    </group>
  );
}

function BackAndSideWalls({ elevation, height }: { elevation: number; height: number }) {
  return (
    <group>
      <Box position={[0, elevation + height / 2, -13.82]} size={[35.6, height, 0.36]} color={MATERIALS.shell} />
      <Box position={[-17.82, elevation + height / 2, 0]} size={[0.36, height, 27.6]} color={MATERIALS.shell} />
      <Box position={[17.82, elevation + height / 2, 0]} size={[0.36, height, 27.6]} color={MATERIALS.shell} />
      <Box position={[0, elevation + height - 0.28, 0]} size={[36, 0.22, 28]} color={MATERIALS.accent} />
      <Box position={[0, elevation + 0.52, 13.82]} size={[35.5, 0.18, 0.32]} color={MATERIALS.trim} />
    </group>
  );
}

function WindowBands({ elevation, height }: { elevation: number; height: number }) {
  return (
    <group>
      {Array.from({ length: 8 }, (_, index) => {
        const x = -14 + index * 4;
        return (
          <group key={x}>
            <Box position={[x, elevation + height * 0.58, 13.72]} size={[2.65, 1.65, 0.12]} color={MATERIALS.glass} opacity={0.78} />
            <Box position={[x - 1.4, elevation + height * 0.58, 13.62]} size={[0.12, 1.9, 0.28]} color={MATERIALS.trim} />
            <Box position={[x + 1.4, elevation + height * 0.58, 13.62]} size={[0.12, 1.9, 0.28]} color={MATERIALS.trim} />
          </group>
        );
      })}
    </group>
  );
}

/** Original, procedural cutaway shell for the six-level Living HQ. */
export function OfficeBuilding({
  visibleLevels,
  showStructure = true,
  interiorMode = false,
}: OfficeBuildingProps) {
  const selected = new Set(visibleLevels ?? OFFICE_LEVELS.map((level) => level.id));

  return (
    <group name="mex-nex-living-hq-building">
      {OFFICE_LEVELS.filter((level) => selected.has(level.id)).map((level) => {
        const isRoof = level.id === "rooftop";
        return (
          <group key={level.id} name={`building-level:${level.id}`}>
            <FloorPlate elevation={level.elevation} rooftop={isRoof} />
            {showStructure ? <StructuralFrame elevation={level.elevation} height={level.height} /> : null}
            {!isRoof && !interiorMode ? (
              <>
                <BackAndSideWalls elevation={level.elevation} height={level.height} />
                <WindowBands elevation={level.elevation} height={level.height} />
              </>
            ) : (
              <>
                <Box position={[0, level.elevation + 2.2, -10]} size={[31, 0.28, 7]} color={MATERIALS.dark} />
                <Box position={[0, level.elevation + 2.8, -10]} size={[28, 0.12, 5]} color={MATERIALS.accent} />
                <Box position={[-12, level.elevation + 0.7, 7]} size={[5, 1.1, 4]} color={MATERIALS.shell} />
                <Box position={[12, level.elevation + 0.7, 7]} size={[5, 1.1, 4]} color={MATERIALS.shell} />
              </>
            )}
          </group>
        );
      })}
      {!interiorMode ? <group name="building-core-placeholder">
        <Box position={[0, 7, -7.5]} size={[5.2, 25, 5.2]} color={MATERIALS.dark} opacity={0.92} />
        <Box position={[0, 7, -4.82]} size={[3.6, 23, 0.12]} color={MATERIALS.accent} opacity={0.9} />
      </group> : null}
    </group>
  );
}
