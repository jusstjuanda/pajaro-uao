# 19 · Relación con la materia «Fundamentos de Realidad Virtual»

## Resumen en 1 minuto
La materia trata de **cómo se construyen experiencias inmersivas e interactivas** (realidad virtual, aumentada y mixta): qué es la inmersión, cómo se rastrea al usuario, cómo se interactúa, cómo suena el espacio, cómo se mantiene fluido y cómodo. **Aves UAO es una aplicación de Realidad Aumentada** hecha en la web, y casi todos los conceptos de la materia aparecen en ella. Este capítulo explica cada concepto **desde cero** y dice **dónde está en el proyecto** y **qué decir**.

> **Aviso honesto.** No tengo las diapositivas del profesor. Lo que sigue son los conceptos **estándar** de RV/RA, más lo que vi en tu carpeta `_TEMP` (rúbricas, proyecto de Unity del Parcial 1). **Repasa este capítulo con tus apuntes de clase** y reemplaza mis palabras por las del profesor donde difieran.

---

## 1. Qué le importa al profesor (pistas reales)
En tu carpeta `_TEMP` está la rúbrica del **Parcial 1** (juego cooperativo en Unity). Sus criterios de evaluación eran:

| Criterio | Peso |
|---|---|
| Programación | 25 % |
| Inmersión | 25 % |
| Diseño | 15 % |
| **Presentación y Sustentación Técnica** | **35 %** |

Y pedía: «audio espacial funcional», «uso de distancia y dirección», «interacción avanzada», «sistema de reinicio»… Y un **documento técnico** con arquitectura y explicación del sistema.

**Lo que sugiere (es una inferencia, no un dato del Parcial 2):** el profesor da mucho peso a **inmersión, audio espacial y a que sepas explicar lo que hiciste**. La rúbrica del Parcial 2 que tenemos **no trae porcentajes**, pero el patrón apunta a lo mismo. Por eso este repaso importa tanto.

---

## 2. RV, RA, RM y XR: las definiciones
- **Realidad Virtual (RV / VR):** el mundo que ves es **100 % digital** y reemplaza al real (típico con visor). Ejemplo: un juego en un visor Quest.
- **Realidad Aumentada (RA / AR):** el mundo **real se ve** (por la cámara o por un lente transparente) y **se le agregan objetos digitales**. Ejemplo: Pokémon GO.
- **Realidad Mixta (RM / MR):** lo digital **entiende y reacciona al mundo real** (se esconde detrás de una mesa, se apoya en el piso). Es una RA «avanzada».
- **XR (Extended Reality):** paraguas que incluye las tres.

### El continuo de Milgram (realidad–virtualidad)
Una línea con el **entorno real** en un extremo y el **entorno 100 % virtual** en el otro:
```
Entorno real ——— Realidad Aumentada ——— Virtualidad Aumentada ——— Entorno virtual
                  (virtual sobre real)    (real sobre virtual)
                  └────── Realidad Mixta ───────────────┘
```
**En nuestro proyecto:**
- La experiencia principal (**Avistar, Binoculares, Llamar, Comedero, Foto, Quiz**) = **RA** (aves 3D sobre el video de la cámara).
- «**Tamaño real**» = RA más cercana a **mixta** (reconoce el piso con WebXR/ARCore).
- La **Cinemática** = experiencia **virtual** (campus 3D completo) vista en pantalla de celular, no con visor.
- Modo **sin cámara** (campus simulado) = escena virtual de fondo.

---

## 3. Los conceptos de la materia, uno por uno (y dónde están en el proyecto)

### 3.1 Inmersión y presencia
- **Inmersión:** qué tanto la tecnología te «rodea» y bloquea el mundo real (pantalla, sonido, campo de visión, interacción natural). Es una propiedad **del sistema**.
- **Presencia:** la **sensación de estar ahí** (propiedad **tuya**). Lo ideal es que, aunque sepas que es virtual, tu cuerpo reaccione «como si fuera real».
- **En el proyecto:** el video real de fondo, aves que **reaccionan** (miran, vuelan hacia ti, cantan), sonido que **viene de un lado**, el giroscopio que hace que el mundo gire contigo, y la cinemática que te «mete» al campus. **Límite honesto:** en un celular el nivel de inmersión es bajo (no hay visor, la pantalla es pequeña).

### 3.2 Tracking (seguimiento) y grados de libertad (DoF)
- **Tracking:** medir dónde está y hacia dónde mira el usuario/dispositivo.
- **3DoF (3 grados de libertad):** solo **rotaciones** (mirar a los lados, arriba/abajo, inclinar la cabeza). **No** detecta que camines.
- **6DoF:** rotaciones **y** posición (caminar, agacharte).
- **En el proyecto:**
  - RA principal = **3DoF** con el **giroscopio y la brújula** del celular (evento `deviceorientation`, capítulo 9). Por eso las aves están «a tu alrededor» pero si caminas, **caminan contigo** (no están ancladas al piso).
  - «Tamaño real» = **6DoF** con **WebXR** (ARCore reconoce el piso y sigue tu posición). Solo Android.
  - Cinemática: 3DoF para mirar alrededor (la cámara viaja sola por la ruta).

