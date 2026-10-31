# Tahap 2 — Sistem Perusahaan dan AI Agent

## Fitur yang tersedia
- Profil Agent dapat dibuat dari dashboard.
- Setiap Agent terhubung dengan departemen dan atasan langsung opsional.
- Departemen baru dapat ditambahkan.
- Tugas dapat dibuat langsung dengan penanggung jawab Agent.
- Status tugas: Baru, Berjalan, dan Selesai.
- Perubahan dicatat pada activity log lokal.
- Data lama Tahap 1 dinormalisasi saat dibaca; file data tidak perlu dihapus.

## Model organisasi
- `departments`: id, name, icon, description.
- `agents`: id, name, role, departmentId, managerId, avatar, status, description.
- `tasks`: id, title, status, assigneeId, createdAt, updatedAt.
- `activity`: riwayat perubahan organisasi dan tugas.

## API
Endpoint: `POST /api/office`
- `create-agent`: name, role, departmentId, managerId?, description?
- `create-department`: name, description?
- `add-task`: title, assigneeId?
- `assign-task`: taskId, agentId
- `task-status`: taskId, status (`todo`, `in_progress`, `done`)

Semua perubahan divalidasi di backend dan disimpan ke `.data/office.json`.

## Batas yang perlu dipahami
Tahap 2 membangun sistem organisasi dan delegasi administratif. Penugasan kepada Agent belum berarti model AI sudah mengerjakan tugas. Eksekusi otomatis, percakapan Agent-ke-Agent, pembagian rencana oleh Manager, dan otonomi AI memerlukan integrasi runtime dan kebijakan izin pada tahap selanjutnya.
