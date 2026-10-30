# 06 · El 3D desde cero: three.js, WebGL, escena, cámara y mallas

## Resumen en 1 minuto
Una pantalla es plana y está hecha de puntitos (**píxeles**). Para mostrar algo en 3D, el computador **fabrica una foto** de un mundo imaginario, 60 veces por segundo. Ese mundo se describe con **triángulos** (todo lo 3D está hecho de triángulos), y la **tarjeta gráfica** (GPU) los dibuja rapidísimo. **WebGL** es la tecnología que permite al navegador usar la GPU, y **three.js** es la librería que nos ahorra el trabajo difícil: con ella creamos una **escena**, ponemos **objetos**, una **cámara** y unas **luces**, y le decimos «dibuja». Las aves, los edificios y los campus de tu proyecto son **objetos de three.js construidos con código**.

---

## 1. Cómo se dibuja un mundo 3D en una pantalla plana
Imagina una **maqueta** de cartón y una **cámara** frente a ella. La cámara toma una foto: esa foto plana es lo que ves. Un programa 3D hace exactamente eso, pero con una maqueta **virtual** y una cámara **virtual**, y repite la «foto» **60 veces por segundo** para que parezca movimiento (como un flipbook).

## 2. Todo está hecho de triángulos
Un triángulo es la figura más simple que siempre es plana. Con muchos triángulos pequeños se «aproxima» cualquier forma: una esfera es una bola de triángulos; una caja son 12 triángulos (2 por cara). Esto se llama **malla** (*mesh*).
- **Low-poly** = pocos triángulos: se ven las facetas, es un estilo gráfico claro, y **pesa poco** (importante para celulares).
- La cinemática dibuja unos **200 mil** triángulos por cuadro; la GPU de un celular los maneja bien porque son formas simples.

## 3. La tarjeta gráfica y WebGL
- La **GPU** es un procesador especializado en dibujar miles de triángulos a la vez.
- **WebGL** es una **API del navegador** (un conjunto de «botones» que el navegador ofrece) para hablar con la GPU desde JavaScript. Escribir WebGL directo es largo y difícil.
- **three.js** es una **librería** (código hecho por otros) que envuelve WebGL y lo vuelve fácil: en vez de «dibuja estos números en esta memoria de la GPU», escribes «crea una esfera roja y ponla aquí».

## 4. El sistema de coordenadas: dónde está cada cosa
En 3D la posición de un punto son tres números `(x, y, z)`:
- **x** → izquierda ↔ derecha.
- **y** → abajo ↔ arriba.
- **z** → cerca ↔ lejos (en three.js, **+z viene hacia ti** y **−z se aleja**).

En tu proyecto: la **cámara está en el origen (0, 0, 0)** y **mira hacia −z**. Las aves se colocan a 3–6 metros alrededor. Las unidades son **«metros» inventados** (1 = 1 metro aproximado). Un ave mide ~0,4 de escala porque «raiz.scale.setScalar(e.escala || 0.4)».

## 5. Las cinco piezas de toda escena en three.js
Aprende estas cinco y entiendes el 3D del proyecto:

| Pieza | Qué es | Analogía de cine |
|---|---|---|
| **Escena** (`THREE.Scene`) | El espacio donde se pone todo | El plató |
| **Objetos** (`Mesh`, `Group`…) | Lo que hay en el plató | Utilería y actores |
| **Cámara** (`PerspectiveCamera`) | Desde dónde se mira | La cámara de cine |
| **Luces** | Qué ilumina | Los reflectores |
| **Renderizador** (`WebGLRenderer`) | Toma la «foto» y la pone en la pantalla | El que revela la película |

Código real de `ra.js` (al iniciar la RA):

