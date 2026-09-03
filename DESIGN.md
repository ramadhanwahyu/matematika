---
version: alpha
name: "Math Practice"
description: "Website latihan matematika berbahasa Indonesia dengan nuansa buku kerja yang fokus dan ramah."
colors:
  background: "#F4F7FB"
  surface: "#FFFFFF"
  ink: "#17324D"
  muted: "#587087"
  primary: "#1F5F99"
  primary-hover: "#174B7A"
  accent: "#F6C945"
  success: "#177A5A"
  danger: "#B93838"
  border: "#D8E2ED"
typography:
  display:
    fontFamily: "Georgia, 'Times New Roman', serif"
  sans:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
rounded:
  DEFAULT: "0.75rem"
  sm: "0.5rem"
  md: "0.875rem"
  lg: "1.25rem"
spacing:
  page-max: "70rem"
  page-gutter: "1.25rem"
  section-gap: "4rem"
components:
  button: {}
  card: {}
  input: {}
  progress: {}
---

# Math Practice Design System

## Overview

### Creative North Star

Sebuah buku kerja matematika yang rapi: tinta biru untuk struktur dan angka, satu sorotan kuning untuk menandai langkah belajar, serta ruang putih yang cukup untuk berpikir.

### Product context and register

- **Audience and primary job:** Siswa Indonesia yang berlatih soal matematika secara mandiri dan perlu menyelesaikan satu soal pada satu waktu.
- **Target market(s) and evidence:** Indonesia; bahasa dan konteks latihan mengikuti permintaan proyek.
- **Locale(s) and language policy:** Bahasa Indonesia untuk semua teks antarmuka; angka menggunakan digit Latin.
- **Usage scene:** Latihan singkat di ponsel maupun laptop, sehingga navigasi dan kolom jawaban harus mudah disentuh.
- **Register:** Hybrid. Beranda boleh ekspresif secara ringan; halaman kuis mengutamakan kejernihan dan keterbacaan.
- **Memorable signature:** Garis sorotan kuning di belakang istilah atau angka penting, seperti stabilo pada buku latihan.
- **Restraint:** Kartu soal, field, dan ringkasan nilai tidak memakai ornamen berlebihan.
- **Anti-references:** Bukan dashboard korporat padat atau aplikasi anak-anak yang terlalu ramai; keduanya mengalihkan fokus dari hitungan.
- **Token ownership/runtime mapping:** `css/style.css` adalah sumber token runtime melalui CSS custom properties. Dokumen ini mencerminkan nilai yang sama; setiap perubahan token diperbarui pada keduanya.

## Colors

`primary` digunakan untuk tindakan utama dan fokus keyboard. `accent` hanya menjadi sorotan progres dan teks penting. `success` dan `danger` dipakai bersama teks, bukan sebagai satu-satunya penanda hasil. Permukaan selalu terang untuk menjaga kontras tulisan `ink`.

## Typography

Judul memakai `display` serif agar terasa seperti materi pelajaran; isi, kontrol, dan instruksi memakai `sans` yang mudah dibaca. Bentuk pecahan memakai gaya numerik tebal pada ukuran besar dan tidak bergantung pada font eksternal.

## Layout

Konten berpusat pada lebar maksimum `page-max`. Spasi tepi menyusut pada ponsel, dan grid kartu berubah menjadi satu kolom. Tinggi konten mengikuti dokumen agar tidak ada area latihan yang terpotong pada layar kecil atau pembesaran teks.

## Elevation & Depth

Kartu menggunakan batas tipis dan bayangan sangat lembut hanya untuk memisahkan area kerja dari latar. Tidak ada modal atau lapisan mengambang pada MVP ini.

## Shapes

Field dan tombol memakai sudut `md`; kartu utama memakai `lg`. Bentuk tidak dibuat pill supaya tetap terasa seperti alat belajar, bukan aplikasi sosial.

## Components

### Foundational visual states

Tombol mempunyai hover, active, focus-visible, dan disabled yang jelas. Field invalid memiliki batas dan pesan teks merah. Pesan validasi disediakan ruang tetap agar tata letak tidak meloncat.

### Buttons and actions

Tombol utama berwarna `primary`; tombol sekunder hanya berbingkai. Tombol memiliki label yang menyatakan hasil tindakan dan mempertahankan ukuran yang nyaman disentuh.

### Forms and overlays

Semua field memakai label nyata, bantuan input, dan validasi inline. Form menggunakan validasi JavaScript sendiri sehingga pesannya konsisten dalam bahasa Indonesia. Pencarian ID siswa memakai status pending, berhasil, dan gagal dalam teks; nama dan kelas hanya-baca setelah ditemukan dari sheet. Status simpan hasil berada di bawah tindakan hasil: pending, berhasil, dan gagal selalu ditulis dalam teks; kegagalan menyediakan tindakan coba lagi tanpa menghapus nilai.

### Motion

Transisi ringan dipakai untuk hover dan perubahan tampilan. Semua animasi dimatikan bila pengguna memilih reduced motion.

### Content and data visualization

Bahasa antarmuka langsung dan suportif: instruksi menjelaskan langkah koreksi, bukan menyalahkan siswa. Nilai selalu ditampilkan dalam angka utuh 0–100.

## Do's and Don'ts

- **Do:** Gunakan sorotan kuning hanya pada progres atau kata kunci pembelajaran.
- **Do:** Pertahankan label, pesan validasi, dan tombol yang sama untuk pola yang sama.
- **Don't:** Menambah dekorasi yang mengurangi fokus terhadap soal.
- **Don't:** Mengandalkan warna saja untuk menyampaikan benar, salah, atau invalid.
