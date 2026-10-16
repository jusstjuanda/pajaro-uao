// Aves 3D generadas por código (three.js), con plumas, escamas del pecho, ojos con aro, fosas nasales y dedos; con animaciones.
// Ejes locales: el ave mira hacia +Z, arriba es +Y. El origen es el punto donde se posa.
import * as THREE from "three";
import { fusionar } from "./fusion.js";

const geoCache = {};
function geo(key, make) { return geoCache[key] || (geoCache[key] = make()); }
const matCache = {};
function mat(color, extra = {}) {
  const key = color + JSON.stringify(extra);
  if (!matCache[key]) matCache[key] = new THREE.MeshStandardMaterial({ color, flatShading: false, roughness: 0.6, metalness: 0.0, ...extra });
  return matCache[key];
}
// tono más claro (k > 1) o más oscuro (k < 1) de un color
const tono = (c, k) => "#" + new THREE.Color(c).multiplyScalar(k).getHexString();
const esfera = () => geo("esfera", () => new THREE.SphereGeometry(0.5, 22, 16));
const icosa = () => geo("icosa", () => new THREE.IcosahedronGeometry(0.5, 1));
const cil = () => geo("cil", () => new THREE.CylinderGeometry(0.5, 0.5, 1, 10));
const cono = () => geo("cono", () => new THREE.ConeGeometry(0.5, 1, 10));
const caja = () => geo("caja", () => new THREE.BoxGeometry(1, 1, 1));

function pieza(geometria, material, pos, escala, rot) {
  const m = new THREE.Mesh(geometria, material);
  if (pos) m.position.set(...pos);
  if (escala) m.scale.set(...escala);
  if (rot) m.rotation.set(...rot);
  m.castShadow = true;
  return m;
}

function texturaBarras(c1, c2) {
  const cv = document.createElement("canvas");
  cv.width = 64; cv.height = 64;
  const g = cv.getContext("2d");
  g.fillStyle = c2; g.fillRect(0, 0, 64, 64);
  g.fillStyle = c1;
  for (let y = 0; y < 64; y += 16) g.fillRect(0, y, 64, 8);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 2);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// --------------------------------------------------------------- pico
function pico(tipo, color) {
  const g = new THREE.Group();
  const m = mat(color);
  const sup = new THREE.Group(), inf = new THREE.Group();
  let largo = 0.32, ancho = 0.16, alto = 0.12;
  if (tipo === "conico") { largo = 0.24; ancho = 0.2; alto = 0.18; }
  if (tipo === "largo") { largo = 0.75; ancho = 0.05; alto = 0.05; }
  if (tipo === "daga") { largo = 0.6; ancho = 0.08; alto = 0.07; }
  if (tipo === "cincel") { largo = 0.42; ancho = 0.12; alto = 0.1; }
  if (tipo === "curvo") { largo = 0.34; ancho = 0.12; alto = 0.3; }
  if (tipo === "gancho") {
    const arco = pieza(geo("gancho", () => new THREE.TorusGeometry(0.13, 0.07, 6, 10, Math.PI * 0.95)), m, [0, -0.02, 0.02], [1, 1, 1], [0, Math.PI / 2, 0]);
    arco.rotation.set(0, -Math.PI / 2, Math.PI * 0.05);
    sup.add(arco);
    inf.add(pieza(cono(), mat("#6b6253"), [0, -0.08, 0.08], [0.12, 0.12, 0.12], [Math.PI / 2, 0, 0]));
  } else {
    const c = pieza(cono(), m, [0, 0, largo / 2], [ancho, largo, alto * (tipo === "curvo" ? 0.9 : 1)], [Math.PI / 2, 0, 0]);
    if (tipo === "curvo") c.rotation.x = Math.PI / 2 + 0.25;
    sup.add(c);
    const c2 = pieza(cono(), m, [0, -alto * 0.32, largo * 0.42], [ancho * 0.8, largo * 0.85, alto * 0.5], [Math.PI / 2, 0, 0]);
    inf.add(c2);
  }
  if (tipo !== "gancho") for (const s of [-1, 1]) sup.add(pieza(esfera(), mat("#17120f"), [s * ancho * 0.2, alto * 0.22, largo * 0.2], [0.028, 0.02, 0.05]));   // fosas nasales
  fusionar(sup, { profundo: false, plano: false, rugosidad: 0.6 }); fusionar(inf, { profundo: false, plano: false, rugosidad: 0.6 });
  g.add(sup, inf);
  g.userData.inferior = inf;
  return g;
}

