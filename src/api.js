// API Tanda Tangan & Koreksi Notula BHP Medan (Cloudflare Worker, KV binding: TTD)
import { SEEDS } from './seeds.js';
//
// Kunci KV:
//   doc:<id>            metadata notula (judul, penanda tangan, posisi kotak ttd, versi)
//   pdf:<id>            berkas PDF notula (versi terbaru)
//   sig:<id>:<key>      tanda tangan {img, at, ver}
//   kor:<id>            daftar koreksi (satu dokumen JSON per notula)
//   docs                indeks id notula
//   seq                 nomor notula terakhir
//   short:<kode>        link pendek per penanda tangan, contoh ttdshela2 -> {id, key}

const ADMIN_HASH = '5085f6ac55a05a54ce1c8c743c5e74d72a63b28dcc8efc8eb0d5301d59dada41';
// Sapaan pegawai BHP Medan (dari digit ke-15 NIP pada sheet Daftar Pegawai: 1 = Bapak, 2 = Ibu)
const SAPAAN = {"syafriadilubis": "Bapak", "nelsydepari": "Ibu", "lusianatarihoran": "Ibu", "elsinthadamayanti": "Ibu", "budiyanto": "Bapak", "syuhada": "Bapak", "dartimnovmtharahap": "Bapak", "marianibrmarbun": "Ibu", "tumiarsimanjorang": "Ibu", "nanangsuryapurnama": "Bapak", "titinwahyunasaridongoran": "Ibu", "jokoprabowo": "Bapak", "dianstevanytongli": "Ibu", "mtaufikrahman": "Bapak", "shelanatasha": "Ibu", "hutrizebua": "Bapak", "nurfairuzdibanasution": "Ibu", "diajengkartikasari": "Ibu", "rifalsaptahadi": "Bapak", "andreyosuasurbakti": "Bapak", "teukumeurahalbar": "Bapak", "hartoalfredosiregar": "Bapak", "annisadwimarina": "Ibu", "elsyindriani": "Ibu", "yusrilihzamahendra": "Bapak", "nindia": "Ibu", "naekparlindungansibuea": "Bapak", "bettyirawatisinaga": "Ibu", "adelinairmadewitasiagian": "Ibu", "agniramaniyamaharani": "Ibu", "tridolasiregar": "Ibu", "febrinasiringoringo": "Ibu", "indriananurkamsiah": "Ibu", "royalexander": "Bapak"};
const normName = n => String(n || '').replace(/,.*$/, '').replace(/\b(Dr|Drs|Ir|H|Hj)\.?\s+/gi, '').toLowerCase().replace(/[^a-z]/g, '');
const PEGAWAI = [{"name": "Syafriadi Lubis", "role": "Kepala Balai Harta Peninggalan Medan", "sapaan": "Bapak"}, {"name": "Nelsy Depari", "role": "Kepala Subbagian Umum", "sapaan": "Ibu"}, {"name": "Lusiana Tarihoran", "role": "Kepala Seksi Harta Peninggalan Wilayah I", "sapaan": "Ibu"}, {"name": "Elsintha Damayanti", "role": "Kepala Seksi Harta Peninggalan Wilayah II", "sapaan": "Ibu"}, {"name": "Budiyanto", "role": "Kepala Seksi Harta Peninggalan Wilayah III", "sapaan": "Bapak"}, {"name": "Syuhada", "role": "Kurator Keperdataan Ahli Madya", "sapaan": "Bapak"}, {"name": "Dartimnov M.T Harahap", "role": "Kurator Keperdataan Ahli Madya", "sapaan": "Bapak"}, {"name": "Mariani Br Marbun", "role": "Kurator Keperdataan Ahli Madya", "sapaan": "Ibu"}, {"name": "Tumiar Simanjorang", "role": "Kurator Keperdataan Ahli Madya", "sapaan": "Ibu"}, {"name": "Nanang Surya Purnama", "role": "Kurator Keperdataan Ahli Muda", "sapaan": "Bapak"}, {"name": "Titin Wahyunasari Dongoran", "role": "Kurator Keperdataan Ahli Muda", "sapaan": "Ibu"}, {"name": "Joko Prabowo", "role": "Kurator Keperdataan Ahli Muda", "sapaan": "Bapak"}, {"name": "Dian Stevany Tongli", "role": "Kurator Keperdataan Ahli Muda", "sapaan": "Ibu"}, {"name": "M. Taufik Rahman", "role": "Kurator Keperdataan Ahli Pertama", "sapaan": "Bapak"}, {"name": "Shela Natasha", "role": "Kurator Keperdataan Ahli Pertama", "sapaan": "Ibu"}, {"name": "Hutri Zebua", "role": "Kurator Keperdataan Ahli Pertama", "sapaan": "Bapak"}, {"name": "Nur Fairuz Diba Nasution", "role": "Kurator Keperdataan Ahli Pertama", "sapaan": "Ibu"}, {"name": "Diajeng Kartika Sari", "role": "Kurator Keperdataan Ahli Pertama", "sapaan": "Ibu"}, {"name": "Rifal Sapta Hadi", "role": "Kurator Keperdataan Ahli Pertama", "sapaan": "Bapak"}, {"name": "Andre Yosua Surbakti", "role": "Kurator Keperdataan Ahli Pertama", "sapaan": "Bapak"}, {"name": "Teuku Meurah Albar", "role": "Kurator Keperdataan Ahli Pertama", "sapaan": "Bapak"}, {"name": "Harto Alfredo Siregar", "role": "Kurator Keperdataan Ahli Pertama", "sapaan": "Bapak"}, {"name": "Annisa Dwi Marina", "role": "Kurator Keperdataan Ahli Pertama", "sapaan": "Ibu"}, {"name": "Elsy Indriani", "role": "Kurator Keperdataan Ahli Pertama", "sapaan": "Ibu"}, {"name": "Yusril Ihza Mahendra", "role": "Kurator Keperdataan Ahli Pertama", "sapaan": "Bapak"}, {"name": "Nindia", "role": "Kurator Keperdataan Ahli Pertama", "sapaan": "Ibu"}, {"name": "Naek Parlindungan Sibuea", "role": "Pengolah Data dan Informasi", "sapaan": "Bapak"}, {"name": "Betty Irawati Sinaga", "role": "Pengelola Layanan Operasional", "sapaan": "Ibu"}, {"name": "Adelina Irmadewita Siagian", "role": "Penelaah Teknis Kebijakan", "sapaan": "Ibu"}, {"name": "Agni Ramaniya Maharani", "role": "Penelaah Teknis Kebijakan", "sapaan": "Ibu"}, {"name": "Tridola Siregar", "role": "Penata Kelola Pemerintahan", "sapaan": "Ibu"}, {"name": "Febrina Siringoringo", "role": "Penelaah Teknis Kebijakan", "sapaan": "Ibu"}, {"name": "Indriana Nurkamsiah", "role": "Pengadministrasi Perkantoran", "sapaan": "Ibu"}, {"name": "Roy Alexander", "role": "Pengelola Layanan Pengadaan", "sapaan": "Bapak"}];
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

