"use client";

import { OFFICE_LEVELS, type OfficeLevelId } from "@/lib/office-world/world";
import { OfficeFurnitureModel } from "./OfficeFurnitureModel";

type OfficeInteriorsProps = { visibleLevels?: readonly OfficeLevelId[] };

const C = {
  wall: "#f3e5d0",
  partition: "#d9c2a5",
  wood: "#a87955",
  darkWood: "#76513e",
  metal: "#687985",
  screen: "#8fc6ce",
  orange: "#e77d4b",
  cream: "#fff2df",
  green: "#64845a",
  chair: "#536d7b",
  concrete: "#b8aaa0",
} as const;

function Block({ position, size, color, opacity = 1 }: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  opacity?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.82} transparent={opacity < 1} opacity={opacity} />
    </mesh>
  );
}

function Desk({ x, z, y }: { x: number; z: number; y: number }) {
  return (
    <group>
      <OfficeFurnitureModel model="desk" position={[x - 1, y + 0.2, z + 0.2]} scale={2.75} />
      <OfficeFurnitureModel model="computerScreen" position={[x - 0.45, y + 1.12, z - 0.48]} scale={2.65} />
      <OfficeFurnitureModel model="chairDesk" position={[x - 0.48, y + 0.12, z + 1.12]} scale={2.35} rotationY={Math.PI} />
    </group>
  );
}

function MeetingTable({ x, z, y, seats = 6 }: { x: number; z: number; y: number; seats?: number }) {
  const seatsPerSide = Math.ceil(seats / 2);
  return (
    <group>
      <OfficeFurnitureModel model="table" position={[x - 2.6, y + 0.38, z - 1.05]} scale={[6.2, 2.4, 4.7]} />
      {Array.from({ length: seats }, (_, index) => {
        const side = index < seatsPerSide ? -1 : 1;
        const rowIndex = index % seatsPerSide;
        const offset = (rowIndex - (seatsPerSide - 1) / 2) * 1.55;
        return (
          <OfficeFurnitureModel
            key={index}
            model="chairDesk"
            position={[x + offset - 0.25, y + 0.08, z + side * 1.72]}
            scale={2.05}
            rotationY={side < 0 ? 0 : Math.PI}
          />
        );
      })}
    </group>
  );
}

function Plant({ x, z, y }: { x: number; z: number; y: number }) {
  return <OfficeFurnitureModel model="pottedPlant" position={[x - 0.35, y, z + 0.1]} scale={3.5} />;
}

function ServerRack({ x, z, y }: { x: number; z: number; y: number }) {
  return (
    <group position={[x, y, z]}>
      <Block position={[0, 1.18, 0]} size={[1.35, 2.35, 1.1]} color={C.metal} />
      {Array.from({ length: 5 }, (_, i) => (
        <Block key={i} position={[0, 0.35 + i * 0.4, 0.565]} size={[1.05, 0.24, 0.035]} color={i % 2 ? C.screen : C.darkWood} />
      ))}
    </group>
  );
}

function ElevatorAndStairs({ y }: { y: number }) {
  return (
    <group>
      <Block position={[-13.2, y + 1.95, -8.5]} size={[3.4, 3.9, 4.2]} color={C.metal} opacity={0.42} />
      <Block position={[-13.2, y + 1.95, -6.34]} size={[2.7, 3.3, 0.08]} color={C.screen} opacity={0.72} />
      <Block position={[12.8, y + 0.12, -8.4]} size={[4.6, 0.24, 5.2]} color={C.concrete} />
      {Array.from({ length: 9 }, (_, i) => (
        <Block key={i} position={[11.1 + i * 0.42, y + 0.18 + i * 0.22, -8.4]} size={[0.72, 0.22, 4.5]} color={C.wood} />
      ))}
      <Block position={[13, y + 1.25, -6.05]} size={[0.16, 2.5, 0.16]} color={C.metal} />
    </group>
  );
}

function DepartmentSign({ x, z, y, labelColor = C.orange }: { x: number; z: number; y: number; labelColor?: string }) {
  return (
    <group position={[x, y, z]}>
      <Block position={[0, 2.35, 0]} size={[4.2, 0.9, 0.14]} color={labelColor} />
      <Block position={[0, 1.75, 0]} size={[0.12, 0.45, 0.12]} color={C.metal} />
    </group>
  );
}


function Sofa({ x, z, y, color: _color = "#b97858" }: { x: number; z: number; y: number; color?: string }) {
  return <OfficeFurnitureModel model="loungeSofa" position={[x - 1.55, y + 0.05, z - 0.6]} scale={3.2} />;
}

