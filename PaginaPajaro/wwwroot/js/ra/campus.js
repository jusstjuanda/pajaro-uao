// Campus simulado de «Aves UAO» (se ve cuando no hay cámara): suelo, camino de ladrillo, aulas con techo verde y paneles solares,
// plazoleta con fuente, jardines, árboles y palmeras, nubes y mariposas. Todo es de pocos polígonos.
// OBSTACULOS: círculos (x, z, radio) que los soportes de las aves no deben pisar (lo usa `cabe` en ra.js).
import * as THREE from "three";
import { fusionar } from "./fusion.js";

export const semilla = n => { let s = n; return () => (s = (s * 16807) % 2147483647) / 2147483647; };   // azar repetible
export const EDIFICIOS = [[-24, -30, 26, 9, 10, 0.3], [26, -26, 22, 11, 9, -0.4], [32, 14, 10, 7, 18, -1.2], [-30, 10, 12, 8, 16, 1.1]];   // x, z, ancho, alto, fondo, giro
export const OBSTACULOS = [];
const Y = -1.6;                                    // altura del suelo (la cámara está en 0)
const PLAZA = { x: 6.8, z: -12.5, r: 5.4 };
const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.9, ...extra });
const caja = (w, h, d, m, x, y, z, ry = 0) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.rotation.y = ry; return o; };
const obstaculo = (x, z, r) => OBSTACULOS.push({ x, z, r });

