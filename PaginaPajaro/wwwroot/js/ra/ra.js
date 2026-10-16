// Motor de Realidad Aumentada de «Pájaro»: cámara + giroscopio (Android/iOS), modo simulado,
// 6 interacciones RA (avistar, binoculares, llamar, comedero, foto, quiz) y colocación WebXR (Android).
import * as THREE from "three";
import { crearAve, animarAve, cantar, aletear, celebrar, etiqueta, notaMusical } from "./aves3d.js";

const E = window.ESPECIES_RA;
const porId = Object.fromEntries(E.map(e => [e.id, e]));
const $ = s => document.querySelector(s);
const FOV = 62, FOV_ZOOM = 21;
const D2R = Math.PI / 180;

// ------------------------------------------------------------------ estado
let renderer, scene, camera, reloj, simulado, raiz;
let video = null, stream = null, usandoCamara = false, usandoGiro = false;
let modo = "avistar";
const aves = new Map();              // uid -> {obj, esp, registrada, vuelo, etiqueta}
let uid = 0;
const particulas = [];
const qGiro = new THREE.Quaternion();
let arrastre = { yaw: 0, pitch: 0, activo: false, x: 0, y: 0, movido: 0 };
let fovObjetivo = FOV;
let activo = false;
let objetos = [];                    // utilería del comedero
let quiz = null;
let apuntada = null;
const ray = new THREE.Raycaster();

// ------------------------------------------------------------------ utilidades
function rumbo() {
  const f = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  return Math.atan2(f.x, -f.z);
}
function direccion(az, el, dist) {
  return new THREE.Vector3(Math.sin(az) * Math.cos(el) * dist, Math.sin(el) * dist, -Math.cos(az) * Math.cos(el) * dist);
}
function mirarCamara(obj, esp) {
  obj.lookAt(0, obj.position.y, 0);
  if (esp && esp.tipo === "carpintero") obj.rotateY(Math.PI / 2);
}
function aviso(texto, ms = 2600) {
  const t = $("#ra-aviso");
  t.innerHTML = texto;
  t.classList.add("ver");
  clearTimeout(aviso.tm);
  aviso.tm = setTimeout(() => t.classList.remove("ver"), ms);
}
const lib = () => window.Libreta;

// ------------------------------------------------------------------ escena simulada (sin cámara)
const semilla = n => { let s = n; return () => (s = (s * 16807) % 2147483647) / 2147483647; };   // azar repetible
const EDIFICIOS = [[-24, -30, 26, 9, 10, 0.3], [26, -26, 22, 11, 9, -0.4], [32, 14, 10, 7, 18, -1.2], [-30, 10, 12, 8, 16, 1.1]];   // x, z, ancho, alto, fondo, giro

function crearSimulado() {
  const g = new THREE.Group();
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
  suelo.position.y = -1.6;
  g.add(suelo);
  const camino = new THREE.Mesh(new THREE.PlaneGeometry(3, 60), new THREE.MeshStandardMaterial({ color: "#B9A57E", roughness: 1 }));
  camino.rotation.x = -Math.PI / 2; camino.position.set(0, -1.59, -20);
  g.add(camino);
  const ladrillo = new THREE.MeshStandardMaterial({ color: "#B4553A", flatShading: true });
  const ventana = new THREE.MeshStandardMaterial({ color: "#2E3A44", flatShading: true });
  for (const [x, z, w, h, d, ry] of EDIFICIOS) {
    const b = new THREE.Group();
    b.add(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), ladrillo));
    for (let i = 0; i < Math.floor(w / 2.6); i++)
      for (let j = 0; j < Math.floor(h / 3); j++) {
        const v = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 0.1), ventana);
        v.position.set(-w / 2 + 1.6 + i * 2.6, -h / 2 + 2 + j * 3, d / 2 + 0.05);
        b.add(v);
      }
    b.position.set(x, -1.6 + h / 2, z);
    b.rotation.y = ry;
    g.add(b);
  }
  const hoja = [new THREE.MeshStandardMaterial({ color: "#3F7A36", flatShading: true }), new THREE.MeshStandardMaterial({ color: "#4F8F3E", flatShading: true })];
  const madera = new THREE.MeshStandardMaterial({ color: "#6A4A2E", flatShading: true });
  plantarArboles(g, hoja, madera);
  return g;
}

// Palmera: tronco que se afina y corona de hojas planas que salen hacia afuera y se doblan hacia abajo.
function crearPalmera(rnd, hoja, madera) {
  const g = new THREE.Group();
  const alto = 7 + rnd() * 2;
  const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.3, alto, 6), madera);
  tronco.position.y = alto / 2;
  g.add(tronco);
  const nudo = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 0), hoja[0]);   // tapa el extremo del tronco
  nudo.position.y = alto + 0.1;
  g.add(nudo);
  const tramo1 = new THREE.ConeGeometry(0.32, 2, 4).translate(0, 1, 0);           // la base queda en el origen, la punta arriba
  const tramo2 = new THREE.ConeGeometry(0.24, 1.8, 4).translate(0, 0.9, 0);
  const hojas = 9;
  for (let k = 0; k < hojas; k++) {
    const giro = new THREE.Group();                                               // reparte las hojas alrededor del tronco
    giro.position.y = alto;
    giro.rotation.y = k / hojas * Math.PI * 2 + rnd() * 0.3;
    const a = new THREE.Group();                                                  // inclina el primer tramo hacia afuera
    a.rotation.x = k % 2 ? 1.15 : 0.8;
    const m1 = new THREE.Mesh(tramo1, hoja[k % 2]);
    m1.scale.set(2, 1, 0.25);
    const b = new THREE.Group();                                                  // el segundo tramo cuelga desde la punta del primero
    b.position.y = 2;
    b.rotation.x = 0.8;
    const m2 = new THREE.Mesh(tramo2, hoja[k % 2]);
    m2.scale.set(2, 1, 0.25);
    b.add(m2);
    a.add(m1, b);
    giro.add(a);
    g.add(giro);
  }
  return g;
}

