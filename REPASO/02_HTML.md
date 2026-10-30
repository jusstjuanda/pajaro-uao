# 02 · HTML: el esqueleto de la página

## Resumen en 1 minuto
**HTML** (HyperText Markup Language) es un lenguaje para **describir qué hay en una página**: títulos, párrafos, botones, imágenes, secciones. No «hace» nada por sí mismo (no calcula, no se mueve); solo **marca** el contenido con **etiquetas**. El archivo `index.html` es el esqueleto de toda la web del proyecto. Todo lo demás (CSS y JavaScript) se «cuelga» de él.

Comparación: si la página fuera una **casa**, el HTML son las **paredes, puertas y ventanas** (qué hay y dónde); el CSS es la **pintura y la decoración**; el JavaScript es la **electricidad** (lo que hace que las cosas funcionen).

---

## 1. Qué es una etiqueta
Una etiqueta se escribe entre `<` y `>`. Casi siempre viene en pareja: una de **apertura** y una de **cierre** (con `/`). Lo de en medio es el contenido.

```html
<h2>Las aves del campus UAO</h2>
```
- `<h2>` abre un **título** de nivel 2.
- Lo de en medio es el texto.
- `</h2>` lo cierra.

Algunas etiquetas no llevan contenido y no se cierran, como `<img ...>` (imagen).

## 2. Atributos: la «ficha» de cada etiqueta
Dentro de la etiqueta de apertura se escriben **atributos** (`nombre="valor"`) que la configuran:

```html
<button class="btn-principal" data-iniciar-ra>Iniciar la experiencia RA</button>
```
- `button` → es un botón.
- `class="btn-principal"` → le pone una **clase** (una «etiqueta de estilo»: el CSS le dará aspecto a todo lo que tenga esa clase).
- `data-iniciar-ra` → un atributo propio nuestro (los que empiezan por `data-` son inventados por el programador). El JavaScript busca todos los botones con este atributo y, al tocarlos, **inicia la RA**.
- «Iniciar la experiencia RA» → el texto visible.

Los atributos más usados en tu proyecto:
| Atributo | Para qué sirve | Ejemplo |
|---|---|---|
| `id` | Un **nombre único** para encontrar ese elemento (como la cédula) | `id="guia"`, `id="ra-salir"` |
| `class` | Un **grupo de estilo** (muchos elementos pueden compartirla) | `class="ra-modo"` |
| `href` | A dónde lleva un enlace | `href="#guia"` |
| `src` | De dónde sale una imagen o script | `src="img/logo-uao.png"` |
| `alt` | Descripción de una imagen (para lectores de pantalla y si no carga) | `alt="UAO"` |
| `aria-label` | Nombre accesible de algo que no tiene texto (como un ícono) | `aria-label="Salir de la RA"` |
| `hidden` | El elemento **está oculto** (el JS lo muestra cuando haga falta) | `<div id="ra" hidden>` |
| `data-…` | Datos propios que lee el JavaScript | `data-modo="quiz"` |

## 3. La estructura de un documento HTML
Todo archivo HTML tiene dos partes grandes:

```html
<!DOCTYPE html>          ← "esto es un documento HTML5"
<html lang="es">         ← todo va dentro; lang="es" dice que está en español
<head>                   ← la "trastienda": información que NO se ve
  ...
</head>
<body>                   ← lo que SÍ se ve
  ...
</body>
</html>
```

### 3.1 El `<head>` de tu proyecto (lo que no se ve pero manda)
```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0E2621">
<title>Aves UAO - Guía de avistamiento en Realidad Aumentada</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces...&family=Inter..." rel="stylesheet">
<link rel="stylesheet" href="css/estilos.css">
<script type="importmap">{ "imports": { "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js" } }</script>
```
- `charset="utf-8"` → permite acentos y la «ñ».
- `viewport` → le dice al **celular** que use el ancho real de su pantalla (sin esto, el celular mostraría la página «encogida» como si fuera de computador).
- `theme-color` → el color de la barra del navegador en el celular.
- `<title>` → el texto de la pestaña.
- `<link … Fraunces … Inter>` → descarga las **tipografías** de Google Fonts.
- `<link rel="stylesheet" href="css/estilos.css">` → conecta el **CSS**.
- `importmap` → una **lista de direcciones**: «cuando algún archivo diga `import … from "three"`, la librería está en esta dirección de internet». Es lo que permite usar three.js sin instalar nada.

### 3.2 El `<body>`: las grandes zonas
En orden de arriba a abajo:

1. **Un bloque de íconos** (`<svg>` con muchos `<symbol>`): dibujos pequeños reutilizables (corazón de vidas, flor, fruta, insecto…). Más abajo, `<svg><use href="#i-corazon"/></svg>` dice «dibuja aquí el ícono que se llama `i-corazon`». Es como un catálogo de stickers.
2. **La portada** `<header class="hero" id="inicio">`: tiene un `<canvas id="cielo">` (donde se dibuja el amanecer animado), el título «Aves UAO» y los botones.
3. **La barra** `<nav class="barra">`: el menú de arriba con enlaces `#como`, `#guia`, `#libreta`, `#jornadas`.
4. **Las secciones** dentro de `<main>`: «Cómo funciona», «Guía UAO», «Mi libreta», «Jornadas».
5. **El pie** `<footer>`: créditos y fuentes.
6. **La interfaz de la RA** `<div id="ra" class="ra" hidden>`: **escondida** hasta que alguien toca «Iniciar la experiencia RA». Adentro hay un `<video>`, un contenedor para el 3D, la barra de arriba, los botones de modos, el panel, etc.
7. **Los `<script>`** al final: cargan los archivos JavaScript.

