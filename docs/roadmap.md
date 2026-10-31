# Roadmap MEX-NEX

Roadmap ini menjadi acuan tahapan pengembangan MEX-NEX. Setiap tahap mengikuti alur **AUDIT → PERBAIKI → VALIDASI → LANJUTKAN**. Perubahan rutin dikirim langsung ke `main`; tahap tidak dinyatakan selesai sebelum pemeriksaan CI pada commit terakhir berhasil.

## Tahap 1 — Fondasi aplikasi
- Struktur proyek frontend dan backend.
- API dan database/penyimpanan persisten.
- Launcher terminal, konfigurasi runtime, dan environment.
- Akses browser lokal tanpa login untuk penggunaan pribadi.

## Tahap 2 — Sistem perusahaan
- Organisasi, departemen, jabatan, profil Agent, dan relasi manajer.
- Pengelolaan struktur perusahaan dan roster Agent.

## Tahap 3 — AI Runtime dan Task Engine
- Integrasi provider AI, chat Agent, dan delegasi tugas.
- Penyimpanan percakapan serta hasil dispatch.
- Kontrak provider dan penanganan konfigurasi/kegagalan.

## Tahap 4 — Agent Execution
- Tool registry dan eksekusi Agent dengan workspace terbatas.
- Riwayat pekerjaan dan audit log.
- Validasi input dan batas keamanan tool.

## Tahap 5 — Fitur operasional kantor
- Meeting Room, Whiteboard, Bulletin Board, QA Department, dan dashboard analitik.

## Tahap 6 — Visualisasi kantor hybrid
- 6.1 Sinkronisasi aktivitas Agent.
- 6.2 Lingkungan kantor, ruangan, meja, dan fasilitas.
- 6.3 Karakter dan animasi.
- 6.4 Keselarasan status visual 2D/3D.
- 6.5 Optimasi perangkat mobile.

## Tahap 7 — Integrasi dan pengujian
- Uji alur kantor dan API secara menyeluruh.
- Verifikasi persistensi data setelah modul/server dimulai ulang.
- Uji kegagalan provider/runtime dan respons error yang aman.
- Uji komunikasi Agent dan kelanjutan riwayat chat.
- Uji jalur terminal, browser preview, serta koneksi gateway.
- Lengkapi dokumentasi operasional dalam bahasa Indonesia.

## Tahap berikutnya
Tahap setelah Tahap 7 ditentukan berdasarkan hasil pengujian integrasi, temuan keamanan, dan kebutuhan produk. Jangan menganggap fitur realtime audio/video atau whiteboard visual realtime sudah tersedia sebelum dirancang, diimplementasikan, dan diuji secara terpisah.
