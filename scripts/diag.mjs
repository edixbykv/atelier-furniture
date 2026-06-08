import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless:true, protocolTimeout:120000, args:["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist","--enable-webgl"]});
const p = await b.newPage();
await p.setViewport({width:1440,height:900});
p.on("pageerror", e => console.log("PAGEERROR:", e.message));
p.on("console", m => { if(m.type()==="error") console.log("CONSOLE.ERR:", m.text().slice(0,300)); });
p.on("requestfailed", r => console.log("REQFAIL:", r.url().slice(0,80), r.failure()?.errorText));
p.on("error", e => console.log("CRASH:", e.message));
try {
  const resp = await p.goto("https://atelier-furniture-red.vercel.app/", {waitUntil:"domcontentloaded", timeout:60000});
  console.log("HTTP status:", resp.status());
  await new Promise(r=>setTimeout(r,10000));
  const title = await p.title();
  const bodyLen = await p.evaluate(()=>document.body.innerText.length);
  const hasCanvas = await p.evaluate(()=>document.querySelectorAll("canvas").length);
  console.log("TITLE:", title, "| bodyTextLen:", bodyLen, "| canvases:", hasCanvas);
} catch(e){ console.log("GOTO FAILED:", e.message); }
await b.close(); console.log("==done==");
