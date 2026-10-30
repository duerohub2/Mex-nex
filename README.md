# MEX-NEX — Kantor Virtual AI

MEX-NEX adalah pengembangan lokal dari NEX-MEX: antarmuka kantor virtual dengan lingkungan 3D/2D, karakter agent, panel agent, dan komunikasi melalui gateway. Repositori ini disiapkan agar dapat dikembangkan dan dijalankan dari lingkungan lokal, termasuk Android melalui Termux (dengan batasan perangkat).

## Isi repositori

Source aplikasi utama berada di:
- `src/` — aplikasi Next.js, halaman, komponen, fitur, dan API.
- `server/` — server web dan gateway.
- `public/office-assets/` — aset visual kantor virtual.
- `assets/` — aset proyek upstream.
- `plugins/` — plugin yang disertakan upstream.
- `tests/` — pengujian proyek upstream.
- `docs/upstream/` — dokumentasi upstream; panduan lokal tetap berada di `docs/PANDUAN-TERMUX.md`.

## Persyaratan

- Node.js 22 atau lebih baru.
- npm yang sesuai dengan versi Node.js.
- Git.
- Untuk Android: Termux versi terbaru. Performa 3D bergantung pada kemampuan perangkat dan browser.

## Menjalankan di komputer

```bash
git clone https://github.com/duerohub2/Mex-nex.git
cd Mex-nex
npm ci
npm run dev
```

Buka `http://127.0.0.1:3000`.

## Menjalankan mode demo lokal

```bash
npm ci
npm run local:demo
```

Web: `http://127.0.0.1:3000`
Gateway demo: `ws://127.0.0.1:18789`

## Catatan penting tentang AI

Mode `local:demo` menjalankan gateway simulasi untuk menguji antarmuka, daftar agent, status, dan percakapan. Mode ini **bukan** runtime Hermes Agent, tidak menjalankan model LLM lokal, dan tidak otomatis mengeksekusi tool sungguhan. Integrasi runtime AI lokal merupakan pekerjaan terpisah.

## Status verifikasi

- Source aplikasi, server, dan aset diimpor dari repositori asal.
- Build otomatis diperiksa melalui GitHub Actions.
- Pengujian langsung di perangkat Android/Termux belum dilakukan. Jangan menganggap kompatibilitas penuh Termux telah terverifikasi.

## Asal proyek

Repositori sumber: [duerohub2/Nex-Mex](https://github.com/duerohub2/Nex-Mex).
Basis upstream: [Hermes3D](https://github.com/iamlukethedev/Hermes3D). Periksa lisensi dan atribusi sebelum distribusi ulang.
