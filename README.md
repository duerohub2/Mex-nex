# MEX-NEX — Kantor AI Lokal

MEX-NEX adalah proyek untuk menjalankan kantor virtual AI agent secara lokal di Android menggunakan Termux.

> **Status saat ini:** kerangka awal. File aplikasi utama dari repositori NEX-MEX asal belum dipindahkan seluruhnya ke repositori ini. Jadi, repositori ini belum bisa menjalankan kantor sampai proses pemindahan kode inti selesai.

## Tujuan proyek

- Menjalankan kantor virtual tanpa bergantung pada Vercel.
- Mempertahankan tampilan kantor 3D/2D, karakter agent, status aktivitas, dan chat.
- Menyediakan gateway lokal.
- Menambahkan penyimpanan lokal agar konfigurasi dan riwayat tidak hilang saat aplikasi ditutup.
- Menyiapkan opsi runtime AI lokal sungguhan pada tahap berikutnya.

## Kondisi fitur

| Bagian | Status |
|---|---|
| Kerangka proyek dan dokumentasi | Tersedia |
| Panduan Android / Termux | Tersedia |
| Launcher gateway demo + web | Disiapkan, menunggu source aplikasi inti |
| Kantor virtual 3D/2D | Belum dipindahkan |
| Chat agent | Belum dipindahkan |
| Penyimpanan permanen lokal | Belum dibuat |
| AI lokal sungguhan | Belum dikonfigurasi |

## Rencana penggunaan di Android

Setelah source aplikasi inti sudah dipindahkan, langkah umumnya:

1. Pasang Termux.
2. Pasang Git dan Node.js.
3. Unduh repositori ini.
4. Pasang dependency dengan `npm install`.
5. Jalankan `npm run local:demo`.
6. Buka `http://127.0.0.1:3000` dari browser Android.

Panduan lengkap ada di [docs/PANDUAN-TERMUX.md](docs/PANDUAN-TERMUX.md).

## Mode demo bukan AI sungguhan

Gateway demo hanya mensimulasikan agent dan percakapan untuk menguji tampilan serta alur kantor. Mode ini tidak menjalankan model bahasa lokal dan tidak dapat dianggap sebagai agent AI yang benar-benar bekerja.

## Teknologi

- Next.js dan React
- Three.js / React Three Fiber untuk kantor 3D
- Phaser untuk tampilan kantor 2D
- Node.js WebSocket gateway

## Repositori asal

Kode aplikasi asal: [duerohub2/Nex-Mex](https://github.com/duerohub2/Nex-Mex)

Repositori ini adalah tempat pengembangan versi lokal. Repositori asal tidak diubah oleh pembuatan kerangka ini.

## Lisensi dan atribusi

Basis aplikasi menggunakan proyek upstream [Hermes3D](https://github.com/iamlukethedev/Hermes3D). Periksa file lisensi dan atribusi upstream sebelum mendistribusikan ulang atau menerbitkan versi turunan.
