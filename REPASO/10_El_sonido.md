# 10 · El sonido: cómo se «inventan» los cantos con código

## Resumen en 1 minuto
Los cantos y efectos de la app **no son grabaciones**: se **generan con código** usando la **Web Audio API** (una herramienta del navegador para crear sonido). Un «tono» se fabrica con un **oscilador** (una onda que sube y baja miles de veces por segundo), se le da forma de **volumen** (empieza suave, se mantiene, se apaga), se le **filtra**, y se envía a los parlantes, **a la izquierda o la derecha** según dónde esté el ave. Cada canto es una **pequeña partitura** de tonos y ruidos que imita el patrón del canto real. Todo está en **`js/sonido.js`** (≈255 líneas).

---

## 1. Qué es el sonido (física en 30 segundos)
- Un sonido es una **vibración del aire**. Si vibra rápido, se oye **agudo**; si vibra lento, **grave**.
- **Frecuencia** = cuántas vibraciones por segundo, medida en **Hz** (hertz). El oído humano oye de ~20 Hz a ~20.000 Hz. Las aves cantan sobre todo **entre 1.000 y 7.000 Hz** (agudo, como silbidos). Un colibrí chilla a ~7.000 Hz; una garza grazna a ~300–500 Hz.
- **Amplitud** = qué tan fuerte vibra → el **volumen**.
- **Forma de la onda** = el «timbre» (por qué una flauta y una guitarra suenan distinto aunque toquen la misma nota). Las que usamos:
  - **`sine`** (seno): suave, como un silbido puro. (azulejo, mirla, colibrí)
  - **`square`** (cuadrada): áspera, «electrónica». (bichofué, pellar)
  - **`sawtooth`** (diente de sierra): rasposa, «zumbante». (garza, loro)
  - **`triangle`** (triangular): suave pero con algo de brillo. (periquito)

## 2. Cómo se hace sonido en un navegador (Web Audio API)
La Web Audio API funciona como una **mesa de mezclas con cables**: creas **nodos** (aparatos) y los **conectas** entre sí hasta llegar a los **parlantes**.

```
oscilador ──► (filtro) ──► ganancia (volumen) ──► paneo (izq/der) ──┬──► volumen general ──► PARLANTES
                                                                     └──► reverberación ──► volumen general
```
Los nodos que usamos:
| Nodo | Qué es | Para qué |
|---|---|---|
| `OscillatorNode` | Un generador de onda | Crear la nota |
| `GainNode` | Perilla de volumen | Controlar fuerza (y su evolución en el tiempo) |
| `BiquadFilterNode` | Un filtro | Dejar pasar solo ciertas frecuencias (`bandpass` = «banda»: solo lo de alrededor de X Hz) |
| `StereoPannerNode` | Paneo | Mandar el sonido **más a la izquierda o derecha** |
| `ConvolverNode` | Reverberación | Dar **eco de espacio abierto** |
| `AudioBufferSourceNode` | Un «audio» guardado en memoria | Aquí, ruido blanco |

## 3. El corazón: la función `tono(...)`
```js
function tono(out, t0, dur, f0, f1, tipo = "sine", vol = 0.3, opt = {}) { ... }
```
Los parámetros: **dónde** sale (`out`), **cuándo** empieza (`t0`), **cuánto dura** (`dur`), **frecuencia inicial y final** (`f0`→`f1`), **forma de onda**, **volumen** y **opciones**. Hace lo siguiente:
1. Crea un **oscilador** con la forma de onda pedida.
2. **Barre la frecuencia** de `f0` a `f1` durante `dur` (un «glissando»): los silbidos de las aves **suben o bajan** de tono.
3. Crea una **envolvente de volumen**: sube muy rápido (ataque de ~8 milisegundos), se mantiene y **baja a casi cero** al final. Sin esto se escucharía un «clic» feo al empezar/terminar.
4. Opciones (`opt`) para **dar carácter**:
   - `vib` → **vibrato** (la nota «tiembla» suavemente; otro oscilador lento modula la frecuencia).
   - `am` → **modulación de amplitud**: el volumen vibra rápido (da el sonido «roncante» del carpintero y la garza).
   - `fm` → **modulación de frecuencia**: efecto metálico/chillón (periquito).
   - `filtro` → pasa por un filtro (`["bandpass", 1700, 2]` = «deja solo el sonido alrededor de 1700 Hz»).
   - `fMid`/`midAt` → un **punto intermedio** de la frecuencia (para trinos que suben y bajan).

