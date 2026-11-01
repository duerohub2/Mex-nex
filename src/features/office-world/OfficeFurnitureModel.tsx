"use client";

import { Suspense, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Mesh } from "three";

type FurnitureModelName =
  | "bookcaseClosed"
  | "chairDesk"
  | "chairModernCushion"
  | "computerScreen"
  | "desk"
  | "deskCorner"
  | "kitchenCabinet"
  | "kitchenCoffeeMachine"
  | "kitchenFridgeSmall"
  | "lampRoundFloor"
  | "loungeDesignChair"
  | "loungeSofa"
  | "plantSmall1"
  | "pottedPlant"
  | "table"
  | "tableCoffee"
  | "tableRound";

type Props = {
  model: FurnitureModelName;
  position: [number, number, number];
  scale?: number | [number, number, number];
  rotationY?: number;
};

function LoadedFurniture({ model, position, scale = 1, rotationY = 0 }: Props) {
  const { scene } = useGLTF(`/office-assets/models/furniture/${model}.glb`);
  const instance = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return <primitive object={instance} position={position} scale={scale} rotation={[0, rotationY, 0]} />;
}

export function OfficeFurnitureModel(props: Props) {
  return (
    <Suspense fallback={null}>
      <LoadedFurniture {...props} />
    </Suspense>
  );
}
