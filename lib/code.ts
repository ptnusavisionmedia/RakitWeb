import { artUri } from "./art";
import type { Snippet } from "./curriculum/types";
import type { Files } from "./starter";

// ---------- pratinjau terisolasi ----------
const BRIDGE = `(function(){
  var send=function(m){m.rw=1;parent.postMessage(m,'*')};
  window.addEventListener('error',function(e){send({type:'error',message:e.message,line:e.lineno})});
  document.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('a[href]'):null; if(!a) return;
    var h=a.getAttribute('href')||''; e.preventDefault();
    if(h.charAt(0)==='#'){var id=h.slice(1);var t=id?document.getElementById(id):document.body;if(t){t.scrollIntoView({behavior:'smooth'});}else{send({type:'missing-anchor',href:h});}return;}
    if(/^https?:/i.test(h)){send({type:'external',href:h});return;}
    send({type:'nav',href:h});
  },true);
  document.addEventListener('submit',function(e){
    e.preventDefault();var d=new FormData(e.target);var parts=[];d.forEach(function(v,k){parts.push(k+' = '+v)});
    var box=document.getElementById('__rw_box');
    if(!box){box=document.createElement('div');box.id='__rw_box';box.style.cssText='position:fixed;left:8px;right:8px;bottom:8px;background:#14223f;color:#fff;padding:10px 12px;border-radius:10px;font:14px/1.4 system-ui,sans-serif;z-index:99999';document.body.appendChild(box);}
    box.textContent='Hasil percobaan (hanya di pratinjau, tidak dikirim): '+(parts.join(', ')||'(kosong)');
  },true);
})();`;

const CSP = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'none'; base-uri 'none'">`;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

export function missingPage(page: string): string {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8">${CSP}<style>body{font-family:system-ui,sans-serif;padding:24px;color:#14223f;background:#fffaf0}code{background:#e4edfb;padding:2px 6px;border-radius:6px}</style></head><body><h2>Halaman tidak ditemukan</h2><p>Tautan menuju <code>${esc(page)}</code> tidak punya file yang cocok.</p><p>Periksa nama file di <code>href</code>. Huruf dan titiknya harus sama persis.</p></body></html>`;
}

function inlineImages(text: string): string {
  return text.replace(/gambar\/([a-z0-9-]+)\.svg/gi, (m, name: string) => artUri(name.toLowerCase()) ?? m);
}

