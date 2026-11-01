"use client";

import dynamic from "next/dynamic";

const LivingHQExperience = dynamic(
  () => import("@/features/office-world/LivingHQExperience").then((module) => module.LivingHQExperience),
  {
    ssr: false,
    loading: () => (
      <main className="flex h-[100svh] min-h-[520px] items-center justify-center bg-[#d9e6e3] text-[#573b2b]">
        <div className="rounded-2xl border border-[#c7a98b] bg-[#fff3e2] px-6 py-5 text-center shadow-xl">
          <p className="text-xs font-bold tracking-[0.2em] text-[#c56f3d]">MEX-NEX · LIVING HQ</p>
          <p className="mt-2 text-sm font-semibold">Memuat aset kantor 2.5D…</p>
        </div>
      </main>
    ),
  },
);

export default function LivingHQ2DPage() {
  return <LivingHQExperience />;
}
