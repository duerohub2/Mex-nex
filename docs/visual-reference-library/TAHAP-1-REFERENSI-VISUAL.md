# Tahap 1 — MEX-NEX Visual Reference Library

> Status: riset awal dan pedoman arah visual. Dokumen ini bukan klaim bahwa aset baru sudah dibuat atau bahwa desain 3D sudah diimplementasikan.

## 1. Tujuan

Membangun kantor virtual MEX-NEX yang terasa seperti kantor perusahaan sungguhan: gedung multi-lantai yang dapat dijelajahi, agent yang bekerja berdasarkan status operasional nyata, dan kolaborasi ant ar-agent yang tercermin secara visual.

Prinsip utama:
- Referensi dipakai untuk mempelajari pola, bukan menyalin identitas, kode, model, tekstur, layout unik, atau branding pihak lain.
- Aset identitas utama MEX-NEX dibuat khusus.
- Aset umum boleh berasal dari pustaka eksternal setelah lisensi setiap file diperiksa.
- Visual 3D harus menjadi representasi state backend, bukan animasi demo yang mengarang aktivitas.
- Semua keputusan harus mempertimbangkan desktop dan HP.

## 2. Arah visual sementara

**Nama arah:** MEX-NEX Living Headquarters.

**Gaya:** soft low-poly / stylized 3D modern, isometrik, open-side cutaway, dengan aksen pop-art yang terkontrol.

**Palet awal:** warm cream, ivory, sand, terracotta/orange, muted brown, peach, dengan aksen warna departemen. Hindari seluruh permukaan terlalu ramai; warna kuat dipakai untuk penanda, identitas, dan elemen interaktif.

**Kamera dan gedung:**
- Tampilan Building View memperlihatkan basement, empat lantai, dan rooftop dalam satu komposisi cutaway.
- Setiap lantai dapat dipilih; kamera bergerak masuk ke Floor View dengan transisi halus.
- Floor View menampilkan detail ruangan, agent, furniture, dan interaksi.
- Sediakan kembali ke Building View, kontrol lantai sebelumnya/berikutnya, zoom, dan reset kamera.
- Dinding sisi kamera dapat dipotong atau dibuat transparan secara konsisten agar agent tidak tertutup.
- Tangga dan elevator menjadi jalur visual dan navigasi antar-lantai; simulasi perpindahan agent harus terhubung dengan sistem navigasi dan state, bukan sekadar teleportasi dekoratif.

## 3. Referensi proyek untuk dipelajari

