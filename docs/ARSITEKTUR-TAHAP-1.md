# Arsitektur MEX-NEX — Tahap 1

## Tujuan

Menyediakan fondasi lokal yang dapat dijalankan dari terminal, langsung dibuka melalui browser, dan tidak memerlukan autentikasi pengguna.

## Komponen

- **Frontend:** Next.js App Router, React, CSS responsif.
- **Backend:** Next.js Route Handler pada `/api/office`.
- **Penyimpanan:** berkas JSON lokal dengan penulisan atomik.
- **Launcher:** `scripts/start-local.mjs`.
- **Runtime:** Node.js 20+.

## Alur data

1. Browser meminta `GET /api/office`.
2. Backend membaca `.data/office.json`.
3. Jika file belum ada, backend membuat data awal.
4. Perubahan dikirim ke `POST /api/office`.
5. Backend memvalidasi payload dan menyimpan file sementara.
6. File sementara dipindahkan secara atomik menjadi `office.json`.

## Model data awal

- `departments[]`: daftar departemen.
- `agents[]`: profil Agent dan relasi departemen.
- `tasks[]`: tugas yang dicatat pengguna.
- `messages[]`: instruksi Command Center.
- `activity[]`: jejak aktivitas sederhana.

## Batas keamanan dan akses

- Server development diikat ke `127.0.0.1`, bukan semua interface jaringan.
- Tidak ada login karena target penggunaan lokal satu pengguna.
- Jangan membuka port aplikasi ke internet.
- API key runtime nantinya hanya boleh dibaca backend.
- Aksi berisiko harus melalui izin eksplisit dan audit log pada tahap runtime.

## Batas Tahap 1

Penyimpanan JSON cocok untuk fondasi lokal satu pengguna, tetapi bukan pengganti database transaksional untuk beban multi-proses. Sebelum orkestrasi Agent dan pekerjaan paralel dibangun, lapisan penyimpanan akan dievaluasi untuk migrasi ke SQLite atau database lokal yang sesuai Termux.

Pesan yang masuk belum memanggil LLM. Agent yang terlihat adalah profil awal, bukan klaim bahwa Agent sudah aktif secara AI.
