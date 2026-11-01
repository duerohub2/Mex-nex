"use client";

import { useEffect, useRef } from "react";

type Props = { className?: string };
type Point = { x: number; y: number };

/**
 * Isometric architectural shell for MEX-NEX.
 * This approval pass contains only the floor, perimeter walls, windows and doors.
 * Furniture, agents and decorative props are intentionally excluded.
 */
export function PhaserOfficeCanvas({ className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let game: import("phaser").Game | null = null;

    void import("phaser").then((Phaser) => {
      if (disposed || !hostRef.current) return;

      class ArchitectureScene extends Phaser.Scene {
        private world!: Phaser.GameObjects.Container;
        private dragPoint?: Point;

        constructor() {
          super("mex-nex-isometric-architecture");
        }

        create() {
          this.cameras.main.setBackgroundColor("#111827");
          this.cameras.main.roundPixels = true;
          this.world = this.add.container(0, 0);
          this.drawRoom();
          this.cameras.main.setBounds(0, 0, 1400, 900);
          this.fitCamera();

          this.input.on("pointerdown", (pointer: import("phaser").Input.Pointer) => {
            this.dragPoint = { x: pointer.x, y: pointer.y };
          });
          const stopDrag = () => { this.dragPoint = undefined; };
          this.input.on("pointerup", stopDrag);
          this.input.on("pointerupoutside", stopDrag);
          this.input.on("pointermove", (pointer: import("phaser").Input.Pointer) => {
            if (!this.dragPoint || !pointer.isDown) return;
            this.cameras.main.scrollX -= (pointer.x - this.dragPoint.x) / this.cameras.main.zoom;
            this.cameras.main.scrollY -= (pointer.y - this.dragPoint.y) / this.cameras.main.zoom;
            this.dragPoint = { x: pointer.x, y: pointer.y };
          });
          this.input.on("wheel", (_p: unknown, _o: unknown, _dx: number, dy: number) => {
            this.cameras.main.setZoom(Phaser.Math.Clamp(this.cameras.main.zoom - dy * 0.001, 0.38, 1.35));
          });
          this.scale.on("resize", () => this.fitCamera());
        }

        private poly(points: Point[], fill: number, stroke = 0x263342, width = 3, alpha = 1) {
          const g = this.add.graphics();
          g.fillStyle(fill, alpha);
          g.fillPoints(points.map((p) => new Phaser.Geom.Point(p.x, p.y)), true);
          g.lineStyle(width, stroke, 1);
          g.strokePoints(points.map((p) => new Phaser.Geom.Point(p.x, p.y)), true);
          this.world.add(g);
          return g;
        }

        private line(a: Point, b: Point, color = 0x5b6572, width = 2, alpha = 1) {
          const g = this.add.graphics();
          g.lineStyle(width, color, alpha);
          g.lineBetween(a.x, a.y, b.x, b.y);
          this.world.add(g);
        }

        private drawRoom() {
          // Deep studio backdrop and soft ground shadow.
          this.poly(
            [{x:700,y:155},{x:1260,y:435},{x:700,y:735},{x:140,y:435}],
            0x0b1220, 0x0b1220, 1
          );

          // Thick raised foundation and one broad continuous timber floor.
          this.poly(
            [{x:700,y:160},{x:1210,y:415},{x:700,y:690},{x:190,y:415}],
            0x594638, 0x302a2b, 9
          );
          this.poly(
            [{x:700,y:139},{x:1210,y:394},{x:700,y:669},{x:190,y:394}],
            0xc18b5b, 0x553d32, 5
          );
          this.poly(
            [{x:700,y:151},{x:1185,y:394},{x:700,y:650},{x:215,y:394}],
            0xd7ad7c, 0x9b704f, 2
          );

          // Floorboard seams follow the isometric perspective.
          for (let i = 1; i < 15; i++) {
            const t = i / 15;
            this.line(
              {x:215 + 970 * t, y:394 + 0 * t},
              {x:700 + 0 * t, y:650 - 256 * t},
              0x9d7656, 1, 0.55
            );
          }
          for (let i = 1; i < 12; i++) {
            const t = i / 12;
            this.line(
              {x:700 - 485 * t, y:394 + 256 * t},
              {x:700 + 485 * t, y:394 + 256 * t},
              0xa77d5a, 1, 0.35
            );
          }

          // Back wall (left half in the isometric view), raised above the floor.
          this.poly(
            [{x:190,y:394},{x:700,y:139},{x:700,y: -18},{x:190,y:237}],
            0x9fb8c2, 0x344653, 5
          );
          // Right/back wall.
          this.poly(
            [{x:700,y:139},{x:1210,y:394},{x:1210,y:237},{x:700,y:-18}],
            0x879eaa, 0x344653, 5
          );

          // Large glass window bays on the left wall.
          const leftWindows = [
            [{x:245,y:366},{x:350,y:313},{x:350,y:155},{x:245,y:208}],
            [{x:365,y:306},{x:470,y:253},{x:470,y:95},{x:365,y:148}],
            [{x:485,y:246},{x:590,y:193},{x:590,y:35},{x:485,y:88}],
          ];
          leftWindows.forEach((pts, i) => {
            this.poly(pts, i % 2 ? 0x7ec8df : 0x9bd9e8, 0x344e5d, 4, 0.88);
            this.line(pts[0], pts[2], 0xe4f7ff, 2, 0.7);
            this.line(pts[1], pts[3], 0x527e91, 2, 0.65);
          });

          // Window sill and vertical mullions.
          this.line({x:232,y:372},{x:602,y:187},0x314653,7);
          this.line({x:232,y:365},{x:602,y:180},0xd5e6e8,2);
          [355,475].forEach((x) => this.line({x,y:310-(x-365)*0.5},{x,y:152-(x-365)*0.5},0x344e5d,5));

          // Glass panels on the right wall, leaving a solid section for a door.
          const rightWindows = [
            [{x:735,y:157},{x:840,y:210},{x:840,y:52},{x:735,y:-1}],
            [{x:855,y:217},{x:960,y:270},{x:960,y:112},{x:855,y:59}],
            [{x:975,y:277},{x:1080,y:330},{x:1080,y:172},{x:975,y:119}],
          ];
          rightWindows.forEach((pts) => {
            this.poly(pts, 0x83c9dd, 0x344e5d, 4, 0.86);
            this.line(pts[0], pts[2], 0xe8faff, 2, 0.7);
          });
          this.line({x:720,y:164},{x:1090,y:349},0x344653,7);
          this.line({x:720,y:157},{x:1090,y:342},0xd5e6e8,2);

          // Solid door bay and simple door opening on the right wall.
          this.poly(
            [{x:1095,y:337},{x:1190,y:385},{x:1190,y:228},{x:1095,y:180}],
            0x687d88, 0x344653, 4
          );
          this.poly(
            [{x:1110,y:327},{x:1174,y:359},{x:1174,y:245},{x:1110,y:213}],
            0x79533f, 0x342b2a, 3
          );
          this.line({x:1157,y:318},{x:1157,y:300},0xe7c68d,4);

          // Clean interior partition walls define zones without filling them.
          // Openings are intentionally left between each partition.
          const partitions: Point[][] = [
            [{x:420,y:410},{x:560,y:340},{x:560,y:355},{x:420,y:425}],
            [{x:840,y:355},{x:980,y:425},{x:980,y:440},{x:840,y:370}],
            [{x:365,y:490},{x:505,y:560},{x:505,y:575},{x:365,y:505}],
            [{x:895,y:575},{x:1035,y:505},{x:1035,y:520},{x:895,y:590}],
          ];
          partitions.forEach((p) => this.poly(p, 0xb8c6c8, 0x56636a, 3));
          // Low wall caps add readable architectural depth.
          this.line({x:420,y:410},{x:560,y:340},0xe7eeee,2);
          this.line({x:840,y:355},{x:980,y:425},0xe7eeee,2);
          this.line({x:365,y:490},{x:505,y:560},0xe7eeee,2);
          this.line({x:895,y:575},{x:1035,y:505},0xe7eeee,2);

          // Front edge remains visually open to reveal the entire interior.
          this.line({x:190,y:394},{x:700,y:650},0x3a3030,5);
          this.line({x:700,y:650},{x:1210,y:394},0x3a3030,5);
        }

        private fitCamera() {
          if (!this.world) return;
          const scale = Math.min(this.scale.width / 1400, this.scale.height / 900);
          this.cameras.main.setZoom(Phaser.Math.Clamp(scale * 1.08, 0.38, 1.15));
          this.cameras.main.centerOn(700, 350);
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: hostRef.current,
        backgroundColor: "#111827",
        scale: { mode: Phaser.Scale.RESIZE, width: "100%", height: "100%" },
        render: { antialias: false, pixelArt: true, roundPixels: true },
        scene: [ArchitectureScene],
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
      ref={hostRef}
      className={className ?? "h-full min-h-[520px] w-full overflow-hidden"}
      aria-label="Model arsitektur isometrik kantor MEX-NEX"
    />
  );
}
