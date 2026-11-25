"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Lesson } from "@/lib/curriculum/types";
import { post } from "@/lib/client";

function Part({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-tinta/10 px-5 py-4">
      <h2 className="label-kecil mb-2">{title}</h2>
      {children}
    </section>
  );
}

export function LessonPanel({ lesson, completed, children }: { lesson: Lesson; completed: boolean; children?: React.ReactNode }) {
  const router = useRouter();
  const [checks, setChecks] = useState<boolean[]>(lesson.success.map(() => false));
  const [hints, setHints] = useState(0);
  const [busy, setBusy] = useState(false);
  const last = lesson.no >= lesson.total;

  const finish = async () => {
    setBusy(true);
    await post("/api/progress", { no: lesson.no, action: "complete", self: checks });
    router.push(last ? "/belajar" : `/belajar/${lesson.no + 1}`);
    router.refresh();
  };

  return (
    <div className="kartu flex flex-col overflow-hidden" data-testid="lesson-panel">
      <div className="pita !rounded-none px-5 pb-5 pt-5 !shadow-none">
        <div className="flex items-center justify-between gap-3">
          <p className="label-kecil">Pertemuan {lesson.no} dari {lesson.total}</p>
          <p className="redup text-xs">{lesson.minutes} menit</p>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
          <div className="isi-bar h-full rounded-full bg-white" style={{ width: `${(lesson.no / lesson.total) * 100}%` }} />
        </div>
        <h1 className="mt-4 text-[1.35rem]">{lesson.title}</h1>
        <p className="catatan mt-3 text-[.95rem] font-semibold">{lesson.goal}</p>
      </div>
      <Part title="Tugas hari ini">
        <p className="font-medium leading-snug">{lesson.task}</p>
      </Part>
      {children && <div className="border-t border-tinta/10 px-5 py-4">{children}</div>}
      <Part title="Contoh">
        <p className="border-l-2 border-kobalt pl-3 text-tinta-2">{lesson.example}</p>
      </Part>
      <Part title="Langkah">
        <ol className="berurutan flex flex-col gap-2.5">
          {lesson.steps.map((s, i) => (
            <li key={s} className="flex gap-3">
              <span aria-hidden="true" className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-kobalt-muda font-judul text-[11px] font-bold text-kobalt-tua">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </Part>
      {lesson.target && (
        <Part title="Target hasil">
          <p className="catatan font-semibold">{lesson.target}</p>
          {lesson.hints && (
            <div className="mt-3 flex flex-col gap-2">
              {lesson.hints.slice(0, hints).map((h, i) => (
                <p key={i} className="rounded-lg border border-tinta/15 bg-white p-3 text-sm"><b>Petunjuk {i + 1}:</b> {h}</p>
              ))}
              {hints < lesson.hints.length && (
                <button type="button" className="tombol-2 tombol-kecil self-start" onClick={() => setHints(hints + 1)}>Buka petunjuk {hints + 1}</button>
              )}
            </div>
          )}
        </Part>
      )}
      <Part title="Tanda berhasil">
        <ul className="flex flex-col">
          {lesson.success.map((s, i) => (
            <li key={s}>
              <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1.5">
                <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-kobalt)]" checked={checks[i]} onChange={() => setChecks(checks.map((c, k) => (k === i ? !c : c)))} />
                <span className={checks[i] ? "text-tinta-2" : ""}>{s}</span>
              </label>
            </li>
          ))}
        </ul>
      </Part>
      <div className="flex flex-col gap-2 border-t border-tinta/10 bg-kertas-2/50 px-5 py-4">
        <button type="button" className="tombol w-full" disabled={busy} onClick={finish}>
          {completed ? "Lanjut ke berikutnya" : last ? "Selesai pertemuan ini" : "Selesai, lanjut"}
        </button>
        {completed && <span className="text-center text-sm font-semibold text-kobalt">Pertemuan ini sudah selesai.</span>}
      </div>
    </div>
  );
}
