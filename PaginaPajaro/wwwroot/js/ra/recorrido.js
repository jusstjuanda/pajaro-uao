// Recorrido cinemático por el campus UAO: la cámara avanza sola por el campus (campus-real.js) mientras muchas aves vuelan alrededor.
// No se puede tocar nada: solo mirar alrededor arrastrando (o girando el celular) y «Saltar». Al terminar o saltar, devuelve el control
// a quien lo llamó (la RA retoma lo que estaba haciendo). No toca nada de la lógica de la RA: es un módulo aparte.
import * as THREE from "three";
import { crearCampusReal } from "./campus-real.js";

const DURACION = 108;                        // segundos
// Puntos por los que pasa la cámara y hacia dónde mira (x, y, z con y medida desde el nivel bajo del campus); el eje va de +z (Portería 1) a -z (Portería 3).
// Al norte (z > 42) el campus está 4,2 m más alto (Portería 1, Edificio Central y arco): ahí las alturas se suben solas con SUBE.
const SUBE = 4.2, BORDE = 42;
const PASOS_BASE = [
  [[0, 62, 240], [0, 8, 150]], [[0, 20, 190], [0, 6, 140]], [[0, 8.5, 160], [0, 6.5, 120]], [[0, 5.5, 128], [0, 6, 95]],
  [[0, 5, 100], [0, 7, 70]], [[0, 5, 76], [0, 6, 40]], [[0, 6, 52], [0, 8, 22]], [[0, 16, 32], [0, 0, 2]],
  [[-4, 36, 26], [0, 0, 2]], [[-44, 40, 8], [0, 2, 2]], [[-42, 38, -20], [0, 2, 0]], [[-12, 28, -46], [0, 4, -70]], [[0, 26, -66], [0, 5, -110]], [[34, 24, -78], [52, 0, -97]],
  [[66, 14, -90], [52, 1, -97]], [[40, 13, -114], [26, 3, -142]], [[26, 11, -124], [28, 2, -150]], [[3, 13, -138], [-2, 5, -178]], [[-1, 9, -166], [-3, 5, -200]],
  [[-3, 8, -194], [-4, 5, -232]], [[-14, 11, -236], [-4, 4, -198]], [[-6, 14, -260], [-4, 3, -305]], [[24, 20, -315], [-2, 0, -345]], [[62, 32, -295], [20, 0, -330]],
  [[90, 50, -240], [132, 0, -60]], [[0, 80, -150], [0, 4, -20]]
];
const PASOS = PASOS_BASE.map(([p, t]) => [[p[0], p[1] + (p[2] > BORDE ? SUBE : 0), p[2]], [t[0], t[1] + (t[2] > BORDE ? SUBE : 0), t[2]]]);
// Nombre del lugar según dónde va la cámara (así el rótulo coincide con lo que se ve aunque se cambie el trayecto)
function lugar(f, p) {
  if (f < 0.05) return "Recorrido por el campus UAO";
  if (f > 0.96) return "";
  if (p.x > 70 && p.z > -250) return "Las canchas";
  if (p.z > 135) return "Portería 1";
  if (p.z > 88) return "Edificio Central";
  if (p.z > 44) return "El Arco Central";
  if (p.z > 29) return "UAO Labs";
  if (p.z > -26) return "El Ágora y las palmas";
  if (p.x > 36 && p.z < -60 && p.z > -125) return "El lago";
  if (p.z > -118) return "Aulas 1, 2, 3 y 4";
  if (p.z > -183) return "La cafetería";
  if (p.z > -222) return "Portería 3";
  return "El parque y el parqueadero";
}
const PALETA = ["#3B2A1E", "#E0B52E", "#2E2E2E", "#3A5FA0", "#B8472F", "#8A6B3A", "#4E8B3C"];