// Árbol de copa redonda: tronco y cuatro bloques de hojas.
function crearArbol(rnd, hoja, madera) {
  const g = new THREE.Group();
  const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 4, 6), madera);
  tronco.position.y = 2;
  g.add(tronco);
  for (let k = 0; k < 4; k++) {
    const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8 + rnd(), 0), hoja[k % 2]);
    c.position.set((rnd() - 0.5) * 2.4, 4.5 + rnd() * 1.5, (rnd() - 0.5) * 2.4);
    g.add(c);
  }
  return g;
}

// Distancia horizontal del tronco al punto más lejano del árbol (mide los vértices reales, así no hay que adivinar).
function radioDe(arbol) {
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
// no pisa a otro árbol, a un edificio, al camino ni a la zona de enfrente donde llegan volando las aves.
function plantarArboles(g, hoja, madera) {
  const rnd = semilla(20231);
  const puestos = [];
  for (let i = 0; i < 34; i++) {
    const arbol = i % 4 === 0 ? crearPalmera(rnd, hoja, madera) : crearArbol(rnd, hoja, madera);
    const escala = 0.85 + rnd() * 0.4;
    const radio = radioDe(arbol) * escala;
    for (let intento = 0; intento < 150; intento++) {
      const a = i / 34 * Math.PI * 2 + (rnd() - 0.5) * (0.4 + intento * 0.04);                // un sector por árbol: quedan repartidos en círculo
      const d = Math.sqrt(14 * 14 + rnd() * (40 * 40 - 14 * 14));                             // entre 14 y 40 m
      const x = Math.sin(a) * d, z = -Math.cos(a) * d;
      if (d - radio < 10) continue;                                                           // el centro queda libre
      if (Math.abs(x) < 3 && z < 12 && z > -52) continue;                                     // el camino queda libre
      if (EDIFICIOS.some(e => distanciaAlEdificio(x, z, e) < radio + 0.8)) continue;
      if (puestos.some(p => Math.hypot(p.x - x, p.z - z) < p.radio + radio + 0.3)) continue;
      arbol.position.set(x, -1.6, z);
      arbol.rotation.y = rnd() * Math.PI * 2;
      arbol.scale.setScalar(escala);
      g.add(arbol);
      puestos.push({ x, z, radio });
      break;
    }
  }
}

// ------------------------------------------------------------------ aves
function agregarAve(id, pos, opciones = {}) {
  const esp = porId[id];
  const obj = crearAve(esp);
  obj.position.copy(pos);
  mirarCamara(obj, esp);
  raiz.add(obj);
  const a = { uid: ++uid, obj, esp, registrada: lib()?.tiene(id) || false, vuelo: null, etiqueta: null, ...opciones };
  aves.set(a.uid, a);
  if (a.registrada && opciones.conEtiqueta !== false) ponerEtiqueta(a);
  return a;
}
function quitarAve(a) {
  raiz.remove(a.obj);
  aves.delete(a.uid);
}
function limpiarAves() {
  [...aves.values()].forEach(quitarAve);
  objetos.forEach(o => raiz.remove(o));
  objetos = [];
}
function ponerEtiqueta(a, texto, color) {
  if (a.etiqueta) a.obj.remove(a.etiqueta);
  const s = etiqueta(texto || a.esp.nombre, color);
  s.position.set(0, a.esp.tipo === "garza" ? 3.6 : a.esp.tipo === "pellar" ? 2.7 : 2.2, 0);
  s.scale.multiplyScalar(1 / (a.esp.escala / 0.4));
  a.obj.add(s);
  a.etiqueta = s;
}
// vuelo desde lejos hasta un punto (curva con aleteo)
function volar(a, destino, dur = 2.4, alLlegar) {
  const desde = a.obj.position.clone();
  const medio = desde.clone().lerp(destino, 0.5).add(new THREE.Vector3(0, 1.6, 0));
  a.vuelo = { desde, medio, destino: destino.clone(), t0: reloj.elapsedTime, dur, alLlegar };
  Sonido.aleteo(Math.sin(rumbo()) * 0.5);
}
function llegarVolando(id, destino, alLlegar) {
  const az = rumbo() + (Math.random() < 0.5 ? -1 : 1) * (0.7 + Math.random() * 0.5);
  const a = agregarAve(id, direccion(az, 0.45, 9));
  volar(a, destino, 2.4, alLlegar);
  return a;
}
function irse(a) {
  const lejos = a.obj.position.clone().setY(a.obj.position.y + 6).multiplyScalar(2.5);
  volar(a, lejos, 1.6, () => quitarAve(a));
}
function notas(a) {
  for (let i = 0; i < 4; i++) {
    const n = notaMusical();
    const p = new THREE.Vector3(0, 1.3, 0.6).applyMatrix4(a.obj.matrixWorld);
    n.position.copy(p);
    raiz.add(n);
    particulas.push({ obj: n, v: new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.6 + Math.random() * 0.4, 0), vida: 1.6, t: -i * 0.25 });
  }
}
function confeti(pos) {
  const colores = [0xf2a541, 0xe4673e, 0x7cc3e8, 0x8ee68e, 0xffffff];
  for (let i = 0; i < 70; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.1), new THREE.MeshBasicMaterial({ color: colores[i % 5], side: THREE.DoubleSide }));
    m.position.copy(pos);
    raiz.add(m);
    particulas.push({ obj: m, v: new THREE.Vector3((Math.random() - 0.5) * 3, Math.random() * 3 + 1, (Math.random() - 0.5) * 3), vida: 1.8, t: 0, gravedad: true, giro: Math.random() * 10 });
  }
}
function hacerCantar(a, conSonido = true) {
  const t = reloj.elapsedTime;
  const d = conSonido ? Sonido.cantar(a.esp.canto, 1, THREE.MathUtils.clamp(Math.sin(Math.atan2(a.obj.position.x, -a.obj.position.z) - rumbo()), -1, 1)) : 1;
  cantar(a.obj, t, Math.max(0.8, d));
  notas(a);
}

