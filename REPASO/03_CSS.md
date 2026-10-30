# 03 · CSS: el maquillaje (y cómo se acomoda en celular y computador)

## Resumen en 1 minuto
**CSS** (Cascading Style Sheets) es el lenguaje que dice **cómo se ve** cada cosa que el HTML puso: colores, tamaños, tipografías, posiciones, sombras, animaciones y cómo cambia todo según el tamaño de la pantalla. Se guarda en `css/estilos.css` (≈310 líneas). Sin CSS la página sería texto negro sobre blanco, todo apilado.

---

## 1. Cómo se escribe una regla
Una regla CSS tiene un **selector** (a quién le aplico) y un bloque de **propiedades** (qué le cambio):

```css
.btn-principal {
  background: var(--ambar);
  color: #20160a;
  border-radius: 999px;
  padding: 15px 28px;
}
```
Se lee: «a todo elemento con la clase `btn-principal` (el botón «Iniciar la experiencia RA») ponle fondo ámbar, letra casi negra, esquinas totalmente redondeadas (999 px = píldora) y 15 px de espacio vertical y 28 px horizontal por dentro».

### Selectores más usados
| Selector | A quién se aplica | Ejemplo en el proyecto |
|---|---|---|
| `.nombre` | A todo lo que tenga `class="nombre"` | `.ra-modo` (los botones de la barra de la RA) |
| `#nombre` | Al único elemento con `id="nombre"` | `#cielo` (el lienzo de la portada) |
| `etiqueta` | A todas las etiquetas de ese tipo | `h1, h2, h3 { … }` |
| `a:hover` | Al enlace **cuando pasas el mouse** | `.enlaces a:hover { color: var(--ambar); }` |
| `.a.b` | A lo que tenga **ambas** clases | `.ra-modo.activo` (el botón de modo seleccionado) |
| `.a > .b` | Al `.b` que es **hijo directo** de `.a` | `.ra.ra-en-recorrido > :not(.ra-lienzo)…` |

## 2. Variables de color: el «paquete de colores» del proyecto
Al comienzo del CSS se definen **variables** para no repetir los colores:

```css
:root {
  --noche: #0E2621;   --bosque: #17392F;   --musgo: #2F6B4F;
  --crema: #F7F1E3;   --papel: #FFFBF2;
  --ambar: #F2A541;   --coral: #E4673E;    --cielo: #7CC3E8;
  --serif: "Fraunces", Georgia, serif;     --sans: "Inter", system-ui, sans-serif;
}
```
- `:root` es «toda la página». Cada `--algo` es una variable.
- Después se usan con `var(--ambar)`. Si cambias el valor arriba, **cambia en todo el sitio**. Eso es lo que da **coherencia** de marca (verde bosque + ámbar + coral).
- `#F2A541` es un color en **hexadecimal**: tres pares de dígitos para rojo, verde y azul (`F2` = mucho rojo, `A5` = verde medio, `41` = poco azul → un naranja ámbar).

## 3. El modelo de caja: todo es un rectángulo
Cada elemento es una caja con capas: **contenido → relleno (`padding`) → borde (`border`) → margen (`margin`)**. Con `* { box-sizing: border-box; }` el ancho incluye relleno y borde (más fácil de calcular).

## 4. Unidades (cómo se miden las cosas)
| Unidad | Qué es | Ejemplo |
|---|---|---|
| `px` | Píxeles (puntitos de pantalla) | `padding: 15px` |
| `rem` / `em` | Relativo al tamaño de letra (1 rem ≈ 16 px) | `font-size: .85rem` |
| `%` | Porcentaje del contenedor | `width: 100%` |
| `vw` / `vh` | 1 % del ancho / alto de la ventana | `font-size: 19vw` |
| `svh` | Alto «seguro» de la ventana en celular (sin que la barra del navegador lo estorbe) | `.hero { height: 100svh }` |
| `clamp(min, ideal, max)` | Un valor que **crece con la pantalla pero con tope** | `font-size: clamp(4rem, 19vw, 10rem)` en el título «Aves» |

## 5. Posicionamiento: cómo se apilan y se colocan las cosas
- **`position: relative`** → el elemento queda en su lugar normal pero sirve de «ancla» para lo que lleve adentro.
- **`position: absolute; inset: 0;`** → el elemento se estira **sobre todo su contenedor** (arriba, abajo, izquierda y derecha en 0). Así el `<canvas>` del cielo cubre la portada, y el `<video>` y el 3D de la RA cubren toda la pantalla, uno **encima** del otro.
- **`position: fixed`** → pegado a la ventana (la interfaz de la RA: `.ra { position: fixed; inset: 0; z-index: 100 }`).
- **`position: sticky`** → se pega arriba al hacer scroll (la barra `.barra { position: sticky; top: 0 }`).
- **`z-index`** → qué queda **delante**: mayor número = más al frente. La RA usa 100 para tapar toda la página.

## 6. Flexbox y Grid: acomodar cosas sin sufrir
- **Flexbox** (`display: flex`) acomoda hijos **en fila o columna**, con espacios y alineación:
  ```css
  .ra-modos { display: flex; gap: 4px; justify-content: space-between; }
  ```
  → la barra de abajo de la RA: los botones en fila, con 4 px entre ellos, repartidos a lo ancho.
