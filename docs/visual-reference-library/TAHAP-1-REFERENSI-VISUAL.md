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
