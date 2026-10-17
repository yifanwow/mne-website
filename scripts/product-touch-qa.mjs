const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=(x,m)=>{if(!x)throw new Error(m);};
for(const [engineName,engine] of [['Chromium',chromium],['WebKit',webkit]]) {
 const browser=await engine.launch({headless:true});
 for(const lang of ['zh','en']) {
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:lang==='zh'?'zh-CN':'en-US'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/?v=1.6.0',{waitUntil:'networkidle'});await page.locator('#album-edit').tap();await page.waitForFunction(()=>document.querySelector('#album-studio').dataset.phase==='editing');await page.waitForTimeout(100);
  if(engineName==='Chromium'){
   const first=page.locator('.native-album-handle').first();await first.scrollIntoViewIfNeeded();const a=await first.boundingBox(),b=await page.locator('.native-album-handle').nth(2).boundingBox(),old=await page.locator('.native-album-row').first().getAttribute('data-album');
   const session=await context.newCDPSession(page),x=a.x+a.width/2,y=a.y+a.height/2;
   await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
   for(let i=1;i<=16;i++){await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y+(b.y+b.height-y)*i/16}]});await page.waitForTimeout(20);}
   await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   assert(await page.locator('.native-album-row').first().getAttribute('data-album')!==old,'Native touch drag did not reorder');
  }else {await page.locator('.native-album-handle').first().focus();await page.keyboard.press('ArrowDown');}
  await page.locator('.native-album-tool').first().tap();await page.locator('[data-album-action="covers"]').tap();await page.locator('.native-cover-grid button').nth(3).tap();await page.locator('#album-dialog-save').tap();
  await page.locator('[data-shortcut-photo="0"]').tap({position:{x:10,y:10}});assert(await page.locator('#shortcut-surface').getAttribute('data-mode')==='single','Photo tap did not open single mode');
  await page.locator('#shortcut-open').tap({position:{x:25,y:230}});assert(await page.locator('#native-single-overlay').isVisible(),'Touch single menu did not open');
  await page.locator('[data-single-album="sea"]').tap();await page.locator('#shortcut-open').tap({position:{x:25,y:230}});assert(await page.locator('[data-single-action="removeMode"]').isVisible(),'Membership not retained');
  await page.locator('[data-single-action="removeMode"]').tap();await page.locator('[data-single-album="sea"]').tap();
  await page.locator('#storage-open').tap();assert(!await page.locator('#native-storage-content').isVisible(),'Capacity popover cannot close');await page.locator('#storage-open').tap();await page.locator('#native-storage-details summary').tap();assert(await page.locator('#native-storage-details dd').first().isVisible(),'Capacity details cannot expand');
  await page.locator('[data-growth-kind="reviewed"]').tap();assert(await page.locator('#growth-dialog .native-footprint-panels').isVisible(),'Reviewed detail missing');await page.locator('#growth-done').tap();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Touch interaction caused overflow');assert(!errors.length,errors.join('\n'));
  console.log(JSON.stringify({engine:engineName,lang,touch:'passed',drag:engineName==='Chromium'?'native touch':'covered by desktop drag and keyboard',menus:'passed',storage:'passed',statistics:'passed'}));await context.close();
 }
 await browser.close();
}
