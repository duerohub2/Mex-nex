# Tahap 2 — GDD, TDD, Model Data, dan Arsitektur

## Tujuan
Mengubah keputusan visual Tahap 1 menjadi spesifikasi produk, domain, data, API, realtime, keamanan, dan urutan implementasi yang tidak merusak fitur existing.

## Deliverables
| Dokumen | Hasil |
|---|---|
| [GDD](MEX-NEX-GDD.md) | Visi, aktor, gedung, ruang, UX, perilaku Agent, kolaborasi |
| [TDD](MEX-NEX-TDD.md) | Arsitektur, domain boundaries, runtime, persistence, realtime, security, tests |
| [Logical Data Model](MEX-NEX-DATA-MODEL.md) | Entitas, relasi, indeks, lifecycle, migrasi |
| [API & Event Contract](MEX-NEX-API-EVENT-CONTRACT.md) | Resource map, payload, event, state machine, replay |
| [Visual reference](visual-reference-library/TAHAP-1-REFERENSI-VISUAL.md) | Moodboard dan standar aset |

## Urutan kerja
### 2.1 Audit sistem existing
- Petakan API routes, storage adapter, schema, migrations, tests.
- Petakan company/department/agent/task/chat/meeting existing.
- Petakan WebSocket gateway dan event bridge; pisahkan upstream gateway dari office realtime.
- Bedakan data demo dan data runtime.
- Simpan inventory file-to-domain dan compatibility matrix.

### 2.2 Domain dan workflow
Finalisasi state machine task/run/A2A/meeting, ownership, assignment, parent-child task, review, deliverable, approval matrix, budget, role, skill, manager, department.

### 2.3 Data dan persistence
Map logical model ke storage aktual; tetapkan schema version/migration; siapkan backup, rehearsal, rollback; uji restart persistence dan idempotency.

### 2.4 API dan realtime
Cocokkan resource map dengan route existing; definisikan event envelope, sequence/replay; implementasikan outbox hanya bila cocok; pertahankan access gate, authorization, rate limit, error contract.

### 2.5 Office world
Finalisasi floor/room/workstation IDs, coordinate system, scale, elevation, nav graph, logical location/presence, asset loading boundary per lantai.

### 2.6 Review dan sign-off
Review threat model, privacy, biaya, data lifecycle, mobile fallback; pastikan dokumen konsisten; catat keputusan sebagai ADR.

## Acceptance gate
- [x] GDD ditulis.
- [x] TDD dan logical architecture ditulis.
- [x] Logical data model dan relasi ditulis.
- [x] API/event contract dan state machine ditulis.
- [x] Approval, security, A2A, audit, replay, budget principles ditulis.
- [x] Urutan implementasi dan risiko migrasi ditulis.
- [ ] Audit source code detail dan inventory file-to-domain selesai.
- [ ] Database engine/schema fisik diverifikasi dari implementasi aktual.
- [ ] API routes dan WebSocket behavior diverifikasi terhadap source/tests.
- [ ] Keputusan arsitektur final disetujui setelah audit.
- [ ] CI test/typecheck/build dijalankan pada commit terakhir dan hasil dicatat.

**Status:** DOKUMENTASI DESAIN LENGKAP AWAL. Tahap 2 belum selesai penuh sampai audit dan validasi terakhir ditutup.

## Batas tahap
Tahap 2 adalah perencanaan dan arsitektur. Belum termasuk membangun gedung 3D, model karakter, migrasi database, atau mengubah workflow produksi. Coding dimulai setelah audit kompatibilitas agar tidak menggandakan fitur.
