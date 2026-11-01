# MEX-NEX Living HQ — Art Direction 2.5D

**Status:** keputusan produksi visual, 1 November 2026 — revisi konsep single-floor  
**Target:** browser desktop + Safari iPhone  
**Renderer:** Phaser 3 sebagai compositor/interaksi 2.5D  
**Visual reference utama:** video kantor isometrik yang diberikan pemilik proyek. Dokumen visual library lama hanya referensi teknis tambahan.

## 1. Keputusan visual

MEX-NEX tidak memakai pixel-art, flat vector, low-detail polygon, atau primitive geometry sebagai tampilan final.

Target adalah **isometric architectural diorama**: kantor modern-futuristic yang tampak seperti miniatur 3D berkualitas tinggi, dilihat dari kamera orthographic tiga-perempat dari atas. Implementasi runtime boleh 2.5D, tetapi gambar akhirnya harus mempertahankan volume, material, pencahayaan, bayangan, refleksi, dan kepadatan detail dari referensi.

Phaser hanya mengatur layer, depth sorting, camera, hit-area, animasi sprite, dan interaksi. Phaser tidak boleh menggambar gedung/furnitur final menggunakan Graphics primitives.

## 2. Ciri visual wajib

- Kamera orthographic/isometric tetap; sudut tinggi tiga-perempat, bukan tampak samping datar.
- Satu lantai kantor besar bergaya cutaway/open-side. Semua departemen, ruang rapat, studio, lounge, pantry, dan area kerja terlihat bersamaan dalam satu komposisi. Tidak ada tumpukan enam lantai pada visual utama.
- Arsitektur modern: rangka metal gelap, panel kaca besar, mullion tipis, pintu kaca, balkon/railing, slab lantai yang tebal dan terbaca.
- Interior padat namun tertata: workstation lengkap, monitor, keyboard, kursi, meja rapat, sofa, rak, lampu, tanaman, perangkat teknis.
- Material memiliki respons visual berbeda: kayu ber-grain, kaca reflektif/transparan, metal, kain, beton, dedaunan, air.
- Lighting lembut dan konsisten: ambient occlusion, contact shadow, soft cast shadow, highlight kaca, warm interior light.
- Agent human bergaya stylized 3D/chibi-modern yang proporsional konsisten, bukan lingkaran atau placeholder.
- UI label berada di atas world layer dan tidak menjadi bagian dari sprite arsitektur.
- Palet warm wood/cream dengan aksen departemen yang terkontrol. Hindari bidang kosong besar tanpa alasan komposisi.

## 3. Hal yang dilarang pada final

- Menggambar kantor dengan polygon, balok, lingkaran, atau garis Phaser sebagai pengganti aset.
- Lantai kosong dengan beberapa objek simbolik.
- Dinding kaca yang hanya berupa balok warna cyan.
- Karakter berupa lingkaran, kotak, atau ikon.
- Mengklaim visual sudah sesuai hanya karena route berhasil dibuka atau build berstatus READY.
- Menghubungkan aktivitas palsu ke status Agent nyata.

Graphics primitives hanya boleh dipakai untuk debug grid, collision, selection outline, dan gizmo developer; semuanya harus dapat dimatikan.

## 4. Pipeline aset yang dipilih

Gunakan **3D source asset → render orthographic → transparent PNG sprite**. Phaser menampilkan hasil render sebagai sprite, bukan membangun geometri objek.

Sumber aset:
1. Model orisinal MEX-NEX untuk gedung, modul kaca, signage, karakter, dan ruang identitas.
2. Model pihak ketiga hanya bila lisensi per-file terverifikasi dan dicatat.
3. Existing GLB furniture di `public/office-assets/models/furniture` harus diaudit sumber/lisensinya sebelum dipakai ulang dalam render final.

