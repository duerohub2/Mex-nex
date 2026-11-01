"use client";

import { useEffect, useRef } from "react";

type Props = { className?: string };
type Point = { x: number; y: number };

/**
 * MEX-NEX architectural blockout.
 * This stage intentionally contains only the floor slab, perimeter walls,
 * interior partitions, and door openings. Furniture, agents, signage,
 * lighting effects, and decorative assets belong to later stages.
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
        private dragPoint?: { x: number; y: number };

        constructor() {
          super("mex-nex-architecture-blockout");
        }

        create() {
          this.cameras.main.setBackgroundColor("#dce5e2");
          this.cameras.main.roundPixels = true;
          this.world = this.add.container(0, 0);
          this.drawArchitecture();
          this.cameras.main.setBounds(0, 0, 1600, 900);
          this.fitCamera();
          this.input.on("pointerdown", (pointer: import("phaser").Input.Pointer) => {
            this.dragPoint = { x: pointer.x, y: pointer.y };
          });
          this.input.on("pointerup", () => { this.dragPoint = undefined; });
          this.input.on("pointerupoutside", () => { this.dragPoint = undefined; });
          this.input.on("pointermove", (pointer: import("phaser").Input.Pointer) => {
            if (!this.dragPoint || !pointer.isDown) return;
            this.cameras.main.scrollX -= (pointer.x - this.dragPoint.x) / this.cameras.main.zoom;
            this.cameras.main.scrollY -= (pointer.y - this.dragPoint.y) / this.cameras.main.zoom;
            this.dragPoint = { x: pointer.x, y: pointer.y };
          });
          this.input.on("wheel", (_p: unknown, _o: unknown, _dx: number, dy: number) => {
            this.cameras.main.setZoom(Phaser.Math.Clamp(this.cameras.main.zoom - dy * 0.001, 0.35, 1.2));
          });
          this.scale.on("resize", () => this.fitCamera());
        }

        private polygon(points: Point[], fill: number, stroke: number, lineWidth = 3) {
          const graphics = this.add.graphics();
          graphics.fillStyle(fill, 1);
          graphics.fillPoints(points.map((p) => new Phaser.Geom.Point(p.x, p.y)), true);
          graphics.lineStyle(lineWidth, stroke, 1);
          graphics.strokePoints(points.map((p) => new Phaser.Geom.Point(p.x, p.y)), true);
          this.world.add(graphics);
          return graphics;
        }

        private wall(points: Point[], color = 0xe8dfce, edge = 0x826f5b, lineWidth = 4) {
          return this.polygon(points, color, edge, lineWidth);
        }

        private drawArchitecture() {
          // One broad, continuous floor plate with a raised outer foundation.
          this.polygon(
            [{x:800,y:112},{x:1470,y:455},{x:800,y:820},{x:130,y:455}],
            0x92765d, 0x6f5947, 5
          );
          this.polygon(
            [{x:800,y:82},{x:1430,y:410},{x:800,y:752},{x:170,y:410}],
            0xb9aa91, 0x8c7963, 4
          );
          this.polygon(
            [{x:800,y:96},{x:1405,y:410},{x:800,y:736},{x:195,y:410}],
            0xd8cbb5, 0xb2a18a, 2
          );

          // Exterior perimeter walls. The front/south edge remains open so
          // the complete interior plan can be inspected from the isometric view.
          this.wall(
            [{x:195,y:410},{x:800,y:96},{x:800,y:34},{x:195,y:348}],
            0xf0e8d9, 0x88745e, 5
          );
          this.wall(
            [{x:800,y:96},{x:1405,y:410},{x:1405,y:348},{x:800,y:34}],
            0xe6dac6, 0x88745e, 5
          );
          // Short side returns give the building a clear enclosed footprint.
          this.wall(
            [{x:195,y:410},{x:195,y:348},{x:245,y:375},{x:245,y:437}],
            0xe8decc, 0x88745e, 4
          );
          this.wall(
            [{x:1405,y:410},{x:1405,y:348},{x:1355,y:375},{x:1355,y:437}],
            0xe8decc, 0x88745e, 4
          );

          // Interior partition plan: ten room footprints around a wide central
          // circulation hall. Segments are deliberately interrupted at doors.
          const partitions: Array<{ a: Point; b: Point; c: Point; d: Point }> = [
            // Upper row: engineering / research / creative
            {a:{x:615,y:300},b:{x:650,y:282},c:{x:650,y:345},d:{x:615,y:363}},
            {a:{x:950,y:300},b:{x:985,y:318},c:{x:985,y:363},d:{x:950,y:345}},
            // Middle row: meeting / collaboration / executive
            {a:{x:610,y:438},b:{x:645,y:420},c:{x:645,y:475},d:{x:610,y:493}},
            {a:{x:955,y:420},b:{x:990,y:438},c:{x:990,y:493},d:{x:955,y:475}},
            // Lower row: lounge / pantry / operations
            {a:{x:615,y:570},b:{x:650,y:552},c:{x:650,y:615},d:{x:615,y:633}},
            {a:{x:950,y:552},b:{x:985,y:570},c:{x:985,y:633},d:{x:950,y:615}},
          ];
          partitions.forEach((p) => {
            this.wall([p.a,p.b,p.c,p.d], 0xd9d0bf, 0x8c7965, 3);
          });

          // Cross partitions are built as short wall sections with door gaps.
          // Each pair leaves a visible 54–64 px opening between wall ends.
          const crossWalls: Point[][] = [
            [{x:330,y:350},{x:470,y:278},{x:485,y:286},{x:345,y:358}],
            [{x:520,y:260},{x:610,y:213},{x:625,y:221},{x:535,y:268}],
            [{x:675,y:180},{x:770,y:131},{x:785,y:139},{x:690,y:188}],
            [{x:830,y:131},{x:925,y:180},{x:910,y:188},{x:815,y:139}],
            [{x:990,y:213},{x:1080,y:260},{x:1065,y:268},{x:975,y:221}],
            [{x:1130,y:278},{x:1270,y:350},{x:1255,y:358},{x:1115,y:286}],
            [{x:365,y:520},{x:455,y:568},{x:440,y:576},{x:350,y:528}],
            [{x:510,y:596},{x:600,y:643},{x:585,y:651},{x:495,y:604}],
            [{x:1000,y:643},{x:1090,y:596},{x:1105,y:604},{x:1015,y:651}],
            [{x:1145,y:568},{x:1235,y:520},{x:1250,y:528},{x:1160,y:576}],
          ];
          crossWalls.forEach((points) => this.wall(points, 0xe2d8c7, 0x8c7965, 3));

          // A clear, uninterrupted central hall remains as circulation space.
          // No furniture, characters, labels, textures, or decorative objects
          // are added in this architectural approval stage.
        }

        private fitCamera() {
          if (!this.world) return;
          const scale = Math.min(this.scale.width / 1600, this.scale.height / 900);
          this.cameras.main.setZoom(Phaser.Math.Clamp(scale * 1.02, 0.35, 1.1));
          this.cameras.main.centerOn(800, 430);
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: hostRef.current,
        backgroundColor: "#dce5e2",
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
      aria-label="Denah arsitektur kantor MEX-NEX satu lantai"
    />
  );
}
