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


function GlassPanel({ position, size, tint }: {
  position: [number, number, number];
  size: [number, number, number];
  tint: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshPhysicalMaterial
        color={tint}
        metalness={0.08}
        roughness={0.12}
        transmission={0.48}
        thickness={0.08}
        ior={1.46}
        transparent
        opacity={0.62}
        depthWrite={false}
        envMapIntensity={1.15}
      />
    </mesh>
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
      <GlassPanel position={[x, y + height / 2, z]} size={panelSize} tint={tint} />
      <Block position={[x, y + 0.08, z]} size={alongX ? [length, 0.16, 0.2] : [0.2, 0.16, length]} color={C.metal} />
      <Block position={[x, y + height, z]} size={alongX ? [length, 0.12, 0.2] : [0.2, 0.12, length]} color={C.metal} />
      {Array.from({ length: postCount }, (_, i) => {
        const offset = -length / 2 + (length * i) / (postCount - 1);
        return <Block key={i} position={alongX ? [x + offset, y + height / 2, z] : [x, y + height / 2, z + offset]} size={[0.1, height + 0.08, 0.16]} color={C.metal} />;
      })}
      {/* Slim vertical pull handles make the glass partitions read as real office doors. */}
      <Block
        position={alongX ? [x + length * 0.22, y + 1.45, z + 0.105] : [x + 0.105, y + 1.45, z + length * 0.22]}
        size={alongX ? [0.055, 0.72, 0.055] : [0.055, 0.72, 0.055]}
        color="#d7e0df"
      />
    </group>
  );
}

function WallDisplay({ x, z, y, width = 4.2, height = 2.25, rotationY = 0 }: {
  x: number; z: number; y: number; width?: number; height?: number; rotationY?: number;
}) {
  return (
    <group position={[x, y, z]} rotation={[0, rotationY, 0]}>
      <Block position={[0, 0, 0]} size={[width + 0.24, height + 0.24, 0.16]} color="#27343b" />
      <mesh position={[0, 0, 0.095]}>
        <boxGeometry args={[width, height, 0.035]} />
        <meshStandardMaterial color="#172b38" emissive="#1c5364" emissiveIntensity={0.24} roughness={0.28} metalness={0.22} />
      </mesh>
      <Block position={[-width * 0.31, -height * 0.18, 0.12]} size={[width * 0.26, 0.055, 0.025]} color="#63b9b0" />
      <Block position={[-width * 0.31, -height * 0.28, 0.12]} size={[width * 0.18, 0.035, 0.025]} color="#e7a36b" />
      <Block position={[width * 0.23, height * 0.18, 0.12]} size={[width * 0.28, 0.055, 0.025]} color="#91c9d1" />
      <Block position={[width * 0.23, height * 0.08, 0.12]} size={[width * 0.2, 0.035, 0.025]} color="#d8e2df" />
    </group>
  );
}

function AcousticWallPanel({ x, z, y, width = 2.2, height = 2.5, rotationY = 0 }: {
  x: number; z: number; y: number; width?: number; height?: number; rotationY?: number;
}) {
  return (
    <group position={[x, y, z]} rotation={[0, rotationY, 0]}>
      <Block position={[0, 0, 0]} size={[width, height, 0.18]} color="#35414b" />
      {Array.from({ length: 7 }, (_, i) => (
        <Block key={i} position={[-width * 0.42 + i * width * 0.14, 0, 0.105]} size={[0.035, height * 0.88, 0.025]} color={i % 2 ? "#788b88" : "#bd916e"} />
      ))}
    </group>
  );
}

function CeilingLight({ x, z, y, length = 4.2 }: { x: number; z: number; y: number; length?: number }) {
  return (
    <group position={[x, y + 3.45, z]}>
      <Block position={[0, 0.08, 0]} size={[length, 0.08, 0.16]} color="#66747a" />
      <mesh position={[0, 0.015, 0]} castShadow>
        <boxGeometry args={[length - 0.18, 0.035, 0.12]} />
        <meshStandardMaterial color="#fff4d9" emissive="#ffe6b5" emissiveIntensity={0.72} roughness={0.32} />
      </mesh>
      <Block position={[-length * 0.38, 0.22, 0]} size={[0.035, 0.28, 0.035]} color={C.metal} />
      <Block position={[length * 0.38, 0.22, 0]} size={[0.035, 0.28, 0.035]} color={C.metal} />
    </group>
  );
}

