# Panduan Android / Termux

Panduan ini menjalankan MEX-NEX secara lokal di HP Android. Tidak diperlukan akun, registrasi, Vercel, atau layanan hosting.

## 1. Pasang Termux dan paket dasar

Gunakan Termux dari sumber resminya (F-Droid atau GitHub Termux), lalu jalankan:

```bash
pkg update && pkg upgrade -y
pkg install git nodejs-lts -y
node -v
npm -v
```

Pastikan Node.js versi 20 atau lebih baru.

## 2. Unduh repository

```bash
git clone https://github.com/duerohub2/mex-nex.git
cd mex-nex
```

Jika folder repository sudah ada, masuk ke folder tersebut dan jalankan `git pull`.

## 3. Pasang dependency

```bash
npm install
```

Proses pertama dapat memerlukan waktu dan koneksi internet.

## 4. Jalankan kantor

```bash
npm run local
```

Tunggu sampai Next.js menampilkan pesan server siap. Buka browser Android:

`http://127.0.0.1:3000`

Biarkan Termux tetap berjalan selama aplikasi digunakan.

## 5. Menghentikan aplikasi

Kembali ke Termux dan tekan `Ctrl+C`.

## 6. Data dan backup

Data kantor disimpan di:

` .data/office.json `

Folder `.data` tidak diunggah ke Git. Salin file tersebut secara berkala ke lokasi backup pribadi. Jangan membagikan file yang berisi percakapan atau data privat.

## 7. Jika port 3000 sudah digunakan

Jalankan dengan port alternatif:

```bash
PORT=3001 npm run local
```

Kemudian buka `http://127.0.0.1:3001`.

## Catatan tahap awal

- Tahap 1 menyediakan UI, API, dan penyimpanan lokal.
- Instruksi yang dikirim lewat Command Center baru dicatat; belum diproses model AI.
- Profil Agent dan departemen adalah data awal.
- Runtime AI, delegasi otomatis, meeting, QA, dan kantor 2D/3D akan dibangun pada tahap berikutnya.
