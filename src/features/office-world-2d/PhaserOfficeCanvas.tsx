"use client";

import { useEffect, useRef } from "react";

type LevelId = "building" | "basement" | "floor-1" | "floor-2" | "floor-3" | "floor-4" | "rooftop";

type Props = { level: LevelId; className?: string };

const LEVELS: { id: Exclude<LevelId, "building">; label: string; accent: number }[] = [
  { id: "basement", label: "BASEMENT · OPERATIONS", accent: 0x66818c },
  { id: "floor-1", label: "LANTAI 1 · RECEPTION", accent: 0xd58a52 },
  { id: "floor-2", label: "LANTAI 2 · ENGINEERING", accent: 0x6e9c83 },
  { id: "floor-3", label: "LANTAI 3 · CREATIVE STUDIO", accent: 0x8c78b8 },
  { id: "floor-4", label: "LANTAI 4 · MANAGEMENT", accent: 0x6586b1 },
  { id: "rooftop", label: "ROOFTOP · LOUNGE & POOL", accent: 0x4c9eae },
];

export function PhaserOfficeCanvas({ level, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<import("phaser").Game | null>(null);

  useEffect(() => {
    let disposed = false;
    let game: import("phaser").Game | null = null;

    void import("phaser").then((Phaser) => {
      if (disposed || !hostRef.current) return;

      class LivingHQScene extends Phaser.Scene {
        private selected: LevelId = level;
        private root!: Phaser.GameObjects.Container;

        constructor() {
          super("living-hq-isometric");
        }

        create() {
          this.root = this.add.container(0, 0);
          this.drawWorld();
          this.scale.on("resize", () => this.drawWorld());
          this.game.events.on("office-level-change", (next: LevelId) => {
            this.selected = next;
            this.drawWorld();
          });
        }

        private iso(x: number, z: number, elevation = 0): [number, number] {
          return [x * 24 - z * 24, (x + z) * 12 - elevation];
        }

        private polygon(points: [number, number][], color: number, alpha = 1, stroke = 0x5b493d) {
          const shape = this.add.graphics();
          shape.fillStyle(color, alpha);
          shape.lineStyle(1.4, stroke, Math.min(alpha + 0.12, 1));
          shape.beginPath();
          shape.moveTo(points[0][0], points[0][1]);
          for (const point of points.slice(1)) shape.lineTo(point[0], point[1]);
          shape.closePath();
          shape.fillPath();
          shape.strokePath();
          this.root.add(shape);
          return shape;
        }

        private tile(x: number, z: number, elevation: number, color: number) {
          const [cx, cy] = this.iso(x, z, elevation);
          this.polygon([[cx, cy - 12], [cx + 24, cy], [cx, cy + 12], [cx - 24, cy]], color, 1, 0xc0a98d);
        }

        private block(x: number, z: number, elevation: number, width: number, depth: number, height: number, top: number, side = 0x9a7659) {
          const [cx, cy] = this.iso(x, z, elevation);
          const left = [cx - width * 12, cy - width * 6];
          const topPoint = [cx, cy - (width + depth) * 6];
          const right = [cx + depth * 12, cy - depth * 6];
          const front = [cx, cy + (depth - width) * 6];
          this.polygon([left, topPoint, right, front], top, 1, 0x5c493b);
          this.polygon([left, front, [front[0], front[1] + height], [left[0], left[1] + height]], side, 1, 0x5c493b);
          this.polygon([front, right, [right[0], right[1] + height], [front[0], front[1] + height]], Phaser.Display.Color.IntegerToColor(side).darken(12).color, 1, 0x5c493b);
        }

        private label(text: string, x: number, y: number, color = "#594638", size = "12px") {
          const item = this.add.text(x, y, text, { fontFamily: "Arial, sans-serif", fontSize: size, fontStyle: "bold", color, backgroundColor: "#fff3df", padding: { x: 7, y: 4 } }).setOrigin(0.5);
          this.root.add(item);
        }

        private furniture(x: number, z: number, elevation: number, kind: "desk" | "sofa" | "plant" | "screen" | "chair") {
          const [cx, cy] = this.iso(x, z, elevation);
          if (kind === "desk") {
            this.block(x, z, elevation, 1.35, 0.85, 13, 0xb8875d, 0x76513d);
            this.block(x - 0.08, z - 0.05, elevation + 14, 0.42, 0.12, 15, 0x263b49, 0x1d2d38);
          } else if (kind === "sofa") {
            this.block(x, z, elevation, 1.45, 0.85, 12, 0xd7a47d, 0x9e705b);
            this.block(x + 0.12, z + 0.08, elevation + 12, 1.15, 0.5, 13, 0xe8c5a2, 0xb78366);
          } else if (kind === "plant") {
            this.block(x, z, elevation, 0.55, 0.55, 8, 0xb17a52, 0x85583e);
            const leaves = this.add.circle(cx, cy - 29, 14, 0x5d895c).setStrokeStyle(2, 0x42694b);
            this.root.add(leaves);
          } else if (kind === "screen") {
            this.block(x, z, elevation, 0.5, 0.25, 18, 0x263b49, 0x1d2d38);
            const glow = this.add.rectangle(cx, cy - 29, 18, 10, 0x67c6d0).setStrokeStyle(1, 0xd8f3ed);
            this.root.add(glow);
          } else {
            this.block(x, z, elevation, 0.5, 0.5, 8, 0x657d89, 0x405762);
          }
        }

        private drawRoom(id: Exclude<LevelId, "building">, offset: number) {
          const cfg = LEVELS.find((item) => item.id === id)!;
          const elevation = offset;
          for (let x = -4; x < 4; x++) for (let z = -3; z < 3; z++) {
            const wood = (x + z) % 2 === 0 ? 0xd9b58c : 0xd2ac80;
            this.tile(x, z, elevation, wood);
          }

          // Room divisions: low warm walls and full-height glass with dark slim mullions.
          this.block(-3.9, -2.7, elevation + 1, 0.12, 5.4, 48, 0xead8bd, 0xb18f70);
          for (let z = -2.5; z <= 2.5; z += 1.25) {
            this.block(3.75, z, elevation + 1, 0.1, 0.08, 50, 0x314d5b, 0x263b49);
            this.block(3.75, z, elevation + 18, 0.08, 0.05, 26, 0x9bd0dd, 0x6da5b3);
          }
          this.block(0, -2.8, elevation + 1, 7.7, 0.12, 48, 0x304a57, 0x253b46);
          this.block(0, -2.8, elevation + 19, 7.5, 0.05, 25, 0x9acbd7, 0x6f9fac);

          if (id === "rooftop") {
            this.block(0, 0.2, elevation + 1, 3.5, 2.1, 7, 0x4aa7bc, 0x347d91);
            this.furniture(-2.5, 1.5, elevation + 1, "sofa");
            this.furniture(2.3, 1.5, elevation + 1, "plant");
            this.furniture(-2.4, -1.5, elevation + 1, "plant");
          } else if (id === "floor-3") {
            this.block(0, -0.2, elevation + 1, 2.8, 0.2, 38, 0x26334c, 0x182536);
            this.block(0, -0.1, elevation + 40, 2.4, 0.08, 22, 0x9b77c8, 0x614e83);
            this.furniture(-1.7, 1.2, elevation + 1, "desk");
            this.furniture(-1.7, 1.2, elevation + 16, "screen");
            this.furniture(2.3, 1.4, elevation + 1, "chair");
          } else if (id === "basement") {
            for (let x = -2.5; x <= 2.5; x += 1.7) this.block(x, -1.7, elevation + 1, 0.8, 0.5, 42, 0x566e7a, 0x344b56);
            this.furniture(-2.2, 1.4, elevation + 1, "plant");
          } else if (id === "floor-1") {
            this.furniture(-2.3, 0.6, elevation + 1, "sofa");
            this.furniture(2.2, 0.9, elevation + 1, "plant");
            this.block(0.2, -0.2, elevation + 1, 1.9, 0.8, 12, 0x987254, 0x684c3a);
          } else {
            for (let x = -2.5; x <= 2.5; x += 1.7) {
              this.furniture(x, 0.8, elevation + 1, "desk");
              this.furniture(x, 0.8, elevation + 17, "screen");
              this.furniture(x, 1.65, elevation + 1, "chair");
            }
            this.furniture(-3, 1.8, elevation + 1, "plant");
          }

          const [labelX, labelY] = this.iso(0, -3.35, elevation);
          this.label(cfg.label, labelX, labelY - 36, "#49392f", "11px");
        }

        private drawWorld() {
          this.root?.removeAll(true);
          const { width, height } = this.scale;
          const isBuilding = this.selected === "building";
          const visible = isBuilding ? LEVELS : LEVELS.filter((item) => item.id === this.selected);
          const totalHeight = isBuilding ? 430 : 170;
          const scale = Math.min((width - 36) / 500, (height - 36) / totalHeight, 1.2);
          this.root.setScale(Math.max(0.55, scale));
          this.root.setPosition(width / 2, height / 2 + (isBuilding ? 0 : 36));

          if (isBuilding) {
            visible.forEach((item, index) => {
              const [x, y] = this.iso(0, 0, index * 72);
              const shade = item.id === "rooftop" ? 0xead7b8 : 0xd6b48d;
              this.block(0, 0, index * 72, 8.2, 6.2, 52, shade, 0x9b795b);
              const windowColor = item.id === "floor-3" ? 0x8dcbd8 : 0x7faeb9;
              for (let i = -3; i <= 3; i += 2) {
                const [wx, wy] = this.iso(i, -3.05, index * 72 + 12);
                const window = this.add.rectangle(wx, wy - 10, 30, 27, windowColor, 0.72).setStrokeStyle(2, 0x405b68);
                this.root.add(window);
              }
              this.label(item.label, x, y - 43, "#49392f", "10px");
            });
            const [px, py] = this.iso(0, 0, 430);
            this.label("MEX-NEX · LIVING HQ", px, py - 30, "#fff8ed", "15px");
          } else {
            this.drawRoom(this.selected as Exclude<LevelId, "building">, 0);
          }
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: hostRef.current,
        backgroundColor: "#dce8e2",
        transparent: false,
        scale: { mode: Phaser.Scale.RESIZE, width: "100%", height: "100%" },
        render: { antialias: true, pixelArt: false, roundPixels: false },
        scene: [LivingHQScene],
        banner: false,
      });
      gameRef.current = game;
    });

    return () => {
      disposed = true;
      game?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    gameRef.current?.events.emit("office-level-change", level);
  }, [level]);

  return <div ref={hostRef} className={className ?? "h-full min-h-[420px] w-full overflow-hidden"} aria-label="Kantor virtual MEX-NEX isometrik 2.5D" />;
}
