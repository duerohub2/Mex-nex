"use client";

import { useState } from "react";
import { PhaserOfficeCanvas } from "@/features/office-world-2d/PhaserOfficeCanvas";

const LEVELS = [
  { id: "building", label: "Gedung" },
  { id: "basement", label: "B" },
  { id: "floor-1", label: "01" },
  { id: "floor-2", label: "02" },
  { id: "floor-3", label: "03" },
  { id: "floor-4", label: "04" },
  { id: "rooftop", label: "RF" },
] as const;

type Level = (typeof LEVELS)[number]["id"];

export default function LivingHQ2DPage() {
  const [level, setLevel] = useState<Level>("building");
  return (
    <main className="flex h-[100svh] min-h-[520px] w-full flex-col overflow-hidden bg-[#dce8e2] text-[#49392f]">
      <header className="flex items-center justify-between gap-3 border-b border-[#b99a79] bg-[#fff3df] px-4 py-3">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#bd7046]">MEX-NEX · LIVING HQ</p>
          <h1 className="text-lg font-extrabold">Kantor Isometrik 2.5D</h1>
        </div>
        <span className="rounded-full border border-[#b99a79] bg-white px-3 py-1 text-xs font-bold">PHASER</span>
      </header>
      <nav aria-label="Navigasi lantai" className="flex gap-2 overflow-x-auto border-b border-[#d3bea3] bg-[#fff8ed] px-3 py-2">
        {LEVELS.map((item) => (
          <button key={item.id} type="button" onClick={() => setLevel(item.id)} aria-pressed={level === item.id}
            className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-bold ${level === item.id ? "border-[#594638] bg-[#eaa16a] text-[#49392f]" : "border-[#d3bea3] bg-white"}`}>
            {item.label}
          </button>
        ))}
      </nav>
      <section className="min-h-0 flex-1">
        <PhaserOfficeCanvas level={level} />
      </section>
      <footer className="border-t border-[#b99a79] bg-[#fff3df] px-4 py-2 text-xs text-[#715d4d]">
        Preview renderer 2.5D · visual proof of concept · aktivitas Agent/backend belum disambungkan
      </footer>
    </main>
  );
}
