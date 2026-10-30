# 17 · Historia del proyecto y problemas que se resolvieron

## Resumen en 1 minuto
El proyecto nació el **12 de octubre** (un compañero publicó una primera versión completa) y entre el **15 y el 16 de octubre** se corrigió, se pulió y se amplió con tu dirección: 3 bugs, humanización de la web, marca «Aves UAO», decoración, mejoras del campus y las aves, 12 aves a la vez, foto, quiz nuevo y cinemática. Esta lista es útil para responder **«¿qué dificultades tuvieron y cómo las resolvieron?»**: cada problema tiene **síntoma → causa → solución → qué se aprendió**.

---

## 1. Línea de tiempo
| Cuándo | Qué pasó |
|---|---|
| **12 oct** | Se crea el proyecto en Visual Studio (10 aves comunes de Cali). Llega la **rúbrica**: debe ser RA con base de datos UAO. Se construye el **motor RA**, 12 aves en 3D, 7 interacciones, guía de 84 especies, libreta y quiz de 5 rondas. Se publica en GitHub Pages (commits de `jusstjuanda`) |
| **15 oct** | Con la IA: revisión del proyecto y confirmación de que **es three.js puro (sin A-Frame)**. Se arreglan **3 bugs** (árboles, binoculares, soportes) y se «humaniza» la web (quitar «tics» de IA) sin cambiar estilo, fuentes ni colores |
| **15 oct (noche) → 16 oct (madrugada)** | Lista de pulido de 6 pasos: renombrar «Pájaro» → «Aves UAO» con el logo; «Llamar infinito»; que nada se cruce y charco más grande; decoración con hojas y arco de palmas; recorrido de calidad (9 errores) |
| **16 oct (mañana)** | Bugs del quiz (spoiler del nombre, etiqueta cortada); **campus simulado y aves mejorados** (rendimiento con fusión) |
| **16 oct (tarde)** | Lista de pulido: foto con fecha, **12 aves a la vez**, **quiz nuevo**, ajuste de cantos |
| **16 oct (noche)** | **Cinemática** (varias rondas con tus fotos y mapas), botón en la barra, velocidad ×1/×2/×4, bosque del lago; arreglo del ancla `#guia`; textos; repaso |
| **17 oct, 8:00** | Pitch y sustentación |

## 2. Casos resueltos (síntoma → causa → solución)

### 2.1 Árboles que se atravesaban (campus simulado)
- **Síntoma:** hojas de las palmas atravesaban copas vecinas; había árboles **dentro de edificios**.
- **Causa:** las palmeras tenían 7 conos hacia los lados y los árboles se ubicaban con `Math.random()` **sin comprobar choques**.
- **Solución:** palma nueva (tronco que se afina, hojas largas planas de dos tramos; entonces 9 hojas, hoy 11), una función que **mide el tamaño real** de cada árbol (`radioDe`), y una colocación con **semilla fija** que **rechaza** posiciones que pisen caminos, edificios u otros árboles. Medición: **0 cruces** (antes 31).
- **Aprendizaje:** el azar necesita **reglas**; y se debe **medir** (no «parece bien»).

### 2.2 Los binoculares sin hueco
- **Síntoma:** en el modo simulado, los dos círculos de los binoculares quedaban separados y **el ave caía en el hueco negro**.
- **Causa:** los centros de las lentes eran fijos y su radio dependía solo del alto.
- **Solución:** en CSS, variables `--lente` y `--sep` calculadas para que **siempre se solapen en el centro**.

### 2.3 Los soportes viajaban con el ave
- **Síntoma:** la rama, el pasto o el charco **se movían con el ave** al llegar volando y se acumulaban.
- **Causa:** el soporte era **parte del ave**.
- **Solución:** el soporte pasó a ser **un objeto aparte del mundo**: aparece creciendo en el destino, se queda quieto y se encoge cuando el ave se va.
- **Aprendizaje:** decidir **de quién es** cada objeto (del ave o del mundo) cambia mucho el comportamiento.

