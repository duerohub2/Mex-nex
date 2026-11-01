# MEX-NEX — Kontrak API dan Realtime Event

**Status:** rancangan kontrak. Path di bawah usulan, bukan klaim endpoint sudah tersedia. Cocokkan dengan API existing sebelum implementasi dan pertahankan compatibility adapter.

## 1. Konvensi API
- Prefix usulan /api/v1; jangan memindahkan endpoint existing tanpa adapter.
- JSON dengan validasi schema di server.
- Timestamp ISO-8601 UTC.
- Error envelope: { error: { code, message, requestId } }.
- Cursor pagination untuk pesan, event, task history, audit.
- Idempotency-Key untuk command yang dapat diulang.
- Status: 200/201 sukses, 202 async, 400 payload invalid, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict, 422 policy rejection, 429 rate/budget limit, 500 safe error.
- Jangan kembalikan API key, secret, environment, atau stack trace.

## 2. Resource map (proposal)
| Method | Path | Fungsi |
|---|---|---|
| GET | /api/v1/company | Profil perusahaan |
| GET/POST | /api/v1/departments | Daftar/buat department |
| GET/PATCH | /api/v1/departments/:id | Detail/update department |
| GET/POST | /api/v1/agents | Roster/buat Agent |
| GET/PATCH | /api/v1/agents/:id | Detail/update Agent |
| GET | /api/v1/agents/:id/activity | Run, task, presence |
| GET/POST | /api/v1/tasks | Daftar/buat task |
| GET/PATCH | /api/v1/tasks/:id | Detail/update task |
| POST | /api/v1/tasks/:id/assignments | Delegasi |
| POST | /api/v1/tasks/:id/cancel | Cancel task |
| GET | /api/v1/tasks/:id/deliverables | Hasil kerja |
| POST | /api/v1/deliverables/:id/reviews | Review |
| GET/POST | /api/v1/conversations | Daftar/buat percakapan |
| GET/POST | /api/v1/conversations/:id/messages | Riwayat/kirim pesan |
| POST | /api/v1/a2a/sessions | Mulai sesi A2A |
| POST | /api/v1/a2a/sessions/:id/close | Tutup sesi |
| GET/POST | /api/v1/meetings | Daftar/buat meeting |
| POST | /api/v1/meetings/:id/start | Mulai meeting |
| POST | /api/v1/meetings/:id/end | Akhiri meeting |
| GET | /api/v1/approvals | Approval queue |
| POST | /api/v1/approvals/:id/decision | Approve/reject |
| GET | /api/v1/office/world | Snapshot gedung/ruang |
| GET | /api/v1/office/presence | Snapshot lokasi/status Agent |
| GET | /api/v1/office/events?after=:cursor | Replay event |

Semua resource sensitif memerlukan authorization per resource, bukan hanya akses ke halaman.

## 3. Contoh delegasi (payload ilustratif)
Request:
```json
{
  "agentId": "agent-research",
  "assignmentRole": "OWNER",
  "reason": "Riset kompetitor untuk product discovery",
  "expectedOutput": ["research-report", "source-list"],
  "budget": { "maxSteps": 12, "maxTokens": 18000 }
}
```
Response 202:
```json
{
  "taskId": "task-123",
  "assignmentId": "assignment-456",
  "status": "QUEUED",
  "correlationId": "corr-789"
}
```
ID di atas contoh, bukan record real.

## 4. Event envelope
```json
{
  "eventId": "evt-uuid",
  "eventType": "task.status_changed",
  "schemaVersion": 1,
  "companyId": "company-id",
  "sequence": 1042,
  "occurredAt": "2026-11-01T00:00:00.000Z",
  "correlationId": "corr-id",
  "causationId": "command-or-event-id",
  "payload": {}
}
```

## 5. Event catalog awal
| Event | Payload penting | Efek visual |
|---|---|---|
| agent.presence_changed | agentId, status, source | Status badge/animasi |
| task.created | taskId, creator, title | Board update |
| task.assigned | taskId, agentId, role | Agent menerima tujuan |
| task.status_changed | taskId, from, to, reason | Activity update |
| task.blocked | taskId, reason, requiredAction | Blocked indicator |
| task.completed | taskId, deliverableIds | Agent beralih aktivitas |
| agent.message_sent | conversationId, sender, recipient | Communication indicator |
| a2a.session_started | sessionId, participants, taskId | Agent menuju area diskusi |
| a2a.session_ended | sessionId, outcome | Agent kembali ke aktivitas |
| meeting.started | meetingId, attendeeIds, roomId | Peserta menuju ruang rapat |
| meeting.ended | meetingId, recordIds | Peserta keluar, action item |
| approval.requested | approvalId, action, risk | Approval queue badge |
| approval.decided | approvalId, decision | Workflow lanjut/ditolak |
| office.location_changed | agentId, roomId, workstationId | Karakter berpindah |
| runtime.connection_changed | adapterId, state | Live/stale/offline |

Event browser harus minimal dan tidak memuat secret atau private payload yang tidak diperlukan renderer.

## 6. State machine
- Task: DRAFT → QUEUED → ASSIGNED → IN_PROGRESS → REVIEW → COMPLETED. Cabang: BLOCKED, WAITING_APPROVAL, FAILED, CANCELLED.
- Agent run: CREATED → STARTING → RUNNING → WAITING_TOOL/WAITING_APPROVAL → SUCCEEDED/FAILED/CANCELLED/TIMED_OUT.
- A2A: REQUESTED → ACCEPTED → ACTIVE → COMPLETED/REJECTED/CANCELLED/TIMED_OUT.
- Meeting: PLANNED → INVITING → ACTIVE → WRAPPING_UP → COMPLETED/CANCELLED.

Transisi divalidasi server-side dan menyimpan from/to/reason.

## 7. Reconnect dan replay
Client connect dan autentikasi → menerima current sequence → mengambil snapshot bila state kosong/cursor expired → menerima event berurutan → menyimpan cursor → reconnect dengan cursor → replay. Jika replay tidak tersedia, server memerintahkan snapshot baru. Deduplicate event ID; sequence gap memicu replay, bukan silent continue.

## 8. Keamanan
Otorisasi participant untuk conversation/message; scope Agent untuk task/department; validasi ID dan enum; rate limit per actor/Agent/endpoint/provider; approval token single-use dan expiry; cegah A2A self-loop, delegation cycle, unlimited fan-out; tool allowlist per role; catat deny/approval tanpa membocorkan data rahasia.
