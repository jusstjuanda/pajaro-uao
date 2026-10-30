# 22 · Glosario de la A a la Z

Todos los términos que aparecen en el proyecto o en las preguntas probables, explicados **sin asumir nada**. Cuando una palabra tenga un capítulo dedicado, se indica entre paréntesis.

---

## A
- **Alpha (canal alfa / `alpha: true`):** nivel de transparencia. En el renderizador, `alpha: true` hace que el fondo del 3D sea transparente para ver el video de la cámara detrás. En el giroscopio, `alpha` además es el nombre del ángulo de giro sobre el eje vertical (la brújula).
- **Altura (`y`):** en 3D, el eje vertical. Aquí, `y` sube; `x` va a los lados y `z` hacia adelante/atrás.
- **Animación procedural:** animación calculada por fórmulas (seno, interpolación) en vez de grabada. (Cap. 8)
- **API:** conjunto de funciones que un programa ofrece para que otro lo use. Ejemplos: Web Audio API, WebXR API.
- **Archivo estático:** archivo que se entrega tal cual (HTML, CSS, JS, imágenes), sin que un servidor lo calcule.
- **Arreglo (array):** lista ordenada de valores en JavaScript, entre corchetes: `[1, 2, 3]`.
- **Asíncrono:** que no espera: pide algo (la cámara, por ejemplo) y sigue; cuando está listo, avisa.
- **`atan2`:** función matemática que da el ángulo de un punto. Se usa para saber hacia qué lado del usuario está un ave.
- **Audio espacial:** sonido que parece venir de una posición del espacio. (Cap. 10 y 19)
- **Azar con semilla:** números «aleatorios» que se repiten igual cada vez (`semilla`). (Cap. 14)
- **Azimut:** ángulo horizontal entre hacia dónde miras y dónde está un objeto.

## B
- **Banco de preguntas:** el conjunto de las 59 preguntas del quiz. (Cap. 12)
- **Bézier (curva):** curva suave definida por puntos de control. Se usa para que el vuelo del ave sea una trayectoria elegante.
- **Bitácora:** diario del proyecto (`BITACORA_PAJARO.md`): qué se hizo, decidió y descartó.
- **Bucle de animación (loop):** función que se repite ~60 veces por segundo para actualizar y dibujar. Aquí es `ciclo()` en `ra.js`. (Cap. 6)
- **Bug:** error de programa.
- **Boids:** algoritmo que simula bandadas con tres reglas (alinearse, juntarse, separarse). Lo usa la portada con 46 aves. (Cap. 13)
- **Branch (rama) de Git:** línea de trabajo; aquí solo usamos `main`.
- **Brújula (magnetómetro):** sensor que indica el norte. El navegador mezcla giroscopio y brújula en `deviceorientation`.

## C
- **Caché:** copia guardada para no descargar de nuevo. El navegador cachea los archivos ~10 minutos en GitHub Pages; por eso a veces «no se ve el cambio» (Ctrl + Shift + R).
- **Cámara (3D):** el punto de vista desde el que se dibuja la escena. En RA gira con el celular.
- **Cámara trasera (`facingMode: environment`):** la cámara de atrás del celular.
- **Canvas:** lienzo HTML para dibujar con código (2D o 3D). Hay uno para el 3D de la RA y otros para las texturas y la portada.
- **CanvasTexture:** textura 3D generada a partir de un canvas 2D (se usa para etiquetas, tarjetas, letreros del campus).
- **CDN:** red de servidores que entrega archivos rápido (de ahí viene three.js y las fuentes).
- **Cinemática:** el recorrido 3D de ~108 s por el campus. (Cap. 15)
- **Cinemática vs video:** la cinemática se calcula en vivo; el video es un archivo grabado.
- **Clase CSS:** etiqueta para aplicar un estilo a varios elementos.
- **Colisión:** choque entre objetos. Aquí no hay física, pero sí reglas para que los objetos no se encimen.
- **Commit:** «foto» de los cambios de un proyecto en Git, con mensaje.
- **Componente (A-Frame):** pieza reutilizable de comportamiento en A-Frame. No usamos A-Frame.
- **Consola del navegador:** panel (F12) que muestra mensajes y errores y permite ejecutar código. (Cap. 23)
- **Constante (`const`):** valor que no cambia.
- **Cono / Cilindro / Esfera / Caja:** formas básicas 3D usadas para armar aves y edificios.
- **CSS:** lenguaje de estilos. (Cap. 3)
- **CSS variables (`--ambar`):** valores con nombre reutilizables. Cambiar `--ambar` cambia el color en toda la web.
- **Cuadro (frame):** una imagen dibujada. 60 por segundo = fluido.
- **Cuaternión:** forma de representar una rotación con 4 números. Evita el bloqueo de cardán y permite `slerp`. (Cap. 9)