export function crearSimulado() {
  OBSTACULOS.length = 0;
  const g = new THREE.Group();
  const rnd = semilla(4242);
  const animar = [];

  // ---------------- cielo y suelo
  const cielo = new THREE.SphereGeometry(120, 24, 12);
  const col = [];
  const pos = cielo.attributes.position;
  const arriba = new THREE.Color("#4F9BD6"), horizonte = new THREE.Color("#F7E0B0");
  for (let i = 0; i < pos.count; i++) {
    const k = THREE.MathUtils.clamp(pos.getY(i) / 120, 0, 1);
    const c = horizonte.clone().lerp(arriba, Math.pow(k, 0.6));
    col.push(c.r, c.g, c.b);
  }
  cielo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.add(new THREE.Mesh(cielo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false })));
  const suelo = new THREE.Mesh(new THREE.CircleGeometry(110, 48), new THREE.MeshStandardMaterial({ color: "#6E9F45", roughness: 1 }));
  suelo.rotation.x = -Math.PI / 2;
  suelo.position.y = Y;
  g.add(suelo);
  for (let i = 0; i < 14; i++) {                    // manchas de pasto más claro y más oscuro: el suelo deja de verse plano
    const m = new THREE.Mesh(new THREE.CircleGeometry(4 + rnd() * 7, 20), new THREE.MeshStandardMaterial({ color: i % 2 ? "#79A84B" : "#648F3E", roughness: 1 }));
    m.rotation.x = -Math.PI / 2;
    const a = rnd() * Math.PI * 2, d = 8 + rnd() * 30;
    m.position.set(Math.sin(a) * d, Y + 0.03 + i * 0.002, -Math.cos(a) * d);
    g.add(m);
  }

  // ---------------- camino de ladrillo con rombos (como los de la UAO) y bordillos de piedra
  const cv = document.createElement("canvas");
  cv.width = cv.height = 128;
  const c2 = cv.getContext("2d");
  c2.fillStyle = "#D9B391"; c2.fillRect(0, 0, 128, 128);
  c2.strokeStyle = "#B9654A"; c2.lineWidth = 5;
  c2.beginPath(); c2.moveTo(0, 64); c2.lineTo(64, 0); c2.lineTo(128, 64); c2.lineTo(64, 128); c2.closePath(); c2.stroke();
  c2.strokeStyle = "#C98F72"; c2.lineWidth = 2;
  c2.strokeRect(1, 1, 126, 126);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1, 20); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const camino = new THREE.Mesh(new THREE.PlaneGeometry(3, 60), new THREE.MeshStandardMaterial({ map: tex, roughness: 1 }));
  camino.rotation.x = -Math.PI / 2; camino.position.set(0, Y + 0.01, -20);
  g.add(camino);
  const dummy = new THREE.Object3D();
  const piedras = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.14, 0.28), std("#BDB7A8"), 160);
  let np = 0;
  for (let z = 9; z > -50 && np < 160; z -= 0.76) for (const s of [-1, 1]) {
    dummy.position.set(s * 1.64, Y + 0.05, z); dummy.rotation.set(0, (rnd() - 0.5) * 0.2, 0); dummy.scale.set(0.9 + rnd() * 0.3, 1, 1); dummy.updateMatrix();
    piedras.setMatrixAt(np++, dummy.matrix);
  }
  piedras.count = np; g.add(piedras);

  // ---------------- aulas: ladrillo, franjas de concreto, ventanas, techo verde a dos aguas con paneles solares y arco de entrada
  const ladrillo = std("#BE5A3C"), concreto = std("#D2C6B4"), marco = std("#E7E0D0"), vidrio = std("#2E3A44", { roughness: 0.3 });
  const techo = std("#2FA08C"), solar = new THREE.MeshStandardMaterial({ color: "#2B4C93", roughness: 0.35, metalness: 0.3 });
  const arcoForma = (alto, radio) => { const s = new THREE.Shape(); s.moveTo(-radio, 0); s.lineTo(radio, 0); s.lineTo(radio, alto); s.absarc(0, alto, radio, 0, Math.PI, false); s.lineTo(-radio, 0); return s; };
  const prisma = (() => { const s = new THREE.Shape(); s.moveTo(-0.5, 0); s.lineTo(0.5, 0); s.lineTo(0, 1); s.closePath(); const p = new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false }); p.translate(0, 0, -0.5); return p; })();
  EDIFICIOS.forEach(([x, z, w, h, d, ry], idx) => {
    const b = new THREE.Group();
    const pisos = Math.max(1, Math.round(h / 3.6)), alto = h / pisos;
    b.add(caja(w, h, d, ladrillo, 0, h / 2, 0));
    for (let j = 1; j < pisos; j++) b.add(caja(w + 0.5, 0.3, d + 0.5, concreto, 0, alto * j, 0));
    b.add(caja(w + 0.9, 0.5, d + 0.9, concreto, 0, h + 0.1, 0));
    // ventanas (instancias): marco claro y vidrio oscuro en las cuatro fachadas
    const caras = [[w, d / 2, 0, 0, 1], [w, d / 2, Math.PI, 0, -1], [d, w / 2, Math.PI / 2, 1, 0], [d, w / 2, -Math.PI / 2, -1, 0]];
    const lista = [];
    for (const [largo, fondo, giro, nx, nz] of caras) {
      const n = Math.floor((largo - 1.6) / 2.6);
      for (let i = 0; i < n; i++) for (let j = 0; j < pisos; j++) {
        const u = (i - (n - 1) / 2) * 2.6;
        lista.push([nx ? nx * (fondo + 0.03) : u, alto * (j + 0.5) - 0.1, nz ? nz * (fondo + 0.03) : (nx ? u : 0), giro]);
      }
    }
    const marcos = new THREE.InstancedMesh(new THREE.BoxGeometry(1.85, 1.75, 0.08), marco, lista.length);
    const vidrios = new THREE.InstancedMesh(new THREE.BoxGeometry(1.5, 1.4, 0.12), vidrio, lista.length);
    lista.forEach(([px, py, pz, gi], i) => { dummy.position.set(px, py, pz); dummy.rotation.set(0, gi, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); marcos.setMatrixAt(i, dummy.matrix); vidrios.setMatrixAt(i, dummy.matrix); });
    b.add(marcos, vidrios);
    // techo a dos aguas con la cumbrera en el lado largo y paneles solares en las dos vertientes
    const largoCumbre = Math.max(w, d) + 1.4, luz = Math.min(w, d) + 1.4, alturaTecho = 2.3;
    const tejado = new THREE.Group();
    tejado.position.y = h + 0.35;
    tejado.rotation.y = w >= d ? Math.PI / 2 : 0;
    const agua = new THREE.Mesh(prisma, techo); agua.scale.set(luz, alturaTecho, largoCumbre); tejado.add(agua);
    const theta = Math.atan2(alturaTecho, luz / 2);
    for (const s of [-1, 1]) for (const t of [0.22, 0.58]) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.07, largoCumbre * 0.8), solar);
      p.position.set(s * (luz / 2) * (1 - t), alturaTecho * t + 0.07, 0);
      p.rotation.z = -s * theta;
      tejado.add(p);
    }
    b.add(tejado);
    if (idx < 2) {                                  // arco de entrada en las dos aulas grandes
      const marcoArco = new THREE.Mesh(new THREE.ShapeGeometry(arcoForma(3.2, 2.5)), concreto); marcoArco.position.set(0, 0.01, d / 2 + 0.06);
      const hueco = new THREE.Mesh(new THREE.ShapeGeometry(arcoForma(3, 2.1)), std("#241C18")); hueco.position.set(0, 0.01, d / 2 + 0.1);
      b.add(marcoArco, hueco);
    }
    b.position.set(x, Y, z);
    b.rotation.y = ry;
    g.add(b);
  });

  // ---------------- plazoleta de ladrillo con fuente y seto amarillo (como el anfiteatro del campus)
  const plaza = new THREE.Group();
  plaza.position.set(PLAZA.x, Y, PLAZA.z);
  g.add(plaza);
  [[5.0, 0.1, "#D99B7B"], [4.2, 0.22, "#CF8D6C"], [3.4, 0.34, "#D99B7B"]].forEach(([r, hh, c]) => { const e = new THREE.Mesh(new THREE.CylinderGeometry(r, r + 0.12, hh, 28), std(c)); e.position.y = hh / 2; plaza.add(e); });
  const piedra = std("#CBC4B4"), piedraOscura = std("#A9A291");
  const fuente = new THREE.Group(); fuente.position.y = 0.34; plaza.add(fuente);
  const vaso = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.45, 0.55, 12), piedra); vaso.position.y = 0.27; fuente.add(vaso);
  const borde = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.13, 6, 12), piedraOscura); borde.rotation.x = Math.PI / 2; borde.position.y = 0.56; fuente.add(borde);
  const agua = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 0.05, 28), new THREE.MeshStandardMaterial({ color: "#4FA3C7", roughness: 0.1, metalness: 0.15 })); agua.position.y = 0.52; fuente.add(agua);
  const pie = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 1.5, 10), piedra); pie.position.y = 1.25; fuente.add(pie);
  const taza = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.36, 0.28, 16), piedra); taza.position.y = 1.95; fuente.add(taza);
  const bola = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), piedraOscura); bola.position.y = 2.22; fuente.add(bola);
  const gota = new THREE.MeshStandardMaterial({ color: "#E6F6FF", emissive: "#BFE7FF", emissiveIntensity: 0.5, roughness: 0.2 });
  agua.userData.sinFusion = true;
  const gotas = [];
  const chorros = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 5, 4), gota, 52);   // las 52 gotas son una sola malla
  fuente.add(chorros);
  for (let i = 0; i < 52; i++) gotas.push({ a: (i % 13) / 13 * Math.PI * 2, f: rnd(), centro: i >= 39 });
  const ondas = [0, 1, 2].map(() => { const o = new THREE.Mesh(new THREE.TorusGeometry(1, 0.025, 4, 32), new THREE.MeshBasicMaterial({ color: "#EAF8FF", transparent: true })); o.rotation.x = Math.PI / 2; o.position.y = 0.56; fuente.add(o); return o; });
  animar.push(t => {
    gotas.forEach((d, i) => {
      const u = (t * 0.8 + d.f) % 1;
      if (d.centro) dummy.position.set(Math.cos(d.a) * 0.1, 2.3 + 2 * 4 * u * (1 - u), Math.sin(d.a) * 0.1);
      else { const r = 0.25 + 1.85 * u; dummy.position.set(Math.cos(d.a) * r, 2.3 + 2.1 * u - 3.8 * u * u, Math.sin(d.a) * r); }
      dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(1); dummy.updateMatrix();
      chorros.setMatrixAt(i, dummy.matrix);
    });
    chorros.instanceMatrix.needsUpdate = true;
    ondas.forEach((o, k) => { const u = (t * 0.45 + k / 3) % 1; o.scale.setScalar(0.3 + u * 1.9); o.material.opacity = 0.8 * (1 - u); });
  });
  for (let i = 0; i < 18; i++) {                    // seto amarillo y verde alrededor, con una entrada hacia el camino
    const a = i / 18 * Math.PI * 2;
    if (Math.cos(a) < -0.8) continue;                // hueco de entrada, del lado del camino
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55 + rnd() * 0.12, 1), std(i % 3 ? "#B9C23C" : "#8DB339"));
    m.position.set(Math.cos(a) * 5.55, 0.32, Math.sin(a) * 5.55); m.scale.y = 0.75;
    plaza.add(m);
  }
  fusionar(plaza);
  chorros.frustumCulled = false;
  obstaculo(PLAZA.x, PLAZA.z, PLAZA.r + 0.6);

  // ---------------- bancas y farolas (pocas)
  const madera = std("#8B5A33"), hierro = std("#38413D");
  for (const [x, z, ry] of [[-3.0, -6.8, Math.PI / 2], [3.0, -17.5, -Math.PI / 2], [-3.0, -22.5, Math.PI / 2]]) {
    const b = new THREE.Group();
    b.add(caja(1.7, 0.1, 0.5, madera, 0, 0.5, 0), caja(1.7, 0.45, 0.07, madera, 0, 0.85, -0.22));
    for (const s of [-0.7, 0.7]) b.add(caja(0.08, 0.5, 0.5, hierro, s, 0.25, 0), caja(0.08, 0.55, 0.07, hierro, s, 0.78, -0.22));
    fusionar(b);
    b.position.set(x, Y, z); b.rotation.y = ry; g.add(b);
    obstaculo(x, z, 1.1);
  }
  const luz = new THREE.MeshStandardMaterial({ color: "#FFE7A8", emissive: "#FFD27A", emissiveIntensity: 1.2 });
  for (const [x, z] of [[-2.3, -11], [2.3, -20], [-2.3, -29], [2.3, -38]]) {
    const f = new THREE.Group();
    const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 3.3, 8), hierro); poste.position.y = 1.65; f.add(poste);
    f.add(caja(0.4, 0.05, 0.05, hierro, x > 0 ? -0.2 : 0.2, 3.3, 0));
    const farol = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), luz); farol.position.set(x > 0 ? -0.4 : 0.4, 3.22, 0); f.add(farol);
    fusionar(f);
    f.position.set(x, Y, z); g.add(f);
    obstaculo(x, z, 0.45);
  }

  // ---------------- canteros con flores, arbustos y setos de flor roja y croton
  const colorFlor = ["#E4573D", "#F2A541", "#F5D547", "#E86FA0", "#FFFFFF", "#9B6FD1"];
  const cantero = (x, z, r) => {
    const c = new THREE.Group();
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; c.add(caja(0.5, 0.28, 0.32, piedraOscura, Math.cos(a) * r, 0.14, Math.sin(a) * r, -a + Math.PI / 2)); }
    const tierra = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.3, 14), std("#6B4A32")); tierra.position.y = 0.12; c.add(tierra);
    for (let i = 0; i < 26; i++) {
      const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * (r - 0.15);
      const tallo = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 4), std("#3E7A34")); tallo.position.set(Math.cos(a) * rr, 0.45, Math.sin(a) * rr); c.add(tallo);
      const flor = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 0), std(colorFlor[Math.floor(rnd() * colorFlor.length)])); flor.position.set(Math.cos(a) * rr, 0.66 + rnd() * 0.1, Math.sin(a) * rr); c.add(flor);
    }
    fusionar(c);
    c.position.set(x, Y, z); g.add(c);
    obstaculo(x, z, r + 0.4);
  };
  cantero(-6.4, -8.5, 1.4); cantero(-6.8, -19.5, 1.6); cantero(5.0, -27, 1.3);
  const arbusto = (x, z, s, colores) => {
    const a = new THREE.Group();
    for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55 * s, 1), std(colores[i % colores.length])); b.position.set((rnd() - 0.5) * 0.9 * s, 0.35 * s + rnd() * 0.2, (rnd() - 0.5) * 0.9 * s); a.add(b); }
    fusionar(a);
    a.position.set(x, Y, z); g.add(a);
    obstaculo(x, z, 0.9 * s);
  };
  for (const [x, z, s] of [[-4.2, -11, 1], [3.9, -24, 1.2], [-4.4, -29, 1.3], [-4.0, 2, 0.9]]) arbusto(x, z, s, ["#3F7A36", "#4F8F3E", "#356B30"]);
  for (let i = 0; i < 7; i++) { const a = 2.5 + i * 0.32; arbusto(-9 + Math.cos(a) * 3.8 + 3, -14 + Math.sin(a) * 3.8, 0.8, i % 2 ? ["#C8342B", "#D9473A"] : ["#C2C93E", "#E0B93A", "#A9BE3A"]); }   // setos curvos de flor roja y croton

  // ---------------- césped con matas y flores silvestres (instancias)
  const libre = (x, z) => (Math.abs(x) < 2.4 && z < 9 && z > -55) || Math.hypot(x - PLAZA.x, z - PLAZA.z) < PLAZA.r + 1.2;
  const matas = new THREE.InstancedMesh(new THREE.ConeGeometry(0.06, 0.4, 4), std("#FFFFFF"), 800);
  const verdes = ["#5E9A3F", "#7AB04C", "#4B8434"].map(c => new THREE.Color(c));
  for (let i = 0, n = 0; n < 800 && i < 4000; i++) {
    const a = rnd() * Math.PI * 2, d = 2.5 + Math.sqrt(rnd()) * 30, x = Math.sin(a) * d, z = -Math.cos(a) * d;
    if (libre(x, z)) continue;
    dummy.position.set(x, Y + 0.17, z); dummy.rotation.set((rnd() - 0.5) * 0.4, rnd() * 6, (rnd() - 0.5) * 0.4); dummy.scale.set(1, 0.7 + rnd() * 0.9, 1); dummy.updateMatrix();
    matas.setMatrixAt(n, dummy.matrix); matas.setColorAt(n, verdes[n % 3]); n++;
  }
  g.add(matas);
  const silvestres = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.07, 0), std("#FFFFFF"), 240);
  for (let i = 0, n = 0; n < 240 && i < 3000; i++) {
    const a = rnd() * Math.PI * 2, d = 2.6 + Math.sqrt(rnd()) * 24, x = Math.sin(a) * d, z = -Math.cos(a) * d;
    if (libre(x, z)) continue;
    dummy.position.set(x, Y + 0.3, z); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(0.8 + rnd() * 0.7); dummy.updateMatrix();
    silvestres.setMatrixAt(n, dummy.matrix); silvestres.setColorAt(n, new THREE.Color(colorFlor[n % colorFlor.length])); n++;
  }
  g.add(silvestres);

  // ---------------- nubes y mariposas
  const blanco = new THREE.MeshBasicMaterial({ color: "#FFFFFF", transparent: true, opacity: 0.93, fog: false });
  const nubes = [];
  for (let i = 0; i < 9; i++) {
    const n = new THREE.Group();
    for (let j = 0; j < 5; j++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(3 + rnd() * 2.5, 1), blanco); b.position.set((j - 2) * 4.2 + rnd() * 2, rnd() * 1.8, rnd() * 2); b.scale.y = 0.55; n.add(b); }
    fusionar(n, { material: blanco });
    const a = -2.6 + i * 0.65;
    n.position.set(Math.sin(a) * 85, 30 + rnd() * 14, -Math.cos(a) * 85); n.lookAt(0, n.position.y, 0);
    g.add(n); nubes.push(n);
  }
  animar.push(t => nubes.forEach((n, i) => { n.position.x += Math.cos(t * 0.02 + i) * 0.004; }));
  const alaM = c => new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.15), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
  const mariposas = [];
  for (let i = 0; i < 6; i++) {
    const m = new THREE.Group(), c = ["#F5D547", "#FFFFFF", "#F2A541"][i % 3], a1 = alaM(c), a2 = alaM(c);
    a1.position.x = -0.1; a2.position.x = 0.1; m.add(a1, a2);
    mariposas.push({ m, a1, a2, cx: (rnd() - 0.5) * 14, cz: -8 - rnd() * 16, r: 1 + rnd() * 2, v: 0.3 + rnd() * 0.4, f: rnd() * 6 });
    g.add(m);
  }
  animar.push(t => mariposas.forEach(b => {
    const a = t * b.v + b.f;
    b.m.position.set(b.cx + Math.cos(a) * b.r, Y + 0.9 + Math.sin(a * 1.7) * 0.4, b.cz + Math.sin(a) * b.r);
    b.m.rotation.y = -a;
    const ab = Math.sin(t * 22 + b.f) * 0.9;
    b.a1.rotation.z = ab; b.a2.rotation.z = -ab;
  }));

  // ---------------- árboles y palmeras
  const hoja = ["#3F7A36", "#4F8F3E", "#5BA04A", "#356B30"].map(c => std(c));
  plantarArboles(g, hoja, std("#6A4A2E"), std("#A89F8C"));

  g.userData.animar = t => animar.forEach(f => f(t));
  return g;
}

