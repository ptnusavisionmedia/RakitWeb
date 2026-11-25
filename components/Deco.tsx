const PATHS: Record<string, string[]> = {
  buku: ["M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z", "M4 20.5A2.5 2.5 0 0 0 6.5 21H20"],
  kode: ["m8 8-4 4 4 4", "m16 8 4 4-4 4", "m13.5 5-3 14"],
  kirim: ["M21 3 10 14", "m21 3-7 18-4-7-7-4 18-7Z"],
  galeri: ["M3 5h18v14H3z", "m3 16 5-5 4 4 3-3 6 6", "M15.5 9.5h.01"],
  kelas: ["M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19", "M10 10.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", "M20 19v-1.5a3.5 3.5 0 0 0-2.5-3.3", "M15.5 4.7a3 3 0 0 1 0 5.6"],
  jam: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 7v5l3 2"],
  cek: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "m8 12 3 3 5-6"],
  layar: ["M3 4h18v12H3z", "M8 20h8", "M12 16v4"],
  komentar: ["M4 5h16v11H9l-5 4V5Z", "M8 9h8", "M8 12h5"],
  target: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M12 12h.01"],
  susun: ["M4 4h7v7H4z", "M13 4h7v4h-7z", "M13 11h7v9h-7z", "M4 14h7v6H4z"],
  keluar: ["M9 4H5v16h4", "M16 8l4 4-4 4", "M20 12H9"],
  kunci: ["M6 10h12v10H6z", "M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10"],
};

export type IkonName = keyof typeof PATHS;

export function Ikon({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
      {(PATHS[name] ?? PATHS.kode).map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

/** Kotak ikon berlatar biru muda. */
export function IkonKotak({ name, gelap = false }: { name: string; gelap?: boolean }) {
  return (
    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${gelap ? "bg-white/10 text-white" : "bg-kobalt-muda text-kobalt"}`}>
      <Ikon name={name} />
    </span>
  );
}

const CODE: [number, string, string][] = [
  [0, "<main>", "t"],
  [1, "<h1>", "t"], [2, "Klub Hobi Sekolah", "x"], [1, "</h1>", "t"],
  [1, "<p class=\"sapa\">", "t"], [2, "Halo, selamat datang!", "x"], [1, "</p>", "t"],
  [1, "<a href=\"klub.html\">", "t"], [2, "Lihat daftar klub", "x"], [1, "</a>", "t"],
  [0, "</main>", "t"],
];

/** Ilustrasi editor kode dan pratinjau. Murni hiasan. */
export function JendelaKode({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative select-none ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-tinta shadow-[0_24px_60px_-20px_rgba(20,34,63,.55)]">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          <span className="ml-3 rounded-md bg-white/10 px-2.5 py-1 font-kode text-[11px] text-white/80">index.html</span>
          <span className="rounded-md px-2.5 py-1 font-kode text-[11px] text-white/40">style.css</span>
        </div>
        <div className="px-4 py-4 font-kode text-[12.5px] leading-[1.9]">
          {CODE.map(([ind, text, kind], i) => (
            <div key={i} className="flex gap-4">
              <span className="w-4 text-right text-white/25">{i + 1}</span>
              <span style={{ paddingLeft: ind * 16 }} className={kind === "t" ? "text-[#8fb4f5]" : "text-white/90"}>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="anim-melayang absolute -bottom-8 right-[-8px] w-[58%] overflow-hidden rounded-xl border border-tinta/10 bg-white shadow-[0_18px_40px_-12px_rgba(20,34,63,.35)] sm:right-[-24px]">
        <div className="flex items-center gap-2 border-b border-tinta/10 bg-kertas-2/70 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-tinta/20" />
          <span className="h-4 flex-1 rounded bg-white font-kode text-[9px] leading-4 text-tinta-2">&nbsp;&nbsp;sekolah/index.html</span>
        </div>
        <div className="p-4">
          <p className="font-judul text-[15px] font-bold leading-tight">Klub Hobi Sekolah</p>
          <p className="mt-1 text-[11px] text-tinta-2">Halo, selamat datang!</p>
          <span className="mt-3 inline-block rounded-md bg-kobalt px-2.5 py-1 font-judul text-[10px] font-semibold text-white">Lihat daftar klub</span>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 flex flex-wrap items-center justify-between gap-2 border-t border-tinta/10 pt-5 text-xs text-tinta-2">
      <span className="font-judul font-bold text-tinta">Rakit<span className="text-kobalt">Web</span></span>
      <span>Kursus membuat website untuk kelas 1–6 SD · 72 pertemuan</span>
    </footer>
  );
}
