import puppeteer from "puppeteer";
import fs from "node:fs";
const OUT = "scripts/shots2"; fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || "http://localhost:3400";

const browser = await puppeteer.launch({ headless: true, protocolTimeout: 180000,
  args: ["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist","--enable-webgl"] });

async function run(dev) {
  const page = await browser.newPage();
  await page.setViewport({ width: dev.w, height: dev.h, deviceScaleFactor: 1 });
  page.on("pageerror", e => console.log(`[${dev.name} err]`, e.message));
  await page.goto(BASE, { waitUntil: "networkidle0", timeout: 120000 });

  // helper: scroll to absolute y and settle
  const go = async (y, wait) => { await page.evaluate(v => window.scrollTo(0, v), y); await new Promise(r => setTimeout(r, wait)); };
  const at = async (sel, frac, wait) => {
    const y = await page.evaluate((s, f) => {
      const el = s === "top" ? null : document.querySelector(s);
      const top = el ? el.offsetTop : 0;
      const h = el ? el.offsetHeight : window.innerHeight;
      return top + h * f - (f === 0 ? 0 : 0);
    }, sel, frac);
    await go(y, wait);
  };
  const shot = (n) => page.screenshot({ path: `${OUT}/${dev.name}-${n}.jpg`, type: "jpeg", quality: 82 });

  await new Promise(r => setTimeout(r, 8000));         // hero bedroom load
  await shot("1-hero");
  await at("#wardrobes", 0.0, 3500); await shot("2-wardrobe-closed");
  await at("#wardrobes", 0.45, 2500); await shot("3-wardrobe-open");
  await at("#kitchens", 0.05, 8000); await shot("4-kitchen-in");
  await at("#kitchens", 0.55, 3500); await shot("5-kitchen-mid");
  await at("#cabinetry", 0.05, 8000); await shot("6-cabinet-in");
  await at("#cabinetry", 0.5, 3500); await shot("7-cabinet-explode");
  await at("#excellence", 0.15, 3500); await shot("8-stats");
  await at("#excellence", 1.1, 3000); await shot("9-whyus");
  await at("#contact", 0.2, 3000); await shot("10-cta");
  await page.close();
}

await run({ name: "desktop", w: 1440, h: 900 });
await run({ name: "mobile", w: 390, h: 844 });
await browser.close();
console.log("DONE");
