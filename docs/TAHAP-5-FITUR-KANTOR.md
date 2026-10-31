# Tahap 5 — Fitur Operasional Kantor

## Modul
- Meeting Room: membuat jadwal, menyimpan agenda dan catatan, serta menandai meeting selesai atau dibuka kembali.
- Whiteboard: membuat papan ide dan memperbarui isinya.
- Bulletin Board: menerbitkan pengumuman dengan kategori.
- QA Department: mencatat pemeriksaan/temuan, prioritas, dan status peninjauan.
- Dashboard Analitik: ringkasan Agent, tugas, tingkat penyelesaian, QA terbuka, dan aktivitas kantor.

## Penyimpanan
Semua data disimpan di berkas kantor yang sama (.data/office.json atau MEX_NEX_DATA_DIR). Data lama tetap kompatibel: properti Tahap 5 yang belum ada diinisialisasi sebagai array kosong.

## API
POST /api/office menerima action meeting-create, meeting-update, whiteboard-create, whiteboard-update, bulletin-create, qa-create, dan qa-update. Setiap mutasi dicatat ke activity log dan input divalidasi di server.

## Batasan
Meeting Room belum memiliki konferensi audio/video atau undangan realtime. Whiteboard masih berupa papan teks, belum kanvas gambar realtime. Dashboard menggunakan data lokal dan belum mengirim telemetri eksternal.
