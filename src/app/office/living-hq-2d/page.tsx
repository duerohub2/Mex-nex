"use client";

import { PhaserOfficeCanvas } from "@/features/office-world-2d/PhaserOfficeCanvas";

export default function LivingHQ2DPage() {
  return (
    <main className="flex h-[100svh] min-h-[520px] w-full flex-col overflow-hidden bg-[#dce8e2] text-[#49392f]">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#b99a79] bg-[#fff3df] px-4 py-3">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#bd7046]">MEX-NEX · LIVING HQ</p>
          <h1 className="text-lg font-extrabold">Kantor Utama · Semua Departemen</h1>
        </div>
        <span className="rounded-full border border-[#c9a987] bg-white/80 px-3 py-1 text-[11px] font-bold tracking-wide">SINGLE-FLOOR OFFICE</span>
      </header>
      <section className="relative min-h-0 flex-1">
        <PhaserOfficeCanvas />
        <div className="pointer-events-none absolute right-3 top-3 rounded-xl border border-white/70 bg-[#fff7e9]/90 px-3 py-2 text-[11px] font-medium text-[#654e3d] shadow-sm">
          PC: drag untuk geser · scroll untuk zoom · HP: satu jari geser · pinch untuk zoom
        </div>
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-white/70 bg-[#fff7e9]/90 px-3 py-2 text-[11px] font-medium text-[#654e3d] shadow-sm">
          Engineering · Meeting · Creative Studio · Lounge · Pantry · Operations
        </div>
      </section>
    </main>
  );
}
