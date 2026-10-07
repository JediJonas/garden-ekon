// Språkväxlare. Byter alla texter med data-t="nyckel" till valt språk
// och minns valet i webbläsaren (localStorage, ingen cookie).

(function () {
  var SPRAK = ["sv", "en", "de", "nl", "da"];
  var NYCKEL = "sprak";
  var lyssnare = [];

  function sparat() {
    try { return localStorage.getItem(NYCKEL); } catch (e) { return null; }
  }

  function spara(sprak) {
    try { localStorage.setItem(NYCKEL, sprak); } catch (e) { /* privat läge m.m. */ }
  }

  // Första besöket: gissa från webbläsarens språk, annars engelska.
  function startsprak() {
    var val = sparat();
    if (SPRAK.indexOf(val) !== -1) return val;
    var lista = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < lista.length; i++) {
      var kod = String(lista[i]).slice(0, 2).toLowerCase();
      if (kod === "nb" || kod === "nn" || kod === "no") kod = "sv";
      if (SPRAK.indexOf(kod) !== -1) return kod;
    }
    return "en";
  }

  var aktuellt = startsprak();

  function t(nyckel) {
    var texter = window.TEXTER[aktuellt] || {};
    if (texter[nyckel] !== undefined) return texter[nyckel];
    return window.TEXTER.sv[nyckel] !== undefined ? window.TEXTER.sv[nyckel] : nyckel;
  }

  function oversatt(rot) {
    (rot || document).querySelectorAll("[data-t]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-t"));
    });
    (rot || document).querySelectorAll("[data-t-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-t-aria")));
    });
    (rot || document).querySelectorAll("[data-t-alt]").forEach(function (el) {
      el.setAttribute("alt", t(el.getAttribute("data-t-alt")));
    });
  }

  // Länkar till andra webbplatser som finns på flera språk öppnas på det
  // språk gästen valt. Nya sådana webbplatser läggs till här.
  var BOOKING_SPRAK = { sv: "sv", en: "en-gb", de: "de", nl: "nl", da: "da" };

  function lank(url) {
    if (!url) return url;
    // Naturkartan: /sv/…, /en/…, /de/…, /nl/…, /da/…
    url = url.replace(/^(https?:\/\/(?:www\.)?naturkartan\.se)\/(?:sv|en|de|nl|da)(?=\/|$)/,
      "$1/" + aktuellt);
    // Booking.com: ….sv.html, ….en-gb.html, ….de.html, ….nl.html, ….da.html
    url = url.replace(/^(https?:\/\/(?:www\.)?booking\.com\/hotel\/[^?#]*?)(?:\.[a-z]{2}(?:-[a-z]{2})?)?\.html/,
      "$1." + BOOKING_SPRAK[aktuellt] + ".html");
    // Google Maps: språket anges med hl=
    if (/^https?:\/\/(?:www\.)?google\.[a-z.]+\/maps/.test(url)) {
      url = url.replace(/([?&])hl=[^&#]*&?/, "$1").replace(/[?&]$/, "");
      url += (url.indexOf("?") === -1 ? "?" : "&") + "hl=" + aktuellt;
    }
    return url;
  }

  function sprakaLankar(rot) {
    (rot || document).querySelectorAll("a[href^='http']").forEach(function (a) {
      var ny = lank(a.getAttribute("href"));
      if (ny !== a.getAttribute("href")) a.setAttribute("href", ny);
    });
  }

  function valj(sprak) {
    if (SPRAK.indexOf(sprak) === -1) return;
    aktuellt = sprak;
    spara(sprak);
    visa();
    lyssnare.forEach(function (fn) { fn(sprak); });
  }

  function visa() {
    document.documentElement.lang = aktuellt;
    oversatt(document);
    sprakaLankar(document);
    document.querySelectorAll(".sprakkod").forEach(function (el) {
      el.textContent = aktuellt.toUpperCase();
    });
    document.querySelectorAll(".sprakpanel button").forEach(function (knapp) {
      if (knapp.getAttribute("data-sprak") === aktuellt) knapp.setAttribute("aria-current", "true");
      else knapp.removeAttribute("aria-current");
    });
  }

  // Språkmenyn: knappen öppnar och stänger listan. Den stängs också när
  // gästen väljer ett språk, trycker utanför eller trycker Esc.
  var meny = document.querySelector(".sprakmeny");
  if (meny) {
    var knapp = meny.querySelector(".sprakknapp");
    var panel = meny.querySelector(".sprakpanel");

    var oppna = function (ja) {
      panel.hidden = !ja;
      knapp.setAttribute("aria-expanded", ja ? "true" : "false");
    };

    knapp.addEventListener("click", function () { oppna(panel.hidden); });
    panel.querySelectorAll("button").forEach(function (val) {
      val.addEventListener("click", function () {
        valj(val.getAttribute("data-sprak"));
        oppna(false);
        knapp.focus();
      });
    });
    document.addEventListener("click", function (e) {
      if (!panel.hidden && !meny.contains(e.target)) oppna(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) { oppna(false); knapp.focus(); }
    });
  }

  visa();

  window.Sprak = {
    t: t,
    oversatt: oversatt,
    lank: lank,
    aktuellt: function () { return aktuellt; },
    vidByte: function (fn) { lyssnare.push(fn); }
  };
})();