// Palma real: tronco gris que se afina, cuello verde y corona de hojas largas que salen hacia afuera y se doblan hacia abajo.
function crearPalmera(rnd, hoja, tronco) {
  const g = new THREE.Group();
  const alto = 9 + rnd() * 3;
  const t = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.32, alto, 8), tronco);
  t.position.y = alto / 2;
  g.add(t);
  const cuello = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.17, 0.9, 8), hoja[0]);
  cuello.position.y = alto + 0.35;
  g.add(cuello);
  const tramos = [new THREE.ConeGeometry(0.3, 2, 4).translate(0, 1, 0), new THREE.ConeGeometry(0.24, 1.8, 4).translate(0, 0.9, 0), new THREE.ConeGeometry(0.17, 1.5, 4).translate(0, 0.75, 0)];
  const hojas = 11;
  for (let k = 0; k < hojas; k++) {
    const giro = new THREE.Group();                   // reparte las hojas alrededor del tronco
    giro.position.y = alto + 0.75;
    giro.rotation.y = k / hojas * Math.PI * 2 + rnd() * 0.3;
    const a = new THREE.Group();                      // inclina el primer tramo hacia afuera
    a.rotation.x = k % 2 ? 1.2 : 0.85;
    const m = hoja[(k + 1) % 4];
    const m1 = new THREE.Mesh(tramos[0], m); m1.scale.set(2, 1, 0.22);
    const b = new THREE.Group(); b.position.y = 2; b.rotation.x = 0.7;
    const m2 = new THREE.Mesh(tramos[1], m); m2.scale.set(2, 1, 0.22); b.add(m2);
    const c = new THREE.Group(); c.position.y = 1.8; c.rotation.x = 0.7;
    const m3 = new THREE.Mesh(tramos[2], m); m3.scale.set(2, 1, 0.22); c.add(m3);
    b.add(c); a.add(m1, b); giro.add(a); g.add(giro);
  }
  fusionar(g);                                        // todo el árbol queda en una sola malla
  return g;
}

