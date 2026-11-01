"use client";

import { OfficeWorldCanvas } from "@/features/office-world/OfficeWorldCanvas";
import { OfficeBuilding } from "@/features/office-world/OfficeBuilding";
import { OfficeInteriors } from "@/features/office-world/OfficeInteriors";
import { LivingHQEnvironment } from "@/features/office-world/LivingHQEnvironment";
import { OFFICE_LEVELS } from "@/lib/office-world/world";
import { getFloorCameraConfig } from "@/lib/office-world/renderer";

/**
 * Single-floor Living HQ: all departments share one connected, visible office.
 * The legacy multi-level world contract remains intact for backend compatibility.
 */
export function LivingHQExperience() {
  const level = OFFICE_LEVELS.find((item) => item.id === "floor-2")!;
  const visibleLevels = [level.id] as const;
  const camera = getFloorCameraConfig(level.id);

  return (
    <main className="relative flex h-[100svh] min-h-[560px] w-full flex-col overflow-hidden bg-[#d9e6e3] text-[#573b2b]">
      <header className="z-10 flex items-center justify-between gap-3 border-b border-[#8b6652]/20 bg-[#fff3e2]/95 px-4 py-3 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c56f3d]">MEX-NEX · LIVING HQ</p>
          <h1 className="text-lg font-extrabold">Kantor Utama · Semua Departemen</h1>
        </div>
        <span className="rounded-full border border-[#c7a98b] bg-white/80 px-3 py-1.5 text-xs font-bold">
          SINGLE-FLOOR OFFICE
        </span>
      </header>

      <section className="relative min-h-0 flex-1">
        <OfficeWorldCanvas
          camera={camera}
          interactive={false}
          scene={{
            environment: <LivingHQEnvironment />,
            "building-shell": <group scale={1.15}><OfficeBuilding visibleLevels={visibleLevels} interiorMode /></group>,
            interiors: <group scale={1.15}><OfficeInteriors visibleLevels={visibleLevels} /></group>,
          }}
        />
        <div className="pointer-events-none absolute bottom-4 left-4 max-w-[min(90vw,560px)] rounded-xl border border-white/70 bg-[#fff3e2]/90 px-3 py-2 text-xs font-semibold shadow">
          Satu kantor terhubung · Engineering · Meeting · Creative Studio · Lounge · Pantry
        </div>
      </section>
    </main>
  );
}
