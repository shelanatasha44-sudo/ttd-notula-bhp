// API Tanda Tangan & Koreksi Notula BHP Medan (Cloudflare Pages Functions, KV binding: TTD)
//
// Kunci KV:
//   doc:<id>            metadata notula (judul, penanda tangan, posisi kotak ttd, versi)
//   pdf:<id>            berkas PDF notula (versi terbaru)
//   sig:<id>:<key>      tanda tangan {img, at, ver}
//   kor:<id>            daftar koreksi (satu dokumen JSON per notula)
//   docs                indeks id notula

const ADMIN_HASH = '5085f6ac55a05a54ce1c8c743c5e74d72a63b28dcc8efc8eb0d5301d59dada41';
const LEGACY_ID = 'notula-20261113';
// Sapaan pegawai BHP Medan (dari digit ke-15 NIP pada sheet Daftar Pegawai: 1 = Bapak, 2 = Ibu)
const SAPAAN = {"syafriadilubis": "Bapak", "nelsydepari": "Ibu", "lusianatarihoran": "Ibu", "elsinthadamayanti": "Ibu", "budiyanto": "Bapak", "syuhada": "Bapak", "dartimnovmtharahap": "Bapak", "marianibrmarbun": "Ibu", "tumiarsimanjorang": "Ibu", "nanangsuryapurnama": "Bapak", "titinwahyunasaridongoran": "Ibu", "jokoprabowo": "Bapak", "dianstevanytongli": "Ibu", "mtaufikrahman": "Bapak", "shelanatasha": "Ibu", "hutrizebua": "Bapak", "nurfairuzdibanasution": "Ibu", "diajengkartikasari": "Ibu", "rifalsaptahadi": "Bapak", "andreyosuasurbakti": "Bapak", "teukumeurahalbar": "Bapak", "hartoalfredosiregar": "Bapak", "annisadwimarina": "Ibu", "elsyindriani": "Ibu", "yusrilihzamahendra": "Bapak", "nindia": "Ibu", "naekparlindungansibuea": "Bapak", "bettyirawatisinaga": "Ibu", "adelinairmadewitasiagian": "Ibu", "agniramaniyamaharani": "Ibu", "tridolasiregar": "Ibu", "febrinasiringoringo": "Ibu", "indriananurkamsiah": "Ibu", "royalexander": "Bapak"};
const normName = n => String(n || '').replace(/,.*$/, '').replace(/\b(Dr|Drs|Ir|H|Hj)\.?\s+/gi, '').toLowerCase().replace(/[^a-z]/g, '');
function sapaanOf(name, given) {
  if (given === 'Bapak' || given === 'Ibu') return given;
  const k = normName(name);
  if (SAPAAN[k]) return SAPAAN[k];
  const hit = Object.keys(SAPAAN).find(x => x.startsWith(k) || k.startsWith(x));
  return hit ? SAPAAN[hit] : 'Bapak/Ibu';
}

