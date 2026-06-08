import puppeteer from "puppeteer";
import fs from "node:fs";
fs.mkdirSync("scripts/refine", { recursive: true });
const browser = await puppeteer.launch({
  headless: true, protocolTimeout: 120000,
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl"],
});
const targets = [
  ["local", "http://localhost:3300"],
  ["vercel", "https://atelier-furniture.vercel.app"],
];
for (const [name, url] of targets) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.log(`[${name} pageerror]`, e.message));
  try {
    await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
    await new Promise((r) => setTimeout(r, 16000));
    await page.screenshot({ path: `scripts/refine/cmp-${name}.jpg`, type: "jpeg", quality: 84 });
    console.log(name, "shot ok");
  } catch (e) { console.log(name, "FAILED", e.message); }
  await page.close();
}
await browser.close();
console.log("DONE");
