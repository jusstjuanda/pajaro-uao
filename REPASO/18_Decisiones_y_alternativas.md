# 18 · Por qué así y no de otra manera (decisiones y alternativas)

## Resumen en 1 minuto
Para cada decisión grande hay **otras formas de hacerlo**. El profesor puede preguntar «¿y por qué no X?». Este capítulo te da, por cada decisión: **qué elegimos**, **qué otras opciones existen** (explicadas desde cero), **por qué la nuestra encaja** y **qué se pierde** por haberla elegido. Todo está dicho con honestidad: al final hay una sección con **lo que NO sabemos** (por ejemplo, el motivo exacto por el que el compañero eligió three.js en vez de A-Frame no quedó escrito en ninguna parte).

> **Regla de oro para responder «¿por qué no X?»:** nunca digas «porque X no se puede». Casi siempre *sí se podía*. Di: «X también es válido; elegimos Y porque para **este** proyecto nos daba [razón concreta], y a cambio aceptamos [costo]».

---

## 1. Mapa de las grandes decisiones
| # | Decisión | Elegimos | Otras opciones |
|---|---|---|---|
| 1 | ¿App instalable o página web? | **Página web** | Unity (APK/iOS), app nativa |
| 2 | ¿Qué herramienta 3D? | **three.js puro** | A-Frame, Babylon.js, PlayCanvas, Unity |
| 3 | ¿Cómo hacer la RA? | **Cámara + giroscopio, sin marcadores** (+ WebXR opcional) | Marcadores/imágenes (AR.js, MindAR, Vuforia), AR Foundation, `<model-viewer>` |
| 4 | ¿De dónde salen los modelos? | **Hechos con código** | Blender + glTF, modelos descargados, escaneos |
| 5 | ¿Cómo suenan las aves? | **Sonido sintetizado** | Grabaciones reales (Xeno-canto, WikiAves) |
| 6 | ¿Dónde se guarda lo del usuario? | **`localStorage`** | Servidor + base de datos + cuentas |
| 7 | ¿Cómo se publica? | **GitHub Pages** | Hosting de pago, servidor propio |
| 8 | ¿Cómo se organiza el código? | **Archivos JS sueltos, sin compilar** | React/Vue, Node, bundlers (Vite, webpack) |
| 9 | ¿Cómo se ve el 3D? | **Low-poly** | Realista, ilustración (toon) |
| 10 | ¿«Video» de la rúbrica? | **Cinemática 3D en vivo** | Video grabado |
| 11 | ¿Qué hacer sin cámara? | **Campus simulado** | Exigir siempre cámara |
| 12 | ¿Cómo apuntar a un ave? | **Toque + rayo (raycasting)** | Mirar fijamente, botones |

---

## 2. Decisión 1 — Página web y no app instalable

**Qué es cada cosa**
- **Página web:** abres un enlace en el navegador (Chrome, Safari) y funciona; no instalas nada.
- **App instalable (APK en Android, app en iPhone):** descargas un programa. Se hace típicamente con **Unity** (un motor de videojuegos).

**Por qué web (razones reales y verificables)**
1. **La rúbrica lo permite explícitamente:** «aplicativo funcional en página web (o APK)».
2. **Funciona en Android y en iPhone con el mismo código.** Con Unity tendrías que generar un APK para Android y *otra* compilación para iPhone; y **para iPhone hace falta un Mac con Xcode** (nosotros trabajamos en Windows). Esto es una limitación general de Apple, no un invento: compilar para iPhone se hace con herramientas de Apple.
3. **Se actualiza al instante:** subes un cambio (`push`) y en ~20 segundos todos ven la nueva versión. Un APK habría que volver a generarlo y reinstalarlo.
4. **Se comparte con un enlace o un QR** (ideal para un pitch y para «mostrarla a la comunidad», que es lo que dice la rúbrica del mejor proyecto).

**Qué perdemos**
- Menos potencia que una app nativa (por eso cuidamos tanto el rendimiento, capítulo 16).
- **No hay acceso total a los sensores**: en iPhone no existe WebXR, así que «Tamaño real» no funciona ahí.
- Hace falta internet para cargar three.js la primera vez (capítulo 5).

