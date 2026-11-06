"use client";

import { useEffect, useRef } from "react";
import {
  MEX_NEX_AGENT_ASSETS,
  MEX_NEX_OWNER_AVATAR,
  type OfficeCharacterAsset,
} from "@/features/office-world-2d/characterAssets";

const OFFICE_BACKGROUND = "/office-assets/backgrounds/mex-nex-office-main.png";
const ACTIVE_AGENT_IDS = [
  "agent-01-analyst",
  "agent-07-engineering",
  "agent-10-finance",
  "agent-16-manager",
  "agent-17-receptionist",
] as const;

type WalkPoint = { x: number; y: number };
type MovingCharacter = {
  asset: OfficeCharacterAsset;
  route: readonly WalkPoint[];
  startDelay: number;
  isOwner?: boolean;
};

const WALK_ROUTES: Record<string, readonly WalkPoint[]> = {
  "agent-01-analyst": [
    { x: 405, y: 425 },
    { x: 455, y: 450 },
    { x: 475, y: 425 },
    { x: 425, y: 402 },
  ],
  "agent-07-engineering": [
    { x: 690, y: 330 },
    { x: 742, y: 355 },
    { x: 782, y: 332 },
    { x: 730, y: 307 },
  ],
  "agent-10-finance": [
    { x: 1155, y: 445 },
    { x: 1210, y: 470 },
    { x: 1255, y: 442 },
    { x: 1200, y: 418 },
  ],
  "agent-16-manager": [
    { x: 835, y: 565 },
    { x: 890, y: 590 },
    { x: 935, y: 563 },
    { x: 885, y: 538 },
  ],
  "agent-17-receptionist": [
    { x: 385, y: 675 },
    { x: 438, y: 703 },
    { x: 485, y: 675 },
    { x: 432, y: 648 },
  ],
  "owner-avatar": [
    { x: 805, y: 795 },
    { x: 858, y: 818 },
    { x: 910, y: 790 },
    { x: 855, y: 765 },
  ],
};

const MOVING_CHARACTERS: readonly MovingCharacter[] = [
  ...MEX_NEX_AGENT_ASSETS
    .filter((asset) => ACTIVE_AGENT_IDS.includes(asset.id as (typeof ACTIVE_AGENT_IDS)[number]))
    .map((asset, index) => ({
      asset,
      route: WALK_ROUTES[asset.id] ?? [{ x: asset.x, y: asset.y }],
      startDelay: index * 420,
    })),
  {
    asset: MEX_NEX_OWNER_AVATAR,
    route: WALK_ROUTES["owner-avatar"],
    startDelay: 5 * 420,
    isOwner: true,
  },
];

