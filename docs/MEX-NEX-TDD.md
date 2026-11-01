# TDD — MEX-NEX Living Headquarters

**Status:** rancangan teknis Tahap 2. Keputusan implementasi harus didahului audit modul existing.  
**Prinsip:** extend existing system, backend as source of truth, renderer as read model.

## 1. Konteks repository terkonfirmasi
- Next.js 16, React 19, TypeScript strict.
- Custom Node HTTP/HTTPS server pada server/index.js, dengan Next request handler, access gate, dan gateway WebSocket proxy pada /api/gateway/ws.
- Three.js, React Three Fiber, Drei, dan postprocessing tersedia.
- Script build, typecheck, test, e2e, local, local:demo tersedia.
- .env.example mendefinisikan data directory, provider AI, gateway, dan optional access token.
- README menyatakan data lokal berada di .data/ dan gateway demo hanya simulasi.
- Roadmap lama Tahap 1–7 tetap menjadi roadmap fondasi aplikasi. Dokumen ini merancang perluasan Living HQ/A2A, bukan menggantikannya.

## 2. Arsitektur logical
```
Browser (Next.js / React)
  Office UI + CEO Dashboard
  2D/3D Renderer (Three.js / React Three Fiber)
  Client State / Query Cache
  Realtime Client (WebSocket)
             | HTTPS / WSS
             v
Node Server + Next.js
  API / Application Services
  Organization + Agent Domain
  Task / Workflow Domain
  Conversation / A2A / Meeting
  Approval + Policy Engine
  Office World + Presence Projection
  Realtime Event Gateway
  Runtime / Provider / Tool Adapters
             |
             +-- Persistent Store (adapter boundary)
             +-- AI Providers
             +-- Allowlisted Tool Adapters
```
Diagram adalah logical architecture; bukan klaim seluruh modul telah ada atau terhubung. Implementasi harus memetakan komponen ke file aktual sebelum refactor.

## 2A. Implementasi existing yang telah dibaca

Audit awal menemukan kontrak aktual berikut:
- Office domain lokal dilayani oleh app/api/office/route.js dan menyimpan snapshot ke .data/office.json (version 2), termasuk departments, agents, tasks, messages, activity, meetings, whiteboards, bulletins, dan QA reviews.
- AI chat/agent-run dilayani oleh app/api/ai/route.js; provider dapat berupa Hermes, local, atau external; sesi disimpan pada .data/ai-sessions.json.
- Presence endpoint berada pada src/app/api/office/presence/route.ts dan dapat membaca local snapshot atau remote presence/gateway.
- server/index.js mem-proxy WebSocket upstream pada /api/gateway/ws.
- Tes tests/unit/stageSevenIntegration.test.ts memeriksa persistensi office/chat pada module reload dan tidak bocornya provider secret.

Konsekuensi: /api/office dan /api/ai adalah kontrak existing yang harus dipertahankan. API /api/v1 di dokumen kontrak hanyalah usulan masa depan. File JSON lokal bukan database SQL dan belum membuktikan durabilitas pada deployment Vercel/multi-instance. Lihat [Audit Source Awal](TAHAP-2-AUDIT-SOURCE-AWAL.md).

## 3. Batas domain
1. Organization: company, department, role, agent membership.
2. Agent Runtime: provider, model, run, execution state, tool invocation.
3. Work Management: task, subtask, assignment, dependency, deliverable, review.
4. Communication: conversation, participant, message, A2A session.
5. Meetings: meeting, attendee, transcript, decision, action item.
6. Policy: permission, approval request, budget, audit.
7. Office World: building, floor, room, workstation, navigation graph.
8. Presence Projection: logical location, activity, visual state.
9. Realtime: event envelope, sequence, replay cursor, reconnect.

## 4. Sumber kebenaran
- Persistent domain state berada di backend.
- Runtime events dicatat dan diproyeksikan ke state terkini.
- API/query mengembalikan snapshot; realtime mengirim perubahan.
- Renderer tidak menulis task, approval, atau conversation state.
- Renderer mengirim user intent melalui API; tidak mengubah world state langsung.
- Lokasi Agent disimpan sebagai logical room/workstation dan milestone navigasi, bukan posisi setiap frame.
- Client reconnect mengambil snapshot lalu melanjutkan event dari cursor.

