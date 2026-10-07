// Sparar sajten i gästens webbläsare (ingen cookie, ingen spårning).
// - Sidor och platsdata hämtas från nätet först, så att ändringar syns direkt.
//   Är nätet långsamt eller borta visas den sparade versionen i stället.
// - Bilder, typsnitt, CSS och skript visas direkt från det sparade och
//   uppdateras i bakgrunden till nästa besök.
// Höj VERSION om listan GRUND ändras, eller när sidorna och skripten ändras
// så att de måste bytas samtidigt (annars kan en gammal sparad version av
// ett skript visas en gång ihop med en ny sida).

var VERSION = "9";
var CACHE = "ekon-" + VERSION;
var VANTA_PA_NATET = 3000; // millisekunder innan den sparade sidan visas

// Det här sparas redan vid första besöket, så att alla sidor fungerar utan
// täckning. Kartan (Leaflet) och bilderna sparas först när de har visats.
var GRUND = [
  "./",
  "index.html",
  "stugan.html",
  "hitta-hit.html",
  "guide.html",
  "info.html",
  "integritet.html",
  "css/style.css",
  "js/texter.js",
  "js/sprak.js",
  "js/offline.js",
  "js/guide.js",
  "js/bildvisare.js",
  "data/platser.json",
  "data/stugan.json",
  "fonts/dosis/dosis-latin-800-normal.woff2",
  "fonts/jost/jost-latin-300-normal.woff2",
  "fonts/jost/jost-latin-400-normal.woff2",
  "fonts/jost/jost-latin-500-normal.woff2"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(GRUND); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (namn) {
        return Promise.all(namn.map(function (n) {
          if (n.indexOf("ekon-") === 0 && n !== CACHE) return caches.delete(n);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

function spara(request, svar) {
  if (svar && svar.ok) {
    var kopia = svar.clone();
    caches.open(CACHE).then(function (cache) { cache.put(request, kopia); });
  }
  return svar;
}

// Nätet först, men visa det sparade om nätet dröjer eller saknas.
function natetForst(e) {
  var fran_natet = fetch(e.request).then(function (svar) { return spara(e.request, svar); });
  e.waitUntil(fran_natet.catch(function () {}));
  var sparat = caches.match(e.request, { ignoreSearch: true });

  return new Promise(function (resolve, reject) {
    var klar = false;
    function svara(svar) { if (!klar && svar) { klar = true; resolve(svar); } }

    var timer = setTimeout(function () { sparat.then(svara); }, VANTA_PA_NATET);
    fran_natet.then(function (svar) { clearTimeout(timer); svara(svar); })
      .catch(function () {
        clearTimeout(timer);
        sparat.then(function (svar) {
          if (svar) svara(svar);
          else if (!klar) reject(new Error("offline"));
        });
      });
  });
}

// Det sparade först, och uppdatera i bakgrunden.
function spartForst(e) {
  return caches.match(e.request).then(function (sparat) {
    var fran_natet = fetch(e.request).then(function (svar) { return spara(e.request, svar); });
    if (sparat) {
      e.waitUntil(fran_natet.catch(function () {}));
      return sparat;
    }
    return fran_natet;
  });
}

self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  // Bara sajtens egna filer. Kartbilder från OpenStreetMap lämnas orörda.
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;

  if (e.request.mode === "navigate" || url.pathname.slice(-5) === ".json") {
    e.respondWith(natetForst(e));
  } else {
    e.respondWith(spartForst(e));
  }
});
