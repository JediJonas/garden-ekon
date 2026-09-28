# Gården Ekön – gästguide

Statisk webbplats för stugan på Ekön: gästguide med karta, vägbeskrivning och länk till bokning på Booking.com.

Se `CLAUDE.md` för hur sajten är uppbyggd och vilka regler som gäller.

## Öppna sajten på din egen dator

Guidesidan läser platserna från en fil, och det tillåter webbläsare bara när sidan visas via en webbserver. Så här gör du:

1. Öppna Terminalen (Mac) eller PowerShell (Windows) i mappen där sajten ligger.
2. Skriv `python3 -m http.server` och tryck Enter (på Windows: `python -m http.server`).
3. Gå till http://localhost:8000 i webbläsaren.

## Innehåll

- `data/platser.json` – alla tips som visas i guiden och på kartan.
- `data/stugan.json` – stugans läge på kartan.
- `js/texter.js` – alla texter på svenska, engelska och tyska.
- `vendor/leaflet/` – kartbiblioteket Leaflet (sparat här så att inga externa skript behövs).
