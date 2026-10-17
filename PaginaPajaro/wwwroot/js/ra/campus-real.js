// Campus UAO «fiel» para la cinemática del recorrido (distinto del campus simulado de la RA, que es solo el escenario de juego).
// Plano basado en el mapa de la carrera «Runners» y en las fotos aéreas (escala ≈ 0,5 m por píxel del mapa). Metros, y arriba. El eje va de la
// Portería 1 (z = +150, sobre la Calle 25) hacia -z: andén → PORTERÍA 1 → pasillo entre las dos alas del Edificio Central (Sur a +x, Norte a -x) →
// EL ARCO CENTRAL → el ÁGORA (círculo con gradas, seto amarillo y las palmas altas alrededor) → entre Aulas 2 (derecha) y Aulas 3 (izquierda).
// Aulas 1 a la derecha (Sur) más cerca del Ágora, Aulas 2, 3 y 4 en escalera hacia la izquierda y hacia el fondo; todas de 4 pisos.
// Lago entre Aulas 1/2 y la cafetería; cafetería en L (ala larga + bloque con techo en pirámide) y Portería 3 al final, casi alineada con la 1.
// Canchas al costado Sur (+x). Techos verdes con paneles solares, parqueaderos con cubierta solar, cielo con montañas.
import * as THREE from "three";
import { fusionar } from "./fusion.js";
import { semilla, crearArbol } from "./campus.js";

const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.9, ...extra });
const caja = (w, h, d, m, x, y, z) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); return o; };
const dummy = new THREE.Object3D();

const YT = 4.2;                                      // altura de la meseta norte: la Portería 1, el Edificio Central y el arco están más altos que el resto del campus
const enMeseta = (x, z) => z > 40 && z < 216 && Math.abs(x) < 148;
const C = {
  ladrilloArco: "#D98660", ladrilloAula: "#BC5C3D", ladrilloPorteria: "#C2603F", concreto: "#D6CCBC", gris: "#8F9193", techo: "#33A894", panel: "#27458C",
  pasto: "#79A84B", baldosa: "#E4B7A0", lineaBaldosa: "#B5573F", setoA: "#C9C93A", setoB: "#A7C23A", blanco: "#F6F1E7"
};

// ---------- texturas y rótulos de canvas
const lienzo = (w, h) => { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; return [cv, cv.getContext("2d")]; };
function texturaBaldosa(repX, repY) {
  const [cv, g] = lienzo(128, 128);
  g.fillStyle = C.baldosa; g.fillRect(0, 0, 128, 128);
  g.strokeStyle = C.lineaBaldosa; g.lineWidth = 5;
  g.beginPath(); g.moveTo(0, 64); g.lineTo(64, 0); g.lineTo(128, 64); g.lineTo(64, 128); g.closePath(); g.stroke();
  g.strokeStyle = "#CE9C86"; g.lineWidth = 2; g.strokeRect(1, 1, 126, 126);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repX, repY); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
