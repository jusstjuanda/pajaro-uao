// Cantos recreados con síntesis (Web Audio API). No son grabaciones: imitan el patrón de cada llamado.
(function () {
  let ctx = null, master = null, wet = null, ambientOn = false, ambientTimer = null, windNodes = null;

  function iniciar() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    // reverberación de campo abierto
    const len = ctx.sampleRate * 1.6;
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    const conv = ctx.createConvolver();
    conv.buffer = ir;
    wet = ctx.createGain();
    wet.gain.value = 0.28;
    wet.connect(conv);
    conv.connect(master);
  }

  function salida(pan, vol) {
    const g = ctx.createGain();
    g.gain.value = vol;
    const p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (p) { p.pan.value = pan; g.connect(p); p.connect(master); p.connect(wet); }
    else { g.connect(master); g.connect(wet); }
    return g;
  }

  // tono con barrido de frecuencia y envolvente
  function tono(out, t0, dur, f0, f1, tipo = "sine", vol = 0.3, opt = {}) {
    const o = ctx.createOscillator();
    o.type = tipo;
    o.frequency.setValueAtTime(f0, t0);
    if (opt.fMid) {
      o.frequency.linearRampToValueAtTime(opt.fMid, t0 + dur * (opt.midAt || 0.5));
      o.frequency.linearRampToValueAtTime(f1, t0 + dur);
    } else o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
    const g = ctx.createGain();
    const a = opt.ataque || 0.008;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + a);
    g.gain.setValueAtTime(vol, t0 + Math.max(a, dur - 0.03));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    let node = o;
    if (opt.vib) {
      const l = ctx.createOscillator(), lg = ctx.createGain();
      l.frequency.value = opt.vib; lg.gain.value = opt.vibProf || f0 * 0.02;
      l.connect(lg); lg.connect(o.frequency); l.start(t0); l.stop(t0 + dur + 0.05);
    }
    if (opt.am) {
      const l = ctx.createOscillator(), lg = ctx.createGain(), amg = ctx.createGain();
      l.frequency.value = opt.am; lg.gain.value = 0.5; amg.gain.value = 0.5;
      l.connect(lg); lg.connect(amg.gain); node.connect(amg); node = amg;
      l.start(t0); l.stop(t0 + dur + 0.05);
    }
    if (opt.fm) {
      const m = ctx.createOscillator(), mg = ctx.createGain();
      m.frequency.value = opt.fm; mg.gain.value = opt.fmProf || 600;
      m.connect(mg); mg.connect(o.frequency); m.start(t0); m.stop(t0 + dur + 0.05);
    }
    if (opt.filtro) {
      const f = ctx.createBiquadFilter();
      f.type = opt.filtro[0]; f.frequency.value = opt.filtro[1]; f.Q.value = opt.filtro[2] || 1;
      node.connect(f); node = f;
    }
    node.connect(g); g.connect(out);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }

  let ruidoBuf = null;
  function ruido(out, t0, dur, frec, q, vol) {
    if (!ruidoBuf) {
      ruidoBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = ruidoBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ctx.createBufferSource();
    s.buffer = ruidoBuf;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass"; f.frequency.value = frec; f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(out);
    s.start(t0, Math.random()); s.stop(t0 + dur + 0.02);
  }

  const R = (a, b) => a + Math.random() * (b - a);

  // cada canto devuelve su duración aproximada
  const CANTOS = {
    bichofue(o, t) {
      tono(o, t, 0.11, 1750, 1500, "square", 0.12, { filtro: ["bandpass", 1700, 2] });
      tono(o, t + 0.17, 0.11, 1550, 1350, "square", 0.12, { filtro: ["bandpass", 1500, 2] });
      tono(o, t + 0.34, 0.36, 1200, 1500, "square", 0.14, { fMid: 2300, midAt: 0.35, filtro: ["bandpass", 1900, 1.5] });
      return 0.75;
    },
    azulejo(o, t) {
      let x = t;
      for (let i = 0; i < 9; i++) { const f = R(4200, 6200); tono(o, x, R(0.04, 0.08), f, f * R(0.75, 0.9), "sine", 0.16); x += R(0.07, 0.13); }
      return x - t;
    },
    mirla(o, t) {
      let x = t;
      const notas = [1900, 2400, 2100, 2800, 2500, 2050, 2650];
      for (const n of notas) { const d = R(0.14, 0.28); tono(o, x, d, n, n * R(0.9, 1.12), "sine", 0.2, { vib: 9, vibProf: 40, ataque: 0.03 }); x += d + 0.05; }
      return x - t;
    },
    pellar(o, t) {
      for (let i = 0; i < 8; i++) {
        tono(o, t + i * 0.11, 0.07, 2700, 2250, "square", 0.1, { filtro: ["bandpass", 2500, 3] });
        ruido(o, t + i * 0.11, 0.05, 2600, 4, 0.12);
      }
      return 0.95;
    },
    carpintero(o, t) {
      tono(o, t, 0.55, 1850, 1650, "sine", 0.18, { am: 32 });
      let x = t + 0.8, gap = 0.07;
      for (let i = 0; i < 18; i++) { ruido(o, x, 0.025, 900, 3, 0.5); x += gap; gap *= 0.97; }
      return x - t;
    },
    colibri(o, t) {
      let x = t;
      for (let i = 0; i < 7; i++) { tono(o, x, 0.035, 7200, 6100, "sine", 0.14); x += R(0.1, 0.2); }
      return x - t;
    },
    garza(o, t) {
      tono(o, t, 0.5, 290, 210, "sawtooth", 0.2, { am: 38, filtro: ["lowpass", 900, 1] });
      ruido(o, t, 0.45, 500, 1, 0.12);
      return 0.6;
    },
    periquito(o, t) {
      let x = t;
      for (let i = 0; i < 6; i++) { tono(o, x, 0.11, R(3000, 3500), R(2800, 3300), "triangle", 0.1, { fm: 380, fmProf: 900 }); x += R(0.15, 0.22); }
      return x - t;
    },
    siriri(o, t) {
      tono(o, t, 0.04, 4900, 4600, "sine", 0.18);
      tono(o, t + 0.12, 0.04, 4900, 4600, "sine", 0.18);
      tono(o, t + 0.26, 0.55, 4600, 4100, "sine", 0.16, { am: 46 });
      return 0.85;
    },
    pechirrojo(o, t) {
      for (let i = 0; i < 3; i++) tono(o, t + i * 0.12, 0.04, 5300, 5000, "sine", 0.16);
      tono(o, t + 0.42, 0.45, 4700, 5700, "sine", 0.15, { am: 58 });
      return 0.95;
    },
    loro(o, t) {
      for (let i = 0; i < 3; i++)
        tono(o, t + i * 0.3, 0.2, 1700 + i * 120, 2700 + i * 150, "sawtooth", 0.09, { filtro: ["bandpass", 2300, 2.2] });
      return 0.95;
    },
    garrapatero(o, t) {
      for (let k = 0; k < 2; k++) {
        const x = t + k * 0.62;
        tono(o, x, 0.18, 1650, 2300, "triangle", 0.2, { ataque: 0.02 });
        tono(o, x + 0.24, 0.24, 2150, 1500, "triangle", 0.2, { ataque: 0.02 });
      }
      return 1.2;
    }
  };

  function cantar(id, vol = 1, pan = 0, retraso = 0) {
    iniciar();
    const f = CANTOS[id];
    if (!f) return 0;
    return f(salida(pan, vol), ctx.currentTime + 0.05 + retraso);
  }

  function viento(on) {
    if (on && !windNodes) {
      const len = ctx.sampleRate * 4;
      const b = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; }
      const s = ctx.createBufferSource(); s.buffer = b; s.loop = true;
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 420; f.Q.value = 0.8;
      const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.13; lg.gain.value = 180;
      lfo.connect(lg); lg.connect(f.frequency);
      const g = ctx.createGain(); g.gain.value = 0.0001; g.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 2);
      s.connect(f); f.connect(g); g.connect(master);
      s.start(); lfo.start();
      windNodes = { s, lfo, g };
    } else if (!on && windNodes) {
      windNodes.g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      const w = windNodes; windNodes = null;
      setTimeout(() => { w.s.stop(); w.lfo.stop(); }, 900);
    }
  }

  function ambiente(on) {
    iniciar();
    ambientOn = on;
    viento(on);
    clearTimeout(ambientTimer);
    if (!on) return;
    const ids = Object.keys(CANTOS).filter(k => k !== "garza");
    const tick = () => {
      if (!ambientOn) return;
      if (!document.hidden) cantar(ids[Math.floor(Math.random() * ids.length)], R(0.12, 0.3), R(-0.9, 0.9));
      ambientTimer = setTimeout(tick, R(900, 2600));
    };
    tick();
  }

  function clic() {
    iniciar();
    const o = salida(0, 0.5);
    tono(o, ctx.currentTime, 0.06, 1400, 900, "sine", 0.12);
  }

  function exito() {
    iniciar();
    const o = salida(0, 0.6), t = ctx.currentTime;
    [880, 1109, 1319, 1760].forEach((f, i) => tono(o, t + i * 0.08, 0.35, f, f, "triangle", 0.12, { ataque: 0.01 }));
  }

  function error() {
    iniciar();
    const o = salida(0, 0.5), t = ctx.currentTime;
    tono(o, t, 0.25, 320, 220, "sawtooth", 0.08, { filtro: ["lowpass", 900, 1] });
  }

  function obturador() {
    iniciar();
    const o = salida(0, 0.8), t = ctx.currentTime;
    ruido(o, t, 0.05, 3000, 0.8, 0.5);
    ruido(o, t + 0.08, 0.07, 2000, 0.8, 0.4);
  }

  function aleteo(pan = 0) {
    iniciar();
    const o = salida(pan, 0.5), t = ctx.currentTime;
    for (let i = 0; i < 6; i++) ruido(o, t + i * 0.07, 0.05, 700, 1.2, 0.25);
  }

  function registro() {
    iniciar();
    const o = salida(0, 0.6), t = ctx.currentTime;
    [1046, 1568].forEach((f, i) => tono(o, t + i * 0.1, 0.3, f, f, "sine", 0.14, { ataque: 0.01 }));
  }

  window.Sonido = { iniciar, cantar, ambiente, clic, exito, error, obturador, aleteo, registro, get activo() { return ambientOn; } };
})();
