# Guía de estudio para la sustentación: Aves UAO

> Este archivo es para **estudiar** (no se publica en la web; vive solo en el repo). Está escrito para alguien que **no sabe programar**: todo se explica desde cero y con ejemplos. Lo ideal es leerlo en orden una vez y después usarlo como consulta rápida (hay un índice de preguntas del profesor al final).
> Pitch y sustentación: **sábado 2026-10-17, 8:00 a.m.** (5 min de presentación + 5 min de preguntas).

---

## 0. Las 10 cosas que debes poder decir sin leer

1. **Qué es:** una página web de Realidad Aumentada (RA) que sirve de **guía de avistamiento de las aves del campus de la UAO**. Abres el enlace en el celular, aceptas la cámara y ves aves 3D en tu entorno.
2. **No es una app que se instala:** es una **página web**. Funciona en Android y en iPhone desde el navegador (por eso no hay que descargar nada).
3. **De dónde sale la información:** de la **Guía ilustrada de las aves del campus de la UAO (2023, Escuela de Turismo)**: 84 especies, 30 familias, 77 géneros. Los datos (nombres, textos de las fichas, fotos) son de la guía; no los inventamos.
4. **Qué aves hay en RA:** 12 especies, modeladas en 3D con código (no usamos modelos descargados).
5. **Interacciones RA (la rúbrica pedía mínimo 5):** Avistar, Binoculares, Llamar, Comedero, Foto de campo, Quiz y «Tamaño real» (esta última solo en Android compatible). Además tiene una **Cinemática**: un recorrido 3D por el campus.
6. **Tecnologías principales:** HTML, CSS y JavaScript; la librería **three.js** para el 3D (que usa WebGL); la **cámara y el giroscopio** del celular; **Web Audio** para los sonidos; **WebXR** para el modo «Tamaño real»; **localStorage** para la libreta; **GitHub Pages** para publicar.
7. **Cómo sabe hacia dónde miras:** el celular tiene un giroscopio y una brújula; el navegador nos da esos datos y movemos una **cámara virtual** igual que tu celular. Encima del video real dibujamos las aves.
8. **Los cantos son sintetizados** (los generamos con código, imitando el patrón de cada canto), **no son grabaciones**. Hay enlace a WikiAves para escuchar los reales.
9. **El quiz:** preguntas sobre aves y sobre el entorno UAO, con 2 vidas, hasta 20 preguntas por partida; con 10 aciertos ganas la insignia «Guardián».
10. **Honestidad sobre el proceso:** la app se construyó con ayuda de una IA de programación (Claude). Tú dirigiste las decisiones (qué se quiere, cómo se ve, qué se prueba) y el equipo la probó en Android e iPhone. Ver la sección 11 para cómo decirlo bien.

---

## 1. Qué pedía el parcial y dónde lo cumplimos

La rúbrica (Parcial 2, Fundamentos de Realidad Virtual) pedía:

| Lo que pide | Dónde está en la app |
|---|---|
| Aplicativo de **RA que sirva de guía de avistamiento e información** de las aves del campus UAO | La web completa: portada, guía de 84 especies, libreta y la experiencia RA |
| Alimentarse de la **base de datos de aves de la UAO** (información, imágenes, sonidos, textos) | `datos-uao.js` (84 especies, 49 fichas con texto, 12 fotos reales de la guía), enlaces a WikiAves, sonidos recreados |
| **La RA debe ser el corazón**, no «por poner» | Toda la experiencia principal es RA: ves las aves en tu entorno, las llamas, las fotografías, las alimentas |
| **Quiz en RA** sobre las aves **y el entorno UAO** | Modo «Quiz» (59 preguntas en total: 36 de aves, 16 de ecología de las aves y 7 del entorno UAO) |
| Funcionar en **Android o iOS** | Probado por el equipo en ambos (cámara + giroscopio) |
| **Animaciones, audios, videos** acordes a la información o la interacción | Aves animadas, cantos y efectos de sonido, y la **Cinemática** (recorrido 3D, que hace de «video») |
| **Mínimo 5 interacciones RA** | 6 en cualquier celular + «Tamaño real» (WebXR, solo Android con ARCore) = 7 |
| Entrega: **aplicativo funcional en web** + pitch | Publicado con HTTPS en GitHub Pages; el pitch lo preparan los compañeros |

**Puntos parciales (conviene decirlos tú antes de que te los pregunten):**
- Los cantos son **sintéticos**, no grabaciones. (Las grabaciones reales tienen licencias y hay que dar crédito; optamos por recrearlos y enlazar a WikiAves.)
- La guía trae 84 especies, pero **en RA hay 12** (las demás se ven en la guía de texto). 8 de las 12 aves de RA no tienen foto real en su ficha porque la guía solo trae 12 fotos.

---

## 2. Qué es el proyecto, contado como un recorrido de usuario

1. **Entras al enlace.** Ves la portada: un amanecer animado con aves volando (dibujado con código) y el título «Aves UAO».
2. **Bajas por la página:** «Cómo funciona» (6 tarjetas, una por interacción), la **Guía UAO** (buscador de las 84 especies con su ficha, foto y enlace a WikiAves), **Mi libreta** (las aves que has registrado, tus fotos, tu mejor puntaje del quiz) y las **Jornadas** de monitoreo.
3. **Tocas «Iniciar la experiencia RA».** El navegador pide permiso para la **cámara** y el **movimiento del celular**. Si aceptas, ves tu entorno con aves 3D encima.
4. Dentro de la RA hay una **barra de botones abajo**:
   - **Avistar:** salen las 12 aves a tu alrededor. Mueves el celular para buscarlas y tocas una para **registrarla** en la libreta (aparece su ficha).
   - **Binoculares:** acerca la vista (zoom); si apuntas al centro de un ave aparecen **marcas de identificación** («pico», «cola», «ala»…).
   - **Llamar:** eliges un canto y **el ave que lo reconoce llega volando** y responde.
   - **Comedero:** pones alimento (flores, frutas, agua, pasto, insectos) y llegan las aves que lo comen.
   - **Foto:** encuadras un ave y tomas una **foto de campo** con marca «Aves UAO» y la fecha; se guarda en la libreta y se puede descargar.
   - **Quiz:** preguntas tocando la respuesta (un ave, una tarjeta o un alimento 3D). 2 vidas.
   - **Cinemática:** un **recorrido 3D por el campus** (Portería 1, Arco Central, Ágora, aulas, lago, cafetería, Portería 3, parque y parqueadero) con aves volando; puedes mirar alrededor arrastrando o moviendo el celular, acelerarlo (×2, ×4) o saltarlo. Al terminar vuelves a la RA donde estabas.
