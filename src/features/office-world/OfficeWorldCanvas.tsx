"use client";

import { Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import {
  BUILDING_CAMERA_CONFIG,
  OFFICE_LIGHTING,
  type OrthographicCameraConfig,
} from "@/lib/office-world/renderer";
import { SCENE_LAYERS } from "@/lib/office-world/world";

type OfficeWorldCanvasProps = {
  children?: ReactNode;
  camera?: OrthographicCameraConfig;
  className?: string;
  fallback?: ReactNode;
  interactive?: boolean;
  shadows?: boolean;
};

function WorldLighting() {
  return (
    <>
      <hemisphereLight
        args={[
          OFFICE_LIGHTING.hemisphere.skyColor,
          OFFICE_LIGHTING.hemisphere.groundColor,
          OFFICE_LIGHTING.hemisphere.intensity,
        ]}
      />
      <ambientLight
        color={OFFICE_LIGHTING.ambient.color}
        intensity={OFFICE_LIGHTING.ambient.intensity}
      />
      <directionalLight
        color={OFFICE_LIGHTING.key.color}
        intensity={OFFICE_LIGHTING.key.intensity}
        position={OFFICE_LIGHTING.key.position}
        castShadow={OFFICE_LIGHTING.key.castShadow}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-36}
        shadow-camera-right={36}
        shadow-camera-top={36}
        shadow-camera-bottom={-36}
      />
      <directionalLight
        color={OFFICE_LIGHTING.fill.color}
        intensity={OFFICE_LIGHTING.fill.intensity}
        position={OFFICE_LIGHTING.fill.position}
      />
    </>
  );
}

/**
 * Shared renderer shell for the Living HQ world.
 * Geometry is supplied by later stages; this component owns camera, lighting,
 * layer boundaries and safe mobile-oriented rendering defaults.
 */
export function OfficeWorldCanvas({
  children,
  camera = BUILDING_CAMERA_CONFIG,
  className,
  fallback = (
    <div role="status" className="flex h-full min-h-64 items-center justify-center rounded-xl bg-neutral-100 p-6 text-center text-sm text-neutral-700">
      Tampilan 3D tidak tersedia di perangkat ini. Gunakan tampilan 2D atau coba browser yang mendukung WebGL.
    </div>
  ),
  interactive = true,
  shadows = true,
}: OfficeWorldCanvasProps) {
  return (
    <div className={className ?? "relative h-full min-h-64 w-full overflow-hidden"}>
      <Canvas
        orthographic
        dpr={[1, 1.5]}
        shadows={shadows ? "soft" : false}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "low-power",
        }}
        fallback={fallback}
      >
        <OrthographicCamera
          makeDefault
          position={camera.position}
          zoom={camera.zoom}
          near={camera.near}
          far={camera.far}
          onUpdate={(instance) => {
            instance.lookAt(...camera.target);
            instance.updateProjectionMatrix();
          }}
        />
        <WorldLighting />
        <Suspense fallback={null}>
          {SCENE_LAYERS.map((layer) => (
            <group key={layer.id} name={`office-world:${layer.id}`}>
              {layer.id === "environment" ? children : null}
            </group>
          ))}
        </Suspense>
        {interactive ? (
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.12}
            minZoom={camera.minZoom}
            maxZoom={camera.maxZoom}
            minPolarAngle={0.15}
            maxPolarAngle={Math.PI / 2.05}
            enablePan
          />
        ) : null}
      </Canvas>
    </div>
  );
}
