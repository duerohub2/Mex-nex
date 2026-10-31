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

Antarmuka kantor virtual 2D/3D dan integrasi gateway disertakan sebagai bagian dari pengembangan visual. Fitur realtime audio/video, whiteboard visual realtime, pengujian integrasi menyeluruh, serta verifikasi langsung di perangkat Android masih memerlukan pengujian dan pengembangan lanjutan.

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

GitHub Actions menjalankan instalasi dependency dan build produksi menggunakan Node.js 22. Build yang berhasil tidak otomatis membuktikan kompatibilitas penuh pada perangkat Android/Termux. Pengujian langsung di perangkat fisik tetap diperlukan.

## Asal source dan lisensi

Sebagian antarmuka dan aset berasal dari repositori sumber [duerohub2/Nex-Mex](https://github.com/duerohub2/Nex-Mex) dan basis upstream [Hermes3D](https://github.com/iamlukethedev/Hermes3D). Periksa dan pertahankan ketentuan lisensi serta atribusi upstream sebelum distribusi.
