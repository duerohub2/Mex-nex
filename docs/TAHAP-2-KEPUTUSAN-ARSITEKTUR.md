# Tahap 2 — Keputusan Arsitektur dan Penutupan Audit

**Tanggal:** 1 November 2026  
**Branch:** main  
**Cakupan:** pembacaan source utama dan metadata deployment; bukan audit keamanan formal atau pengujian runtime end-to-end.

## 1. Temuan tambahan yang diverifikasi

### AI runtime dan tool execution
- `app/api/ai/route.js` memakai provider adapter berbentuk OpenAI-compatible endpoint untuk Hermes, local, dan external.
- Percakapan disimpan ke `.data/ai-sessions.json`; data Agent dibaca dari `.data/office.json`.
- `lib/agent-tools.js` mendefinisikan tool `workspace.list`, `workspace.read`, `workspace.write`, `system.time`, `system.status`, dan `math.calculate`.
- Workspace dibatasi ke direktori `.data/workspace`; path traversal ditolak.
- Audit eksekusi ditulis ke `.data/execution-audit.json` dan dipotong hingga 500 entri.
- Catatan risiko: audit tool saat ini memakai read-modify-write file JSON dan error pembacaan file ditangani dengan fallback kosong. Ini belum setara append-only audit ledger/transaksi tahan multi-instance. Tool registry yang ada juga belum membuktikan adanya policy/approval engine untuk aksi eksternal.

### Presence dan event bridge
- `src/app/api/office/presence/route.ts` mendukung snapshot lokal, remote HTTP, dan remote gateway.
- Remote gateway mengambil `agents.list`, `status`, dan `sessions.preview`, lalu membangun snapshot presence.
- `src/features/agents/state/runtimeEventBridge.ts` mengklasifikasikan event gateway menjadi summary-refresh, runtime-chat, runtime-agent, atau ignore serta memproses lifecycle/stream.
- `src/lib/office/presence.ts` menyediakan normalisasi snapshot dan pemuatan konfigurasi lokal.
- `src/lib/office/gatewayPresence.ts` mengestimasi working/idle dari aktivitas session terkini (jendela 45 detik) atau preview pesan.
- Kesimpulan: sudah ada bridge presence dan runtime event UI, tetapi belum ada bukti office domain event store dengan sequence durable, replay cursor, transactional outbox, dan replay setelah reconnect. Status visual tidak boleh dianggap sebagai rekam jejak task yang durable.

### Deployment Vercel
- Project `mex-nex` terhubung ke repository GitHub dan framework Next.js.
- Deployment produksi untuk commit `f0f861bc81aca3691bff59bde38846901f5dda18` berstatus `READY`, tipe deployment `LAMBDAS`, target `production`.
- Alias yang dilaporkan Vercel mencakup `mex-nex.vercel.app`.
- SSO protection aktif untuk deployment non-custom-domain. Karena itu, READY tidak berarti akses anonim/publik berhasil.
- `vercel.json` tidak ditemukan di root pada branch yang diaudit.
- Repository menggunakan `server/index.js` sebagai custom Node HTTP/HTTPS server dan WS proxy. Deployment yang terdeteksi sebagai LAMBDAS tidak membuktikan custom server tersebut berjalan di Vercel.
- Workflow run GitHub Actions yang diminta untuk commit audit terakhir mengembalikan daftar kosong. Ini bukan bukti bahwa workflow gagal; hanya berarti tidak ada run yang dapat diverifikasi dari endpoint yang tersedia.

## 2. Matriks kompatibilitas dan risiko

| Area | Kondisi existing | Keputusan Tahap 2 |
|---|---|---|
| Office API | JSON file store version 2 | Pertahankan route/shape; bungkus di repository adapter sebelum migrasi |
| AI chat | JSON sessions, provider adapter | Pertahankan conversation ID dan history; pisahkan session repository |
| Tool workspace | Enam tool terbatas, workspace path guard | Pertahankan tool yang ada; tambahkan permission scope, timeout, approval, dan audit durable sebelum ekspansi |
| Presence | Local/remote snapshot | Pertahankan sebagai read model; jangan jadikan sumber kebenaran task |
| Gateway WS | Custom server proxy upstream | Jangan pindahkan mentah ke Vercel Lambda; pilih host realtime terpisah atau layanan WS managed |
| Local filesystem | `.data/*.json` | Tetap didukung untuk local/Termux; bukan storage production multi-instance |
| Visual renderer | Runtime event bridge + office presence | Render berdasarkan domain state dan presence backend, bukan simulasi animasi |
| Access | Optional local access gate + Vercel SSO | Definisikan autentikasi aplikasi tersendiri sebelum membuka akses publik |

