// Página principal de «Aves UAO»: portada, guía UAO, libreta de campo, jornadas y ficha de la RA.
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const E = window.ESPECIES_RA;
  const U = window.UAO;
  const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  // ---------------- libreta (localStorage) ----------------
  const CLAVE = "pajaro-uao-libreta";
  function leer() {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || { aves: [], fotos: [], quiz: null }; }
    catch { return { aves: [], fotos: [], quiz: null }; }
  }
  function guardar(d) {
    try { localStorage.setItem(CLAVE, JSON.stringify(d)); }
    catch { d.fotos = d.fotos.slice(-3); try { localStorage.setItem(CLAVE, JSON.stringify(d)); } catch { } }
  }
  window.Libreta = {
    tiene: id => leer().aves.includes(id),
    total: () => leer().aves.length,
    registrar(id) { const d = leer(); if (!d.aves.includes(id)) { d.aves.push(id); guardar(d); } pintarLibreta(); },
    foto(url) { const d = leer(); d.fotos.push(url); d.fotos = d.fotos.slice(-8); guardar(d); pintarLibreta(); },
    quiz(p) { const d = leer(); d.quiz = Math.max(d.quiz ?? 0, p); guardar(d); pintarLibreta(); }
  };

  function pintarLibreta() {
    const d = leer();
    $("#lib-aves").textContent = `${d.aves.length}/${E.length}`;
    $("#lib-fotos").textContent = d.fotos.length;
    $("#lib-quiz").textContent = d.quiz == null ? "–" : `${d.quiz}/5`;
    $("#lib-insignia").hidden = !(d.quiz >= 4);
    $("#lib-aves-grid").innerHTML = E.map(e => {
      const ok = d.aves.includes(e.id);
      return `<div class="lib-ave ${ok ? "ok" : ""}">
        <img src="img/aves/${e.id}.png" width="360" height="360" loading="lazy" alt="${ok ? e.nombre : ""}">
        <b>${ok ? e.nombre : "¿?"}</b><small>${ok ? e.cientifico : "Encuéntrala en RA"}</small></div>`;
    }).join("");
    $("#lib-fotos-grid").innerHTML = d.fotos.map((f, i) => `<a href="${f}" download="aves-uao-${i + 1}.jpg"><img src="${f}" alt="Foto de campo ${i + 1}"></a>`).join("");
  }
  $("#lib-borrar").addEventListener("click", () => {
    if (confirm("¿Borrar las aves registradas, fotos y puntaje de este dispositivo?")) { localStorage.removeItem(CLAVE); pintarLibreta(); }
  });

  // ---------------- guía UAO ----------------
  // tamaño real de cada foto (ancho, alto): el navegador reserva el espacio antes de que cargue
  const tamFoto = {
    "bichofue": [1400, 927], "pechirrojo": [1400, 788], "pellar": [418, 316], "cocli": [532, 329], "loro-cabeciazul": [600, 450],
    "guacamaya-cariseca": [1400, 788], "chilacoa": [409, 298], "mango-garganta-negra": [1400, 788], "sicalis": [1400, 927],
    "pigua": [1400, 788], "carpintero-buchipecoso": [1080, 1080], "gavilan-pollero": [1400, 1400]
  };
  const destacadas = Object.keys(U.fotos);
  $("#destacadas").innerHTML = destacadas.map(n => {
    const sp = U.lista.find(x => x.comun === n || x.comun.startsWith(n)) || { cientifico: "", familia: "" };
    const f = U.fichas[n] || U.fichas[n + " común"];
    const [w, h] = tamFoto[U.fotos[n].split("/").pop().replace(".jpg", "")] || [3, 2];
    return `<article class="dest revelar">
      <div class="dest-foto"><img loading="lazy" src="${U.fotos[n]}" width="${w}" height="${h}" alt="${n} fotografiado en el campus UAO"></div>
      <div class="dest-texto"><h4>${n}</h4><p class="cientifico">${sp.cientifico} <span>(${sp.familia})</span></p>
      ${f ? `<p>${f.texto}</p>` : ""}
      ${f?.wiki ? `<a href="${U.wiki(f.wiki)}" target="_blank" rel="noopener">Fotos y canto en WikiAves</a>` : ""}</div>
    </article>`;
  }).join("");

  function pintarListado(filtro = "") {
    const palabras = norm(filtro).split(/\s+/).filter(Boolean);   // cada palabra se busca por separado: «garza ganado» encuentra «Garza de ganado»
    const visibles = U.lista.filter(s => { const t = norm(`${s.comun} ${s.cientifico} ${s.ingles} ${s.familia}`); return palabras.every(p => t.includes(p)); });
    $("#conteo").textContent = `${visibles.length} de ${U.lista.length} especies`;
    const ordenes = [...new Set(visibles.map(s => s.orden))];
    $("#listado").innerHTML = ordenes.map(o => `
      <div class="orden"><h4>${o}</h4>
      ${visibles.filter(s => s.orden === o).map(s => {
        const ficha = U.fichas[s.comun];
        const ra = E.find(e => e.cientifico === s.cientifico);
        return `<details class="especie"><summary><span><b>${s.comun}</b> <em>${s.cientifico}</em></span>
          <span class="fam">${s.familia}${ra ? ' <i class="tag-ra">RA</i>' : ""}${U.fotos[s.comun] ? ' <i class="tag-foto">foto</i>' : ""}</span></summary>
          <div class="especie-cuerpo"><p class="ingles">${s.ingles}</p>
          ${ficha ? `<p>${ficha.texto}</p>` : "<p>Registrada en el listado general de aves del campus UAO.</p>"}
          ${ficha?.wiki ? `<a href="${U.wiki(ficha.wiki)}" target="_blank" rel="noopener">Más información, galería y canto en WikiAves</a>` : ""}
          ${ra ? `<button class="btn-mini" data-iniciar-ra>Verla en Realidad Aumentada</button>` : ""}</div></details>`;
      }).join("")}</div>`).join("");
  }
  $("#buscar").addEventListener("input", e => pintarListado(e.target.value));
  pintarListado();

  // ---------------- jornadas ----------------
  $("#mosaico").innerHTML = U.jornadas.map((src, i) => `<figure class="revelar m${i}"><img loading="lazy" src="${src}" alt="Jornada de avistamiento de aves en el campus UAO"></figure>`).join("");

  // ---------------- ficha dentro de la RA ----------------
  window.FichaRA = esp => {
    const f = U.fichas[esp.nombre] || U.fichas[esp.nombre.replace(" común", "")];
    const foto = U.fotos[esp.nombre];
    const el = $("#ra-ficha");
    el.innerHTML = `<button class="ra-ficha-cerrar" aria-label="Cerrar">✕</button>
      ${foto ? `<img src="${foto}" alt="${esp.nombre} en el campus UAO">` : ""}
      <h3>${esp.nombre}</h3><p class="cientifico">${esp.cientifico}</p>
      <p>${f ? f.texto : esp.pistas.join(". ") + "."}</p>
      <div class="ra-ficha-botones"><button data-cantar="${esp.canto}"><svg class="ico"><use href="#i-llamar"/></svg> Escuchar</button>
      ${f?.wiki ? `<a href="${U.wiki(f.wiki)}" target="_blank" rel="noopener">WikiAves</a>` : ""}</div>`;
    el.hidden = false;
    el.classList.remove("ver"); void el.offsetWidth; el.classList.add("ver");
    $(".ra-ficha-cerrar", el).onclick = () => { el.hidden = true; };
    $("[data-cantar]", el).onclick = () => Sonido.cantar(esp.canto, 1);
  };
  window.alSalirRA = () => { pintarLibreta(); $("#ra-ficha").hidden = true; };

  // ---------------- iniciar RA ----------------
  $("#ra-xr-especie").innerHTML = E.map(e => `<option value="${e.id}">${e.nombre}</option>`).join("");
  $("#ra-xr-especie").addEventListener("click", e => e.stopPropagation());
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-iniciar-ra]");
    if (!b) return;
    if (!window.RA) { alert("La experiencia RA aún se está cargando. Intenta de nuevo en un momento."); return; }
    window.RA.iniciar();
  });

  // ---------------- portada, cifras y aparición ----------------
  setTimeout(() => window.Escena?.amanecer(1), 400);
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$(".revelar").forEach(el => io.observe(el));
  const ioCifras = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, fin = +el.dataset.valor, t0 = performance.now();
    const paso = now => {
      const k = Math.min(1, (now - t0) / 1600);
      el.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
    ioCifras.unobserve(el);
  }), { threshold: 0.6 });
  $$(".cifra-num").forEach(el => ioCifras.observe(el));
  pintarLibreta();
})();
