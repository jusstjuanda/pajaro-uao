# 23 · Práctica: toca el proyecto para entenderlo

## Resumen en 1 minuto
Leer no basta: **entiendes de verdad cuando cambias algo y ves qué pasa**. Este capítulo tiene ejercicios de menos a más: primero **solo mirar** (sin cambiar nada), luego **cambiar un valor**, luego **agregar algo pequeño**, y al final **explicarlo en voz alta**. Todos los ejercicios indican **archivo, línea aproximada y qué debes ver**.

> ⚠️ **Antes de tocar nada (muy importante, para no dañar la versión del pitch):**
> 1. **Commitea primero** lo que ya tienes (los documentos `REPASO/`, `SUSTENTACION.md`, etc.) con GitHub Desktop. Así la versión buena queda guardada en Git.
> 2. Haz los ejercicios de los Niveles 1 y 2 **solo para aprender**, y al terminar de cada uno **descarta el cambio**: en GitHub Desktop, clic derecho sobre el archivo modificado → **«Discard changes»** (Descartar cambios). Así vuelve a como estaba.
> 3. **No hagas `push` de un ejercicio.** (De todos modos, los commits los haces tú; yo no hago ninguno.)
> 4. Si algo se rompe: descarta los cambios y listo. Git es tu botón de «deshacer».

## Cómo ver tus cambios en vivo
Las páginas con módulos de JavaScript **no funcionan abriendo el archivo con doble clic**. Hace falta un servidor local. Lo más fácil: **pídeme «levanta la vista previa»** y la abro en el panel del navegador (usa el servidor `pajaro-local`, puerto 5146). Cada vez que cambies un archivo, **recarga con Ctrl + Shift + R**.

**Con qué editar:** Bloc de notas, Visual Studio o VS Code (con Visual Studio Code es más cómodo: colorea el código).

---

## Nivel 0 — Solo mirar (no cambia nada)

### Ejercicio 0.1 · Abrir las herramientas del navegador (DevTools)
1. Abre la página publicada o la vista previa en Chrome.
2. Pulsa **F12** (o clic derecho → «Inspeccionar»).
3. Mira las pestañas:
   - **Elements (Elementos):** el HTML tal como lo ve el navegador. Haz clic en un título y mira su `<h1>`/`<h2>`.
   - **Console (Consola):** mensajes y errores. Si todo está bien, está casi vacía.
   - **Network (Red):** todo lo que se descargó. Recarga y busca `three.module.js`: vendrá de `cdn.jsdelivr.net`. Mira el tamaño total.
   - **Application (Aplicación) → Local Storage:** busca la clave **`pajaro-uao-libreta`** (es tu libreta).
   - **Sources (Fuentes):** los archivos `.js` del proyecto.
4. **Qué entiendes:** la página son archivos que se descargan; three.js viene de afuera; la libreta vive en tu navegador.

### Ejercicio 0.2 · Ver la página en modo celular
En DevTools pulsa el icono de **teléfono/tableta** (Ctrl + Shift + M) y elige «iPhone 12» o «Pixel 7». Recarga y navega: verás cómo cambia el diseño (responsive). Entra a la RA: verás el campus simulado (no hay cámara).

### Ejercicio 0.3 · Preguntarle a la app por dentro
1. Pulsa **«Iniciar la experiencia RA»** (modo simulado en el computador).
2. En la **Consola** escribe y pulsa Enter:
```js
RA._prueba.estado()
```
Verás un objeto con el modo actual, el FOV y la lista de aves. Es una función de **prueba** que dejamos para medir cosas.
3. Escribe:
```js
RA._prueba.rendimiento()
```
Verás cuántas **órdenes de dibujo** y **triángulos** se están usando. (Aquí ves en vivo lo que dijimos en el capítulo 16.)