## D
- **Dato curioso:** el texto que sale después de cada respuesta del quiz.
- **`datos-uao.js`:** archivo con las 84 especies, las 49 fichas y las 20 fotos de la guía.
- **`deltaTime (dt)`:** tiempo transcurrido entre dos cuadros; se acota a 0,05 s para evitar saltos.
- **`deviceorientation`:** evento del navegador con la orientación del celular. (Cap. 9)
- **DevTools:** herramientas de desarrollador del navegador (F12).
- **`dispose()`:** liberar memoria de la GPU de una geometría, material o textura.
- **DoF (grados de libertad):** movimientos posibles. 3DoF = giros; 6DoF = giros + posición. (Cap. 19)
- **DOM:** representación de la página HTML en memoria; JavaScript la lee y la cambia.
- **Draw call (orden de dibujo):** cada petición de dibujar un objeto. Menos es mejor. (Cap. 16)

## E
- **`ease` / suavizado:** hacer que un movimiento arranque y termine suave (smoothstep).
- **ECMAScript modules (`import`/`export`):** forma moderna de dividir JavaScript en archivos.
- **Elemento HTML:** una etiqueta con su contenido, como `<button>`.
- **Envolvente (ADSR):** forma en que sube y baja el volumen de un sonido. (Cap. 10)
- **Escala (`scale`):** tamaño de un objeto 3D.
- **Escena (`Scene`):** contenedor de todo lo que se dibuja.
- **`especies-ra.js`:** ficha de datos de las 12 aves (colores, pico, soporte, comida, pistas…).
- **Estado (state):** información que el programa recuerda (modo actual, aves en pantalla, vidas del quiz).
- **Evento:** algo que sucede (clic, toque, giro) y a lo que el código reacciona.
- **Euler (ángulos):** tres ángulos para rotar. Se convierten a cuaternión.
- **Extrusión (`ExtrudeGeometry`):** «inflar» una forma 2D a 3D (arco, techos).

## F
- **Fetch:** pedir un archivo o dato desde JavaScript.
- **FOV (campo de visión):** cuánto ve la cámara. 62° normal, 21° con binoculares, 66° en la cinemática.
- **Flat shading:** sombreado que muestra cada cara con un solo tono (aspecto facetado). Se usa en parte del campus; las aves usan sombreado suave.
- **Fog (niebla):** efecto que difumina lo lejano con un color (cinemática).
- **Fraunces / Inter:** las fuentes de la web (Google Fonts).
- **Frustum culling:** no dibujar lo que está fuera del campo de visión.
- **Función:** bloque de código con nombre que hace una tarea.
- **Fusionar mallas (`fusion.js`):** unir muchas piezas en una para reducir órdenes de dibujo. (Cap. 16)

## G
- **Garbage collector (recolector de basura):** mecanismo de JavaScript que libera memoria; crear muchos objetos temporales provoca tirones.
- **Geometría (`Geometry`):** la forma (vértices y caras) de una malla.
- **Git / GitHub / GitHub Desktop:** control de versiones / sitio que aloja los repositorios / programa con interfaz para usar Git. (Cap. 5)
- **GitHub Actions:** automatización de GitHub; aquí publica el sitio tras cada `push`.
- **GitHub Pages:** alojamiento gratuito de sitios estáticos.
- **Giroscopio:** sensor que mide giros del celular.
- **GPU:** procesador gráfico, especializado en dibujar.
- **Grid / Flexbox (CSS):** sistemas para ordenar elementos en filas y columnas.
- **Group (`THREE.Group`):** contenedor de objetos 3D; sirve de pivote.
- **Guía UAO:** la *Guía ilustrada de las aves del campus de la UAO* (2023).

