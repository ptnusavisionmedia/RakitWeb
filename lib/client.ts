export async function post<T = { ok: boolean; error?: string; redirect?: string }>(url: string, body: unknown, method: "POST" | "PUT" = "POST", keepalive = false): Promise<T> {
  try {
    const r = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body), keepalive });
    return (await r.json()) as T;
  } catch {
    return { ok: false, error: "Tidak terhubung. Coba lagi sebentar." } as T;
  }
}
