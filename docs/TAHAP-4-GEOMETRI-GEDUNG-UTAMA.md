# Tahap 4 — Geometri Gedung Utama

## Hasil implementasi

File utama: `src/features/office-world/OfficeBuilding.tsx`

Komponen ini membangun shell gedung secara prosedural menggunakan geometri Three.js/R3F yang sudah tersedia di proyek. Tidak ada model eksternal atau aset berlisensi yang diambil.

### Struktur yang dibuat

- Satu bangunan cutaway dengan enam level: basement, lantai 1–4, dan rooftop.
- Pelat lantai dan trim perimeter mengikuti koordinat world model Tahap 3.
- Kolom struktur pada perimeter dan titik tengah bentang.
- Dinding belakang dan dua sisi; sisi depan dibiarkan terbuka agar interior dapat terlihat dari kamera.
- Pita jendela kaca pada fasad depan dengan bingkai.
- Core tengah sebagai placeholder shaft vertikal.
- Elemen rooftop awal sebagai placeholder massa fasilitas/kanopi.
- Opsi `visibleLevels` dan `showStructure` untuk kebutuhan komposisi scene berikutnya.

### Batas cakupan

Tahap 4 membangun geometri shell dan struktur utama, bukan navigasi lantai atau interior final. Komponen belum dipasang ke route `/office` dan belum mengubah renderer kantor lama. Navigasi Building/Floor View adalah Tahap 5; ruang, furnitur, tangga/lift detail, dan fasilitas adalah Tahap 6.

### Validasi

- Source menggunakan `OFFICE_LEVELS` sebagai sumber elevasi dan ID level, sehingga tidak menduplikasi daftar level.
- Geometri bersifat procedural dan tidak memerlukan file model tambahan.
- **Belum dijalankan:** unit test, ESLint, typecheck, production build, browser preview, dan uji perangkat iPhone untuk commit Tahap 4.
- Karena validasi belum dijalankan, status B4 dicatat sebagai implementasi awal menunggu quality gate; belum dinyatakan selesai.

## Acceptance checklist

- [x] Komponen geometri enam level dibuat.
- [x] Bentuk cutaway/open-front dan shell perimeter dibuat.
- [x] Struktur kolom, pelat lantai, fasad kaca, core, dan rooftop placeholder dibuat.
- [x] Koordinat level mengambil kontrak world model Tahap 3.
- [ ] Unit test dan lint.
- [ ] Typecheck dan production build.
- [ ] Review visual melalui browser.
- [ ] Integrasi route dan navigasi (Tahap 5).
