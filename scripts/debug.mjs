import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 180000,
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.log("[pageerror]", e.message));

await page.goto("http://localhost:3300", { waitUntil: "networkidle0", timeout: 120000 });

// HERO (bedroom) — wait for load
await new Promise((r) => setTimeout(r, 13000));
await page.screenshot({ path: "scripts/shots/debug-hero.jpg", type: "jpeg", quality: 82 });
console.log("hero shot");

// CABINET assembled (top of section)
const cabTop = await page.evaluate(() => {
  const el = document.getElementById("cabinetry");
  window.scrollTo(0, el.offsetTop + 5);
  return el.offsetTop;
});
await new Promise((r) => setTimeout(r, 11000));
await page.screenshot({ path: "scripts/shots/debug-cabinet-assembled.jpg", type: "jpeg", quality: 82 });
console.log("cabinet assembled shot");

// CABINET exploded (mid section ~ progress 0.5)
await page.evaluate((top) => window.scrollTo(0, top + window.innerHeight * 1.5), cabTop);
await new Promise((r) => setTimeout(r, 4500));
await page.screenshot({ path: "scripts/shots/debug-cabinet-exploded.jpg", type: "jpeg", quality: 82 });
console.log("cabinet exploded shot");

await browser.close();
console.log("DONE");
