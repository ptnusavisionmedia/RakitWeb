import type { Snippet } from "./types";

export type V46 = {
  title: string;
  goal: string;
  example: string;
  task: string;
  steps: string[];
  success: string[];
  snippet?: Snippet[];
  target?: string; // kelas 6
  hints?: string[]; // kelas 6
};
export type T46 = {
  topic: string;
  opening: string;
  demo: string;
  reflect: string;
  guide: string[];
  tools?: "privacy" | "linkcheck" | "present";
  v: [V46, V46, V46];
};

const H = (code: string, file = "index.html", at: "top" | "end" = "end"): Snippet => ({ file, code, at });
const C = (code: string): Snippet => ({ file: "style.css", code });
const J = (code: string): Snippet => ({ file: "script.js", code });

export const K46: T46[] = [
  // 1
  {
    topic: "Cara kerja website dan hubungan antara editor, file, dan peramban",
    opening: "Tanya: apa yang terjadi antara menulis kode dan melihat halaman? Gambarkan editor → file → peramban di papan tulis.",
    demo: "Ubah satu tulisan di editor, tunjukkan file tersimpan otomatis, lalu tunjukkan hasilnya berubah di pratinjau (peramban).",
    reflect: "Siswa menjelaskan dengan kata sendiri: siapa yang menulis, siapa yang menyimpan, siapa yang menampilkan.",
    guide: [
      "Tiga peran: editor tempat menulis, file tempat kode disimpan, peramban yang membaca file lalu menampilkannya.",
      "Tunjukkan bahwa perubahan kecil di editor langsung memengaruhi hasil; ini membangun kepercayaan diri.",
      "Jangan masuk ke tag lain dulu; cukup tulisan di dalam <h1>.",
    ],
    v: [
      {
        title: "Dari editor ke peramban",
        goal: "Hari ini aku bisa menjelaskan jalan kode dari editor sampai tampil di peramban.",
        example: "Aku mengetik “Halo, dunia!” di editor. Tulisan itu tersimpan di file index.html. Peramban membuka file itu dan menampilkannya.",
        task: "Ubah tulisan di baris bertanda UBAH menjadi namamu, lalu lihat hasilnya.",
        steps: ["Cari baris bertanda UBAH di editor HTML.", "Ganti “Halo, dunia!” dengan nama samaranmu.", "Lihat hasilnya di kotak Hasil."],
        success: ["Tulisan di Hasil berubah sesuai yang kuketik.", "Aku bisa menyebut peran editor, file, dan peramban."],
      },
      {
        title: "Rute website dari file ke layar",
        goal: "Hari ini aku bisa menunjukkan file apa saja yang membentuk website sekolahku.",
        example: "Website sekolah punya file index.html (beranda) dan klub.html (halaman klub). Peramban membukanya satu per satu.",
        task: "Ubah judul besar di index.html menjadi nama sekolah impianmu, lalu buka klub.html di editor.",
        steps: ["Ubah baris UBAH di index.html menjadi nama sekolah impian.", "Pilih file klub.html di tombol halaman, lalu baca isinya.", "Tuliskan di buku kerja: apa bedanya dua file itu?"],
        success: ["Judul beranda berubah menjadi nama sekolahku.", "Aku tahu website ini punya dua file halaman."],
      },
      {
        title: "Peta kerja website: editor, file, peramban",
        goal: "Hari ini aku bisa membuat peta kerja untuk website sekolah rancanganku.",
        example: "Beranda → Jadwal → Klub. Setiap kotak adalah satu file HTML yang dibuka peramban.",
        task: "Ubah judul beranda, lalu gambar peta tiga file di buku kerjamu.",
        steps: ["Ganti judul di index.html dengan nama sekolah rancanganmu.", "Buka jadwal.html dan klub.html di editor untuk melihat isinya.", "Gambar peta tiga file dengan panah dan tulis tugas setiap file."],
        success: ["Judul berandaku sudah berganti.", "Peta kerjaku memuat tiga file beserta tugasnya."],
        target: "Pratinjau menampilkan judul sekolah rancanganmu. Di buku kerja ada peta tiga file.",
        hints: ["Judul ada di tag <h1>. Cari baris bertanda UBAH.", "Gunakan tombol halaman di atas editor untuk berpindah file.", "Peta: tulis index.html, jadwal.html, klub.html dan beri panah antar file."],
      },
    ],
  },
  // 2
  {
    topic: "Membuat halaman HTML dengan judul dan paragraf",
    opening: "Tanya: di buku, mana judul dan mana cerita? Di HTML, judul memakai <h1> dan cerita memakai <p>.",
    demo: "Tulis <h1> dan dua <p>, lalu tunjukkan bahwa tag harus dibuka dan ditutup.",
    reflect: "Siswa menyebut perbedaan <h1> dan <p> dan apa yang terjadi jika tag lupa ditutup.",
    guide: [
      "Tekankan pasangan tag pembuka dan penutup. Kesalahan paling umum adalah lupa </p>.",
      "Biarkan siswa memperbaiki kesalahan sendiri sebelum Anda menunjuk letaknya.",
      "Tempel kode awal hanya jika siswa tertinggal; yang utama adalah mengganti baris UBAH.",
    ],
    v: [
      {
        title: "Judul dan sapaan hobiku",
        goal: "Hari ini aku bisa membuat judul dan dua paragraf perkenalan.",
        example: "<h1>Website Hobiku</h1> lalu <p>Halo! Aku si Bintang.</p>",
        task: "Jadikan judul besarmu “Website Hobiku” dan isi dua paragraf perkenalan.",
        steps: ["Ubah isi <h1> menjadi “Website Hobiku”.", "Tekan “Tempel kode awal”, lalu ganti tulisan UBAH-NAMA-SAMARAN dan UBAH-HOBI.", "Pastikan setiap <p> punya penutup </p>."],
        success: ["Judul dan dua paragraf tampil di Hasil.", "Aku memakai nama samaran, bukan nama asli."],
        snippet: [H(`  <!-- Pertemuan 2: judul dan paragraf -->
  <p>Halo! Aku si UBAH-NAMA-SAMARAN.</p> <!-- UBAH: tulis nama samaranmu -->
  <p>Hobiku adalah UBAH-HOBI.</p> <!-- UBAH: tulis hobimu -->
`)],
      },
      {
        title: "Judul beranda sekolah impian",
        goal: "Hari ini aku bisa membuat beranda dengan judul dan sambutan.",
        example: "<h1>SD Pelangi Impian</h1> lalu <p>Selamat datang!</p>",
        task: "Ubah judul menjadi nama sekolah impianmu dan tulis dua paragraf sambutan.",
        steps: ["Ubah isi <h1> di index.html.", "Tekan “Tempel kode awal”, lalu ubah kalimat sambutan di baris UBAH.", "Tambahkan satu paragraf buatanmu sendiri."],
        success: ["Beranda punya judul dan tiga paragraf.", "Semua tag <p> tertutup dengan benar."],
        snippet: [H(`  <!-- Pertemuan 2: sambutan beranda -->
  <p>Selamat datang di UBAH-NAMA-SEKOLAH! Sekolah impian kami punya banyak klub hobi.</p> <!-- UBAH: ganti nama sekolah -->
  <p>Semua kegiatan di sini seru dan aman.</p>
`)],
      },
      {
        title: "Kerangka beranda sekolahku",
        goal: "Hari ini aku bisa membuat kerangka beranda dengan judul dan bagian isi.",
        example: "<h1> memberi nama sekolah. <main> membungkus isi utama halaman.",
        task: "Buat kerangka beranda dengan judul, sapaan, dan visi sekolah fiktif.",
        steps: ["Ganti judul <h1> dengan nama sekolahmu.", "Tempel kode awal dan ubah kalimat di baris UBAH.", "Tambahkan satu <h2> untuk bagian “Visi Sekolah”."],
        success: ["Berandaku punya <h1>, <h2>, dan paragraf di dalam <main>.", "Semua informasi bersifat fiktif."],
        snippet: [H(`  <!-- Pertemuan 2: kerangka beranda -->
  <main>
    <h2>Selamat Datang</h2>
    <p>UBAH: tulis satu kalimat sambutan.</p>
    <p>Visi sekolah (fiktif): UBAH.</p>
  </main>
`)],
        target: "Beranda memiliki judul sekolah, sapaan di <h2>, dan dua paragraf di dalam <main>.",
        hints: ["Isi <main> dengan <h2> lalu <p>.", "Setiap paragraf diawali <p> dan diakhiri </p>.", "Ganti tulisan UBAH dengan kalimatmu sendiri; gunakan data fiktif."],
      },
    ],
  },
  // 3
  {
    topic: "Menambahkan daftar",
    opening: "Tanya: bagaimana kita menulis daftar belanja? Bedakan daftar bertitik dan daftar bernomor.",
    demo: "Tulis <ul> dengan tiga <li>, lalu ubah menjadi <ol> dan bandingkan.",
    reflect: "Siswa memilih kapan memakai daftar bertitik dan kapan bernomor.",
    guide: [
      "<li> harus berada di dalam <ul> atau <ol>; periksa ini saat siswa bingung.",
      "Daftar bernomor cocok untuk langkah; daftar bertitik cocok untuk item tanpa urutan.",
    ],
    v: [
      {
        title: "Daftar hobiku",
        goal: "Hari ini aku bisa membuat daftar tiga hobiku.",
        example: "<ul><li>Menggambar</li><li>Bermain bola</li></ul>",
        task: "Isi tiga hobi di daftar bertitik.",
        steps: ["Tekan “Tempel kode awal”.", "Ganti tiga tulisan UBAH dengan hobimu.", "Tambahkan satu <li> baru untuk hobi keempat."],
        success: ["Daftar punya empat butir hobi.", "Tidak ada tulisan UBAH yang tersisa."],
        snippet: [H(`  <!-- Pertemuan 3: daftar hobi -->
  <h2>Daftar Hobiku</h2>
  <ul>
    <li>UBAH hobi pertama</li>
    <li>UBAH hobi kedua</li>
    <li>UBAH hobi ketiga</li>
  </ul>
`)],
      },
      {
        title: "Daftar klub hobi",
        goal: "Hari ini aku bisa membuat daftar klub di halaman klub.",
        example: "<li>Klub Lukis</li> adalah satu butir daftar klub.",
        task: "Tambahkan klub ketiga ke daftar di halaman klub.html.",
        steps: ["Pilih halaman klub.html di atas editor.", "Tekan “Tempel kode awal”.", "Ganti baris UBAH dengan nama klub ketigamu."],
        success: ["Halaman klub punya tiga butir klub.", "Daftar berada di dalam <ul>."],
        snippet: [H(`  <!-- Pertemuan 3: daftar klub -->
  <h2>Daftar Klub</h2>
  <ul>
    <li>Klub Lukis</li>
    <li>Klub Bola</li>
    <li>UBAH: tulis klub ketiga</li>
  </ul>
`, "klub.html")],
      },
      {
        title: "Menu dan langkah daftar",
        goal: "Hari ini aku bisa membuat daftar isi website dan daftar langkah.",
        example: "<ul> untuk isi website. <ol> untuk langkah yang harus berurutan.",
        task: "Lengkapi tiga langkah mendaftar klub dalam daftar bernomor.",
        steps: ["Tempel kode awal di index.html.", "Ganti tiga baris UBAH dengan langkah mendaftar klub.", "Ubah satu daftar menjadi bertitik atau bernomor sesuai kebutuhan."],
        success: ["Ada satu daftar bertitik dan satu daftar bernomor.", "Langkah pendaftaran berurutan dan mudah dipahami."],
        snippet: [H(`  <!-- Pertemuan 3: isi website dan langkah daftar -->
  <h2>Isi Website</h2>
  <ul>
    <li>Beranda</li>
    <li>Jadwal</li>
    <li>Kegiatan dan Klub</li>
  </ul>
  <h2>Langkah Mendaftar Klub</h2>
  <ol>
    <li>UBAH langkah 1</li>
    <li>UBAH langkah 2</li>
    <li>UBAH langkah 3</li>
  </ol>
`)],
        target: "Beranda punya daftar isi website dan tiga langkah pendaftaran bernomor.",
        hints: ["<ol> membuat angka otomatis.", "Setiap langkah adalah satu <li>.", "Cek apakah semua <li> berada di antara <ol> dan </ol>."],
      },
    ],
  },
  // 4
  {
    topic: "Memasang gambar, teks alternatif, dan tautan",
    opening: "Tanya: bagaimana orang yang tidak dapat melihat gambar tahu isi gambar? Perkenalkan teks alternatif.",
    demo: "Pasang <img src=… alt=…> dari perpustakaan gambar RakitWeb, lalu buat <a href=…> menuju bagian halaman.",
    reflect: "Siswa menjelaskan fungsi alt dan apa yang terjadi jika href salah.",
    guide: [
      "Gambar yang tersedia: bola, musik, gambar, buku, masak, tanaman, renang, sepeda di folder gambar/.",
      "alt menjelaskan isi gambar, bukan menulis “gambar”.",
      "Tautan: kelas 4 ke id di halaman yang sama (#hobi), kelas 5 antar dua halaman, kelas 6 uji navigasi tiga halaman.",
    ],
    v: [
      {
        title: "Gambar, teks alternatif, dan tautan hobi",
        goal: "Hari ini aku bisa memasang gambar dan tautan menuju bagian hobiku.",
        example: "<a href=\"#hobi\">Lihat hobiku</a> membawa pembaca ke bagian yang punya id=\"hobi\".",
        task: "Lengkapi tautan agar menuju bagian hobi, lalu isi teks alternatif gambar.",
        steps: ["Tempel kode awal, lalu isi alt gambar di baris UBAH.", "Beri id=\"hobi\" pada judul Daftar Hobiku (<h2>).", "Ganti href=\"#UBAH\" menjadi href=\"#hobi\" dan coba klik tautannya."],
        success: ["Klik tautan menuju bagian Daftar Hobiku.", "Gambar punya teks alternatif yang jelas."],
        snippet: [H(`  <!-- Pertemuan 4: gambar dan tautan -->
  <img src="gambar/bola.svg" width="120" alt="UBAH: jelaskan gambar ini"> <!-- UBAH: isi teks alternatif -->
  <p><a href="#UBAH">Lihat daftar hobiku</a></p> <!-- UBAH: lengkapi tautan menuju id bagian hobi -->
`)],
      },
      {
        title: "Hubungkan beranda dan halaman klub",
        goal: "Hari ini aku bisa menghubungkan beranda dengan halaman klub.",
        example: "<a href=\"klub.html\">Lihat klub</a> membuka halaman klub. Tautan balik memakai href=\"index.html\".",
        task: "Hubungkan beranda ke klub.html dan klub.html kembali ke beranda.",
        steps: ["Tempel kode awal di index.html dan klub.html.", "Ganti UBAH.html dengan nama file tujuan yang benar.", "Klik kedua tautan di pratinjau untuk mencobanya."],
        success: ["Dari beranda aku bisa membuka halaman klub.", "Dari halaman klub aku bisa kembali ke beranda."],
        snippet: [
          H(`  <!-- Pertemuan 4: tautan ke halaman klub -->
  <p><a href="UBAH.html">Lihat klub hobi</a></p> <!-- UBAH: isi nama file halaman klub -->
  <img src="gambar/gambar.svg" width="120" alt="UBAH: jelaskan gambar ini">
`),
          H(`  <!-- Pertemuan 4: tautan kembali -->
  <p><a href="UBAH.html">Kembali ke beranda</a></p> <!-- UBAH: isi nama file beranda -->
`, "klub.html"),
        ],
      },
      {
        title: "Uji navigasi dari setiap halaman",
        goal: "Hari ini aku bisa menguji tautan menu dari setiap halaman.",
        example: "Menu yang sama ada di tiga halaman. Aku mengeklik tiga tautan dari tiga halaman, yaitu sembilan percobaan.",
        task: "Pasang menu di tiga halaman, lalu temukan dan perbaiki tautan yang salah.",
        steps: ["Tempel kode awal; menu muncul di tiga halaman.", "Klik setiap tautan dari setiap halaman dan catat yang gagal.", "Perbaiki tautan yang salah, lalu uji ulang semuanya."],
        success: ["Semua tautan menu berfungsi di tiga halaman.", "Aku punya catatan hasil uji."],
        snippet: [
          H(`  <!-- Pertemuan 4: navigasi -->
  <nav>
    <a href="index.html">Beranda</a> |
    <a href="jadwal.html">Jadwal</a> |
    <a href="klub.html">Klub</a>
  </nav>
`, "index.html", "top"),
          H(`  <!-- Pertemuan 4: navigasi -->
  <nav>
    <a href="index.html">Beranda</a> |
    <a href="jadwal.html">Jadwal</a> |
    <a href="klub.htm">Klub</a> <!-- UBAH: periksa apakah tautan ini benar -->
  </nav>
`, "jadwal.html", "top"),
          H(`  <!-- Pertemuan 4: navigasi -->
  <nav>
    <a href="index.html">Beranda</a> |
    <a href="jadwal.html">Jadwal</a> |
    <a href="klub.html">Klub</a>
  </nav>
`, "klub.html", "top"),
        ],
        target: "Dari setiap halaman, tiga tautan menu membuka halaman yang benar.",
        hints: ["Uji dengan mengeklik tautan, bukan hanya membaca kodenya.", "Nama file di href harus sama persis, termasuk .html.", "Tautan yang salah ada di jadwal.html. Bandingkan dengan nama file sebenarnya."],
      },
    ],
  },
  // 5
  {
    topic: "Membuat tabel jadwal",
    opening: "Tanya: bagaimana jadwal pelajaran ditulis? Baris dan kolom membuatnya mudah dibaca.",
    demo: "Bangun tabel dua baris: <tr>, <th>, dan <td>. Tunjukkan baris sebagai satu <tr>.",
    reflect: "Siswa menjelaskan beda <th> dan <td> dan bagaimana menambah satu baris.",
    guide: [
      "Satu baris = satu <tr>. Sel = <td>. Judul kolom = <th>.",
      "Jumlah sel di setiap baris harus sama agar tabel rapi.",
      "Dampingi siswa yang bingung dengan menyalin satu baris lalu mengganti isinya.",
    ],
    v: [
      {
        title: "Jadwal kegiatanku",
        goal: "Hari ini aku bisa membuat tabel jadwal kegiatan mingguanku.",
        example: "<tr><td>Senin</td><td>Latihan menggambar</td></tr>",
        task: "Isi tabel dengan tiga kegiatan rutinmu.",
        steps: ["Tempel kode awal.", "Ganti tiga tulisan UBAH dengan kegiatanmu.", "Salin satu baris <tr> untuk menambah kegiatan keempat."],
        success: ["Tabel punya judul kolom dan empat baris.", "Tiap baris punya dua sel."],
        snippet: [H(`  <!-- Pertemuan 5: jadwal kegiatan -->
  <h2>Jadwal Kegiatanku</h2>
  <table>
    <tr><th>Hari</th><th>Kegiatan</th></tr>
    <tr><td>Senin</td><td>UBAH kegiatan</td></tr>
    <tr><td>Rabu</td><td>UBAH kegiatan</td></tr>
    <tr><td>Sabtu</td><td>UBAH kegiatan</td></tr>
  </table>
`)],
      },
      {
        title: "Jadwal klub dalam tabel",
        goal: "Hari ini aku bisa membuat tabel jadwal klub tiga kolom.",
        example: "<tr><td>Klub Lukis</td><td>Selasa</td><td>14.00</td></tr>",
        task: "Lengkapi baris klub ketiga di tabel jadwal pada halaman klub.",
        steps: ["Buka klub.html dan tempel kode awal.", "Lengkapi baris ketiga: klub, hari, jam.", "Tambahkan satu baris klub keempat."],
        success: ["Tabel punya tiga kolom yang sama di setiap baris.", "Setiap klub punya hari dan jam."],
        snippet: [H(`  <!-- Pertemuan 5: jadwal klub -->
  <h2>Jadwal Klub</h2>
  <table>
    <tr><th>Klub</th><th>Hari</th><th>Jam</th></tr>
    <tr><td>Klub Lukis</td><td>Selasa</td><td>14.00</td></tr>
    <tr><td>Klub Bola</td><td>Kamis</td><td>14.00</td></tr>
    <tr><td>UBAH klub ketiga</td><td>UBAH hari</td><td>UBAH jam</td></tr>
  </table>
`, "klub.html")],
      },
      {
        title: "Tabel jadwal sekolah",
        goal: "Hari ini aku bisa membuat tabel jadwal dengan judul tabel dan bagian kepala.",
        example: "<caption> memberi judul tabel, <thead> memuat judul kolom, <tbody> memuat isi.",
        task: "Lengkapi tabel jadwal kegiatan sekolah di jadwal.html.",
        steps: ["Buka jadwal.html dan tempel kode awal.", "Ganti semua tulisan UBAH.", "Tambahkan satu baris untuk hari Selasa."],
        success: ["Tabel punya <caption>, <thead>, dan <tbody>.", "Semua sel jadwal terisi."],
        snippet: [H(`  <!-- Pertemuan 5: tabel jadwal -->
  <table>
    <caption>Jadwal Kegiatan Sekolah (fiktif)</caption>
    <thead><tr><th>Hari</th><th>Pagi</th><th>Siang</th></tr></thead>
    <tbody>
      <tr><td>Senin</td><td>Upacara</td><td>UBAH</td></tr>
      <tr><td>Rabu</td><td>UBAH</td><td>Klub Hobi</td></tr>
      <tr><td>Jumat</td><td>Senam</td><td>UBAH</td></tr>
    </tbody>
  </table>
`, "jadwal.html")],
        target: "jadwal.html menampilkan tabel dengan judul tabel dan empat baris hari.",
        hints: ["<thead> berisi satu baris judul kolom.", "Salin satu <tr> di <tbody> untuk menambah hari.", "Pastikan setiap baris punya tiga sel."],
      },
    ],
  },
  // 6
  {
    topic: "Mengatur warna, huruf, dan latar menggunakan CSS",
    opening: "Tanya: bagaimana sampul buku membuat kita tertarik? Warna dan huruf mengubah rasa halaman.",
    demo: "Tunjukkan tab CSS muncul. Ubah background-color di body dan lihat hasil seketika.",
    reflect: "Siswa menjelaskan satu pilihan warna dan alasannya, termasuk apakah tulisan masih mudah dibaca.",
    guide: [
      "Tab CSS baru dibuka di pertemuan ini. Jelaskan peran CSS: mengatur tampilan, bukan isi.",
      "Periksa kontras: tulisan terang di latar terang sulit dibaca.",
      "Sebelum menempel kode awal, pastikan index.html masih memuat <link rel=\"stylesheet\" href=\"style.css\">.",
    ],
    v: [
      {
        title: "Warna dan huruf hobiku",
        goal: "Hari ini aku bisa mengubah warna latar, warna tulisan, dan huruf.",
        example: "body { background-color: #fff7e0; } mengubah latar seluruh halaman.",
        task: "Pilih warna latar dan jenis huruf untuk websiteku.",
        steps: ["Buka tab CSS dan tempel kode awal.", "Ubah warna latar di baris UBAH.", "Coba jenis huruf lain, lalu pilih yang paling nyaman dibaca."],
        success: ["Latar websiteku berwarna sesuai pilihanku.", "Tulisan tetap mudah dibaca."],
        snippet: [C(`/* Pertemuan 6: warna, huruf, dan latar */
body {
  background-color: #fff7e0;   /* UBAH: coba warna latar lain */
  color: #14223f;
  font-family: Arial, sans-serif;   /* UBAH: coba Georgia, serif */
}
h1 { color: #0047ab; }
`)],
      },
      {
        title: "Warna ceria sekolah impian",
        goal: "Hari ini aku bisa memberi warna dan huruf berbeda untuk judul dan isi.",
        example: "h1, h2 { color: #0047ab; font-family: Georgia, serif; } mengubah semua judul sekaligus.",
        task: "Beri sekolah impianmu warna khas di semua halaman.",
        steps: ["Tempel kode awal di tab CSS.", "Ubah warna latar dan warna judul di baris UBAH.", "Buka klub.html di pratinjau dan lihat bahwa warnanya ikut berubah."],
        success: ["Dua halaman memakai warna yang sama.", "Judul dan isi memakai huruf yang berbeda."],
        snippet: [C(`/* Pertemuan 6: warna, huruf, dan latar */
body { background-color: #f4fbff; color: #14223f; font-family: Verdana, sans-serif; } /* UBAH: warna dan huruf isi */
h1, h2 { color: #0047ab; font-family: Georgia, serif; } /* UBAH: warna judul */
a { color: #b4531a; }
`)],
      },
      {
        title: "Palet warna sekolahku",
        goal: "Hari ini aku bisa membuat palet warna dengan variabel CSS.",
        example: ":root { --utama: #0047ab; } lalu color: var(--utama); memakai warna itu di banyak tempat.",
        task: "Tentukan tiga warna palet sekolahmu dan pakai di seluruh halaman.",
        steps: ["Tempel kode awal di tab CSS.", "Ubah dua warna di baris UBAH.", "Buka tiga halaman dan pastikan paletnya konsisten."],
        success: ["Tiga halaman memakai palet yang sama.", "Mengubah satu variabel mengubah seluruh website."],
        snippet: [C(`/* Pertemuan 6: palet warna dengan variabel */
:root {
  --utama: #0047ab;   /* UBAH: pilih warna utama */
  --latar: #fffaf0;   /* UBAH: pilih warna latar */
  --teks: #14223f;
}
body { background: var(--latar); color: var(--teks); font-family: Verdana, sans-serif; }
h1, h2 { color: var(--utama); }
a { color: var(--utama); }
`)],
        target: "Tiga halaman memakai latar, teks, dan warna judul yang sama dari variabel.",
        hints: ["Variabel dibuat dengan --nama dan dipakai dengan var(--nama).", "Ganti nilai di :root, bukan di setiap aturan.", "Uji kontras: tulisan gelap di latar terang."],
      },
    ],
  },
  // 7
  {
    topic: "Mengatur garis tepi dan jarak",
    opening: "Peragakan kotak hadiah: ada isi, bantalan di dalam, garis tepi, dan jarak ke kotak lain.",
    demo: "Beri border, padding, dan margin pada satu elemen, lalu ubah angkanya satu per satu.",
    reflect: "Siswa menjelaskan beda padding (ke dalam) dan margin (ke luar).",
    guide: [
      "Padding = jarak isi ke garis tepi. Margin = jarak garis tepi ke elemen lain.",
      "Gunakan angka kecil dulu (8–16px), lalu ubah satu nilai saja setiap kali.",
    ],
    v: [
      {
        title: "Kotak dan jarak",
        goal: "Hari ini aku bisa memberi garis tepi dan jarak pada daftar hobiku.",
        example: "border: 3px solid #0047ab; padding: 16px;",
        task: "Beri daftar hobiku garis tepi dan jarak yang nyaman.",
        steps: ["Tempel kode awal di tab CSS.", "Ubah tebal garis di baris UBAH.", "Ubah padding menjadi 24px lalu lihat bedanya."],
        success: ["Daftar hobiku punya garis tepi.", "Isi daftar tidak menempel pada garis."],
        snippet: [C(`/* Pertemuan 7: garis tepi dan jarak */
ul {
  border: 3px solid #0047ab;   /* UBAH: ubah tebal garis */
  padding: 16px 16px 16px 36px;   /* UBAH: ubah jarak ke dalam */
  margin: 20px 0;
}
`)],
      },
      {
        title: "Rapikan tabel dan judul",
        goal: "Hari ini aku bisa merapikan tabel jadwal klub dengan garis tepi dan jarak.",
        example: "th, td { border: 2px solid #0047ab; padding: 8px 14px; }",
        task: "Beri tabel jadwal klub garis tepi dan jarak yang rapi.",
        steps: ["Tempel kode awal di tab CSS.", "Ubah jarak di baris UBAH.", "Buka klub.html di pratinjau dan lihat tabelnya."],
        success: ["Tabel punya garis tepi yang jelas.", "Tulisan tidak menempel pada garis."],
        snippet: [C(`/* Pertemuan 7: garis tepi dan jarak */
table { border-collapse: collapse; margin: 16px 0; }
th, td { border: 2px solid #0047ab; padding: 8px 14px; } /* UBAH: ubah jarak */
th { background: #e4edfb; }
`)],
      },
      {
        title: "Tata ruang header, menu, dan isi",
        goal: "Hari ini aku bisa mengatur lebar, jarak, dan garis tepi halaman.",
        example: "body { max-width: 800px; margin: 0 auto; } membuat isi di tengah dan tidak terlalu lebar.",
        task: "Atur lebar isi, jarak menu, dan garis tepi tabel di tiga halaman.",
        steps: ["Tempel kode awal di tab CSS.", "Ubah ketebalan garis menu di baris UBAH.", "Periksa tiga halaman: apakah ruangnya konsisten?"],
        success: ["Isi halaman berada di tengah dengan lebar nyaman.", "Tabel dan menu punya jarak yang rapi."],
        snippet: [C(`/* Pertemuan 7: jarak dan garis tepi */
body { max-width: 800px; margin: 0 auto; padding: 16px; }
nav { padding: 12px 0; border-bottom: 3px solid var(--utama, #0047ab); }  /* UBAH: ubah ketebalan garis */
table { border-collapse: collapse; margin: 16px 0; }
th, td { border: 2px solid var(--utama, #0047ab); padding: 8px 12px; }
`)],
        target: "Isi halaman rata tengah dengan jarak nyaman; tabel dan menu punya garis tepi.",
        hints: ["margin: 0 auto membuat blok berada di tengah.", "max-width mencegah baris menjadi terlalu panjang.", "Coba ubah satu angka, lihat hasilnya, baru ubah angka lain."],
      },
    ],
  },
  // 8
  {
    topic: "Menggunakan class dan id",
    opening: "Tanya: bagaimana guru memanggil satu anak di antara banyak anak? Class untuk kelompok, id untuk satu elemen.",
    demo: "Beri class=\"sorot\" pada dua paragraf dan id=\"sapaan\" pada satu paragraf. Tunjukkan .sorot dan #sapaan di CSS.",
    reflect: "Siswa menjelaskan kapan memakai class dan kapan memakai id.",
    guide: [
      "Class diawali titik di CSS (.nama). Id diawali pagar (#nama). Id harus unik per halaman.",
      "Beri nama yang menjelaskan fungsi, bukan tampilan (misal .kartu, bukan .biru).",
    ],
    v: [
      {
        title: "Beri nama dengan class dan id",
        goal: "Hari ini aku bisa memberi nama pada elemen dengan class dan id.",
        example: "<p id=\"sapaan\" class=\"sorot\"> bisa diatur lewat #sapaan dan .sorot.",
        task: "Buat satu paragraf sorotan dan atur ukuran hurufnya dengan id.",
        steps: ["Tempel kode awal di tab HTML dan tab CSS.", "Ubah ukuran huruf #sapaan di baris UBAH.", "Beri class=\"sorot\" pada satu paragraf lain."],
        success: ["Dua elemen tampil dengan latar kuning.", "Sapaan memiliki ukuran huruf yang berbeda."],
        snippet: [
          H(`  <!-- Pertemuan 8: class dan id -->
  <p id="sapaan" class="sorot">Selamat datang di websiteku!</p> <!-- UBAH: ganti kalimatnya -->
`),
          C(`/* Pertemuan 8: class dan id */
.sorot { background-color: #ffe27a; padding: 8px; }
#sapaan { font-size: 24px; }  /* UBAH: ubah ukuran huruf */
`),
        ],
      },
      {
        title: "Class untuk kartu klub",
        goal: "Hari ini aku bisa membuat class .kartu untuk dipakai berulang.",
        example: ".kartu { border: 2px solid #0047ab; } dipakai oleh banyak <div class=\"kartu\">.",
        task: "Buat kartu sambutan di beranda memakai class dan id.",
        steps: ["Tempel kode awal di index.html dan CSS.", "Ubah kalimat sambutan di baris UBAH.", "Ubah warna judul kartu lewat #sambutan."],
        success: ["Kartu sambutan tampil dengan garis tepi.", "Aku bisa menyebut mana class dan mana id."],
        snippet: [
          H(`  <!-- Pertemuan 8: class untuk kartu -->
  <div class="kartu" id="sambutan">
    <h3>Sambutan Kepala Sekolah (fiktif)</h3>
    <p>UBAH: tulis sambutan singkat.</p>
  </div>
`),
          C(`/* Pertemuan 8: class .kartu dan id #sambutan */
.kartu { background: #fff; border: 2px solid #0047ab; border-radius: 12px; padding: 12px; }
#sambutan h3 { color: #b4531a; }
`),
        ],
      },
      {
        title: "Class aktif untuk menu",
        goal: "Hari ini aku bisa menandai menu halaman yang sedang dibuka dengan class.",
        example: "<a class=\"aktif\" href=\"jadwal.html\">Jadwal</a> memberi tanda pada menu yang sedang dibuka.",
        task: "Beri class aktif pada menu halaman yang sedang dibuka di tiga halaman.",
        steps: ["Tempel kode awal di tab CSS.", "Di setiap halaman, tambahkan class=\"aktif\" pada tautan halaman itu.", "Klik antarhalaman dan periksa penanda berpindah."],
        success: ["Menu halaman aktif berbeda warna di tiga halaman.", "Nama class mudah dimengerti."],
        snippet: [C(`/* Pertemuan 8: class aktif untuk menu */
nav a { padding: 6px 12px; border-radius: 8px; text-decoration: none; }
nav a.aktif { background: var(--utama, #0047ab); color: #fff; }  /* UBAH: ubah warna penanda */
`)],
        target: "Di setiap halaman, tautan menu halaman itu berwarna berbeda.",
        hints: ["Tambahkan class=\"aktif\" ke tag <a> yang sesuai.", "Hanya satu tautan per halaman yang boleh punya class aktif.", "Cek ulang setelah berpindah halaman di pratinjau."],
      },
    ],
  },
  // 9
  {
    topic: "Menata elemen menggunakan Flexbox",
    opening: "Tanya: bagaimana kita menata kursi berjajar? Flexbox menata elemen dalam satu baris atau kolom.",
    demo: "Beri display: flex pada pembungkus, lalu ubah gap dan flex-wrap.",
    reflect: "Siswa menjelaskan bedanya sebelum dan sesudah display: flex.",
    guide: [
      "Flexbox dipasang pada pembungkus (induk), bukan pada anak-anaknya.",
      "Ajak siswa mengecilkan lebar pratinjau (Ponsel) untuk melihat flex-wrap.",
      "Kelas 5: tunjukkan satu kartu; siswa membuat kartu berikutnya sendiri.",
    ],
    v: [
      {
        title: "Jajarkan hobiku dengan Flexbox",
        goal: "Hari ini aku bisa menjajarkan tiga kotak hobi dengan Flexbox.",
        example: ".deret-hobi { display: flex; gap: 12px; }",
        task: "Jajarkan tiga hobimu dalam satu baris.",
        steps: ["Tempel kode awal di tab HTML dan tab CSS.", "Ganti tiga tulisan UBAH dengan hobimu.", "Ubah gap menjadi 24px."],
        success: ["Tiga kotak hobi berjajar.", "Ada jarak antarkotak."],
        snippet: [
          H(`  <!-- Pertemuan 9: Flexbox -->
  <div class="deret-hobi">
    <div class="kotak-hobi">UBAH hobi 1</div>
    <div class="kotak-hobi">UBAH hobi 2</div>
    <div class="kotak-hobi">UBAH hobi 3</div>
  </div>
`),
          C(`/* Pertemuan 9: Flexbox */
.deret-hobi { display: flex; gap: 12px; }  /* UBAH: coba gap 24px */
.kotak-hobi { flex: 1; background: #e4edfb; border: 2px solid #0047ab; padding: 12px; text-align: center; }
`),
        ],
      },
      {
        title: "Buat kartu kegiatan klub",
        goal: "Hari ini aku bisa membuat kartu kegiatan klub dan menjajarkannya.",
        example: "Satu kartu berisi nama klub, hari, dan deskripsi. Flexbox menjajarkan beberapa kartu.",
        task: "Pelajari kartu contoh, lalu buat kartu klub berikutnya sendiri.",
        steps: ["Tempel kode awal di klub.html dan CSS.", "Salin satu kartu <div class=\"kartu\"> di tempat bertanda UBAH.", "Ganti isi kartu baru, lalu buat kartu ketiga."],
        success: ["Ada tiga kartu klub berjajar.", "Setiap kartu punya nama klub, hari, dan deskripsi."],
        snippet: [
          H(`  <!-- Pertemuan 9: kartu kegiatan dengan Flexbox -->
  <div class="deret-kartu">
    <div class="kartu">
      <h3>Klub Lukis</h3>
      <p>Hari: Selasa</p>
      <p>Belajar menggambar bersama.</p>
    </div>
    <!-- UBAH: salin kartu di atas, lalu ganti isinya untuk klub berikutnya -->
  </div>
`, "klub.html"),
          C(`/* Pertemuan 9: Flexbox untuk kartu */
.kartu { background: #fff; border: 2px solid #0047ab; border-radius: 12px; padding: 12px; }
.deret-kartu { display: flex; gap: 16px; flex-wrap: wrap; }  /* UBAH: coba gap lain */
.deret-kartu .kartu { flex: 1 1 200px; }
`),
        ],
      },
      {
        title: "Tata menu dan isi dengan Flexbox",
        goal: "Hari ini aku bisa menata menu dan dua kolom isi, serta menyesuaikan tampilan ponsel.",
        example: "@media (max-width: 600px) { … } berlaku hanya pada layar sempit seperti ponsel.",
        task: "Buat dua kolom Pengumuman dan Kegiatan yang menjadi satu kolom di ponsel.",
        steps: ["Tempel kode awal di index.html dan CSS.", "Isi dua kolom di baris UBAH.", "Ubah pratinjau ke Ponsel dan pastikan kolom menumpuk."],
        success: ["Di laptop ada dua kolom.", "Di ponsel kolom menumpuk ke bawah."],
        snippet: [
          H(`  <!-- Pertemuan 9: dua kolom -->
  <div class="dua-kolom">
    <div><h3>Pengumuman</h3><p>UBAH: tulis pengumuman fiktif.</p></div>
    <div><h3>Kegiatan Minggu Ini</h3><p>UBAH: tulis kegiatan.</p></div>
  </div>
`),
          C(`/* Pertemuan 9: Flexbox untuk menu dan isi + tampilan ponsel */
nav { display: flex; gap: 8px; flex-wrap: wrap; }
.dua-kolom { display: flex; gap: 16px; flex-wrap: wrap; }
.dua-kolom > div { flex: 1 1 260px; background: #fff; border: 2px solid var(--utama, #0047ab); border-radius: 12px; padding: 12px; }
@media (max-width: 600px) {
  .dua-kolom { flex-direction: column; }  /* UBAH: coba ubah titik 600px */
}
`),
        ],
        target: "Laptop: dua kolom berdampingan. Ponsel: dua kolom menumpuk ke bawah dan menu tidak terpotong.",
        hints: ["display: flex dipasang pada pembungkus .dua-kolom.", "flex-wrap: wrap menjaga menu tetap rapi di layar sempit.", "Gunakan tombol Ponsel di pratinjau untuk mengujinya."],
      },
    ],
  },
  // 10
  {
    topic: "Membuat halaman atau bagian khusus hobi",
    opening: "Tanya: kalau teman ingin tahu hobimu, bagian apa yang akan kamu tunjukkan? Rancang isi bagian khusus.",
    demo: "Rakit satu bagian: <section> berisi judul, gambar, paragraf, dan daftar.",
    reflect: "Siswa membacakan bagian hobinya dan menyebut satu bagian yang masih bisa ditambah.",
    guide: [
      "Gabungkan semua yang sudah dipelajari: judul, paragraf, daftar, gambar, class.",
      "Kelas 4: bagian khusus dalam satu halaman. Kelas 5: halaman klub lengkap. Kelas 6: halaman kegiatan dan klub dengan dua kolom.",
    ],
    v: [
      {
        title: "Bagian khusus hobiku",
        goal: "Hari ini aku bisa membuat satu bagian lengkap tentang hobi utamaku.",
        example: "Bagian hobi memuat judul, gambar, alasan menyukainya, dan daftar alat atau kegiatan.",
        task: "Isi bagian Hobi Utamaku dengan cerita dan dua butir daftar.",
        steps: ["Tempel kode awal di tab HTML.", "Ganti semua tulisan UBAH.", "Ganti gambar dengan gambar lain yang cocok dan isi teks alternatifnya."],
        success: ["Bagian hobi punya judul, gambar, paragraf, dan daftar.", "Gambar punya teks alternatif."],
        snippet: [H(`  <!-- Pertemuan 10: bagian khusus hobi -->
  <section id="hobi-utama" class="sorot">
    <h2>Hobi Utamaku: UBAH</h2>
    <img src="gambar/musik.svg" width="100" alt="UBAH: jelaskan gambar">
    <p>Aku suka UBAH karena UBAH.</p>
    <ul>
      <li>Alat yang kupakai: UBAH</li>
      <li>Kapan aku melakukannya: UBAH</li>
    </ul>
  </section>
`)],
      },
      {
        title: "Halaman klub lebih lengkap",
        goal: "Hari ini aku bisa melengkapi halaman klub favorit dengan cerita dan langkah belajar.",
        example: "Halaman klub memuat nama klub, gambar, jadwal, dan dua hal yang dipelajari.",
        task: "Lengkapi halaman Klub Favoritku dan sediakan tautan kembali ke beranda.",
        steps: ["Buka klub.html dan tempel kode awal.", "Ganti semua tulisan UBAH.", "Klik tautan kembali ke beranda di pratinjau."],
        success: ["Halaman klub punya gambar dan daftar bernomor.", "Tautan kembali ke beranda berfungsi."],
        snippet: [H(`  <!-- Pertemuan 10: halaman klub lebih lengkap -->
  <section id="klub-favorit">
    <h2>Klub Favoritku: UBAH</h2>
    <img src="gambar/bola.svg" width="100" alt="UBAH: jelaskan gambar">
    <p>Klub ini berlatih UBAH setiap UBAH.</p>
    <h3>Yang dipelajari</h3>
    <ol>
      <li>UBAH</li>
      <li>UBAH</li>
    </ol>
    <p><a href="index.html">Kembali ke beranda</a></p>
  </section>
`, "klub.html")],
      },
      {
        title: "Halaman kegiatan dan klub",
        goal: "Hari ini aku bisa merancang halaman kegiatan dan klub untuk sekolah fiktifku.",
        example: "Dua klub berdampingan memakai .dua-kolom yang sudah kubuat.",
        task: "Buat halaman kegiatan dengan dua klub dalam dua kolom.",
        steps: ["Buka klub.html dan tempel kode awal.", "Ganti semua tulisan UBAH, termasuk teks alternatif gambar.", "Periksa tampilan Ponsel dan Laptop."],
        success: ["Halaman klub tampil dua kolom di laptop.", "Halaman tetap rapi di ponsel."],
        snippet: [H(`  <!-- Pertemuan 10: halaman kegiatan dan klub -->
  <h2>Kegiatan dan Klub</h2>
  <div class="dua-kolom">
    <div>
      <h3>Klub UBAH</h3>
      <img src="gambar/gambar.svg" width="80" alt="UBAH: jelaskan gambar">
      <p>Berlatih UBAH setiap UBAH.</p>
    </div>
    <div>
      <h3>Klub UBAH</h3>
      <img src="gambar/musik.svg" width="80" alt="UBAH: jelaskan gambar">
      <p>Berlatih UBAH setiap UBAH.</p>
    </div>
  </div>
`, "klub.html")],
        target: "klub.html menampilkan dua klub berdampingan dengan gambar dan jadwal latihan.",
        hints: ["Pakai kembali class .dua-kolom dari pertemuan 9.", "Setiap klub: judul, gambar dengan alt, satu kalimat.", "Gunakan Ponsel untuk memeriksa kolom menumpuk."],
      },
    ],
  },
  // 11
  {
    topic: "Membuat formulir latihan dengan data fiktif",
    opening: "Tanya: formulir apa yang pernah kamu isi? Hari ini kita membuat formulir latihan; datanya fiktif dan tidak dikirim.",
    demo: "Buat <form> dengan <label> dan <input>. Tekan tombol dan tunjukkan hasil percobaan hanya tampil di pratinjau.",
    reflect: "Siswa menjelaskan mengapa data pada formulir latihan harus fiktif.",
    guide: [
      "Hasil percobaan hanya tampil di pratinjau; tidak ada data yang dikirim ke server.",
      "Gunakan nama samaran dan data fiktif. Jangan isi alamat, nomor telepon, atau nama asli.",
      "<label> membuat formulir mudah dipakai; hubungkan dengan for/id atau bungkus <input>.",
    ],
    v: [
      {
        title: "Formulir latihan hobi",
        goal: "Hari ini aku bisa membuat formulir latihan dengan kolom nama samaran dan pilihan hobi.",
        example: "<label for=\"nama\">Nama samaran:</label><input id=\"nama\" name=\"nama\">",
        task: "Buat formulir latihan lalu isi dengan data fiktif.",
        steps: ["Tempel kode awal di tab HTML.", "Isi nama samaran lalu tekan Coba kirim.", "Tambahkan satu pilihan hobi baru di <select>."],
        success: ["Hasil percobaan muncul di pratinjau.", "Aku memakai data fiktif."],
        snippet: [H(`  <!-- Pertemuan 11: formulir latihan (data fiktif) -->
  <h2>Formulir Latihan</h2>
  <form>
    <label for="nama">Nama samaran:</label>
    <input id="nama" name="nama" placeholder="Contoh: Si Bintang">
    <label for="hobi-fav">Hobi favorit:</label>
    <select id="hobi-fav" name="hobi">
      <option>Menggambar</option>
      <option>Olahraga</option>
      <option>Musik</option>
    </select>
    <button type="submit">Coba kirim</button>
  </form>
  <p>Ini hanya latihan. Hasilnya hanya muncul di pratinjau.</p>
`)],
      },
      {
        title: "Formulir daftar klub (latihan)",
        goal: "Hari ini aku bisa membuat formulir daftar klub dengan pilihan klub dan hari.",
        example: "<select> memberi pilihan klub; <input type=\"radio\"> memberi satu pilihan hari.",
        task: "Buat formulir pendaftaran klub latihan di halaman klub.",
        steps: ["Buka klub.html dan tempel kode awal.", "Tambahkan satu klub baru di <select>.", "Coba isi dan tekan Coba daftar."],
        success: ["Formulir punya kolom nama, pilihan klub, dan pilihan hari.", "Hasil percobaan muncul di pratinjau."],
        snippet: [H(`  <!-- Pertemuan 11: formulir daftar klub (latihan, data fiktif) -->
  <h2>Daftar Klub (Latihan)</h2>
  <form>
    <p><label>Nama samaran: <input name="nama" placeholder="Contoh: Si Pelangi"></label></p>
    <p><label>Pilih klub:
      <select name="klub">
        <option>Klub Lukis</option>
        <option>Klub Bola</option>
      </select>
    </label></p>
    <p>Hari:
      <label><input type="radio" name="hari" value="Selasa" checked> Selasa</label>
      <label><input type="radio" name="hari" value="Kamis"> Kamis</label>
    </p>
    <button type="submit">Coba daftar</button>
  </form>
  <p>Hanya latihan: tidak ada data yang dikirim.</p>
`, "klub.html")],
      },
      {
        title: "Formulir dengan aturan isian",
        goal: "Hari ini aku bisa membuat formulir yang meminta isian wajib.",
        example: "required meminta kolom diisi. minlength=\"3\" meminta minimal tiga huruf.",
        task: "Buat formulir latihan dengan tiga kolom wajib dan coba kirim saat kosong.",
        steps: ["Tempel kode awal di klub.html.", "Tekan Coba daftar saat kolom kosong dan amati pesannya.", "Isi data fiktif lalu kirim lagi."],
        success: ["Formulir menolak kolom kosong.", "Setelah diisi, hasil percobaan muncul di pratinjau."],
        snippet: [H(`  <!-- Pertemuan 11: formulir dengan aturan isian (data fiktif) -->
  <h2>Daftar Klub (Latihan)</h2>
  <form>
    <p><label>Nama samaran<br><input name="nama" required minlength="3"></label></p>
    <p><label>Kelas<br>
      <select name="kelas" required>
        <option value="">Pilih kelas</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
      </select>
    </label></p>
    <p><label>Alasan memilih klub<br><textarea name="alasan" rows="3" required></textarea></label></p>
    <button type="submit">Coba daftar</button>
  </form>
`, "klub.html")],
        target: "Formulir menolak isian kosong dan menampilkan hasil percobaan saat lengkap.",
        hints: ["required dipasang pada setiap kolom wajib.", "Pilihan pertama <select> dibuat kosong (value=\"\") agar wajib memilih.", "Gunakan data fiktif; jangan tulis nama asli."],
      },
    ],
  },
  // 12
  {
    topic: "Membuat tombol yang mengubah teks menggunakan JavaScript",
    opening: "Tanya: apa yang terjadi saat kita menekan bel? JavaScript membuat halaman bereaksi pada klik.",
    demo: "Tunjukkan tab JavaScript muncul. Tulis klik tombol yang mengubah textContent satu paragraf.",
    reflect: "Siswa menceritakan tiga langkah: pilih elemen, dengarkan klik, ubah teks.",
    guide: [
      "Tab JavaScript baru dibuka di pertemuan ini. Alurnya: ambil elemen → pasang pendengar klik → ubah textContent.",
      "id di HTML harus sama persis dengan yang dicari getElementById.",
      "Jika tombol tidak bereaksi, minta siswa memeriksa ejaan id dan kurung penutup.",
    ],
    v: [
      {
        title: "Tombol yang mengubah teks",
        goal: "Hari ini aku bisa membuat tombol yang mengubah satu tulisan.",
        example: "pesan.textContent = 'Aku suka menggambar!';",
        task: "Buat tombol “Coba tombolku” yang mengubah pesan menjadi kalimatmu.",
        steps: ["Tempel kode awal di tab HTML dan tab JavaScript.", "Ganti kalimat baru di baris UBAH.", "Tekan “Coba tombolku” di pratinjau."],
        success: ["Tulisan berubah saat tombol ditekan.", "Aku bisa menunjuk baris yang mengubah tulisan."],
        snippet: [
          H(`  <!-- Pertemuan 12: tombol yang mengubah teks -->
  <p id="pesan">Klik tombol di bawah ini.</p>
  <button id="tombol-pesan">Coba tombolku</button>
`),
          J(`// Pertemuan 12: tombol yang mengubah teks
const pesan = document.getElementById('pesan');
const tombolPesan = document.getElementById('tombol-pesan');
tombolPesan.addEventListener('click', function () {
  pesan.textContent = 'Aku suka UBAH-HOBI!'; // UBAH: tulis kalimat barumu
});
`),
        ],
      },
      {
        title: "Tombol info klub",
        goal: "Hari ini aku bisa membuat tombol yang menampilkan info klub.",
        example: "Saat tombol ditekan, tulisan “Tekan tombol…” berganti menjadi info klub.",
        task: "Buat tombol “Lihat info klub” di halaman klub dan ubah kalimat infonya.",
        steps: ["Tempel kode awal di klub.html dan script.js.", "Ubah kalimat info di baris UBAH.", "Tekan tombol di pratinjau halaman klub."],
        success: ["Info klub tampil saat tombol ditekan.", "Halaman lain tetap berjalan tanpa kesalahan."],
        snippet: [
          H(`  <!-- Pertemuan 12: tombol info klub -->
  <p id="info-klub">Tekan tombol untuk melihat info klub.</p>
  <button id="tombol-info">Lihat info klub</button>
`, "klub.html"),
          J(`// Pertemuan 12: tombol info klub (jalan jika tombolnya ada di halaman)
const tombolInfo = document.getElementById('tombol-info');
if (tombolInfo) {
  tombolInfo.addEventListener('click', function () {
    document.getElementById('info-klub').textContent = 'Klub Lukis berlatih setiap Selasa pukul 14.00. UBAH'; // UBAH: tulis info klubmu
  });
}
`),
        ],
      },
      {
        title: "Tombol sapaan yang berganti",
        goal: "Hari ini aku bisa membuat tombol yang mengganti sapaan dari daftar.",
        example: "Daftar sapaan disimpan di array. Setiap klik memilih sapaan berikutnya.",
        task: "Buat tombol sapaan yang berganti di beranda dengan tiga sapaan buatanmu.",
        steps: ["Tempel kode awal di index.html dan script.js.", "Ganti sapaan ketiga di baris UBAH.", "Klik tombol tiga kali dan amati urutannya."],
        success: ["Sapaan berganti setiap tombol ditekan.", "Setelah sapaan terakhir, kembali ke sapaan pertama."],
        snippet: [
          H(`  <!-- Pertemuan 12: sapaan yang berganti -->
  <p id="sapaan">Selamat datang!</p>
  <button id="tombol-sapaan">Sapaan berikutnya</button>
`),
          J(`// Pertemuan 12: sapaan yang berganti
const tombolSapaan = document.getElementById('tombol-sapaan');
if (tombolSapaan) {
  const daftarSapaan = ['Selamat pagi!', 'Selamat datang di sekolahku!', 'UBAH: tulis sapaan barumu'];
  let urutan = 0;
  tombolSapaan.addEventListener('click', function () {
    urutan = (urutan + 1) % daftarSapaan.length;
    document.getElementById('sapaan').textContent = daftarSapaan[urutan];
  });
}
`),
        ],
        target: "Setiap klik mengganti sapaan; setelah sapaan terakhir kembali ke yang pertama.",
        hints: ["Array menyimpan beberapa tulisan dalam satu daftar.", "% (sisa bagi) membuat urutan kembali ke 0.", "Jika tidak bereaksi, periksa id tombol di HTML dan di JavaScript."],
      },
    ],
  },
  // 13
  {
    topic: "Membuat kuis sesuai tingkat kelas",
    opening: "Tanya: bagaimana game kuis tahu jawaban kita benar? Program membandingkan pilihan dengan jawaban.",
    demo: "Tunjukkan satu soal dengan dua tombol. Satu tombol benar dan satu salah; umpan balik berubah.",
    reflect: "Siswa menjelaskan bagian mana pada kode yang menentukan jawaban benar.",
    guide: [
      "Kelas 4: satu soal dengan data-benar. Kelas 5: beberapa soal dalam array. Kelas 6: skor akhir.",
      "Ganti semua tulisan UBAH dengan soal tentang hobi atau klub, bukan data pribadi.",
      "Bantu siswa membaca pesan kesalahan; minta mereka menebak penyebabnya dulu.",
    ],
    v: [
      {
        title: "Kuis satu soal",
        goal: "Hari ini aku bisa membuat kuis satu soal tentang hobiku.",
        example: "if (tombol.dataset.benar === 'true') { … } else { … }",
        task: "Tulis satu soal dan dua pilihan, lalu tandai jawaban yang benar.",
        steps: ["Tempel kode awal di tab HTML dan tab JavaScript.", "Ganti soal dan pilihan di baris UBAH.", "Coba kedua tombol dan baca umpan baliknya."],
        success: ["Jawaban benar menampilkan “Benar!”.", "Jawaban salah menampilkan pesan mencoba lagi."],
        snippet: [
          H(`  <!-- Pertemuan 13: kuis satu soal -->
  <section id="kuis">
    <h2>Kuis Kecil</h2>
    <p id="soal">UBAH: tulis pertanyaanmu tentang hobi</p>
    <button class="pilihan" data-benar="false">UBAH pilihan A</button>
    <button class="pilihan" data-benar="true">UBAH pilihan B (jawaban benar)</button>
    <p id="hasil-kuis"></p>
  </section>
`),
          J(`// Pertemuan 13: kuis satu soal
const pilihan = document.querySelectorAll('.pilihan');
const hasilKuis = document.getElementById('hasil-kuis');
pilihan.forEach(function (tombol) {
  tombol.addEventListener('click', function () {
    if (tombol.dataset.benar === 'true') {
      hasilKuis.textContent = 'Benar! Hebat!';
    } else {
      hasilKuis.textContent = 'Belum tepat. Coba lagi!';
    }
  });
});
`),
        ],
      },
      {
        title: "Kuis klub beberapa soal",
        goal: "Hari ini aku bisa membuat kuis klub dengan beberapa soal.",
        example: "Soal disimpan dalam daftar. Program menampilkan satu soal, lalu pindah ke soal berikutnya.",
        task: "Ganti tiga soal contoh dengan soal tentang klub hobi sekolah impianmu.",
        steps: ["Tempel kode awal di klub.html dan script.js.", "Ganti soal dan pilihan di baris UBAH.", "Jawab semua soal sampai muncul “Kuis selesai!”."],
        success: ["Tiga soal tampil berurutan.", "Setiap jawaban mendapat umpan balik."],
        snippet: [
          H(`  <!-- Pertemuan 13: kuis klub -->
  <section id="kuis">
    <h2>Kuis Klub</h2>
    <p id="tempat-soal"></p>
    <div id="tempat-pilihan"></div>
    <p id="umpan-kuis"></p>
  </section>
`, "klub.html"),
          J(`// Pertemuan 13: kuis klub (tiga soal)
const tempatSoal = document.getElementById('tempat-soal');
if (tempatSoal) {
  const soal = [
    { tanya: 'Klub apa yang belajar menggambar?', pilihan: ['Klub Lukis', 'Klub Bola'], benar: 0 },
    { tanya: 'UBAH: tulis soal 2', pilihan: ['UBAH A', 'UBAH B'], benar: 1 },
    { tanya: 'UBAH: tulis soal 3', pilihan: ['UBAH A', 'UBAH B'], benar: 0 }
  ];
  let nomor = 0;
  const tempatPilihan = document.getElementById('tempat-pilihan');
  const umpan = document.getElementById('umpan-kuis');
  const tampilkanSoal = function () {
    if (nomor >= soal.length) {
      tempatSoal.textContent = 'Kuis selesai!';
      tempatPilihan.innerHTML = '';
      return;
    }
    const s = soal[nomor];
    tempatSoal.textContent = (nomor + 1) + '. ' + s.tanya;
    tempatPilihan.innerHTML = '';
    s.pilihan.forEach(function (teks, i) {
      const b = document.createElement('button');
      b.textContent = teks;
      b.addEventListener('click', function () {
        umpan.textContent = (i === s.benar) ? 'Benar!' : 'Belum tepat.';
        nomor = nomor + 1;
        setTimeout(function () { umpan.textContent = ''; tampilkanSoal(); }, 900);
      });
      tempatPilihan.appendChild(b);
    });
  };
  tampilkanSoal();
}
`),
        ],
      },
      {
        title: "Kuis berskor",
        goal: "Hari ini aku bisa membuat kuis yang menghitung skor.",
        example: "Setiap jawaban benar menambah skor: skor = skor + 1;",
        task: "Buat kuis tiga soal tentang klub dan tampilkan skor akhir.",
        steps: ["Tempel kode awal di klub.html dan script.js.", "Ganti soal dan pilihan di baris UBAH.", "Jawab sampai selesai dan periksa skor akhir."],
        success: ["Skor bertambah hanya saat jawaban benar.", "Skor akhir tampil dalam kalimat jelas."],
        snippet: [
          H(`  <!-- Pertemuan 13: kuis berskor -->
  <section id="kuis">
    <h2>Kuis Klub</h2>
    <p id="skor-teks">Skor: 0</p>
    <p id="tempat-soal"></p>
    <div id="tempat-pilihan"></div>
  </section>
`, "klub.html"),
          J(`// Pertemuan 13: kuis berskor
const tempatSoal = document.getElementById('tempat-soal');
if (tempatSoal) {
  const soal = [
    { tanya: 'UBAH: tulis soal 1', pilihan: ['UBAH A', 'UBAH B', 'UBAH C'], benar: 0 },
    { tanya: 'UBAH: tulis soal 2', pilihan: ['UBAH A', 'UBAH B', 'UBAH C'], benar: 1 },
    { tanya: 'UBAH: tulis soal 3', pilihan: ['UBAH A', 'UBAH B', 'UBAH C'], benar: 2 }
  ];
  let nomor = 0;
  let skor = 0;
  const tempatPilihan = document.getElementById('tempat-pilihan');
  const skorTeks = document.getElementById('skor-teks');
  const tampilkanSoal = function () {
    skorTeks.textContent = 'Skor: ' + skor;
    if (nomor >= soal.length) {
      tempatSoal.textContent = 'Selesai! Skor akhir: ' + skor + ' dari ' + soal.length;
      tempatPilihan.innerHTML = '';
      return;
    }
    const s = soal[nomor];
    tempatSoal.textContent = (nomor + 1) + '. ' + s.tanya;
    tempatPilihan.innerHTML = '';
    s.pilihan.forEach(function (teks, i) {
      const b = document.createElement('button');
      b.textContent = teks;
      b.addEventListener('click', function () {
        if (i === s.benar) { skor = skor + 1; }
        nomor = nomor + 1;
        tampilkanSoal();
      });
      tempatPilihan.appendChild(b);
    });
  };
  tampilkanSoal();
}
`),
        ],
        target: "Kuis tiga soal; setelah soal terakhir tampil “Selesai! Skor akhir: X dari 3”.",
        hints: ["Properti benar menyimpan nomor pilihan yang benar (mulai dari 0).", "skor bertambah hanya di dalam if (i === s.benar).", "Jika kuis kosong, periksa id tempat-soal dan tempat-pilihan di HTML."],
      },
    ],
  },
  // 14
  {
    topic: "Memeriksa privasi dan hak penggunaan gambar pada proyek sendiri",
    opening: "Tanya: kalau karya dilihat banyak orang, informasi apa yang harus dijaga? Gambar milik siapa yang boleh dipakai?",
    demo: "Jalankan “Periksa privasi”: alat mencari nomor telepon, email, alamat, dan gambar dari luar.",
    reflect: "Siswa menyebut satu hal yang ia ganti atau hapus dari karyanya dan alasannya.",
    guide: [
      "Gunakan perpustakaan gambar RakitWeb atau gambar buatan sendiri. Jangan menyalin gambar dari internet tanpa izin.",
      "Alat pemeriksa hanya membantu; periksa juga isi tulisan secara manual.",
      "Pakai nama samaran. Hindari nama asli, sekolah asli, alamat, nomor telepon, email, dan foto wajah.",
    ],
    tools: "privacy",
    v: [
      {
        title: "Periksa privasi dan gambar",
        goal: "Hari ini aku bisa memeriksa bahwa websiteku tidak memuat data pribadi dan memakai gambar yang boleh dipakai.",
        example: "Foto diri dengan nama sekolah dapat membuka tempatmu berada. Gambar dari RakitWeb aman dipakai.",
        task: "Jalankan Periksa privasi, perbaiki temuan, lalu tambahkan keterangan pembuat dan gambar.",
        steps: ["Tekan “Periksa privasi” dan baca hasilnya.", "Perbaiki setiap temuan di editor.", "Tempel kode awal untuk keterangan di bagian bawah halaman."],
        success: ["Tidak ada temuan yang tersisa.", "Halamanku punya keterangan pembuat dan sumber gambar."],
        snippet: [H(`  <!-- Pertemuan 14: privasi dan hak gambar -->
  <footer>
    <p>Dibuat oleh UBAH-NAMA-SAMARAN. Gambar: milik RakitWeb dan gambar buatan sendiri.</p> <!-- UBAH: ganti nama samaran -->
    <p>Data di website ini fiktif dan tidak berisi alamat atau nomor telepon.</p>
  </footer>
`)],
      },
      {
        title: "Periksa privasi dan kredit gambar",
        goal: "Hari ini aku bisa memeriksa dua halamanku dan menuliskan sumber gambar.",
        example: "Gambar buatan sendiri tidak perlu izin, tetapi gambar milik orang lain perlu izin dan sumber.",
        task: "Periksa privasi di kedua halaman dan tambahkan kredit gambar di keduanya.",
        steps: ["Tekan “Periksa privasi”; hasilnya mencakup semua halaman.", "Perbaiki temuan di index.html dan klub.html.", "Tempel kode awal agar kredit tampil di dua halaman."],
        success: ["Dua halaman lolos pemeriksaan privasi.", "Kedua halaman punya kredit gambar."],
        snippet: [
          H(`  <!-- Pertemuan 14: privasi dan kredit gambar -->
  <footer>
    <p>Sekolah ini fiktif. Gambar: milik RakitWeb dan buatan sendiri.</p>
    <p>Dibuat oleh UBAH-NAMA-SAMARAN untuk tugas kelas.</p> <!-- UBAH: ganti nama samaran -->
  </footer>
`),
          H(`  <!-- Pertemuan 14: privasi dan kredit gambar -->
  <footer>
    <p>Sekolah ini fiktif. Gambar: milik RakitWeb dan buatan sendiri.</p>
  </footer>
`, "klub.html"),
        ],
      },
      {
        title: "Periksa privasi tiga halaman",
        goal: "Hari ini aku bisa membuat aturan privasi dan kredit gambar yang konsisten di tiga halaman.",
        example: "Footer yang sama di tiga halaman membuat pembaca selalu tahu bahwa data website ini fiktif.",
        task: "Periksa tiga halaman, perbaiki temuan, dan pasang footer yang sama di semuanya.",
        steps: ["Tekan “Periksa privasi” dan catat temuan per halaman.", "Perbaiki semua temuan.", "Tempel footer di tiga halaman dan pastikan isinya sama."],
        success: ["Tidak ada data pribadi di tiga halaman.", "Footer konsisten di tiga halaman."],
        snippet: ["index.html", "jadwal.html", "klub.html"].map((f) =>
          H(`  <!-- Pertemuan 14: footer konsisten -->
  <footer>
    <p>Website sekolah fiktif. Gambar: milik RakitWeb dan buatan sendiri.</p>
    <p>Dibuat oleh UBAH-NAMA-SAMARAN.</p> <!-- UBAH: ganti nama samaran -->
  </footer>
`, f),
        ),
        target: "Alat pemeriksa tidak menemukan masalah dan tiga halaman memiliki footer sama.",
        hints: ["Hapus nomor telepon, email, dan alamat asli dari halaman.", "Gambar hanya dari folder gambar/ atau buatan sendiri.", "Salin footer yang sama ke tiga file."],
      },
    ],
  },
  // 15
  {
    topic: "Menyelesaikan proyek dan menguji tautan, tampilan, serta interaksi",
    opening: "Tanya: bagaimana tukang memeriksa rumah sebelum diserahkan? Kita menguji website seperti pembaca.",
    demo: "Jalankan “Periksa karyaku”: alat memeriksa tautan, teks alternatif, dan judul. Lalu uji klik secara manual.",
    reflect: "Siswa menyebut satu masalah yang ditemukan dan bagaimana memperbaikinya.",
    guide: [
      "Pengujian: tautan, tampilan (Ponsel dan Laptop), dan interaksi (tombol, formulir, kuis).",
      "Dorong siswa bertukar komputer dengan teman sebagai penguji tanpa bantuan pembuat.",
      "Alat pemeriksa tidak menggantikan uji klik; keduanya perlu.",
    ],
    tools: "linkcheck",
    v: [
      {
        title: "Selesaikan dan uji websiteku",
        goal: "Hari ini aku bisa menguji tautan, tampilan, dan tombol di websiteku.",
        example: "Daftar uji: klik tautan, lihat di Ponsel, tekan tombol, jawab kuis.",
        task: "Jalankan Periksa karyaku lalu uji semua tombol dan tautan.",
        steps: ["Tekan “Periksa karyaku” dan perbaiki temuan.", "Lihat hasil di Ponsel dan Laptop.", "Klik tombol hobi dan jawab kuis sampai selesai."],
        success: ["Tidak ada temuan pada Periksa karyaku.", "Semua tombol dan kuis berfungsi."],
      },
      {
        title: "Selesaikan dan uji sekolah impian",
        goal: "Hari ini aku bisa menguji tautan antarhalaman, tampilan, dan interaksi sekolah impianku.",
        example: "Dari beranda klik ke klub, lalu kembali. Di klub, tekan tombol info dan jawab kuis.",
        task: "Jalankan Periksa karyaku, perbaiki temuan, lalu minta temanmu mencoba tanpa bantuanmu.",
        steps: ["Tekan “Periksa karyaku” dan perbaiki temuan.", "Uji tautan beranda ke klub dan kembali.", "Minta temanmu menjalankan kuis dan tombol."],
        success: ["Tautan dua halaman berfungsi.", "Temanku menyelesaikan kuis tanpa bantuanku."],
      },
      {
        title: "Selesaikan dan uji website sekolahku",
        goal: "Hari ini aku bisa menyelesaikan website tiga halaman dan mengujinya di ponsel dan laptop.",
        example: "Daftar uji: sembilan klik navigasi, dua ukuran layar, tombol sapaan, kuis berskor.",
        task: "Jalankan uji lengkap tiga halaman dan perbaiki semua temuan.",
        steps: ["Tekan “Periksa karyaku” dan perbaiki temuan.", "Lakukan uji sembilan klik navigasi.", "Uji Ponsel dan Laptop, lalu uji kuis berskor."],
        success: ["Semua tautan navigasi berfungsi.", "Tampilan rapi di ponsel dan laptop."],
        target: "Tidak ada temuan; navigasi, tampilan ponsel, dan kuis berfungsi.",
        hints: ["Perbaiki temuan alat pemeriksa dahulu.", "Uji di Ponsel: pastikan menu dan kolom tidak terpotong.", "Minta temanmu menguji tanpa bantuan; catat bagian yang membuatnya bingung."],
      },
    ],
  },
  // 16
  {
    topic: "Mempresentasikan karya dan mengajukannya kepada guru untuk dipublikasikan di galeri kelas",
    opening: "Latihan bercerita: apa yang ingin diketahui temanmu tentang karyamu?",
    demo: "Peragakan presentasi tiga kalimat: apa karyaku, satu hal yang paling kusukai, satu hal yang kuperbaiki.",
    reflect: "Pendengar memberi satu hal yang ia sukai dan satu pertanyaan.",
    guide: [
      "Presentasi singkat (2–3 menit). Tidak perlu hafalan; cukup tiga kalimat dari panel presentasi.",
      "Setelah siswa menekan “Kirim ke guru”, karya muncul di Tinjau Karya. Guru dapat meminta perbaikan atau menampilkannya di galeri kelas.",
      "Galeri hanya dapat diakses anggota kelas dan memakai nama panggilan serta avatar.",
    ],
    tools: "present",
    v: [
      {
        title: "Presentasikan karyaku",
        goal: "Hari ini aku bisa mempresentasikan websiteku dan mengirimkannya ke guru.",
        example: "“Websiteku tentang hobi menggambar. Aku paling suka bagian jadwal. Aku memperbaiki tautan yang salah.”",
        task: "Lengkapi tiga kalimat presentasi, lalu tekan Kirim ke guru.",
        steps: ["Isi tiga kalimat presentasi.", "Presentasikan karyamu kepada temanmu.", "Tekan “Kirim ke guru” untuk diajukan ke galeri kelas."],
        success: ["Aku menyampaikan tiga kalimat presentasi.", "Karyaku sudah dikirim ke guru."],
      },
      {
        title: "Presentasikan sekolah impianku",
        goal: "Hari ini aku bisa mempresentasikan sekolah impianku dan mengajukannya ke galeri kelas.",
        example: "“Sekolah impianku punya Klub Lukis dan Klub Bola. Aku paling suka kartu klub. Aku memperbaiki tautan kembali ke beranda.”",
        task: "Lengkapi tiga kalimat presentasi, presentasikan, lalu kirim ke guru.",
        steps: ["Isi tiga kalimat presentasi.", "Presentasikan sambil menunjukkan tautan dan kartu klub.", "Tekan “Kirim ke guru”."],
        success: ["Aku menyampaikan presentasi dengan tenang.", "Karyaku sudah dikirim ke guru."],
      },
      {
        title: "Presentasikan website sekolahku",
        goal: "Hari ini aku bisa mempresentasikan website sekolahku dan menjelaskan pilihan desainnya.",
        example: "“Menu yang sama ada di semua halaman agar pembaca tidak tersesat. Di ponsel kolom menumpuk. Kuis menghitung skor.”",
        task: "Siapkan presentasi tiga kalimat tentang navigasi, tata letak ponsel, dan kuis, lalu kirim ke guru.",
        steps: ["Isi tiga kalimat presentasi.", "Presentasikan sambil mendemonstrasikan di Ponsel dan Laptop.", "Tekan “Kirim ke guru”."],
        success: ["Aku menjelaskan alasan navigasi dan tata letakku.", "Karyaku sudah dikirim ke guru."],
        target: "Presentasi tiga kalimat dengan demonstrasi navigasi, tampilan ponsel, dan kuis; karya terkirim.",
        hints: ["Mulai dengan apa tujuan websiteku.", "Tunjukkan satu keputusan desain dan alasannya.", "Akhiri dengan satu hal yang akan kuperbaiki."],
      },
    ],
  },
];
