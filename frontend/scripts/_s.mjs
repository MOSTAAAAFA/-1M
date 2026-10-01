import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { extname, join, normalize } from 'path';
const ROOT=join(process.cwd(),'build'); const PORT=4331;
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4'};
const s=createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);let f=join(ROOT,normalize(u).replace(/^([/\\])+/,''));if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');if(!existsSync(f))f=join(ROOT,'index.html');r.writeHead(200,{'Content-Type':T[extname(f)]||'application/octet-stream'});r.end(readFileSync(f));});
await new Promise(r=>s.listen(PORT,r));
const b=await chromium.launch({channel:'msedge'});
for (const w of [1920,1440,1280,1100,1024]) {
  const p=await (await b.newContext({viewport:{width:w,height:900}})).newPage();
  await p.goto(`http://localhost:${PORT}/`,{waitUntil:'networkidle'});
  await p.evaluate(()=>sessionStorage.setItem('1m_splash_seen','1'));
  const d=await p.evaluate(()=>{
    const g=document.querySelector('.stats-grid');
    const gr=g.getBoundingClientRect();
    const kids=[...g.children].map(c=>{const b=c.getBoundingClientRect();return {x:Math.round(b.x),right:Math.round(b.right),y:Math.round(b.y),w:Math.round(b.width)};});
    return {grid:{x:Math.round(gr.x),right:Math.round(gr.right),w:Math.round(gr.width)},kids,
      cols:getComputedStyle(g).gridTemplateColumns, win:innerWidth,
      docW:document.documentElement.scrollWidth};
  });
  const clipped = d.kids.some(k=>k.right > d.grid.right + 1);
  console.log(`\n${w}px cols=${d.cols}`);
  console.log(`  grid x=${d.grid.x} right=${d.grid.right} w=${d.grid.w} | win=${d.win} docW=${d.docW}`);
  d.kids.forEach((k,i)=>console.log(`   t${i} x=${String(k.x).padStart(5)} right=${String(k.right).padStart(5)} y=${String(k.y).padStart(5)} w=${k.w}`));
  if (clipped) console.log(`   !! TILES CLIPPED past grid right=${d.grid.right}`);
  await p.close();
}
await b.close(); s.close();
