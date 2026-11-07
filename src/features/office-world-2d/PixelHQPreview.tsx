"use client";

import { useEffect, useRef } from "react";
import {
  MEX_NEX_AGENT_ASSETS,
  MEX_NEX_OWNER_AVATAR,
  type OfficeCharacterAsset,
} from "@/features/office-world-2d/characterAssets";

const OFFICE_BACKGROUND = "/office-assets/backgrounds/mex-nex-master-office-removebg-preview.png";
const OFFICE = {
  centerX: 800,
  centerY: 510,
  sourceWidth: 666,
  sourceHeight: 375,
  displayWidth: 1450,
};
const OFFICE_SCALE = OFFICE.displayWidth / OFFICE.sourceWidth;
const OFFICE_DISPLAY_HEIGHT = OFFICE.sourceHeight * OFFICE_SCALE;

// Routes are authored in the uploaded MEX-NEX master office artwork's 666x375 coordinate space.
// Every route stays inside one room/zone; no random destination is generated.
type ArtPoint = { x: number; y: number };
type OfficeNodeId =
  | "analyst-desk" | "west-corridor" | "lab" | "north-hall"
  | "meeting-room" | "reception" | "central-hall" | "finance-desk"
  | "server-room" | "lounge" | "owner-desk";
type OfficeNode = { point: ArtPoint; label: string };
type OfficeStop = { node: OfficeNodeId; task: string };
type CharacterRoute = {
  id: string;
  stops: readonly OfficeStop[];
  delay: number;
  isOwner?: boolean;
};

// Hand-authored walkable navigation graph aligned to the uploaded office illustration.
// Agents route through shared corridors using BFS, then pause at a purposeful destination.
const OFFICE_NODES: Record<OfficeNodeId, OfficeNode> = {
  "analyst-desk": { point: { x: 112, y: 144 }, label: "Meja analis" },
  "west-corridor": { point: { x: 175, y: 168 }, label: "Koridor barat" },
  lab: { point: { x: 205, y: 91 }, label: "Laboratorium" },
  "north-hall": { point: { x: 270, y: 126 }, label: "Koridor utara" },
  "meeting-room": { point: { x: 344, y: 53 }, label: "Ruang meeting" },
  reception: { point: { x: 335, y: 171 }, label: "Resepsionis" },
  "central-hall": { point: { x: 350, y: 205 }, label: "Atrium" },
  "finance-desk": { point: { x: 397, y: 287 }, label: "Meja finance" },
  "server-room": { point: { x: 535, y: 159 }, label: "Ruang server" },
  lounge: { point: { x: 472, y: 252 }, label: "Lounge" },
  "owner-desk": { point: { x: 493, y: 239 }, label: "Meja pemilik" },
};

const OFFICE_CONNECTIONS: readonly (readonly [OfficeNodeId, OfficeNodeId])[] = [
  ["analyst-desk", "west-corridor"],
  ["west-corridor", "lab"],
  ["west-corridor", "central-hall"],
  ["lab", "north-hall"],
  ["north-hall", "meeting-room"],
  ["north-hall", "central-hall"],
  ["central-hall", "reception"],
  ["central-hall", "finance-desk"],
  ["central-hall", "lounge"],
  ["lounge", "owner-desk"],
  ["lounge", "server-room"],
];

function findOfficePath(from: OfficeNodeId, to: OfficeNodeId): OfficeNodeId[] {
  if (from === to) return [from];
  const queue: OfficeNodeId[] = [from];
  const previous = new Map<OfficeNodeId, OfficeNodeId>();
  const visited = new Set<OfficeNodeId>([from]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const [a, b] of OFFICE_CONNECTIONS) {
      const next = a === current ? b : b === current ? a : undefined;
      if (!next || visited.has(next)) continue;
      visited.add(next);
      previous.set(next, current);
      if (next === to) {
        const path: OfficeNodeId[] = [to];
        let cursor = to;
        while (cursor !== from) {
          cursor = previous.get(cursor)!;
          path.unshift(cursor);
        }
        return path;
      }
      queue.push(next);
    }
  }
  return [from, to];
}

