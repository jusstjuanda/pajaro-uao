# 07 · Cómo se hicieron las aves (los «modelos» son código)

## Resumen en 1 minuto
Las aves **no son archivos 3D** descargados, ni dibujos, ni *sprites*. Cada ave se **construye con código** cada vez que aparece: se arma como una **figura de plastilina** con bolitas aplastadas (esferas con escala distinta), conos (picos), cilindros (patas) y piezas planas (alas, cola). Los **colores y rasgos** de cada especie vienen de una ficha de datos (`especies-ra.js`) que sigue la guía de la UAO. La técnica se llama **modelado procedural** (modelar con instrucciones en vez de con un programa de dibujo 3D). Todo el código de las aves está en **`js/ra/aves3d.js`** (≈440 líneas).

> **«¿De dónde salieron los modelos?»** De **código**. No hay archivos `.glb`, `.obj` ni imágenes de aves en la RA. La única imagen «prehecha» de aves son 12 PNG que usa la **libreta** (explicado abajo) y que salieron de fotografiar nuestros propios modelos 3D.

---

## 1. Dos maneras de hacer un modelo 3D (y por qué elegimos la segunda)
| | **Modelado clásico** | **Modelado por código (el nuestro)** |
|---|---|---|
| Cómo | Esculpes en un programa (Blender, Maya) y exportas un archivo (`.glb`) | Escribes instrucciones que **arman** el objeto con formas básicas |
| Pros | Muy realista | Pesa casi **0 KB**, carga instantáneo, cambias colores y animaciones **con una línea**, estilo coherente |
| Contras | Hay que modelar y animar cada ave a mano (12 aves = mucho trabajo y archivos pesados) | Menos realista (estilo **low-poly**) |
| Para este proyecto | Habría sido lento y pesado en celular | Perfecto: 12 aves en pantalla a la vez y a 60 FPS |

## 2. La ficha de cada ave (`especies-ra.js`)
Cada ave es un **objeto de datos**. Ejemplo (Bichofué):
```js
{
  id: "bichofue", nombre: "Bichofué", cientifico: "Pitangus sulphuratus", canto: "bichofue",
  comida: ["insectos", "agua", "frutas"],
  tipo: "posado", soporte: "rama", escala: 0.42, pico: "fino",
  colores: { espalda: "#8A6A3A", vientre: "#F6CF1E", cabeza: "#1D1B1A", ala: "#9C7240", cola: "#7A5A30", pico: "#1A1A1A", patas: "#2b2b2b" },
  extras: { ceja: "#FFFFFF", garganta: "#FFFFFF", corona: "#F6CF1E", puntaAla: "#C99A58" },
  marcas: [["cabeza", "Cabeza negra con ceja blanca"], ["vientre", "Vientre amarillo radiante"], ["ala", "Alas con bordes rojizos"]],
  pistas: ["Su nombre imita su llamado fuerte, ...", "Come de todo: ...", "Vientre amarillo y cabeza negra con ceja blanca"]
}
```
Qué significa cada campo:
- `id` → nombre interno único. `nombre`/`cientifico` → lo que se ve en pantalla.
- `canto` → cuál **canto sintetizado** suena (capítulo 10).
- `comida` → qué le gusta (lo usa el **comedero**).
- `tipo` → una «plantilla» de cuerpo (`posado`, `pellar` de patas largas, `garza`, `colibri`, `carpintero`, `loro`).
- `soporte` → sobre qué se posa: `rama`, `pasto`, `agua`, `flor` o `tronco`.
- `escala` → su tamaño relativo (0,36–0,42).
- `pico` → la forma del pico (`fino`, `conico`, `cincel`, `gancho`, `largo`, `daga`, `curvo`).
- `colores` → los colores base de cada parte (en hexadecimal).
- `extras` → rasgos distintivos: `ceja`, `garganta`, `corona`, `nuca`, `copete`, `antifaz`, `cara`, `hombro`, `puntaAla`, `colaForma`, `barras`.
- `marcas` → qué partes señalan los **binoculares** y con qué texto.
- `pistas` → frases que usa el **quiz** («¿Quién es?»).

