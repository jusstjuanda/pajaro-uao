// Motor de Realidad Aumentada de «Aves UAO»: cámara + giroscopio (Android/iOS), modo simulado,
// 6 interacciones RA (avistar, binoculares, llamar, comedero, foto, quiz) y colocación WebXR (Android).
import * as THREE from "three";
import { crearAve, crearSoporte, animarAve, cantar, aletear, celebrar, etiqueta, tarjeta, notaMusical } from "./aves3d.js";
import { crearSimulado, radioDe, OBSTACULOS } from "./campus.js";
import { crearRecorrido } from "./recorrido.js";

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
const soportesSaliendo = [];         // soportes que se quedaron sin ave: se encogen y se quitan
const pendientes = new Set();        // llegadas con retraso (ver despues): se cancelan al cambiar de modo o limpiar la escena
const llamadas = new Map();          // especie -> llegada en espera de un canto (tocar el mismo canto otra vez la reinicia)
const MAX_AVES = 6;                  // aves a la vez en «Llamar»: si llega una nueva y ya hay 6, la más antigua se va
const qGiro = new THREE.Quaternion();
let arrastre = { yaw: 0, pitch: 0, activo: false, x: 0, y: 0, movido: 0 };
let fovObjetivo = FOV;
let activo = false;
let objetos = [];                    // utilería del comedero
let quiz = null;
let apuntada = null;
const ray = new THREE.Raycaster();
// recorrido 3D por el campus (cinemática de recorrido.js): mientras dura, la RA se pausa y se esconde
let recorrido = null, enRecorrido = false, cargandoRecorrido = false, pixelAntes = 1;
const colaRecorrido = [];            // lo que tocaba hacer durante el recorrido (ver despues): se hace al terminar
const qInicioGiro = new THREE.Quaternion(), qRelativo = new THREE.Quaternion(), qRelSuave = new THREE.Quaternion();

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
// abajo: el aviso sale sobre la barra de modos en vez de arriba (en el quiz arriba está la pregunta)
function aviso(texto, ms = 2600, abajo = false) {
  const t = $("#ra-aviso");
  t.innerHTML = texto;
  t.classList.toggle("abajo", abajo);
  t.classList.add("ver");
  clearTimeout(aviso.tm);
  aviso.tm = setTimeout(() => t.classList.remove("ver"), ms);
}
const lib = () => window.Libreta;
const fem = e => e.genero === "f";   // concordancia de los avisos: «la Garza de ganado», «registrada»

// (el campus simulado, sin cámara, está en campus.js)

// ------------------------------------------------------------------ aves
// sinSoporte: el ave llega volando y su soporte se pone en el punto de aterrizaje (ver volar)
function agregarAve(id, pos, opciones = {}) {
  const { sinSoporte, ...datos } = opciones;
  const esp = porId[id];
  const obj = crearAve(esp, false);     // el soporte no va dentro del ave: es un objeto aparte del mundo
  obj.position.copy(pos);
  mirarCamara(obj, esp);
  raiz.add(obj);
  const a = { uid: ++uid, obj, esp, registrada: lib()?.tiene(id) || false, vuelo: null, etiqueta: null, soporte: null, ...datos };
  aves.set(a.uid, a);
  if (!sinSoporte) ponerSoporte(a, obj);
  if (a.registrada && opciones.conEtiqueta !== false && modo !== "quiz") ponerEtiqueta(a);   // en el quiz el nombre no se muestra: sería la respuesta
  return a;
}
function quitarAve(a) {
  quitarSoporte(a, false);
  raiz.remove(a.obj);
  aves.delete(a.uid);
}
// Ejecuta algo más tarde y lo anota. Si el usuario cambia de modo o la escena se limpia antes de que llegue la hora,
// se cancela: así no aparecen aves de más ni se repiten las que ya se pidieron.
function despues(fn, ms) {
  const t = setTimeout(() => { pendientes.delete(t); if (enRecorrido) colaRecorrido.push(fn); else fn(); }, ms);   // en pleno recorrido espera a que termine
  pendientes.add(t);
  return t;
}
function cancelar(t) { clearTimeout(t); pendientes.delete(t); }
function cancelarPendientes() {
  pendientes.forEach(clearTimeout);
  pendientes.clear();
  llamadas.clear();
  colaRecorrido.length = 0;
}
function limpiarAves() {
  cancelarPendientes();
  limpiarOpciones();
  [...aves.values()].forEach(quitarAve);
  soportesSaliendo.splice(0).forEach(s => raiz.remove(s.g));
  objetos.forEach(o => raiz.remove(o));
  objetos = [];
}
// Soporte (rama, pasto, charco…): objeto del mundo, no parte del ave. Se queda quieto donde el ave se posa
// y desaparece cuando ella se va, así no viaja con el ave ni se acumulan soportes.
// pose: objeto con la posición y la orientación con que queda posada el ave.
function ponerSoporte(a, pose, aparecer = false) {
  const s = crearSoporte(a.esp);
  if (!s) return;
  const base = new THREE.Group();
  base.name = "soporte-" + a.esp.id;
  base.position.copy(pose.position);
  base.quaternion.copy(pose.quaternion);
  base.userData.escala = a.obj.scale.x;
  base.scale.setScalar(aparecer ? 0 : base.userData.escala);
  base.add(s);
  raiz.add(base);
  a.soporte = base;
}
function quitarSoporte(a, animar = true) {
  const s = a.soporte;
  if (!s) return;
  a.soporte = null;
  if (animar) soportesSaliendo.push({ g: s, t0: reloj.elapsedTime, desde: s.scale.x });
  else raiz.remove(s);
}

// ---------------- que nada se cruce
// Cada soporte ocupa un círculo en el suelo (el radio se mide de su forma real, a la escala del ave). Antes de posar un ave
// se busca un punto, girando alrededor del usuario a la misma distancia, donde ese círculo no pise: el sendero del campus
// simulado (solo el pasto y el charco, que van en el suelo), otros soportes ni la comida del comedero.
const SENDERO = { semiancho: 1.5, z0: -50, z1: 10 };
const RADIO_COMIDA = { flores: 0.35, frutas: 0.45, agua: 0.5, pasto: 0.6, insectos: 0.25 };
const radios = {};
const radioSoporte = esp => radios[esp.id] ?? (radios[esp.id] = Math.max(0.35, radioDe(crearSoporte(esp)) * esp.escala));
const enElSuelo = esp => esp.soporte === "pasto" || esp.soporte === "agua";