// Árbol de copa redonda y frondosa: tronco con base ancha, dos ramas y siete masas de hojas de distintos verdes.
function crearArbol(rnd, hoja, madera) {
  const g = new THREE.Group();
  const alto = 3.6 + rnd() * 1.2;
  const t = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.46, alto, 7), madera); t.position.y = alto / 2; g.add(t);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.72, 0.6, 7), madera); base.position.y = 0.3; g.add(base);
  for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.15, 1.8, 5), madera); r.position.set(s * 0.55, alto - 0.5, 0); r.rotation.z = -s * 0.8; g.add(r); }
  for (let k = 0; k < 7; k++) {
    const a = k / 7 * Math.PI * 2 + rnd() * 0.5;
    const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25 + rnd() * 0.7, 1), hoja[k % 4]);
    c.position.set(Math.cos(a) * 1.5 * (k ? 1 : 0), alto + 0.7 + (k % 3) * 0.5 + (k ? 0 : 0.8), Math.sin(a) * 1.5 * (k ? 1 : 0));
    g.add(c);
  }
  fusionar(g);
  return g;
}

// Distancia horizontal del tronco al punto más lejano del árbol (mide los vértices reales, así no hay que adivinar).
export function radioDe(arbol) {
  const v = new THREE.Vector3();
  let r = 0;
  arbol.updateMatrixWorld(true);
  arbol.traverse(o => {
    if (!o.isMesh) return;
    const p = o.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld);
      r = Math.max(r, Math.hypot(v.x, v.z));
    }
  });
  return r;
}

