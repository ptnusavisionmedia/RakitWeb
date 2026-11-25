-- Skema Supabase untuk RakitWeb (belum terhubung ke aplikasi; lihat README).
-- Menyiapkan peran, kelas, progres, karya, dan kebijakan akses sisi server (RLS).

create type peran as enum ('siswa', 'guru');
create type status_karya as enum ('draf', 'dikirim', 'perbaikan', 'tampil');

create table profil (
  id uuid primary key references auth.users on delete cascade,
  peran peran not null default 'siswa',
  nama_panggilan text not null check (char_length(nama_panggilan) between 1 and 20),
  avatar text not null default 'a1',
  kelas smallint check (kelas between 1 and 6),          -- hanya untuk siswa; ditetapkan guru
  dibuat timestamptz not null default now(),
  constraint siswa_punya_kelas check (peran = 'guru' or kelas is not null)
);

create table progres (
  siswa uuid references profil on delete cascade,
  kelas smallint not null,
  selesai smallint[] not null default '{}',
  terakhir smallint not null default 0,
  terakhir_pada timestamptz not null default now(),
  primary key (siswa, kelas)
);

create table karya (
  id uuid primary key default gen_random_uuid(),
  siswa uuid not null references profil on delete cascade,
  kelas smallint not null,
  jenis text not null check (jenis in ('visual', 'kode')),
  isi jsonb not null,                -- dokumen visual atau peta nama-berkas → isi
  status status_karya not null default 'draf',
  komentar text,
  komentar_pada timestamptz,
  dikirim jsonb, dikirim_pada timestamptz,
  tampil jsonb, tampil_pada timestamptz,
  diubah timestamptz not null default now(),
  unique (siswa, kelas)
);

create or replace function jadi_guru() returns boolean language sql stable security definer as $$
  select exists (select 1 from profil where id = auth.uid() and peran = 'guru');
$$;
create or replace function kelas_saya() returns smallint language sql stable security definer as $$
  select kelas from profil where id = auth.uid();
$$;

alter table profil enable row level security;
alter table progres enable row level security;
alter table karya enable row level security;

create policy profil_baca on profil for select using (id = auth.uid() or jadi_guru());
create policy profil_ubah on profil for update using (id = auth.uid()) with check (id = auth.uid() and kelas is not distinct from (select kelas from profil where id = auth.uid()));
create policy guru_kelola_profil on profil for all using (jadi_guru()) with check (jadi_guru());

create policy progres_siswa on progres for all using (siswa = auth.uid() and kelas = kelas_saya()) with check (siswa = auth.uid() and kelas = kelas_saya());
create policy progres_guru on progres for select using (jadi_guru());

create policy karya_siswa on karya for all using (siswa = auth.uid() and kelas = kelas_saya()) with check (siswa = auth.uid() and kelas = kelas_saya());
create policy karya_guru on karya for all using (jadi_guru()) with check (jadi_guru());
-- Galeri: anggota kelas yang sama hanya boleh membaca karya berstatus 'tampil'.
create policy karya_galeri on karya for select using (status = 'tampil' and kelas = kelas_saya());