### 3.3 Registro/anclaje (que lo virtual «encaje» con lo real)
- **Registro (registration):** alinear lo virtual con el mundo real para que parezca pertenecer a él.
- **Marcadores vs sin marcadores:** marcadores = imágenes que sirven de ancla; sin marcadores = sensores o reconocimiento del entorno (**SLAM**: ARCore/ARKit construyen un mapa mientras te mueves).
- **En el proyecto:** sin marcadores (cámara + giroscopio) y, donde se puede, WebXR (`hit-test` = «lanzar un rayo al mundo real y ver dónde choca con el piso»). El anclaje es **parcial**: lo decimos con honestidad.

### 3.4 Interacción
- Formas: **tocar**, **apuntar con la mirada** (retícula), **arrastrar**, **gestos**, **voz**, **controles**.
- **En el proyecto:**
  - **Tocar** (rayo desde la cámara: *raycasting*), 
  - **mirar y centrar** (binoculares y foto: el centro de la pantalla es el «apuntador»),
  - **arrastrar** (mirar alrededor en el simulado y en la cinemática),
  - **botones** de modo, panel de cantos, comederos con alimento 3D,
  - **responder el quiz tocando objetos 3D**.
- **Retroalimentación (feedback):** cada acción responde con **sonido + animación + aviso** (cantar, aletear, partículas, sonido de acierto/error).

### 3.5 Audio espacial
- **Audio espacial:** el sonido **parece venir de una posición** del espacio. Se logra con diferencias de **volumen** y **tiempo** entre los dos oídos (y con modelos más avanzados, HRTF).
- **En Unity (Parcial 1):** *Spatial Blend* (2D→3D), *Volume Rolloff* (el volumen baja con la distancia) y *Doppler*.
- **En el proyecto:** cada canto se emite con **paneo estéreo** (`StereoPannerNode`) según **dónde está el ave respecto a hacia dónde mira el usuario** (se calcula el ángulo y se convierte en un valor de −1 a 1: izquierda…derecha). Hay también **reverberación** (eco suave) y, en la cinemática, un **ambiente** (viento y cantos lejanos). **Lo que NO hace:** no cambia el volumen por distancia ni usa Doppler/HRTF. Es **audio posicional simplificado** (izquierda/derecha). Si te preguntan, dilo así: *«paneo estéreo por azimut; mejoraría con `PannerNode` HRTF y atenuación por distancia»*.

### 3.6 Cámara, perspectiva y campo de visión (FOV)
- **Cámara virtual:** el «ojo» de la escena 3D. **Perspectiva:** lo lejano se ve más pequeño.
- **FOV (campo de visión):** cuánto del mundo ve la cámara. Un FOV menor = **zoom**.
- **En el proyecto:** FOV **62°** en la RA, **21°** en binoculares (zoom ≈ 3×), **66°** en la cinemática. El FOV de la cámara virtual debe **coincidir con el del video** para que lo virtual no «se deslice»: por eso al hacer zoom se escala también el video.

### 3.7 Render en tiempo real y rendimiento
- **Tiempo real:** el computador **vuelve a dibujar ~60 veces por segundo** (cada cuadro, un `requestAnimationFrame`).
- **Latencia:** retraso entre que mueves el celular y ves el cambio. En RV una latencia alta marea. Aquí se usa un suavizado (`slerp 0.35`) que equilibra **fluidez** vs **retraso**.
- **Optimización:** polígonos, órdenes de dibujo, instancias, resolución (capítulo 16).

### 3.8 Comodidad y mareo (*cybersickness*)
- Se produce cuando lo que **ven los ojos** no coincide con lo que **siente el oído interno** (por ejemplo, la cámara se mueve pero tú estás quieto).
- **En la cinemática se tomaron medidas** (son buenas prácticas y puedes presumirlas):
  - **Velocidad constante** (sin sacudidas).
  - **Arranque y frenado suaves** (primer y último 4 %).
  - **El horizonte nunca se inclina** al mirar alrededor (el giro lateral es sobre el eje vertical del mundo).
  - **Botón «Saltar»** y **velocidad ×1/×2/×4** (el usuario controla).
  - Duración corta (~108 s).
  - Resolución limitada para mantener los cuadros por segundo estables.

