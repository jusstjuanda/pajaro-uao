# 12 · El quiz (Quiz RA)

## Resumen en 1 minuto
El quiz es el modo que **comprueba que aprendiste** (lo pedía la rúbrica: «quiz en RA sobre las aves y el entorno UAO»). Tiene un **banco de 59 preguntas**; en cada partida salen **hasta 20**, mezcladas y sin repetir. Tienes **2 vidas** (un error quita un corazón; con dos errores se acaba). Se responde **tocando en 3D**: un ave, una tarjeta flotante o un alimento. Después de cada respuesta aparece si fue correcta y un **dato curioso**. Con **10 aciertos o más** ganas la insignia **«Guardián de las Aves UAO»**. El mejor puntaje queda en la libreta. Está en `ra.js` (sección «quiz»).

---

## 1. Por qué es un buen quiz para «RA»
No es un formulario de opción múltiple en una pantalla plana: **las respuestas son objetos 3D en tu entorno**. Eso lo hace «inmersivo» (la rúbrica lo pide). Y las preguntas conectan con lo aprendido en los otros modos: **binoculares** (marcas de identificación), **llamar** (los cantos), **comedero** (qué come cada ave).

## 2. El banco: 59 preguntas en tres grupos
| Grupo | Cantidad | Cómo se responde | Ejemplo |
|---|---|---|---|
| **Aves** | 36 | Tocando **el ave correcta** de 3 que llegan volando | «¿Quién canta así?» (suena un canto y tocas el ave) |
| **Ecología de las aves** | 16 (10 de hábitat + 6 de dieta) | Tarjetas flotantes (hábitat) o **alimentos 3D** (dieta) | «¿Dónde vive el pellar?» / «¿De qué se alimenta el colibrí?» → flores |
| **Entorno UAO** | 7 | Tarjetas flotantes | «¿Cuántas especies de aves se han registrado en el campus?» → 84 |

**De dónde salen:**
- Las de aves: **3 variantes por cada una de las 12 aves** (36 = 12 × 3): por **nombre** («¿Cuál es el Bichofué?»), por **pista** («¿Quién es? Vientre amarillo y cabeza negra…») y por **canto** («¿Quién canta así?»).
- Las de ecología: de las **fichas de la guía** (hábitat y alimentación reales de cada especie).
- Las de entorno UAO: datos de la guía y del campus (84 especies, 45,5 % de zonas verdes, qué hacen las aves en el campus, hora de más actividad, ave migratoria *Piranga abejera*, jornadas desde 2019, 4 edificios de aulas). Las **aprobaste una por una**; las demás ideas (lugares del campus, sostenibilidad, historia) las **descartaste** por no tener que ver con el tema.
- **Cada pregunta** de ecología/entorno trae un **«dato curioso»** que se muestra al responder.

## 3. Cómo se arma una partida (`armarMazo`)
```js
const patron = ["ave", "campus", "eco", "ave", "campus", "ave"];     // ciclo de tipos de pregunta
```
Se arman 3 «piscinas» (aves, campus, eco), cada una **barajada** (mezclada al azar). Luego se van **sacando** preguntas siguiendo el patrón, hasta 20: ≈ 10 de aves, 7 del campus y 3 de ecología. Reglas:
- **Sin repetir** ninguna pregunta.
- **Sin la misma ave dos veces seguidas** (para que no se vuelva monótono).
- Si una piscina se acaba, se usa otra.

## 4. Cada ronda (`rondaQuiz`)
1. **Todas las aves anteriores se van volando** y se limpian las opciones anteriores.
2. Si ya no quedan vidas o ya se hicieron las 20 → **fin**.
3. Según el tipo de pregunta:
   - **De aves:** se muestra el texto, y **3 aves** (la correcta y **2 al azar**) **llegan volando** a tres posiciones frente a ti, una tras otra (350 ms de diferencia). Si es la de canto, **suena el canto** 1,5 s después y hay un botón «Oír» para repetirlo.
   - **De tarjetas:** aparecen **3 tarjetas apiladas** (una sobre otra: así se ven las tres **sin girar** el celular vertical). El texto se parte en líneas y **achica la letra** si no cabe.
   - **De dieta:** aparecen **3 alimentos 3D** en fila (flores, frutas, insectos), con su nombre.

## 5. Responder (`responderQuiz` y `responderOpcion`)
- Con **aves**: tocas un ave → si es la correcta, **celebra** (salta y gira), **canta**, sale **confeti** y una etiqueta verde «¡Correcto! + nombre»; si no, suena el **error**, su etiqueta se pone **coral** con su nombre, y **la correcta se señala** («Era: …») y celebra.
- Con **tarjetas/alimentos**: la tarjeta se tiñe de **verde** o **rojo**; si fallaste, **se marca la correcta**.
- **Siempre** se muestra el **dato curioso**.
- Un **candado** (`bloqueado`) evita que respondas dos veces.