### 2.3b «No veo los cambios» tras publicar
- **Causa:** la **caché** de GitHub Pages (10 minutos).
- **Solución:** recarga forzada (Ctrl + Shift + R) o incógnito.

### 2.4 Humanizar la web
- **Pedido:** «que no parezca hecha por IA, sin cambiar estilo, fuentes ni colores».
- **Se hizo:** emojis → **íconos SVG propios**; etiquetas en mayúsculas con letra espaciada → texto normal; grillas todas iguales → anchos distintos; fotos con composición menos de «muro»; libreta con **renders 3D de las aves** en vez de círculos de color; mosaico de jornadas con tamaños variados; se corrigió un **logo tapado** y una insignia siempre visible; se reescribieron **solo dos textos** (con tu aprobación).
- **Aprendizaje:** pedir cambios **acotados** y aprobarlos **uno por uno** evita sorpresas.

### 2.5 «Llamar infinito»
- **Síntoma:** si tocabas el mismo canto muchas veces seguidas, llegaban **muchas aves** (una por cada toque).
- **Causa:** el código decidía si el ave existía **al tocar**, pero el ave aparecía **1,1 s después**.
- **Solución:** decidir **al llegar la hora**, un máximo de **6 aves** (la más antigua se va), un ejemplar por especie, y **temporizadores cancelables** (`despues` / `cancelarPendientes`).

### 2.6 Marca «Aves UAO» y logo
Se cambió el nombre y se añadió el **logo oficial** (sacado del PDF de la guía). Detalle de calidad: se alineó el logo a la **base de las letras** (se veía más arriba) y se mantuvo la tipografía **Fraunces 900** de «Pájaro».

### 2.7 Recorrido de calidad (9 errores)
El aviso de ayuda **tapaba** la pregunta del quiz y el radar; la **ficha** de un ave quedaba abierta al cambiar de modo; el botón «Tamaño real» **tapaba** la pregunta; las **etiquetas de binoculares** se cortaban o se encimaban en celular (se reescribió `actualizarMarcas`); concordancia **«La Garza / La Mirla»**; el zoom no se reiniciaba al salir; la galería 3D en celular; tope de aves en WebXR; buscador por palabras.

### 2.8 El spoiler del quiz
- **Síntoma:** en el quiz algunas aves **traían su nombre ya visible** (¡la respuesta!).
- **Causa:** el ave registrada siempre mostraba su etiqueta.
- **Solución:** `agregarAve` solo pone etiqueta si `modo !== "quiz"`.

### 2.9 «¡Correcto!» cortado
- **Síntoma:** la etiqueta salía como «orrecto! Garza de gana» en pantallas angostas.
- **Causa doble:** el texto era más largo que la imagen y el sprite 3D **no se ajustaba a la pantalla**.
- **Solución:** `etiqueta()` acepta saltos de línea y **achica la letra**; `mantenerEtiqueta` **corre y achica** el cartel para que no se salga. Además se revisó **toda** la interfaz a 320 px (la barra de modos desbordaba y el botón «Quiz» quedaba cortado).

### 2.10 La foto con fecha pegada (reportó Sebastián)
En fotos **verticales** el título y la fecha se superponían. Ahora la letra se calcula por **ancho** y, si no caben, la fecha pasa a **otra línea**.

### 2.11 Campus y aves «menos low-poly, menos vacío»
Tú pediste opciones con vista previa; elegiste **«Campus vivo» + «Aves detalladas»** (descartaste la opción de «ilustración»). Se agregaron fuente, bancas, farolas, canteros, plazoleta, ventanas con marco, techos con paneles solares, más detalle en aves (plumas, ojos con aro, dedos) y, para **no perder rendimiento**, se creó `fusion.js`: **675 → 117** órdenes de dibujo.

### 2.12 12 aves a la vez
Antes salían 6 y las demás aparecían al volver a entrar. Ahora salen **las 12**, en dos anillos, sin cruzarse (probado con 480 soportes).

