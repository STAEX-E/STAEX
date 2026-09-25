/* ============================================================
   STAEX — Particle systems
   1) Ambient background field (all pages)
   2) Hero aircraft-assembly field (home page only)
   Pure canvas 2D, no dependencies.
   ============================================================ */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  /* ---------------- Ambient background field ---------------- */
  function initBackgroundField() {
    const canvas = document.getElementById("bg-field");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, dots = [];

    function resize() {
      w = canvas.width = window.innerWidth * DPR;
      h = canvas.height = window.innerHeight * DPR;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      const count = Math.round((window.innerWidth * window.innerHeight) / 22000);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.2 + 0.4) * DPR,
        vx: (Math.random() - 0.5) * 0.06 * DPR,
        vy: (Math.random() - 0.5) * 0.06 * DPR,
        hue: Math.random() > 0.82 ? "y" : "g",
        tw: Math.random() * Math.PI * 2,
      }));
    }

    let mx = 0, my = 0;
    window.addEventListener("mousemove", (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 18;
      my = (e.clientY / window.innerHeight - 0.5) * 18;
    });

    function tick(t) {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = w;
        if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h;
        if (d.y > h) d.y = 0;
        const flicker = 0.4 + Math.abs(Math.sin(d.tw + t * 0.0006)) * 0.6;
        ctx.beginPath();
        ctx.fillStyle = d.hue === "y"
          ? `rgba(244,197,24,${0.35 * flicker})`
          : `rgba(150,155,160,${0.28 * flicker})`;
        ctx.arc(d.x + mx * DPR, d.y + my * DPR, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduceMotion) requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(tick);
    if (reduceMotion) tick(0);
  }

  /* ---------------- Hero aircraft-assembly field ---------------- */
  function buildAircraftPoints(width, height, count) {
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const octx = off.getContext("2d");
    octx.fillStyle = "#fff";

    const s = Math.min(width, height) * 0.86;
    const cx = width / 2;
    const cy = height / 2;

    // Stylized top-down aircraft / interceptor silhouette (normalized -0.5..0.5)
    const shape = [
      [0, -0.5], [0.045, -0.28], [0.05, -0.05],
      [0.52, 0.1], [0.52, 0.17], [0.07, 0.08],
      [0.09, 0.27], [0.24, 0.4], [0.24, 0.46],
      [0.05, 0.37], [0.04, 0.5], [-0.04, 0.5],
      [-0.05, 0.37], [-0.24, 0.46], [-0.24, 0.4],
      [-0.09, 0.27], [-0.07, 0.08], [-0.52, 0.17],
      [-0.52, 0.1], [-0.05, -0.05], [-0.045, -0.28],
    ];

    octx.beginPath();
    octx.moveTo(cx + shape[0][0] * s, cy + shape[0][1] * s);
    for (let i = 1; i < shape.length; i++) {
      octx.lineTo(cx + shape[i][0] * s, cy + shape[i][1] * s);
    }
    octx.closePath();
    octx.fill();

    const data = octx.getImageData(0, 0, width, height).data;
    const candidates = [];
    const step = 3;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4 + 3;
        if (data[idx] > 128) candidates.push({ x, y });
      }
    }
    // shuffle then trim/repeat to desired count
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    const points = [];
    for (let i = 0; i < count; i++) {
      points.push(candidates[i % candidates.length] || { x: cx, y: cy });
    }
    return points;
  }

  function initHeroField() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, particles = [];
    const COUNT = window.innerWidth < 640 ? 260 : 520;

    function layout() {
      w = canvas.width = window.innerWidth * DPR;
      h = canvas.height = window.innerHeight * DPR;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      const targets = buildAircraftPoints(w, h, COUNT);
      particles = targets.map((t) => ({
        tx: t.x,
        ty: t.y,
        x: Math.random() * w,
        y: Math.random() * h,
        sx: Math.random() * w,
        sy: Math.random() * h,
        r: (Math.random() * 1.5 + 0.7) * DPR,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.8,
        hue: Math.random() > 0.75 ? "o" : "y",
      }));
    }

    let mx = 0, my = 0;
    window.addEventListener("mousemove", (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 26;
      my = (e.clientY / window.innerHeight - 0.5) * 26;
    });

    const pinWrap = document.getElementById("hero-pin-wrap");

    function progress() {
      if (!pinWrap) {
        const p = window.scrollY / (window.innerHeight * 0.85);
        return Math.max(0, Math.min(1, p));
      }
      const rect = pinWrap.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return 1;
      return Math.max(0, Math.min(1, -rect.top / scrollable));
    }

    function ease(t) { return 1 - Math.pow(1 - t, 3); }

    function tick(t) {
      const p = ease(progress());
      ctx.clearRect(0, 0, w, h);
      for (const pt of particles) {
        const idleX = Math.sin(t * 0.0006 * pt.speed + pt.phase) * 3 * DPR;
        const idleY = Math.cos(t * 0.0007 * pt.speed + pt.phase) * 3 * DPR;
        const baseX = pt.sx + (pt.tx - pt.sx) * p;
        const baseY = pt.sy + (pt.ty - pt.sy) * p;
        const px = baseX + idleX * p + mx * DPR * (0.4 + p * 0.6);
        const py = baseY + idleY * p + my * DPR * (0.4 + p * 0.6);

        ctx.beginPath();
        const alpha = 0.35 + 0.5 * p;
        ctx.fillStyle = pt.hue === "o"
          ? `rgba(255,122,26,${alpha})`
          : `rgba(244,197,24,${alpha})`;
        ctx.arc(px, py, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduceMotion) requestAnimationFrame(tick);
    }

    layout();
    window.addEventListener("resize", layout);
    requestAnimationFrame(tick);
    if (reduceMotion) {
      // snap straight to formed aircraft for reduced-motion users
      for (const pt of particles) { pt.sx = pt.tx; pt.sy = pt.ty; }
      tick(0);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initBackgroundField();
    initHeroField();
  });
})();
