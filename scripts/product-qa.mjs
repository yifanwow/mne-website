import fs from 'node:fs/promises';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=(value,message)=>{if(!value)throw new Error(message);};
await fs.mkdir('artifacts/v9',{recursive:true});
for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]]) {
 const browser=await engine.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'zh-CN'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto('http://127.0.0.1:4173/?v=1.5.0',{waitUntil:'networkidle'});
 await page.locator('#album-edit').click();await page.waitForTimeout(750);
 assert(await page.locator('#album-stack').evaluate(el=>Math.round(el.getBoundingClientRect().height))===85,'Album edit did not compact rows');
 await page.locator('#album-name').fill('The light we keep');
 await page.locator('#album-stack [data-album-move="up"]').click();
 assert(await page.locator('#album-list').evaluate(el=>el.firstElementChild.id)==='album-stack','Album up did not change order');
 await page.locator('#album-stack [data-album-move="down"]').click();
 assert(await page.locator('#album-list').evaluate(el=>el.firstElementChild.id)!=='album-stack','Album down did not change order');
 await page.locator('#album-pin').click();
 assert(await page.locator('#album-list').evaluate(el=>el.firstElementChild.id)==='album-stack','Move to top has no real effect');
 await page.locator('[data-cover="harbor"]').click();
 assert((await page.locator('#album-cover').evaluate(el=>el.style.backgroundImage)).includes('harbor.webp'),'Cover selection failed');
 await page.locator('#album-edit').click();await page.waitForTimeout(750);
 assert(await page.locator('#album-stack').evaluate(el=>Math.round(el.getBoundingClientRect().height))===168,'Album browse did not expand');
 await page.locator('[data-shortcut-photo="0"]').hover();
 assert(await page.locator('#shortcut-menu').isVisible(),'Waterfall hover menu failed');
 await page.locator('[data-shortcut-action="favorite"]').click();
 assert(await page.locator('#growth-organized').innerText()==='329','Favorite not recorded');
 await page.locator('[data-shortcut-photo="0"]').click({position:{x:10,y:10}});
 await page.locator('[data-shortcut-action="recent"]').click();
 assert(await page.locator('#growth-organized').innerText()==='330','Archive not recorded');
 await page.locator('[data-shortcut-mode="single"]').click();
 await page.locator('#shortcut-open').hover({position:{x:20,y:20}});
 assert(await page.locator('[data-shortcut-action="remove"]').isVisible(),'Single-photo menu does not reflect membership');
 await page.locator('[data-shortcut-action="remove"]').click();
 assert(await page.locator('#shortcut-membership').innerText()==='尚未归档','Remove membership failed');
 assert(await page.locator('#growth-organized').innerText()==='330','Removing membership changed cumulative achievements');
 assert((await page.locator('#growth-events').innerText()).includes('移出相册'),'Activity record missing latest action');
 for(const [scenario,total] of [['low','13.14'],['central','14.31'],['high','16.14']]){
   await page.locator(`[data-storage-scenario="${scenario}"]`).click();
   assert(await page.locator('#insight-total').innerText()===total,'Incorrect storage scenario '+scenario);
 }
 await page.locator('[data-storage-scenario="central"]').click();await page.locator('[data-storage-scope="photos"]').click();
 assert(await page.locator('#insight-total').innerText()==='11.26','Photo/cache total wrong');
 await page.locator('[data-storage-scope="videos"]').click();
 assert(await page.locator('#insight-total').innerText()==='2.99','Video/cache total wrong');
 await page.locator('[data-storage-scope="all"]').click();
 await page.locator('.storage-method summary').click();
 assert(await page.locator('.storage-method p').isVisible(),'Storage method cannot expand');
 for(const [width,height] of [[1440,1000],[1024,900],[768,1024],[390,844],[320,720]])for(const lang of ['zh','en']) {
   await page.setViewportSize({width,height});
   if((await page.locator('html').getAttribute('lang')).startsWith('en')!==(lang==='en'))await page.locator('#language-toggle').click();
   for(const selector of ['#album-studio','#shortcut-studio','#insights']) {
     await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(400);
     const layout=await page.locator(selector).evaluate(el=>({overflow:document.documentElement.scrollWidth>innerWidth+1,clipped:[...el.querySelectorAll('button,input,.product-copy,.storage-range,.growth-numbers')].filter(x=>{if(x.hidden||!x.getClientRects().length)return false;const r=x.getBoundingClientRect();return r.left<-.5||r.right>innerWidth+.5;}).map(x=>x.id||x.className)}));
     assert(!layout.overflow&&!layout.clipped.length,`${name}/${width}/${lang}/${selector}: ${JSON.stringify(layout)}`);
     if([1440,390,320].includes(width))await page.locator(selector).screenshot({path:`artifacts/v9/${name}-${lang}-${width}-${selector.slice(1)}.png`});
   }
 }
 assert(!errors.length,errors.join('\n'));
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});
 await page.locator('#album-edit').click();await page.locator('#album-pin').click();
 await page.locator('[data-shortcut-mode="single"]').click();await page.locator('#shortcut-open').click({position:{x:15,y:15}});
 assert(await page.locator('#shortcut-menu').isVisible(),'Reduced-motion menu failed');
 console.log(JSON.stringify({engine:name,status:'passed',layouts:10,album:'edit/rename/order/cover',menus:'grid/single',storage:'3 scenarios and scope totals',activity:'real demo actions'}));
 await context.close();await browser.close();
}
