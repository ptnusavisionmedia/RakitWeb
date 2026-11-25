"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { post } from "@/lib/client";

export type SaveStatus = "saved" | "saving" | "error";

/** Menyimpan draf ke server beberapa saat setelah ada perubahan, dan saat meninggalkan halaman. */
export function useAutosave<T>(value: T, delay = 700) {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const first = useRef(true);
  const latest = useRef(value);
  const dirty = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  latest.current = value;

  const flush = useCallback(async (keep = false) => {
    if (!dirty.current) return true;
    dirty.current = false;
    setStatus("saving");
    const r = await post("/api/work", { content: latest.current }, "PUT", keep);
    if (r.ok) {
      setStatus(dirty.current ? "saving" : "saved");
      return true;
    }
    dirty.current = true;
    setStatus("error");
    return false;
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    dirty.current = true;
    setStatus("saving");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      void flush();
    }, delay);
  }, [value, delay, flush]);

  useEffect(() => {
    const out = () => {
      if (dirty.current) void flush(true);
    };
    const vis = () => {
      if (document.visibilityState === "hidden") out();
    };
    window.addEventListener("pagehide", out);
    document.addEventListener("visibilitychange", vis);
    return () => {
      window.removeEventListener("pagehide", out);
      document.removeEventListener("visibilitychange", vis);
      window.clearTimeout(timer.current);
      out();
    };
  }, [flush]);

  return { status, flush };
}

export function SaveBadge({ status }: { status: SaveStatus }) {
  const text = status === "saved" ? "Tersimpan otomatis" : status === "saving" ? "Menyimpan…" : "Belum tersimpan. Coba lagi";
  return (
    <span role="status" className={`text-xs font-medium ${status === "error" ? "font-bold text-salah" : "text-tinta-2"}`}>
      {text}
    </span>
  );
}
