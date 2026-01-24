# 🎓 Website Resmi OSIS SMK Diponegoro 1 Jakarta

Website modern untuk OSIS SMK Diponegoro 1 Jakarta yang berfungsi sebagai pusat informasi, profil anggota, dan dokumentasi program kerja siswa. Website ini dilengkapi dengan **Panel Admin** untuk mengelola konten secara dinamis tanpa perlu menyentuh kodingan.

🔗 **Live Demo:** [osissmkdipo1jkt.netlify.app]

---

## ✨ Fitur Unggulan

### 🌍 Halaman Publik (Siswa)

- **Desain Modern & Responsif:** Tampilan optimal di HP, Tablet, dan Desktop.
- **Beranda:** Banner selamat datang, visi misi, dan sekilas info.
- **Program Kerja:** Daftar kegiatan OSIS dengan filter dan detail lengkap.
- **Anggota OSIS:** Profil struktur organisasi pengurus OSIS.
- **Kontak & Sosmed:** Integrasi link ke Instagram, TikTok, dan YouTube.

### 🛡️ Halaman Admin (Pengurus)

- **Login Aman:** Sistem autentikasi admin.
- **Dashboard Statistik:** Ringkasan jumlah anggota dan program aktif.
- **Manajemen Anggota (CRUD):** Tambah, Edit, Hapus data pengurus + Upload Foto.
- **Manajemen Program (CRUD):** Tulis artikel kegiatan, upload banner, dan hapus program.
- **Auto-Cleanup:** Foto lama otomatis terhapus dari server saat data diupdate (Hemat penyimpanan).

---

## 🛠️ Teknologi yang Digunakan

Project ini dibangun menggunakan teknologi web terkini agar cepat dan ringan:

- **Frontend:** [React.js](https://react.dev/) + [Vite](https://vitejs.dev/) (Super cepat)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Desain rapi & konsisten)
- **Backend & Database:** [Supabase](https://supabase.com/) (Database real-time & Auth)
- **Storage:** Supabase Storage (Untuk menyimpan foto profil & banner)
- **Animasi:** Framer Motion (Transisi halus)
- **Ikon:** Lucide React

---

## 🚀 Cara Menjalankan Project (Localhost)

Ikuti langkah ini jika ingin menjalankan website di laptop kamu:

### 1. Clone Repository

```bash
git clone [https://github.com/username-kamu/nama-repo.git](https://github.com/username-kamu/nama-repo.git)
cd nama-repo
```

````

### 2. Install Dependencies

Pastikan Node.js sudah terinstall, lalu jalankan:

```bash
npm install

```

### 3. Konfigurasi Environment Variable

Buat file baru bernama `.env` di folder paling luar, lalu isi dengan kunci API Supabase kamu:

```env
VITE_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
VITE_SUPABASE_ANON_KEY=eyJh... (Kunci Anon Key Kamu)

```

### 4. Jalankan Server

```bash
npm run dev

```

Buka browser dan akses `http://localhost:5173`.

---

## 🗄️ Struktur Database (Supabase)

Jika ingin membuat ulang database, berikut adalah tabel yang digunakan:

**Tabel: `members**`

- `id` (int8, primary key)
- `name` (text)
- `position` (text)
- `image_url` (text)
- `created_at` (timestamp)

**Tabel: `programs**`

- `id` (int8, primary key)
- `title` (text)
- `description` (text)
- `content` (text)
- `image_url` (text)
- `created_at` (timestamp)

---

## 🔐 Catatan Login Admin

Untuk login ke dashboard admin, sistem menggunakan kombinasi username yang dikonversi menjadi email internal.

- **Username:** (Sesuai yang didaftarkan di Supabase Auth)
- **Password:** (Password akun tersebut)

_(Sistem akan otomatis mengubah username menjadi `username@osis.dipo` saat login)._

---

## 👨‍💻 Author

Dibangun oleh **Fino**.

- **Instagram:** [@username_kak_fino](https://www.google.com/search?q=https://instagram.com/_finssssss)
- **GitHub:** [github.com/username-kak_fino](https://www.google.com/search?q=https://github.com/FinoAlyasa)

---

Copyright © 2026 OSIS SMK Diponegoro 1 Jakarta. All rights reserved.

```

```
````
