// Cloudflare Pages Function: simpan & ambil tanda tangan (KV binding: TTD)
const HASH = {
  "syuhada": "ab4c4c53136ef44a2051dfb70f38495b95e375010bcc719d0f08a3f3c8367433",
  "syafriadi": "7120ab3cd047b22b17b9d1a2eba3bc3dc88de90ee6a9230a015ae53f721f45ac",
  "elsintha": "a16ea2f0bcf736461c362a241a24f4b9f791ff89d912f92351b35ade90f0a30a",
  "shela": "da356f1cc9b0bd691d09a98d85a7bddfc72047952771c1e6f017db678b1e03e6",
  "andre": "5c4bef83148cd960ec72f5bec2244679344d7fb1a74e501b77cc625f5eea57f1",
  "annisa": "9c28704b5512bde8c14d716cb441651abf1cf207d58258e9048d0f7d9768c415",
  "yusril": "df5cd195f53d78487d3854c5c1d9b436f679f3f97ef4f25adfa70efba4c42586",
  "admin": "5085f6ac55a05a54ce1c8c743c5e74d72a63b28dcc8efc8eb0d5301d59dada41"
};

async function sha256(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
const json = (o, status = 200) => new Response(JSON.stringify(o), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

export async function onRequestGet({ env }) {
  if (!env.TTD) return json({ error: 'KV belum terhubung' }, 500);
  const out = {};
  for (const k of Object.keys(HASH)) {
    if (k === 'admin') continue;
    const v = await env.TTD.get('ttd:' + k, 'json');
    if (v) out[k] = v;
  }
  return json(out);
}

export async function onRequestPost({ request, env }) {
  if (!env.TTD) return json({ error: 'KV belum terhubung' }, 500);
  let b;
  try { b = await request.json(); } catch { return json({ error: 'Data tidak valid' }, 400); }
  const { key, k, img, action } = b || {};
  if (!key || !HASH[key] || key === 'admin') return json({ error: 'Nama tidak dikenal' }, 400);
  const hk = await sha256(String(k || ''));
  const isAdmin = hk === HASH.admin;
  if (!isAdmin && hk !== HASH[key]) return json({ error: 'Link tanda tangan tidak valid untuk nama ini' }, 403);
  if (action === 'reset') {
    await env.TTD.delete('ttd:' + key);
    return json({ ok: true });
  }
  if (typeof img !== 'string' || !img.startsWith('data:image/png;base64,') || img.length > 400000)
    return json({ error: 'Gambar tanda tangan tidak valid' }, 400);
  const prev = await env.TTD.get('ttd:' + key);
  if (prev && !isAdmin) return json({ error: 'Nama ini sudah menandatangani' }, 409);
  const rec = { img, at: new Date().toISOString() };
  await env.TTD.put('ttd:' + key, JSON.stringify(rec));
  return json({ ok: true, at: rec.at });
}
