# 09 · Cómo funciona la Realidad Aumentada (el corazón del proyecto)

## Resumen en 1 minuto
La RA de tu app son **tres capas apiladas**: (1) abajo, un `<video>` con lo que ve la **cámara trasera** del celular; (2) encima, un `<canvas>` **transparente** donde three.js dibuja las aves en 3D; (3) encima de todo, los botones. Para que las aves **parezcan estar ahí afuera**, una **cámara virtual** gira igual que tu celular, usando los datos del **giroscopio y la brújula**. Es una RA de **3 grados de libertad** (sabe hacia dónde miras, no cuánto caminas). Si el celular no tiene cámara (o estás en un computador), se usa un **campus simulado** de fondo. Y en Android compatible hay un modo extra con **WebXR** que sí detecta el piso.

---

## 1. Qué es la RA (y en qué se diferencia de la RV)
- **Realidad Virtual (RV):** todo lo que ves es virtual (con un visor tipo Quest). Estás «dentro» de otro mundo.
- **Realidad Aumentada (RA):** ves **tu mundo real** y se le **añaden** objetos virtuales.
- **Continuo de Milgram:** una línea con lo **real** en un extremo y lo **virtual** en el otro. La RA queda del lado de lo real; la RV, del lado virtual; en medio, la «realidad mixta».
- En tu proyecto: la experiencia principal es **RA**; la **cinemática** es una experiencia **virtual** (un recorrido 3D por un campus recreado).

## 2. Las tres capas (la «magia»)
```
┌────────────────────────────────────────┐
│  CAPA 3: la interfaz (botones, radar)  │  ← HTML + CSS
├────────────────────────────────────────┤
│  CAPA 2: <canvas> transparente         │  ← three.js dibuja las aves (alpha: true)
├────────────────────────────────────────┤
│  CAPA 1: <video> de la cámara          │  ← lo que ve el celular (getUserMedia)
└────────────────────────────────────────┘
```
Como la capa 2 es **transparente donde no hay aves**, el video se ve «a través» y las aves parecen flotar en tu entorno. No hay ningún truco de «reconocimiento»: es una **superposición**. Lo que hace que parezca real es la **sincronía de movimiento** (siguiente sección).

## 3. Paso 1: pedir la cámara (`getUserMedia`)
```js
navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
```
- `getUserMedia` es una **API del navegador** (una función que el navegador ofrece) que **pide permiso** para usar la cámara y devuelve un **flujo de video** (`stream`).
- `facingMode: "environment"` = **cámara trasera** (la que apunta al entorno).
- Ese flujo se conecta al `<video>`: `video.srcObject = stream;`.
- **Solo funciona en HTTPS** y si el usuario acepta. Si lo rechaza (o no hay cámara), el código **no se rompe**: entra al **modo simulado**.

## 4. Paso 2: saber hacia dónde apunta el celular (el giroscopio)
Los celulares tienen sensores de movimiento. El navegador los entrega con el evento **`deviceorientation`**, que da **tres ángulos**:
- `alpha` → rumbo (giro alrededor del eje vertical: tipo **brújula**),
- `beta` → inclinación adelante/atrás,
- `gamma` → inclinación a los lados.

En **iPhone**, hay que **pedir permiso** explícito (`DeviceOrientationEvent.requestPermission()`), y debe hacerse **dentro del toque del usuario**; por eso en `iniciar()` se piden la cámara y el movimiento **al mismo tiempo, justo al tocar el botón**.

### Del dato del sensor a la cámara virtual (`alGirar`)
```js
function alGirar(ev) {
  usandoGiro = true;
  const orient = (screen.orientation ? screen.orientation.angle : window.orientation || 0) * D2R;
  eul.set(ev.beta * D2R, ev.alpha * D2R, -ev.gamma * D2R, "YXZ");   // 1. los tres ángulos → una "orientación"
  qGiro.setFromEuler(eul);                                            // 2. se convierte en un CUATERNIÓN
  qGiro.multiply(q1);                                                 // 3. se corrige: el celular "mira" por su espalda
  qGiro.multiply(q0.setFromAxisAngle(zee, -orient));                  // 4. se corrige si el celular está en horizontal
}
```
y en `ciclo()`: `if (usandoGiro) camera.quaternion.slerp(qGiro, 0.35);`