function FloorInlays({ y }: { y: number }) {
  return (
    <group>
      {/* A complete interior floor treatment: warm circulation spine and distinct department carpets. */}
      <Block position={[0, y + 0.19, 0]} size={[5.2, 0.055, 25.5]} color="#d7c8b5" />
      <Block position={[-10.5, y + 0.2, -7.8]} size={[12.2, 0.07, 10.2]} color="#52636a" />
      <Block position={[2.7, y + 0.2, -8]} size={[9.4, 0.07, 10]} color="#b8a18b" />
      <Block position={[11.2, y + 0.2, -6.8]} size={[10.8, 0.07, 12.2]} color="#667f7a" />
      <Block position={[-10.5, y + 0.2, 8.2]} size={[12.2, 0.07, 8.4]} color="#8d9c8d" />
      <Block position={[10.5, y + 0.2, 8.2]} size={[12.2, 0.07, 8.4]} color="#d8c6a9" />
      <Block position={[0, y + 0.24, 0]} size={[1.25, 0.025, 24]} color="#f3e6d4" />
      {[-15, -10, -5, 5, 10, 15].map((x) => (
        <Block key={x} position={[x, y + 0.24, 0]} size={[0.045, 0.018, 24]} color="#f1e8dc" opacity={0.48} />
      ))}
      {[-12, -4, 4, 12].map((z) => (
        <Block key={z} position={[0, y + 0.245, z]} size={[33, 0.018, 0.045]} color="#f1e8dc" opacity={0.5} />
      ))}
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
        {/* Full interior redesign: framed department suites, acoustic walls and a clear central boulevard. */}
        <LowPartition x={-10.8} z={-13.1} y={y} length={11.8} color="#394a52" />
        <LowPartition x={-16.5} z={-7.8} y={y} length={10.2} axis="z" color="#394a52" />
        <GlassRun x={-4.8} z={-8.1} y={y} length={9.5} axis="z" height={2.65} tint="#a9cbd0" />
        <GlassRun x={-10.8} z={-2.9} y={y} length={11.5} height={2.65} tint="#a9cbd0" />
        <LowPartition x={5.1} z={-13.1} y={y} length={10.5} color="#8c7059" />
        <GlassRun x={5.1} z={-7.5} y={y} length={11.2} axis="z" height={2.75} tint="#b7d4d3" />
        <GlassRun x={11.1} z={-1.8} y={y} length={8.5} height={2.75} tint="#b7d4d3" />
        <LowPartition x={-10.8} z={3.7} y={y} length={11.8} color="#789087" />
        <LowPartition x={10.8} z={3.7} y={y} length={11.8} color="#b28a66" />
        <GlassRun x={-16.5} z={8.1} y={y} length={8.4} axis="z" height={2.2} tint="#b7d4d3" />
        <GlassRun x={16.5} z={8.1} y={y} length={8.4} axis="z" height={2.2} tint="#b7d4d3" />
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
      {levelId === "floor-2" ? (
        <>
          <FloorInlays y={y} />
          <CeilingLight x={-10} z={0} y={y} length={5.2} />
          <CeilingLight x={0} z={0} y={y} length={5.2} />
          <CeilingLight x={8} z={-7} y={y} length={4.4} />
          <CeilingLight x={-11} z={-8} y={y} length={4.4} />
          <CeilingLight x={-10} z={10} y={y} length={3.4} />
          <CeilingLight x={10} z={10} y={y} length={3.4} />
        </>
      ) : null}
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
          {/* ENGINEERING: six properly aligned workstations, dual rows, shared aisle. */}
          {[-13, -8, -3].map((x) => <Desk key={`eng-a-${x}`} x={x} z={-5.4} y={y} />)}
          {[-13, -8, -3].map((x) => <Desk key={`eng-b-${x}`} x={x} z={-0.4} y={y} />)}
          <DepartmentSign x={-10.5} z={-12.4} y={y} labelColor="#5d9aa0" />
          <WallDisplay x={-10.5} z={-13.55} y={y + 2.35} width={5.8} height={2.15} />
          <Bookcase x={-16} z={-2.5} y={y} />
          <Plant x={-16} z={-11} y={y} />

          {/* CREATIVE STUDIO: enclosed acoustic suite with editing desks and review screen. */}
          <Desk x={-13.2} z={6.1} y={y} />
          <Desk x={-8.2} z={6.1} y={y} />
          <Desk x={-13.2} z={10.5} y={y} />
          <WallDisplay x={-10.7} z={13.35} y={y + 2.2} width={5.5} height={2.0} rotationY={Math.PI} />
          <AcousticWallPanel x={-16.7} z={7.5} y={y + 2.0} width={1.6} height={2.1} rotationY={Math.PI / 2} />
          <AcousticWallPanel x={-5.2} z={7.5} y={y + 2.0} width={1.6} height={2.1} rotationY={Math.PI / 2} />
          <DepartmentSign x={-10.5} z={4.2} y={y} labelColor="#b77b54" />

          {/* EXECUTIVE MEETING: boardroom with eight seats, display and presentation wall. */}
          <MeetingTable x={7.1} z={-8.2} y={y} seats={8} />
          <WallDisplay x={7.1} z={-13.55} y={y + 2.45} width={5.2} height={2.3} />
          <Bookcase x={15.2} z={-11.8} y={y} />
          <Plant x={15.2} z={-5.2} y={y} />
          <DepartmentSign x={7.1} z={-12.5} y={y} labelColor="#c78b55" />

          {/* R&D LAB: server equipment, monitoring display and test bench. */}
          <ServerRack x={14.1} z={0.2} y={y} />
          <ServerRack x={14.1} z={3.1} y={y} />
          <ServerRack x={10.8} z={0.2} y={y} />
          <WallDisplay x={16.1} z={1.6} y={y + 2.35} width={3.2} height={1.8} rotationY={Math.PI / 2} />
          <Desk x={7.3} z={1.0} y={y} />
          <DepartmentSign x={11.2} z={-3.2} y={y} labelColor="#5b8b7d" />

          {/* LOUNGE: reception sofa, paired armchairs, coffee table and plants. */}
          <Sofa x={5.8} z={8.4} y={y} color="#668b86" />
          <OfficeFurnitureModel model="loungeDesignChair" position={[11.2, y + 0.08, 8.1]} scale={2.5} rotationY={-Math.PI / 2} />
          <OfficeFurnitureModel model="loungeDesignChair" position={[11.2, y + 0.08, 11.1]} scale={2.5} rotationY={-Math.PI / 2} />
          <OfficeFurnitureModel model="tableCoffee" position={[8.6, y + 0.1, 9.7]} scale={2.2} />
          <OfficeFurnitureModel model="lampRoundFloor" position={[4.3, y, 11.2]} scale={2.6} />
          <Plant x={14.8} z={12} y={y} />
          <DepartmentSign x={8.6} z={5.0} y={y} labelColor="#78947b" />

          {/* PANTRY: fitted kitchen wall, fridge, coffee bar and dining table. */}
          <CoffeeStation x={-1.2} z={10.4} y={y} />
          <OfficeFurnitureModel model="tableRound" position={[2.8, y + 0.12, 9.5]} scale={2.1} />
          <OfficeFurnitureModel model="chairModernCushion" position={[0.4, y + 0.08, 9.5]} scale={2.0} />
          <OfficeFurnitureModel model="chairModernCushion" position={[5.2, y + 0.08, 9.5]} scale={2.0} rotationY={Math.PI} />
          <Plant x={-4.0} z={12} y={y} />
          <DepartmentSign x={1.9} z={5.0} y={y} labelColor="#d19b59" />

          {/* Shared central collaboration island; intentionally keeps the circulation spine open. */}
          <OfficeFurnitureModel model="table" position={[0.1, y + 0.35, -1.0]} scale={[2.8, 1.2, 1.9]} />
          <OfficeFurnitureModel model="chairModernCushion" position={[-1.8, y + 0.08, -1.0]} scale={1.8} />
          <OfficeFurnitureModel model="chairModernCushion" position={[2.0, y + 0.08, -1.0]} scale={1.8} rotationY={Math.PI} />
          <Plant x={-2.2} z={3.1} y={y} />
          <Plant x={2.4} z={3.1} y={y} />

          {/* Interior lighting grid and wall-mounted wayfinding. */}
          <CeilingLight x={-10.5} z={-6.5} y={y} length={5.5} />
          <CeilingLight x={-10.5} z={8.4} y={y} length={5.0} />
          <CeilingLight x={7.5} z={-8.2} y={y} length={5.2} />
          <CeilingLight x={11.2} z={1.2} y={y} length={4.2} />
          <CeilingLight x={1.8} z={9.2} y={y} length={4.0} />
          <CeilingLight x={0} z={-2.4} y={y} length={4.6} />
          <Plant x={-16} z={12} y={y} />
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
