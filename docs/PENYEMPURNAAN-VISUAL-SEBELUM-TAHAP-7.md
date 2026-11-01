# Penyempurnaan Visual Living HQ sebelum Tahap 7

## Cakupan
Feedback pengguna: props masih kurang dan terlalu repetitif, belum ada background/lingkungan, dan gedung tampak terlalu kecil.

## Perubahan
- Menambahkan `LivingHQEnvironment.tsx`: ground campus, jalan depan, marka jalan, blok gedung kota di kejauhan, pepohonan low-poly, dan lampu jalan.
- Mengintegrasikan environment ke scene layer `environment`.
- Memperbesar skala visual gedung dan interior secara seragam menjadi 1.15 agar furnitur tetap sejajar dengan shell.
- Menyesuaikan zoom awal Building View dari 11 menjadi 12.5; rentang zoom maksimum menjadi 28.
- Menambah variasi props interior: sofa, rak buku, coffee station, dan kombinasi warna/penempatan yang berbeda per lantai. Reuse komponen dilakukan secara terbatas agar konsistensi aset terjaga tanpa membuat setiap lantai tampak identik.

## Validasi
- ESLint untuk environment, experience, dan interior: lulus.
- Production build: lulus.
- Uji visual langsung pada iPhone dan verifikasi deployment: belum dilakukan.

## Batasan
Background merupakan lingkungan kampus/kota low-poly prosedural, bukan lanskap kota final. Props masih berupa geometri procedural, belum aset final ber-detail tinggi. Ini merupakan polish pass sebelum Tahap 7.