**Idea de diseño importante:** los **datos están separados del código**. `aves3d.js` no sabe de «bichofué»: sabe construir *cualquier* ave a partir de una ficha. Para agregar una ave nueva solo se escribe una ficha nueva (y, si hace falta, un tipo de pico). Esto se llama **diseño guiado por datos** (*data-driven*).

## 3. Los ejes del ave
Del comentario al inicio de `aves3d.js`: *«el ave mira hacia +Z, arriba es +Y; el origen es el punto donde se posa»*. Eso permite poner un ave **en cualquier punto** (su «pie» queda ahí) y girarla para que mire a la cámara.

## 4. Las herramientas básicas del archivo
```js
const esfera = () => geo("esfera", () => new THREE.SphereGeometry(0.5, 22, 16));
const cono   = () => geo("cono",   () => new THREE.ConeGeometry(0.5, 1, 10));
const cil    = () => geo("cil",    () => new THREE.CylinderGeometry(0.5, 0.5, 1, 10));
const caja   = () => geo("caja",   () => new THREE.BoxGeometry(1, 1, 1));

function pieza(geometria, material, pos, escala, rot) {
  const m = new THREE.Mesh(geometria, material);
  if (pos) m.position.set(...pos);
  if (escala) m.scale.set(...escala);
  if (rot) m.rotation.set(...rot);
  return m;
}
```
- Las **formas base** son de tamaño 1 (radio 0,5). `geo(...)` las **guarda en memoria** (*caché*) para no recrearlas: una sola esfera sirve para cientos de piezas (ahorra memoria).
- `mat(color)` hace lo mismo con los materiales.
- **`pieza(forma, material, posición, escala, rotación)`** es la «fábrica» de piezas: una frase como `pieza(esfera(), mat("#F6CF1E"), [0,0,0], [0.85, 0.9, 1.25])` = «una esfera amarilla, estirada 0,85 de ancho, 0,9 de alto y 1,25 de largo».
- `tono(color, k)` crea un tono **más claro o más oscuro** del mismo color (para dar variación a las plumas).

## 5. El ave, pieza por pieza (la receta)
La función `crearAve(e)` arma el ave **en este orden** (cada paso es una pieza real del código):

### 5.1 La «cadena» de grupos
```
raiz (Group)  ← lo que se mueve por el mundo; lleva la escala del ave
  └─ ave (Group)  ← se anima (saltos, vuelo estacionario del colibrí)
       └─ cuerpo (Group)  ← inclinado; contiene casi todo
            ├─ espalda y vientre (dos esferas)
            ├─ plumaje del pecho (20 escamitas)
            ├─ cabezaPivote → cabeza (esfera + extras + ojos + pico)
            ├─ ala izquierda, ala derecha (cada una con pivote)
            └─ colaPivote → cola
       └─ patas y dedos (cilindros)
  └─ soporte (rama, pasto…)  ← en la RA va aparte
  └─ zona (esfera invisible para tocar)
```
Cada «pivote» es un punto de giro: **si giras el pivote del ala, el ala se abre como una bisagra**; si giras el de la cabeza, la cabeza mira a un lado.

### 5.2 El cuerpo: dos óvalos
```js
cuerpo.add(pieza(esfera(), espalda, [0,0,0], escalaCuerpo));              // óvalo de arriba (color de espalda)
cuerpo.add(pieza(esfera(), mat(c.vientre), [0,-0.1,0.1], escalaCuerpo × 0.9, 0.85, 0.85)); // óvalo de abajo (color de vientre)
```
Dos esferas **solapadas**, una más pequeña y más abajo: así el ave tiene espalda de un color y **vientre de otro** (el bichofué: espalda parda, vientre amarillo).
- Hay **ajustes por tipo**: la garza tiene `alturaCuerpo` 1,4 (zancuda) y poca inclinación; el colibrí es pequeño; el carpintero está casi vertical (se agarra a troncos); el loro tiene cabeza grande.

### 5.3 El plumaje del pecho (un detalle matemático)
Para que el pecho se vea con **escamitas** (plumas), se colocan 4 filas × 5 columnas de esferas muy achatadas **sobre la superficie del cuerpo**, cada una **inclinada para acostarse sobre la curva**. Eso usa un poco de trigonometría (seno/coseno para ubicar el punto en la «bola» y un `setFromUnitVectors` para girar la escama hacia afuera). No es necesario entender la fórmula: la idea es **«repartir escamitas sobre una superficie curva»**.

