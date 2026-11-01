"use client";

import { useEffect, useRef } from "react";

type Props = { className?: string };

type IsoPoint = { x: number; y: number };
type Furniture = { key: string; x: number; y: number; scale: number; depthOffset?: number };
type LiveAgent = { agentId: string; name: string; state: "idle" | "working" | "meeting" | "error" };
const AGENT_SPRITES = ["agent-nex", "agent-mira", "agent-atlas", "agent-kira"] as const;
const AGENT_STATIONS = [
  { x: 420, y: 425 }, { x: 555, y: 425 },
  { x: 720, y: 425 }, { x: 855, y: 425 },
  { x: 1020, y: 425 }, { x: 1155, y: 425 },
  { x: 935, y: 600 }, { x: 1045, y: 600 },
];
const STATE_LABEL: Record<LiveAgent["state"], string> = {
  idle: "IDLE", working: "BEKERJA", meeting: "MEETING", error: "ERROR",
};
const STATE_COLOR: Record<LiveAgent["state"], number> = {
  idle: 0x7b9287, working: 0x4f9b72, meeting: 0x5688b8, error: 0xc75b4d,
};
const FURNITURE: Furniture[] = [
  // Three upper work departments, two stations per department.
  { key: "desk", x: 420, y: 425, scale: 0.15 },
  { key: "desk", x: 555, y: 425, scale: 0.15 },
  { key: "desk", x: 720, y: 425, scale: 0.15 },
  { key: "desk", x: 855, y: 425, scale: 0.15 },
  { key: "desk", x: 1020, y: 425, scale: 0.15 },
  { key: "desk", x: 1155, y: 425, scale: 0.15 },
  // Operations is the only lower work bay.
  { key: "desk", x: 935, y: 600, scale: 0.145 },
  { key: "desk", x: 1045, y: 600, scale: 0.145 },
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

          // Six compact zones placed wholly inside the room footprint.
          // Upper row: focused work. Lower row: shared facilities and operations.
          const zones = [
            { p:[{x:330,y:385},{x:500,y:295},{x:670,y:385},{x:500,y:475}], c:0xc7d4b9, t:"ENGINEERING", x:500, y:330 },
            { p:[{x:630,y:385},{x:800,y:295},{x:970,y:385},{x:800,y:475}], c:0xd8c9ad, t:"RESEARCH", x:800, y:330 },
            { p:[{x:930,y:385},{x:1100,y:295},{x:1270,y:385},{x:1100,y:475}], c:0xc2d5d0, t:"CREATIVE STUDIO", x:1100, y:330 },
            { p:[{x:445,y:590},{x:590,y:515},{x:735,y:590},{x:590,y:665}], c:0xd2c2ad, t:"LOUNGE", x:590, y:555 },
            { p:[{x:655,y:590},{x:800,y:515},{x:945,y:590},{x:800,y:665}], c:0xe0d2b8, t:"PANTRY", x:800, y:555 },
            { p:[{x:865,y:590},{x:1010,y:515},{x:1155,y:590},{x:1010,y:665}], c:0xc8d4c9, t:"OPERATIONS", x:1010, y:555 },
          ];
          zones.forEach((z) => {
            this.polygon(z.p, z.c, 0.96, 0xb7a68d);
            this.label(z.t, z.x, z.y, "#425b50", "12px");
          });

          // Open central collaboration area separates work bays from shared facilities.
          this.polygon(
            [{x:675,y:490},{x:800,y:425},{x:925,y:490},{x:800,y:555}],
            0xeee4d2, 0.98, 0xcbb99f
          );
          this.label("COLLABORATION",800,480,"#7b6854","11px");

          // Minimal glass dividers only at the edges of the upper work bays.
          this.polygon([{x:665,y:365},{x:677,y:359},{x:677,y:440},{x:665,y:446}],0x8db7ae,0.24,0x688d85);
          this.polygon([{x:923,y:365},{x:935,y:359},{x:935,y:440},{x:923,y:446}],0x8db7ae,0.24,0x688d85);

          const board=this.add.image(1260,285,"tasks").setScale(0.15).setDepth(285);
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
          const whiteboard=this.add.image(285,305,"whiteboard").setScale(0.14).setDepth(305);
          const coffee=this.add.image(800,625,"coffee").setScale(0.13).setDepth(625);
          const plants=[
            this.add.image(225,455,"plant").setScale(0.12).setDepth(455),
            this.add.image(1370,455,"plant").setScale(0.12).setDepth(455),
            this.add.image(1360,295,"plant").setScale(0.11).setDepth(295),
            this.add.image(590,675,"plant").setScale(0.10).setDepth(675),
          ];
          this.world.add([whiteboard,coffee,...plants]);
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
