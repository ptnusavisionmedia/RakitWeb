"use client";

import { useEffect, useRef } from "react";

/** Memunculkan isi dengan halus saat digulir ke layar. */
export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("sudah"); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("sudah"); io.unobserve(e.target); } }), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`tampil-nanti ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}
