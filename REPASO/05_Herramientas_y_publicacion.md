# 05 · Herramientas y publicación: Git, GitHub, Pages, .NET, CDN, consola

## Resumen en 1 minuto
Para hacer y publicar el proyecto se usaron: un **editor/IDE** para ver los archivos (Visual Studio), **Git** (guarda las versiones), **GitHub** (guarda el proyecto en internet), **GitHub Desktop** (la ventanita con botones para usar Git), **GitHub Pages + GitHub Actions** (publican la web automáticamente), un **servidor local** para probar, y una **IA de programación** (Claude Code) que escribió y revisó el código siguiendo tus indicaciones. La librería de 3D (three.js) se descarga de un **CDN**.

---

## 1. El editor y el «proyecto de Visual Studio»
Un **IDE** (entorno de desarrollo) es el programa donde se abren y editan los archivos de código (Visual Studio, VS Code…). Al ser un código de texto, **cualquier editor sirve**: lo que lo hace «funcionar» es el navegador.

El proyecto nació como un proyecto de **ASP.NET Core** (tecnología de Microsoft) porque así se crea una web en Visual Studio. Pero **la web publicada no usa .NET**:

- `PaginaPajaro.csproj` → la «ficha técnica» del proyecto .NET (qué versión de .NET usa, etc.).
- `Program.cs` → un programa de unas 10 líneas que **sirve la carpeta `wwwroot`** cuando le das ▶ en Visual Studio, para probar la página en tu computador. Incluye `Cache-Control: no-cache` para que, en pruebas, el celular siempre reciba la versión más nueva.
- `PaginaPajaro.slnx` → archivo de «solución» de Visual Studio (agrupa proyectos).

Si te preguntan «¿por qué .NET?» → «Solo para tener un servidor local de pruebas; la aplicación publicada es HTML, CSS y JavaScript estáticos».

## 2. Git: la máquina del tiempo del proyecto
**Git** guarda **versiones** de todos los archivos. Cada versión guardada se llama **commit** y lleva un mensaje («cinemática», «corrección en modo foto…»).
- Sirve para **volver atrás** si algo se daña, para ver **qué cambió** y **quién** lo cambió.
- Es como el «guardar» de un videojuego, pero con historial completo.

Palabras clave:
| Palabra | Significa |
|---|---|
| **Repositorio (repo)** | La carpeta del proyecto con todo su historial |
| **Commit** | Una «foto» guardada de los cambios, con mensaje |
| **Push** | Subir los commits a GitHub |
| **Pull** | Bajar los cambios de GitHub |
| **Branch (rama)** | Una línea de trabajo; aquí usamos solo `main` |
| **main** | La rama principal (la que se publica) |

Para ver el historial real de tu proyecto: `git log` (hay unos 16 commits). Los de **12 de octubre** son de `jusstjuanda` (la versión inicial); los demás son tuyos (`hachescc`).

## 3. GitHub y GitHub Desktop
- **GitHub** es una página web que **guarda repositorios Git** en internet (tu proyecto: `github.com/jusstjuanda/pajaro-uao`, público).
- **GitHub Desktop** es el programa de escritorio con botones («Commit», «Push origin») para no usar comandos. Tu flujo era: **escribir mensaje → Commit to main → Push origin**.
- Regla acordada: **tú haces los commits y el push**, nunca la IA. Así tú controlas qué se publica.

## 4. GitHub Pages: el hosting gratuito
**Pages** convierte un repositorio en una **página web pública**. Se activa en la configuración del repo («Source: GitHub Actions»). Cada vez que haces push, se vuelve a publicar.

