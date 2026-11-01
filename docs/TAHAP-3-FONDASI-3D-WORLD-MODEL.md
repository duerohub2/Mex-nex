# Tahap 3 — Fondasi 3D dan World Model

<badge>SELESAI — fondasi kode dan validasi terukur</badge>

## Tujuan

Menyediakan kontrak dunia 3D yang stabil, renderer reusable, dan tidak terikat pada skala kantor retro lama. Fondasi ini menjadi landasan gedung cutaway, navigasi lantai, interior, karakter Agent, dan pemuatan aset.

## Temuan audit kompatibilitas

- Repository menggunakan Three.js, React Three Fiber, dan Drei.
- Renderer 3D existing berada di `src/features/retro-office/RetroOffice3D.tsx`, dengan kamera, pencahayaan, furniture, navigasi, Agent, kualitas grafis, dan persistence layout.
- Renderer existing adalah kantor retro/satu ruang kerja yang berkembang dari sistem lama. Tidak dihapus atau diganti.
- `src/lib/office/floors.ts` mendefinisikan satu floor runtime bernama Hermes. Itu kontrak produk existing, bukan representasi gedung Living HQ enam tingkat. Tidak diubah.
- World model Living HQ dipisahkan agar skala meter dan enam level tidak merusak persistence atau navigasi floor Hermes.
- Integrasi penuh dengan renderer lama sengaja tidak dilakukan: model koordinat dan tujuan produk berbeda. Renderer Living HQ baru tersedia sebagai shell reusable untuk tahap gedung berikutnya.

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
- `OfficeWorldCanvas` menerapkan konfigurasi kamera, lighting, kontrol orbit, shadow, batas DPR 1–1.5, low-power GPU preference, dan fallback saat WebGL tidak tersedia.
- Scene content dapat diberikan melalui slot layer bernama; geometri gedung sengaja menjadi pekerjaan Tahap 4.

### Scene graph dan kualitas

Urutan layer kanonis: environment → building-shell → interiors → furniture → agents → effects → ui. Furniture/effects dapat dikurangi pada perangkat rendah; struktur gedung, Agent, dan UI tidak dihilangkan.

### Asset loading

Setiap level mempunyai asset group mandiri. Manifest sengaja kosong karena belum ada aset gedung Living HQ yang disetujui. Tahap 4–6 akan mendaftarkan aset, ukuran, lisensi, dan batas pemuatan per level. Tidak ada path aset spekulatif.

## File implementasi

- `src/lib/office-world/world.ts`: koordinat, bounds, level, kamera, scene layers, manifest aset, helper world.
- `src/lib/office-world/renderer.ts`: konfigurasi kamera renderer, floor camera, zoom clamp, dan lighting.
- `src/features/office-world/OfficeWorldCanvas.tsx`: shell React Three Fiber reusable dengan kamera, lighting, scene slots, orbit controls, dan fallback.
- `tests/unit/officeWorld.test.ts`: 10 unit tests untuk world model dan renderer config.
- `src/features/retro-office/RetroOffice3D.tsx`: renderer existing; tetap utuh.

## Validasi yang benar-benar dijalankan

Lingkungan validasi: Vercel Sandbox, Node 22, dependency dipasang dari lockfile dengan `npm ci`.

| Pemeriksaan | Hasil |
|---|---|
| `npm ci` | Lulus; npm melaporkan 33 advisori dependency (1 low, 20 moderate, 10 high, 2 critical) |
| Unit test Tahap 3 | **Lulus: 10/10** |
| ESLint file Tahap 3 | **Lulus: 0 error, 0 warning** |
| `npm run build` | **Lulus** pada commit `c046d6594ee1ccae1581dfa2049b4125e7344d0b` |
| `npm run typecheck` penuh | Gagal pada error existing di `tests/unit/hermes3doctor.test.ts` dan `tests/unit/officeApiStageFive.test.ts`; tidak ada error dari file world model/renderer yang ditambahkan |
| Seluruh unit test | 1.275 lulus, 3 gagal di `tests/unit/onboardingState.test.ts`; kegagalan tidak terkait world model |
| Uji fisik Safari iPhone / FPS | Belum dilakukan; menjadi validasi perangkat pada Tahap 14 |

Catatan: production build Next.js lulus dan menjalankan pemeriksaan TypeScript yang relevan dengan build aplikasi. Itu tidak menghapus kegagalan typecheck keseluruhan yang mencakup test files.

## Batas yang sengaja diserahkan ke tahap berikutnya

- Geometri gedung cutaway dan struktur basement–rooftop: Tahap 4.
- Building View/Floor View, pemilihan lantai, transisi kamera, reset/zoom UI: Tahap 5.
- Interior dan fasilitas: Tahap 6.
- Avatar dan animasi: Tahap 7.
- Integrasi backend state, Agent, dan mobilitas: Tahap 8–9.
- Profiling perangkat iPhone dan release performance gate: Tahap 14.

## Acceptance criteria Tahap 3

- [x] Kontrak koordinat 3D dan unit ditetapkan.
- [x] Enam level dengan elevasi, bounds, dan asset group didefinisikan.
- [x] Kamera orthographic overview dan kamera per lantai didefinisikan.
- [x] Zoom clamp dan lighting baseline didefinisikan.
- [x] Scene layers dan kebijakan low-power didefinisikan.
- [x] Asset manifest per lantai tersedia tanpa path aset fiktif.
- [x] Renderer shell reusable memakai React Three Fiber dan Drei.
- [x] Fallback WebGL disediakan.
- [x] Existing renderer dan single runtime floor tetap kompatibel/tidak diubah.
- [x] Unit test Tahap 3 lulus.
- [x] ESLint untuk seluruh file Tahap 3 lulus.
- [x] Production build lulus.
- [x] Kegagalan typecheck dan full test suite yang sudah ada dicatat secara transparan.
- [ ] Uji visual dan profiling Safari iPhone — ditetapkan sebagai gate Tahap 14, setelah gedung dan interior nyata tersedia.

**Status Tahap 3: SELESAI.** Fondasi world model dan renderer reusable siap dipakai untuk membangun geometri gedung pada Tahap 4. Status ini tidak berarti gedung final sudah terlihat di halaman /office.
