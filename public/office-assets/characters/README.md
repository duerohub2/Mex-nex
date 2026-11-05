# Aset Karakter MEX-NEX

Folder ini adalah lokasi aset karakter yang siap diakses oleh aplikasi Next.js dari URL `/office-assets/characters/`.

## Struktur

- `agents/base/`: 20 gambar karakter Agent untuk sprite berdiri.
- `personal/avatar-owner.jpg`: avatar pribadi pemilik MEX-NEX.
- `reference-sheets/`: 21 lembar referensi arah karakter.
- `manifest.json`: indeks aset dan jalur file.

## Catatan integrasi

1. File sumber asli tetap disimpan utuh di `assets/branding/` sebagai arsip upload.
2. Gambar sumber berbentuk JPG. Pola kotak-kotak pada sebagian gambar tercetak sebagai piksel latar dan bukan transparansi alpha.
3. Renderer perlu melakukan penghapusan latar berbasis warna yang terhubung ke tepi gambar sebelum memakai gambar sebagai sprite.
4. Reference sheet dipakai sebagai dokumentasi visual; jangan dirender langsung sebagai sprite di kantor.
5. Activity sheet belum menjadi file terpisah dalam batch upload ini. Aset aktivitas dapat ditambahkan setelah tersedia di repository.