function Bookcase({ x, z, y }: { x: number; z: number; y: number }) {
  return <OfficeFurnitureModel model="bookcaseClosed" position={[x - 0.65, y, z - 0.2]} scale={3.2} />;
}

function CoffeeStation({ x, z, y }: { x: number; z: number; y: number }) {
  return (
    <group>
      <OfficeFurnitureModel model="kitchenCabinet" position={[x - 0.65, y, z - 0.25]} scale={3.1} />
      <OfficeFurnitureModel model="kitchenCoffeeMachine" position={[x - 0.28, y + 1.35, z - 0.2]} scale={2.7} />
      <OfficeFurnitureModel model="kitchenFridgeSmall" position={[x + 1.1, y, z - 0.25]} scale={2.8} />
    </group>
  );
}


function StudioSet({ x, z, y }: { x: number; z: number; y: number }) {
  return (
    <group>
      <Block position={[x, y + 0.08, z + 2.4]} size={[12, 0.16, 9]} color="#343b4d" />
      <Block position={[x, y + 1.9, z - 2.1]} size={[8.5, 3.5, 0.18]} color="#20283b" />
      <Block position={[x, y + 1.9, z - 1.98]} size={[7.6, 2.65, 0.08]} color="#527b78" />
      <Block position={[x - 4.8, y + 1.8, z - 0.4]} size={[0.16, 3.5, 3.8]} color="#687985" opacity={0.7} />
      <Block position={[x + 4.8, y + 1.8, z - 0.4]} size={[0.16, 3.5, 3.8]} color="#687985" opacity={0.7} />
      <OfficeFurnitureModel model="desk" position={[x - 1.5, y + 0.18, z + 1.2]} scale={2.5} />
      <OfficeFurnitureModel model="computerScreen" position={[x - 0.7, y + 1.08, z + 0.45]} scale={2.3} />
      <OfficeFurnitureModel model="chairDesk" position={[x - 0.8, y + 0.1, z + 2.2]} scale={2.05} rotationY={Math.PI} />
      <group position={[x + 3.2, y + 0.1, z + 0.2]}>
        <Block position={[0, 1.25, 0]} size={[0.16, 2.5, 0.16]} color={C.metal} />
        <Block position={[0, 2.55, 0]} size={[1.65, 0.14, 1.65]} color="#e6d7b7" />
        <Block position={[0, 1.35, -0.55]} size={[0.12, 2.2, 0.12]} color={C.metal} />
      </group>
      <Block position={[x - 5.2, y + 1.65, z - 1.4]} size={[0.12, 3.2, 0.12]} color={C.metal} />
      <Block position={[x - 5.2, y + 3.15, z - 1.4]} size={[1.2, 0.12, 1.2]} color="#f2d58b" />
    </group>
  );
}

function RooftopPool({ x, z, y }: { x: number; z: number; y: number }) {
  return (
    <group>
      <Block position={[x, y + 0.24, z]} size={[15, 0.48, 9]} color="#e8dfd0" />
      <Block position={[x, y + 0.5, z]} size={[13.8, 0.18, 7.8]} color="#4c91a4" />
      <Block position={[x, y + 0.61, z]} size={[12.9, 0.06, 6.9]} color="#70c4d2" opacity={0.92} />
      {[-4.8, 4.8].map((dx) => <Block key={dx} position={[x + dx, y + 0.9, z]} size={[0.12, 0.7, 8.2]} color="#d9d5cb" />)}
      {[-2.8, 0, 2.8].map((dz) => <Block key={dz} position={[x - 9.4, y + 0.22, z + dz]} size={[3.4, 0.16, 1.45]} color="#f3eee4" />)}
      <OfficeFurnitureModel model="loungeSofa" position={[x + 9.3, y + 0.08, z - 2.3]} scale={2.1} rotationY={-Math.PI / 2} />
      <OfficeFurnitureModel model="tableCoffee" position={[x + 8.1, y + 0.08, z + 1.2]} scale={2.1} />
      <Plant x={x + 8.5} z={z + 4.2} y={y + 0.12} />
      <Plant x={x - 8.5} z={z - 5.2} y={y + 0.12} />
    </group>
  );
}