function texturaAndén(repX, repY) {                    // concreto gris con franjas de ladrillo (portería y andén)
  const [cv, g] = lienzo(128, 128);
  g.fillStyle = "#B9B6AE"; g.fillRect(0, 0, 128, 128);
  g.strokeStyle = "#9A978F"; g.lineWidth = 3; g.strokeRect(1, 1, 126, 126);
  g.fillStyle = "#B0553F"; g.fillRect(0, 52, 128, 24);
  g.strokeStyle = "#8F3F2E"; g.lineWidth = 2; for (let x = 0; x < 128; x += 16) { g.beginPath(); g.moveTo(x, 52); g.lineTo(x, 76); g.stroke(); }
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repX, repY); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
function texturaCelosia() {                           // franja de ladrillo calado sobre el arco
  const [cv, g] = lienzo(256, 64);
  g.fillStyle = "#CF7552"; g.fillRect(0, 0, 256, 64);
  g.fillStyle = "#6E3A2A";
  for (let x = 6; x < 256; x += 16) for (let y = 8; y < 64; y += 20) g.fillRect(x, y, 8, 12);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function texturaCampo(tipo) {                         // marcas de las canchas (largo en x)
  const [cv, g] = lienzo(512, 320);
  g.fillStyle = tipo === "futbol" ? "#4E9A3C" : tipo === "basquet" ? "#C95A3C" : "#E4C98A"; g.fillRect(0, 0, 512, 320);
  if (tipo === "futbol") for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#4E9A3C" : "#58A446"; g.fillRect(i * 64, 0, 64, 320); }
  g.strokeStyle = "#FFFFFF"; g.lineWidth = 5; g.strokeRect(14, 14, 484, 292);
  g.beginPath(); g.moveTo(256, 14); g.lineTo(256, 306); g.stroke();
  g.beginPath(); g.arc(256, 160, 46, 0, Math.PI * 2); g.stroke();
  if (tipo === "futbol") { g.strokeRect(14, 80, 70, 160); g.strokeRect(428, 80, 70, 160); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// «uao» dibujado con trazos gruesos: u, a (aro con palito) y o (aro); (x, y) = esquina superior izquierda, h = alto de las letras
function logoUao(g, x, y, h, color) {
  const t = h * 0.27;
  g.strokeStyle = color; g.lineWidth = t; g.lineCap = "butt"; g.lineJoin = "round";
  const uw = h * 0.86, r = (uw - t) / 2, yb = y + h - t / 2 - r;
  g.beginPath(); g.moveTo(x + t / 2, y); g.lineTo(x + t / 2, yb); g.arc(x + uw / 2, yb, r, Math.PI, 0, true); g.lineTo(x + uw - t / 2, y); g.stroke();
  const ax = x + uw + h * 0.2, ra = (h * 0.98 - t) / 2;
  g.beginPath(); g.arc(ax + ra + t / 2, y + h / 2, ra, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.moveTo(ax + ra * 2 + t, y + h * 0.02); g.lineTo(ax + ra * 2 + t, y + h * 0.98); g.stroke();
  const ox = ax + ra * 2 + t * 1.5 + h * 0.2, ro = (h * 1.04 - t) / 2;
  g.beginPath(); g.arc(ox + ro + t / 2, y + h / 2, ro, 0, Math.PI * 2); g.stroke();
}
// plano con algo dibujado encima (rótulos); el canvas es de px × py y el plano de w × h metros
function rotulo(w, h, px, py, dibujar) {
  const [cv, g] = lienzo(px, py); dibujar(g, px, py);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  m.userData.sinFusion = true;
  return m;
}
const dibujarMarca = (color = C.blanco) => (g, W, H) => {     // «uao» + «Universidad Autónoma de Occidente»
  const h = H * 0.56; logoUao(g, W * 0.04, (H - h) / 2, h, color);
  g.fillStyle = color; g.font = `600 ${Math.round(H * 0.215)}px Arial, Helvetica, sans-serif`; g.textBaseline = "middle";
  const x = W * 0.04 + h * 3.55; ["Universidad", "Autónoma de", "Occidente"].forEach((t, i) => g.fillText(t, x, H * (0.27 + i * 0.23)));
};
const dibujarTexto = (lineas, color, fuente = 700, fondo = null) => (g, W, H) => {
  if (fondo) { g.fillStyle = fondo; g.fillRect(0, 0, W, H); }
  g.fillStyle = color; g.textAlign = "center"; g.textBaseline = "middle";
  const px = Math.round(H / (lineas.length + 0.5));
  g.font = `${fuente} ${px}px Arial, Helvetica, sans-serif`;
  lineas.forEach((t, i) => g.fillText(t, W / 2, H * ((i + 0.75) / (lineas.length + 0.5))));
};

// ---------- edificio de aulas / alas / cafetería: ladrillo, franjas de concreto, ventanas (instancias), techo verde con paneles solares
const prisma = (() => { const s = new THREE.Shape(); s.moveTo(-0.5, 0); s.lineTo(0.5, 0); s.lineTo(0, 1); s.closePath(); const p = new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false }); p.translate(0, 0, -0.5); return p; })();
const piramide = new THREE.ConeGeometry(Math.SQRT1_2, 1, 4).rotateY(Math.PI / 4).translate(0, 0.5, 0);
const matVidrio = std("#2E3A44", { roughness: 0.3 }), matMarco = std("#E7E0D0"), matConcreto = std(C.concreto), matTecho = std(C.techo), matPanel = new THREE.MeshStandardMaterial({ color: C.panel, roughness: 0.35, metalness: 0.3 });

function ventanas(g, w, h, d, pisos, paso = 3.2, caras = [0, 1, 2, 3]) {
  const alto = h / pisos, lista = [];
  const defs = [[w, d / 2, 0, 0, 1], [w, d / 2, Math.PI, 0, -1], [d, w / 2, Math.PI / 2, 1, 0], [d, w / 2, -Math.PI / 2, -1, 0]];
  caras.forEach(ci => {
    const [largo, fondo, giro, nx, nz] = defs[ci];
    const n = Math.floor((largo - 2) / paso);
    for (let i = 0; i < n; i++) for (let j = 0; j < pisos; j++) {
      const u = (i - (n - 1) / 2) * paso;
      lista.push([nx ? nx * (fondo + 0.03) : u, alto * (j + 0.5) - 0.1, nz ? nz * (fondo + 0.03) : (nx ? u : 0), giro]);
    }
  });
  if (!lista.length) return;
  const marcos = new THREE.InstancedMesh(new THREE.BoxGeometry(2.2, 2, 0.1), matMarco, lista.length);
  const vidrios = new THREE.InstancedMesh(new THREE.BoxGeometry(1.8, 1.6, 0.14), matVidrio, lista.length);
  lista.forEach(([px, py, pz, gi], i) => { dummy.position.set(px, py, pz); dummy.rotation.set(0, gi, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); marcos.setMatrixAt(i, dummy.matrix); vidrios.setMatrixAt(i, dummy.matrix); });
  g.add(marcos, vidrios);
}
function techoVerde(g, w, d, h, alto = 3, paneles = 3) {          // a dos aguas, con la cumbrera a lo largo
  const largo = Math.max(w, d) + 1.6, luz = Math.min(w, d) + 1.6;
  const tejado = new THREE.Group();
  tejado.position.y = h + 0.35;
  tejado.rotation.y = w >= d ? Math.PI / 2 : 0;
  const agua = new THREE.Mesh(prisma, matTecho); agua.scale.set(luz, alto, largo); tejado.add(agua);
  const theta = Math.atan2(alto, luz / 2);
  for (const s of [-1, 1]) for (let k = 0; k < paneles; k++) {
    const t = 0.18 + k * (0.62 / paneles);
    const p = new THREE.Mesh(new THREE.BoxGeometry(luz * 0.2, 0.08, largo * 0.8), matPanel);
    p.position.set(s * (luz / 2) * (1 - t), alto * t + 0.08, 0);
    p.rotation.z = -s * theta;
    tejado.add(p);
  }
  g.add(tejado);
}
function techoPiramide(g, w, d, h, alto) {                       // techo a cuatro aguas con paneles en las cuatro caras
  const tejado = new THREE.Group(); tejado.position.y = h + 0.35;
  const cono = new THREE.Mesh(piramide, matTecho); cono.scale.set(w + 1.6, alto, d + 1.6); tejado.add(cono);
  for (const [lx, lz, rx, rz, ancho] of [[0, 1, 1, 0, w], [0, -1, -1, 0, w], [1, 0, 0, -1, d], [-1, 0, 0, 1, d]]) {
    const med = lx ? (w + 1.6) / 2 : (d + 1.6) / 2, th = Math.atan2(alto, med);
    const p = new THREE.Mesh(new THREE.BoxGeometry(lx ? med * 0.55 : ancho * 0.6, 0.08, lx ? ancho * 0.6 : med * 0.55), matPanel);
    p.position.set(lx * med * 0.5, alto * 0.5 + 0.1, lz * med * 0.5);
    p.rotation.x = rx * th; p.rotation.z = rz * th;
    tejado.add(p);
  }
  g.add(tejado);
}
function edificio({ w, h, d, ladrillo = C.ladrilloAula, techo = "aguas", paneles = 3, paso = 3.2, caras = [0, 1, 2, 3], pisos = null }) {
  const g = new THREE.Group();
  pisos = pisos || Math.max(1, Math.round(h / 4));
  const alto = h / pisos;
  g.add(caja(w, h, d, std(ladrillo), 0, h / 2, 0));
  for (let j = 1; j < pisos; j++) g.add(caja(w + 0.9, 0.38, d + 0.9, matConcreto, 0, alto * j, 0));
  g.add(caja(w + 1.4, 0.55, d + 1.4, matConcreto, 0, h + 0.1, 0));
  ventanas(g, w, h, d, pisos, paso, caras);
  if (techo === "aguas") techoVerde(g, w, d, h, Math.min(4, Math.min(w, d) * 0.28), paneles);
  else if (techo === "piramide") techoPiramide(g, w, d, h, 5);
  fusionar(g);
  return g;
}

// ---------- EL ARCO CENTRAL: cuerpo transversal con arco semicircular, celosía de ladrillo, remate verde y cubierta de acero y vidrio
function arcoCentral() {
  const g = new THREE.Group();
  const W = 34, H = 21, D = 18, r = 8.4, hRect = 3.2;
  const s = new THREE.Shape(); s.moveTo(-W / 2, 0); s.lineTo(W / 2, 0); s.lineTo(W / 2, H); s.lineTo(-W / 2, H); s.lineTo(-W / 2, 0);
  const hueco = new THREE.Path(); hueco.moveTo(-r, 0); hueco.lineTo(r, 0); hueco.lineTo(r, hRect); hueco.absarc(0, hRect, r, 0, Math.PI, false); hueco.lineTo(-r, 0);
  s.holes.push(hueco);
  const geo = new THREE.ExtrudeGeometry(s, { depth: D, bevelEnabled: false }); geo.translate(0, 0, -D / 2);
  g.add(new THREE.Mesh(geo, std(C.ladrilloArco)));
  for (const sz of [-1, 1]) {                                                       // marco de concreto del arco y celosía, en las dos caras
    const marco = new THREE.Shape(); marco.moveTo(-r - 0.8, 0); marco.lineTo(r + 0.8, 0); marco.lineTo(r + 0.8, hRect); marco.absarc(0, hRect, r + 0.8, 0, Math.PI, false); marco.lineTo(-r - 0.8, 0);
    const h2 = new THREE.Path(); h2.moveTo(-r, 0); h2.lineTo(r, 0); h2.lineTo(r, hRect); h2.absarc(0, hRect, r, 0, Math.PI, false); h2.lineTo(-r, 0); marco.holes.push(h2);
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(marco, { depth: 0.5, bevelEnabled: false }), matConcreto);
    m.position.z = sz > 0 ? D / 2 : -D / 2 - 0.5;
    g.add(m);
    const cel = new THREE.Mesh(new THREE.PlaneGeometry(W - 5, 4.4), new THREE.MeshStandardMaterial({ map: texturaCelosia(), roughness: 0.9 }));
    cel.position.set(0, hRect + r + 3.4, sz * (D / 2 + 0.06)); if (sz < 0) cel.rotation.y = Math.PI;
    g.add(cel);
    for (let k = 0; k < 4; k++) {                                                   // ventanas a los lados del arco
      for (const sx of [-1, 1]) g.add(Object.assign(caja(2, 2.2, 0.3, matVidrio, sx * (r + 4.2), 3.5 + k * 3.8, sz * (D / 2 + 0.08)), {}));
    }
  }
  g.add(caja(W + 1.6, 0.9, D + 1.6, matTecho, 0, H + 0.45, 0));                     // remate verde
  // cubierta translúcida de acero sobre el arco (media bóveda con costillas)
  const boveda = new THREE.Mesh(new THREE.CylinderGeometry(11, 11, 14, 20, 1, true, -Math.PI / 2 - 0.55, 1.1), new THREE.MeshStandardMaterial({ color: "#B9C7D0", transparent: true, opacity: 0.45, side: THREE.DoubleSide, roughness: 0.3 }));
  boveda.rotation.z = Math.PI / 2; boveda.position.set(0, H + 0.4, 0); boveda.userData.sinFusion = true; g.add(boveda);
  for (let k = -3; k <= 3; k++) {
    const costilla = new THREE.Mesh(new THREE.TorusGeometry(11, 0.14, 5, 18, 1.1), std("#7F8A92"));
    costilla.rotation.y = Math.PI / 2; costilla.rotation.z = Math.PI / 2 - 0.55; costilla.position.set(k * 2.3, H + 0.4, 0); g.add(costilla);
  }
  for (const sx of [-1, 1]) for (let i = 0; i < 2; i++) {                           // luces anaranjadas
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 6), new THREE.MeshStandardMaterial({ color: "#FFB36B", emissive: "#FF9A3C", emissiveIntensity: 1.3 }));
    l.position.set(sx * (r + 1.9), 5.6 + i * 3.5, D / 2 + 0.9); g.add(l);
  }
  return g;
}

