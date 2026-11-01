import { PhaserOfficeCanvas } from "@/src/features/office-world-2d/PhaserOfficeCanvas";

export const metadata = {
  title: "Denah Bangunan | MEX-NEX",
  description: "Tahap pembangunan struktur fisik kantor MEX-NEX.",
};

export default function ArchitecturePage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#dce5e2] text-[#26352f]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#b8c8c0] bg-[#f5f4ed] px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#71847a]">MEX-NEX · TAHAP PEMBANGUNAN</p>
          <h1 className="mt-1 text-xl font-bold">Denah Bangunan Kantor</h1>
          <p className="mt-1 text-sm text-[#63736b]">Fokus saat ini: lantai, dinding luar, dan sekat ruangan.</p>
        </div>
        <a href="/" className="rounded-lg border border-[#b9c5bd] bg-white px-4 py-2 text-sm font-semibold hover:bg-[#edf1ed]">
          Kembali ke Beranda
        </a>
      </header>
      <section className="flex-1 p-3 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#53665c]">
          <span>Mode arsitektur · Tanpa furnitur dan props</span>
          <span>Geser untuk menggeser denah · Scroll untuk zoom</span>
        </div>
        <div className="h-[calc(100vh-155px)] min-h-[520px] overflow-hidden rounded-xl border border-[#b6c4bc] shadow-sm">
          <PhaserOfficeCanvas className="h-full min-h-[520px] w-full overflow-hidden" />
        </div>
      </section>
    </main>
  );
}
