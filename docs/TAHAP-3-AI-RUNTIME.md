# Tahap 3 — AI Runtime dan Autonomous Agent Engine

## Ringkasan
Tahap ini menambahkan adapter runtime berbasis API chat completions yang kompatibel dengan OpenAI. Provider dipilih melalui environment variable dan rahasia tidak pernah dikirim ke browser.

## Provider
- `AI_PROVIDER=hermes`: Hermes Agent atau gateway Hermes yang menyediakan endpoint `/v1/chat/completions`.
- `AI_PROVIDER=local`: model lokal dengan API kompatibel OpenAI, misalnya Ollama.
- `AI_PROVIDER=external`: provider eksternal kompatibel OpenAI.

Konfigurasi lengkap ada di `.env.example`. Salin ke `.env.local`, isi endpoint, nama model, dan API key yang sesuai. Jangan commit `.env.local`.

## Kemampuan
- Status runtime: `GET /api/ai` hanya mengembalikan metadata aman, tidak mengembalikan API key.
- Chat pribadi Agent: `POST /api/ai` dengan `action=chat`, `agentId`, `message`, dan opsional `conversationId`.
- Delegasi otomatis: `POST /api/ai` dengan `action=dispatch` dan `message`.
- AI Manager menyusun rencana JSON maksimal lima pekerjaan dan memilih Agent dari roster yang tersedia.
- Agent mengerjakan setiap pekerjaan secara berurutan melalui model yang dikonfigurasi.
- Riwayat chat dan hasil delegasi disimpan di `.data/ai-sessions.json`.

## Kontrak provider
Request dikirim ke `{BASE_URL}/v1/chat/completions` dengan `model`, `messages`, dan `temperature`. API key opsional dan dikirim hanya dari server sebagai Bearer token.

## Batas keselamatan dan otonomi
Tahap ini menjalankan perencanaan dan generasi jawaban model. Agent belum mendapat tool terminal, shell, browser, akses file, atau kemampuan mengirim tindakan eksternal. Dengan demikian, "otonomi" saat ini berarti AI Manager dapat merencanakan dan mengorkestrasi respons Agent, bukan menjalankan tindakan dunia nyata tanpa batas. Integrasi tool membutuhkan izin granular, audit log, batas biaya, dan mekanisme penghentian pada tahap lanjutan.

## Menjalankan
1. Salin `.env.example` menjadi `.env.local`.
2. Pilih provider dan isi endpoint serta model.
3. Isi API key jika provider mewajibkannya.
4. Jalankan ulang `npm run local`.
5. Buka menu **AI Runtime** dan periksa status koneksi.
6. Uji chat satu Agent, lalu uji AI Manager delegasi otomatis.

## Diagnostik
- `503`: konfigurasi provider belum lengkap.
- `502`: endpoint tidak terjangkau, API key salah, model tidak tersedia, atau respons provider tidak sesuai.
- Pastikan server model lokal aktif dan alamat `127.0.0.1` merujuk ke perangkat yang menjalankan MEX-NEX.
