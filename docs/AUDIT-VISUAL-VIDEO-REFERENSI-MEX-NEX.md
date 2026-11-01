# Audit Visual Living HQ Berdasarkan Video Referensi Utama

Tanggal audit: 1 November 2026

## Hierarki referensi

1. **Video yang diberikan pemilik MEX-NEX** adalah sumber kebenaran visual utama.
2. Claude Office hanya referensi sekunder untuk pola interaksi atau ide fitur yang cocok.
3. Seluruh aset MEX-NEX dibuat atau dilisensikan secara terpisah. Video digunakan untuk observasi visual, bukan untuk mengklaim kepemilikan aset sumber.

## Temuan dari video

Video berdurasi sekitar 68 detik direkam dari layar perangkat. Frame yang dapat diamati menunjukkan lingkungan kantor 3D isometrik dengan sudut pandang tinggi, lantai kayu hangat, fasad kaca tinggi, ruang terbuka yang terhubung, furnitur berskala konsisten, serta karakter manusia kecil dengan label aktivitas.

Area yang terlihat jelas:
- Ruang rapat dengan meja panjang dan beberapa karakter.
- Area kerja terbuka dengan workstation dan layar komputer.
- Studio produksi konten dengan layar/monitor besar dan perlengkapan produksi.
- Area lounge dengan sofa, meja rendah, tanaman, dan pencahayaan dekoratif.
- Area fasilitas luar/rekreasi dengan kolam renang, deck kayu, kursi santai, dan tanaman.
- Area/divisi yang dapat ditambah atau diatur; perubahan tata ruang terlihat sebagai bagian dari pengelolaan kantor.
- Label aktivitas/percakapan Agent yang membuat simulasi terasa operasional.

## Karakter visual yang wajib dikejar

- Isometric 3D miniature diorama; bukan pixel art.
- Kamera tinggi tiga-perempat yang memperlihatkan denah dan tinggi furnitur sekaligus.
- Lantai kayu hangat dengan variasi material antar-zona.
- Dinding kaca besar, mullion/frame gelap, partisi transparan, dan batas ruang yang terbaca.
- Interior padat namun teratur: meja, monitor, kursi, sofa, rak, tanaman, lampu, dekorasi, dan peralatan khusus divisi.
- Zona punya identitas visual sendiri, bukan pengulangan layout generik.
- Pencahayaan lembut, bayangan kontak, refleksi kaca yang terkendali, dan ambient occlusion.
- Karakter manusia dengan skala konsisten, idle/work/talk/walk, serta status yang ditautkan ke data backend.

## Kesenjangan implementasi saat audit

- Gedung dan interior saat ini masih dominan geometri kotak prosedural.
- Furnitur GLB sudah digunakan, tetapi belum membentuk satu interior dengan kepadatan, komposisi, dan kualitas material seperti video.
- Denah lantai belum memiliki zoning yang kuat dan unik.
- Studio konten dan kolam renang belum tersedia sebagai zona yang jelas.
- Struktur fasad dan partisi kaca belum cukup menyampaikan karakter ruang terbuka video.
- Belum ada sistem visual Agent yang tervalidasi terhubung ke state backend pada Living HQ.

## Pekerjaan awal yang sudah dimulai

- Menambahkan zona studio konten pada lantai 3 sebagai fondasi layout produksi.
- Menambahkan kolam renang rooftop dengan deck, tepi kolam, kursi santai, sofa, meja, dan tanaman.
- Membersihkan literal newline yang tidak semestinya berada di JSX interior.
- Mempertahankan komponen world model, navigasi lantai, renderer, dan backend yang sudah ada.

## Tahapan redesign berikutnya

1. **Zoning & composition:** tentukan denah tiap lantai, jalur sirkulasi, batas kaca, dan titik fokus.
2. **Architectural kit:** buat modular wall, glass partition, window frame, railing, stairs/elevator, floor trim, dan pintu.
3. **Department kits:** workspace, meeting, content studio, operations/server, executive, lounge/pantry, recreation/pool.
4. **Asset quality:** evaluasi ukuran/orientasi GLB; tambah aset asli yang konsisten, bukan menumpuk primitive.
5. **Agent presentation:** avatar, nameplate, task/status bubble, workstation association, dan animasi yang bersumber dari backend.
6. **Lighting & camera:** material tuning, shadow, ambient occlusion, framing isometrik, dan mobile LOD.
7. **Validation:** screenshot per lantai, browser desktop/mobile, WebGL fallback, build/lint/typecheck/test, dan deployment check.

## Acceptance criteria visual

- Building View memiliki siluet dan komposisi diorama yang kuat, bukan sekadar tumpukan slab.
- Floor View menampilkan satu layout lengkap dengan area yang mudah dikenali.
- Setiap lantai memiliki fungsi dan komposisi berbeda.
- Studio konten dapat dikenali dari perangkat produksinya.
- Kolam dan area rekreasi tampak sebagai fasilitas yang dirancang, bukan balok biru.
- Material kaca, kayu, lantai, metal, kain, dan air memiliki respons cahaya berbeda.
- Tidak ada furnitur yang melayang, saling menembus, salah skala, atau terpotong.
- Agent hanya menampilkan aktivitas yang memiliki state backend valid.
- Perubahan visual tidak memutus route kantor, navigasi lantai, API, atau sistem Agent.

## Status

Audit referensi video selesai. Implementasi studio dan kolam baru merupakan pass awal berbasis geometri; belum setara dengan referensi dan belum dinyatakan lulus visual QA. Build, lint, dan pemeriksaan browser setelah perubahan ini masih harus dijalankan.
