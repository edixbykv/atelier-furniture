import puppeteer from "puppeteer";
import fs from "node:fs";

const OUT = "scripts/refine";
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || "http://localhost:3300";

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 240000,
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
page.on("console", (m) => { if (m.type() === "error") console.log("[console.error]", m.text()); });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const shoot = async (n) => { await page.screenshot({ path: `${OUT}/${n}.jpg`, type: "jpeg", quality: 84 }); console.log("shot", n); };
const scrollToSec = (id, frac) => page.evaluate((id, frac) => {
  const el = document.getElementById(id);
  window.scrollTo(0, el.offsetTop + window.innerHeight * frac);
  return el.offsetTop;
}, id, frac);

await page.goto(BASE, { waitUntil: "networkidle0", timeout: 120000 });

// HERO — wait for preloader + bedroom load + push-in
await wait(13000);
await shoot("1-hero");

// WARDROBE open
await scrollToSec("wardrobes", 0.55);
await wait(2500);
await shoot("2-wardrobe");

// KITCHEN intro (top) then eye-level mid
await scrollToSec("kitchens", 0.05);
await wait(9000);
await shoot("3-kitchen-intro");
await scrollToSec("kitchens", 1.4);
await wait(4000);
await shoot("4-kitchen-mid");
await scrollToSec("kitchens", 2.4);
await wait(3500);
await shoot("5-kitchen-late");

// CABINET assembled (top) then exploded (mid)
await scrollToSec("cabinetry", 0.05);
await wait(9000);
await shoot("6-cabinet-assembled");
await scrollToSec("cabinetry", 1.5);
await wait(4000);
await shoot("7-cabinet-exploded");

await browser.close();
console.log("DONE");
