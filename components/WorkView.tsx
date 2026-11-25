"use client";

import { useState } from "react";
import { CodePreview } from "./CodePreview";
import { PagePreview } from "./PagePreview";
import { pagesOf, type Files } from "@/lib/starter";
import type { VisualDoc } from "@/lib/page";
import { post } from "@/lib/client";
import { useRouter } from "next/navigation";

export function WorkView({ kind, content, level, height = 420, showCode = false }: { kind: "visual" | "code"; content: unknown; level: number; height?: number; showCode?: boolean }) {
  const [code, setCode] = useState(false);
  if (kind === "visual") return <div className="bingkai max-h-[520px] !overflow-auto p-1"><PagePreview doc={content as VisualDoc} /></div>;
  const files = content as Files;
  return (
    <div>
      <div className="bingkai" style={{ height }}>
        <CodePreview files={files} pages={pagesOf(level)} />
      </div>
      {showCode && (
        <div className="mt-3">
          <button type="button" className="tombol-2" aria-expanded={code} onClick={() => setCode(!code)}>{code ? "Sembunyikan kode" : "Lihat kode"}</button>
          {code && (
            <div className="mt-2 flex flex-col gap-3">
              {Object.entries(files).map(([name, text]) => (
                <div key={name}>
                  <p className="mb-1 font-kode text-sm font-semibold">{name}</p>
                  <pre className="max-h-72 overflow-auto rounded-xl bg-tinta p-4 font-kode text-[12.5px] leading-[1.6] text-[#e8edf7]">{text}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SubmitButton({ label = "Kirim ke guru", primary = true }: { label?: string; primary?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="button"
        className={primary ? "tombol" : "tombol-2"}
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const r = await post("/api/work", {});
          setBusy(false);
          if (r.ok) router.refresh();
          else setMsg(r.error ?? "Belum terkirim.");
        }}
      >
        {label}
      </button>
      {msg && <span role="alert" className="text-sm text-sm font-semibold text-tinta">{msg}</span>}
    </span>
  );
}