## 4. El ruido
Algunos sonidos naturales no son tonos sino **ruido** (el «tac-tac» del carpintero, los aleteos). La función `ruido(...)` crea **2 segundos de números aleatorios** (ruido blanco), los reproduce, los pasa por un **filtro de banda** y les da una envolvente corta. Según la banda y la duración suena como un **golpecito** (carpintero), un **soplido** (aleteo) o el **viento**.

## 5. Un canto, explicado
### Bichofué (el «bi-cho-fué»)
```js
bichofue(o, t) {
  tono(o, t,        0.11, 1750, 1500, "square", 0.12, { filtro: ["bandpass", 1700, 2] });   // "bi" (corto, baja un poco)
  tono(o, t + 0.17, 0.11, 1550, 1350, "square", 0.12, { filtro: ["bandpass", 1500, 2] });   // "cho" (corto, baja)
  tono(o, t + 0.34, 0.36, 1200, 1500, "square", 0.14, { fMid: 2300, midAt: 0.35, filtro: ["bandpass", 1900, 1.5] }); // "fué" (largo: sube y luego baja)
  return 0.75;     // dura 0,75 s
}
```
Tres tonos cuadrados en secuencia: dos sílabas cortas y una larga que **sube y baja**, como el llamado fuerte de la especie.

### Carpintero (tamborileo)
```js
tono(o, t, 0.55, 1850, 1650, "sine", 0.18, { am: 32 });                 // un trino con volumen "temblando" 32 veces/s
for (let i = 0; i < 18; i++) { ruido(o, x, 0.025, 900, 3, 0.5); x += gap; gap *= 0.97; }   // 18 golpes cada vez más rápidos
```
El `gap *= 0.97` hace que cada golpe llegue un poco **antes** que el anterior: el tamborileo **acelera**, como un carpintero real.

### Garza (el «rrak-rrak»)
Dos graznidos de **onda diente de sierra** grave (480→300 Hz), con modulación de volumen y un poco de ruido: **ronco y grave**.

### Otros
- **Azulejo:** 9 pitidos muy agudos al azar entre 4.200 y 6.200 Hz.
- **Mirla:** frases lentas de **silbidos limpios** que suben y bajan (sin vibrato: los zorzales no lo tienen).
- **Pellar:** 8 «chips» ásperos rápidos (onda cuadrada filtrada + ruido).
- **Colibrí:** 7 «tics» agudísimos (~7.000 Hz).
- **Garrapatero:** un silbido que **sube** («uuu-íik»), repetido.
- Se usa `R(a, b)` (un número al azar entre a y b) para que **cada vez suene un poco distinto**, como un ave real.

## 6. La reverberación (el «aire»)
Al inicio (`iniciar()`) se fabrica una **respuesta de eco**: 1,6 segundos de ruido que se va apagando. Un `ConvolverNode` la usa para dar **reverberación** (el sonido «rebota» en un espacio abierto). Una parte de cada canto se manda ahí (volumen 0,28) y otra va directa.

## 7. El paneo (sonido «espacial» simple)
```js
Sonido.cantar(a.esp.canto, 1, THREE.MathUtils.clamp(Math.sin(Math.atan2(a.obj.position.x, -a.obj.position.z) - rumbo()), -1, 1))
```
Se calcula el **ángulo** del ave respecto a hacia dónde miras y se convierte en un número de **−1 (todo izquierda) a +1 (todo derecha)**. Con audífonos o parlantes estéreo, el canto suena **del lado donde está el ave**. Es un recurso de **audio espacial** sencillo (no es audio 3D completo).

