# 21 · Preguntas y respuestas (más de 100)

## Cómo usar este capítulo
Cada pregunta tiene una **respuesta corta (en negrita)**, que es la que dirías en voz alta, y a veces una **explicación** para que entiendas el porqué. Léelas en voz alta; no las memorices palabra por palabra. Si no sabes algo: **«No lo tengo medido/no lo sé, pero lo que sí sé es…»** es una respuesta válida y respetable.

Las preguntas están agrupadas:
A. Visión general · B. Tecnología web · C. Realidad aumentada · D. Aves 3D y animación · E. Sonido · F. Quiz · G. Campus y cinemática · H. Rendimiento · I. Datos, privacidad y publicación · J. Proceso, equipo e IA · K. Límites y futuro · L. Preguntas trampa

---

## A. Visión general

**1. ¿Qué es Aves UAO?**
**Una página web de Realidad Aumentada que sirve de guía de avistamiento de las aves del campus de la UAO.** Con el celular ves aves 3D sobre la cámara, las puedes llamar, fotografiar y alimentar, hay un quiz y un recorrido 3D del campus. Incluye una guía de las 84 especies y una libreta de campo.

**2. ¿Qué pedía la rúbrica y dónde la cumplen?**
**Pedía una guía de avistamiento en RA, con base de datos de la UAO, un quiz, mínimo 5 interacciones, sonidos acordes, animaciones, y funcionar en Android o iOS.** La guía tiene 84 especies; la RA es el núcleo; hay 7 interacciones; los sonidos acompañan cada acción; hay animaciones (aves, partículas) y una cinemática; es una web que se abre en Android e iPhone.

**3. ¿Para quién es?**
**Visitantes, estudiantes y la comunidad UAO interesados en las aves del campus**, incluso sin conocimientos previos: la app enseña a identificarlas y a conocer su hábitat.

**4. ¿Cuáles son las 7 interacciones de RA?**
**Avistar, Binoculares, Llamar, Comedero, Foto, Quiz y Tamaño real.** (Y además la Cinemática, que es un recorrido 3D.) Las seis primeras funcionan en cualquier celular; «Tamaño real» solo en Android con ARCore.

**5. ¿Qué es lo más importante del proyecto?**
**Que la RA es el corazón: el usuario descubre las aves moviendo el celular, las llama, las observa, las identifica y las aprende jugando.** No es una página con un botón de RA «por poner».

**6. ¿Cuántas aves hay?**
**84 especies en la guía y 12 en RA.** Las 12 son representativas; cada una exige modelado, colores, comportamiento y preguntas. Se pueden agregar más.

**7. ¿Por qué esas 12?**
**Porque son comunes y reconocibles en el campus y tienen datos en la guía** (bichofué, azulejo, mirla, pellar, carpintero habado, colibrí colirrufo, garza de ganado, periquito bronceado, sirirí, garrapatero, pechirrojo y loro cabeciazul).

**8. ¿Qué es la libreta?**
**Un cuaderno de campo digital** donde se guardan las aves que registraste, tus fotos (hasta 8) y tu mejor puntaje del quiz. Vive en tu celular.

---

## B. Tecnología web

**9. ¿Qué tecnologías usan?**
**HTML, CSS y JavaScript en una página estática; three.js (WebGL) para el 3D; Web Audio para el sonido; getUserMedia, DeviceOrientation y WebXR para cámara y sensores; Git y GitHub Pages para publicar.**

**10. ¿Qué es HTML, CSS y JavaScript?**
**HTML es la estructura (qué hay en la página), CSS es el aspecto (colores, tamaños, posiciones) y JavaScript es el comportamiento (qué pasa cuando haces algo).** Como una casa: paredes, pintura y electricidad.

**11. ¿Qué es un archivo `.js`?**
**Un archivo de texto con código JavaScript que el navegador ejecuta.** Nuestro proyecto tiene 11 archivos `.js`, cada uno con una tarea (motor RA, aves, campus, sonido, datos…).

**12. ¿Qué es three.js?**
**Una librería de JavaScript que facilita dibujar 3D en el navegador:** escena, cámara, luces, mallas, materiales. («three» es «tres», por las tres dimensiones.)

