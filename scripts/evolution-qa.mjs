// Website-only checks for native-inspired Journey Review, appearance and photo editing.
import fs from 'node:fs/promises';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=(ok,message)=>{if(!ok)throw Error(message);};
const out='artifacts/update-2026-10-25';await fs.mkdir(out,{recursive:true});
for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]].filter(([name])=>!process.env.QA_ENGINE||name===process.env.QA_ENGINE)){
 const b=await engine.launch({headless:true}),p=await b.newPage({locale:'zh-CN',reducedMotion:'reduce'}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await p.goto('http://127.0.0.1:4173/?v=2.3.1',{waitUntil:'networkidle'});await p.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
 for(const [width,height] of [[1780,1000],[1440,1000],[768,1024],[390,844],[320,720]])for(const lang of ['zh','en']){
  await p.setViewportSize({width,height});if((await p.locator('html').getAttribute('lang')).startsWith('en')!==(lang==='en'))await p.locator('#language-toggle').click();
  await p.locator('[data-journey-step="0"]').click();assert(await p.locator('.journey-native-card').count()===2,'Journey groups missing');assert(await p.locator('.journey-cover-fan img').count()===14,'Journey covers not seven per group');
  await p.locator('[data-open-journey="0"]').click();await p.locator('.journey-review input').first().uncheck();await p.locator('#journey-review-finish').click();assert(await p.locator('.journey-review').count()===0,'Review never completes');
  await p.locator('#journey-name').fill('海风');await p.locator('#journey-to-album').click();assert((await p.locator('.journey-album-count').innerText()).startsWith('6'),'Unchecked tentative photo counted');assert(await p.locator('#journey-album-name').inputValue()==='海风','Journey name lost');
  await p.locator('#journey-album-name').fill('');assert(await p.locator('#journey-confirm').isDisabled(),'Blank album name allowed');await p.locator('#journey-album-name').fill('海风');await p.locator('#journey-confirm').click();assert(await p.locator('.journey-created-name').innerText()==='海风','Album draft did not complete');await p.locator('#journey-restart').click();
  // Shared UI metadata is always present; opening this new demonstration never records activity.
  assert((await p.locator('[data-growth-kind="processed"] strong').innerText())==='16,384','Journey demo changed activity records');
  assert(await p.locator('[data-theme-choice]').count()===8&&await p.locator('[data-icon-choice]').count()===8,'Eight themes/icons missing');
  await p.locator('[data-icon-choice="wilderness"]').click();
  for(const theme of ['light','clearSky','wilderness','mist','dark','dreamPurple','sage','oled']){
   await p.locator(`[data-theme-choice="${theme}"]`).click();assert(await p.locator('#theme-preview').getAttribute('data-theme')===theme,'Palette did not change');assert((await p.locator('#theme-current-icon').getAttribute('src')).endsWith('/wilderness.png'),'Changing palette replaced the chosen icon');assert(await p.locator(`[data-theme-choice="${theme}"]`).evaluate(el=>el===document.activeElement),'Palette focus lost');
  }
  assert(await p.locator('#photo-editing .editor-mini-tools>span').count()===5,'Five editing icon tiles missing');
  assert(await p.locator('#photo-editing .editor-mini-tools svg').count()===5,'Editing SVG icons missing');
  assert(await p.locator('#photo-editing button,#photo-editing .editor-demo').count()===0,'Interactive editor should be a compact overview');
  assert(await p.locator('#photo-editing').evaluate(el=>(document.querySelector('#experience').compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING)&&(el.compareDocumentPosition(document.querySelector('#details'))&Node.DOCUMENT_POSITION_FOLLOWING)),'Editing overview order changed');
  for(const id of ['journey-studio','theme-studio','photo-editing']){await p.locator('#'+id).scrollIntoViewIfNeeded();assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${name}/${width}/${lang}/${id}: overflow`);if([1780,390,320].includes(width))await p.locator('#'+id).screenshot({path:`${out}/${name}-${lang}-${width}-${id}.png`});}
 }
 // Names remain text, even when somebody types markup into the illustrative name field.
 await p.locator('[data-journey-step="1"]').click();await p.locator('#journey-name').fill('<b id="unsafe">x</b>');await p.locator('[data-journey-step="0"]').click();assert(await p.locator('#unsafe').count()===0,'Journey name interpreted as HTML');
 const names=await p.locator('.journey-card-name').allTextContents();assert(names.some(n=>n.includes('<b')),'Journey name disappeared');
 for(const route of ['/privacy','/privacy/','/privacy.html'])assert((await p.request.get('http://127.0.0.1:4173'+route)).status()===200,'Privacy route regressed');
 assert((await p.locator('.version-badge').innerText()).includes('0.9.385'),'Source version outdated');
 assert(!errors.length,errors.join('\n'));await p.close();
 // A short entry sequence runs only while visible; the site-wide motion pause stops it.
 const auto=await b.newPage({viewport:{width:1440,height:1000},locale:'zh-CN'});await auto.goto('http://127.0.0.1:4173/?v=2.3.1',{waitUntil:'networkidle'});await auto.evaluate(()=>document.documentElement.style.scrollBehavior='auto');await auto.locator('#journey-studio').scrollIntoViewIfNeeded();
 await auto.locator('#motion-toggle').click();const before=await auto.locator('#journey-studio').getAttribute('data-step');await auto.waitForTimeout(4400);assert(await auto.locator('#journey-studio').getAttribute('data-step')===before,'Motion pause failed');await auto.locator('#motion-toggle').click();await auto.waitForTimeout(4400);assert(await auto.locator('#journey-studio').getAttribute('data-step')!==before,'Entry sequence did not resume');
 await auto.emulateMedia({reducedMotion:'reduce'});await auto.waitForTimeout(150);const reduced=await auto.locator('#journey-studio').getAttribute('data-step');await auto.waitForTimeout(4400);assert(await auto.locator('#journey-studio').getAttribute('data-step')===reduced,'Reduced Motion still autoplays');
 console.log(JSON.stringify({engine:name,layouts:10,journeys:'review / rename / draft / create / restart / safe text',appearance:'8 themes and 8 independent icons',editing:'compact overview / 5 SVG icon tiles / section order',motion:'pause / resume / reduced',privacy:'3 routes intact',status:'passed'}));await b.close();
}