### Ejercicio 0.4 · La libreta
1. Toca un ave en Avistar (se registra).
2. Mira de nuevo **Application → Local Storage → `pajaro-uao-libreta`**: ahora tiene el `id` del ave dentro de `aves`.
3. Toma una **foto** y mira cómo crece `fotos` (es una imagen codificada en texto).

### Ejercicio 0.5 · Seguir un toque con la búsqueda (Ctrl + F)
Abre `js/ra/ra.js` y busca (Ctrl + F) estas palabras en este orden. Lee unas líneas alrededor de cada una:
1. `avePorPantalla` — cómo se lanza el rayo y se sabe qué ave tocaste.
2. `registrarAve` — qué pasa al registrarla (sonido, libreta, aviso).
3. `MODOS` — dónde está lo que hace cada modo al entrar, salir y tocar.
4. `ciclo` — el bucle que corre 60 veces por segundo.
5. `alGirar` — el giroscopio.
**Qué entiendes:** el recorrido «toco la pantalla → rayo → ave → acción del modo → sonido y registro».

---

## Nivel 1 — Cambiar un valor (y ver el efecto)

> Después de cada ejercicio: **recarga con Ctrl + Shift + R**, mira el resultado, y **descarta el cambio** en GitHub Desktop.

### Ejercicio 1.1 · Cambiar el color principal de la web
- **Archivo:** `PaginaPajaro/wwwroot/css/estilos.css`, línea ~7.
- **Busca:** `--ambar: #F2A541;`
- **Cámbialo a:** `--ambar: #3DA5F2;` (azul).
- **Qué debes ver:** el botón «Iniciar la experiencia RA» y los detalles que eran ámbar pasan a azul. **Por qué:** `--ambar` es una *variable CSS* que usan muchas reglas; cambias una sola línea y cambia todo.

### Ejercicio 1.2 · Cambiar el color del vientre del Bichofué
- **Archivo:** `js/especies-ra.js`, línea ~9.
- **Busca:** `vientre: "#F6CF1E"` (amarillo).
- **Cámbialo a:** `vientre: "#E4673E"` (coral).
- **Qué debes ver:** en la RA (Avistar), el Bichofué con el vientre coral. **Por qué:** el ave se construye **a partir de esta ficha de datos**; la forma no cambia, solo el dato. *(Las imágenes de la libreta son fotos ya hechas, no cambian.)* También puedes verlo en `galeria3d.html`.

### Ejercicio 1.3 · Cambiar el tamaño de un ave
- **Archivo:** `js/especies-ra.js`, línea ~8.
- **Busca:** `escala: 0.42` (del Bichofué).
- **Cámbialo a:** `escala: 0.8`.
- **Qué debes ver:** un Bichofué casi el doble de grande.

### Ejercicio 1.4 · Cambiar el aleteo
- **Archivo:** `js/ra/aves3d.js`, línea ~339.
- **Busca:** `const f = u.tipo === "colibri" ? 38 : 13;`
- **Cámbialo a:** `... ? 38 : 30;`
- **Qué debes ver:** cuando un ave aletea (al llegar o al tocarla), bate las alas **mucho más rápido**. **Por qué:** `Math.sin(t * f)` sube y baja `f` veces más rápido.

### Ejercicio 1.5 · Más o menos aves en «Llamar»
- **Archivo:** `js/ra/ra.js`, línea ~24.
- **Busca:** `const MAX_AVES = 6;`
- **Cámbialo a:** `const MAX_AVES = 3;`
- **Qué debes ver:** en el modo Llamar, al pedir la cuarta ave, **la más antigua se va**.