// ---------- ÁGORA: círculo con gradas, centro con rayos, aro de baldosa rosa y seto amarillo en el lado de las aulas
function agora() {
  const g = new THREE.Group();
  const rosa = [std("#C97B58"), std("#F2CDB6")];
  const aro = new THREE.Mesh(new THREE.RingGeometry(19, 23.5, 48), std("#E2B49A")); aro.rotation.x = -Math.PI / 2; aro.position.y = 0.02; g.add(aro);
  const contraMat = [std("#A8613F", { side: THREE.BackSide }), std("#C98966", { side: THREE.BackSide })];
  const gradas = [[19, 0.0], [16.4, -0.45], [13.8, -0.9], [11.2, -1.35], [8.6, -1.8]];     // [radio exterior, altura]: cada grada es un anillo que baja hacia el centro
  gradas.forEach(([r, y], i) => {
    const interior = i < gradas.length - 1 ? gradas[i + 1][0] : 0;
    if (interior) {
      const anillo = new THREE.Mesh(new THREE.RingGeometry(interior, r, 48), rosa[i % 2 ? 0 : 1]); anillo.rotation.x = -Math.PI / 2; anillo.position.y = y; g.add(anillo);
      const alt = y - gradas[i + 1][1];
      const contra = new THREE.Mesh(new THREE.CylinderGeometry(interior, interior, alt, 48, 1, true), contraMat[i % 2]); contra.position.y = y - alt / 2; g.add(contra);   // contrahuella (mira hacia el centro)
    }
  });
  const [cv, c2] = lienzo(256, 256); c2.fillStyle = "#E4B7A0"; c2.fillRect(0, 0, 256, 256); c2.strokeStyle = "#B5573F"; c2.lineWidth = 3;
  for (let a = 0; a < 16; a++) { c2.beginPath(); c2.moveTo(128, 128); c2.lineTo(128 + Math.cos(a / 16 * 6.283) * 128, 128 + Math.sin(a / 16 * 6.283) * 128); c2.stroke(); }
  c2.beginPath(); c2.arc(128, 128, 60, 0, 6.283); c2.stroke();
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const centro = new THREE.Mesh(new THREE.CircleGeometry(8.6, 40), new THREE.MeshStandardMaterial({ map: t, roughness: 1 })); centro.rotation.x = -Math.PI / 2; centro.position.y = -1.78; g.add(centro);
  const rnd = semilla(5), seto = new THREE.Group();                                   // seto amarillo en media luna del lado de las aulas (-z), con flores rojas y naranjas
  for (let i = 0; i < 52; i++) {
    const a = Math.PI * (0.03 + 0.94 * i / 51);
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2 + rnd() * 0.3, 1), std(i % 3 ? C.setoA : C.setoB));
    m.position.set(Math.cos(a) * 21.6, 0.6, -Math.sin(a) * 21.6); m.scale.y = 0.7; seto.add(m);
    if (i % 2 === 0) { const f = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), std(i % 4 ? "#D9473A" : "#F08A2E")); f.position.set(Math.cos(a) * 23.4, 0.3, -Math.sin(a) * 23.4); seto.add(f); }
  }
  fusionar(seto); g.add(seto);
  return g;
}

// ---------- palma real: tronco muy alto y delgado, cuello verde y corona de hojas largas
function palmaReal(rnd, hojas, tronco) {
  const g = new THREE.Group();
  const alto = 22 + rnd() * 5;
  const t = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.5, alto, 8), tronco); t.position.y = alto / 2; g.add(t);
  const cuello = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.3, 1.8, 8), hojas[0]); cuello.position.y = alto + 0.5; g.add(cuello);
  const corona = new THREE.Group(); corona.position.y = alto + 1.3; corona.scale.setScalar(1.8); g.add(corona);
  const tramos = [new THREE.ConeGeometry(0.3, 2, 4).translate(0, 1, 0), new THREE.ConeGeometry(0.24, 1.8, 4).translate(0, 0.9, 0), new THREE.ConeGeometry(0.17, 1.5, 4).translate(0, 0.75, 0)];
  const n = 12;
  for (let k = 0; k < n; k++) {
    const giro = new THREE.Group(); giro.rotation.y = k / n * Math.PI * 2 + rnd() * 0.3;
    const a = new THREE.Group(); a.rotation.x = k % 2 ? 1.15 : 0.8;
    const m = hojas[(k + 1) % 4];
    const m1 = new THREE.Mesh(tramos[0], m); m1.scale.set(2, 1, 0.22);
    const b = new THREE.Group(); b.position.y = 2; b.rotation.x = 0.7;
    const m2 = new THREE.Mesh(tramos[1], m); m2.scale.set(2, 1, 0.22); b.add(m2);
    const c = new THREE.Group(); c.position.y = 1.8; c.rotation.x = 0.7;
    const m3 = new THREE.Mesh(tramos[2], m); m3.scale.set(2, 1, 0.22); c.add(m3);
    b.add(c); a.add(m1, b); giro.add(a); corona.add(giro);
  }
  fusionar(g);
  return g;
}