## H
- **Hash / ancla (`#guia`):** parte final de una dirección que lleva a una sección de la página. Causó el bug de que abriera en la guía.
- **`hidden`:** atributo HTML que oculta un elemento.
- **Hit-test:** averiguar dónde un rayo choca con el mundo real (WebXR). (Cap. 9)
- **HRTF:** modelo de audio 3D que simula cómo oyen los oídos. No lo usamos.
- **HTML:** lenguaje de estructura de la página. (Cap. 2)
- **HTTP / HTTPS:** protocolo de la web / versión segura (obligatoria para cámara y sensores).

## I
- **IA:** inteligencia artificial.
- **IMU:** unidad de medición inercial (giroscopio + acelerómetro + brújula).
- **Importmap:** tabla que le dice al navegador de dónde importar «three».
- **`index.html`:** la página principal.
- **Instancia (`InstancedMesh`):** muchas copias de una malla en una sola orden de dibujo. (Cap. 16)
- **Interpolación (`lerp`/`slerp`):** mezclar suavemente entre un valor y otro.
- **IIFE:** función que se ejecuta apenas se define, útil para encapsular código.

## J
- **JavaScript (JS):** lenguaje de programación de la web. (Cap. 4)
- **JSON:** formato de texto para datos (objetos y listas). Se usa en `localStorage`.
- **Jornadas:** salidas de monitoreo de aves; la web tiene un mosaico de fotos.

## L
- **`localStorage`:** pequeño almacén en el navegador. Guarda la libreta. (Cap. 13)
- **`lookAt`:** orientar la cámara para que mire a un punto.
- **Low-poly:** estilo con pocos polígonos.
- **Luz (ambiente, direccional):** fuentes de iluminación de la escena.

## M
- **Malla (`Mesh`):** geometría + material = objeto 3D visible.
- **Material:** la «piel» del objeto.
- **`MeshStandardMaterial`:** material realista básico que reacciona a las luces; lo usan las aves.
- **Mixta (realidad):** lo virtual interactúa con el mundo real.
- **Módulo:** archivo JS que exporta e importa funciones.
- **Modo (RA):** cada interacción: avistar, binoculares, llamar, comedero, foto, quiz. (Cap. 11)
- **`MODOS`:** objeto en `ra.js` que define `entrar`, `salir` y `tocar` de cada modo.

## N
- **Navegador:** programa para ver páginas web (Chrome, Safari).
- **Node.js / npm:** entorno y gestor de paquetes de JavaScript. No lo usamos.
- **Normal (vector):** dirección perpendicular a una cara; sirve para la iluminación.

## O
- **Objeto (JS):** colección de pares nombre–valor `{ nombre: "Garza", escala: 0.4 }`.
- **Oclusión:** que un objeto real tape a uno virtual. No la hacemos.
- **Órbita:** movimiento circular (aves en la cinemática).
- **Oscilador:** generador de una onda de sonido (seno, cuadrada, sierra, triángulo).

## P
- **Paneo (pan):** reparto del sonido entre izquierda y derecha.
- **Partículas:** objetos pequeños para efectos (notas, confeti).
- **`pixelRatio`:** relación de píxeles dibujados vs de la pantalla. (Cap. 16)
- **Pivote:** punto alrededor del cual gira un objeto.
- **Polígono / Triángulo:** caras de una malla.
- **Procedural:** generado por reglas y fórmulas, no a mano.
- **Promesa (`Promise`, `async/await`):** manera de esperar algo asíncrono.
- **Push:** subir commits a GitHub (publica el sitio).

## Q
- **Quiz RA:** juego de preguntas en realidad aumentada. (Cap. 12)

## R
- **Radar:** indicador que muestra dónde hay aves a tu alrededor.
- **Raycasting / `Raycaster`:** lanzar un rayo desde la cámara para ver qué objeto toca. (Cap. 6)
- **RA / RV / RM / XR:** realidad aumentada / virtual / mixta / extendida. (Cap. 19)
- **Render / renderizador (`WebGLRenderer`):** quien dibuja la escena en el canvas.
- **Repositorio (repo):** carpeta de un proyecto controlada con Git.
- **Responsive:** que se adapta a distintos tamaños de pantalla.
- **Rúbrica:** lista de lo que se evalúa; la del Parcial 2 pide RA, quiz y mínimo 5 interacciones.

