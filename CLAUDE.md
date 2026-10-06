# Stugguiden – projektbeskrivning

## Syfte

Det här är en webbplats för min sommarstuga som jag hyr ut till turister. Bokning sker via Booking.com, så sajten har ingen egen bokning. Sajten är ett komplement till Booking.com-sidan:

1. **Huvudsyfte:** en gästguide med tips om omgivningarna, sorterade efter intresse och visade på en karta, samt tydlig vägbeskrivning. Gästerna ska ha lätt att njuta av sin semester.
2. **Sekundärt syfte:** visa upp stugan och leda besökare vidare till Booking.com via en tydlig bokningsknapp.

Booking.com-sida: https://www.booking.com/hotel/se/ekon-2.sv.html
Plats: https://maps.app.goo.gl/dKsF288DYnuQSRUFA

## Målgrupp och design

* Turister som ofta använder sajten i mobilen, på språng, i bilen eller vid stugan. **Mobilen först.**
* Snabb laddning, stora klickytor, enkel navigering med tummen.
* **Alla ändringar ska vara optimerade för mobil och snabb laddning**, eftersom många gäster surfar via långsamma roamingnät. Det betyder bland annat:
  * Bilder i lagom storlek för mobilen och i WebP-format (med JPG som reserv). Ladda aldrig in en stor bild där en liten räcker.
  * Bilder längre ner på sidan laddas först när gästen skrollar dit.
  * Inga onödiga typsnitt, skript eller filer från andra webbplatser.
  * Sajten sparas i gästens webbläsare (`sw.js`) så att den öppnas snabbt och fungerar utan täckning. Nya sidor och skript läggs till i listan `GRUND` där.
* Lugn, personlig känsla som speglar stugan och området. Inte en generisk mall.

## Teknik

* Statisk sajt: HTML, CSS och vanilla JavaScript. **Inga ramverk och inget byggsteg.**
* Karta: Leaflet med OpenStreetMap-kartor.
* Hosting: GitHub Pages. Sajten publiceras automatiskt vid push till `main`.
* Inga cookies, ingen spårning och inga tredjepartsskript utöver Leaflet, utan att först fråga mig.

## Sidor

* `index.html` – startsida med bokningsknapp till Booking.com
* `stugan.html` – om stugan, faciliteter, bilder
* `hitta-hit.html` – vägbeskrivning med bil och kollektivtrafik, parkering, kännetecken för sista biten
* `guide.html` – tipsguide med karta och filtrering efter intresse
* `info.html` – praktisk information och vanliga frågor
* `integritet.html` – kort integritetsinformation

## Platsdata

Alla tips och kartpunkter finns i `data/platser.json`. **Sidkoden ska aldrig innehålla platsdata direkt.** Att uppdatera guiden ska bara kräva ändringar i den här filen.

Varje plats har formatet:

```json
{
  "id": "norra-stranden",
  "name": "Norra stranden",
  "category": ["bad", "barnfamiljer"],
  "description": { "sv": "…", "en": "…" },
  "lat": 59.123,
  "lng": 18.456,
  "distance": { "sv": "10 min med cykel", "en": "10 min by bike" },
  "season": { "sv": "juni–augusti", "en": "June–August" },
  "link": "https://…",
  "lastVerified": "2026-09"
}
```

Kategorier: `natur`, `bad`, `barnfamiljer`, `mat-och-fika`, `regnvader`. (`kultur` är ersatt av `regnvader`.) Nya kategorier läggs bara till efter att du frågat mig.

Varje plats på kartan ska ha en länk "Vägbeskrivning" som öppnar navigeringen i gästens mobil.

## Språk

Sajten finns på: svenska, engelska, tyska. Alla texter ska finnas på alla språk. Gästen väljer språk med en enkel växlare.

Länkar till andra webbplatser ska öppnas på det språk gästen valt, när webbplatsen finns på det språket:

* Naturkartan, Booking.com och Google Maps byts automatiskt av `lank()` i `js/sprak.js`. Det gäller alla länkar på sidorna och länkarna i guiden.
* Lägger du till en länk till en ny webbplats som finns på flera språk: lägg till regeln för den i `lank()` om adressen följer ett mönster, eller ange länken per språk i `data/platser.json` (`"link": { "sv": "…", "en": "…", "de": "…" }`).
* Finns ingen tysk version men en engelsk, länka till den engelska för tyska gäster. `"link"` behöver då bara `sv` och `en`.
* Gissa aldrig en språkadress. Kontrollera att den finns, annars behåll den svenska länken.

## Innehållsregler

* Uppgifter om stugan (antal bäddar, faciliteter, regler) måste stämma med Booking.com-sidan. Hitta aldrig på fakta om stugan.
* Stugans adress får publiceras (den står redan på Booking.com).
* Publicera **aldrig** nyckelkoder, portkoder eller wifi-lösenord. Skriv i stället att gästerna får detaljerna efter bokning.
* Om du lägger till eller ändrar en plats, sätt `lastVerified` till aktuell månad bara om jag bekräftat uppgifterna. Annars flagga den som overifierad för mig.

## Arbetssätt

* Pusha **aldrig** direkt till `main`. Lägg alla ändringar på en egen gren och skapa en pull request mot `main`, som jag godkänner innan den läggs in.
* Gör små, avgränsade ändringar med tydliga commit-meddelanden på svenska.
* Kontrollera att `data/platser.json` är giltig JSON efter varje ändring.
* Kontrollera att sidorna fungerar i mobilbredd (cirka 375 px).
* Fråga innan du tar bort sidor, platser eller bilder.
* Förklara ändringar kort och på enkel svenska. Jag är inte utvecklare.