// ------------------------------------------------------------------ modos
const MODOS = {
  avistar: {
    titulo: "Avistar", ayuda: "Mueve el celular y busca aves a tu alrededor. Toca un ave para registrarla en tu libreta.",
    entrar() {
      limpiarAves();
      const pendientes = E.filter(e => !lib()?.tiene(e.id));
      const lista = (pendientes.length >= 6 ? pendientes : E).slice().sort(() => Math.random() - 0.5).slice(0, 6);
      const r0 = rumbo();
      lista.forEach((e, i) => {
        const az = r0 + 0.35 + i * (Math.PI * 2 / 6) + (Math.random() - 0.5) * 0.3;
        const suelo = e.soporte === "pasto" || e.soporte === "agua";
        const el = suelo ? -0.32 : -0.05 + Math.random() * 0.32;
        agregarAve(e.id, direccion(az, el, suelo ? 3.4 : 3.6));
      });
    },
    tocar(a) {
      hacerCantar(a);
      aletear(a.obj, reloj.elapsedTime, 0.5);
      if (!a.registrada) {
        a.registrada = true;
        ponerEtiqueta(a);
        lib()?.registrar(a.esp.id);
        Sonido.registro();
        const total = lib()?.total() || 0;
        aviso(`<strong>¡${a.esp.nombre} registrado!</strong> Libreta: ${total}/${E.length}`);
      }
      window.FichaRA?.(a.esp);
    }
  },
  binoculares: {
    titulo: "Binoculares", ayuda: "Apunta al centro de un ave para ver de cerca sus marcas de identificación.",
    entrar() { if (!aves.size) MODOS.avistar.entrar(); fovObjetivo = FOV_ZOOM; document.body.classList.add("ra-zoom"); },
    salir() { fovObjetivo = FOV; document.body.classList.remove("ra-zoom"); $("#ra-marcas").innerHTML = ""; },
    tocar(a) { hacerCantar(a); }
  },
  llamar: {
    titulo: "Llamar", ayuda: "Elige un canto: el ave que lo reconoce vendrá volando y te responderá.",
    entrar() { abrirPanel("llamar"); },
    salir() { cerrarPanel(); },
    tocar(a) { hacerCantar(a); }
  },
  comedero: {
    titulo: "Comedero", ayuda: "Pon alimento frente a ti y descubre qué aves llegan a comer.",
    entrar() { limpiarAves(); abrirPanel("comedero"); },
    salir() { cerrarPanel(); },
    tocar(a) { hacerCantar(a); window.FichaRA?.(a.esp); }
  },
  foto: {
    titulo: "Foto", ayuda: "Encuadra un ave y toma tu foto de campo.",
    entrar() { if (!aves.size) MODOS.avistar.entrar(); $("#ra-obturador").hidden = false; },
    salir() { $("#ra-obturador").hidden = true; },
    tocar(a) { hacerCantar(a); }
  },
  quiz: {
    titulo: "Quiz RA", ayuda: "Lee la pregunta y toca el ave correcta entre las que aparecen.",
    entrar() { limpiarAves(); iniciarQuiz(); },
    salir() { quiz = null; $("#ra-pregunta").hidden = true; },
    tocar(a) { responderQuiz(a); }
  }
};

export function cambiarModo(m) {
  if (!MODOS[m]) return;
  MODOS[modo]?.salir?.();
  modo = m;
  document.querySelectorAll(".ra-modo").forEach(b => b.classList.toggle("activo", b.dataset.modo === m));
  $("#ra-titulo").textContent = MODOS[m].titulo;
  aviso(MODOS[m].ayuda, 3800);
  MODOS[m].entrar();
  Sonido.clic();
}

