# 08 · Las animaciones: cómo se mueve todo

## Resumen en 1 minuto
Animar es **cambiar un valor poquito a poquito, muchas veces por segundo**. Un programa 3D tiene un **bucle** que corre unas **60 veces por segundo**; en cada vuelta mueve un poco las cosas (una posición, un giro) y **vuelve a dibujar**. Como cambian tan seguido y tan poquito, el ojo lo ve como movimiento continuo. En tu proyecto **no hay archivos de animación**: todo son **fórmulas** que calculan cómo debe estar cada parte en el instante `t`. A esto se le llama **animación procedural**.

---

## 1. La analogía del flipbook
Un cuaderno donde dibujas un muñeco en cada hoja un poco diferente: al pasar las hojas rápido, se mueve. El bucle de la app «pasa las hojas» 60 veces por segundo; y en vez de dibujar a mano cada hoja, **una fórmula** calcula cómo debe quedar.

## 2. El bucle (`ciclo()`) y las dos medidas de tiempo
En `ra.js`, la función `ciclo()` se ejecuta en cada cuadro. Lo primero que hace:

```js
const dt = Math.min(0.05, reloj.getDelta());   // cuánto tiempo pasó desde el cuadro anterior (en segundos)
const t  = reloj.elapsedTime;                  // cuánto tiempo lleva en total
```
- **`dt`** (*delta time*): lo que tardó el cuadro anterior (≈ 0,016 s a 60 FPS). Se usa para que **la velocidad sea la misma** en un celular rápido y en uno lento: movimiento = velocidad × `dt`. (Se limita a 0,05 para que no «dé un salto» si la página se queda pausada.)
- **`t`**: el reloj general. Sirve para fórmulas ondulantes: `Math.sin(t)`.

**Qué hace `ciclo()` en cada vuelta, en orden:** (1) orienta la cámara (giroscopio o arrastre), (2) suaviza el zoom, (3) mueve cada ave (vuelo y animación), (4) encoge los soportes que se van, (5) anima el campus (fuente, nubes, mariposas), (6) mueve partículas, (7) acomoda las etiquetas dentro de la pantalla, (8) mira si el centro apunta a un ave, (9) dibuja el radar, (10) **dibuja la escena** (`renderer.render`).

## 3. La función seno: el motor de lo «ondulante»
`Math.sin(x)` da un número que **sube y baja suavemente entre −1 y 1** mientras `x` crece. Es perfecta para cosas que **oscilan**: respirar, mover la cabeza, aletear.

```js
const resp = 1 + Math.sin(t * 3 + s) * 0.025;
u.cuerpo.scale.set(resp, resp, 1);
```
Se lee: «la escala del cuerpo es 1 más/menos un 2,5 %, oscilando 3 veces cada 2π segundos». Resultado: el ave **respira** (se infla y desinfla ligeramente). `s` es una **semilla aleatoria** distinta por ave para que **no respiren todas a la vez**.

## 4. Estados con «hasta cuándo» (animaciones puntuales sin temporizadores)
Para que el ave **cante** durante un rato, **aletee** un instante o **celebre**, no se programa un temporizador por separado: se guarda **hasta qué segundo** dura esa acción.

```js
export function cantar(r, t, dur = 1.2)  { r.userData.cantarHasta  = t + dur; }
export function aletear(r, t, dur = 0.8) { r.userData.aletearHasta = t + dur; }
export function celebrar(r, t)           { r.userData.celebrarHasta = t + 1.4; r.userData.aletearHasta = t + 1.4; }
```
y en `animarAve`: `const cantando = t < u.cantarHasta;` → «¿todavía no pasó ese segundo? entonces está cantando». Así **una sola función** decide, en cada cuadro, cómo debe verse el ave según su estado.

## 5. La función `animarAve`, parte por parte
(Está en `aves3d.js`.)

| Qué se ve | Cómo se logra |
|---|---|
| **Respira** | La escala del cuerpo oscila con seno (arriba) |
| **Mira alrededor** | Cada 1,2–3,7 s elige una **mirada nueva al azar**; la cabeza **se acerca suavemente** (`lerp`, interpolación) en vez de saltar |
| **Mueve la cola** | Con probabilidad, cada tanto, la cola da un sacudón (`sin` que se apaga) |
| **Canta** | La cabeza se levanta (−0,35 rad) y el **pico inferior se abre y cierra** muy rápido: `0.35 * Math.abs(Math.sin(t * 22))` |
| **Aletea** | Las alas giran en Z con `lado * (1.1 + Math.sin(t * f) * 0.8)`; `f` = 13 (normal) o **38 (colibrí, ¡mucho más rápido!)** |
| **Colibrí flota** | Su `y` oscila `0.55 + Math.sin(t * 2.5 + s) * 0.08` (vuelo estacionario) |
| **Celebra** | `Math.abs(Math.sin(k * 9)) * 0.45`: rebota como pelotita + gira sobre sí misma |

### ¿Qué es `lerp`?
**Interpolación lineal**: «acércate al objetivo una fracción del camino en cada cuadro». `u.mirar.lerp(u.mirarObj, Math.min(1, dt * 6))` → la mirada **persigue** su objetivo suavemente. Es la herramienta más usada para que nada se mueva «a tirones».

