# Peningkatan Visual Interior Living HQ — Pemanfaatan Model 3D

## Tujuan

Meningkatkan kualitas visual kantor dengan berhenti menggambar semua furnitur utama sebagai primitive `boxGeometry`. Model GLB yang sudah tersedia di `public/office-assets/models/furniture/` sekarang dipakai sebagai aset render untuk furnitur yang paling mudah dikenali.

## Perubahan implementasi

- Komponen reusable `OfficeFurnitureModel.tsx` memuat GLB melalui `useGLTF`, membuat clone per instance, dan mengaktifkan cast/receive shadow pada mesh.
- Workstation memakai model meja, monitor, dan kursi kantor.
- Ruang rapat memakai model meja dan kursi, bukan meja/kursi kotak.
- Area lounge memakai sofa, kursi lounge, dan meja kopi model 3D.
- Area pantry memakai kabinet, mesin kopi, dan kulkas model 3D.
- Rak buku dan tanaman memakai model 3D.
- Server rack, core lift/tangga, signage, dan beberapa struktur ruangan tetap procedural karena merupakan elemen arsitektur/infra khusus.
- Model dimuat secara lazy dengan `Suspense` per aset agar loading satu model tidak menahan seluruh interior.

## Aset yang dipakai

`bookcaseClosed.glb`, `chairDesk.glb`, `computerScreen.glb`, `desk.glb`, `kitchenCabinet.glb`, `kitchenCoffeeMachine.glb`, `kitchenFridgeSmall.glb`, `lampRoundFloor.glb`, `loungeDesignChair.glb`, `loungeSofa.glb`, `pottedPlant.glb`, `table.glb`, dan `tableCoffee.glb`.

## Batasan yang masih terbuka

- Ini peningkatan pass interior, belum penggantian seluruh aset arsitektur.
- Background kampus masih first-pass low-poly; perlu aset lingkungan yang lebih kaya dan visual QA.
- Perlu audit sumber dan lisensi setiap GLB sebelum distribusi publik/komersial; keberadaan file di repo bukan bukti lisensi.
- Belum dilakukan pemeriksaan visual browser/iPhone setelah perubahan ini.
- Penempatan, skala, orientasi, dan kemungkinan clipping harus diperiksa dari screenshot aktual setiap lantai.

## Validasi teknis

- ESLint untuk `OfficeFurnitureModel.tsx` dan `OfficeInteriors.tsx`.
- Production build Next.js.
- Hasil validasi teknis lokal lulus pada commit kerja; visual QA perangkat nyata tetap pekerjaan terpisah.