// --------------------------------------------------------------- cabeza
function cabeza(e, radio = 0.34) {
  const c = e.colores;
  const h = new THREE.Group();
  h.add(pieza(esfera(), mat(c.cabeza), [0, 0, 0], [radio * 2, radio * 2, radio * 2.1]));
  if (e.extras.garganta) h.add(pieza(esfera(), mat(e.extras.garganta), [0, -radio * 0.45, radio * 0.45], [radio * 1.3, radio * 1.0, radio * 1.1]));
  if (e.extras.corona) h.add(pieza(esfera(), mat(e.extras.corona), [0, radio * 0.62, -radio * 0.05], [radio * 1.45, radio * 0.7, radio * 1.6]));
  if (e.extras.nuca) h.add(pieza(esfera(), mat(e.extras.nuca), [0, radio * 0.35, -radio * 0.55], [radio * 1.5, radio * 1.1, radio * 1.0]));
  if (e.extras.antifaz) h.add(pieza(esfera(), mat(e.extras.antifaz), [0, radio * 0.1, radio * 0.12], [radio * 2.08, radio * 0.55, radio * 1.6]));
  if (e.extras.ceja) {
    for (const s of [-1, 1]) h.add(pieza(esfera(), mat(e.extras.ceja), [s * radio * 0.72, radio * 0.33, radio * 0.05], [radio * 0.35, radio * 0.28, radio * 1.6], [0.2, 0, 0]));
  }
  if (e.extras.cara) h.add(pieza(esfera(), mat(e.extras.cara), [0, 0, radio * 0.55], [radio * 1.6, radio * 1.3, radio * 0.9]));
  for (const s of [-1, 1]) {
    h.add(pieza(esfera(), mat(e.colores.ojoAro || "#d8cfb8", { roughness: 0.5 }), [s * radio * 0.76, radio * 0.12, radio * 0.4], [radio * 0.46, radio * 0.46, radio * 0.3]));   // aro claro del ojo
    h.add(pieza(esfera(), mat(e.colores.ojo || "#0d0b0a", { roughness: 0.12, metalness: 0.2 }), [s * radio * 0.82, radio * 0.12, radio * 0.45], [radio * 0.32, radio * 0.32, radio * 0.28]));
    h.add(pieza(esfera(), mat("#ffffff", { emissive: "#ffffff", emissiveIntensity: 0.8 }), [s * radio * 0.92, radio * 0.21, radio * 0.56], [radio * 0.1, radio * 0.1, radio * 0.08]));
  }
  if (e.extras.copete) {
    const cp = pieza(cono(), mat(e.extras.copete), [0, radio * 0.9, -radio * 0.5], [radio * 0.25, radio * 1.4, radio * 0.25], [-1.1, 0, 0]);
    h.add(cp);
  }
  const p = pico(e.pico, c.pico);
  p.position.set(0, -radio * 0.05, radio * 0.86);
  h.add(p);
  h.userData.pico = p;
  fusionar(h, { profundo: false, plano: false, rugosidad: 0.6 });
  return h;
}

