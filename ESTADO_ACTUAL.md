# ESTADO ACTUAL — Aves UAO (archivo VIVO: se reescribe libremente)

> Este archivo es el «tablero de hoy»: qué falta, qué está sin commit y cuál es el siguiente paso. **El historial completo, las decisiones y lo descartado viven en `BITACORA_PAJARO.md` (permanente, no se borra nada).** Al terminar cada tarea: actualizar este archivo y añadir una entrada fechada a la sección 12 de la bitácora si algo importante cambió.
> Última actualización: **2026-10-16 (noche)**. Pitch: **sábado 2026-10-17, 8:00 a.m.** (lo preparan otros compañeros).

## 1. Dónde estamos
Toda la lista de pulido y la lista obligatoria están **hechas y probadas**, incluido el **video → recorrido 3D por el campus dentro de la RA** (botón nuevo arriba a la derecha, icono de video, junto a ⟲). La app está probada por el equipo en **Android e iOS** (funciona; el recorrido nuevo **aún no se ha probado en un celular real**).

## 2. Archivos SIN commit (Hugo los sube con GitHub Desktop)
- **Nuevos:** `PaginaPajaro/wwwroot/js/ra/campus-real.js` (campus fiel al real) y `PaginaPajaro/wwwroot/js/ra/recorrido.js` (cámara, aves, rótulos, arrastre, «Saltar»).
- **Modificados:** `js/ra/ra.js` (botón, pausa/reanudación de la RA, cola de pendientes, arrastre, giroscopio relativo), `index.html` (botón `#ra-recorrido` + símbolo `#i-recorrido`), `css/estilos.css` (barra superior en rejilla, `.ra-der`, estilos `.ra-recorrido`), `js/ra/fusion.js` (conserva colores por vértice al fusionar mallas ya fusionadas), `js/ra/campus.js` (solo exporta `crearArbol`/`crearPalmera`).
- `BITACORA_PAJARO.md`, `ESTADO_ACTUAL.md` (documentación; no afecta la web).
- La página temporal `_recorrido.html` **ya se borró** (no hay que subir nada más).
Ya subidos: todo lo anterior (último commit `90f3647`). Tras publicar: Ctrl+Shift+R (Pages cachea 10 min).

## 3. Lo que falta
1. **Que Hugo vea la versión corregida del recorrido** (ronda 2: cartel rojo al otro lado, UAO Labs como sótano con gradas y rampas y nivel alto en el norte, seto del Ágora girado, letrero de la Portería 3 arreglado, parque con parqueadero frente a la Portería 3; ver bitácora §6.10) y diga si algo más hay que ajustar.
2. Probar en un **celular real** (rendimiento: ~210 mil triángulos y ~140–270 llamadas de dibujo; el campus tarda ~1–4 s en construirse la primera vez, con el aviso «Preparando el recorrido…»). Si va lento: bajar árboles (`n < 210` en `vegetacion`) o `setPixelRatio(1.5)` → 1.
3. Después, **fase final**: extras de valor añadido (lista en bitácora §8, pospuestos) **solo con la elección de Hugo**.

## 4. Decisiones abiertas / cosas por confirmar con Hugo
- ¿Los cantos sintéticos de mirla, garza y garrapatero suenan bien al compararlos con WikiAves? (ids en bitácora §4).
- Textos propios que se añadieron con el recorrido (por si quiere cambiarlos): rótulos de lugar («Recorrido por el campus UAO», «Portería 1», «Edificio Central», «El Arco Central», «UAO Labs», «El Ágora y las palmas», «Aulas 1, 2, 3 y 4», «El lago», «La cafetería», «Portería 3», «El parque y el parqueadero», «Las canchas»), botón «Saltar», ayuda «Arrastra para mirar alrededor» / «Mueve el celular o arrastra para mirar alrededor», avisos «Preparando el recorrido…», «Recorrido omitido. Seguimos en la RA.», «Fin del recorrido. Seguimos en la RA.», «El recorrido no está disponible durante el quiz.».

## 5. Para el pitch (checklist de seguridad, por si ayuda a Hugo)
- Publicar el último commit y probar la página publicada (recarga forzada) en un celular: Avistar (12 aves), Binoculares, Llamar, Comedero, Foto, Quiz (2 vidas), libreta, **y el recorrido (botón de video arriba a la derecha: ver, arrastrar/mover el celular, «Saltar», volver a la RA)**.
- La RA depende de internet para cargar three.js y las fuentes (CDN): si el Wi-Fi del salón falla, usar datos móviles. (Idea pospuesta: three.js local, bitácora §8 A1.)
- El modo simulado (sin cámara) sirve para proyectar en el computador: arrastrar para mirar; el recorrido también funciona ahí.
- Durante el quiz el botón del recorrido está atenuado y avisa que no está disponible (a propósito, para no perder la partida).

## 6. Cómo mantener este archivo
Reescribirlo completo cada vez que cambie el estado (no acumular historia aquí). Lo que se decide, se hace, se descarta o se aprende → entrada fechada en la bitácora permanente.
