# Tanda Tangan Notula BHP Medan

Web tanda tangan dan koreksi notula digital, Seksi Harta Peninggalan Wilayah II BHP Medan.

**Alamat resmi: https://notulabhp.my.id**

- `public/` halaman web (aset statis Cloudflare Worker)
- `src/worker.js` dan `src/api.js` API notula, tanda tangan, dan koreksi, memakai KV binding `TTD`
- Link tanda tangan per orang: `https://notulabhp.my.id/ttd<namadepan><nomor>` (token tidak disimpan di repo, hanya hash-nya)
