"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildPreview, resolveHref } from "@/lib/code";
import type { Files } from "@/lib/starter";

type Props = {
  files: Files;
  pages: string[];
  focusPage?: string;
  height?: string;
  controls?: boolean;
  onError?: (m: string | null) => void;
};

export function CodePreview({ files, pages, focusPage, height = "100%", controls = true, onError }: Props) {
  const [page, setPage] = useState(focusPage && pages.includes(focusPage) ? focusPage : pages[0]);
  const [device, setDevice] = useState<"laptop" | "ponsel">("laptop");
  const [run, setRun] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (focusPage && pages.includes(focusPage)) setPage(focusPage);
  }, [focusPage, pages]);

  // Setelah tautan salah diperbaiki, pratinjau kembali ke halaman yang sedang diedit.
  const prevFiles = useRef(files);
  useEffect(() => {
    if (prevFiles.current !== files && files[page] === undefined) setPage(focusPage && pages.includes(focusPage) ? focusPage : pages[0]);
    prevFiles.current = files;
  }, [files, page, pages, focusPage]);

  const doc = useMemo(() => buildPreview(files, page), [files, page, run]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setErr(null);
    onError?.(null);
    setNote(null);
  }, [doc]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const h = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow) return;
      const d = e.data as { rw?: number; type?: string; href?: string; message?: string; line?: number };
      if (!d || d.rw !== 1) return;
      if (d.type === "nav" && d.href) {
        setPage(resolveHref(d.href));
        setNote(null);
      } else if (d.type === "external") setNote("Tautan ke website luar tidak dibuka di pratinjau.");
      else if (d.type === "missing-anchor") setNote(`Tujuan tautan ${d.href} belum ada. Periksa id di HTML.`);
      else if (d.type === "error") {
        const m = `Ada kesalahan di JavaScript (baris ${d.line ?? "?"}): ${d.message ?? ""}`;
        setErr(m);
        onError?.(m);
      }
    };
    window.addEventListener("message", h);
    return () => window.removeEventListener("message", h);
  }, [onError]);

  return (
    <div className="flex h-full min-h-0 flex-col" style={{ height }}>
      {controls && (
        <div className="flex flex-wrap items-center gap-2 border-b border-tinta/15 bg-kertas-2/60 px-3 py-2">
          {pages.length > 1 &&
            pages.map((p) => (
              <button key={p} type="button" className={`tombol-2 tombol-kecil ${p === page ? "aktif" : ""}`} aria-pressed={p === page} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
          {pages.length === 1 && <span className="font-kode text-sm text-tinta-2">{page}</span>}
          <span className="ml-auto flex gap-2">
            <button type="button" className={`tombol-2 tombol-kecil ${device === "laptop" ? "aktif" : ""}`} aria-pressed={device === "laptop"} onClick={() => setDevice("laptop")}>
              Laptop
            </button>
            <button type="button" className={`tombol-2 tombol-kecil ${device === "ponsel" ? "aktif" : ""}`} aria-pressed={device === "ponsel"} onClick={() => setDevice("ponsel")}>
              Ponsel
            </button>
            <button type="button" className="tombol-2 tombol-kecil" onClick={() => setRun((n) => n + 1)}>
              Muat ulang
            </button>
          </span>
        </div>
      )}
      <div className="flex min-h-0 flex-1 justify-center overflow-auto bg-kertas-2 p-2">
        <iframe
          ref={frame}
          title="Hasil karyamu"
          sandbox="allow-scripts allow-forms"
          srcDoc={doc}
          className="h-full min-h-[320px] border border-tinta/15 bg-white"
          style={{ width: device === "ponsel" ? 360 : "100%", maxWidth: "100%", borderRadius: device === "ponsel" ? 18 : 8 }}
        />
      </div>
      {(note || err) && (
        <p role="status" className={`border-t px-3 py-2 text-sm ${err ? "border-salah bg-salah-muda font-semibold text-salah-tua" : "border-tinta/15 bg-kobalt-muda text-tinta"}`}>
          {err ?? note}
        </p>
      )}
    </div>
  );
}