## 6. Contar y pasar a la siguiente (`resolverPregunta`)
```js
if (bien) q.aciertos++; else q.vidas--;
q.n++;
despues(rondaQuiz, dato ? Math.min(7500, 2200 + dato.length * 45) : 2600);
```
Suma un acierto o **resta una vida**, avanza el contador y **espera para pasar a la siguiente**: **más tiempo si hay un dato curioso largo** (2,2 s + 45 ms por letra, con tope 7,5 s) para que **alcances a leerlo**.

## 7. El final (`finQuiz`)
- Cuenta tus aciertos y dice por qué terminó («Se acabaron las vidas» o «¡Completaste las 20 preguntas!»).
- Si tienes **≥ 10 aciertos**: «¡Eres un **Guardián de las Aves UAO**!» + **confeti** + sonido de éxito + medalla.
- Si no: «Consigue 10 para ser Guardián».
- Botón **«Jugar otra vez»**.
- **Guarda el mejor puntaje** en la libreta (`Libreta.quiz`): se queda con el **más alto**. En «Mi libreta» aparece el número y la insignia si ≥ 10.
- Si sales **a la mitad**, se guarda lo conseguido hasta ahí.

## 8. La pregunta arriba (la interfaz)
`encabezadoQuiz` arma la línea **«Pregunta 4/20 - Aciertos 3 ♥♥»**: los corazones son íconos SVG; los **perdidos** se ven vacíos y tenues (`.vida.perdida`). La pregunta va en un recuadro blanco arriba, el aviso de ayuda se muestra **abajo** y el botón de «Tamaño real» y el de **Cinemática** se esconden/atenúan para **no tapar** nada.

## 9. Decisiones de diseño que tomaron (y por qué)
- **2 vidas** (idea de **Sebastián**, tu compañero que probaba): antes eran 5 preguntas y el «mejor puntaje» se topaba en 5/5; además había más preguntas de las que se veían. Con vidas hay **tensión** y **rejugabilidad**.
- **Tope de 20** por partida (no del banco): suficiente reto sin ser eterno.
- **Guardián con 10:** la mitad del tope: alcanzable pero con mérito.
- **Tono serio** y **dato curioso** después: que **enseñe** (no solo evaluar).
- **Solo aves y entorno UAO:** nadie lee la guía antes de usar la app, así que no se preguntó por la Escuela de Turismo ni por la bibliografía.
- **Spoiler arreglado:** en la primera versión, si ya habías registrado un ave, su **nombre aparecía sobre ella** en el quiz = ¡la respuesta! Se corrigió: en el quiz no hay etiquetas con nombre.
- **El texto «¡Correcto!» se cortaba** en pantallas angostas: se arregló con el ajuste automático de etiquetas.

## 10. Cómo se relaciona con el aprendizaje
**Aprender → practicar → evaluar:** Avistar y Binoculares enseñan **cómo identificar**; Llamar enseña los **cantos**; Comedero enseña **dieta**; el Quiz **evalúa** las tres cosas + datos del campus. Eso es un **ciclo pedagógico** completo (puedes mencionarlo).

## 11. Un detalle técnico bonito: no se «acumula basura»
Cada ronda **elimina** las tarjetas y alimentos anteriores y **libera su memoria** (`dispose`). Y si cambias de modo en medio del quiz, se **cancelan** los temporizadores pendientes para que no aparezcan cosas de una pregunta vieja.

## Para decirle al profesor
> «El quiz tiene un banco de 59 preguntas sobre aves, su ecología y el entorno UAO. Cada partida arma un mazo de hasta 20 mezclando tipos sin repetir; se responde tocando objetos 3D (aves que llegan volando, tarjetas o alimentos), con 2 vidas y un dato curioso tras cada respuesta. Con 10 aciertos se obtiene la insignia Guardián y el mejor puntaje se guarda en la libreta del dispositivo.»

## Autoevaluación
1. ¿Cuántas preguntas hay y de qué tipos?
2. ¿Cómo se arma el mazo de una partida?
3. ¿Cómo se responde en cada tipo de pregunta?
4. ¿Qué pasa al acertar y al fallar?
5. ¿Cuándo se gana la insignia y dónde se guarda el puntaje?
6. ¿Qué cambios de diseño se hicieron y por qué (vidas, spoiler, etc.)?