## 4. Etiquetas que vas a ver y qué significan
| Etiqueta | Significado |
|---|---|
| `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` | Zonas con **significado** (portada, menú, contenido principal, sección, artículo independiente, pie). Ayudan a lectores de pantalla y buscadores |
| `<div>` | Una **caja genérica** sin significado, para agrupar cosas |
| `<span>` | Una caja genérica **dentro de una línea de texto** |
| `<h1>` … `<h4>` | Títulos de distinto nivel |
| `<p>` | Párrafo |
| `<a href="…">` | **Enlace** (a otra página o a una sección con `#`) |
| `<button>` | Botón |
| `<img src="…" alt="…">` | Imagen |
| `<svg>` | Dibujo vectorial (formas descritas con texto) |
| `<canvas>` | Un **lienzo en blanco** donde el JavaScript puede dibujar lo que quiera (2D o 3D) |
| `<video>` | Reproductor de video (aquí muestra la **cámara en vivo**) |
| `<input type="search">` | Cuadro de texto (el buscador de aves) |
| `<details>` / `<summary>` | «Acordeón» que se abre y se cierra solo (las fichas del listado) |
| `<script>` | Carga o contiene código JavaScript |
| `<select>` / `<option>` | Menú desplegable (elegir el ave para «Tamaño real») |

## 5. Dos etiquetas clave para entender la RA
### 5.1 `<video id="ra-video" playsinline muted autoplay></video>`
Es el elemento que muestra lo que **ve la cámara trasera del celular**. Los atributos significan:
- `playsinline` → que se reproduzca **dentro** de la página (en iPhone, sin esto el video se abriría a pantalla completa).
- `muted` → sin sonido (así los navegadores permiten el autoplay).
- `autoplay` → empieza solo.

### 5.2 `<div id="ra-lienzo" class="ra-lienzo"></div>`
Un contenedor **vacío** donde, por JavaScript, se inserta un `<canvas>` **transparente** donde three.js dibuja las aves. Está **encima** del `<video>`; como el canvas es transparente, ves el video con las aves por delante. (Capítulo 09.)

## 6. El orden de los `<script>` importa
Al final del `body` se cargan los archivos así:

```html
<script src="js/datos-uao.js"></script>      ← los datos de las 84 especies
<script src="js/especies-ra.js"></script>    ← los datos de las 12 aves de RA
<script src="js/sonido.js"></script>         ← el sonido
<script src="js/escena.js"></script>         ← la portada animada
<script src="js/app.js"></script>            ← la lógica de la página
<script type="module" src="js/ra/ra.js"></script>  ← el motor de RA (módulo)
```
- Los primeros definen cosas (datos, sonido) que los siguientes **usan**; por eso van antes.
- El último lleva `type="module"`: es un **módulo** de JavaScript, que puede usar `import` para traer otros archivos (como three.js y `aves3d.js`).

## 7. Accesibilidad (la parte que casi nadie ve pero cuenta)
Cuidamos cosas como: `alt` en las imágenes, `aria-label` en botones que son solo un ícono (✕, ⟲), `aria-live` en textos que cambian (para que un lector de pantalla los anuncie), y `hidden` para esconder lo que no corresponde. No es lo central del parcial, pero demuestra cuidado.

## 8. Cómo «se conecta» el HTML con el JavaScript
El JavaScript **busca** elementos del HTML por su `id` o `class` y los modifica. Ejemplo real (en `app.js`):

```js
$("#lib-aves").textContent = `${d.aves.length}/${E.length}`;
```
Se lee así: «busca el elemento con `id="lib-aves"` (en la sección «Mi libreta» hay `<b id="lib-aves">0/12</b>`) y cambia su texto por, por ejemplo, `3/12`». Esa es la forma de que una página «viva» muestre datos que cambian.

## Para decirle al profesor
> «El HTML define la estructura: la portada, las secciones de la guía, la libreta y toda la interfaz de la RA. La RA tiene un `<video>` con la cámara y, encima, un `<canvas>` transparente donde three.js dibuja las aves. Los botones llevan atributos `data-…` que el JavaScript usa para saber qué hacer.»

## Autoevaluación
1. ¿Qué es una etiqueta y qué es un atributo? Da un ejemplo del proyecto.
2. ¿Para qué sirven `id` y `class`?
3. ¿Qué hay dentro de `#ra` y por qué empieza con `hidden`?
4. ¿Qué es un `<canvas>`? ¿Y un `<video>`? ¿Cómo se combinan en la RA?
5. ¿Qué hace el `importmap`?