### 5.4 La cabeza, los ojos y el pico
- Cabeza = esfera de radio 0,34 (más grande en el loro, más pequeña en la garza).
- Rasgos opcionales de `extras`: `ceja` (dos óvalos blancos), `garganta`, `corona`, `nuca`, `antifaz`, `cara`, `copete` (un cono echado hacia atrás: el copete del pellar).
- **Ojos**: tres esferas por ojo → un **aro claro**, la **pupila oscura** y un **brillito blanco** (con `emissive`, que «brilla solo»). Ese brillito es lo que les da «vida».
- **Pico** (`pico(tipo, color)`): dos partes (superior e inferior, para poder **abrirlo al cantar**), formadas con **conos** estirados. Los tipos cambian solo las medidas: `largo` (largo 0,75, fino) para el colibrí, `cincel` (corto y recto) para el carpintero, `curvo` para el garrapatero, `daga` para la garza y `gancho` (un arco, con `TorusGeometry`) para el loro y el periquito. Se añaden dos **fosas nasales** (esferitas negras).

### 5.5 El cuello largo de la garza (una curva)
```js
const curva = new THREE.CatmullRomCurve3([[0,0.05,0.38],[0,0.4,0.62],[0,0.78,0.5],[0,1.08,0.6],[0,1.25,0.72]].map(p => new THREE.Vector3(...p)));
const cuello = new THREE.Mesh(new THREE.TubeGeometry(curva, 20, 0.1, 7, false), blanco);
```
Una **curva suave por 5 puntos** y un **tubo** de 10 cm de radio que la recorre: el cuello en «S» de la garza.

### 5.6 Las alas
Cada ala es: una esfera aplastada (el ala), otra para la punta, `hombro` opcional, **3 hileras de coberteras** (plumas pequeñas) y **5 plumas primarias** en abanico. Se crean con **un pivote**: la `forma` va dentro y el pivote se coloca en el hombro. La del lado derecho es **espejo** de la izquierda (`lado = ±1`).

### 5.7 La cola
Un **abanico** de 5–7 esferas aplastadas con colores ligeramente distintos (`tono(...)`), o dos planchas (`horquilla` para el sirirí). La longitud varía: `larga` (1,3) para el garrapatero, `corta` (0,45) para el loro cabeciazul.

### 5.8 Patas y dedos
Un cilindro delgado por pata + 3 dedos delanteros y 1 trasero (cilindros girados). El pellar y la garza tienen patas **largas** (1,0 y 1,25).

### 5.9 Optimización: «fusionar»
Cada ave está hecha de **unas 100 piezas**. Dibujarlas todas por separado cansaría al celular. Por eso el código **fusiona** las piezas *quietas* de cada parte (`fusionar(cuerpo, { profundo: false … })`) en **una sola malla por parte**. Sigue habiendo pivotes separados (cabeza, alas, cola, pico inferior) para **poder animarlos**. Resultado: el total de «órdenes de dibujo» de la escena bajó de **675 a unas 117** (capítulo 16).

### 5.10 La zona de toque
```js
const zona = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
```
Una **esfera invisible** (opacidad 0) alrededor del ave. Es lo que «choca» con el rayo del toque (capítulo 09). Así tocar *cerca* del ave también cuenta, no hace falta acertarle a un pico.

### 5.11 La «mochila» de referencias (`userData`)
Al final, el ave guarda sus partes en `raiz.userData = { cuerpo, cabeza, pico, alas, cola, zona, … }` junto con **contadores de tiempo** (`cantarHasta`, `aletearHasta`…). La función de animación (capítulo 08) usa esa mochila para mover cada parte.

## 6. Los soportes (rama, pasto, agua, flor, tronco)
Cada ave se posa en algo, también hecho con formas básicas:
- **Rama**: cilindro horizontal + una ramita inclinada + 4 **icosaedros verdes** (hojas).
- **Pasto**: disco verde + 26 conos delgados (hojas de pasto) repartidos con `cos`/`sin`.
- **Agua**: orilla de barro, disco azul, dos **anillos** finos (ondas) y juncos (cilindros).
- **Flor**: tallo, un cono invertido y 5 pétalos (esferas), centro amarillo.
- **Tronco**: cilindro grueso con «grietas» (cajitas) y una rama con hoja.

