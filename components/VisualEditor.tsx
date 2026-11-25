"use client";

import { useState } from "react";
import { Art, artLabel, AVATARS, COLORS, HOBBIES } from "@/lib/art";
import { bid, EXAMPLE_K2, REFLECTIONS, SENTENCES_K1, type Block, type VisualDoc } from "@/lib/page";
import { post } from "@/lib/client";
import type { ClassLevel } from "@/lib/curriculum/types";
import { PagePreview } from "./PagePreview";
import { SaveBadge, useAutosave } from "./useAutosave";

type Props = { level: ClassLevel; step: 6 | 7 | 8; initial: VisualDoc; nickname: string };

function ArtPicker({ value, options, onChange, label, size = 56 }: { value: string; options: readonly string[]; onChange: (v: string) => void; label: string; size?: number }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          aria-label={artLabel(o)}
          onClick={() => onChange(o)}
          className={`flex min-h-[72px] min-w-[72px] flex-col items-center justify-center rounded-lg border bg-white p-1 ${value === o ? "border-kobalt bg-kobalt-muda ring-1 ring-kobalt" : "border-tinta/15"}`}
        >
          <Art id={o} size={size} />
          <span className="text-[11px] font-bold leading-none">{artLabel(o)}</span>
        </button>
      ))}
    </div>
  );
}

function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div role="group" aria-label="Warna halaman" className="flex flex-wrap gap-2">
      {COLORS.map((c) => (
        <button
          key={c.id}
          type="button"
          aria-pressed={value === c.id}
          onClick={() => onChange(c.id)}
          className={`flex min-h-[56px] items-center gap-2 rounded-lg border bg-white px-3 font-judul font-bold ${value === c.id ? "border-kobalt ring-1 ring-kobalt" : "border-tinta/15"}`}
        >
          <span className="h-7 w-7 rounded-md border border-tinta/15" style={{ background: c.bg }} />
          {c.name}
        </button>
      ))}
    </div>
  );
}

