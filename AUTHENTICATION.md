# Login & Register Features - Dokumentasi

## Deskripsi

Fitur login dan register sudah diimplementasikan dengan menggunakan shadcn/ui components, React Router untuk routing, dan mock data untuk simulasi database.

## Fitur yang Tersedia

### 1. **Authentication System**

- Login dengan email dan password
- Register akun baru
- Protected routes (dashboard hanya bisa diakses saat sudah login)
- Session management dengan localStorage
- Error handling untuk invalid credentials

### 2. **Pages**

- **Login** (`/login`) - Halaman login dengan design sesuai figma
- **Register** (`/register`) - Halaman registrasi dengan validasi form
- **Dashboard** (`/dashboard`) - Halaman setelah login (protected)

### 3. **Mock Data Credentials**

Gunakan data berikut untuk testing:

| Email             | Password  | Nama         |
| ----------------- | --------- | ------------ |
| admin@example.com | Admin@123 | Admin User   |
| test@example.com  | Test@123  | Test User    |
| user@example.com  | User@123  | Regular User |

## Struktur Folder

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication Context & Provider
├── data/
│   └── mockUsers.ts             # Mock data & user management
├── hooks/
│   └── useAuth.ts               # useAuth hook export
├── pages/
│   ├── login/
│   │   └── Login.tsx            # Login page
│   ├── register/
│   │   └── Register.tsx         # Register page
│   └── dashboard/
│       └── Dashboard.tsx        # Dashboard page
├── routes/
│   ├── ProtectedRoute.tsx       # Protected route wrapper
│   └── index.tsx                # Main routing configuration
├── components/ui/
│   ├── button.tsx               # shadcn Button component
│   ├── input.tsx                # shadcn Input component
│   ├── card.tsx                 # shadcn Card component
│   └── ...                      # Komponen UI lainnya
└── App.tsx                      # App root
```

## Cara Menggunakan

### 1. **Jalankan Development Server**

```bash
npm run dev
```

### 2. **Login**

- Navigasi ke `/login`
- Masukkan email dan password dari mock data di atas
- Klik "Log in" button
- Jika berhasil, akan diarahkan ke `/dashboard`

### 3. **Register**

- Navigasi ke `/register`
- Isi semua field (Name, Email, Password, Confirm Password)
- Password harus minimal 6 karakter
- Email tidak boleh duplikat
- Klik "Sign up" button
- Jika berhasil, akun akan disimpan di localStorage dan user akan langsung login

### 4. **Logout**

- Klik tombol "Logout" di dashboard
- Session akan dihapus dan kembali ke halaman login

## Validasi Form

### Login

- Email: Required, valid email format
- Password: Required, minimal 1 karakter

### Register

- Name: Required, tidak boleh kosong
- Email: Required, valid email format, tidak boleh duplikat
- Password: Required, minimal 6 karakter
- Confirm Password: Harus sama dengan password

## Storage

- User data disimpan di `localStorage` dengan key `registeredUsers`
- Current user session disimpan di `localStorage` dengan key `currentUser`
- Data akan persist setelah page reload

## Catatan Penting

1. **Mock Data**: Saat aplikasi pertama kali dijalankan, 3 mock users akan di-load ke localStorage
2. **Error Messages**: Semua error message ditampilkan dengan format yang user-friendly
3. **Loading State**: Button akan disabled dan menampilkan loading state saat proses login/register
4. **Password Toggle**: Icon mata untuk show/hide password tersedia di kedua halaman
5. **Responsive Design**: Login dan Register pages responsive di semua ukuran layar

## Selanjutnya

Untuk menghubungkan dengan backend API, Anda perlu:

1. Update `src/data/mockUsers.ts` dengan API calls
2. Update `src/contexts/AuthContext.tsx` untuk handle real API responses
3. Ganti mock data dengan data dari server

## Dependencies

- react-router-dom: ^6.x (untuk routing)
- shadcn/ui components (sudah ada di project)
- react-icons (sudah ada di project)
- tailwindcss (sudah ada di project)
