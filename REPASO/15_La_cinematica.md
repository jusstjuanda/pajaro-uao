# 15 · La Cinemática (el recorrido 3D por el campus)

## Resumen en 1 minuto
La **Cinemática** es un **recorrido de unos 108 segundos** por el campus 3D, con aves volando. **No es un archivo de video**: se **calcula en vivo** con three.js (como un videojuego que se mueve solo). Una **cámara virtual** sigue una **curva** que pasa por los lugares clave (Portería 1, Arco Central, Ágora, aulas, lago, cafetería, Portería 3, parque, parqueadero) mientras **~105 aves** vuelan; el usuario puede **mirar alrededor** (arrastrando o moviendo el celular), **acelerar** (×2, ×4) o **saltar**, y al terminar **vuelve a la RA** tal como estaba. Está en `js/ra/recorrido.js` (el recorrido) y `js/ra/campus-real.js` (el escenario), conectado a `ra.js` con muy pocas líneas.

> Fue tu idea («un video del campus en estilo RA, inmersivo, con aves volando, que se pueda mirar en 360°, más fiel que el simulado, y que al terminar vuelva a la RA»). La rúbrica pedía «animaciones, audios, **videos**, etc.»; esto cumple el papel del video de forma interactiva.

---

## 1. ¿Por qué no un video grabado?
| Video grabado | Cinemática en vivo |
|---|---|
| Pesa muchos MB | Pesa **0 MB extra** (se calcula) |
| Hay que grabarlo/editarlo (no hay material real) | Se hace con código y con las fotos/mapas del campus |
| Solo se ve, no se puede mirar a otro lado | Puedes **mirar 360°** y cambiar la velocidad |
| Estilo distinto al de la RA | **Mismo estilo gráfico** de las aves |

## 2. La cámara y su camino (la parte más elegante)
La ruta es una lista de **puntos clave** (`PASOS`). Cada uno tiene **dos posiciones**: **dónde está la cámara** y **hacia dónde mira**:
```js
const PASOS_BASE = [
  [[0, 62, 240], [0, 8, 150]],   // empieza a 62 m de altura sobre la calle, mirando hacia la Portería 1
  [[0, 20, 190], [0, 6, 140]],   // baja
  [[0, 8.5, 160], [0, 6.5, 120]],// cruza la Portería 1 por arriba
  ...
];
```
- Se crean **dos curvas suaves** (`CatmullRomCurve3`) que **pasan por todos esos puntos**: una para la **posición** de la cámara y otra para el **punto al que mira**.
- En cada cuadro se calcula «¿cuánto de la ruta llevo?» (un número `u` de 0 a 1 que crece con el tiempo) y se obtienen **los dos puntos** (dónde estoy / a dónde miro). Luego `lookAt` gira la cámara para mirar a ese punto. Resultado: un **movimiento de cámara de cine** suave y orientado.

### Velocidad constante
Una curva por puntos **no avanza igual** entre un punto y otro (más lento en tramos cortos). Para que la velocidad sea pareja se usa `getUtoTmapping(u)`, que **convierte «progreso por distancia» en «progreso por parámetro»**. Se usa el **mismo parámetro** para la curva de posición y la del punto de mira (así siempre van **sincronizadas**; antes, usar parámetros distintos hacía que la cámara mirara hacia atrás por momentos: un bug que se arregló).

### Arranque y final suaves
```js
const u = smoothstep(f,0,0.04)*0.04 + f*0.92 + smoothstep(f,0.96,1)*0.04;
```
`f` = fracción del tiempo total. La cámara **arranca despacio** (primer 4 %) y **frena** al final (último 4 %): como un buen plano de cine.

### El nivel alto (la meseta)
El Edificio Central está 4,2 m más alto. Para no escribir dos rutas, el código **sube solo la altura** de los puntos que estén al norte del borde (`z > 42`): `SUBE = 4.2`. Así la cámara pasa por el pasillo y por el arco **a la misma altura sobre el piso**, aunque el piso esté más alto.

## 3. Mirar alrededor (arrastrar o girar el celular)
Cuando el usuario arrastra, se acumulan dos ángulos: **`yaw`** (izquierda/derecha) y **`pitch`** (arriba/abajo). La orientación final de la cámara **combina** tres rotaciones:
```js
camara.quaternion = Qyaw(eje vertical del MUNDO) × qCam(la que sigue la ruta) × Qpitch(eje X local) [× giro del celular]
```
- El **giro a los lados** se aplica sobre el eje **vertical del mundo** para que el **horizonte no se incline** (si no, al arrastrar con la cámara mirando hacia abajo el mundo se veía «torcido»).
- El **cabeceo** se aplica sobre el eje local de la cámara.
- Con **giroscopio**, se usa el movimiento **relativo** del celular desde que empezó el recorrido (`qInicio⁻¹ × qActual`): si giras el celular a la derecha, la vista gira a la derecha **a partir de la dirección en que va el recorrido**.

