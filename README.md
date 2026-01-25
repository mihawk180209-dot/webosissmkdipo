# 🎓 Website Resmi OSIS SMK Diponegoro 1 Jakarta

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)

> **Platform digital modern untuk aspirasi, informasi, dan kreasi siswa.**

Website ini dibangun untuk mendigitalisasi informasi OSIS SMK Diponegoro 1 Jakarta. Menggunakan teknologi **Single Page Application (SPA)** yang cepat, responsif, dan dinamis. Dilengkapi dengan **Admin Panel** yang aman untuk pengelolaan konten secara _real-time_ tanpa perlu menyentuh kode program.

---

## 🔥 Fitur Unggulan (Full Features)

Website ini dibagi menjadi dua bagian utama: **Halaman Publik** (untuk siswa/umum) dan **Panel Admin** (untuk pengurus OSIS).

### 🌍 1. Halaman Publik (User Interface)

Halaman ini dapat diakses oleh siapa saja.

- **Beranda Modern:** Hero section dengan animasi, sekilas info statistik, dan navigasi intuitif.
- **Visi & Misi Dinamis:** Data Visi dan Misi diambil langsung dari database (bisa diedit admin), bukan teks mati.
- **Galeri Pengurus:** Menampilkan daftar anggota OSIS lengkap dengan foto, nama, dan jabatan dalam tampilan grid yang rapi.
- **Program Kerja:**
  - Daftar artikel kegiatan terbaru.
  - Halaman **Detail Program** dengan foto banner besar, deskripsi, dan tanggal posting.
  - Fitur tombol "Kembali ke Beranda" yang responsif.
- **Kontak & Footer:** Integrasi langsung ke sosial media (Instagram, TikTok, YouTube) dan informasi alamat sekolah.

### 🛡️ 2. Panel Admin (Content Management System)

Halaman khusus pengurus yang diproteksi sistem keamanan.

- **Secure Login:** Sistem login menggunakan trik _Username_ (bukan email panjang) yang terintegrasi dengan Supabase Auth.
- **Dashboard Overview:** Melihat ringkasan jumlah anggota aktif dan program kerja secara _real-time_.
- **Manajemen Anggota (CRUD):**
  - Tambah anggota baru dengan upload foto.
  - Edit data jabatan/nama.
  - Hapus anggota (Foto di server otomatis terhapus untuk menghemat penyimpanan).
- **Manajemen Program Kerja (CRUD):**
  - Tulis artikel kegiatan dengan Textarea luas.
  - Upload banner kegiatan.
  - Hapus program kerja beserta fotonya.
- **Edit Visi Misi:** Form khusus untuk mengubah teks Visi dan Misi sekolah yang tampil di halaman depan secara instan.

---

## 🛠️ Teknologi (Tech Stack)

Project ini dibuat dengan standar industri terkini:

- **Frontend Framework:** [React.js](https://react.dev/) (Library UI terpopuler)
- **Build Tool:** [Vite](https://vitejs.dev/) (Super cepat & ringan)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS framework)
- **Backend as a Service:** [Supabase](https://supabase.com/)
  - **PostgreSQL:** Database relasional yang kuat.
  - **Auth:** Sistem login aman.
  - **Storage:** Penyimpanan file (foto & banner).
- **Icons:** [Lucide React](https://lucide.dev/) (Ikon vektor ringan)
- **Animation:** [Framer Motion](https://www.framer.com/motion/) (Animasi transisi halus)

---

## 🚀 Panduan Instalasi (Localhost)

Ikuti langkah ini untuk menjalankan project di laptop/komputer Anda:

### 1. Clone Repository

```bash
git clone [(https://github.com/username-kamu/nama-repo.git)
cd nama-repo
```

````

### 2. Install Dependencies

Pastikan **Node.js** sudah terinstall.

```bash
npm install

```

_(Tips: Gunakan `npm uninstall` untuk menghapus library sampah yang tidak terpakai)_

### 3. Konfigurasi Environment Variable

Buat file bernama `.env` di folder paling luar (sejajar dengan `package.json`), lalu isi:

```env
VITE_SUPABASE_URL=[https://proyek-kamu.supabase.co](https://proyek-kamu.supabase.co)
VITE_SUPABASE_ANON_KEY=eyJh... (Kunci Anon Key Panjang Kamu)

```

### 4. Jalankan Server Development

```bash
npm run dev

```

Buka browser dan akses: `http://localhost:5173`

---

## 🗄️ Skema Database (Supabase SQL)

Jika Anda ingin membuat ulang database dari nol, jalankan perintah SQL ini di **Supabase SQL Editor**:

```sql
-- 1. Tabel Anggota OSIS
create table members (
  id bigint primary key generated always as identity,
  name text not null,
  position text not null,
  image_url text,
  created_at timestamp with time zone default now()
);

-- 2. Tabel Program Kerja
create table programs (
  id bigint primary key generated always as identity,
  title text not null,
  description text,
  content text,
  image_url text,
  created_at timestamp with time zone default now()
);

-- 3. Tabel Profil Sekolah (Visi Misi)
create table school_profile (
  id bigint primary key generated always as identity,
  vision text,
  mission text
);

-- Insert Data Awal Visi Misi (Wajib ada 1 baris)
insert into school_profile (vision, mission)
values ('Visi Default...', 'Misi Default...');

```

---

## 🔐 Catatan Login Admin

Sistem login telah dimodifikasi agar user hanya perlu memasukkan **Username**.

- **Format Database:** `username
- **Input Login:** `username` (Sistem otomatis menambahkan domain di belakang layar)
- **Password:** Sesuai yang didaftarkan di Supabase Authentication.

---

## 👨‍💻 Author & Maintainer

Dikembangkan dengan dedikasi tinggi oleh:

**Finn**

- **Role:** Fullstack Developer (React & Supabase)
- **Instagram:** [@username_kak_fino](https://www.google.com/search?q=https://instagram.com/_finssssss)
- **GitHub:** [github.com/username-kak_fino](https://www.google.com/search?q=https://github.com/FinoAlyasa)

---

Copyright © 2026 OSIS SMK Diponegoro 1 Jakarta. All rights reserved.

```

```
````
