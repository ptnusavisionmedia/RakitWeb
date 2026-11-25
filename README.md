# RakitWeb

LMS berbahasa Indonesia untuk kursus membuat website, kelas 1–6 SD. Next.js (App Router), React, TypeScript, Tailwind CSS.

```powershell
npm install
npm run dev        # http://localhost:3000
npm run build; npm start
npx tsx scripts/check-curriculum.ts   # memeriksa 72 pertemuan
```

## Mode demo
Di halaman awal: **Coba sebagai siswa** (pilih kelas 1–6) atau **Coba sebagai guru**.
Akun contoh: guru `guru` / `guru123` (ubah dengan `GURU_PASSWORD`), siswa mis. `rani5` / PIN `1234`.
Siswa demo dapat memakai **Profil → Mulai demo dari awal** atau **Ganti kelas demo**.

## Isi
- `lib/curriculum/` — 72 pertemuan (8 × kelas 1–3, 16 × kelas 4–6), tugas dibedakan per kelas, rincian waktu dan panduan guru, kode awal.
- `components/VisualEditor.tsx` — editor visual kelas 1–3 (Naik/Turun, seret, Urungkan, Lihat hasil, simpan otomatis; alat dibuka sesuai pertemuan).
- `components/CodeWorkspace.tsx` + `CodePreview.tsx` — editor HTML/CSS/JS kelas 4–6; pratinjau berjalan di `<iframe sandbox="allow-scripts allow-forms">` dengan CSP yang memblokir jaringan.
- `app/api/*` — semua akses data diperiksa di server dari sesi bertanda tangan (peran dan kelas tidak pernah dipercaya dari klien).

## Penyimpanan data — penting
Aplikasi ini **belum memakai Supabase**: tidak ada proyek/kredensial Supabase di lingkungan pembuatan. Data disimpan lewat `lib/db.ts` ke berkas JSON (`.data/db.json`, atau folder sementara di Vercel, yang **tidak awet**). Cocok untuk demo dan uji coba, belum untuk produksi.
`supabase/schema.sql` memuat skema dan kebijakan RLS yang disiapkan; langkah berikutnya: buat proyek Supabase, jalankan skema, lalu ganti isi `lib/db.ts` dan `lib/auth.ts` dengan klien Supabase (fungsi yang diekspor sudah menjadi batas antarmukanya).