const PASS_HASH = '9708aae5022ad8ae652b713c37cd4bca3e41ce2278504094a91400e37afa2818'; // password login admin
async function isAdmin(k) { if (!k) return false; const h = await sha256(k); return h === ADMIN_HASH || h === PASS_HASH; }

async function getIndex(env) { return (await env.TTD.get('docs', 'json')) || []; }
async function setIndex(env, ids) { await env.TTD.put('docs', JSON.stringify([...new Set(ids)])); }
async function getDoc(env, id) {
  let d = await env.TTD.get('doc:' + id, 'json');
  if (!d && SEEDS.some(x => x.id === id)) d = await seedDoc(env, SEEDS.find(x => x.id === id));
  return d;
}
async function putDoc(env, d) { await env.TTD.put('doc:' + d.id, JSON.stringify(d)); }
async function ensureSeeds(env) { for (const sd of SEEDS) await getDoc(env, sd.id); }

// Notula awal (dibundel di Worker) dimasukkan ke KV saat pertama kali dibutuhkan
const seeding = {};
function seedDoc(env, sd) {
  if (seeding[sd.id]) return seeding[sd.id];
  return (seeding[sd.id] = (async () => {
    const d = { id: sd.id, no: sd.no, title: sd.title, subtitle: sd.subtitle, ver: 1, created: sd.created, updated: new Date().toISOString(),
      signers: await ensureTokens(normSigners(sd.signers)) };
    await env.TTD.put('pdf:' + d.id, sd.pdf);
    await finalizeDoc(env, d);
    const seq = parseInt(await env.TTD.get('seq')) || 0;
    if (sd.no > seq) await env.TTD.put('seq', String(sd.no));
    return d;
  })());
}
// kunci lihat-saja, link pendek, simpan & indeks
async function finalizeDoc(env, d) {
  if (!d.view) d.view = rand(8);
  await assignShorts(env, d);
  await putDoc(env, d);
  await setIndex(env, [...(await getIndex(env)), d.id]);
}
const firstName = n => String(n || '').replace(/,.*$/, '').replace(/^(M\.|Muhammad|Moh\.|Hj?\.|Dr\.|Drs\.|Ir\.)\s+/i, '').trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '') || 'peserta';
async function assignShorts(env, d) {
  for (const s of d.signers) {
    if (s.short) continue;
    const parts = String(s.name).replace(/,.*$/, '').toLowerCase().replace(/[^a-z ]/g, '').split(/\s+/).filter(Boolean);
    const cands = [firstName(s.name), firstName(s.name) + (parts[1] || '').slice(0, 1), firstName(s.name) + (parts[1] || '')];
    let code = null;
    for (const c of cands) {
      const k = 'ttd' + c + d.no;
      const ex = await env.TTD.get('short:' + k, 'json');
      if (!ex || (ex.id === d.id && ex.key === s.key)) { code = k; break; }
    }
    if (!code) code = 'ttd' + firstName(s.name) + d.no + '-' + rand(2).toLowerCase();
    s.short = code;
    await env.TTD.put('short:' + code, JSON.stringify({ id: d.id, key: s.key }));
  }
}
export async function resolveShort(env, code) {
  let m = await env.TTD.get('short:' + String(code).toLowerCase(), 'json');
  if (!m) { await ensureSeeds(env); m = await env.TTD.get('short:' + String(code).toLowerCase(), 'json'); }
  if (!m) return null;
  const d = await getDoc(env, m.id); const s = d && d.signers.find(x => x.key === m.key);
  if (!s || !s.token) return null;
  return '/?d=' + encodeURIComponent(d.id) + '&n=' + encodeURIComponent(s.key) + '&k=' + encodeURIComponent(s.token);
}
async function canView(d, k, v) {
  if (v && d.view && v === d.view) return true;
  if (!k) return false;
  if (await isAdmin(k)) return true;
  const h = await sha256(k);
  return d.signers.some(s => s.tokenHash === h);
}

