# Aturan Proyek Math Practice

- Gunakan vanilla HTML, CSS, dan JavaScript; jangan menambahkan framework atau library tanpa persetujuan.
- Pertahankan struktur file sederhana dan mudah dipelajari.
- Buat kode reusable hanya jika memang akan dipakai lebih dari satu halaman atau latihan.
- Pastikan setiap halaman tetap responsif di desktop, tablet, dan ponsel.
- Setiap jenis latihan harus memiliki `exercise_id` yang unik.
- Saat menambah latihan, daftarkan `exercise_id` di `window.MathPractice.exerciseGroups` dalam `js/common.js` agar halaman Rekor Saya dan filter Ruang Guru otomatis memakai kategori yang sama dengan beranda.
- Untuk latihan Kecepatan Berhitung, tambahkan juga `exercise_id` ke `SPEED_EXERCISE_IDS` di `google-apps-script/Code.gs`, sertakan panel papan skor pada halaman latihan, dan panggil `MathPractice.loadSpeedLeaderboard(exercise.id)` setelah hasil sesi disimpan. Perubahan daftar izin Apps Script perlu disalin dan di-deploy ke Web App aktif.
- Integrasi penyimpanan data dilakukan melalui Google Apps Script saat fitur tersebut diminta.
- Jangan mengubah arsitektur proyek secara besar tanpa alasan teknis yang jelas dan penjelasan singkat terlebih dahulu.
