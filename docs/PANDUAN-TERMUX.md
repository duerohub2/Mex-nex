# Panduan Android / Termux

## Status source aplikasi

Repositori ini masih berupa kerangka awal. Source aplikasi utama (folder `app`, `server`, komponen kantor, aset, dan konfigurasi build) belum seluruhnya dipindahkan dari repositori asal. Karena itu, perintah menjalankan aplikasi di bawah baru bisa dipakai setelah proses pemindahan source selesai.

## 1. Siapkan Termux

Gunakan Termux dari F-Droid atau repositori GitHub resmi Termux. Jalankan:

```bash
pkg update && pkg upgrade -y
pkg install git nodejs-lts -y
node -v
npm -v
```

Pastikan Node.js versi 20 atau lebih baru.

## 2. Unduh MEX-NEX

```bash
git clone https://github.com/duerohub2/mex-nex.git
cd mex-nex
```

## 3. Pasang dependency

Setelah source aplikasi inti tersedia:

```bash
npm install
```

## 4. Jalankan demo lokal

```bash
npm run local:demo
```

Buka browser Android: `http://127.0.0.1:3000`

Gateway demo: `ws://127.0.0.1:18789`

## 5. Hentikan aplikasi

Kembali ke Termux lalu tekan `Ctrl+C`.

## Batasan mode demo

Mode demo hanya untuk memeriksa tampilan kantor, daftar agent, dan alur chat simulasi. Ini bukan AI lokal sungguhan, tidak menjalankan tool eksternal, dan data yang hanya disimpan di memori dapat hilang saat proses dihentikan.

## Tahap pengembangan berikutnya

1. Pindahkan source kantor virtual dan dependensi yang benar-benar dibutuhkan.
2. Audit alur chat dan gateway agar dapat berjalan lokal.
3. Tambahkan penyimpanan permanen untuk konfigurasi dan riwayat chat.
4. Uji build dan jalankan pada Termux Android.
5. Integrasikan runtime/model AI lokal sebagai fitur terpisah.
