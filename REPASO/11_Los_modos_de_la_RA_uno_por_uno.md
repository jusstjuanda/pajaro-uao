# 11 · Los modos de la RA, uno por uno (y los sistemas que los sostienen)

## Resumen en 1 minuto
Dentro de la RA hay **6 «modos»** (Avistar, Binoculares, Llamar, Comedero, Foto, Quiz) que se eligen con la barra de abajo, más el botón **Cinemática** (que no es un modo) y el modo extra **Tamaño real** (WebXR, solo Android). Todos comparten el mismo «motor»: la cámara, las aves, los toques y los avisos. Cada modo es un **objeto** con tres funciones: **`entrar()`** (prepara la escena), **`salir()`** (limpia) y **`tocar(ave)`** (qué pasa cuando tocas un ave). Cambiar de modo = llamar `salir()` del anterior y `entrar()` del nuevo. Todo está en `js/ra/ra.js`.

---

## 1. El «interruptor» de modos: `MODOS` y `cambiarModo`
```js
const MODOS = {
  avistar:     { titulo: "Avistar",     ayuda: "...", entrar() {...}, tocar(a) {...} },
  binoculares: { titulo: "Binoculares", ayuda: "...", entrar() {...}, salir() {...}, tocar(a) {...} },
  llamar:      { ... }, comedero: { ... }, foto: { ... }, quiz: { ... }
};

export function cambiarModo(m) {
  if (!MODOS[m]) return;
  MODOS[modo]?.salir?.();          // 1. sale del modo actual (si tiene "salir")
  cancelarPendientes();            // 2. cancela todo lo que estaba por pasar (llegadas de aves, etc.)
  modo = m;                        // 3. guarda el nuevo modo
  ...                              // 4. cierra fichas, actualiza el título y el botón activo
  aviso(MODOS[m].ayuda, 3800, m === "quiz");   // 5. muestra la ayuda del modo
  MODOS[m].entrar();               // 6. prepara el nuevo modo
  Sonido.clic();
}
```
Esto se llama **patrón de objeto con interfaz común**: todos los modos «hablan el mismo idioma» (`entrar`, `salir`, `tocar`), así el motor no necesita saber los detalles de cada uno. Agregar un modo nuevo = agregar otro objeto.

## 2. Sistemas compartidos (lo que hace que todo funcione bien)

### 2.1 Las aves en la escena
- Un **mapa** (`aves`) guarda cada ave activa con su objeto 3D, su especie, si está registrada, si está volando y su etiqueta.
- `agregarAve(id, pos, opciones)` crea el ave, la pone en el mundo (`raiz`), la gira para que **mire a la cámara** y le pone **soporte**.
- `quitarAve(a)` la elimina. `limpiarAves()` borra todo y **cancela los temporizadores pendientes**.

### 2.2 Que nada se cruce (colocación inteligente)
Problema que resolvimos: aves o soportes **encimados** o puestos sobre el camino/fuente/bancas del campus simulado.
- Cada soporte ocupa un **círculo en el suelo**; su **radio** se **mide del modelo real** a la escala del ave (`radioSoporte`).
- `cabe(punto, radio, …)` responde: «¿cabe un círculo de este radio en este punto sin pisar el **sendero**, un **obstáculo** del campus (fuente, bancas, farolas), otro **soporte** ni la **comida**?».
- `sitioLibre(punto, radio, …)` **busca** un lugar que sí quepa: prueba girar poquito alrededor del usuario (0, +0,1, −0,1, +0,2… radianes) y, si no hay sitio, **prueba más lejos** (7 distancias).
- Se probó **repartiendo cientos de veces** (480 soportes) sin cruces.

### 2.3 Las etiquetas (los nombres sobre las aves)
- Una etiqueta es un **sprite** (imagen plana que mira a la cámara) dibujado con código: un rectángulo redondeado con el nombre; si el texto es largo, **achica la letra** hasta que quepa.
- `mantenerEtiqueta(a)` corre cada cuadro: calcula dónde cae la etiqueta **en la pantalla** y, **si se saldría del borde**, la **corre hacia adentro** (y si fuera más ancha que la pantalla, la achica). Resuelve el bug de «¡Correcto!» cortado en celulares.
- **Regla del quiz:** en el quiz **no** se ponen etiquetas a las aves registradas (ahí el nombre sería la **respuesta**).

