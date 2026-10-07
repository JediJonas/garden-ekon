// Guidesidan: läser platserna från data/platser.json och visar dem
// på kartan och i listan under. Filterknapparna styr båda samtidigt.

(function () {
  var KATEGORIER = ["natur", "bad", "barnfamiljer", "mat-och-fika", "regnvader", "sevardheter"];
  var t = window.Sprak.t;

  var platser = [];
  var stugan = null;
  var valdKategori = "alla";
  var markorer = {};

  // I mobilen skrollar ett finger sidan och två fingrar flyttar kartan,
  // så att gästen inte fastnar i kartan när hen skrollar förbi den.
  var pekskarm = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  var karta = L.map("karta", { scrollWheelZoom: false, dragging: !pekskarm });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
  }).addTo(karta);
  karta.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
  karta.setView([57.70, 14.47], 11);

  if (pekskarm) visaTvaFingerTips(document.getElementById("karta"));

  // Visar en kort ruta "Använd två fingrar …" när gästen drar med ett finger på kartan.
  function visaTvaFingerTips(kartEl) {
    var tips = document.createElement("div");
    tips.className = "karta-tips";
    tips.setAttribute("aria-hidden", "true");
    kartEl.appendChild(tips);
    var timer;
    kartEl.addEventListener("touchmove", function (e) {
      if (e.touches.length !== 1) {
        tips.classList.remove("synlig");
        return;
      }
      tips.textContent = t("guide.tvafingrar");
      tips.classList.add("synlig");
      clearTimeout(timer);
      timer = setTimeout(function () { tips.classList.remove("synlig"); }, 1500);
    }, { passive: true });
  }

  var platsLager = L.layerGroup().addTo(karta);
  var stuglager = L.layerGroup().addTo(karta);

  var filterEl = document.getElementById("filter");
  var listaEl = document.getElementById("platslista");
  var meddelandeEl = document.getElementById("meddelande");
  var antalEl = document.getElementById("antal");

  // Texter som finns per språk i platser.json, t.ex. { "sv": "…", "en": "…" }
  function pa(sprakText) {
    if (!sprakText) return "";
    if (typeof sprakText === "string") return sprakText;
    var sprak = window.Sprak.aktuellt();
    // Saknas texten på valt språk visas engelska (svenska gäster får svenska).
    return sprakText[sprak] || (sprak !== "sv" && sprakText.en) || sprakText.sv || sprakText.en || "";
  }

  // "Läs mer"-länken. Den kan vara en adress eller en per språk,
  // t.ex. { "sv": "…", "en": "…" }. Saknas valt språk används engelska.
  function lankFor(plats) {
    var l = plats.link;
    if (typeof l !== "string") {
      var sprak = window.Sprak.aktuellt();
      l = l[sprak] || (sprak !== "sv" && l.en) || l.sv || l.en;
    }
    return window.Sprak.lank(l);
  }

  // Öppnar vägbeskrivning i Google Maps (appen om den finns, annars i webbläsaren).
  function vagLank(plats) {
    return window.Sprak.lank("https://www.google.com/maps/dir/?api=1&destination=" + plats.lat + "," + plats.lng);
  }

  function skapa(tagg, klass, text) {
    var el = document.createElement(tagg);
    if (klass) el.className = klass;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function synliga() {
    if (valdKategori === "alla") return platser;
    return platser.filter(function (p) { return p.category.indexOf(valdKategori) !== -1; });
  }

  function ritaFilter() {
    filterEl.innerHTML = "";
    ["alla"].concat(KATEGORIER).forEach(function (kat) {
      var knapp = skapa("button", "", kat === "alla" ? t("guide.alla") : t("kat." + kat));
      knapp.type = "button";
      knapp.setAttribute("aria-pressed", kat === valdKategori ? "true" : "false");
      knapp.addEventListener("click", function () {
        valdKategori = kat;
        ritaAllt(true);
      });
      filterEl.appendChild(knapp);
    });
  }

  function popupInnehall(plats) {
    var div = skapa("div");
    div.appendChild(skapa("strong", "", plats.name));
    var lank = skapa("a", "knapp", t("guide.vag"));
    lank.href = vagLank(plats);
    lank.target = "_blank";
    lank.rel = "noopener";
    var knappar = skapa("div", "popup-knappar");
    knappar.appendChild(lank);

    // "Visa info": skrollar ner till platsens text i listan och markerar den en kort stund.
    var iListan = skapa("button", "knapp knapp-sekundar", t("guide.ilistan"));
    iListan.type = "button";
    iListan.addEventListener("click", function () {
      var li = document.getElementById("plats-" + plats.id);
      if (!li) return;
      li.scrollIntoView({ behavior: "smooth", block: "start" });
      li.classList.add("markerad");
      setTimeout(function () { li.classList.remove("markerad"); }, 2000);
    });
    knappar.appendChild(iListan);
    div.appendChild(knappar);
    return div;
  }

  function ritaKarta(anpassaVy) {
    platsLager.clearLayers();
    markorer = {};
    var lista = synliga();
    lista.forEach(function (plats) {
      var m = L.marker([plats.lat, plats.lng], { title: plats.name, alt: plats.name })
        .bindPopup(popupInnehall(plats));
      m.addTo(platsLager);
      markorer[plats.id] = m;
    });

    stuglager.clearLayers();
    if (stugan) {
      L.circleMarker([stugan.lat, stugan.lng], {
        radius: 10, color: "#fff", weight: 3, fillColor: "#b4532a", fillOpacity: 1
      }).bindPopup(stugan.ungefarligt ? t("guide.stugan") : stugan.name).addTo(stuglager);
    }

    if (anpassaVy && lista.length) {
      var punkter = lista.map(function (p) { return [p.lat, p.lng]; });
      if (stugan) punkter.push([stugan.lat, stugan.lng]);
      karta.fitBounds(punkter, { padding: [30, 30], maxZoom: 14 });
    }
  }

  function ritaLista() {
    listaEl.innerHTML = "";
    var lista = synliga();
    antalEl.textContent = lista.length === 1 ? t("guide.antal.en") : t("guide.antal").replace("{n}", lista.length);

    if (!lista.length) {
      meddelandeEl.textContent = t("guide.tom");
      meddelandeEl.hidden = false;
      return;
    }
    meddelandeEl.hidden = true;

    lista.forEach(function (plats) {
      var li = skapa("li", "kort plats");
      li.id = "plats-" + plats.id;

      var etiketter = skapa("div");
      if (plats.exempel) {
        etiketter.appendChild(skapa("span", "etikett etikett-exempel", t("guide.exempel")));
      } else if (!plats.lastVerified) {
        etiketter.appendChild(skapa("span", "etikett etikett-exempel", t("guide.overifierad")));
      }
      plats.category.forEach(function (kat) {
        etiketter.appendChild(skapa("span", "etikett", t("kat." + kat)));
      });
      li.appendChild(etiketter);

      li.appendChild(skapa("h3", "", plats.name));
      li.appendChild(skapa("p", "", pa(plats.description)));

      var fakta = skapa("div", "fakta");
      if (plats.distance) fakta.appendChild(skapa("span", "", t("guide.avstand") + ": " + pa(plats.distance)));
      if (plats.season) fakta.appendChild(skapa("span", "", t("guide.sasong") + ": " + pa(plats.season)));
      li.appendChild(fakta);

      var knappar = skapa("div", "knappar");
      var vag = skapa("a", "knapp", t("guide.vag"));
      vag.href = vagLank(plats);
      vag.target = "_blank";
      vag.rel = "noopener";
      knappar.appendChild(vag);

      var visa = skapa("button", "knapp knapp-sekundar", t("guide.visa"));
      visa.type = "button";
      visa.addEventListener("click", function () {
        karta.setView([plats.lat, plats.lng], 14);
        if (markorer[plats.id]) markorer[plats.id].openPopup();
        document.getElementById("karta").scrollIntoView({ behavior: "smooth", block: "center" });
      });
      knappar.appendChild(visa);

      if (plats.link) {
        var mer = skapa("a", "knapp knapp-sekundar", t("guide.mer"));
        mer.href = lankFor(plats);
        mer.target = "_blank";
        mer.rel = "noopener";
        knappar.appendChild(mer);
      }
      li.appendChild(knappar);
      listaEl.appendChild(li);
    });
  }

  function ritaAllt(anpassaVy) {
    ritaFilter();
    ritaKarta(anpassaVy);
    ritaLista();
  }

  function hamta(url) {
    return fetch(url).then(function (svar) {
      if (!svar.ok) throw new Error(url + ": " + svar.status);
      return svar.json();
    });
  }

  // Restid i minuter, läst ur den svenska texten, t.ex. "ca 1 tim 30 min med bil".
  // Listan visas med det närmaste först. Platser utan restid hamnar sist.
  function minuter(plats) {
    var text = (plats.distance && plats.distance.sv) || "";
    var tim = text.match(/(\d+)\s*tim/);
    var min = text.match(/(\d+)\s*min/);
    if (!tim && !min) return Infinity;
    return (tim ? +tim[1] * 60 : 0) + (min ? +min[1] : 0);
  }

  function sorteraEfterRestid(lista) {
    return lista
      .map(function (plats, i) { return { plats: plats, i: i, m: minuter(plats) }; })
      .sort(function (a, b) { return a.m - b.m || a.i - b.i; })
      .map(function (x) { return x.plats; });
  }

  ritaFilter();

  Promise.all([hamta("data/platser.json"), hamta("data/stugan.json").catch(function () { return null; })])
    .then(function (resultat) {
      platser = sorteraEfterRestid(resultat[0]);
      stugan = resultat[1];
      document.getElementById("exempelvarning").hidden = !platser.some(function (p) { return p.exempel; });
      ritaAllt(true);
    })
    .catch(function (fel) {
      console.error(fel);
      meddelandeEl.textContent = t("guide.fel");
      meddelandeEl.setAttribute("data-t", "guide.fel");
    });

  // Vid språkbyte: rita om, men behåll kartans läge.
  window.Sprak.vidByte(function () {
    if (platser.length) ritaAllt(false); else ritaFilter();
  });
})();
