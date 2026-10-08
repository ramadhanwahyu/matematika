# Setup Google Sheets dan Google Apps Script

Website statis menggunakan Google Sheets sebagai database akun, sesi, dan nilai latihan. Apps Script memverifikasi kata sandi dan sesi di server; browser tidak mengirim identitas siswa saat menyimpan nilai.

## 1. Siapkan spreadsheet

Buat sheet `Students` dengan header berikut (urutan bebas):

```text
student_id | name | class_name | password_salt | password_hash | active
```

Satu siswa per baris. Isi `student_id`, `name`, dan `class_name`; biarkan `password_salt` serta `password_hash` kosong sampai kata sandi awal dibuat. Isi `active` dengan `TRUE` untuk akun aktif atau `FALSE` untuk menonaktifkannya. Kolom ID sebaiknya berformat **Plain text** dan harus unik.

Sheet lama yang hanya berisi tiga kolom perlu ditambah tiga header baru sebelum memakai endpoint versi ini. Apps Script juga membuat sheet `Sessions` saat login pertama. Jangan hapus kolom atau mengubah header yang diwajibkan.

## 2. Pasang Apps Script dan buat kata sandi sementara

1. Dari spreadsheet, pilih **Extensions > Apps Script**.
2. Ganti isi `Code.gs` dengan [google-apps-script/Code.gs](google-apps-script/Code.gs).
3. Isi `SPREADSHEET_ID` dengan ID dari URL Google Sheets.
4. Simpan. Di editor Apps Script, pilih fungsi `initializeStudentPassword`, lalu tekan **Run** dan berikan izin saat diminta.
5. Dialog meminta ID siswa dan kata sandi sementara minimal 8 karakter. Jalankan sekali untuk setiap siswa dan bagikan kata sandi itu secara pribadi. Fungsi menyimpan salt dan hash, bukan kata sandi biasa.
6. Jika nanti perlu reset kata sandi, jalankan kembali fungsi yang sama untuk akun itu. Minta siswa mengganti kata sandi sementara setelah masuk.

Jangan membagikan akses edit spreadsheet kepada siswa. Jangan memasukkan kata sandi ke sel sheet atau source frontend. Hash memakai HMAC-SHA-256 berulang dengan salt unik; Apps Script membatasi percobaan login hingga lima kegagalan per ID dalam jendela penguncian 15 menit.

## 3. Deploy Web App

Deploy sebagai **Web app**, pilih **Execute as: Me**, dan izinkan akses yang cocok untuk siswa yang tidak masuk ke akun Google (biasanya **Anyone**). Selesaikan otorisasi, salin URL `/exec`, lalu setiap pembaruan Apps Script deploy sebagai versi baru.

Di `js/common.js`, pastikan `appsScriptWebAppUrl` menunjuk URL `/exec` yang baru. Frontend mengirim POST JSON tanpa header kustom agar request lintas origin tetap sederhana. Jangan menaruh credential Google atau kata sandi di frontend.

## 4. Alur penggunaan

1. Siswa membuka **Masuk siswa**, mengisi ID dan kata sandi sementara dari guru.
2. Sesi berlaku 12 jam dan disimpan pada perangkat untuk berpindah antarhalaman latihan tanpa mengetik ID lagi. Halaman latihan memeriksa sesi server saat menyimpan nilai.
3. Siswa dapat membuka **Akun siswa** untuk mengganti kata sandi. Kata sandi lama harus benar; sesi lain pada akun tersebut dicabut, sesi yang dipakai untuk mengganti tetap berlaku.
4. Tombol **Keluar** mencabut sesi server dan menghapus sesi lokal.
5. Apps Script menentukan ID, nama, dan kelas hasil dari sesi tersimpan. Perubahan identitas pada browser tidak dapat mengubah pemilik nilai.

Nilai masuk ke sheet `Results` dengan header:

```text
timestamp | student_id | student_name | class_name | exercise_id | exercise_name | correct | incorrect | total | score
```

Timestamp dibuat di Apps Script. `score` mengikuti jenis latihan: bisa berupa nilai 0–100 atau jumlah jawaban benar.

## Keamanan dan batasan

Token sesi disimpan dalam bentuk hash di sheet `Sessions`, dengan waktu kedaluwarsa dan status pencabutan. Session token pada browser adalah kredensial sementara; siswa tetap harus keluar pada perangkat bersama. Endpoint Apps Script yang dapat diakses publik tetap dapat diserang secara otomatis, dan spreadsheet bukan backend autentikasi khusus. Gunakan untuk latihan dengan risiko rendah; untuk nilai resmi atau data sensitif, gunakan layanan autentikasi/backend yang dikelola khusus.
