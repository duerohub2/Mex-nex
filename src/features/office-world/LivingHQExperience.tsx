"use client";

import { useMemo, useState } from "react";
import { OfficeWorldCanvas } from "@/features/office-world/OfficeWorldCanvas";
import { OfficeBuilding } from "@/features/office-world/OfficeBuilding";
import { OfficeInteriors } from "@/features/office-world/OfficeInteriors";
import { OFFICE_LEVELS, type OfficeLevelId } from "@/lib/office-world/world";
import { BUILDING_CAMERA_CONFIG, getFloorCameraConfig } from "@/lib/office-world/renderer";

export function LivingHQExperience() {
  const [activeLevel, setActiveLevel] = useState<OfficeLevelId | null>(null);
  const camera = useMemo(
    () => activeLevel ? getFloorCameraConfig(activeLevel) : BUILDING_CAMERA_CONFIG,
    [activeLevel],
  );
  const visibleLevels = activeLevel ? [activeLevel] : undefined;

  return (
    <main className="relative flex h-[100svh] min-h-[560px] w-full flex-col overflow-hidden bg-[#d9e6e3] text-[#573b2b]">
      <header className="z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#8b6652]/20 bg-[#fff3e2]/95 px-4 py-3 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c56f3d]">MEX-NEX · LIVING HQ</p>
          <h1 className="text-lg font-extrabold">{activeLevel ? OFFICE_LEVELS.find((level) => level.id === activeLevel)?.label : "Building View"}</h1>
        </div>
        <button
          type="button"
          onClick={() => setActiveLevel(null)}
          className="rounded-full border-2 border-[#573b2b] bg-[#f4a15d] px-4 py-2 text-sm font-bold shadow-[0_4px_0_#573b2b] active:translate-y-1 active:shadow-none"
        >
          Lihat seluruh gedung
        </button>
      </header>

      <nav aria-label="Pilih lantai" className="z-10 flex gap-2 overflow-x-auto bg-[#fff3e2]/90 px-3 py-3">
        <button
          type="button"
          aria-pressed={activeLevel === null}
          onClick={() => setActiveLevel(null)}
          className={`shrink-0 rounded-xl border-2 px-3 py-2 text-sm font-bold ${activeLevel === null ? "border-[#573b2b] bg-[#f4a15d]" : "border-[#c7a98b] bg-white"}`}
        >
          Gedung
        </button>
        {OFFICE_LEVELS.map((level) => (
          <button
            key={level.id}
            type="button"
            aria-pressed={activeLevel === level.id}
            onClick={() => setActiveLevel(level.id)}
            className={`shrink-0 rounded-xl border-2 px-3 py-2 text-sm font-bold ${activeLevel === level.id ? "border-[#573b2b] bg-[#f4a15d]" : "border-[#c7a98b] bg-white"}`}
          >
            {level.shortLabel}
          </button>
        ))}
      </nav>

      <section className="relative min-h-0 flex-1">
        <OfficeWorldCanvas
          camera={camera}
          interactive
          scene={{
            "building-shell": <OfficeBuilding visibleLevels={visibleLevels} />,
            interiors: <OfficeInteriors visibleLevels={visibleLevels} />,
          }}
        />
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-white/70 bg-[#fff3e2]/90 px-3 py-2 text-xs font-semibold shadow">
          {activeLevel ? "Floor View · pilih Gedung untuk kembali" : "Building View · pilih tombol lantai untuk masuk"}
        </div>
      </section>
    </main>
  );
}