5. **Si no hay cámara** (por ejemplo en un computador) la app usa un **campus 3D simulado** como fondo: arrastras con el mouse para mirar. Así se puede proyectar en el pitch.
6. En Android con ARCore aparece un botón extra, **«Ver a tamaño real»**, que usa WebXR para colocar un ave sobre el piso o una mesa.

---

## 3. Glosario (asume que no sabes nada, aquí está todo)

### La web
- **Página web / sitio estático:** un conjunto de archivos (texto, imágenes) que el navegador descarga y muestra. «Estático» significa que no hay un programa corriendo en un servidor que arme la página: los archivos ya están hechos, tal cual. Todo lo que pasa lo hace **tu navegador**, en tu celular.
- **HTML (`index.html`):** el **esqueleto**: dice qué hay en la página (títulos, botones, secciones, imágenes).
- **CSS (`estilos.css`):** el **maquillaje**: colores, tamaños, tipografías, cómo se acomoda en pantallas grandes o pequeñas (a eso se le llama *diseño responsive* y se logra con *media queries*).
- **JavaScript (archivos `.js`):** el **cerebro**: el código que hace que las cosas pasen (botones que responden, aves que se mueven, quiz que cuenta aciertos). Un archivo `.js` es simplemente un archivo de texto con instrucciones en el lenguaje JavaScript, que el navegador lee y ejecuta. No hace falta instalar nada para que corra.
- **Navegador:** Chrome, Safari… es el programa que ejecuta todo lo anterior.
- **Módulo (`import`):** una forma de dividir el código en archivos y que unos usen cosas de otros. En `ra.js` verás `import ... from "./aves3d.js"`: significa «traigo las funciones de aves de ese archivo».
- **`importmap`:** una lista en el HTML que dice dónde encontrar la librería `three` en internet.
- **CDN:** un servidor en internet que reparte librerías ya hechas. Nosotros cargamos three.js desde `cdn.jsdelivr.net`. Por eso la RA **necesita internet** para cargar (una vez cargada, trabaja en tu celular).
- **HTTPS:** conexión segura. Los navegadores **solo dejan usar la cámara y el giroscopio en páginas HTTPS**. GitHub Pages ya trae HTTPS.
- **GitHub, Git, commit, push:** Git es un sistema que guarda las **versiones** del proyecto (cada `commit` es una «foto» de los archivos con un mensaje). GitHub es el sitio en internet donde se guarda el repositorio. `push` = subir los cambios.
- **GitHub Pages + GitHub Actions:** cada vez que se hace push, una «receta» automática (`.github/workflows/pages.yml`) copia la carpeta `PaginaPajaro/wwwroot` y la publica en https://jusstjuanda.github.io/pajaro-uao/. Es gratis y tarda unos 20 segundos (el navegador puede tardar 10 min en refrescar por su caché).
- **localStorage:** una pequeña «libreta» dentro del navegador de cada persona. Ahí guardamos las aves registradas, las fotos y el puntaje. **No hay base de datos ni servidor**: lo que registras se queda en **tu** celular (ventaja de privacidad; desventaja: si borras los datos del navegador, se pierde).
- **`.csproj` y `Program.cs`:** el proyecto se creó en Visual Studio como proyecto ASP.NET (de Microsoft). Ese programa solo sirve para **abrir la página en el computador durante el desarrollo**. La app publicada **no usa .NET**: es solo HTML, CSS y JavaScript.

### El 3D
- **three.js** (se pronuncia «tri-yei-es»; en inglés *three* = tres): una **librería de JavaScript** que facilita muchísimo hacer 3D en el navegador. Sin ella habría que escribir a mano instrucciones de bajo nivel de la tarjeta gráfica. Usamos la versión 0.160.
- **WebGL:** la tecnología del navegador que le permite usar la **tarjeta gráfica** (GPU) para dibujar 3D. three.js la usa por debajo.
- **Escena (`Scene`):** el «escenario» donde se pone todo lo 3D.
- **Cámara (`PerspectiveCamera`):** el «ojo» virtual desde donde se ve la escena. Se le configura el campo de visión (FOV): 62° normal, ~21° en binoculares (zoom).
- **Renderizador (`WebGLRenderer`):** el «pintor» que dibuja la escena vista desde la cámara en un `<canvas>` (un lienzo HTML). Se repinta unas 60 veces por segundo.
- **Malla (`Mesh`) = geometría + material:** la geometría es la forma (esfera, caja, cono) y el material es el aspecto (color, brillo). Un ave es un montón de mallas pequeñas: cuerpo (esferas aplastadas), pico (cono), alas, cola…
- **Luces:** una luz de cielo (hemisférica) y una de sol (direccional) para que se vean los volúmenes.
- **Low-poly:** poca cantidad de polígonos (triángulos), con caras planas visibles. Es un estilo gráfico y además **ayuda al rendimiento** en celulares.
- **Textura de canvas:** en vez de usar imágenes, dibujamos con código (en un canvas 2D) cosas como el logo «uao», el piso de rombos o los rótulos, y se pegan como textura.
- **Instancias (`InstancedMesh`):** dibujar **muchas copias del mismo objeto en una sola orden** a la tarjeta gráfica (las ventanas de los edificios, las aves volando en la cinemática, los carros del parqueadero). Es clave para que corra rápido.
- **Fusión de mallas (`fusion.js`):** unir muchas mallas pequeñas en una sola para que el celular dibuje menos objetos por cuadro (pasamos de 675 a unas 117 «órdenes de dibujo»).
- **Raycaster (rayo):** para saber qué tocó el dedo, se lanza un «rayo» invisible desde la cámara por el punto de la pantalla y se ve con qué objeto choca.
- **Cuaternión (`Quaternion`):** una forma matemática de representar una **rotación 3D** sin los problemas de los ángulos normales (bloqueo de cardán). three.js la usa para orientar la cámara.
- **Curva Catmull-Rom:** una curva suave que pasa por una lista de puntos. La cinemática la usa para mover la cámara por el campus.
- **Bucle de animación (`ciclo()` en `ra.js`):** una función que se ejecuta unas 60 veces por segundo: lee el giroscopio, mueve las aves, y pinta la escena.

