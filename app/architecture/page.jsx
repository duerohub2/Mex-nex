import { PhaserOfficeCanvas } from "@/features/office-world-2d/PhaserOfficeCanvas";

export const metadata = {
  title: "Arsitektur Kantor | MEX-NEX",
  description: "Ruang kantor virtual isometrik MEX-NEX.",
};

export default function ArchitecturePage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0b1020] text-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#111827] px-5 py-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-300">MEX-NEX · ARCHITECTURE STUDIO</p>
          <h1 className="mt-1 text-xl font-bold tracking-tight">Ruang Kantor Isometrik</h1>
          <p className="mt-1 text-sm text-slate-400">Tahap 1 · Struktur bangunan, lantai, dinding, jendela, dan pintu.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200">MODE ARSITEKTUR</span>
          <a href="/" className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
            Kembali
          </a>
        </div>
      </header>
      <section className="flex-1 p-3 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>Perspektif isometrik · Satu ruangan kantor luas</span>
          <span>Drag untuk menggeser · Scroll untuk zoom · Belum ada furnitur atau karakter</span>
        </div>
        <div className="h-[calc(100vh-150px)] min-h-[560px] overflow-hidden rounded-xl border border-white/10 bg-[#111827] shadow-2xl shadow-black/30">
          <PhaserOfficeCanvas className="h-full min-h-[560px] w-full overflow-hidden" />
        </div>
      </section>
    </main>
  );
}
