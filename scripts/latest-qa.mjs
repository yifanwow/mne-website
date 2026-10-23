// Website-only coverage for passive metadata, thematic previews and the larger reading scale.
import fs from 'node:fs/promises';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=(ok,message)=>{if(!ok)throw Error(message);};
await fs.mkdir('artifacts/v19',{recursive:true});
for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]]){
 const b=await engine.launch({headless:true}),p=await b.newPage({locale:'zh-CN'}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await p.goto('http://127.0.0.1:4173/?v=2.1.0',{waitUntil:'networkidle'});await p.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
 for(const [width,height] of [[1780,1000],[1440,1000],[1024,900],[768,1024],[390,844],[320,720]])for(const lang of ['zh','en']){
  await p.setViewportSize({width,height});if((await p.locator('html').getAttribute('lang')).startsWith('en')!==(lang==='en'))await p.locator('#language-toggle').click();await p.waitForTimeout(180);
  await p.locator('#detail-info').scrollIntoViewIfNeeded();await p.waitForTimeout(500);
  assert(await p.locator('#photo-info-toggle').count()===0,'Metadata still requires interaction');
  for(const selector of ['#photo-info time','#detail-resolution','.info-facts dd','.info-album'])for(const el of await p.locator(selector).all())assert(await el.isVisible(),'Metadata hidden: '+selector);
  assert(await p.locator('.info-album').evaluate(el=>Number(getComputedStyle(el).opacity)===1),'Album metadata only appears on interaction');
  assert((await p.locator('.info-facts').innerText()).includes('JPEG'),'Format missing');
  assert(await p.locator('.detail-copy p').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize))>=16,'Feature body still too small');
  await p.locator('#subject-studio').scrollIntoViewIfNeeded();await p.waitForTimeout(300);
  if(!await p.locator('#subject-filters').evaluate(el=>el.open))await p.locator('#subject-filters summary').click();
  await p.locator('#subject-show-archived').uncheck();await p.locator('#subject-media').selectOption('all');await p.locator('#subject-filters summary').click();
  for(const theme of ['plants','buildings']){
   await p.locator(`[data-subject-preview="${theme}"]`).click();assert(await p.locator('#subject-studio').getAttribute('data-theme')===theme,'Theme switch failed');
   assert(await p.locator('#subject-gallery figure').count()>0,'Theme has no example photos');
   assert(await p.locator('#subject-gallery [data-archived="true"]').count()===0,'Archived results shown by default');
  }
  await p.locator('#subject-filters summary').click();await p.locator('#subject-show-archived').check();assert(await p.locator('#subject-gallery figure').count()===6,'Archive filter failed');
  await p.locator('#subject-media').selectOption('videos');assert(await p.locator('#subject-gallery figure').count()===1,'Video filter failed');
  await p.locator('[data-subject-preview="plants"]').click();assert(await p.locator('#subject-gallery figure').count()===1,'Theme switch discards video preference');
  await p.locator('#subject-media').selectOption('all');await p.locator('#subject-show-archived').uncheck();await p.locator('#subject-filters summary').click();
  await p.locator('#subject-switch').click();assert(await p.locator('.subject-theme-grid button').count()===6,'Six native themes missing');assert(await p.locator('.subject-theme-grid button:disabled').count()===4,'Demo must not invent animal/food photography');
  const chooser=await p.locator('#subject-chooser').boundingBox(),phone=await p.locator('.subject-phone').boundingBox();assert(chooser.x>=phone.x&&chooser.x+chooser.width<=phone.x+phone.width&&chooser.y+chooser.height<phone.y+phone.height,'Chooser exceeds phone');
  await p.keyboard.press('Escape');assert(await p.locator('#subject-chooser').isHidden(),'Escape does not dismiss chooser');
  assert(await p.locator('#hide-archived').getAttribute('aria-checked')==='false','Theme filter changed main photo filtering');
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${name}/${width}/${lang}: overflow`);
  if([1780,390,320].includes(width)){await p.screenshot({path:`artifacts/v19/${name}-${lang}-${width}-subjects.png`});await p.locator('#detail-info').scrollIntoViewIfNeeded();await p.waitForTimeout(300);await p.screenshot({path:`artifacts/v19/${name}-${lang}-${width}-metadata.png`});}
 }
 await p.setViewportSize({width:390,height:844});await p.emulateMedia({reducedMotion:'reduce'});await p.locator('[data-subject-preview="buildings"]').click();assert(await p.locator('#subject-studio').getAttribute('data-theme')==='buildings','Reduced Motion theme switch failed');
 assert(!errors.length,errors.join('\n'));console.log(JSON.stringify({engine:name,layouts:12,metadata:'passive / all five fields',themes:'switch / six choices / independent archive and video filters',typography:'larger body',status:'passed'}));await b.close();
}