## 3. Keputusan arsitektur yang direkomendasikan

1. **Jangan rewrite fondasi.** Pertahankan Next.js, React, Three.js/R3F, route existing, provider adapters, office domain, dan gateway client/proxy.
2. **Gunakan adapter boundary.** Office, AI sessions, execution audit, dan workspace file harus mengakses interface repository/storage; local JSON adapter tetap untuk mode lokal.
3. **Storage production terpisah.** Sebelum mengandalkan data di Vercel, pilih persistent database/object storage yang cocok untuk multi-instance. Keputusan vendor/produk dilakukan setelah memeriksa batas biaya, region, backup, connection pooling, dan akses iPhone.
4. **Realtime dipisahkan dari request/response.** Pertahankan gateway existing sebagai integrasi upstream. Tambahkan office event transport yang punya auth, durable sequence, replay, dan snapshot recovery. Untuk Vercel, host WebSocket terpisah/managed bila diperlukan.
5. **A2A adalah domain workflow.** Setiap pesan antar-Agent harus memiliki sender, recipient/session, correlation/causation, timestamps, policy decision, dan audit; jangan sekadar membuat bubble chat visual.
6. **Tool permission default-deny.** Tool baru tidak otomatis diizinkan. Scope workspace dan tool, validasi argumen, batas waktu/ukuran, idempotency, approval untuk external side effect, serta audit durable.
7. **Renderer read-only terhadap domain.** Client mengirim intent ke API; backend menentukan task, status, dan lokasi logis Agent.
8. **Demo dipisah tegas.** Seed/demo presence tidak boleh dilabeli sebagai Agent aktif sungguhan.

## 4. Urutan implementasi setelah Tahap 2

1. B3 dapat dimulai pada lapisan renderer/world model dengan mock read model yang berlabel development; jangan ubah storage atau runtime production di tahap ini.
2. Sebelum B8/B10/B11, selesaikan adapter persistence dan office event contract yang benar-benar durable.
3. Sebelum mengaktifkan otonomi Agent, selesaikan policy engine, tool permissions, approval workflow, audit ledger, pause/cancel, dan test adversarial.
4. Sebelum release publik, validasi autentikasi aplikasi, SSO/domain policy, storage backup/restore, WebSocket host, dan E2E browser/mobile.

## 5. Gate penutup yang masih wajib sebelum menyatakan seluruh Tahap 2 tervalidasi

- [ ] Jalankan `npm ci`, `npm run test -- --run`, `npm run typecheck`, `npm run build` pada commit final.
- [ ] Verifikasi akses route utama pada deployment dengan kebijakan SSO yang berlaku; uji halaman `/office` dan API penting.
- [ ] Uji persistensi melalui restart proses sebenarnya, bukan hanya reload modul.
- [ ] Audit seluruh cabang `app/api/office/route.js` dan `app/api/ai/route.js` termasuk setiap action dan response.
- [ ] Verifikasi konfigurasi environment dan jalur WebSocket di Vercel; jangan asumsikan custom server dipakai oleh Lambda.
- [ ] Pilih storage production dan realtime hosting berdasarkan keputusan biaya/operasional yang disetujui.

**Status:** spesifikasi produk, model data, kontrak API/event, roadmap, dan keputusan arsitektur telah dibakukan. Validasi teknis penutup di atas belum diklaim lulus. Tidak ada implementasi runtime/database baru yang dilakukan sebagai bagian dokumen Tahap 2.

## 6. Referensi
- [GDD](MEX-NEX-GDD.md)
- [TDD](MEX-NEX-TDD.md)
- [Model data](MEX-NEX-DATA-MODEL.md)
- [Kontrak API/Event](MEX-NEX-API-EVENT-CONTRACT.md)
- [Rencana Tahap 2](TAHAP-2-IMPLEMENTATION-PLAN.md)
- [Audit Source Awal](TAHAP-2-AUDIT-SOURCE-AWAL.md)
- [Roadmap Utama](ROADMAP-UTAMA-MEX-NEX.md)