### Realidad Aumentada / Virtual
- **Realidad Virtual (RV):** el usuario queda inmerso en un mundo completamente virtual (normalmente con un visor como el Quest 2).
- **Realidad Aumentada (RA):** se **superponen objetos virtuales a la realidad** (aquí, sobre el video de la cámara).
- **Continuo realidad–virtualidad (Milgram):** una escala que va de lo real puro a lo virtual puro; la RA queda cerca de lo real, la RV en el extremo virtual.
- **Grados de libertad (DoF):** **3DoF** = solo se detecta hacia dónde **giras** (arriba/abajo, izquierda/derecha, inclinación). **6DoF** = además se detecta cuánto **te desplazas** por el espacio. Nuestra RA principal es **3DoF** (usa giroscopio); «Tamaño real» con WebXR es **6DoF** (el teléfono entiende el piso).
- **Giroscopio / acelerómetro / brújula (IMU):** sensores del celular. El navegador los entrega como el evento `deviceorientation` con tres ángulos (`alpha`, `beta`, `gamma`).
- **Tracking (seguimiento):** cómo el sistema sabe dónde está el usuario/dispositivo. Hay *con marcadores* (se detecta una imagen), *sin marcadores* (sensores, planos del suelo)…
- **WebXR:** la API estándar del navegador para RA/RV. Con `immersive-ar` y `hit-test` el navegador detecta superficies reales (piso, mesa) usando la tecnología del teléfono (**ARCore** en Android). **Safari de iPhone no soporta WebXR**, por eso «Tamaño real» es solo Android.
- **Inmersión y presencia:** inmersión = qué tanto el sistema te envuelve (visual, sonido); presencia = la sensación de «estar ahí».
- **Audio espacial / paneo:** el canto suena más a la izquierda o a la derecha según dónde esté el ave respecto a hacia dónde miras (`Sonido.cantar(id, volumen, paneo)`).

### Audio
- **Web Audio API:** herramienta del navegador para **generar y mezclar sonido con código**. Nuestros cantos se crean con **osciladores** (ondas que suben y bajan de frecuencia) y ruido filtrado, siguiendo el patrón de cada canto («uuu-íik» del garrapatero, «bi-cho-fué» del bichofué…). No hay archivos de audio.

---

## 4. Mapa de archivos (qué es cada cosa)

Todo está en `PaginaPajaro/wwwroot` (esa carpeta es la web). Son unas **4.200 líneas** de código en total.

| Archivo | Qué hace | Líneas aprox. |
|---|---|---|
| `index.html` | Todo el **contenido de la página** y la interfaz de la RA (botones, paneles, preguntas), más los íconos | 210 |
| `css/estilos.css` | **Aspecto** de todo: colores, tipografías, tarjetas, interfaz de RA, versión celular/computador | 310 |
| `js/datos-uao.js` | **Base de datos** de la guía: 84 especies (orden, familia, nombre, científico, inglés), 49 fichas con texto y el id de WikiAves, jornadas | 160 |
| `js/especies-ra.js` | Las **12 aves de RA**: colores, soporte (rama, pasto, flor…), qué comen, marcas de identificación y pistas del quiz | 100 |
| `js/app.js` | La página: **buscador**, listado de la guía, **libreta** (localStorage), jornadas, **ficha** que se abre desde la RA, arranque de la RA | 135 |
| `js/escena.js` | El **amanecer animado de la portada** (cielo, sol, cerros, aves con comportamiento de bandada). Es un dibujo en canvas 2D, no usa three.js | 160 |
| `js/sonido.js` | Todo el **sonido** (cantos sintetizados, clic, éxito, error, obturador, viento) con Web Audio | 255 |
| `js/ra/ra.js` | **El motor de la RA** (el archivo más importante, ~1.100 líneas): cámara, giroscopio, modos, aves, toques, foto, quiz, WebXR, y el arranque/pausa de la cinemática | 1100 |
| `js/ra/aves3d.js` | **Cómo se construyen y animan las aves 3D**, los soportes, las etiquetas con nombre y las tarjetas del quiz | 440 |
| `js/ra/campus.js` | El **campus simulado** (fondo cuando no hay cámara): suelo, caminos, aulas, fuente, árboles y palmas | 360 |
| `js/ra/campus-real.js` | El **campus fiel** de la cinemática: Portería 1, Arco Central, Ágora, aulas, lago, cafetería, Portería 3, canchas, parqueadero | 630 |
| `js/ra/recorrido.js` | La **cinemática**: la cámara que recorre el campus, las aves volando, los rótulos, el arrastre, la velocidad | 180 |
| `js/ra/fusion.js` | Utilidad para **unir mallas** y que el celular dibuje menos | 45 |
| `galeria3d.html` | Una página aparte que muestra las 12 aves girando (útil para el pitch) | 75 |
| `img/` | 35 imágenes: fotos de la guía y del campus, logo, los 12 «renders» de las aves, decoración | — |
| `.github/workflows/pages.yml` | La receta que **publica** la web en GitHub Pages | 25 |
| `PaginaPajaro.csproj`, `Program.cs` | Servidor mínimo de .NET para ver la página en el computador mientras se programa (no se usa en la web publicada) | 10 |

