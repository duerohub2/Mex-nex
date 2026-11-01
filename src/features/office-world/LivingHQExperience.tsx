"use client";

import dynamic from "next/dynamic";

const PhaserOfficeCanvas = dynamic(
  () => import("@/features/office-world-2d/PhaserOfficeCanvas").then((module) => module.PhaserOfficeCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[520px] items-center justify-center bg-[#dce8e2] text-sm font-semibold text-[#29454a]">
        Menyiapkan ruang kerja MEX-NEX…
      </div>
    ),
  },
);

/**
 * Main Living HQ route. Phaser is now the primary 2D isometric renderer;
 * React remains responsible for the page shell and future interactive panels.
 */
export function LivingHQExperience() {
  return (
    <main className="relative flex h-[100svh] min-h-[560px] w-full flex-col overflow-hidden bg-[#dce8e2] text-[#29454a]">
      <header className="z-10 flex shrink-0 items-center justify-between gap-3 border-b border-[#29454a]/15 bg-[#fff8e9] px-4 py-3 shadow-sm">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#b96d42]">MEX-NEX · LIVING HQ</p>
          <h1 className="truncate text-base font-extrabold sm:text-lg">Kantor Utama</h1>
          <p className="text-[11px] font-medium text-[#64766d]">Ruang kerja digital · Semua departemen</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-[#c9d8c8] bg-[#eaf1e3] px-3 py-1.5 text-[10px] font-bold text-[#426b55] sm:text-xs">
            INTERIOR 2D
          </span>
        </div>
      </header>

      <section className="relative min-h-0 flex-1 overflow-hidden bg-[#dce8e2]">
        <PhaserOfficeCanvas />
        <div className="pointer-events-none absolute bottom-3 left-3 max-w-[min(92%,520px)] rounded-xl border border-white/70 bg-[#fff8e9]/95 px-3 py-2 shadow-lg backdrop-blur-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#b96d42]">Living HQ</p>
          <p className="mt-0.5 text-[11px] font-semibold text-[#405b52] sm:text-xs">
            Engineering · Research · Creative Studio · Operations · Lounge · Pantry
          </p>
        </div>
        <div className="pointer-events-none absolute right-3 top-3 rounded-lg border border-white/70 bg-[#fff8e9]/95 px-3 py-2 text-[10px] font-semibold text-[#405b52] shadow-lg sm:text-xs">
          Geser untuk menjelajah · Scroll untuk zoom
        </div>
      </section>
    </main>
  );
}
