# MEX-NEX — Kantor Virtual AI

MEX-NEX adalah ekosistem kantor virtual AI Agent yang menggabungkan fondasi aplikasi lokal, backend kantor, dan antarmuka kantor virtual 2D/3D. Proyek dapat dikembangkan dari komputer maupun Android melalui Termux, dengan batasan performa perangkat.

## Isi repositori

- app/ — aplikasi dan fondasi kantor MEX-NEX.
- src/ — antarmuka Next.js, fitur Agent, kantor virtual, dan komponen visual.
- server/ — server aplikasi, gateway, dan adapter.
- public/office-assets/ — aset visual kantor.
- assets/, plugins/, dan tests/ — aset, plugin, serta pengujian yang diimpor.
- docs/ — dokumentasi proyek dan panduan penggunaan.

## Status pengembangan

Fondasi Tahap 1–5 MEX-NEX mencakup aplikasi web lokal, backend API, penyimpanan persisten, organisasi dan departemen, profil Agent, chat, delegasi tugas, Agent Execution Engine dengan workspace terbatas, Meeting Room, Whiteboard teks, Bulletin Board, QA Department, dan dashboard analitik.

Antarmuka kantor virtual 2D/3D dan integrasi gateway disertakan sebagai bagian dari pengembangan visual. Tahap 7 menambahkan pengujian integrasi persistensi, percakapan Agent, validasi request, dan kegagalan provider. Fitur realtime audio/video serta whiteboard visual realtime belum termasuk fitur yang sudah tervalidasi. Pengujian langsung di perangkat Android dan layanan provider/gateway eksternal tetap perlu dilakukan.

## Persyaratan

- Node.js 22 atau lebih baru.
- npm dan Git.
- Android: Termux terbaru. Performa 3D bergantung pada kemampuan perangkat dan browser.

## Menjalankan MEX-NEX di komputer atau Android / Termux

    git clone https://github.com/duerohub2/mex-nex.git
    cd mex-nex
    npm ci
    npm run local

Buka browser di http://127.0.0.1:3000. Biarkan terminal tetap berjalan selama aplikasi digunakan. Hentikan dengan Ctrl+C.

Untuk menjalankan web bersama gateway demo:

    npm run local:demo

Gateway demo hanya mensimulasikan koneksi, status Agent, dan percakapan. Mode demo bukan model LLM dan tidak menjalankan tool eksternal sungguhan.

Untuk menjalankan server pengembangan secara langsung:

    npm run dev

## Penyimpanan dan konfigurasi

Data kantor lokal disimpan di folder .data/ (jika fitur penyimpanan lokal digunakan). Folder ini tidak dimasukkan ke Git.

Salin .env.example menjadi .env.local bila perlu mengubah konfigurasi. Isi endpoint, model, dan API key hanya di file lokal. Jangan pernah memasukkan API key atau token asli ke source code maupun commit Git.

## Pengujian

GitHub Actions menjalankan instalasi dependency, seluruh unit test, pemeriksaan TypeScript, dan build produksi menggunakan Node.js 22. Build dan unit test yang berhasil tidak otomatis membuktikan kompatibilitas penuh pada perangkat Android/Termux atau provider eksternal. Pengujian langsung di perangkat fisik tetap diperlukan.

Roadmap pengembangan dan checklist Tahap 7 tersedia di [docs/roadmap.md](docs/roadmap.md) dan [docs/TAHAP-7-INTEGRASI-PENGUJIAN.md](docs/TAHAP-7-INTEGRASI-PENGUJIAN.md).

## Asal source dan lisensi

Sebagian antarmuka dan aset berasal dari repositori sumber [duerohub2/Nex-Mex](https://github.com/duerohub2/Nex-Mex) dan basis upstream [Hermes3D](https://github.com/iamlukethedev/Hermes3D). Periksa dan pertahankan ketentuan lisensi serta atribusi upstream sebelum distribusi.


## Tahap 7 — Integrasi dan pengujian

Validasi CI menjalankan seluruh unit test, pemeriksaan TypeScript, dan build produksi. Checklist pengujian manual serta batasan validasi tercatat di [dokumen Tahap 7](docs/TAHAP-7-INTEGRASI-PENGUJIAN.md) dan [roadmap](docs/roadmap.md). Pengujian persistensi melalui pemuatan ulang modul route bukan pengganti restart proses server yang sesungguhnya.
