# MEX-NEX — Kantor AI Lokal

MEX-NEX adalah fondasi kantor virtual AI Agent yang dijalankan secara lokal melalui terminal dan browser. Proyek ini dibangun sebagai aplikasi mandiri; repositori `nex-mex` hanya menjadi referensi kebutuhan fitur dan arsitektur.

## Status pembangunan

**Tahap 1 — Fondasi aplikasi (selesai)**

- [x] Aplikasi web lokal tanpa login.
- [x] Backend API lokal.
- [x] Penyimpanan data kantor persisten berbasis berkas JSON.
- [x] Data awal departemen dan profil Agent.
- [x] Pencatatan instruksi melalui Command Center (belum menjalankan AI).
- [x] Task Manager dasar.
- [x] Launcher terminal untuk Termux.
- [x] Lapisan runtime AI multi-provider dan chat Agent (Tahap 3).\n- [x] AI Manager membuat rencana dan mendelegasikan respons ke Agent (Tahap 3).
- [x] Struktur organisasi, pembuatan Agent, dan delegasi tugas dasar (Tahap 2).
- [ ] Visualisasi kantor 2D/3D.

## Menjalankan di Android / Termux

Persyaratan: Node.js 20 atau lebih baru dan Git.

```bash
pkg update && pkg upgrade -y
pkg install git nodejs-lts -y
git clone https://github.com/duerohub2/mex-nex.git
cd mex-nex
npm install
npm run local
```

Buka browser Android dan kunjungi:

`http://127.0.0.1:3000`

Hentikan server dari Termux dengan `Ctrl+C`.

## Menjalankan di komputer

```bash
git clone https://github.com/duerohub2/mex-nex.git
cd mex-nex
npm install
npm run local
```

## Penyimpanan lokal

Data aplikasi dibuat otomatis di `.data/office.json`. Folder tersebut tidak dimasukkan ke Git. Untuk memindahkan lokasi data, atur `MEX_NEX_DATA_DIR` sebelum menjalankan aplikasi.

## Konfigurasi

Salin `.env.example` menjadi `.env.local` jika ingin mengubah konfigurasi. Jangan pernah memasukkan API key ke kode frontend atau mengunggah file environment ke GitHub.

## Status AI

Tahap 3 menyediakan chat model melalui Hermes-compatible, model lokal, atau provider eksternal yang mendukung endpoint OpenAI-compatible. AI Manager dapat membagi instruksi menjadi pekerjaan Agent dan mengumpulkan respons. Untuk mengaktifkannya, salin `.env.example` ke `.env.local`, isi provider, endpoint, model, dan API key yang sesuai. Agent belum diberi akses shell/browser/file atau tindakan eksternal.

## Dokumentasi

- [Panduan Termux](docs/PANDUAN-TERMUX.md)
- [Arsitektur Tahap 1](docs/ARSITEKTUR-TAHAP-1.md)\n- [Panduan AI Runtime Tahap 3](docs/TAHAP-3-AI-RUNTIME.md)

## Referensi fitur

Repositori `duerohub2/nex-mex` digunakan sebagai referensi spesifikasi fitur kantor. Source aplikasi tidak diimpor otomatis ke proyek ini.