### 2.13 Quiz nuevo
Con tus decisiones: 2 vidas, 20 por partida, Guardián con 10, preguntas de aves + ecología + entorno UAO (las que aprobaste), dato curioso.

### 2.14 La cinemática: errores del camino
| Error | Causa | Solución |
|---|---|---|
| **Árboles blancos** | Al fusionar mallas ya fusionadas se perdían los colores | `fusion.js` ahora conserva el color por vértice |
| **La cámara miraba hacia atrás por momentos** | La posición y el punto de mira se muestreaban por **distancias distintas** | Mismo parámetro para ambas curvas (`getUtoTmapping`) |
| **El horizonte se inclinaba al arrastrar** | Se giraba sobre el eje local | Giro a los lados sobre el **eje vertical del mundo** |
| **Las gradas del Ágora no se veían** | Un disco las cubría; luego, el suelo las tapaba | Se hicieron **anillos** y se **abrió un hueco** en el suelo |
| **La cámara quedaba dentro de un árbol o de un edificio** | La ruta pasaba por donde había árboles/edificios | Se evita plantar árboles en el camino y se reajustó la ruta |
| **Un letrero «uao» flotaba en el aire** (Portería 3) | Era más ancho que el muro | Se ajusta al ancho del tramo de muro |
| **El módulo viejo se quedaba en caché durante las pruebas** | El navegador de pruebas guarda los `.js` | Se forzó recarga de cada archivo |
- Además, **tus rondas de correcciones**: aulas de 4 pisos y en su sitio, norte/sur, Ágora rodeada de palmas, **UAO Labs como sótano** con gradas horizontales y rampas macizas, seto del Ágora del lado de las aulas, parque y parqueadero frente a la Portería 3, bosque con enredaderas alrededor del lago, mesas de metal.

### 2.15 La página abría en la guía (en computador)
- **Síntoma:** al abrir el enlace en un computador, caía directo en «Guía UAO» (en celular no).
- **Causa:** la dirección tenía **`#guia`** (el menú y el botón «Explorar la guía» lo agregan; el navegador lo autocompleta).
- **Solución:** un script en el `<head>` **ignora el ancla** al cargar y abre arriba.

### 2.16 El texto «de IA» del panel de Llamar
Tenía comillas «» y una estructura de dos puntos que sonaba a IA; se reescribió en lenguaje natural.

### 2.17 Una pérdida de documentación
Tras un commit, la bitácora larga **desapareció del disco** (no se supo por qué); se **reescribió completa** y se creó un sistema de **tres documentos** (`CLAUDE.md`, `ESTADO_ACTUAL.md`, `BITACORA_PAJARO.md`) para no perder contexto.

## 3. Lecciones que puedes contar (suenan a ingeniería)
1. **Medir antes de afirmar** (cruces, triángulos, órdenes de dibujo).
2. **Cambios pequeños y aprobados uno por uno.**
3. **Separar datos de código** (fichas de aves, preguntas).
4. **Reutilizar y optimizar** pensando en celulares.
5. **Probar en dispositivos reales** y con capturas del equipo.
6. **Documentar el proceso** (bitácora).
7. **Respetar la autoría** (créditos de la guía).

## Para decirle al profesor
> «Tuvimos problemas de colocación de objetos que se cruzaban, de etiquetas que se salían de la pantalla en celulares, de rendimiento al aumentar el detalle y, en la cinemática, de cámara y de colores al fusionar mallas. Los resolvimos con soluciones medibles: por ejemplo, colocación con círculos de ocupación (0 cruces en cientos de pruebas), fusión de mallas (de 675 a 117 órdenes de dibujo) y ajuste automático de etiquetas.»

## Autoevaluación
1. Cuenta tres problemas con su causa y su solución.
2. ¿Qué cambió en «Llamar» y por qué?
3. ¿Por qué se creó `fusion.js`?
4. ¿Qué lecciones sacaron del proceso?
