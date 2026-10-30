# 01 · Internet y las páginas web (desde cero)

## Resumen en 1 minuto
Una página web es un **conjunto de archivos** (texto e imágenes) guardados en una computadora que está siempre prendida (el **servidor**). Cuando abres un enlace, tu **navegador** (Chrome, Safari) pide esos archivos por internet, los recibe y los **interpreta** para mostrarte la página. Tu proyecto es una página «**estática**»: los archivos ya están hechos y todo lo que ocurre (las aves, el quiz, el sonido) lo ejecuta **tu navegador**, en tu celular.

---

## 1. La comparación del restaurante (cliente y servidor)
- **Tú (con tu celular)** eres el **cliente**: el que pide.
- **El servidor** es la **cocina**: una computadora en algún lugar que guarda los archivos.
- **Internet** es el **mesero**: lleva el pedido y trae la comida.
- **El navegador** es el que **«se come» y presenta el plato**: toma los archivos y los convierte en lo que ves.

Cuando escribes `https://jusstjuanda.github.io/pajaro-uao/` estás diciendo: «por favor, tráeme la página de la carpeta `pajaro-uao` del usuario `jusstjuanda` en GitHub».

## 2. Qué es una URL (el enlace)
`https://jusstjuanda.github.io/pajaro-uao/#guia`

- `https://` → **protocolo**: el idioma y la seguridad con la que se habla (HTTP seguro).
- `jusstjuanda.github.io` → **dominio**: la «dirección» del servidor (GitHub Pages, el usuario `jusstjuanda`).
- `/pajaro-uao/` → **ruta**: la carpeta dentro del servidor.
- `#guia` → **ancla**: una posición *dentro* de la página (baja directamente a la sección con `id="guia"`). *(Es la que causó el bug de «abre directo en la guía»; ver capítulo 17.)*

## 3. Qué pasa cuando abres el enlace (paso a paso)
1. Tu navegador pregunta a un «directorio de internet» (**DNS**) cuál es la dirección numérica de `jusstjuanda.github.io`.
2. Se conecta de forma segura (**HTTPS**) y pide el archivo `index.html`.
3. El servidor le responde con el contenido de `index.html`.
4. El navegador lee `index.html` y ve que necesita **más archivos**: `estilos.css`, varios `.js`, imágenes, tipografías, la librería three.js… y los pide también.
5. Cuando tiene todo, **arma la página**: el HTML da la estructura, el CSS le pone el aspecto, el JavaScript le da vida.
6. A partir de ahí, lo que haces (tocar un botón, mover el celular) lo procesa **el JavaScript dentro de tu celular**. El servidor ya no hace nada.

## 4. Sitio estático vs. sitio dinámico
- **Dinámico:** el servidor **fabrica** la página cada vez (por ejemplo, Instagram arma tu feed con tus datos). Necesita programación en el servidor y una base de datos.
- **Estático:** el servidor solo **entrega archivos ya hechos**. Es lo que es tu proyecto.

**Ventajas de ser estático (lo puedes decir):** es gratis de publicar, rapidísimo, muy seguro (no hay base de datos que hackear), y no hay nada que se «caiga» en un servidor propio.
**Desventajas:** no puede guardar datos de varias personas en un mismo sitio (por eso la libreta se guarda **en cada celular**), ni hacer cosas como cuentas de usuario.

## 5. HTTP y HTTPS (por qué importa para la cámara)
- **HTTP** es el idioma con el que se piden y entregan páginas.
- **HTTPS** es el mismo idioma pero **cifrado** (nadie en el camino puede leer ni alterar lo que viaja). Se reconoce por el candadito.
- **Los navegadores solo permiten usar la cámara y los sensores de movimiento en páginas HTTPS.** Por eso la RA **no funciona** abriendo el archivo directamente en un celular ni en un sitio sin HTTPS. GitHub Pages ya incluye HTTPS, y por eso se eligió.