- **Grid** (`display: grid`) acomoda en **cuadrícula**. En la portada: `display: grid; place-items: center;` = «centra el contenido en el medio». En la barra de arriba de la RA: `grid-template-columns: 1fr auto 1fr` = «tres columnas: izquierda flexible, centro del tamaño de su contenido, derecha flexible», para que el título quede **perfectamente centrado**.

## 7. Efectos visuales que usamos
- **Sombras:** `box-shadow: 0 10px 30px -10px rgba(242,165,65,.8)` (un resplandor ámbar debajo del botón).
- **Transiciones:** `transition: transform .2s` hace que los cambios (como subir 2 px al pasar el mouse) sean **suaves** en vez de instantáneos.
- **Desenfoque de fondo:** `backdrop-filter: blur(10px)` → el efecto «vidrio esmerilado» de la barra y de los botones sobre la cámara.
- **Transparencias:** `rgba(14, 38, 33, .65)` = verde oscuro con 65 % de opacidad (el último número es la opacidad).

## 8. Animaciones en CSS (`@keyframes`)
Una animación se describe con **fotogramas clave**:

```css
@keyframes cine-pulso {
  0%, 100% { box-shadow: 0 0 0 0 rgba(228,103,62,.65); }
  50%      { box-shadow: 0 0 0 8px rgba(228,103,62,0); }
}
.ra-modo.ra-cine { background: var(--coral); animation: cine-pulso 1.6s ease-in-out 4; }
```
Se lee: «el botón **Cinemática** (coral) late 4 veces (cada una 1,6 s): un halo coral que crece y se desvanece». Otra animación es `rueda` (la ruedita del mouse de la portada).

## 9. Diseño responsive: la misma página en celular y computador
**Responsive** = que se adapte al tamaño de pantalla. Se logra con **media queries**:

```css
@media (max-width: 520px) {
  .ra-modo { flex: 1 1 auto; min-width: 0; padding: 8px 3px; font-size: .58rem; }
}
```
Se lee: «**si** la pantalla mide 520 px de ancho o menos, entonces los botones de la barra de la RA se encogen y reparten el espacio según su texto». Con eso caben los 7 botones, incluido **Cinemática**, en un celular angosto. Hay varias en el proyecto (≤ 820, ≤ 600, ≤ 560, ≤ 520, ≤ 345 px).

## 10. La cascada (por qué se llama «Cascading»)
Si dos reglas chocan, gana la **más específica**, y si empatan, la **que está más abajo**. Por eso `.ra-modo.activo` (dos clases) le gana a `.ra-modo` (una). Y por eso `.ra-modo.ra-cine` se escribe debajo.

## 11. Cómo se esconde la interfaz durante la cinemática (un truco elegante)
```css
.ra.ra-en-recorrido > :not(.ra-lienzo):not(.ra-recorrido) { display: none !important; }
```
Se lee: «cuando el contenedor de la RA tenga la clase `ra-en-recorrido`, **escóndeme todos sus hijos directos excepto el lienzo 3D y la interfaz de la cinemática**». El JavaScript solo agrega/quita esa clase y el CSS esconde el video, la barra, el radar, etc. Es mejor que esconder uno por uno.

## 12. Dónde está cada cosa en `estilos.css`
- Variables y reglas generales (líneas 1–27).
- Portada (`.hero`, `.btn-principal`, `.bajar`) · barra (`.barra`) · secciones.
- Tarjetas de «Cómo funciona», guía, libreta, jornadas, pie.
- **Sección «EXPERIENCIA RA»** (`.ra-*`): la interfaz de la RA (barra superior, radar, avisos, panel, pregunta del quiz, obturador, binoculares, ficha, barra de modos…).
- **Cinemática** (`.ra-recorrido`, `.rec-titulo`, `.rec-botones`, `.rec-barra`).
- Media queries para celulares.

## 13. Experimento para «sentirlo» (hazlo con calma)
1. Abre `css/estilos.css`.
2. Cambia `--ambar: #F2A541;` por `--ambar: #FF00AA;` y guarda.
3. Recarga la página: todos los botones ámbar se vuelven **rosados**, sin tocar nada más. Eso es una variable.
4. **Vuélvelo a poner** (`#F2A541`). Si te equivocas, en GitHub Desktop puedes «descartar cambios».

## Para decirle al profesor
> «El CSS define la identidad visual con variables de color y tipografías, y usa flexbox, grid y media queries para que la misma página funcione en celular y computador. La interfaz de la RA se superpone al video con posicionamiento absoluto y `z-index`, y el efecto de vidrio esmerilado se hace con `backdrop-filter`.»

## Autoevaluación
1. ¿Qué es un selector? ¿En qué se diferencia `.clase` de `#id`?
2. ¿Qué es una variable CSS y por qué ayuda?
3. ¿Qué hace `position: absolute; inset: 0`? ¿Cómo lo usamos con el video y el 3D?
4. ¿Qué es una media query y qué ejemplo del proyecto conoces?
5. ¿Cómo se esconde toda la interfaz de la RA al iniciar la cinemática?