**13. ¿Qué es WebGL?**
**La tecnología del navegador que permite usar la tarjeta gráfica (GPU) para dibujar 3D.** three.js se apoya en WebGL para no tener que escribirlo a mano.

**14. ¿Por qué three.js y no A-Frame?**
**A-Frame está construido sobre three.js; nosotros usamos three.js directo porque casi todo lo nuestro es lógica propia y queríamos control del rendimiento.** (La decisión inicial la tomó el compañero que hizo la primera versión; el criterio técnico que la respalda está en el capítulo 18.)

**15. ¿Qué es un framework y por qué no usaron React?**
**Un framework es un conjunto de herramientas que organiza cómo se construye una aplicación.** No usamos React porque la página es sobre todo un lienzo 3D y no necesitábamos compilar; menos herramientas, menos puntos de falla.

**16. ¿Qué es un CDN y un importmap?**
**Un CDN es una red de servidores que entrega archivos rápido desde un lugar cercano a ti; el importmap es una tabla que le dice al navegador de dónde descargar «three».** Así no instalamos nada: `import * as THREE from "three"` funciona.

**17. ¿Por qué necesita HTTPS?**
**Porque los navegadores solo dan cámara y sensores de movimiento a páginas seguras.** GitHub Pages lo da gratis.

**18. ¿Dónde está el servidor?**
**No hay servidor propio.** Son archivos estáticos alojados en GitHub Pages. (El `.csproj` de .NET en el repositorio solo sirve archivos en desarrollo local; en producción no se usa.)

**19. ¿Cuántas líneas de código tiene?**
**Unas 4.200 entre HTML, CSS y JavaScript; el archivo más grande es el motor RA (`ra.js`, ~1.100 líneas).**

**20. ¿Cuánto pesa?**
**Unos 5 MB de imágenes, ~250 KB de JavaScript y ~30 KB de CSS; three.js y las fuentes vienen de un CDN.** Los modelos 3D no cuentan porque se construyen con código.

**21. ¿Qué es un SVG y por qué lo usan?**
**Una imagen hecha con instrucciones matemáticas (no con píxeles), por eso no se pixela y pesa poco.** Todos los íconos de la interfaz son SVG propios en un «sprite» al inicio del `index.html`.

**22. ¿Cómo hacen que la página se vea bien en celular y en computador?**
**Con CSS responsive: reglas (`@media`) que cambian tamaños y disposición según el ancho de la pantalla** (por ejemplo, ≤ 520 px y ≤ 345 px para la barra de modos).

---

## C. Realidad aumentada

**23. ¿Cómo funciona la RA?**
**Se muestra el video de la cámara y, encima, un lienzo 3D transparente cuya cámara virtual gira igual que el celular, leído con el giroscopio.** Así las aves parecen estar alrededor de ti.

**24. ¿Cómo sabe hacia dónde apunta el celular?**
**Con el evento `deviceorientation`, que da tres ángulos (alpha, beta, gamma) del giroscopio y la brújula.** Los convertimos en una rotación (cuaternión) y movemos la cámara virtual.

**25. ¿Qué es un cuaternión y por qué no ángulos?**
**Una forma de representar rotaciones en 3D con cuatro números, que evita el bloqueo de cardán y permite interpolar suavemente (`slerp`).**

**26. ¿Qué es `slerp` y para qué se usa aquí?**
**Interpolación esférica: mezcla suavemente la rotación actual con la nueva.** Usamos un factor 0,35 para quitar temblores del sensor sin añadir mucho retraso.

**27. ¿Cómo se ve la cámara real detrás del 3D?**
**Hay un elemento `<video>` con la cámara trasera (`getUserMedia`) y encima un `<canvas>` con el renderizador de three.js en modo transparente (`alpha: true`).**

**28. ¿Es RA «real» si no detecta el piso?**
**Sí, es RA de orientación (3DoF): superpone objetos virtuales al video y reacciona a hacia dónde miras.** Para anclar al piso ofrecemos «Tamaño real» con WebXR (6DoF) en Android.

**29. ¿Qué es 3DoF vs 6DoF?**
**3DoF: solo giros (mirar). 6DoF: giros y movimiento (caminar).** La RA principal es 3DoF; «Tamaño real», 6DoF.

**30. ¿Qué es WebXR?**
**El estándar del navegador para RA y RV.** Pedimos una sesión `immersive-ar` con `hit-test` para encontrar el piso. En iPhone, Safari no lo soporta.

