// Anonymous counters for Crimson Ledger. The app posts an event name and a few
// coarse dimensions; this Worker adds one to a counter. Nothing identifies a
// player: no id, no IP, no user agent, and the day is the finest time unit.
const EVENTS = new Set(['open', 'tutorial_done', 'start', 'solved', 'failed', 'hint', 'store_open', 'purchase', 'review_asked', 'share', 'reminder_on']);
const PLATFORMS = new Set(['ios', 'android', 'web']);
// every language the app speaks (i18n.js I18n.LANGS)
const LANGS = new Set(['nl', 'en', 'de', 'es', 'fr', 'id', 'it', 'pt', 'tr', 'vi', 'ru', 'ar', 'ur', 'hi', 'mr', 'bn', 'te', 'zh', 'ja', 'ko']);
const clean = (s, max) => String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9_:.-]/g, '').slice(0, max);
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    if (req.method === 'POST' && url.pathname === '/e') {
      let b;
      try { b = JSON.parse((await req.text()).slice(0, 400)); } catch (e) { return new Response(null, { status: 400, headers: cors }); }
      const e = clean(b.e, 20), p = clean(b.p, 8), l = clean(b.l, 2);
      if (!EVENTS.has(e) || !PLATFORMS.has(p) || !LANGS.has(l)) return new Response(null, { status: 400, headers: cors });
      const n = Math.max(0, Math.min(9999, Math.floor(Number(b.n) || 0)));
      const day = new Date().toISOString().slice(0, 10);
      await env.DB.prepare(
        'INSERT INTO tel (day, e, a, n, p, l, v, c) VALUES (?, ?, ?, ?, ?, ?, ?, 1) ' +
        'ON CONFLICT (day, e, a, n, p, l, v) DO UPDATE SET c = c + 1'
      ).bind(day, e, clean(b.a, 24), n, p, l, clean(b.v, 10)).run();
      return new Response(null, { status: 204, headers: cors });
    }

    // Read side, for the owner only: GET /stats?days=30 with the secret in a header.
    if (req.method === 'GET' && url.pathname === '/stats') {
      if (!env.STATS_KEY || req.headers.get('x-stats-key') !== env.STATS_KEY) return new Response('forbidden', { status: 403 });
      const days = Math.max(1, Math.min(365, Number(url.searchParams.get('days')) || 30));
      const since = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
      const r = await env.DB.prepare('SELECT day, e, a, n, p, l, v, c FROM tel WHERE day >= ? ORDER BY day, e').bind(since).all();
      return Response.json(r.results);
    }
    return new Response('not found', { status: 404 });
  }
};
