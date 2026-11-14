// Entry Cloudflare Worker: /api/* ke API, /ttd<nama><nomor> ke link pribadi, sisanya berkas statis di public/
import { onRequest, resolveShort } from './api.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      const path = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
      return onRequest({ request, env, ctx, params: { path } });
    }
    const m = url.pathname.match(/^\/(ttd[a-z]+\d+(?:-[a-z0-9_-]+)?)\/?$/i);
    if (m && env.TTD) {
      const to = await resolveShort(env, m[1]);
      if (to) return Response.redirect(url.origin + to, 302);
      return new Response('Link tidak ditemukan atau sudah tidak berlaku.', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
    }
    return env.ASSETS.fetch(request);
  },
};
