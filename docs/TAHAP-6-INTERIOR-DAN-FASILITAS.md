# Tahap 6 — Interior dan Fasilitas Living HQ

## Implementasi awal

Komponen baru: `src/features/office-world/OfficeInteriors.tsx`.

Seluruh elemen dibuat secara prosedural dengan primitive Three.js melalui React Three Fiber. Komponen mengikuti elevasi dan ID dari `OFFICE_LEVELS`; tidak ada aset eksternal yang lisensinya belum jelas.

### Isi per level

- **Basement:** rak server, area utilitas/penyimpanan, tanaman dekoratif.
- **Lantai 1:** area resepsionis, meja layanan, meja rapat kecil, workstation, dekorasi.
- **Lantai 2:** susunan workstation untuk area departemen.
- **Lantai 3:** workstation dan meja kolaborasi/rapat.
- **Lantai 4:** ruang rapat eksekutif, meja kerja pimpinan, area lounge.
- **Rooftop:** area taman, planter, dan tempat duduk.

### Fasilitas sirkulasi

- Placeholder shaft lift dengan panel pintu kaca.
- Tangga modular berbentuk susunan anak tangga.
- Komponen furnitur dasar: meja, kursi, monitor, rak server, planter dan signage.

### Integrasi

- Interior terpasang pada scene layer `interiors` di `LivingHQExperience`.
- Building View merender interior di semua level.
- Floor View hanya merender interior level yang dipilih.
- Route kantor lama `/office` tidak diubah.

## Validasi

- ESLint pada `OfficeInteriors.tsx` dan `LivingHQExperience.tsx`: **lulus**.
- `npm run build`: **lulus**.
- Pemeriksaan visual browser/iPhone dan profiling performa: **belum dilakukan**.

## Batas cakupan

Ini adalah pass pertama interior/fasilitas berbasis geometri. Pembagian ruang dengan dinding detail, aset furnitur final, material khusus tiap departemen, signage teks 3D, dan lift/tangga yang benar-benar berfungsi masih perlu iterasi lanjutan. Belum ada agent/avatar atau aktivitas backend pada ruangan.

## Acceptance checklist

- [x] Komponen interior terpisah dari shell gedung.
- [x] Konten interior dasar untuk enam level.
- [x] Furnitur dan fasilitas sirkulasi awal.
- [x] Building View dan Floor View memakai interior yang sesuai.
- [x] ESLint.
- [x] Production build.
- [ ] Review visual browser/iPhone.
- [ ] Detail final ruangan dan fasilitas interaktif.