### Ejercicio 1.6 · Reglas del quiz
- **Archivo:** `js/ra/ra.js`, línea ~481.
- **Busca:** `const TOPE_QUIZ = 20, VIDAS_QUIZ = 2, ACIERTOS_GUARDIAN = 10;`
- **Cámbialo a:** `const TOPE_QUIZ = 5, VIDAS_QUIZ = 3, ACIERTOS_GUARDIAN = 3;`
- **Qué debes ver:** partidas de 5 preguntas y 3 corazones; el mensaje final de «Guardián» sale con 3 aciertos. *(Los corazones del encabezado se ajustan solos.)* **Por qué:** esos valores los lee el resto del quiz. **Ojo (un detalle real del código):** la insignia que se ve en la **libreta de la página** se decide en otro archivo (`js/app.js`, línea ~32: `d.quiz >= 10`), así que ahí seguirá pidiendo 10. Es un buen ejemplo de que un mismo dato puede estar escrito en dos sitios.

### Ejercicio 1.7 · Zoom de los binoculares
- **Archivo:** `js/ra/ra.js`, línea ~11.
- **Busca:** `const FOV = 62, FOV_ZOOM = 21;`
- **Cámbialo a:** `FOV_ZOOM = 10`.
- **Qué debes ver:** los binoculares acercan **mucho más**. **Por qué:** menor FOV = más zoom.

### Ejercicio 1.8 · Duración de la cinemática
- **Archivo:** `js/ra/recorrido.js`, línea ~7.
- **Busca:** `const DURACION = 108;`
- **Cámbialo a:** `const DURACION = 40;`
- **Qué debes ver:** la cinemática recorre el mismo camino **mucho más rápido** (y termina antes). **Por qué:** el tiempo se reparte a lo largo de la curva.

### Ejercicio 1.9 · Cambiar un texto de la página
- **Archivo:** `index.html`, línea ~54.
- **Busca:** `Iniciar la experiencia RA`
- **Cámbialo a:** `Entrar a las aves`.
- **Qué debes ver:** el botón del inicio dice otra cosa. **Por qué:** HTML es solo contenido y estructura.

---

## Nivel 2 — Agregar algo pequeño

### Ejercicio 2.1 · Añadir una pista a un ave
- **Archivo:** `js/especies-ra.js`, ficha del Bichofué (línea ~12), dentro de `pistas: [ ... ]`.
- **Agrega** al final de la lista (con una coma antes): `"Es muy ruidoso por las mañanas"`.
- **Qué debes ver:** en el quiz de «pistas» puede aparecer esa pista. *(Es una lista: añade un texto más entre comillas separado con coma.)*

### Ejercicio 2.2 · Añadir una pregunta del entorno UAO al quiz
- **Archivo:** `js/ra/ra.js`, arreglo `PREGUNTAS_CAMPUS` (línea ~486).
- **Agrega** esta línea al final del arreglo (con coma en la línea anterior):
```js
  { p: "¿Cuántas porterías se mencionan en este recorrido?", ok: "Dos: la 1 y la 3", mal: ["Una", "Cuatro"], dato: "Son la Portería 1 y la Portería 3." }
```
- **Qué debes ver:** si juegas varias veces, puede salir esa pregunta (el banco pasa de 59 a 60). **Por qué:** cada pregunta es un **objeto** con `p` (pregunta), `ok` (correcta), `mal` (dos incorrectas) y `dato` (curiosidad).
- **Nota:** no uses esa pregunta en la versión real; es un ejemplo (y no está aprobada).

### Ejercicio 2.3 · Cambiar el sonido de un clic
- **Archivo:** `js/sonido.js`, función `clic()` (línea ~218).
- **Busca:** `tono(o, ctx.currentTime, 0.06, 1400, 900, "sine", 0.12);`
- **Los números significan:** dura 0,06 s, empieza en 1400 Hz y baja a 900 Hz, onda «sine» (seno), volumen 0,12.
- **Cámbialo a:** `tono(o, ctx.currentTime, 0.15, 400, 200, "square", 0.12);` y pulsa cualquier botón: el clic sonará **grave y más largo**. **Por qué:** una nota es una frecuencia (más alta = más aguda) y la «forma de onda» cambia el timbre.

