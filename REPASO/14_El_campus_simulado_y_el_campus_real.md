# 14 · El campus simulado y el campus «real» (construidos con código)

## Resumen en 1 minuto
Hay **dos campus 3D**, los dos hechos **solo con código**:
1. **Campus simulado** (`campus.js`): el **fondo** de la RA cuando no hay cámara (computador o permiso negado). Es un paisaje low-poly «inspirado» en la UAO: camino de ladrillo, aulas con techo verde y paneles solares, una plazoleta con fuente, árboles y palmas.
2. **Campus «real»** (`campus-real.js`): el escenario de la **cinemática**. Es **mucho más fiel**: se construyó a partir de **tus fotos y mapas** (Portería 1, Arco Central, Ágora, aulas de 4 pisos, lago, cafetería, Portería 3, parque con canchas y parqueadero).

Ninguno usa modelos descargados ni imágenes de edificios: son **cajas, cilindros y formas extruidas** con colores, más **texturas dibujadas por código**.

---

## 1. Ideas que se repiten en los dos campus
### 1.1 «Piezas de LEGO»
Un edificio = una **caja** (paredes) + **franjas de concreto** (una por piso) + **ventanas** + un **techo a dos aguas** + **paneles solares**. Se escribe **una función** (`edificio({...})`) que fabrica cualquiera con solo cambiar ancho, alto, fondo, número de pisos y color. Se usa para las **alas** del Edificio Central, las **4 aulas**, la **cafetería**…

### 1.2 Ventanas con instancias
Un edificio de 4 pisos y 100 m de largo tiene **cientos de ventanas**. En vez de crear cientos de objetos, se crea **una sola malla** (`InstancedMesh`) con la forma de «una ventana» y se le dice **dónde** va cada copia (una lista de posiciones). La tarjeta gráfica las dibuja **todas en una sola orden**. Es la gran optimización del proyecto (capítulo 16).

### 1.3 Techos y paneles solares
El **techo** es un **prisma triangular** (un triángulo «extruido» a lo largo del edificio) pintado de verde azulado; encima se ponen **tiras planas azules** inclinadas (los paneles solares) en las dos vertientes. El de la cafetería es una **pirámide** de 4 caras. (La UAO es famosa por sus paneles solares: 1.632 en el campus.)

### 1.4 Texturas dibujadas con código
El **piso de ladrillo con rombos** se dibuja en un canvas de 128×128 px (un rombo con borde) y se **repite** muchas veces (`wrapS/wrapT = RepeatWrapping`, `repeat.set(...)`). Lo mismo para las **marcas de las canchas**, el **asfalto con rayas del parqueadero**, los **letreros** («AULAS 1», «CAFETERÍA», «UAO Labs») y el **logo «uao»**.

### 1.5 Azar repetible (`semilla`)
```js
export const semilla = n => { let s = n; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
```
Genera «números al azar» que **siempre salen en el mismo orden** para la misma semilla `n`. Así, la ubicación de los árboles es **aleatoria pero idéntica cada vez que abres la app** (el campus «se ve igual»). Con `Math.random()` cambiaría en cada visita.

### 1.6 Que los árboles no estorben
Antes de plantar un árbol se comprueba que **no pise** edificios, caminos, la plazoleta, lagos, canchas ni calles (una lista de «zonas prohibidas»). En la cinemática además se evitan los árboles **donde pasa la cámara**.

---

## 2. El campus simulado (`campus.js`), por dentro
- **Cielo:** una **esfera gigante** vista desde adentro con colores por vértice (degradado de horizonte a cielo).
- **Suelo:** un círculo verde con **manchas** más claras y oscuras.
- **Camino de ladrillo con rombos** + **160 piedras** de bordillo (una malla instanciada).
- **Aulas** (4, con `EDIFICIOS`): ladrillo, franjas, ventanas instanciadas, techo verde con paneles, y **arco de entrada** en las dos grandes.
- **Plazoleta circular** con tres escalones, **fuente** (vaso de piedra, agua, pie, taza, bola y **52 gotas animadas**) y **setos amarillos**.
- **Bancas, farolas (4), canteros con flores, arbustos, césped, flores silvestres, nubes, mariposas.**
- **Árboles** de copa redonda y **palmas reales** altas (`crearArbol`, `crearPalmera`).
- **`OBSTACULOS`**: una lista de círculos (fuente, bancas, canteros, farolas) que **la RA consulta** para no poner un ave encima (capítulo 11).
- **Importante:** el simulado es **solo escenario de juego**; no pretende ser una réplica.

---

## 3. El campus «real» (`campus-real.js`), por dentro

### 3.1 De dónde sale el plano
De **tus mapas y fotos**: el mapa de la carrera «Runners», el de UAO Fest, fotos aéreas y de calle con tus anotaciones (N/S, A1–A4, arco, plaza/palmas, lago, cafetería, P1/P3). Se tradujo a coordenadas (≈ 0,5 m por píxel del mapa). Reglas que tú diste y que se cumplieron:
- Portería 1 → **Edificio Central** (ala **Sur** a un lado y ala **Norte** al otro) → **Arco Central** → **Ágora** → aulas.
- **Aulas 1** (cerca del Ágora, a la derecha viniendo de la P1), **Aulas 2** al frente, **3** a la izquierda y **4** al fondo; **las cuatro de 4 pisos**.
- **Lago** entre las aulas y la cafetería; **cafetería** en L (3 pisos) con **mesas de metal con dos sillas a cada lado**; **Portería 3** casi alineada con la 1; **canchas** al costado.
- **El nivel alto:** la Portería 1, la calle, el Edificio Central y el arco están **4,2 m más altos** que el resto del campus; **UAO Labs** es un **sótano** a nivel del Ágora, con **gradas horizontales** y **rampas macizas**.
- **Parque con canchas** (horizontales) frente a la Portería 3, **sendero recto** y **parqueadero** de estudiantes.