Archivos de documentación (en la raíz, no se publican): `BITACORA_PAJARO.md` (memoria completa del proyecto), `ESTADO_ACTUAL.md`, `CLAUDE.md`, `README.md` y este archivo.

---

## 5. Cómo funciona por dentro (paso a paso)

### 5.1 La página carga
`index.html` carga: los datos (`datos-uao.js`, `especies-ra.js`), el sonido (`sonido.js`), la portada (`escena.js`), la lógica de la página (`app.js`) y, como **módulo**, el motor RA (`ra/ra.js`). El CSS le da el aspecto. La librería three.js se descarga de internet (CDN) cuando `ra.js` la importa.

### 5.2 Arrancar la RA (`iniciar()` en `ra.js`)
1. Al tocar el botón, se **piden permisos dentro del toque del usuario** (iOS lo exige): `getUserMedia` (cámara trasera) y `DeviceOrientationEvent.requestPermission` (movimiento).
2. Se crea la **escena 3D** (`THREE.Scene`), la **cámara virtual** en el origen (0,0,0), las **dos luces** y el **renderizador con fondo transparente** (`alpha: true`).
3. Detrás del `<canvas>` hay un elemento `<video>` que muestra lo que ve la cámara real. Como el canvas es transparente, **ves el video con las aves 3D encima**. Esa es la «magia» de la RA aquí.
4. Si no hay cámara (computador o permiso negado) se muestra el **campus simulado** como fondo.

### 5.3 Cómo se mueve la vista (`alGirar()` y `ciclo()`)
- El navegador dispara `deviceorientation` con los ángulos del celular. `alGirar` los convierte en un **cuaternión** (`qGiro`) y le aplica las correcciones de la posición de la pantalla (vertical/horizontal).
- En cada cuadro de `ciclo()`, la cámara virtual **gira suavemente** hacia ese cuaternión (`slerp`, con factor 0,35 para que no tiemble).
- Si no hay giroscopio (computador), al **arrastrar** con el dedo/mouse se cambian dos ángulos (`yaw` y `pitch`) y la cámara gira con ellos.
- Importante para explicar bien: los objetos están ubicados **alrededor del usuario** (a cierta distancia y ángulo) y la cámara solo **gira**. Es una RA de **3 grados de libertad**: si caminas, las aves no cambian de lugar respecto a ti. (En «Tamaño real», WebXR sí las ancla al piso.)

### 5.4 Las aves
- `crearAve(especie)` (`aves3d.js`) arma el ave con **formas simples**: cuerpo y cabeza de esferas, pico de cono, alas y cola de piezas planas, ojos, patas, y los colores salen de `especies-ra.js`. Cada ave tiene partes con nombre (cabeza, pico, ala, cola) que se usan para animarla y para las marcas de los binoculares.
- `animarAve` en cada cuadro hace que **respire, mueva la cabeza y aletee** (más cuando se acaba de tocar o está volando).
- Cada ave se posa sobre un **soporte** (rama, pasto, flor, tronco, charco) que es un **objeto aparte del mundo**: así el soporte no viaja con el ave.
- **Que nada se cruce:** antes de posar un ave, `cabe()` y `sitioLibre()` miden el espacio que ocupa su soporte (un círculo en el suelo) y buscan un punto libre, sin pisar el camino, la fuente, bancas u otras aves. Se probó con cientos de repartos sin cruces.
- Las aves **vuelan** (`volar`) siguiendo una curva (Bézier) del punto de partida al destino, y se orientan hacia donde van.

### 5.5 Tocar un ave (`configurarEntrada`, `avePorPantalla`)
Cuando tocas la pantalla, se lanza un **rayo** desde la cámara; si choca con la «zona de toque» de un ave, se ejecuta la acción del modo actual (`MODOS[modo].tocar(ave)`): cantar, aletear, registrarla en la libreta, abrir su ficha, etc. Si arrastras más de unos píxeles, se interpreta como «mirar», no como toque.

### 5.6 Los modos (`MODOS` y `cambiarModo`)
Un **objeto** con seis entradas (avistar, binoculares, llamar, comedero, foto, quiz). Cada una tiene `entrar()` (prepara la escena), `salir()` (limpia) y `tocar(ave)`. `cambiarModo` cancela lo pendiente, sale del modo anterior y entra al nuevo. Los retrasos («el ave llega en 2 s») usan una función `despues()` que **anota cada temporizador** para poder cancelarlo si cambias de modo (así no aparecen aves de más).

### 5.6.1 Detalles de cada modo
- **Avistar:** pone las 12 aves en dos anillos alrededor (cerca y un poco más lejos).
- **Binoculares:** baja el campo de visión de 62° a ~21° (zoom). Si el centro de la mira toca un ave, `actualizarMarcas` calcula dónde está cada parte (pico, cola…) en pantalla y dibuja carteles con líneas, sin pisarse y sin salirse de la pantalla.
- **Llamar:** abre un panel con los cantos; al tocar uno, el ave de esa especie «llega volando» y canta.
- **Comedero:** pones un alimento 3D delante de ti; llegan las especies que lo comen (según `especies-ra.js`).
- **Foto:** `tomarFoto()` dibuja en un canvas 2D el **cuadro del video**, encima la **escena 3D** y abajo una franja con «Aves UAO - Aves del campus» y la fecha; la guarda como JPG en la libreta y ofrece descargarla.
- **Quiz:** ver 5.8.

### 5.7 Registro y libreta
`registrarAve` marca el ave como vista (verde en el radar), muestra «¡X registrada!» y llama a `window.Libreta.registrar`, que guarda en `localStorage` (clave `pajaro-uao-libreta`): lista de aves, hasta 8 fotos y el mejor puntaje del quiz. La sección «Mi libreta» de la página lee eso mismo.