| Referensi | Hal yang dipelajari | Batas penggunaan |
|---|---|---|
| [Staffroom](https://github.com/staffroom-ai/staffroom) | Kantor 3D untuk agent dengan role, tugas nyata, model per agent, MCP dan tools | Pelajari pemisahan agent/runtime dan visualisasi; jangan salin nama, UI, atau implementasi |
| [Atlassian Roving Office](https://github.com/atlassian-labs/roving-office) | Agent session divisualisasikan sebagai karakter yang masuk, duduk, mencari informasi, dan selesai bekerja | Referensi hubungan status kerja dengan gerakan karakter; jangan anggap simulasi demo sebagai kerja nyata |
| [Hermes Virtual Office fork](https://github.com/dian003/virtual-office) | Ruang per divisi, meeting room, A2A, transcript, QA, kanban, serta perpindahan avatar ke meja rekan | Pelajari alur A2A dan sinkronisasi; verifikasi lisensi dan ketergantungan sebelum memakai kode |
| [Hermes3D](https://github.com/iamlukethedev/Hermes3D) | Integrasi visual kantor dengan runtime agent dan mode 2D/3D | Sudah tercatat sebagai salah satu upstream proyek; pertahankan atribusi dan lisensi yang berlaku |
| [Claude-Office](https://github.com/W17ant/Claude-Office) | Referensi aktivitas kantor dan cara menyajikan agent dalam ruang kerja | Inspirasi perilaku/UX saja; bukan sumber untuk menyalin aset atau branding |

### Temuan desain yang relevan

1. **Ruang kantor harus menjelaskan pekerjaan.** Lokasi agent, meja, ruang rapat, dan layar status harus punya makna operasional.
2. **Interaksi A2A perlu bisa diaudit.** Pesan, pemanggilan agent, hasil, dan status meeting harus punya catatan backend.
3. **Gerakan mengikuti event nyata.** Contoh: agent menuju meja rekan saat sesi A2A aktif, menuju ruang rapat ketika meeting dimulai, atau kembali ke workstation setelah tugas selesai.
4. **Status demo wajib dibedakan.** Jika runtime belum tersambung, UI harus menyatakan demo/offline, bukan menggambarkan seolah-olah agent sungguhan sedang bekerja.
5. **Kinerja mobile adalah syarat desain.** Detail, bayangan, jumlah objek, animasi, dan resolusi harus bisa diturunkan tanpa menghilangkan fungsi inti.

## 4. Referensi pustaka aset

### Sumber yang layak ditelusuri
- [Kenney](https://kenney.nl/) — aset game 2D/3D; halaman dukungan menyatakan aset pada halaman aset menggunakan CC0. Tetap periksa halaman dan berkas lisensi dari paket yang benar-benar diunduh.
- [Kenney Support — License FAQ](https://kenney.nl/support) — sumber primer untuk ketentuan CC0 dan atribusi.
- [Poly Pizza](https://poly.pizza/) — katalog model 3D dari kontributor; setiap model dapat memiliki lisensi Creative Commons yang berbeda. Periksa lisensi model satu per satu dan simpan bukti saat diunduh.
- [Blender](https://www.blender.org/) — alat produksi dan penyuntingan aset orisinal; bukan pustaka aset.

### Aturan penerimaan aset
Sebelum aset eksternal masuk repository, catat:
- nama aset dan pembuat;
- URL halaman aset asli;
- tanggal pengunduhan;
- lisensi persis (misalnya CC0, CC-BY, atau lisensi lain);
- apakah atribusi, share-alike, atau batas komersial berlaku;
- format file, ukuran, polygon/texture jika diketahui;
- perubahan yang dilakukan;
- lokasi file dan teks atribusi yang diperlukan.

Jangan menganggap seluruh katalog suatu situs memiliki satu lisensi. Jangan mengambil model dari hasil pencarian gambar tanpa menemukan halaman aset dan lisensi aslinya. Jangan memasukkan aset berlisensi tidak jelas.

## 5. Identitas aset yang dibuat khusus

Prioritas aset orisinal MEX-NEX:
1. Siluet dan fasad gedung utama open-side cutaway.
2. Sistem modul lantai, tangga, elevator, balkon, dan rooftop.
3. Signage dan identitas MEX-NEX.
4. Set interior khas untuk lobby, ruang departemen, ruang rapat, executive suite, server room, dan lounge.
5. Karakter agent beserta variasi pakaian/warna identitas dan animasi.
6. Objek interaktif khas: workstation, layar status, terminal, panel rapat, papan tugas, dan titik interaksi fasilitas.

Aset umum seperti kursi, meja standar, tanaman, lampu, dan dekorasi dapat memakai pustaka eksternal yang lisensinya jelas, lalu disesuaikan secara konsisten.

## 6. Tata ruang gedung — rancangan awal

Ini rancangan kerja untuk diuji, bukan keputusan final yang mengunci jumlah ruangan atau departemen.

| Area | Fungsi utama |
|---|---|
| Basement | Server, infrastruktur, storage, monitoring |
| Lantai 1 | Lobby, reception, ruang tamu, meeting/collaboration |
| Lantai 2 | Departemen bisnis: marketing, finance, HR, operations |
| Lantai 3 | Development, engineering, research, QA |
| Lantai 4 | Executive, strategy, boardroom |
| Rooftop | Garden, break area, ruang sosial |

Setiap lantai harus dapat dilihat dari Building View dan dimasuki secara langsung melalui klik. Floor View perlu menyediakan navigasi antar-lantai agar pengguna tidak harus kembali ke tampilan gedung setiap kali berpindah.

## 7. Prinsip realisme agent

- Satu sumber kebenaran: backend/runtime menyimpan status agent, tugas, lokasi, sesi komunikasi, dan hasil kerja.
- Frontend menerima event/state dan menerjemahkannya menjadi animasi.
- Agent hanya berjalan ke lokasi yang valid dan memiliki tujuan aktivitas.
- Meeting menampilkan peserta yang benar-benar terlibat; transcript harus berasal dari percakapan aktual.
- Agent tidak boleh membuat pesan atau hasil kerja palsu untuk membuat kantor tampak ramai.
- Inisiatif mandiri harus dibatasi oleh role, izin, anggaran, dan approval policy.
- Aktivitas yang memanggil model atau tools harus memiliki status, timeout, retry, dan audit trail.

## 8. Struktur katalog yang disarankan

Saat katalog aset mulai diisi, gunakan struktur berikut:

```text
docs/
  visual-reference-library/
    TAHAP-1-REFERENSI-VISUAL.md
    references/
      architecture.md
      interiors.md
      characters-and-animation.md
      agent-interaction.md
      lighting-and-materials.md
    asset-register.md
public/
  office-assets/
    original/
    third-party/
      kenney/
      poly-pizza/
    licenses/
```

Jangan menaruh file model besar ke Git sebelum format, ukuran, optimasi, dan lisensinya diperiksa.

## 9. Kriteria selesai Tahap 1

- [x] Arah visual awal ditetapkan.
- [x] Referensi proyek awal dikumpulkan.
- [x] Sumber pustaka aset awal diidentifikasi.
- [x] Aturan lisensi dan atribusi ditetapkan.
- [x] Konsep gedung multi-lantai dan pengalaman navigasi ditulis.
- [x] Prinsip agent nyata vs animasi demo ditetapkan.
- [ ] Referensi visual per kategori dikurasi lebih lanjut bersama pemilik proyek.
- [ ] Palet final, style guide, dan contoh moodboard disetujui.
- [ ] Daftar aset prioritas dan asset register awal dilengkapi.

Tahap 1 **belum dinyatakan selesai** sampai item yang memerlukan persetujuan visual dan kurasi aset diselesaikan.

## 10. Sumber dan pemeriksaan lisensi

- Staffroom repository: https://github.com/staffroom-ai/staffroom
- Atlassian Roving Office: https://github.com/atlassian-labs/roving-office
- Hermes Virtual Office: https://github.com/dian003/virtual-office
- Hermes3D upstream: https://github.com/iamlukethedev/Hermes3D
- Claude-Office: https://github.com/W17ant/Claude-Office
- Kenney license FAQ: https://kenney.nl/support
- Poly Pizza terms: https://poly.pizza/docs/tos

**Catatan:** status lisensi dan isi repositori eksternal dapat berubah. Periksa file LICENSE/NOTICE dan lisensi setiap aset pada saat akan menggunakannya. Tautan referensi bukan izin otomatis untuk menyalin aset atau kode.


---

# Pendalaman Tahap 1 — Spesifikasi Visual dan Teknis

Bagian ini mematangkan dokumen riset awal menjadi acuan produksi. Ini tetap dokumen perencanaan; belum berarti fitur atau aset di bawah sudah dibuat.

## 11. Riset pembanding tambahan

### Staffroom — kerja agent dan batas keamanan
Sumber: https://github.com/staffroom-ai/staffroom

Hal yang relevan:
- Agent memiliki role dan tanggung jawab yang jelas.
- Tugas masuk melalui lead/departemen lalu dikerjakan agent yang sesuai.
- Agent dapat menggunakan model dan tool berbeda.
- Hasil kerja disimpan sebagai deliverable yang dapat diperiksa.
- Tool yang dapat mengubah dunia luar memerlukan approval pemilik.
- Run log membantu merekonstruksi apa yang benar-benar dilakukan agent.

Keputusan untuk MEX-NEX: tiru prinsip transparansi, deliverable, pemisahan izin read/write, dan audit; jangan menyalin UI, identitas, atau implementasi.

### Roving Office — visualisasi event, bukan bukti kerja
Sumber: https://github.com/atlassian-labs/roving-office

Repo ini secara eksplisit membedakan simulasi demo dari agent yang terhubung sungguhan. Ini menjadi pelajaran penting: gedung yang tampak hidup tidak otomatis berarti pekerjaan nyata sedang berlangsung.

Keputusan untuk MEX-NEX: setiap avatar harus memiliki status sumber yang jelas (LIVE, IDLE, OFFLINE, DEMO, ERROR), dan UI harus memberi tanda bila aktivitas hanya simulasi.

### Virtual Office — alur A2A dan prioritas aktivitas
Sumber: https://github.com/dian003/virtual-office

Hal yang relevan:
- Aktivitas meeting dan A2A memengaruhi lokasi karakter.
- Prioritas aktivitas mencegah avatar yang sedang punya tugas terlihat santai.
- Meeting lintas divisi diarahkan ke ruang yang sesuai.
- Transcript, hasil, dan status tugas dapat ditelusuri.
- Layout memperhitungkan navigasi, tangga, dan batas akses ruangan.

Keputusan untuk MEX-NEX: status operasional menentukan aktivitas visual; avatar tidak boleh memilih animasi idle ketika sedang menjalankan tugas, meeting, review, atau komunikasi.

### AI Office — state backend sebagai sumber kebenaran
Sumber: https://github.com/Bogdusik/AI-Office

Hal yang relevan:
- Deskripsi proyek menyebut posisi dan aksi karakter digerakkan oleh state database, bukan animasi scripted.
- Workflow tugas dijelaskan per tahap dan hasilnya masuk ke review queue.
- Perjalanan melalui lift/tangga menghubungkan simulasi dengan ruang kerja.

Keputusan untuk MEX-NEX: ini prinsip arsitektur yang dituju. Setiap aksi visual harus dapat ditelusuri ke event backend, task, meeting, atau aktivitas yang sah.

### Roving Office dan Staffroom: perbedaan yang perlu dijaga
- Visualisasi demo berguna untuk preview, onboarding, dan uji layout.
- Mode produksi harus terhubung ke runtime agent, penyimpanan, event, dan audit.
- Jangan pernah menampilkan percakapan, hasil kerja, atau keberhasilan tool palsu sebagai kejadian nyata.

## 12. Keputusan desain yang dibakukan

### 12.1 Bentuk gedung
- Satu headquarters utama dengan basement, empat lantai, dan rooftop.
- Bentuk isometrik cutaway/open-side agar seluruh lantai dapat terlihat dari Building View.
- Setiap lantai merupakan zona terpisah dengan identitas warna dan fungsi.
- Interior tidak boleh tertutup dinding sisi kamera; gunakan cutaway, hide-on-camera, atau transparansi terkontrol.
- Struktur lantai, tangga, elevator, pintu, dan koridor harus mengikuti satu grid koordinat dan skala yang konsisten.
- Gedung harus tetap terbaca pada layar ponsel; detail dekoratif tidak boleh mengalahkan keterbacaan ruang.

### 12.2 Dua mode kamera
**Building View**
- Menampilkan gedung utuh dari sudut isometrik.
- Semua lantai dapat dipilih dengan tap/click.
- Hover/focus desktop dan tap mobile menampilkan nama serta fungsi lantai.
- Menyediakan zoom, reset, dan indikator lantai.

**Floor View**
- Kamera bergerak menuju lantai terpilih dengan transisi halus.
- Lantai lain dapat disamarkan atau diperkecil visibilitasnya, tetapi simulasi backend tetap berjalan.
- Menampilkan ruangan, nama ruang, agent, fasilitas, dan status kerja.
- Menyediakan tombol kembali ke Building View serta kontrol lantai sebelumnya/berikutnya.
- Deep link/URL state untuk lantai terpilih dapat dipertimbangkan agar navigasi dapat dibagikan dan dipulihkan.

### 12.3 Hierarki visual
1. Agent dan aktivitas kerja.
2. Ruangan dan batas antar-zona.
3. Jalur mobilitas dan fasilitas interaktif.
4. Furniture fungsional.
5. Dekorasi.

Jika performa menurun, dekorasi dan efek visual dikurangi lebih dahulu, bukan informasi status agent.

## 13. Spesifikasi lantai — rancangan baseline

| Area | Ruangan/fitur baseline | Kriteria visual |
|---|---|---|
| Basement | Server room, network rack, power/utility, storage | Cahaya teknis, akses terbatas, kabel/rack tertata |
| Lantai 1 | Lobby, reception, visitor lounge, collaboration room, meeting room | Paling ramah pengunjung, signage jelas, mudah ditemukan |
| Lantai 2 | Marketing, Finance, HR, Operations, ruang kerja tim | Workstation per fungsi, papan kerja dan area diskusi |
| Lantai 3 | Engineering, Development, Research, QA, testing room | Ruang fokus, workstation teknis, area review |
| Lantai 4 | CEO office, executive office, strategy room, boardroom | Lebih tenang, akses berbasis role |
| Rooftop | Garden, break area, social seating | Area istirahat; tidak boleh menutupi jalur navigasi |

Departemen final harus disesuaikan dengan organisasi yang sudah ada di MEX-NEX. Jangan membuat departemen duplikat hanya demi memenuhi layout.

## 14. Spesifikasi agent dan animasi

### Status operasional minimum
- OFFLINE: tidak tersambung ke runtime.
- IDLE: tersambung dan tidak memiliki pekerjaan aktif.
- THINKING: model sedang memproses.
- WORKING: menjalankan langkah tugas.
- TOOL_WAIT: menunggu tool atau approval.
- COMMUNICATING: sedang melakukan komunikasi A2A.
- MEETING: mengikuti meeting aktif.
- REVIEWING: memeriksa hasil pekerjaan agent lain.
- BLOCKED: tidak dapat melanjutkan dan membutuhkan intervensi.
- ERROR: eksekusi gagal.
- DEMO: simulasi visual, bukan eksekusi nyata.

Status harus berasal dari state runtime atau event yang tercatat, bukan ditebak dari animasi.

### Pemetaan aktivitas visual
| Event/state | Representasi visual |
|---|---|
| Task accepted | Agent menuju workstation atau area tugas |
| THINKING | Pose fokus, indikator proses |
| WORKING | Duduk/berdiri bekerja di workstation |
| TOOL_WAIT | Menunggu di workstation dengan indikator menunggu |
| COMMUNICATING | Bergerak ke rekan atau ruang diskusi; bubble hanya saat pesan aktif |
| MEETING | Menuju ruang rapat dan menempati kursi peserta |
| REVIEWING | Mengunjungi workstation/deliverable yang sedang ditinjau |
| BLOCKED | Indikator bantuan/intervensi |
| IDLE | Aktivitas santai yang tidak mengonsumsi model |
| OFFLINE/ERROR | Status visual yang jelas, tanpa animasi seolah sedang bekerja |

Animasi hanya menyampaikan status; animasi tidak boleh mengubah status kerja.

## 15. Spesifikasi interaksi agent-to-agent

- Setiap percakapan memiliki conversation/session ID, pengirim, penerima, konteks tugas, waktu, dan status.
- Delegasi membuat task/subtask yang memiliki parent task dan pemilik yang jelas.
- Hasil agent disimpan sebagai deliverable/version; jangan hanya mengandalkan chat transcript.
- Meeting memiliki peserta, agenda, status, transcript, keputusan, action item, dan alasan pembatalan bila ada.
- Agent dapat menolak atau meminta klarifikasi jika tugas di luar peran, izin, atau kemampuan.
- Retry harus idempotent agar task tidak dieksekusi ganda tanpa sengaja.
- Semua pemanggilan model/tool memiliki batas waktu, batas biaya/token, dan audit event.
- Inisiatif mandiri memakai policy: trigger, scope, role, cooldown, approval, dan batas jumlah tindakan.
- Agent tidak boleh menaikkan kewenangannya sendiri atau mengikuti instruksi berbahaya dari dokumen/pesan/tool.
- Pengguna dapat pause, cancel, atau meminta penjelasan atas workflow yang sedang berlangsung.

## 16. Standar kualitas aset 3D

### Standar model
- Gunakan glTF/GLB sebagai format runtime utama bila sesuai dengan pipeline.
- Terapkan skala dunia yang konsisten; tetapkan satuan dan tinggi pintu/karakter sebagai patokan.
- Terapkan origin/pivot yang konsisten untuk pintu, kursi, karakter, lift, dan furniture interaktif.
- Model diberi nama deskriptif dan hierarki node yang stabil.
- Hindari polygon berlebihan untuk objek kecil yang jarang dilihat dekat.
- Gunakan texture atlas/material sharing bila mengurangi draw calls.
- Sediakan level of detail atau versi sederhana untuk objek penting bila dibutuhkan.
- Kompres tekstur dan model setelah pipeline diuji di browser target.

### Standar karakter
- Proporsi dan tinggi karakter konsisten.
- Rig dan nama tulang konsisten antar-karakter.
- Animasi dasar: idle, walk, sit, work/typing, talk, listen, point/gesture, meeting, celebrate, blocked/help.
- Animasi transisi tidak boleh menyebabkan teleportasi atau kaki meluncur secara mencolok.
- Identitas agent dibedakan lewat palet, pakaian, badge, dan profil; hindari mengandalkan warna saja.

### Standar furniture interaktif
Setiap objek interaktif memiliki ID stabil, tipe, posisi, zona, status, dan aksi yang didukung. Objek dekoratif tidak perlu memiliki handler interaksi.

## 17. Standar performa dan aksesibilitas

- Desktop: target awal 60 FPS pada perangkat menengah, dengan fallback kualitas.
- Mobile: target awal 30 FPS stabil pada perangkat menengah; uji perangkat kelas rendah secara terpisah.
- Target ini adalah sasaran pengujian, bukan hasil benchmark yang sudah dicapai.
- Sediakan quality presets: Low, Balanced, High.
- Low mematikan bayangan mahal, mengurangi partikel, dan memakai model/tekstur ringan.
- Batasi jumlah karakter animasi penuh di luar viewport; gunakan update throttling/LOD.
- Gunakan instancing untuk objek berulang bila cocok.
- Hormati prefers-reduced-motion dan sediakan kontrol kamera yang tidak memerlukan hover.
- Semua lantai harus bisa dipilih melalui UI alternatif, bukan hanya target 3D kecil.
- Sediakan fallback 2D/list view jika WebGL tidak tersedia atau perangkat terlalu berat.
- Pastikan kontrol dapat digunakan dengan sentuhan, keyboard, dan screen reader pada elemen UI.

## 18. Asset register — template wajib

Setiap aset eksternal yang akan masuk repository harus memiliki catatan minimal:

| Field | Keterangan |
|---|---|
| Asset ID | ID unik dan stabil |
| Nama | Nama aset |
| Creator | Pembuat/pemegang hak |
| Source URL | Halaman aset asli |
| Download date | Tanggal diperoleh |
| License | Lisensi persis dan versi |
| Attribution | Teks atribusi yang diwajibkan |
| Modifications | Perubahan yang dilakukan |
| File path | Lokasi dalam repository |
| Technical notes | Format, ukuran, polycount/texture bila tersedia |
| Approval | Status pemeriksaan lisensi |

Jangan mengunduh aset hanya dari thumbnail. Simpan LICENSE/NOTICE atau bukti lisensi bersama paket bila diizinkan.

## 19. Keputusan arsitektur produksi yang harus dipertahankan

- Backend adalah sumber kebenaran untuk agent, task, meeting, A2A, izin, dan lokasi aktivitas.
- 3D renderer hanya mengonsumsi state/event dan menampilkannya.
- Renderer tidak memanggil LLM hanya untuk membuat animasi terlihat hidup.
- Aktivitas visual idle tidak boleh menggunakan token/model.
- Event penting harus dapat diputar ulang atau diaudit.
- Jika koneksi terputus, UI menampilkan data terakhir beserta indikator stale/offline.
- Sistem visual tidak boleh menjadi dependency yang menghambat task engine atau komunikasi agent.
- Simulasi demo harus terisolasi dari data produksi dan diberi label jelas.

## 20. Gerbang penerimaan Tahap 1

Tahap 1 baru boleh ditutup setelah:
- [x] Referensi produk dan pembanding teknis awal dicatat.
- [x] Prinsip real agent vs demo ditetapkan.
- [x] Arah visual dan konsep gedung ditetapkan sebagai baseline.
- [x] Struktur lantai dan mode kamera ditulis.
- [x] Status agent dan pemetaan aktivitas visual didefinisikan.
- [x] Prinsip A2A, deliverable, audit, dan approval dirumuskan.
- [x] Standar aset dan aturan lisensi ditetapkan.
- [x] Sasaran performa mobile dan desktop ditulis sebagai target pengujian.
- [ ] Kurasi moodboard final (gambar terpilih per kategori) selesai.
- [ ] Pemilik proyek menyetujui palet, proporsi, style karakter, dan kepadatan detail.
- [ ] Asset register diisi untuk setiap aset eksternal yang benar-benar dipilih.

**Status Tahap 1: MATANG SECARA SPESIFIKASI, MENUNGGU PERSETUJUAN MOODBOARD DAN ASET.** Belum boleh dianggap selesai penuh sebelum tiga item terakhir disetujui/dilengkapi.

## 21. Referensi tambahan yang ditinjau

- Staffroom: https://github.com/staffroom-ai/staffroom — role-based agents, task routing, deliverables, MCP tools, approval, run log, Apache-2.0.
- Atlassian Roving Office: https://github.com/atlassian-labs/roving-office — visualisasi live agent sessions dan pemisahan demo/real; Apache-2.0 untuk kode dengan pengecualian merek/aset pihak ketiga yang dijelaskan di NOTICE.
- Hermes Virtual Office: https://github.com/dian003/virtual-office — low-poly multi-floor office, A2A meetings, state machine, navigation dan audit transcript; MIT menurut repository.
- AI Office: https://github.com/Bogdusik/AI-Office — backend state sebagai sumber gerakan agent, workflow task dan review; MIT menurut repository.
- Kenney license FAQ: https://kenney.nl/support — aset pada halaman asset Kenney dinyatakan CC0; cek paket yang diunduh.
- Poly Pizza: https://poly.pizza/ — lisensi harus diperiksa pada halaman setiap model, jangan diasumsikan seragam.