export function buildPreview(files: Files, page: string): string {
  let html = files[page];
  if (html === undefined) return missingPage(page);
  const css = inlineImages(files["style.css"] ?? "");
  const js = (files["script.js"] ?? "").replace(/<\/script/gi, "<\\/script");
  html = html.replace(/<link\b[^>]*href=["']style\.css["'][^>]*>/i, () => `<style>${css}</style>`);
  html = html.replace(/<script\b[^>]*src=["']script\.js["'][^>]*>\s*<\/script>/i, () => `<script>${js}</script>`);
  html = inlineImages(html);
  const head = `${CSP}<script>${BRIDGE}</script>`;
  if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, (m) => m + head);
  if (/<html[^>]*>/i.test(html)) return html.replace(/<html[^>]*>/i, (m) => `${m}<head>${head}</head>`);
  return `<!DOCTYPE html><html><head>${head}</head><body>${html}</body></html>`;
}

/** Terjemahkan href ke nama file. Mengembalikan null jika bukan tautan antarhalaman. */
export function resolveHref(href: string): string {
  return href.replace(/^\.\//, "").split("#")[0].split("?")[0];
}

// ---------- kode awal ----------
const firstLine = (code: string) => code.split("\n").find((l) => l.trim())?.trim() ?? "";

export function isApplied(files: Files, snippets: Snippet[]): boolean {
  return snippets.every((s) => (files[s.file] ?? "").includes(firstLine(s.code)));
}

export function applySnippets(files: Files, snippets: Snippet[]): Files {
  const out = { ...files };
  for (const s of snippets) {
    const cur = out[s.file] ?? "";
    if (cur.includes(firstLine(s.code))) continue;
    if (!s.file.endsWith(".html")) {
      out[s.file] = cur + (cur.endsWith("\n") || !cur ? "" : "\n") + "\n" + s.code;
      continue;
    }
    let next: string;
    if (s.at === "top") {
      const m = cur.match(/<body[^>]*>\n?/i);
      next = m && m.index !== undefined ? cur.slice(0, m.index + m[0].length) + s.code + cur.slice(m.index + m[0].length) : s.code + cur;
    } else {
      const sm = cur.match(/^[ \t]*<script\b[^>]*src=["']script\.js["'][^>]*><\/script>/m);
      const bm = cur.match(/<\/body>/i);
      const at = sm?.index ?? bm?.index;
      next = at !== undefined ? cur.slice(0, at) + s.code + cur.slice(at) : cur + "\n" + s.code;
    }
    out[s.file] = next;
  }
  return out;
}

// ---------- pemeriksa ----------
export type Finding = { file: string; text: string };

const stripComments = (s: string) => s.replace(/<!--[\s\S]*?-->/g, "");

export function privacyScan(files: Files): Finding[] {
  const out: Finding[] = [];
  for (const [file, raw] of Object.entries(files)) {
    const txt = file.endsWith(".html") ? stripComments(raw) : raw;
    if (/(\+62|\b0)8\d{2}[\s-]?\d{3,4}[\s-]?\d{3,5}/.test(txt) || /\b0\d{2,3}[\s-]\d{6,8}\b/.test(txt)) out.push({ file, text: "Ada yang mirip nomor telepon. Hapus atau ganti dengan data fiktif." });
    if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(txt)) out.push({ file, text: "Ada yang mirip alamat email. Hapus dari halaman." });
    if (/\bJl\.|\bJalan [A-Z]|\bRT ?\d|\bRW ?\d|\bGg\./.test(txt)) out.push({ file, text: "Ada yang mirip alamat rumah. Jangan tampilkan alamat." });
    if (file.endsWith(".html") && /<img\b[^>]*src=["']https?:/i.test(txt)) out.push({ file, text: "Ada gambar dari internet. Pakai gambar RakitWeb atau gambar buatan sendiri." });
    if (/url\(["']?https?:/i.test(txt)) out.push({ file, text: "Ada gambar latar dari internet. Pakai gambar yang boleh dipakai." });
    if (file.endsWith(".html") && /<a\b[^>]*href=["']https?:/i.test(txt)) out.push({ file, text: "Ada tautan ke website luar. Tanyakan guru sebelum memakainya." });
  }
  return out;
}

export function linkScan(files: Files): Finding[] {
  const out: Finding[] = [];
  const pages = Object.keys(files).filter((f) => f.endsWith(".html"));
  for (const file of pages) {
    const html = stripComments(files[file]);
    if (!/<title>\s*\S/i.test(html)) out.push({ file, text: "Halaman belum punya <title>." });
    if (/\bUBAH\b/.test(html)) out.push({ file, text: "Masih ada tulisan UBAH yang belum diganti." });
    for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']*)["'][^>]*>/gi)) {
      const href = m[1];
      if (/^https?:/i.test(href) || href.startsWith("mailto:")) continue;
      if (href === "" || href === "#") { out.push({ file, text: "Ada tautan kosong (href belum diisi)." }); continue; }
      if (href.startsWith("#")) {
        const id = href.slice(1);
        if (!new RegExp(`\\bid=["']${id.replace(/[^\w-]/g, "")}["']`).test(html)) out.push({ file, text: `Tautan ${href} menuju id yang belum ada di halaman ini.` });
        continue;
      }
      const target = resolveHref(href);
      if (!files[target]) out.push({ file, text: `Tautan “${href}” tidak punya file tujuan.` });
      else if (href.includes("#")) {
        const id = href.split("#")[1];
        if (id && !new RegExp(`\\bid=["']${id}["']`).test(files[target])) out.push({ file, text: `Tautan “${href}” menuju id yang belum ada.` });
      }
    }
    for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
      const alt = m[0].match(/\balt=["']([^"']*)["']/i);
      if (!alt || !alt[1].trim() || /UBAH/.test(alt[1])) out.push({ file, text: "Ada gambar tanpa teks alternatif yang jelas." });
      const src = m[0].match(/\bsrc=["']([^"']*)["']/i)?.[1] ?? "";
      if (src && !/^https?:/i.test(src)) {
        const nm = src.match(/^gambar\/([a-z0-9-]+)\.svg$/i)?.[1];
        if (!nm || !artUri(nm.toLowerCase())) out.push({ file, text: `Gambar “${src}” tidak ada di perpustakaan gambar.` });
      }
    }
  }
  if (/\bUBAH\b[^\n]*['"]/.test((files["script.js"] ?? "").split("\n").filter((l) => !l.trim().startsWith("//")).join("\n")))
    out.push({ file: "script.js", text: "Masih ada tulisan UBAH di dalam JavaScript." });
  return out;
}