## 4. Las aves volando (instancias)
~**105 aves** en total. Para que no pese, **no son aves detalladas**: cada una es **un cuerpo (óvalo) y dos alas (triángulos)**, y las 105 comparten **tres mallas instanciadas** (cuerpos, alas izquierdas, alas derechas): **3 órdenes de dibujo** en vez de cientos.
- Cada bandada tiene una **función de trayectoria** `fn(t, i, n, fase)` que dice **dónde está el ave `i` en el instante `t`**: **órbitas** circulares (sobre el Ágora, el Arco, el lago, la cafetería, las canchas, el parqueadero) o **cruces** de un punto a otro del campus.
- La **orientación** del ave se saca de **hacia dónde se mueve** (se compara su posición ahora y 0,05 s después) → siempre vuela «de frente».
- El **aleteo** es `Math.sin(t * frecuencia + fase)` aplicado como giro a cada ala.
- Hay una **bandada guía** (12 aves) que **acompaña a la cámara**, un poco adelante y arriba.
- Las **garzas blancas** orbitan el lago (más lentas).
- Si un ave pasa a **menos de 14 m de la cámara**, se **encoge** (hasta 20 %) para no tapar la vista.
- Los **colores** de las aves salen de una paleta de 7 tonos (marrones, amarillo, negro, azul, rojo, verde).

## 5. Lo que se cambia al entrar y se devuelve al salir
Al **iniciar** el recorrido, el módulo **guarda** el estado de la cámara y lo cambia: añade **niebla** (difumina lo lejano), amplía el **alcance de dibujo** (de 300 a 2.200 m: el cielo y las montañas están muy lejos), sube el **FOV** a 66°, agrega el **campus real** a la escena y muestra la **interfaz** (título del lugar, velocidad, saltar, barra de progreso). Al **terminar**, **restaura todo**: niebla, alcance, FOV, posición y orientación de la cámara. Eso garantiza que la RA siga **como estaba**.

## 6. Los rótulos de lugar
Una función `lugar(f, posición)` decide **qué texto mostrar según dónde está la cámara** (no según el tiempo): «Portería 1», «Edificio Central», «El Arco Central», «UAO Labs», «El Ágora y las palmas», «Aulas 1, 2, 3 y 4», «El lago», «La cafetería», «Portería 3», «El parque y el parqueadero», «Las canchas». Así, si se cambia la ruta, **el rótulo sigue coincidiendo** con lo que se ve.

## 7. La velocidad ×1 / ×2 / ×4
Un botón cambia un multiplicador `vel`: `est.t += dt * est.vel`. **Solo la cámara** va más rápido; las aves y la fuente usan **otro reloj** (`tAnim`) para **no aletear frenéticamente**.

## 8. Cómo se conecta con la RA (`ra.js`)
Con pocas funciones y una bandera:
- **`iniciarRecorrido()`**: si estás en el quiz, avisa «no disponible». Si no, muestra «Preparando el recorrido…», **espera un instante** (para que se pinte el aviso), crea el recorrido (la primera vez), **baja un poco la resolución** (`pixelRatio` máx. 1,5 para ir fluido), **esconde** el 3D de la RA (`raiz.visible=false`, `simulado.visible=false`), agrega la clase `ra-en-recorrido` (el CSS esconde video e interfaz) y **arranca**.
- **`cicloRecorrido()`**: en cada cuadro, en vez del ciclo normal, actualiza el recorrido (con el giro del celular relativo) y dibuja.
- **`finRecorrido()`**: restaura la resolución, la visibilidad y la interfaz, **ejecuta lo que la RA tenía pendiente** (las llegadas de aves que quedaron en cola) y muestra «Seguimos en la RA».
- En `despues()`: **si estás en la cinemática, los temporizadores se guardan en una cola** y se ejecutan **al volver** (así no aparecen aves durante el recorrido).
- Si el usuario **sale de la RA** en pleno recorrido, primero se cierra la cinemática.
- Si algo **falla** durante el recorrido, un `try/catch` lo cierra y **la RA no se congela**.

## 9. Sonido de la cinemática
Usa `Sonido.ambiente(true)`: **viento** suave y **cantos al azar** a bajo volumen; se apaga al terminar.

## 10. Datos útiles
- Duración: ~**108 s** (`DURACION`); con ×4 ≈ 27 s.
- Triángulos: ≈ **200 mil por vista**; **100–270** órdenes de dibujo según lo que se vea.
- Hay **26 puntos clave** en la ruta: empieza **aérea sobre la calle**, cruza la **Portería 1**, baja al pasillo, atraviesa el **arco**, **orbita el Ágora**, recorre el eje entre aulas, pasa por el **lago**, la **cafetería**, rodea la **Portería 3**, sobrevuela el **parque y el parqueadero** y termina **alta** mirando el campus.

## Para decirle al profesor
> «La cinemática es un recorrido en tiempo real: una cámara sigue una curva Catmull-Rom por puntos de posición y de mirada, con velocidad constante y arranque suave. El usuario puede mirar 360° arrastrando o con el giroscopio sin inclinar el horizonte, y acelerar o saltar. Las aves son tres mallas instanciadas con trayectorias calculadas. Al empezar guardamos y modificamos parámetros de la cámara y de la escena, y al terminar los restauramos para volver a la RA exactamente donde estaba.»

## Autoevaluación
1. ¿Por qué no es un video? ¿Qué ventajas tiene?
2. ¿Cómo se mueve la cámara? ¿Qué es una curva Catmull-Rom?
3. ¿Cómo se logra mirar alrededor sin inclinar el horizonte?
4. ¿Cómo son las aves de la cinemática y por qué son tan livianas?
5. ¿Qué cosas se guardan y restauran al entrar y salir?
6. ¿Cómo se decide el texto del lugar?
7. ¿Por qué hay una cola de temporizadores?
