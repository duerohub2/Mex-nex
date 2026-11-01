# GDD — MEX-NEX Living Headquarters

**Status:** baseline desain Tahap 2  
**Platform:** browser desktop dan mobile, termasuk Safari iPhone  
**Arah visual:** gedung futuristic, karakter human, interior hybrid  
**Dokumen terkait:** [Moodboard](visual-reference-library/TAHAP-1-REFERENSI-VISUAL.md), [Asset Register](visual-reference-library/asset-register.md), [TDD](MEX-NEX-TDD.md), [Model Data](MEX-NEX-DATA-MODEL.md), [API/Event](MEX-NEX-API-EVENT-CONTRACT.md)

## 1. Visi
MEX-NEX adalah kantor digital yang menjalankan perusahaan berbasis AI Agent. Pengguna berperan sebagai CEO/operator: menetapkan arah, memberi persetujuan untuk tindakan berisiko, memantau kinerja, dan berinteraksi dengan Agent. Agent memiliki identitas, role, departemen, tugas, memori kerja, serta kemampuan berkomunikasi dan berkolaborasi.

Kantor 3D bukan dekorasi. Ia merepresentasikan kondisi operasional backend. Setiap status, percakapan, rapat, perpindahan karakter, dan deliverable harus dapat ditelusuri ke data/event nyata.

## 2. Sasaran
1. Memvisualisasikan headquarters multi-lantai dengan Building View dan Floor View.
2. Menampilkan Agent, role, departemen, status, dan pekerjaan aktif.
3. Mendukung chat privat CEO–Agent dan komunikasi Agent–Agent yang tersimpan/auditable.
4. Mendukung delegasi, subtask, review, meeting, keputusan, dan deliverable.
5. Mengizinkan Agent mengusulkan inisiatif; tindakan berisiko menunggu approval.
6. Mendukung layar sentuh dan mobile dengan fallback 2D/list.
7. Memperluas fitur yang sudah ada, bukan mengganti atau menduplikasi sistem kantor saat ini.

## 3. Bukan sasaran MVP
- Aktivitas palsu yang terlihat nyata tanpa runtime.
- Multiplayer publik atau avatar yang dikendalikan pemain.
- Voice/video call real-time sebagai syarat MVP.
- Marketplace Agent, ekonomi/token, atau monetisasi.
- Akses bebas Agent ke internet, filesystem, akun, atau pembayaran.
- Ketergantungan task engine pada renderer 3D.

## 4. Aktor dan tanggung jawab
| Aktor | Tanggung jawab |
|---|---|
| CEO/Owner | Arah, monitoring, approval, pause/cancel |
| Admin | Organisasi, konfigurasi, role, roster sesuai izin |
| Department Lead | Antrian kerja, prioritas, review |
| AI Agent | Menjalankan task sesuai role, tools, policy, budget |
| Runtime/Tool Adapter | Eksekusi model/tool dan event status |
| Office Renderer | Visualisasi state; tidak mengambil keputusan bisnis |

## 5. Organisasi
Entitas organisasi mencakup company, department, position/role, manager relationship, dan roster Agent. Satu Agent memiliki satu home department utama pada MVP. Kolaborasi lintas departemen memakai task assignment, bukan menggandakan identitas Agent.

Departemen baseline: Executive, Operations, Research & Development, Engineering, Product, Marketing, Finance, Human Resources, Quality Assurance. Struktur aktual harus dipetakan dengan data yang sudah ada; jangan membuat department duplikat.

## 6. Gedung dan ruang
| Zona | Fungsi | Ruang baseline |
|---|---|---|
| Basement | Infrastruktur | Server, network, utility, storage |
| Lantai 1 | Penerimaan/kolaborasi | Lobby, reception, visitor lounge, meeting |
| Lantai 2 | Operasi bisnis | Marketing, Finance, HR, Operations |
| Lantai 3 | Produk dan teknologi | Engineering, Development, Research, QA |
| Lantai 4 | Eksekutif | CEO office, executive office, strategy, boardroom |
| Rooftop | Sosial | Garden, break area, social seating |