**31. ¿Qué es un hit-test?**
**Lanzar un «rayo» desde el celular al mundo real y averiguar dónde choca con una superficie (el piso), para colocar un objeto ahí.**

**32. ¿Por qué «Tamaño real» no funciona en iPhone?**
**Porque Safari en iOS no implementa WebXR.** Es una limitación de la plataforma, no de nuestro código.

**33. ¿Qué pasa si el usuario niega la cámara?**
**La app cambia al campus 3D simulado y todo sigue funcionando.** Lo mismo ocurre en un computador.

**34. ¿Por qué hay que tocar un botón para empezar?**
**Los navegadores exigen una acción del usuario para activar cámara, sensores de movimiento (en iPhone hay un permiso explícito) y audio.**

**35. ¿Qué hace el campus simulado?**
**Es un fondo 3D (camino de ladrillo, aulas, plazoleta, fuente, árboles) para cuando no hay cámara.** Sirve para probar y proyectar en el pitch.

**36. ¿Qué hacen los binoculares?**
**Reducen el campo de visión (zoom ≈ 3×: de 62° a 21°), muestran un marco de binoculares y etiquetas con rasgos de identificación** de las aves que están en el centro.

**37. ¿Cómo se escala el video al hacer zoom?**
**Se ajusta la escala del video según la relación de tangentes de los FOV** para que lo virtual y lo real queden alineados.

**38. ¿Cómo se sabe qué ave tocaste?**
**Con raycasting: un rayo desde la cámara por el punto tocado; el primer objeto que cruza es el ave.** Cada ave tiene una esfera invisible un poco más grande para que sea fácil acertar con el dedo.

---

## D. Aves 3D y animación

**39. ¿Cómo se hicieron los modelos 3D?**
**Con código: cada ave se arma con esferas, conos y cajas** (cuerpo, cabeza, pico, alas, cola, patas, ojos), con colores y rasgos que salen de una ficha de datos. Una sola función (`crearAve`) fabrica las 12.

**40. ¿Dónde están los «sprites» o las imágenes de las aves?**
**No hay sprites de las aves: son mallas 3D generadas por código.** Los «sprites» que hay son las etiquetas de texto, las tarjetas del quiz y las notas musicales (planos 3D con una imagen dibujada con código). Las imágenes `.png` de `img/aves` son solo capturas para la libreta de la página.

**41. ¿Qué es una malla?**
**La forma de un objeto 3D: puntos (vértices) unidos en triángulos.** Más un material (color, brillo).

**42. ¿Qué es un material?**
**La «piel» de la malla: color, brillo, transparencia.** En las aves usamos un material estándar mate (`MeshStandardMaterial`, rugosidad 0,6) con sombreado suave; el estilo low-poly viene de la simplicidad de las formas y de los colores planos, no de caras facetadas.

**43. ¿Qué es un pivote o grupo?**
**Un objeto vacío que sirve de punto de giro para otros.** Por ejemplo, el ala gira alrededor de un pivote en el hombro; la cabeza, en el cuello.

**44. ¿Cómo se animan las aves?**
**Con fórmulas matemáticas en cada cuadro:** respiración con seno, mirada que cambia al azar y se suaviza, aleteo con seno a frecuencia fija, pico que se abre al cantar, cola que se mueve de vez en cuando.

**45. ¿Qué es una animación procedural?**
**Una animación calculada por fórmulas en vez de grabada hueso por hueso.** Por eso no hay archivos de animación.

**46. ¿Cómo vuela un ave a un punto?**
**Sigue una curva (Bézier) con arranque y llegada suaves (smoothstep), batiendo las alas.** Al llegar, aterriza en su soporte.

**47. ¿Qué es el soporte?**
**La rama, el pasto, el agua, la flor o el tronco sobre el que se posa.** Es un objeto del mundo (no parte del ave): aparece creciendo cuando el ave llega y se encoge cuando se va.

**48. ¿Cómo evitan que las aves se crucen entre sí?**
**Cada soporte ocupa un círculo en el suelo; el código busca un sitio libre (sin pisar camino, fuente, bancas, otras aves) y prueba varias distancias.** Probado con cientos de soportes sin cruces.