### Ejercicio 2.4 · Un color de cielo distinto en el simulado
- **Archivo:** `js/ra/campus.js`, línea ~26.
- **Busca:** `const arriba = new THREE.Color("#4F9BD6"), horizonte = new THREE.Color("#F7E0B0");`
- **Cámbialo a:** `"#B04F9B"` (morado) en `arriba` y `"#FFB36B"` (naranja) en `horizonte`.
- **Qué debes ver:** en el campus simulado (sin cámara), un cielo de atardecer. **Por qué:** el cielo es una esfera gigante cuyos vértices se colorean mezclando (`lerp`) el color del horizonte con el de arriba.

---

## Nivel 3 — Explícalo (lo más importante)

### Ejercicio 3.1 · Las tres versiones
Grábate (con el celular) o dilo frente a un espejo:
1. **30 segundos:** «¿Qué es Aves UAO y para qué sirve?»
2. **2 minutos:** «¿Cómo funciona la RA y qué hicimos técnicamente?»
3. **5 minutos:** la versión completa: problema, solución, tecnología, decisiones, límites y trabajo futuro.

### Ejercicio 3.2 · Explícaselo a alguien que no sabe nada
Elige un familiar o amigo y explícale **qué es un cuaternión** o **qué es una orden de dibujo** **sin palabras técnicas**. Si lo entiende, tú lo entendiste.

### Ejercicio 3.3 · Dibuja el mapa
Sin mirar, dibuja en una hoja:
1. Los archivos principales y qué hace cada uno (11 de JavaScript).
2. El camino de un toque: pantalla → rayo → ave → acción → sonido/registro.
3. El campus real: Portería 1 → arco → Ágora → aulas → lago → cafetería → Portería 3.

### Ejercicio 3.4 · Simulacro de preguntas
Que un compañero te haga **10 preguntas al azar** del capítulo 21. Cuenta cuántas respondiste bien sin mirar. Meta: **8 de 10**.

### Ejercicio 3.5 · Las preguntas que más temes
Escribe **tus tres preguntas más temidas** y prepara la respuesta con la tabla «Si te quedas en blanco» del capítulo 21.

---

## Plan de estudio para esta noche (ejemplo de 2 horas)
| Tiempo | Qué hacer |
|---|---|
| 10 min | Leer `00_EMPIEZA_AQUI.md` y el «Resumen en 1 minuto» de los capítulos 1–5 |
| 20 min | Capítulo 6 (3D), 9 (RA) y 11 (modos): lee solo «Resumen» y «Para decirle al profesor» |
| 15 min | Ejercicios 0.1–0.5 (mirar el proyecto por dentro) |
| 20 min | Ejercicios 1.1, 1.2, 1.4, 1.5 (cambiar y ver el efecto; descartar cambios después) |
| 15 min | Capítulos 18 y 20 (decisiones e IA): leer completos, en voz alta |
| 20 min | Capítulo 21 (preguntas): simulacro con un compañero |
| 10 min | Ejercicio 3.1 (las tres versiones) |
| 10 min | Dormir temprano: el pitch es a las 8:00 a.m. |

## Lista para el sábado antes de salir
- [ ] Celular cargado y con datos móviles de respaldo.
- [ ] Enlace/QR de la página a mano y probado.
- [ ] Computador de respaldo con la página abierta (modo simulado).
- [ ] Cámara y movimiento permitidos en el navegador del celular (pruébalo antes).
- [ ] Sonido del celular activado y volumen adecuado.
- [ ] Sabes qué **no** decir (capítulo 20 y `SUSTENTACION.md` §14).
- [ ] Todo el equipo cuenta la misma historia sobre cómo se hizo (IA, primera versión, quién hizo qué).

## Autoevaluación
1. ¿Cómo se deshace un cambio de prueba?
2. ¿Por qué se recarga con Ctrl + Shift + R?
3. ¿Qué archivo cambiarías para modificar el color de un ave? ¿Y el de la web?
4. ¿Cómo agregarías una pregunta al quiz?
5. ¿Qué hace `RA._prueba.rendimiento()`?