Qué significa, sin matemáticas:
1. El navegador da tres ángulos sueltos; los **juntamos** en una sola orientación.
2. La guardamos como **cuaternión**: una forma de representar una **rotación 3D** que **no se «traba»** (los ángulos sueltos pueden bloquearse en ciertas posturas, el famoso *gimbal lock*).
3. Las dos multiplicaciones son **correcciones de convención**: los ejes del sensor y los de three.js no coinciden (la cámara del celular «mira» hacia atrás de la pantalla; el celular puede estar en vertical u horizontal).
4. En cada cuadro la **cámara virtual** se acerca a esa orientación con **`slerp`** (interpolación esférica; factor 0,35). Con eso, la cámara **sigue al celular suavemente** y no tiembla con el ruido del sensor.

**Resultado:** cuando giras el celular a la derecha, la **cámara virtual gira a la derecha** en la misma cantidad. Las aves, que están **fijas en el mundo virtual**, parecen estar **quietas en el mundo real** mientras tú giras.

## 5. Paso 3: dónde se ponen las aves
Las aves se colocan **alrededor del usuario**, en coordenadas calculadas con **azimut** (el ángulo alrededor) y **distancia**:
```js
function direccion(az, el, dist) {
  return new THREE.Vector3(Math.sin(az) * Math.cos(el) * dist, Math.sin(el) * dist, -Math.cos(az) * Math.cos(el) * dist);
}
```
«Dame el punto que está a `dist` metros en la dirección `az` (hacia dónde, como una brújula) y `el` (qué tan arriba o abajo)». Con `rumbo()` se sabe hacia dónde miras ahora, y así «Avistar» pone las aves **empezando delante de ti** y repartidas en anillos.

## 6. 3 grados de libertad vs. 6 grados de libertad (¡pregunta de examen!)
- **Grados de libertad (DoF)** = los tipos de movimiento que el sistema **detecta**.
- **3DoF (orientación):** solo **rotaciones**: mirar arriba/abajo, izquierda/derecha, inclinar. **Lo que hace tu RA principal.** Si **caminas**, el sistema no se entera: las aves se «mueven contigo» (siguen a la misma distancia). Por eso las aves están pensadas para verlas **parado**, mirando alrededor.
- **6DoF (orientación + posición):** además detecta **cuánto te desplazas** (adelante/atrás, lados, arriba/abajo). Necesita **entender el espacio** (por la cámara y sensores; esto lo hacen **ARCore** en Android y **ARKit** en iPhone). Tu modo **«Tamaño real»** lo logra con **WebXR**.
- Honestidad útil: **no es «RA de anclaje al mundo»** salvo en «Tamaño real»; es una RA **basada en orientación** (muy usada en visores de estrellas o binoculares virtuales).

## 7. El modo simulado (sin cámara)
Si no hay cámara (computador, permiso negado), la app **no se rompe**: agrega al 3D un **campus simulado** (suelo, caminos, aulas, árboles, fuente, cielo) y se mira **arrastrando** con el dedo o el mouse.
```js
simulado.visible = !usandoCamara;
renderer.setClearColor(0x000000, usandoCamara ? 0 : 1);    // con cámara: fondo transparente; sin cámara: fondo opaco
```
Sirve para (1) **probar** en el computador, (2) **proyectar en el pitch**, (3) que **todos** puedan ver algo aunque no den permisos.

### Cómo se mira con el dedo (sin giroscopio)
```js
arrastre.yaw   -= dx * k;      // arrastrar a los lados → girar a los lados
arrastre.pitch = THREE.MathUtils.clamp(arrastre.pitch - dy * k, -1.2, 1.2);   // arrastrar arriba/abajo → mirar arriba/abajo (con tope)
camera.quaternion.setFromEuler(new THREE.Euler(-arrastre.pitch, -arrastre.yaw, 0, "YXZ"));
```
`k` depende del zoom (si estás con binoculares, el mismo arrastre mueve menos).

## 8. Tocar objetos: el rayo (raycasting)
Cuando tocas la pantalla en el punto `(x, y)`, ¿qué ave tocaste? Se hace así:

```js
function avePorPantalla(x, y) {
  const v = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);   // 1. del píxel → coordenadas "normalizadas" (−1 a 1)
  ray.setFromCamera(v, camera);                                                                       // 2. lanza un rayo desde la cámara por ese punto
  const zonas = [...aves.values()].filter(a => !a.vuelo).map(a => a.obj.userData.zona);              // 3. las "zonas de toque" de las aves posadas
  const hit = ray.intersectObjects(zonas, false)[0];                                                  // 4. ¿con cuál choca primero?
  ...
}
```
**Comparación:** es como apuntar con un **láser** desde tu ojo a través del punto de la pantalla que tocaste: el primer objeto que toca el láser es el que elegiste. Cada ave tiene una **esfera invisible** (la «zona») que el rayo detecta. También se distingue **toque** de **arrastre**: si el dedo se movió más de 12 píxeles, es arrastre (mirar), no toque.

