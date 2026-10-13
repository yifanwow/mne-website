import fs from 'node:fs/promises';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=(value,message)=>{if(!value)throw new Error(message);};
await fs.mkdir('artifacts/v7/details',{recursive:true});
for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]]) {
  const browser=await engine.launch({headless:true});
  const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'zh-CN'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.SITE_URL||'http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.locator('#hide-archived').click();
  assert(await page.locator('#hide-archived').getAttribute('aria-checked')==='true',`${name}: filter click failed`);
  await page.locator('#photo-info-toggle').hover();await page.waitForTimeout(600);
  const before=await page.locator('#photo-info').evaluate(el=>el.offsetHeight);
  await page.locator('#photo-info-toggle').click();await page.waitForTimeout(450);
  const after=await page.locator('#photo-info').evaluate(el=>el.offsetHeight);
  assert(after>before+10,`${name}: info click has no visible expansion`);
  await page.locator('#photo-info-toggle').click();await page.waitForTimeout(450);
  assert(await page.locator('#photo-info').evaluate(el=>el.offsetHeight)<after,`${name}: info cannot collapse`);
  await page.locator('#quick-photo').hover({position:{x:20,y:20}});
  assert(await page.locator('#quick-menu').isVisible(),`${name}: menu hover failed`);
  await page.locator('#quick-photo').click({position:{x:20,y:20}});
  assert(!await page.locator('#quick-menu').isVisible(),`${name}: hover-open menu does not respond to click`);
  await page.locator('#quick-photo').click({position:{x:20,y:20}});
  assert(await page.locator('#quick-menu').isVisible(),`${name}: menu cannot reopen`);
  await page.locator('[data-quick-album="archive"]').click();
  assert((await page.locator('#quick-toast').innerText()).includes('Mne Archive'),`${name}: menu action failed`);
  const quickRatio=await page.locator('#quick-photo img').evaluate(el=>el.naturalWidth/el.naturalHeight);
  assert(quickRatio<.75,'Quick-menu photo is not portrait');
  const sizes={};
  for(const choice of ['adaptive','9:16','4:6']) {
    await page.locator(`[data-aspect-choice="${choice}"]`).click();await page.waitForTimeout(650);
    sizes[choice]=await page.locator('.aspect-gallery figure').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {w:r.width,h:r.height};}));
    assert(sizes[choice].length===6,'Aspect demo does not have six photographs');
  }
  assert(new Set(sizes.adaptive.map(size=>Math.round(size.w/size.h*100))).size>=3,'Adaptive preview does not mix original photo proportions');
  assert(sizes['9:16'].every(size=>Math.abs(size.w/size.h-9/16)<.015),'9:16 geometry is incorrect');
  assert(sizes['4:6'].every(size=>Math.abs(size.w/size.h-4/6)<.015),'4:6 geometry is incorrect');
  assert(Math.abs(sizes['9:16'][0].w-sizes['4:6'][0].w)>8,'Ratio click does not visibly change frame dimensions');
  await page.locator('#detail-aspect').screenshot({path:`artifacts/v7/details/ratios-${name}.png`});
  await page.locator('#box-study-replay').click();await page.waitForTimeout(300);
  const running=await page.locator('#box-study-art').evaluate(el=>[...el.querySelectorAll('path')].some(path=>path.getAnimations().some(animation=>animation.playState==='running')));
  assert(running,'Study logo replay did not animate');
  await page.waitForTimeout(2300);
  assert(await page.locator('#box-study-art').evaluate(el=>[...el.querySelectorAll('path')].every(path=>parseFloat(path.style.strokeDashoffset)===0)),'Study logo did not finish complete');
  await page.locator('.memory-box-story').screenshot({path:`artifacts/v7/details/logo-${name}.png`});
  assert(await page.locator('.cleaning-sun').count()===1,'Cleaning icon is not SVG');
  await page.locator('[data-period="year"]').click();
  await page.locator('[data-chart="bars"]').click();
  assert(await page.locator('#memory-chart .bar').count()===5,'Atlas does not span five years');
  const yearlyLabels=await page.locator('#memory-chart .axis-label').allTextContents();
  assert(yearlyLabels.includes('2022')&&yearlyLabels.includes('2026'),'Yearly axis omits illustration years');
  await page.locator('.app-profile-preview').screenshot({path:`artifacts/v7/details/atlas-${name}.png`});
  assert((await page.locator('.version-badge').innerText()).includes('0.9.7'),'Source badge is out of date');
  assert((await page.locator('.timeline-entry').first().innerText()).includes('0.9.7 (38)'),'Latest development entry is missing');
  for(const width of [1440,1024,768,390,320])for(const lang of ['zh','en']) {
    await page.setViewportSize({width,height:1000});
    if((await page.locator('html').getAttribute('lang')).startsWith('en')!==(lang==='en'))await page.locator('#language-toggle').click();
    await page.locator('#details').scrollIntoViewIfNeeded();
    // Reveal each row before inspecting the complete section.
    for(const card of await page.locator('.detail-card').all())await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(850);
    const layout=await page.locator('.detail-grid').evaluate(el=>({columns:getComputedStyle(el).gridTemplateColumns.split(' ').length,cards:[...el.children].map(card=>{const r=card.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,visual:card.querySelector('.detail-visual').offsetHeight};}),overflow:document.documentElement.scrollWidth>innerWidth+1}));
    assert(layout.columns===(width>1000?4:width>600?2:1),`${name}/${width}/${lang}: wrong number of columns`);
    assert(!layout.overflow,`${name}/${width}/${lang}: horizontal overflow`);
    assert(layout.cards.every(card=>card.h>card.w&&card.visual===370),`${name}/${width}/${lang}: cards do not have aligned portrait visuals`);
    for(const selector of ['#hide-archived','.aspect-controls','.press-hint','#photo-info-toggle']) {
      assert(await page.locator(selector).evaluate(el=>{const a=el.getBoundingClientRect(),b=el.closest('.detail-visual').getBoundingClientRect();return a.x>=b.x-1&&a.right<=b.right+1&&a.y>=b.y-1&&a.bottom<=b.bottom+1;}),`${name}/${width}/${lang}: clipped ${selector}`);
    }
    const photos=await page.locator('img[src*="assets/photos/"]').evaluateAll(els=>els.map(el=>el.getAttribute('src')));
    assert(photos.length===31&&new Set(photos).size===31,'Photographs repeat across the page');
    if([1440,768,390].includes(width))await page.locator('#details').screenshot({path:`artifacts/v7/details/row-${name}-${lang}-${width}.png`});
  }
  assert(!errors.length,errors.join('\n'));
  console.log(JSON.stringify({engine:name,status:'passed',infoExpandedBy:after-before,aspectChanges:sizes}));
  await context.close();await browser.close();
}