```js
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
$("#ra-lienzo").appendChild(renderer.domElement);          // el <canvas> que crea three.js se mete en la página
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.05, 300);
scene.add(new THREE.HemisphereLight("#fff6e6", "#5d6b4a", 1.4));      // luz de cielo/tierra
const sol = new THREE.DirectionalLight("#fff1d6", 1.6); sol.position.set(4, 8, 3); scene.add(sol);   // luz de sol
```
Línea por línea:
1. Crea el **renderizador**: `antialias` suaviza los bordes dentados; **`alpha: true` = el fondo es transparente** (clave para la RA); `preserveDrawingBuffer` permite «fotografiar» el canvas (para la foto de campo).
2. `setPixelRatio`: cuántos píxeles reales por píxel de pantalla (los celulares modernos tienen 2–3; limitamos a 2 para no gastar de más).
3. `setSize`: el tamaño del lienzo = la pantalla.
4. `appendChild`: three.js crea un `<canvas>`; lo insertamos en el div `#ra-lienzo` del HTML.
5. `new THREE.Scene()`: la escena vacía.
6. **Cámara de perspectiva**: `FOV` = 62° (qué tan «abierta» es la lente; menor = zoom), la **relación de aspecto** (ancho/alto de la pantalla), y `0.05`–`300` = «solo dibuja lo que esté entre 5 cm y 300 m».
7. **Luces**: una **hemisférica** (luz suave de arriba y de abajo, como el cielo y el suelo) y una **direccional** (el sol, desde una dirección). Sin luces, todo se vería negro.

## 6. Mallas: geometría + material
Un objeto visible (`Mesh`) = **forma** + **aspecto**.

```js
const m = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 22, 16),                         // forma: esfera
  new THREE.MeshStandardMaterial({ color: "#F6CF1E", roughness: 0.6 })   // aspecto: amarillo mate
);
```
- **Geometría**: la forma. Las que usamos: `SphereGeometry` (esfera), `BoxGeometry` (caja), `CylinderGeometry` (cilindro), `ConeGeometry` (cono), `IcosahedronGeometry` (una «esfera» facetada de 20 caras, para follaje), `TubeGeometry` (un tubo que sigue una curva: el cuello de la garza), `TorusGeometry` (dona), `PlaneGeometry` (plano: el piso), `ExtrudeGeometry` (una forma 2D «inflada» a 3D: el arco con hueco y los techos).
- **Material**: el aspecto. `MeshStandardMaterial` reacciona a la luz de forma realista: `color`, `roughness` (qué tan **mate** o brillante: 1 = mate), `metalness` (qué tan metálico). `MeshBasicMaterial` **ignora** la luz (siempre se ve igual; se usa para el cielo).
- **`flatShading: true`** hace que cada cara plana se vea con su propio tono: el aspecto **facetado low-poly** del campus. En las aves está en `false` (más suave).

### ¿Qué es una textura?
Una **imagen** que se «pega» sobre una malla (como una calcomanía). En tu proyecto casi no usamos imágenes de archivo: **dibujamos las texturas con código** en un `<canvas>` 2D y se las damos a three.js (`CanvasTexture`). Ejemplos: el piso de **rombos** del campus, el logo «uao» en las porterías, los rótulos «AULAS 1», las etiquetas con los nombres de las aves.

## 7. Posición, rotación y escala
Todo objeto 3D tiene tres «perillas»:
```js
m.position.set(x, y, z);     // dónde está
m.rotation.set(rx, ry, rz);  // cuánto está girado (en radianes)
m.scale.set(sx, sy, sz);     // qué tan grande es en cada eje
```
**Truco clave del proyecto:** con la **escala** transformamos una esfera en cualquier cosa. Una esfera con `scale (0.85, 0.9, 1.25)` es un **cuerpo ovalado de ave**; con `scale (0.1, 0.62, 1.05)` es un **ala plana**. Con un cono muy delgado hacemos un **pico**.

## 8. Grupos: objetos que contienen objetos
Un `Group` es una **caja invisible** que agrupa objetos. Si mueves, giras o escalas el grupo, **todo lo de adentro lo sigue**. Así se arma un ave: un grupo «ave» contiene el «cuerpo», que contiene la «cabeza», el «pico», las «alas»… Si giras la cabeza, el pico gira con ella. Si mueves el ave, todo se mueve.

Pasa lo mismo con un campus: un edificio es un grupo con paredes, ventanas, techo, paneles solares.

## 9. Sprites: imágenes planas que siempre te miran
Un `Sprite` es una **imagen plana que siempre mira a la cámara** (nunca se ve de canto). Es lo único «2D» dentro del 3D. Lo usamos para:
- la **etiqueta con el nombre** sobre cada ave («Bichofué»),
- las **tarjetas de respuesta del quiz**,
- las **notas musicales** que salen cuando canta un ave.

