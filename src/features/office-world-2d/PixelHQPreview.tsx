"use client";

import { useEffect, useRef } from "react";
import {
  MEX_NEX_AGENT_ASSETS,
  MEX_NEX_OWNER_AVATAR,
  type OfficeCharacterAsset,
} from "@/features/office-world-2d/characterAssets";

const OFFICE_BACKGROUND = "/office-assets/backgrounds/mex-nex-office-main.png";
const OFFICE = {
  centerX: 800,
  centerY: 510,
  sourceWidth: 669,
  sourceHeight: 373,
  displayWidth: 1450,
};
const OFFICE_SCALE = OFFICE.displayWidth / OFFICE.sourceWidth;
const OFFICE_DISPLAY_HEIGHT = OFFICE.sourceHeight * OFFICE_SCALE;

// Routes are authored in the selected office-main artwork's 669x373 coordinate space.
// Every route stays inside one room/zone; no random destination is generated.
type ArtPoint = { x: number; y: number };
type CharacterRoute = {
  id: string;
  route: readonly ArtPoint[];
  delay: number;
  isOwner?: boolean;
};

const ACTIVE_ROUTES: readonly CharacterRoute[] = [
  {
    id: "agent-01-analyst",
    delay: 0,
    // Research desks / left-side lower work area.
    route: [
      { x: 104, y: 151 },
      { x: 117, y: 145 },
      { x: 131, y: 153 },
      { x: 119, y: 160 },
    ],
  },
  {
    id: "agent-07-engineering",
    delay: 650,
    // Engineering workstations in the upper-left wing.
    route: [
      { x: 191, y: 96 },
      { x: 205, y: 91 },
      { x: 218, y: 99 },
      { x: 204, y: 105 },
    ],
  },
  {
    id: "agent-10-finance",
    delay: 1300,
    // Finance desks in the upper central office.
    route: [
      { x: 326, y: 57 },
      { x: 340, y: 52 },
      { x: 353, y: 60 },
      { x: 340, y: 66 },
    ],
  },
  {
    id: "agent-16-manager",
    delay: 1950,
    // Meeting/collaboration space along the lower-right interior.
    route: [
      { x: 437, y: 229 },
      { x: 451, y: 222 },
      { x: 466, y: 230 },
      { x: 452, y: 238 },
    ],
  },
  {
    id: "agent-17-receptionist",
    delay: 2600,
    // Reception / lounge zone on the front-left side.
    route: [
      { x: 128, y: 246 },
      { x: 141, y: 239 },
      { x: 155, y: 247 },
      { x: 142, y: 254 },
    ],
  },
  {
    id: "owner-avatar",
    delay: 3250,
    isOwner: true,
    // Main atrium circulation, clear of the central fountain.
    route: [
      { x: 328, y: 194 },
      { x: 343, y: 186 },
      { x: 359, y: 195 },
      { x: 345, y: 203 },
    ],
  },
];

function toWorld(point: ArtPoint) {
  return {
    x: OFFICE.centerX + (point.x - OFFICE.sourceWidth / 2) * OFFICE_SCALE,
    y: OFFICE.centerY + (point.y - OFFICE.sourceHeight / 2) * OFFICE_SCALE,
  };
}

function trimTransparentSprite(source: HTMLImageElement | HTMLCanvasElement) {
  const width = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
  const height = source instanceof HTMLImageElement ? source.naturalHeight : source.height;
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = width;
  sourceCanvas.height = height;
  const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!sourceContext || width === 0 || height === 0) return sourceCanvas;

  sourceContext.drawImage(source, 0, 0, width, height);
  const pixels = sourceContext.getImageData(0, 0, width, height).data;
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (pixels[(y * width + x) * 4 + 3] > 12) {
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
  }

  if (right < left || bottom < top) return sourceCanvas;
  const pad = 8;
  left = Math.max(0, left - pad);
  top = Math.max(0, top - pad);
  right = Math.min(width - 1, right + pad);
  bottom = Math.min(height - 1, bottom + pad);

  const trimmed = document.createElement("canvas");
  trimmed.width = right - left + 1;
  trimmed.height = bottom - top + 1;
  const context = trimmed.getContext("2d");
  if (!context) return sourceCanvas;
  context.imageSmoothingEnabled = false;
  context.drawImage(
    sourceCanvas,
    left,
    top,
    trimmed.width,
    trimmed.height,
    0,
    0,
    trimmed.width,
    trimmed.height,
  );
  return trimmed;
}

