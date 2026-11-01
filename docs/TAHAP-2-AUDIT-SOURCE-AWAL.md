# Tahap 2 — Audit Awal Source dan Pemetaan Existing System

**Tanggal audit:** 1 November 2026  
**Branch:** main  
**Batas:** hanya file yang berhasil dibaca melalui GitHub pada audit ini. Ini bukan klaim audit seluruh repository.

## 1. File yang diverifikasi

| File | Temuan faktual | Implikasi desain |
|---|---|---|
| package.json | Next 16, React 19, Three/R3F/Drei; scripts build/typecheck/test/e2e/local | Stack 3D/browser telah tersedia; jangan menambah framework sebelum kebutuhan terbukti |
| server/index.js | Custom Node HTTP/HTTPS server; Next handler; access gate; gateway proxy; WS path /api/gateway/ws | Pertahankan custom server dan jalur gateway existing |
| server/access-gate.js | Optional STUDIO_ACCESS_TOKEN cookie gate; constant-time compare; auth attempt rate limiter in-memory | Akses publik perlu threat review terpisah; in-memory limiter tidak setara distributed limiter |
| server/gateway-proxy.js | WebSocket proxy, upstream adapter, frame size/rate limits, upstream allowlist behavior | Gateway upstream bukan otomatis office domain event bus |
| app/api/office/route.js | Office API memakai JSON file .data/office.json, schema version 2, seed departments/agents/tasks/messages/activity/meetings/whiteboards/bulletins/QA; atomic temp-write + rename; activity dibatasi 200 | Logical model harus dimapping ke dokumen JSON yang sudah ada sebelum schema baru dibuat |
| app/api/ai/route.js | AI provider config (Hermes/local/external); sessions disimpan di .data/ai-sessions.json; chat history per agent; agent-run/tool loop | Chat, dispatch, run, dan tool execution sudah memiliki implementasi yang perlu diperluas secara kompatibel |
| src/app/api/office/presence/route.ts | Local snapshot atau remote HTTP/gateway presence; remote gateway mengambil agents.list, status, sessions.preview | Ada presence bridge; perlu bedakan snapshot remote dan local runtime source |
| tests/unit/stageSevenIntegration.test.ts | Test persistensi office task/assignment setelah module reload; chat history; secret tidak terekspos; provider error aman | Existing tests adalah regression gate; jangan mengubah kontrak tanpa memperbarui test |
| docs/roadmap.md | Roadmap fondasi aplikasi Tahap 1–7 | Roadmap ekspansi Living HQ perlu menjadi jalur terpisah, bukan menimpa roadmap fondasi |

## 2. Data store yang terkonfirmasi

- Office state: .data/office.json, version 2.
- AI sessions: .data/ai-sessions.json.
- Office API membaca/menormalisasi seed, menulis file sementara lalu rename.
- AI API juga menyimpan sesi ke JSON file dengan temporary file lalu rename.
- README menyebut .data/ lokal; belum diverifikasi bahwa mekanisme file lokal tersebut cocok untuk deployment serverless Vercel atau multi-instance.

**Penting:** ini adalah persistensi file lokal, bukan bukti bahwa repository menggunakan SQLite atau PostgreSQL. Jangan mengklaim database relasional sudah ada. Deployment Vercel harus memakai storage persisten yang sesuai sebelum mengandalkan data produksi.

## 3. API dan realtime yang terkonfirmasi

- Local office API: /api/office (app/api/office/route.js).
- AI runtime/chat API: /api/ai (app/api/ai/route.js).
- Presence API: /api/office/presence (src/app/api/office/presence/route.ts).
- Custom server menangani WebSocket proxy pada /api/gateway/ws.
- Belum ada bukti dari file yang diperiksa bahwa /api/v1 resource map atau office event replay bus sudah tersedia. Kontrak API/event baru adalah target rancangan.

## 4. Compatibility rules

1. Jangan mengganti /api/office atau /api/ai tanpa adapter dan test migrasi.
2. Jangan memindahkan data JSON ke DB tanpa importer, backup, rollback, dan uji restart.
3. Jangan menganggap remote gateway presence sama dengan event bus durable.
4. Jangan mengubah bentuk seed Agent/department tanpa menjaga data existing dan consumers.
5. Periksa batas deployment: custom Node server/WebSocket dan filesystem local data harus diverifikasi terhadap target hosting sebelum desain runtime production dikunci.
6. Pertahankan test stageSevenIntegration sebagai regression suite.

## 5. Audit yang masih terbuka

- Enumerasi seluruh operasi dan response contract /api/office.
- Enumerasi seluruh action /api/ai termasuk agent-run, dispatch, tool allowlist, limits, audit.
- Audit seluruh persistence files dan data migrations.
- Audit Office UI state model dan renderer consumption.
- Audit runtime event bridge, remote presence schema, gateway auth handshake.
- Audit Vercel deployment/runtime config dan storage durability.
- Jalankan CI tests/typecheck/build setelah perubahan dokumentasi dan catat status final.

## 6. Kesimpulan awal

MEX-NEX sudah memiliki fondasi operasional lokal yang nyata: office JSON store, AI session store, chat/runtime API, presence bridge, dan gateway proxy. Karena itu, rancangan Tahap 2 harus mengembangkan entity dan event secara incremental. Jangan membuat sistem organisasi, task, chat, presence, atau gateway kedua sebelum seluruh kontrak existing dipetakan.
