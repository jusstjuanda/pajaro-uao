# 13 · La página, la guía de 84 especies y la libreta

## Resumen en 1 minuto
Antes de entrar a la RA, el usuario ve una **página web informativa**: una **portada animada**, una sección que explica **cómo funciona**, la **guía de las 84 especies** (con buscador y fichas), la **libreta** personal (aves registradas, fotos, mejor puntaje) y las **jornadas** de monitoreo. Los **datos** vienen de la guía de la UAO y están en `datos-uao.js`; la **lógica** que los muestra está en `app.js`; la **portada animada** en `escena.js`. Todo es HTML + CSS + JavaScript, sin servidor.

---

## 1. Las secciones de la página (de arriba a abajo)
1. **Portada (`.hero`)**: amanecer animado, título «Aves UAO» con el logo de la UAO, lema, botones **«Iniciar la experiencia RA»** y **«Explorar la guía»**.
2. **Barra (`.barra`)**: pegada arriba con enlaces **Cómo funciona · Guía UAO · Mi libreta · Jornadas** y el botón «Abrir RA».
3. **Cómo funciona (`#como`)**: 7 tarjetas (una por interacción RA).
4. **Guía UAO (`#guia`)**: cifras (84, 30, 77), aves fotografiadas en el campus, **buscador** y listado completo.
5. **Mi libreta (`#libreta`)**: tu progreso.
6. **Jornadas (`#jornadas`)**: mosaico de fotos de los monitoreos.
7. **Pie**: créditos y fuentes.

## 2. De dónde vienen los datos (`datos-uao.js`)
Un archivo que define un objeto global `window.UAO` con:
- `resumen`: 84 especies, 30 familias, 77 géneros, desde 2019.
- `lista`: las **84 especies**, cada una como una lista de 5 datos: **orden, familia, nombre común, nombre científico, nombre en inglés**.
- `fichas`: **49 fichas** con un **texto** (de la guía) y un `wiki` (el número de esa ave en WikiAves). Las otras 35 especies **no tienen ficha** porque la guía no las trae.
- `fotos`: las **12 fotos reales** del campus (de la guía) por nombre de ave.
- `jornadas`: las fotos del mosaico.
- Comentarios iniciales con la **fuente y los créditos** (Escuela de Turismo UAO; autores; fotógrafos).

**Importante:** estos textos son **de la guía**: **nunca se reescribieron**. Los textos propios del equipo (como los de la interfaz) son aparte.

## 3. Cómo se pinta la guía (la técnica del «molde»)
La página **no tiene escrito en HTML** el listado de 84 especies: lo **genera el JavaScript** a partir de los datos. Esto es muchísimo más cómodo y mantenible.

```js
$("#listado").innerHTML = ordenes.map(o => `
  <div class="orden"><h4>${o}</h4>
  ${visibles.filter(s => s.orden === o).map(s => { ... `<details class="especie">…` }).join("")}
  </div>`).join("");
```
Lectura: por cada **orden** (Anseriformes, Columbiformes…), crea un bloque con su título y, dentro, **un acordeón** (`<details>`) por cada especie de ese orden, con su nombre, científico, familia, texto de la ficha, enlace a WikiAves y, si es de RA, un botón **«Verla en Realidad Aumentada»**. Etiquetas pequeñas marcan **RA** y **foto**.

## 4. El buscador (con un detalle inteligente)
```js
const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const palabras = norm(filtro).split(/\s+/).filter(Boolean);
const visibles = U.lista.filter(s => { const t = norm(`${s.comun} ${s.cientifico} ${s.ingles} ${s.familia}`); return palabras.every(p => t.includes(p)); });
```
- **`norm`** «normaliza» el texto: **quita las tildes** y pasa a minúsculas (`"Sirirí"` → `"siriri"`). Así «siriri» encuentra «Sirirí».
- El texto buscado se **parte en palabras** y se exige que **todas** aparezcan: «garza ganado» encuentra «Garza de ganado».
- Busca en **nombre común, científico, inglés y familia**.
- Cada vez que escribes una letra (`evento input`), se vuelve a **pintar** el listado y se actualiza el conteo («7 de 84 especies»).

## 5. Las fotos «destacadas»
Muestra las 12 especies con **foto real** (de la guía) en tarjetas con la foto a un lado y el texto al otro. Detalle técnico: una tabla `tamFoto` guarda el **ancho y alto reales** de cada foto para que el navegador **reserve el espacio antes de que la imagen cargue** (así la página no «salta» al cargar). También `loading="lazy"` hace que las imágenes **solo se descarguen cuando estás cerca** (ahorra datos).

## 6. La libreta (`localStorage`)
Lo que guarda y cómo:
```js
{ aves: ["mirla","garza"], fotos: ["data:image/jpeg;base64,…"], quiz: 12 }   // clave: "pajaro-uao-libreta"
```
- **`aves`**: los `id` de las aves registradas. **`fotos`**: las fotos tomadas, como **texto** (`dataURL`; máximo **8**, las más recientes). **`quiz`**: el mejor puntaje.
- `window.Libreta` ofrece funciones (`tiene`, `total`, `registrar`, `foto`, `quiz`) que **la RA llama** (por ejemplo `registrarAve` → `Libreta.registrar(id)`), y que guardan y **repintan** la sección.
- `pintarLibreta()` rellena: «**3/12** aves registradas», «**2** fotos de campo», «**12** mejor quiz», la insignia (si ≥ 10) y las **cuadrículas** de aves (las no registradas aparecen con «¿?» y «Encuéntrala en RA») y de fotos (con enlace para **descargarlas**).
- Si el almacenamiento está lleno (las fotos pesan), el código **recorta** las fotos antiguas y vuelve a intentar.
- **Privacidad:** todo queda **en tu celular**. Hay un botón **«Reiniciar libreta»** (con confirmación) que lo borra.
- **Limitación:** si cambias de celular o borras los datos del navegador, **se pierde** (no hay cuentas ni nube).

