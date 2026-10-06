// Startar sw.js, som sparar sajten i gästens webbläsare så att sidorna
// öppnas snabbt nästa gång och fungerar även utan täckning.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").catch(function () { /* t.ex. privat läge */ });
  });
}