function trimTransparentSprite(source: HTMLImageElement | HTMLCanvasElement) {
  const sourceWidth =
    source instanceof HTMLImageElement ? source.naturalWidth : source.width;
  const sourceHeight =
    source instanceof HTMLImageElement ? source.naturalHeight : source.height;
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = sourceWidth;
  sourceCanvas.height = sourceHeight;
  const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!sourceContext || sourceWidth === 0 || sourceHeight === 0) return sourceCanvas;

  sourceContext.drawImage(source, 0, 0, sourceWidth, sourceHeight);
  const pixels = sourceContext.getImageData(0, 0, sourceWidth, sourceHeight).data;
  let left = sourceWidth;
  let top = sourceHeight;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < sourceHeight; y += 1) {
    for (let x = 0; x < sourceWidth; x += 1) {
      const alpha = pixels[(y * sourceWidth + x) * 4 + 3];
      if (alpha > 12) {
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
  }

  if (right < left || bottom < top) return sourceCanvas;

  const padding = 8;
  left = Math.max(0, left - padding);
  top = Math.max(0, top - padding);
  right = Math.min(sourceWidth - 1, right + padding);
  bottom = Math.min(sourceHeight - 1, bottom + padding);

  const width = right - left + 1;
  const height = bottom - top + 1;
  const trimmed = document.createElement("canvas");
  trimmed.width = width;
  trimmed.height = height;
  const context = trimmed.getContext("2d");
  if (!context) return sourceCanvas;
  context.imageSmoothingEnabled = false;
  context.drawImage(sourceCanvas, left, top, width, height, 0, 0, width, height);
  return trimmed;
}

export function PixelHQPreview() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let game: import("phaser").Game | undefined;
    let disposed = false;

    void import("phaser").then((Phaser) => {
      if (disposed || !host.current) return;

      class PixelOfficeScene extends Phaser.Scene {
        private dragPoint?: { x: number; y: number };
        private selectedLabel?: import("phaser").GameObjects.Text;

        constructor() {
          super("mex-nex-six-moving-characters");
        }

        preload() {
          this.load.image("mex-nex-office", OFFICE_BACKGROUND);
          for (const item of MOVING_CHARACTERS) {
            this.load.image(item.asset.id, item.asset.src);
          }
        }

        create() {
          this.cameras.main.setBackgroundColor("#182b2c");

          // Keep the uploaded office artwork as the only environment layer.
          const office = this.add.image(800, 510, "mex-nex-office");
          office.setDisplaySize(1450, 810);
          office.setDepth(0);

          const addMovingCharacter = (item: MovingCharacter) => {
            const { asset, route, isOwner = false } = item;
            if (!this.textures.exists(asset.id)) return;

            const original = this.textures.get(asset.id).getSourceImage() as
              | HTMLImageElement
              | HTMLCanvasElement;
            const trimmed = trimTransparentSprite(original);
            const trimmedKey = `${asset.id}-trimmed`;
            this.textures.addCanvas(trimmedKey, trimmed);

            const firstPoint = route[0] ?? { x: asset.x, y: asset.y };
            const group = this.add.container(firstPoint.x, firstPoint.y);
            group.setDepth(firstPoint.y + 20);

            const shadow = this.add.ellipse(
              0,
              3,
              isOwner ? 27 : 24,
              isOwner ? 9 : 8,
              0x101719,
              0.38,
            );
            const sprite = this.add
              .image(0, 0, trimmedKey)
              .setScale(isOwner ? 0.31 : 0.29)
              .setOrigin(0.5, 0.92);
            const name = this.add
              .text(0, isOwner ? -117 : -105, isOwner ? "DUERO · PEMILIK" : asset.name, {
                fontFamily: "Arial",
                fontSize: isOwner ? "12px" : "10px",
                color: isOwner ? "#fff0b7" : "#fff8e9",
                fontStyle: "bold",
                backgroundColor: isOwner ? "#68482c" : "#243b3c",
                padding: { x: 6, y: 3 },
                stroke: "#101b1c",
                strokeThickness: 2,
              })
              .setOrigin(0.5);
            const role = this.add
              .text(0, isOwner ? -96 : -86, asset.role, {
                fontFamily: "Arial",
                fontSize: "8px",
                color: "#fff4df",
                backgroundColor: "#527e69",
                padding: { x: 4, y: 2 },
              })
              .setOrigin(0.5);

            group.add([shadow, sprite, name, role]);
            group.setSize(68, 120);
            group.setInteractive(
              new Phaser.Geom.Rectangle(-34, -120, 68, 123),
              Phaser.Geom.Rectangle.Contains,
            );
            group.on("pointerdown", () => {
              this.selectedLabel?.destroy();
              this.selectedLabel = this.add
                .text(group.x + 40, group.y - 28, `${asset.name} · ${asset.role}`, {
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

            // A subtle step bounce and a breathing shadow make the single
            // walking illustration read as movement while the character travels.
            this.tweens.add({
              targets: sprite,
              y: -2.5,
              duration: 180,
              yoyo: true,
              repeat: -1,
              ease: "Sine.easeInOut",
            });
            this.tweens.add({
              targets: shadow,
              scaleX: 0.82,
              alpha: 0.25,
              duration: 180,
              yoyo: true,
              repeat: -1,
              ease: "Sine.easeInOut",
            });

            const moveToNextPoint = (pointIndex: number) => {
              if (disposed || !this.sys.isActive() || route.length < 2) return;
              const nextIndex = (pointIndex + 1) % route.length;
              const target = route[nextIndex];
              const distance = Phaser.Math.Distance.Between(group.x, group.y, target.x, target.y);
              sprite.setFlipX(target.x < group.x);
              group.setDepth(group.y + 20);

              this.tweens.add({
                targets: group,
                x: target.x,
                y: target.y,
                duration: Phaser.Math.Clamp(distance * 32, 1200, 2300),
                ease: "Sine.easeInOut",
                onUpdate: () => group.setDepth(group.y + 20),
                onComplete: () => {
                  if (disposed || !this.sys.isActive()) return;
                  this.time.delayedCall(380, () => moveToNextPoint(nextIndex));
                },
              });
            };

            this.time.delayedCall(item.startDelay, () => moveToNextPoint(0));
          };

          MOVING_CHARACTERS.forEach(addMovingCharacter);

          this.add
            .text(800, 74, "MEX-NEX · UJI GERAK 6 KARAKTER", {
              fontFamily: "Arial",
              fontSize: "21px",
              color: "#fff3dc",
              fontStyle: "bold",
              letterSpacing: 2,
              stroke: "#152322",
              strokeThickness: 4,
            })
            .setOrigin(0.5)
            .setDepth(1500);

          this.add
            .text(800, 940, "5 AGENT + 1 AVATAR PEMILIK · PATROLI OTOMATIS", {
              fontFamily: "Arial",
              fontSize: "12px",
              color: "#fff0d7",
              fontStyle: "bold",
              backgroundColor: "#203c38",
              padding: { x: 10, y: 6 },
              stroke: "#152322",
              strokeThickness: 2,
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
      aria-label="Uji gerak enam karakter di atas artwork kantor MEX-NEX"
    />
  );
}