Cada una se dibuja con código sobre un canvas 2D y se convierte en sprite. **Las aves NO son sprites**: son modelos 3D de verdad (puedes girar alrededor de ellas).

## 10. El bucle de dibujo
Para que el 3D «se mueva» hay un **bucle** que repite: **actualizar** posiciones → **dibujar** la escena. En three.js:
```js
renderer.setAnimationLoop(ciclo);      // llama a ciclo() unas 60 veces por segundo
// dentro de ciclo():  ... mover cosas ...  renderer.render(scene, camera);
```
`renderer.render(scene, camera)` es **la orden de «toma la foto»**: dibuja la escena vista desde la cámara. Eso se repite siempre; el capítulo 08 explica cómo se aprovecha para animar.

## 11. Transparencia: la clave de la RA
Por defecto, el fondo de un canvas 3D sería un color. Con `alpha: true` el fondo queda **transparente**: solo se ven los objetos 3D, y lo que haya **detrás** (en este caso el `<video>` de la cámara) se ve a través. En el modo simulado (sin cámara) se agrega un campus 3D de fondo. En la cinemática el cielo del campus lo cubre todo.

## 12. Más cosas de three.js que usamos
| Cosa | Para qué |
|---|---|
| `Raycaster` | Saber qué objeto tocó el dedo (capítulo 09) |
| `Quaternion` | Representar una rotación sin problemas (capítulo 09) |
| `CatmullRomCurve3` | Una curva suave por puntos: el cuello de la garza y la ruta de la cinemática |
| `InstancedMesh` | Dibujar **muchas copias** de una malla en una sola orden (ventanas, aves volando, carros) |
| `Fog` | Niebla (la cinemática difumina lo lejano) |
| `Clock` | Medir el tiempo para animar |
| `Vector3`, `Euler`, `Matrix4` | Herramientas matemáticas (posiciones, ángulos, transformaciones) |

## 13. Ejemplo mínimo completo (para entender la película completa)
Así se vería un cubo girando con three.js (no está en tu proyecto, es solo para entender):

```js
import * as THREE from "three";
const scene = new THREE.Scene();                                    // 1. el plató
const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 100);
camera.position.z = 3;                                              // 2. la cámara, 3 m atrás
const renderer = new THREE.WebGLRenderer(); renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);                     // 3. el lienzo en la página
const cubo = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: "orange" }));
scene.add(cubo);                                                    // 4. un cubo naranja
scene.add(new THREE.DirectionalLight("white", 2));                  // 5. una luz
renderer.setAnimationLoop(() => { cubo.rotation.y += 0.01; renderer.render(scene, camera); });  // 6. bucle: girar y dibujar
```
**Tu proyecto es esto mismo, pero a lo grande**: en vez de un cubo hay aves, campus, curvas de cámara, y en vez de girar, hay animaciones y RA.

## 14. Vocabulario esencial (repásalo)
- **Render**: «dibujar la escena».
- **Cuadro (frame)** y **FPS**: una foto y cuántas fotos por segundo.
- **Polígono / triángulo**: la unidad mínima del 3D.
- **Normal**: la dirección hacia la que «mira» una cara; la luz la usa para calcular el brillo.
- **Draw call (orden de dibujo)**: cada vez que three.js le dice a la GPU «dibuja este objeto». Menos órdenes = más rápido (capítulo 16).
- **FOV**: ángulo de visión de la cámara.
- **Near/far**: distancia mínima y máxima que dibuja la cámara.

## Para decirle al profesor
> «El 3D está hecho con three.js sobre WebGL. Construimos una escena con una cámara en el origen, dos luces y mallas generadas por código (esferas, conos, cajas, cilindros). Para que sea RA, el renderizador tiene fondo transparente y está superpuesto a un `<video>` con la cámara real. Las etiquetas y tarjetas son sprites dibujados con canvas 2D; las aves son modelos 3D reales.»

## Autoevaluación
1. ¿Qué diferencia hay entre WebGL y three.js?
2. Nombra las cinco piezas de una escena y qué hace cada una.
3. ¿Qué es una malla? ¿De qué dos cosas se compone?
4. ¿Cómo convertimos una esfera en una ala o un cuerpo?
5. ¿Qué es un grupo y para qué sirve?
6. ¿Qué es un sprite? ¿Las aves son sprites?
7. ¿Qué significa `alpha: true` y por qué es clave para la RA?
