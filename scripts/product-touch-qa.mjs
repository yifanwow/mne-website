const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=(value,message)=>{if(!value)throw new Error(message);};
for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]]) {
 const browser=await engine.launch({headless:true});
 for(const lang of ['zh','en']) {
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:lang==='zh'?'zh-CN':'en-US'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/?v=1.5.0',{waitUntil:'networkidle'});
  await page.locator('#album-edit').tap();await page.locator('#album-stack [data-album-move="up"]').tap();
  assert(await page.locator('#album-list').evaluate(el=>el.firstElementChild.id)==='album-stack','Touch reorder failed');
  await page.locator('[data-cover="lamplight"]').tap();
  await page.locator('[data-shortcut-photo="0"]').tap({position:{x:10,y:10}});
  assert(await page.locator('#shortcut-menu').isVisible(),'Touch waterfall menu failed');
  await page.locator('[data-shortcut-action="recent"]').tap();
  assert(await page.locator('#growth-organized').innerText()==='329','Touch activity failed');
  await page.locator('[data-shortcut-mode="single"]').tap();
  await page.locator('#shortcut-open').tap({position:{x:15,y:15}});
  assert(await page.locator('[data-shortcut-action="remove"]').isVisible(),'Touch single mode lost membership');
  await page.locator('[data-shortcut-action="favorite"]').tap();
  assert(await page.locator('#growth-organized').innerText()==='330','Touch favorite failed');
  await page.locator('#shortcut-open').tap({position:{x:15,y:15}});
  await page.locator('[data-shortcut-action="remove"]').tap();
  assert(await page.locator('#growth-organized').innerText()==='330','Cumulative demo progress went backward');
  await page.locator('[data-storage-scenario="high"]').tap();
  assert(await page.locator('#insight-total').innerText()==='16.14','Touch storage scenario failed');
  await page.locator('[data-storage-scope="videos"]').tap();
  assert(await page.locator('#insight-total').innerText()==='3.64','Touch video/cache total incorrect');
  assert(!errors.length,errors.join('\n'));
  console.log(JSON.stringify({engine:name,lang,touch:'passed',album:'passed',menus:'passed',activity:'passed',storage:'passed'}));
  await context.close();
 }
 await browser.close();
}
