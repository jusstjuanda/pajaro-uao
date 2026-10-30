# ESTADO ACTUAL — Aves UAO (archivo VIVO: se reescribe libremente)

> Este archivo es el «tablero de hoy»: qué falta, qué está sin commit y cuál es el siguiente paso. **El historial completo, las decisiones y lo descartado viven en `BITACORA_PAJARO.md` (permanente, no se borra nada).** Al terminar cada tarea: actualizar este archivo y añadir una entrada fechada a la sección 12 de la bitácora si algo importante cambió.
> Última actualización: **2026-10-16 (noche, repaso)**. Pitch: **sábado 2026-10-17, 8:00 a.m.** (lo preparan otros compañeros).

## 1. Dónde estamos
**Toda la lista obligatoria está hecha**, incluido el **recorrido 3D por el campus dentro de la RA** («Cinemática»). Hugo ya commiteó la cinemática (`c0e8b39`) y pidió una última ronda de ajustes (ronda 4, abajo). **La fase final de valor agregado está EN STANDBY** (decisión de Hugo, 2026-10-16 noche): no se empieza ni se propone nada hasta que el equipo confirme si se agrega más valor. Las opciones disponibles siguen guardadas en la bitácora §8 (A1 three.js local, A2 modo demo guiado, A3 video de respaldo, B1–B3, C1–C3, D1–D3, E1–E4) y la recomendación de Claude, si se retoma: A1, D1, B1 y C1.

**SIGUIENTE PASO: sesión de repaso/sustentación con Hugo** (él es principiante y debe poder explicar el proyecto al profesor). Material listo: **`REPASO/`** (24 capítulos «a prueba de tontos», empieza en `REPASO/00_EMPIEZA_AQUI.md`; HTML/CSS/JS desde cero, aves, animaciones, RA, sonido, quiz, campus, cinemática, rendimiento, historia, decisiones y alternativas —incluido «¿por qué no A-Frame?»—, materia de RV, quién hizo qué y la IA, +100 preguntas, glosario y ejercicios) y el resumen rápido **`REPASO/SUSTENTACION.md`** (Hugo lo movió ahí el 2026-10-17). Con Hugo falta: (1) explicarle capítulo por capítulo (en curso desde el 2026-10-17, tras aclararle «A-Frame vs lo que tenemos») y hacerle preguntas de práctica; (2) averiguar **qué temas vio exactamente en la materia** para ajustar el cap. 19 y la sección 7 de `REPASO/SUSTENTACION.md`; (3) ofrecerle repasar los comentarios «típicos de IA» del código (solo si él lo pide: es editar código a la víspera del pitch y hay que probarlo); (4) recordarle **preguntar al compañero que hizo la primera versión** por qué eligió three.js (no consta) y si usó IA, para contar todos la misma historia.

## 2. Archivos SIN commit (Hugo los sube con GitHub Desktop)
- **Código: nada pendiente.** La ronda 4 (`5018981`) y las correcciones finales (`4d53ff5`: ancla `#guia`, texto del panel de Llamar, comillas de una pista, `SUSTENTACION.md`) ya están commiteadas por Hugo.
- **Documentación nueva o cambiada (sin commit):** la carpeta **`REPASO/`** (24 archivos nuevos), `SUSTENTACION.md` (Hugo lo movió a `REPASO/SUSTENTACION.md`; git lo muestra como borrado en la raíz + archivo nuevo, es normal), `BITACORA_PAJARO.md`, `ESTADO_ACTUAL.md` y `CLAUDE.md`. Recordarle que incluya `REPASO/` al commitear (GitHub Desktop la muestra como archivos nuevos). Son solo documentos: **no cambian la web publicada**.
- No queda ninguna página temporal. Tras publicar: Ctrl+Shift+R (Pages cachea 10 min).

## 3. Ronda 4 (hecha y commiteada por Hugo: `5018981`)
- **Botón «Cinemática» con protagonismo:** ahora es el 7.º botón de la barra de abajo de la RA (color coral, icono de video y la palabra «Cinemática», con un pulso suave las primeras veces). Se quitó el botoncito de arriba. No es un modo: no cambia de modo, lanza la cinemática. En el quiz sigue atenuado y avisa que no está disponible. Probado que los 7 botones caben sin cortarse a 320, 375 px y escritorio.
- **Velocidad en la cinemática:** botón «×1 / ×2 / ×4» junto a «Saltar» (arriba a la derecha). Solo acelera el avance de la cámara; aves y fuentes siguen a su ritmo. Vuelve a ×1 en cada recorrido.
- **Lago más frondoso:** hasta 30 árboles grandes alrededor (los que no estorban a la cámara), enredaderas colgando de las copas, matas y arbustos densos en la orilla (algunos con flor magenta), además de las piedras y las 2 bancas. La cámara pasa algo más alta por el lago.