// --------------------------------------------------------------- cola y alas
function cola(e) {
  const c = new THREE.Group();
  const m = mat(e.colores.cola);
  const f = e.extras.colaForma || "normal";
  if (f === "horquilla") {
    for (const s of [-1, 1]) c.add(pieza(caja(), m, [s * 0.09, 0, -0.42], [0.13, 0.04, 0.85], [0, s * 0.18, 0]));
  } else {
    // abanico de plumas (en vez de una sola lámina)
    const [largo, ancho, n] = f === "larga" ? [1.3, 0.34, 7] : f === "corta" ? [0.45, 0.34, 5] : [0.75, 0.36, 7];
    for (let i = 0; i < n; i++) {
      const t = i - (n - 1) / 2;
      c.add(pieza(esfera(), mat(tono(e.colores.cola, 1 - Math.abs(t) * 0.045)), [t * ancho / n * 0.95, -Math.abs(t) * 0.004, -largo / 2 + Math.abs(t) * 0.025], [ancho / n * 1.7, 0.035, largo * (1 - Math.abs(t) * 0.025)], [0, t * 0.07, 0]));
    }
  }
  if (e.extras.bajoCola) c.add(pieza(caja(), mat(e.extras.bajoCola), [0, -0.04, -0.15], [0.28, 0.04, 0.35]));
  fusionar(c, { profundo: false, plano: false, rugosidad: 0.6 });
  return c;
}

function ala(e, lado) {
  const pivote = new THREE.Group();
  const forma = new THREE.Group();
  forma.add(pieza(esfera(), mat(e.colores.ala), [0, 0, -0.3], [0.1, 0.62, 1.05]));
  forma.add(pieza(esfera(), mat(e.extras.puntaAla || e.colores.cola), [0, -0.05, -0.75], [0.08, 0.36, 0.55]));
  if (e.extras.hombro) forma.add(pieza(esfera(), mat(e.extras.hombro), [0.01, 0.12, 0.05], [0.11, 0.36, 0.42]));
  // plumas: coberteras (hileras superpuestas) y primarias en abanico hacia atrás
  for (let r = 0; r < 3; r++) forma.add(pieza(esfera(), mat(tono(e.colores.ala, 0.92 + r * 0.06)), [0.045, 0.2 - r * 0.15, -0.12 - r * 0.28], [0.07, 0.3 - r * 0.03, 0.4], [0, 0, 0]));
  for (let i = 0; i < 5; i++) forma.add(pieza(esfera(), mat(tono(e.extras.puntaAla || e.colores.cola, 0.8 + i * 0.05)), [0.02, -0.2 + i * 0.1, -0.98 + Math.abs(i - 2) * 0.07], [0.04, 0.1, 0.62 - Math.abs(i - 2) * 0.07], [(i - 2) * 0.06, 0, 0]));
  pivote.add(forma);
  pivote.userData.lado = lado;
  fusionar(forma, { profundo: false, plano: false, rugosidad: 0.6 });
  return pivote;
}

