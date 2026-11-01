"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { OrthographicCameraConfig } from "@/lib/office-world/renderer";

/** Animates camera presets, then releases the camera to OrbitControls. */
export function LivingHQCameraRig({ config }: { config: OrthographicCameraConfig }) {
  const { camera, controls } = useThree();
  const targetPosition = useRef(new THREE.Vector3(...config.position));
  const targetLookAt = useRef(new THREE.Vector3(...config.target));
  const targetZoom = useRef(config.zoom);
  const transitioning = useRef(true);

  useEffect(() => {
    targetPosition.current.set(...config.position);
    targetLookAt.current.set(...config.target);
    targetZoom.current = config.zoom;
    transitioning.current = true;
  }, [config]);

  useFrame(() => {
    if (!transitioning.current) return;

    camera.position.lerp(targetPosition.current, 0.12);
    // Imperative camera animation belongs in the render loop.
    // eslint-disable-next-line react-hooks/immutability
    camera.zoom = THREE.MathUtils.lerp(camera.zoom, targetZoom.current, 0.12);
    camera.updateProjectionMatrix();

    const orbit = controls as { target?: THREE.Vector3; update?: () => void } | null;
    if (orbit?.target) {
      orbit.target.lerp(targetLookAt.current, 0.12);
      orbit.update?.();
    } else {
      camera.lookAt(targetLookAt.current);
    }

    if (
      camera.position.distanceToSquared(targetPosition.current) < 0.0001 &&
      Math.abs(camera.zoom - targetZoom.current) < 0.001 &&
      (!orbit?.target || orbit.target.distanceToSquared(targetLookAt.current) < 0.0001)
    ) {
      camera.position.copy(targetPosition.current);
      camera.zoom = targetZoom.current;
      camera.updateProjectionMatrix();
      transitioning.current = false;
    }
  });

  return null;
}
