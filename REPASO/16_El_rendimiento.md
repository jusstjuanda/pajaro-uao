# 16 · El rendimiento: por qué corre bien en un celular

## Resumen en 1 minuto
Un celular tiene mucha menos potencia gráfica que un computador gamer, y la RA además tiene la **cámara encendida**. Si la app dibuja demasiado, **va a tirones** o se calienta. Por eso se cuidó: pocos polígonos (**low-poly**), **reutilizar** formas y materiales, **fusionar** muchas piezas en una, **instanciar** copias, limitar la **resolución** y la **cantidad de aves**, y **limpiar** lo que ya no se usa. Resultado: de **675 órdenes de dibujo a unas 117** en la escena de la RA, y una cinemática de ~200 mil triángulos por vista que corre fluida.

---

## 1. Qué cuesta «caro» en 3D (conceptos)
- **Triángulos:** cuántos tiene que procesar la GPU por cuadro. Más triángulos = más trabajo.
- **Órdenes de dibujo (*draw calls*):** cada vez que three.js le dice a la GPU «dibuja este objeto». Cada orden tiene un **costo fijo** (preparar materiales, posiciones…), aunque el objeto sea pequeño. **Mil objetos pequeños pueden ser más lentos que un solo objeto con mil triángulos.** Por eso importa **agrupar**.
- **Resolución de pantalla:** más píxeles = más trabajo por cuadro (un celular de 3× tiene 9× más píxeles que uno de 1×).
- **Memoria:** texturas y geometrías ocupan memoria; hay que **liberarlas** cuando ya no se usan.
- **Procesador (CPU):** el JavaScript que mueve cosas en cada cuadro; si se hace demasiado trabajo o se crean muchos objetos temporales, se traba.

## 2. Las técnicas usadas (y cuánto ayudaron)

### 2.1 Low-poly
Formas simples con pocas caras (esferas de 22×16, conos de 10 lados). Es **estilo** y es **ahorro**.

### 2.2 Reutilizar (caché de geometrías y materiales)
```js
const geoCache = {};
function geo(key, make) { return geoCache[key] || (geoCache[key] = make()); }
```
Una sola esfera sirve para cientos de piezas de aves; no se recrea cada vez. Igual con los **materiales** (`mat(color)`). Ahorra **memoria** y tiempo de creación.

### 2.3 Fusionar mallas (`fusion.js`)
Un ave tiene ~100 piezas. `fusionar(grupo)` **copia los vértices de todas las piezas quietas dentro de una sola malla**, guardando el **color de cada pieza como «color por vértice»**. Para el celular es **un solo objeto** en vez de decenas.
- **Resultado medido:** de **675** órdenes de dibujo a **~117** en la escena de la RA (con las 12 aves y el campus simulado).
- **Límite:** lo fusionado **ya no se puede mover por partes**. Por eso en las aves se fusionan las piezas **de cada parte** pero **se dejan pivotes sueltos** (cabeza, alas, cola, pico inferior) para animarlos.
- **Un error que se corrigió:** al fusionar mallas **ya fusionadas** los árboles salían **blancos** (se perdía el color por vértice). Se arregló en `fusion.js`.

### 2.4 Instancias (`InstancedMesh`)
«Dibuja **N copias** de esta malla, en estas N posiciones, en **una sola orden**». Se usa en: **ventanas** de todos los edificios, **piedras** del camino, **gotas** de las fuentes, **césped**, **aves volando** de la cinemática, **carros** del parqueadero. Es la técnica que permite tener **cientos de objetos** casi gratis.

### 2.5 Descarte de lo que no se ve
three.js **no dibuja** los objetos que están **fuera del campo de visión** de la cámara (*frustum culling*). Por eso la cinemática pasa de **270** a **100** órdenes de dibujo según hacia dónde mira. (En las mallas instanciadas se desactiva este descarte porque su «caja» no se calcula bien; son pocas.)

### 2.6 Limitar la resolución
```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));          // RA normal: máximo 2
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));        // durante la cinemática: máximo 1,5
```
Un iPhone tiene ratio 3; renderizar a 3× sería muy costoso. Con 2 (o 1,5) **casi no se nota** y se ahorra mucho.