// ---------- vegetación: árboles de copa redonda, palmas del Ágora y de la portería, setos; todo fusionado en pocas mallas
function vegetacion(libre, ptsAgora) {
  const g = new THREE.Group();
  const rnd = semilla(909);
  const hojas = ["#3F7A36", "#4F8F3E", "#5BA04A", "#356B30"].map(c => std(c));
  const madera = std("#6A4A2E"), troncoPalma = std("#B7AFA0");
  const palmas = new THREE.Group(), arboles = new THREE.Group();
  const poner = (obj, x, z, esc) => { obj.position.set(x, enMeseta(x, z) ? YT : 0, z); obj.rotation.y = rnd() * 6.28; obj.scale.setScalar(esc); return obj; };
  // las palmas altas «icónicas»: forman un anillo alrededor del Ágora (con huecos donde llegan los caminos) y unas pocas en el jardín de la entrada
  for (let i = 0; i < 14; i++) {                                                     // radio y ángulo con un poco de azar: un anillo suelto, no una hilera
    const a = Math.PI * 0.04 + i * (Math.PI * 1.92 / 13) + (rnd() - 0.5) * 0.18, rr = ptsAgora.r + (rnd() - 0.5) * 7;
    const x = Math.cos(a) * rr, z = ptsAgora.z + Math.sin(a) * rr;
    if (Math.abs(x) < 10) continue;                                                   // huecos donde llegan los caminos
    palmas.add(poner(palmaReal(rnd, hojas, troncoPalma), x, z, 0.95 + rnd() * 0.15));
  }
  for (const [x, z] of [[-12, 136], [12.5, 128], [-13, 118], [12, 108], [-12, 98], [13, 90], [-40, 160], [44, 162]]) palmas.add(poner(palmaReal(rnd, hojas, troncoPalma), x, z, 0.7 + rnd() * 0.12));
  let n = 0;
  for (let i = 0; i < 3500 && n < 235; i++) {
    const x = (rnd() - 0.5) * 460, z = 190 - rnd() * 520;
    if (!libre(x, z)) continue;
    arboles.add(poner(crearArbol(rnd, hojas, madera), x, z, 1.5 + rnd() * 1.1)); n++;
  }
  fusionar(palmas); fusionar(arboles);
  g.add(palmas, arboles);
  // buganvillas magenta y matas de hoja morada en los jardines (como en las fotos de las porterías)
  const bug = new THREE.Group();
  for (let i = 0; i < 70; i++) {
    const x = (rnd() - 0.5) * 190, z = 90 - rnd() * 250;
    if (!libre(x, z)) continue;
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1 + rnd() * 0.8, 1), std(["#C2297A", "#D83A8C", "#7A3555", "#8A4A6E"][i % 4])); m.position.set(x, 0.9 + (enMeseta(x, z) ? YT : 0), z); m.scale.y = 0.8; bug.add(m);
  }
  fusionar(bug); g.add(bug);
  return g;
}

// ---------- lago (o estanque) con piedras en la orilla, nenúfares y fuente
function lago(animar, rx, ry, { fuente = true, seed = 21 } = {}) {
  const g = new THREE.Group();
  const sh = new THREE.Shape(); const rnd = semilla(seed);
  for (let i = 0; i <= 24; i++) { const a = i / 24 * 6.283, r = 1 + (rnd() - 0.5) * 0.28; const x = Math.cos(a) * rx * r, y = Math.sin(a) * ry * r; if (i) sh.lineTo(x, y); else sh.moveTo(x, y); }
  const agua = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshStandardMaterial({ color: "#4E9FBF", roughness: 0.15, metalness: 0.15 }));
  agua.rotation.x = -Math.PI / 2; agua.position.y = 0.06; g.add(agua);
  const orilla = new THREE.Mesh(new THREE.ShapeGeometry(sh), std("#7A6B4C")); orilla.rotation.x = -Math.PI / 2; orilla.position.y = 0.02; orilla.scale.set(1.12, 1.12, 1); g.add(orilla);
  const adorno = new THREE.Group();
  const nPied = Math.round(rx * 1.2);
  for (let i = 0; i < nPied; i++) { const a = i / nPied * 6.283, r = 1.12 + rnd() * 0.08; const p = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5 + rnd() * 0.7, 0), std("#8A8578")); p.position.set(Math.cos(a) * rx * r, 0.3, Math.sin(a) * ry * r); p.scale.y = 0.7; adorno.add(p); }
  for (let i = 0; i < Math.round(rx * 1.6); i++) {                                  // nenúfares: hojas redondas verdes y alguna flor morada
    const a = rnd() * 6.283, r = Math.sqrt(rnd()) * 0.8;
    const hoja = new THREE.Mesh(new THREE.CircleGeometry(0.5 + rnd() * 0.35, 7), std("#4F8A3C")); hoja.rotation.x = -Math.PI / 2; hoja.position.set(Math.cos(a) * rx * r, 0.1, Math.sin(a) * ry * r); adorno.add(hoja);
    if (i % 5 === 0) { const f = new THREE.Mesh(new THREE.IcosahedronGeometry(0.25, 0), std("#9C6BD0")); f.position.set(hoja.position.x, 0.3, hoja.position.z); adorno.add(f); }
  }
  fusionar(adorno); g.add(adorno);
  if (fuente) {                                                                      // chorros animados (una sola malla instanciada)
    const gotas = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 5, 4), new THREE.MeshStandardMaterial({ color: "#E6F6FF", emissive: "#BFE7FF", emissiveIntensity: 0.4 }), 40);
    g.add(gotas); gotas.frustumCulled = false;
    const fase = Array.from({ length: 40 }, () => rnd()), k = Math.min(1, rx / 14);
    animar.push(t => { for (let i = 0; i < 40; i++) { const u = (t * 0.7 + fase[i]) % 1, a = (i % 10) / 10 * 6.283; const r = (0.4 + 3.6 * u) * k; dummy.position.set(Math.cos(a) * r, (1 + 6.2 * u - 9 * u * u + 2) * (0.6 + 0.4 * k), Math.sin(a) * r); dummy.scale.setScalar(1); dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); gotas.setMatrixAt(i, dummy.matrix); } gotas.instanceMatrix.needsUpdate = true; });
  }
  return g;
}

// ---------- cafetería: ala larga + bloque con techo a cuatro aguas; mesas de metal con dos sillas a cada lado, como las de afuera
function mesasCafeteria(x0, z0, filas, cols, sx, sz) {
  const g = new THREE.Group();
  const metal = std("#9EA3A8", { roughness: 0.5 }), oscuro = std("#5E6469", { roughness: 0.5 });
  for (let f = 0; f < filas; f++) for (let c = 0; c < cols; c++) {
    const x = x0 + c * sx, z = z0 + f * sz;
    g.add(caja(2.4, 0.1, 0.95, metal, x, 0.95, z));
    for (const px of [-1, 1]) for (const pz of [-1, 1]) g.add(caja(0.1, 0.95, 0.1, oscuro, x + px * 1.05, 0.47, z + pz * 0.38));
    for (const lado of [-1, 1]) for (const px of [-0.6, 0.6]) {                  // dos sillas a cada lado de la mesa
      g.add(caja(0.5, 0.07, 0.5, oscuro, x + px, 0.52, z + lado * 0.95));
      g.add(caja(0.5, 0.5, 0.06, oscuro, x + px, 0.8, z + lado * 1.2));
      g.add(caja(0.07, 0.5, 0.07, metal, x + px - 0.2, 0.26, z + lado * 0.95), caja(0.07, 0.5, 0.07, metal, x + px + 0.2, 0.26, z + lado * 0.95));
    }
  }
  fusionar(g);
  return g;
}