const enc = new TextEncoder();
async function sha256(s) {
  const b = await crypto.subtle.digest('SHA-256', enc.encode(String(s || '')));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
function rand(n = 9) {
  const a = crypto.getRandomValues(new Uint8Array(n));
  return btoa(String.fromCharCode(...a)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
const json = (o, status = 200) => new Response(JSON.stringify(o), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const err = (m, s = 400) => json({ error: m }, s);
const slug = s => String(s || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
const clean = (s, n = 500) => String(s ?? '').slice(0, n);
const num = v => Math.max(0, Math.min(1, Number(v) || 0));

async function isAdmin(k) { return k && (await sha256(k)) === ADMIN_HASH; }

async function getIndex(env) { return (await env.TTD.get('docs', 'json')) || []; }
async function setIndex(env, ids) { await env.TTD.put('docs', JSON.stringify([...new Set(ids)])); }
async function getDoc(env, id) {
  let d = await env.TTD.get('doc:' + id, 'json');
  if (!d && id === LEGACY_ID) d = await seedLegacy(env);
  return d;
}
async function putDoc(env, d) { await env.TTD.put('doc:' + d.id, JSON.stringify(d)); }

// Notula pertama (13 Nov 2026) dibuat otomatis dari berkas statis, termasuk ttd yang sudah tersimpan di format lama.
let seeding = null;
async function seedLegacy(env) {
  if (!env.ASSETS) return null;
  if (seeding) return seeding;
  seeding = (async () => {
    const meta = await (await env.ASSETS.fetch('https://x/legacy.json')).json();
    const pdf = await (await env.ASSETS.fetch('https://x/notula.pdf')).arrayBuffer();
    await env.TTD.put('pdf:' + meta.id, pdf);
    for (const s of meta.signers) {
      const old = await env.TTD.get('ttd:' + s.key, 'json');
      if (old) await env.TTD.put('sig:' + meta.id + ':' + s.key, JSON.stringify({ ...old, ver: 1 }));
    }
    await putDoc(env, meta);
    await setIndex(env, [...(await getIndex(env)), meta.id]);
    return meta;
  })();
  return seeding;
}

function publicDoc(d) {
  return {
    id: d.id, title: d.title, subtitle: d.subtitle, ver: d.ver, updated: d.updated, created: d.created,
    signers: d.signers.map(({ key, name, role, page, x, y, w, h, sapaan }) => ({ key, name, role, page, x, y, w, h, sapaan: sapaan || sapaanOf(name) })),
  };
}
async function getSigs(env, d) {
  const out = {};
  await Promise.all(d.signers.map(async s => {
    const v = await env.TTD.get('sig:' + d.id + ':' + s.key, 'json');
    if (v) out[s.key] = v;
  }));
  return out;
}
async function getKor(env, id) { return (await env.TTD.get('kor:' + id, 'json')) || []; }
async function putKor(env, id, list) { await env.TTD.put('kor:' + id, JSON.stringify(list)); }

async function signerAuth(d, key, k) {
  const s = d.signers.find(x => x.key === key);
  if (!s) return null;
  if (await isAdmin(k)) return s;
  return (await sha256(k)) === s.tokenHash ? s : null;
}

function b64ToBuf(b64) {
  const bin = atob(String(b64).replace(/^data:[^,]+,/, ''));
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u.buffer;
}

function normSigners(list, prev = []) {
  const used = new Set();
  return (list || []).slice(0, 40).map((s, i) => {
    let key = slug(s.key || s.name) || 'p' + (i + 1);
    while (used.has(key)) key += '-' + (i + 1);
    used.add(key);
    const old = prev.find(p => p.key === (s.key || key));
    return {
      key, name: clean(s.name, 120), role: clean(s.role, 160), sapaan: sapaanOf(s.name, s.sapaan),
      page: Math.max(1, parseInt(s.page) || 1), x: num(s.x), y: num(s.y), w: num(s.w) || 0.25, h: num(s.h) || 0.06,
      token: old?.token, tokenHash: old?.tokenHash,
    };
  });
}
async function ensureTokens(signers) {
  for (const s of signers) {
    if (!s.tokenHash) { s.token = rand(); s.tokenHash = await sha256(s.token); }
  }
  return signers;
}

export async function onRequest(ctx) {
  const { request, env, params } = ctx;
  if (!env.TTD) return err('Penyimpanan KV (TTD) belum terhubung', 500);
  const parts = [].concat(params.path || []);
  const m = request.method;
  const url = new URL(request.url);
  let body = {};
  if (m !== 'GET' && m !== 'HEAD') { try { body = await request.json(); } catch { body = {}; } }
  const k = body.k || url.searchParams.get('k') || request.headers.get('x-key') || '';

  try {
    // ---------- daftar & buat notula (admin) ----------
    if (parts[0] === 'docs' && parts.length === 1) {
      if (!(await isAdmin(k))) return err('Khusus admin', 403);
      if (m === 'GET') {
        const ids = await getIndex(env);
        if (!ids.includes(LEGACY_ID)) { await getDoc(env, LEGACY_ID); ids.unshift(LEGACY_ID); }
        const docs = [];
        for (const id of ids) {
          const d = await getDoc(env, id); if (!d) continue;
          const sigs = await getSigs(env, d); const kor = await getKor(env, id);
          docs.push({ ...publicDoc(d), signed: Object.values(sigs).filter(x => x.ver === d.ver).length,
            koreksiBaru: kor.filter(c => c.status !== 'selesai').length });
        }
        return json(docs.sort((a, b) => String(b.created).localeCompare(String(a.created))));
      }
      if (m === 'POST') {
        if (!body.title || !body.pdf) return err('Judul dan berkas PDF wajib diisi');
        const buf = b64ToBuf(body.pdf);
        if (buf.byteLength > 20e6) return err('PDF terlalu besar (maks 20 MB)');
        let id = slug(body.id || body.title) || 'notula';
        if (await env.TTD.get('doc:' + id)) id += '-' + rand(3).toLowerCase();
        const now = new Date().toISOString();
        const d = { id, title: clean(body.title, 200), subtitle: clean(body.subtitle, 200), ver: 1, created: now, updated: now,
          signers: await ensureTokens(normSigners(body.signers)) };
        await env.TTD.put('pdf:' + id, buf);
        await putDoc(env, d);
        await setIndex(env, [...(await getIndex(env)), id]);
        return json({ ok: true, id });
      }
    }

    if (parts[0] !== 'docs' || !parts[1]) return err('Tidak ditemukan', 404);
    const id = parts[1];
    const d = await getDoc(env, id);
    if (!d) return err('Notula tidak ditemukan', 404);
    const sub = parts[2] || '';

    // ---------- baca notula ----------
    if (!sub && m === 'GET') {
      return json({ doc: publicDoc(d), sigs: await getSigs(env, d), koreksi: await getKor(env, id) });
    }
    if (sub === 'pdf' && m === 'GET') {
      const pdf = await env.TTD.get('pdf:' + id, 'arrayBuffer');
      if (!pdf) return err('PDF tidak ditemukan', 404);
      return new Response(pdf, { headers: { 'content-type': 'application/pdf', 'cache-control': 'no-store' } });
    }

    // ---------- admin: detail (dengan link), ubah, revisi PDF, hapus ----------
    if (sub === 'admin') {
      if (!(await isAdmin(k))) return err('Khusus admin', 403);
      if (m === 'GET') return json({ doc: { ...publicDoc(d), signers: d.signers.map(({ tokenHash, ...s }) => ({ ...s, hasLink: !!tokenHash })) } });
      if (m === 'PUT') {
        if (body.title) d.title = clean(body.title, 200);
        if ('subtitle' in body) d.subtitle = clean(body.subtitle, 200);
        if (body.signers) d.signers = await ensureTokens(normSigners(body.signers, d.signers));
        if (body.regenerate) {
          const s = d.signers.find(x => x.key === body.regenerate);
          if (s) { s.token = rand(); s.tokenHash = await sha256(s.token); }
        }
        if (body.pdf) {
          const buf = b64ToBuf(body.pdf);
          if (buf.byteLength > 20e6) return err('PDF terlalu besar (maks 20 MB)');
          await env.TTD.put('pdf:' + id, buf);
          d.ver = (d.ver || 1) + 1;
          if (body.resolveAll) {
            const kor = await getKor(env, id);
            kor.forEach(c => { if (c.status !== 'selesai') { c.status = 'selesai'; c.doneAt = new Date().toISOString(); } });
            await putKor(env, id, kor);
          }
        }
        d.updated = new Date().toISOString();
        await putDoc(env, d);
        return json({ ok: true, ver: d.ver });
      }
      if (m === 'DELETE') {
        await env.TTD.delete('doc:' + id); await env.TTD.delete('pdf:' + id); await env.TTD.delete('kor:' + id);
        for (const s of d.signers) await env.TTD.delete('sig:' + id + ':' + s.key);
        await setIndex(env, (await getIndex(env)).filter(x => x !== id));
        return json({ ok: true });
      }
    }

    // ---------- tanda tangan ----------
    if (sub === 'sign' && m === 'POST') {
      const s = await signerAuth(d, body.key, k);
      if (!s) return err('Link tanda tangan tidak valid untuk nama ini', 403);
      if (body.action === 'reset') {
        if (!(await isAdmin(k)) && body.key !== s.key) return err('Tidak diizinkan', 403);
        await env.TTD.delete('sig:' + id + ':' + s.key);
        return json({ ok: true });
      }
      const img = body.img;
      if (typeof img !== 'string' || !img.startsWith('data:image/png;base64,') || img.length > 500000) return err('Gambar tanda tangan tidak valid');
      const rec = { img, at: new Date().toISOString(), ver: d.ver };
      await env.TTD.put('sig:' + id + ':' + s.key, JSON.stringify(rec));
      return json({ ok: true, at: rec.at });
    }

    // ---------- koreksi ----------
    if (sub === 'koreksi') {
      const kor = await getKor(env, id);
      if (m === 'POST') {
        const s = await signerAuth(d, body.key, k);
        if (!s) return err('Link tidak valid untuk mengirim koreksi', 403);
        const items = (body.items || []).slice(0, 50);
        if (!items.length) return err('Belum ada koreksi');
        const now = new Date().toISOString();
        for (const it of items) {
          kor.push({ id: rand(6), by: s.key, byName: s.name, ver: d.ver, at: now, status: 'baru',
            page: Math.max(1, parseInt(it.page) || 1), x: num(it.x), y: num(it.y), w: num(it.w), h: num(it.h),
            cat: clean(it.cat, 40), from: clean(it.from, 600), to: clean(it.to, 1200), note: clean(it.note, 1200), agree: [] });
        }
        if (kor.length > 1000) return err('Koreksi terlalu banyak');
        await putKor(env, id, kor);
        return json({ ok: true, count: items.length });
      }
      if (m === 'PATCH') {
        const c = kor.find(x => x.id === body.id);
        if (!c) return err('Koreksi tidak ditemukan', 404);
        const admin = await isAdmin(k);
        const s = admin ? null : await signerAuth(d, body.key, k);
        if (!admin && !s) return err('Tidak diizinkan', 403);
        if (body.agree !== undefined && s) {
          c.agree = (c.agree || []).filter(x => x !== s.key);
          if (body.agree) c.agree.push(s.key);
        }
        if (body.status && (admin || (s && s.key === c.by && body.status === 'dibatalkan'))) {
          c.status = ['baru', 'diproses', 'selesai', 'dibatalkan'].includes(body.status) ? body.status : c.status;
          if (body.reply !== undefined && admin) c.reply = clean(body.reply, 800);
          c.doneAt = new Date().toISOString();
        } else if (body.reply !== undefined && admin) c.reply = clean(body.reply, 800);
        await putKor(env, id, kor);
        return json({ ok: true });
      }
    }
    return err('Tidak ditemukan', 404);
  } catch (e) {
    return err('Terjadi kesalahan: ' + (e && e.message || e), 500);
  }
}
