/* ============================================================
   Sentinel Dynamics — Particle systems
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
    let streaks = [];
    let nextStreakAt = 0;

    function maybeSpawnStreak(t) {
      if (reduceMotion || t < nextStreakAt || streaks.length >= 4) return;
      const dir = Math.random() < 0.5 ? 1 : -1;
      const speed = (3.2 + Math.random() * 2.4) * DPR;
      streaks.push({
        x: dir > 0 ? -40 * DPR : w + 40 * DPR,
        y: Math.random() * h * 0.7,
        vx: dir * speed * (0.65 + Math.random() * 0.35),
        vy: speed * (0.45 + Math.random() * 0.45),
        len: (22 + Math.random() * 22) * DPR,
        life: 0,
        maxLife: 40 + Math.random() * 26,
      });
      nextStreakAt = t + 700 + Math.random() * 1600;
    }

    function drawStreaks(t) {
      maybeSpawnStreak(t);
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        const lr = s.life / s.maxLife;
        const alpha = lr < 0.18 ? lr / 0.18 : lr > 0.75 ? Math.max(0, (1 - lr) / 0.25) : 1;
        if (s.life > s.maxLife || s.x < -100 * DPR || s.x > w + 100 * DPR || s.y > h + 100 * DPR) {
          streaks.splice(i, 1);
          continue;
        }
        const mag = Math.hypot(s.vx, s.vy) || 1;
        const tailX = s.x - (s.vx / mag) * s.len;
        const tailY = s.y - (s.vy / mag) * s.len;
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, "rgba(244,197,24,0)");
        grad.addColorStop(1, `rgba(255,244,214,${0.55 * alpha})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.9 * DPR;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,250,235,${0.65 * alpha})`;
        ctx.arc(s.x, s.y, 0.8 * DPR, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function resize() {
      w = canvas.width = window.innerWidth * DPR;
      h = canvas.height = window.innerHeight * DPR;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      streaks = [];
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
      drawStreaks(t);
      if (!reduceMotion) requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(tick);
    if (reduceMotion) tick(0);
  }

  /* ---------------- Hero drone-assembly field ---------------- */
  // A different drone silhouette forms on every page load; the pick is made
  // once per load and reused across resizes so it stays stable in-session.
  const DRONE_VARIANTS = ["quad", "hexa", "fpv", "octo"];
  const heroVariant = DRONE_VARIANTS[Math.floor(Math.random() * DRONE_VARIANTS.length)];
  const DRONE_ARM_DEFS = {
    quad: { count: 4, angleOffset: Math.PI / 4, armLen: 0.4, armW: 0.05, podR: 0.095, bodyR: 0.11 },
    hexa: { count: 6, angleOffset: 0, armLen: 0.4, armW: 0.045, podR: 0.078, bodyR: 0.12 },
    fpv: { count: 4, angleOffset: Math.PI / 4, armLen: 0.27, armW: 0.06, podR: 0.08, bodyR: 0.1 },
    octo: { count: 8, angleOffset: Math.PI / 8, armLen: 0.4, armW: 0.04, podR: 0.062, bodyR: 0.13 },
  };

  function drawDroneShape(octx, cx, cy, s, variant) {
    const def = DRONE_ARM_DEFS[variant] || DRONE_ARM_DEFS.quad;
    octx.fillStyle = "#fff";

    octx.beginPath();
    octx.arc(cx, cy, def.bodyR * s, 0, Math.PI * 2);
    octx.fill();

    for (let i = 0; i < def.count; i++) {
      const angle = def.angleOffset + (i / def.count) * Math.PI * 2;
      octx.save();
      octx.translate(cx, cy);
      octx.rotate(angle);
      octx.fillRect(0, (-def.armW * s) / 2, def.armLen * s, def.armW * s);
      octx.restore();

      const ex = cx + Math.cos(angle) * def.armLen * s;
      const ey = cy + Math.sin(angle) * def.armLen * s;
      octx.beginPath();
      octx.arc(ex, ey, def.podR * s, 0, Math.PI * 2);
      octx.fill();
    }
  }

  function buildAircraftPoints(width, height, count) {
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const octx = off.getContext("2d");

    const s = Math.min(width, height) * 0.86;
    const cx = width / 2;
    const cy = height / 2;

    drawDroneShape(octx, cx, cy, s, heroVariant);

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
