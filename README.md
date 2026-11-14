# Tanda Tangan Notula BHP Medan

Halaman tanda tangan digital untuk Notula Rapat Monitoring Lanjutan Pengampuan (13 November 2026).

- `public/` halaman statis (Cloudflare Pages, output directory `public`)
- `functions/api/ttd.js` API simpan/ambil tanda tangan, butuh KV binding bernama `TTD`
- Link tanda tangan per nama: `/?n=<kode>&k=<token>` (token tidak disimpan di repo, hanya hash-nya)
