# REPASO COMPLETO DE «AVES UAO» — Empieza aquí

Este repaso está escrito para una persona que **no sabe nada de programación**. Todo se explica desde cero, con comparaciones de la vida diaria y con ejemplos **reales** sacados del código de tu proyecto. No hace falta que memorices código: hace falta que **entiendas la idea de cada cosa**, para poder explicarla con tus palabras.

> Pitch y sustentación: **sábado 2026-10-17, 8:00 a.m.** (5 min de presentación + 5 min de preguntas).

---

## 1. La idea más importante: tú no necesitas ser albañil, necesitas ser el director de la obra

Imagina que construyeron una casa. El director de la obra no pone los ladrillos, pero sabe:
- **qué** casa se pidió y por qué (la rúbrica del parcial),
- **cuántos cuartos** tiene y para qué sirve cada uno (los modos de la RA, la guía, la libreta, el quiz, la cinemática),
- **de qué material** está hecha y por qué (HTML, CSS, JavaScript, three.js…),
- **cómo se conectan** las instalaciones (cómo el celular le dice a la app hacia dónde miras, cómo suena un canto),
- **qué problemas hubo** y cómo se arreglaron,
- **qué decisiones** se tomaron y por qué se descartaron otras.

Eso es lo que se te va a preguntar. Nadie te va a pedir que escribas en vivo una función; te van a preguntar *cómo funciona* y *por qué así*. Este repaso te da ese conocimiento.

## 2. La verdad sobre el «vibe coding» (y por qué no es un problema)

Tú mismo lo dijiste: el proyecto se hizo con una IA que escribió el código mientras tú dirigías. La palabra para eso es *«vibe coding»*: describir lo que quieres en lenguaje normal y que la IA lo programe. Lo importante para la sustentación:

1. **Es válido y es honesto decirlo.** Hoy muchos profesionales programan con asistentes de IA. Lo que se evalúa es que **entiendas lo que entregas**.
2. **Lo que tú sí hiciste** (y es mucho): definiste qué se construye, aportaste fotos y mapas del campus, tomaste decisiones de diseño, probaste en celulares reales, encontraste errores con capturas, aprobaste o rechazaste cada cambio, y publicaste.
3. **Lo que este repaso hace** es darte el vocabulario y el mapa mental para que, cuando te pregunten «¿cómo funciona X?», puedas contestar con seguridad y con tus palabras.
4. **Cómo hablar de esto** está en el capítulo 20. Léelo con calma.

## 3. Cómo está organizado este repaso

| # | Capítulo | Para qué sirve |
|---|---|---|
| 01 | Internet y las páginas web | Qué es una página web, qué es un servidor, qué es un navegador |
| 02 | HTML | El «esqueleto» de la página. Qué es una etiqueta, un botón, un `canvas` |
| 03 | CSS | El «maquillaje»: colores, tamaños, animaciones, celular vs computador |
| 04 | JavaScript desde cero | El «cerebro»: qué es un `.js`, funciones, variables, eventos |
| 05 | Herramientas y publicación | Git, GitHub, GitHub Pages, .NET, CDN, DevTools |
| 06 | El 3D desde cero | Qué es three.js, WebGL, escena, cámara, mallas, luces |
| 07 | **Cómo se hicieron las aves** | Los «modelos»: no son archivos ni dibujos, son **código**. Paso a paso |
| 08 | Las animaciones | Cómo se mueven las aves, cómo vuelan, cómo se anima todo |
| 09 | **Cómo funciona la Realidad Aumentada** | Cámara + giroscopio + 3D transparente; 3DoF vs 6DoF; WebXR |
| 10 | El sonido | Cómo se «inventan» los cantos con código |
| 11 | Los modos de la RA, uno por uno | Avistar, Binoculares, Llamar, Comedero, Foto, Tamaño real |
| 12 | El quiz | Banco de preguntas, mazo, vidas, tarjetas 3D |
| 13 | La página, la guía y la libreta | `index.html`, `app.js`, datos, localStorage, la portada animada |
| 14 | El campus simulado y el campus «real» | Cómo se construyó el campus con código |
| 15 | La cinemática | El recorrido 3D por el campus |
| 16 | El rendimiento | Por qué corre en un celular (instancias, fusión…) |
| 17 | Historia del proyecto y problemas resueltos | «¿Qué dificultades tuvieron?» |
| 18 | Decisiones y alternativas | «¿Por qué no A-Frame? ¿Por qué no Unity?…» |
| 19 | La materia Fundamentos de Realidad Virtual | Cómo se conecta el proyecto con la materia |
| 20 | **Quién hizo qué y la IA** | Cómo responder con honestidad y seguridad |
| 21 | **Preguntas y respuestas** | Más de 100 preguntas posibles con respuesta modelo |
| 22 | Glosario A–Z | Todos los términos, en una línea |
| 23 | Práctica para entender | Ejercicios para «tocar» el proyecto y verlo reaccionar |

## 4. Rutas de estudio (según el tiempo que tengas)

**Ruta express (unas 2–3 horas)**
1. Este capítulo (00) completo.
2. Capítulo 01 (solo la sección «Resumen en 1 minuto» de cada capítulo del 02 al 05).
3. Capítulos 06, 07 y 09 completos (3D, aves, RA): es lo que más van a preguntar.
4. Capítulo 18 (decisiones) y 20 (IA).
5. Capítulo 21 (preguntas): léelas en voz alta respondiendo tú primero y luego comparando.