### 2.4 Los avisos
`aviso(texto, ms, abajo)` muestra un cartelito con el texto y lo esconde pasado un tiempo (`ms`). Puede salir arriba o abajo (en el quiz sale abajo para no tapar la pregunta).

### 2.5 El registro en la libreta
`registrarAve(a)` (capítulo 04, sección 17): la **primera vez** que tocas un ave, en cualquier modo **menos el quiz**, se guarda en la libreta y se muestra «¡Garza de ganado registrada!» con su concordancia de género.

### 2.6 La ficha
Al tocar un ave en Avistar o Comedero se abre una **ficha** (`window.FichaRA`, en `app.js`) con su foto (si la hay), nombre, científico, texto de la guía, botón **«Escuchar»** y enlace a **WikiAves**.

## 3. Modo 1: AVISTAR
**Qué hace:** pone las **12 aves a la vez** alrededor de ti. Tú buscas con el celular y las tocas.
- `entrar()`: baraja las 12 especies y las reparte en **dos anillos** (unas a ~3,5 m y otras a ~5,5 m), cada una en un ángulo distinto empezando por el rumbo actual. Las de soporte **más grande** se colocan primero (así caben). Cada una pasa por `sitioLibre` para no cruzarse.
- `tocar(ave)`: **canta** (con sonido y notas musicales), **aletea**, se **registra** y abre su **ficha**.
- Cambio importante hecho: antes salían **6 por vez**; se cambió a las **12 a la vez** (era un punto de tu lista de correcciones).
- El **radar** (círculo de arriba) te indica dónde están.

## 4. Modo 2: BINOCULARES
**Qué hace:** **zoom** y **marcas de identificación**.
- `entrar()`: pone `fovObjetivo = 21` (campo de visión de 21°: ~3 veces más cerca) y agrega la clase `ra-zoom` (el CSS dibuja los **dos círculos de los binoculares**). Si no hay aves, llama a Avistar para tenerlas.
- Mientras tanto, `ciclo()` lanza un rayo desde el **centro** de la pantalla: si apunta a un ave (`apuntada`), `actualizarMarcas()`:
  1. toma las **partes** que la especie declara en `marcas` (cabeza, pico, ala, cola, vientre…),
  2. calcula **en qué píxel de la pantalla** cae cada una (`getWorldPosition` + `project`),
  3. dibuja un **punto** sobre la parte y un **cartel** con el texto al lado (el lado con más espacio), con una línea que los une,
  4. **acomoda los carteles** para que no se pisen entre sí ni con el radar ni se salgan de la pantalla.
- `salir()`: vuelve al zoom normal y borra las marcas.

## 5. Modo 3: LLAMAR
**Qué hace:** eliges un canto y **el ave que lo reconoce viene volando** a responderte.
- `entrar()`: abre un **panel** con 12 botones (uno por especie, con su imagen PNG).
- `llamar(id)`:
  1. suena el canto (sintetizado) y se muestra «Reproduciendo el canto del Bichofué…»,
  2. elige un **destino** a 3 m delante de ti,
  3. **1,1 segundos después** (temporizador con `despues`), si el ave ya estaba en escena **vuela** hasta ahí; si no, **llega volando** desde 9 m (`llegarVolando`) en una dirección al azar a un lado,
  4. al llegar: **mira a la cámara**, **canta** y aparece «¡El Bichofué respondió! Tócalo para registrarlo».
- **Tope `MAX_AVES = 6`:** si ya hay 6 aves y llega otra, la **más antigua** se va volando (`hacerLugar` + `irse`). Así no se llena la pantalla.
- Si tocas el **mismo** canto otra vez antes de que llegue, solo cuenta la **última** vez (se cancela el temporizador anterior).
- El aviso del panel dice que en la vida real reproducir cantos grabados muy seguido puede estresar a las aves (un criterio ético de avistamiento).

