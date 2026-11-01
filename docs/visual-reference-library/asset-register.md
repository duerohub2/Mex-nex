# MEX-NEX — Asset Register

Dokumen ini mencatat aset visual yang benar-benar dipilih untuk digunakan dalam proyek. Aset yang hanya muncul sebagai referensi moodboard tidak otomatis menjadi aset produksi.

## Status awal

- Tahap riset visual: selesai.
- Arah visual disetujui: gedung futuristic, karakter human, interior hybrid.
- Aset pihak ketiga yang telah disetujui untuk diimpor: **belum ada**.
- Aset identitas utama MEX-NEX akan dibuat orisinal.
- Setiap aset eksternal wajib melalui pemeriksaan lisensi per-file sebelum commit.

## Daftar aset

| Asset ID | Nama aset | Creator | Source URL | License | Atribusi | Modifikasi | File path | Status |
|---|---|---|---|---|---|---|---|---|
| — | Belum ada aset eksternal yang dipilih | — | — | — | — | — | — | Belum dipilih |

## Prioritas aset orisinal

| ID | Aset | Prioritas | Catatan produksi |
|---|---|---|---|
| MEX-BLD-001 | Gedung utama futuristic cutaway | P0 | Siluet, fasad, modul lantai, rooftop, signage MEX-NEX |
| MEX-CHR-001 | Base human agent character | P0 | Proporsi, rig, material, dan skeleton konsisten |
| MEX-CHR-002 | Variasi identitas agent | P0 | Wajah, rambut, pakaian, badge, dan palet pembeda |
| MEX-INT-001 | Interior lobby dan reception | P0 | Hybrid modern-futuristic, ramah pengunjung |
| MEX-INT-002 | Workstation dan open workspace | P0 | Furniture fungsional dan titik interaksi |
| MEX-INT-003 | Meeting room | P0 | Meja rapat, kursi peserta, display, dan area presentasi |
| MEX-INT-004 | Research/engineering lab | P1 | Perangkat dan display teknis |
| MEX-INT-005 | Executive suite dan boardroom | P1 | Ruang strategi dengan akses berbasis role |
| MEX-INT-006 | Basement server room | P1 | Rack, power, network, monitoring |
| MEX-INT-007 | Rooftop garden dan lounge | P1 | Tanaman, tempat duduk, jalur sirkulasi |
| MEX-UI-001 | Signage, ikon fasilitas, dan UI world-space | P0 | Identitas konsisten dengan palet MEX-NEX |

## Checklist pemeriksaan aset eksternal

Sebelum sebuah aset diubah menjadi status Approved:
- [ ] Halaman sumber asli ditemukan.
- [ ] Nama creator dan pemegang hak dicatat.
- [ ] Lisensi spesifik aset dibaca dan disimpan.
- [ ] Kewajiban atribusi/share-alike/batas komersial diperiksa.
- [ ] File LICENSE/NOTICE atau bukti lisensi disertakan bila relevan.
- [ ] Ukuran, format, polygon, tekstur, dan dependensi diperiksa.
- [ ] Perubahan yang dilakukan dicatat.
- [ ] Lokasi file dalam repository ditentukan.
- [ ] Aset diuji pada browser desktop dan mobile sebelum dianggap siap produksi.

## Format penamaan

Gunakan pola: `<kategori>-<fungsi>-<varian>-<versi>.<ext>`

Contoh:
- `building-headquarters-cutaway-v001.glb`
- `character-human-agent-base-v001.glb`
- `interior-meeting-room-v001.glb`

Jangan menambahkan aset eksternal yang lisensinya tidak jelas. Jangan menyalin model, tekstur, logo, atau karakter dari proyek referensi hanya karena tersedia di GitHub.
