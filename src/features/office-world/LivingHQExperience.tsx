"use client";

import { useMemo, useState } from "react";
import { OfficeBuilding } from "@/features/office-world/OfficeBuilding";
import { OfficeInteriors } from "@/features/office-world/OfficeInteriors";
import { OfficeWorldCanvas } from "@/features/office-world/OfficeWorldCanvas";
import { LivingHQEnvironment } from "@/features/office-world/LivingHQEnvironment";
import { OFFICE_LEVELS, type OfficeLevelId } from "@/lib/office-world/world";
import { BUILDING_CAMERA_CONFIG, getFloorCameraConfig } from "@/lib/office-world/renderer";

const LEVEL_COLORS: Record<OfficeLevelId, string> = {
  basement: "bg-slate-700 text-white",
  "floor-1": "bg-amber-600 text-white",
  "floor-2": "bg-emerald-700 text-white",
  "floor-3": "bg-sky-700 text-white",
  "floor-4": "bg-violet-700 text-white",
  rooftop: "bg-teal-700 text-white",
};

export function LivingHQExperience() {
  const [selectedLevel, setSelectedLevel] = useState<OfficeLevelId | null>(null);
  const visibleLevels = useMemo(
    () => (selectedLevel ? [selectedLevel] : OFFICE_LEVELS.map((level) => level.id)),
    [selectedLevel],
  );
  const camera = selectedLevel ? getFloorCameraConfig(selectedLevel) : BUILDING_CAMERA_CONFIG;

  return (
    <main className="relative flex h-[100svh] min-h-[560px] w-full flex-col overflow-hidden bg-[#d9e6e3] text-[#243b43]">
      <header className="z-20 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#29454a]/15 bg-[#fff8e9] px-4 py-3 shadow-sm">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#b96d42]">MEX-NEX · LIVING HEADQUARTERS</p>
          <h1 className="truncate text-base font-extrabold sm:text-lg">Gedung Kantor Utama</h1>
          <p className="text-[11px] font-medium text-[#64766d]">6 level · Basement, 4 lantai, dan rooftop</p>
        </div>
        <button
          type="button"
          onClick={() => setSelectedLevel(null)}
          className={`rounded-lg px-3 py-2 text-xs font-bold shadow-sm transition ${selectedLevel === null ? "bg-[#29454a] text-white" : "bg-[#e8dfd0] text-[#405b52] hover:bg-[#ddd0bc]"}`}
        >
          Tampilan Gedung
        </button>
      </header>

      <nav aria-label="Pilih lantai kantor" className="z-20 flex shrink-0 gap-2 overflow-x-auto border-b border-[#29454a]/10 bg-[#f5eddf] px-3 py-2">
        {OFFICE_LEVELS.map((level) => (
          <button
            key={level.id}
            type="button"
            onClick={() => setSelectedLevel(level.id)}
            aria-pressed={selectedLevel === level.id}
            className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-extrabold transition ${selectedLevel === level.id ? LEVEL_COLORS[level.id] + " border-transparent shadow-md" : "border-[#d6c8b4] bg-white/70 text-[#52665f] hover:bg-white"}`}
          >
            {level.shortLabel} · {level.label}
          </button>
        ))}
      </nav>

      <section className="relative min-h-0 flex-1 overflow-hidden">
        <OfficeWorldCanvas camera={camera} className="h-full min-h-[420px] w-full">
          <LivingHQEnvironment />\n          <HeadquartersScene visibleLevels={visibleLevels} />
        </OfficeWorldCanvas>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-3 left-3 max-w-[min(92%,560px)] rounded-xl border border-white/70 bg-[#fff8e9]/95 px-3 py-2 shadow-lg backdrop-blur-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#b96d42]">
              {selectedLevel ? OFFICE_LEVELS.find((level) => level.id === selectedLevel)?.label : "Building View"}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-[#405b52] sm:text-xs">
              {selectedLevel ? "Jelajahi interior lantai ini dengan geser dan zoom." : "Pilih salah satu lantai untuk melihat interior secara dekat."}
            </p>
          </div>
        </div>
      </section>
      <div className="hidden">
        <OfficeBuilding visibleLevels={visibleLevels} interiorMode />
        <OfficeInteriors visibleLevels={visibleLevels} />
      </div>
    </main>
  );
}
