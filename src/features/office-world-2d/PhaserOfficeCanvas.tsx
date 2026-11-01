"use client";

import { useEffect, useRef } from "react";

type LevelId = "building" | "basement" | "floor-1" | "floor-2" | "floor-3" | "floor-4" | "rooftop";
type Props = { level: LevelId; className?: string };

const LEVEL_LABELS: Record<LevelId, string> = {
  building: "LIVING HQ · RUANG BENCHMARK",
  basement: "BASEMENT · OPERATIONS",
  "floor-1": "LANTAI 1 · RECEPTION",
  "floor-2": "LANTAI 2 · ENGINEERING",
  "floor-3": "LANTAI 3 · CREATIVE STUDIO",
  "floor-4": "LANTAI 4 · MANAGEMENT",
  rooftop: "ROOFTOP · LOUNGE",
};

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
        private room!: Phaser.GameObjects.Image;
        private caption!: Phaser.GameObjects.Text;
        private shade!: Phaser.GameObjects.Rectangle;

        constructor() {
          super("living-hq-art-benchmark");
        }

        preload() {
          this.load.svg("living-hq-room-benchmark", "/office-assets/benchmarks/living-hq-room.svg", {
            width: 1600,
            height: 1000,
          });
        }

        create() {
          this.room = this.add.image(0, 0, "living-hq-room-benchmark").setOrigin(0.5);
          this.shade = this.add.rectangle(0, 0, 10, 10, 0x172b34, 0.48).setOrigin(0);
          this.caption = this.add.text(22, 22, LEVEL_LABELS[this.selected], {
            fontFamily: "Arial, sans-serif",
            fontSize: "15px",
            fontStyle: "bold",
            color: "#fff5e6",
            backgroundColor: "#263d49",
            padding: { x: 14, y: 10 },
          }).setOrigin(0, 0);
          this.scale.on("resize", () => this.layoutScene());
          this.game.events.on("office-level-change", (next: LevelId) => {
            this.selected = next;
            this.caption.setText(LEVEL_LABELS[next]);
            this.layoutScene();
          });
          this.layoutScene();
        }

        private layoutScene() {
          if (!this.room || !this.caption || !this.shade) return;
          const width = this.scale.width;
          const height = this.scale.height;
          const sourceWidth = 1600;
          const sourceHeight = 1000;
          const scale = Math.max(width / sourceWidth, height / sourceHeight);
          this.room.setPosition(width / 2, height / 2 + 12);
          this.room.setDisplaySize(sourceWidth * scale, sourceHeight * scale);
          this.shade.setPosition(0, 0).setSize(width, 58);
          this.caption.setPosition(16, 14).setScale(Math.min(1, width / 420));
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: hostRef.current,
        backgroundColor: "#dce8e2",
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

  return <div ref={hostRef} className={className ?? "h-full min-h-[420px] w-full overflow-hidden"} aria-label="MEX-NEX isometric 2.5D art benchmark" />;
}
