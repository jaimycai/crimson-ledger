// Runtime for a motion video page. A page is a 1080x1920 #stage, a list of scenes and a pure render(t):
// the same t always gives the same picture, so a storyboard still, a review frame and an MP4 frame match.
//   page.html            plays in a loop (click to pause)
//   page.html?t=4.2      shows one frozen moment (storyboard stills, renders)
// window.COMP = { duration, scenes, cues, seek(t) } is what bord.js and render.js drive.
const Studio = (() => {
  const q = new URLSearchParams(location.search);
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  // progress of t through [a, a + d], eased; 0 before, 1 after
  const ease = {
    linear: x => x,
    out: x => 1 - Math.pow(1 - x, 3),
    inOut: x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    back: x => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2),
  };
  const prog = (t, a, d, e = 'out') => ease[e](clamp((t - a) / d));
  const mix = (a, b, p) => a + (b - a) * p;

  function fit() {
    const s = Math.min(innerWidth / 1080, innerHeight / 1920);
    const st = document.getElementById('stage');
    st.style.transform = `translate(${(innerWidth - 1080 * s) / 2}px, ${(innerHeight - 1920 * s) / 2}px) scale(${s})`;
  }

  function start({ duration, scenes, cues = [], render }) {
    fit(); addEventListener('resize', fit);
    const seek = t => render(clamp(t, 0, duration));
    window.COMP = { duration, scenes, cues, seek };
    if (q.has('t')) { seek(+q.get('t')); document.body.dataset.ready = '1'; return; }
    let at = 0, last = performance.now(), paused = false;
    addEventListener('click', () => { paused = !paused; });
    const loop = now => {
      if (!paused) at = (at + (now - last) / 1000) % duration;
      last = now; seek(at); requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    document.body.dataset.ready = '1';
  }

  // which scene is on screen at t
  const sceneAt = (scenes, t) => scenes.reduce((cur, s) => (t >= s.t ? s : cur), scenes[0]);
  return { start, clamp, ease, prog, mix, sceneAt, q };
})();
