"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { OrthographicCameraConfig } from "@/lib/office-world/renderer";

/** Smoothly moves the active camera when the selected floor changes. */
export function LivingHQCameraRig({ config }: { config: OrthographicCameraConfig }) {
  const { camera, controls } = useThree();
  const targetPosition = useRef(new THREE.Vector3(...config.position));
  const targetLookAt = useRef(new THREE.Vector3(...config.target));
  const targetZoom = useRef(config.zoom);

  useEffect(() => {
    targetPosition.current.set(...config.position);
    targetLookAt.current.set(...config.target);
    targetZoom.current = config.zoom;
  }, [config]);

  useFrame(() => {
    camera.position.lerp(targetPosition.current, 0.055);
    // R3F camera animation is an intentional imperative render-loop update.\n    // eslint-disable-next-line react-hooks/immutability\n    camera.zoom = THREE.MathUtils.lerp(camera.zoom, targetZoom.current, 0.055);
    camera.updateProjectionMatrix();
    if ("lookAt" in camera) camera.lookAt(targetLookAt.current);
    const orbit = controls as { target?: THREE.Vector3; update?: () => void } | null;
    if (orbit?.target) {
      orbit.target.lerp(targetLookAt.current, 0.055);
      orbit.update?.();
    }
  });

  return null;
}