> **Dato de contexto (para ti, no para afirmarlo como razón del equipo):** en tu carpeta `_TEMP` vi que el **Parcial 1** de la materia fue un juego en **Unity** («Rescate Cooperativo») y que hay un proyecto Unity con **Vuforia** de una «tarjeta de presentación» en RA. O sea: el equipo *sí conoce* Unity. Si el profesor pregunta «¿por qué no Unity, que vimos en clase?», la respuesta honesta es la de arriba: para este parcial la rúbrica permitía web, y la web llega a Android **y** iPhone sin instalar nada.

---

## 3. Decisión 2 — three.js puro, y la pregunta del millón: «¿por qué no A-Frame?»

### 3.1 Qué es A-Frame (desde cero)
**A-Frame** es un *marco de trabajo* (framework) creado para hacer experiencias de **realidad virtual y aumentada en la web** escribiendo **etiquetas parecidas a HTML**. Por ejemplo:
```html
<a-scene>
  <a-box position="0 1 -3" color="#4CC3D9"></a-box>
  <a-sky color="#ECECEC"></a-sky>
</a-scene>
```
Eso crea una escena con un cubo azul, **sin escribir JavaScript**. Es muy cómodo para empezar y para prototipos.

**Lo más importante: A-Frame está construido SOBRE three.js.** Es decir, por debajo A-Frame *usa three.js* para dibujar. Es como un **"kit de armado" encima del motor**. Por eso la pregunta «¿three.js o A-Frame?» no es «¿cuál es mejor?» sino «¿quiero la capa cómoda o quiero hablar directo con el motor?».

| | **A-Frame** | **three.js puro** (lo que usamos) |
|---|---|---|
| Cómo se escribe | Etiquetas `<a-…>` + componentes | Código JavaScript |
| Para qué es cómodo | Prototipos rápidos, escenas simples, escenas de RV | Control total, efectos y lógica propios |
| Qué esconde | three.js (puedes llegar a él, pero hay una capa) | Nada: tú ves y controlas todo |
| Estructura interna | «Entidad–componente» (cada cosa = entidad con piezas) | Libre: tú decides la arquitectura |
| RA en la web | Normalmente con **AR.js** (marcadores, imágenes o GPS) o WebXR | Tú decides: cámara + giroscopio, WebXR… |

### 3.2 La respuesta honesta
**¿Por qué no usaron A-Frame? ¿No pudieron?** — Sí se podía usar A-Frame. **No es que «no se pudiera».** Esto es lo que se sabe y lo que no:

- **Sí sabemos (está en la bitácora):** el proyecto es **three.js puro, sin A-Frame**. Lo verificamos revisando el código el 15 de octubre. Lo hizo así el compañero que publicó la primera versión el 12 de octubre.
- **NO sabemos:** el **motivo exacto** de ese compañero. No quedó escrito en la bitácora original. **Antes del sábado, pregúntale a `jusstjuanda` (o a quien escribió la primera versión) por qué eligió three.js**, para que ustedes respondan lo mismo. Y no inventes un motivo: si no lo sabes, di lo que *sí* es defendible técnicamente (abajo).

### 3.3 Razones técnicas defendibles (verdaderas para este proyecto)
1. **Casi todo lo que hicimos es lógica propia, no «escena declarada»:** las aves se construyen con funciones (`crearAve`), la cámara se mueve con **cuaterniones calculados desde el giroscopio**, hay una **máquina de modos** (avistar, binoculares, llamar…), colocación sin cruces, un quiz, una cinemática con curvas, **instancias** y **fusión de mallas** para rendimiento. En A-Frame todo eso habría que escribirlo igual, pero **dentro de «componentes»**, o sea, *three.js con una capa extra*.
2. **Control del rendimiento:** fusionar mallas, `InstancedMesh`, limitar `pixelRatio`, liberar memoria (`dispose`)… con three.js directo lo hacemos sin "pelear" con la capa de A-Frame.
3. **Menos capas = menos cosas que pueden fallar** antes del pitch (y no tenemos Node ni herramientas de compilación: capítulo 5).
4. **Video + canvas transparente propios:** nuestra RA pone el `<video>` de la cámara detrás de un `<canvas>` transparente y mueve la cámara virtual con el giroscopio. Es fácil de controlar a mano; con AR.js/A-Frame esa parte la decide la librería.
5. **No necesitamos marcadores:** AR.js (la opción típica de A-Frame para RA) se basa en **marcadores o imágenes** o en GPS. Para un campus abierto sin imprimir nada, cámara+giroscopio es más libre.

