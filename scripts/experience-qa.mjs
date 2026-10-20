// Website-only regression checks for the moved single-photo story and quiet page rail.
import fs from 'node:fs/promises';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=(ok,message)=>{if(!ok)throw Error(message);};
await fs.mkdir('artifacts/v13',{recursive:true});
for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]]) {
 const browser=await engine.launch({headless:true}),page=await browser.newPage({locale:'zh-CN'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto('http://127.0.0.1:4173/?v=1.9.0',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
 for(const [width,height] of [[1780,1000],[1440,1000],[768,1024],[390,844],[320,720]])for(const lang of ['zh','en']) {
  await page.setViewportSize({width,height});if((await page.locator('html').getAttribute('lang')).startsWith('en')!==(lang==='en'))await page.locator('#language-toggle').click();await page.waitForTimeout(200);
  if(lang==='zh'){
   assert(await page.locator('[data-i18n="experienceTitle"]').innerText()==='回望，也可以纯粹且简单。','Experience headline not updated');
   assert(await page.locator('[data-i18n="floatingTitle"]').innerText()==='遇见美好，留下回忆。','Hero note not updated');
   assert((await page.locator('[data-i18n="platform"]').innerText()).includes('邀请制内测中'),'Beta copy not updated');
  }
  let fixedChrome;
  for(const [progress,action] of [[.04,'browse'],[.43,'open'],[.475,'favorite'],[.51,'liked'],[.545,'reopen'],[.575,'archive'],[.61,'saved'],[.75,'set-aside'],[.97,'restore'],[.575,'archive'],[.43,'open'],[.04,'browse']]) {
   await page.locator('#experience-story').evaluate((el,p)=>scrollTo(0,+el.dataset.motionStart+p*(+el.dataset.motionEnd-+el.dataset.motionStart)),progress);
   await page.waitForFunction(a=>document.querySelector('.demo-phone').dataset.action===a,action);await page.waitForFunction(a=>{const opacity=Number(getComputedStyle(document.querySelector('.demo-quick-menu')).opacity);return ['open','favorite','reopen','archive'].includes(a)?opacity>.99:opacity<.01;},action);await page.waitForTimeout(100);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${name}/${width}/${lang}: overflow`);
   const state=await page.locator('.demo-phone').evaluate(el=>{const box=el.getBoundingClientRect(),menu=el.querySelector('.demo-quick-menu').getBoundingClientRect(),chrome=el.querySelector('.demo-single-chrome').getBoundingClientRect(),layer=el.querySelector('.demo-quick-layer');return {phone:box.toJSON(),menu:menu.toJSON(),chrome:chrome.toJSON(),menuOpacity:getComputedStyle(layer.querySelector('.demo-quick-menu')).opacity,feedback:getComputedStyle(layer.querySelector('.demo-quick-feedback')).opacity,phase:el.dataset.phase};});
   if(['open','favorite','reopen','archive'].includes(action)) {
    assert(Number(state.menuOpacity)>.99,`${name}/${width}/${lang}/${progress}/${action}: menu opacity ${state.menuOpacity}`);
    assert(state.menu.x>=state.phone.x&&state.menu.x+state.menu.width<=state.phone.x+state.phone.width,'Quick menu exceeds photo width');
    assert(state.menu.y>state.chrome.y+state.chrome.height&&state.menu.y+state.menu.height<state.phone.y+state.phone.height-25,'Menu overlaps fixed chrome or filmstrip');
    if(action==='open')fixedChrome=state.chrome.y-state.phone.y;
    if(action==='archive')assert(Math.abs(state.chrome.y-state.phone.y-fixedChrome)<1,`${name}/${width}/${lang}: metadata y ${fixedChrome} → ${state.chrome.y-state.phone.y}`);
   }else assert(Number(state.menuOpacity)<.01,'Menu did not dismiss');
   if(action==='saved')assert(state.feedback==='1','Archive feedback missing');
   if(action==='restore')assert(await page.locator('.scroll-demo-photo').nth(1).evaluate(el=>Number(el.style.opacity)>.95),'Restored photo missing');
   if(progress===.575&&[1780,390,320].includes(width))await page.screenshot({path:`artifacts/v13/${name}-${lang}-${width}-single-menu.png`});
  }
  if(width===1780) {
   await page.locator('#design').evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-110));await page.waitForTimeout(150);
   const rail=await page.locator('#section-rail').boundingBox(),content=await page.locator('#design').boundingBox();assert(content.x-(rail.x+rail.width)>=100,'Rail remains too close to content');
   assert(await page.locator('.rail-panel').evaluate(el=>getComputedStyle(el).backgroundColor)==='rgba(0, 0, 0, 0)','Rail retains a heavy panel');
   await page.screenshot({path:`artifacts/v13/${name}-${lang}-rail.png`});
   await page.locator('#section-nav-toggle').click();assert(await page.locator('#section-nav-links').isHidden(),'Collapse broken');await page.locator('#section-nav-toggle').click();
  }else assert(await page.locator('#section-rail').isHidden(),'Rail shown without a free gutter');
 }
 assert(!errors.length,errors.join('\n'));console.log(JSON.stringify({engine:name,layouts:10,singleMenu:'forward / reverse / favorite / archive / feedback / restore',rail:'clear gutter / transparent / collapse',status:'passed'}));await browser.close();
}