## 3b. Correcciones del final (2026-10-16 noche)
- **Texto del panel de Llamar** (a pedido de Hugo, sonaba a IA y llevaba comillas «»): ahora dice «Toca un canto y el ave que lo reconoce vendrá volando. En la vida real, reproducir cantos grabados muy seguido puede estresar a las aves.» También se quitaron las comillas «» de la pista del Bichofué («bi-cho-fué» → "bi-cho-fué"). Los textos de la guía (`datos-uao.js`) conservan sus «» porque son de la guía y no se tocan.
- **Bug «en computador abre directo en la guía»:** no era un fallo del código sino la **dirección con `#guia`** (el menú «Guía UAO» y el botón «Explorar la guía» la agregan; el navegador la autocompleta aunque sea incógnito). Reproducido abriendo `/#guia` (cae en y≈2000). **Arreglo:** un script pequeño en el `<head>` de `index.html` borra el ancla al cargar y sube arriba; el menú sigue funcionando después. Probado a 1440×900 en local; ya commiteado (`4d53ff5`): en la web publicada se ve tras el deploy y Ctrl+Shift+R.

## 4. Lo que falta
1. ~~Probar el recorrido en un celular real~~ **HECHO**: Hugo confirmó (2026-10-17) que **todo se probó en celulares reales**, cinemática incluida. Solo falta, si se quiere, una cifra de cuadros por segundo (no se midió; la prueba fue funcional). Si fuera lento: bajar los árboles (`n < 235` en `vegetacion`, `plantados.length < 30` en el lago) o `setPixelRatio(1.5)` → 1 en `ra.js`.
2. **Antes del pitch:** publicar, recargar forzado y repasar en el celular que se usará: Avistar (12 aves), Binoculares, Llamar, Comedero, Foto, Quiz (2 vidas), libreta y la Cinemática (ver, arrastrar o mover el celular, ×2/×4, «Saltar», volver a la RA).
3. **Fase final de valor añadido: en standby** hasta que el equipo confirme (ver sección 1).
4. Opcional: oír los cantos sintéticos de mirla, garza y garrapatero junto a WikiAves (a Hugo le gustan los sonidos).

## 5. Decisiones abiertas / cosas por confirmar con Hugo
- Textos propios añadidos con el recorrido (por si quiere cambiarlos): botón «Cinemática», «Saltar», «×1/×2/×4», rótulos («Recorrido por el campus UAO», «Portería 1», «Edificio Central», «El Arco Central», «UAO Labs», «El Ágora y las palmas», «Aulas 1, 2, 3 y 4», «El lago», «La cafetería», «Portería 3», «El parque y el parqueadero», «Las canchas»), ayudas «Arrastra para mirar alrededor» / «Mueve el celular o arrastra para mirar alrededor», avisos «Preparando el recorrido…», «Recorrido omitido. Seguimos en la RA.», «Fin del recorrido. Seguimos en la RA.», «El recorrido no está disponible durante el quiz.».
- Puntos de la rúbrica que quedan «parciales» (ya hablados): los cantos son sintéticos (no grabaciones), 8 de las 12 aves RA no tienen foto real en su ficha (la guía solo trae 12 fotos) y la RA muestra 12 de las 84 especies.

## 6. Para el pitch (checklist de seguridad)
- La RA depende de internet para cargar three.js y las fuentes (CDN): si el Wi-Fi del salón falla, usar datos móviles (o hacer el extra A1 si se retoma la fase final).
- El modo simulado (sin cámara) sirve para proyectar en el computador: arrastrar para mirar; la cinemática también funciona ahí.

## 7. Cómo mantener este archivo
Reescribirlo completo cada vez que cambie el estado (no acumular historia aquí). Lo que se decide, se hace, se descarta o se aprende → entrada fechada en la bitácora permanente.
