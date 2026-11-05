# Aset Karakter MEX-NEX

## Versi aktif: `v2-transparent`

Batch PNG terbaru dari Google Flow sudah ditempatkan pada folder publik Next.js. File PNG menggunakan alpha transparency, sehingga bisa dipakai langsung sebagai sprite tanpa penghapusan latar saat runtime.

### Struktur
- `v2-transparent/agents/`: 20 karakter Agent.
- `v2-transparent/personal/avatar-owner.png`: avatar pribadi pemilik MEX-NEX.
- `v2-transparent/pose-sheets/`: dua lembar pose referensi (contoh Agent dan avatar pemilik).
- `v2-transparent/activity-sheets/`: dua lembar aktivitas referensi.
- `v2-transparent/reference-sheets/`: lembar referensi arah karakter unik.
- `v2-transparent/extras/`: karakter alternatif dan referensi visual kantor.

### Catatan
1. Semua upload sumber di folder `assets/` dipertahankan utuh.
2. Aset JPG generasi lama tetap tersedia sebagai arsip v1.
3. Character sheet dan activity sheet tetap disimpan utuh. Pemisahan panel menjadi sprite individual dilakukan pada pipeline atlas/animasi berikutnya.
4. Preview menggunakan PNG transparan terbaru. Route utama `/office` tidak diubah.