### 3.4 Qué se pierde por no usar A-Frame (sí, hay costos)
- Hay que **escribir más código a mano** (por eso son ~4.200 líneas).
- A-Frame trae cosas hechas (controles de mirada, interfaz de RV, inspector visual) que aquí hubo que programar.
- Para alguien que sabe HTML pero no JavaScript, A-Frame es más amigable. (Pero nosotros trabajamos con una IA que escribe JavaScript sin problema.)

### 3.5 Cómo responderlo en voz alta
> «A-Frame está construido sobre three.js. Nosotros usamos three.js directamente porque casi toda nuestra aplicación es lógica propia: modelos construidos con código, cámara controlada por giroscopio, optimización de rendimiento y varios modos de interacción. Con A-Frame habríamos escrito lo mismo dentro de componentes, con una capa más. A-Frame habría sido buena opción para un prototipo más simple.»

(Si te preguntan «¿y por qué eligieron eso ustedes?», sé honesto: «la primera versión la montó un compañero con three.js; el criterio técnico que lo respalda es éste».)

---

## 4. Otras herramientas 3D / RA que existen (cuándo se usan)

| Herramienta | Qué es | Por qué no la usamos |
|---|---|---|
| **Babylon.js** | Motor 3D web completo, de Microsoft; muy bueno, con herramientas visuales y soporte de WebXR | Es equivalente a three.js; three.js tiene más tutoriales/ejemplos y ya la conocía la base del proyecto. No hay una razón técnica fuerte contra Babylon |
| **PlayCanvas** | Motor web con editor en la nube | Depende de su editor/plataforma; no necesitábamos un editor visual |
| **Unity + AR Foundation (ARCore/ARKit)** | Motor de videojuegos; AR Foundation es su capa de RA para Android (ARCore) e iPhone (ARKit) | Compilar app por plataforma; **iPhone exige Mac/Xcode**; más lento de iterar y de compartir |
| **Vuforia** | Biblioteca comercial de RA con marcadores/imágenes y objetos; se usa mucho con Unity | Necesita cuenta/licencia y funciona con **marcadores**; nosotros queríamos **RA sin imprimir nada** |
| **AR.js / MindAR** | Librerías web de RA con marcadores o imágenes (a veces con A-Frame o three.js) | Mismos motivos: marcadores |
| **8th Wall** | Plataforma comercial de RA web (servicio de pago de terceros) | Es de pago/dependencia externa; no la necesitamos |
| **`<model-viewer>` (Google)** | Etiqueta web que muestra un modelo glTF y lo lleva a RA con el visor del sistema (Android Scene Viewer / iPhone Quick Look) | Sirve para *poner un modelo en tu mesa*, pero **no** para 12 aves con comportamientos, quiz, modos y cinemática propia |
| **Godot, Unreal** | Otros motores de juegos | Mismo argumento que Unity |

---

## 5. Decisión 3 — Cámara + giroscopio, sin marcadores

**Qué es un marcador:** una imagen (como un código QR o una figura) que la cámara reconoce; el modelo 3D se «pega» a ella. Ejemplo típico: una tarjeta de presentación que muestra un modelo al apuntarla.

**Qué hicimos nosotros:** mostramos el video de la cámara, y una **cámara virtual** que gira igual que tu celular (leyendo el giroscopio y la brújula). Las aves se ven «alrededor» tuyo porque la escena 3D gira con el celular (esto es **3DoF**, capítulo 9).

| | **Sin marcadores (la nuestra)** | **Con marcadores** |
|---|---|---|
| Hay que imprimir algo | **No** | Sí |
| Funciona en el campus, de pie en cualquier lugar | **Sí** | Solo frente al marcador |
| Anclaje al piso (que no se muevan al caminar) | **No** (3DoF) salvo WebXR en Android | Sí, respecto al marcador |
| Funciona en iPhone | **Sí** | Sí (con librerías web) |

**Complemento:** «Tamaño real» usa **WebXR** (el estándar del navegador para RA/RV real). Con ARCore detecta el piso y ancla el ave (6DoF). Solo en Android; en iPhone Safari no soporta WebXR.

