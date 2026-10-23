import fs from 'node:fs/promises';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=(x,m)=>{if(!x)throw new Error(m);};await fs.mkdir('artifacts/v10',{recursive:true});
for(const [engineName,engine] of [['Chromium',chromium],['WebKit',webkit]]) {
 const browser=await engine.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000},locale:'zh-CN'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()}: ${r.url()}`);});
 await page.goto('http://127.0.0.1:4173/?v=2.1.0',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
 assert(!errors.length,errors.join('\n'));
 const albums=await page.locator('.native-album-row').evaluateAll(rows=>rows.map(row=>[...row.querySelectorAll('img')].map(img=>img.getAttribute('src'))));
 assert(albums.length===4&&albums.every(x=>x.length===7),'Not four seven-photo albums');assert(new Set(albums.flat()).size===28,'Photographs repeat between albums');
 await page.waitForTimeout(700);await page.locator('#album-studio').screenshot({path:`artifacts/v10/${engineName}-albums-browse.png`});
 await page.locator('#album-edit').click();await page.waitForFunction(()=>document.querySelector('#album-studio').dataset.phase==='editing');
 await page.waitForTimeout(150);await page.locator('.native-album-handle').first().scrollIntoViewIfNeeded();
 const handles=page.locator('.native-album-handle'),first=await handles.first().boundingBox(),last=await handles.last().boundingBox();
 const grabbedTop=await handles.first().evaluate(el=>el.closest('.native-album-row').getBoundingClientRect().top);
 const before=await page.locator('.native-album-row').evaluateAll(rows=>rows.map(x=>x.dataset.album));
 await page.mouse.move(first.x+first.width/2,first.y+first.height/2);await page.mouse.down();await page.mouse.move(last.x+last.width/2,last.y+last.height*.9,{steps:20});const floating=await page.locator('.dragging').boundingBox();assert(Math.abs(floating.y-(last.y+last.height*.9-(first.y+first.height/2-grabbedTop)))<3,'Dragged row does not follow the pointer');await page.mouse.up();await page.waitForTimeout(350);
 const after=await page.locator('.native-album-row').evaluateAll(rows=>rows.map(x=>x.dataset.album));assert(after[after.length-1]===before[0],`${engineName}: actual drag did not change order ${before} -> ${after}`);
 await page.locator('.native-album-tool').first().click();await page.locator('[data-album-action="covers"]').click();
 assert(await page.locator('.native-cover-slots>button').count()===7,'Cover slots not seven');assert(await page.locator('.native-cover-grid>button').count()===7,'Cover picker not seven');
 await page.locator('.native-cover-grid>button').nth(2).click();await page.locator('.native-cover-grid>button').nth(4).click();await page.locator('#album-dialog-save').click();
 await page.locator('.native-album-tool').first().click();await page.locator('[data-album-action="rename"]').click();await page.locator('#album-name').fill('A quiet story');await page.locator('#album-dialog-save').click();
 assert((await page.locator('.native-album-meta strong').first().innerText())==='A quiet story','Rename not retained');
 await page.locator('#album-studio').screenshot({path:`artifacts/v10/${engineName}-albums-edit.png`});
 // Scroll-driven photo demonstrations are covered by stories-qa.mjs.
 await page.locator('[data-growth-kind="processed"]').click();assert(await page.locator('#growth-dialog').isVisible(),'Stats detail missing');assert((await page.locator('#growth-dialog-content').innerText()).includes('归档'),'Stats detail does not show archive count');await page.locator('#growth-done').click();
 for(const [width,height] of [[1440,1000],[1024,900],[768,1024],[390,844],[320,720]])for(const lang of ['zh','en']) {
  await page.setViewportSize({width,height});if((await page.locator('html').getAttribute('lang')).startsWith('en')!==(lang==='en'))await page.locator('#language-toggle').click();
  for(const selector of ['#album-studio','#shortcut-studio','#insights']){await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(700);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${engineName}/${width}/${lang}: overflow`);if([1440,390,320].includes(width))await page.locator(selector==='#shortcut-studio'?'#shortcut-studio .story-pin':selector).screenshot({path:`artifacts/v10/${engineName}-${width}-${lang}-${selector.slice(1)}.png`});}
 }
 assert(!errors.length,errors.join('\n'));console.log(JSON.stringify({engine:engineName,status:'passed',albums:4,uniquePhotos:28,drag:'passed',menus:'covered by scroll stories',layouts:10}));await browser.close();
}