## 6. El vuelo: una curva y un «suavizado»
Cuando un ave **llega volando** (al llamarla, en el comedero o en el quiz), sigue una **curva Bézier cuadrática**: un camino curvo definido por tres puntos (salida, **punto medio elevado** y llegada).

```js
const desde = a.obj.position.clone();
const medio = desde.clone().lerp(destino, 0.5).add(new THREE.Vector3(0, 1.6, 0));   // mitad del camino, 1,6 m más arriba
a.vuelo = { desde, medio, destino, t0: reloj.elapsedTime, dur, alLlegar };
```
En `ciclo()`, cada cuadro calcula cuánto del vuelo va:
```js
const k = Math.min(1, (t - v.t0) / v.dur),          // k va de 0 a 1 durante la duración
      e = k * k * (3 - 2 * k);                       // suavizado: arranca y termina despacio (easing)
// posición = (1-e)²·desde + 2(1-e)e·medio + e²·destino     ← fórmula de la curva Bézier
```
- `k` es el **progreso** (0 = salida, 1 = llegada).
- `k·k·(3 − 2k)` se llama **smoothstep**: un *easing* que hace que el ave **acelere al despegar y frene al llegar** (en vez de moverse a velocidad constante).
- El ave se **orienta hacia donde va** (`lookAt`) y **aletea** durante el vuelo.
- Mientras llega, el **soporte** del destino **crece** (con otro smoothstep) y, al terminar, se ejecuta el *callback* `alLlegar` (el ave canta, aparece el aviso…).
- Al **irse**, el ave vuela hacia arriba y lejos (`irse`) y se elimina.

## 7. Partículas: notas musicales y confeti
Una **partícula** es un objeto pequeño con velocidad y vida. Para las **notas** (♪ ♫) que salen al cantar y el **confeti** del quiz:
```js
particulas.push({ obj: m, v: new THREE.Vector3(...), vida: 1.8, t: 0, gravedad: true, giro: ... });
```
En cada cuadro: se suma `velocidad × dt` a la posición, se aplica **gravedad** (`v.y -= 4 * dt`), se gira, se **desvanece** con la opacidad (`1 - t/vida`) y, al terminar su vida, **se elimina**. 70 trocitos de papel de 5 colores = confeti.

## 8. Animaciones de la cámara
- **Zoom de los binoculares:** `camera.fov += (fovObjetivo - camera.fov) * Math.min(1, dt * 6)`: el campo de visión **se acerca suave** de 62° a 21°.
- **Giro con el giroscopio:** la cámara **sigue** al celular con `slerp` (capítulo 09).
- **Cinemática:** la cámara recorre una curva por el campus (capítulo 15).

## 9. Animaciones del ambiente
- **Fuente del campus:** 52 «gotas» (una sola malla instanciada) con una fórmula de **parábola** (`u*(1-u)`): suben y caen. Más 3 **ondas** que crecen y se desvanecen.
- **Nubes y mariposas** del campus simulado: se mueven con senos y círculos.
- **Bandada de la cinemática:** ~105 aves instanciadas que **orbitan** y **aletean** (un cálculo por ave en cada cuadro).
- **Portada:** bandada con **boids** (cada ave sigue reglas simples; capítulo 13) y el **amanecer** que va cambiando de color.

## 10. Animaciones de la interfaz (CSS)
- La ruedita del mouse de la portada (`@keyframes rueda`).
- El pulso del botón **Cinemática** (`cine-pulso`).
- Aparición de la ficha, el aviso y el destello de la foto (`flash`).
- Aparición suave de las secciones al hacer scroll (la clase `revelar` + `IntersectionObserver`; capítulo 13).
- Los **números** de la guía (84, 30, 77) que **cuentan desde 0** al aparecer: una animación en JavaScript con *easing* (`1 - (1-k)³`).

## 11. Por qué no usamos animaciones «de programa»
Programas como Blender exportan animaciones con **fotogramas clave** en un archivo. Nosotros no, porque: (1) cada archivo pesaría, (2) tendríamos que animar **12 aves** distintas, y (3) con fórmulas se puede **reaccionar** a lo que haga el usuario (la mirada, el canto, el vuelo hacia donde tú estás). Es lo que da la sensación de que las aves están **vivas** y no son un video repetido.

## 12. Experimento
En `aves3d.js`, en `animarAve`, busca `const f = u.tipo === "colibri" ? 38 : 13;` y cambia 13 por 40: **todas las aves aletearán como colibríes**. Vuelve a poner 13. (Así entiendes que el aleteo es una fórmula y `f` es la frecuencia.)

## Para decirle al profesor
> «Las animaciones son procedurales: en cada cuadro de un bucle de unos 60 FPS calculamos la pose de cada parte con funciones como seno, interpolación lineal y curvas Bézier con suavizado, usando el tiempo transcurrido para que la velocidad no dependa del celular. No usamos archivos de animación; eso nos permite que las aves reaccionen al usuario, por ejemplo al llamarlas o al tocarlas.»

## Autoevaluación
1. ¿Qué es `dt` y por qué se usa?
2. ¿Para qué sirve `Math.sin` en las animaciones?
3. ¿Qué es `lerp`? ¿Y un *easing*?
4. ¿Cómo vuela un ave desde lejos hasta tu punto?
5. ¿Cómo se hace el confeti?
6. ¿Por qué el aleteo del colibrí es distinto?
7. ¿Qué ventajas tiene la animación procedural frente a una pregrabada?
