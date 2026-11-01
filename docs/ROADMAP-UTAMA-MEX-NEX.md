# Roadmap Utama MEX-NEX

**Produk:** MEX-NEX Living Headquarters — ekosistem perusahaan AI Agent yang benar-benar bekerja, berkolaborasi, dan terlihat melalui kantor virtual multi-lantai.  
**Dokumen pengendali:** roadmap ini menggabungkan jalur fondasi aplikasi dan jalur ekspansi Living Headquarters tanpa menghapus sejarah atau checklist lama.  
**Prinsip:** AUDIT → RANCANG → IMPLEMENTASI → TEST → REVIEW → VALIDASI. Tidak ada tahap yang dianggap selesai hanya karena file atau tampilan sudah dibuat.

## Visi produk

MEX-NEX bukan sekadar simulasi kantor atau animasi karakter. MEX-NEX adalah lingkungan kerja digital dengan organisasi, Agent, runtime AI, task, komunikasi Agent-ke-Agent (A2A), kolaborasi lintas departemen, deliverable, review, policy, approval, audit, dan visualisasi kantor yang mencerminkan kondisi backend sebenarnya.

### Keputusan produk yang sudah ditetapkan

- Gedung futuristik, karakter manusia, interior hybrid.
- Kantor utama berbentuk cutaway/isometric dengan basement, empat lantai, dan rooftop.
- Building View menampilkan keseluruhan gedung; memilih lantai membawa kamera ke Floor View dengan transisi halus.
- Agent dapat bergerak otomatis sesuai tugas, jadwal, fasilitas, dan kondisi; pengguna tidak perlu mengendalikan avatar secara langsung.
- Agent dapat berkomunikasi, meminta bantuan, mendelegasikan pekerjaan, rapat, menghasilkan deliverable, dan melakukan review.
- Agent boleh merencanakan dan melakukan pekerjaan internal sesuai izin; perubahan sensitif dan efek eksternal wajib mengikuti approval policy.
- Backend adalah sumber kebenaran. Visual tidak boleh mengarang aktivitas atau status Agent.
- Pengalaman browser dan mobile/iPhone harus menjadi target sejak awal; fallback 2D/list disediakan bila WebGL tidak tersedia.
- Fitur demo harus diberi label dan tidak boleh disamarkan sebagai runtime AI sungguhan.

## Jalur A — Fondasi aplikasi (historis Tahap 1–7)

Jalur ini adalah fondasi aplikasi yang sudah ada. Checklist detail dan histori tetap berada di [roadmap fondasi](roadmap.md).

| Tahap | Fokus | Status dokumentasi |
|---|---|---|
| A1 | Fondasi aplikasi, struktur, backend, penyimpanan lokal, launcher | Ada dalam repo; validasi hosting/persistensi tetap dibedakan |
| A2 | Sistem perusahaan, organisasi, departemen, Agent | Ada dalam fondasi |
| A3 | AI Runtime dan Task Engine | Ada dalam fondasi; audit batas tool/runtime tetap penting |
| A4 | Agent Execution dan tool terbatas | Ada dalam fondasi; threat review wajib |
| A5 | Fitur operasional: meeting, whiteboard, bulletin, QA, dashboard | Ada dalam fondasi |
| A6 | Visualisasi kantor hybrid | Fondasi visual tersedia; bukan Living HQ final |
| A7 | Integrasi dan pengujian | Memiliki test integrasi; pengujian perangkat/provider/gateway eksternal tetap dibatasi sesuai dokumen |

> Status historis A1–A7 bukan pernyataan bahwa semua kemampuan production telah tervalidasi. Gunakan checklist [Tahap 7](TAHAP-7-INTEGRASI-PENGUJIAN.md) dan hasil CI aktual.

## Jalur B — Living Headquarters (14 tahap)

