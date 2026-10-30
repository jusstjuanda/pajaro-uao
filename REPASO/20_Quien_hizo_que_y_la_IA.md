# 20 · Quién hizo qué, y cómo hablar de la IA (con honestidad)

## Resumen en 1 minuto
**La verdad simple:** el código lo escribió una **IA de programación** (Claude Code, de Anthropic) **dirigida por Hugo**; la **primera versión** (12 de octubre) la publicó un compañero (`jusstjuanda`). Hugo **decidió, aportó el material del campus, probó en celulares, corrigió y aprobó cada cambio**. Eso **no es nada vergonzoso si se dice con claridad**; lo vergonzoso sería **negarlo o no poder explicar lo que se entregó**. Este capítulo te da: la lista de quién hizo qué (con pruebas), qué es «vibe coding» y dónde cae el proyecto, cómo responder las preguntas incómodas sin mentir, y qué hacer con los comentarios del código que «suenan a IA».

> **Principio:** no mientas, no minimices y no sobrevendas. Di **qué hizo la IA, qué hicieron ustedes y qué entienden**. Un jurado respeta mucho más a quien dice «la IA escribió esto y yo puedo explicártelo» que a quien jura haberlo escrito todo y no sabe qué es un `.js`.

---

## 1. Las personas
| Quién | Qué sabemos (con fuente) |
|---|---|
| **Hugo** (usuario Git `hachescc`) | Estudiante de Ing. Multimedia (UAO). Dirigió el trabajo del **15 al 16 de octubre**: pidió las correcciones, eligió entre opciones, aportó material, probó y aprobó. **Hace todos los commits** con GitHub Desktop |
| **`jusstjuanda`** (compañero) | Es el **dueño del repositorio** en GitHub y publicó la **primera versión el 12 de octubre** (2 commits). Su bitácora original está en tu carpeta `_TEMP` |
| **Sebastián Montero** (compañero) | **Probó y reportó errores** por WhatsApp; encontró la **fecha pegada en la foto**; **sugirió las 2 vidas del quiz** |
| **Otros compañeros** | Preparan **el pitch, las diapositivas y las respuestas al jurado** |
| **Claude (IA)** | Asistente de programación: escribió y organizó el código, midió rendimiento, encontró errores y llevó la documentación |

### Lo que dice Git (comprobable por cualquiera)
```
17 commits:  2 de jusstjuanda (12 oct)  ·  15 de hachescc (15 y 16 oct)
```
**Cuidado:** que los commits tengan el nombre de Hugo **no significa que él escribió el código a mano**. Significa que **él los subió** (a propósito: «los commits los hago yo»). No lo uses como prueba de autoría del código; úsalo como prueba de **quién publicó y aprobó**.

**Qué NO sabemos:** si el compañero que hizo la primera versión usó una IA o cómo. **No consta** en su bitácora. **Háblalo con él antes del sábado** para que todos cuenten la misma historia.

---

## 2. ¿Qué es «vibe coding»?
**Vibe coding** (término popular desde 2025) es **programar describiendo en lenguaje natural lo que quieres y dejando que una IA escriba el código**, muchas veces **sin leer cada línea**: te guías por «cómo se siente/se ve» el resultado («vibes»).

Un espectro útil para ubicarte:
| Nivel | Qué pasa | ¿Dónde estamos? |
|---|---|---|
| 1. IA escribe, nadie revisa ni prueba | Se acepta lo que salga | ❌ No |
| 2. **IA escribe; humano dirige, prueba, corrige y decide** | El humano pide por pasos, mira el resultado, reporta errores con capturas, aprueba o rechaza | ✅ **Aquí** |
| 3. Humano escribe, IA ayuda | La IA completa o explica | ❌ No (en lo esencial) |

> Si quieres usar la palabra «vibe coding», **defínela tú**: «Construimos con vibe coding dirigido: describimos lo que queríamos, la IA escribió el código, y nosotros lo probamos en celulares reales, corregimos, decidimos y ahora lo hemos estudiado para poder explicarlo». Eso es **verdad** y suena maduro.

---

## 3. Lo que aportó cada parte (con evidencias del proyecto)

