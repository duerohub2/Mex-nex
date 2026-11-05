"use client";

import { useEffect, useRef } from "react";
import {
  MEX_NEX_AGENT_ASSETS,
  MEX_NEX_OWNER_AVATAR,
  type OfficeCharacterAsset,
} from "@/features/office-world-2d/characterAssets";
import { removeConnectedSpriteBackdrop } from "@/features/office-world-2d/removeSpriteBackdrop";

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

        constructor() {
          super("mex-nex-pixel-hq");
        }

        preload() {
          for (const asset of characterAssets) {
            this.load.image(asset.id, asset.src);
          }
          this.load.image(
            "desk",
            "/office-assets/claude-office/furniture/standing-desk-left-front.png",
          );
          this.load.image(
            "plant",
            "/office-assets/claude-office/decoration/monstera-plant.png",
          );
          this.load.image(
            "whiteboard",
            "/office-assets/claude-office/decoration/white-board.png",
          );
          this.load.image(
            "coffee",
            "/office-assets/claude-office/appliances/coffee-on.png",
          );
          this.load.image(
            "tasks",
            "/office-assets/claude-office/culture/todo-board.png",
          );
        }

        create() {
          // The original JPG exports include checkerboard/white backgrounds.
          // Key only border-connected neutral pixels so the sprites render cleanly.
          for (const asset of characterAssets) {
            const source = this.textures.get(asset.id).getSourceImage();
            const cutout = removeConnectedSpriteBackdrop(
              source as HTMLImageElement | HTMLCanvasElement,
            );
            this.textures.addCanvas(`${asset.id}-cutout`, cutout);
          }

          const g = this.add.graphics();
          g.fillStyle(0x17252a, 1).fillRect(0, 0, 1600, 1000);
          g.fillStyle(0x344b4a, 1).fillPoints(
            [
              new Phaser.Geom.Point(800, 55),
              new Phaser.Geom.Point(1515, 425),
              new Phaser.Geom.Point(800, 865),
              new Phaser.Geom.Point(85, 425),
            ],
            true,
          );
          g.lineStyle(2, 0x668078, 0.35);
          for (let i = -10; i <= 10; i += 1) {
            const y = 425 + i * 35;
            g.lineBetween(
              800 - (y - 425) * 1.93,
              y,
              800 + (y - 425) * 1.93,
              y,
            );
          }
          for (let i = 0; i <= 20; i += 1) {
            const x = 110 + i * 69;
            g.lineBetween(
              x,
              425 - Math.abs(x - 800) * 0.518,
              x,
              425 + Math.abs(x - 800) * 0.518,
            );
          }

          this.zone(g, 420, 365, 430, 245, 0x6b8b75, "ENGINEERING");
          this.zone(g, 1040, 365, 390, 245, 0x6686a0, "OPERATIONS");
          this.zone(g, 465, 650, 380, 190, 0x987b9b, "CREATIVE STUDIO");
          this.zone(g, 1080, 650, 390, 190, 0xc18b5c, "COLLABORATION");

          g.fillStyle(0x263d42, 0.98);
          g.fillPoints(
            [
              new Phaser.Geom.Point(800, 55),
              new Phaser.Geom.Point(1515, 425),
              new Phaser.Geom.Point(1515, 390),
              new Phaser.Geom.Point(800, 20),
            ],
            true,
          );
          g.fillPoints(
            [
              new Phaser.Geom.Point(85, 425),
              new Phaser.Geom.Point(800, 55),
              new Phaser.Geom.Point(800, 20),
              new Phaser.Geom.Point(85, 390),
            ],
            true,
          );
          g.lineStyle(5, 0x9bc5c1, 0.75);
          g.lineBetween(800, 65, 800, 800);
          g.lineBetween(220, 520, 1390, 520);
          g.lineStyle(2, 0xd4e8db, 0.55);
          g.lineBetween(800, 65, 1510, 425);
          g.lineBetween(800, 65, 90, 425);

          [[500, 365], [675, 455], [1000, 365], [1190, 465], [430, 650], [1130, 680]].forEach(
            ([x, y]) => this.add.image(x, y, "desk").setScale(0.22).setDepth(y - 20),
          );
          this.add.image(260, 285, "whiteboard").setScale(0.22).setDepth(270);
          this.add.image(1300, 290, "tasks").setScale(0.18).setDepth(275);
          this.add.image(1320, 690, "coffee").setScale(0.24).setDepth(680);
          this.add.image(250, 675, "plant").setScale(0.23).setDepth(680);
          this.add.image(1450, 610, "plant").setScale(0.2).setDepth(610);
          this.add.image(790, 270, "plant").setScale(0.19).setDepth(270);

          const addCharacter = (asset: OfficeCharacterAsset, isOwner = false) => {
            const group = this.add.container(asset.x, asset.y).setDepth(asset.y + 20);
            const shadow = this.add.ellipse(
              0,
              5,
              isOwner ? 62 : 48,
              isOwner ? 20 : 15,
              isOwner ? 0x172522 : 0x0b1515,
              0.38,
            );
            const sprite = this.add
              .image(0, 0, `${asset.id}-cutout`)
              .setScale(isOwner ? 0.22 : 0.18)
              .setOrigin(0.5, 0.9);
            const name = this.add
              .text(0, isOwner ? -123 : -108, isOwner ? "DUERO · PEMILIK" : asset.name, {
                fontFamily: "Arial",
                fontSize: isOwner ? "15px" : "11px",
                color: isOwner ? "#fff1b8" : "#fff7dd",
                fontStyle: "bold",
                backgroundColor: isOwner ? "#76512c" : "#243b3c",
                padding: { x: 7, y: 4 },
              })
              .setOrigin(0.5);
            const role = this.add
              .text(0, isOwner ? -98 : -88, asset.role, {
                fontFamily: "Arial",
                fontSize: isOwner ? "11px" : "9px",
                color: "#f4ead5",
                backgroundColor: "#527e69",
                padding: { x: 5, y: 3 },
              })
              .setOrigin(0.5);

            group.add([shadow, sprite, name, role]);
            group.setSize(90, 145);
            group.setInteractive(
              new Phaser.Geom.Rectangle(-48, -135, 96, 145),
              Phaser.Geom.Rectangle.Contains,
            );
            group.on("pointerdown", () => {
              this.add
                .text(asset.x + 52, asset.y - 25, asset.role, {
                  fontFamily: "Arial",
                  fontSize: "13px",
                  color: "#fff",
                  backgroundColor: "#182f36",
                  padding: { x: 8, y: 7 },
                })
                .setDepth(950);
            });
            this.tweens.add({
              targets: sprite,
              y: -3,
              duration: isOwner ? 1550 : 1250,
              yoyo: true,
              repeat: -1,
              ease: "Sine.easeInOut",
            });
          };

          MEX_NEX_AGENT_ASSETS.forEach((asset) => addCharacter(asset));
          addCharacter(MEX_NEX_OWNER_AVATAR, true);

          this.add
            .text(800, 115, "MEX-NEX · HEADQUARTERS", {
              fontFamily: "Arial",
              fontSize: "24px",
              color: "#f7e9c8",
              fontStyle: "bold",
              letterSpacing: 4,
            })
            .setOrigin(0.5);

          const camera = this.cameras.main;
          camera.setBounds(0, 0, 1600, 1000);
          const fit = () =>
            camera.setZoom(Math.min(this.scale.width / 1600, this.scale.height / 1000) * 1.12);
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

        private zone(
          g: import("phaser").GameObjects.Graphics,
          x: number,
          y: number,
          w: number,
          h: number,
          color: number,
          label: string,
        ) {
          g.fillStyle(color, 0.18).fillRoundedRect(x - w / 2, y - h / 2, w, h, 24);
          g.lineStyle(3, color, 0.75).strokeRoundedRect(x - w / 2, y - h / 2, w, h, 24);
          this.add
            .text(x, y - h / 2 + 16, label, {
              fontFamily: "Arial",
              fontSize: "15px",
              color: "#f5ead2",
              fontStyle: "bold",
              letterSpacing: 2,
            })
            .setOrigin(0.5);
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: host.current,
        backgroundColor: "#17252a",
        scale: {
          mode: Phaser.Scale.RESIZE,
          width: "100%",
          height: "100%",
        },
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
      aria-label="Pratinjau kantor pixel art MEX-NEX dengan karakter batik"
    />
  );
}