// ---------------- paneles inferiores (llamar / comedero)
function abrirPanel(cual) {
  const p = $("#ra-panel");
  if (cual === "llamar") {
    p.innerHTML = `<p class="ra-panel-nota">Toca un canto. En la vida real usa el «playback» con moderación: puede estresar a las aves.</p>
      <div class="ra-panel-lista">${E.map(e => `<button data-llamar="${e.id}"><i style="background:${e.colores.vientre};box-shadow:inset 0 0 0 4px ${e.colores.espalda}"></i>${e.nombre}</button>`).join("")}</div>`;
  } else {
    const items = [["flores", "🌺", "Flores"], ["frutas", "🍌", "Frutas"], ["agua", "💧", "Agua"], ["pasto", "🌱", "Pasto"], ["insectos", "🦗", "Insectos"]];
    p.innerHTML = `<p class="ra-panel-nota">¿Qué pones en el comedero?</p><div class="ra-panel-lista">${items.map(([k, ic, n]) => `<button data-comida="${k}"><b>${ic}</b>${n}</button>`).join("")}</div>`;
  }
  p.hidden = false;
}
function cerrarPanel() { $("#ra-panel").hidden = true; }

function llamar(id) {
  Sonido.cantar(porId[id].canto, 0.9);
  aviso(`Reproduciendo el canto del <strong>${porId[id].nombre}</strong>…`);
  const existente = [...aves.values()].find(a => a.esp.id === id);
  const destino = direccion(rumbo() + (Math.random() - 0.5) * 0.4, porId[id].soporte === "pasto" || porId[id].soporte === "agua" ? -0.3 : 0.02, 3);
  setTimeout(() => {
    const llega = a => { mirarCamara(a.obj, a.esp); hacerCantar(a); aviso(`<strong>¡El ${a.esp.nombre} respondió!</strong> Tócalo para registrarlo.`); };
    if (existente) volar(existente, destino, 2, () => llega(existente));
    else llegarVolando(id, destino, a => llega(a));
  }, 1100);
}

function crearComida(tipo) {
  const g = new THREE.Group();
  const m = c => new THREE.MeshStandardMaterial({ color: c, flatShading: true });
  if (tipo === "flores") {
    for (let i = 0; i < 5; i++) {
      const f = new THREE.Group();
      const tallo = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 5), m("#3e7a34")); tallo.position.y = 0.25; f.add(tallo);
      const corola = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.18, 6), m(i % 2 ? "#e0412e" : "#f2a030")); corola.position.y = 0.55; corola.rotation.x = Math.PI; f.add(corola);
      f.position.set(Math.cos(i * 1.3) * 0.25, 0, Math.sin(i * 1.3) * 0.25); g.add(f);
    }
  } else if (tipo === "frutas") {
    const plato = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 0.06, 12), m("#8a5e35")); g.add(plato);
    for (let i = 0; i < 6; i++) {
      const fr = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), m(["#f2c230", "#e85d2a", "#c0281c"][i % 3]));
      fr.position.set(Math.cos(i) * 0.2, 0.08, Math.sin(i) * 0.2); g.add(fr);
    }
  } else if (tipo === "agua") {
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.42, 0.12, 16), m("#7f8c8d")));
    const a = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.02, 16), new THREE.MeshStandardMaterial({ color: "#5aa9c8", roughness: 0.1 }));
    a.position.y = 0.06; g.add(a);
  } else if (tipo === "pasto") {
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.05, 14), m("#5f9440")));
    for (let i = 0; i < 18; i++) {
      const b = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.25, 4), m("#6fa64a"));
      b.position.set(Math.cos(i * 2.3) * 0.45 * Math.random(), 0.12, Math.sin(i * 2.3) * 0.45 * Math.random()); g.add(b);
    }
  } else {
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 5), m("#6a4a2e")));
    g.userData.bichos = [];
    for (let i = 0; i < 9; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.025, 5, 4), m("#222"));
      g.add(b); g.userData.bichos.push(b);
    }
  }
  return g;
}

function comedero(tipo) {
  limpiarAves();
  cerrarPanel();   // deja ver el comedero; para cambiar la comida se toca otra vez «Comedero»
  const az = rumbo();
  const pos = direccion(az, -0.38, 2.4);
  const item = crearComida(tipo);
  item.position.copy(pos);
  raiz.add(item);
  objetos.push(item);
  Sonido.clic();
  const candidatas = E.filter(e => e.comida.includes(tipo)).sort(() => Math.random() - 0.5).slice(0, 2);
  candidatas.forEach((e, i) => {
    const lado = i === 0 ? -1 : 1;
    const destino = pos.clone().add(new THREE.Vector3(Math.cos(az) * lado * 0.9, e.soporte === "pasto" || e.soporte === "agua" ? 0 : 0.35, Math.sin(az) * lado * 0.9));
    setTimeout(() => llegarVolando(e.id, destino, a => { mirarCamara(a.obj, a.esp); hacerCantar(a); }), 900 + i * 1300);
  });
  const nombres = candidatas.map(e => e.nombre).join(" y ");
  const textos = { flores: "Las flores ofrecen néctar", frutas: "Las frutas atraen a las aves frugívoras", agua: "El agua atrae a las aves de humedal", pasto: "En el pasto buscan lombrices e insectos", insectos: "Los insectos atraen a los atrapamoscas" };
  setTimeout(() => aviso(`${textos[tipo]}: llegan <strong>${nombres}</strong>.`, 4200), 1200);
}

