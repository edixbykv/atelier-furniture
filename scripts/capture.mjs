// Frame-capture pipeline: drives /capture for each scene, steps scroll progress
// 0..1, and writes transparent webp frames the live site scrubs on scroll.
//   node scripts/capture.mjs [scene]
import puppeteer from "puppeteer";
import sharp from "sharp";
import { mkdir, writeFile, readdir, rm } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.CAP_BASE || "http://localhost:3300";
const OUT = path.resolve("public/seq");
const VW = 1600, VH = 1000, DSF = 1.5, OUTW = 1600;

// Frame counts tuned to each scene's motion length (kept lean on purpose).
const SCENES = {
  hero: 30,
  kitchen: 48,
  cabinet: 40,
};

const only = process.argv[2];
const list = only ? [only] : Object.keys(SCENES);

const browser = await puppeteer.launch({
  headless: "new",
  protocolTimeout: 180000,
  args: [
    "--no-sandbox",
    "--ignore-gpu-blocklist",
    "--enable-gpu",
    "--enable-webgl",
    "--use-angle=default",
  ],
});

try {
  for (const scene of list) {
    const frames = SCENES[scene];
    if (!frames) throw new Error(`unknown scene: ${scene}`);
    const dir = path.join(OUT, scene);
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });

    const page = await browser.newPage();
    await page.setViewport({ width: VW, height: VH, deviceScaleFactor: DSF });
    page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message}`));

    console.log(`\n▶ ${scene}: loading…`);
    await page.goto(`${BASE}/capture?scene=${scene}`, {
      waitUntil: "networkidle0",
      timeout: 120000,
    });
    await page.waitForFunction(() => window.__captureReady === true, {
      timeout: 120000,
    });
    console.log(`  ready. capturing ${frames} frames`);

    for (let i = 0; i < frames; i++) {
      const p = frames === 1 ? 0 : i / (frames - 1);
      await page.evaluate((v) => window.__setProgress(v), p);
      // let the instant rig + shadows settle for a couple of frames
      await page.evaluate(
        () =>
          new Promise((r) =>
            requestAnimationFrame(() => requestAnimationFrame(r))
          )
      );
      await new Promise((r) => setTimeout(r, 90));

      const buf = await page.screenshot({ type: "png", omitBackground: true });
      const name = `${String(i).padStart(3, "0")}.webp`;
      await sharp(buf)
        .resize({ width: OUTW, withoutEnlargement: true })
        .webp({ quality: 80, effort: 4, alphaQuality: 90 })
        .toFile(path.join(dir, name));
      process.stdout.write(`\r  frame ${i + 1}/${frames}`);
    }
    process.stdout.write("\n");

    const files = (await readdir(dir)).filter((f) => f.endsWith(".webp")).sort();
    await writeFile(
      path.join(dir, "manifest.json"),
      JSON.stringify({ scene, count: files.length, width: OUTW }, null, 2)
    );
    await page.close();
    console.log(`  ✓ ${scene}: ${files.length} frames → public/seq/${scene}`);
  }
} finally {
  await browser.close();
}
console.log("\nAll done.");