| Tahap | Nama | Hasil yang harus tersedia | Dependensi |
|---|---|---|---|
| B1 | Riset visual & moodboard | Art direction, referensi, asset register, standar visual | Keputusan produk |
| B2 | GDD, TDD, model data & arsitektur | Spesifikasi, domain map, kontrak API/event, audit kompatibilitas, roadmap | B1 + source existing |
| B3 | Fondasi 3D & world model | Scene graph, koordinat, skala, kamera isometric, lighting, loading boundary | B2 |
| B4 | Gedung utama | Basement + 4 lantai + rooftop sebagai satu bangunan cutaway | B3 |
| B5 | Building/Floor View & navigasi | Pilih lantai, transisi kamera, zoom, reset, kembali ke gedung | B3–B4 |
| B6 | Interior & fasilitas | Ruang tiap lantai, furnitur, workstation, lift/tangga, fasilitas | B4–B5 |
| B7 | Karakter Agent & animasi | Avatar manusia, rig, identitas, idle/walk/work/talk/meeting | B2 + B6 |
| B8 | Sinkronisasi aktivitas Agent | Status backend → presence, aktivitas, workstation, visual state | B2 + B7 |
| B9 | Mobilitas Agent | Jalur navigasi, perpindahan ruang/lantai, interaksi fasilitas | B6–B8 |
| B10 | Komunikasi A2A nyata | Percakapan antardua Agent, session, transcript, event, audit | B2 + B8 |
| B11 | Kolaborasi & delegasi | Parent/subtask, dependency, handoff, deliverable, review, retry | B10 |
| B12 | Integrasi perusahaan | Org chart, runtime, tool registry, policy, approval, data existing | A2–A5 + B10–B11 |
| B13 | Dashboard & observability | CEO overview, agent health, task flow, approval queue, audit trail | B8–B12 |
| B14 | Optimasi, pengujian & release | Mobile performance, accessibility, security, E2E, backup/restore, deployment | B3–B13 |

### Gate wajib per tahap

1. **Audit:** cek source dan fitur existing yang disentuh; catat risiko dan kontrak kompatibilitas.
2. **Rancang:** definisikan hasil, file yang akan berubah, data/API, dan acceptance criteria.
3. **Implementasi:** perubahan sekecil mungkin; pertahankan fitur yang sudah berjalan.
4. **Test:** unit, integration, typecheck, build, E2E sesuai cakupan; jangan menulis hasil test yang tidak dijalankan.
5. **Review:** security, UX, aksesibilitas, mobile, performa, dan regresi.
6. **Validasi:** cek hasil di GitHub dan deployment; tandai tahap selesai hanya jika semua acceptance gate lulus.

## Arsitektur sasaran

- **Web client:** Next.js UI, 2D fallback, Three.js/R3F renderer.
- **Domain backend:** organisasi, Agent, task, conversation, A2A, meeting, deliverable, review, policy, approval, audit.
- **AI runtime:** provider adapters, Agent run lifecycle, tool gateway allowlisted, scoped workspace.
- **Persistence:** adapter storage yang tahan restart dan multi-instance; migrasi dari JSON lokal harus memiliki backup, importer, validasi, dan rollback.
- **Realtime:** event envelope berversi, sequence/cursor, snapshot + replay, reconnect, deduplication; jangan menyamakan gateway upstream dengan event bus kantor.
- **World simulation:** logical room/workstation dan nav graph; renderer hanya memproyeksikan backend state.
- **Security:** default-deny, server-side secrets, permission scope, approval untuk tindakan sensitif/eksternal, audit append-only, pause/cancel.
- **Observability:** correlation ID, runtime health, latency, error, tool result, policy decision, event lag.

## Risiko dan keputusan teknis yang belum boleh diasumsikan

| Risiko/pertanyaan | Bukti saat ini | Keputusan/gate |
|---|---|---|
| Penyimpanan Vercel | Route existing memakai `.data/*.json`; deployment terakhir berjalan sebagai Vercel Lambda | Jangan menganggap filesystem lokal durable/shared. Tetapkan storage produksi sebelum data kantor dianggap persisten |
| Custom server & WebSocket | `server/index.js` menjalankan custom Node server dan WS proxy; deployment Vercel terdeteksi sebagai LAMBDAS | Pisahkan kompatibilitas serverless dari jalur local server; tentukan realtime host terpisah bila perlu |
| Akses deployment | SSO protection aktif untuk deployment non-custom-domain | Uji akses domain produksi dan preview dengan kebijakan akses yang benar |
| Office realtime | Ada gateway WS upstream dan presence bridge | Audit event bridge; gateway bukan otomatis durable office event bus |
| Tool execution | AI API menjalankan tool loop | Audit allowlist, scope, approval, timeout, idempotency, dan audit sebelum otonomi ditingkatkan |
| CI pada commit dokumentasi | Tidak ada workflow run yang dikembalikan untuk commit yang diperiksa | Jalankan test/typecheck/build secara eksplisit; jangan klaim CI hijau |
| Mobile 3D | Three.js/R3F tersedia di dependency | Uji perangkat fisik dan fallback; jangan klaim FPS sebelum profiling |