Output produksi:
- Setiap aset utama menjadi file PNG terpisah dengan alpha transparency dan soft shadow.
- Atlas hanya dibuat sebagai optimasi build; sumber individual tetap disimpan.
- Building cutaway dirender per lantai/layer agar lantai dapat dipilih.
- Interior floor scene dirender per ruangan atau modul agar kamera dapat masuk tanpa kehilangan detail.
- Agent memiliki sprite sheet terpisah untuk idle, walk, work, talk, meeting; arah gerak minimal empat arah yang diperlukan oleh kamera.
- Semua aset memiliki manifest: ID, ukuran, anchor, footprint, depth rule, source, license, hash/version.

## 5. Komposisi gedung

Building View:
- Seluruh enam level terlihat sekaligus sebagai satu diorama cutaway.
- Tiap lantai punya slab, fasad kaca, rangka, interior yang terlihat, furniture, lampu, dan identitas zona.
- Tangga/lift menghubungkan level secara visual.
- Rooftop memiliki garden/lounge/pool sesuai layout final.
- Tap lantai memilih level; kamera transisi ke Floor View.

Floor View:
- Satu lantai mengisi area pandang, dengan batas ruangan dan sirkulasi terbaca.
- Dinding sisi kamera disembunyikan/cutaway, bukan menghalangi ruangan.
- Furnitur tidak boleh sekadar ikon; harus punya volume dan bayangan.
- Agent ditempatkan di workstation/meeting room berdasarkan data runtime.

## 6. Target mobile

- Layout responsif 9:16 dan landscape.
- Building View harus muat di layar iPhone tanpa horizontal scroll.
- Gunakan resolution tiers untuk mengurangi ukuran tekstur, bukan menghapus bentuk penting.
- Sprite atlas dipecah per lantai/area untuk menghindari satu tekstur raksasa.
- Interaksi utama melalui tap; hover bukan syarat.
- Uji Safari iOS pada perangkat nyata sebelum menyatakan siap.

## 7. Acceptance gate visual

Sebuah build tidak boleh disebut visual milestone selesai kecuali:
- [ ] Building View menampilkan enam lantai dengan fasad kaca, interior dan furniture detail.
- [ ] Floor View menampilkan satu lantai yang penuh dan meyakinkan, bukan platform kosong.
- [ ] Material kayu/kaca/metal/kain/air dapat dibedakan secara visual.
- [ ] Ada soft shadows dan pencahayaan konsisten.
- [ ] Agent human sprite terlihat proporsional dan punya animasi dasar.
- [ ] Tidak ada placeholder primitive yang terlihat pada final.
- [ ] Komposisi dan kepadatan detail dibandingkan berdampingan dengan video referensi.
- [ ] Building/Floor navigation berfungsi pada iPhone.
- [ ] Tidak ada klaim pengujian perangkat yang belum dilakukan.

## 8. Tahapan produksi yang benar

1. **Art benchmark:** satu potongan ruang lengkap (bukan gedung penuh) dengan lantai, dua dinding kaca, pintu, workstation, kursi, monitor, lampu, tanaman, shadow dan satu agent.
2. Review visual benchmark terhadap video referensi. Jangan lanjut membuat semua lantai jika benchmark belum lolos.
3. Bangun kit modular arsitektur dan furniture dari benchmark yang disetujui.
4. Susun satu lantai lengkap sebagai vertical slice.
5. Susun gedung enam level.
6. Tambahkan sprite agent dan animasi.
7. Integrasikan backend event setelah render/layout stabil.
8. Optimasi atlas, mobile resolution, dan performance.

## 9. Hubungan dengan sistem yang sudah ada

- Jangan menghapus Three.js, pixel-office, retro-office, backend, runtime, API, task engine, storage, chat, atau event contract sebagai bagian dari art migration.
- Preview Phaser saat ini adalah placeholder teknis dan **bukan** representasi art direction final.
- Route `/office` tetap dipertahankan sampai vertical slice visual dan integrasi lolos.
- PixelOffice2D adalah sistem pixel-art yang berbeda; jangan menganggapnya sebagai dasar visual untuk target video.
- Renderer hanya menampilkan state dari domain/backend. Tidak membuat event kerja palsu.

