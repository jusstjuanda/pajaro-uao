# Bitácora — Aves UAO (antes «Pájaro»): aves del campus UAO en Realidad Aumentada

> **Para el siguiente Claude:** léelo entero antes de tocar nada. Versión reescrita el 2026-10-16 (la versión larga desapareció del disco después del commit `70675b1`; esta es la versión compacta, con todo lo esencial). Pitch ante jurados: **sábado 2026-10-17, 8:00 a.m.**
> La bitácora original del compañero (12-oct) sigue en `C:\Users\hugot\Downloads\_TEMP\BITACORA_PAJARO.md`.

## 1. Proyecto
App web de RA (three.js 0.160 puro, sin A-Frame) con las aves del campus UAO (Cali), basada en la Guía ilustrada de aves UAO 2023. Sitio estático en `PaginaPajaro/wwwroot`. Página: https://jusstjuanda.github.io/pajaro-uao/ · Repo: github.com/jusstjuanda/pajaro-uao (rama `main`; cada push publica en Pages en ~20 s; caché 10 min → recarga forzada). Hugo (Ing. Multimedia UAO, principiante en web, git `hachescc`) entró al final a corregirla. Rúbrica Parcial 2: RA como núcleo, quiz en RA, ≥ 5 interacciones (hay 7: Avistar, Binoculares, Llamar, Comedero, Foto, Quiz, Tamaño real/WebXR), sonidos/animaciones, Android/iOS por web.
Archivos: `index.html`, `css/estilos.css`, `galeria3d.html`, `js/app.js` (guía, libreta `localStorage` clave `pajaro-uao-libreta`), `js/ra/ra.js` (motor RA), `js/ra/aves3d.js` (aves/soportes 3D), `js/especies-ra.js` (12 aves; campo `genero:"f"` en mirla y garza), `js/datos-uao.js`, `js/sonido.js`, `js/escena.js` (amanecer de la portada), `img/aves/*.png` (renders de la libreta; **se generan de los modelos 3D**), `img/uao/*`, `img/logo-uao.png`, `img/deco/{hojas.webp,arco-palmas.svg}`.

## 2. Reglas de trabajo con Hugo (obligatorias)
- Un paso a la vez; explicar antes de cambiar; al terminar, parar y mostrar antes/después; esperar su «ok» (si el ok llega junto con la siguiente orden, seguir).
- **Probar en la vista previa local** antes de decir «listo»; decir qué NO se pudo probar.
- **Claude NO hace commits ni push**: los hace Hugo con GitHub Desktop (incluir los archivos nuevos).
- Prioridad: que todo funcione antes que bonito. Explicar simple, en español.
- No quitar contenido ni imágenes. **No cambiar estilo, fuentes ni colores.** Textos propios solo con su OK; los de la guía UAO nunca. Portada (amanecer + pájaros) no se toca salvo lo que él pida.
- Revisar siempre centrado/alineación de lo que se toque.
- Proponer opciones si el diseño es ambiguo.

## 3. Estado (2026-10-16)
- **Commit `70675b1` (Hugo) ya incluye los pasos 1–5.** Antes: bugs 1–3 (`d344db5`, `1e044ed`, `0224502`) y fase 2 (`2dee1e0`).
- **SIN commit** (hecho y probado después de ese commit): hojas continuas (`<div class="hojas">` en index.html + `.hojas::before` en estilos.css, reemplaza `.con-hojas`), arco de palmas con `viewBox 0 0 1000 560` (toca la barra), y `js/escena.js` sin los rectángulos de «edificios» (parecían un árbol cortado en recto). Este archivo también es nuevo.
- Las propuestas de diseño A (kicker de la portada en mayúsculas), B (glow del botón principal), C (fade-up `.revelar`) **solo están anotadas**: Hugo está satisfecho y no las pidió.