## Acceptance criteria produk akhir

- Semua lantai dapat dipilih dan dinavigasi; transisi kamera stabil.
- Agent yang terlihat bekerja selalu memiliki task/run/event backend yang valid.
- Dua atau lebih Agent dapat bertukar pesan melalui A2A session yang tersimpan, ter-audit, dan dapat dipulihkan.
- Delegasi menghasilkan task terhubung, dependency, handoff, deliverable, dan review yang dapat ditelusuri.
- Approval policy benar-benar menahan aksi sensitif/eksternal sampai disetujui.
- Data organisasi, task, chat, deliverable, dan audit bertahan setelah restart dan deployment baru.
- Realtime reconnect tidak kehilangan perubahan; client dapat pulih melalui snapshot dan replay.
- Mode demo dan runtime sungguhan dibedakan secara eksplisit.
- Pengalaman inti berfungsi di browser mobile; WebGL failure memiliki fallback.
- Build, test, typecheck, security checks, dan E2E release gate lulus dan hasilnya tercatat.

## Status terkini (1 November 2026)

- B1: **Selesai** — visual reference library dan keputusan visual disetujui.
- B2: **Dokumen dan keputusan arsitektur selesai; validasi teknis sebagian lulus** — GDD, TDD, model data, API/event contract, implementation plan, source audit, dan quality workflow tersedia. Build production Vercel lulus untuk commit 51896b5; test/lint/E2E/storage durability masih menunggu bukti.
- B3: **SELESAI** — world model enam level, kamera orthographic/isometrik, lighting config, scene graph, reusable R3F canvas shell, fallback WebGL, 10 unit tests, lint, dan production build tervalidasi. Full suite masih memiliki 3 kegagalan onboarding yang tidak terkait; typecheck penuh masih memiliki error di dua test lama. Profiling iPhone ditetapkan untuk B14.\n- B4: **Geometri shell utama tersedia** — cutaway enam level, struktur, fasad, core dan rooftop placeholder. Belum ada visual QA perangkat fisik.
- B5: **Building/Floor View tersedia pada route preview** `/office/living-hq` — pemilih enam level, transisi kamera, orbit/zoom/pan. Visual QA iPhone masih menunggu.
- B6: **Pass pertama interior dan fasilitas tersedia** — komponen interior prosedural untuk enam level, workstation, ruang rapat, server rack, lift/tangga placeholder, lounge dan rooftop garden. ESLint dan production build lulus; visual QA dan detail final masih terbuka.
- B7–B14: **Belum dimulai**.
- Deployment Vercel untuk commit `f0f861bc81aca3691bff59bde38846901f5dda18`: status **READY**; SSO protection masih aktif untuk deployment non-custom-domain. Status READY bukan bukti seluruh fitur telah diuji.
- Penyimpanan kantor dan sesi AI yang diaudit saat ini berupa file JSON lokal. Migrasi production storage belum dilakukan.

## Dokumen rujukan

- [GDD](MEX-NEX-GDD.md)
- [TDD](MEX-NEX-TDD.md)
- [Model data](MEX-NEX-DATA-MODEL.md)
- [Kontrak API dan event](MEX-NEX-API-EVENT-CONTRACT.md)
- [Rencana Tahap 2](TAHAP-2-IMPLEMENTATION-PLAN.md)
- [Audit source awal](TAHAP-2-AUDIT-SOURCE-AWAL.md)
- [Fondasi 3D Tahap 3](TAHAP-3-FONDASI-3D-WORLD-MODEL.md)
- [Geometri gedung Tahap 4](TAHAP-4-GEOMETRI-GEDUNG-UTAMA.md)
- [Building/Floor View Tahap 5](TAHAP-5-BUILDING-FLOOR-VIEW.md)
- [Interior dan fasilitas Tahap 6](TAHAP-6-INTERIOR-DAN-FASILITAS.md)\n- [Renderer Living HQ](../src/features/office-world/OfficeWorldCanvas.tsx)\n- [Referensi visual Tahap 1](visual-reference-library/TAHAP-1-REFERENSI-VISUAL.md)
- [Roadmap fondasi](roadmap.md)
