# ESTADO ACTUAL — Aves UAO (archivo VIVO: se reescribe libremente)

> Este archivo es el «tablero de hoy»: qué falta, qué está sin commit y cuál es el siguiente paso. **El historial completo, las decisiones y lo descartado viven en `BITACORA_PAJARO.md` (permanente, no se borra nada).** Al terminar cada tarea: actualizar este archivo y añadir una entrada fechada a la sección 12 de la bitácora si algo importante cambió.
> Última actualización: **2026-10-16 (tarde)**. Pitch: **sábado 2026-10-17, 8:00 a.m.** (lo preparan otros compañeros).

## 1. Dónde estamos
Toda la lista de pulido y la lista obligatoria están **hechas y probadas**, salvo el **video (cinemática 3D)**. La app está probada por el equipo en **Android e iOS** (funciona).

## 2. Archivos SIN commit (Hugo los sube con GitHub Desktop)
- `PaginaPajaro/wwwroot/js/ra/ra.js` (quiz nuevo: 2 vidas, 20 por partida, banco de aves + ecología + entorno UAO; `tocarOpcionQuiz`; limpieza al salir del quiz)
- `PaginaPajaro/wwwroot/js/ra/aves3d.js` (`tarjeta()` para las respuestas en 3D)
- `PaginaPajaro/wwwroot/css/estilos.css` (corazones de vidas, veredicto y dato curioso)
- `PaginaPajaro/wwwroot/index.html` (símbolo `#i-corazon`; texto nuevo de la tarjeta «6. Quiz RA»)
- `PaginaPajaro/wwwroot/js/app.js` (libreta: mejor quiz = número de aciertos; Guardián desde 10)
- `PaginaPajaro/wwwroot/js/sonido.js` (cantos de mirla, garza y garrapatero ajustados)
- `BITACORA_PAJARO.md`, `ESTADO_ACTUAL.md`, `CLAUDE.md` (documentación; no se publica en la web)
Ya subidos: todo lo anterior (últimos commits: `7887904` paso 6, `9c5eeb3` foto y 12 aves). Tras publicar: Ctrl+Shift+R.

## 3. Lo que falta (lista obligatoria)
1. **Video → cinemática 3D dentro de la RA.** Detalle de la idea de Hugo y del enfoque propuesto en `BITACORA_PAJARO.md` §9.1. **Siguiente paso inmediato:** mostrarle a Hugo **cómo la haría** (recorrido, aves volando, arrastrar para mirar en 360°, botón «Saltar», volver a la RA donde estaba) y esperar su OK antes de implementar. Debe ir aislada en un modo/botón nuevo para no romper nada.
2. Después, **fase final**: extras de valor añadido (lista en bitácora §8, pospuestos) **solo con la elección de Hugo**.

## 4. Decisiones abiertas / cosas por confirmar con Hugo
- ¿Los cantos sintéticos de mirla, garza y garrapatero suenan bien al compararlos con WikiAves? (ids en bitácora §4). Si alguno no, que diga cuál y cómo.
- Ninguna otra decisión pendiente: créditos de la guía = como están; sin sellos; sin cantos reales; sin extras por ahora.

## 5. Para el pitch (checklist de seguridad, por si ayuda a Hugo)
- Publicar el último commit y probar la página publicada (recarga forzada) en un celular: Avistar (12 aves), Binoculares, Llamar, Comedero, Foto (la fecha ya no se pega), Quiz (2 vidas), libreta (mejor quiz = número).
- La RA depende de internet para cargar three.js y las fuentes (CDN): si el Wi-Fi del salón falla, usar datos móviles. (Idea pospuesta: three.js local, bitácora §8 A1.)
- El modo simulado (sin cámara) sirve para proyectar en el computador: arrastrar para mirar.

## 6. Cómo mantener este archivo
Reescribirlo completo cada vez que cambie el estado (no acumular historia aquí). Lo que se decide, se hace, se descarta o se aprende → entrada fechada en la bitácora permanente.