// ---------- porterías: muro de ladrillo, pórtico gris, letrero «uao», torniquetes, matas moradas y bordillo amarillo.
// Local: la calle queda hacia +z (para la Portería 3 se gira π). opts: ancho del muro, direccion (placa con la dirección), numero ("3"), booth (caseta gris a la derecha)
function porteria({ ancho = 30, direccion = false, numero = null, caseta = false }) {
  const g = new THREE.Group();
  const ladr = std(C.ladrilloPorteria), gris = std(C.gris), claro = std("#B9B6AE"), alto = 5.4, abre = 8, hAbre = 3.4;
  const izqW = ancho / 2 - abre / 2 - (caseta ? 0 : 0), derW = izqW;
  g.add(caja(ancho / 2 - abre / 2, alto, 1.6, ladr, -(ancho / 4 + abre / 4), alto / 2, 0));
  if (!caseta) g.add(caja(ancho / 2 - abre / 2, alto, 1.6, ladr, ancho / 4 + abre / 4, alto / 2, 0));
  g.add(caja(abre + 0.4, alto - hAbre, 1.6, ladr, 0, hAbre + (alto - hAbre) / 2, 0));       // dintel de ladrillo sobre la entrada
  g.add(caja(abre + 1.2, 0.5, 2.2, gris, 0, hAbre + 0.05, 0));                               // viga gris
  g.add(caja(0.9, hAbre, 1.9, gris, -abre / 2 - 0.2, hAbre / 2, 0), caja(0.9, hAbre, 1.9, gris, abre / 2 + 0.2, hAbre / 2, 0));
  g.add(caja(ancho + 0.6, 0.45, 2, claro, 0, alto + 0.2, 0));                                // remate
  if (caseta) {                                                                               // caseta de concreto gris con ventana oscura y el número
    const cx = abre / 2 + 3.6;
    g.add(caja(5.4, alto + 0.6, 2.4, gris, cx, (alto + 0.6) / 2, 0.15));
    g.add(caja(3.6, 2.2, 0.3, matVidrio, cx, 2.7, 1.45));
    g.add(caja(3.6, 1.2, 0.3, ladr, cx, 0.7, 1.4));
    g.add(caja(ancho / 2 - abre / 2 - 6.4, alto, 1.6, ladr, ancho / 2 - (ancho / 2 - abre / 2 - 6.4) / 2, alto / 2, 0));
    if (numero) { const n = rotulo(2.4, 2.4, 256, 256, (c, W, H) => { c.fillStyle = "#E4E6E8"; c.font = `800 ${H * 0.95}px Arial, Helvetica, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(numero, W / 2, H / 2 + 8); }); n.position.set(cx, 4.35, 1.5); g.add(n); }
  }
  // letrero principal «uao Universidad Autónoma de Occidente» sobre el muro (a la izquierda) y sobre el dintel
  const muro = ancho / 2 - abre / 2, wg = Math.min(12, muro - 1.4);                          // el letrero grande cabe dentro del tramo de muro (no queda en el aire)
  const grande = rotulo(wg, wg * 240 / 1024, 1024, 240, dibujarMarca());
  grande.position.set(-(abre / 2 + muro / 2), 3.1, 0.84); g.add(grande);
  const chico = rotulo(6.2, 6.2 * 240 / 1024, 1024, 240, dibujarMarca());
  chico.position.set(0, hAbre + (alto - hAbre) / 2 + 0.1, 0.84); g.add(chico);
  if (direccion) { const d = rotulo(11, 3.4, 1024, 316, dibujarTexto(["Calle 25", "No. 115 - 85", "Vía Cali – Jamundí"], C.blanco)); d.position.set(abre / 2 + 8.4, 2.9, 0.84); g.add(d); }
  // torniquetes (cuatro) y la puerta de accesibilidad, un poco adentro de la entrada
  const metal = std("#B4B9BD", { roughness: 0.4 });
  for (let i = 0; i < 5; i++) {
    const x = -3.4 + i * 1.7;
    g.add(caja(0.5, 1.1, 0.9, metal, x, 0.55, -1.2));
    if (i < 4) { const brazo = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 5), metal); brazo.rotation.z = 0.9; brazo.position.set(x + 0.3, 1.1, -1.2); g.add(brazo); }
  }
  // piso de la entrada, bordillo amarillo y franja de ladrillo
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(ancho + 12, 12), new THREE.MeshStandardMaterial({ map: texturaAndén((ancho + 12) / 6, 2), roughness: 1 }));
  piso.rotation.x = -Math.PI / 2; piso.position.set(0, 0.05, 6.5); piso.userData.sinFusion = true; g.add(piso);
  g.add(caja(ancho * 0.8, 0.22, 0.7, std("#F2C400"), 0, 0.15, 10.5));
  // matas de hoja morada y verde delante del muro (como en las fotos)
  const matas = new THREE.Group(), rnd = semilla(77 + ancho);
  for (let i = 0; i < 34; i++) {
    const x = (rnd() - 0.5) * (ancho - 2), esq = Math.abs(x) < abre / 2 + 1.2;
    if (esq) continue;
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7 + rnd() * 0.45, 1), std(["#6B2D45", "#8A3C66", "#6FAE4B", "#A24A6A"][i % 4])); m.position.set(x, 0.5, 2.1 + rnd() * 1.6); m.scale.y = 0.65; matas.add(m);
  }
  fusionar(matas); g.add(matas);
  fusionar(g);
  return g;
}
function letreroRojo() {                                // el cartel rojo calado «uao Universidad Autónoma de Occidente»
  const g = new THREE.Group();
  const cartel = rotulo(5.6, 4, 512, 366, (c, W, H) => {
    c.fillStyle = "#D8222A"; c.fillRect(0, 0, W, H); c.fillStyle = "#9E1219";
    for (let y = 10; y < H; y += 22) for (let x = (y / 22) % 2 ? 6 : 18; x < W; x += 24) c.fillRect(x, y, 12, 8);
    const h = H * 0.3; logoUao(c, W * 0.07, H * 0.12, h, "#F6F1E7");
    c.fillStyle = "#F6F1E7"; c.font = `600 ${H * 0.115}px Arial, Helvetica, sans-serif`; c.textBaseline = "middle";
    ["Universidad", "Autónoma de", "Occidente"].forEach((t, i) => c.fillText(t, W * 0.07, H * (0.58 + i * 0.13)));
  });
  cartel.position.y = 4.2; g.add(cartel);
  g.add(caja(0.2, 6.6, 0.2, std("#2A2D30"), -2.5, 3.3, -0.15), caja(0.2, 6.6, 0.2, std("#2A2D30"), 2.5, 3.3, -0.15));
  return g;
}

function canchas() {
  const g = new THREE.Group();
  const campo = (tipo, w, d, x, z) => {                                              // w = largo (a lo largo de x: horizontales), d = ancho
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: texturaCampo(tipo), roughness: 1 }));
    m.rotation.set(-Math.PI / 2, 0, Math.PI / 2); m.position.set(x, 0.05, z); g.add(m); return m;
  };
  campo("futbol", 100, 62, 0, 0);
  for (const sz of [-1, 1]) { const arco = new THREE.Group(); arco.add(caja(0.25, 2.6, 0.25, std("#FFFFFF"), -3.6, 1.3, 0), caja(0.25, 2.6, 0.25, std("#FFFFFF"), 3.6, 1.3, 0), caja(7.5, 0.25, 0.25, std("#FFFFFF"), 0, 2.6, 0)); arco.position.set(0, 0, sz * 50); g.add(arco); }
  campo("basquet", 34, 20, 0, -80); campo("voley", 24, 14, 0, -108);
  return g;
}
function parqueaderoSolar(filas, largo) {                // cubierta de paneles sobre postes (se ve en las fotos aéreas)
  const g = new THREE.Group();
  for (let f = 0; f < filas; f++) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(largo, 0.25, 7), matPanel); p.position.set(0, 4.5, (f - (filas - 1) / 2) * 9); p.rotation.x = 0.12; g.add(p);
    for (let k = 0; k < Math.floor(largo / 8) + 1; k++) g.add(caja(0.35, 4.5, 0.35, std("#777"), -largo / 2 + 1 + k * 8, 2.25, (f - (filas - 1) / 2) * 9));
  }
  fusionar(g);
  return g;
}
function reja(x0, x1, z) {                               // reja de hierro negra a lo largo de x
  const g = new THREE.Group(); const negro = std("#25282B");
  g.add(caja(x1 - x0, 0.1, 0.1, negro, (x0 + x1) / 2, 1.5, z), caja(x1 - x0, 0.1, 0.1, negro, (x0 + x1) / 2, 0.35, z));
  for (let x = x0; x <= x1; x += 2.6) g.add(caja(0.12, 1.9, 0.12, negro, x, 0.95, z));
  fusionar(g); return g;
}

// ---------- cielo, montañas y nubes
function cielo() {
  const g = new THREE.Group();
  const esf = new THREE.SphereGeometry(900, 24, 12), col = [], pos = esf.attributes.position;
  const arriba = new THREE.Color("#4F9BD6"), horizonte = new THREE.Color("#F2E3BF");
  for (let i = 0; i < pos.count; i++) { const k = THREE.MathUtils.clamp(pos.getY(i) / 900, 0, 1); const c = horizonte.clone().lerp(arriba, Math.pow(k, 0.55)); col.push(c.r, c.g, c.b); }
  esf.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.add(new THREE.Mesh(esf, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false })));
  const rnd = semilla(33), montes = new THREE.Group();
  for (let i = 0; i < 16; i++) {                                                  // cordillera lejana
    const a = i / 16 * 6.283, d = 640 + rnd() * 80, h = 70 + rnd() * 80;
    const m = new THREE.Mesh(new THREE.ConeGeometry(190 + rnd() * 110, h, 7), std(i % 2 ? "#5F8A86" : "#6C9690"));
    m.position.set(Math.sin(a) * d, h / 2 - 5, -Math.cos(a) * d); montes.add(m);
  }
  fusionar(montes); g.add(montes);
  const blanco = new THREE.MeshBasicMaterial({ color: "#FFFFFF", transparent: true, opacity: 0.93, fog: false });
  const nubes = new THREE.Group();
  for (let i = 0; i < 16; i++) {
    const n = new THREE.Group();
    for (let j = 0; j < 5; j++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(10 + rnd() * 7, 1), blanco); b.position.set((j - 2) * 14 + rnd() * 6, rnd() * 5, rnd() * 6); b.scale.y = 0.5; n.add(b); }
    fusionar(n, { material: blanco });
    n.position.set((rnd() - 0.5) * 900, 150 + rnd() * 90, (rnd() - 0.5) * 900); nubes.add(n);
  }
  g.add(nubes);
  return g;
}

// ---------- parque al frente de la Portería 3: canchas, zona verde, sendero recto y el parqueadero de los estudiantes
function parqueSur() {
  const g = new THREE.Group();
  const campo = (tipo, w, d, x, z) => {                                              // w = largo (a lo largo de x: horizontales), d = ancho
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: texturaCampo(tipo), roughness: 1 }));
    m.rotation.set(-Math.PI / 2, 0, 0); m.position.set(x, 0.05, z); g.add(m);
  };
  campo("futbol", 44, 26, 30, -250); campo("basquet", 28, 15, -30, -244); campo("voley", 18, 9, -30, -270);
  const arcos = new THREE.Group();
  for (const sz of [-1, 1]) { const a = new THREE.Group(); a.add(caja(0.2, 2.2, 0.2, std("#FFFFFF"), -2.8, 1.1, 0), caja(0.2, 2.2, 0.2, std("#FFFFFF"), 2.8, 1.1, 0), caja(5.8, 0.2, 0.2, std("#FFFFFF"), 0, 2.2, 0)); a.rotation.y = Math.PI / 2; a.position.set(30 + sz * 22, 0, -250); arcos.add(a); }
  fusionar(arcos); g.add(arcos);
  // parqueadero: asfalto con rayas de plazas y carros (instancias) en el fondo, al final del sendero
  const [cv, c] = lienzo(256, 256);
  c.fillStyle = "#4A4D50"; c.fillRect(0, 0, 256, 256); c.strokeStyle = "#E8E8E2"; c.lineWidth = 3;
  for (let i = 0; i <= 4; i++) for (const [y0, y1] of [[0, 92], [164, 256]]) { c.beginPath(); c.moveTo(i * 64, y0); c.lineTo(i * 64, y1); c.stroke(); }
  const tex = new THREE.CanvasTexture(cv); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(10, 3); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const lote = new THREE.Mesh(new THREE.PlaneGeometry(100, 42), new THREE.MeshStandardMaterial({ map: tex, roughness: 1 }));
  lote.rotation.x = -Math.PI / 2; lote.position.set(0, 0.05, -331); g.add(lote);
  const rnd = semilla(808), colores = ["#C8CDD2", "#2B2F33", "#B33A2E", "#E8E8E2", "#2F5FA0", "#7B8085", "#D9B53A", "#3E7A4A"];
  const posiciones = [];
  for (let tx = 0; tx < 10; tx++) for (let tz = 0; tz < 3; tz++) for (let i = 0; i < 4; i++) for (const fila of [0, 1]) {
    if (rnd() > 0.55) continue;
    posiciones.push([-50 + tx * 10 + 1.25 + i * 2.5, -352 + tz * 14 + (fila ? 11.25 : 2.75)]);
  }
  const cuerpo = new THREE.InstancedMesh(new THREE.BoxGeometry(1.8, 0.75, 4.2), new THREE.MeshStandardMaterial({ roughness: 0.6, flatShading: true }), posiciones.length);
  const cabina = new THREE.InstancedMesh(new THREE.BoxGeometry(1.5, 0.6, 2.2), std("#2A3138", { roughness: 0.3 }), posiciones.length);
  posiciones.forEach(([x, z], i) => {
    dummy.position.set(x, 0.62, z); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); cuerpo.setMatrixAt(i, dummy.matrix);
    cuerpo.setColorAt(i, new THREE.Color(colores[Math.floor(rnd() * colores.length)]));
    dummy.position.set(x, 1.2, z - 0.2); dummy.updateMatrix(); cabina.setMatrixAt(i, dummy.matrix);
  });
  cuerpo.instanceColor.needsUpdate = true;
  g.add(cuerpo, cabina);
  return g;
}

// ---------- el campus completo
export function crearCampusReal({ evitar = [] } = {}) {          // evitar: [x, z, radio] donde no se plantan árboles (por donde pasa la cámara)
  const g = new THREE.Group();
  const animar = [];
  g.add(cielo());
  const AG = { x: 0, z: 2 };                                                          // centro del Ágora
  const formaSuelo = new THREE.Shape(); formaSuelo.moveTo(-700, -700); formaSuelo.lineTo(700, -700); formaSuelo.lineTo(700, 700); formaSuelo.lineTo(-700, 700); formaSuelo.lineTo(-700, -700);
  const huecoAgora = new THREE.Path(); huecoAgora.absarc(AG.x, -AG.z, 23.3, 0, Math.PI * 2, true); formaSuelo.holes.push(huecoAgora);   // el Ágora es un hueco: sus gradas bajan hacia el centro
  const suelo = new THREE.Mesh(new THREE.ShapeGeometry(formaSuelo, 48), std(C.pasto, { flatShading: false, roughness: 1 })); suelo.rotation.x = -Math.PI / 2; g.add(suelo);
  const baldosa = (grupo, x, z, w, d) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: texturaBaldosa(w / 6, d / 6), roughness: 1 })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.04, z); grupo.add(m); };
  const calle = (grupo, w, d, x, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), std("#4B4F52", { flatShading: false })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.03, z); grupo.add(m); };

  // ---- NIVEL ALTO (norte): la Portería 1, la calle, el Edificio Central y el arco están 4,2 m más arriba que el resto del campus.
  // Hacia el sur la meseta termina en un muro de ladrillo (z = 42) donde está UAO Labs (sótano) con rampas y gradas para bajar.
  const norte = new THREE.Group(); norte.position.y = YT; g.add(norte);
  const bloque = new THREE.Mesh(new THREE.BoxGeometry(300, YT, 175), std("#A4533A")); bloque.position.set(0, YT / 2, 129.5); g.add(bloque);
  const cima = new THREE.Mesh(new THREE.PlaneGeometry(300, 175), std(C.pasto, { flatShading: false, roughness: 1 })); cima.rotation.x = -Math.PI / 2; cima.position.set(0, 0.01, 129.5); norte.add(cima);
  baldosa(norte, 0, 117, 7, 70); baldosa(norte, 0, 56, 36, 28);                       // andén → pasillo de las alas → «área de estar» al sur del arco
  calle(norte, 300, 14, 0, 170);                                                      // Calle 25 (frente a la Portería 1)
  const p1 = porteria({ ancho: 40, direccion: true }); p1.position.set(0, 0, 150); norte.add(p1);
  const rojo = letreroRojo(); rojo.position.set(-30, 0, 154); norte.add(rojo);        // el cartel rojo queda al lado contrario del texto de la dirección
  norte.add(reja(-70, -20.5, 151), reja(20.5, 70, 151));
  const alaS = edificio({ w: 30, h: 16, d: 100, ladrillo: C.ladrilloArco, paneles: 2, paso: 3.6 }); alaS.position.set(32, 0, 92.5); norte.add(alaS);
  const alaN = edificio({ w: 30, h: 16, d: 100, ladrillo: C.ladrilloArco, paneles: 2, paso: 3.6 }); alaN.position.set(-32, 0, 92.5); norte.add(alaN);
  const arco = arcoCentral(); arco.position.set(0, 0, 76); norte.add(arco);
  const pq1 = parqueaderoSolar(4, 30); pq1.position.set(70, 0, 60); norte.add(pq1);
  // jardineras de buganvilla y matas moradas contra los muros de las alas, a los lados del pasillo de entrada
  const camas = new THREE.Group(), rc = semilla(55);
  for (const sx of [-1, 1]) for (let z = 96; z <= 140; z += 4.5) {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1 + rc() * 0.5, 1), std(["#C2297A", "#8A3C66", "#D83A8C", "#6B2D45"][Math.floor(rc() * 4)]));
    m.position.set(sx * (15.2 + rc() * 0.8), 0.7, z + rc() * 2); m.scale.y = 0.7; camas.add(m);
  }
  fusionar(camas); norte.add(camas);

  // ---- UAO Labs (sótano, a nivel del Ágora): fachada de ladrillo con vidrio y el letrero, y a los lados las gradas (adentro) y las rampas (afuera)
  const labs = new THREE.Group();
  labs.add(caja(12.4, 0.5, 0.9, matConcreto, 0, 2.9, 41.6));                          // dintel
  labs.add(caja(11.4, 2.5, 0.25, matVidrio, 0, 1.45, 41.8));                          // vidrio oscuro
  for (let i = -2; i <= 2; i++) labs.add(caja(0.14, 2.5, 0.3, matMarco, i * 2.5, 1.45, 41.7));
  const lt = rotulo(6.4, 1.15, 512, 92, (c, W, H) => { logoUao(c, 8, 6, H * 0.8, C.blanco); c.fillStyle = C.blanco; c.font = `700 ${H * 0.78}px Arial, Helvetica, sans-serif`; c.textBaseline = "middle"; c.fillText("Labs", W * 0.5, H * 0.5); });
  lt.rotation.y = Math.PI; lt.position.set(0, 3.6, 41.55); labs.add(lt);
  for (const sx of [-1, 1]) {
    // gradas HORIZONTALES (de lado a lado): bajan desde la rampa hacia el centro, donde está la entrada de Labs; son macizas (ladrillo con huella de concreto)
    const gradas = new THREE.Group(), N = 12, huella = 0.53, ladr = std(C.ladrilloArco);
    for (let k = 0; k < N; k++) {
      const top = YT - (k + 1) * (YT / N), x = sx * (12.6 - (k + 0.5) * huella);
      gradas.add(caja(huella, top, 6, ladr, x, top / 2, 39), caja(huella + 0.04, 0.1, 6.04, matConcreto, x, top + 0.05, 39));
    }
    fusionar(gradas); labs.add(gradas);
    // rampa larga que baja hacia las aulas: cuña MACIZA de ladrillo (no queda hueca por debajo) con la losa de concreto y los bordes encima
    const perfil = new THREE.Shape(); perfil.moveTo(0, 0); perfil.lineTo(0, YT); perfil.lineTo(18, 0); perfil.closePath();
    const cuna = new THREE.Mesh(new THREE.ExtrudeGeometry(perfil, { depth: 3.4, bevelEnabled: false }).translate(0, 0, -1.7).rotateY(Math.PI / 2), ladr);
    cuna.position.set(sx * 14.5, 0, 42); labs.add(cuna);
    const rampa = new THREE.Group(), L = Math.hypot(18, YT);
    rampa.add(caja(3.4, 0.35, L, std("#BDB3A2"), 0, -0.17, 0), caja(0.3, 0.8, L, ladr, -1.55, 0.2, 0), caja(0.3, 0.8, L, ladr, 1.55, 0.2, 0));
    rampa.rotation.x = -Math.atan2(YT, 18); rampa.position.set(sx * 14.5, YT / 2, 33); fusionar(rampa); labs.add(rampa);
  }
  g.add(labs);

  // ---- el resto del campus (nivel bajo)
  const caminos = [
    [0, 34, 30, 16], [0, 22, 9, 8],                                                  // explanada al pie de UAO Labs y sendero que baja al Ágora
    [0, -100, 7, 180],                                                                // eje entre Aulas 2 y 3, hasta la Portería 3
    [38, -50, 5, 120], [-40, -108, 5, 110], [-12, -26, 100, 5], [34, 0, 24, 5],       // pasos entre aulas, enlace al norte de las aulas, entrada a Aulas 1
    [-12, -146, 90, 5], [28, -134, 52, 24], [-4, -202, 36, 14], [-4, -266, 5, 108]    // frente de la cafetería, plazoleta de la Portería 3 y sendero recto hacia el parqueadero
  ];
  caminos.forEach(([x, z, w, d]) => baldosa(g, x, z, w, d));
  calle(g, 300, 12, 0, -214); calle(g, 7, 420, 96, -20);                              // calle de la Portería 3 y vía lateral junto a las canchas
  const p3 = porteria({ ancho: 26, numero: "3", caseta: true }); p3.position.set(-4, 0, -196); p3.rotation.y = Math.PI; g.add(p3);
  const ag = agora(); ag.position.set(AG.x, 0, AG.z); g.add(ag);                      // Ágora (círculo con gradas)
  // aulas (4 pisos todas): 1 a la derecha y más cerca del Ágora, 2 al frente, 3 a la izquierda y 4 más lejos
  const AU = [["AULAS 1", 22, 70, 56, -22], ["AULAS 2", 22, 52, 20, -79], ["AULAS 3", 22, 70, -22, -113], ["AULAS 4", 22, 48, -59, -139]];
  AU.forEach(([nombre, w, d, x, z]) => {
    const e = edificio({ w, h: 16, d, paneles: 2, caras: [1, 2, 3] }); e.position.set(x, 0, z); g.add(e);
    const r = rotulo(11, 2.2, 512, 100, dibujarTexto([nombre], C.blanco, 800, "#2B6F63")); r.position.set(x, 11.5, z + d / 2 + 0.06); g.add(r);
  });
  // cafetería: ala larga paralela a Aulas 1, bloque con techo a cuatro aguas junto a la Portería 3, y las mesas de metal
  const caf = new THREE.Group();
  const ala = edificio({ w: 24, h: 12, d: 64, paneles: 2, caras: [0, 1, 2, 3], pisos: 3 }); ala.position.set(58, 0, -150); caf.add(ala);
  const bloqueCaf = edificio({ w: 44, h: 12, d: 40, techo: "piramide", caras: [1, 2, 3], pisos: 3 }); bloqueCaf.position.set(28, 0, -168); caf.add(bloqueCaf);
  const letrero = rotulo(11, 2.2, 512, 100, dibujarTexto(["CAFETERÍA"], C.blanco, 800, "#2B6F63")); letrero.position.set(28, 8.5, -147.9); caf.add(letrero);
  caf.add(mesasCafeteria(9, -141, 3, 6, 5.6, 6.5));                                     // mesas de metal con dos sillas a cada lado, frente a la cafetería
  g.add(caf);
  // lago (entre Aulas 1/2 y la cafetería), estanque con fuente cerca del Ágora y otro estanque junto a Aulas 3/4
  const lg = lago(animar, 10, 8.5); lg.position.set(52, 0, -97); g.add(lg);
  const e1 = lago(animar, 5, 5, { seed: 31 }); e1.position.set(31, 0, -21); g.add(e1);
  const e2 = lago(animar, 6.5, 5, { fuente: false, seed: 41 }); e2.position.set(-58, 0, -86); g.add(e2);
  // alrededor del lago: árboles frondosos (fuera del camino de la cámara), piedras grandes de decoración y dos bancas mirando al agua
  const orilla = new THREE.Group(), rl = semilla(612), hojasL = ["#3F7A36", "#4F8F3E", "#5BA04A", "#356B30"].map(c => std(c)), maderaL = std("#6A4A2E");
  for (const [x, z, esc] of [[68, -101, 2.3], [64, -112, 1.9], [71, -86, 2.1], [58, -80, 2], [44, -109, 2.2], [75, -96, 1.8], [40, -84, 1.9], [47, -76, 1.8], [80, -108, 2], [78, -78, 2.1]]) {
    if (!evitar.every(([cx, cz, r]) => Math.hypot(x - cx, z - cz) > r)) continue;
    const t = crearArbol(rl, hojasL, maderaL); t.position.set(x, 0, z); t.rotation.y = rl() * 6.28; t.scale.setScalar(esc); orilla.add(t);
  }
  const grises = ["#8A8578", "#7E7A6E", "#9A958A", "#6F6B60"];
  for (let i = 0; i < 16; i++) {
    const a = rl() * 6.283 + i * 0.4, k = 1.22 + rl() * 0.35, r = 0.7 + rl() * 1.1;
    const p = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), std(grises[i % 4])); p.position.set(52 + Math.cos(a) * 10 * k, r * 0.35, -97 + Math.sin(a) * 8.5 * k); p.scale.set(1, 0.7, 1.1); p.rotation.y = rl() * 3; orilla.add(p);
  }
  const banca = (x, z, giro) => {
    const b = new THREE.Group(), madera = std("#8A5A34"), metal = std("#3C4145");
    b.add(caja(1.9, 0.1, 0.55, madera, 0, 0.5, 0), caja(1.9, 0.5, 0.08, madera, 0, 0.85, -0.25), caja(0.08, 0.5, 0.5, metal, -0.85, 0.25, 0), caja(0.08, 0.5, 0.5, metal, 0.85, 0.25, 0), caja(0.08, 0.9, 0.08, metal, -0.85, 0.7, -0.25), caja(0.08, 0.9, 0.08, metal, 0.85, 0.7, -0.25));
    b.position.set(x, 0, z); b.rotation.y = giro; b.scale.setScalar(1.4); orilla.add(b);
  };
  banca(65.5, -97, -Math.PI / 2); banca(52, -85.2, Math.PI);                              // una al este y otra al norte del lago, de cara al agua
  fusionar(orilla); g.add(orilla);
  const pq2 = parqueaderoSolar(3, 30); pq2.rotation.y = Math.PI / 2; pq2.position.set(-60, 0, -10); g.add(pq2);
  const cn = canchas(); cn.position.set(132, 0, -50); g.add(cn);
  g.add(parqueSur());
  // vegetación: nada de árboles encima de edificios, caminos, Ágora, lagos, canchas, parqueadero ni calles
  const rect = (x, z, cx, cz, hw, hd) => Math.abs(x - cx) < hw && Math.abs(z - cz) < hd;
  const zonas = [
    (x, z) => rect(x, z, 32, 92.5, 18, 53), (x, z) => rect(x, z, -32, 92.5, 18, 53), (x, z) => rect(x, z, 0, 76, 20, 11),
    (x, z) => rect(x, z, 0, 117, 5, 40), (x, z) => rect(x, z, 0, 56, 20, 15), (x, z) => rect(x, z, 0, 34, 20, 12), (x, z) => rect(x, z, 0, 150, 24, 12),
    (x, z) => Math.hypot(x - AG.x, z - AG.z) < 29, (x, z) => rect(x, z, 0, -100, 5, 92), (x, z) => rect(x, z, 38, -50, 4, 62), (x, z) => rect(x, z, -40, -108, 4, 56),
    (x, z) => rect(x, z, -12, -26, 50, 4), (x, z) => rect(x, z, 34, 0, 12, 4), (x, z) => rect(x, z, -12, -146, 45, 4),
    (x, z) => rect(x, z, 56, -22, 13, 36), (x, z) => rect(x, z, 20, -79, 13, 28), (x, z) => rect(x, z, -22, -113, 13, 36), (x, z) => rect(x, z, -59, -139, 13, 26),
    (x, z) => rect(x, z, 58, -150, 14, 34), (x, z) => rect(x, z, 28, -168, 24, 22), (x, z) => rect(x, z, 28, -134, 27, 17), (x, z) => rect(x, z, -4, -202, 19, 9),
    (x, z) => Math.hypot((x - 52) / 25, (z + 97) / 22) < 1, (x, z) => Math.hypot(x - 31, z + 21) < 8, (x, z) => Math.hypot((x + 58) / 9, (z + 86) / 8) < 1,
    (x, z) => rect(x, z, 70, 60, 17, 20), (x, z) => rect(x, z, -60, -10, 8, 17),
    (x, z) => rect(x, z, 132, -50, 36, 66), (x, z) => rect(x, z, 0, 170, 160, 9), (x, z) => rect(x, z, 0, -214, 160, 8), (x, z) => rect(x, z, 96, -20, 5, 215),
    (x, z) => rect(x, z, 0, -258, 52, 38), (x, z) => rect(x, z, -4, -300, 4, 75), (x, z) => rect(x, z, 0, -331, 55, 25),      // parque de canchas, sendero y parqueadero
    (x, z) => rect(x, z, 0, 36, 20, 8)                                                                                  // gradas y rampas de Labs
  ];
  g.add(vegetacion((x, z) => zonas.every(f => !f(x, z)) && evitar.every(([cx, cz, r]) => Math.hypot(x - cx, z - cz) > r), { r: 27, z: AG.z }));
  g.userData.animar = t => animar.forEach(f => f(t));
  return g;
}
