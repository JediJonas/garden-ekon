// Språkväxlare. Byter alla texter med data-t="nyckel" till valt språk
// och minns valet i webbläsaren (localStorage, ingen cookie).

(function () {
  var SPRAK = ["sv", "en", "de"];
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
      if (kod === "nb" || kod === "nn" || kod === "no" || kod === "da") kod = "sv";
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
    document.querySelectorAll(".sprakvaxlare button").forEach(function (knapp) {
      knapp.setAttribute("aria-pressed", knapp.getAttribute("data-sprak") === aktuellt ? "true" : "false");
    });
  }

  document.querySelectorAll(".sprakvaxlare button").forEach(function (knapp) {
    knapp.addEventListener("click", function () { valj(knapp.getAttribute("data-sprak")); });
  });

  visa();

  window.Sprak = {
    t: t,
    oversatt: oversatt,
    aktuellt: function () { return aktuellt; },
    vidByte: function (fn) { lyssnare.push(fn); }
  };
})();
