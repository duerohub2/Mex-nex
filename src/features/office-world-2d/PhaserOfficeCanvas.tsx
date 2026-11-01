"use client";

import { useEffect, useRef } from "react";

type Props = { className?: string };

type IsoPoint = { x: number; y: number };
type Furniture = { key: string; x: number; y: number; scale: number; depthOffset?: number };
type LiveAgent = { agentId: string; name: string; state: "idle" | "working" | "meeting" | "error" };
const AGENT_SPRITES = ["agent-nex", "agent-mira", "agent-atlas", "agent-kira"] as const;
const AGENT_STATIONS = [
  { x: 410, y: 330 }, { x: 530, y: 330 },
  { x: 720, y: 330 }, { x: 850, y: 330 },
  { x: 1030, y: 330 }, { x: 1160, y: 330 },
  { x: 700, y: 500 }, { x: 900, y: 500 },
];
const STATE_LABEL: Record<LiveAgent["state"], string> = {
  idle: "IDLE", working: "BEKERJA", meeting: "MEETING", error: "ERROR",
};
const STATE_COLOR: Record<LiveAgent["state"], number> = {
  idle: 0x7b9287, working: 0x4f9b72, meeting: 0x5688b8, error: 0xc75b4d,
};
const FURNITURE: Furniture[] = [
  // Engineering and research
  { key: "desk", x: 405, y: 330, scale: 0.13 },
  { key: "desk", x: 530, y: 330, scale: 0.13 },
  { key: "desk", x: 710, y: 330, scale: 0.13 },
  { key: "desk", x: 835, y: 330, scale: 0.13 },
  // Creative studio
  { key: "desk", x: 1020, y: 330, scale: 0.13 },
  { key: "desk", x: 1145, y: 330, scale: 0.13 },
  // Operations and QA
  { key: "desk", x: 700, y: 505, scale: 0.13 },
  { key: "desk", x: 830, y: 505, scale: 0.13 },
  { key: "desk", x: 960, y: 505, scale: 0.13 },
  { key: "desk", x: 1090, y: 505, scale: 0.13 },
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
        private agentsLayer!: Phaser.GameObjects.Container;
        private presenceLabel!: Phaser.GameObjects.Text;
        private lastPresenceSignature = "";
        private presenceTimer?: Phaser.Time.TimerEvent;

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
          this.agentsLayer = this.add.container(0, 0);
          this.world.add(this.agentsLayer);
          this.presenceLabel = this.add.text(800, 710, "MENGHUBUNGKAN DATA AGENT…", {
            fontFamily: "Arial, sans-serif", fontSize: "12px", fontStyle: "bold",
            color: "#52665f", backgroundColor: "#f4ead8", padding: { x: 10, y: 6 },
            letterSpacing: 1,
          }).setOrigin(0.5);
          this.world.add(this.presenceLabel);
          this.refreshLiveAgents();
          this.presenceTimer = this.time.addEvent({
            delay: 8000, loop: true, callback: () => this.refreshLiveAgents(),
          });
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
          // One expansive enclosed office floor: a single continuous building,
          // subdivided into many functional rooms around a generous circulation hall.
          this.polygon(
            [{x:800,y:105},{x:1450,y:455},{x:800,y:815},{x:150,y:455}],
            0x8e6c4d,1,0x6e523d
          );
          this.polygon(
            [{x:800,y:78},{x:1415,y:410},{x:800,y:745},{x:185,y:410}],
            0xe8dbc4,1,0x9a7b5c
          );

          // Warm floor tiles and subtle construction grid.
          for(let i=-8;i<=8;i++){
            const y=410+i*20, half=Math.max(0,615-Math.abs(i)*38);
            this.line([{x:800-half,y},{x:800+half,y}],0xb59b7c,1,0.13);
          }
          for(let i=-12;i<=12;i++){
            const x=800+i*48, reach=Math.max(0,330-Math.abs(i)*24);
            this.line([{x,y:410-reach},{x,y:410+reach}],0xb59b7c,1,0.11);
          }

          // Enclosed perimeter walls, windows, and reception identity wall.
          this.polygon([{x:185,y:410},{x:800,y:78},{x:800,y:22},{x:185,y:354}],0xf4ead9,1,0x9a7b5c);
          this.polygon([{x:800,y:78},{x:1415,y:410},{x:1415,y:354},{x:800,y:22}],0xe9dac3,1,0x9a7b5c);
          this.line([{x:185,y:354},{x:800,y:22},{x:1415,y:354}],0x795b43,7,1);
          // Repeating window panels on both outer walls.
          for(let i=0;i<5;i++){
            const x=280+i*92, y=303-i*50;
            this.polygon([{x,y},{x:x+58,y:y-31},{x:x+58,y:y+2},{x,y:y+33}],0x9bbdc0,0.8,0x66878a);
          }
          for(let i=0;i<5;i++){
            const x=930+i*90, y=148+i*49;
            this.polygon([{x,y},{x:x+55,y:y+30},{x:x+55,y:y+62},{x,y:y+32}],0x9bbdc0,0.8,0x66878a);
          }
          this.polygon([{x:270,y:315},{x:430,y:228},{x:430,y:282},{x:270,y:369}],0x294650,1,0x1b343d);
          this.label("MEX—NEX",350,295,"#fff0d9","19px");

          // Ten dedicated rooms. The open central hall keeps the plan readable.
          const rooms = [
            { id:"RECEPTION", p:[{x:265,y:425},{x:385,y:360},{x:505,y:425},{x:385,y:490}], color:0xd7c5a9, x:385,y:416 },
            { id:"ENGINEERING", p:[{x:365,y:315},{x:490,y:248},{x:615,y:315},{x:490,y:382}], color:0xc7d4b9, x:490,y:292 },
            { id:"RESEARCH LAB", p:[{x:675,y:315},{x:800,y:248},{x:925,y:315},{x:800,y:382}], color:0xd8c9ad, x:800,y:292 },
            { id:"CREATIVE STUDIO", p:[{x:985,y:315},{x:1110,y:248},{x:1235,y:315},{x:1110,y:382}], color:0xc2d5d0, x:1110,y:292 },
            { id:"MEETING ROOM", p:[{x:455,y:475},{x:585,y:405},{x:715,y:475},{x:585,y:545}], color:0xd6c9b9, x:585,y:455 },
            { id:"COLLABORATION", p:[{x:690,y:465},{x:800,y:405},{x:910,y:465},{x:800,y:525}], color:0xeee4d2, x:800,y:455 },
            { id:"CEO OFFICE", p:[{x:885,y:475},{x:1015,y:405},{x:1145,y:475},{x:1015,y:545}], color:0xd5c9b3, x:1015,y:455 },
            { id:"LOUNGE", p:[{x:365,y:590},{x:490,y:522},{x:615,y:590},{x:490,y:658}], color:0xd2c2ad, x:490,y:570 },
            { id:"PANTRY", p:[{x:675,y:600},{x:800,y:532},{x:925,y:600},{x:800,y:668}], color:0xe0d2b8, x:800,y:580 },
            { id:"OPERATIONS + QA", p:[{x:985,y:590},{x:1110,y:522},{x:1235,y:590},{x:1110,y:658}], color:0xc8d4c9, x:1110,y:570 },
          ];
          rooms.forEach((room) => {
            this.polygon(room.p,room.color,0.98,0xb7a68d);
            this.label(room.id,room.x,room.y,"#425b50","11px");
          });

          // Room partitions: low glass walls and door gaps, not opaque blocks.
          const partitions = [
            [[615,315],[650,296],[650,390],[615,409]],
            [[950,315],[985,296],[985,390],[950,409]],
            [[620,470],[650,454],[650,555],[620,571]],
            [[950,470],[980,454],[980,555],[950,571]],
            [[600,590],[625,576],[625,660],[600,674]],
            [[975,590],[1000,576],[1000,660],[975,674]],
          ];
          partitions.forEach((pts) => {
            const [a,b,d,e]=pts;
            this.polygon(
              [{x:a[0],y:a[1]},{x:b[0],y:b[1]},{x:d[0],y:d[1]},{x:e[0],y:e[1]}],
              0x8db7ae,0.22,0x688d85
            );
          });

          // Central circulation spine, reception desk and wayfinding.
          this.line([{x:385,y:490},{x:585,y:545},{x:800,y:555},{x:1015,y:545},{x:1110,y:522}],0xb08f6c,4,0.55);
          this.label("MAIN HALL",800,515,"#8a735d","10px");
          const taskBoard=this.add.image(1280,300,"tasks").setScale(0.14).setDepth(300);
          this.world.add(taskBoard);
          [0,1,2,3].forEach(i=>{
            this.polygon(
              [{x:570+i*34,y:150+i*18},{x:592+i*34,y:138+i*18},{x:592+i*34,y:193+i*18},{x:570+i*34,y:205+i*18}],
              0xb78b68,0.9
            );
          });
        }

        private placeFurniture() {
          [...FURNITURE].sort((a,b)=>a.y-b.y).forEach(item=>{
            const desk=this.add.image(item.x,item.y,item.key)
              .setScale(item.scale).setOrigin(0.5,0.82).setDepth(item.y);
            this.world.add(desk);
          });

          // Shared facilities and visual clutter: reception, meeting, lounge, pantry,
          // executive office, research, and operations support.
          const props = [
            this.add.image(330,445,"whiteboard").setScale(0.105).setDepth(445),
            this.add.image(570,495,"whiteboard").setScale(0.095).setDepth(495),
            this.add.image(800,635,"coffee").setScale(0.12).setDepth(635),
            this.add.image(1080,610,"coffee").setScale(0.09).setDepth(610),
            this.add.image(450,620,"plant").setScale(0.10).setDepth(620),
            this.add.image(650,375,"plant").setScale(0.085).setDepth(375),
            this.add.image(950,375,"plant").setScale(0.085).setDepth(375),
            this.add.image(1260,485,"plant").setScale(0.10).setDepth(485),
            this.add.image(1320,330,"plant").setScale(0.10).setDepth(330),
            this.add.image(280,500,"plant").setScale(0.09).setDepth(500),
          ];
          this.world.add(props);

          // Extra built-in counters, storage and meeting table drawn as crisp pixel shapes.
          const details=this.add.graphics();
          details.fillStyle(0x8c7158,1);
          details.fillPoints([
            new Phaser.Geom.Point(720,575),new Phaser.Geom.Point(800,535),
            new Phaser.Geom.Point(880,575),new Phaser.Geom.Point(800,615),
          ],true);
          details.fillStyle(0xf0dfc5,1);
          details.fillPoints([
            new Phaser.Geom.Point(740,570),new Phaser.Geom.Point(800,540),
            new Phaser.Geom.Point(860,570),new Phaser.Geom.Point(800,600),
          ],true);
          details.fillStyle(0x6d8790,1);
          details.fillPoints([
            new Phaser.Geom.Point(1110,640),new Phaser.Geom.Point(1150,618),
            new Phaser.Geom.Point(1190,640),new Phaser.Geom.Point(1150,662),
          ],true);
          this.world.add(details);
        }

        /**
         * B7: render only agents returned by the configured remote gateway.
         * Local demo presence is intentionally excluded because its status is simulated.
         */
        private async refreshLiveAgents() {
          try {
            const response = await fetch("/api/office/presence?source=remote_gateway", {
              cache: "no-store",
              headers: { Accept: "application/json" },
            });
            if (!response.ok) throw new Error(`Presence API ${response.status}`);
            const payload = (await response.json()) as { agents?: unknown };
            const rawAgents = Array.isArray(payload.agents) ? payload.agents : [];
            const agents: LiveAgent[] = rawAgents.flatMap((entry) => {
              if (!entry || typeof entry !== "object") return [];
              const value = entry as Record<string, unknown>;
              if (typeof value.agentId !== "string" || !value.agentId.trim()) return [];
              const state = value.state === "working" || value.state === "meeting" || value.state === "error"
                ? value.state
                : "idle";
              return [{
                agentId: value.agentId.trim(),
                name: typeof value.name === "string" && value.name.trim() ? value.name.trim() : value.agentId.trim(),
                state,
              }];
            });
            const signature = JSON.stringify(agents);
            if (signature !== this.lastPresenceSignature) {
              this.lastPresenceSignature = signature;
              this.renderLiveAgents(agents);
            }
            this.presenceLabel.setText(
              agents.length > 0
                ? `${agents.length} AGENT TERHUBUNG · STATUS DARI GATEWAY`
                : "BELUM ADA AGENT DARI GATEWAY"
            );
            this.presenceLabel.setColor(agents.length > 0 ? "#426b55" : "#806c55");
          } catch {
            this.presenceLabel.setText("GATEWAY TIDAK TERHUBUNG · AVATAR TIDAK DITAMPILKAN");
            this.presenceLabel.setColor("#a34f43");
            if (this.lastPresenceSignature !== "offline") {
              this.lastPresenceSignature = "offline";
              this.renderLiveAgents([]);
            }
          }
        }

        private renderLiveAgents(agents: LiveAgent[]) {
          this.agentsLayer.removeAll(true);
          agents.slice(0, AGENT_STATIONS.length).forEach((agent, index) => {
            const station = AGENT_STATIONS[index];
            const actor = this.add.container(station.x, station.y - 38);
            const sprite = this.add.image(0, 0, AGENT_SPRITES[index % AGENT_SPRITES.length])
              .setScale(0.17)
              .setOrigin(0.5, 0.82);
            const name = this.add.text(0, -48, agent.name.slice(0, 18), {
              fontFamily: "Arial, sans-serif", fontSize: "11px", fontStyle: "bold",
              color: "#29454a", backgroundColor: "#fff8e9", padding: { x: 5, y: 3 },
            }).setOrigin(0.5, 1);
            const status = this.add.text(0, 9, STATE_LABEL[agent.state], {
              fontFamily: "Arial, sans-serif", fontSize: "9px", fontStyle: "bold",
              color: "#ffffff", backgroundColor: `#${STATE_COLOR[agent.state].toString(16).padStart(6, "0")}`,
              padding: { x: 5, y: 3 },
            }).setOrigin(0.5, 0);
            actor.add([sprite, name, status]);
            actor.setDepth(station.y + 10);
            this.agentsLayer.add(actor);
            this.tweens.add({
              targets: sprite,
              y: agent.state === "working" ? -2 : 2,
              duration: agent.state === "working" ? 520 : 1100,
              yoyo: true,
              repeat: -1,
              ease: "Sine.easeInOut",
            });
          });
          if (agents.length > AGENT_STATIONS.length) {
            const overflow = this.add.text(800, 680, `+${agents.length - AGENT_STATIONS.length} AGENT LAINNYA`, {
              fontFamily: "Arial, sans-serif", fontSize: "10px", fontStyle: "bold",
              color: "#52665f", backgroundColor: "#f4ead8", padding: { x: 7, y: 4 },
            }).setOrigin(0.5);
            this.agentsLayer.add(overflow);
          }
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