### 5.8 El quiz
- **Banco de 59 preguntas:** 36 de aves (por nombre, pista o canto; se responde tocando el ave), 16 de ecología (hábitat, comportamiento y dieta; se responde con tarjetas 3D o alimentos 3D) y 7 del entorno UAO (cifras de la guía como las 84 especies y el 45,5 % de zonas verdes).
- **Mazo de una partida:** `armarMazo` mezcla con un ciclo (ave, campus, ecología, ave, campus, ave…), sin repetir y hasta 20 preguntas.
- **2 vidas:** un error quita un corazón; sin vidas termina. **10 aciertos o más = insignia «Guardián»**. Después de cada respuesta se muestra si fue correcta y un **dato curioso**.
- El mejor puntaje se guarda en la libreta.

### 5.9 «Tamaño real» (WebXR)
Solo si el navegador lo soporta (Android con ARCore): se abre una sesión `immersive-ar` con `hit-test`, el teléfono detecta el piso/mesa y aparece una **retícula**; al tocar se coloca el ave a tamaño real anclada a esa superficie. Es el único caso de **6 DoF**.

### 5.10 Sonido (`sonido.js`)
Cada canto es una **función** que programa «tonos» (osciladores con una frecuencia inicial y final, volumen, ataque y vibrato) y ruido filtrado. `Sonido.cantar(id, volumen, paneo)` lo reproduce; el paneo se calcula con la posición del ave respecto a hacia dónde miras, para que suene a un lado u otro. Hay también efectos (clic, éxito, error, obturador, aleteo, registro) y un ambiente (viento + cantos suaves), que usa la cinemática.

### 5.11 La cinemática (el «video» dentro de la RA)
**Qué es:** una experiencia 3D en vivo (no es un archivo de video) de unos 108 segundos.
- **El escenario** (`campus-real.js`) se construyó **a partir de las fotos y mapas del campus** que aportó Hugo (mapa de la carrera «Runners», fotos aéreas y de calle): Portería 1 con su letrero «uao» y la dirección, el Edificio Central con el Arco Central (más alto que el resto del campus), UAO Labs en el sótano con gradas y rampas, el Ágora circular con palmas, las aulas de 4 pisos, el lago, la cafetería con mesas, la Portería 3, el parque con canchas y el parqueadero.
- **La cámara** sigue una **curva Catmull-Rom** (`PASOS` en `recorrido.js`): una lista de puntos «dónde está la cámara» y «hacia dónde mira». Entre uno y otro se interpola suavemente.
- **Las aves** son ~140 formas instanciadas (cuerpo + dos alas) que se mueven en círculos y trayectorias, y una bandada guía que acompaña a la cámara.
- **Interacción:** arrastrar para mirar 360° (o mover el celular con giroscopio), botón de **velocidad ×1/×2/×4** y botón **Saltar**. Al terminar, **vuelve a la RA** tal como estaba (se esconden y luego se muestran las aves y el campus simulado; lo que estaba pendiente se ejecuta al volver).
- **Rendimiento:** unos 236 mil triángulos en total (~200 mil por vista); se usa instanciado y fusión; durante la cinemática se baja un poco la resolución de pantalla.
- Está en **módulos aparte** (`campus-real.js`, `recorrido.js`) y `ra.js` solo los llama, así que no puede dañar lo demás.

### 5.12 La portada (`escena.js`)
Un dibujo animado en **canvas 2D** (no 3D): cielo en degradado que «amanece», sol, cerros en capas, siluetas de árboles y una **bandada de aves con el comportamiento de boids** (cada ave sigue reglas simples: no chocar con las vecinas, ir en la misma dirección, mantenerse cerca; de ahí sale el movimiento natural de bandada), que además reacciona al mouse.

---

## 6. ¿Por qué así y no de otra manera? (decisiones técnicas)

| Decisión | Por qué | Alternativa y por qué no |
|---|---|---|
| **Página web**, no app instalable | Se abre con un enlace y sirve en Android **y** iPhone; no hay que publicar en tiendas; se actualiza al instante | Unity + ARCore/ARKit: más potente pero hay que compilar una app por plataforma, instalarla y es más lento de iterar |
| **three.js** puro | Es la librería 3D estándar de la web, muy documentada; da control total | A-Frame (más «declarativo» pero con menos control para lo que hicimos), Babylon.js (similar), 8th Wall/AR.js (marcadores o servicios de pago) |
| **Sin marcadores** (cámara + giroscopio) | No hay que imprimir nada ni apuntar a una imagen: funciona en cualquier lugar, incluso en el campus | AR con marcadores: más precisión de anclaje pero menos libertad |
| **Modelos 3D hechos con código** | Cada ave es unas pocas formas; pesa casi nada, carga rápido, y podemos cambiar colores/animaciones por código | Modelos de Blender/glTF: más realistas pero pesados y hay que modelarlos/animarlos uno por uno |
| **Estilo low-poly** | Es un estilo gráfico coherente y es **liviano** para celulares | Alta fidelidad: más lenta y difícil de sostener en celulares medios |
| **Sonidos sintetizados** | No dependemos de grabaciones con licencia (Xeno-canto exige crédito por grabación; Macaulay no es abierta); pesan 0 bytes | Grabaciones reales: más fieles pero con licencias, créditos y descargas |
| **localStorage** para la libreta | Es simple, sin cuentas ni servidor, privado | Base de datos en la nube: permitiría sincronizar entre dispositivos pero exige servidor, cuentas y privacidad |
| **Sitio estático en GitHub Pages** | Gratis, con HTTPS, publica solo con cada push | Un servidor propio: costo y mantenimiento innecesarios |
| **Campus simulado** cuando no hay cámara | Permite probar y **proyectar en el computador** | Exigir siempre cámara: no se podría mostrar en el pitch |
| **Cinemática en vivo** y no un video grabado | No pesa megas, es interactiva (mirar 360°), usa el mismo estilo gráfico de la RA y se puede ajustar | Un video: no interactivo y habría que grabarlo/editarlo |