// Distancia del punto (x, z) al rectángulo de un edificio (0 si está dentro).
function distanciaAlEdificio(x, z, [bx, bz, w, , d, ry]) {
  const dx = x - bx, dz = z - bz;
  const lx = dx * Math.cos(ry) - dz * Math.sin(ry), lz = dx * Math.sin(ry) + dz * Math.cos(ry);
  return Math.hypot(Math.max(Math.abs(lx) - w / 2, 0), Math.max(Math.abs(lz) - d / 2, 0));
}

// Reparte los árboles con una semilla fija (el campus se ve igual cada vez). Cada árbol se coloca solo si
// no pisa a otro árbol, a un edificio, al camino, a la plazoleta ni a los jardines, ni a la zona de enfrente donde llegan volando las aves.
function plantarArboles(g, hoja, madera, tronco) {
  const rnd = semilla(20231);
  const puestos = [];
  for (let i = 0; i < 34; i++) {
    const arbol = i % 4 === 0 ? crearPalmera(rnd, hoja, tronco) : crearArbol(rnd, hoja, madera);
    const escala = 0.85 + rnd() * 0.4;
    const radio = radioDe(arbol) * escala;
    for (let intento = 0; intento < 150; intento++) {
      const a = i / 34 * Math.PI * 2 + (rnd() - 0.5) * (0.4 + intento * 0.04);                // un sector por árbol: quedan repartidos en círculo
      const d = Math.sqrt(14 * 14 + rnd() * (40 * 40 - 14 * 14));                             // entre 14 y 40 m
      const x = Math.sin(a) * d, z = -Math.cos(a) * d;
      if (d - radio < 10) continue;                                                           // el centro queda libre
      if (Math.abs(x) < 3 && z < 12 && z > -52) continue;                                     // el camino queda libre
      if (OBSTACULOS.some(o => Math.hypot(o.x - x, o.z - z) < o.r + 1.2)) continue;           // ni la plazoleta, ni los jardines, bancas o farolas
      if (EDIFICIOS.some(e => distanciaAlEdificio(x, z, e) < radio + 0.8)) continue;
      if (puestos.some(p => Math.hypot(p.x - x, p.z - z) < p.radio + radio + 0.3)) continue;
      arbol.position.set(x, Y, z);
      arbol.rotation.y = rnd() * Math.PI * 2;
      arbol.scale.setScalar(escala);
      g.add(arbol);
      puestos.push({ x, z, radio });
      break;
    }
  }
}