Importante: en la RA **el soporte es un objeto aparte** del ave (así, cuando el ave se va volando, el soporte se queda y se desvanece; no viaja con ella).

## 7. Dónde salieron los colores y los rasgos
De la **Guía ilustrada de las aves del campus UAO** y de fotos de referencia: el bichofué es «de cabeza negra con ceja blanca, vientre amarillo»; el pellar tiene «pecho negro, copete y patas rosadas»; el carpintero habado tiene «espalda barrada y nuca roja»… Las marcas de identificación y las pistas del quiz se redactaron con esa información. Los colores en hexadecimal son una **interpretación artística** (low-poly), no una copia exacta.

## 8. Las 12 imágenes PNG de la libreta (¿son «sprites»?)
En la sección **«Mi libreta»** de la página (fuera de la RA) se ven 12 imágenes de aves. Esas **sí son archivos de imagen** (`img/aves/bichofue.png`, etc.): **renders** de 360×360 píxeles con fondo transparente. Se obtuvieron así: con una página temporal se mostró cada ave 3D y se **guardó una captura** en PNG. Se hizo para que la libreta pueda mostrar las aves **sin cargar el 3D**. Si cambias un modelo, habría que **regenerar** esa imagen. (La página temporal se borró; por eso hay `galeria3d.html`, que muestra las 12 aves girando.)

## 9. «¿Y las animaciones? ¿Dónde están los sprites o los archivos?»
- **No hay archivos de animación.** Las animaciones son **cálculos** que cambian posiciones y giros 60 veces por segundo (capítulo 08).
- **No hay «sprite sheets»** (tiras de dibujos). Los *sprites* que sí hay son solo **etiquetas de texto**, tarjetas del quiz y notas musicales (planos 2D dibujados con canvas que siempre miran a la cámara).
- Todo lo de las aves (**forma, color, animación, soporte**) está en `aves3d.js` y `especies-ra.js`.

## 10. ¿De dónde sale este conocimiento?
Honestidad útil para la sustentación: estas técnicas (modelado procedural, jerarquías de objetos, pivotes para animar, instancias, fusión) son **conocimiento general de gráficas 3D**, están en la **documentación de three.js** (threejs.org) y en tutoriales; la **IA** las aplicó para armar las aves siguiendo las referencias que tú aportaste. En la materia no se enseñó este nivel; lo importante es que ahora puedes **explicar la idea**: *«cada ave es un conjunto de formas básicas con una jerarquía de pivotes, hechas por código a partir de una ficha de datos»*.

## 11. Experimento para «tocar» un ave (inofensivo)
1. Abre `PaginaPajaro/wwwroot/js/especies-ra.js`.
2. En el bichofué, cambia `vientre: "#F6CF1E"` por `vientre: "#E4673E"`.
3. Recarga la RA: el bichofué ahora tiene **vientre coral**.
4. Devuélvelo (o descarta cambios en GitHub Desktop).
Eso demuestra que **el aspecto sale de la ficha de datos**, no de un archivo 3D.

## Para decirle al profesor
> «Los modelos son procedurales: cada ave se construye en tiempo de ejecución con formas básicas de three.js (esferas escaladas, conos, cilindros) organizadas en una jerarquía de grupos con pivotes. Los colores y rasgos vienen de una ficha de datos basada en la guía de la UAO, así que añadir una especie es añadir una ficha. Fusionamos las piezas estáticas para reducir el costo de dibujo y mantenemos pivotes sueltos para animar cabeza, alas, cola y pico.»

## Autoevaluación
1. ¿Por qué no usamos modelos de Blender? ¿Qué ganamos y qué perdimos?
2. ¿Qué es el modelado procedural?
3. ¿Qué campos tiene la ficha de un ave y para qué sirve cada uno?
4. ¿Qué es un pivote y por qué las alas lo necesitan?
5. ¿Por qué se «fusionan» las piezas y qué se deja sin fusionar?
6. ¿Para qué sirve la «zona» invisible?
7. ¿Son sprites las aves? ¿Qué sí son sprites?
8. ¿Qué son las 12 imágenes PNG de la libreta y cómo se hicieron?