// ---------- aves volando: tres mallas instanciadas (cuerpos y dos alas); las alas se mueven en cada cuadro
function crearBandadas(escena) {
  const grupos = [];
  const R = (a, b) => a + Math.random() * (b - a);
  const total = [];
  const add = (n, fn, opts = {}) => { for (let i = 0; i < n; i++) total.push({ guia: !!opts.guia, fn, i, n, fase: Math.random() * 6.28, esc: opts.esc ?? R(1.3, 2), color: opts.color ?? PALETA[Math.floor(Math.random() * PALETA.length)], aleteo: R(9, 13) * (opts.lento ? 0.7 : 1) }); };
  const orbita = (cx, cy, cz, r, v, dy = 4) => (t, i, n, f) => { const a = t * v + (i / n) * 6.28 + f * 0.15; const rr = r * (0.75 + 0.5 * ((i * 7919) % 100) / 100); return [cx + Math.cos(a) * rr, cy + Math.sin(t * 0.5 + f) * dy + ((i * 13) % 7), cz + Math.sin(a) * rr]; };
  const cruce = (A, B, vel) => (t, i, n, f) => { const u = ((t * vel + i / n + f * 0.02) % 1 + 1) % 1; return [A[0] + (B[0] - A[0]) * u + Math.sin(i * 3 + t) * 3, A[1] + (B[1] - A[1]) * u + Math.sin(t * 0.8 + i) * 2, A[2] + (B[2] - A[2]) * u + Math.cos(i * 2 + t) * 3]; };
  add(16, orbita(0, 34, 2, 34, 0.22, 6));                                        // sobre el Ágora y las palmas
  add(12, orbita(0, 32, 76, 30, -0.25, 4));                                       // alrededor del Arco Central
  add(14, cruce([-90, 24, 40], [90, 30, -120], 0.03));                            // cruzan el campus
  add(12, cruce([60, 20, -240], [-60, 26, 60], 0.025));
  add(9, orbita(52, 12, -97, 20, 0.3, 3), { color: "#F2F2EA", esc: 2, lento: true });   // garzas blancas sobre el lago
  add(10, orbita(24, 20, -158, 26, -0.28, 3));                                   // cafetería
  add(10, orbita(132, 20, -50, 44, 0.2, 5));                                     // canchas
  add(10, orbita(0, 24, -325, 42, 0.18, 4));                                      // parque y parqueadero
  const guia = { x: 0, y: 60, z: 225, dir: new THREE.Vector3(0, 0, -1) };          // bandada que acompaña a la cámara, delante y arriba
  add(12, (t, i) => [guia.x + Math.sin(i * 2.4 + t * 0.7) * 7, guia.y + 5 + Math.cos(i * 1.7 + t) * 2 + (i % 3), guia.z + Math.cos(i * 3.1 + t * 0.6) * 7 - (i % 4) * 2], { esc: 1.7, guia: true });
  grupos.push(...total);
  const N = grupos.length;
  const cuerpoGeo = new THREE.IcosahedronGeometry(0.22, 0).scale(0.6, 0.6, 1.4);
  const alaGeo = new THREE.BufferGeometry();
  alaGeo.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0.3, -1, 0, 0.05, 0, 0, -0.3, -1, 0, 0.05, -0.85, 0, -0.35, 0, 0, -0.3], 3));
  alaGeo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.8, flatShading: true, side: THREE.DoubleSide });
  const cuerpos = new THREE.InstancedMesh(cuerpoGeo, mat, N), alasI = new THREE.InstancedMesh(alaGeo, mat, N), alasD = new THREE.InstancedMesh(alaGeo.clone().scale(-1, 1, 1), mat, N);
  [cuerpos, alasI, alasD].forEach(m => { m.frustumCulled = false; escena.add(m); });
  grupos.forEach((b, i) => { const c = new THREE.Color(b.color); cuerpos.setColorAt(i, c); alasI.setColorAt(i, c.clone().multiplyScalar(0.85)); alasD.setColorAt(i, c.clone().multiplyScalar(0.85)); });
  const p = new THREE.Vector3(), q = new THREE.Quaternion(), e = new THREE.Euler(), esc = new THREE.Vector3(), m4 = new THREE.Matrix4(), mA = new THREE.Matrix4(), rz = new THREE.Matrix4(), tr = new THREE.Matrix4();
  const adelante = (fn, t, b) => fn(t + 0.05, b.i, b.n, b.fase);
  // extra: bandada que acompaña a la cámara, un poco adelante y arriba
  function actualizar(t, camPos) {
    const lista = grupos;
    for (let k = 0; k < N; k++) {
      const b = lista[k];
      const a = b.fn(t, b.i, b.n, b.fase), s = b.guia ? [a[0] + guia.dir.x, a[1] + guia.dir.y, a[2] + guia.dir.z] : adelante(b.fn, t, b);
      p.set(a[0], a[1], a[2]);
      const vx = s[0] - a[0], vy = s[1] - a[1], vz = s[2] - a[2];
      e.set(Math.atan2(-vy, Math.hypot(vx, vz)) * 0.8, Math.atan2(vx, vz), Math.sin(t * 1.3 + b.fase) * 0.35, "YXZ");
      q.setFromEuler(new THREE.Euler(e.x, e.y, e.z, "YXZ"));
      // las aves que pasan muy cerca de la cámara se encogen para no tapar la vista
      esc.setScalar(b.esc * (camPos ? 0.2 + 0.8 * THREE.MathUtils.smoothstep(p.distanceTo(camPos), 3, 14) : 1));
      m4.compose(p, q, esc);
      cuerpos.setMatrixAt(k, m4);
      const flap = Math.sin(t * b.aleteo + b.fase) * 0.8;
      tr.makeTranslation(-0.06, 0.02, 0.04); rz.makeRotationZ(flap);
      mA.copy(m4).multiply(tr).multiply(rz); alasI.setMatrixAt(k, mA);
      tr.makeTranslation(0.06, 0.02, 0.04); rz.makeRotationZ(-flap);
      mA.copy(m4).multiply(tr).multiply(rz); alasD.setMatrixAt(k, mA);
    }
    [cuerpos, alasI, alasD].forEach(m => { m.instanceMatrix.needsUpdate = true; });
  }
  return { actualizar, guia, cuerpos, alasI, alasD };
}