### Apuntar con la retícula (mira del centro)
Aparte del toque, en cada cuadro se lanza **un rayo desde el centro de la pantalla**: si choca con un ave, la **retícula se agranda y se pone ámbar**. Es lo que activa las **marcas de los binoculares**.

## 9. El radar
Un pequeño `<canvas>` 2D dibujado con código (`dibujarRadar`): un círculo con el **cono de visión** (según el FOV) y **puntos** por cada ave (ámbar = no registrada; verde = registrada), girados según `rumbo()`. Te dice **dónde buscar**.

## 10. El zoom de los binoculares
Cambia el **campo de visión (FOV)** de la cámara virtual de 62° a 21°. Para que el **video real** también «se acerque» igual, se le aplica `scale(...)` con una fórmula que usa la tangente del FOV. Así el video y las aves hacen zoom **en sincronía**.

## 11. La foto de campo
Se crea un **canvas 2D**, se dibuja encima **un cuadro del video** (ajustado igual que en pantalla), luego **la imagen del 3D** (`drawImage(renderer.domElement)`), y por último una **franja con el título y la fecha**. Se guarda como **JPG** (`toDataURL`) en la libreta. Es una captura real de lo que ves, no una simulación.

## 12. «Tamaño real» con WebXR
**WebXR** es una API del navegador para **realidad extendida** (RA y RV) con los sensores y la tecnología del celular. En Android con **ARCore** y Chrome:
1. Se pide una sesión **`immersive-ar`** con la función **`hit-test`**.
2. El teléfono **analiza el entorno** y detecta superficies (piso, mesa).
3. Se muestra una **retícula** (un anillo ámbar) sobre la superficie que apuntas.
4. Al tocar, se coloca el ave a **tamaño real** en ese punto, **anclada al mundo**. Puedes **caminar alrededor** (6DoF).
- **No funciona en iPhone**: Safari no soporta WebXR. Por eso el botón solo aparece si `navigator.xr.isSessionSupported("immersive-ar")` dice que sí.
- No se pudo probar sin un Android compatible; se probó el resto del flujo.

## 13. Qué NO usamos (aclaraciones frecuentes)
- **Marcadores / imágenes de referencia** (como AR.js o Vuforia): no hay que imprimir ni apuntar a nada.
- **GPS**: no se usa; las aves no están «georreferenciadas» en el campus real (aparecen alrededor de ti donde estés).
- **Reconocimiento de imagen o de aves**: no hay IA dentro de la app; no «reconoce» el entorno.
- **Servidor**: nada se envía a internet; ni la cámara ni las fotos salen del celular.

## 14. Limitaciones honestas
- Sin 6DoF (salvo «Tamaño real»), las aves no se «quedan» si caminas.
- El **giroscopio** puede derivar o necesitar calibración en algunos celulares.
- **iPhone** necesita permiso explícito y **no tiene WebXR**.
- En **computador** no hay giroscopio: se usa el arrastre.

## Para decirle al profesor
> «La RA superpone un canvas 3D transparente a un video de la cámara trasera, obtenido con getUserMedia. La orientación del celular se lee con el evento deviceorientation y se convierte en un cuaternión que mueve una cámara virtual en el origen; así las aves parecen fijas en el entorno. Es una RA de 3 grados de libertad. Para 6DoF ofrecemos «Tamaño real» con WebXR y hit-test, que depende de ARCore y por tanto solo está en Android compatible. Los toques se resuelven con raycasting contra esferas invisibles alrededor de cada ave.»

## Autoevaluación
1. Describe las tres capas de la RA.
2. ¿Qué API usamos para la cámara? ¿Y para saber hacia dónde apunta el celular?
3. ¿Qué es un cuaternión y por qué se usa?
4. ¿Qué diferencia hay entre 3DoF y 6DoF? ¿Cuál es tu RA principal y cuál es «Tamaño real»?
5. ¿Cómo sabe la app qué ave tocaste?
6. ¿Qué pasa si no hay cámara?
7. ¿Por qué «Tamaño real» no funciona en iPhone?
8. ¿Qué cosas NO hace la app (marcadores, GPS, IA)?
