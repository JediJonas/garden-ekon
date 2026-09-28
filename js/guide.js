// Guidesidan: läser platserna från data/platser.json och visar dem
// på kartan och i listan under. Filterknapparna styr båda samtidigt.

(function () {
  var KATEGORIER = ["natur", "bad", "barnfamiljer", "mat-och-fika", "kultur", "regnvader"];
  var t = window.Sprak.t;

  var platser = [];
  var stugan = null;
  var valdKategori = "alla";
  var markorer = {};

  var karta = L.map("karta", { scrollWheelZoom: false });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(karta);
  karta.setView([57.70, 14.47], 11);

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
    return sprakText[window.Sprak.aktuellt()] || sprakText.sv || sprakText.en || "";
  }

  // Öppnar vägbeskrivning i Google Maps (appen om den finns, annars i webbläsaren).
  function vagLank(plats) {
    return "https://www.google.com/maps/dir/?api=1&destination=" + plats.lat + "," + plats.lng;
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
    div.appendChild(skapa("span", "", pa(plats.distance)));
    div.appendChild(document.createElement("br"));
    var lank = skapa("a", "knapp", t("guide.vag"));
    lank.href = vagLank(plats);
    lank.target = "_blank";
    lank.rel = "noopener";
    div.appendChild(lank);
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
      if (plats.exempel || !plats.lastVerified) {
        etiketter.appendChild(skapa("span", "etikett etikett-exempel", t("guide.exempel")));
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
        mer.href = plats.link;
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

  ritaFilter();

  Promise.all([hamta("data/platser.json"), hamta("data/stugan.json").catch(function () { return null; })])
    .then(function (resultat) {
      platser = resultat[0];
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