export function crearRecorrido({ escena, camara, alTerminar = () => {}, onSubtitulo = null, sonido = null }) {
  let campus = null, bandadas = null, ui = null;
  const curvaP = new THREE.CatmullRomCurve3(PASOS.map(p => new THREE.Vector3(...p[0])), false, "centripetal");
  const curvaT = new THREE.CatmullRomCurve3(PASOS.map(p => new THREE.Vector3(...p[1])), false, "centripetal");
  const est = { activo: false, t: 0, yaw: 0, pitch: 0, guardado: null, subt: "" };
  const qCam = new THREE.Quaternion(), mirar = new THREE.Matrix4(), arriba = new THREE.Vector3(0, 1, 0), ejeX = new THREE.Vector3(1, 0, 0), pos = new THREE.Vector3(), objetivo = new THREE.Vector3(), tmpQ = new THREE.Quaternion(), adelante = new THREE.Vector3();

  function crearInterfaz(ayuda) {
    const div = document.createElement("div");
    div.className = "ra-recorrido";
    div.innerHTML = `<p class="rec-titulo" aria-live="polite"></p><p class="rec-ayuda">${ayuda}</p><button class="rec-saltar" type="button">Saltar</button><div class="rec-barra"><i></i></div>`;
    div.querySelector(".rec-saltar").addEventListener("click", e => { e.stopPropagation(); terminar(true); });
    return div;
  }

  function iniciar(contenedor, ayuda = "Arrastra para mirar alrededor") {
    if (est.activo) return;
    if (!campus) {
      const evitar = [];                                                          // árboles lejos del camino de la cámara (no la atraviesan)
      for (let i = 0; i <= 120; i++) { const q = curvaP.getPointAt(i / 120); evitar.push([q.x, q.z, q.y < 22 ? 13 : q.y < 36 ? 7 : 0]); }
      campus = crearCampusReal({ evitar: evitar.filter(e => e[2] > 0) });
      bandadas = crearBandadas(escena);
    }
    est.guardado = { fog: escena.fog, far: camara.far, fov: camara.fov, pos: camara.position.clone(), quat: camara.quaternion.clone() };
    escena.fog = new THREE.Fog("#D9E6EE", 220, 820);
    camara.far = 2200; camara.fov = 66; camara.updateProjectionMatrix();
    escena.add(campus);
    bandadas.cuerpos.visible = bandadas.alasI.visible = bandadas.alasD.visible = true;
    ui = crearInterfaz(ayuda);
    (contenedor || document.body).appendChild(ui);
    est.activo = true; est.t = 0; est.yaw = 0; est.pitch = 0; est.subt = "";
    sonido?.ambiente?.(true);
  }

  function terminar(saltado = false) {
    if (!est.activo) return;
    est.activo = false;
    escena.remove(campus);
    bandadas.cuerpos.visible = bandadas.alasI.visible = bandadas.alasD.visible = false;
    escena.fog = est.guardado.fog; camara.far = est.guardado.far; camara.fov = est.guardado.fov; camara.updateProjectionMatrix();
    camara.position.copy(est.guardado.pos); camara.quaternion.copy(est.guardado.quat);
    ui?.remove(); ui = null;
    sonido?.ambiente?.(false);
    alTerminar(saltado);
  }

  function arrastrar(dx, dy) {                       // dx, dy en píxeles
    est.yaw -= dx * 0.005;
    est.pitch = THREE.MathUtils.clamp(est.pitch - dy * 0.005, -1.35, 1.35);
  }

  // un cuadro de la cinemática; giro = rotación extra opcional (giroscopio del celular, relativa al inicio)
  function actualizar(dt, giro = null) {
    if (!est.activo) return false;
    est.t += dt;
    const f = Math.min(1, est.t / DURACION);
    const u = THREE.MathUtils.smoothstep(f, 0, 0.04) * 0.04 + f * 0.92 + THREE.MathUtils.smoothstep(f, 0.96, 1) * 0.04;   // arranca y termina suave
    const tp = curvaP.getUtoTmapping(Math.min(0.999, u));         // velocidad constante por la posición; el punto de mira usa el mismo parámetro para ir siempre alineado
    curvaP.getPoint(tp, pos); curvaT.getPoint(tp, objetivo);
    camara.position.copy(pos);
    mirar.lookAt(pos, objetivo, arriba); qCam.setFromRotationMatrix(mirar);
    tmpQ.setFromAxisAngle(arriba, est.yaw);                      // girar a los lados en el eje vertical del mundo: el horizonte no se inclina
    camara.quaternion.copy(tmpQ).multiply(qCam);
    tmpQ.setFromAxisAngle(ejeX, est.pitch);
    camara.quaternion.multiply(tmpQ);
    if (giro) camara.quaternion.multiply(giro);
    // aves guía: delante y arriba de la cámara
    if (bandadas) {
      curvaP.getPoint(curvaP.getUtoTmapping(Math.min(0.999, u + 0.014)), adelante);
      bandadas.guia.x = adelante.x; bandadas.guia.y = adelante.y; bandadas.guia.z = adelante.z;
      bandadas.guia.dir.copy(adelante).sub(pos).normalize();
      bandadas.actualizar(est.t, pos);
    }
    campus.userData.animar?.(est.t);
    // subtítulo y barra de avance
    if (ui) {
      const txt = lugar(f, pos);
      if (txt !== est.subt) { est.subt = txt; ui.querySelector(".rec-titulo").textContent = txt; ui.querySelector(".rec-titulo").classList.toggle("ver", !!txt); onSubtitulo?.(txt); }
      ui.querySelector(".rec-barra i").style.width = (f * 100) + "%";
    }
    if (est.t >= DURACION) { terminar(false); return false; }
    return true;
  }

  return { iniciar, terminar, actualizar, arrastrar, get activo() { return est.activo; } };
}
