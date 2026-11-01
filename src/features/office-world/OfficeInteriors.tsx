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

function LevelInterior({ levelId, elevation }: { levelId: OfficeLevelId; elevation: number }) {
  const y = elevation + 0.22;
  return (
    <group name={`interior:${levelId}`}>
      <ElevatorAndStairs y={y} />
      {levelId === "basement" ? (
        <>
          {[ -10, -6, -2, 2 ].map((x) => <ServerRack key={x} x={x} z={-1} y={y} />)}
          <Block position={[9, y + 0.7, 1]} size={[8, 1.4, 5]} color={C.concrete} />
          <DepartmentSign x={-5} z={-5} y={y} />
          <Plant x={15} z={9} y={y} />\n          <Bookcase x={9} z={-7} y={y} />\n          <CoffeeStation x={-13} z={6} y={y} />
        </>
      ) : levelId === "floor-1" ? (
        <>
          <Block position={[0, y + 0.62, 7]} size={[8, 1.24, 3.2]} color={C.cream} />
          <Block position={[0, y + 1.35, 7]} size={[8.2, 0.18, 3.4]} color={C.wood} />
          <MeetingTable x={-6} z={-1} y={y} seats={4} />
          <Desk x={7} z={-3} y={y} />
          <DepartmentSign x={0} z={-12} y={y} />
          <Plant x={-14} z={8} y={y} />
          <Plant x={14} z={8} y={y} />\n          <Sofa x={9} z={8} y={y} />
          <OfficeFurnitureModel model="loungeDesignChair" position={[5.5, y + 0.08, 8.5]} scale={2.8} rotationY={Math.PI / 2} />
          <OfficeFurnitureModel model="tableCoffee" position={[8.2, y + 0.1, 8.1]} scale={2.7} />
          <OfficeFurnitureModel model="lampRoundFloor" position={[11.5, y, 7.3]} scale={3.1} />\n          <CoffeeStation x={-13} z={7} y={y} />
        </>
      ) : levelId === "floor-2" ? (
        <>
          {[-10, -4, 4, 10].map((x) => <Desk key={x} x={x} z={1} y={y} />)}
          {[-10, -4, 4, 10].map((x) => <Desk key={x} x={x} z={7} y={y} />)}
          <DepartmentSign x={0} z={-12} y={y} />
          <Plant x={-15} z={10} y={y} />
          <Plant x={15} z={10} y={y} />\n          <Bookcase x={-15} z={-7} y={y} />\n          <Sofa x={0} z={-8} y={y} color="#668b86" />
          <OfficeFurnitureModel model="loungeDesignChair" position={[-4.2, y + 0.08, -7.2]} scale={2.8} rotationY={-Math.PI / 2} />
          <OfficeFurnitureModel model="tableCoffee" position={[0.2, y + 0.1, -8.1]} scale={2.5} />
        </>
      ) : levelId === "floor-3" ? (
        <>
          {[-10, -4, 4, 10].map((x) => <Desk key={x} x={x} z={-1} y={y} />)}
          <MeetingTable x={0} z={8} y={y} seats={6} />
          <DepartmentSign x={0} z={-12} y={y} labelColor={C.screen} />
          <Plant x={-15} z={9} y={y} />\n          <Bookcase x={15} z={-8} y={y} />\n          <CoffeeStation x={-13} z={7} y={y} />
        </>
      ) : levelId === "floor-4" ? (
        <>
          <MeetingTable x={-5} z={-1} y={y} seats={8} />
          <Desk x={9} z={-3} y={y} />
          <Block position={[9, y + 0.65, 5]} size={[6, 1.3, 3.2]} color={C.cream} />
          <DepartmentSign x={0} z={-12} y={y} />
          <Plant x={-14} z={9} y={y} />
          <Plant x={14} z={9} y={y} />\n          <Sofa x={9} z={8} y={y} color="#7f8e9b" />
          <OfficeFurnitureModel model="loungeDesignChair" position={[5.5, y + 0.08, 8.5]} scale={2.8} rotationY={Math.PI / 2} />
          <OfficeFurnitureModel model="tableCoffee" position={[8.2, y + 0.1, 8.1]} scale={2.7} />\n          <Bookcase x={-14} z={-8} y={y} />
        </>
      ) : (
        <>
          <Block position={[0, y + 0.12, 2]} size={[18, 0.24, 12]} color={C.green} />
          {[-7, 0, 7].map((x) => <Plant key={x} x={x} z={2} y={y + 0.25} />)}
          <Block position={[-10, y + 0.65, -8]} size={[5, 1.3, 2.5]} color={C.cream} />
          <Block position={[10, y + 0.65, -8]} size={[5, 1.3, 2.5]} color={C.cream} />
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
