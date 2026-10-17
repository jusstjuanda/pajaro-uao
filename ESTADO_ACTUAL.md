# ESTADO ACTUAL — Aves UAO (archivo VIVO: se reescribe libremente)

> Este archivo es el «tablero de hoy»: qué falta, qué está sin commit y cuál es el siguiente paso. **El historial completo, las decisiones y lo descartado viven en `BITACORA_PAJARO.md` (permanente, no se borra nada).** Al terminar cada tarea: actualizar este archivo y añadir una entrada fechada a la sección 12 de la bitácora si algo importante cambió.
> Última actualización: **2026-10-16 (noche, ronda 3)**. Pitch: **sábado 2026-10-17, 8:00 a.m.** (lo preparan otros compañeros).

## 1. Dónde estamos
**Toda la lista obligatoria está hecha**, incluido el **recorrido 3D por el campus dentro de la RA** (el «video»): botón con icono de video arriba a la derecha, junto a ⟲. Hugo lo vio y le **fascinó**; ya commiteó la versión anterior (`c0e8b39` «cinemática») y pidió una **última ronda de detalles** (ronda 3, abajo) para dejarlo listo. La app está probada por el equipo en **Android e iOS**; el recorrido **aún no se ha probado en un celular real**.

## 2. Archivos SIN commit (Hugo los sube con GitHub Desktop)
- `PaginaPajaro/wwwroot/js/ra/campus-real.js` (ronda 3) y la documentación (`BITACORA_PAJARO.md`, `ESTADO_ACTUAL.md`).
- No queda ninguna página temporal. Tras publicar: Ctrl+Shift+R (Pages cachea 10 min).

## 3. Ronda 3 (hecha, pendiente de que Hugo la vea y la suba)
- Las **gradas de UAO Labs son horizontales** (bajan de lado a lado hacia el centro, donde está la entrada) y son macizas; las **rampas son macizas** (cuña de ladrillo, no hueco por debajo).
- **Canchas del parque frente a la Portería 3 en horizontal** (largo a lo ancho del campus).
- **Lago:** 8 árboles frondosos alrededor (los que no estorban a la cámara), 16 piedras grandes y **2 bancas** mirando al agua.
- Se pavimentó el pie de la fachada de Labs.

## 4. Lo que falta
1. **Probar el recorrido en un celular real** (rendimiento: ~236 mil triángulos en total y ~200 mil por vista; el campus tarda ~1,6 s en construirse en el PC y más en el celular, con el aviso «Preparando el recorrido…»; giroscopio y audio). Si va lento: bajar los árboles (`n < 235` en `vegetacion`) o `setPixelRatio(1.5)` → 1 en `ra.js`.
2. **Antes del pitch:** publicar, recargar forzado y probar en un celular: Avistar (12 aves), Binoculares, Llamar, Comedero, Foto, Quiz (2 vidas), libreta y el recorrido (ver, arrastrar o mover el celular, «Saltar», volver a la RA).
3. **Fase final de valor añadido** (extras pospuestos, bitácora §8) **solo con la elección de Hugo**. Recomendación de Claude: A1 three.js local (que la RA no dependa del Wi-Fi del salón), D1 foto de campo con marco UAO, B1 pictogramas y enlaces a WikiAves, C1 quiz con foto real del campus.
4. Opcional: oír los cantos sintéticos de mirla, garza y garrapatero junto a WikiAves (Hugo dijo que **«los sonidos le gustan»**).

## 5. Decisiones abiertas / cosas por confirmar con Hugo
- Textos propios añadidos con el recorrido (por si quiere cambiarlos): rótulos («Recorrido por el campus UAO», «Portería 1», «Edificio Central», «El Arco Central», «UAO Labs», «El Ágora y las palmas», «Aulas 1, 2, 3 y 4», «El lago», «La cafetería», «Portería 3», «El parque y el parqueadero», «Las canchas»), botón «Saltar», ayudas «Arrastra para mirar alrededor» / «Mueve el celular o arrastra para mirar alrededor», avisos «Preparando el recorrido…», «Recorrido omitido. Seguimos en la RA.», «Fin del recorrido. Seguimos en la RA.», «El recorrido no está disponible durante el quiz.».
- Puntos de la rúbrica que quedan «parciales» (ya hablados): los cantos son sintéticos (no grabaciones), 8 de las 12 aves RA no tienen foto real en su ficha (la guía solo trae 12 fotos) y la RA muestra 12 de las 84 especies.

## 6. Para el pitch (checklist de seguridad)
- La RA depende de internet para cargar three.js y las fuentes (CDN): si el Wi-Fi del salón falla, usar datos móviles (o hacer el extra A1).
- El modo simulado (sin cámara) sirve para proyectar en el computador: arrastrar para mirar; el recorrido también funciona ahí.
- Durante el quiz el botón del recorrido está atenuado y avisa que no está disponible (a propósito, para no perder la partida).

## 7. Cómo mantener este archivo
Reescribirlo completo cada vez que cambie el estado (no acumular historia aquí). Lo que se decide, se hace, se descarta o se aprende → entrada fechada en la bitácora permanente.
