// Website-only verification: no iOS build, simulator, account access or photo-library changes.
import fs from 'node:fs/promises';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=(value,message)=>{if(!value)throw Error(message);};
await fs.mkdir('artifacts/v11',{recursive:true});
for(const [engineName,engine] of [['Chromium',chromium],['WebKit',webkit]].filter(([name])=>!process.env.QA_ENGINE||name===process.env.QA_ENGINE)) {
 const browser=await engine.launch({headless:true}),page=await browser.newPage({locale:'zh-CN'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto('http://127.0.0.1:4173/?v=1.9.0',{waitUntil:'networkidle'});await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
 const names=await page.locator('.native-album-meta strong').allTextContents();assert(names.length===4&&names.every(x=>x.length===2),'Album names are not four two-character names');
 assert((await page.locator('.version-badge').innerText()).includes('0.9.190'),'Outdated source badge');
 for(const [width,height] of [[1440,1000],[1024,900],[768,1024],[390,844],[320,720]])for(const lang of ['zh','en']) {
  await page.setViewportSize({width,height});if((await page.locator('html').getAttribute('lang')).startsWith('en')!==(lang==='en'))await page.locator('#language-toggle').click();await page.waitForTimeout(130);
  for(const id of ['shortcut-studio','duplicate-story']) {
   for(const step of [0,1,2,3,4,2,0]) {
    await page.locator('#'+id).evaluate((el,n)=>scrollTo(0,+el.dataset.motionStart+((n+.5)/5)*(+el.dataset.motionEnd-+el.dataset.motionStart)),step);
    await page.waitForFunction(({id,step})=>document.getElementById(id).dataset.step===String(step),{id,step});
    if(step===2){
     const geometry=await page.locator('#'+id).evaluate(el=>{const pin=el.querySelector('.story-pin').getBoundingClientRect(),phone=el.querySelector('.cinema-phone');return {top:pin.top,bottom:pin.bottom,overflow:document.documentElement.scrollWidth>innerWidth+1,clipped:phone.scrollHeight>phone.clientHeight+2};});
     assert(!geometry.overflow,`${engineName}/${width}/${lang}/${id}: horizontal overflow`);
     assert(geometry.bottom<=height+2&&geometry.top>=60,`${engineName}/${width}/${lang}/${id}: sticky scene exceeds viewport: ${JSON.stringify(geometry)}`);
     assert(!geometry.clipped,`${engineName}/${width}/${lang}/${id}: phone content is cropped`);
    }
    if(id==='shortcut-studio') {
     assert(await page.locator('#shortcut-surface').getAttribute('data-mode')==='grid','Shortcut mode does not follow scroll');
     assert(await page.locator('#native-preview').isVisible()===[1,2,3].includes(step),'Preview state mismatch');
     assert(await page.locator('#native-single-overlay').isVisible()===false,'Single menu should be in the experience section');
    }
    if([1440,390,320].includes(width)&&[2,4].includes(step)) {await page.waitForTimeout(300);await page.screenshot({path:`artifacts/v11/${engineName}-${lang}-${width}-${id}-${step}.png`});}
   }
  }
 }
 // No illustrative scroll action is recorded as real cumulative growth.
 assert((await page.locator('[data-growth-kind="processed"] strong').innerText())==='16,384','Scroll presentation created activity records');
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(150);
 for(const id of ['shortcut-studio','duplicate-story']) {
  await page.locator('#'+id+' [data-story-step="4"]').click();assert(await page.locator('#'+id).getAttribute('data-step')==='4','Reduced Motion step navigation failed');
  assert(await page.locator('#'+id).evaluate(el=>el.offsetHeight<1600),'Reduced Motion retains long scroll runway');
 }
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(150);
 await page.locator('#shortcut-studio').evaluate(el=>scrollTo(0,+el.dataset.motionStart+.1*(+el.dataset.motionEnd-+el.dataset.motionStart)));await page.waitForTimeout(100);
 await page.locator('#motion-toggle').click();await page.locator('#shortcut-studio').evaluate(el=>scrollTo(0,+el.dataset.motionStart+.9*(+el.dataset.motionEnd-+el.dataset.motionStart)));await page.waitForTimeout(100);assert(await page.locator('#shortcut-studio').getAttribute('data-step')==='0','Pause does not freeze scroll presentation');await page.locator('#motion-toggle').click();await page.waitForTimeout(100);assert(await page.locator('#shortcut-studio').getAttribute('data-step')==='4','Resume failed');
 assert(!errors.length,errors.join('\n'));console.log(JSON.stringify({engine:engineName,status:'passed',layouts:10,scenes:2,forwardReverse:'passed',reducedMotion:'passed',pause:'passed'}));await browser.close();
}