**Ruta completa (toda la noche si quieres)**
Del 01 al 23 en orden. Cada capítulo termina con un recuadro **«Para decirle al profesor»** con frases que puedes usar casi textualmente y con **«Autoevaluación»** (preguntas para comprobar que entendiste).

**Truco de estudio:** después de cada capítulo, cierra el archivo y explícale la idea en voz alta a alguien (o a la pared) con tus palabras. Si te trabas, relee solo esa parte.

## 5. El proyecto en una página (el mapa mental)

**Qué es:** una página web de **Realidad Aumentada** para conocer las aves del campus de la UAO.

**Qué pedía el parcial:** una app de RA que sea guía de avistamiento e información de aves, alimentada con la base de datos de la UAO (textos, imágenes, sonidos), con la RA como corazón, un **quiz en RA**, funcional en Android o iOS, con animaciones y audios, **mínimo 5 interacciones RA**, entregada como web (o APK) y presentada en un pitch.

**Qué hicimos:**
- Una **página web** con: portada animada, guía de 84 especies, libreta personal, jornadas.
- Una **experiencia RA** (se abre con un botón) con 6 modos + «Tamaño real» + una **Cinemática**.
- **12 aves en 3D** hechas con código, con animaciones.
- **Cantos sintetizados** con código.
- Un **quiz** con 59 preguntas, 2 vidas y la insignia «Guardián».
- Un **campus simulado** (cuando no hay cámara) y un **campus «real»** (para la cinemática), hechos con código.

**Con qué está hecho (las 6 piezas):**
1. **HTML** → el contenido (qué hay en la página).
2. **CSS** → el aspecto (cómo se ve).
3. **JavaScript** → la lógica (qué hace cada cosa).
4. **three.js** (librería) → dibuja el 3D en la pantalla usando la tarjeta gráfica (WebGL).
5. **APIs del navegador** → la cámara (`getUserMedia`), el giroscopio (`deviceorientation`), el sonido (`Web Audio`), la RA de verdad (`WebXR`), la memoria (`localStorage`).
6. **GitHub Pages** → el servicio gratuito que publica la web con un enlace.

**Cómo se ve la magia de la RA, en una frase:** detrás hay un `<video>` con lo que ve la cámara de tu celular; encima hay un `<canvas>` **transparente** donde dibujamos las aves en 3D; y una **cámara virtual** gira igual que tu celular (usando el giroscopio), así que las aves parecen estar «ahí afuera».

**Qué NO es:** no es una app instalable, no usa Unity, no usa A-Frame, no usa modelos descargados, no usa imágenes de aves en la RA (todo es 3D por código), no usa grabaciones de audio, no tiene servidor ni base de datos en la nube.

## 6. Cifras que debes tener a la mano

- **84** especies, **30** familias, **77** géneros en la guía; monitoreos desde **2019**.
- **12** aves en RA · **49** fichas con texto · **12** fotos reales de la guía.
- **7** interacciones RA (6 en cualquier celular + «Tamaño real» en Android con ARCore) · mínimo pedido **5**.
- **59** preguntas en el banco del quiz · **20** por partida · **2** vidas · **10** aciertos = «Guardián».
- **three.js 0.160** · unas **4.200** líneas de código · la cinemática dura unos **108** segundos.
- Primera versión publicada el **12 de octubre** por un compañero; mejoras del **15 y 16 de octubre**.

## 7. Cómo leer los ejemplos de código

Verás trozos de código así:

```js
const MAX_AVES = 6;   // aves a la vez en Llamar
```

No te asustes. Cada vez te lo voy a explicar **palabra por palabra**. Fíjate en esto:
- Lo que está después de `//` es un **comentario**: una nota para humanos que el computador ignora.
- El código está en **español** casi siempre (nombres como `aves`, `cantar`, `volar`) para que sea legible.
- Cuando diga **«archivo»** y un nombre como `ra.js`, el archivo está en `PaginaPajaro/wwwroot/js/ra/` (o la carpeta que indique).

Si quieres ver el código real mientras lees, ábrelo en el editor; pero **no hace falta** para entender este repaso.

## 8. Lo que este repaso NO puede decirte (cosas que debes averiguar tú o con tu equipo)

Todo lo que está aquí se comprobó contra el código y los documentos del proyecto. Pero hay cuatro cosas que **no constan por escrito (o solo en parte)** y no debes inventar:

1. **Por qué el compañero que hizo la primera versión eligió three.js y no A-Frame.** No quedó escrito. Pregúntaselo antes del sábado (capítulo 18 te da las razones técnicas defendibles).
2. **Si la primera versión del 12 de octubre también se hizo con ayuda de una IA.** Su bitácora no lo dice. Pónganse de acuerdo en cómo lo cuentan (capítulo 20).
3. **Qué vieron exactamente en clase.** No tengo las diapositivas del profesor: el capítulo 19 usa los conceptos estándar de RV/RA y la rúbrica del Parcial 1 que tienes en `_TEMP`. Ajusta las palabras con tus apuntes.
4. **Cifras exactas de rendimiento en celular** (cuadros por segundo, batería). El equipo **sí probó todo en celulares reales** (Android e iPhone, cinemática incluida) y funciona; lo que no hay es una medición numérica: las cifras de órdenes de dibujo y triángulos se midieron en el computador.

Y una recomendación práctica: antes de hacer los ejercicios del capítulo 23, **commitea** primero todo lo que ya tienes, para que la versión del pitch quede a salvo.