// --------------------------------------------------------------- soportes
function rama() {
  const g = new THREE.Group();
  const madera = mat("#6b4a2e");
  g.add(pieza(cil(), madera, [0, -0.06, 0], [0.12, 2.6, 0.12], [0, 0, Math.PI / 2]));
  g.add(pieza(cil(), madera, [0.75, 0.2, 0.05], [0.07, 0.8, 0.07], [0, 0, -0.9]));
  for (const [x, y, z, s] of [[-1.3, 0.05, 0, 0.6], [1.15, 0.5, 0.1, 0.55], [-0.95, 0.25, 0.25, 0.4], [1.35, 0.1, -0.2, 0.45]])
    g.add(pieza(icosa(), mat(["#4f8a3a", "#5f9c45", "#3f7533"][Math.floor(Math.abs(x * 7)) % 3]), [x, y, z], [s, s * 0.8, s]));
  fusionar(g);
  return g;
}
function pasto() {
  const g = new THREE.Group();
  g.add(pieza(cil(), mat("#5f9440"), [0, -0.05, 0], [2.6, 0.1, 2.6]));
  for (let i = 0; i < 26; i++) {
    const a = i * 2.4, r = 0.3 + (i % 5) * 0.22;
    g.add(pieza(cono(), mat(i % 2 ? "#6fa64a" : "#4e8233"), [Math.cos(a) * r, 0.1, Math.sin(a) * r], [0.07, 0.3 + (i % 3) * 0.1, 0.07]));
  }
  fusionar(g);
  return g;
}
function agua() {
  const g = new THREE.Group();
  g.add(pieza(cil(), mat("#8a7a58"), [0, -0.07, 0], [6, 0.05, 6]));        // orilla de barro
  g.add(pieza(cil(), mat("#4f8fa8", { roughness: 0.15, metalness: 0.1 }), [0, -0.04, 0], [5.2, 0.06, 5.2]));
  const onda = (radio, nombre) => pieza(geo(nombre, () => new THREE.TorusGeometry(radio, 0.02, 4, 28)), mat("#d6eef5"), [0, 0.0, 0], null, [Math.PI / 2, 0, 0]);
  g.add(onda(0.9, "anillo"), onda(1.7, "anillo-grande"));
  for (const [x, z] of [[-2, 0.9], [2.05, -0.9], [-1.2, -1.9], [1.4, 1.8], [0.2, -2.25]]) g.add(pieza(cil(), mat("#5e8f3c"), [x, 0.3, z], [0.05, 0.7, 0.05]));
  fusionar(g);
  return g;
}
function flor() {
  const g = new THREE.Group();
  g.add(pieza(cil(), mat("#3e7a34"), [0, -0.9, 0], [0.06, 2.0, 0.06]));
  const petalo = mat("#e0412e");
  g.add(pieza(cono(), petalo, [0, 0.1, 0], [0.3, 0.5, 0.3], [Math.PI, 0, 0]));
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2;
    g.add(pieza(esfera(), petalo, [Math.cos(a) * 0.22, -0.12, Math.sin(a) * 0.22], [0.25, 0.12, 0.35], [0, -a, 0]));
  }
  g.add(pieza(esfera(), mat("#f2c230"), [0, 0.2, 0], [0.1, 0.1, 0.1]));
  for (const s of [-1, 1]) g.add(pieza(esfera(), mat("#4e8f3c"), [s * 0.35, -1.1, 0], [0.5, 0.08, 0.25], [0, 0, s * 0.5]));
  fusionar(g);
  return g;
}
function tronco() {
  const g = new THREE.Group();
  g.add(pieza(cil(), mat("#6a4a30"), [0, 0.5, 0.52], [0.36, 2.6, 0.36]));
  for (let i = 0; i < 5; i++) g.add(pieza(caja(), mat("#4f3622"), [Math.sin(i) * 0.1, -0.5 + i * 0.45, 0.35], [0.03, 0.3, 0.03]));
  g.add(pieza(cil(), mat("#6a4a30"), [0.35, 1.2, 0.52], [0.12, 0.8, 0.12], [0, 0, -0.9]));
  g.add(pieza(icosa(), mat("#4f8a3a"), [0.75, 1.5, 0.52], [0.5, 0.4, 0.5]));
  fusionar(g);
  return g;
}

// Soporte de la especie (rama, pasto, agua, flor o tronco), en las mismas unidades que el ave:
// se coloca en el punto y con la orientación donde el ave se posa.
export function crearSoporte(e) {
  if (e.soporte === "rama") return rama();
  if (e.soporte === "pasto") return pasto();
  if (e.soporte === "agua") return agua();
  if (e.soporte === "flor") { const f = flor(); f.position.set(0, 0.45, 1.05); return f; }
  if (e.soporte === "tronco") return tronco();
  return null;
}