### 2.7 Limitar la cantidad de cosas
- `MAX_AVES = 6` en «Llamar» (si llega una nueva y ya hay 6, la más antigua se va).
- Las aves de la cinemática son **simples** (óvalo + 2 triángulos).
- Las **fotos** de la libreta se limitan a **8**.

### 2.8 Sprites y texturas pequeñas
Las etiquetas son **sprites** (un plano con una textura de 512×128 px). Las texturas se **reutilizan** (el piso de rombos es una imagen de 128×128 px que se repite).

### 2.9 Cuidar el «recolector de basura»
En `mantenerEtiqueta` (que corre en cada cuadro para cada ave) se **reutilizan** unos vectores temporales (`_c`, `_l`, `_der`, `_esc`) en vez de crear nuevos cada vez. Crear objetos 60 veces por segundo hace que JavaScript «limpie memoria» a ratos y se sienten **tirones**.

### 2.10 Liberar memoria (`dispose`)
Cuando se quitan las **tarjetas del quiz** se llama a `dispose()` de sus **texturas y materiales** (liberan memoria de la GPU). Los **temporizadores** pendientes se **cancelan** al cambiar de modo.

### 2.11 Tiempo del cuadro acotado
`dt = Math.min(0.05, delta)`: si la página se pausa o el celular se traba un instante, no se «recupera» con un salto enorme.

### 2.12 Carga de la página
Las imágenes grandes usan `loading="lazy"` (se descargan al acercarse), y se declaran sus **tamaños** para que la página no «salte» al cargar. Las tipografías y three.js vienen de **CDN** (rápidos y cacheados).

## 3. Cómo se midió
Dentro del código hay una **función de prueba** (`window.RA._prueba.rendimiento()`) que dibuja un cuadro y lee **`renderer.info.render.calls`** (órdenes de dibujo) y **`renderer.info.render.triangles`** (triángulos). Con ella se vio, por ejemplo, el paso de 675 a 117, y que la cinemática dibuja ~200 mil triángulos y entre 100 y 270 órdenes, y que el campus real se **construye en ~1,6 s** en un computador.

## 4. Lo que NO se pudo medir
- **Cifras de rendimiento en celular** (FPS, temperatura, batería): **no se midieron con números**. Lo que sí hay es una **prueba funcional**: el equipo probó todo en celulares reales (Android e iPhone), incluida la cinemática, y funciona. Las cifras que damos (órdenes de dibujo, triángulos) se midieron en el computador. Si algún celular fuera lento, hay **perillas** listas: menos árboles, menos resolución, menos aves.

## 5. Compromisos (decisiones de diseño)
| Decisión | Ganamos | Perdimos |
|---|---|---|
| Low-poly | Velocidad y estilo coherente | Realismo |
| Fusión | Menos órdenes de dibujo | No se puede mover cada pieza (se dejan pivotes) |
| Instancias | Cientos de copias casi gratis | Todas las copias comparten forma |
| Resolución ≤ 2 (1,5 en la cinemática) | Fluidez, menos batería | Un poco de nitidez |
| `preserveDrawingBuffer: true` | Poder **fotografiar** el 3D (foto de campo) | Un poco de rendimiento |

## Para decirle al profesor
> «Optimizamos principalmente reduciendo órdenes de dibujo: fusionamos mallas estáticas, usamos instancias para elementos repetidos (ventanas, aves de la cinemática, carros), reutilizamos geometrías y materiales y limitamos la resolución y la cantidad de aves. Medimos con renderer.info: pasamos de 675 a unas 117 órdenes de dibujo en la RA. Probamos todo en celulares reales y funciona fluido; lo que no tenemos son mediciones numéricas de cuadros por segundo.»

## Autoevaluación
1. ¿Qué es una orden de dibujo y por qué importa?
2. ¿Qué hace `fusionar` y qué se pierde al usarlo?
3. ¿Qué son las instancias y dónde las usamos?
4. ¿Por qué limitamos la resolución?
5. ¿Cómo se midió el rendimiento? ¿Qué falta por medir?
