// Une muchas mallas pequeñas en una sola para que el celular dibuje menos objetos por cuadro.
// Se unen las mallas del grupo que usan un material normal (sin textura, sin brillo propio y sin transparencia); su color pasa a
// colores por vértice, y la malla resultante queda dentro del mismo grupo (el grupo se sigue moviendo y animando igual).
// profundo: true = también las de los subgrupos (para cosas quietas como un árbol); false = solo las que cuelgan directamente
// del grupo (para partes de un ave, donde los subgrupos se animan por separado).
// material + soloGeometria: une cualquier malla en una sola con ese material (para las nubes).
import * as THREE from "three";

const v = new THREE.Vector3(), nv = new THREE.Vector3();

export function fusionar(grupo, { profundo = true, plano = true, rugosidad = 0.85, material = null } = {}) {
  grupo.updateMatrixWorld(true);
  const inversa = grupo.matrixWorld.clone().invert();
  const pos = [], nor = [], col = [], idx = [];
  const unidas = [];
  let base = 0;
  const uno = o => {
    if (!o.isMesh || o.isInstancedMesh || o.userData.sinFusion) return;
    const m = o.material;
    if (!material && !(m.isMeshStandardMaterial && !m.transparent && !m.map && m.emissive.getHex() === 0)) return;
    const g = o.geometry, p = g.attributes.position, n = g.attributes.normal;
    const mat4 = new THREE.Matrix4().multiplyMatrices(inversa, o.matrixWorld), mat3 = new THREE.Matrix3().getNormalMatrix(mat4);
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(mat4); pos.push(v.x, v.y, v.z);
      nv.fromBufferAttribute(n, i).applyMatrix3(mat3).normalize(); nor.push(nv.x, nv.y, nv.z);
      if (!material) col.push(m.color.r, m.color.g, m.color.b);
    }
    if (g.index) for (let i = 0; i < g.index.count; i++) idx.push(g.index.getX(i) + base);
    else for (let i = 0; i < p.count; i++) idx.push(i + base);
    base += p.count;
    unidas.push(o);
  };
  if (profundo) grupo.traverse(uno); else grupo.children.forEach(uno);
  if (unidas.length < 2) return null;
  unidas.forEach(o => o.parent.remove(o));
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geom.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  if (!material) geom.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  geom.setIndex(idx);
  const malla = new THREE.Mesh(geom, material || new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: plano, roughness: rugosidad, metalness: 0 }));
  grupo.add(malla);
  return malla;
}
