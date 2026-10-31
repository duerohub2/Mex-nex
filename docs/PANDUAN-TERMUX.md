# Panduan menjalankan MEX-NEX di Android / Termux

Panduan ini untuk menjalankan MEX-NEX secara lokal di HP Android. Performa dan kompatibilitas fitur 2D/3D bergantung pada perangkat, versi Android, browser, dan dukungan WebGL.

## 1. Siapkan Termux

Gunakan Termux dari sumber resminya (F-Droid atau GitHub Termux), lalu jalankan:

    pkg update && pkg upgrade -y
    pkg install git nodejs-lts -y
    node -v
    npm -v

Gunakan Node.js 22 atau lebih baru agar sesuai dengan konfigurasi build proyek. Jika paket Termux belum menyediakan versi tersebut, perbarui repositori/paket atau gunakan distribusi Node.js 22 yang kompatibel.

## 2. Unduh repository

    git clone https://github.com/duerohub2/mex-nex.git
    cd mex-nex

Jika repository sudah ada, masuk ke foldernya dan jalankan git pull.

## 3. Pasang dependency

    npm ci

Proses instalasi dan build dapat memerlukan ruang penyimpanan serta RAM yang cukup. Jika Android menghentikan proses karena memori, tutup aplikasi lain lalu coba kembali.

## 4. Jalankan MEX-NEX

    npm run local

Tunggu sampai server siap, lalu buka browser Android di http://127.0.0.1:3000. Biarkan Termux tetap berjalan selama aplikasi digunakan. Untuk menghentikan server, kembali ke Termux dan tekan Ctrl+C.

## 5. Jalankan mode gateway demo (opsional)

    npm run local:demo

Mode ini menjalankan web bersama gateway demo di ws://127.0.0.1:18789. Gateway demo hanya mensimulasikan status dan percakapan Agent; bukan runtime model AI sungguhan dan tidak mengeksekusi tool eksternal.

## 6. Data dan backup

Simpan backup data kantor lokal secara berkala. Jangan membagikan file yang berisi percakapan atau data privat. Folder data lokal tidak diunggah ke Git.

## 7. Troubleshooting

- Periksa versi Node.js dengan node -v; gunakan v22 atau lebih baru.
- Jika dependency gagal dipasang, jalankan pkg update && pkg upgrade -y, pastikan ruang penyimpanan cukup, lalu ulangi npm ci.
- Jika port 3000 atau 18789 sudah digunakan, hentikan proses lama atau atur variabel PORT / DEMO_ADAPTER_PORT.
- Jika browser tidak dapat membuka halaman, pastikan server masih berjalan dan gunakan alamat loopback di atas.
- Jika tampilan 3D lambat, tutup aplikasi lain atau gunakan renderer 2D bila tersedia.

## 8. Batasan verifikasi

Build CI memeriksa source di GitHub Actions, tetapi tidak sama dengan pengujian langsung di HP Android. Performa rendering 3D, dukungan WebGL, kompatibilitas paket native, dan kestabilan ketika aplikasi berjalan di latar belakang tetap perlu diuji di perangkat nyata.
