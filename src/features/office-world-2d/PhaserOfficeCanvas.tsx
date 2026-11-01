"use client";

import { useEffect, useRef } from "react";

type Props = { className?: string };

type IsoPoint = { x: number; y: number };
type Furniture = { key: string; x: number; y: number; scale: number; depthOffset?: number };
const FURNITURE: Furniture[] = [
  // Three tidy work bays; paired desks share the same depth line.
  { key: "desk", x: 350, y: 435, scale: 0.17 },
  { key: "desk", x: 525, y: 485, scale: 0.17 },
  { key: "desk", x: 700, y: 435, scale: 0.17 },
  { key: "desk", x: 875, y: 485, scale: 0.17 },
  { key: "desk", x: 1050, y: 435, scale: 0.17 },
  { key: "desk", x: 1225, y: 485, scale: 0.17 },
  // Operations desks stay inside the lower-right floor boundary.
  { key: "desk", x: 700, y: 605, scale: 0.16 },
  { key: "desk", x: 900, y: 605, scale: 0.16 },
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
          this.cameras.main.roundPixels = true;
          this.world = this.add.container(0, 0);
          this.drawRoom();
          this.placeFurniture();
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
          // Enclosed isometric floor with a clear central circulation spine.
          this.polygon([{x:800,y:105},{x:1450,y:455},{x:800,y:815},{x:150,y:455}],0x8e6c4d,1,0x6e523d);
          this.polygon([{x:800,y:78},{x:1415,y:410},{x:800,y:745},{x:185,y:410}],0xe8dbc4,1,0x9a7b5c);

          // Subtle floor grid, clipped visually by the diamond silhouette.
          for(let i=-8;i<=8;i++){
            const y=410+i*20, half=Math.max(0,615-Math.abs(i)*38);
            this.line([{x:800-half,y},{x:800+half,y}],0xb59b7c,1,0.16);
          }
          for(let i=-12;i<=12;i++){
            const x=800+i*48, reach=Math.max(0,330-Math.abs(i)*24);
            this.line([{x,y:410-reach},{x,y:410+reach}],0xb59b7c,1,0.13);
          }

          // Back walls and branded reception wall.
          this.polygon([{x:185,y:410},{x:800,y:78},{x:800,y:22},{x:185,y:354}],0xf4ead9,1,0x9a7b5c);
          this.polygon([{x:800,y:78},{x:1415,y:410},{x:1415,y:354},{x:800,y:22}],0xe9dac3,1,0x9a7b5c);
          this.line([{x:185,y:354},{x:800,y:22},{x:1415,y:354}],0x795b43,7,1);
          this.polygon([{x:315,y:300},{x:485,y:208},{x:485,y:265},{x:315,y:357}],0x294650,1,0x1b343d);
          this.label("MEX—NEX",400,286,"#fff0d9","20px");

          // Department bays are aligned in one clear row; labels sit above furniture.
          const zones = [
            { p: [{x:245,y:455},{x:430,y:355},{x:615,y:455},{x:430,y:555}], c:0xc7d4b9, t:"ENGINEERING", x:430, y:380 },
            { p: [{x:615,y:455},{x:800,y:355},{x:985,y:455},{x:800,y:555}], c:0xd8c9ad, t:"RESEARCH", x:800, y:380 },
            { p: [{x:985,y:455},{x:1170,y:355},{x:1355,y:455},{x:1170,y:555}], c:0xc2d5d0, t:"CREATIVE STUDIO", x:1170, y:380 },
          ];
          zones.forEach((z) => {
            this.polygon(z.p, z.c, 0.94, 0xb7a68d);
            this.label(z.t, z.x, z.y, "#425b50", "13px");
          });

          // Shared facilities occupy the front edge without covering workstations.
          this.polygon([{x:410,y:625},{x:555,y:545},{x:700,y:625},{x:555,y:705}],0xd2c2ad,0.96,0xb7a68d);
          this.label("LOUNGE",555,590,"#425b50","13px");
          this.polygon([{x:700,y:625},{x:845,y:545},{x:990,y:625},{x:845,y:705}],0xe0d2b8,0.96,0xb7a68d);
          this.label("PANTRY",845,590,"#425b50","13px");
          this.polygon([{x:990,y:625},{x:1135,y:545},{x:1280,y:625},{x:1135,y:705}],0xc8d4c9,0.96,0xb7a68d);
          this.label("OPERATIONS",1135,590,"#425b50","13px");

          // A compact central circulation lane; no zone labels or furniture overlap it.
          this.polygon([{x:650,y:525},{x:800,y:445},{x:950,y:525},{x:800,y:605}],0xeee4d2,0.9,0xd0c0a8);
          this.label("COLLABORATION",800,520,"#7b6854","11px");

          // Glass partitions mark bay edges, not the walking path.
          this.polygon([{x:625,y:390},{x:638,y:383},{x:638,y:475},{x:625,y:482}],0x8db7ae,0.28,0x688d85);
          this.polygon([{x:962,y:390},{x:975,y:383},{x:975,y:475},{x:962,y:482}],0x8db7ae,0.28,0x688d85);
          this.polygon([{x:690,y:630},{x:703,y:623},{x:703,y:685},{x:690,y:692}],0x8db7ae,0.22,0x688d85);

          const board=this.add.image(1280,300,"tasks").setScale(0.18).setDepth(300);
          this.world.add(board);
          [0,1,2].forEach(i=>this.polygon(
            [{x:590+i*34,y:145+i*18},{x:612+i*34,y:133+i*18},{x:612+i*34,y:190+i*18},{x:590+i*34,y:202+i*18}],
            0xb78b68,0.9
          ));
        }

        private placeFurniture() {
          [...FURNITURE].sort((a,b)=>a.y-b.y).forEach(item=>{
            const desk=this.add.image(item.x,item.y,item.key).setScale(item.scale).setOrigin(0.5,0.82).setDepth(item.y);
            this.world.add(desk);
          });
          const whiteboard=this.add.image(270,315,"whiteboard").setScale(0.16).setDepth(315);
          const coffee=this.add.image(845,665,"coffee").setScale(0.15).setDepth(665);
          const plants=[
            this.add.image(205,475,"plant").setScale(0.14).setDepth(475),
            this.add.image(1390,475,"plant").setScale(0.14).setDepth(475),
            this.add.image(1350,300,"plant").setScale(0.13).setDepth(300),
            this.add.image(555,690,"plant").setScale(0.12).setDepth(690),
          ];
          this.world.add([whiteboard,coffee,...plants]);
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
