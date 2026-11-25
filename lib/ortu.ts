import type { ClassMeta } from "./curriculum/types";

export const TANYA: Record<"visual" | "code", string[]> = {
  visual: [
    "Coba tunjukkan halaman yang kamu buat. Bagian mana yang paling kamu suka?",
    "Kenapa kamu memilih gambar dan warna ini?",
    "Apa yang ingin kamu tambahkan di pertemuan berikutnya?",
  ],
  code: [
    "Setelah kamu mengubah kode, apa yang berubah di layar?",
    "Bagian mana yang tadi sulit, dan bagaimana kamu mengatasinya?",
    "Coba klik semua tautan di websitemu. Apakah semuanya berfungsi?",
  ],
};

export const TIPS = [
  "Beri waktu 10–15 menit untuk melihat karya anak. Cukup minta ia menjelaskan, tidak perlu menilai.",
  "Pujilah usaha dan pilihan anak, bukan hanya hasilnya. Misalnya: “Kamu rapi menyusun bagiannya.”",
  "Tanyakan satu hal yang ingin anak coba berikutnya, lalu biarkan ia memutuskan sendiri.",
  "Pastikan anak hanya memakai nama panggilan dan tidak mencantumkan alamat, nomor telepon, atau foto wajah.",
];

export const PRIVASI = [
  "Anak hanya memakai nama panggilan dan gambar pilihan. Tidak ada nama lengkap atau foto.",
  "Karya hanya terlihat oleh Anda, guru, dan, jika dipublikasikan guru, teman satu kelas.",
  "Pratinjau karya berjalan terisolasi. Formulir di dalamnya tidak mengirim data ke mana pun.",
];

export function pesanSorotan(status: string | undefined, name: string, hari: number): { judul: string; isi: string } {
  if (hari >= 7) return { judul: `${name} belum belajar selama ${hari} hari`, isi: "Ajak anak membuka RakitWeb dan melanjutkan dari pertemuan terakhir. Pekerjaannya tersimpan otomatis." };
  switch (status) {
    case "revision": return { judul: "Guru meminta satu perbaikan kecil", isi: `${name} diminta memperbaiki karyanya. Catatan guru ada di bawah, dan anak bisa langsung mengerjakannya.` };
    case "submitted": return { judul: "Karya sudah dikirim ke guru", isi: "Guru akan meninjau dan memberi satu komentar. Tidak ada yang perlu Anda lakukan sekarang." };
    case "published": return { judul: "Karya tampil di galeri kelas", isi: `Karya ${name} sudah ditampilkan guru dan bisa dilihat teman satu kelas.` };
    default: return { judul: "Belajar berjalan lancar", isi: `${name} masih mengerjakan karyanya sebagai draf. Karya akan dikirim ke guru setelah anak siap.` };
  }
}

export const sisaJam = (meta: ClassMeta, selesai: number) => Math.round(((meta.meetings - selesai) * meta.minutes) / 60);
