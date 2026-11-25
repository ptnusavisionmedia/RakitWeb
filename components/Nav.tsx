"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { post } from "@/lib/client";
import { classMeta } from "@/lib/curriculum/types";

const ICON = "/rakitweb-header/icons/";
type IconFile = "mark" | "belajar" | "karyaku" | "profil" | "proyek" | "avatar" | "keluar" | "kelas";

type Item = { href: string; label: string; match: string; icon: IconFile; exact?: boolean };

/** Ikon dekoratif: selalu berdampingan dengan label teks, jadi alt kosong. */
function Pic({ file, size, className = "" }: { file: IconFile; size: number; className?: string }) {
  return <Image src={`${ICON}${file}.png`} alt="" width={size} height={size} className={`shrink-0 select-none ${className}`} style={{ width: size, height: size }} draggable={false} priority />;
}

function Brand({ href }: { href: string }) {
  return (
    <Link href={href} className="flex shrink-0 items-center gap-2.5 rounded-lg font-judul text-[1.2rem] font-extrabold tracking-tight text-tinta" aria-label="RakitWeb, beranda">
      <Pic file="mark" size={36} className="rounded-[10px]" />
      <span>Rakit<span className="text-kobalt">Web</span></span>
    </Link>
  );
}

function useLogout() {
  const router = useRouter();
  return async () => {
    const r = await post<{ redirect?: string }>("/api/session", { action: "logout" });
    router.push(r.redirect ?? "/");
    router.refresh();
  };
}

function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-tinta/15 bg-white px-3 font-judul text-sm font-semibold text-tinta shadow-[0_1px_2px_rgba(20,34,63,.05)] transition-colors hover:border-tinta/30 hover:bg-kertas-2 sm:px-3.5"
      aria-label="Keluar"
    >
      <Pic file="keluar" size={24} />
      <span className="hidden sm:inline">Keluar</span>
    </button>
  );
}

