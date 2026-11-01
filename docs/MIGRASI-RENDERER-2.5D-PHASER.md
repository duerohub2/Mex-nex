# Migrasi Renderer Living HQ ke Isometrik 2.5D

## Keputusan 1 November 2026

Renderer target Living HQ beralih dari scene 3D real-time ke **Phaser 3 dengan proyeksi isometrik 2.5D**. Keputusan ini mengacu pada video referensi utama: sudut isometrik tetap, ruang/furnitur/karakter bergaya simulasi, dan komposisi diorama.

## Prinsip migrasi aman

- Tidak menghapus dependency atau komponen Three.js pada langkah pertama.
- Tidak mengubah domain backend, API, event, Agent runtime, task, atau storage.
- Renderer Phaser dibuat sebagai jalur preview terpisah terlebih dahulu.
- Route lama dan fitur kantor lama dipertahankan sampai parity visual dan integrasi backend lolos.
- World contract enam lantai tetap menjadi acuan; koordinat 2.5D akan memakai proyeksi isometrik.
- Aktivitas Agent tidak boleh direka. Preview statis diberi label sampai event/presence backend terhubung.

## Implementasi awal

Route: `/office/living-hq-2d`

Komponen:
- `src/features/office-world-2d/PhaserOfficeCanvas.tsx`
- `src/app/office/living-hq-2d/page.tsx`

Tahap awal adalah proof of concept renderer, navigasi enam level, dan bentuk ruang isometrik modular. Ini belum menyelesaikan art pipeline, sprite Agent, animasi, pathfinding, atau sinkronisasi backend.

## Tahapan berikutnya

1. Validasi build, route, ukuran layar, dan interaksi pada desktop/mobile.
2. Bangun asset pipeline isometrik: tileset lantai, dinding kaca, pintu, furnitur, dekorasi, bayangan.
3. Buat sprite Agent original beserta idle/walk/work/talk.
4. Buat room graph dan grid/pathfinding.
5. Sambungkan presence, task, lokasi Agent, dan aktivitas dari backend.
6. Bandingkan hasil visual terhadap video referensi; baru pertimbangkan menjadikan renderer ini route utama.
