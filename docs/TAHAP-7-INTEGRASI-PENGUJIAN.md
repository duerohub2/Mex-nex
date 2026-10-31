# Tahap 7 — Integrasi dan Pengujian

## Tujuan
Memastikan modul yang dibangun pada Tahap 1–6 bekerja bersama, data tetap tersedia setelah restart, dan kegagalan runtime ditampilkan secara aman serta dapat ditindaklanjuti.

## Cakupan otomatis
- Integrasi API kantor: pembuatan tugas, penugasan Agent, dan pencatatan aktivitas.
- Persistensi: data kantor dibaca kembali setelah modul route dimuat ulang dengan direktori data yang sama.
- Komunikasi Agent: percakapan privat menggunakan provider yang dikonfigurasi, riwayat percakapan dilanjutkan setelah route dimuat ulang.
- Keamanan runtime: API key dikirim server-ke-provider dan tidak muncul di status runtime yang dikirim ke browser.
- Kegagalan provider: respons provider yang gagal dipetakan menjadi respons API yang aman.
- Validasi request: JSON rusak dan operasi kantor yang tidak valid ditolak.
- Regresi: seluruh unit test dijalankan di GitHub Actions, bukan hanya daftar tes tahap tertentu, lalu dilanjutkan build produksi.

Tes integrasi ada di `tests/unit/stageSevenIntegration.test.ts`. Tes terminal, browser preview, gateway reconnect, event bridge, dan workflow kantor yang sudah ada juga termasuk dalam seluruh unit test CI.

## Cara validasi
1. Jalankan `npm ci`.
2. Jalankan seluruh unit test: `npm run test -- --run`.
3. Jalankan pemeriksaan tipe: `npm run typecheck`.
4. Jalankan build produksi: `npm run build`.
5. Jalankan smoke browser E2E: `npx playwright install chromium`, lalu `npm run e2e -- --project=chromium` jika project browser telah dikonfigurasi.
6. Jalankan `npm run local`, buka `http://127.0.0.1:3000`, lalu uji alur kantor dan runtime pada perangkat yang digunakan.

## Checklist manual terminal dan browser
- [ ] Terminal menjalankan `npm run local` tanpa error fatal.
- [ ] Browser dapat membuka halaman kantor dan berpindah antarbagian.
- [ ] Data tugas/meeting tetap ada setelah server dihentikan dan dijalankan kembali.
- [ ] Chat Agent bekerja jika provider telah dikonfigurasi; status tanpa konfigurasi menjelaskan langkah yang diperlukan.
- [ ] Kegagalan provider tidak membocorkan token/API key.
- [ ] Browser preview dan koneksi gateway menampilkan status disconnected/error dengan benar ketika layanan upstream tidak tersedia.

## Batas verifikasi
Tes route reload membuktikan data dibaca kembali dari penyimpanan persisten, tetapi bukan pengganti uji restart proses pada perangkat fisik. CI juga tidak membuktikan kompatibilitas semua provider AI, gateway eksternal, browser mobile, maupun kinerja perangkat Android. Catat pengujian fisik secara terpisah; jangan menandainya lulus hanya berdasarkan build CI.