---

## 7. Relación con la materia «Fundamentos de Realidad Virtual»

> Nota: aquí relaciono lo que **realmente hay** en el proyecto con conceptos típicos de la materia. En la sesión de repaso dime qué temas vieron exactamente para ajustar este cuadro con las palabras del profesor.

| Concepto de la materia | Cómo aparece en Aves UAO |
|---|---|
| **RA vs RV y el continuo de Milgram** | La experiencia principal es RA (virtual sobre video real). La **cinemática** es una experiencia **virtual inmersiva** (como un recorrido 360° en RV, pero en pantalla de celular, sin visor) |
| **Seguimiento (tracking) y grados de libertad** | RA principal: **3DoF** por IMU (giroscopio/brújula). «Tamaño real»: **6DoF** con WebXR (ARCore detecta el piso). La cinemática también usa 3DoF para mirar alrededor |
| **Escena 3D, cámara, iluminación, render** | three.js: escena, cámara perspectiva, luces, mallas, renderizador WebGL, bucle de animación a ~60 cuadros/s |
| **Interacción** | Toque con rayo (*raycasting*), mirada con retícula (apuntar con el centro de la pantalla en binoculares/foto), arrastre, botones; retroalimentación inmediata (sonido, animación, aviso) |
| **Audio** | Sonido acorde a cada acción, **paneo espacial** del canto según la posición del ave; ambiente en la cinemática |
| **Inmersión y presencia** | Aves que reaccionan, vuelan hacia ti, sonidos coherentes, zoom, cinemática que te «mete» en el campus |
| **Rendimiento / optimización** | *Instancing*, fusión de mallas, bajo número de polígonos, resolución adaptada, cancelación de procesos pendientes |
| **Diseño de la experiencia (UX en RA)** | Interfaz legible sobre el video, textos que no se salen de pantalla, modo sin cámara, avisos, botón de salida siempre visible |
| **Estándares** | WebXR Device API (`immersive-ar`, `hit-test`), `getUserMedia`, `DeviceOrientation` |
| **Extensión a RV con visor** | three.js ya integra `renderer.xr`; la cinemática podría correr con un visor (p. ej. Quest) con `immersive-vr`. **No está implementado** (trabajo futuro) |

---

## 8. Cómo se hizo el proyecto (historia corta)

- **12 de octubre:** un compañero (`jusstjuanda`) creó el repositorio y publicó la primera versión funcional: motor RA con three.js (sin A-Frame), 12 aves, las 7 interacciones, el quiz de 5 preguntas, la portada con el amanecer animado y la guía de 84 especies (según su bitácora).
- **15 y 16 de octubre (Hugo):** se corrigieron errores (árboles, binoculares, soportes de las aves), se pulió el **estilo de la página** (hojas de la guía como decoración, arco de palmas, logo y tipografías), se arreglaron textos que se salían de la pantalla, se mejoró el **campus simulado** y las aves (más detalle), se hizo que salgan las **12 aves a la vez**, se arregló la foto (fecha sin pegarse), se hizo el **quiz nuevo** (59 preguntas, 2 vidas, dato curioso) y la **cinemática** (con tus fotos y mapas del campus y varias rondas de correcciones), el botón «Cinemática» y la velocidad. También se corrigió que la página abriera directo en la sección de la guía cuando la dirección traía `#guia`.
- Todo está en el historial de Git (`git log`) con los mensajes de cada commit; los commits los hace Hugo desde GitHub Desktop.
- Existe una **bitácora** (`BITACORA_PAJARO.md`) con todo lo hablado y decidido: es la memoria del proyecto.

---

## 9. Quién hizo qué, y cómo hablar del uso de IA

**La verdad, tal como es (sin adornos):** el código se escribió con ayuda de una **IA de programación (Claude, de Anthropic)** que Hugo fue dirigiendo. Eso no es un secreto ni algo para esconder; lo importante es **qué hizo cada uno**.

**Lo que hizo el equipo / Hugo (y puedes afirmar con confianza):**
- Decidir **qué se construye** y **qué no** (por ejemplo: mantener el estilo, qué preguntas entran al quiz y cuáles no, no usar cantos grabados, hacer la cinemática, cómo debe verse y qué debe contener cada lugar del campus).
- Aportar el **material del campus**: fotos, mapas anotados (norte/sur, aulas, Ágora, rampas, gradas, lago, portería 3, parque, parqueadero) y **corregir** lo que no coincidía con la realidad.
- **Probar** en celulares reales (Android e iOS), reportar errores con capturas y aprobar cada cambio.
- Revisar que **todo texto quede dentro de la pantalla**, que suene natural y que la interfaz sea clara.
- Hacer los **commits y la publicación** (GitHub Desktop → GitHub Pages).

**Lo que hizo la IA:**
- Escribir y organizar el código, proponer opciones técnicas, encontrar y arreglar errores, medir rendimiento y llevar la documentación.

**Cómo decirlo (propuesta de respuesta si te preguntan «¿esto lo hizo una IA?»):**
> «Usamos una IA como asistente de programación, igual que otros usan documentación o foros. Nosotros decidimos qué debía hacer la aplicación, reunimos la información y el material del campus, dirigimos el diseño, probamos en celulares reales y corregimos lo que no estaba bien. Y entendemos cómo funciona: puedo explicarle cada parte.»
Para que esa frase sea cierta, **tienes que poder explicar** las secciones 3 a 6 de esta guía. Eso es justo lo que vamos a practicar.

**Si te preguntan por una parte concreta del código**, apóyate en el mapa de archivos (sección 4) y en las funciones que te nombro (`ciclo`, `alGirar`, `agregarAve`, `volar`, `tomarFoto`, `MODOS`, `armarMazo`, `crearRecorrido`…).

