# Tahap 5 — Building View, Floor View, dan Navigasi

## Implementasi

- Route preview Living HQ: `/office/living-hq`.
- `LivingHQExperience.tsx` menyediakan Building View dan pemilih enam level.
- Memilih level mengubah scene menjadi Floor View dengan hanya level terpilih yang ditampilkan.
- Tombol "Lihat seluruh gedung" mengembalikan Building View.
- Kamera orthographic berpindah dengan interpolasi halus melalui `LivingHQCameraRig.tsx`.
- OrbitControls tetap aktif untuk rotasi/pan/zoom pada perangkat yang mendukung pointer atau touch.
- Canvas tetap memakai fallback WebGL dari fondasi Tahap 3.
- Route `/office` dan renderer RetroOffice lama tidak diganti; preview Living HQ dipisahkan agar fitur kantor existing tetap aman.

## Perbaikan framing overview (setelah feedback)

- Feedback visual menunjukkan Building View tidak menampilkan keseluruhan gedung pada layar portrait.
- Preset kamera overview diperlebar: zoom diturunkan dari 24 menjadi 6.5, batas zoom overview disesuaikan menjadi 4–12, dan target vertikal digeser ke tengah massa gedung.
- Tujuan perubahan ini adalah memberi ruang horizontal yang cukup pada viewport portrait agar keseluruhan bentang gedung terlihat saat pertama dibuka.

## Validasi yang dijalankan

Pada sandbox Node 22, setelah `npm ci`:
- ESLint untuk seluruh file Living HQ yang berubah: **lulus**.
- `npm run build`: **lulus**.
- Next.js mengenali route statis `/office/living-hq`.
- `npm ci` melaporkan 33 advisori audit dependency (1 low, 20 moderate, 10 high, 2 critical); tidak dilakukan `npm audit fix` karena dapat mengubah dependency di luar cakupan.

## Batasan yang masih ada

- Belum dilakukan uji visual browser/iPhone atau profiling FPS.
- Building View memakai shell geometri Tahap 4; interior lengkap, furnitur final, avatar, dan aktivitas backend belum dipasang.
- OrbitControls memberi interaksi kamera; reset eksplisit dilakukan melalui tombol kembali ke Building View.
- Route preview terpisah dari `/office` untuk menjaga kantor existing. Integrasi sebagai pengalaman utama membutuhkan review UX dan regresi tersendiri.

## Acceptance checklist

- [x] Building View untuk seluruh gedung.
- [x] Pemilihan basement, lantai 1–4, dan rooftop.
- [x] Floor View untuk level terpilih.
- [x] Transisi kamera halus.
- [x] Kembali ke Building View dan reset tampilan.
- [x] Zoom/pan/rotasi melalui kontrol kamera.
- [x] ESLint file terkait.
- [x] Production build.
- [ ] Browser visual QA dan uji iPhone fisik.
- [ ] Integrasi ke alur utama `/office` setelah review regresi.