## 6. Qué es una «carpeta wwwroot»
Tu proyecto se creó en **Visual Studio** como un proyecto de .NET (un tipo de proyecto de Microsoft). Ese tipo de proyecto tiene una carpeta especial llamada `wwwroot` donde van los archivos públicos de la web. **Todo lo que está dentro de `PaginaPajaro/wwwroot` es la página.** Lo demás (el `.csproj`, `Program.cs`, la bitácora…) es herramienta de desarrollo o documentación y **no se ve en la web**.

```
PaginaPajaro/
  PaginaPajaro.csproj     ← "ficha técnica" del proyecto de .NET (no es la web)
  Program.cs              ← programita de .NET que sirve la web en tu computador mientras programas
  wwwroot/                ← AQUÍ ESTÁ LA PÁGINA (lo que se publica)
    index.html            ← el esqueleto de la página
    css/estilos.css       ← el maquillaje
    js/…                  ← el cerebro (varios archivos JavaScript)
    img/…                 ← imágenes
    galeria3d.html        ← una página extra con las 12 aves girando
```

## 7. Tipos de archivos que vas a ver
| Terminación | Qué es | Ejemplo en el proyecto |
|---|---|---|
| `.html` | Estructura de una página | `index.html`, `galeria3d.html` |
| `.css` | Estilos (aspecto) | `estilos.css` |
| `.js` | Código JavaScript (lógica) | `ra.js`, `app.js`, `sonido.js`… |
| `.png`, `.jpg`, `.webp` | Imágenes (foto o dibujo) | fotos de la guía, las 12 imágenes de aves de la libreta |
| `.svg` | Imagen vectorial hecha con texto (nítida a cualquier tamaño) | el arco de palmas de la portada, los íconos |
| `.md` | Texto con formato simple (Markdown) para documentación | `BITACORA_PAJARO.md`, este repaso |
| `.yml` | Configuración en texto | `pages.yml` (la receta de publicación) |
| `.csproj`, `.cs` | Archivos de .NET | `PaginaPajaro.csproj`, `Program.cs` |

## 8. La caché del navegador (y por qué a veces «no se ven los cambios»)
Para que las páginas carguen rápido, el navegador **guarda una copia** de los archivos y, mientras no pase cierto tiempo, **no los vuelve a pedir**. GitHub Pages le dice al navegador «guarda esto 10 minutos». Por eso, después de publicar un cambio, a veces se sigue viendo la versión vieja. Solución: **recarga forzada** (`Ctrl + Shift + R` en el computador) o una ventana de incógnito.

## 9. Qué es un CDN (y por qué la RA necesita internet)
Un **CDN** es un servicio que guarda librerías famosas ya hechas y las reparte muy rápido. Tu proyecto no incluye la librería **three.js** (es muy grande): le dice al navegador «descárgala de `cdn.jsdelivr.net`». También se descargan las **tipografías** (Google Fonts: «Fraunces» e «Inter»). Por eso la RA **necesita internet la primera vez** que carga. (Mejora futura posible: guardar three.js dentro del propio proyecto para que funcione sin depender de la red.)

## 10. El «modo desarrollo» vs. la web publicada
- **Mientras programamos:** las pruebas se hicieron con un **servidor local** (un programa que sirve la carpeta en tu mismo computador, en `localhost:5146`), para ver los cambios al instante sin publicar.
- **Publicado:** cuando haces *commit* y *push* en GitHub Desktop, **GitHub Pages** copia `wwwroot` a su servidor y la web queda con el enlace público. Verás eso en el capítulo 05.

## Para decirle al profesor
> «La aplicación es un sitio web estático: todo el código corre en el navegador del usuario. No hay servidor propio ni base de datos; se publica gratis con GitHub Pages, que además da HTTPS, necesario para que el navegador permita usar la cámara y los sensores de movimiento.»

## Autoevaluación (respóndete sin mirar)
1. ¿Qué diferencia hay entre cliente y servidor?
2. ¿Por qué la RA exige HTTPS?
3. ¿Qué significa que el sitio sea «estático» y qué ventajas y límites trae?
4. ¿Qué es un CDN y qué descargamos de uno?
5. ¿Por qué después de publicar a veces no se ven los cambios?
