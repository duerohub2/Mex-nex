"use client";

function Box({ position, size, color }: { position: [number, number, number]; size: [number, number, number]; color: string }) {
  return <mesh position={position} receiveShadow castShadow><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={0.9}/></mesh>;
}

function Tree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return <group position={[x, 0, z]} scale={scale}>
    <mesh position={[0, 1.2, 0]} castShadow><cylinderGeometry args={[0.18, 0.28, 2.4, 7]}/><meshStandardMaterial color="#89634a"/></mesh>
    <mesh position={[0, 3, 0]} castShadow><icosahedronGeometry args={[1.35, 1]}/><meshStandardMaterial color="#66865c" roughness={1}/></mesh>
    <mesh position={[0.65, 3.45, 0.1]} castShadow><icosahedronGeometry args={[0.8, 1]}/><meshStandardMaterial color="#7d9b68" roughness={1}/></mesh>
  </group>;
}

function StreetLamp({ x, z }: { x: number; z: number }) {
  return <group position={[x, 0, z]}>
    <mesh position={[0, 2.1, 0]}><cylinderGeometry args={[0.07, 0.1, 4.2, 8]}/><meshStandardMaterial color="#596a70" metalness={0.55}/></mesh>
    <mesh position={[0.38, 4.05, 0]} rotation={[0, 0, -0.35]}><boxGeometry args={[0.9, 0.08, 0.08]}/><meshStandardMaterial color="#596a70"/></mesh>
    <mesh position={[0.78, 3.92, 0]}><sphereGeometry args={[0.22, 10, 8]}/><meshStandardMaterial color="#ffe4a6" emissive="#e9b76c" emissiveIntensity={0.45}/></mesh>
  </group>;
}

function CityBlock({ x, z, width, depth, height, color }: { x: number; z: number; width: number; depth: number; height: number; color: string }) {
  return <group position={[x, 0, z]}>
    <Box position={[0, height / 2, 0]} size={[width, height, depth]} color={color}/>
    {Array.from({length: Math.max(2, Math.floor(height / 2))}, (_, i) => <group key={i}>
      {Array.from({length: Math.max(2, Math.floor(width / 2.5))}, (_, j) => <Box key={j} position={[-width/2+1+j*2.5, 1.2+i*2.2, depth/2+0.015]} size={[0.9, 1.05, 0.04]} color={i%2 ? "#a8c6c5" : "#d6b58e"}/>)}
    </group>)}
    <Box position={[0, height+0.12, 0]} size={[width+0.4, 0.24, depth+0.4]} color="#8b7667"/>
  </group>;
}

/** Low-poly landscaped campus and distant city context around the HQ. */
export function LivingHQEnvironment() {
  return <group name="mex-nex-campus-environment">
    <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -5.05, 0]} receiveShadow>
      <planeGeometry args={[240, 240]}/><meshStandardMaterial color="#a9b99b" roughness={1}/>
    </mesh>
    <Box position={[0, -4.88, 0]} size={[52, 0.18, 44]} color="#c7b9a4"/>
    <Box position={[0, -4.76, 25]} size={[240, 0.12, 10]} color="#777f7c"/>
    <Box position={[0, -4.68, 25]} size={[240, 0.035, 0.22]} color="#f3d58b"/>
    <CityBlock x={-48} z={-35} width={18} depth={16} height={17} color="#d8c5ac"/>
    <CityBlock x={-25} z={-43} width={13} depth={14} height={11} color="#b9c9c4"/>
    <CityBlock x={25} z={-42} width={17} depth={15} height={22} color="#d1b49b"/>
    <CityBlock x={49} z={-30} width={20} depth={18} height={14} color="#c3b5a4"/>
    <CityBlock x={-52} z={18} width={16} depth={18} height={13} color="#c4d0c5"/>
    <CityBlock x={50} z={17} width={18} depth={16} height={19} color="#d9c3a7"/>
    {[-31, -22, 22, 31].map((x, i) => <Tree key={x} x={x} z={i%2 ? 18 : -19} scale={i%2 ? 1.15 : 0.9}/>)}
    {[-18, 18].map((x) => <Tree key={x} x={x} z={31} scale={1.1}/>)}
    {[-24, 24].map((x) => <StreetLamp key={x} x={x} z={18}/>)}
    <Box position={[-24, -4.72, 0]} size={[5, 0.35, 8]} color="#d8c5ac"/>
    <Box position={[24, -4.72, 0]} size={[5, 0.35, 8]} color="#d8c5ac"/>
  </group>;
}