**49. ¿Qué es la `semilla`?**
**Un número inicial que hace que el «azar» sea repetible:** los árboles quedan siempre en los mismos sitios.

**50. ¿Qué son las partículas?**
**Pequeños objetos que aparecen y desaparecen para dar efecto:** notas musicales al cantar, confeti al ganar.

---

## E. Sonido

**51. ¿De dónde salen los cantos?**
**Los sintetizamos en vivo con la Web Audio API:** osciladores (ondas), envolventes de volumen, filtros, vibrato y ruido. No son grabaciones.

**52. ¿Por qué no usaron grabaciones reales?**
**Por licencias y créditos** (cada grabación exige autoría y licencia) **y por peso.** Dejamos enlace a WikiAves para escuchar el canto real.

**53. ¿Cómo suena «a un lado»?**
**Con un paneo estéreo (`StereoPannerNode`) según dónde esté el ave respecto a hacia dónde mira el usuario.**

**54. ¿Es audio 3D?**
**Es audio posicional simplificado (izquierda–derecha).** No cambia el volumen por distancia ni usa HRTF o Doppler; sería una mejora.

**55. ¿Qué sonidos hay además de los cantos?**
**Clic de botones, registro de ave, aleteo, obturador de la foto, éxito y error del quiz, y ambiente (viento y cantos lejanos) en la cinemática.**

**56. ¿Qué es el ADSR/una envolvente?**
**La forma en que sube y baja el volumen de un sonido:** ataque (sube), caída, sostén y liberación. Da naturalidad.

---

## F. Quiz

**57. ¿Cómo funciona el quiz?**
**Hay un banco de 59 preguntas (aves, ecología y entorno UAO); cada partida toma hasta 20 mezcladas y sin repetir.** Respondes tocando el ave, una tarjeta o un alimento 3D. Tienes 2 vidas; con 10 aciertos ganas la insignia «Guardián».

**58. ¿Cómo se compone el banco?**
**36 de aves (nombre, pista o canto × 12 aves), 16 de ecología (10 de hábitat y 6 de dieta) y 7 del entorno UAO.**

**59. ¿Cómo se arma la partida?**
**Con ciclos que alternan tipos** (ave, campus, ecología, ave, campus, ave), sin repetir preguntas y sin la misma ave dos veces seguidas.

**60. ¿Por qué 2 vidas?**
**Porque con el esquema anterior (5 preguntas) el puntaje se topaba en 5/5; las vidas permiten partidas largas y cierran el juego en el segundo error.** (Idea de un compañero, Sebastián.)

**61. ¿De dónde salen las preguntas?**
**De las fichas de la guía de la UAO (hábitat, dieta) y de datos del campus.** Las preguntas de aves usan los datos de `especies-ra.js`.

**62. ¿Dónde se guarda el puntaje?**
**En la libreta (`localStorage`), el mejor puntaje.**

---

## G. Campus y cinemática

**63. ¿Qué es la Cinemática?**
**Un recorrido 3D de unos 108 segundos por el campus con aves volando, que se calcula en vivo.** Puedes mirar alrededor, acelerar (×2, ×4) o saltar; al terminar vuelves a la RA donde estabas.

**64. ¿Por qué no es un video?**
**Porque así no pesa, se puede mirar 360° y mantiene el estilo de la RA.** Además no teníamos material de video y se hizo con las fotos y mapas del campus.

**65. ¿Cómo se mueve la cámara en la cinemática?**
**Sigue una curva suave (Catmull-Rom) que pasa por 26 puntos clave, con velocidad constante y arranque/frenado suaves.**

**66. ¿Cómo hicieron el campus de la cinemática?**
**Con código, a partir de tus fotos y mapas:** cajas y formas extruidas para edificios, texturas dibujadas en canvas, instancias para ventanas y carros.

**67. ¿Es una réplica exacta del campus?**
**No: es una interpretación low-poly fiel en la organización** (porterías, arco, Ágora, aulas, lago, cafetería, desnivel), no un levantamiento con planos.

**68. ¿Cómo hicieron el desnivel del Edificio Central?**
**Todo el sector norte va dentro de un grupo que se sube 4,2 m;** la cámara también sube sola cuando pasa por esa zona.

