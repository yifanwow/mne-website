import fs from 'node:fs/promises';
const {webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await webkit.launch({headless:true});
const assert=(value,message)=>{if(!value)throw new Error(message);};
await fs.mkdir('artifacts/v5/webkit',{recursive:true});
for(const width of [320,390,768])for(const lang of ['zh','en']) {
  const height=width===320?720:width===390?844:1024;
  const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,locale:lang==='zh'?'zh-CN':'en-US'});
  await context.addInitScript(value=>localStorage.setItem('mne-site-language',value),lang);
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.waitForTimeout(2300);
  assert(await page.locator('#story .section-star svg').count()===1,'Star marker is not SVG');
  assert(await page.locator('.hero-copy').evaluate(el=>getComputedStyle(el).textAlign==='left'),'WebKit typography is not left aligned');
  const contacts=await page.locator('.hero-contacts>a,.wechat-contact>button').evaluateAll(els=>els.map(el=>({top:el.getBoundingClientRect().top,label:el.getAttribute('aria-label')})));
  assert(contacts.every(contact=>contact.label&&Math.abs(contact.top-contacts[0].top)<1),'Icon contacts wrap or lack accessible names');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'WebKit horizontal overflow');
  await page.screenshot({path:`artifacts/v5/webkit/hero-${lang}-${width}.png`});
  for(const selector of ['#experience-story','#fragment-journey']) {
    await page.locator(selector).evaluate(el=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,Number(el.dataset.motionStart)+(Number(el.dataset.motionEnd)-Number(el.dataset.motionStart))*.5);});
    await page.waitForTimeout(600);
    const content=selector==='#experience-story'?'.feature-chapter.current':'.fragment-hint';
    assert(await page.locator(content).evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight-8),`WebKit content exceeds viewport: ${selector}, ${width}, ${lang}`);
    await page.screenshot({path:`artifacts/v5/webkit/${selector.slice(1)}-${lang}-${width}.png`});
  }
  const changes=await page.evaluate(async()=>{
    const scene=document.querySelector('#fragment-journey'),tile=document.querySelector('.fragment-tile');
    const start=Number(scene.dataset.motionStart),end=Number(scene.dataset.motionEnd);
    const samples=[];
    for(let i=0;i<60;i++) {scrollTo(0,start+(end-start)*(.22+i/60*.58));await new Promise(requestAnimationFrame);samples.push(tile.style.transform);}
    return new Set(samples).size;
  });
  assert(changes>25,'WebKit cards do not track continuous native scroll');
  await page.locator('#hide-archived').scrollIntoViewIfNeeded();
  await page.locator('#hide-archived').tap();
  assert(await page.locator('#hide-archived').getAttribute('aria-checked')==='true','Archive filter failed');
  assert(await page.locator('#filter-count').innerText()==='2','Filtered count incorrect');
  await page.locator('#hide-archived').tap();
  assert(await page.locator('#filter-count').innerText()==='3','Filter did not restore photos');
  await page.locator('#photo-info-toggle').tap();
  assert(await page.locator('#photo-info-toggle').getAttribute('aria-expanded')==='true','Photo info toggle failed');
  assert(await page.locator('#detail-resolution').innerText()==='2250 × 4000','Resolution does not match source photo');
  await page.locator('#quick-photo').tap();
  assert(await page.locator('#quick-menu').isVisible(),'Touch cannot open album menu');
  await page.locator('[data-quick-album="recent"]').tap();
  assert(await page.locator('#quick-toast').isVisible(),'Recent-album demonstration failed');
  await page.locator('[data-aspect-choice="9:16"]').tap();
  assert(await page.locator('.aspect-gallery').getAttribute('data-aspect')==='9:16','Aspect choice failed');
  assert(await page.locator('.aspect-gallery img').first().evaluate(el=>getComputedStyle(el).objectFit==='contain'),'Ratio demonstration crops the photos');
  await page.locator('[data-aspect-choice="4:6"]').tap();
  assert(await page.locator('[data-aspect-choice="4:6"]').getAttribute('aria-pressed')==='true','Aspect selection accessibility failed');
  for(const selector of ['#detail-filter','#detail-info','#detail-quick','#detail-aspect'])await page.locator(selector).scrollIntoViewIfNeeded();
  await page.locator('#details').screenshot({path:`artifacts/v5/webkit/details-${lang}-${width}.png`});
  await page.locator('#credits-open').tap();
  assert(await page.locator('#credits-dialog').isVisible(),'Learn-more panel failed');
  assert(await page.locator('#credits-dialog a').count()===3,'Learn-more destinations missing');
  await page.locator('#credits-close').tap();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Interaction caused horizontal overflow');
  assert(!errors.length,errors.join('\n'));
  console.log(JSON.stringify({engine:'WebKit',width,lang,scrollFramesWithChanges:changes,status:'passed'}));
  await context.close();
}
await browser.close();
