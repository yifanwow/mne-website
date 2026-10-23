// Website-only regressions for the shared symbol state and immediately-applied picker.
import fs from 'node:fs/promises';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=(ok,message)=>{if(!ok)throw Error(message);};
await fs.mkdir('artifacts/v19',{recursive:true});
for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]]){
 const browser=await engine.launch({headless:true}),p=await browser.newPage({locale:'zh-CN',viewport:{width:1440,height:1000}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await p.goto('http://127.0.0.1:4173/?v=2.1.0',{waitUntil:'networkidle'});await p.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
 const row=p.locator('[data-album="main"]');
 for(const [width,height] of [[1440,1000],[768,1024],[390,844],[320,720]])for(const lang of ['zh','en']){
  await p.setViewportSize({width,height});if((await p.locator('html').getAttribute('lang')).startsWith('en')!==(lang==='en'))await p.locator('#language-toggle').click();
  await p.locator('#album-icon-try').click();
  assert(await p.locator('[data-album-icon]').count()===22,'Expected default plus 21 icons');
  assert(await p.locator('.native-icon-grid button[aria-pressed="true"]').count()===1,'Selected icon lost');
  assert(await p.locator('.native-icon-grid button>svg').count()===21,'Non-vector glyph in picker');
  const box=await p.locator('#album-dialog').boundingBox();assert(box.x>=0&&box.x+box.width<=width+1&&box.y>=0&&box.y+box.height<=height+1,`${name}/${width}/${lang}: picker exceeds viewport`);
  assert(await p.locator('.native-icon-grid button>span').evaluateAll(labels=>labels.every(el=>el.scrollWidth<=el.clientWidth+1)),'Icon label overflows tile');
  const tiles=await p.locator('.native-icon-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);assert(tiles===3,'Picker not three columns');
  if([1440,320].includes(width))await p.screenshot({path:`artifacts/v19/${name}-${lang}-${width}-album-icons.png`});
  await p.locator('[data-album-icon="photography"]').click();assert(!await p.locator('#album-dialog').isVisible(),'Selection does not dismiss');
  assert(await row.getAttribute('data-custom-icon')==='true','Icon not applied');assert(await row.locator('.web-album-glyph>svg').count()===1,'Row glyph missing');
  // Cancel and Done must not mutate the album or delete it.
  await p.locator('#album-icon-try').click();assert(await p.locator('[data-album-icon="photography"]').getAttribute('aria-pressed')==='true','Selection not retained');await p.locator('#album-dialog-save').click();assert(await p.locator('.native-album-row').count()===4,'Done deleted album');
  await p.locator('#album-icon-try').click();await p.keyboard.press('Escape');assert(!await p.locator('#album-dialog').isVisible(),'Escape failed');
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow');
 }
 await p.setViewportSize({width:1440,height:1000});await p.emulateMedia({reducedMotion:'reduce'});
 await p.locator('#album-edit').click();await p.waitForFunction(()=>document.querySelector('#album-studio').dataset.phase==='editing');
 assert(await row.locator('.native-album-symbol').evaluate(el=>el.getBoundingClientRect().width>=24&&Number(getComputedStyle(el).opacity)===1),'Custom icon hidden in Edit');
 await row.locator('.native-album-tool').click();await p.locator('[data-album-action="icons"]').click();await p.locator('[data-album-icon="default"]').click();assert(await row.getAttribute('data-custom-icon')==='false','Restore default failed');
 await p.locator('#album-icon-try').click();await p.locator('[data-album-icon="mne"]').click();
 await row.locator('.native-album-tool').click();await p.locator('[data-album-action="covers"]').click();await p.locator('.native-cover-grid>button').nth(2).click();await p.locator('#album-dialog-save').click();
 await row.locator('.native-album-tool').click();await p.locator('[data-album-action="rename"]').click();await p.locator('#album-name').fill('月白');await p.locator('#album-dialog-save').click();
 const oldOrder=await p.locator('.native-album-row').evaluateAll(rows=>rows.map(row=>row.dataset.album));await row.locator('.native-album-handle').focus();await p.keyboard.press('ArrowDown');assert(await p.locator('.native-album-row').nth(oldOrder.indexOf('main')+1).getAttribute('data-album')==='main','Keyboard reorder failed');assert(await row.getAttribute('data-custom-icon')==='true','Editing lost glyph');
 await p.locator('#album-edit').click();await p.waitForFunction(()=>document.querySelector('#album-studio').dataset.phase==='browsing');
 await p.locator('#shortcut-studio [data-story-step="3"]').click();assert(await p.locator('[data-preview-album="main"] .web-album-glyph>svg').count()===1,'Recent bubble lost custom glyph');
 assert((await p.locator('[data-preview-album="main"]').innerText()).includes('Gleam'),'Custom glyph overwrote bubble label');
 assert(await p.locator('[data-demo-album="main"] .web-album-glyph>svg').count()===1,'Experience menu lost custom glyph');
 assert((await p.locator('[data-growth-kind="processed"] strong').innerText())==='16,384','Changing icons recorded activity');
 assert(await p.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);return new Set(ids).size===ids.length;}),'Duplicate SVG IDs');
 await p.locator('#album-reset').click();assert(await p.locator('.native-album-row').count()===4,'Reset lost albums');
 const photos=await p.locator('.native-album-row img').evaluateAll(imgs=>imgs.map(img=>img.getAttribute('src')));assert(photos.length===28&&new Set(photos).size===28,'Seven unique covers per album lost');
 assert(!errors.length,errors.join('\n'));console.log(JSON.stringify({engine:name,layouts:8,picker:'21 icons / default / three columns / immediate apply',edit:'covers / rename / keyboard reorder / cancel / Done / reset',sharedGlyph:'row / quick bubble / experience menu',status:'passed'}));await browser.close();
}