// --------------------------------------------------------------- ave completa
// conSoporte: la galería 3D la dibuja con su rama; la RA la pide sin soporte y lo coloca aparte en el mundo.
export function crearAve(e, conSoporte = true) {
  const raiz = new THREE.Group();
  raiz.name = e.id;
  const ave = new THREE.Group();          // se anima (saltos, vuelo)
  raiz.add(ave);
  const c = e.colores;
  const tipo = e.tipo;
  const cuerpo = new THREE.Group();
  ave.add(cuerpo);
  let alturaCuerpo = 0.55, inclinacion = -0.45, radioCabeza = 0.34, cuelloY = 0.42, cuelloZ = 0.5;
  if (tipo === "pellar") { alturaCuerpo = 1.15; inclinacion = -0.12; }
  if (tipo === "garza") { alturaCuerpo = 1.4; inclinacion = -0.2; radioCabeza = 0.22; }
  if (tipo === "colibri") { alturaCuerpo = 0.0; inclinacion = -0.55; radioCabeza = 0.26; }
  if (tipo === "carpintero") { alturaCuerpo = 0.1; inclinacion = -1.25; }
  if (tipo === "loro") { radioCabeza = 0.42; inclinacion = -0.6; }
  cuerpo.position.y = alturaCuerpo;
  cuerpo.rotation.x = inclinacion;

  // tronco del ave
  const espalda = e.extras.barras ? new THREE.MeshStandardMaterial({ map: texturaBarras("#141414", "#f2eee4"), flatShading: true, roughness: 0.8 }) : mat(c.espalda);
  const escalaCuerpo = tipo === "colibri" ? [0.5, 0.5, 0.95] : tipo === "loro" ? [0.95, 1.0, 1.15] : [0.85, 0.9, 1.25];
  cuerpo.add(pieza(esfera(), espalda, [0, 0, 0], escalaCuerpo));
  cuerpo.add(pieza(esfera(), mat(c.vientre), [0, -0.1, 0.1], escalaCuerpo.map((v, i) => v * [0.9, 0.85, 0.85][i])));
  if (e.extras.pecho) cuerpo.add(pieza(esfera(), mat(e.extras.pecho), [0, 0.02, 0.38], [0.72, 0.62, 0.38]));
  // plumaje del pecho: hileras de escamitas (plumas) sobre el vientre
  {
    const rx = escalaCuerpo[0] * 0.9 * 0.5, ry = escalaCuerpo[1] * 0.85 * 0.5, rz = escalaCuerpo[2] * 0.85 * 0.5;
    const base = e.extras.pecho || c.vientre, cero = new THREE.Vector3(0, 0, 1);
    for (let fila = 0; fila < 4; fila++) for (let k = -2; k <= 2; k++) {
      const lon = k * 0.42 + (fila % 2) * 0.21, lat = 0.15 + fila * 0.26;
      const n = new THREE.Vector3(Math.cos(lat) * Math.sin(lon) / rx, -Math.sin(lat) / ry, Math.cos(lat) * Math.cos(lon) / rz).normalize();
      const p = new THREE.Vector3(rx * Math.cos(lat) * Math.sin(lon), -0.1 - ry * Math.sin(lat), 0.1 + rz * Math.cos(lat) * Math.cos(lon));
      const esc = pieza(esfera(), mat(tono(base, (fila + k) % 2 ? 1.07 : 0.94)), p.toArray(), [0.16, 0.1, 0.05]);
      esc.quaternion.setFromUnitVectors(cero, n);
      cuerpo.add(esc);
    }
  }

  // cuello largo de la garza
  const cabezaPivote = new THREE.Group();
  if (tipo === "garza") {
    const blanco = mat(c.cabeza);
    const curva = new THREE.CatmullRomCurve3([[0, 0.05, 0.38], [0, 0.4, 0.62], [0, 0.78, 0.5], [0, 1.08, 0.6], [0, 1.25, 0.72]].map(p => new THREE.Vector3(...p)));
    const cuello = new THREE.Mesh(geo("cuello", () => new THREE.TubeGeometry(curva, 20, 0.1, 7, false)), blanco);
    cuerpo.add(cuello);
    cabezaPivote.position.set(0, 1.25, 0.72);
    cabezaPivote.rotation.x = -inclinacion;
  } else {
    cabezaPivote.position.set(0, cuelloY, cuelloZ);
    cabezaPivote.rotation.x = -inclinacion * 0.85;
  }
  cuerpo.add(cabezaPivote);
  const cab = cabeza(e, radioCabeza);
  cabezaPivote.add(cab);

  // alas y cola
  const alas = [ala(e, -1), ala(e, 1)];
  const anchoAla = tipo === "colibri" ? 0.24 : 0.4;
  alas.forEach(a => {
    a.position.set(a.userData.lado * anchoAla, 0.12, 0.2);
    if (tipo === "colibri") a.scale.set(0.8, 0.7, 0.9);
    cuerpo.add(a);
  });
  const colaPivote = new THREE.Group();
  colaPivote.position.set(0, -0.05, -0.55);
  colaPivote.rotation.x = tipo === "carpintero" ? 0.5 : 0.25;
  colaPivote.add(cola(e));
  cuerpo.add(colaPivote);

  // patas
  if (tipo !== "colibri") {
    const largoPata = tipo === "pellar" ? 1.0 : tipo === "garza" ? 1.25 : 0.32;
    for (const s of [-1, 1]) {
      const pata = pieza(cil(), mat(c.patas || "#3b302a"), [s * 0.14, largoPata / 2, tipo === "carpintero" ? 0.12 : 0.05], [0.05, largoPata, 0.05]);
      ave.add(pata);
      for (const t of [-1, 0, 1]) ave.add(pieza(cil(), mat(c.patas || "#3b302a"), [s * 0.14 + t * 0.05, 0.02, 0.13], [0.028, 0.24, 0.028], [Math.PI / 2, 0, t * 0.4]));   // dedos
      ave.add(pieza(cil(), mat(c.patas || "#3b302a"), [s * 0.14, 0.02, -0.04], [0.028, 0.1, 0.028], [Math.PI / 2, 0, 0]));                                          // dedo de atrás
    }
  }

  fusionar(cuerpo, { profundo: false, plano: false, rugosidad: 0.6 });   // menos objetos por cuadro: las piezas quietas de cada parte se unen en una sola malla
  fusionar(ave, { profundo: false, plano: false, rugosidad: 0.6 });         // patas y dedos
  const soporte = conSoporte ? crearSoporte(e) : null;
  if (soporte) raiz.add(soporte);

  // zona invisible para tocar / apuntar
  const zona = new THREE.Mesh(geo("zona", () => new THREE.SphereGeometry(1, 8, 6)), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  zona.scale.setScalar(tipo === "garza" ? 1.6 : 1.15);
  zona.position.y = tipo === "garza" ? 1.4 : tipo === "pellar" ? 1.1 : 0.6;
  zona.userData.especie = e.id;
  raiz.add(zona);

  raiz.scale.setScalar(e.escala || 0.4);
  raiz.userData = {
    especie: e.id, ave, cuerpo, cabeza: cabezaPivote, pico: cab.userData.pico, alas, cola: colaPivote, zona, soporte, tipo,
    inclinacion, mirar: new THREE.Vector2(), mirarObj: new THREE.Vector2(), proxMirada: 0, cantarHasta: 0, aletearHasta: 0,
    salto: 0, colaHasta: 0, celebrarHasta: 0, semilla: Math.random() * 100
  };
  return raiz;
}

// --------------------------------------------------------------- animación
export function animarAve(r, t, dt) {
  const u = r.userData;
  const s = u.semilla;
  // respiración
  const resp = 1 + Math.sin(t * 3 + s) * 0.025;
  u.cuerpo.scale.set(resp, resp, 1);
  // mirar alrededor
  if (t > u.proxMirada) {
    u.mirarObj.set((Math.random() - 0.5) * 1.6, (Math.random() - 0.4) * 0.5);
    u.proxMirada = t + 1.2 + Math.random() * 2.5;
  }
  u.mirar.lerp(u.mirarObj, Math.min(1, dt * 6));
  const cantando = t < u.cantarHasta;
  u.cabeza.rotation.y = cantando ? Math.sin(t * 2) * 0.15 : u.mirar.x;
  u.cabeza.rotation.z = cantando ? 0 : u.mirar.x * 0.25;
  const baseCab = -u.inclinacion * (u.tipo === "garza" ? 1 : 0.85);
  u.cabeza.rotation.x = baseCab + (cantando ? -0.35 : u.mirar.y);
  // pico al cantar
  const inf = u.pico.userData.inferior;
  inf.rotation.x = cantando ? 0.35 * Math.abs(Math.sin(t * 22)) : 0;
  // cola
  if (Math.random() < dt * 0.25) u.colaHasta = t + 0.25;
  const colaBase = u.tipo === "carpintero" ? 0.5 : 0.25;
  u.cola.rotation.x = colaBase + (t < u.colaHasta ? -0.4 * Math.sin((u.colaHasta - t) * 12) : 0);
  // alas
  const aleteando = u.tipo === "colibri" || t < u.aletearHasta;
  u.alas.forEach(a => {
    const lado = a.userData.lado;
    if (aleteando) {
      const f = u.tipo === "colibri" ? 38 : 13;
      a.rotation.z = lado * (1.1 + Math.sin(t * f) * 0.8);
      a.rotation.x = u.tipo === "colibri" ? 0.6 : 0.2;
    } else {
      a.rotation.z = lado * 0.08;
      a.rotation.x = 0;
    }
  });
  // vuelo estacionario del colibrí
  if (u.tipo === "colibri") u.ave.position.y = 0.55 + Math.sin(t * 2.5 + s) * 0.08;
  // saltos y celebración
  if (t < u.celebrarHasta) {
    const k = (u.celebrarHasta - t);
    u.ave.position.y = Math.abs(Math.sin(k * 9)) * 0.45 + (u.tipo === "colibri" ? 0.55 : 0);
    u.ave.rotation.y += dt * 6;
  } else if (u.tipo !== "colibri") {
    u.ave.position.y = Math.max(0, u.ave.position.y - dt * 3);
    u.ave.rotation.y *= 0.9;
  }
}

export function cantar(r, t, dur = 1.2) {
  r.userData.cantarHasta = t + dur;
}
export function aletear(r, t, dur = 0.8) {
  r.userData.aletearHasta = t + dur;
}
export function celebrar(r, t) {
  r.userData.celebrarHasta = t + 1.4;
  r.userData.aletearHasta = t + 1.4;
}

// --------------------------------------------------------------- etiqueta flotante
// El texto puede llevar saltos de línea («\n»): cada renglón es una fila de la etiqueta. Si un renglón no cabe en el ancho,
// se achica su letra hasta que quepa (antes el texto largo se cortaba en los bordes de la etiqueta).
export function etiqueta(texto, color = "#F2A541") {
  const lineas = String(texto).split("\n");
  const cv = document.createElement("canvas");
  cv.width = 512; cv.height = 128 + (lineas.length - 1) * 60;
  const g = cv.getContext("2d");
  g.fillStyle = "rgba(14,38,33,.85)";
  g.beginPath(); g.roundRect(8, 20, 496, cv.height - 40, 44); g.fill();
  g.strokeStyle = color; g.lineWidth = 5; g.stroke();
  g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle";
  lineas.forEach((l, i) => {
    let px = 46;
    g.font = `600 ${px}px Inter, system-ui, sans-serif`;
    const ancho = g.measureText(l).width;
    if (ancho > 440) { px = Math.max(24, Math.floor(px * 440 / ancho)); g.font = `600 ${px}px Inter, system-ui, sans-serif`; }
    g.fillText(l, 256, cv.height / 2 + (i - (lineas.length - 1) / 2) * 60 + 2);
  });
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
  s.scale.set(1.6, 0.4 * cv.height / 128, 1);
  s.renderOrder = 10;
  return s;
}

export function notaMusical() {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 64;
  const g = cv.getContext("2d");
  g.fillStyle = "#fff"; g.font = "bold 52px serif"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(Math.random() < 0.5 ? "♪" : "♫", 32, 34);
  const t = new THREE.CanvasTexture(cv);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false }));
  s.scale.set(0.25, 0.25, 1);
  return s;
}