function GlassRun({ x, z, y, length, axis = "x", height = 3.1, tint = "#9fcbd0" }: {
  x: number; z: number; y: number; length: number; axis?: "x" | "z"; height?: number; tint?: string;
}) {
  const alongX = axis === "x";
  const panelSize: [number, number, number] = alongX
    ? [length, height, 0.12]
    : [0.12, height, length];
  const postCount = Math.max(2, Math.floor(length / 2.4) + 1);
  return (
    <group>
      <Block position={[x, y + height / 2, z]} size={panelSize} color={tint} opacity={0.24} />
      <Block position={[x, y + 0.08, z]} size={alongX ? [length, 0.16, 0.2] : [0.2, 0.16, length]} color={C.metal} />
      <Block position={[x, y + height, z]} size={alongX ? [length, 0.12, 0.2] : [0.2, 0.12, length]} color={C.metal} />
      {Array.from({ length: postCount }, (_, i) => {
        const offset = -length / 2 + (length * i) / (postCount - 1);
        return <Block key={i} position={alongX ? [x + offset, y + height / 2, z] : [x, y + height / 2, z + offset]} size={[0.1, height + 0.08, 0.16]} color={C.metal} />;
      })}
    </group>
  );
}

function LowPartition({ x, z, y, length, axis = "x", color = C.partition }: {
  x: number; z: number; y: number; length: number; axis?: "x" | "z"; color?: string;
}) {
  return <Block position={[x, y + 0.72, z]} size={axis === "x" ? [length, 1.44, 0.28] : [0.28, 1.44, length]} color={color} />;
}

function FloorArchitecture({ levelId, y }: { levelId: OfficeLevelId; y: number }) {
  if (levelId === "basement") {
    return (
      <group>
        <LowPartition x={0} z={-10} y={y} length={28} />
        <GlassRun x={-7} z={3} y={y} length={12} axis="z" tint="#7daab7" />
        <GlassRun x={-1} z={-3} y={y} length={12} tint="#7daab7" />
        <LowPartition x={8} z={-4} y={y} length={12} axis="z" color="#89969a" />
      </group>
    );
  }
  if (levelId === "floor-1") {
    return (
      <group>
        <GlassRun x={-8} z={-5} y={y} length={13} axis="z" />
        <GlassRun x={-1.5} z={-11.5} y={y} length={13} />
        <GlassRun x={8.5} z={-4.5} y={y} length={9} axis="z" />
        <GlassRun x={13} z={0} y={y} length={9} />
        <LowPartition x={-10} z={5} y={y} length={7} axis="z" color="#d7b99b" />
      </group>
    );
  }
  if (levelId === "floor-2") {
    return (
      <group>
        <GlassRun x={-17} z={-4} y={y} length={18} axis="z" />
        <GlassRun x={-8} z={-12} y={y} length={18} />
        <GlassRun x={8} z={-4} y={y} length={18} axis="z" />
        <GlassRun x={8} z={5} y={y} length={18} />
        <LowPartition x={0} z={-1} y={y} length={12} color="#d6c3ad" />
      </group>
    );
  }
  if (levelId === "floor-3") {
    return (
      <group>
        <GlassRun x={1} z={-10} y={y} length={13} />
        <GlassRun x={1} z={-4} y={y} length={12} />
        <GlassRun x={-5} z={-7} y={y} length={6} axis="z" />
        <GlassRun x={13} z={-7} y={y} length={6} axis="z" />
        <GlassRun x={-17} z={3} y={y} length={13} axis="z" tint="#a8c9cb" />
      </group>
    );
  }
  if (levelId === "floor-4") {
    return (
      <group>
        <GlassRun x={-13} z={-7} y={y} length={12} axis="z" />
        <GlassRun x={-7} z={-13} y={y} length={12} />
        <GlassRun x={6} z={-7} y={y} length={12} axis="z" />
        <GlassRun x={12} z={-1} y={y} length={12} />
        <LowPartition x={0} z={6} y={y} length={12} color="#c9b49e" />
      </group>
    );
  }
  return (
    <group>
      <GlassRun x={-7.5} z={-4.5} y={y} length={9} axis="z" height={1.6} tint="#9fcbd0" />
      <GlassRun x={7.5} z={-4.5} y={y} length={9} axis="z" height={1.6} tint="#9fcbd0" />
      <GlassRun x={0} z={-9} y={y} length={15} height={1.6} tint="#9fcbd0" />
    </group>
  );
}

