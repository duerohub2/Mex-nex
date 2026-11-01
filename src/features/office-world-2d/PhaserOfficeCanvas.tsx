"use client";

import { useEffect, useRef } from "react";

type Props = { className?: string };

type IsoPoint = { x: number; y: number };
type Furniture = { key: string; x: number; y: number; scale: number; depthOffset?: number };
type Agent = { name: string; role: string; status: string; texture: string; x: number; y: number };

const FURNITURE: Furniture[] = [
  { key: "desk", x: 470, y: 390, scale: 0.2 },
  { key: "desk", x: 610, y: 470, scale: 0.2 },
  { key: "desk", x: 750, y: 390, scale: 0.2 },
  { key: "desk", x: 890, y: 470, scale: 0.2 },
  { key: "desk", x: 1030, y: 390, scale: 0.2 },
  { key: "desk", x: 1170, y: 470, scale: 0.2 },
  { key: "desk", x: 680, y: 690, scale: 0.2 },
  { key: "desk", x: 820, y: 770, scale: 0.2 },
  { key: "desk", x: 960, y: 690, scale: 0.2 },
];

const AGENTS: Agent[] = [
  { name: "NEX", role: "Engineering", status: "Mengerjakan task", texture: "dev-front", x: 470, y: 455 },
  { name: "MIRA", role: "Research", status: "Menganalisis", texture: "dev-side", x: 750, y: 455 },
  { name: "ATLAS", role: "Operations", status: "Siaga", texture: "dev-two", x: 1030, y: 455 },
  { name: "KIRA", role: "Creative", status: "Mendesain", texture: "employee", x: 820, y: 755 },
];

