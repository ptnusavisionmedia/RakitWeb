import type { Activity } from "./types";

export type V13 = {
  title: string;
  goal: string;
  example: string;
  task: string;
  steps: string[];
  success: string[];
  activity: Activity;
};
export type T13 = {
  topic: string;
  opening: string;
  demo: string;
  reflect: string;
  guide: string[];
  v: [V13, V13, V13];
};

export const K13: T13[] = [
  // 1
  {
    topic: "Mengenal website dan kegunaannya",
    opening: "Tanyakan: siapa pernah melihat gambar, cerita, atau jadwal di layar? Hubungkan dengan kata “website”.",
    demo: "Tunjukkan satu halaman web aman yang sudah Anda siapkan (misalnya website sekolah) dan tunjuk judul, gambar, serta tulisannya.",
    reflect: "Setiap anak menyebutkan satu hal yang bisa dilakukan dengan website.",
    guide: [
      "Siapkan contoh halaman web yang aman sebelum kelas; jangan membuka website bebas di depan anak.",
      "Bedakan “website” (kumpulan halaman) dari “aplikasi” dan “internet” dengan bahasa sederhana.",
      "Anak yang belum lancar membaca dapat dibantu membacakan soal; jawabannya cukup diketuk.",
    ],
    v: [
      {
        title: "Apa itu website?",
        goal: "Hari ini aku bisa menyebutkan satu kegunaan website.",
        example: "Website sekolah menampilkan jadwal dan foto kegiatan. Website cerita menampilkan gambar dan tulisan yang bisa dibaca.",
        task: "Ketuk jawaban yang tepat untuk dua pertanyaan.",
        steps: ["Lihat contoh website sekolah dari guru.", "Ketuk jawaban yang tepat.", "Ceritakan satu kegunaan website kepada temanmu."],
        success: ["Aku bisa bilang satu kegunaan website.", "Aku tahu website dibuka di layar."],
        activity: {
          type: "quiz",
          items: [
            { q: "Website dipakai untuk apa?", options: ["Membaca cerita dan melihat gambar", "Menggoreng nasi", "Menyapu halaman"], answer: 0, ok: "Tepat! Website menampilkan tulisan dan gambar.", no: "Belum tepat. Coba lagi, ya." },
            { q: "Website dibuka di mana?", options: ["Di layar", "Di dalam tas"], answer: 0, ok: "Benar, kita melihat website di layar.", no: "Belum tepat. Coba lagi, ya." },
          ],
        },
      },
      {
        title: "Website itu untuk apa saja?",
        goal: "Hari ini aku bisa menceritakan dua kegunaan website.",
        example: "Perpustakaan digital dipakai untuk membaca buku. Website sekolah dipakai untuk melihat pengumuman.",
        task: "Jawab tiga pertanyaan, lalu ceritakan satu website yang pernah kamu lihat bersama orang dewasa.",
        steps: ["Perhatikan dua contoh website dari guru.", "Jawab pertanyaan dengan mengetuk pilihan.", "Ceritakan satu kegunaan website dengan kalimatmu sendiri."],
        success: ["Aku bisa menyebut dua kegunaan website.", "Aku bisa menjelaskan satu contoh dengan kalimatku."],
        activity: {
          type: "quiz",
          items: [
            { q: "Mana yang bisa kita lihat di website sekolah?", options: ["Pengumuman dan jadwal", "Isi tas temanku", "Bau masakan kantin"], answer: 0, ok: "Tepat sekali.", no: "Belum tepat. Pikirkan lagi, ya." },
            { q: "Website perpustakaan digital dipakai untuk…", options: ["Membaca buku", "Mencuci piring"], answer: 0, ok: "Benar!", no: "Belum tepat. Coba lagi." },
            { q: "Website tersusun dari…", options: ["Tulisan, gambar, dan tombol", "Hanya suara"], answer: 0, ok: "Betul, itu bahan-bahan website.", no: "Belum tepat. Coba lagi." },
          ],
        },
      },
      {
        title: "Website di sekitar kita",
        goal: "Hari ini aku bisa mengelompokkan website menurut gunanya.",
        example: "Website berita dipakai untuk membaca kabar. Website permainan dipakai untuk bermain. Website sekolah dipakai untuk mencari informasi.",
        task: "Pasangkan tiga jenis website dengan gunanya, lalu pilih satu jenis yang ingin kamu buat.",
        steps: ["Bacalah tiga contoh website dari guru.", "Jawab pertanyaan pasangan guna.", "Tulis satu jenis website yang ingin kamu buat."],
        success: ["Aku bisa menyebut tiga jenis website.", "Aku bisa memilih jenis website untuk karyaku."],
        activity: {
          type: "quiz",
          items: [
            { q: "Website sekolah paling berguna untuk…", options: ["Mencari informasi dan pengumuman", "Memasak mi", "Mengisi bensin"], answer: 0, ok: "Tepat.", no: "Belum tepat. Coba lagi." },
            { q: "Website permainan dipakai untuk…", options: ["Bermain", "Menimbang beras"], answer: 0, ok: "Benar.", no: "Belum tepat. Coba lagi." },
            { q: "Website “Tentang Aku” cocok untuk…", options: ["Memperkenalkan diri dengan aman", "Membagikan alamat rumah"], answer: 0, ok: "Tepat. Kita memperkenalkan diri tanpa data pribadi.", no: "Hati-hati. Alamat rumah tidak boleh dipajang." },
          ],
        },
      },
    ],
  },
  // 2
  {
    topic: "Mencoba peramban, alamat web, dan tombol kembali (simulasi)",
    opening: "Tanyakan: bagaimana kita pergi ke halaman lain di layar? Perkenalkan “peramban” sebagai jendela untuk melihat website.",
    demo: "Peragakan di layar simulasi: ketuk tautan, lihat alamat berubah, lalu ketuk Kembali.",
    reflect: "Tanyakan: apa yang terjadi saat kamu menekan Kembali?",
    guide: [
      "Simulasi tidak membuka internet sungguhan; anak aman bereksperimen.",
      "Untuk kelas 1, cukup ketuk tautan dan tombol Kembali. Kelas 2 mengetik alamat. Kelas 3 menambah Maju dan Muat Ulang.",
      "Jika anak menekan Kembali di halaman pertama, jelaskan bahwa tidak ada halaman sebelumnya.",
    ],
    v: [
      {
        title: "Ayo jalan-jalan di peramban",
        goal: "Hari ini aku bisa pindah halaman lalu kembali.",
        example: "Di peramban, mengetuk tulisan “Hobi” membuka halaman hobi. Tombol Kembali membawa kita ke halaman tadi.",
        task: "Ketuk tautan, lalu ketuk Kembali.",
        steps: ["Ketuk tulisan “Halaman Hobi”.", "Ketuk tombol Kembali.", "Ketuk “Galeri” lalu Kembali lagi."],
        success: ["Aku bisa membuka halaman lain.", "Aku bisa kembali ke halaman tadi."],
        activity: { type: "browser", level: 1, missions: ["Ketuk “Halaman Hobi”.", "Ketuk tombol Kembali.", "Ketuk “Galeri”, lalu Kembali."] },
      },
      {
        title: "Alamat web dan tombol kembali",
        goal: "Hari ini aku bisa mengetik alamat web dan memakai tombol kembali.",
        example: "Alamat web seperti nama jalan menuju satu halaman. Contoh: sekolah-impian.web/hobi.",
        task: "Ketik alamat yang diminta, tekan Pergi, lalu kembali.",
        steps: ["Ketik alamat di kotak alamat.", "Tekan tombol Pergi.", "Tekan Kembali untuk melihat halaman sebelumnya."],
        success: ["Aku tahu alamat web ada di bagian atas.", "Aku bisa kembali dengan tombol Kembali."],
        activity: { type: "browser", level: 2, missions: ["Ketik sekolah-impian.web/hobi lalu tekan Pergi.", "Tekan Kembali.", "Ketik sekolah-impian.web/galeri lalu tekan Pergi."] },
      },
      {
        title: "Menjelajah dengan alamat dan peramban",
        goal: "Hari ini aku bisa berpindah halaman dengan alamat, Kembali, dan Maju.",
        example: "Setelah menekan Kembali, tombol Maju membawa kita ke halaman yang tadi kita tinggalkan.",
        task: "Selesaikan tiga misi jelajah di peramban simulasi.",
        steps: ["Buka halaman hobi lewat alamat.", "Kembali, lalu Maju.", "Tekan Muat Ulang dan ceritakan apa yang terjadi."],
        success: ["Aku bisa memakai Kembali dan Maju.", "Aku tahu alamat menunjukkan halaman yang sedang dibuka."],
        activity: { type: "browser", level: 3, missions: ["Ketik sekolah-impian.web/hobi lalu Pergi.", "Tekan Kembali, lalu Maju.", "Tekan Muat Ulang."] },
      },
    ],
  },
  // 3
  {
    topic: "Memilih informasi yang aman untuk ditampilkan",
    opening: "Tanyakan: apa yang boleh kita ceritakan kepada orang yang baru dikenal? Apa yang sebaiknya disimpan?",
    demo: "Tunjukkan dua kartu: “hobi menggambar” (aman) dan “alamat rumah” (jangan). Minta anak menjelaskan alasannya.",
    reflect: "Anak menyebutkan satu hal yang boleh dan satu hal yang tidak boleh ditampilkan.",
    guide: [
      "Tekankan: website bisa dilihat banyak orang. Data seperti alamat rumah, nomor telepon, dan nama lengkap tidak ditampilkan.",
      "Gunakan nama panggilan dan avatar ilustrasi, bukan foto wajah.",
      "Jika anak ingin menampilkan foto diri, arahkan memakai avatar dan bicarakan dengan orang tua.",
    ],
    v: [
      {
        title: "Mana yang aman dipajang?",
        goal: "Hari ini aku bisa memilih informasi yang aman.",
        example: "“Aku suka menggambar” aman dipajang. “Rumahku di Jalan Mawar” tidak aman dipajang.",
        task: "Ketuk “Aman” atau “Jangan” untuk setiap kartu.",
        steps: ["Baca kartu bersama guru.", "Ketuk Aman atau Jangan.", "Ceritakan alasannya."],
        success: ["Aku tahu alamat rumah tidak dipajang.", "Aku tahu hobi aman dipajang."],
        activity: {
          type: "safe",
          items: [
            { text: "Aku suka menggambar.", safe: true, why: "Hobi aman dipajang." },
            { text: "Rumahku di Jalan Mawar nomor 5.", safe: false, why: "Alamat rumah tidak boleh dipajang." },
            { text: "Namaku Bintang (panggilan).", safe: true, why: "Nama panggilan boleh dipakai." },
            { text: "Nomor telepon ibuku 08xx.", safe: false, why: "Nomor telepon tidak boleh dipajang." },
          ],
        },
      },
      {
        title: "Pilih cerita yang aman",
        goal: "Hari ini aku bisa memilah cerita yang aman dan yang harus dirahasiakan.",
        example: "Warna kesukaan aman diceritakan. Kata sandi dan nama lengkap tidak kita pajang.",
        task: "Pilah enam kartu menjadi “Aman” dan “Jangan”.",
        steps: ["Baca setiap kartu.", "Ketuk Aman atau Jangan.", "Pilih satu cerita aman untuk bagian “Hobiku”."],
        success: ["Aku bisa memilah cerita aman.", "Aku sudah memilih satu cerita aman untuk karyaku."],
        activity: {
          type: "safe",
          items: [
            { text: "Warna kesukaanku biru.", safe: true, why: "Warna kesukaan aman." },
            { text: "Kata sandi akunku adalah 1234.", safe: false, why: "Kata sandi rahasia, jangan dipajang." },
            { text: "Aku suka bermain bola.", safe: true, why: "Hobi aman dipajang." },
            { text: "Nama lengkap dan nama sekolahku.", safe: false, why: "Nama lengkap dan sekolah bisa dipakai untuk melacakmu." },
            { text: "Makanan kesukaanku bakso.", safe: true, why: "Makanan kesukaan aman." },
            { text: "Foto wajahku.", safe: false, why: "Pakai avatar ilustrasi, bukan foto wajah." },
          ],
        },
      },
      {
        title: "Menimbang informasi yang aman",
        goal: "Hari ini aku bisa menjelaskan alasan sebuah informasi aman atau tidak aman.",
        example: "Foto seragam dengan nama sekolah menunjukkan tempatmu berada, jadi lebih aman memakai avatar.",
        task: "Pilah delapan kartu dan baca alasan setiap jawaban.",
        steps: ["Baca setiap kartu dengan teliti.", "Ketuk Aman atau Jangan.", "Tulis satu aturan aman untuk halamanmu."],
        success: ["Aku bisa memberi alasan memilih informasi.", "Aku menulis satu aturan aman untuk halamanku."],
        activity: {
          type: "safe",
          items: [
            { text: "Hobiku membaca komik.", safe: true, why: "Hobi aman dipajang." },
            { text: "Foto aku memakai seragam sekolah.", safe: false, why: "Seragam menunjukkan sekolahmu; pakai avatar." },
            { text: "Jadwal les dan jam pulangku.", safe: false, why: "Jadwal pribadi menunjukkan kapan kamu sendirian." },
            { text: "Lagu favoritku.", safe: true, why: "Kesukaan umum aman." },
            { text: "Alamat email orang tuaku.", safe: false, why: "Kontak keluarga tidak dipajang." },
            { text: "Gambar buatanku sendiri.", safe: true, why: "Karya sendiri aman, tanpa data pribadi." },
            { text: "Tanggal lahir lengkap.", safe: false, why: "Tanggal lahir lengkap termasuk data pribadi." },
            { text: "Cita-citaku menjadi dokter hewan.", safe: true, why: "Cita-cita aman diceritakan." },
          ],
        },
      },
    ],
  },
  // 4
  {
    topic: "Mengenali judul, gambar, tombol, dan menu",
    opening: "Bawa sebuah buku: tunjuk judul, gambar, dan daftar isi. Tanyakan: bagian apa saja yang ada di halaman web?",
    demo: "Tunjuk bagian-bagian pada halaman contoh: judul di atas, gambar, tombol yang bisa diketuk, dan menu untuk pindah bagian.",
    reflect: "Anak menyebutkan bagian halaman yang paling ia suka dan alasannya.",
    guide: [
      "Hubungkan menu dengan daftar isi buku dan tombol dengan tombol bel.",
      "Kelas 2 menambah bagian teks; kelas 3 mengaitkan menu dengan bagian halaman.",
      "Minta anak menunjuk sebelum mengeklik; ini melatih kosakata.",
    ],
    v: [
      {
        title: "Kenali judul, gambar, tombol, dan menu",
        goal: "Hari ini aku bisa menunjuk judul, gambar, tombol, dan menu.",
        example: "Judul besar ada di atas. Menu berisi tulisan untuk pindah bagian. Tombol bisa diketuk.",
        task: "Ketuk bagian yang diminta pada halaman contoh.",
        steps: ["Baca perintah di atas halaman contoh.", "Ketuk bagian yang tepat.", "Sebutkan namanya dengan suara."],
        success: ["Aku bisa menunjuk judul.", "Aku bisa menunjuk gambar dan tombol."],
        activity: {
          type: "parts",
          targets: [
            { part: "judul", prompt: "Ketuk judul halaman." },
            { part: "gambar", prompt: "Ketuk gambar." },
            { part: "tombol", prompt: "Ketuk tombol." },
          ],
        },
      },
      {
        title: "Bagian-bagian halaman web",
        goal: "Hari ini aku bisa menyebut nama bagian halaman web.",
        example: "Judul memberi nama halaman. Teks bercerita. Gambar memperjelas cerita. Menu membantu pindah bagian.",
        task: "Ketuk empat bagian yang diminta pada halaman contoh.",
        steps: ["Baca perintah.", "Ketuk bagian yang tepat.", "Pikirkan bagian mana yang akan kamu pakai di karyamu."],
        success: ["Aku bisa menyebut empat bagian halaman.", "Aku tahu bagian yang akan kupakai."],
        activity: {
          type: "parts",
          targets: [
            { part: "judul", prompt: "Ketuk judul." },
            { part: "teks", prompt: "Ketuk tulisan cerita." },
            { part: "gambar", prompt: "Ketuk gambar." },
            { part: "menu", prompt: "Ketuk menu." },
          ],
        },
      },
      {
        title: "Menu, judul, gambar, dan tombol bekerja sama",
        goal: "Hari ini aku bisa menjelaskan tugas setiap bagian halaman.",
        example: "Menu “Hobi” membuat pembaca langsung menuju bagian hobi tanpa mencari-cari.",
        task: "Ketuk lima bagian yang diminta, lalu jelaskan gunanya kepada temanmu.",
        steps: ["Baca perintah.", "Ketuk bagian yang tepat.", "Jelaskan guna menu kepada temanmu."],
        success: ["Aku bisa menunjuk lima bagian halaman.", "Aku bisa menjelaskan guna menu."],
        activity: {
          type: "parts",
          targets: [
            { part: "menu", prompt: "Ketuk bagian yang membantu pindah ke bagian lain." },
            { part: "judul", prompt: "Ketuk bagian yang memberi nama halaman." },
            { part: "gambar", prompt: "Ketuk bagian yang memperjelas cerita." },
            { part: "teks", prompt: "Ketuk bagian yang bercerita dengan kata-kata." },
            { part: "tombol", prompt: "Ketuk bagian yang bisa ditekan." },
          ],
        },
      },
    ],
  },
  // 5
  {
    topic: "Menggambar rancangan “Tentang Aku” di kertas",
    opening: "Tunjukkan contoh sketsa rumah sebelum dibangun. Tanyakan: mengapa kita menggambar dulu sebelum membuat?",
    demo: "Tunjukkan sketsa contoh di layar. Gambar ulang di papan tulis dengan kotak, garis, dan tulisan kecil.",
    reflect: "Anak memperlihatkan sketsa kepada teman dan menyebut bagian yang paling ia sukai.",
    guide: [
      "Siapkan kertas dan pensil. Pertemuan ini dikerjakan di kertas, bukan di layar.",
      "Sketsa tidak harus bagus; yang penting ada tempat untuk setiap bagian.",
      "Foto sketsa tidak diperlukan; cukup tempelkan sketsa di buku kerja.",
    ],
    v: [
      {
        title: "Gambar rancangan Tentang Aku",
        goal: "Hari ini aku bisa menggambar rancangan halaman hobiku.",
        example: "Sketsa memiliki kotak untuk avatar, kotak untuk gambar hobi, dan garis untuk satu kalimat.",
        task: "Tiru sketsa contoh di kertas, lalu centang bagian yang sudah kamu gambar.",
        steps: ["Lihat sketsa contoh.", "Gambar kotak avatar, gambar hobi, dan garis kalimat di kertas.", "Centang bagian yang sudah selesai."],
        success: ["Sketsaku punya tempat avatar.", "Sketsaku punya tempat gambar hobi dan kalimat."],
        activity: { type: "sketch", level: 1, checklist: ["Aku menggambar kotak avatar.", "Aku menggambar kotak gambar hobi.", "Aku menggambar garis untuk kalimat."] },
      },
      {
        title: "Sketsa tiga bagian ceritaku",
        goal: "Hari ini aku bisa menggambar rancangan tiga bagian: Halo!, Hobiku, Kesukaanku.",
        example: "Setiap bagian punya judul kecil, satu gambar, dan satu kalimat.",
        task: "Gambar tiga kotak berurutan di kertas dan beri judulnya.",
        steps: ["Lihat sketsa contoh.", "Gambar tiga kotak berurutan.", "Tulis judul setiap bagian dan centang daftar."],
        success: ["Sketsaku punya tiga bagian.", "Setiap bagian punya judul dan tempat gambar."],
        activity: { type: "sketch", level: 2, checklist: ["Aku menggambar bagian “Halo!”.", "Aku menggambar bagian “Hobiku”.", "Aku menggambar bagian “Kesukaanku”.", "Aku menulis judul pada setiap bagian."] },
      },
      {
        title: "Rancang sketsa halaman jelajah",
        goal: "Hari ini aku bisa menggambar rancangan halaman dengan menu dan galeri.",
        example: "Menu ada di bagian atas. Di bawahnya ada bagian perkenalan, hobi, dan galeri gambar.",
        task: "Gambar sketsa dengan menu, tiga bagian, dan galeri, lalu centang daftar periksa.",
        steps: ["Lihat sketsa contoh.", "Gambar menu dan tiga bagian.", "Beri panah dari menu ke bagian yang dituju."],
        success: ["Sketsaku punya menu dan tiga bagian.", "Setiap tulisan menu punya panah ke bagiannya."],
        activity: { type: "sketch", level: 3, checklist: ["Aku menggambar menu di atas.", "Aku menggambar bagian perkenalan, hobi, dan galeri.", "Aku menggambar panah dari menu ke bagian.", "Aku menulis rencana warna."] },
      },
    ],
  },
  // 6
  {
    topic: "Menyusun rancangan di editor visual",
    opening: "Lihat sketsa buatan sendiri. Tanyakan: bagian mana yang kita buat dulu?",
    demo: "Peragakan memilih satu bagian, memindahkannya dengan Naik/Turun atau menyeret, lalu menekan Urungkan.",
    reflect: "Anak menekan “Lihat hasil” dan menceritakan satu bagian yang ia susun.",
    guide: [
      "Pertemuan ini hanya membuka alat menyusun: pilih, ubah isi, Naik/Turun. Warna dibuka di pertemuan berikutnya.",
      "Karya tersimpan otomatis; tidak perlu tombol simpan.",
      "Dampingi anak yang kesulitan menyeret dengan tombol Naik dan Turun.",
    ],
    v: [
      {
        title: "Susun halaman hobimu",
        goal: "Hari ini aku bisa menyusun halaman hobiku dari pilihan yang tersedia.",
        example: "Pilih avatar “Kiko”, gambar hobi bola, dan kalimat “Aku suka bermain bola.” Susun dari atas ke bawah.",
        task: "Ikuti petunjuk satu per satu sampai halamanmu tersusun.",
        steps: ["Pilih avatarmu.", "Pilih gambar hobimu dan satu kalimat.", "Susun urutan dengan Naik dan Turun, lalu tekan Lihat hasil."],
        success: ["Halamanku punya avatar, gambar hobi, dan kalimat.", "Aku bisa mengubah urutan bagian."],
        activity: { type: "editor", step: 6 },
      },
      {
        title: "Susun Halo, Hobiku, Kesukaanku",
        goal: "Hari ini aku bisa menyusun tiga bagian ceritaku.",
        example: "Bagian “Halo!” berisi sapaan: “Halo! Namaku Bintang.” Kalimat contoh boleh diubah.",
        task: "Isi satu kalimat pendek di setiap bagian dan atur urutannya.",
        steps: ["Pilih gambar untuk setiap bagian.", "Tulis atau ubah satu kalimat contoh.", "Atur urutan dengan Naik dan Turun, lalu tekan Lihat hasil."],
        success: ["Setiap bagian punya gambar dan satu kalimat.", "Urutan bagian sesuai sketsaku."],
        activity: { type: "editor", step: 6 },
      },
      {
        title: "Rakit bagian dan menu halamanku",
        goal: "Hari ini aku bisa merakit bagian halaman dan menghubungkan menu.",
        example: "Menu “Hobi” dihubungkan ke bagian Hobi. Saat diketuk, halaman bergeser ke bagian itu.",
        task: "Susun bagian perkenalan, hobi, dan galeri, lalu hubungkan setiap tulisan menu.",
        steps: ["Tambah dan isi bagian perkenalan, hobi, galeri.", "Tambah menu dan hubungkan setiap tulisan ke bagiannya.", "Tekan Lihat hasil, lalu ketuk menu untuk mencoba."],
        success: ["Halamanku punya tiga bagian dan satu menu.", "Setiap tulisan menu membawa ke bagian yang benar."],
        activity: { type: "editor", step: 6 },
      },
    ],
  },
  // 7
  {
    topic: "Menambahkan gambar, memilih warna, dan mencoba halaman",
    opening: "Tunjukkan dua halaman yang sama dengan warna berbeda. Tanyakan: mana yang lebih nyaman dibaca?",
    demo: "Peragakan mengganti gambar, memilih warna, lalu menekan Lihat hasil untuk mencoba halaman seperti pembaca.",
    reflect: "Anak menjelaskan mengapa ia memilih warna tertentu.",
    guide: [
      "Pertemuan ini membuka alat gambar dan warna. Ingatkan: tulisan harus tetap mudah dibaca.",
      "Minta anak mencoba halamannya sendiri seperti pembaca, bukan sebagai pembuat.",
      "Untuk kelas 3, lihat apakah menu masih membawa ke bagian yang benar setelah perubahan.",
    ],
    v: [
      {
        title: "Beri gambar dan warna",
        goal: "Hari ini aku bisa memilih warna dan mengganti gambar halamanku.",
        example: "Warna kuning membuat halaman terasa hangat. Warna biru membuat halaman terasa tenang.",
        task: "Pilih warna halaman, ganti gambar jika mau, lalu lihat hasilnya.",
        steps: ["Pilih warna halamanmu.", "Ganti gambar hobi jika mau.", "Tekan Lihat hasil."],
        success: ["Halamanku punya warna pilihanku.", "Tulisan di halamanku mudah dibaca."],
        activity: { type: "editor", step: 7 },
      },
      {
        title: "Tambah gambar dan warna ceritaku",
        goal: "Hari ini aku bisa memperindah ceritaku dengan gambar dan warna.",
        example: "Gambar buku cocok untuk “Kesukaanku” jika kamu suka membaca.",
        task: "Ganti gambar di tiap bagian, pilih warna, lalu coba halamanmu.",
        steps: ["Pilih gambar yang cocok untuk setiap bagian.", "Pilih warna halaman.", "Tekan Lihat hasil dan baca ceritamu sekali."],
        success: ["Setiap bagian punya gambar yang cocok.", "Aku sudah mencoba halamanku seperti pembaca."],
        activity: { type: "editor", step: 7 },
      },
      {
        title: "Isi galeri, pilih warna, coba halaman",
        goal: "Hari ini aku bisa mengisi galeri dan menguji halamanku.",
        example: "Galeri berisi tiga gambar yang menggambarkan hobimu. Warna latar tidak boleh membuat tulisan sulit dibaca.",
        task: "Isi galeri dengan tiga gambar, pilih warna, lalu coba menu di hasil.",
        steps: ["Pilih tiga gambar untuk galeri.", "Pilih warna halaman.", "Tekan Lihat hasil dan coba semua tulisan menu."],
        success: ["Galeriku berisi tiga gambar.", "Semua tulisan menu membawa ke bagian yang benar."],
        activity: { type: "editor", step: 7 },
      },
    ],
  },
  // 8
  {
    topic: "Memperlihatkan karya kepada orang tua atau teman dan menceritakan satu pilihan desain",
    opening: "Latihan: ceritakan satu pilihan dengan kalimat “Aku memilih … karena …”.",
    demo: "Peragakan menunjukkan karya: tunjuk satu bagian, lalu ceritakan alasannya dengan tenang.",
    reflect: "Pendengar menyebutkan satu hal yang ia sukai dari karya temannya.",
    guide: [
      "Dorong anak bercerita tentang pilihannya, bukan menilai teman.",
      "Gunakan perangkat sekolah untuk mempertunjukkan; karya tidak dibagikan di luar kelas.",
      "Setelah selesai, anak boleh menekan “Kirim ke guru” agar karya muncul di Tinjau Karya.",
    ],
    v: [
      {
        title: "Tunjukkan halamanku",
        goal: "Hari ini aku bisa menunjukkan halamanku dan menceritakan satu pilihanku.",
        example: "“Aku memilih warna biru karena aku suka laut.”",
        task: "Lihat hasil karyamu, pilih kalimat ceritamu, lalu kirim ke guru.",
        steps: ["Tekan Lihat hasil.", "Pilih satu kalimat cerita pilihanku.", "Tekan Kirim ke guru."],
        success: ["Aku bisa menyebut satu pilihan di karyaku.", "Karyaku sudah dikirim ke guru."],
        activity: { type: "editor", step: 8 },
      },
      {
        title: "Ceritakan karyaku",
        goal: "Hari ini aku bisa bercerita tentang satu pilihan di ceritaku.",
        example: "“Aku memilih gambar buku karena aku suka membaca.”",
        task: "Tunjukkan karyamu kepada temanmu, ceritakan satu pilihan, lalu kirim ke guru.",
        steps: ["Tekan Lihat hasil.", "Ceritakan satu pilihanmu kepada temanmu.", "Tekan Kirim ke guru."],
        success: ["Aku bisa menjelaskan satu pilihan desain.", "Karyaku sudah dikirim ke guru."],
        activity: { type: "editor", step: 8 },
      },
      {
        title: "Temanku mencoba halamanku",
        goal: "Hari ini aku bisa melihat apakah temanku bisa memakai menuku.",
        example: "Temanmu mencoba menemukan bagian Hobi hanya dengan mengetuk menu, tanpa bantuanmu.",
        task: "Minta temanmu menemukan bagian Hobi memakai menu, catat hasilnya, lalu kirim ke guru.",
        steps: ["Tekan Lihat hasil dan serahkan layar kepada temanmu.", "Amati: apakah temanmu menemukan bagian Hobi dari menu?", "Catat hasilnya, lalu tekan Kirim ke guru."],
        success: ["Temanku menemukan bagian Hobi memakai menu.", "Aku bisa menyebut satu bagian yang bisa diperbaiki."],
        activity: { type: "editor", step: 8 },
      },
    ],
  },
];
