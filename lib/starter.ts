import type { ClassLevel } from "./curriculum/types";

export type Files = Record<string, string>;

export function pagesOf(level: number): string[] {
  if (level === 5) return ["index.html", "klub.html"];
  if (level === 6) return ["index.html", "jadwal.html", "klub.html"];
  return ["index.html"];
}

const page = (title: string, body: string) => `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${body}
  <script src="script.js"></script>
</body>
</html>
`;

export function starterFiles(level: ClassLevel): Files {
  const files: Files = {
    "style.css": "/* CSS dipakai mulai pertemuan 6. File ini sudah dihubungkan ke halaman. */\n",
    "script.js": "// JavaScript dipakai mulai pertemuan 12. File ini sudah dihubungkan ke halaman.\n",
  };
  const h1 = `  <h1>Halo, dunia!</h1> <!-- UBAH: ganti tulisan ini -->`;
  if (level === 4) files["index.html"] = page("Website Hobiku", h1);
  if (level === 5) {
    files["index.html"] = page("SD Pelangi Impian", h1);
    files["klub.html"] = page("Klub Hobi", `  <h1>Klub Hobi</h1>`);
  }
  if (level === 6) {
    files["index.html"] = page("Beranda Sekolahku", h1);
    files["jadwal.html"] = page("Jadwal", `  <h1>Jadwal</h1>`);
    files["klub.html"] = page("Kegiatan dan Klub", `  <h1>Kegiatan dan Klub</h1>`);
  }
  return files;
}
