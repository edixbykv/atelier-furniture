import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: true, protocolTimeout: 120000,
  args: ["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--enable-webgl"] });
const p = await b.newPage();
await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
await p.goto("http://localhost:3000", { waitUntil: "networkidle0" });
const go = async (sel, f, w) => { const y = await p.evaluate((s,fr)=>{const e=document.querySelector(s);return e?e.offsetTop+e.offsetHeight*fr:0;},sel,f); await p.evaluate(v=>scrollTo(0,v),y); await new Promise(r=>setTimeout(r,w)); };
await new Promise(r=>setTimeout(r,7000)); await p.screenshot({path:"scripts/shots2/m-hero.jpg",type:"jpeg",quality:80});
await go("#wardrobes",0.4,3000); await p.screenshot({path:"scripts/shots2/m-wardrobe.jpg",type:"jpeg",quality:80});
await go("#excellence",0.2,3000); await p.screenshot({path:"scripts/shots2/m-stats.jpg",type:"jpeg",quality:80});
await go("#excellence",1.2,2500); await p.screenshot({path:"scripts/shots2/m-whyus.jpg",type:"jpeg",quality:80});
await go("#contact",0.25,2500); await p.screenshot({path:"scripts/shots2/m-cta.jpg",type:"jpeg",quality:80});
await b.close(); console.log("DONE");
