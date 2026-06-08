import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless:true, protocolTimeout:120000, args:["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist","--enable-webgl"]});
const p = await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:1});
await p.goto("https://atelier-furniture-red.vercel.app",{waitUntil:"networkidle0",timeout:90000});
await new Promise(r=>setTimeout(r,16000));
await p.screenshot({path:"scripts/refine/vercel-final.jpg",type:"jpeg",quality:84});
console.log("done"); await b.close();