export function VisualEditor({ level, step, initial, nickname }: Props) {
  const [doc, setDoc] = useState<VisualDoc>(initial);
  const [hist, setHist] = useState<VisualDoc[]>([]);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [drag, setDrag] = useState<string | null>(null);
  const { status, flush } = useAutosave(doc);

  const commit = (next: VisualDoc) => {
    setHist((h) => [...h.slice(-39), doc]);
    setDoc(next);
    setSent(null);
  };
  const undo = () => {
    const prev = hist[hist.length - 1];
    if (!prev) return;
    setDoc(prev);
    setHist(hist.slice(0, -1));
  };
  const patch = (id: string, p: Partial<Block>) => commit({ ...doc, blocks: doc.blocks.map((b) => (b.id === id ? ({ ...b, ...p } as Block) : b)) });
  const fixed = (b: Block) => b.type === "title" || b.type === "menu";
  const move = (id: string, dir: -1 | 1) => {
    const i = doc.blocks.findIndex((b) => b.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= doc.blocks.length || fixed(doc.blocks[j])) return;
    const bl = [...doc.blocks];
    [bl[i], bl[j]] = [bl[j], bl[i]];
    commit({ ...doc, blocks: bl });
  };
  const dropOn = (targetId: string) => {
    if (!drag || drag === targetId) return;
    const from = doc.blocks.findIndex((b) => b.id === drag);
    const to = doc.blocks.findIndex((b) => b.id === targetId);
    if (from < 0 || to < 0 || fixed(doc.blocks[to])) return;
    const bl = [...doc.blocks];
    const [m] = bl.splice(from, 1);
    bl.splice(to, 0, m);
    commit({ ...doc, blocks: bl });
    setDrag(null);
  };
  const sections = doc.blocks.filter((b): b is Extract<Block, { type: "section" }> => b.type === "section");
  const showColor = step >= 7;

  const submit = async () => {
    const r = await post("/api/work", { content: doc });
    setSent(r.ok ? "Karyamu sudah terkirim. Guru akan melihatnya di Tinjau Karya." : (r.error ?? "Belum terkirim."));
  };

  // ---------- Kelas 1: satu langkah per layar ----------
  const stepsK1 = step === 6 ? ["avatar", "hobi", "kalimat", "susun", "lihat"] : step === 7 ? ["hobi", "warna", "lihat"] : ["lihat"];
  const [si, setSi] = useState(0);
  const cur = stepsK1[si];
  const k1 = (id: string) => doc.blocks.find((b) => b.id === id);

  const renderWizard = () => (
    <div className="halaman-buku p-4 sm:p-6" data-testid="wizard">
      <p className="label-kecil">Langkah {si + 1} dari {stepsK1.length}</p>
      {cur === "avatar" && (
        <>
          <h3 className="mt-1 text-xl">Pilih avatarmu.</h3>
          <div className="mt-4">
            <ArtPicker label="Pilih avatar" value={(k1("avatar") as Extract<Block, { type: "avatar" }>).art} options={AVATARS} size={64} onChange={(v) => patch("avatar", { art: v })} />
          </div>
        </>
      )}
      {cur === "hobi" && (
        <>
          <h3 className="mt-1 text-xl">Pilih gambar hobimu.</h3>
          <div className="mt-4">
            <ArtPicker label="Pilih gambar hobi" value={(k1("icon") as Extract<Block, { type: "icon" }>).art} options={HOBBIES} size={64} onChange={(v) => patch("icon", { art: v })} />
          </div>
        </>
      )}
      {cur === "kalimat" && (
        <>
          <h3 className="mt-1 text-xl">Pilih satu kalimat.</h3>
          <div className="mt-4 flex flex-col gap-2">
            {SENTENCES_K1.map((s) => (
              <button key={s} type="button" aria-pressed={(k1("kalimat") as Extract<Block, { type: "text" }>).text === s} className="tombol-2 !justify-start !text-left" onClick={() => patch("kalimat", { text: s })}>
                {s}
              </button>
            ))}
          </div>
        </>
      )}
      {cur === "susun" && (
        <>
          <h3 className="mt-1 text-xl">Susun halamanmu.</h3>
          <p className="mt-1 text-tinta-2">Tekan Naik atau Turun, atau seret kartunya.</p>
          <ol className="mt-3 flex flex-col gap-2">
            {doc.blocks.map((b, i) => (
              <li key={b.id} draggable={!fixed(b)} onDragStart={() => setDrag(b.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => dropOn(b.id)} className="flex items-center gap-2 rounded-lg border border-tinta/15 bg-white p-2">
                {b.type === "avatar" || b.type === "icon" ? <Art id={b.art} size={44} /> : <span className="grid h-11 w-11 place-items-center rounded-lg bg-kobalt-muda font-judul font-bold">{b.type === "title" ? "J" : "T"}</span>}
                <span className="flex-1 font-bold">{b.type === "title" ? "Judul" : b.type === "avatar" ? "Avatar" : b.type === "icon" ? "Gambar hobi" : "Kalimat"}</span>
                {!fixed(b) && (
                  <>
                    <button type="button" className="tombol-2 !min-h-11 !px-3" disabled={i <= 1} onClick={() => move(b.id, -1)}>Naik</button>
                    <button type="button" className="tombol-2 !min-h-11 !px-3" disabled={i === doc.blocks.length - 1} onClick={() => move(b.id, 1)}>Turun</button>
                  </>
                )}
              </li>
            ))}
          </ol>
        </>
      )}
      {cur === "warna" && (
        <>
          <h3 className="mt-1 text-xl">Pilih warna halamanmu.</h3>
          <div className="mt-4"><ColorPicker value={doc.color} onChange={(v) => commit({ ...doc, color: v })} /></div>
        </>
      )}
      {cur === "lihat" && (
        <>
          <h3 className="mt-1 text-xl">{step === 8 ? "Tunjukkan halamanmu." : "Lihat hasilnya!"}</h3>
          <div className="mt-3">
            <button type="button" className="tombol" onClick={() => setOpen(true)}>Lihat hasil</button>
          </div>
        </>
      )}
      <div className="mt-6 flex justify-between gap-3">
        <button type="button" className="tombol-2" disabled={si === 0} onClick={() => setSi(si - 1)}>Kembali</button>
        <button type="button" className="tombol" disabled={si === stepsK1.length - 1} onClick={() => setSi(si + 1)}>Lanjut</button>
      </div>
    </div>
  );

  // ---------- Kelas 2 dan 3: blok ----------
  const nama = nickname;
  const blockList = (
    <ol className="flex flex-col gap-3" data-testid="blocks">
      {doc.blocks.map((b, i) => {
        if (b.type === "title")
          return (
            <li key={b.id} className="halaman-buku p-4">
              <label className="label-kecil" htmlFor="judul">Judul halaman</label>
              <input id="judul" className="isian mt-1" value={b.text} maxLength={60} onChange={(e) => patch(b.id, { text: e.target.value })} />
            </li>
          );
        if (b.type === "menu")
          return (
            <li key={b.id} className="halaman-buku p-4">
              <p className="label-kecil">Menu halaman</p>
              <p className="mb-2 text-sm text-tinta-2">Hubungkan setiap tulisan menu ke satu bagian halaman.</p>
              <ul className="flex flex-col gap-2">
                {b.items.map((it, k) => (
                  <li key={k} className="flex flex-wrap items-center gap-2">
                    <input aria-label={`Tulisan menu ${k + 1}`} className="isian !w-36" value={it.label} maxLength={20} onChange={(e) => patch(b.id, { items: b.items.map((x, y) => (y === k ? { ...x, label: e.target.value } : x)) })} />
                    <span aria-hidden>→</span>
                    <select aria-label={`Bagian tujuan menu ${k + 1}`} className="isian !w-44" value={it.target} onChange={(e) => patch(b.id, { items: b.items.map((x, y) => (y === k ? { ...x, target: e.target.value } : x)) })}>
                      <option value="">Pilih bagian…</option>
                      {doc.blocks.filter((x) => x.type === "section" || x.type === "gallery").map((x) => (
                        <option key={x.id} value={x.id}>{x.type === "section" ? x.heading || "Bagian" : "Galeri"}</option>
                      ))}
                    </select>
                    <button type="button" className="tombol-2 !min-h-11 !px-3" onClick={() => patch(b.id, { items: b.items.filter((_, y) => y !== k) })}>Hapus</button>
                  </li>
                ))}
              </ul>
              {b.items.length < 6 && (
                <button type="button" className="tombol-2 mt-2" onClick={() => patch(b.id, { items: [...b.items, { label: "Menu baru", target: "" }] })}>
                  Tambah tulisan menu
                </button>
              )}
            </li>
          );
        const movable = (
          <div className="flex gap-2">
            <button type="button" className="tombol-2 !min-h-11 !px-3" disabled={i <= 0 || fixed(doc.blocks[i - 1])} onClick={() => move(b.id, -1)}>Naik</button>
            <button type="button" className="tombol-2 !min-h-11 !px-3" disabled={i === doc.blocks.length - 1} onClick={() => move(b.id, 1)}>Turun</button>
          </div>
        );
        if (b.type === "section")
          return (
            <li key={b.id} draggable onDragStart={() => setDrag(b.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => dropOn(b.id)} className="halaman-buku p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {level === 3 ? (
                  <input aria-label="Nama bagian" className="isian !w-48 font-bold" value={b.heading} maxLength={24} onChange={(e) => patch(b.id, { heading: e.target.value })} />
                ) : (
                  <h3 className="text-xl">{b.heading}</h3>
                )}
                {movable}
              </div>
              <div className="mt-3">
                <ArtPicker label={`Gambar untuk ${b.heading}`} value={b.art} options={[...HOBBIES, ...AVATARS]} size={40} onChange={(v) => patch(b.id, { art: v })} />
              </div>
              <label className="label-kecil mt-3 block" htmlFor={`t-${b.id}`}>{level === 2 ? "Satu kalimat pendek" : "Tulisan bagian ini"}</label>
              <input id={`t-${b.id}`} className="isian mt-1" value={b.text} maxLength={120} onChange={(e) => patch(b.id, { text: e.target.value })} />
              {level === 2 && EXAMPLE_K2[b.id] && (
                <div className="mt-2 flex flex-wrap gap-2" aria-label="Contoh kalimat">
                  {EXAMPLE_K2[b.id].map((s) => (
                    <button key={s} type="button" className="tombol-2 !min-h-10 !px-3 !text-sm" onClick={() => patch(b.id, { text: s.replace("{nama}", nama) })}>
                      {s.replace("{nama}", nama)}
                    </button>
                  ))}
                </div>
              )}
              {level === 3 && sections.length > 1 && (
                <button
                  type="button"
                  className="tombol-2 mt-3 !min-h-10"
                  onClick={() =>
                    commit({
                      ...doc,
                      blocks: doc.blocks.filter((x) => x.id !== b.id).map((x) => (x.type === "menu" ? { ...x, items: x.items.filter((it) => it.target !== b.id) } : x)),
                    })
                  }
                >
                  Hapus bagian ini
                </button>
              )}
            </li>
          );
        if (b.type === "gallery")
          return (
            <li key={b.id} draggable onDragStart={() => setDrag(b.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => dropOn(b.id)} className="halaman-buku p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl">Galeri</h3>
                {movable}
              </div>
              {step >= 7 ? (
                [0, 1, 2].map((k) => (
                  <div key={k} className="mt-3">
                    <p className="label-kecil mb-1">Gambar {k + 1}</p>
                    <ArtPicker label={`Gambar galeri ${k + 1}`} value={b.arts[k] ?? "bola"} options={HOBBIES} size={36} onChange={(v) => patch(b.id, { arts: [0, 1, 2].map((y) => (y === k ? v : (b.arts[y] ?? "bola"))) })} />
                  </div>
                ))
              ) : (
                <p className="mt-2 text-tinta-2">Gambar galeri bisa diganti di pertemuan berikutnya.</p>
              )}
            </li>
          );
        return null;
      })}
      {level === 3 && sections.length < 5 && (
        <li>
          <button
            type="button"
            className="tombol-2"
            onClick={() => {
              const g = doc.blocks.findIndex((x) => x.type === "gallery");
              const at = g >= 0 ? g : doc.blocks.length;
              const nb: Block = { id: bid(), type: "section", heading: "Bagian baru", art: "bola", text: "Tulis sesuatu di sini." };
              commit({ ...doc, blocks: [...doc.blocks.slice(0, at), nb, ...doc.blocks.slice(at)] });
            }}
          >
            Tambah bagian
          </button>
        </li>
      )}
    </ol>
  );

  const reflection = step === 8 && (
    <div className="halaman-buku mt-4 p-4" data-testid="reflection">
      <h3 className="text-xl">Ceritakan satu pilihanmu</h3>
      <div className="mt-3 flex flex-col gap-2">
        {REFLECTIONS.map((r) => (
          <button key={r} type="button" aria-pressed={doc.reflection === r} className="tombol-2 !justify-start !text-left" onClick={() => commit({ ...doc, reflection: r })}>
            {r}
          </button>
        ))}
      </div>
      {level === 3 && (
        <label className="mt-4 flex min-h-12 items-center gap-3 font-bold">
          <input type="checkbox" className="h-6 w-6 accent-[var(--color-kobalt)]" checked={!!doc.friendTested} onChange={(e) => commit({ ...doc, friendTested: e.target.checked })} />
          Temanku menemukan bagian Hobi memakai menu.
        </label>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="tombol" onClick={submit}>Kirim ke guru</button>
        {sent && <span role="status" className="text-sm font-semibold text-kobalt">{sent}</span>}
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button type="button" className="tombol-2" onClick={undo} disabled={hist.length === 0}>Urungkan</button>
        <button type="button" className="tombol" onClick={() => setOpen(true)}>Lihat hasil</button>
        <span className="ml-auto"><SaveBadge status={status} /></span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          {level === 1 ? renderWizard() : (
            <>
              {showColor && (
                <div className="halaman-buku mb-3 p-3">
                  <p className="label-kecil mb-2">Warna halaman</p>
                  <ColorPicker value={doc.color} onChange={(v) => commit({ ...doc, color: v })} />
                </div>
              )}
              {blockList}
            </>
          )}
          {reflection}
        </div>
        <div className="lg:sticky lg:top-20 lg:self-start">
          <p className="label-kecil mb-1">Halamanmu</p>
          <div className="bingkai max-h-[70vh] !overflow-auto p-1">
            <PagePreview doc={doc} />
          </div>
        </div>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Hasil halamanmu" className="fixed inset-0 z-50 overflow-auto bg-tinta/60 p-3 sm:p-8">
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-3 shadow-[var(--bayang-2)] sm:p-5">
            <PagePreview doc={doc} />
            <div className="mt-4 flex justify-end">
              <button type="button" className="tombol" onClick={() => { setOpen(false); void flush(); }}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