**Cómo decirlo:** «Elegimos RA sin marcadores basada en orientación porque es la única forma de que funcione igual en Android e iPhone y en un espacio abierto como el campus; añadimos WebXR como mejora donde está disponible».

---

## 6. Decisión 4 — Modelos hechos con código (y no Blender/glTF)

**Qué es glTF:** un formato de archivo estándar para modelos 3D para la web («el JPEG del 3D»). Se crean en programas como **Blender** y se cargan con `GLTFLoader`.

**Por qué código:**
1. **Casi no pesan:** un ave es una función de unas pocas formas; no hay archivos de MB que descargar (la página carga rápido).
2. **Se puede variar por datos:** cambiar un color, el tamaño del pico o el tipo de soporte es **editar una fila** de `especies-ra.js` (12 aves salen de **una sola función** `crearAve` + una ficha de datos).
3. **Animación por código:** aletear, respirar, mirar y cantar son **fórmulas** (seno, interpolación); no hay que "rigear" ni animar hueso por hueso en Blender.
4. **Estilo coherente:** todo (aves, árboles, campus) comparte el mismo look low-poly.
5. **Sin dependencia de archivos externos** que puedan fallar al cargar.

**Qué perdemos:** menos **realismo** (no tiene la finura de un modelo esculpido); menos fácil para un diseñador que no programa; cada ave nueva exige describirla en datos.

**Cómo decirlo:** «Cada ave se construye proceduralmente a partir de una ficha de datos (colores, pico, soporte, marcas). Es una decisión de ligereza y de control: pesa casi nada y podemos animar y modificar todo por código».

---

## 7. Decisión 5 — Sonido sintetizado y no grabaciones

- **Qué hicimos:** con la **Web Audio API** recreamos el *patrón* de cada canto con osciladores, envolventes y filtros (capítulo 10).
- **Por qué:** (1) las grabaciones reales tienen **licencias y exigen crédito** (Xeno-canto: Creative Commons con crédito por grabación; Macaulay Library no es abierta; WikiAves requiere permiso de los autores); (2) pesan 0 bytes; (3) funcionan sin descargas; (4) los podemos **panear en estéreo** según dónde esté el ave.
- **Costo:** **no suenan como el ave real.** Por eso **no lo ocultes**: ofrecemos el enlace a WikiAves para oír el canto real.
- **Decisión del propio Hugo:** «suena a mucha complicación» (se descartó Xeno-canto por llave de API, créditos y anti-bots).

---

## 8. Decisión 6 — `localStorage` y no servidor/base de datos

- **`localStorage`** es un pequeño almacén dentro del navegador (propio de cada celular). Guardamos ahí la **libreta**: aves registradas, hasta 8 fotos y el mejor puntaje del quiz (clave `pajaro-uao-libreta`).
- **Por qué:** no hay servidor, no hay cuentas, no hay costos y es **privado** (las fotos nunca salen del celular).
- **Costo:** **no se sincroniza** entre dispositivos y se pierde si borras los datos del navegador.
- **Alternativa:** un backend (por ejemplo Firebase o un servidor propio) permitiría cuentas, ranking y sincronizar, pero exige servidor, seguridad y manejo de datos personales.

---

## 9. Decisión 7 — GitHub Pages

- **Qué es:** alojamiento **gratis** para sitios estáticos, con **HTTPS** automático. Un *workflow* (`.github/workflows/pages.yml`) publica la carpeta `PaginaPajaro/wwwroot` en ~20 segundos tras cada `push`.
- **Por qué:** gratis, simple, HTTPS (obligatorio para cámara y sensores), versionado con Git.
- **Costo:** solo sirve archivos estáticos (no hay servidor propio); el navegador **cachea ~10 minutos** (recarga forzada con Ctrl+Shift+R).
- **Alternativas:** Netlify, Vercel, un hosting propio.

---

## 10. Decisión 8 — JavaScript sin compilar ni frameworks (importmap + CDN)