### 3.2 Las piezas más interesantes (y cómo se logran)
| Pieza | Técnica |
|---|---|
| **Arco Central** | Una forma 2D (un rectángulo) con un **hueco semicircular** (`THREE.Shape` + `holes`), «inflada» a 3D con `ExtrudeGeometry`. Marco de concreto y **celosía** (una textura con huequitos) encima |
| **Ágora (círculo con gradas)** | Se **recorta un hueco circular en el suelo** y dentro se apilan **anillos** (`RingGeometry`) a alturas cada vez más bajas, con **«contrahuellas»** (paredes cilíndricas). Un **seto amarillo en media luna** y un **anillo suelto de unas 12 palmas altas** alrededor |
| **Palmas reales** | Tronco muy alto y delgado (cilindro), cuello verde y **12 hojas** hechas de 3 conos cada una, giradas en abanico |
| **Logo «uao» en las porterías** | **Dibujado a mano con trazos** en un canvas: la «u» es una línea que baja y sube, la «a» un aro con un palito, la «o» un aro. Así queda en la tipografía real de la UAO sin usar una fuente |
| **Portería 1 y 3** | Muro de ladrillo con **letreros** (marca grande, dirección «Calle 25 No. 115 - 85…», número «3»), **pórtico gris**, **torniquetes**, matas moradas, bordillo amarillo; la 1 tiene además el **cartel rojo** calado |
| **UAO Labs** | Fachada de vidrio oscuro con el letrero, **12 escalones por lado** (cajas apiladas) y **rampas**: una **cuña de ladrillo** (triángulo extruido) con la **losa** encima |
| **Lago** | Forma irregular (un contorno con ruido), agua azul, borde de barro, **piedras**, **nenúfares** (discos verdes con flores moradas) y una **fuente** con 40 gotas animadas |
| **Bosque del lago** | Hasta 30 árboles grandes con **enredaderas** (tiras verdes colgando de las copas), matas y arbustos |
| **Cafetería** | Ala larga + bloque con techo piramidal y **mesas de metal** (cada una con 4 sillas) fusionadas |
| **Parqueadero** | Un asfalto con **rayas** (textura) y **~130 carros** como **instancias** (cuerpo + cabina) con colores variados |
| **Cielo y montañas** | Esfera con degradado + **16 conos** verdes azulados en el horizonte (los Farallones) + **16 nubes** |

### 3.3 La «meseta» (el nivel más alto)
Un truco sencillo: todo lo del norte (Portería 1, calle, alas, arco, parqueadero solar, matas) está dentro de **un grupo que se sube 4,2 m** (`norte.position.y = YT`). Debajo hay un **bloque** de ladrillo (la «base» de la meseta). Hacia el sur la meseta termina en un **muro** donde está Labs. La cámara de la cinemática **sube 4,2 m sola** cuando está en esa zona.

### 3.4 El suelo con hueco
El suelo es un plano enorme con un **agujero circular** donde va el Ágora, para que las gradas puedan **bajar**. (Si el suelo fuera completo, las gradas bajo el nivel 0 quedarían **tapadas**; fue un error que se corrigió.)

---

## 4. Cómo se verifica que se parece a la UAO
Con **tus fotos y mapas** como referencia y **varias rondas de correcciones** tuyas (aulas de 4 pisos, norte/sur, Ágora rodeada de palmas, UAO Labs en el sótano, seto del Ágora del otro lado, letrero de la P3, parque y parqueadero…). Es una **interpretación low-poly fiel en la organización**, no una **réplica exacta**: no se midió con planos oficiales. Dilo así.

## 5. Tamaño y costo
- Campus real completo: ~**236 mil triángulos** en total (≈ **200 mil por vista**, porque lo que está fuera de cuadro no se dibuja), ~**170 mallas**, ~**20 con instancias**. Se construye en ~**1,6 s** en un computador (más en un celular), por eso al tocar «Cinemática» sale «Preparando el recorrido…».

## Para decirle al profesor
> «Los dos campus están construidos con código a partir de formas básicas y texturas dibujadas en canvas. Usamos funciones reutilizables para edificios, instancias para ventanas y carros, y azar con semilla para que la vegetación sea idéntica en cada visita. El campus de la cinemática se hizo a partir de los mapas y fotos del campus real: respeta la organización —porterías, Arco Central, Ágora, aulas, lago, cafetería—, incluyendo el desnivel del Edificio Central con UAO Labs en el sótano. Es una interpretación low-poly, no un levantamiento exacto.»

## Autoevaluación
1. ¿Para qué se usa cada campus (simulado y real)?
2. ¿Cómo se hacen cientos de ventanas sin que se vuelva lento?
3. ¿Qué es una textura dibujada con código? Da dos ejemplos.
4. ¿Para qué sirve `semilla`?
5. ¿Cómo se hizo el Ágora? ¿Y el arco con hueco?
6. ¿Cómo se logra el nivel más alto del Edificio Central?
7. ¿Cómo se construyó el campus «real» y qué tan exacto es?