function cabe(p, r, suelo, propia) {
  if (suelo && simulado?.visible && Math.abs(p.x) < SENDERO.semiancho + r && p.z > SENDERO.z0 - r && p.z < SENDERO.z1 + r) return false;
  if (simulado?.visible && OBSTACULOS.some(o => Math.hypot(p.x - o.x, p.z - o.z) < r + o.r)) return false;   // ni la fuente, ni bancas, canteros, setos o farolas del campus
  const choca = (q, rq) => Math.abs(p.y - q.y) < 0.8 && Math.hypot(p.x - q.x, p.z - q.z) < r + rq + 0.15;
  for (const a of aves.values()) if (a !== propia && a.soporte && choca(a.soporte.position, radioSoporte(a.esp))) return false;
  return !objetos.some(o => choca(o.position, o.userData.radio ?? 0.5));
}
function sitioLibre(pos, r, suelo, propia) {
  const d0 = Math.hypot(pos.x, pos.z), az = Math.atan2(pos.x, -pos.z);
  for (let k = 0; k < 7; k++) {                                // si a esa distancia no cabe en ningún punto del círculo, prueba un poco más lejos
    for (let i = 0; i < 40; i++) {
      const giro = (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 0.1;   // 0, +0,1, -0,1, +0,2 … radianes: primero lo más cerca del punto pedido
      const p = new THREE.Vector3(Math.sin(az + giro) * (d0 + k * 0.6), pos.y, -Math.cos(az + giro) * (d0 + k * 0.6));
      if (cabe(p, r, suelo, propia)) return p;
    }
  }
  return pos;
}
// Dónde poner la comida para que quepan ella y las dos aves que llegan a sus lados (una a cada lado, sin tocarla), sin pisar el sendero.
function sitioComedero(az, rComida, aves2) {
  const lado = (e, k) => (k ? 1 : -1) * (rComida + radioSoporte(e) + 0.2);
  const poner = (a, d) => {
    const centro = direccion(a, -0.38, d);
    return { centro, sitios: aves2.map((e, k) => centro.clone().add(new THREE.Vector3(Math.cos(a) * lado(e, k), enElSuelo(e) ? 0 : 0.35, Math.sin(a) * lado(e, k)))) };
  };
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 40; i++) {
      const g = poner(az + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 0.1, 2.4 + j * 0.6);
      if (cabe(g.centro, rComida, true, null) && aves2.every((e, k) => cabe(g.sitios[k], radioSoporte(e), enElSuelo(e), null))) return g;
    }
  }
  return poner(az, 2.4);
}
function ponerEtiqueta(a, texto, color) {
  if (a.etiqueta) a.obj.remove(a.etiqueta);
  const s = etiqueta(texto || a.esp.nombre, color);
  s.position.set(0, a.esp.tipo === "garza" ? 3.6 : a.esp.tipo === "pellar" ? 2.7 : 2.2, 0);
  s.scale.multiplyScalar(1 / (a.esp.escala / 0.4));
  s.userData.reposo = s.position.clone();   // dónde queda sobre el ave; mantenerEtiqueta la mueve de ahí solo si se saldría de la pantalla
  s.userData.escala = s.scale.clone();
  a.obj.add(s);
  a.etiqueta = s;
}
// Mantiene la etiqueta de un ave dentro de la pantalla: si el ave está cerca de un borde, la etiqueta se corre hacia adentro
// (en horizontal) y, si fuera más ancha que la pantalla, se achica. Se vuelve a calcular en cada cuadro.
const _c = new THREE.Vector3(), _l = new THREE.Vector3(), _der = new THREE.Vector3(), _esc = new THREE.Vector3();
function mantenerEtiqueta(a) {
  const s = a.etiqueta;
  if (!s) return;
  s.position.copy(s.userData.reposo);
  s.scale.copy(s.userData.escala);
  a.obj.updateMatrixWorld(true);
  s.getWorldPosition(_c);
  s.getWorldScale(_esc);
  _der.set(1, 0, 0).applyQuaternion(camera.quaternion);                // la derecha de la pantalla, en el mundo
  const centro = _c.clone().project(camera);
  if (centro.z > 1) return;                                            // detrás de la cámara: no se ve
  const W = window.innerWidth, margen = 10;
  const x = (centro.x * 0.5 + 0.5) * W;
  const lado = _l.copy(_c).addScaledVector(_der, _esc.x / 2).project(camera);
  const medio = Math.abs(lado.x - centro.x) * W / 2;                   // mitad del ancho de la etiqueta, en píxeles
  if (medio < 1 || x < -medio || x > W + medio) return;               // ave fuera de la pantalla: su etiqueta tampoco se muestra pegada al borde
  if (medio * 2 > W - margen * 2) {                                    // más ancha que la pantalla: se achica para que quepa
    const k = (W - margen * 2) / (medio * 2);
    s.scale.multiplyScalar(k);
    _esc.multiplyScalar(k);
    return mover(s, (W / 2 - x) * (_esc.x / 2) / (medio * k));        // y se centra en la pantalla
  }
  const dx = x - medio < margen ? margen - (x - medio) : x + medio > W - margen ? (W - margen) - (x + medio) : 0;   // píxeles hacia adentro
  if (dx) mover(s, dx * (_esc.x / 2) / medio);
}
function mover(s, metros) {   // corre la etiqueta `metros` hacia la derecha de la pantalla (negativo: a la izquierda)
  s.position.copy(s.parent.worldToLocal(_c.clone().addScaledVector(_der, metros)));
}
// vuelo desde lejos hasta un punto (curva con aleteo)
// El soporte de donde despega se queda y se desvanece; el del destino ya está esperando y crece al acercarse el ave.
function volar(a, destino, dur = 2.4, alLlegar, conSoporte = true) {
  quitarSoporte(a);
  if (conSoporte) destino = sitioLibre(destino, radioSoporte(a.esp), enElSuelo(a.esp), a);   // un punto donde el soporte no pise nada
  const desde = a.obj.position.clone();
  const medio = desde.clone().lerp(destino, 0.5).add(new THREE.Vector3(0, 1.6, 0));
  a.vuelo = { desde, medio, destino: destino.clone(), t0: reloj.elapsedTime, dur, alLlegar };
  if (conSoporte) {
    const pose = new THREE.Object3D();   // el ave tal como quedará posada: en el destino y mirando a la cámara
    pose.position.copy(destino);
    mirarCamara(pose, a.esp);
    ponerSoporte(a, pose, true);
  }
  Sonido.aleteo(Math.sin(rumbo()) * 0.5);
}
function llegarVolando(id, destino, alLlegar) {
  const az = rumbo() + (Math.random() < 0.5 ? -1 : 1) * (0.7 + Math.random() * 0.5);
  const a = agregarAve(id, direccion(az, 0.45, 9), { sinSoporte: true });
  volar(a, destino, 2.4, alLlegar);
  return a;
}
function irse(a) {
  a.saliendo = true;
  const lejos = a.obj.position.clone().setY(a.obj.position.y + 6).multiplyScalar(2.5);
  volar(a, lejos, 1.6, () => quitarAve(a), false);
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

// Registra el ave en la libreta la primera vez que se toca, en cualquier modo menos el quiz (ahí el nombre sería la respuesta).
function registrarAve(a) {
  if (a.registrada) return;
  a.registrada = true;
  ponerEtiqueta(a);
  lib()?.registrar(a.esp.id);
  Sonido.registro();
  const total = lib()?.total() || 0;
  aviso(`<strong>¡${a.esp.nombre} registrad${fem(a.esp) ? "a" : "o"}!</strong> Libreta: ${total}/${E.length}`);
}

// ------------------------------------------------------------------ modos
const MODOS = {
  avistar: {
    titulo: "Avistar", ayuda: "Mueve el celular y busca aves a tu alrededor. Toca un ave para registrarla en tu libreta.",
    entrar() {
      limpiarAves();
      // las 12 aves a la vez, repartidas en dos anillos alrededor (cerca y un poco más lejos) y sin pisarse; primero se acomodan las de soporte más grande
      const lista = E.slice().sort(() => Math.random() - 0.5);
      const r0 = rumbo();
      lista.map((e, i) => ({ e, i })).sort((a, b) => radioSoporte(b.e) - radioSoporte(a.e)).forEach(({ e, i }) => {
        const az = r0 + 0.2 + i * (Math.PI * 2 / lista.length) + (Math.random() - 0.5) * 0.18;
        const suelo = enElSuelo(e), lejos = i % 2 === 1;
        const d = (suelo ? 3.4 : 3.6) + (lejos ? 2 : 0);
        const el = suelo ? Math.asin(-1.07 / d) : -0.05 + Math.random() * 0.32;
        agregarAve(e.id, sitioLibre(direccion(az, el, d), radioSoporte(e), suelo, null));
      });
    },
    tocar(a) {
      hacerCantar(a);
      aletear(a.obj, reloj.elapsedTime, 0.5);
      registrarAve(a);
      window.FichaRA?.(a.esp);
    }
  },
  binoculares: {
    titulo: "Binoculares", ayuda: "Apunta al centro de un ave para ver de cerca sus marcas de identificación.",
    entrar() { if (!aves.size) MODOS.avistar.entrar(); fovObjetivo = FOV_ZOOM; document.body.classList.add("ra-zoom"); },
    salir() { fovObjetivo = FOV; document.body.classList.remove("ra-zoom"); $("#ra-marcas").innerHTML = ""; },
    tocar(a) { hacerCantar(a); registrarAve(a); }
  },
  llamar: {
    titulo: "Llamar", ayuda: "Elige un canto: el ave que lo reconoce vendrá volando y te responderá.",
    entrar() { abrirPanel("llamar"); },
    salir() { cerrarPanel(); },
    tocar(a) { hacerCantar(a); registrarAve(a); }
  },
  comedero: {
    titulo: "Comedero", ayuda: "Pon alimento frente a ti y descubre qué aves llegan a comer.",
    entrar() { limpiarAves(); abrirPanel("comedero"); },
    salir() { cerrarPanel(); },
    tocar(a) { hacerCantar(a); registrarAve(a); window.FichaRA?.(a.esp); }
  },
  foto: {
    titulo: "Foto", ayuda: "Encuadra un ave y toma tu foto de campo.",
    entrar() { if (!aves.size) MODOS.avistar.entrar(); $("#ra-obturador").hidden = false; },
    salir() { $("#ra-obturador").hidden = true; },
    tocar(a) { hacerCantar(a); registrarAve(a); }
  },
  quiz: {
    titulo: "Quiz RA", ayuda: "Lee la pregunta y toca la respuesta correcta. Tienes dos vidas.",
    entrar() { limpiarAves(); iniciarQuiz(); },
    salir() { if (quiz?.aciertos) lib()?.quiz(quiz.aciertos); quiz = null; limpiarAves(); $("#ra-pregunta").hidden = true; },   // si se sale a medias, se guarda lo conseguido
    tocar(a) { responderQuiz(a); }
  }
};

export function cambiarModo(m) {
  if (!MODOS[m]) return;
  MODOS[modo]?.salir?.();
  cancelarPendientes();
  modo = m;
  $("#ra-ficha").hidden = true;                                  // la ficha de un ave no se queda tapando la foto, el quiz o el comedero
  document.body.classList.toggle("ra-en-quiz", m === "quiz");    // en el quiz se esconde el botón de tamaño real: taparía la pregunta
  document.querySelectorAll(".ra-modo").forEach(b => b.classList.toggle("activo", b.dataset.modo === m));
  $("#ra-titulo").textContent = MODOS[m].titulo;
  aviso(MODOS[m].ayuda, 3800, m === "quiz");
  MODOS[m].entrar();
  Sonido.clic();
}

// ---------------- paneles inferiores (llamar / comedero)
function abrirPanel(cual) {
  const p = $("#ra-panel");
  if (cual === "llamar") {
    p.innerHTML = `<p class="ra-panel-nota">Toca un canto y el ave que lo reconoce vendrá volando. En la vida real, reproducir cantos grabados muy seguido puede estresar a las aves.</p>
      <div class="ra-panel-lista">${E.map(e => `<button data-llamar="${e.id}"><img src="img/aves/${e.id}.png" alt="">${e.nombre}</button>`).join("")}</div>`;
  } else {
    const items = [["flores", "flor", "Flores"], ["frutas", "fruta", "Frutas"], ["agua", "agua", "Agua"], ["pasto", "pasto", "Pasto"], ["insectos", "insecto", "Insectos"]];
    p.innerHTML = `<p class="ra-panel-nota">¿Qué pones en el comedero?</p><div class="ra-panel-lista">${items.map(([k, ic, n]) => `<button data-comida="${k}"><b><svg class="ico"><use href="#i-${ic}"/></svg></b>${n}</button>`).join("")}</div>`;
  }
  p.hidden = false;
}
function cerrarPanel() { $("#ra-panel").hidden = true; }

// Deja espacio para un ave nueva: si ya hay MAX_AVES, la más antigua (la primera de la lista) se va volando.
function hacerLugar() {
  const activas = [...aves.values()].filter(a => !a.saliendo);
  activas.slice(0, Math.max(0, activas.length - MAX_AVES + 1)).forEach(irse);
}

function llamar(id) {
  Sonido.cantar(porId[id].canto, 0.9);
  aviso(`Reproduciendo el canto de${fem(porId[id]) ? " la" : "l"} <strong>${porId[id].nombre}</strong>…`);
  const destino = direccion(rumbo() + (Math.random() - 0.5) * 0.4, porId[id].soporte === "pasto" || porId[id].soporte === "agua" ? -0.3 : 0.02, 3);
  cancelar(llamadas.get(id));          // si se toca el mismo canto otra vez antes de que llegue el ave, solo cuenta la última vez
  llamadas.set(id, despues(() => {
    llamadas.delete(id);
    const llega = a => { mirarCamara(a.obj, a.esp); hacerCantar(a); aviso(`<strong>¡${fem(a.esp) ? "La" : "El"} ${a.esp.nombre} respondió!</strong> Tóca${fem(a.esp) ? "la" : "lo"} para registrar${fem(a.esp) ? "la" : "lo"}.`); };
    const existente = [...aves.values()].find(a => a.esp.id === id && !a.saliendo);   // se busca al llegar la hora, no al tocar
    if (existente) volar(existente, destino, 2, () => llega(existente));
    else { hacerLugar(); llegarVolando(id, destino, a => llega(a)); }
  }, 1100));
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
  const candidatas = E.filter(e => e.comida.includes(tipo)).sort(() => Math.random() - 0.5).slice(0, 2);
  const { centro: pos, sitios } = sitioComedero(rumbo(), RADIO_COMIDA[tipo], candidatas);
  const item = crearComida(tipo);
  item.name = "comida-" + tipo;
  item.userData.radio = RADIO_COMIDA[tipo];
  item.position.copy(pos);
  raiz.add(item);
  objetos.push(item);
  Sonido.clic();
  candidatas.forEach((e, i) => {
    despues(() => llegarVolando(e.id, sitios[i], a => { mirarCamara(a.obj, a.esp); hacerCantar(a); }), 900 + i * 1300);
  });
  const nombres = candidatas.map(e => e.nombre).join(" y ");
  const textos = { flores: "Las flores ofrecen néctar", frutas: "Las frutas atraen a las aves frugívoras", agua: "El agua atrae a las aves de humedal", pasto: "En el pasto buscan lombrices e insectos", insectos: "Los insectos atraen a los atrapamoscas" };
  despues(() => aviso(`${textos[tipo]}: llegan <strong>${nombres}</strong>.`, 4200), 1200);
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
  // franja de abajo: el tamaño de la letra sale del ancho (en una foto vertical de celular la altura la hacía enorme);
  // si el título y la fecha no caben en una línea, la fecha pasa a una segunda línea
  const titulo = "Aves UAO - Aves del campus", fecha = new Date().toLocaleDateString("es-CO");
  const margen = w * 0.04, px = Math.round(Math.min(h * 0.028, w * 0.045));
  g.font = `700 ${px}px Inter, sans-serif`;
  const unaLinea = g.measureText(titulo).width + g.measureText(fecha).width + margen * 3 <= w;
  const barra = Math.round(px * (unaLinea ? 2.6 : 4.2));
  g.fillStyle = "rgba(14,38,33,.75)";
  g.fillRect(0, h - barra, w, barra);
  g.textAlign = "left";
  g.textBaseline = "middle";
  g.fillStyle = "#F2A541";
  g.fillText(titulo, margen, unaLinea ? h - barra / 2 : h - barra * 0.7);
  g.fillStyle = "#fff";
  if (unaLinea) { g.textAlign = "right"; g.fillText(fecha, w - margen, h - barra / 2); }
  else g.fillText(fecha, margen, h - barra * 0.28);
  const url = cv.toDataURL("image/jpeg", 0.82);
  Sonido.obturador();
  const fl = $("#ra-flash");
  fl.classList.remove("ver"); void fl.offsetWidth; fl.classList.add("ver");
  lib()?.foto(url);
  [...aves.values()].forEach(a => aletear(a.obj, reloj.elapsedTime, 0.4));
  aviso(`<strong>¡Foto guardada en tu libreta!</strong> <a href="${url}" download="aves-uao.jpg">Descargar</a>`, 4500);
}

// ---------------- quiz
// Reto de hasta 20 preguntas con 2 vidas: se acaba al segundo error o al llegar a 20. Las preguntas se mezclan en ciclos:
// aves (nombre, pista o canto, con 3 aves que llegan volando), entorno UAO y ecología de las aves (tarjetas flotantes o alimentos en 3D).
// Las de entorno y ecología muestran un dato curioso al responder y dejan tiempo para leerlo.
const TOPE_QUIZ = 20, VIDAS_QUIZ = 2, ACIERTOS_GUARDIAN = 10;
let opcionesQuiz = [];            // opciones 3D (tarjetas o alimentos) de la pregunta actual: { g, zona, visual, alto, ok }
const NOMBRE_COMIDA = { flores: "Flores", frutas: "Frutas", insectos: "Insectos" };

// Preguntas del entorno UAO (aprobadas por Hugo). mal = las dos respuestas incorrectas.
const PREGUNTAS_CAMPUS = [
  { p: "¿Cuántas especies de aves se han registrado en el campus?", ok: "84 especies", mal: ["48 especies", "120 especies"], dato: "Pertenecen a 30 familias y 77 géneros, según los monitoreos hechos en el campus." },
  { p: "¿Qué parte del campus son zonas verdes y jardines?", ok: "45,5 %", mal: ["15 %", "30 %"], dato: "Son el comedor, el dormitorio y el nido de muchas aves." },
  { p: "¿Qué hacen las aves en los jardines y árboles del campus?", ok: "Residen, se alimentan, duermen y se reproducen", mal: ["Solo pasan de largo", "Solo toman agua"], dato: "Por eso cuidar los árboles y jardines es cuidar a las aves." },
  { p: "¿A qué hora se ven más aves activas?", ok: "Al amanecer", mal: ["Al mediodía", "De noche"], dato: "Después del amanecer cantan y buscan alimento: es la mejor hora para avistar." },
  { p: "¿Cuál de estas aves del campus llega del norte del continente a pasar el invierno?", ok: "Piranga abejera", mal: ["Bichofué", "Garrapatero"], dato: "Es migratoria. También llegan el zorzal buchipecoso, la reinita dorada y el cuco americano." },
  { p: "¿Desde qué año se hacen jornadas de monitoreo de aves en el campus?", ok: "2019", mal: ["2010", "2023"], dato: "Desde 2019 se hacen jornadas de monitoreo para conocer la riqueza de aves del campus." },
  { p: "¿Cuántos edificios de aulas tiene el campus?", ok: "4", mal: ["3", "6"], dato: "Son las Aulas 1, 2, 3 y 4." }
];
// Dónde viven y cómo se comportan las aves de la RA (datos de las fichas de la guía)
const PREGUNTAS_HABITAT = [
  { id: "pellar", p: "¿Dónde vive el pellar?", ok: "En prados y zonas abiertas", mal: ["En el interior del bosque", "Sobre el agua"], dato: "Vive en pares o grupos, y su llamada áspera y fuerte delata su presencia." },
  { id: "pechirrojo", p: "¿Dónde se posa el pechirrojo?", ok: "En cercas y postes", mal: ["En el suelo del bosque", "En huecos de troncos"], dato: "Desde ahí vigila y caza insectos." },
  { id: "azulejo", p: "¿Dónde se posa el azulejo común?", ok: "En cables y en la parte alta de los árboles", mal: ["En el suelo", "Dentro de cuevas"], dato: "Es común en pueblos, jardines y campos con árboles grandes." },
  { id: "garza", p: "¿A quién sigue la garza de ganado para atrapar insectos?", ok: "Al ganado o a las podadoras", mal: ["A los peces del lago", "A otras garzas"], dato: "Atrapa los insectos que el ganado o las podadoras espantan." },
  { id: "garrapatero", p: "¿Cómo anda el garrapatero?", ok: "En pequeñas bandadas, en matorrales y bordes de bosque", mal: ["Solo, en lo alto de las palmas", "En parejas sobre el agua"], dato: "Es todo negro, con la cola larga y el pico grueso y curvo." },
  { id: "carpintero", p: "¿Dónde es común el carpintero habado?", ok: "En bosques abiertos y jardines", mal: ["En el agua de los lagos", "Solo en zonas de páramo"], dato: "El macho tiene el rojo hasta la corona." },
  { id: "colibri", p: "¿Dónde prefiere estar el colibrí colirrufo?", ok: "En bordes de bosque, vegetación secundaria y jardines", mal: ["En cuevas oscuras", "En el fondo de los humedales"], dato: "Suele visitar comederos." },
  { id: "siriri", p: "¿Dónde vive el sirirí común?", ok: "En zonas abiertas con árboles, parques y barrios", mal: ["Solo en el interior de la selva", "Solo sobre el agua"], dato: "Es un atrapamoscas grande; sus gorjeos agudos lo distinguen." },
  { id: "mirla", p: "¿Dónde es común la mirla ollera?", ok: "En hábitats abiertos y arboledas", mal: ["En el interior de cavernas", "Sobre rocas de montaña"], dato: "Su canto es una serie de frases musicales." },
  { id: "periquito", p: "¿A dónde van los periquitos bronceados?", ok: "A los árboles en flor o con frutos", mal: ["A dormir en los cables de luz", "Al pasto a buscar lombrices"], dato: "Van en parejas o en parvadas pequeñas, y vuelan muy rápido." }
];
// Qué comen: las opciones salen como alimentos en 3D (flores, frutas e insectos)
const PREGUNTAS_DIETA = [
  { id: "colibri", p: "¿De qué se alimenta el colibrí colirrufo?", ok: "flores", dato: "Los colibríes toman el néctar de las flores." },
  { id: "pechirrojo", p: "¿Qué come el pechirrojo?", ok: "insectos", dato: "Se posa en cercas y postes para cazar insectos." },
  { id: "azulejo", p: "¿Qué come el azulejo común?", ok: "frutas", dato: "Come frutas en la parte alta y media de los árboles." },
  { id: "garza", p: "¿Qué atrapa la garza de ganado cuando sigue al ganado?", ok: "insectos", dato: "Atrapa los insectos que el ganado espanta al caminar." },
  { id: "siriri", p: "¿Qué caza el sirirí, un atrapamoscas?", ok: "insectos", dato: "Atrapa insectos al vuelo." },
  { id: "loro", p: "¿Qué come el loro cabeciazul?", ok: "frutas", dato: "Los loros se alimentan sobre todo de frutos y semillas." }
];

const barajar = a => a.slice().sort(() => Math.random() - 0.5);

// Arma las 20 preguntas de una partida: ciclos de aves, entorno UAO, aves, ecología, entorno, aves; sin repetir y sin la misma ave dos veces seguidas
function armarMazo() {
  const piscinas = {
    ave: barajar(E.flatMap(e => [0, 1, 2].map(sub => ({ tipo: "ave", grupo: "ave", esp: e, sub })))),
    campus: barajar(PREGUNTAS_CAMPUS.map(x => ({ tipo: "tarjetas", grupo: "campus", ...x }))),
    eco: barajar([...PREGUNTAS_HABITAT.map(x => ({ tipo: "tarjetas", grupo: "eco", ...x })), ...PREGUNTAS_DIETA.map(x => ({ tipo: "dieta", grupo: "eco", ...x }))])
  };
  const patron = ["ave", "campus", "eco", "ave", "campus", "ave"];
  const mazo = [];
  let ultima = null;
  for (let i = 0; i < TOPE_QUIZ; i++) {
    let lista = piscinas[patron[i % patron.length]];
    if (!lista.length) lista = Object.values(piscinas).find(l => l.length);
    if (!lista) break;
    let j = lista.findIndex(q => (q.esp?.id ?? q.id ?? null) !== ultima || (q.esp?.id ?? q.id ?? null) === null);
    if (j < 0) j = 0;
    const q = lista.splice(j, 1)[0];
    ultima = q.esp?.id ?? q.id ?? null;
    mazo.push(q);
  }
  return mazo;
}

function iniciarQuiz() {
  quiz = { n: 0, aciertos: 0, vidas: VIDAS_QUIZ, mazo: armarMazo(), bloqueado: false, actual: null, texto: "" };
  rondaQuiz();
}
function encabezadoQuiz() {
  const q = quiz;
  const corazones = Array.from({ length: VIDAS_QUIZ }, (_, i) => `<svg class="ico vida${i >= q.vidas ? " perdida" : ""}"><use href="#i-corazon"/></svg>`).join("");
  return `<small>Pregunta ${Math.min(q.n + 1, TOPE_QUIZ)}/${TOPE_QUIZ} - Aciertos ${q.aciertos} <span class="vidas" aria-label="Vidas: ${q.vidas}">${corazones}</span></small>`;
}
function pintarPregunta(dato = "", veredicto = null) {
  const el = $("#ra-pregunta");
  el.hidden = false;
  el.innerHTML = encabezadoQuiz() + quiz.texto
    + (veredicto === null ? "" : `<p class="ra-veredicto ${veredicto ? "ok" : "mal"}">${veredicto ? "¡Correcto!" : "Incorrecto"}</p>`)
    + (dato ? `<p class="ra-dato">${dato}</p>` : "");
  const oir = $("#ra-quiz-oir");
  if (oir) oir.onclick = () => Sonido.cantar(quiz.actual.esp.canto, 1);
}
function limpiarOpciones() {
  opcionesQuiz.forEach(o => { raiz.remove(o.g); o.g.traverse(m => { m.material?.map?.dispose(); m.material?.dispose?.(); }); });
  opcionesQuiz = [];
}
function ponerOpcion(o, pos) {
  o.g.position.copy(pos);
  raiz.add(o.g);
  opcionesQuiz.push(o);
}
function opcionTarjeta(texto, ok) {
  const g = new THREE.Group();
  const visual = tarjeta(texto);
  g.add(visual);
  return { g, zona: visual, visual, alto: 0.75, ok };
}
function opcionComida(tipo, ok) {
  const g = new THREE.Group();
  const item = crearComida(tipo);
  item.scale.setScalar(1.05);
  item.userData.bichos?.forEach((b, i) => b.position.set(Math.sin(i * 2) * 0.25, 0.5 + Math.sin(i * 3) * 0.15, Math.cos(i * 2) * 0.25));
  g.add(item);
  const zona = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  zona.position.y = 0.3;
  g.add(zona);
  const rotulo = etiqueta(NOMBRE_COMIDA[tipo]);
  rotulo.scale.multiplyScalar(0.45);
  rotulo.position.set(0, 0.9, 0);
  g.add(rotulo);
  return { g, zona, visual: null, alto: 1.05, ok };
}

function rondaQuiz() {
  [...aves.values()].forEach(irse);
  limpiarOpciones();
  const q = quiz;
  if (q.vidas <= 0 || q.n >= q.mazo.length) return finQuiz();
  const preg = q.mazo[q.n];
  q.actual = preg;
  q.bloqueado = false;
  const r0 = rumbo();
  if (preg.tipo === "ave") {
    const objetivo = preg.esp;
    const otras = barajar(E.filter(e => e !== objetivo)).slice(0, 2);
    const opciones = barajar([objetivo, ...otras]);
    if (preg.sub === 0) q.texto = `¿Cuál es ${fem(objetivo) ? "la" : "el"} <strong>${objetivo.nombre}</strong>?`;
    else if (preg.sub === 1) q.texto = `¿Quién es? <em>${objetivo.pistas[Math.floor(Math.random() * objetivo.pistas.length)]}</em>`;
    else q.texto = `¿Quién canta así? <button id="ra-quiz-oir"><svg class="ico"><use href="#i-play"/></svg> Oír</button>`;
    pintarPregunta();
    if (preg.sub === 2) despues(() => Sonido.cantar(objetivo.canto, 1), 1500);
    despues(() => {
      opciones.forEach((e, i) => {
        const az = r0 + (i - 1) * 0.55;
        const suelo = e.soporte === "pasto" || e.soporte === "agua";
        despues(() => llegarVolando(e.id, direccion(az, suelo ? -0.28 : 0.05, 3.3), a => { mirarCamara(a.obj, a.esp); a.quiz = true; }), i * 350);
      });
    }, 600);
    return;
  }
  q.texto = preg.p;
  pintarPregunta();
  despues(() => {
    const opciones = preg.tipo === "dieta"
      ? barajar(["flores", "frutas", "insectos"]).map(t => opcionComida(t, t === preg.ok))
      : barajar([opcionTarjeta(preg.ok, true), ...preg.mal.map(t => opcionTarjeta(t, false))]);
    // tarjetas: una sobre otra, así en un celular vertical se ven las tres sin girar; alimentos: en fila, juntos
    opciones.forEach((o, i) => despues(() => {
      const pos = preg.tipo === "dieta" ? direccion(r0 + (i - 1) * 0.17, -0.2, 4.2) : direccion(r0, 0, 3.3).add(new THREE.Vector3(0, (1 - i) * 0.86 - 0.2, 0));
      ponerOpcion(o, pos);
    }, i * 250));
  }, 600);
}

// Cierra una pregunta: cuenta el acierto o quita una vida, muestra el dato curioso (si lo hay) y pasa a la siguiente cuando da tiempo de leerlo
function resolverPregunta(bien, dato = "") {
  const q = quiz;
  q.bloqueado = true;
  if (bien) q.aciertos++; else q.vidas--;
  q.n++;
  pintarPregunta(dato, dato ? bien : null);   // en las preguntas de aves el veredicto va en la etiqueta del ave
  despues(rondaQuiz, dato ? Math.min(7500, 2200 + dato.length * 45) : 2600);
}
function finQuiz() {
  const q = quiz;
  const guardian = q.aciertos >= ACIERTOS_GUARDIAN;
  const motivo = q.vidas <= 0 ? "Se acabaron las vidas." : `¡Completaste las ${TOPE_QUIZ} preguntas!`;
  $("#ra-pregunta").innerHTML = `<b>${q.aciertos}</b> aciertos. ${motivo} ${guardian ? "¡Eres un <strong>Guardián de las Aves UAO</strong>! <svg class=\"ico\"><use href=\"#i-medalla\"/></svg>" : `Consigue ${ACIERTOS_GUARDIAN} para ser Guardián.`}
    <button id="ra-quiz-otra">Jugar otra vez</button>`;
  $("#ra-quiz-otra").onclick = () => { limpiarAves(); iniciarQuiz(); };
  lib()?.quiz(q.aciertos);
  if (guardian) { Sonido.exito(); confeti(direccion(rumbo(), 0.1, 2.5)); }
}
function responderQuiz(a) {
  const q = quiz;
  if (!q || q.bloqueado || !a.quiz || q.actual?.tipo !== "ave") return;
  q.bloqueado = true;
  const bien = a.esp === q.actual.esp;
  if (bien) {
    celebrar(a.obj, reloj.elapsedTime);
    hacerCantar(a);
    confeti(a.obj.position.clone().add(new THREE.Vector3(0, 0.5, 0)));
    Sonido.exito();
    ponerEtiqueta(a, "¡Correcto!\n" + a.esp.nombre, "#8EE68E");
  } else {
    Sonido.error();
    ponerEtiqueta(a, a.esp.nombre, "#E4673E");
    const ok = [...aves.values()].find(x => x.esp === q.actual.esp);
    if (ok) { ponerEtiqueta(ok, "Era:\n" + ok.esp.nombre, "#8EE68E"); celebrar(ok.obj, reloj.elapsedTime); }
  }
  resolverPregunta(bien);
}
// Respuesta tocando una tarjeta o un alimento 3D
function responderOpcion(o) {
  const q = quiz;
  if (!q || q.bloqueado || q.actual?.tipo === "ave") return;
  const bien = !!o.ok;
  const marcar = (op, ok) => {                   // la tarjeta se tiñe de verde o rojo; el alimento recibe una etiqueta
    if (op.visual) { op.visual.material.color.set(ok ? "#C6F0C6" : "#F6C2B5"); return; }
    const r = etiqueta(ok ? "¡Correcto!" : "Incorrecto", ok ? "#8EE68E" : "#E4673E");
    r.position.set(0, op.alto + 0.1, 0);
    op.g.add(r);
  };
  marcar(o, bien);
  if (!bien) { const buena = opcionesQuiz.find(x => x.ok); if (buena) { marcar(buena, true); } }
  if (bien) { confeti(o.g.position.clone().add(new THREE.Vector3(0, 0.6, 0))); Sonido.exito(); } else Sonido.error();
  resolverPregunta(bien, q.actual.dato);
}
function tocarOpcionQuiz(x, y) {
  if (!opcionesQuiz.length) return;
  ray.setFromCamera(new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1), camera);
  const hit = ray.intersectObjects(opcionesQuiz.map(o => o.zona), false)[0];
  const o = hit && opcionesQuiz.find(op => op.zona === hit.object);
  if (o) responderOpcion(o);
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
    if (enRecorrido) { recorrido.arrastrar(dx, dy); return; }       // en el recorrido, arrastrar = mirar alrededor
    if (!usandoGiro) {
      const k = (camera.fov / FOV) * 0.005;
      arrastre.yaw -= dx * k;
      arrastre.pitch = THREE.MathUtils.clamp(arrastre.pitch - dy * k, -1.2, 1.2);
    }
  });
  el.addEventListener("pointerup", e => {
    arrastre.activo = false;
    if (arrastre.movido > 12 || enRecorrido) return;
    const a = avePorPantalla(e.clientX, e.clientY);
    if (a) MODOS[modo].tocar?.(a);
    else if (modo === "quiz") tocarOpcionQuiz(e.clientX, e.clientY);
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
  // Cada marca es un punto sobre la parte del ave y un cartel al lado (hacia donde hay más sitio), unidos por una línea.
  // Solo se muestran las marcas que quedan dentro de la pantalla.
  const W = window.innerWidth, H = window.innerHeight;
  const puntos = [];
  for (const [parte, texto] of apuntada.esp.marcas) {
    const p = new THREE.Vector3();
    partes[parte].getWorldPosition(p);
    if (desplaz[parte]) p.add(desplaz[parte].clone().multiplyScalar(apuntada.esp.escala).applyQuaternion(apuntada.obj.quaternion));
    p.project(camera);
    const x = (p.x * 0.5 + 0.5) * W, y = (-p.y * 0.5 + 0.5) * H;
    if (p.z < 1 && x > 8 && x < W - 8 && y > 90 && y < H - 110) puntos.push({ texto, x, y, der: x < W / 2 });
  }
  caja.innerHTML = `<svg class="marcas-lineas"></svg>`
    + puntos.map(m => `<div class="marca" style="left:${m.x}px;top:${m.y}px"><i></i></div>`).join("")
    + puntos.map(m => `<span class="marca-texto" style="${m.der ? `left:${m.x + 18}` : `right:${W - m.x + 18}`}px;top:${m.y}px;max-width:${Math.min(250, m.der ? W - m.x - 26 : m.x - 26)}px">${m.texto}</span>`).join("")
    + `<div class="marca-nombre">${apuntada.esp.nombre} <em>(${apuntada.esp.cientifico})</em></div>`;
  // los carteles se bajan lo necesario para no pisarse entre sí ni pisar el radar, y se mantienen entre la barra de arriba y el nombre del ave
  const r = $("#ra-radar").getBoundingClientRect();
  const ocupado = [{ l: r.left - 4, r: r.right + 4, t: r.top - 4, b: r.bottom + 4 }];
  const carteles = [...caja.querySelectorAll(".marca-texto")].map((el, i) => ({ el, m: puntos[i], r: el.getBoundingClientRect() })).sort((a, b) => a.m.y - b.m.y);
  carteles.forEach(o => {                                      // de arriba hacia abajo: cada cartel baja hasta no pisar a los anteriores
    o.h = o.r.height;
    o.top = o.m.y - o.h / 2;
    for (let n = 0; n < 8; n++) {
      const choca = ocupado.find(q => o.r.left < q.r && o.r.right > q.l && o.top < q.b + 6 && o.top + o.h + 6 > q.t);
      if (!choca) break;
      o.top = choca.b + 6;
    }
    ocupado.push({ l: o.r.left, r: o.r.right, t: o.top, b: o.top + o.h });
  });
  for (let i = carteles.length - 1; i >= 0; i--) {             // y de abajo hacia arriba: si se pasaron del nombre del ave, suben
    const o = carteles[i];
    let limite = H - 150;
    for (const p of carteles.slice(i + 1)) if (o.r.left < p.r.right && o.r.right > p.r.left) limite = Math.min(limite, p.top - 6);
    o.top = Math.max(92, Math.min(o.top, limite - o.h));
  }
  caja.firstChild.innerHTML = carteles.map(o => {
    o.el.style.top = o.top + "px";
    return `<line x1="${o.m.x}" y1="${o.m.y}" x2="${o.m.der ? o.r.left : o.r.right}" y2="${o.top + o.h / 2}"/>`;
  }).join("");
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

// ------------------------------------------------------------------ recorrido 3D por el campus
// La cinemática vive en recorrido.js y no toca nada de la RA: aquí solo se pausa la RA (se esconden las aves, el campus simulado y los
// controles) y se devuelve todo igual al terminar. Con giroscopio, mover el celular mira alrededor; si no, se arrastra.
async function iniciarRecorrido() {
  if (!activo || enRecorrido || cargandoRecorrido) return;
  if (modo === "quiz") { aviso("El recorrido no está disponible durante el quiz.", 2600, true); return; }
  cargandoRecorrido = true;
  aviso("Preparando el recorrido…", 4000);
  await new Promise(r => setTimeout(r, 80));          // deja que el aviso se pinte antes del trabajo pesado
  try {
    if (!recorrido) recorrido = crearRecorrido({ escena: scene, camara: camera, sonido: window.Sonido, alTerminar: finRecorrido });
    pixelAntes = renderer.getPixelRatio();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));    // el campus tiene más polígonos que la RA: un poco menos de píxeles para que corra suave
    renderer.setSize(window.innerWidth, window.innerHeight);
    $("#ra-ficha").hidden = true;
    $("#ra").classList.add("ra-en-recorrido");
    raiz.visible = false; simulado.visible = false;
    qInicioGiro.copy(qGiro); qRelSuave.identity();
    enRecorrido = true;
    recorrido.iniciar($("#ra"), usandoGiro ? "Mueve el celular o arrastra para mirar alrededor" : "Arrastra para mirar alrededor");
  } catch (e) {
    console.error("recorrido:", e);
    if (recorrido?.activo) recorrido.terminar(true); else finRecorrido(true);
    aviso("No se pudo iniciar el recorrido.", 3000);
  }
  cargandoRecorrido = false;
}
function finRecorrido(saltado) {
  enRecorrido = false;
  if (!renderer) return;
  renderer.setPixelRatio(pixelAntes);
  renderer.setSize(window.innerWidth, window.innerHeight);
  $("#ra").classList.remove("ra-en-recorrido");
  raiz.visible = true; simulado.visible = !usandoCamara;
  colaRecorrido.splice(0).forEach(fn => fn());          // lo que la RA tenía pendiente (llegadas de aves, etc.)
  if (activo) aviso(saltado ? "Recorrido omitido. Seguimos en la RA." : "Fin del recorrido. Seguimos en la RA.", 2600);
}
function cicloRecorrido() {
  const dt = Math.min(0.05, reloj.getDelta());
  let giro = null;
  if (usandoGiro) { qRelativo.copy(qInicioGiro).invert().multiply(qGiro); qRelSuave.slerp(qRelativo, 0.35); giro = qRelSuave; }
  try { recorrido.actualizar(dt, giro); }
  catch (e) { console.error("recorrido:", e); if (recorrido.activo) recorrido.terminar(true); else finRecorrido(true); }   // pase lo que pase, la RA no se queda congelada
  renderer.render(scene, camera);
}