// ---------------- foto
function tomarFoto() {
  const w = renderer.domElement.width, h = renderer.domElement.height;
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const g = cv.getContext("2d");
  if (usandoCamara && video.videoWidth) {
    const vw = video.videoWidth, vh = video.videoHeight;
    const zoom = document.body.classList.contains("ra-zoom") ? Math.tan(FOV / 2 * D2R) / Math.tan(FOV_ZOOM / 2 * D2R) : 1;
    const k = Math.max(w / vw, h / vh) * zoom;
    g.drawImage(video, (w - vw * k) / 2, (h - vh * k) / 2, vw * k, vh * k);
  }
  renderer.render(scene, camera);
  g.drawImage(renderer.domElement, 0, 0);
  g.fillStyle = "rgba(14,38,33,.75)";
  g.fillRect(0, h - h * 0.07, w, h * 0.07);
  g.fillStyle = "#F2A541";
  g.font = `700 ${Math.round(h * 0.028)}px Inter, sans-serif`;
  g.fillText("Pájaro · Aves del campus UAO", w * 0.04, h - h * 0.025);
  g.fillStyle = "#fff";
  g.textAlign = "right";
  g.fillText(new Date().toLocaleDateString("es-CO"), w * 0.96, h - h * 0.025);
  const url = cv.toDataURL("image/jpeg", 0.82);
  Sonido.obturador();
  const fl = $("#ra-flash");
  fl.classList.remove("ver"); void fl.offsetWidth; fl.classList.add("ver");
  lib()?.foto(url);
  [...aves.values()].forEach(a => aletear(a.obj, reloj.elapsedTime, 0.4));
  aviso(`<strong>¡Foto guardada en tu libreta!</strong> <a href="${url}" download="pajaro-uao.jpg">Descargar</a>`, 4500);
}

// ---------------- quiz
function iniciarQuiz() {
  quiz = { ronda: 0, puntos: 0, total: 5, orden: E.slice().sort(() => Math.random() - 0.5).slice(0, 5), bloqueado: false };
  rondaQuiz();
}
function rondaQuiz() {
  [...aves.values()].forEach(irse);
  const q = quiz;
  if (q.ronda >= q.total) {
    $("#ra-pregunta").innerHTML = `<b>${q.puntos}/${q.total}</b> ${q.puntos >= 4 ? "¡Eres un <strong>Guardián de las Aves UAO</strong>! 🏅" : "¡Buen intento! Repasa la guía y vuelve a jugar."}
      <button id="ra-quiz-otra">Jugar otra vez</button>`;
    $("#ra-quiz-otra").onclick = () => { limpiarAves(); iniciarQuiz(); };
    lib()?.quiz(q.puntos);
    if (q.puntos >= 4) { Sonido.exito(); confeti(direccion(rumbo(), 0.1, 2.5)); }
    return;
  }
  const objetivo = q.orden[q.ronda];
  const otras = E.filter(e => e !== objetivo).sort(() => Math.random() - 0.5).slice(0, 2);
  const opciones = [objetivo, ...otras].sort(() => Math.random() - 0.5);
  const tipo = q.ronda % 3;
  let texto;
  if (tipo === 0) texto = `¿Cuál es el <strong>${objetivo.nombre}</strong>?`;
  else if (tipo === 1) texto = `¿Quién es? <em>${objetivo.pistas[Math.floor(Math.random() * objetivo.pistas.length)]}</em>`;
  else texto = `¿Quién canta así? <button id="ra-quiz-oir">▶ Oír</button>`;
  $("#ra-pregunta").hidden = false;
  $("#ra-pregunta").innerHTML = `<small>Pregunta ${q.ronda + 1}/${q.total} · Puntos ${q.puntos}</small>${texto}`;
  if (tipo === 2) {
    setTimeout(() => Sonido.cantar(objetivo.canto, 1), 1500);
    $("#ra-quiz-oir").onclick = () => Sonido.cantar(objetivo.canto, 1);
  }
  q.objetivo = objetivo;
  q.bloqueado = false;
  const r0 = rumbo();
  setTimeout(() => {
    opciones.forEach((e, i) => {
      const az = r0 + (i - 1) * 0.55;
      const suelo = e.soporte === "pasto" || e.soporte === "agua";
      setTimeout(() => llegarVolando(e.id, direccion(az, suelo ? -0.28 : 0.05, 3.3), a => { mirarCamara(a.obj, a.esp); a.quiz = true; }), i * 350);
    });
  }, 600);
}
function responderQuiz(a) {
  const q = quiz;
  if (!q || q.bloqueado || !a.quiz) return;
  q.bloqueado = true;
  if (a.esp === q.objetivo) {
    q.puntos++;
    celebrar(a.obj, reloj.elapsedTime);
    hacerCantar(a);
    confeti(a.obj.position.clone().add(new THREE.Vector3(0, 0.5, 0)));
    Sonido.exito();
    ponerEtiqueta(a, "¡Correcto! " + a.esp.nombre, "#8EE68E");
  } else {
    Sonido.error();
    ponerEtiqueta(a, a.esp.nombre, "#E4673E");
    const ok = [...aves.values()].find(x => x.esp === q.objetivo);
    if (ok) { ponerEtiqueta(ok, "Era: " + ok.esp.nombre, "#8EE68E"); celebrar(ok.obj, reloj.elapsedTime); }
  }
  q.ronda++;
  setTimeout(rondaQuiz, 2600);
}

