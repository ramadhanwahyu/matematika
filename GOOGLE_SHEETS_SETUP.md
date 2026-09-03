# Setup Google Sheets dan Google Apps Script

Dokumen ini menghubungkan website statis Math Practice ke satu Google Spreadsheet. Untuk MVP, endpoint ini menyimpan hasil latihan pada sheet `Results`.

## 1. Buat Spreadsheet

1. Buat Google Spreadsheet baru.
2. Buat sheet bernama `Students`. Baris pertama harus berisi header berikut, dengan urutan bebas tetapi ejaan sama:

   ```text
   student_id | name | class_name
   ```

3. Tambahkan satu siswa per baris, misalnya:

   ```text
   S001 | Ahmad | X-A
   S002 | Siti | X-B
   ```

   Jadikan kolom `student_id` berformat **Plain text** agar nol di depan ID numerik tidak hilang. Setiap ID harus unik.
4. Salin Spreadsheet ID dari URL. Bentuk URL-nya seperti `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`; bagian di antara `/d/` dan `/edit` adalah ID yang dibutuhkan.

## 2. Tambahkan Apps Script

1. Dari Spreadsheet, pilih **Extensions > Apps Script**.
2. Ganti isi file `Code.gs` dengan isi [google-apps-script/Code.gs](google-apps-script/Code.gs) di proyek ini.
3. Ubah nilai berikut dengan Spreadsheet ID Anda:

   ```javascript
   const SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_ANDA';
   ```

4. Simpan proyek Apps Script.

Sheet `Results` akan dibuat otomatis ketika kiriman hasil pertama berhasil diterima. Kolomnya adalah:

```text
timestamp | student_id | student_name | class_name | exercise_id | exercise_name | correct | incorrect | total | score
```

Timestamp dibuat di Apps Script, bukan oleh browser.

## 3. Deploy sebagai Web App

1. Pilih **Deploy > New deployment**.
2. Pilih tipe **Web app**.
3. Pilih **Execute as: Me** agar script dapat menulis ke Spreadsheet milik Anda.
4. Pada akses, pilih opsi yang mengizinkan siswa membuka Web App tanpa akun Google. Nama pilihan dapat berbeda menurut jenis akun Google/Workspace; untuk GitHub Pages, umumnya diperlukan **Anyone**.
5. Deploy, selesaikan proses otorisasi, lalu salin URL deployment yang berakhir dengan `/exec`. Setelah memperbarui `Code.gs` di masa mendatang, deploy **versi baru** agar endpoint menggunakan kode terbaru.

Gunakan URL `/exec`, bukan URL `/dev`; URL `/dev` hanya untuk editor Apps Script.

## 4. Hubungkan website

Di [js/common.js](js/common.js), ganti nilai kosong berikut dengan URL `/exec` tadi:

```javascript
window.MathPractice.config = {
  appsScriptWebAppUrl: ""
};
```

Jangan menaruh password, API key, atau credential Google di JavaScript frontend.

Frontend mengirim POST tanpa header kustom sehingga tetap menjadi CORS simple request dan tidak memicu preflight. Ia menunggu respons JSON dari Apps Script sebelum menampilkan status “Nilai berhasil disimpan.”

## 5. Uji satu data

1. Buka website melalui server statis atau hosting Anda, bukan langsung dari `file://`.
2. Masukkan ID siswa yang ada di sheet `Students`, lalu tekan **Cari**. Nama dan kelas harus terisi otomatis.
3. Selesaikan latihan sampai halaman hasil.
4. Pastikan status berubah dari “Menyimpan nilai...” menjadi “Nilai berhasil disimpan.”
5. Buka sheet `Results` dan periksa bahwa satu baris baru muncul dengan timestamp dari Apps Script.

Jika muncul status gagal, periksa URL `/exec`, pengaturan akses deployment, Spreadsheet ID, dan koneksi. Tombol **Coba simpan lagi** tersedia tanpa mengulang kuis. Jika browser tidak dapat mengonfirmasi respons jaringan, periksa sheet sebelum mencoba lagi untuk menghindari baris ganda.

## Kecepatan pencarian siswa

Data sheet `Students` disimpan sementara pada cache Apps Script selama 5 menit. Pencarian pertama setelah cache kosong dapat lebih lambat karena Apps Script perlu membaca Spreadsheet; pencarian berikutnya biasanya lebih cepat, termasuk untuk ID yang tidak ditemukan.

Setelah mengubah data siswa di Google Sheets, perubahan dapat terlihat di website paling lambat sekitar 5 menit. Untuk perubahan yang perlu segera berlaku, tunggu cache tersebut habis sebelum melakukan pencarian ulang.

## Keamanan dan batasan MVP

Web App yang dapat menerima data dari website statis bukan sistem autentikasi kuat. Endpoint pencarian membuat nama dan kelas dari ID yang diketahui dapat dibaca oleh pengunjung website. Data identitas disimpan di `localStorage` perangkat dan payload dapat dikirim langsung oleh siapa pun yang mengetahui URL endpoint. Pendekatan ini cocok untuk MVP kelas dengan data non-sensitif, bukan untuk data pribadi sensitif, nilai resmi, atau kontrol akses guru.
