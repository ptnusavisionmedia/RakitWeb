"use client";

import { useEffect, useRef, useState } from "react";
import { Art } from "@/lib/art";
import type { PartTarget, QuizQ, SafeItem } from "@/lib/curriculum/types";
import { post } from "@/lib/client";
import { Ikon } from "./Deco";

/** Mengirim hasil latihan ke server. Nilai dihitung di server; kegagalan jaringan tidak mengganggu siswa. */
function sendResult(no: number, data: unknown) {
  void post("/api/progress", { no, action: "result", data });
}

/** Kirim daftar misi setelah siswa berhenti mencentang. */
function useSendChecks(no: number, done: boolean[]) {
  useEffect(() => {
    if (!done.some(Boolean)) return;
    const h = setTimeout(() => sendResult(no, { checks: done }), 700);
    return () => clearTimeout(h);
  }, [no, done]);
}

/* ---------- kerangka bersama: judul, cara mengerjakan, kemajuan ---------- */

function Frame({ icon, kind, how, step, total, score, children }: { icon: string; kind: string; how: string; step?: number; total?: number; score?: number; children: React.ReactNode }) {
  return (
    <section className="kartu overflow-hidden" aria-label={`Latihan: ${kind}`}>
      <header className="pita !rounded-none px-6 py-5 !shadow-none">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15"><Ikon name={icon} size={22} /></span>
          <div className="min-w-0 flex-1">
            <p className="label-kecil">Latihan · {kind}</p>
            <p className="mt-1 font-judul text-lg font-bold leading-snug">{how}</p>
          </div>
          {score !== undefined && total !== undefined && (
            <div className="hidden shrink-0 text-right sm:block">
              <p className="label-kecil">Benar</p>
              <p className="font-judul text-xl font-bold">{score}<span className="text-white/50"> / {total}</span></p>
            </div>
          )}
        </div>
        {step !== undefined && total !== undefined && (
          <div className="mt-4 flex items-center gap-3">
            <ol className="flex flex-1 gap-1.5" aria-label={`Langkah ${Math.min(step + 1, total)} dari ${total}`}>
              {Array.from({ length: total }).map((_, k) => (
                <li key={k} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${k < step ? "bg-white" : k === step ? "bg-white/60" : "bg-white/15"}`} />
              ))}
            </ol>
            <span className="text-xs font-semibold text-white/75">{Math.min(step + 1, total)} / {total}</span>
          </div>
        )}
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}

/** Umpan balik: ikon, kata kunci, dan penjelasan. Tidak hanya mengandalkan warna. */
function Feedback({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div role="status" className={`anim-pop mt-5 flex items-start gap-3.5 rounded-xl border-2 p-4 ${ok ? "border-benar bg-benar-muda text-benar-tua" : "border-salah bg-salah-muda text-salah-tua"}`}>
      <span className={`anim-centang grid h-10 w-10 shrink-0 place-items-center rounded-full text-xl font-bold text-white ${ok ? "bg-benar" : "bg-salah"}`} aria-hidden="true">{ok ? "✓" : "✕"}</span>
      <div className="min-w-0 leading-snug">
        <p className="font-judul text-lg font-extrabold">{ok ? "Benar!" : "Belum tepat"}</p>
        <p className="mt-0.5 text-[.97rem]">{children}</p>
      </div>
    </div>
  );
}

function Finish({ title, text, onAgain }: { title: string; text: string; onAgain?: () => void }) {
  return (
    <div className="anim-pop flex flex-col items-center px-2 py-8 text-center" role="status">
      <span className="anim-centang grid h-14 w-14 place-items-center rounded-full bg-benar text-2xl font-bold text-white" aria-hidden="true">✓</span>
      <h3 className="mt-4 text-xl">{title}</h3>
      <p className="mt-1 max-w-sm text-tinta-2">{text}</p>
      <p className="mt-3 text-sm font-semibold text-kobalt">Lanjut ke bagian Langkah di panel kiri.</p>
      {onAgain && <button type="button" className="tombol-2 tombol-kecil mt-4" onClick={onAgain}>Ulangi latihan</button>}
    </div>
  );
}

/** Daftar centang untuk misi atau daftar periksa. */
function Checklist({ title, items, done, setDone }: { title: string; items: string[]; done: boolean[]; setDone: (d: boolean[]) => void }) {
  const n = done.filter(Boolean).length;
  return (
    <div className="border-t border-tinta/10 bg-kertas-2/50 p-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="label-kecil">{title}</p>
        <p className="text-xs font-semibold text-tinta-2">{n} dari {items.length} selesai</p>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((m, i) => (
          <li key={m}>
            <label className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border bg-white px-3 py-2 ${done[i] ? "border-kobalt/40" : "border-tinta/10"}`}>
              <input type="checkbox" className="h-5 w-5 shrink-0 accent-[var(--color-kobalt)]" checked={done[i]} onChange={() => setDone(done.map((d, k) => (k === i ? !d : d)))} />
              <span className={done[i] ? "text-tinta-2 line-through decoration-tinta/30" : "font-medium"}>{m}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- pilihan ganda sederhana ----------
export function QuizActivity({ items, no }: { items: QuizQ[]; no: number }) {
  const tries = useRef<number[]>(items.map(() => 0));
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [right, setRight] = useState(0);
  const how = "Baca pertanyaan, lalu ketuk satu jawaban yang menurutmu paling tepat.";
  if (i >= items.length)
    return (
      <Frame icon="cek" kind="Pilihan ganda" how={how} step={items.length} total={items.length} score={right}>
        <Finish title="Latihan selesai" text={`Kamu menjawab benar ${right} dari ${items.length} pertanyaan.`} onAgain={() => { tries.current = items.map(() => 0); setI(0); setPick(null); setRight(0); }} />
      </Frame>
    );
  const q = items[i];
  const ok = pick === q.answer;
  return (
    <Frame icon="cek" kind="Pilihan ganda" how={how} step={i} total={items.length} score={right}>
      <p className="label-kecil">Pertanyaan {i + 1}</p>
      <h3 key={i} className="anim-naik mt-1 text-[1.35rem] leading-snug">{q.q}</h3>
      <div key={i} className="berurutan mt-5 flex flex-col gap-2.5" role="group" aria-label="Pilihan jawaban">
        {q.options.map((o, k) => {
          const chosen = pick === k;
          const state = pick === null ? "hover:!border-kobalt hover:!bg-kobalt-muda" : chosen ? (k === q.answer ? "!border-benar !bg-benar-muda !text-benar-tua !border-2" : "!border-salah !bg-salah-muda !text-salah-tua !border-2 anim-goyang") : "opacity-50";
          return (
            <button
              key={o}
              type="button"
              disabled={pick !== null && !(pick !== q.answer && k === pick)}
              aria-pressed={chosen}
              className={`tombol-2 !min-h-14 !justify-start gap-3 !rounded-xl !px-4 !text-left !text-base ${state}`}
              onClick={() => { tries.current[i] += 1; setPick(k); if (k === q.answer) setRight((r) => r + 1); }}
            >
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold ${chosen ? (k === q.answer ? "bg-benar text-white" : "bg-salah text-white") : "bg-tinta/5 text-tinta-2"}`}>{chosen ? (k === q.answer ? "✓" : "✕") : String.fromCharCode(65 + k)}</span>
              <span className="flex-1 font-medium">{o}</span>
              {chosen && <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide text-white ${k === q.answer ? "bg-benar" : "bg-salah"}`}>{k === q.answer ? "Benar" : "Salah"}</span>}
            </button>
          );
        })}
      </div>
      {pick === null && <p className="mt-4 text-sm text-tinta-2">Belum ada jawaban dipilih.</p>}
      {pick !== null && (
        <>
          <Feedback ok={ok}>{ok ? q.ok : q.no}</Feedback>
          <div className="mt-4">
            {ok ? (
              <button type="button" className="tombol" onClick={() => { if (i + 1 >= items.length) sendResult(no, { tries: [...tries.current] }); setI(i + 1); setPick(null); }}>{i + 1 < items.length ? "Pertanyaan berikutnya →" : "Selesai"}</button>
            ) : (
              <button type="button" className="tombol" onClick={() => setPick(null)}>Coba lagi</button>
            )}
          </div>
        </>
      )}
    </Frame>
  );
}

// ---------- simulasi peramban ----------
const SIM_PAGES: Record<string, { title: string; body: React.ReactNode; links: [string, string][] }> = {
  "": { title: "Beranda Sekolah Impian", body: <p>Selamat datang! Pilih halaman yang ingin kamu lihat.</p>, links: [["Halaman Hobi", "hobi"], ["Galeri", "galeri"]] },
  hobi: { title: "Halaman Hobi", body: <div className="flex items-center gap-3"><Art id="sepeda" size={72} /><p>Aku suka bersepeda.</p></div>, links: [["Beranda", ""], ["Galeri", "galeri"]] },
  galeri: { title: "Galeri", body: <div className="flex gap-2"><Art id="bola" size={56} /><Art id="musik" size={56} /><Art id="tanaman" size={56} /></div>, links: [["Beranda", ""], ["Halaman Hobi", "hobi"]] },
};
const HOST = "sekolah-impian.web";

export function BrowserSim({ level, missions, no }: { level: 1 | 2 | 3; missions: string[]; no: number }) {
  const [stack, setStack] = useState<string[]>([""]);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState(HOST);
  const [reloads, setReloads] = useState(0);
  const [done, setDone] = useState<boolean[]>(missions.map(() => false));
  useSendChecks(no, done);
  const path = stack[idx];
  const page = SIM_PAGES[path];
  const addr = `${HOST}${path ? "/" + path : ""}`;
  const go = (p: string) => {
    const s = [...stack.slice(0, idx + 1), p];
    setStack(s);
    setIdx(s.length - 1);
    setTyped(`${HOST}${p ? "/" + p : ""}`);
  };
  const to = (i: number) => { setIdx(i); setTyped(`${HOST}${stack[i] ? "/" + stack[i] : ""}`); };
  const submitAddr = () => {
    const t = typed.trim().toLowerCase().replace(/^https?:\/\//, "");
    if (!t.startsWith(HOST)) return go("tidak-ada");
    const p = t.slice(HOST.length).replace(/^\//, "");
    go(p);
  };
  const how = level === 1 ? "Ketuk tautan di halaman untuk berpindah, lalu tekan Kembali. Kerjakan misi di bawah." : "Coba peramban ini: ketik alamat, ketuk tautan, lalu kerjakan misi di bawah.";
  return (
    <Frame icon="layar" kind="Simulasi peramban" how={how}>
      <div className="-m-6" data-testid="browser-sim">
        <div className="flex flex-wrap items-center gap-2 border-b border-tinta/10 bg-kertas-2 p-3">
          <button type="button" className="tombol-2 tombol-kecil" disabled={idx === 0} onClick={() => to(idx - 1)} aria-label="Kembali">← Kembali</button>
          {level === 3 && <button type="button" className="tombol-2 tombol-kecil" disabled={idx >= stack.length - 1} onClick={() => to(idx + 1)}>Maju →</button>}
          {level === 3 && <button type="button" className="tombol-2 tombol-kecil" onClick={() => setReloads((n) => n + 1)}>Muat ulang</button>}
          <input aria-label="Alamat web" readOnly={level === 1} className="isian !min-h-9 min-w-[180px] flex-1 !rounded-full font-kode text-sm" value={level === 1 ? addr : typed} onChange={(e) => setTyped(e.target.value)} onKeyDown={(e) => e.key === "Enter" && level > 1 && submitAddr()} />
          {level > 1 && <button type="button" className="tombol tombol-kecil" onClick={submitAddr}>Pergi</button>}
        </div>
        <div className="min-h-[220px] bg-white p-6" key={`${path}-${reloads}`}>
          {page ? (
            <>
              <h3 className="text-xl">{page.title}</h3>
              <div className="my-3">{page.body}</div>
              <p className="label-kecil mb-2">Tautan di halaman ini</p>
              <div className="flex flex-wrap gap-2">
                {page.links.map(([t, p]) => (
                  <button key={t} type="button" className="tombol-2 tombol-kecil !text-kobalt underline" onClick={() => go(p)}>{t}</button>
                ))}
              </div>
              {level === 3 && reloads > 0 && <p className="mt-3 text-sm text-tinta-2">Halaman dimuat ulang {reloads} kali. Isinya tetap sama.</p>}
            </>
          ) : (
            <>
              <h3 className="text-xl">Halaman tidak ada</h3>
              <p className="mt-2">Alamat ini tidak punya halaman. Periksa ejaan alamat, lalu coba lagi atau tekan Kembali.</p>
            </>
          )}
        </div>
        <Checklist title="Misimu" items={missions} done={done} setDone={setDone} />
      </div>
    </Frame>
  );
}

// ---------- pilah informasi aman ----------
export function SafeSort({ items, no }: { items: SafeItem[]; no: number }) {
  const picks = useRef<boolean[]>([]);
  const [i, setI] = useState(0);
  const [ans, setAns] = useState<boolean | null>(null);
  const [right, setRight] = useState(0);
  const how = "Baca kartu, lalu putuskan: aman dipajang di website atau jangan dipajang?";
  if (i >= items.length)
    return (
      <Frame icon="kunci" kind="Pilah informasi" how={how} step={items.length} total={items.length} score={right}>
        <Finish title="Latihan selesai" text={`Pilihanmu tepat ${right} dari ${items.length} kartu.`} onAgain={() => { picks.current = []; setI(0); setAns(null); setRight(0); }} />
      </Frame>
    );
  const it = items[i];
  const ok = ans === it.safe;
  return (
    <Frame icon="kunci" kind="Pilah informasi" how={how} step={i} total={items.length} score={right}>
      <p className="label-kecil">Kartu {i + 1}</p>
      <p key={i} className={`anim-pop mt-2 rounded-2xl border-2 px-6 py-8 text-center font-judul text-2xl font-bold leading-snug transition-colors ${ans === null ? "border-tinta/10 bg-kertas-2" : ok ? "border-benar bg-benar-muda text-benar-tua" : "border-salah bg-salah-muda text-salah-tua"}`}>“{it.text}”</p>
      {ans === null ? (
        <>
          <p className="mt-5 text-center text-sm font-semibold text-tinta-2">Pilih salah satu</p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <button type="button" className="tombol !min-h-14" onClick={() => { picks.current[i] = true; setAns(true); if (it.safe) setRight((r) => r + 1); }}>
              <Ikon name="cek" size={20} />Aman dipajang
            </button>
            <button type="button" className="tombol-2 !min-h-14 !border-tinta/40" onClick={() => { picks.current[i] = false; setAns(false); if (!it.safe) setRight((r) => r + 1); }}>
              <Ikon name="kunci" size={20} />Jangan dipajang
            </button>
          </div>
        </>
      ) : (
        <>
          <Feedback ok={ok}>{it.why}</Feedback>
          <button type="button" className="tombol mt-4" onClick={() => { if (i + 1 >= items.length) sendResult(no, { picks: items.map((_, k) => picks.current[k] === true) }); setI(i + 1); setAns(null); }}>{i + 1 < items.length ? "Kartu berikutnya →" : "Selesai"}</button>
        </>
      )}
    </Frame>
  );
}

// ---------- kenali bagian halaman ----------
const PART_NAME: Record<string, string> = { judul: "judul", gambar: "gambar", tombol: "tombol", menu: "menu", teks: "tulisan cerita" };

export function PartsTap({ targets, no }: { targets: PartTarget[]; no: number }) {
  const wrong = useRef<number[]>([]);
  const [i, setI] = useState(0);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const how = "Baca perintah, lalu ketuk bagian yang tepat pada halaman contoh.";
  if (i >= targets.length)
    return (
      <Frame icon="target" kind="Kenali bagian halaman" how={how} step={targets.length} total={targets.length}>
        <Finish title="Hebat!" text="Kamu sudah mengenali semua bagian yang diminta." onAgain={() => { wrong.current = []; setI(0); setMsg(null); }} />
      </Frame>
    );
  const t = targets[i];
  const tap = (p: PartTarget["part"]) => {
    if (p === t.part) {
      setMsg({ ok: true, t: `Itu memang ${PART_NAME[p]}.` });
      if (i + 1 >= targets.length) sendResult(no, { wrong: targets.map((_, k) => wrong.current[k] ?? 0) });
      setTimeout(() => { setI((n) => n + 1); setMsg(null); }, 900);
    } else {
      wrong.current[i] = (wrong.current[i] ?? 0) + 1;
      setMsg({ ok: false, t: `Itu ${PART_NAME[p]}. Cari lagi bagian yang diminta.` });
    }
  };
  const partCls = "rounded-lg border border-dashed border-tinta/20 p-2 text-left transition-colors hover:border-kobalt hover:bg-kobalt-muda focus-visible:border-kobalt";
  return (
    <Frame icon="target" kind="Kenali bagian halaman" how={how} step={i} total={targets.length}>
      <p className="label-kecil">Perintah {i + 1}</p>
      <h3 key={i} className="anim-pop mt-1 rounded-xl bg-kobalt-muda px-4 py-3 text-[1.25rem] leading-snug text-kobalt-tua">{t.prompt}</h3>
      <p className="mb-2 mt-5 text-sm font-semibold text-tinta-2">Halaman contoh — ketuk bagiannya</p>
      <div className="rounded-xl border border-tinta/15 bg-white p-3" data-testid="sample-page">
        <button type="button" className={`${partCls} flex w-full flex-wrap gap-2`} onClick={() => tap("menu")} aria-label="Menu">
          {["Beranda", "Hobi", "Galeri"].map((m) => <span key={m} className="rounded-full bg-kobalt px-3 py-1 font-judul text-sm font-bold text-white">{m}</span>)}
        </button>
        <button type="button" className={`${partCls} mt-2 block w-full`} onClick={() => tap("judul")} aria-label="Judul"><span className="font-judul text-2xl font-bold text-kobalt">Hobiku Bersepeda</span></button>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button type="button" className={partCls} onClick={() => tap("gambar")} aria-label="Gambar"><Art id="sepeda" size={84} /></button>
          <button type="button" className={`${partCls} flex-1`} onClick={() => tap("teks")} aria-label="Tulisan cerita">Aku bersepeda setiap Minggu pagi bersama teman-temanku.</button>
        </div>
        <button type="button" className="tombol mt-2" onClick={() => tap("tombol")} aria-label="Tombol">Lihat galeri</button>
      </div>
      {msg ? <Feedback ok={msg.ok}>{msg.t}</Feedback> : <p className="mt-4 text-sm text-tinta-2">Belum ada bagian yang diketuk.</p>}
    </Frame>
  );
}

// ---------- sketsa di kertas ----------
export function SketchStep({ level, checklist, no }: { level: 1 | 2 | 3; checklist: string[]; no: number }) {
  const [done, setDone] = useState<boolean[]>(checklist.map(() => false));
  useSendChecks(no, done);
  const ink = "#14223f";
  return (
    <Frame icon="susun" kind="Sketsa di kertas" how="Lihat contoh sketsa, gambar sketsa serupa di kertas, lalu centang daftar periksa di bawah.">
      <div className="-m-6">
        <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div>
            <p className="label-kecil mb-2">Contoh yang bisa ditiru</p>
            <svg viewBox="0 0 320 220" role="img" aria-label="Contoh sketsa halaman Tentang Aku" className="w-full rounded-xl border border-tinta/15 bg-[#fffef9]">
              <g fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fontFamily="var(--font-judul)">
                {level === 1 && (
                  <>
                    <text x="160" y="28" textAnchor="middle" fill={ink} stroke="none" fontSize="16" fontWeight="800">Judul</text>
                    <circle cx="160" cy="76" r="30" /><text x="160" y="80" textAnchor="middle" fill={ink} stroke="none" fontSize="11">avatar</text>
                    <rect x="125" y="116" width="70" height="46" rx="6" strokeDasharray="5 4" /><text x="160" y="143" textAnchor="middle" fill={ink} stroke="none" fontSize="11">gambar hobi</text>
                    <path d="M70 188h180M90 204h140" />
                  </>
                )}
                {level === 2 && (
                  <>
                    <text x="160" y="22" textAnchor="middle" fill={ink} stroke="none" fontSize="14" fontWeight="800">Cerita Kecilku</text>
                    {[["Halo!", 34], ["Hobiku", 94], ["Kesukaanku", 154]].map(([t, y]) => (
                      <g key={String(t)}>
                        <text x="24" y={Number(y) + 12} fill={ink} stroke="none" fontSize="12" fontWeight="800">{String(t)}</text>
                        <rect x="24" y={Number(y) + 18} width="52" height="30" rx="5" strokeDasharray="5 4" />
                        <path d={`M92 ${Number(y) + 30}h200M92 ${Number(y) + 42}h150`} />
                      </g>
                    ))}
                  </>
                )}
                {level === 3 && (
                  <>
                    <rect x="16" y="10" width="288" height="26" rx="13" />
                    {["Perkenalan", "Hobi", "Galeri"].map((t, i) => (
                      <text key={t} x={64 + i * 96} y="28" textAnchor="middle" fill={ink} stroke="none" fontSize="11" fontWeight="800">{t}</text>
                    ))}
                    <text x="30" y="62" fill={ink} stroke="none" fontSize="12" fontWeight="800">Perkenalan</text>
                    <rect x="30" y="68" width="44" height="30" rx="5" strokeDasharray="5 4" /><path d="M88 80h200M88 92h140" />
                    <text x="30" y="118" fill={ink} stroke="none" fontSize="12" fontWeight="800">Hobi</text>
                    <path d="M30 128h258M30 140h200" />
                    <text x="30" y="166" fill={ink} stroke="none" fontSize="12" fontWeight="800">Galeri</text>
                    {[30, 120, 210].map((x) => <rect key={x} x={x} y="172" width="78" height="38" rx="5" strokeDasharray="5 4" />)}
                    <path d="M112 30c-20 14-30 22-60 28" stroke="#0047ab" /><path d="M160 36c0 40-60 60-100 80" stroke="#0047ab" />
                  </>
                )}
              </g>
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <p className="label-kecil mb-2">Yang perlu disiapkan</p>
            <ol className="flex flex-col gap-3">
              {["Ambil kertas dan pensil.", "Gambar sketsa serupa. Tidak perlu bagus.", "Pastikan ada tempat untuk setiap bagian."].map((s, k) => (
                <li key={s} className="flex gap-3">
                  <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-kobalt-muda font-judul text-xs font-bold text-kobalt-tua">{k + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <Checklist title="Daftar periksa sketsa" items={checklist} done={done} setDone={setDone} />
        {done.every(Boolean) && (
          <div role="status" className="catatan m-5 mt-0 flex items-center gap-2 font-semibold text-kobalt-tua"><Ikon name="cek" size={20} />Sketsamu lengkap. Kamu siap menyusunnya di editor.</div>
        )}
      </div>
    </Frame>
  );
}