// ------------------------------------------------------------------ entrada (toques y arrastre)
function avePorPantalla(x, y) {
  const v = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
  ray.setFromCamera(v, camera);
  const zonas = [...aves.values()].filter(a => !a.vuelo).map(a => a.obj.userData.zona);
  const hit = ray.intersectObjects(zonas, false)[0];
  if (!hit) return null;
  return [...aves.values()].find(a => a.obj.userData.zona === hit.object);
}
function configurarEntrada(el) {
  el.addEventListener("pointerdown", e => { arrastre.activo = true; arrastre.x = e.clientX; arrastre.y = e.clientY; arrastre.movido = 0; });
  el.addEventListener("pointermove", e => {
    if (!arrastre.activo) return;
    const dx = e.clientX - arrastre.x, dy = e.clientY - arrastre.y;
    arrastre.movido += Math.abs(dx) + Math.abs(dy);
    arrastre.x = e.clientX; arrastre.y = e.clientY;
    if (!usandoGiro) {
      const k = (camera.fov / FOV) * 0.005;
      arrastre.yaw -= dx * k;
      arrastre.pitch = THREE.MathUtils.clamp(arrastre.pitch - dy * k, -1.2, 1.2);
    }
  });
  el.addEventListener("pointerup", e => {
    arrastre.activo = false;
    if (arrastre.movido > 12) return;
    const a = avePorPantalla(e.clientX, e.clientY);
    if (a) MODOS[modo].tocar?.(a);
  });
}

// ------------------------------------------------------------------ orientación del celular
const zee = new THREE.Vector3(0, 0, 1), eul = new THREE.Euler(), q0 = new THREE.Quaternion(), q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
function alGirar(ev) {
  if (ev.alpha === null || ev.alpha === undefined) return;
  usandoGiro = true;
  const orient = (screen.orientation ? screen.orientation.angle : window.orientation || 0) * D2R;
  eul.set(ev.beta * D2R, ev.alpha * D2R, -ev.gamma * D2R, "YXZ");
  qGiro.setFromEuler(eul);
  qGiro.multiply(q1);
  qGiro.multiply(q0.setFromAxisAngle(zee, -orient));
}

// ------------------------------------------------------------------ ciclo
function actualizarMarcas() {
  const caja = $("#ra-marcas");
  if (modo !== "binoculares" || !apuntada) { caja.innerHTML = ""; return; }
  const u = apuntada.obj.userData;
  const partes = { cabeza: u.cabeza, pico: u.pico, ala: u.alas[1], cola: u.cola, espalda: u.cuerpo, vientre: u.cuerpo, patas: u.ave };
  const desplaz = { vientre: new THREE.Vector3(0, -0.35, 0.3), espalda: new THREE.Vector3(0, 0.35, -0.2), patas: new THREE.Vector3(0, 0.05, 0) };
  caja.innerHTML = apuntada.esp.marcas.map(([parte, texto], i) => {
    const p = new THREE.Vector3();
    partes[parte].getWorldPosition(p);
    if (desplaz[parte]) p.add(desplaz[parte].clone().multiplyScalar(apuntada.esp.escala).applyQuaternion(apuntada.obj.quaternion));
    p.project(camera);
    const x = (p.x * 0.5 + 0.5) * window.innerWidth, y = (-p.y * 0.5 + 0.5) * window.innerHeight;
    const lado = i % 2 ? 1 : -1;
    return `<div class="marca" style="left:${x}px;top:${y}px"><i></i><span class="${lado > 0 ? "der" : "izq"}" style="transform:translate(${lado > 0 ? 18 : "calc(-100% - 18px)"},${(i - 1) * 46}px)">${texto}</span></div>`;
  }).join("") + `<div class="marca-nombre">${apuntada.esp.nombre} · <em>${apuntada.esp.cientifico}</em></div>`;
}

function dibujarRadar() {
  const cv = $("#ra-radar");
  const g = cv.getContext("2d");
  const w = cv.width, c = w / 2;
  g.clearRect(0, 0, w, w);
  g.fillStyle = "rgba(14,38,33,.65)"; g.beginPath(); g.arc(c, c, c - 2, 0, Math.PI * 2); g.fill();
  g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 2; g.stroke();
  const half = (camera.fov * camera.aspect) / 2 * D2R;
  g.fillStyle = "rgba(242,165,65,.25)"; g.beginPath(); g.moveTo(c, c); g.arc(c, c, c - 4, -Math.PI / 2 - half, -Math.PI / 2 + half); g.fill();
  const r0 = rumbo();
  for (const a of aves.values()) {
    const az = Math.atan2(a.obj.position.x, -a.obj.position.z) - r0;
    const r = c * 0.72;
    g.fillStyle = a.registrada ? "#8EE68E" : "#F2A541";
    g.beginPath(); g.arc(c + Math.sin(az) * r, c - Math.cos(az) * r, 6, 0, Math.PI * 2); g.fill();
  }
  g.fillStyle = "#fff"; g.beginPath(); g.arc(c, c, 4, 0, Math.PI * 2); g.fill();
}