## 4. Qué se hizo y dónde
- **Bug 1 árboles** (`ra.js`): `crearPalmera`, `crearArbol`, `radioDe`, `distanciaAlEdificio`, `EDIFICIOS`, `plantarArboles` (semilla fija, sin cruces).
- **Bug 2 binoculares** (`estilos.css` `.ra-binoculares`): `--lente`/`--sep`, las lentes siempre se solapan al centro.
- **Bug 3 soportes** (`aves3d.js` `crearSoporte`, `crearAve(e,conSoporte)`; `ra.js` `ponerSoporte/quitarSoporte`): son objetos del mundo, no viajan con el ave.
- **Fase 2**: íconos SVG (sprite en index.html), sin mayúsculas espaciadas, grillas asimétricas, libreta con renders 3D de las 12 aves, mosaico de jornadas, logo de barra arreglado.
- **Marca**: «Aves UAO» + logo (`h1`, barra, pie), Fraunces 900, logo `.7em` con `top:.015em`.
- **Llamar** (`ra.js`): `MAX_AVES=6`, `hacerLugar`, un ejemplar por especie, `despues/cancelarPendientes`.
- **Sin cruces** (`ra.js`): `cabe`, `sitioLibre`, `sitioComedero`, `radioSoporte`; charco `agua()` Ø5,2.
- **Paso 5**: aviso del quiz abajo (`aviso(texto,ms,abajo)`), ficha se cierra al cambiar de modo, `body.ra-en-quiz` oculta el botón XR, etiquetas de binoculares reescritas (`actualizarMarcas`: dentro de pantalla, texto en líneas, sin pisarse, con línea), concordancia La Garza/La Mirla (`fem()`), buscador por palabras (`app.js`), galería 3D en celular (2 columnas en vertical), `salir()` reinicia el zoom, tope de aves en WebXR.

## 5. Pruebas: qué sí y qué no
Sí: vista previa del PC (modo simulado), celular emulado 375×812 y escritorio 1100×760; Quiz 5/5, Llamar ×8, etiquetas de las 12 aves (0 cruces), salir/reentrar, buscador, galería. **No**: celular real (cámara, giroscopio, audio), iPhone, WebXR/Tamaño real (el botón XR y el tope de aves se probaron solo simulando). Hugo no ha reportado pruebas en su celular: **pendiente probar en Android/iPhone con la página publicada.**

## 6. PARA MAÑANA (sesión nueva)
1. **Paso 6 — mejoras gráficas de la RA:** aves y soportes menos low-poly, campus simulado más completo (fuentes, vegetación, suelo con detalle, llenar vacíos). Proponer opciones y mostrar antes/después. Cuidar rendimiento en celular y no romper `plantarArboles`/`sitioLibre`/`sitioComedero`. Si cambian los modelos de las aves, **regenerar `img/aves/*.png`** (servidor `pajaro-guardar`, puerto 5147; apagarlo después).
2. **Fase final:** ver con Hugo si hay algo más de valor (lista de él; no inventar).
3. Pendientes heredados: probar en celular real, colaboradores del repo, video corto (opcional), guion del pitch, QR del enlace.

## 7. Cómo probar en local
El PC no tiene .NET 10 ni Node ni Python. Servidor estático en PowerShell: `.claude/servidor.ps1` con la configuración `pajaro-local` (puerto 5146) de `.claude/launch.json` (`.claude/` no se sube; ahí están las capturas `.claude/capturas/`). Mostrar el panel `preview` al empezar; si no corre `requestAnimationFrame`, usar un shim con `setTimeout`. Para escritorio: `document.documentElement.style.zoom = innerWidth/1100` y `.hero` `height = innerHeight/zoom`; celular: `resize_window` preset mobile y luego desktop. Con `scroll-behavior:smooth` usar `scrollBehavior='auto'`. Ganchos de prueba: `window.RA._prueba` (`estado`, `tocarPrimera`, `tocarCorrecta`, `mirarA(i, alto)`).