function ciclo() {
  if (enRecorrido) { cicloRecorrido(); return; }
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
      if (a.soporte) a.soporte.scale.setScalar(a.soporte.userData.escala * THREE.MathUtils.smoothstep(k, 0.6, 1));   // el soporte del destino crece al acercarse el ave
      if (k >= 1) { a.vuelo = null; mirarCamara(a.obj, a.esp); v.alLlegar?.(a); }
    }
    animarAve(a.obj, t, dt);
  }
  // soportes sin ave: se encogen y se quitan
  for (let i = soportesSaliendo.length - 1; i >= 0; i--) {
    const s = soportesSaliendo[i], k = Math.min(1, (t - s.t0) / 0.4);
    s.g.scale.setScalar(s.desde * (1 - k));
    if (k >= 1) { raiz.remove(s.g); soportesSaliendo.splice(i, 1); }
  }
  if (simulado?.visible) simulado.userData.animar?.(t);   // fuente, nubes y mariposas del campus
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
  // etiquetas de las aves: que no se salgan de la pantalla
  camera.updateMatrixWorld();
  for (const a of aves.values()) mantenerEtiqueta(a);
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
    document.querySelectorAll(".ra-modo[data-modo]").forEach(b => b.addEventListener("click", () => cambiarModo(b.dataset.modo)));
    $("#ra-panel").addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.llamar) llamar(b.dataset.llamar);
      if (b.dataset.comida) comedero(b.dataset.comida);
    });
    $("#ra-obturador").addEventListener("click", tomarFoto);
    $("#ra-salir").addEventListener("click", salir);
    $("#ra-recentrar").addEventListener("click", () => { arrastre.yaw = arrastre.pitch = 0; cambiarModo(modo); });
    $("#ra-recorrido").addEventListener("click", iniciarRecorrido);
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
  const enPleno = enRecorrido;
  activo = false;
  if (enPleno) recorrido.terminar(true);              // si se sale en pleno recorrido, primero se cierra la cinemática
  MODOS[modo]?.salir?.();
  renderer?.setAnimationLoop(null);
  stream?.getTracks().forEach(t => t.stop());
  stream = null;
  limpiarAves();
  if (camera) { camera.fov = fovObjetivo = FOV; camera.updateProjectionMatrix(); }   // si se sale con los binoculares, la próxima vez no empieza con zoom
  if (video) video.style.transform = "";
  document.body.classList.remove("en-ra", "ra-zoom", "ra-simulado", "ra-en-quiz");
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
    if (aves.size >= MAX_AVES) quitarAve(aves.values().next().value);   // como en Llamar: la más antigua se va y no se acumulan
    const a = agregarAve(actual.id, new THREE.Vector3().setFromMatrixPosition(reticula.matrix), { sinSoporte: true });
    a.obj.scale.setScalar(actual.escala * 0.45);
    const cam = renderer.xr.getCamera();
    a.obj.lookAt(cam.position.x, a.obj.position.y, cam.position.z);
    ponerSoporte(a, a.obj);   // el soporte se pone ya con el tamaño y la orientación finales del ave
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
    tocarPrimera,
    iniciarRecorrido, recorridoActivo: () => enRecorrido, saltarRecorrido: () => recorrido?.terminar(true), camaraQ: () => camera.quaternion.toArray(),
    // responde la pregunta actual del quiz, bien o mal (ave, tarjeta o alimento); devuelve el tipo de pregunta o null si aún no hay opciones
    quizResponder: (bien = true) => {
      const q = quiz;
      if (!q || q.bloqueado || !q.actual) return null;
      if (q.actual.tipo === "ave") {
        const a = [...aves.values()].find(x => x.quiz && !x.vuelo && (x.esp === q.actual.esp) === bien);
        if (!a) return null;
        MODOS.quiz.tocar(a);
        return "ave";
      }
      const o = opcionesQuiz.find(x => !!x.ok === bien);
      if (!o || opcionesQuiz.length < 3) return null;
      responderOpcion(o);
      return q.actual.tipo;
    },
    tocarCorrecta: () => window.RA._prueba.quizResponder(true),
    mirarA: (i = 0, alto = 0.25, giro = 0) => { const a = [...aves.values()].filter(x => !x.vuelo)[i]; if (a) { arrastre.yaw = Math.atan2(a.obj.position.x, -a.obj.position.z) + giro; arrastre.pitch = -Math.asin((a.obj.position.y + alto) / a.obj.position.length()); } return a?.esp.id; },
    rendimiento: () => { renderer.render(scene, camera); return { llamadas: renderer.info.render.calls, triangulos: renderer.info.render.triangles }; },
    // soportes colocados (para comprobar que no pisan el camino, la fuente, bancas, etc.) y círculos que deben evitar
    soportes: () => [...aves.values()].filter(a => a.soporte).map(a => ({ id: a.esp.id, x: a.soporte.position.x, z: a.soporte.position.z, y: a.soporte.position.y, r: radioSoporte(a.esp), suelo: enElSuelo(a.esp) })),
    obstaculos: () => OBSTACULOS.map(o => ({ ...o })),
    // dónde quedan (en píxeles) los bordes izquierdo y derecho de cada etiqueta de ave
    etiquetas: () => { camera.updateMatrixWorld(); const d = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion), W = window.innerWidth;
      return [...aves.values()].filter(a => a.etiqueta).map(a => { const c = a.etiqueta.getWorldPosition(new THREE.Vector3()), e = a.etiqueta.getWorldScale(new THREE.Vector3()).x / 2, px = v => Math.round((v.project(camera).x * 0.5 + 0.5) * W);
        return { id: a.esp.id, izq: px(c.clone().addScaledVector(d, -e)), der: px(c.clone().addScaledVector(d, e)), ancho: W }; }); },
    estado: () => ({ modo, fov: camera?.fov, aves: [...aves.values()].map(a => ({ id: a.esp.id, vuelo: !!a.vuelo, reg: a.registrada, etiq: !!a.etiqueta })), quiz: quiz && { n: quiz.n, bloqueado: quiz.bloqueado, aciertos: quiz.aciertos, vidas: quiz.vidas, tipo: quiz.actual?.tipo, mazo: quiz.mazo.map(p => p.grupo), tipos: quiz.mazo.map(p => p.tipo), opciones: opcionesQuiz.length } })
  }
};