**69. ¿Cuántas aves vuelan en la cinemática y cómo no pesa?**
**Unas 105, hechas con tres mallas instanciadas** (cuerpos y alas), es decir, 3 órdenes de dibujo.

**70. ¿Cómo evitan marear?**
**Velocidad constante, arranque suave, horizonte que no se inclina, duración corta y botones de saltar y acelerar.**

**71. ¿Qué pasa con la RA mientras dura la cinemática?**
**Se pausa y se esconde; al terminar se restaura todo y se ejecuta lo pendiente.** En el quiz, la cinemática está desactivada para no perder la partida.

---

## H. Rendimiento

**72. ¿Cómo hicieron que corra en celulares?**
**Low-poly, geometrías y materiales reutilizados, fusión de mallas, instancias, resolución limitada y limpieza de memoria.**

**73. ¿Qué es una orden de dibujo (draw call)?**
**Cada vez que se le pide a la GPU dibujar un objeto.** Cuantas menos, mejor. Pasamos de 675 a unas 117 en la RA.

**74. ¿Qué es una instancia?**
**Dibujar muchas copias de la misma forma en una sola orden.** Ventanas, carros, aves volando.

**75. ¿Qué es fusionar mallas?**
**Unir muchas piezas quietas en una sola malla, guardando el color de cada una.** Se pierde la posibilidad de moverlas por separado, por eso se dejan pivotes sueltos en las aves.

**76. ¿Qué es el `pixelRatio` y por qué lo limitan?**
**La relación entre píxeles del dibujo y de la pantalla.** Un celular de ratio 3 tendría 9× más píxeles; lo limitamos a 2 (1,5 en la cinemática) para ahorrar GPU y batería.

**77. ¿Midieron el rendimiento en celular real?**
**Lo medimos en el computador (órdenes de dibujo y triángulos); en celulares lo probamos funcionalmente, pero no tenemos cifras de FPS.** Hay ajustes listos si fuera necesario.

---

## I. Datos, privacidad y publicación

**78. ¿De dónde sale la información de las aves?**
**De la *Guía ilustrada de las aves del campus de la UAO* (2023) y de WikiAves,** con crédito a sus autores.

**79. ¿Dónde se guardan los datos del usuario?**
**En su propio celular (`localStorage`).** No hay servidor ni cuentas.

**80. ¿Las fotos se suben a algún lado?**
**No: se quedan en el celular.**

**81. ¿Qué datos personales recoge la app?**
**Ninguno enviado a un servidor.** La cámara y los sensores se usan localmente.

**82. ¿Cómo se publica?**
**Con Git y GitHub: al hacer `push`, una acción automática (GitHub Actions) publica la carpeta `wwwroot` en GitHub Pages.** Tarda unos 20 segundos.

**83. ¿Qué es Git y qué es un commit?**
**Git guarda el historial de cambios del proyecto; un commit es una «foto» con mensaje de un conjunto de cambios.** Hugo los hace con GitHub Desktop.

**84. ¿Por qué a veces no se ven los cambios?**
**Por la caché del navegador (~10 minutos).** Se arregla con recarga forzada (Ctrl + Shift + R) o ventana de incógnito.

---

## J. Proceso, equipo e IA

**85. ¿Cómo se desarrolló?**
**El 12 de octubre un compañero publicó la primera versión; el 15 y 16 de octubre se corrigieron errores, se pulió, se mejoró el campus, se rehízo el quiz y se hizo la cinemática,** con una IA como asistente dirigida por Hugo y con pruebas en celulares del equipo.

**86. ¿Lo hizo una IA?**
**Usamos una IA como asistente de programación; nosotros decidimos, aportamos el material, probamos y corregimos, y sabemos explicarlo.** (Capítulo 20.)

**87. ¿Quién hizo qué?**
**Hugo dirigió y aprobó; un compañero hizo la primera versión; otro (Sebastián) probó y sugirió; otros preparan el pitch; la IA escribió el código.**

**88. ¿Qué dificultades tuvieron?**
**Rendimiento en celulares, textos que se salían de la pantalla, aves que se cruzaban, diferencias entre iPhone y Android, y reproducir la organización del campus con fotos y mapas.** (Capítulo 17.)

**89. ¿Cómo comprobaron que funciona?**
**Pruebas manuales en navegador y en celulares Android e iPhone, funciones de medición (rendimiento, cruces) y revisión a distintos tamaños de pantalla.** No hay pruebas automáticas.

