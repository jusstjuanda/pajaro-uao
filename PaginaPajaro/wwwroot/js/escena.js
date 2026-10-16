// Amanecer animado del inicio: cielo, sol, cerros en capas, siluetas y una bandada (boids).
(function () {
  const canvas = document.getElementById("cielo");
  if (!canvas) return;
  const g = canvas.getContext("2d");
  let W = 0, H = 0, dpr = 1;
  let amanecer = 0.12, objetivo = 0.12;
  const raton = { x: -9999, y: -9999, px: 0.5 };
  const capas = [];
  const arboles = [];
  const aves = [];

  function semilla(n) { let s = n; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  function construir() {
    capas.length = 0;
    const r = semilla(7);
    const colores = [["#2B3550", "#8EA7C2"], ["#22304A", "#6F8E8A"], ["#16243A", "#4C6E52"]];
    for (let c = 0; c < 3; c++) {
      const pts = [];
      const base = H * (0.62 + c * 0.08), amp = H * (0.12 - c * 0.025);
      const f1 = 1.5 + r() * 2, f2 = 4 + r() * 4, ph = r() * 6;
      for (let i = 0; i <= 120; i++) {
        const x = i / 120;
        pts.push(base - amp * (0.6 * Math.sin(x * f1 * Math.PI + ph) + 0.3 * Math.sin(x * f2 * Math.PI + ph * 2) + 0.4) - (c === 0 ? amp * 0.6 * Math.exp(-Math.pow((x - 0.3) / 0.15, 2)) : 0));
      }
      capas.push({ pts, colores: colores[c], parallax: 8 + c * 14 });
    }
    arboles.length = 0;
    const r2 = semilla(31);
    for (let i = 0; i < 26; i++) {
      const x = r2() * 1.1 - 0.05;
      const tipo = r2() < 0.25 ? "palma" : "copa";
      arboles.push({ x, h: H * (0.1 + r2() * 0.14), tipo, w: 0.5 + r2() * 0.6 });
    }
    arboles.sort((a, b) => a.h - b.h);
    aves.length = 0;
    for (let i = 0; i < 46; i++) {
      aves.push({ x: Math.random() * W, y: H * (0.15 + Math.random() * 0.35), vx: 1 + Math.random(), vy: (Math.random() - 0.5) * 0.4, fase: Math.random() * 6, t: 0.7 + Math.random() * 0.6 });
    }
  }

  function ajustar() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    construir();
  }

  const mezcla = (a, b, t) => {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
    const gg = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
    const bb = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
    return `rgb(${r},${gg},${bb})`;
  };

  function dibujar(tiempo) {
    amanecer += (objetivo - amanecer) * 0.006;
    const p = amanecer;
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, mezcla("#0A1630", "#4F9BD6", p));
    sky.addColorStop(0.55, mezcla("#33284F", "#F5C27A", p));
    sky.addColorStop(1, mezcla("#8A3F48", "#FFE7B8", p));
    g.fillStyle = sky;
    g.fillRect(0, 0, W, H);
    // estrellas que se apagan
    if (p < 0.5) {
      g.fillStyle = `rgba(255,255,255,${(0.5 - p) * 1.6})`;
      const r = semilla(3);
      for (let i = 0; i < 90; i++) g.fillRect(r() * W, r() * H * 0.5, 1.2, 1.2);
    }
    // sol
    const sx = W * 0.84, sy = H * (0.86 - p * 0.46);
    const halo = g.createRadialGradient(sx, sy, 0, sx, sy, H * 0.55);
    halo.addColorStop(0, `rgba(255,214,140,${0.55 * p + 0.1})`);
    halo.addColorStop(1, "rgba(255,214,140,0)");
    g.fillStyle = halo;
    g.fillRect(0, 0, W, H);
    g.fillStyle = mezcla("#FF9A5A", "#FFF2CC", p);
    g.beginPath(); g.arc(sx, sy, H * 0.06, 0, Math.PI * 2); g.fill();
    // cerros (Farallones) con paralaje
    for (const c of capas) {
      const off = (raton.px - 0.5) * c.parallax;
      g.fillStyle = mezcla(c.colores[0], c.colores[1], p);
      g.beginPath(); g.moveTo(-20, H);
      c.pts.forEach((y, i) => g.lineTo(-20 + off + (i / 120) * (W + 40), y));
      g.lineTo(W + 20, H); g.closePath(); g.fill();
    }
    // siluetas de árboles (los rectángulos de «edificios» se quitaron: asomaban entre las copas y parecían un árbol cortado en recto)
    const sil = mezcla("#0B1712", "#23402F", p);
    g.fillStyle = sil;
    for (const a of arboles) {
      const x = a.x * W + (raton.px - 0.5) * 50, base = H + 4;
      if (a.tipo === "palma") {
        g.strokeStyle = sil; g.lineWidth = 4;
        g.beginPath(); g.moveTo(x, base); g.quadraticCurveTo(x + 10, base - a.h * 0.6, x + 4, base - a.h * 1.4); g.stroke();
        for (let k = 0; k < 7; k++) {
          const ang = -Math.PI / 2 + (k - 3) * 0.45;
          g.beginPath(); g.moveTo(x + 4, base - a.h * 1.4);
          g.quadraticCurveTo(x + 4 + Math.cos(ang) * 40, base - a.h * 1.4 + Math.sin(ang) * 30, x + 4 + Math.cos(ang) * 70, base - a.h * 1.4 + Math.sin(ang) * 10 + 25);
          g.stroke();
        }
      } else {
        g.fillRect(x - 4, base - a.h * 0.6, 8, a.h * 0.6);
        for (let k = 0; k < 5; k++) {
          g.beginPath();
          g.arc(x + (k - 2) * a.h * 0.22 * a.w, base - a.h * (0.75 + (k % 2) * 0.18), a.h * (0.3 + 0.08 * (k % 3)) * a.w, 0, Math.PI * 2);
          g.fill();
        }
      }
    }
    // bandada
    const t = tiempo / 1000;
    g.strokeStyle = mezcla("#0E1420", "#2B2A2A", p);
    g.lineCap = "round";
    for (const b of aves) {
      let ax = 0, ay = 0, cx = 0, cy = 0, n = 0, sepx = 0, sepy = 0;
      for (const o of aves) {
        if (o === b) continue;
        const dx = o.x - b.x, dy = o.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < 9000) { ax += o.vx; ay += o.vy; cx += o.x; cy += o.y; n++; if (d2 < 600) { sepx -= dx; sepy -= dy; } }
      }
      if (n) {
        b.vx += (ax / n - b.vx) * 0.03 + (cx / n - b.x) * 0.0006;
        b.vy += (ay / n - b.vy) * 0.03 + (cy / n - b.y) * 0.0006;
      }
      b.vx += sepx * 0.002; b.vy += sepy * 0.002;
      const mdx = b.x - raton.x, mdy = b.y - raton.y, md = Math.hypot(mdx, mdy);
      if (md < 150) { b.vx += mdx / md * 0.35; b.vy += mdy / md * 0.35; }
      b.vy += (H * 0.3 - b.y) * 0.00008;
      const sp = Math.hypot(b.vx, b.vy), max = 2.6, min = 1.1;
      if (sp > max) { b.vx *= max / sp; b.vy *= max / sp; }
      if (sp < min) { b.vx *= min / sp; b.vy *= min / sp; }
      b.x += b.vx; b.y += b.vy;
      if (b.x > W + 30) b.x = -30; if (b.x < -30) b.x = W + 30;
      if (b.y < 10) b.vy += 0.2; if (b.y > H * 0.6) b.vy -= 0.2;
      const ala = Math.sin(t * 9 * b.t + b.fase) * 5;
      const s = 6 * b.t;
      g.lineWidth = 1.6 * b.t;
      g.beginPath();
      g.moveTo(b.x - s, b.y - ala); g.quadraticCurveTo(b.x - s * 0.4, b.y - 2, b.x, b.y);
      g.quadraticCurveTo(b.x + s * 0.4, b.y - 2, b.x + s, b.y - ala);
      g.stroke();
    }
    requestAnimationFrame(dibujar);
  }

  window.addEventListener("resize", ajustar);
  canvas.parentElement.addEventListener("pointermove", e => {
    const r = canvas.getBoundingClientRect();
    raton.x = e.clientX - r.left; raton.y = e.clientY - r.top; raton.px = raton.x / r.width;
  });
  canvas.parentElement.addEventListener("pointerleave", () => { raton.x = raton.y = -9999; });
  window.Escena = {
    amanecer(v) { objetivo = v; if (matchMedia("(prefers-reduced-motion: reduce)").matches) amanecer = v; },
    instante(v) { objetivo = amanecer = v; }
  };
  ajustar();
  requestAnimationFrame(dibujar);
})();