export function PhaserOfficeCanvas({ className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let game: import("phaser").Game | null = null;

    void import("phaser").then((Phaser) => {
      if (disposed || !hostRef.current) return;

      class LivingHQScene extends Phaser.Scene {
        private dragPoint?: { x: number; y: number };
        private world!: Phaser.GameObjects.Container;

        constructor() {
          super("mex-nex-living-hq-2d");
        }

        preload() {
          this.load.image("agent-nex", "/office-assets/claude-office/characters/dev-1-front-left.png");
          this.load.image("agent-mira", "/office-assets/claude-office/characters/dev-1-front-right.png");
          this.load.image("agent-atlas", "/office-assets/claude-office/characters/dev-2-front-left.png");
          this.load.image("agent-kira", "/office-assets/claude-office/characters/employee-1-front-left.png");
          this.load.image("desk", "/office-assets/claude-office/furniture/standing-desk-left-front.png");
          this.load.image("plant", "/office-assets/claude-office/decoration/monstera-plant.png");
          this.load.image("whiteboard", "/office-assets/claude-office/decoration/white-board.png");
          this.load.image("coffee", "/office-assets/claude-office/appliances/coffee-on.png");
          this.load.image("tasks", "/office-assets/claude-office/culture/todo-board.png");
        }

        create() {
          this.cameras.main.setBackgroundColor("#dce8e2");
          this.world = this.add.container(0, 0);
          this.drawRoom();
          this.placeFurniture();
          this.placeAgents();
          this.setupCamera();
          this.setupInteraction();
          this.scale.on("resize", () => this.fitCamera());
        }

        private polygon(points: IsoPoint[], fill: number, alpha = 1, stroke?: number) {
          const graphics = this.add.graphics();
          graphics.fillStyle(fill, alpha);
          graphics.fillPoints(points.map((p) => new Phaser.Geom.Point(p.x, p.y)), true);
          if (stroke !== undefined) {
            graphics.lineStyle(3, stroke, 0.9);
            graphics.strokePoints(points.map((p) => new Phaser.Geom.Point(p.x, p.y)), true);
          }
          this.world.add(graphics);
          return graphics;
        }

        private line(points: IsoPoint[], color: number, width = 2, alpha = 1) {
          const graphics = this.add.graphics();
          graphics.lineStyle(width, color, alpha);
          graphics.beginPath();
          graphics.moveTo(points[0].x, points[0].y);
          points.slice(1).forEach((p) => graphics.lineTo(p.x, p.y));
          graphics.strokePath();
          this.world.add(graphics);
        }

        private label(text: string, x: number, y: number, color = "#52665f", size = "17px") {
          const item = this.add.text(x, y, text, {
            fontFamily: "Arial, sans-serif",
            fontSize: size,
            fontStyle: "bold",
            color,
            letterSpacing: 2,
            backgroundColor: "#f4ead8",
            padding: { x: 9, y: 6 },
          }).setOrigin(0.5);
          this.world.add(item);
          return item;
        }

        private drawRoom() {
          // One enclosed interior, with a generous central circulation aisle.
          this.polygon(
            [{x:800,y:105},{x:1450,y:455},{x:800,y:815},{x:150,y:455}],
            0x9b7857, 1, 0x76583f,
          );
          this.polygon(
            [{x:800,y:82},{x:1420,y:420},{x:800,y:760},{x:180,y:420}],
            0xe8d8bd, 1, 0x8e6d4e,
          );

          // Floor boards follow the isometric axes.
          for (let i = -8; i <= 8; i++) {
            const y = 420 + i * 20;
            const half = Math.max(0, 620 - Math.abs(i) * 38);
            this.line([{x:800-half,y},{x:800+half,y}], 0xb69a78, 1, 0.22);
          }
          for (let i = -12; i <= 12; i++) {
            const x = 800 + i * 48;
            const reach = Math.max(0, 340 - Math.abs(i) * 25);
            this.line([{x,y:420-reach},{x,y:420+reach}], 0xb69a78, 1, 0.18);
          }

          // Interior back walls with a clean L-shaped silhouette.
          this.polygon([{x:180,y:420},{x:800,y:82},{x:800,y:24},{x:180,y:362}], 0xf2e8d7, 1, 0x9a7b5c);
          this.polygon([{x:800,y:82},{x:1420,y:420},{x:1420,y:362},{x:800,y:24}], 0xe8d9c3, 1, 0x9a7b5c);
          this.line([{x:180,y:362},{x:800,y:24},{x:1420,y:362}], 0x795b43, 8, 1);

          // MEX-NEX identity wall and information displays.
          this.polygon([{x:330,y:330},{x:510,y:232},{x:510,y:300},{x:330,y:398}], 0x263f49, 1, 0x182f38);
          this.label("MEX—NEX", 420, 313, "#fff0d9", "22px");
          this.polygon([{x:1010,y:190},{x:1160,y:272},{x:1160,y:326},{x:1010,y:244}], 0x173541, 1, 0x294e58);
          this.line([{x:1034,y:213},{x:1138,y:270}], 0x79b9b8, 4, 0.9);
          this.line([{x:1034,y:232},{x:1105,y:272}], 0x79b9b8, 3, 0.8);

          // Distinct floor finishes define zones without adding visual clutter.
          this.polygon([{x:300,y:465},{x:510,y:350},{x:700,y:455},{x:490,y:570}], 0xb8c6a9, 0.88, 0xd4d8c2);
          this.polygon([{x:690,y:455},{x:820,y:384},{x:950,y:455},{x:820,y:526}], 0xd6c5a7, 0.92, 0xe9dfce);
          this.polygon([{x:970,y:455},{x:1160,y:350},{x:1350,y:455},{x:1160,y:560}], 0xb5c9c6, 0.88, 0xd4e1d9);
          this.polygon([{x:390,y:665},{x:540,y:582},{x:690,y:665},{x:540,y:748}], 0xc5b7a2, 0.9, 0xe2d6c3);
          this.polygon([{x:710,y:665},{x:840,y:594},{x:970,y:665},{x:840,y:736}], 0xe2d2b6, 0.9, 0xf1e5d2);

          this.label("ENGINEERING", 500, 355);
          this.label("MEETING ROOM", 820, 405);
          this.label("CREATIVE STUDIO", 1160, 355);
          this.label("LOUNGE", 540, 650);
          this.label("PANTRY", 840, 645);
          this.label("OPERATIONS", 1260, 585);

          // Low glass partitions: straight segments with deliberate door gaps.
          this.polygon([{x:735,y:440},{x:755,y:429},{x:755,y:515},{x:735,y:526}], 0x8db7ae, 0.42, 0x5c827d);
          this.polygon([{x:755,y:429},{x:900,y:508},{x:900,y:594},{x:755,y:515}], 0x8db7ae, 0.34, 0x5c827d);
          this.polygon([{x:925,y:335},{x:945,y:324},{x:945,y:410},{x:925,y:421}], 0x8db7ae, 0.4, 0x5c827d);
          this.line([{x:745,y:438},{x:745,y:518}], 0xe4f5ed, 3, 0.8);
          this.line([{x:780,y:443},{x:780,y:529}], 0xe4f5ed, 2, 0.6);

          // Wall-mounted task board and acoustic panels.
          const board = this.add.image(1280, 300, "tasks").setScale(0.22).setDepth(300);
          this.world.add(board);
          [0,1,2,3].forEach((i) => {
            this.polygon([{x:590+i*34,y:155+i*18},{x:612+i*34,y:143+i*18},{x:612+i*34,y:205+i*18},{x:590+i*34,y:217+i*18}], 0xb78b68, 0.95);
          });
        }

        private placeFurniture() {
          const sorted = [...FURNITURE].sort((a,b) => a.y - b.y);
          sorted.forEach((item) => {
            const desk = this.add.image(item.x, item.y, item.key)
              .setScale(item.scale)
              .setOrigin(0.5, 0.82)
              .setDepth(item.y);
            this.world.add(desk);
          });

          const whiteboard = this.add.image(270, 315, "whiteboard").setScale(0.23).setDepth(315);
          const coffee = this.add.image(1120, 650, "coffee").setScale(0.23).setDepth(650);
          const plants = [
            this.add.image(230, 520, "plant").setScale(0.2).setDepth(520),
            this.add.image(1360, 520, "plant").setScale(0.2).setDepth(520),
            this.add.image(1380, 300, "plant").setScale(0.17).setDepth(300),
          ];
          this.world.add([whiteboard, coffee, ...plants]);
        }

        private placeAgents() {
          const textures = ["agent-nex", "agent-mira", "agent-atlas", "agent-kira"];
          AGENTS.forEach((agent, index) => {
            const group = this.add.container(agent.x, agent.y).setDepth(agent.y + 30);
            const shadow = this.add.ellipse(0, 4, 48, 15, 0x26342e, 0.26);
            const sprite = this.add.image(0, 0, textures[index]).setScale(0.17).setOrigin(0.5, 0.86);
            const name = this.add.text(0, -92, agent.name, {
              fontFamily: "Arial, sans-serif", fontSize: "15px", fontStyle: "bold",
              color: "#fff8e9", backgroundColor: "#29454a", padding: {x:7,y:4},
            }).setOrigin(0.5);
            const status = this.add.text(0, -68, agent.status, {
              fontFamily: "Arial, sans-serif", fontSize: "11px",
              color: "#27433d", backgroundColor: "#e6eddb", padding: {x:6,y:3},
            }).setOrigin(0.5);
            group.add([shadow, sprite, name, status]);
            group.setSize(72, 112);
            group.setInteractive(new Phaser.Geom.Rectangle(-38, -100, 76, 112), Phaser.Geom.Rectangle.Contains);
            group.on("pointerdown", () => {
              const detail = this.add.text(agent.x + 48, agent.y - 30, agent.role, {
                fontFamily: "Arial, sans-serif", fontSize: "13px", color: "#fff8e9",
                backgroundColor: "#29454a", padding: {x:9,y:7},
              }).setDepth(1400);
              this.time.delayedCall(2400, () => detail.destroy());
            });
            this.world.add(group);
            this.tweens.add({ targets: sprite, y: -3, duration: 1300, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
          });
        }

        private setupCamera() {
          this.cameras.main.setBounds(0, 0, 1600, 900);
          this.fitCamera();
        }

        private fitCamera() {
          if (!this.world) return;
          const camera = this.cameras.main;
          const scale = Math.min(this.scale.width / 1600, this.scale.height / 900);
          camera.setZoom(Phaser.Math.Clamp(scale * 1.04, 0.35, 1.1));
          camera.centerOn(800, 455);
        }

        private setupInteraction() {
          const camera = this.cameras.main;
          this.input.on("pointerdown", (pointer: import("phaser").Input.Pointer) => {
            this.dragPoint = { x: pointer.x, y: pointer.y };
          });
          this.input.on("pointerup", () => { this.dragPoint = undefined; });
          this.input.on("pointerupoutside", () => { this.dragPoint = undefined; });
          this.input.on("pointermove", (pointer: import("phaser").Input.Pointer) => {
            if (!this.dragPoint || !pointer.isDown) return;
            camera.scrollX -= (pointer.x - this.dragPoint.x) / camera.zoom;
            camera.scrollY -= (pointer.y - this.dragPoint.y) / camera.zoom;
            this.dragPoint = { x: pointer.x, y: pointer.y };
          });
          this.input.on("wheel", (_pointer: unknown, _objects: unknown, _dx: number, dy: number) => {
            camera.setZoom(Phaser.Math.Clamp(camera.zoom - dy * 0.001, 0.35, 1.2));
          });
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: hostRef.current,
        backgroundColor: "#dce8e2",
        scale: { mode: Phaser.Scale.RESIZE, width: "100%", height: "100%" },
        render: { antialias: false, pixelArt: true, roundPixels: true },
        scene: [LivingHQScene],
        banner: false,
      });
    });

    return () => {
      disposed = true;
      game?.destroy(true);
    };
  }, []);

  return <div ref={hostRef} className={className ?? "h-full min-h-[520px] w-full overflow-hidden"} aria-label="Kantor MEX-NEX isometrik 2D" />;
}
