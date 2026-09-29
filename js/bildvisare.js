// Bildvisare för galleriet på stugsidan. Öppnar bilden stort och låter
// gästen bläddra med pilknappar, piltangenter eller genom att svepa.
// Utan JavaScript fungerar länkarna som vanligt och öppnar bilden direkt.

(function () {
  var visare = document.getElementById("bildvisare");
  var galleri = document.querySelector(".bildgalleri");
  if (!visare || !galleri || typeof visare.showModal !== "function") return;

  var lankar = Array.prototype.slice.call(galleri.querySelectorAll("a"));
  var bild = visare.querySelector(".bildvisare-bild");
  var text = visare.querySelector(".bildvisare-text");
  var raknare = visare.querySelector(".bildvisare-raknare");
  var aktuell = 0;

  function visa(index) {
    aktuell = (index + lankar.length) % lankar.length;
    var lank = lankar[aktuell];
    var liten = lank.querySelector("img");
    bild.src = lank.getAttribute("href");
    bild.alt = liten ? liten.alt : "";
    text.textContent = bild.alt;
    raknare.textContent = (aktuell + 1) + " / " + lankar.length;
    // Ladda nästa och föregående i förväg så att bläddringen går snabbt.
    [aktuell + 1, aktuell - 1].forEach(function (i) {
      new Image().src = lankar[(i + lankar.length) % lankar.length].getAttribute("href");
    });
  }

  lankar.forEach(function (lank, index) {
    lank.addEventListener("click", function (e) {
      e.preventDefault();
      visa(index);
      visare.showModal();
      document.documentElement.classList.add("bildvisare-oppen");
    });
  });

  visare.addEventListener("close", function () {
    document.documentElement.classList.remove("bildvisare-oppen");
    lankar[aktuell].focus();
  });

  visare.querySelector(".bildvisare-stang").addEventListener("click", function () { visare.close(); });
  visare.querySelector(".bildvisare-foregaende").addEventListener("click", function () { visa(aktuell - 1); });
  visare.querySelector(".bildvisare-nasta").addEventListener("click", function () { visa(aktuell + 1); });

  // Klick på den mörka bakgrunden stänger.
  visare.addEventListener("click", function (e) {
    if (e.target === visare || e.target.classList.contains("bildvisare-yta")) visare.close();
  });

  visare.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); visa(aktuell + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); visa(aktuell - 1); }
  });

  // Svep åt vänster eller höger i mobilen.
  var startX = null, startY = null;
  visare.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  visare.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    startX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) visa(aktuell + (dx < 0 ? 1 : -1));
  });
})();
