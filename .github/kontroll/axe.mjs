// Tillgänglighetstest med axe (WCAG 2.2 A och AA) av alla sidor, i
// mobilbredd, i ljust och mörkt läge och på alla språk. Avslutar med fel
// om något hittas. Körs av .github/workflows/kontroll.yml.
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const bas = process.env.BAS || "http://localhost:8000";
const sidor = ["index", "stugan", "hitta-hit", "guide", "info", "integritet"];
const sprak = ["sv", "en", "de", "nl", "da"];
// Kartmarkörer som ligger tätt omlott har samma funktion i listan under
// kartan (undantaget för likvärdig funktion i 2.5.8), se TILLGANGLIGHET.md.

const webblasare = await chromium.launch();
let fel = 0;
for (const lage of ["light", "dark"]) {
  for (const lang of sprak) {
    for (const sida of sidor) {
      const ctx = await webblasare.newContext({ viewport: { width: 375, height: 800 }, colorScheme: lage });
      const page = await ctx.newPage();
      await page.goto(`${bas}/${sida}.html?lang=${lang}`, { waitUntil: "networkidle" });
      const resultat = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .analyze();
      for (const v of resultat.violations) {
        const noder = v.nodes.filter((n) => !(v.id === "target-size" && n.html.includes("leaflet-marker-icon")));
        if (!noder.length) continue;
        fel++;
        console.log(`${sida}.html?lang=${lang} (${lage}): ${v.id} – ${v.help}`);
        for (const n of noder) console.log(`   ${n.target.join(" ")}`);
      }
      await ctx.close();
    }
  }
}
await webblasare.close();
if (fel) {
  console.log(`\n${fel} problem hittades.`);
  process.exit(1);
}
console.log("Inga problem hittades.");
