# Tahap 3 — Fondasi 3D dan World Model

## Tujuan

Menyediakan kontrak dunia 3D yang stabil dan tidak terikat pada komponen renderer. Tahap ini menjadi fondasi untuk gedung cutaway, navigasi lantai, interior, karakter Agent, dan pemuatan aset.

## Temuan audit kompatibilitas

- Repository menggunakan Three.js, React Three Fiber, dan Drei.
- Renderer 3D existing berada di `src/features/retro-office/RetroOffice3D.tsx`, dengan kamera, pencahayaan, furniture, navigasi, Agent, kualitas grafis, dan persistence layout.
- Renderer existing adalah kantor retro/satu ruang kerja yang berkembang dari sistem lama. Tidak dihapus atau diganti oleh world model.
- `src/lib/office/floors.ts` mendefinisikan satu floor runtime bernama Hermes. Itu kontrak produk existing, bukan representasi gedung Living HQ enam tingkat. Tidak diubah.
- Karena renderer existing mempunyai skala koordinat dan model domain sendiri, world model baru tetap terisolasi sampai Tahap 4/5 memiliki adapter migrasi yang teruji.

## Kontrak dunia

### Sistem koordinat

- Unit kanonis: meter.
- Sumbu X: timur/barat; Y: vertikal; Z: utara/selatan.
- Origin: pusat slab lantai dasar.
- Gedung dibatasi X ±18m dan Z ±14m.
- Level basement mulai -4.5m, lantai dasar 0m, dan rooftop 18m.

### Level gedung

Basement (-4.5m), Lantai 1 (0m), Lantai 2 (4.5m), Lantai 3 (9m), Lantai 4 (13.5m), Rooftop (18m). Tinggi tipikal lantai 4.5m, rooftop 3.5m. Ini baseline desain awal, bukan hasil pengukuran aset final.

### Kamera dan lighting

- Building overview memakai orthographic camera isometric.
- Floor camera menargetkan pusat elevasi level yang dipilih.
- Zoom dibatasi berdasarkan preset; nilai non-finite ditangani secara defensif.
- Lighting menyediakan hemisphere, ambient, key light hangat dengan shadow, dan fill light dingin.
- Nilai lighting adalah baseline renderer config; belum diklaim sebagai hasil visual final pada perangkat.

### Scene graph dan kualitas

Urutan layer kanonis: environment → building-shell → interiors → furniture → agents → effects → ui. Furniture/effects dapat dikurangi pada perangkat rendah; struktur gedung, Agent, dan UI tidak dihilangkan.

### Asset loading

Setiap level mempunyai asset group mandiri. Manifest saat ini sengaja kosong karena belum ada aset gedung Living HQ yang disetujui. Tahap 4–6 akan mendaftarkan aset, ukuran, lisensi, dan batas pemuatan per level. Tidak ada path aset spekulatif.

## File implementasi

- `src/lib/office-world/world.ts`: koordinat, bounds, level, kamera, scene layers, manifest aset, helper world.
- `src/lib/office-world/renderer.ts`: konfigurasi kamera renderer, floor camera, zoom clamp, dan lighting.
- `src/lib/office-world/world.test.ts`: unit tests untuk kontrak world model.
- `src/lib/office-world/renderer.test.ts`: unit tests untuk konfigurasi renderer.
- `src/features/retro-office/RetroOffice3D.tsx`: renderer existing; belum dimigrasikan ke kontrak baru karena model koordinatnya berbeda.

## Batas Tahap 3

Tahap ini menyiapkan kontrak dan konfigurasi renderer. Belum membangun geometri gedung final, interior, avatar baru, navigasi kamera interaktif Building/Floor View, atau asset streaming runtime. Tahap 4 membangun geometri gedung; Tahap 5 mengintegrasikan transisi kamera dan navigasi.

## Acceptance criteria

- [x] Kontrak koordinat 3D dan unit ditetapkan.
- [x] Enam level dengan elevasi, bounds, dan asset group didefinisikan.
- [x] Kamera orthographic overview dan kamera per lantai didefinisikan.
- [x] Zoom clamp dan lighting baseline didefinisikan.
- [x] Scene layers dan kebijakan low-power didefinisikan.
- [x] Asset manifest per lantai tersedia tanpa path aset fiktif.
- [x] Existing renderer dan single runtime floor dipetakan sebagai dependensi kompatibilitas.
- [x] Unit test untuk world model dan renderer config ditambahkan.
- [ ] Unit test dijalankan dan lulus.
- [ ] Typecheck, lint, dan production build dijalankan pada commit tahap ini.
- [ ] Review visual dan profiling di Safari iPhone dilakukan.

**Status: KONTRAK DAN KONFIGURASI RENDERER SIAP; VALIDASI OTOMATIS DAN PERANGKAT MASIH MENUNGGU.**
