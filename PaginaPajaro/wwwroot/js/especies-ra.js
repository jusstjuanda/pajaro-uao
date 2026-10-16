// Las 12 aves del campus UAO que aparecen en Realidad Aumentada.
// Nombres y rasgos según la «Guía ilustrada de las aves del campus de la UAO» (2023).
// comida: flores | frutas | agua | pasto | insectos  (para el comedero RA)
// marcas: rasgos para identificarla con los binoculares (parte: cabeza | pico | vientre | ala | cola | patas | espalda)
window.ESPECIES_RA = [
  {
    id: "bichofue", nombre: "Bichofué", cientifico: "Pitangus sulphuratus", canto: "bichofue", comida: ["insectos", "agua", "frutas"],
    tipo: "posado", soporte: "rama", escala: 0.42, pico: "fino",
    colores: { espalda: "#8A6A3A", vientre: "#F6CF1E", cabeza: "#1D1B1A", ala: "#9C7240", cola: "#7A5A30", pico: "#1A1A1A", patas: "#2b2b2b" },
    extras: { ceja: "#FFFFFF", garganta: "#FFFFFF", corona: "#F6CF1E", puntaAla: "#C99A58" },
    marcas: [["cabeza", "Cabeza negra con ceja blanca"], ["vientre", "Vientre amarillo radiante"], ["ala", "Alas con bordes rojizos"]],
    pistas: ["Su nombre imita su llamado fuerte: «bi-cho-fué»", "Come de todo: peces, insectos, lagartijas y frutas", "Vientre amarillo y cabeza negra con ceja blanca"]
  },
  {
    id: "azulejo", nombre: "Azulejo común", cientifico: "Thraupis episcopus", canto: "azulejo", comida: ["frutas"],
    tipo: "posado", soporte: "rama", escala: 0.36, pico: "conico",
    colores: { espalda: "#8FAAC4", vientre: "#B9CBDB", cabeza: "#A5BCD2", ala: "#4F84BE", cola: "#4F7FB4", pico: "#3B3F45" },
    extras: { puntaAla: "#3F6FA8" },
    marcas: [["espalda", "Gris azuloso claro"], ["ala", "Alas de azul más intenso"], ["pico", "Pico robusto"]],
    pistas: ["Ave gris azulosa que come frutas en lo alto de los árboles", "Se posa en los cables de teléfono", "Común en pueblos, jardines y campos con árboles grandes"]
  },
  {
    id: "mirla", nombre: "Mirla ollera", genero: "f", cientifico: "Turdus ignobilis", canto: "mirla", comida: ["pasto", "frutas"],
    tipo: "posado", soporte: "pasto", escala: 0.42, pico: "fino",
    colores: { espalda: "#77684F", vientre: "#C2B497", cabeza: "#77684F", ala: "#6C5D45", cola: "#655640", pico: "#2A2622", patas: "#4a3f35" },
    extras: { garganta: "#D8CDB6" },
    marcas: [["pico", "Pico oscuro"], ["vientre", "Vientre blancuzco y garganta rayada"], ["espalda", "Marrón grisáceo"]],
    pistas: ["Zorzal de pocos colores con canto de frases musicales", "Marrón grisácea con la garganta rayada", "Busca lombrices en los prados"]
  },
  {
    id: "pellar", nombre: "Pellar", cientifico: "Vanellus chilensis", canto: "pellar", comida: ["pasto", "insectos"],
    tipo: "pellar", soporte: "pasto", escala: 0.4, pico: "fino",
    colores: { espalda: "#8D8878", vientre: "#FAFAF6", cabeza: "#9C9A90", ala: "#6E6A58", cola: "#1E1E1E", pico: "#D88A7C", patas: "#D98C86", ojo: "#C8322E" },
    extras: { pecho: "#1C1C1C", cara: "#1C1C1C", copete: "#1C1C1C", hombro: "#7E6B3E" },
    marcas: [["vientre", "Pecho negro y vientre blanco"], ["cabeza", "Cabeza gris con copete"], ["patas", "Patas rosadas largas"]],
    pistas: ["Su llamada áspera y fuerte delata su presencia en los prados", "Pecho negro, vientre blanco y hombros bronceados", "Vive en pares en zonas abiertas, cerca del agua"]
  },
  {
    id: "carpintero", nombre: "Carpintero habado", cientifico: "Melanerpes rubricapillus", canto: "carpintero", comida: ["insectos", "frutas"],
    tipo: "carpintero", soporte: "tronco", escala: 0.4, pico: "cincel",
    colores: { espalda: "#141414", vientre: "#E2D2AE", cabeza: "#E6D9BA", ala: "#2a2a2a", cola: "#1E1E1E", pico: "#2A2A2A" },
    extras: { barras: true, corona: "#D22B2B", nuca: "#D22B2B" },
    marcas: [["espalda", "Espalda barrada blanco y negro"], ["cabeza", "Nuca y corona rojas"], ["pico", "Pico tipo cincel"]],
    pistas: ["Tiene la espalda barrada de blanco y negro", "La nuca roja: en el macho llega hasta la corona", "Tamborilea en los troncos"]
  },
  {
    id: "colibri", nombre: "Colibrí colirrufo", cientifico: "Amazilia tzacatl", canto: "colibri", comida: ["flores"],
    tipo: "colibri", soporte: "flor", escala: 0.3, pico: "largo",
    colores: { espalda: "#3C9A56", vientre: "#9CB59A", cabeza: "#45A85E", ala: "#2F7A44", cola: "#B8572A", pico: "#D8463A" },
    extras: { garganta: "#4FBF6A" },
    marcas: [["cola", "Cola canela"], ["pico", "Pico rojizo de punta oscura"], ["espalda", "Verde brillante"]],
    pistas: ["Se alimenta de néctar y visita los comederos", "Verde con la cola canela", "Prefiere jardines y bordes de bosque"]
  },
  {
    id: "garza", nombre: "Garza de ganado", genero: "f", cientifico: "Bubulcus ibis", canto: "garza", comida: ["agua", "pasto", "insectos"],
    tipo: "garza", soporte: "agua", escala: 0.4, pico: "daga",
    colores: { espalda: "#F8F8F4", vientre: "#EDEFEF", cabeza: "#F8F8F4", ala: "#F1F2EF", cola: "#E8EAE8", pico: "#F2C230", patas: "#2A2A2A", ojo: "#E8B830" },
    extras: {},
    marcas: [["pico", "Pico grueso amarillo"], ["espalda", "Toda blanca y compacta"], ["patas", "Patas oscuras (rojizas en reproducción)"]],
    pistas: ["Sigue al ganado o a las podadoras para atrapar insectos", "Garza blanca pequeña de pico grueso amarillo", "Se ve también en zonas secas"]
  },
  {
    id: "periquito", nombre: "Periquito bronceado", cientifico: "Brotogeris jugularis", canto: "periquito", comida: ["frutas", "flores"],
    tipo: "loro", soporte: "rama", escala: 0.34, pico: "gancho",
    colores: { espalda: "#5DA836", vientre: "#86C45A", cabeza: "#62AE3A", ala: "#4E9530", cola: "#4E9A3A", pico: "#E8DCC0", patas: "#8a8278" },
    extras: { hombro: "#8A6A32", garganta: "#F08A24", colaForma: "normal", puntaAla: "#3F7FB8" },
    marcas: [["ala", "Hombros color bronce"], ["cabeza", "Parche naranja en la barbilla"], ["espalda", "Verde"]],
    pistas: ["Periquito verde con hombros bronce", "Vuela rápido con pequeños rebotes", "Visita árboles en flor o con frutos"]
  },
  {
    id: "siriri", nombre: "Sirirí común", cientifico: "Tyrannus melancholicus", canto: "siriri", comida: ["insectos"],
    tipo: "posado", soporte: "rama", escala: 0.4, pico: "fino",
    colores: { espalda: "#8B9273", vientre: "#F1D43A", cabeza: "#8E9396", ala: "#5E5848", cola: "#57503F", pico: "#1E1E1E" },
    extras: { antifaz: "#4A4C50", garganta: "#D6D8D2", colaForma: "horquilla" },
    marcas: [["cabeza", "Cabeza gris con antifaz oscuro"], ["vientre", "Vientre amarillo"], ["cola", "Cola ahorquillada"]],
    pistas: ["Caza insectos al vuelo desde cables y ramas", "Cabeza gris, espalda verdosa y vientre amarillo", "Sus gorjeos agudos lo distinguen"]
  },
  {
    id: "garrapatero", nombre: "Garrapatero", cientifico: "Crotophaga ani", canto: "garrapatero", comida: ["insectos", "pasto"],
    tipo: "posado", soporte: "rama", escala: 0.42, pico: "curvo",
    colores: { espalda: "#1C1C22", vientre: "#25252C", cabeza: "#202027", ala: "#23232B", cola: "#18181E", pico: "#141418" },
    extras: { colaForma: "larga", puntaAla: "#30303c" },
    marcas: [["espalda", "Enteramente negro"], ["pico", "Pico grueso, alto y curvo"], ["cola", "Cola larga y floja"]],
    pistas: ["Pájaro enteramente negro de cola larga", "Su pico es grueso, alto y curvo", "Anda en pequeñas bandadas por los matorrales"]
  },
  {
    id: "pechirrojo", nombre: "Pechirrojo", cientifico: "Pyrocephalus rubinus", canto: "pechirrojo", comida: ["insectos"],
    tipo: "posado", soporte: "rama", escala: 0.32, pico: "fino",
    colores: { espalda: "#4A3A32", vientre: "#E3202A", cabeza: "#E3202A", ala: "#3E302A", cola: "#3A2C26", pico: "#1A1A1A" },
    extras: { antifaz: "#3A2C26", garganta: "#F0262E" },
    marcas: [["vientre", "Pecho rojo brillante"], ["cabeza", "Corona roja y antifaz oscuro"], ["espalda", "Espalda marrón oscuro"]],
    pistas: ["El macho es rojo brillante con antifaz marrón", "Se posa en cercas y postes", "Se alimenta de insectos"]
  },
  {
    id: "loro", nombre: "Loro cabeciazul", cientifico: "Pionus menstruus", canto: "loro", comida: ["frutas"],
    tipo: "loro", soporte: "rama", escala: 0.44, pico: "gancho",
    colores: { espalda: "#3E9A3C", vientre: "#5DB04A", cabeza: "#2E5FC8", ala: "#2F8A34", cola: "#3E9A3C", pico: "#3A3A3A", patas: "#7a7268" },
    extras: { garganta: "#3A6AD4", bajoCola: "#D4262E", colaForma: "corta", puntaAla: "#1F5FA8" },
    marcas: [["cabeza", "Cabeza azul"], ["espalda", "Cuerpo verde"], ["cola", "Rojo bajo la cola"]],
    pistas: ["Loro verde con la cabeza azul", "Su llamada chirriante sube de tono, dos o tres veces", "Tiene rojo bajo la cola"]
  }
];