**Sobre los comentarios del código** (los `//` en español): son notas para explicar decisiones. Algunas suenan «de IA» (tercera persona, aclaraciones largas). Si quieres, en la sesión las repasamos y decides cuáles simplificar; no cambian el funcionamiento.

---

## 10. Limitaciones y trabajo futuro (dilo con tranquilidad: es madurez, no debilidad)

**Limitaciones actuales**
- **3DoF** en la RA principal: las aves no están ancladas al piso; solo «Tamaño real» (Android) lo hace.
- «Tamaño real» **no funciona en iPhone** (Safari no soporta WebXR).
- Cantos **sintéticos**, no grabaciones.
- **12 de 84** especies en RA; 8 de esas 12 sin foto real en su ficha (la guía solo trae 12 fotos).
- Necesita **internet** para cargar three.js y las fuentes (CDN); una vez cargada corre en el celular.
- La libreta vive **en el dispositivo** (no se sincroniza).
- El campus de la cinemática es una **interpretación low-poly** basada en fotos y mapas; no es un escaneo ni una réplica exacta.

**Trabajo futuro (por si preguntan «¿y ahora qué?»)** (los extras que ya pensamos y dejamos en pausa)
- Servir three.js **desde el mismo sitio** para que funcione sin depender del Wi-Fi.
- **Grabaciones reales** de cantos con su crédito (por ejemplo, de Xeno-canto o WikiAves con permiso).
- Más especies, fotos y fichas; quiz con fotos reales del campus.
- Aves **ancladas al mundo** (6DoF) también en iPhone si algún día Safari soporta WebXR.
- Modo de **jornada**: reporte para científicos ciudadanos (compartir avistamientos).
- Versión para **visor de RV** con la cinemática.

---

## 11. Preguntas probables del profesor (con respuesta modelo)

**1. ¿Qué es lo que hicieron?**
Una página web de Realidad Aumentada que sirve como guía de avistamiento de las aves del campus de la UAO. Con el celular ves aves 3D en tu entorno, las puedes llamar, fotografiar, alimentar, y hay un quiz y un recorrido 3D por el campus.

**2. ¿Por qué web y no una app?**
Porque se abre con un enlace, funciona en Android y en iPhone sin instalar nada y se actualiza al instante. Con Unity habría que compilar una app por plataforma. A cambio, la web tiene límites (por ejemplo, WebXR solo en Android).

**3. ¿Cómo sabe la app hacia dónde mira el celular?**
Usa los sensores de movimiento (giroscopio y brújula) a través del evento `deviceorientation`. Convertimos esos ángulos en una rotación (un cuaternión) y movemos una cámara virtual igual. El video de la cámara real va detrás y la escena 3D, con fondo transparente, va encima.

**4. ¿Es realmente RA si las aves no están ancladas al piso?**
Es una RA de **3 grados de libertad** (basada en orientación): superpone objetos virtuales al video real y reacciona a hacia dónde miras. No detecta superficies. Para eso ofrecemos «Tamaño real» con WebXR, que sí detecta el piso (6DoF), pero solo en Android compatible.

**5. ¿De dónde salen los modelos 3D?**
Los construimos **con código** a partir de formas básicas (esferas, conos, cajas) con three.js, siguiendo los colores y rasgos de la guía. Así pesan casi nada y podemos animarlos fácilmente. Mantienen un estilo low-poly.

**6. ¿Qué es three.js y qué es WebGL?**
WebGL es lo que permite al navegador usar la tarjeta gráfica para dibujar 3D. three.js es una librería de JavaScript que simplifica mucho usar WebGL: escena, cámara, mallas, luces, etc.

**7. ¿De dónde sale la información de las aves?**
De la *Guía ilustrada de las aves del campus de la UAO* (2023, Escuela de Turismo, autores Germán Morales Zúñiga y Natalia Lenis Sánchez) y de WikiAves. Respetamos sus textos y damos los créditos en el pie de la página.

**7b. ¿Por qué solo 12 aves en RA?**
Cada ave en RA requiere modelado, colores, comportamientos, marcas de identificación y preguntas. Elegimos 12 representativas; la guía completa de 84 está en la página. Se pueden agregar más.

**8. ¿Por qué los sonidos no son grabaciones?**
Las grabaciones reales tienen licencias y exigen crédito por grabación. Para garantizar que todo fuera legal y liviano, recreamos el patrón de cada canto con **síntesis de audio** (Web Audio API) y enlazamos a WikiAves para escuchar los reales.

**9. ¿Cómo funciona el quiz?**
Hay un banco de 59 preguntas (aves, ecología y entorno UAO). En cada partida salen hasta 20, mezcladas y sin repetir. Se responde tocando el ave, una tarjeta 3D o un alimento 3D. Tienes 2 vidas; con 10 aciertos ganas la insignia «Guardián». El mejor puntaje queda en tu libreta.

**10. ¿Dónde se guardan los datos del usuario?**
En el `localStorage` del navegador, en el propio celular. No hay servidor, cuentas ni base de datos; por eso la cámara y las fotos **no se envían a ningún sitio**.

**11. ¿Cómo evitaron que las aves se crucen o se vean mal?**
Cada ave tiene un soporte que ocupa un círculo en el suelo. Antes de ubicarla, el código busca un lugar libre (sin pisar el camino, la fuente, otras aves) y, si no cabe, prueba otras distancias. Lo probamos repartiendo cientos de veces sin cruces.

**12. ¿Cómo hicieron que corra bien en un celular?**
Pocos polígonos (low-poly), **instanciado** (muchas copias en una sola orden de dibujo), **fusión de mallas** (de 675 a unas 117 órdenes de dibujo), resolución de pantalla limitada y cancelar procesos pendientes cuando se cambia de modo.

