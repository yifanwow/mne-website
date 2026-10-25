import fs from 'node:fs/promises';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=(value,message)=>{if(!value)throw new Error(message);};
await fs.mkdir('artifacts/v8/collection',{recursive:true});
for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]].filter(([name])=>!process.env.QA_ENGINE||name===process.env.QA_ENGINE)) {
  const browser=await engine.launch({headless:true});
  for(const lang of ['zh','en']) {
    const context=await browser.newContext({viewport:{width:320,height:720},locale:lang==='zh'?'zh-CN':'en-US'});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
    await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
    await page.locator('#fragment-journey').evaluate(el=>scrollTo(0,(Number(el.dataset.motionStart)+Number(el.dataset.motionEnd))/2));
    await page.waitForTimeout(300);
    for(const [category,count] of [['ordinary',14],['themed',10],['mystery',6]]) {
      await page.locator(`[data-card-category="${category}"]`).click();
      await page.locator('#fragment-viewport').focus();await page.keyboard.press('Home');
      for(let i=0;i<count;i++) {
        if(i)await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(100);
        const geometry=await page.locator('.fragment-hint').evaluate(el=>({bottom:el.getBoundingClientRect().bottom,overflow:document.documentElement.scrollWidth>innerWidth}));
        assert(geometry.bottom<=721&&!geometry.overflow,`${name}/${lang}/${category}/${i}: clipped card controls ${JSON.stringify(geometry)}`);
      }
    }
    await page.locator('#timeline-expand').click();
    assert(await page.locator('.timeline-entry:not([hidden])').count()===24,'Development history incomplete');
    await page.locator('#language-toggle').click();
    assert(await page.locator('.timeline-entry:not([hidden])').count()===24,'Expanded journal lost on language change');
    await page.locator('#language-toggle').click();
    await page.locator('.production-stats').scrollIntoViewIfNeeded();await page.waitForTimeout(1700);
    assert(await page.locator('[data-stat="reviewed"] [data-count]').innerText()==='32,768','Counter final value incorrect');
    await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(150);
    await page.locator('.production-stats').scrollIntoViewIfNeeded();await page.waitForTimeout(100);
    assert(await page.locator('[data-stat="reviewed"] [data-count]').innerText()!=='32,768','Counter no longer replays');
    await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});
    for(const [category,count] of [['ordinary',14],['themed',10],['mystery',6]]) {
      await page.locator(`[data-card-category="${category}"]`).click();
      assert(await page.locator('.fragment-tile').count()===count,'Reduced-motion category incomplete');
      assert(await page.locator('.tile-story').last().isVisible(),'Reduced-motion story hidden');
    }
    await page.locator('.fragment-sticky').screenshot({path:`artifacts/v8/collection/reduced-${name}-${lang}.png`});
    assert(!errors.length,errors.join('\n'));
    console.log(JSON.stringify({engine:name,lang,width:320,height:720,cardsChecked:30,reducedMotion:'passed',counters:'passed',journal:'passed'}));
    await context.close();
  }
  await browser.close();
}