const ACTIVE_ROUTES: readonly CharacterRoute[] = [
  {
    id: "agent-01-analyst", delay: 0,
    stops: [
      { node: "analyst-desk", task: "Menganalisis data" },
      { node: "meeting-room", task: "Menyampaikan temuan" },
      { node: "analyst-desk", task: "Memperbarui laporan" },
      { node: "lounge", task: "Istirahat singkat" },
    ],
  },
  {
    id: "agent-07-engineering", delay: 700,
    stops: [
      { node: "lab", task: "Menguji prototipe" },
      { node: "server-room", task: "Memeriksa sistem" },
      { node: "lab", task: "Mencatat hasil pengujian" },
      { node: "lounge", task: "Rehat setelah pengujian" },
    ],
  },
  {
    id: "agent-10-finance", delay: 1400,
    stops: [
      { node: "finance-desk", task: "Menyusun laporan" },
      { node: "reception", task: "Mengantar dokumen" },
      { node: "finance-desk", task: "Memeriksa anggaran" },
      { node: "lounge", task: "Istirahat singkat" },
    ],
  },
  {
    id: "agent-16-manager", delay: 2100,
    stops: [
      { node: "meeting-room", task: "Memimpin rapat" },
      { node: "lab", task: "Meninjau progres engineering" },
      { node: "analyst-desk", task: "Membahas temuan dengan analis" },
      { node: "meeting-room", task: "Kembali ke ruang rapat" },
    ],
  },
  {
    id: "agent-17-receptionist", delay: 2800,
    stops: [
      { node: "reception", task: "Menyambut tamu" },
      { node: "central-hall", task: "Mengantar tamu" },
      { node: "reception", task: "Memperbarui jadwal kunjungan" },
      { node: "lounge", task: "Istirahat singkat" },
    ],
  },
  {
    id: "owner-avatar", delay: 3500, isOwner: true,
    stops: [
      { node: "owner-desk", task: "Meninjau dashboard" },
      { node: "meeting-room", task: "Mengikuti rapat tim" },
      { node: "server-room", task: "Memeriksa operasional" },
      { node: "owner-desk", task: "Kembali meninjau dashboard" },
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
            const { asset, stops, isOwner = false, delay } = entry;
            if (!this.textures.exists(asset.id) || stops.length < 2) return;

            const original = this.textures.get(asset.id).getSourceImage() as
              | HTMLImageElement
              | HTMLCanvasElement;
            const trimmed = trimTransparentSprite(original);
            const textureKey = `${asset.id}-trimmed`;
            this.textures.addCanvas(textureKey, trimmed);

            const initial = toWorld(OFFICE_NODES[stops[0].node].point);
            const group = this.add.container(initial.x, initial.y);
            group.setDepth(initial.y + 10);

            const shadow = this.add.ellipse(0, 2, isOwner ? 25 : 22, isOwner ? 8 : 7, 0x111719, 0.42);
            const sprite = this.add.image(0, 0, textureKey).setScale(isOwner ? 0.29 : 0.27).setOrigin(0.5, 0.98);
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
            const role = this.add.text(0, isOwner ? -91 : -84, asset.role, {
              fontFamily: "Arial",
              fontSize: "8px",
              color: "#fff4df",
              backgroundColor: "#527e69",
              padding: { x: 4, y: 2 },
            }).setOrigin(0.5);
            const taskLabel = this.add.text(0, isOwner ? -72 : -66, stops[0].task, {
              fontFamily: "Arial",
              fontSize: "8px",
              color: "#f9f2df",
              backgroundColor: "#3d5960",
              padding: { x: 4, y: 2 },
            }).setOrigin(0.5);

            group.add([shadow, sprite, name, role, taskLabel]);
            group.setSize(64, 128);
            group.setInteractive(new Phaser.Geom.Rectangle(-32, -128, 64, 130), Phaser.Geom.Rectangle.Contains);
            group.on("pointerdown", () => {
              this.selectedLabel?.destroy();
              this.selectedLabel = this.add
                .text(group.x + 34, group.y - 24, `${asset.name} · ${asset.role} · ${taskLabel.text}`, {
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

            let currentNode = stops[0].node;
            let stopIndex = 0;
            let movementTween: import("phaser").Tweens.Tween | undefined;
            let idleTween: import("phaser").Tweens.Tween | undefined;

            const startIdleMotion = () => {
              idleTween?.stop();
              idleTween = this.tweens.add({
                targets: sprite,
                y: -1,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut",
              });
            };

            const goToNextTask = () => {
              if (disposed || !this.sys.isActive()) return;
              stopIndex = (stopIndex + 1) % stops.length;
              const stop = stops[stopIndex];
              const path = findOfficePath(currentNode, stop.node).slice(1);
              taskLabel.setText(stop.task);
              if (path.length === 0) {
                this.time.delayedCall(2200, goToNextTask);
                return;
              }

              idleTween?.stop();
              const moveNextNode = (pathIndex: number) => {
                if (disposed || !this.sys.isActive()) return;
                if (pathIndex >= path.length) {
                  currentNode = stop.node;
                  startIdleMotion();
                  // Work/break/task duration, then pick the next scheduled destination.
                  this.time.delayedCall(stop.task.includes("Istirahat") || stop.task.includes("Rehat") ? 3600 : 2400, goToNextTask);
                  return;
                }

                const nodeId = path[pathIndex];
                const destination = toWorld(OFFICE_NODES[nodeId].point);
                const distance = Phaser.Math.Distance.Between(group.x, group.y, destination.x, destination.y);
                const duration = Phaser.Math.Clamp(distance * 20, 450, 1500);
                sprite.setFlipX(destination.x < group.x);
                movementTween?.stop();
                movementTween = this.tweens.add({
                  targets: group,
                  x: destination.x,
                  y: destination.y,
                  duration,
                  ease: "Sine.easeInOut",
                  onUpdate: () => group.setDepth(group.y + 10),
                  onComplete: () => moveNextNode(pathIndex + 1),
                });
                // Small footstep bob while walking; reset on arrival.
                this.tweens.add({
                  targets: sprite,
                  y: -2,
                  duration: 130,
                  yoyo: true,
                  repeat: Math.max(1, Math.floor(duration / 260)),
                  ease: "Sine.easeInOut",
                });
              };
              moveNextNode(0);
            };

            startIdleMotion();
            // Agents are staggered so the whole office does not move in unison.
            this.time.delayedCall(delay + 1800, goToNextTask);
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
            .text(800, 940, "5 AGENT + 1 AVATAR · AKTIVITAS KANTOR BERJADWAL", {
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
