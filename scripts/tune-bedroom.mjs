import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "scripts", "shots");
fs.mkdirSync(OUT, { recursive: true });
const MIME = { ".html":"text/html",".js":"text/javascript",".glb":"model/gltf-binary",".wasm":"application/wasm" };
const server = http.createServer((req,res)=>{
  const fp = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if(!fp.startsWith(ROOT)||!fs.existsSync(fp)||fs.statSync(fp).isDirectory()){res.writeHead(404);res.end();return;}
  res.writeHead(200,{"Content-Type":MIME[path.extname(fp)]||"application/octet-stream"});
  fs.createReadStream(fp).pipe(res);
});
await new Promise(r=>server.listen(0,r));
const PORT = server.address().port;

const browser = await puppeteer.launch({ headless:true, protocolTimeout:180000,
  args:["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist","--enable-webgl"] });
const page = await browser.newPage();
await page.setViewport({ width:1440, height:810, deviceScaleFactor:1.25 });
page.on("pageerror",e=>console.log("[err]",e.message));
await page.goto(`http://localhost:${PORT}/scripts/tune.html?model=/public/models/bedroom.glb`, { waitUntil:"networkidle0" });
await page.waitForFunction("window.__ready===true",{timeout:120000});
const size = await page.evaluate("window.__size");
console.log("size:", JSON.stringify(size));

// Interior camera candidates. Room is centered at origin; size known.
const hx = size.x/2, hy = size.y/2, hz = size.z/2;
const ly = -hy + size.y*0.45; // eye a bit above mid
const cands = [
  { name:"A-inZ", px: hx*0.2, py: ly, pz: hz*0.85, lx:0, ly, lz:-hz*0.9, fov:60 },
  { name:"B-inZneg", px: hx*0.2, py: ly, pz: -hz*0.85, lx:0, ly, lz:hz*0.9, fov:60 },
  { name:"C-inX", px: hx*0.85, py: ly, pz: hz*0.1, lx:-hx*0.9, ly, lz:0, fov:60 },
  { name:"D-inXneg", px: -hx*0.85, py: ly, pz: hz*0.1, lx:hx*0.9, ly, lz:0, fov:60 },
  { name:"E-corner", px: hx*0.7, py: ly, pz: hz*0.7, lx:-hx*0.8, ly, lz:-hz*0.8, fov:62 },
  { name:"F-corner2", px: -hx*0.7, py: ly, pz: hz*0.7, lx:hx*0.8, ly, lz:-hz*0.8, fov:62 },
];
for (const c of cands) {
  await page.evaluate((p)=>window.__setCam(p), c);
  await new Promise(r=>setTimeout(r,500));
  await page.screenshot({ path: path.join(OUT, `tune-${c.name}.jpg`), type:"jpeg", quality:84 });
  console.log("shot", c.name);
}
await browser.close(); server.close();
console.log("DONE");