Ruangan/lantai harus berupa konfigurasi data, bukan hard-coded asumsi renderer. Department dapat dipindah tanpa mengubah logika Agent.

## 7. Kamera dan navigasi
**Building View:** gedung cutaway isometrik menampilkan semua lantai; tiap lantai bisa dipilih; tersedia zoom, reset, label, dan UI alternatif untuk mobile.

**Floor View:** kamera bergerak halus ke lantai; menampilkan ruang, workstation, furniture fungsional, Agent, dan status; tersedia kembali ke Building View serta lantai sebelumnya/berikutnya.

**Navigasi Agent:** berdasarkan workflow/runtime; pathfinding memperhatikan waypoint, pintu, tangga, lift, dan akses ruang. Jika rute gagal, status blocked dan alasan dicatat; jangan teleport tanpa penjelasan.

## 8. Status Agent
Status kanonis: OFFLINE, IDLE, THINKING, WORKING, TOOL_WAIT, COMMUNICATING, MEETING, REVIEWING, BLOCKED, ERROR, DEMO.

Status berasal dari runtime/domain events, bukan animasi. Task, tool execution, A2A session, meeting, dan approval memiliki state sendiri. DEMO harus selalu terlihat sebagai simulasi. IDLE tidak boleh memanggil LLM hanya untuk animasi.

## 9. Siklus kerja
1. Tujuan dibuat sebagai task.
2. Policy memeriksa actor, scope, risiko, izin, dan budget.
3. Task dipecah menjadi subtask bila diperlukan.
4. Agent dipilih berdasarkan role/skill/availability.
5. Agent menerima task atau meminta klarifikasi.
6. Agent menjalankan pekerjaan melalui runtime dan tools yang diizinkan.
7. Agent dapat mengirim pesan A2A, meminta bantuan, atau mengusulkan meeting.
8. Deliverable disimpan dengan versi dan referensi task.
9. Reviewer/QA memeriksa hasil.
10. Task ditutup sebagai completed, failed, blocked, cancelled, atau menunggu approval.

Aksi eksternal, pengeluaran, publikasi, penghapusan, perubahan konfigurasi/policy, dan akses data sensitif memerlukan approval sesuai policy.

## 10. A2A dan meeting
Setiap komunikasi memiliki conversation ID, participants, sender/recipient, task context, timestamp, message type, correlation ID, dan delivery status. Meeting memiliki agenda, peserta, transcript, keputusan, action item, dan status. Chat tidak otomatis menjadi deliverable.

## 11. UI minimum
- Building: nama gedung, koneksi runtime, ringkasan Agent, lantai, kontrol kamera.
- Floor: nama lantai/ruang, Agent, status, kembali, pindah lantai.
- Agent detail: identitas, jabatan, department, manager, status, task, skill, chat, riwayat.
- Task detail: tujuan, owner, assignee, parent/subtask, prioritas, status, deadline, approval, log, hasil.
- CEO dashboard: task aktif/blocked, approval queue, meeting, status Agent, event terbaru, budget bila tersedia.

## 12. Kriteria penerimaan
- Building View ↔ Floor View dapat digunakan dengan mouse dan sentuhan.
- Basement, empat lantai, dan rooftop dapat dipilih.
- Organisasi/Agent tetap satu sumber data dengan sistem existing.
- Chat/A2A tersimpan dan dapat ditelusuri.
- Delegasi menghasilkan task/subtask yang dapat dilacak.
- Meeting menampilkan peserta dan transcript aktual.
- Renderer mengikuti backend; tidak mengarang aktivitas.
- Approval dan audit trail dapat diperiksa.
- Runtime terputus ditampilkan offline/stale, bukan live.
- Mode 2D/list tetap mendukung operasi inti saat WebGL gagal.
- Secret tidak pernah dikirim ke client.
- Performa diuji pada perangkat nyata; target FPS bukan klaim benchmark.
