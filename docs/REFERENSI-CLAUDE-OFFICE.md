# Acuan Pengembangan MEX-NEX dari Claude-Office

**Referensi:** https://github.com/W17ant/Claude-Office  
**Diperiksa:** 1 November 2026  
**Tujuan:** mengambil pelajaran desain interaksi dan sistem simulasi kantor Agent, bukan menyalin identitas visual atau aset.

## 1. Ringkasan referensi

Claude-Office adalah aplikasi kantor virtual pixel-art isometrik untuk memvisualisasikan aktivitas AI Agent secara real-time. Repository menggunakan React + Vite untuk UI, Express + WebSocket untuk event server, dan SQLite untuk sebagian penyimpanan. Integrasi Claude Code mengirim event melalui hooks/status line; frontend memperlihatkan sesi, karakter, status, percakapan, task, permission, dan incident.

## 2. Hal yang diadaptasi ke MEX-NEX

| Area | Pola yang terlihat di referensi | Adaptasi MEX-NEX |
|---|---|---|
| Peta kantor | Satu scene kantor isometrik yang mudah dipahami | Satu interior 3D besar, semua departemen tersambung dan terlihat |
| Karakter | Sprite berbeda untuk tipe/identitas Agent | Model karakter 3D original dengan identitas, outfit, dan skala konsisten |
| Aktivitas | Agent masuk, bekerja, istirahat, dan berpindah | State machine Agent menggerakkan animasi sesuai event backend |
| Status visual | Bubble aktivitas dan indikator status | Label nama, status, task aktif, dan indikator butuh keputusan |
| Inspector | Klik karakter untuk melihat detail sesi dan aktivitas | Klik Agent membuka profil, chat pribadi, task, tools, log, dan hasil kerja |
| Task board | Kartu task bergerak To do → In progress → Done | Papan tugas terhubung ke Task Engine MEX-NEX sebagai sumber data |
| Permission | Permintaan persetujuan ditampilkan dan dijawab dari UI | Approval center dengan aksi yang benar-benar terhubung ke backend |
| Incident | Kegagalan deploy/test mengubah status visual kantor | Incident panel dan visual alert dari event sistem yang tervalidasi |
| Realtime | Event server mendorong perubahan ke UI | Realtime backend MEX-NEX; Vercel hanya untuk frontend/API yang sesuai |
| Persistence | Chat dan data tertentu disimpan SQLite | Gunakan database persisten MEX-NEX yang sudah ditetapkan; jangan menambah sumber kebenaran kedua |

## 3. Arah visual MEX-NEX

MEX-NEX **tetap menggunakan interior 3D**, bukan menyalin gaya pixel-art Claude-Office.

- Satu lantai interior kantor besar; seluruh area berada di dalam ruangan.
- Kamera isometrik/three-quarter dengan kontrol pan dan zoom.
- Area kerja dibagi melalui partisi kaca, panel akustik, signage, pencahayaan, dan tata furnitur.
- Karakter 3D original berada pada workstation dan ruang sesuai aktivitas backend.
- Tambahkan animasi idle, berjalan, mengetik, berbicara, rapat, menunggu, dan istirahat.
- Status dan bubble harus ringkas agar tidak menutupi scene.
- Panel detail, chat, task board, permission, dan incident menjadi lapisan UI di sekitar scene; bukan teks dekoratif di dalam dunia 3D.
- Interior harus menjadi fokus penuh. Jangan menambahkan kota, jalan, halaman, gedung tetangga, atau lanskap luar.

## 4. Prinsip integrasi teknis

1. Backend MEX-NEX tetap menjadi sumber kebenaran untuk Agent, task, permission, chat, dan incident.
2. Scene 3D hanya merender state/event yang diterima; jangan membuat aktivitas acak yang seolah-olah nyata.
3. Setiap Agent memiliki identitas stabil dan mapping ke profil/runtime Agent.
4. Gunakan event bertimestamp dan state transition eksplisit untuk menggerakkan animasi.
5. Reconnect WebSocket harus memulihkan snapshot terbaru sebelum melanjutkan event stream.
6. Klik karakter harus memakai ID Agent yang sama dengan API/backend.
7. Jangan port seluruh aplikasi Claude-Office secara langsung: stack, model data, deployment, dan kebutuhan MEX-NEX berbeda.
8. Pertahankan route, API, autentikasi/otorisasi, Task Engine, database, dan runtime yang sudah ada.

## 5. Batas penggunaan aset dan lisensi

Repository Claude-Office menyatakan lisensi MIT untuk perangkat lunaknya. Jika suatu saat potongan kode benar-benar diport, sertakan copyright dan teks lisensi sesuai ketentuan MIT serta audit dependensi.

Namun, jangan menganggap semua gambar di repository otomatis aman untuk dipakai ulang hanya karena repository memiliki LICENSE MIT. Hindari memakai sprite karakter, gambar fan-art The Office, logo, nama, atau properti berhak cipta sebagai aset MEX-NEX. Buat aset karakter dan interior MEX-NEX yang original atau gunakan aset 3D dengan lisensi yang diverifikasi.

## 6. Urutan implementasi yang disarankan

1. Audit event model Agent dan task di backend MEX-NEX.
2. Definisikan kontrak event/snapshot untuk status Agent, task, permission, chat, dan incident.
3. Bangun registry Agent di scene yang terhubung ke ID backend.
4. Tambahkan model karakter 3D original dan animasi berbasis state.
5. Hubungkan inspector Agent, chat, dan task board ke data nyata.
6. Hubungkan approval dan incident UI ke aksi backend yang diotorisasi.
7. Uji reconnect, event berurutan/duplikat, Agent offline, task gagal, dan layar mobile.
8. Validasi hasil build dan route preview sebelum mengubah route utama /office.

## 7. Kriteria penerimaan

- Agent yang terlihat di kantor cocok dengan Agent aktif di backend.
- Perubahan status backend mengubah pose/animasi tanpa reload.
- Klik Agent membuka detail Agent yang benar.
- Task board menampilkan task backend, bukan data contoh.
- Permission tidak dapat disetujui hanya dengan animasi atau tombol palsu.
- Tidak ada aktivitas acak yang diklaim sebagai aktivitas runtime.
- Seluruh scene tetap interior-only dan berfungsi pada desktop serta layar mobile.
