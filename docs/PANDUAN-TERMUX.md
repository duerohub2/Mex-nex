# Panduan menjalankan MEX-NEX di Android / Termux

> Panduan ini disiapkan untuk Android. Build CI dapat memeriksa source, tetapi belum berarti aplikasi telah diuji langsung di perangkat Termux.

## 1. Siapkan Termux

Gunakan Termux versi terbaru dari sumber resminya. Jalankan:

```bash
pkg update && pkg upgrade -y
pkg install git nodejs-lts -y
node -v
npm -v
```

Pastikan Node.js **22 atau lebih baru**. Jika paket `nodejs-lts` di repositori Termux belum menyediakan versi 22, gunakan distribusi Node.js 22 yang kompatibel dengan perangkat sebelum melanjutkan.

## 2. Clone repositori

```bash
git clone https://github.com/duerohub2/Mex-nex.git
cd Mex-nex
```

## 3. Pasang dependency

```bash
npm ci
```

Instalasi dependency dan proses build dapat memerlukan ruang penyimpanan serta RAM yang cukup. Jika proses dihentikan Android karena keterbatasan memori, tutup aplikasi lain dan coba kembali.

## 4. Jalankan aplikasi

Mode pengembangan web:

```bash
npm run dev
```

Atau jalankan web bersama gateway demo:

```bash
npm run local:demo
```

Buka browser Android dan kunjungi:

- Web: http://127.0.0.1:3000
- Gateway demo: ws://127.0.0.1:18789

Untuk menghentikan proses, kembali ke Termux lalu tekan `Ctrl+C`.

## 5. Batasan mode demo

Gateway demo hanya mensimulasikan agent, status, dan percakapan. Mode ini tidak menjalankan model bahasa lokal, bukan runtime Hermes Agent, dan tidak mengeksekusi tool eksternal sungguhan. Jangan memasukkan API key atau data rahasia ke mode demo.

## 6. Troubleshooting singkat

- Periksa versi: `node -v` harus menunjukkan v22 atau lebih baru.
- Jika dependency gagal dipasang, jalankan `pkg update && pkg upgrade -y`, pastikan ruang kosong cukup, lalu ulangi `npm ci`.
- Jika port 3000 atau 18789 sudah dipakai, hentikan proses lama sebelum menjalankan ulang.
- Jika browser tidak dapat membuka halaman, pastikan proses server masih berjalan di Termux dan gunakan alamat loopback di atas.

## 7. Yang belum diverifikasi

Pengujian pada Android/Termux fisik belum dilakukan. Performa rendering 3D, dukungan WebGL browser, kompatibilitas paket native, dan kestabilan saat aplikasi berjalan di latar belakang masih perlu diuji di perangkat nyata.
