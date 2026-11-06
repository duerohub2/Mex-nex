"use client";

import { useEffect, useRef } from "react";
import {
  MEX_NEX_AGENT_ASSETS,
  MEX_NEX_OWNER_AVATAR,
  type OfficeCharacterAsset,
} from "@/features/office-world-2d/characterAssets";

const OFFICE_BACKGROUND = "/office-assets/backgrounds/mex-nex-office-main.png";

export function PixelHQPreview() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let game: import("phaser").Game | undefined;
    let disposed = false;

    void import("phaser").then((Phaser) => {
      if (disposed || !host.current) return;

      const characterAssets: readonly OfficeCharacterAsset[] = [
        ...MEX_NEX_AGENT_ASSETS,
        MEX_NEX_OWNER_AVATAR,
      ];

      class PixelOfficeScene extends Phaser.Scene {
        private dragPoint?: { x: number; y: number };
        private selectedLabel?: import("phaser").GameObjects.Text;

        constructor() {
          super("mex-nex-user-office-art-preview");
        }

        preload() {
          this.load.image("mex-nex-office", OFFICE_BACKGROUND);
          for (const asset of characterAssets) {
            this.load.image(asset.id, asset.src);
          }
        }

        create() {
          this.cameras.main.setBackgroundColor("#182b2c");

          // Use the office illustration uploaded by the user as the actual
          // environment. Do not draw replacement walls, floors, rooms or props.
          const office = this.add.image(800, 510, "mex-nex-office");
          office.setDisplaySize(1450, 810);
          office.setDepth(0);

          const floorPositions = new Map(
            characterAssets.map((asset) => [asset.id, { x: asset.x, y: asset.y }]),
          );

          const addCharacter = (asset: OfficeCharacterAsset, isOwner = false) => {
            if (!this.textures.exists(asset.id)) return;
            const position = floorPositions.get(asset.id);
            if (!position) return;

            const group = this.add.container(position.x, position.y);
            group.setDepth(position.y + 10);

            const shadow = this.add.ellipse(
              0,
              3,
              isOwner ? 46 : 38,
              isOwner ? 13 : 11,
              0x111719,
              0.48,
            );
            const sprite = this.add
              .image(0, 0, asset.id)
              .setScale(isOwner ? 0.31 : 0.29)
              .setOrigin(0.5, 0.9);

            const name = this.add
              .text(0, isOwner ? -112 : -103, isOwner ? "PEMILIK · DUERO" : asset.name, {
                fontFamily: "Arial",
                fontSize: isOwner ? "12px" : "10px",
                color: isOwner ? "#fff2c4" : "#fff8e9",
                fontStyle: "bold",
                backgroundColor: isOwner ? "#68482d" : "#243b3c",
                padding: { x: 6, y: 3 },
                stroke: "#101b1c",
                strokeThickness: 2,
              })
              .setOrigin(0.5);

            const role = this.add
              .text(0, isOwner ? -91 : -83, asset.role, {
                fontFamily: "Arial",
                fontSize: "8px",
                color: "#f4ead5",
                backgroundColor: "#527e69",
                padding: { x: 4, y: 2 },
              })
              .setOrigin(0.5);

            group.add([shadow, sprite, name, role]);
            group.setSize(62, 112);
            group.setInteractive(
              new Phaser.Geom.Rectangle(-31, -112, 62, 115),
              Phaser.Geom.Rectangle.Contains,
            );
            group.on("pointerdown", () => {
              this.selectedLabel?.destroy();
              this.selectedLabel = this.add
                .text(position.x + 42, position.y - 26, `${asset.name} · ${asset.role}`, {
                  fontFamily: "Arial",
                  fontSize: "12px",
                  color: "#fff8e9",
                  backgroundColor: "#203c38",
                  padding: { x: 8, y: 6 },
                  stroke: "#101b1c",
                  strokeThickness: 2,
                })
                .setDepth(2000);
            });

            this.tweens.add({
              targets: sprite,
              y: -2,
              duration: isOwner ? 1550 : 1300,
              yoyo: true,
              repeat: -1,
              ease: "Sine.easeInOut",
            });
          };

          characterAssets.forEach((asset) =>
            addCharacter(asset, asset.id === MEX_NEX_OWNER_AVATAR.id),
          );

          this.add
            .text(800, 74, "MEX-NEX · KANTOR UTAMA", {
              fontFamily: "Arial",
              fontSize: "23px",
              color: "#fff3dc",
              fontStyle: "bold",
              letterSpacing: 3,
              stroke: "#152322",
              strokeThickness: 4,
            })
            .setOrigin(0.5)
            .setDepth(1500);

          const camera = this.cameras.main;
          camera.setBounds(0, 0, 1600, 1000);
          const fit = () =>
            camera.setZoom(Math.min(this.scale.width / 1600, this.scale.height / 1000) * 1.08);
          fit();
          this.scale.on("resize", fit);

          this.input.on("pointerdown", (pointer: import("phaser").Input.Pointer) => {
            this.dragPoint = { x: pointer.x, y: pointer.y };
          });
          this.input.on("pointerup", () => {
            this.dragPoint = undefined;
          });
          this.input.on("pointermove", (pointer: import("phaser").Input.Pointer) => {
            if (this.dragPoint && pointer.isDown) {
              camera.scrollX -= (pointer.x - this.dragPoint.x) / camera.zoom;
              camera.scrollY -= (pointer.y - this.dragPoint.y) / camera.zoom;
              this.dragPoint = { x: pointer.x, y: pointer.y };
            }
          });
          this.input.on("wheel", (_pointer: unknown, _objects: unknown, _dx: number, dy: number) => {
            camera.setZoom(Phaser.Math.Clamp(camera.zoom - dy * 0.001, 0.45, 1.45));
          });
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: host.current,
        backgroundColor: "#182b2c",
        scale: { mode: Phaser.Scale.RESIZE, width: "100%", height: "100%" },
        render: { antialias: false, pixelArt: true, roundPixels: true },
        scene: [PixelOfficeScene],
        banner: false,
      });
    });

    return () => {
      disposed = true;
      game?.destroy(true);
    };
  }, []);

  return (
    <div
      ref={host}
      className="h-full min-h-[520px] w-full overflow-hidden rounded-2xl"
      aria-label="Pratinjau kantor MEX-NEX menggunakan artwork kantor yang diunggah dan karakter Agent"
    />
  );
}
