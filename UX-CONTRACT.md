# Kontrak UX Math Practice

## Ruang guru dan hasil latihan

- Halaman `guru.html` menggunakan sesi guru berumur 30 menit dari Apps Script. Password tidak disimpan di browser; token hanya berada di memori halaman dan hilang saat halaman ditutup atau dimuat ulang.
- Daftar hasil dapat difilter berdasarkan `exercise_id`, kelas, dan waktu pencatatan (semua waktu, 24 jam, 7 hari, atau 30 hari terakhir), diurutkan dengan nilai terbesar lebih dulu, dan waktu seri terbaru lebih dulu. Filter aktif disimpan pada parameter URL `exercise`, `class`, `period`, dan `best=1`.
- Opsi latihan dikelompokkan mengikuti urutan kartu yang tampak di beranda: Kecepatan Berhitung, Pecahan, Aljabar, Barisan dan Deret, lalu Eksponen. Kartu di dalam setiap kelompok mengikuti urutan beranda.
- Filter “nilai tertinggi tiap siswa per latihan” hanya mengubah tampilan. Ia mempertahankan satu hasil per kombinasi `exercise_id` dan `student_id`, memilih skor tertinggi dan timestamp terbaru saat skor sama. Filter kelas diterapkan sebelum pemilihan nilai terbaik.
- Penghapusan satu hasil memakai dialog yang menamai siswa, latihan, dan nilai. Penghapusan latihan tertentu dan seluruh nilai membutuhkan frasa `HAPUS` yang diketik. Dialog tetap terbuka ketika server menolak tindakan.
- Deduplikasi berlaku hanya untuk latihan terpilih, dikelompokkan dengan `student_id`, menyisakan nilai terbesar; saat nilai sama, timestamp paling baru dipertahankan. Server menentukan baris yang dihapus.
- Operasi daftar dan mutasi guru berjalan di Apps Script. Mutasi dilindungi token sesi dan `ScriptLock`; append nilai siswa tetap menerima payload publik sesuai alur latihan.
- Setelah mutasi berhasil, daftar dimuat ulang dari server. Kegagalan tidak optimistis menghapus baris dari tampilan.

## Kepemilikan komponen

- Filter latihan, kelas, dan waktu menggunakan `<select>` native; popup milik platform dapat diterima untuk filter sederhana.
- Daftar nilai menggunakan tabel HTML semantik, tanpa interaksi seperti spreadsheet.
- Konfirmasi memakai elemen `<dialog>` modal bawaan dengan fokus awal pada tombol Batal; konfirmasi hapus massal memfokuskan field konfirmasi.
- `css/style.css` tetap pemilik token dan baseline scrollbar.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native select filter latihan, kelas, dan waktu | UX-CONTRACT.md | native untuk filter sederhana | keyboard dan popup native |
| Form | Validasi inline halaman guru | UX-CONTRACT.md | login dan konfirmasi tindakan | submit invalid, sukses, dan error |
| Scrollbar | Global `css/style.css` | DESIGN.md | geometri overflow tabel | computed style dan gulir sentuh |
| CRUD | Endpoint server Apps Script dan dialog guru | UX-CONTRACT.md | hapus satu, per latihan, semua, deduplikasi | alur muat, konfirmasi, hasil, dan kegagalan |