**13. ¿Qué es la «Cinemática»?**
Un recorrido 3D de unos 108 segundos por el campus (Portería 1, Arco Central, Ágora, aulas, lago, cafetería, Portería 3…) con aves volando. Se puede mirar alrededor arrastrando o moviendo el celular, acelerar (×2, ×4) o saltar. Se hizo con las fotos y mapas reales del campus y se vuelve a la RA donde se estaba.

**14. ¿Por qué la cinemática no es un video?**
Porque así no pesa, es interactiva (miras 360°) y mantiene el mismo estilo de la RA. Además se calcula en vivo.

**15. ¿Qué relación tiene con Fundamentos de Realidad Virtual?**
Aplica los conceptos de la materia: escena 3D y cámara, tracking (3DoF con IMU y 6DoF con WebXR), interacción (raycasting, mirada, toque), audio espacial, inmersión/presencia, y optimización de rendimiento. La cinemática es una experiencia virtual inmersiva y podría llevarse a un visor con WebXR.

**16. ¿Qué dificultades tuvieron?**
Rendimiento en celulares, que los textos y etiquetas no se salieran de la pantalla en distintos tamaños, que las aves no se cruzaran, y las diferencias entre iPhone y Android (permisos, WebXR). También reproducir fielmente el campus (norte/sur, niveles, Ágora, rampas) usando fotos y mapas.

**17. ¿Qué mejorarían?**
Grabaciones reales de cantos con crédito, más especies y fotos, funcionar sin internet (servir three.js localmente), anclaje de aves al mundo en más dispositivos y una versión para visor de RV.

**18. ¿Funciona sin internet?**
La primera carga necesita internet (traemos three.js y las fuentes de un CDN). Ya cargada, corre en el celular, pero no hay modo offline completo todavía.

**19. ¿Cómo se publica?**
Con Git y GitHub: cada vez que se sube un cambio (`push`), una acción automática (GitHub Actions) publica la carpeta `wwwroot` en GitHub Pages, con HTTPS. HTTPS es obligatorio para poder usar cámara y sensores.

**20. ¿Por qué solo funciona con HTTPS?**
Por seguridad: los navegadores solo dan acceso a cámara y sensores de movimiento a páginas seguras.

**21. ¿Quién hizo qué? ¿Lo hizo una IA?**
Ver sección 9. Respuesta corta: usamos una IA como asistente de programación; el equipo decidió, aportó el material del campus, probó en celulares reales y corrigió; y sabemos explicar cómo funciona.

**22. ¿Qué es un cuaternión y por qué no ángulos normales?**
Es una forma de representar una rotación en 3D con cuatro números. Evita el «bloqueo de cardán» (perder un grado de libertad cuando dos ejes se alinean) y permite interpolar rotaciones suavemente (`slerp`). Por eso la cámara usa cuaterniones.

**23. ¿Qué es el raycasting?**
Lanzar un rayo invisible desde la cámara por el punto tocado en la pantalla y ver qué objeto 3D atraviesa primero; así sabemos si tocaste un ave.

**24. ¿Qué es un loop de animación?**
Una función que se repite unas 60 veces por segundo; en cada repetición se lee el sensor, se mueven los objetos y se vuelve a dibujar la escena.

**25. ¿Cuántas líneas de código tiene?**
Unas 4.200 líneas entre HTML, CSS y JavaScript; el archivo más grande es el motor RA (`ra.js`, ~1.100 líneas).

---

## 12. Guion de demostración (3 minutos) y plan B

**Antes de empezar:** abre el enlace en el celular y acepta cámara y movimiento. Ten el computador abierto con la página como respaldo (muestra el campus simulado).

1. **(20 s)** Portada: «Aves UAO». Menciona la guía de 84 especies y la libreta.
2. **(40 s)** Entra a la RA → **Avistar**: mueve el celular, toca un ave y se abre su ficha; muestra el registro en la libreta.
3. **(20 s)** **Binoculares**: zoom y marcas de identificación.
4. **(20 s)** **Llamar**: elige un canto y el ave llega volando.
5. **(20 s)** **Foto**: tomas una foto de campo con la fecha.
6. **(30 s)** **Quiz**: responde una pregunta tocando un ave o una tarjeta (menciona las 2 vidas y el «Guardián»).
7. **(30 s)** **Cinemática**: «un recorrido 3D por el campus»; arrastra para mirar; usa ×2 y luego «Saltar».

**Plan B:** si falla el Wi-Fi, usa datos móviles; si falla la cámara, el **modo simulado** funciona en cualquier computador (arrastrar para mirar). Si algo se queda congelado, recargar con Ctrl+Shift+R.

---

## 13. Datos para memorizar

- **84** especies, **30** familias, **77** géneros en la guía; monitoreos desde **2019**.
- **12** aves en RA; **49** fichas con texto; **12** fotos reales de la guía.
- **7** interacciones RA (6 en cualquier celular + «Tamaño real» en Android); mínimo pedido: **5**.
- **59** preguntas en el banco del quiz; **20** por partida; **2** vidas; **10** aciertos = «Guardián».
- **three.js 0.160**; ~**4.200** líneas de código; ~**108 s** dura la cinemática.
- Datos del campus (infografía «Campus Sostenible en cifras»): **45,5 %** zonas verdes; **1.632** paneles solares; fundada en **1970**.

---

## 14. Cosas que NO debes afirmar

- Que los **cantos son grabaciones reales** (son sintetizados).
- Que **las aves están ancladas al piso** en la RA normal (solo en «Tamaño real»).
- Que funciona **«Tamaño real» en iPhone** (no).
- Que el campus de la cinemática es **una réplica exacta** (es una interpretación low-poly basada en fotos y mapas).
- Que se probó en **todos** los celulares (se probó en Android e iPhone por el equipo; la cinemática falta confirmarla en un celular real si aún no se ha hecho).
- Que los datos de aves **«los hicimos nosotros»**: son de la guía de la UAO (crédito a la Escuela de Turismo).