## 6. Modo 4: COMEDERO
**Qué hace:** pones un alimento y **llegan las aves que lo comen**.
- `entrar()`: borra las aves y abre un panel con 5 comidas: **flores, frutas, agua, pasto, insectos**.
- `comedero(tipo)`:
  1. **filtra** las especies cuya `comida` incluye ese alimento y **elige 2 al azar**,
  2. `sitioComedero(...)` calcula **dónde poner la comida y a ambos lados dos lugares** para las aves, sin que nada se cruce,
  3. `crearComida(tipo)` **construye** el alimento en 3D con formas básicas (tallos y corolas de flores, un plato con frutas de colores, una pila de agua, un círculo de pasto con hojitas, un palo con insectos que **vuelan alrededor** por animación),
  4. **0,9 s y 2,2 s después** llegan las dos aves volando y cantan,
  5. se muestra un aviso **educativo** («Las flores ofrecen néctar: llegan Colibrí colirrufo y Periquito bronceado»).
- Enseña la relación **ave ↔ alimento**, que luego se evalúa en el quiz.

## 7. Modo 5: FOTO
**Qué hace:** encuadras y tomas una **foto de campo**.
- `entrar()`: muestra el **botón obturador** (círculo blanco grande).
- `tomarFoto()` (capítulo 09, sección 11): compone el cuadro del video + el 3D + una franja con «Aves UAO - Aves del campus» y la fecha; la guarda como JPG en la libreta (**máximo 8**: las más recientes) y muestra «¡Foto guardada!» con un enlace **«Descargar»**. Suena el **obturador**, un **destello** blanco cubre la pantalla y las aves **aletean**.
- **Bug resuelto (reportado por Sebastián):** en fotos **verticales**, el título y la fecha se **pegaban**. Ahora el tamaño de letra sale del **ancho** y, si no caben en una línea, la fecha pasa a una **segunda línea**.

## 8. Modo 6: QUIZ
Tiene su propio capítulo: **12 · El quiz**.

## 9. Modo extra: TAMAÑO REAL (WebXR)
Ver capítulo 09, sección 12. Solo Android con ARCore. Al salir de la sesión, la RA se cierra.

## 10. El botón CINEMÁTICA
No es un modo. Lo explica el capítulo 15. En resumen: **pausa** la RA (esconde aves, campus simulado e interfaz), reproduce el recorrido y, al terminar o «Saltar», **restaura todo igual** (los temporizadores que quedaron pendientes se ejecutan al volver). En el quiz está **atenuado** a propósito.

## 11. La barra de arriba
- **✕** → salir de la RA (apaga la cámara, limpia todo, vuelve a la página).
- **Título** del modo y **estado** («Cámara + giroscopio», «Modo simulado: arrastra para mirar»).
- **⟲** → «volver a ubicar las aves frente a mí»: reinicia el rumbo y vuelve a entrar al modo actual.

## 12. Cómo se «limpia» y por qué no hay aves fantasma
Problema típico en aplicaciones con retrasos: tocas un canto, cambias de modo, y **llega un ave** igual. Solución: `despues()` anota cada temporizador; `cambiarModo` y `limpiarAves` los **cancelan** todos (`cancelarPendientes`). Además, en el quiz las **opciones 3D** (tarjetas) se **desechan** (se libera su memoria con `dispose`) al cambiar de pregunta.

## Para decirle al profesor
> «Cada modo es un objeto con tres funciones comunes —entrar, salir y tocar— y un cambiador central que limpia el estado anterior y cancela los procesos pendientes. Los modos comparten sistemas: colocación sin solapamientos mediante un círculo de ocupación por soporte, etiquetas que se mantienen dentro de la pantalla, avisos y registro en la libreta. Eso hizo fácil añadir modos y evitar aves fantasma.»

## Autoevaluación
1. ¿Qué tienen en común todos los modos (qué tres funciones)?
2. ¿Qué hace `cambiarModo` paso a paso?
3. ¿Cómo evitamos que las aves se cruzan?
4. ¿Cómo funcionan las marcas de los binoculares?
5. ¿Qué pasa cuando tocas un canto en «Llamar»? ¿Y cuántas aves puede haber?
6. ¿Cómo se arma la foto de campo?
7. ¿Por qué el modo quiz no pone nombres a las aves?