### 3.9 Diseño de la experiencia (UX) en RA
- Interfaz **legible sobre el video** (fondos translúcidos), **textos que no se salen** de la pantalla en ningún tamaño, avisos de ayuda por modo, botón de salida siempre visible.
- **Mirada del usuario:** la información importante (la pregunta del quiz) no tapa lo que hay que tocar.
- **Plan B sin cámara** (campus simulado).
- **Retroalimentación sonora** coherente con cada acción (la rúbrica pide «sonidos acordes a las acciones»).

### 3.10 Estándares y plataformas
| Estándar | Qué es | Dónde está |
|---|---|---|
| **WebGL** | Dibujar 3D con la GPU desde el navegador | three.js lo usa por debajo |
| **WebXR Device API** | Estándar del navegador para RA/RV real (`immersive-ar`, `immersive-vr`) | «Tamaño real» (solo Android con ARCore) |
| **getUserMedia** | Pedir la cámara | Video de fondo |
| **DeviceOrientation** | Leer giroscopio/brújula | Mover la cámara virtual |
| **Web Audio API** | Sintetizar y procesar audio | `sonido.js` |
| **HTTPS** | Conexión segura, obligatoria para cámara/sensores | GitHub Pages |

### 3.11 Del Parcial 1 al Parcial 2: lo que cambia y lo que se parece
| | Parcial 1 («Rescate Cooperativo») | Parcial 2 (Aves UAO) |
|---|---|---|
| Plataforma | **Unity** (escritorio) | **Web** (celular) |
| Tipo | Videojuego **cooperativo** local (4 jugadores) | **RA** educativa/informativa |
| Entrada | New Input System (teclados) | Táctil + sensores del celular |
| Audio | Audio 3D nativo de Unity | Web Audio con paneo estéreo |
| Lenguaje | C# | JavaScript |
| Lo común | Cámara, escena, objetos interactivos, audio espacial, reinicio/estado, **explicar arquitectura** | |

(Esta tabla es útil si te preguntan: «¿qué aprendieron en el Parcial 1 que aplicaron aquí?»: cámara/escena, audio espacial, estados del juego, pensar en arquitectura.)

---

## 4. Qué NO es el proyecto (para no sobrevender)
- **No es RV con visor.** Es RA en pantalla de celular (más una cinemática en pantalla).
- **No es 6DoF** salvo «Tamaño real» en Android.
- **No hace oclusión** (las aves no se esconden detrás de objetos reales).
- **No reconoce el entorno** (no sabe que hay un árbol real o una banca).
- **No es multijugador.**

## 5. Cómo se podría llevar a RV con visor (trabajo futuro)
three.js ya integra `renderer.xr`, el soporte de WebXR. Con unos cambios, la **cinemática** podría verse en un visor (por ejemplo, Meta Quest) con una sesión `immersive-vr`, con la cámara siguiendo la ruta y la cabeza controlando la mirada. **No está implementado**: dilo como idea futura.

## 6. Cómo conectar cada pedido de la rúbrica con esta materia
| Rúbrica del Parcial 2 | Concepto de la materia | Dónde en Aves UAO |
|---|---|---|
| RA como corazón | Realidad aumentada, registro | Video + aves 3D con giroscopio |
| ≥ 5 interacciones RA | Interacción, retroalimentación | 7 modos |
| Sonidos acordes | Audio espacial y feedback | `sonido.js` con paneo y efectos |
| Quiz inmersivo | Interacción con objetos 3D | Respuestas tocando aves/tarjetas/alimentos 3D |
| Android/iOS | Plataformas y estándares | Web + WebXR opcional |
| Animaciones, audios, videos | Contenido multimedia | Animación procedural, síntesis y cinemática |
| Aplicativo funcional (web) | Despliegue | GitHub Pages |

## Para decirle al profesor
> «Aplicamos los fundamentos de la materia: una escena 3D con cámara y perspectiva, tracking de 3 grados de libertad con el giroscopio —y de 6 con WebXR donde está disponible—, interacción por toque, mirada y arrastre con retroalimentación sonora y visual, audio posicional por paneo estéreo, y optimización de rendimiento. En la cinemática cuidamos la comodidad: velocidad constante, arranque suave y horizonte estable. Reconocemos los límites: es RA en pantalla, sin oclusión y con anclaje solo en Android.»

## Autoevaluación
1. Diferencia entre RV, RA y RM. ¿Dónde cae nuestro proyecto?
2. ¿Qué es 3DoF y 6DoF? ¿Cuál usa la RA principal?
3. ¿Qué es el audio espacial y qué parte logramos?
4. ¿Qué es presencia e inmersión?
5. Menciona tres decisiones de la cinemática para evitar el mareo.
6. ¿Qué es el FOV y por qué se escala el video al hacer zoom?
7. Nombra tres estándares web usados.
8. ¿Qué cosas NO hace el proyecto?
