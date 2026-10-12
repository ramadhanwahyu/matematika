# Kontrak UX Math Practice

## Ruang guru dan hasil latihan

- Halaman `guru.html` menggunakan sesi guru berumur 30 menit dari Apps Script. Password tidak disimpan di browser; token hanya berada di memori halaman dan hilang saat halaman ditutup atau dimuat ulang.
- Daftar hasil disaring berdasarkan `exercise_id`, diurutkan dengan nilai terbesar lebih dulu, dan waktu seri terbaru lebih dulu. Filter aktif disimpan pada parameter URL `exercise`.
- Penghapusan satu hasil memakai dialog yang menamai siswa, latihan, dan nilai. Penghapusan latihan tertentu dan seluruh nilai membutuhkan frasa `HAPUS` yang diketik. Dialog tetap terbuka ketika server menolak tindakan.
- Deduplikasi berlaku hanya untuk latihan terpilih, dikelompokkan dengan `student_id`, menyisakan nilai terbesar; saat nilai sama, timestamp paling baru dipertahankan. Server menentukan baris yang dihapus.
- Operasi daftar dan mutasi guru berjalan di Apps Script. Mutasi dilindungi token sesi dan `ScriptLock`; append nilai siswa tetap menerima payload publik sesuai alur latihan.
- Setelah mutasi berhasil, daftar dimuat ulang dari server. Kegagalan tidak optimistis menghapus baris dari tampilan.

## Kepemilikan komponen

- Select filter menggunakan `<select>` native; popup milik platform dapat diterima untuk satu filter sederhana.
- Daftar nilai menggunakan tabel HTML semantik, tanpa interaksi seperti spreadsheet.
- Konfirmasi memakai elemen `<dialog>` modal bawaan dengan fokus awal pada tombol Batal; konfirmasi hapus massal memfokuskan field konfirmasi.
- `css/style.css` tetap pemilik token dan baseline scrollbar.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native select filter latihan | UX-CONTRACT.md | native untuk filter tunggal | keyboard dan popup native |
| Form | Validasi inline halaman guru | UX-CONTRACT.md | login dan konfirmasi tindakan | submit invalid, sukses, dan error |
| Scrollbar | Global `css/style.css` | DESIGN.md | geometri overflow tabel | computed style dan gulir sentuh |
| CRUD | Endpoint server Apps Script dan dialog guru | UX-CONTRACT.md | hapus satu, per latihan, semua, deduplikasi | alur muat, konfirmasi, hasil, dan kegagalan |
