"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ClassLevel, Lesson } from "@/lib/curriculum/types";
import { applySnippets, isApplied, linkScan, privacyScan, type Finding } from "@/lib/code";
import { post } from "@/lib/client";
import type { Files } from "@/lib/starter";
import { CodePreview } from "./CodePreview";
import { LessonPanel } from "./LessonPanel";
import { SaveBadge, useAutosave } from "./useAutosave";

const TAB_LABEL = { html: "HTML", css: "CSS", js: "JavaScript" } as const;

function CodeEditor({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const ta = useRef<HTMLTextAreaElement>(null);
  const gut = useRef<HTMLDivElement>(null);
  const lines = useMemo(() => value.split("\n"), [value]);
  return (
    <div className="flex h-full min-h-0 overflow-hidden rounded-xl border border-tinta/15 bg-tinta shadow-[var(--bayang)]">
      <div ref={gut} aria-hidden className="w-12 shrink-0 select-none overflow-hidden border-r border-white/10 bg-white/5 py-3 text-right font-kode text-[13px] leading-[22px] text-white/40">
        {lines.map((l, i) => (
          <div key={i} className={`px-2 ${/UBAH/.test(l) ? "bg-kobalt font-bold text-white" : ""}`}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={ta}
        aria-label={label}
        value={value}
        wrap="off"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        onChange={(e) => onChange(e.target.value)}
        onScroll={() => { if (gut.current && ta.current) gut.current.scrollTop = ta.current.scrollTop; }}
        className="h-full min-h-0 w-full resize-none overflow-auto whitespace-pre bg-tinta px-4 py-3 font-kode text-[13px] leading-[22px] text-[#e8edf7] caret-white outline-none selection:bg-kobalt selection:text-white"
      />
    </div>
  );
}

function Findings({ list, ok }: { list: Finding[]; ok: string }) {
  return list.length === 0 ? (
    <p role="status" className="anim-pop mt-3 flex items-start gap-3 rounded-xl border-2 border-benar bg-benar-muda p-3 text-sm font-semibold text-benar-tua"><span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-benar text-sm font-bold text-white">✓</span><span>{ok}</span></p>
  ) : (
    <ul role="status" className="mt-3 flex flex-col gap-2">
      {list.map((f, i) => (
        <li key={i} className="flex items-start gap-2 rounded-xl border-2 border-salah bg-salah-muda p-2.5 text-sm text-salah-tua"><span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-salah text-xs font-bold text-white">✕</span><span><b className="font-kode">{f.file}</b> — {f.text}</span></li>
      ))}
    </ul>
  );
}

export function CodeWorkspace({ lesson, initial, pages, completed }: { lesson: Lesson; level?: ClassLevel; initial: Files; pages: string[]; completed: boolean }) {
  const tabs = lesson.tabs ?? ["html"];
  const [files, setFiles] = useState<Files>(initial);
  const [tab, setTab] = useState<"html" | "css" | "js">("html");
  const [page, setPage] = useState(pages[0]);
  const [view, setView] = useState<"petunjuk" | "kode" | "hasil">("petunjuk");
  const [live, setLive] = useState<Files>(initial);
  const [scan, setScan] = useState<Finding[] | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [talk, setTalk] = useState(["", "", ""]);
  const { status } = useAutosave(files);

  useEffect(() => {
    const t = window.setTimeout(() => setLive(files), 600);
    return () => window.clearTimeout(t);
  }, [files]);

  const file = tab === "html" ? page : tab === "css" ? "style.css" : "script.js";
  const setCode = (v: string) => { setFiles((f) => ({ ...f, [file]: v })); setSent(null); };
  const snippets = lesson.snippet ?? [];
  const applied = snippets.length > 0 && isApplied(files, snippets);

  const paste = () => {
    const next = applySnippets(files, snippets);
    setFiles(next);
    setLive(next);
    const first = snippets[0];
    setTab(first.file.endsWith(".css") ? "css" : first.file.endsWith(".js") ? "js" : "html");
    if (first.file.endsWith(".html")) setPage(first.file);
    setView("kode");
  };

  const submit = async () => {
    const r = await post("/api/work", { content: files });
    setSent(r.ok ? "Karyamu sudah terkirim. Guru akan melihatnya di Tinjau Karya." : (r.error ?? "Belum terkirim."));
  };

  const tools = (
    <div className="flex flex-col gap-3">
      {snippets.length > 0 && (
        <div className="catatan">
          <p className="label-kecil mb-1">Kode awal</p>
          <p className="mb-2 text-sm">Kode pendek untuk pertemuan ini. Cari baris bertanda <b>UBAH</b> (nomor barisnya disorot biru).</p>
          <button type="button" className="tombol" disabled={applied} onClick={paste}>{applied ? "Kode awal sudah ditempel" : "Tempel kode awal"}</button>
        </div>
      )}
      {lesson.tool === "privacy" && (
        <div className="flex flex-col">
          <button type="button" className="tombol" onClick={() => setScan(privacyScan(files))}>Periksa privasi</button>
          {scan && <Findings list={scan} ok="Tidak ada temuan privasi. Periksa juga tulisanmu sekali lagi." />}
        </div>
      )}
      {lesson.tool === "linkcheck" && (
        <div className="flex flex-col">
          <button type="button" className="tombol" onClick={() => setScan([...linkScan(files), ...privacyScan(files)])}>Periksa karyaku</button>
          {scan && <Findings list={scan} ok="Tidak ada temuan. Sekarang uji dengan mengeklik sendiri." />}
        </div>
      )}
      {lesson.tool === "present" && (
        <div className="flex flex-col">
          <p className="label-kecil mb-2">Tiga kalimat presentasiku</p>
          {["Websiteku tentang …", "Bagian yang paling kusukai adalah …", "Yang kuperbaiki adalah …"].map((ph, i) => (
            <input key={ph} aria-label={ph} placeholder={ph} className="isian mb-2" value={talk[i]} onChange={(e) => setTalk(talk.map((t, k) => (k === i ? e.target.value : t)))} />
          ))}
          <button type="button" className="tombol" onClick={submit}>Kirim ke guru</button>
          {sent && <p role="status" className="mt-2 text-sm font-semibold text-kobalt">{sent}</p>}
          {linkScan(files).length > 0 && <p className="mt-2 text-sm font-semibold text-salah-tua">Masih ada {linkScan(files).length} hal yang bisa diperbaiki. Tekan Periksa karyaku di pertemuan 15 untuk melihatnya.</p>}
        </div>
      )}
    </div>
  );

  const tabBtn = (v: typeof view, t: string) => (
    <button type="button" role="tab" aria-selected={view === v} className="flex-1" onClick={() => setView(v)}>{t}</button>
  );

  return (
    <div>
      <div role="tablist" aria-label="Bagian ruang praktik" className="segmen mb-3 flex lg:hidden">
        {tabBtn("petunjuk", "Petunjuk")}
        {tabBtn("kode", "Kode")}
        {tabBtn("hasil", "Hasil")}
      </div>
      <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-4">
        <div className={`${view === "petunjuk" ? "block" : "hidden"} lg:block lg:max-h-[calc(100vh-164px)] lg:overflow-y-auto lg:pr-2`}>
          <LessonPanel lesson={lesson} completed={completed}>{tools}</LessonPanel>
        </div>
        <div className={`${view === "kode" ? "flex" : "hidden"} h-[68vh] min-h-[380px] flex-col gap-2 lg:flex lg:h-[calc(100vh-164px)]`} data-testid="code-pane">
          <div className="flex flex-wrap items-center gap-2">
            <div role="tablist" aria-label="Berkas kode" className="segmen">
              {tabs.map((t) => (
                <button key={t} type="button" role="tab" aria-selected={tab === t}  onClick={() => setTab(t)}>{TAB_LABEL[t]}</button>
              ))}
            </div>
            {tab === "html" && pages.length > 1 && (
              <div className="segmen" role="group" aria-label="Pilih halaman">
                {pages.map((p) => (
                  <button key={p} type="button" aria-pressed={page === p} style={{ fontFamily: "var(--font-kode)", fontWeight: 500 }} onClick={() => setPage(p)}>{p}</button>
                ))}
              </div>
            )}
            <span className="ml-auto"><SaveBadge status={status} /></span>
          </div>
          <div className="min-h-0 flex-1">
            <CodeEditor value={files[file] ?? ""} onChange={setCode} label={`Editor ${file}`} />
          </div>
          <div className="flex gap-2 lg:hidden">
            <button type="button" className="tombol" onClick={() => setView("hasil")}>Lihat hasil</button>
          </div>
        </div>
        <div className={`${view === "hasil" ? "block" : "hidden"} h-[68vh] min-h-[380px] bingkai lg:block lg:h-[calc(100vh-164px)]`} data-testid="result-pane">
          <CodePreview files={live} pages={pages} focusPage={tab === "html" ? page : undefined} />
        </div>
      </div>
    </div>
  );
}
