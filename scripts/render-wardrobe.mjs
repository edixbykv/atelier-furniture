// Renders wardrobe-opt.glb to high-quality showcase images via headless WebGL,
// then post-processes to optimized WebP + JPG at multiple sizes with sharp.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'renders');
fs.mkdirSync(OUT, { recursive: true });

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.glb': 'model/gltf-binary', '.wasm': 'application/wasm', '.json': 'application/json',
  '.bin': 'application/octet-stream',
};

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const fp = path.join(ROOT, urlPath);
    if (!fp.startsWith(ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
      res.writeHead(404); res.end('not found'); return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
    });
    fs.createReadStream(fp).pipe(res);
  } catch (e) { res.writeHead(500); res.end(String(e)); }
});

await new Promise((r) => server.listen(0, r));
const PORT = server.address().port;
console.log('server on', PORT);

// Cinematic camera presets for the showcase
const VIEWS = [
  { name: 'hero',     yaw: 28,  pitch: 6,  dist: 8.6, targetY: 0.52, fov: 30 },
  { name: 'front',    yaw: 2,   pitch: 4,  dist: 8.8, targetY: 0.5,  fov: 31 },
  { name: 'angle-r',  yaw: -32, pitch: 7,  dist: 8.6, targetY: 0.52, fov: 30 },
  { name: 'detail',   yaw: 22,  pitch: 2,  dist: 6.2, targetY: 0.62, fov: 28 },
];

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 300000,
  args: [
    '--no-sandbox', '--disable-setuid-sandbox',
    '--use-gl=angle', '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
    '--enable-webgl', '--disable-web-security',
  ],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1600, deviceScaleFactor: 1.5 });
  page.on('console', (m) => console.log('  [page]', m.text()));
  page.on('pageerror', (e) => console.log('  [pageerror]', e.message));

  await page.goto(`http://localhost:${PORT}/scripts/render.html`, { waitUntil: 'networkidle0', timeout: 120000 });

  console.log('waiting for model load...');
  await page.waitForFunction('window.__ready === true || window.__error !== null', { timeout: 180000 });
  const err = await page.evaluate('window.__error');
  if (err) throw new Error('Model load failed: ' + err);
  console.log('model loaded.');

  for (const v of VIEWS) {
    await page.evaluate((cfg) => window.__setView(cfg), v);
    await new Promise((r) => setTimeout(r, 350)); // settle
    const raw = path.join(OUT, `wardrobe-${v.name}.png`);
    await page.screenshot({ path: raw, omitBackground: true });
    console.log('captured', v.name);

    // Post-process: trim transparent margins, output webp + jpg at 2 sizes
    const img = sharp(raw).trim({ threshold: 5 });
    const meta = await sharp(raw).metadata();
    await img.clone().resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 88 }).toFile(path.join(OUT, `wardrobe-${v.name}.webp`));
    await img.clone().resize({ width: 1600, withoutEnlargement: true })
      .flatten({ background: '#f4f1ec' }).jpeg({ quality: 86, mozjpeg: true })
      .toFile(path.join(OUT, `wardrobe-${v.name}.jpg`));
    await img.clone().resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 82 }).toFile(path.join(OUT, `wardrobe-${v.name}-sm.webp`));
    console.log('  processed', v.name, `(src ${meta.width}x${meta.height})`);
  }
} finally {
  await browser.close();
  server.close();
}
console.log('DONE -> public/renders');
