# Tahap 4 — Agent Execution Engine

## Fitur
- Tool registry dengan daftar tool eksplisit.
- Agent-run: model dapat memilih tool dalam format JSON dan menerima hasilnya, maksimal lima panggilan tool per permintaan.
- Workspace sandbox di `.data/workspace`: daftar, baca, dan tulis file teks.
- Tool utilitas: waktu server, status runtime Node.js, dan kalkulator aritmetika.
- Riwayat pekerjaan dan audit log di folder data lokal.
- UI Eksekusi Agent untuk uji tool dan melihat riwayat.

## Batas keamanan
- Path traversal ditolak; semua operasi file berada di `.data/workspace`.
- Batas baca 200 KB dan tulis 100 KB.
- Tidak ada shell bebas, browser, akses jaringan, pengiriman pesan, atau tindakan eksternal.
- Output tool dimasukkan kembali ke konteks Agent; tool yang tidak terdaftar ditolak.
- Server lokal tanpa login tetap hanya aman untuk penggunaan pribadi pada perangkat sendiri. Jangan bind server ke jaringan publik.

## Cara uji
1. Perbarui source dan jalankan `npm run local`.
2. Buka menu Eksekusi Agent.
3. Uji `workspace.write` dengan path `catatan/uji.txt`.
4. Uji `workspace.read` dan `workspace.list`.
5. Buka AI Runtime, pilih mode **Agent bekerja dengan tool**, lalu beri instruksi membuat catatan di workspace.
6. Periksa audit log.

Data disimpan pada `.data/execution-jobs.json`, `.data/execution-audit.json`, dan `.data/workspace/`.
