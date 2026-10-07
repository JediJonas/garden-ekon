# Tillgänglighet – vad sajten uppfyller

Mål: **WCAG 2.2 nivå AA** (se regeln i `CLAUDE.md`).

Senast granskad: **oktober 2026**, alla sex sidor i mobilbredd (375 px) och på dator, i ljust och mörkt läge.
Så granskades sajten: automatiskt test med axe (WCAG 2.2 A och AA), test med tangentbord, och beräkning av färgkontraster.

Uppdatera den här filen när en ändring påverkar något av kraven nedan.

## Gäller lagen?

Nej, i praktiken inte. Tillgänglighetsdirektivet (svensk lag sedan juni 2025) gäller bland annat e-handel där man ingår avtal på webbplatsen. Den här sajten tar inga bokningar, det gör Booking.com. Mikroföretag är dessutom undantagna. Lagen om digital offentlig service gäller bara offentlig sektor. Vi följer ändå WCAG 2.2 AA, eftersom det gör sajten lättare att använda för alla gäster.

## Sammanfattning

* **Uppfyllt:** alla krav som är aktuella för sajten.
* **Ej aktuellt:** krav om ljud, video, formulär och inloggning, eftersom sajten inte har något sådant.
* **Kvar att tänka på:** se sista avsnittet.

Förklaring: ✅ uppfyllt · ➖ ej aktuellt (sajten har inget sådant innehåll)

## 1. Möjligt att uppfatta

| Krav | Nivå | | Så här uppfyller sajten kravet |
|---|---|---|---|
| 1.1.1 Icke-textuellt innehåll | A | ✅ | Alla bilder har beskrivande alt-text på alla fem språk. Ikoner bredvid text är dolda för skärmläsare. Kartmarkörerna har platsens namn. |
| 1.2.1–1.2.5 Ljud och video | A/AA | ➖ | Sajten har inget ljud eller video. |
| 1.3.1 Information och relationer | A | ✅ | Rubriker, listor, meny (`nav`), huvudinnehåll (`main`) och frågor (`details`) är rätt uppmärkta. |
| 1.3.2 Meningsfull ordningsföljd | A | ✅ | Ordningen i koden följer den ordning man läser sidan. |
| 1.3.3 Sensoriska egenskaper | A | ✅ | Instruktioner hänvisar inte bara till form, färg eller plats på skärmen. |
| 1.3.4 Visningsriktning | AA | ✅ | Sajten fungerar både stående och liggande. |
| 1.3.5 Identifiera syftet med inmatning | AA | ➖ | Inga formulär. |
| 1.4.1 Användning av färg | A | ✅ | Länkar i text är understrukna. Vald sida och valt filter visas även med understrykning eller fylld knapp, och meddelas till skärmläsare. |
| 1.4.2 Ljudkontroll | A | ➖ | Inget ljud. |
| 1.4.3 Kontrast (minimum) | AA | ✅ | All text har minst 4,5:1 i både ljust och mörkt läge. Lägst: grå text 4,9:1, bokningsknappen 5,0:1. Vit text på fotot ligger på en mörk toning. |
| 1.4.4 Ändra textstorlek | AA | ✅ | Zoom är tillåten, och texten går att förstora till 200 %. |
| 1.4.5 Bilder av text | AA | ✅ | All text är riktig text, även loggan. |
| 1.4.10 Anpassning till skärmstorlek | AA | ✅ | Sidorna fungerar ner till 320 px bredd utan att man behöver skrolla i sidled. |
| 1.4.11 Kontrast för icke-textuellt innehåll | AA | ✅ | Ikoner, fokusram (5,1:1 och vit över fotot) och valt filter har minst 3:1. |
| 1.4.12 Textavstånd | AA | ✅ | Inga fasta texthöjder som klipper text när avstånden ökas. |
| 1.4.13 Innehåll vid hovring eller fokus | AA | ✅ | Inget innehåll dyker upp bara vid hovring. Kartrutorna öppnas med klick. |

## 2. Hanterbart