## S
- **Scene graph:** árbol de objetos de la escena (grupos dentro de grupos).
- **Semilla (`semilla`):** número que inicia una secuencia aleatoria repetible.
- **Servidor:** computador que entrega archivos. Aquí es GitHub Pages.
- **Sintetizar (sonido):** crear un sonido con matemáticas en vez de grabarlo.
- **`slerp`:** interpolación esférica de rotaciones.
- **SLAM:** técnica para construir un mapa y ubicarse a la vez (ARCore/ARKit).
- **Smoothstep:** función de suavizado que arranca y termina lento.
- **Soporte:** rama, pasto, agua, flor o tronco donde se posa el ave.
- **Sprite (3D):** plano que siempre mira a la cámara; se usa para etiquetas, tarjetas y notas.
- **Sprite SVG:** conjunto de íconos SVG en la página (`<symbol>`), referenciados con `<use>`.
- **SVG:** imagen vectorial.

## T
- **Textura:** imagen que se pega a un objeto 3D.
- **three.js:** librería JavaScript para 3D. (Cap. 6)
- **Tiempo real:** que se calcula mientras se usa, 60 veces por segundo.
- **Token (CSS):** variable de diseño (colores, tamaños).
- **Tracking:** seguimiento de la posición/orientación del usuario.
- **Triángulo:** la unidad básica de una malla 3D.

## U
- **UAO:** Universidad Autónoma de Occidente (Cali).
- **UI / UX:** interfaz de usuario / experiencia de usuario.
- **Unity:** motor de videojuegos usado en el Parcial 1.
- **Uniforme (shader):** dato que se pasa a la GPU. No los usamos directamente.

## V
- **Vector:** lista de números que representa posición o dirección (`Vector3`).
- **Vértice:** punto de una malla.
- **Vertex colors (colores por vértice):** color guardado en cada vértice; permite fusionar piezas de distintos colores. (Cap. 16)
- **Vibe coding:** programar describiendo lo que quieres y dejando que una IA escriba el código. (Cap. 20)
- **Video (`<video>`):** elemento HTML; aquí muestra la cámara.
- **Visual Studio:** programa donde el compañero creó el proyecto.

## W
- **Web Audio API:** sistema del navegador para generar y procesar sonido. (Cap. 10)
- **WebGL:** tecnología del navegador para dibujar 3D con la GPU.
- **WebXR:** estándar del navegador para RA/RV. (Cap. 9)
- **WikiAves:** plataforma colaborativa de aves de Latinoamérica; enlazada desde las fichas.
- **`window`:** objeto global del navegador (`window.RA`, `window.Libreta`).
- **Workflow (GitHub):** archivo que define una automatización (`pages.yml`).

## X
- **XR (Extended Reality):** término que incluye RV, RA y RM.

## Y–Z
- **Yaw / pitch / roll:** giro a los lados / arriba–abajo / inclinación lateral.
- **z-index:** orden de apilado en CSS (qué está encima de qué).
- **Zoom:** acercamiento. En binoculares reduce el FOV de la cámara.
- **Zona (`zona`):** esfera invisible alrededor de cada ave que facilita tocarla.

---

## Mini-glosario de nombres que se oyen en el proyecto
| Término | Qué es |
|---|---|
| **Ágora** | La plazoleta circular con gradas, rodeada de palmas |
| **Arco Central** | Estructura de entrada con abertura semicircular |
| **Edificio Central** | Alas Norte y Sur a los lados del pasillo desde la Portería 1 |
| **UAO Labs** | Edificio-sótano en el nivel del Ágora |
| **Aulas 1–4** | Los cuatro edificios de salones, de 4 pisos |
| **Guardián** | Insignia del quiz (≥ 10 aciertos) |
| **Libreta** | Cuaderno de campo digital |
| **MAX_AVES** | Tope de aves a la vez en «Llamar» (6) |
| **Meseta (norte)** | Zona 4,2 m más alta del campus de la cinemática |
