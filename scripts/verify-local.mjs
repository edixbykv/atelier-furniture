// Local verification: scrolls the page like a real user (drives Lenis via wheel)
// and screenshots each section so we can eyeball the image-sequence swap, cabinet
// framing, wardrobe contrast and footer. Usage: node scripts/verify-local.mjs [port]
import puppeteer from "puppeteer";
import { mkdir } from "node:fs/promises";

const PORT = process.argv[2] || "3300";
const OUT = "scripts/verify";
await mkdir(OUT, { recursive: true });

const b = await puppeteer.launch({
  headless: "new",
  protocolTimeout: 120000,
  args: ["--no-sandbox", "--ignore-gpu-blocklist", "--enable-gpu", "--enable-webgl", "--use-angle=default"],
});
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
p.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
p.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE.ERR:", m.text().slice(0, 200)); });

console.log("loading…");
await p.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle0", timeout: 90000 });
await new Promise((r) => setTimeout(r, 2500)); // preloader + first frames

const totalH = await p.evaluate(() => document.body.scrollHeight);
const vh = 900;
const stops = [
  ["01-hero", 0.0],
  ["02-wardrobe", 0.16],
  ["03-kitchen-a", 0.34],
  ["04-kitchen-b", 0.46],
  ["05-cabinet-a", 0.66],
  ["06-cabinet-b", 0.74],
  ["07-footer", 0.99],
];

let cur = 0;
for (const [name, frac] of stops) {
  const targetY = Math.max(0, frac * (totalH - vh));
  // wheel-scroll toward target so Lenis animates naturally
  while (Math.abs(cur - targetY) > 30) {
    const d = Math.max(-700, Math.min(700, targetY - cur));
    await p.mouse.wheel({ deltaY: d });
    cur += d;
    await new Promise((r) => setTimeout(r, 60));
  }
  await new Promise((r) => setTimeout(r, 900)); // settle + frame paint
  await p.screenshot({ path: `${OUT}/${name}.jpg`, type: "jpeg", quality: 82 });
  console.log("shot", name, "@", Math.round(targetY));
}
await b.close();
console.log("==done==");
