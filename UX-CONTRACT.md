# Kontrak UX Math Practice

## Ruang guru dan hasil latihan

- Halaman `guru.html` menggunakan sesi guru berumur 30 menit dari Apps Script. Password tidak disimpan di browser; token hanya berada di memori halaman dan hilang saat halaman ditutup atau dimuat ulang.
- Daftar hasil dapat difilter berdasarkan `exercise_id`, kelas, dan waktu pencatatan (semua waktu, 24 jam, 7 hari, atau 30 hari terakhir), diurutkan dengan nilai terbesar lebih dulu, dan waktu seri terbaru lebih dulu. Filter aktif disimpan pada parameter URL `exercise`, `class`, `period`, dan `best=1`.
- Opsi latihan dikelompokkan mengikuti urutan kartu yang tampak di beranda: Kecepatan Berhitung, Pecahan, Aljabar, Barisan dan Deret, lalu Eksponen. Kartu di dalam setiap kelompok mengikuti urutan beranda; kelompok Barisan dan Deret mencakup Barisan Dasar, Suku ke-n Aritmetika, dan Barisan Aritmetika Lanjutan.
- Filter “nilai tertinggi tiap siswa per latihan” hanya mengubah tampilan. Ia mempertahankan satu hasil per kombinasi `exercise_id` dan `student_id`, memilih skor tertinggi dan timestamp terbaru saat skor sama. Filter kelas diterapkan sebelum pemilihan nilai terbaik.
- Penghapusan satu hasil memakai dialog yang menamai siswa, latihan, dan nilai. Penghapusan latihan tertentu dan seluruh nilai membutuhkan frasa `HAPUS` yang diketik. Dialog tetap terbuka ketika server menolak tindakan.
- Deduplikasi berlaku hanya untuk latihan terpilih, dikelompokkan dengan `student_id`, menyisakan nilai terbesar; saat nilai sama, timestamp paling baru dipertahankan. Server menentukan baris yang dihapus.
- Operasi daftar dan mutasi guru berjalan di Apps Script. Mutasi dilindungi token sesi dan `ScriptLock`; append nilai siswa tetap menerima payload publik sesuai alur latihan.
- Setelah mutasi berhasil, daftar dimuat ulang dari server. Kegagalan tidak optimistis menghapus baris dari tampilan.
- Tombol navbar membuka dialog modal rekor pribadi untuk identitas siswa yang tersimpan pada perangkat. Satu rekor tertinggi ditampilkan untuk setiap `exercise_id`; saat skor sama, timestamp terbaru dipakai. Kelompok dan urutan latihannya mengikuti katalog di beranda: Kecepatan Berhitung, Pecahan, Aljabar, Barisan dan Deret, lalu Eksponen; urutan kartu dipertahankan di tiap kelompok. Kelompok Barisan dan Deret mencakup Barisan Dasar, Suku ke-n Aritmetika, dan Barisan Aritmetika Lanjutan. Dialog menyediakan keadaan memuat, kosong, gagal, muat ulang, dan tautan identitas bila belum ada siswa tersimpan.
- Identitas siswa di `localStorage` belum merupakan autentikasi server. Endpoint `student_records` mengikuti batas keamanan MVP yang sama dengan endpoint pencarian siswa; jangan tampilkan data sensitif melalui endpoint publik ini.
- Hasil empat latihan kategori Kecepatan Berhitung menampilkan 10 siswa teratas pada kelas aktif. Apps Script menentukan kelas dari data `Students`, mempertahankan skor tertinggi per siswa untuk latihan itu, lalu mengurutkan skor menurun dan waktu pencapaian menaik sebelum mengambil 10 baris. ID siswa tidak ditampilkan.
- Pada hasil latihan, bagian tinjauan jawaban dan papan skor memakai `<details>/<summary>` native dan tertutup secara default. Keduanya berbagi gaya judul dan indikator buka/tutup yang konsisten, dengan transisi tinggi dan opacity saat dibuka/ditutup; animasi dinonaktifkan saat preferensi `prefers-reduced-motion` aktif. Isi dan kontrol muat ulang papan skor tersedia setelah dibuka.

## Kepemilikan komponen

- Filter latihan, kelas, dan waktu menggunakan `<select>` native; popup milik platform dapat diterima untuk filter sederhana.
- Daftar nilai menggunakan tabel HTML semantik, tanpa interaksi seperti spreadsheet.
- Konfirmasi memakai elemen `<dialog>` modal bawaan dengan fokus awal pada tombol Batal; konfirmasi hapus massal memfokuskan field konfirmasi.
- `css/style.css` tetap pemilik token dan baseline scrollbar.
- Dialog rekor pribadi memakai `<dialog>` modal native, dapat ditutup dengan tombol Tutup, Escape, atau backdrop, dan mengembalikan fokus ke tombol navbar. Daftar memakai list semantik dan status pemuatan melalui live region; setiap item memuat nama latihan, skor, dan tanggal hasil terbaik.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native select filter latihan, kelas, dan waktu | UX-CONTRACT.md | native untuk filter sederhana | keyboard dan popup native |
| Form | Validasi inline halaman guru | UX-CONTRACT.md | login dan konfirmasi tindakan | submit invalid, sukses, dan error |
| Scrollbar | Global `css/style.css` | DESIGN.md | geometri overflow tabel | computed style dan gulir sentuh |
| CRUD | Endpoint server Apps Script dan dialog guru | UX-CONTRACT.md | hapus satu, per latihan, semua, deduplikasi | alur muat, konfirmasi, hasil, dan kegagalan |
| Personal records | Dialog native `index.html`/`js/home.js` + aksi baca Apps Script `student_records` | UX-CONTRACT.md | satu rekor terbaik per latihan untuk identitas tersimpan | buka/tutup, fokus, kosong, sukses, gagal, muat ulang, responsif |