function Bar({ items, right, brandHref }: { items: Item[]; right: React.ReactNode; brandHref: string }) {
  const path = usePathname();
  const active = (i: Item) => path === i.match || (!i.exact && path.startsWith(i.match + "/"));
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-tinta/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto flex h-[4.5rem] max-w-[1680px] items-center gap-3 px-4 sm:px-6">
          <Brand href={brandHref} />
          <span aria-hidden="true" className="mx-1 hidden h-8 w-px bg-tinta/10 md:block" />
          <nav aria-label="Menu utama" className="hidden items-center gap-1.5 md:flex">
            {items.map((i) => {
              const on = active(i);
              return (
                <Link
                  key={i.href}
                  href={i.href}
                  aria-current={on ? "page" : undefined}
                  aria-label={i.label}
                  title={i.label}
                  className={`relative flex h-11 items-center gap-2 rounded-xl border px-3 font-judul text-[.95rem] font-semibold transition-colors lg:px-3.5 ${on ? "border-kobalt/25 bg-kobalt-muda text-kobalt" : "border-transparent bg-white text-tinta hover:bg-tinta/5"}`}
                >
                  <Pic file={i.icon} size={24} className="-translate-y-px" />
                  <span className={items.length > 4 && !on ? "hidden lg:inline" : ""}>{i.label}</span>
                  {on && <span aria-hidden="true" className="absolute bottom-[3px] left-[calc(24px+1.1rem)] h-[3px] w-6 rounded-full bg-kobalt" />}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex min-w-0 items-center gap-2.5 lg:gap-3">{right}</div>
        </div>
      </header>

      <nav
        aria-label="Menu utama"
        className="fixed inset-x-0 bottom-0 z-30 grid border-t border-tinta/10 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_-8px_rgba(20,34,63,.18)] md:hidden"
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map((i) => {
          const on = active(i);
          return (
            <Link
              key={i.href}
              href={i.href}
              aria-current={on ? "page" : undefined}
              className={`relative flex min-h-[3.75rem] min-w-[44px] flex-col items-center justify-center gap-0.5 py-1.5 font-judul text-[11.5px] font-semibold ${on ? "text-kobalt" : "text-tinta"}`}
            >
              {on && <span aria-hidden="true" className="absolute inset-x-8 top-0 h-[3px] rounded-b-full bg-kobalt" />}
              <span className={`grid h-8 w-12 place-items-center rounded-full ${on ? "bg-kobalt-muda" : ""}`}>
                <Pic file={i.icon} size={24} />
              </span>
              {i.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function StudentNav({ nickname, level }: { nickname: string; avatar?: string; level: number }) {
  const logout = useLogout();
  const meta = classMeta(level);
  return (
    <Bar
      brandHref="/belajar"
      items={[
        { href: "/belajar", label: "Belajar", match: "/belajar", icon: "belajar" },
        { href: "/karyaku", label: "Karyaku", match: "/karyaku", icon: "karyaku" },
        { href: "/profil", label: "Profil", match: "/profil", icon: "profil" },
      ]}
      right={
        <>
          {/* Penanda proyek: di tablet hanya kode kelas dan ikon, judul muncul di layar lebar. */}
          <span
            className="hidden h-11 min-w-0 items-center gap-2 rounded-full border border-[#ead9b4] bg-[#fbf3e1] py-1 pl-1 pr-3.5 lg:flex"
            title={`Kelas ${level} · ${meta.project}`}
          >
            <span className="grid h-8 shrink-0 place-items-center rounded-full bg-[#1b3a78] px-2.5 font-judul text-[13px] font-extrabold text-white">K{level}</span>
            <Pic file="proyek" size={26} />
            <span className="hidden max-w-[16rem] truncate font-judul text-sm font-semibold text-tinta xl:block 2xl:max-w-[22rem]">{meta.project}</span>
          </span>
          <Link
            href="/profil"
            className="flex min-w-0 items-center gap-2.5 rounded-xl py-0.5 pl-0.5 pr-1.5 hover:bg-tinta/5"
            aria-label={`Profil ${nickname}, kelas ${level}`}
          >
            <Pic file="avatar" size={38} className="rounded-full" />
            <span className="hidden min-w-0 leading-tight lg:block">
              <span className="block max-w-[9rem] truncate font-judul text-[.95rem] font-bold text-tinta xl:max-w-[12rem]">{nickname}</span>
              <span className="block text-[13px] text-tinta-2">Kelas {level}</span>
            </span>
          </Link>
          <LogoutButton onClick={logout} />
        </>
      }
    />
  );
}

export function ParentNav({ parentName, childName, level }: { parentName: string; childName: string; level: number }) {
  const hasChild = !!childName;
  const logout = useLogout();
  return (
    <Bar
      brandHref="/ortu"
      items={[
        { href: "/ortu", label: "Ringkasan", match: "/ortu", exact: true, icon: "kelas" },
        { href: "/ortu/perkembangan", label: "Progres", match: "/ortu/perkembangan", icon: "belajar" },
        { href: "/ortu/karya", label: "Karya", match: "/ortu/karya", icon: "karyaku" },
        { href: "/ortu/catatan", label: "Catatan", match: "/ortu/catatan", icon: "profil" },
        { href: "/ortu/rapor", label: "Rapor", match: "/ortu/rapor", icon: "proyek" },
      ]}
      right={
        <>
          <span className={`${hasChild ? "hidden xl:flex" : "hidden"} h-11 min-w-0 items-center gap-2 rounded-full border border-[#ead9b4] bg-[#fbf3e1] py-1 pl-1 pr-3.5`} title={`Anak: ${childName}, kelas ${level}`}>
            <span className="grid h-8 shrink-0 place-items-center rounded-full bg-[#1b3a78] px-2.5 font-judul text-[13px] font-extrabold text-white">K{level}</span>
            <span className="max-w-[12rem] truncate font-judul text-sm font-semibold text-tinta">Anak: {childName}</span>
          </span>
          <span className="flex min-w-0 items-center gap-2.5">
            <Pic file="avatar" size={38} className="rounded-full" />
            <span className="hidden min-w-0 leading-tight lg:block">
              <span className="block max-w-[11rem] truncate font-judul text-[.95rem] font-bold text-tinta">{parentName}</span>
              <span className="block text-[13px] text-tinta-2">Orang tua</span>
            </span>
          </span>
          <LogoutButton onClick={logout} />
        </>
      }
    />
  );
}

export function TeacherNav({ nickname, level }: { nickname: string; level?: number }) {
  const logout = useLogout();
  return (
    <Bar
      brandHref="/guru"
      items={[
        { href: "/guru", label: "Kelas", match: "/guru", exact: true, icon: "kelas" },
        { href: "/guru/materi", label: "Materi", match: "/guru/materi", icon: "belajar" },
        { href: "/guru/tinjau", label: "Tinjau Karya", match: "/guru/tinjau", icon: "karyaku" },
        { href: "/guru/nilai", label: "Nilai", match: "/guru/nilai", icon: "proyek" },
      ]}
      right={
        <>
          <span className="flex min-w-0 items-center gap-2.5">
            <Pic file="avatar" size={38} className="rounded-full" />
            <span className="hidden min-w-0 leading-tight sm:block">
              <span className="block max-w-[9rem] truncate font-judul text-[.95rem] font-bold text-tinta lg:max-w-[12rem]">{nickname}</span>
              <span className="block text-[13px] text-tinta-2">{level ? `Guru kelas ${level}` : "Koordinator"}</span>
            </span>
          </span>
          <LogoutButton onClick={logout} />
        </>
      }
    />
  );
}