## 5. Tanggung jawab komponen
| Komponen | Tanggung jawab | Batasan |
|---|---|---|
| Next UI | Panel, navigasi, form, accessibility | Tidak menyimpan secret |
| 3D Renderer | Gedung, karakter, animasi state-driven | Tidak memanggil LLM/menentukan task state |
| API Services | Validasi, auth, command, query | Tidak percaya input client |
| Domain Services | Aturan organisasi, task, A2A, meeting | Tidak bergantung Three.js |
| Policy Engine | Allow/deny/approval | Agent tidak dapat menaikkan izin sendiri |
| Runtime Adapter | Model/provider execution | Secret tetap server-side |
| Tool Gateway | Tool allowlisted dan scoped | Tidak ada arbitrary shell/network |
| Persistence Adapter | Transaksi, query, migration | Kegagalan tulis harus terlihat |
| Event Publisher | Outbox, sequence, replay | Publish setelah commit |
| Office Projection | Domain event → world/presence | Bukan sumber kebenaran task |

## 6. Persistensi
Repository mendokumentasikan .data/ untuk penyimpanan lokal. Jangan mengganti engine sebelum audit format, schema, dan migrasi. Wajib: repository interfaces, schema version, atomic write/transaction, backup/restore, stable IDs, UTC timestamps, idempotency, outbox bila cocok, retention policy. Secret hanya di server environment/secret manager.

Pilihan engine database final ditunda sampai audit storage aktual pada awal implementasi. Jangan menambahkan dependency database berdasarkan asumsi.

## 7. Realtime
WebSocket gateway existing adalah gateway upstream; jangan menganggap otomatis sebagai bus event kantor. Perlu kontrak event terpisah atau perluasan kompatibel setelah audit.

Envelope event minimal: eventId, eventType, schemaVersion, occurredAt, sequence, correlationId, causationId, companyId, payload. Event dikirim setelah commit; client deduplicate eventId, deteksi sequence gap, replay dari cursor, dan fallback ke snapshot. Heartbeat, timeout, reconnect backoff, stale/offline indicator, dan auth harus diterapkan.

## 8. Keamanan dan approval
Default deny untuk tool/aksi yang tidak dikenal. Klasifikasi:
- Read-only: membaca data yang diizinkan.
- Internal write: draft/task/catatan dalam scope.
- Sensitive write: konfigurasi, role, struktur, delete, policy.
- External side effect: kirim/publikasi, pembelian, pembayaran, layanan/akun pihak ketiga.

Aksi sensitif/eksternal memerlukan approval sesuai policy. Approval mengikat actor, action, resource, arguments hash, scope, expiry, dan single-use nonce. Perubahan payload membatalkan approval. Sediakan pause/cancel/kill switch. Audit append-only untuk policy, tool, approval, dan hasil.

## 9. Kinerja dan graceful degradation
Lazy-load scene/aset per lantai; fallback 2D/list jika WebGL gagal; Low/Balanced/High presets; LOD/instancing/throttling; kurangi animasi di luar viewport; reduced motion; renderer error tidak boleh menghentikan task execution. Uji touch targets, zoom, dan navigasi di iPhone. Target FPS Tahap 1 adalah sasaran pengujian, bukan hasil.

## 10. Observability
Setiap command/run/event memiliki correlation ID. Catat actor, action, resource, timestamp, result, duration, retry, policy decision, dan metadata aman. Jangan log secret atau konten sensitif secara default. Dashboard pisahkan runtime health, event connection, task health, dan renderer FPS.

## 11. Strategi tes
- Unit: domain rules, transitions, policy, serializers.
- Contract: API/event schema, runtime adapters.
- Integration: persistence, outbox, replay, idempotency.
- Security: role bypass, approval bypass, replay, malformed payload, secret leakage.
- E2E: create task → assign → A2A → deliverable → review → complete; navigasi lantai dan reconnect.
- Visual: desktop/mobile, WebGL fallback, reduced motion.
- Device: Safari iOS, Android browser, desktop Chromium.
- CI: test, typecheck, lint bila tersedia, build; catat hasil per commit.

## 12. Risiko utama
| Risiko | Mitigasi |
|---|---|
| Storage existing belum dipetakan | Audit source/tests sebelum schema migration |
| Gateway dianggap event bus kantor | Pisahkan kontrak dan namespace |
| Event duplikat/terlewat | Sequence, replay, idempotency, outbox |
| Agent palsu terlihat bekerja | Backend source-of-truth, stale indicator, DEMO |
| 3D berat di iPhone | 2D fallback, presets, lazy load, profiling |
| A2A loop/biaya tak terbatas | Budget, depth limit, TTL, cooldown, max fan-out |
| Prompt injection/tool abuse | Trust boundary, allowlist, scoped tools, approval |
| Migrasi merusak fitur | Compatibility tests, incremental migration |

## 13. Hal yang belum boleh diasumsikan
Database engine/schema fisik, event bus/outbox, bentuk seluruh API/auth, provider aktif di deployment, persistence Vercel, posisi Agent tersimpan, dan interoperabilitas A2A existing. Semua wajib diverifikasi dari source dan tests sebelum implementasi.