export function PixelHQPreview() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let game: import("phaser").Game | undefined;
    let disposed = false;

    void import("phaser").then((Phaser) => {
      if (disposed || !host.current) return;

      const selectedAssets = ACTIVE_ROUTES.map((entry) => {
        const asset =
          entry.id === MEX_NEX_OWNER_AVATAR.id
            ? MEX_NEX_OWNER_AVATAR
            : MEX_NEX_AGENT_ASSETS.find((candidate) => candidate.id === entry.id);
        return asset ? { ...entry, asset } : null;
      }).filter((entry): entry is CharacterRoute & { asset: OfficeCharacterAsset } => Boolean(entry));

      class PixelOfficeScene extends Phaser.Scene {
        private dragPoint?: { x: number; y: number };
        private selectedLabel?: import("phaser").GameObjects.Text;

        constructor() {
          super("mex-nex-six-zone-based-characters");
        }

        preload() {
          this.load.image("mex-nex-office", OFFICE_BACKGROUND);
          for (const entry of selectedAssets) {
            this.load.image(entry.asset.id, entry.asset.src);
          }
        }

        create() {
          this.cameras.main.setBackgroundColor("rgba(0,0,0,0)");

          // The uploaded office artwork is the complete environment layer.
          const office = this.add.image(OFFICE.centerX, OFFICE.centerY, "mex-nex-office");
          office.setDisplaySize(OFFICE.displayWidth, OFFICE_DISPLAY_HEIGHT);
          office.setDepth(0);

          const addMovingCharacter = (
            entry: CharacterRoute & { asset: OfficeCharacterAsset },
          ) => {
            const { asset, route, isOwner = false, delay } = entry;
            if (!this.textures.exists(asset.id) || route.length < 2) return;

            const original = this.textures.get(asset.id).getSourceImage() as
              | HTMLImageElement
              | HTMLCanvasElement;
            const trimmed = trimTransparentSprite(original);
            const textureKey = `${asset.id}-trimmed`;
            this.textures.addCanvas(textureKey, trimmed);

            const start = toWorld(route[0]);
            const group = this.add.container(start.x, start.y);
            group.setDepth(start.y + 10);

            const shadow = this.add.ellipse(
              0,
              2,
              isOwner ? 25 : 22,
              isOwner ? 8 : 7,
              0x111719,
              0.42,
            );
            const sprite = this.add
              .image(0, 0, textureKey)
              .setScale(isOwner ? 0.29 : 0.27)
              .setOrigin(0.5, 0.98);
            const name = this.add
              .text(0, isOwner ? -111 : -102, isOwner ? "DUERO · PEMILIK" : asset.name, {
                fontFamily: "Arial",
                fontSize: isOwner ? "11px" : "9px",
                color: isOwner ? "#fff0b7" : "#fff8e9",
                fontStyle: "bold",
                backgroundColor: isOwner ? "#68482c" : "#243b3c",
                padding: { x: 5, y: 3 },
                stroke: "#101b1c",
                strokeThickness: 2,
              })
              .setOrigin(0.5);
            const role = this.add
              .text(0, isOwner ? -91 : -84, asset.role, {
                fontFamily: "Arial",
                fontSize: "8px",
                color: "#fff4df",
                backgroundColor: "#527e69",
                padding: { x: 4, y: 2 },
              })
              .setOrigin(0.5);

            group.add([shadow, sprite, name, role]);
            group.setSize(64, 116);
            group.setInteractive(
              new Phaser.Geom.Rectangle(-32, -116, 64, 118),
              Phaser.Geom.Rectangle.Contains,
            );
            group.on("pointerdown", () => {
              this.selectedLabel?.destroy();
              this.selectedLabel = this.add
                .text(group.x + 34, group.y - 24, `${asset.name} · ${asset.role}`, {
                  fontFamily: "Arial",
                  fontSize: "11px",
                  color: "#fff8e9",
                  backgroundColor: "#203c38",
                  padding: { x: 7, y: 5 },
                  stroke: "#101b1c",
                  strokeThickness: 2,
                })
                .setDepth(2000);
            });

            let stepTween: import("phaser").Tweens.Tween | undefined;
            const moveSegment = (index: number) => {
              if (disposed || !this.sys.isActive()) return;
              const nextIndex = (index + 1) % route.length;
              const destination = toWorld(route[nextIndex]);
              const distance = Phaser.Math.Distance.Between(
                group.x,
                group.y,
                destination.x,
                destination.y,
              );
              const duration = Phaser.Math.Clamp(distance * 42, 900, 1750);

              sprite.setFlipX(destination.x < group.x);
              stepTween?.stop();
              stepTween = this.tweens.add({
                targets: sprite,
                y: -2,
                duration: 150,
                yoyo: true,
                repeat: Math.max(2, Math.floor(duration / 300)),
                ease: "Sine.easeInOut",
              });

              this.tweens.add({
                targets: group,
                x: destination.x,
                y: destination.y,
                duration,
                ease: "Sine.easeInOut",
                onUpdate: () => group.setDepth(group.y + 10),
                onComplete: () => {
                  stepTween?.stop();
                  sprite.y = 0;
                  if (disposed || !this.sys.isActive()) return;
                  // Pause at the room waypoint before taking the next step.
                  this.time.delayedCall(900, () => moveSegment(nextIndex));
                },
              });
            };

            // A short idle pause before movement makes the six routes feel
            // like office staff walking independently, not all moving at once.
            this.time.delayedCall(delay, () => moveSegment(0));
          };

          selectedAssets.forEach(addMovingCharacter);

          this.add
            .text(800, 76, "MEX-NEX · UJI GERAK TERARAH", {
              fontFamily: "Arial",
              fontSize: "20px",
              color: "#fff3dc",
              fontStyle: "bold",
              letterSpacing: 2,
              stroke: "#152322",
              strokeThickness: 4,
            })
            .setOrigin(0.5)
            .setDepth(1500);

          this.add
            .text(800, 940, "5 AGENT + 1 AVATAR · JALUR TERBATAS PER RUANGAN", {
              fontFamily: "Arial",
              fontSize: "11px",
              color: "#fff0d7",
              fontStyle: "bold",
              backgroundColor: "#203c38",
              padding: { x: 9, y: 5 },
              stroke: "#152322",
              strokeThickness: 2,
            })
            .setOrigin(0.5)
            .setDepth(1500);

          const camera = this.cameras.main;
          camera.setBounds(0, 0, 1600, 1000);
          const fit = () =>
            camera.setZoom(
              Math.min(this.scale.width / 1600, this.scale.height / 1000) * 1.08,
            );
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
        backgroundColor: "rgba(0,0,0,0)",
        transparent: true,
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
      style={{
        backgroundColor: "#e9e2d4",
        backgroundImage:
          "linear-gradient(30deg, rgba(105, 124, 105, 0.055) 1px, transparent 1px), linear-gradient(150deg, rgba(105, 124, 105, 0.055) 1px, transparent 1px), radial-gradient(ellipse at 50% 42%, #fbf5e9 0%, #e9e2d4 58%, #c8d3c8 100%)",
        backgroundSize: "44px 25px, 44px 25px, 100% 100%",
      }}
      aria-label="Uji gerak enam karakter MEX-NEX pada artwork kantor dengan latar krem lembut"
    />
  );
}