**90. ¿Qué aprendieron?**
**A dirigir un desarrollo por pasos pequeños, a medir antes de afirmar, a cuidar el rendimiento en móviles, a documentar y a ser transparentes con la IA.**

---

## K. Límites y futuro

**91. ¿Qué limitaciones tiene?**
**3DoF en la RA principal, «Tamaño real» solo en Android, cantos sintéticos, 12 de 84 especies en RA, necesita internet para cargar, la libreta no se sincroniza y la cinemática es una interpretación del campus.**

**92. ¿Qué mejorarían?**
**Cantos reales con crédito, más especies y fotos, funcionamiento sin internet, audio con distancia (HRTF), aves ancladas en más dispositivos y una versión para visor de RV con la cinemática.**

**93. ¿Podría ser la app oficial de la UAO?**
**Es una base: tendría que ampliarse con más especies, fotos y revisión de los autores de la guía.** Es lo que la rúbrica llama «presentar la idea para futuro desarrollo».

**94. ¿Qué pasa si hay muchos usuarios a la vez?**
**Nada, porque cada uno ejecuta la app en su celular y no hay servidor que se sature.** Solo el hosting estático (GitHub Pages) atiende las descargas.

---

## L. Preguntas trampa (y cómo salir)

**95. «¿Cuántas líneas escribió usted?»**
**«Las líneas las generó la IA; mi trabajo fue dirigir, decidir, probar y corregir. Lo que sí puedo hacer es explicarle cualquier parte.»** No exageres.

**96. «Muéstreme en el código dónde pasa X.»**
**Abre el mapa de archivos (capítulo 5):** ficha en `especies-ra.js`, ave en `aves3d.js`, motor en `ra.js`, sonido en `sonido.js`, cinemática en `recorrido.js`. No inventes: «ahí está la función, no recuerdo cada línea».

**97. «¿Por qué eligieron esa herramienta y no la que vimos en clase (Unity)?»**
**«La rúbrica admitía web, que llega a Android e iPhone sin instalar; con Unity habría que compilar por plataforma (y para iPhone se necesita un Mac).»**

**98. «¿Por qué las aves no se quedan fijas en el piso?»**
**«Porque la RA principal es de orientación (3DoF). Para anclar al piso usamos WebXR, que está en Android; en iPhone no existe.»**

**99. «¿Esto funciona en mi celular?»**
**«Funciona en navegadores modernos de Android e iPhone con cámara y sensores; probamos en ambos. “Tamaño real” solo en Android.»**

**100. «¿Por qué suena “robótico” el canto?»**
**«Porque es sintético; recrea el patrón del canto con osciladores. Es una decisión por licencias; ofrecemos el enlace al canto real.»**

**101. «¿Y si falla el internet o el celular?»**
**«Tenemos el modo simulado en computador y datos móviles como respaldo.»**

**102. «¿Qué parte es lo más difícil técnicamente?»**
**«Mantener fluido y legible en celulares: colocación sin cruces, etiquetas dentro de la pantalla, optimización, y la cámara controlada por sensores.»**

**103. «¿Qué no hicieron?»**
**«No usamos grabaciones reales, no hay oclusión, no se ancla al piso en iPhone y no es una réplica exacta del campus.»** Decirlo con claridad suma credibilidad.

**104. «¿Por qué eligieron un estilo low-poly?»**
**«Por rendimiento en celulares y coherencia visual; se construye con formas simples por código.»**

**105. «¿Cuál es su aporte personal?»**
**«Dirigí el producto: qué se construye y qué no, elegí entre alternativas, aporté fotos y mapas del campus, probé y corregí, y publiqué.»**

---

## Si te quedas en blanco (frases de rescate)
- «Déjame mostrarte en la aplicación cómo funciona y te explico lo que pasa por detrás.»
- «Esa parte no la tengo medida; lo que sí sé es…»
- «Lo implementamos así por rendimiento y compatibilidad con Android e iPhone.»
- «Es una limitación que conocemos y que dejamos como trabajo futuro.»

## Autoevaluación final
Pídele a alguien que te haga 10 preguntas **al azar** de este capítulo y responde **sin mirar**. Si fallas más de 3, relee los capítulos referenciados.
