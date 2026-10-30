# 04 · JavaScript desde cero (el cerebro)

## Resumen en 1 minuto
**JavaScript** es un lenguaje de programación: una forma de **escribir instrucciones** que el navegador ejecuta. Un archivo `.js` es simplemente un **archivo de texto** con esas instrucciones. Gracias a JavaScript la página **reacciona** (botones, quiz), **calcula** (dónde poner un ave), **se mueve** (animaciones) y **usa el celular** (cámara, giroscopio, sonido). Tu proyecto tiene unas 3.500 líneas de JavaScript repartidas en 11 archivos.

Comparación: el HTML es el **menú escrito** del restaurante, el CSS es la **decoración del local**, y el JavaScript es el **personal de cocina y servicio** que hace que las cosas *ocurran*.

---

## 1. Qué es «programar»
Programar es escribir una **receta muy detallada** para un ayudante que obedece al pie de la letra y no entiende nada que no le digas. Las instrucciones se ejecutan **de arriba hacia abajo**. Todo el arte está en dividir lo que quieres en pasos pequeños y darles nombre.

## 2. Variables: cajas con nombre
Una variable es una **caja con etiqueta** donde guardas un valor.

```js
const MAX_AVES = 6;
let modo = "avistar";
```
- `const` = caja **cerrada**: el valor no se reemplaza después (aquí, máximo 6 aves a la vez en «Llamar»).
- `let` = caja que **se puede reemplazar** (el modo actual cambia: «avistar», «quiz»…).
- El nombre (`MAX_AVES`, `modo`) lo elige el programador. Aquí están en español.

### Tipos de valores
| Tipo | Ejemplo | Para qué |
|---|---|---|
| Número | `6`, `0.35`, `-1.6` | Cantidades, posiciones, ángulos |
| Texto («string») | `"avistar"`, `'hola'` | Nombres, mensajes |
| Verdadero/falso («boolean») | `true`, `false` | Sí/no (¿hay cámara?) |
| Lista («array») | `["flores", "frutas"]` | Varios valores en orden |
| Objeto | `{ id: "mirla", nombre: "Mirla ollera" }` | Una «ficha» con campos con nombre |
| Nada | `null`, `undefined` | «No hay valor todavía» |