function ciclo() {
  const dt = Math.min(0.05, reloj.getDelta());
  const t = reloj.elapsedTime;
  // orientación de la cámara
  if (usandoGiro) camera.quaternion.slerp(qGiro, 0.35);
  else camera.quaternion.setFromEuler(new THREE.Euler(-arrastre.pitch, -arrastre.yaw, 0, "YXZ"));
  if (Math.abs(camera.fov - fovObjetivo) > 0.05) {
    camera.fov += (fovObjetivo - camera.fov) * Math.min(1, dt * 6);
    camera.updateProjectionMatrix();
    if (video) video.style.transform = `scale(${Math.tan(FOV / 2 * D2R) / Math.tan(camera.fov / 2 * D2R)})`;
  }
  // aves
  for (const a of aves.values()) {
    if (a.vuelo) {
      const v = a.vuelo, k = Math.min(1, (t - v.t0) / v.dur), e = k * k * (3 - 2 * k);
      const p = new THREE.Vector3().copy(v.desde).multiplyScalar((1 - e) * (1 - e)).add(v.medio.clone().multiplyScalar(2 * (1 - e) * e)).add(v.destino.clone().multiplyScalar(e * e));
      const dir = p.clone().sub(a.obj.position);
      a.obj.position.copy(p);
      if (dir.lengthSq() > 1e-6) a.obj.lookAt(p.clone().add(dir));
      a.obj.userData.aletearHasta = t + 0.2;
      if (a.obj.userData.soporte) a.obj.userData.soporte.visible = k > 0.85;
      if (k >= 1) { a.vuelo = null; mirarCamara(a.obj, a.esp); v.alLlegar?.(a); }
    }
    animarAve(a.obj, t, dt);
  }
  // utilería con insectos
  for (const o of objetos) (o.userData.bichos || []).forEach((b, i) => b.position.set(Math.sin(t * 3 + i) * 0.25, 0.5 + Math.sin(t * 5 + i * 2) * 0.15, Math.cos(t * 4 + i) * 0.25));
  // partículas
  for (let i = particulas.length - 1; i >= 0; i--) {
    const p = particulas[i];
    p.t += dt;
    if (p.t < 0) { p.obj.visible = false; continue; }
    p.obj.visible = true;
    if (p.gravedad) p.v.y -= 4 * dt;
    p.obj.position.addScaledVector(p.v, dt);
    if (p.giro) p.obj.rotation.set(p.t * p.giro, p.t * p.giro * 0.7, 0);
    if (p.obj.material) p.obj.material.opacity = Math.max(0, 1 - p.t / p.vida), p.obj.material.transparent = true;
    if (p.t > p.vida) { raiz.remove(p.obj); particulas.splice(i, 1); }
  }
  // ave apuntada por la retícula
  ray.setFromCamera(new THREE.Vector2(0, 0), camera);
  const hit = ray.intersectObjects([...aves.values()].filter(a => !a.vuelo).map(a => a.obj.userData.zona), false)[0];
  apuntada = hit ? [...aves.values()].find(a => a.obj.userData.zona === hit.object) : null;
  $("#ra-reticula").classList.toggle("sobre-ave", !!apuntada);
  actualizarMarcas();
  if ((t * 10 | 0) % 2 === 0) dibujarRadar();
  renderer.render(scene, camera);
}

function ajustar() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ------------------------------------------------------------------ API pública
export async function iniciar() {
  // pedir permisos dentro del gesto del usuario (requisito de iOS)
  let permisoGiro = Promise.resolve("granted");
  if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function")
    permisoGiro = DeviceOrientationEvent.requestPermission().catch(() => "denied");
  const permisoCam = navigator.mediaDevices?.getUserMedia
    ? navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false }).catch(() => null)
    : Promise.resolve(null);
  Sonido.iniciar();
  document.body.classList.add("en-ra");
  $("#ra").hidden = false;

  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    $("#ra-lienzo").appendChild(renderer.domElement);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.05, 300);
    scene.add(new THREE.HemisphereLight("#fff6e6", "#5d6b4a", 1.4));
    const sol = new THREE.DirectionalLight("#fff1d6", 1.6);
    sol.position.set(4, 8, 3);
    scene.add(sol);
    raiz = new THREE.Group();
    scene.add(raiz);
    simulado = crearSimulado();
    scene.add(simulado);
    reloj = new THREE.Clock();
    configurarEntrada(renderer.domElement);
    window.addEventListener("resize", ajustar);
    window.addEventListener("deviceorientation", alGirar);
    document.querySelectorAll(".ra-modo").forEach(b => b.addEventListener("click", () => cambiarModo(b.dataset.modo)));
    $("#ra-panel").addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.llamar) llamar(b.dataset.llamar);
      if (b.dataset.comida) comedero(b.dataset.comida);
    });
    $("#ra-obturador").addEventListener("click", tomarFoto);
    $("#ra-salir").addEventListener("click", salir);
    $("#ra-recentrar").addEventListener("click", () => { arrastre.yaw = arrastre.pitch = 0; cambiarModo(modo); });
  }
  const [giro, s] = await Promise.all([permisoGiro, permisoCam]);
  stream = s;
  video = $("#ra-video");
  usandoCamara = !!stream;
  if (stream) {
    video.srcObject = stream;
    await video.play().catch(() => {});
  }
  simulado.visible = !usandoCamara;
  renderer.setClearColor(0x000000, usandoCamara ? 0 : 1);
  document.body.classList.toggle("ra-simulado", !usandoCamara);
  $("#ra-estado").textContent = usandoCamara ? (giro === "granted" ? "Cámara + giroscopio" : "Cámara (arrastra para mirar)") : "Modo simulado: arrastra para mirar";
  activo = true;
  renderer.setAnimationLoop(ciclo);
  setTimeout(() => cambiarModo("avistar"), 300);
  revisarXR();
}