function publicDoc(d) {
  return {
    id: d.id, no: d.no, title: d.title, subtitle: d.subtitle, ver: d.ver, updated: d.updated, created: d.created,
    signers: d.signers.map(({ key, name, role, page, x, y, w, h, sapaan, short }) => ({ key, name, role, page, x, y, w, h, sapaan: sapaan || sapaanOf(name), short })),
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
      key, name: clean(s.name, 120), role: clean(s.role, 160), sapaan: sapaanOf(s.name, s.sapaan), short: old?.short,
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
    if (parts[0] === 'pegawai' && m === 'GET') {
      if (!(await isAdmin(k))) return err('Khusus admin', 403);
      return json(PEGAWAI);
    }
    if (parts[0] === 'docs' && parts.length === 1) {
      if (!(await isAdmin(k))) return err('Khusus admin', 403);
      if (m === 'GET') {
        await ensureSeeds(env);
        const ids = await getIndex(env);
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
        const no = (parseInt(await env.TTD.get('seq')) || SEEDS.length) + 1;
        await env.TTD.put('seq', String(no));
        const d = { id, no, title: clean(body.title, 200), subtitle: clean(body.subtitle, 200), ver: 1, created: now, updated: now,
          signers: await ensureTokens(normSigners(body.signers)) };
        await env.TTD.put('pdf:' + id, buf);
        await finalizeDoc(env, d);
        return json({ ok: true, id });
      }
    }

    if (parts[0] !== 'docs' || !parts[1]) return err('Tidak ditemukan', 404);
    const id = parts[1];
    const d = await getDoc(env, id);
    if (!d) return err('Notula tidak ditemukan', 404);
    const sub = parts[2] || '';

    // ---------- baca notula ----------
    const v = url.searchParams.get('v') || '';
    if ((sub === '' || sub === 'pdf') && m === 'GET' && !(await canView(d, k, v)))
      return err('Notula ini hanya dapat dibuka melalui link yang dikirimkan kepada Bapak/Ibu', 403);
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
      if (m === 'GET') return json({ doc: { ...publicDoc(d), view: d.view, signers: d.signers.map(({ tokenHash, ...s }) => ({ ...s, hasLink: !!tokenHash })) } });
      if (m === 'PUT') {
        if (body.title) d.title = clean(body.title, 200);
        if ('subtitle' in body) d.subtitle = clean(body.subtitle, 200);
        if (body.signers) { d.signers = await ensureTokens(normSigners(body.signers, d.signers)); await assignShorts(env, d); }
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
        for (const s of d.signers) if (s.short) await env.TTD.delete('short:' + s.short);
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
