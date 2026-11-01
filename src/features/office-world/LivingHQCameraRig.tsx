"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { OrthographicCameraConfig } from "@/lib/office-world/renderer";

/**
 * Applies a camera preset only when the selected view changes.
 * Any user interaction immediately cancels the transition so the camera
 * never fights OrbitControls or snaps back while the user is inspecting.
 */
export function LivingHQCameraRig({ config }: { config: OrthographicCameraConfig }) {
  const { camera, controls } = useThree();
  const targetPosition = useRef(new THREE.Vector3(...config.position));
  const targetLookAt = useRef(new THREE.Vector3(...config.target));
  const targetZoom = useRef(config.zoom);
  const transitioning = useRef(true);

  const [px, py, pz] = config.position;
  const [tx, ty, tz] = config.target;
  const zoom = config.zoom;

  useEffect(() => {
    const orbit = controls as {
      addEventListener?: (type: string, listener: () => void) => void;
      removeEventListener?: (type: string, listener: () => void) => void;
    } | null;

    const cancelTransition = () => {
      transitioning.current = false;
    };

    orbit?.addEventListener?.("start", cancelTransition);
    return () => orbit?.removeEventListener?.("start", cancelTransition);
  }, [controls]);

  useEffect(() => {
    targetPosition.current.set(px, py, pz);
    targetLookAt.current.set(tx, ty, tz);
    targetZoom.current = zoom;
    transitioning.current = true;
  }, [
    px, py, pz, tx, ty, tz, zoom,
  ]);

  useFrame(() => {
    if (!transitioning.current) return;

    camera.position.lerp(targetPosition.current, 0.12);
    // Camera animation is intentionally performed in the render loop.
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
