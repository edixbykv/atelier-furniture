// Visual verification: loads the running site, screenshots multiple breakpoints
// and scroll positions to confirm 3D loads and no content overlaps/cuts off.
import puppeteer from "puppeteer";
import fs from "node:fs";

const OUT = "scripts/shots";
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || "http://localhost:3000";

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 180000,
  args: [
    "--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl",
  ],
});

const devices = [
  { name: "desktop", w: 1440, h: 900 },
  { name: "tablet", w: 820, h: 1180 },
  { name: "mobile", w: 390, h: 844 },
];

async function shoot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.jpg`, quality: 80, type: "jpeg" });
  console.log("shot", name);
}

for (const d of devices) {
  const page = await browser.newPage();
  await page.setViewport({ width: d.w, height: d.h, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.log(`  [${d.name} pageerror]`, e.message));
  page.on("console", (m) => { if (m.type() === "error") console.log(`  [${d.name} console.error]`, m.text()); });

  await page.goto(BASE, { waitUntil: "networkidle0", timeout: 120000 });
  await new Promise((r) => setTimeout(r, 3500)); // preloader + hero 3D
  await shoot(page, `${d.name}-hero`);

  // scroll through the page in steps
  const total = await page.evaluate(() => document.body.scrollHeight);
  const steps = 7;
  for (let i = 1; i <= steps; i++) {
    const y = Math.round((total - d.h) * (i / steps));
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await new Promise((r) => setTimeout(r, 1400));
    await shoot(page, `${d.name}-${i}`);
  }
  await page.close();
}

await browser.close();
console.log("DONE");