### 3.1 Lo que aportó Hugo y el equipo
| Aporte | Evidencia concreta |
|---|---|
| **Decisiones de producto** | Estilo de la web no se toca (fase 2); textos propios solo con su OK; marca «Aves UAO» con tipografía Fraunces 900 |
| **Elegir entre opciones** | De 3 direcciones estéticas, **no se adoptó ninguna** (solo hojas, arco, logo). Del paso 6 eligió **A «Campus vivo» + B «Aves detalladas»** y **descartó C «Ilustración»**. Pidió **menos farolas** |
| **Contenido del quiz** | Aprobó **solo las preguntas 1–7 de entorno**; descartó las de lugares, sostenibilidad e historia; fijó **2 vidas, 20 por partida, Guardián con 10**. La idea de las 2 vidas fue de **Sebastián** |
| **Material del campus** | Aportó **fotos aéreas y de calle anotadas**, el **mapa «Runners»** y el de **UAO Fest**, y explicó la geografía de memoria (Portería 1 → arco → Ágora → aulas → lago → cafetería → Portería 3) |
| **Correcciones del campus (4 rondas)** | Aulas de 4 pisos; **cartel rojo al lado contrario**; **UAO Labs como sótano**; gradas horizontales; rampas macizas; seto del Ágora girado; parque y parqueadero frente a la Portería 3; bosque del lago |
| **Probar en celulares reales** | Probó en **Android e iPhone** (con su equipo) y mandó **capturas** de lo que fallaba |
| **Calidad de interfaz** | Exigió que **nada se saliera de los márgenes**, alineaciones correctas, textos naturales («esas comillas raras no las usa nadie») |
| **Publicar** | Todos los commits y el despliegue en GitHub Pages |
| **Ritmo** | «Un paso a la vez; muéstrame antes/después; espera mi OK» |

### 3.2 Lo que aportó la IA
- Escribir y organizar el código (HTML, CSS y JavaScript).
- Proponer opciones técnicas y visuales (con vistas previas).
- Detectar y arreglar errores; medir rendimiento y cruces (0 cruces en 480 soportes; 675→117 órdenes de dibujo).
- Llevar la bitácora, el estado del proyecto y estos documentos de estudio.

### 3.3 Lo que NO hizo la IA (y no debes atribuirle ni atribuirte)
- **Los datos de las aves**: son de la **Guía ilustrada de las aves del campus de la UAO** (2023, Escuela de Turismo; autores Germán Morales Zúñiga y Natalia Lenis Sánchez) y de **WikiAves**. Hay que darles el crédito.
- **Las fotos** de la guía (autores: Juan Manuel Quintero, Natalia Lenis Sánchez, Diana Carolina Campo Daza).
- **three.js**: es una librería de terceros (licencia MIT). **Fraunces** e **Inter**: fuentes de Google (licencia libre OFL).
- **El logo** de la UAO: es de la universidad (sacado de la guía).

---

## 4. Los errores que cometió la IA (y que se detectaron)
Mostrar esto **demuestra supervisión humana real**:
| Error | Cómo se detectó | Cómo se arregló |
|---|---|---|
| Aves con el **nombre ya visible** en el quiz (spoiler) | Capturas de Hugo | Código ajustado (`modo !== "quiz"`) |
| «¡Correcto!» **cortado** en pantallas angostas | Capturas de Hugo | Etiqueta que se achica y se corre |
| **Árboles blancos** en la cinemática | Revisión visual | `fusion.js` conserva colores por vértice |
| Cámara **mirando hacia atrás** por momentos | Revisión visual | Mismo parámetro para posición y mirada |
| Letrero «uao» **flotando** | Capturas de Hugo | Se ajusta al ancho del muro |
| Documentos con **cifras erradas** (decían ~140 aves; son 105) | Verificación contra el código | Corregidos; la bitácora conserva la historia |
| La página **abría en la guía** en computador | Reporte de Hugo | Script que ignora el ancla `#guia` |

**Mensaje:** «La IA se equivoca. Por eso no aceptamos nada sin probarlo, ni sin medirlo, ni sin verlo en celulares».

---

## 5. Cómo responder las preguntas incómodas (frases listas)

**«¿Esto lo hizo una IA?»**
> «Usamos una IA como asistente de programación. Nosotros definimos qué debía hacer la aplicación, reunimos la información y el material del campus, decidimos el diseño, probamos en celulares reales y corregimos lo que fallaba. Y estudiamos el código: puedo explicarle cómo funciona.»

**«¿Qué porcentaje es suyo?»**
> «El código lo generó la IA a partir de lo que pedimos. Las decisiones —qué se construye, cómo se ve, qué se descarta— y la verificación fueron nuestras. No lo medimos en porcentaje, porque son trabajos distintos.»

**«¿Entiendes todo el código?»** *(responde con precisión, sin exagerar)*
> «Entiendo la arquitectura y cómo funciona cada parte: cómo se mueve la cámara con el giroscopio, cómo se construyen las aves, cómo se colocan sin cruzarse, cómo se anima, cómo suena y cómo funcionan el quiz y la cinemática. No pretendo recordar cada línea, pero sé dónde está cada cosa y por qué se hizo así.»