## 3. Operaciones y texto con huecos
```js
const total = 3 + 4;                            // 7
const texto = `Libreta: ${total}/${12}`;        // "Libreta: 7/12"
```
Las comillas **invertidas** (`` ` ``) permiten meter valores dentro del texto con `${…}`. Se usan muchísimo en el proyecto, incluso para **armar bloques de HTML** (ver sección 9).

## 4. Condiciones (decidir)
```js
if (modo === "quiz") {
  aviso("El recorrido no está disponible durante el quiz.");
  return;
}
```
«**Si** el modo es el quiz, muestra un aviso y **sal de la función**». `===` compara (¿es exactamente igual?); `=` solo asigna.

Operadores que verás:
- `&&` = **y**, `||` = **o**, `!` = **no**.
- `condición ? A : B` = «si la condición es cierta, A; si no, B». Ej.: `usandoGiro ? "Mueve el celular…" : "Arrastra…"`.
- `a ?? b` = «usa `a`, pero si `a` no existe, usa `b`».
- `x?.y` = «si `x` existe, dame su `y`; si no, no te quejes» (evita errores).

## 5. Repetir: bucles
```js
for (let i = 0; i < 12; i++) { ... }          // repite 12 veces
aves.forEach(a => animarAve(a.obj, t, dt));    // repite para cada ave de la lista
```
`forEach` significa «para cada elemento haz esto». Es la forma más común aquí.

## 6. Funciones: recetas con nombre
Una **función** es un bloque de instrucciones al que le pones nombre para poder **llamarlo** cuando quieras, con distintos datos.

```js
function aviso(texto, ms = 2600, abajo = false) {
  const t = $("#ra-aviso");
  t.innerHTML = texto;
  t.classList.add("ver");
  ...
}
aviso("¡Foto guardada!", 4500);
```
- `texto`, `ms`, `abajo` son los **parámetros** (los datos que recibe). `ms = 2600` significa «si no me dices, uso 2600».
- La función **hace algo** (muestra un cartelito) y a veces **devuelve** un resultado con `return`.

### Funciones flecha (la forma corta)
```js
const fem = e => e.genero === "f";     // recibe e, devuelve si es femenino
```
`e => …` es «una función que recibe `e` y devuelve lo que sigue a la flecha».

### Funciones que reciben funciones (callbacks)
Una función puede ser **un dato** que le pasas a otra. Ejemplo real: `volar(a, destino, 2.4, alLlegar)`: el cuarto dato es **qué hacer cuando el ave llegue**. Así `volar` no necesita saber si debe cantar, registrar o preguntar: «cuando llegues, ejecuta lo que te pasé».

## 7. Objetos y listas: organizar datos
Cada ave de RA es un **objeto** (una ficha) dentro de una **lista** (en `especies-ra.js`):

```js
window.ESPECIES_RA = [
  {
    id: "bichofue", nombre: "Bichofué", comida: ["insectos", "agua", "frutas"],
    colores: { espalda: "#8A6A3A", vientre: "#F6CF1E", cabeza: "#1D1B1A" },
    pistas: ["Su nombre imita su llamado fuerte...", "Come de todo...", "Vientre amarillo..."]
  },
  { id: "azulejo", ... }, ...
];
```
- Se accede con punto: `ave.nombre`, `ave.colores.vientre`; y con corchetes para listas: `ave.pistas[0]`.
- **Es la «base de datos» de las aves de RA**: el código del 3D no tiene colores escritos; los **lee** de esta ficha. Cambias un color aquí y el ave cambia en toda la app.

### Atajos de escritura que verás
- `const [w, h] = lista;` → saca los dos primeros valores de la lista (desestructurar).
- `{ ...x, y: 3 }` → copia el objeto `x` y le añade/cambia `y` (el «spread» `...`).

## 8. Operar con listas: el «cinturón de herramientas»
| Método | Qué hace | Ejemplo real |
|---|---|---|
| `.map(f)` | Convierte cada elemento en otra cosa (nueva lista) | `E.map(e => \`<option>${e.nombre}</option>\`)` |
| `.filter(f)` | Se queda solo con los que cumplen | `E.filter(e => e.comida.includes(tipo))` |
| `.find(f)` | Devuelve el primero que cumple | `aves.find(a => a.esp.id === id)` |
| `.some(f)` / `.every(f)` | ¿Alguno / todos cumplen? | `OBSTACULOS.some(o => …)` |
| `.includes(x)` | ¿Está x en la lista? | `d.aves.includes(id)` |
| `.sort(f)` | Ordena | `lista.sort(...)` |
| `.slice(a, b)` | Copia una parte | `d.fotos.slice(-8)` (las últimas 8) |
| `.join("")` | Une una lista de textos en uno solo | `.join("")` al armar HTML |

**Mezclar una lista al azar** (usado para barajar preguntas y aves):
```js
const barajar = a => a.slice().sort(() => Math.random() - 0.5);
```
Copia la lista y la ordena con un criterio **aleatorio**; resultado: mezclada.

## 9. Hablar con la página: el DOM
El navegador convierte el HTML en un «árbol» de objetos al que JavaScript puede acceder; a ese árbol se le llama **DOM**.

```js
const $ = s => document.querySelector(s);      // atajo: busca UN elemento por selector CSS
$("#lib-aves").textContent = "3/12";            // cambia el texto
$("#ra").hidden = false;                        // muestra la RA (quita 'hidden')
$("#ra").classList.add("ra-en-recorrido");      // añade una clase (el CSS reacciona)
$("#ra-flash").classList.toggle("ver");         // la pone si no está, la quita si está
```
**Armar HTML con listas** (así se pinta la libreta y el listado de especies):
```js
$("#lib-aves-grid").innerHTML = E.map(e => {
  const ok = d.aves.includes(e.id);
  return `<div class="lib-ave ${ok ? "ok" : ""}">
    <img src="img/aves/${e.id}.png"> <b>${ok ? e.nombre : "¿?"}</b> </div>`;
}).join("");
```
Se lee: «por **cada ave** de la lista `E`, fabrica un bloque HTML (con su imagen y su nombre; si aún no la registraste, muestra `¿?`), **une** todos los bloques y **métalos** en el contenedor». Es lo que hace que la libreta se «llene» sola a medida que registras aves.

## 10. Eventos: reaccionar a lo que hace el usuario
Un **evento** es algo que ocurre: un toque, un clic, mover el dedo, girar el celular, cambiar el tamaño de la ventana. Con `addEventListener` dices «**cuando** pase X, ejecuta esta función».

```js
$("#ra-salir").addEventListener("click", salir);
el.addEventListener("pointerdown", e => { arrastre.activo = true; arrastre.x = e.clientX; ... });
window.addEventListener("deviceorientation", alGirar);   // cada vez que el celular cambia de orientación
```
- `click` → toque/clic. `pointerdown/move/up` → dedo (o mouse) que baja, se mueve y sube. `deviceorientation` → **el giroscopio avisó que el celular giró** (capítulo 09).

## 11. El tiempo: temporizadores y animación
```js
const t = setTimeout(() => { ... }, 1100);        // haz esto dentro de 1,1 segundos
renderer.setAnimationLoop(ciclo);                 // llama a ciclo() ~60 veces por segundo (animación)
```
- `setTimeout(f, ms)` → ejecutar algo **más tarde** (el ave que «llega volando» 1,1 s después de tocar un canto).
- El proyecto envuelve `setTimeout` en una función llamada **`despues()`** que **anota cada temporizador** para poder **cancelarlos todos** si cambias de modo (así no te llegan aves de más). Es un buen detalle de calidad.
- `requestAnimationFrame` / `setAnimationLoop` → «llámame antes de dibujar el siguiente cuadro»: la base de **toda animación** (capítulo 08).

## 12. Cosas que tardan: `async` y `await`
Pedir la cámara toma tiempo (hay que esperar a que el usuario diga «Permitir»). JavaScript no se queda congelado: usa **promesas**.

```js
export async function iniciar() {
  const permisoCam = navigator.mediaDevices.getUserMedia({ video: ... });
  ...
  const [giro, s] = await Promise.all([permisoGiro, permisoCam]);
}
```
- `async` marca una función que **puede esperar**.
- `await` = «espera aquí a que esto termine, y sigue con el resultado».
- `Promise.all([a, b])` = «espera a que **las dos** cosas terminen».

## 13. Guardar datos en el celular: JSON y localStorage
```js
function leer() {
  try { return JSON.parse(localStorage.getItem("pajaro-uao-libreta")) || { aves: [], fotos: [], quiz: null }; }
  catch { return { aves: [], fotos: [], quiz: null }; }
}
function guardar(d) { localStorage.setItem(CLAVE, JSON.stringify(d)); }
```
- **`localStorage`**: una libretica dentro del navegador, **de cada dispositivo**, que no se borra al cerrar la página. Solo guarda **texto**.
- **`JSON.stringify(objeto)`** convierte el objeto en texto; **`JSON.parse(texto)`** lo convierte de nuevo en objeto.
- `try { … } catch { … }` = «intenta; si algo falla, haz esto otro» (por ejemplo si el navegador no deja guardar).

## 14. Organizar el código: módulos y `window`
- **Módulo**: un archivo que **exporta** funciones y otros archivos las **importan**.
  ```js
  // en aves3d.js:   export function crearAve(e, conSoporte = true) { ... }
  // en ra.js:       import { crearAve, crearSoporte, animarAve } from "./aves3d.js";
  ```
- **`window`**: el objeto global de la página. Los archivos «clásicos» (no módulos) comparten datos poniéndolos ahí: `window.ESPECIES_RA`, `window.Sonido`, `window.Libreta`, `window.RA`. Es así como `app.js` puede llamar a `window.RA.iniciar()`.
- **IIFE**: `(function () { ... })();` = «una función que se ejecuta de inmediato». Se usa para que las variables de un archivo **no choquen** con las de otro. Verás eso en `app.js`, `sonido.js` y `escena.js`.

## 15. `new` y el 3D
```js
const m = new THREE.Mesh(geometria, material);
```
`new` **fabrica** un objeto a partir de un «molde» (en este caso, una malla 3D de la librería three.js). `THREE.` es el nombre con el que importamos three.js. Lo verás cientos de veces.

## 16. Radianes (los ángulos en 3D)
En 3D los ángulos se miden en **radianes**, no en grados: 180° = π ≈ 3,1416 rad. El código tiene `const D2R = Math.PI / 180;` (de «degrees to radians») para convertir.
`Math.sin` y `Math.cos` (seno y coseno) sirven para movimientos **ondulantes o circulares** (la respiración del ave, el vuelo en círculos).

## 17. Leyendo código real, línea por línea (práctica)
Tomemos `registrarAve` de `ra.js`:

```js
function registrarAve(a) {
  if (a.registrada) return;                    // 1
  a.registrada = true;                         // 2
  ponerEtiqueta(a);                            // 3
  lib()?.registrar(a.esp.id);                  // 4
  Sonido.registro();                           // 5
  const total = lib()?.total() || 0;           // 6
  aviso(`<strong>¡${a.esp.nombre} registrad${fem(a.esp) ? "a" : "o"}!</strong> Libreta: ${total}/${E.length}`);  // 7
}
```
1. «Si esta ave **ya** estaba registrada, no hagas nada» (`return` sale de la función).
2. Márcala como registrada.
3. Ponle encima su **etiqueta** con el nombre.
4. Guarda su `id` en la **libreta** (`lib()` devuelve `window.Libreta`; el `?.` evita error si no existe).
5. Suena el «pling» de registro.
6. Pregunta cuántas aves lleva (si no hay dato, 0).
7. Muestra un aviso: «¡Garza de ganado registrada! Libreta: 3/12», con la concordancia correcta de género («registrada»/«registrado»).

Otra, `despues` (la que anota los temporizadores):

```js
const pendientes = new Set();                  // una "bolsa" de temporizadores activos
function despues(fn, ms) {
  const t = setTimeout(() => { pendientes.delete(t); if (enRecorrido) colaRecorrido.push(fn); else fn(); }, ms);
  pendientes.add(t);
  return t;
}
function cancelarPendientes() { pendientes.forEach(clearTimeout); pendientes.clear(); ... }
```
Lectura: «programa `fn` para dentro de `ms`; anótalo en la bolsa. Cuando llegue la hora, sácalo de la bolsa y ejecútalo (pero **si justo estás en la cinemática, guárdalo para después de terminarla**). `cancelarPendientes` vacía la bolsa cancelando todo».

## 18. Herramientas para «ver» JavaScript funcionando
- **Consola del navegador** (`F12` → pestaña *Console*): ahí se ven errores y mensajes. Puedes escribir código y ejecutarlo en vivo. Prueba: abre la página y escribe `window.ESPECIES_RA.length` → te devuelve `12`.
- `console.log(algo)` imprime un valor en la consola (así se depura).
- Hay «ganchos de prueba» en el proyecto: `window.RA._prueba` (funciones para probar la RA por código; las usamos durante el desarrollo).

## 19. Lo que NO se usa (útil para responder preguntas)
- **No hay frameworks** (React, Vue, Angular): es JavaScript «puro», más una librería de 3D.
- **No hay servidor ni base de datos**: todo corre en el navegador.
- **No hay TypeScript**: JavaScript normal.

## Para decirle al profesor
> «La lógica está en JavaScript puro, organizado en módulos: un motor de RA (`ra.js`), la construcción y animación de las aves (`aves3d.js`), los dos campus (`campus.js`, `campus-real.js`), la cinemática (`recorrido.js`), el sonido (`sonido.js`) y la página con la libreta (`app.js`). Los datos de las aves están separados del código en archivos de datos, así que cambiar una especie no exige tocar la lógica.»

## Autoevaluación
1. ¿Qué es un archivo `.js`?
2. ¿Qué diferencia hay entre `const` y `let`?
3. ¿Qué es una función y qué es un *callback*? Da un ejemplo del proyecto.
4. ¿Qué hace `addEventListener`? ¿Qué eventos usa la RA?
5. ¿Qué es `localStorage` y qué guardamos ahí?
6. ¿Para qué sirve la función `despues()`?
7. ¿Qué es un módulo (`import`/`export`)?