function LevelInterior({ levelId, elevation }: { levelId: OfficeLevelId; elevation: number }) {
  const y = elevation + 0.22;
  return (
    <group name={`interior:${levelId}`}>
      <FloorArchitecture levelId={levelId} y={y} />
      <ElevatorAndStairs y={y} />
      {levelId === "basement" ? (
        <>
          {[ -10, -6, -2, 2 ].map((x) => <ServerRack key={x} x={x} z={-1} y={y} />)}
          <Block position={[9, y + 0.7, 1]} size={[8, 1.4, 5]} color={C.concrete} />
          <DepartmentSign x={-5} z={-5} y={y} />
          <Plant x={15} z={9} y={y} />
          <Bookcase x={9} z={-7} y={y} />
          <CoffeeStation x={-13} z={6} y={y} />
        </>
      ) : levelId === "floor-1" ? (
        <>
          <Block position={[0, y + 0.62, 7]} size={[8, 1.24, 3.2]} color={C.cream} />
          <Block position={[0, y + 1.35, 7]} size={[8.2, 0.18, 3.4]} color={C.wood} />
          <MeetingTable x={-6} z={-1} y={y} seats={4} />
          <Desk x={7} z={-3} y={y} />
          <DepartmentSign x={0} z={-12} y={y} />
          <Plant x={-14} z={8} y={y} />
          <Plant x={14} z={8} y={y} />
          <Sofa x={9} z={8} y={y} />
          <OfficeFurnitureModel model="loungeDesignChair" position={[5.5, y + 0.08, 8.5]} scale={2.8} rotationY={Math.PI / 2} />
          <OfficeFurnitureModel model="tableCoffee" position={[8.2, y + 0.1, 8.1]} scale={2.7} />
          <OfficeFurnitureModel model="lampRoundFloor" position={[11.5, y, 7.3]} scale={3.1} />
          <CoffeeStation x={-13} z={7} y={y} />
        </>
      ) : levelId === "floor-2" ? (
        <>
          {[-10, -4, 4, 10].map((x) => <Desk key={x} x={x} z={1} y={y} />)}
          {[-10, -4, 4, 10].map((x) => <Desk key={x} x={x} z={7} y={y} />)}
          <DepartmentSign x={0} z={-12} y={y} />
          <Plant x={-15} z={10} y={y} />
          <Plant x={15} z={10} y={y} />
          <Bookcase x={-15} z={-7} y={y} />
          <Sofa x={0} z={-8} y={y} color="#668b86" />
          <OfficeFurnitureModel model="loungeDesignChair" position={[-4.2, y + 0.08, -7.2]} scale={2.8} rotationY={-Math.PI / 2} />
          <OfficeFurnitureModel model="tableCoffee" position={[0.2, y + 0.1, -8.1]} scale={2.5} />
        </>
      ) : levelId === "floor-3" ? (
        <>
          {[-10, -4, 4, 10].map((x) => <Desk key={x} x={x} z={-1} y={y} />)}
          <MeetingTable x={0} z={8} y={y} seats={6} />
          <DepartmentSign x={0} z={-12} y={y} labelColor={C.screen} />
          <Plant x={-15} z={9} y={y} />
          <Bookcase x={15} z={-8} y={y} />
          <CoffeeStation x={-13} z={7} y={y} />
          <StudioSet x={7} z={-5} y={y} />
        </>
      ) : levelId === "floor-4" ? (
        <>
          <MeetingTable x={-5} z={-1} y={y} seats={8} />
          <Desk x={9} z={-3} y={y} />
          <Block position={[9, y + 0.65, 5]} size={[6, 1.3, 3.2]} color={C.cream} />
          <DepartmentSign x={0} z={-12} y={y} />
          <Plant x={-14} z={9} y={y} />
          <Plant x={14} z={9} y={y} />
          <Sofa x={9} z={8} y={y} color="#7f8e9b" />
          <OfficeFurnitureModel model="loungeDesignChair" position={[5.5, y + 0.08, 8.5]} scale={2.8} rotationY={Math.PI / 2} />
          <OfficeFurnitureModel model="tableCoffee" position={[8.2, y + 0.1, 8.1]} scale={2.7} />
          <Bookcase x={-14} z={-8} y={y} />
        </>
      ) : (
        <>
          <Block position={[0, y + 0.12, 2]} size={[18, 0.24, 12]} color={C.green} />
          {[-7, 0, 7].map((x) => <Plant key={x} x={x} z={2} y={y + 0.25} />)}
          <Block position={[-10, y + 0.65, -8]} size={[5, 1.3, 2.5]} color={C.cream} />
          <Block position={[10, y + 0.65, -8]} size={[5, 1.3, 2.5]} color={C.cream} />
          <RooftopPool x={0} z={1} y={y} />
        </>
      )}
    </group>
  );
}

/** Procedural interior starter kit: circulation core, furniture and floor-specific facilities. */
export function OfficeInteriors({ visibleLevels }: OfficeInteriorsProps) {
  const selected = new Set(visibleLevels ?? OFFICE_LEVELS.map((level) => level.id));
  return (
    <group name="mex-nex-living-hq-interiors">
      {OFFICE_LEVELS.filter((level) => selected.has(level.id)).map((level) => (
        <LevelInterior key={level.id} levelId={level.id} elevation={level.elevation} />
      ))}
    </group>
  );
}
