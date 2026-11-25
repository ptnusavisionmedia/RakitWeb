export function Monogram({ name, size = 36 }: { name: string; size?: number }) {
  const t = name.replace(/\(.*?\)/g, "").trim();
  const ini = (t.split(/\s+/).map((w) => w[0]).join("").slice(0, 2) || "?").toUpperCase();
  return (
    <span aria-hidden="true" className="inline-grid shrink-0 place-items-center rounded-full bg-kobalt-muda font-judul font-bold text-kobalt" style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {ini}
    </span>
  );
}
