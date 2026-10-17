# Aves UAO — instrucciones para Claude (léelas SIEMPRE al empezar)

Proyecto: app web de Realidad Aumentada (three.js) con las aves del campus de la UAO, para el Parcial 2 de Fundamentos de Realidad Virtual. Sitio estático en `PaginaPajaro/wwwroot`. Pitch: sábado 2026-10-17, 8:00 a.m.

**FASE ACTUAL (2026-10-16 noche): el código está CERRADO y la fase de valor agregado está EN STANDBY.** Lo que sigue es una **sesión de repaso privada** para que Hugo pueda **sustentar** el proyecto (pitch el sábado 2026-10-17, 8:00 a.m.): explícale todo desde cero (asume que **no sabe programar**: qué es un `.js`, qué es three.js, WebGL, giroscopio, WebXR, git…), usando **`SUSTENTACION.md`** (glosario, mapa de archivos, cómo funciona, decisiones, relación con Fundamentos de Realidad Virtual, preguntas probables del profesor y respuestas, cómo hablar de la IA con honestidad). No propongas cambios ni extras salvo que Hugo los pida; si encuentra un bug, corrígelo con prueba.

**Antes de tocar nada, lee en este orden:**
1. `ESTADO_ACTUAL.md` — qué falta y qué hay sin commit (archivo vivo).
2. `BITACORA_PAJARO.md` — memoria completa y permanente: reglas, historial, decisiones, lo descartado, arquitectura. **No se borra nada de ella**; los cambios importantes se añaden con fecha en su sección 12.

**Reglas de oro (detalle en la sección 2 de la bitácora):**
- Hugo es principiante: explica simple y en español. Una tarea a la vez; muestra antes/después y espera su OK.
- **No hagas commits ni push**: los hace Hugo con GitHub Desktop.
- Prueba en la vista previa local antes de decir «listo» y di qué no pudiste probar. Prioridad: que todo siga funcionando.
- No cambies estilo, fuentes ni colores; no quites contenido; textos propios solo con su OK; nunca los textos de la guía UAO; la portada no se toca salvo que él lo pida.
- Si el diseño es ambiguo, propón opciones y espera su elección. Revisa siempre alineaciones y que nada se salga de los márgenes.
- No propongas lo descartado (bitácora §8) ni los extras de valor añadido hasta que lo obligatorio esté cerrado.
- Al terminar cada tarea: actualiza `ESTADO_ACTUAL.md` (reescribible) y añade una entrada fechada a la bitácora si algo importante cambió. La memoria de `~/.claude/projects/.../memory/` es solo un resumen: manda la bitácora.