- **Qué hicimos:** archivos `.js` que el navegador ejecuta tal cual, y three.js cargado desde un **CDN** con un *importmap* (capítulo 5).
- **Alternativas:** **React/Vue** (frameworks para interfaces), **Node + npm** (gestor de paquetes), **Vite/webpack** (herramientas que empaquetan el código).
- **Por qué no:** el sitio es sobre todo **un lienzo 3D** (React no aporta mucho); no necesitábamos compilar; y **el PC de trabajo no tiene Node** instalado. Menos herramientas = **menos cosas que se rompen** y publicar es copiar archivos.
- **Costo:** sin empaquetado, hay más peticiones y no se "minifica" el código; todo el motor RA vive en un archivo grande (`ra.js`, ~1.100 líneas), que sería más fácil de mantener si se partiera en módulos más pequeños. Es una mejora futura honesta.

---

## 11. Decisión 9 — Low-poly

- **Qué es:** modelos hechos con pocas caras y formas simples (el campus se ve «facetado»; las aves tienen sombreado más suave).
- **Por qué:** (1) rendimiento en celulares; (2) mantiene la coherencia entre aves, árboles y edificios; (3) se construye con formas simples por código.
- **Alternativas:** realista (pesado y difícil de sostener), **ilustración/toon** (Hugo la vio como opción C en el paso 6 y la descartó «por ahora»).

---

## 12. Decisión 10 — Cinemática en vivo y no video grabado

(Ya está en detalle en el capítulo 15.) Resumen: no pesa megas, se puede mirar 360° y acelerar, usa el mismo estilo gráfico, y se pudo hacer con las fotos y mapas del campus sin salir a grabar.

---

## 13. Decisión 11 — Campus simulado sin cámara

Si el usuario **no da permiso de cámara** o está en un **computador**, la RA no se rompe: cambia a un campus 3D de fondo. Ventajas: (1) se puede **proyectar en el pitch**; (2) sirve de **respaldo (plan B)**; (3) la interfaz funciona igual. (Capítulo 14.)

---

## 14. Decisión 12 — Tocar con rayo (raycasting)

Para saber qué ave tocaste, lanzamos un **rayo invisible** desde la cámara por el punto tocado. Cada ave tiene una **esfera invisible de toque** (`zona`) un poco más grande que el ave, para que sea fácil acertar con el dedo. **Alternativa:** botones o «mirar fijamente» (retícula); ésta última sí la usamos en **binoculares y foto** (el centro de la pantalla apunta al ave).

---

## 15. Cosas que se podrían haber hecho distinto (límites de lo que construimos)
- **Un archivo grande** (`ra.js`) en vez de módulos pequeños.
- **Sin pruebas automáticas** (solo pruebas manuales y funciones de medición): para un proyecto académico es razonable; en producción se agregarían.
- **Sin modo offline completo** (three.js desde un CDN).
- **Un solo idioma** (español).
- **Accesibilidad:** hay `aria-label` y soporte a «reducir movimiento» en la portada, pero la RA depende de la vista y del toque.

## 16. Resumen: lo que NO sabemos / no debes inventar
| Tema | Qué decir |
|---|---|
| Motivo del compañero para three.js vs A-Frame | «No quedó registrado; el criterio técnico que lo justifica es…» (pregunta a `jusstjuanda` antes del sábado) |
| Si probamos A-Frame y falló | **No hay registro de que se haya probado.** No digas «no nos funcionó» |
| Cifras de rendimiento en celulares (FPS) | Probamos todo en celulares reales y funciona, pero no hay medición numérica; las cifras de dibujo se midieron en el PC. Tampoco se probó en toda la variedad de modelos (p. ej. gama baja) |
| Fidelidad de los cantos | No se pudo comprobar «de oído» desde aquí |

## Para decirle al profesor
> «Evaluamos el problema así: la rúbrica permite web, y la web llega a Android e iPhone sin instalar nada y se actualiza al instante. Usamos three.js —la librería sobre la que se construye A-Frame— porque casi todo lo nuestro es lógica propia y queríamos control del rendimiento. Los modelos son procedurales para que pesen casi nada y se puedan variar con datos. Reconocemos los costos: menos realismo, cantos sintéticos y WebXR solo en Android.»

## Autoevaluación
1. ¿Qué relación hay entre A-Frame y three.js?
2. ¿Por qué decir «no se podía usar A-Frame» sería falso?
3. ¿Qué argumento hay a favor de web sobre Unity para iPhone?
4. Da dos ventajas y dos costos de hacer los modelos con código.
5. ¿Qué es un marcador y por qué no lo usamos?
6. ¿Por qué los cantos son sintéticos?
7. ¿Qué cosas no sabemos y no debemos inventar?