| Krav | Nivå | | Så här uppfyller sajten kravet |
|---|---|---|---|
| 2.1.1 Tangentbord | A | ✅ | Allt går att använda med tangentbord: meny, språkmeny, filter, kartan, bildvisaren och frågorna. |
| 2.1.2 Ingen tangentbordsfälla | A | ✅ | Språkmenyn och bildvisaren stängs med Esc, och fokus går tillbaka. |
| 2.1.4 Kortkommandon | A | ➖ | Sajten har inga egna kortkommandon. |
| 2.2.1 Justerbar tidsgräns | A | ✅ | Inga tidsgränser. Tipset "använd två fingrar" är bara en hjälp och upprepas vid behov. |
| 2.2.2 Pausa, stoppa, dölja | A | ✅ | Inget som rör sig eller uppdateras av sig självt. |
| 2.3.1 Tre blinkningar | A | ✅ | Inget blinkar. |
| 2.4.1 Hoppa över block | A | ✅ | Länken "Hoppa till innehållet" visas först när man använder tangentbord. Sidorna har också `main` och `nav`. |
| 2.4.2 Sidtitlar | A | ✅ | Varje sida har en egen titel på valt språk. |
| 2.4.3 Fokusordning | A | ✅ | Fokus följer sidans ordning. Fokus stannar på filterknappen man valt, och "Visa på kartan" och "Visa info" flyttar fokus dit gästen skickas. |
| 2.4.4 Länkars syfte (i sammanhang) | A | ✅ | Länktexter som "Läs mer" står i samma kort som platsens namn. |
| 2.4.5 Flera sätt | AA | ✅ | Menyn på varje sida leder till alla sidor. Startsidan har genvägar och sidfoten länkar till integritetssidan. |
| 2.4.6 Rubriker och etiketter | AA | ✅ | Rubrikerna beskriver innehållet. |
| 2.4.7 Synligt fokus | AA | ✅ | Tydlig fokusram (3 px) på allt som går att klicka på. |
| 2.4.11 Fokus inte dolt | AA | ✅ | Sidan lämnar plats för sidhuvudet och menyraden längst ner, så det markerade aldrig hamnar bakom dem. |
| 2.5.1 Pekargester | A | ✅ | Kartan kan zoomas med knapparna + och −. I bildvisaren finns pilknappar i stället för svep. |
| 2.5.2 Avbryta pekarinteraktion | A | ✅ | Knappar reagerar först när man släpper. |
| 2.5.3 Etikett i namn | A | ✅ | Det skärmläsaren läser innehåller den synliga texten, t.ex. "Välj språk SV". |
| 2.5.4 Rörelseaktivering | A | ➖ | Inget styrs genom att skaka eller luta mobilen. |
| 2.5.7 Dragrörelser | AA | ✅ | Kartan behöver inte dras: zoomknappar och knappen "Visa på kartan" vid varje plats visar samma sak. |
| 2.5.8 Storlek på klickytor (minimum) | AA | ✅ | Knappar är minst 44 px höga. Kartmarkörer som ligger tätt omlott har samma funktion i listan (undantaget för likvärdig funktion). |

## 3. Begripligt

| Krav | Nivå | | Så här uppfyller sajten kravet |
|---|---|---|---|
| 3.1.1 Sidans språk | A | ✅ | Sidans språk (`lang`) byts när gästen väljer språk, så skärmläsaren uttalar rätt. |
| 3.1.2 Språk för delar | AA | ✅ | Språknamnen i språkmenyn är märkta med sitt eget språk. |
| 3.2.1 Fokus | A | ✅ | Inget ändras bara för att något får fokus. |
| 3.2.2 Inmatning | A | ✅ | Språket byts först när gästen trycker på ett språk. |
| 3.2.3 Konsekvent navigering | AA | ✅ | Samma meny i samma ordning på alla sidor. |
| 3.2.4 Konsekvent identifiering | AA | ✅ | Samma funktioner har samma namn och ikoner överallt. |
| 3.2.6 Konsekvent hjälp | A | ➖ | Hjälp finns bara på en sida (Info), inte upprepad på flera sidor. |
| 3.3.1–3.3.4, 3.3.7, 3.3.8 Formulär och inloggning | A/AA | ➖ | Inga formulär och ingen inloggning. Bokning sker på Booking.com. |

## 4. Robust

| Krav | Nivå | | Så här uppfyller sajten kravet |
|---|---|---|---|
| 4.1.2 Namn, roll, värde | A | ✅ | Knappar och länkar har namn på valt språk. Filterknappar meddelar om de är valda, språkmenyn om den är öppen. Bildvisaren är en riktig dialogruta. Länkar som öppnas i ny flik säger det till skärmläsare. |
| 4.1.3 Statusmeddelanden | AA | ✅ | Antal platser i guiden och meddelanden som "Laddar platser" läses upp utan att fokus flyttas. |

## Kvar att tänka på

* **Kartbilderna** kommer från OpenStreetMap och kan inte göras tillgängliga av oss. All information finns därför också i listan under kartan.
* **Booking.com** och andra webbplatser vi länkar till ansvarar själva för sin tillgänglighet.
* **Fotot överst på startsidan** ligger utanför sidans uppmärkta områden. Det är en rekommendation från testverktyget, inte ett WCAG-krav.
* Granskningen är gjord med verktyg och tangentbord. Den är inte testad av personer med funktionsnedsättning eller med alla skärmläsare.
