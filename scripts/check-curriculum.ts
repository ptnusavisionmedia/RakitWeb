// Pemeriksaan otomatis kurikulum: npx tsx scripts/check-curriculum.ts
import { ALL_LESSONS, CLASSES } from "../lib/curriculum";
import { applySnippets, linkScan } from "../lib/code";
import { starterFiles } from "../lib/starter";

let bad = 0;
const fail = (m: string) => { console.log("GAGAL:", m); bad++; };

if (ALL_LESSONS.length !== 72) fail(`jumlah pertemuan ${ALL_LESSONS.length} ≠ 72`);
for (const c of CLASSES) {
  const ls = ALL_LESSONS.filter((l) => l.level === c.level);
  if (ls.length !== c.meetings) fail(`kelas ${c.level}: ${ls.length} ≠ ${c.meetings}`);
  for (const l of ls) {
    const mins = l.timing.reduce((a, t) => a + t.minutes, 0);
    if (mins !== c.minutes) fail(`${l.id}: total waktu ${mins} ≠ ${c.minutes}`);
    for (const k of ["title", "goal", "example", "task"] as const) if (!l[k]?.trim()) fail(`${l.id}: ${k} kosong`);
    if (!l.goal.startsWith("Hari ini aku bisa")) fail(`${l.id}: target tidak diawali “Hari ini aku bisa”`);
    if (l.steps.length < 3 || l.success.length < 2 || l.guide.length < 3) fail(`${l.id}: langkah/tanda/panduan kurang`);
    if (c.mode === "visual" && !l.activity) fail(`${l.id}: aktivitas kosong`);
    if (c.mode === "code" && l.no >= 2 && l.no <= 13 && l.no !== 1 && !(l.snippet?.length) && ![1].includes(l.no)) fail(`${l.id}: tanpa kode awal`);
  }
  // judul antarkelas pada topik sama harus berbeda
}
for (let no = 1; no <= 16; no++) {
  const t = [4, 5, 6].map((k) => ALL_LESSONS.find((l) => l.level === k && l.no === no)!.task);
  if (new Set(t).size !== 3) fail(`pertemuan ${no} kelas 4–6: tugas tidak dibedakan`);
}
for (let no = 1; no <= 8; no++) {
  const t = [1, 2, 3].map((k) => ALL_LESSONS.find((l) => l.level === k && l.no === no)!.task);
  if (new Set(t).size !== 3) fail(`pertemuan ${no} kelas 1–3: tugas tidak dibedakan`);
}

// tempel semua kode awal berurutan; JS harus valid dan pratinjau tidak boleh punya tautan rusak selain yang disengaja
for (const level of [4, 5, 6] as const) {
  let files = starterFiles(level);
  for (const l of ALL_LESSONS.filter((x) => x.level === level)) {
    if (l.snippet) files = applySnippets(files, l.snippet);
    try { new Function(files["script.js"]); } catch (e) { fail(`${l.id}: JavaScript tidak valid setelah kode awal: ${(e as Error).message}`); }
    const again = l.snippet ? applySnippets(files, l.snippet) : files;
    if (JSON.stringify(again) !== JSON.stringify(files)) fail(`${l.id}: tempel dua kali mengubah isi`);
  }
  const issues = linkScan(files).filter((f) => !/UBAH/.test(f.text));
  console.log(`kelas ${level}: temuan setelah semua kode awal (selain UBAH):`, issues.map((i) => `${i.file}: ${i.text}`));
}
console.log(bad === 0 ? `OK: ${ALL_LESSONS.length} pertemuan lengkap` : `${bad} masalah`);
process.exit(bad ? 1 : 0);
