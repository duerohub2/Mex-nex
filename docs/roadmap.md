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


---

# Jalur Ekspansi — MEX-NEX Living Headquarters

Bagian ini adalah jalur produk untuk pengembangan kantor virtual futuristic multi-lantai dan kolaborasi A2A. Jalur ini **tidak menggantikan** Tahap 1–7 fondasi aplikasi di atas. Fitur organisasi, task, chat, runtime, dan gateway yang telah ada harus digunakan kembali setelah audit kompatibilitas.

| Tahap | Fokus | Output utama |
|---|---|---|
| 1 | Riset visual dan moodboard | Arah visual, referensi, asset register |
| 2 | GDD, TDD, model data, arsitektur | Spesifikasi produk dan teknis; audit existing |
| 3 | Fondasi 3D dan world model | Scene, coordinate system, camera, lighting |
| 4 | Gedung utama | Basement, empat lantai, rooftop |
| 5 | Navigasi kamera dan lantai | Building View, Floor View, transisi |
| 6 | Interior dan fasilitas | Ruangan, furniture, workstation |
| 7 | Karakter dan animasi | Human agent avatars, rig, animation set |
| 8 | Sinkronisasi aktivitas | Status backend → visual state |
| 9 | Mobilitas Agent | Pathfinding, lift/tangga, room navigation |
| 10 | Komunikasi A2A nyata | Conversation/session, transcript, audit |
| 11 | Kolaborasi dan delegasi | Parent/subtasks, deliverable, review |
| 12 | Integrasi sistem perusahaan | Organization, runtime, policy, tools |
| 13 | Dashboard dan observability | CEO dashboard, monitoring, approvals |
| 14 | Optimasi, pengujian, deployment | Mobile fallback, security, E2E, release |

## Status jalur ekspansi

- Tahap 1: selesai; keputusan visual disetujui dan didokumentasikan.
- Tahap 2: rancangan dokumen GDD/TDD/model data/API tersedia; audit source awal dilakukan, tetapi audit menyeluruh dan verifikasi deployment masih terbuka.
- Tahap 3–14: belum dimulai.

Jangan menganggap tahap selesai hanya karena dokumen dibuat. Setiap tahap wajib melalui AUDIT → IMPLEMENTASI → TEST → REVIEW → VALIDASI. Status deployment, test, dan performa hanya boleh dinyatakan berdasarkan hasil pemeriksaan aktual.

Dokumen pengendali Tahap 2: [Rencana Tahap 2](TAHAP-2-IMPLEMENTATION-PLAN.md). Detail spesifikasi: [GDD](MEX-NEX-GDD.md), [TDD](MEX-NEX-TDD.md), [Model Data](MEX-NEX-DATA-MODEL.md), [Kontrak API/Event](MEX-NEX-API-EVENT-CONTRACT.md), [Audit Source Awal](TAHAP-2-AUDIT-SOURCE-AWAL.md).