## 7. La aparición suave al hacer scroll («revelar»)
```js
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
}), { threshold: 0.12 });
$$(".revelar").forEach(el => io.observe(el));
```
Un **`IntersectionObserver`** es un «vigilante» del navegador que avisa **cuando un elemento entra en la pantalla**. Cuando eso pasa, se le agrega la clase `visible`, y el CSS hace que **aparezca con un fundido**. Se vigila cada elemento con la clase `revelar`. Es más eficiente que escuchar el scroll constantemente.

Con el mismo vigilante, los **números de la guía** (84, 30, 77) **cuentan desde 0** al aparecer, con un efecto de *easing* (frenan al llegar).

## 8. La portada animada (`escena.js`)
Un **dibujo animado en un `<canvas>` 2D** (no usa three.js), con `requestAnimationFrame`:
1. **Cielo** con degradado que va de noche a **amanecer** (`amanecer` va de 0 a 1 suavemente).
2. **Estrellas** que se apagan al amanecer.
3. **Sol** con halo que sube.
4. **Cerros** (los Farallones de Cali) en **3 capas** con **paralaje**: al mover el mouse, las capas lejanas se mueven menos que las cercanas (da profundidad).
5. **Siluetas de árboles y palmas** (26) dibujadas con curvas.
6. **Bandada de 46 aves** que se comporta con **boids** (abajo).
7. Respeta a quienes pidieron **menos movimiento** (`prefers-reduced-motion`): para ellos el amanecer ya aparece terminado.

### Los boids (cómo vuela una bandada)
Los «boids» son un algoritmo clásico (Craig Reynolds, 1986): cada ave sigue **3 reglas simples** y de ahí **emerge** el movimiento de bandada:
1. **Alineación:** ir en una dirección parecida a la de las vecinas (`ax`, `ay`).
2. **Cohesión:** moverse hacia el centro del grupo cercano (`cx`, `cy`).
3. **Separación:** no chocar con las vecinas demasiado cerca (`sepx`, `sepy`).
Más reglas nuestras: **huir del mouse** (si el cursor está a menos de 150 px), mantenerse **en la franja del cielo** y limitar la **velocidad** entre un mínimo y un máximo. Cada ave se dibuja como una «v» con las alas que **suben y bajan** (`sin`).

## 9. Galería 3D (`galeria3d.html`)
Una página aparte, con three.js, que muestra las **12 aves girando** una al lado de la otra con su nombre. Sirve para el pitch y para que se vea que los modelos son 3D de verdad (en computador de pie: 4 columnas; en celular vertical: 2). Es independiente de la RA.

## 10. La ficha dentro de la RA
`window.FichaRA(esp)` (en `app.js`) arma el cuadro que sale al tocar un ave: foto (si hay), nombre, científico, texto de la guía (o, si no hubiera, sus pistas), botón **«Escuchar»** y enlace **WikiAves**. Es un ejemplo de cómo `app.js` (la página) y `ra.js` (la RA) **se hablan** a través de `window`.

## 11. Arranque de la RA
```js
document.addEventListener("click", e => {
  const b = e.target.closest("[data-iniciar-ra]");     // ¿el clic fue en un botón con data-iniciar-ra?
  if (!b) return;
  if (!window.RA) { alert("La experiencia RA aún se está cargando..."); return; }
  window.RA.iniciar();
});
```
Un **solo escuchador** atiende **todos** los botones que inician la RA (portada, barra, tarjetas, fichas de especies). Si `ra.js` aún no cargó (internet lenta), avisa.

## 12. Créditos y fuentes (importante)
El pie de la página cita: la **Guía ilustrada de las aves del campus de la UAO (2023, Escuela de Turismo; autores Germán Morales Zúñiga y Natalia Lenis Sánchez; fotografías de Juan Manuel Quintero, Natalia Lenis Sánchez y Diana Carolina Campo Daza)**, **WikiAves (Universidad Icesi)** y aclara que los **modelos 3D y los cantos de la RA están recreados por código (no son grabaciones reales)**. Es una práctica de honestidad y de respeto a la autoría.

## 13. Decoración y marca
- Las **hojas** de fondo (muy tenues, ~8 %) salen de un **patrón de la guía**; el **arco de 12 palmas** de la portada (tenue, 12 %) es un SVG generado por código; el **logo UAO** es una imagen; las tipografías son **Fraunces** (títulos) e **Inter** (texto).
- Decisión de Hugo: **no se cambiaron estilo, fuentes ni colores** después de definidos; solo se pulieron detalles.

## Para decirle al profesor
> «La página consume una base de datos de aves, que está en un archivo de datos separado del código: la guía, el buscador y la libreta se pintan con JavaScript a partir de esos datos. La libreta se guarda en el localStorage del dispositivo. La portada es un canvas 2D con un amanecer, paralaje y una bandada con comportamiento boids. Los textos de las fichas son de la guía de la UAO y están acreditados.»

## Autoevaluación
1. ¿Dónde están los datos de las aves y cómo se pintan en la página?
2. ¿Cómo funciona el buscador y por qué «siriri» encuentra «Sirirí»?
3. ¿Qué guarda la libreta, dónde y qué límites tiene?
4. ¿Qué es un `IntersectionObserver` y para qué lo usamos?
5. ¿Qué son los boids? ¿Qué tres reglas siguen?
6. ¿Qué diferencia hay entre `escena.js` y la escena de three.js de la RA?
