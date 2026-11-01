# Acuan Pengembangan MEX-NEX dari Claude-Office

**Referensi:** https://github.com/W17ant/Claude-Office  
**Keputusan visual:** 2D isometrik pixel art untuk kantor virtual.

## Arah visual yang disetujui

MEX-NEX beralih dari target kantor 3D ke tampilan 2D isometrik pixel art. Gunakan aset original Claude-Office yang tercakup MIT sebagai basis visual dan sesuaikan tata ruang, identitas, warna, signage, serta departemen agar menjadi kantor MEX-NEX sendiri.

## Batas lisensi

Hanya gunakan aset original yang dinyatakan tercakup MIT di NOTICE upstream. Jangan salin aset dari public/sprites/office/characters/, public/sprites/office/props/, karakter The Office, logo Dunder Mifflin, nama, kutipan, atau properti fan-art. Salinan LICENSE dan NOTICE dipertahankan di public/office-assets/claude-office/.

## Prinsip integrasi

1. Backend MEX-NEX tetap menjadi sumber kebenaran untuk Agent, task, permission, chat, dan incident.
2. Renderer hanya menampilkan state/event yang diterima; jangan mengarang aktivitas runtime.
3. Setiap sprite Agent dipetakan ke ID Agent yang stabil dari backend.
4. Klik Agent harus membuka profil, chat, task, tools, log, dan hasil kerja Agent yang tepat.
5. Task board, approval, dan incident panel harus terhubung ke API/aksi backend, bukan sekadar dekorasi.
6. Pertahankan database, API, Task Engine, runtime Agent, autentikasi/otorisasi, dan realtime backend yang ada.
7. Preview visual dibuat di route terpisah. Jangan mengganti /office utama sebelum preview tervalidasi dan diterima.
8. Sprite bawaan dipakai sebagai placeholder visual; identitas dan nama Agent final berasal dari konfigurasi MEX-NEX.

## Tahapan

1. Buat preview visual isometrik dan validasi responsif desktop/mobile.
2. Integrasikan snapshot dan event Agent backend.
3. Hubungkan klik Agent ke inspector dan chat pribadi.
4. Hubungkan task board, permission, dan incident ke sistem yang sudah ada.
5. Uji reconnect, event duplikat/terlambat, Agent offline, task gagal, dan mobile.
6. Setelah validasi, rencanakan penggantian renderer utama dengan fallback yang aman.