**«Muéstrame dónde se define X.»** → usa el **mapa de archivos** (capítulo 5 y `SUSTENTACION.md` §4): fichas de aves en `especies-ra.js`, aves en `aves3d.js`, motor en `ra.js`, sonido en `sonido.js`, cinemática en `recorrido.js` + `campus-real.js`, textos de la guía en `datos-uao.js`.

**«¿Pueden cambiar algo ahora?»** → mira el **capítulo 23**: ejercicios que *tú* puedes hacer (cambiar un color, un texto, la frecuencia de aleteo).

**«¿Por qué los comentarios del código hablan así?»**
> «Son notas de la herramienta con la que escribimos el código; explican decisiones. No cambian el funcionamiento.»

**«¿Qué hace la IA mal?»** → habla de los errores de la tabla anterior (con ejemplos).

**«¿Qué aprendieron?»** → véase el capítulo 21 (preguntas) y el 17 (lecciones).

---

## 6. Los comentarios «típicos de IA» en el código
### Qué son
En el código hay líneas que empiezan con `//` (en JavaScript) o están entre `/* */` (en CSS): **comentarios**. El navegador **los ignora**; solo sirven para humanos. Hay unos **350** repartidos en los 11 archivos JS (los que más: `ra.js`, `campus-real.js`, `aves3d.js`, `campus.js`).

### Por qué «suenan a IA»
- Están **en tercera persona o en voz impersonal** («la cámara avanza sola», «las aves que pasan muy cerca… se encogen»).
- **Explican el porqué de una decisión** con paréntesis largos («si el usuario cambia de modo… se cancela: así no aparecen aves de más…»).
- Líneas separadoras con guiones (`// ------ estado`).
- Frases con dos puntos tipo «X: Y».
- Tono muy ordenado, sin errores, sin chistes ni frustración.

### Ejemplos reales del proyecto
```js
// Ejecuta algo más tarde y lo anota. Si el usuario cambia de modo o la escena se limpia antes de que llegue la hora,
// se cancela: así no aparecen aves de más ni se repiten las que ya se pidieron.
```
```js
// Nombre del lugar según dónde va la cámara (así el rótulo coincide con lo que se ve aunque se cambie el trayecto)
```

### Qué hacer con ellos
1. **Déjalos si te sirven:** son documentación útil y **eso también es buena práctica** (explicar el porqué).
2. **Cuéntalo sin drama** (frase de arriba).
3. **Si quieres limpiarlos o reescribirlos con tu voz**, se puede hacer: **no cambia el funcionamiento**, pero toda edición de archivos debe **probarse** y, a la víspera del pitch, conviene hacerlo con cuidado. Dime si quieres que revisemos juntos los de uno o dos archivos.

---

## 7. Integridad académica: tres cosas que sí debes hacer
1. **Revisa la política de la UAO / del curso sobre uso de IA.** No la conozco. Si hay una regla («se puede usar IA si se declara»), cúmplela. Si no la hay, **declara de todos modos**.
2. **Declara las fuentes**: guía UAO, WikiAves, librerías y fuentes de terceros (ya están en el pie de la página).
3. **Que todo el equipo cuente la misma historia** sobre quién hizo qué.

## 8. Acuerdo de equipo antes del sábado (lista de 5 minutos)
- [ ] ¿Cómo dicen que se hizo la primera versión (12 de octubre)? (Pregúntale a quien la hizo.)
- [ ] ¿Quién habla de qué en el pitch? (Hugo: cómo está hecho, decisiones, IA, campus. Otros: problema, público, demo.)
- [ ] ¿Quién maneja el celular en la demo y quién el computador de respaldo?
- [ ] ¿Qué dicen si preguntan por la IA? (Misma frase.)
- [ ] ¿Qué NO afirman? (Cantos grabados, aves ancladas al piso, «Tamaño real» en iPhone, réplica exacta del campus.)

## Para decirle al profesor
> «Fue desarrollo asistido por IA, dirigido por nosotros: describimos qué queríamos, la IA escribió el código, y nosotros decidimos, aportamos el material del campus, probamos en celulares reales, corregimos errores y aprobamos cada cambio. Estudiamos el código para poder explicarlo y lo declaramos abiertamente.»

## Autoevaluación
1. ¿Qué dice Git sobre los commits y qué NO prueba?
2. Define «vibe coding» con tus palabras y ubica el proyecto en el espectro.
3. Nombra cinco cosas concretas que decidió/aportó el equipo.
4. Nombra tres errores de la IA que se detectaron.
5. ¿Qué cosas no hizo la IA y deben tener crédito?
6. Responde en voz alta: «¿Esto lo hizo una IA?».
7. ¿Qué no sabemos del origen de la primera versión? ¿Qué harás al respecto?
