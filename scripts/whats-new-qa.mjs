import fs from 'node:fs/promises';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=(ok,message)=>{if(!ok)throw Error(message);};
const out='artifacts/update-2026-10-27';await fs.mkdir(out,{recursive:true});
for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]].filter(([name])=>!process.env.QA_ENGINE||name===process.env.QA_ENGINE)){
 const browser=await engine.launch(),page=await browser.newPage({locale:'zh-CN',reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto('http://127.0.0.1:4173/?v=2.4.1',{waitUntil:'networkidle'});await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
 for(const [width,height] of [[1780,1000],[1440,1000],[768,1024],[390,844],[320,720]])for(const lang of ['zh','en']){
  await page.setViewportSize({width,height});if((await page.locator('html').getAttribute('lang')).startsWith('en')!==(lang==='en'))await page.locator('#language-toggle').click();
  const globe=page.locator('#footprint-studio');await globe.scrollIntoViewIfNeeded();
  assert(await page.locator('[data-globe-spin]').isDisabled(),'Reduced Motion should keep globe still');
  await page.locator('.footprint-places button').nth(1).click();assert(await page.locator('.footprint-place-name').innerText()===(lang==='zh'?'京都':'Kyoto'),'Place did not change');
  const beforePhotos=await page.locator('.footprint-photo-fan img').evaluateAll(imgs=>imgs.map(i=>i.src).join());await page.locator('[data-globe-shuffle]').click();assert(await page.locator('.footprint-photo-fan img').evaluateAll(imgs=>imgs.map(i=>i.src).join())!==beforePhotos,'Photo group did not change');assert(await page.locator('.footprint-photo-fan img').count()===3,'Bubble should have three photos');
  await page.locator('[data-globe-remove]').click();assert(await page.locator('.footprint-callout').isHidden(),'Removed place still displayed');assert((await page.locator('.footprint-count').innerText()).startsWith('3'),'Map place count did not change');await page.locator('[data-globe-restore]').click();assert((await page.locator('.footprint-count').innerText()).startsWith('4'),'Map restoration failed');
  const canvas=globe.locator('canvas');const beforeZoom=await canvas.evaluate(c=>c.toDataURL());await page.locator('[data-globe-in]').click();assert(await canvas.evaluate(c=>c.toDataURL())!==beforeZoom,'Zoom has no visible effect');await page.locator('[data-globe-out]').click();
  await canvas.focus();const beforeKey=await canvas.evaluate(c=>c.toDataURL());await canvas.press('ArrowRight');assert(await canvas.evaluate(c=>c.toDataURL())!==beforeKey,'Keyboard rotation failed');
  assert(await page.locator('#new-tools,[data-new-theme],.selection-demo,a[data-chapter="new-tools"]').count()===0,'Removed tools section or navigation still present');
  for(let i=0;i<4;i++){await page.locator(`[data-new-card="${i}"]`).click();assert(await page.locator(`[data-new-card="${i}"]`).getAttribute('aria-pressed')==='true','New card selection failed');assert((await page.locator('.new-card-story').innerText()).length>5,'New card story missing');}
  assert((await page.locator('[data-growth-kind="processed"] strong').innerText())==='16,384','New demo changed growth records');
  assert(await page.locator('#photo-editing .editor-mini-tools>span').count()===5,'Compact editing overview changed');
  for(const id of ['footprint-studio','new-fragments']){await page.locator('#'+id).scrollIntoViewIfNeeded();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${name}/${width}/${lang}/${id}: overflow`);if([1440,390,320].includes(width))await page.locator('#'+id).screenshot({path:`${out}/${name}-${lang}-${width}-${id}.png`});}
 }
 assert(!errors.length,errors.join('\n'));await page.close();
 const motion=await browser.newPage({viewport:{width:1440,height:1000},locale:'zh-CN'});await motion.goto('http://127.0.0.1:4173/?v=2.4.1#footprint-studio',{waitUntil:'networkidle'});await motion.evaluate(()=>document.documentElement.style.scrollBehavior='auto');await motion.locator('.footprint-orb').scrollIntoViewIfNeeded();
 const snapshot=()=>motion.locator('.footprint-orb canvas').evaluate(c=>c.toDataURL());await motion.waitForTimeout(200);const spinning=await snapshot();await motion.waitForTimeout(350);assert(await snapshot()!==spinning,'Visible globe is not rotating');await motion.locator('#motion-toggle').click();await motion.waitForTimeout(80);const paused=await snapshot();await motion.waitForTimeout(350);assert(await snapshot()===paused,'Global pause did not stop globe');await motion.locator('#motion-toggle').click();await motion.waitForTimeout(350);assert(await snapshot()!==paused,'Globe did not resume');
 await motion.evaluate(()=>scrollTo(0,0));await motion.waitForTimeout(100);const away=await snapshot();await motion.waitForTimeout(350);assert(await snapshot()===away,'Offscreen globe still animates');
 await motion.close();await browser.close();console.log(JSON.stringify({engine:name,layouts:10,globe:'rotation / zoom / place / shuffle / remove / restore / keyboard',removedTools:'section and navigation absent',newCards:4,motion:'global pause / resume / offscreen / Reduce Motion',status:'passed'}));
}
