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

    // Feedback (1.3.1): a message the player typed under Settings → "Wat kan beter?". Stored with the day, platform,
    // language and app version only; no IP, no id. At most 300 messages a day, so a flood cannot fill the database.
    if (req.method === 'POST' && url.pathname === '/f') {
      let b;
      try { b = JSON.parse((await req.text()).slice(0, 8000)); } catch (e) { return new Response(null, { status: 400, headers: cors }); }
      const t = String(b.t == null ? '' : b.t).replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').trim().slice(0, 1000);
      const p = clean(b.p, 8), l = clean(b.l, 2);
      if (t.length < 3 || !PLATFORMS.has(p) || !LANGS.has(l)) return new Response(null, { status: 400, headers: cors });
      const day = new Date().toISOString().slice(0, 10);
      const today = await env.DB.prepare('SELECT COUNT(*) AS n FROM feedback WHERE day = ?').bind(day).first('n');
      if (today >= 300) return new Response(null, { status: 429, headers: cors });
      await env.DB.prepare('INSERT INTO feedback (day, p, l, v, t) VALUES (?, ?, ?, ?, ?)').bind(day, p, l, clean(b.v, 10), t).run();
      return new Response(null, { status: 204, headers: cors });
    }

    // Read side, for the owner only: GET /stats?days=30 or /feedback?days=30 with the secret in a header.
    if (req.method === 'GET' && url.pathname === '/stats') {
      if (!env.STATS_KEY || req.headers.get('x-stats-key') !== env.STATS_KEY) return new Response('forbidden', { status: 403 });
      const days = Math.max(1, Math.min(365, Number(url.searchParams.get('days')) || 30));
      const since = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
      const r = await env.DB.prepare('SELECT day, e, a, n, p, l, v, c FROM tel WHERE day >= ? ORDER BY day, e').bind(since).all();
      return Response.json(r.results);
    }
    if (req.method === 'GET' && url.pathname === '/feedback') {
      if (!env.STATS_KEY || req.headers.get('x-stats-key') !== env.STATS_KEY) return new Response('forbidden', { status: 403 });
      const days = Math.max(1, Math.min(365, Number(url.searchParams.get('days')) || 30));
      const since = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
      const r = await env.DB.prepare('SELECT id, day, p, l, v, t FROM feedback WHERE day >= ? ORDER BY id').bind(since).all();
      return Response.json(r.results);
    }
    return new Response('not found', { status: 404 });
  }
};