## 8. Los efectos y el ambiente
| Función | Qué suena |
|---|---|
| `clic()` | Un «pop» corto al cambiar de modo |
| `exito()` | 4 notas ascendentes (un arpegio) al acertar |
| `error()` | Un zumbido grave corto al fallar |
| `obturador()` | Dos «clacs» de ruido (la cámara) |
| `aleteo(pan)` | 6 soplidos rápidos (un ave que vuela) |
| `registro()` | Dos notas altas («¡registrada!») |
| `ambiente(on)` | **Viento** (ruido filtrado con un lento vaivén) + **cantos suaves al azar** cada 1–3 s; lo usa la cinemática |

## 9. Reglas del navegador sobre el audio
Los navegadores **bloquean el sonido automático** (para que las páginas no te griten al abrirlas). El audio solo se activa tras un **toque del usuario**; por eso `Sonido.iniciar()` se llama cuando tocas «Iniciar la experiencia RA» (o cualquier botón de la guía que lo use). Si el contexto está «suspendido», se reanuda con `ctx.resume()`.

## 10. ¿Por qué sintetizar y no grabar?
| Razón | Detalle |
|---|---|
| **Licencias** | Las grabaciones de Xeno-canto (CC) exigen **crédito por cada grabación** y a veces prohíben usos comerciales; las de la Macaulay Library no son abiertas; WikiAves requeriría permiso de cada autor |
| **Peso** | 12 audios en MP3 pesarían MB; el código pesa unos KB |
| **Control** | Podemos hacer que cada canto suene **ligeramente distinto** cada vez, con paneo y reverberación |
| **Simplicidad** | Sin descargas ni problemas de formatos entre Android/iPhone |

Siempre se aclara: **«cantos recreados, no grabaciones»** (está en el pie de la página). Para escuchar los reales hay **enlaces a WikiAves** en cada ficha.

## 11. Honestidad sobre la fidelidad
- La IA **no puede oír**: afinó los cantos a partir de **descripciones** de las especies (frecuencias típicas, ritmo, número de notas). Quien los oye eres **tú**: te gustaron, pero **no son idénticos** a los reales y **no hay que decir que lo son**.
- Si el profesor pregunta: «¿por qué suenan así?», responde: *«Son síntesis que imitan el patrón rítmico y el rango de frecuencias de cada llamado; no pretenden ser una grabación».*

## 12. Experimento
En `sonido.js`, en `bichofue`, cambia `1750` por `3000` y recarga: el bichofué sonará **mucho más agudo** (una frecuencia más alta = nota más aguda). Devuélvelo a 1750.

## Para decirle al profesor
> «Los sonidos son síntesis con la Web Audio API: osciladores con barridos de frecuencia, envolventes de volumen, filtros, modulación (vibrato, AM, FM) y ruido filtrado para golpes y soplidos. Cada canto es una secuencia corta que imita el patrón de su especie. Añadimos reverberación y paneo según la posición del ave para dar sensación espacial. Elegimos sintetizar para evitar problemas de licencias y de peso, y enlazamos a WikiAves para escuchar las grabaciones reales.»

## Autoevaluación
1. ¿Qué son la frecuencia y el volumen? ¿Cómo se relacionan con los cantos?
2. ¿Qué hace un oscilador? ¿Qué diferencia hay entre `sine`, `square` y `sawtooth`?
3. ¿Qué es una envolvente de volumen y por qué se necesita?
4. ¿Para qué sirve el ruido filtrado?
5. ¿Cómo funciona el paneo?
6. ¿Por qué el sonido solo empieza tras un toque?
7. ¿Por qué sintetizamos en vez de usar grabaciones?
