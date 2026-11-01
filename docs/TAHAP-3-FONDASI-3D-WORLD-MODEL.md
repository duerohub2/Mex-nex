# Tahap 3 — Fondasi 3D dan World Model

## Tujuan

Menyediakan kontrak dunia 3D yang stabil dan tidak terikat pada komponen renderer. Tahap ini menjadi fondasi untuk gedung cutaway, navigasi lantai, interior, karakter Agent, dan streaming aset.

## Temuan audit yang memengaruhi implementasi

- Repository sudah memakai Three.js, React Three Fiber, dan Drei.
- Renderer 3D yang sudah ada berada di `src/features/retro-office/RetroOffice3D.tsx`, dengan sistem kamera, pencahayaan, furniture, navigasi, Agent, kualitas grafis, dan persistence layout.
- Renderer existing adalah kantor retro/satu ruang kerja yang berkembang dari sistem lama. Tidak boleh dihapus atau diganti sebagai bagian dari fondasi world model.
- `src/lib/office/floors.ts` saat ini mendefinisikan satu floor runtime bernama Hermes. Itu kontrak produk existing, bukan representasi gedung Living HQ enam tingkat. Jangan mengubahnya diam-diam karena banyak UI dan persistence bergantung padanya.

## Kontrak dunia

### Sistem koordinat

- Unit kanonis: meter.
- Sumbu X: timur/barat.
- Sumbu Y: vertikal.
- Sumbu Z: utara/selatan.
- Origin: pusat slab lantai dasar.
- Gedung dibatasi pada X ±18m dan Z ±14m; rentang vertikal awal -8m sampai 25m.
- Posisi Agent logis tetap berupa room/workstation ID; koordinat 3D hanya proyeksi presentasi dan tidak menjadi sumber kebenaran task.

### Level gedung

Urutan level: Basement (-4.5m), Lantai 1 (0m), Lantai 2 (4.5m), Lantai 3 (9m), Lantai 4 (13.5m), Rooftop (18m). Tinggi tipikal lantai 4.5m, rooftop 3.5m. Angka adalah baseline desain yang dapat direvisi sebelum tahap gedung, bukan ukuran bangunan final yang telah tervalidasi visual.

### Kamera

- Building overview memakai kamera orthographic isometric, target di sekitar pusat bangunan.
- Floor camera menargetkan pusat elevasi level yang dipilih; offset kamera disediakan sebagai kontrak, bukan animasi navigasi final.
- Zoom harus dibatasi agar gedung tidak hilang dari viewport atau terlalu dekat.
- Transisi Building/Floor View akan dibangun di Tahap 5.

### Scene graph

Urutan layer kanonis: environment → building-shell → interiors → furniture → agents → effects → ui. Layer furniture/effects boleh dikurangi pada perangkat rendah; struktur gedung, Agent, dan UI tetap tersedia.

### Asset loading

Setiap level mempunyai asset group mandiri. Manifest saat ini sengaja kosong karena belum ada aset gedung Living HQ yang disetujui untuk dipasang. Tahap 4–6 akan mendaftarkan aset dan batas pemuatan per level. Jangan mengisi manifest dengan path spekulatif.

## File implementasi

- `src/lib/office-world/world.ts`: koordinat, bounds, level, kamera, scene layers, asset manifests, dan helper world.
- `src/lib/office-world/world.test.ts`: unit tests untuk kontrak world model.
- `RetroOffice3D` tetap renderer existing dan belum dimigrasikan ke world model baru.

## Batas implementasi

Tahap 3 belum membangun geometri gedung final, interior, avatar baru, perpindahan kamera antar lantai, atau asset streaming runtime. Tahap 3 juga tidak mengubah API office, task, Agent runtime, storage, maupun data floor existing.

## Acceptance criteria

- [x] Kontrak koordinat 3D dan unit ditetapkan.
- [x] Gedung memiliki enam level terurut dengan elevasi dan bounds.
- [x] Kamera overview isometric dan floor offset didefinisikan.
- [x] Scene layer dan kebijakan low-power didefinisikan.
- [x] Setiap level memiliki asset group independen tanpa path aset fiktif.
- [x] Existing renderer dan floor runtime dipetakan sebagai dependensi kompatibilitas.
- [x] Unit test untuk world model ditambahkan.
- [ ] Unit test dijalankan dan lulus pada CI.
- [ ] Typecheck, lint, dan production build dijalankan pada commit tahap ini.
- [ ] Review visual dan profiling di Safari iPhone dilakukan.

**Status: IMPLEMENTASI KONTRAK AWAL SELESAI; VALIDASI OTOMATIS DAN DEVICE MASIH MENUNGGU.**