### La «receta» automática: `.github/workflows/pages.yml`
```yaml
name: Publicar en GitHub Pages
on:
  push:
    branches: [main]        # se activa cada vez que subes cambios a main
jobs:
  deploy:
    runs-on: ubuntu-latest  # usa una computadora virtual de GitHub
    steps:
      - uses: actions/checkout@v4              # 1. descarga tu código
      - uses: actions/configure-pages@v5       # 2. prepara Pages
      - uses: actions/upload-pages-artifact@v3
        with: { path: PaginaPajaro/wwwroot }   # 3. empaqueta SOLO la carpeta wwwroot
      - uses: actions/deploy-pages@v4          # 4. la publica
```
- Es **GitHub Actions**: «automatizaciones» que corren solas. Aquí: cada push → copia `PaginaPajaro/wwwroot` → la publica en `https://jusstjuanda.github.io/pajaro-uao/`.
- Tarda ~20 segundos. El navegador puede tardar hasta 10 min en refrescar (caché): **Ctrl + Shift + R**.
- **Rutas relativas:** como la página vive en `/pajaro-uao/` (no en la raíz), todos los enlaces del proyecto son relativos (`img/…`, `js/…`) y por eso funcionan ahí.

## 5. Qué es `.gitignore`
Un archivo que dice qué **no** se sube a Git. En tu proyecto, `.claude/` (herramientas locales de pruebas de la IA) no se sube.

## 6. Las librerías externas
Una **librería** es código hecho por otros que reutilizas.
- **three.js 0.160** → el 3D. Se carga de un **CDN** (`cdn.jsdelivr.net`) por el `importmap`; **no está dentro del proyecto**.
- **Google Fonts (Fraunces e Inter)** → las tipografías; también por internet.
- Todo lo demás (aves, campus, sonido, quiz, página) lo **escribimos nosotros**.
- **npm** (el gestor de paquetes de Node) **no se usa**: no hay `node_modules` ni paso de «compilar». El código que ves en el repo es exactamente el que corre en el navegador.

## 7. Las herramientas del navegador (DevTools)
Con `F12` (o clic derecho → Inspeccionar) se abre un panel con:
- **Elements** → ver el HTML y CSS de lo que estás viendo; probar cambios en vivo.
- **Console** → mensajes y errores de JavaScript; ejecutar código.
- **Network** → qué archivos descargó y cuánto tardaron.
- **Application → Local Storage** → ver lo que guardó la libreta.
- **Dispositivo móvil** (ícono de celular) → simula una pantalla de celular (pero **no** da giroscopio ni cámara reales).

## 8. Cómo se probó el proyecto
- En el computador, con la vista previa de pruebas (servidor local en `localhost`), simulando tamaños de celular.
- **En celulares reales (Android e iPhone) lo probó el equipo** (tú y tus compañeros): cámara, giroscopio, permisos.
- Se usaron «ganchos de prueba» (`window.RA._prueba`) para recorrer todos los modos por código, medir cuántos triángulos y objetos se dibujan, y comprobar que **ninguna ave se cruza** con otra.
- Qué NO se pudo probar desde el computador: cámara real, giroscopio, WebXR y audio al oído. Eso depende del celular.

## 9. El flujo de trabajo con la IA (Claude Code)
1. Tú describes lo que quieres (en lenguaje normal, con capturas y fotos).
2. La IA propone, escribe el código y lo prueba en la vista previa.
3. Tú revisas, aprobas o corriges («las comillas raras», «la rampa es maciza»).
4. Repiten.
5. **Tú** haces el commit y el push.

La IA mantuvo **tres documentos de memoria** (`BITACORA_PAJARO.md`, `ESTADO_ACTUAL.md`, `CLAUDE.md`) para no olvidar el contexto entre sesiones largas. Eso es una buena práctica que puedes mencionar: **documentación del proceso**.

## Para decirle al profesor
> «Usamos Git para el control de versiones y GitHub para alojar el repositorio. Cada push a la rama principal dispara una GitHub Action que publica la carpeta `wwwroot` en GitHub Pages con HTTPS. Las librerías externas son solo three.js y las tipografías, que se cargan por CDN; el resto del código lo escribimos nosotros.»

## Autoevaluación
1. ¿Qué es un commit? ¿Y un push?
2. ¿Qué hace `pages.yml`?
3. ¿Por qué hay archivos de .NET si la web no usa .NET?
4. ¿Qué es un CDN y qué librería se carga de ahí?
5. ¿Qué cosas NO se pueden probar desde un computador?