export function salir() {
  activo = false;
  MODOS[modo]?.salir?.();
  renderer?.setAnimationLoop(null);
  stream?.getTracks().forEach(t => t.stop());
  stream = null;
  limpiarAves();
  document.body.classList.remove("en-ra", "ra-zoom", "ra-simulado");
  $("#ra").hidden = true;
  window.alSalirRA?.();
}

// ------------------------------------------------------------------ WebXR (Android con ARCore): ave a tamaño real sobre superficies
async function revisarXR() {
  const btn = $("#ra-xr");
  const ok = navigator.xr && await navigator.xr.isSessionSupported("immersive-ar").catch(() => false);
  btn.hidden = !ok;
  btn.onclick = iniciarXR;
}
async function iniciarXR() {
  const elegida = porId[$("#ra-xr-especie").value] || E[0];
  stream?.getTracks().forEach(t => t.stop());
  const sesion = await navigator.xr.requestSession("immersive-ar", { requiredFeatures: ["hit-test"], optionalFeatures: ["dom-overlay"], domOverlay: { root: $("#xr-ui") } }).catch(e => { aviso("No se pudo iniciar WebXR: " + e.message); return null; });
  if (!sesion) return;
  renderer.setAnimationLoop(null);
  renderer.xr.enabled = true;
  renderer.setClearColor(0x000000, 0);
  renderer.xr.setReferenceSpaceType("local");
  await renderer.xr.setSession(sesion);
  simulado.visible = false;
  limpiarAves();
  $("#xr-ui").hidden = false;
  const espacioVista = await sesion.requestReferenceSpace("viewer");
  const fuente = await sesion.requestHitTestSource({ space: espacioVista });
  const reticula = new THREE.Mesh(new THREE.RingGeometry(0.08, 0.11, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xf2a541 }));
  reticula.matrixAutoUpdate = false; reticula.visible = false;
  scene.add(reticula);
  let actual = elegida;
  $("#xr-especie").textContent = actual.nombre;
  $("#xr-siguiente").onclick = () => { actual = E[(E.indexOf(actual) + 1) % E.length]; $("#xr-especie").textContent = actual.nombre; };
  $("#xr-salir").onclick = () => sesion.end();
  sesion.addEventListener("select", () => {
    if (!reticula.visible) return;
    const a = agregarAve(actual.id, new THREE.Vector3().setFromMatrixPosition(reticula.matrix));
    a.obj.scale.setScalar(actual.escala * 0.45);
    const cam = renderer.xr.getCamera();
    a.obj.lookAt(cam.position.x, a.obj.position.y, cam.position.z);
    hacerCantar(a);
  });
  sesion.addEventListener("end", () => {
    renderer.xr.enabled = false;
    scene.remove(reticula);
    $("#xr-ui").hidden = true;
    limpiarAves();
    salir();
  });
  renderer.setAnimationLoop((tiempo, frame) => {
    const dt = Math.min(0.05, reloj.getDelta());
    if (frame) {
      const ref = renderer.xr.getReferenceSpace();
      const res = frame.getHitTestResults(fuente);
      if (res.length) { reticula.visible = true; reticula.matrix.fromArray(res[0].getPose(ref).transform.matrix); }
      else reticula.visible = false;
    }
    for (const a of aves.values()) animarAve(a.obj, reloj.elapsedTime, dt);
    renderer.render(scene, camera);
  });
}

// acceso interno para pruebas automáticas (tocar un ave por código)
function tocarPrimera(filtro = () => true) {
  const a = [...aves.values()].find(x => !x.vuelo && filtro(x));
  if (!a) return null;
  camera.lookAt(a.obj.position);
  arrastre.yaw = Math.atan2(a.obj.position.x, -a.obj.position.z);
  MODOS[modo].tocar?.(a);
  return a.esp.id;
}
window.RA = {
  iniciar, salir, cambiarModo,
  _prueba: {
    tocarPrimera, tocarCorrecta: () => tocarPrimera(a => quiz && a.esp === quiz.objetivo && a.quiz),
    mirarA: (i = 0) => { const a = [...aves.values()].filter(x => !x.vuelo)[i]; if (a) { arrastre.yaw = Math.atan2(a.obj.position.x, -a.obj.position.z); arrastre.pitch = -Math.asin((a.obj.position.y + 0.25) / a.obj.position.length()); } return a?.esp.id; },
    estado: () => ({ modo, aves: [...aves.values()].map(a => ({ id: a.esp.id, vuelo: !!a.vuelo, reg: a.registrada })), quiz: quiz && { ronda: quiz.ronda, puntos: quiz.puntos } })
  }
};
