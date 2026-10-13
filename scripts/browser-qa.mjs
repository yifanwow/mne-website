// Browser QA is optional development tooling; the website itself has no dependencies.
import fs from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({locale:'zh-CN'});
const page=await context.newPage();
const errors=[],failures=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)failures.push(`${r.status()} ${r.url()}`);});
await fs.mkdir('artifacts/v2',{recursive:true});
const assert=(value,message)=>{if(!value)throw new Error(message);};
async function scrollToScene(selector,progress=0) {
  await page.locator(selector).evaluate((el,p)=>{
    document.documentElement.style.scrollBehavior='auto';
    const top=el.getBoundingClientRect().top+scrollY;
    if(el.id==='experience-story')scrollTo(0,top-innerHeight*.25+p*(el.offsetHeight-innerHeight*.5));
    else if(el.id==='fragment-journey')scrollTo(0,top-90+p*(el.offsetHeight-document.querySelector('.fragment-sticky').offsetHeight-100));
    else scrollTo(0,top-100);
  },progress);
  await page.waitForTimeout(550);
}
async function checkLayout(width) {
  const report=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,clipped:[...document.querySelectorAll('.hero-copy,.story-content,.section-heading,.feature-chapter,.fragment-story,.atlas-copy,.production-atlas-heading,.journal-heading,.footer-top')].filter(el=>{
    const r=el.getBoundingClientRect();return r.width>0&&(r.left<-.5||r.right>innerWidth+.5);
  }).map(el=>el.className),broken:[...document.images].filter(img=>img.complete&&img.naturalWidth===0).map(img=>img.src)}));
  assert(!report.overflow,`Horizontal overflow at ${width}`);
  assert(!report.clipped.length,`Clipped content at ${width}: ${report.clipped}`);
  assert(!report.broken.length,`Broken images: ${report.broken}`);
}
const viewports=process.env.QA_INTERACTIONS_ONLY ? [] : [{width:1440,height:1000},{width:1024,height:900},{width:768,height:1024},{width:390,height:844},{width:320,height:720}];
if(process.env.QA_INTERACTIONS_ONLY) {
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
}
for(const viewport of viewports) {
  await page.setViewportSize(viewport);
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.waitForTimeout(2650);
  await checkLayout(viewport.width);
  await page.screenshot({path:`artifacts/v2/hero-zh-${viewport.width}.png`});
  for(const [p,phase] of [[.02,'0'],[.5,'1'],[.9,'2']]) {
    await scrollToScene('#experience-story',p);
    assert(await page.locator('.demo-phone').getAttribute('data-phase')===phase,`Scroll demonstration phase ${phase} failed at ${viewport.width}`);
    if(p===.5)await page.screenshot({path:`artifacts/v2/experience-${viewport.width}.png`});
  }
  await scrollToScene('#experience-story',.02);
  assert(await page.locator('.demo-phone').getAttribute('data-phase')==='0','Reverse scrolling did not restore the gallery');
  await scrollToScene('#fragment-journey',.5);
  assert((await page.locator('#fragment-story-index').innerText()).startsWith('04'),'Vertical scroll did not traverse card collection');
  await page.screenshot({path:`artifacts/v2/fragments-${viewport.width}.png`});
  await scrollToScene('#atlas');
  await page.locator('.production-atlas').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  assert(await page.locator('[data-stat="reviewed"] [data-count]').innerText()==='1,284','Entrance count did not reach 1,284');
  await page.screenshot({path:`artifacts/v2/atlas-${viewport.width}.png`});
  await scrollToScene('#journal');
  await scrollToScene('#early-access');
  await page.evaluate(()=>scrollTo(0,0));
  await page.locator('#language-toggle').click();
  await page.waitForTimeout(250);
  assert(await page.locator('html').getAttribute('lang')==='en','English toggle failed');
  await checkLayout(viewport.width);
  await page.screenshot({path:`artifacts/v2/hero-en-${viewport.width}.png`});
  await page.reload();
  assert(await page.locator('html').getAttribute('lang')==='en','Language preference did not persist');
  await page.locator('#language-toggle').click();
}
await scrollToScene('#fragment-journey',.5);
await page.locator('#fragment-next').click();
assert((await page.locator('#fragment-story-index').innerText()).startsWith('05'),'Card next button failed');
await page.locator('#fragment-viewport').focus();
await page.keyboard.press('ArrowLeft');
assert((await page.locator('#fragment-story-index').innerText()).startsWith('04'),'Card keyboard navigation failed');
await page.keyboard.press('End');
assert((await page.locator('#fragment-story-index').innerText()).startsWith('07'),'Last card is inaccessible');
await page.locator('#language-toggle').click();
assert(await page.locator('#fragment-name').innerText()==='Moon Cycle','Card description did not change language');
await page.locator('#language-toggle').click();
await scrollToScene('#atlas');
await page.locator('[data-chart="bars"]').click();
assert(await page.locator('#memory-chart .bar').count()===12,'Monthly bar chart failed');
await page.locator('[data-period="week"]').click();
assert(await page.locator('#memory-chart .bar').count()>=52,'Weekly grouping failed');
await page.locator('[data-chart="pie"]').click();
assert(await page.locator('#chart-legend>span').count()===12,'Long-range pie sector limit failed');
const pieTotal=await page.locator('#chart-legend b').evaluateAll(els=>els.reduce((sum,el)=>sum+Number(el.textContent),0));
assert(pieTotal===1284,'Pie chart did not preserve total');
await page.locator('[data-period="year"]').click();
assert(await page.locator('#memory-chart .pie-total').textContent()==='1,284','Yearly total is inconsistent');
await page.locator('[data-period="month"]').click();
await page.locator('[data-chart="trend"]').click();
assert(await page.locator('#memory-chart .trend-line').count()===1,'Trend chart failed');
await page.locator('#memory-chart').scrollIntoViewIfNeeded();
const chartBox=await page.locator('#memory-chart').boundingBox();
await page.mouse.click(chartBox.x+chartBox.width*.6,chartBox.y+chartBox.height*.6);
assert((await page.locator('#atlas-chart-hint').innerText()).includes('当前阶段'),'Chart inspection failed');
await page.locator('#timeline-expand').click();
assert(await page.locator('.timeline-entry:not([hidden])').count()===10,'Journal expansion failed');
await page.locator('#language-toggle').click();
assert(await page.locator('.timeline-entry:not([hidden])').count()===10,'Expanded journal state was lost on language switch');
await page.locator('#timeline-expand').click();
assert(await page.locator('.timeline-entry:not([hidden])').count()===4,'Journal collapse failed');
await page.locator('#credits-open').click();
assert(await page.locator('#credits-dialog').evaluate(el=>el.open),'Credits dialog failed');
await page.keyboard.press('Escape');
assert(!await page.locator('#credits-dialog').evaluate(el=>el.open),'Escape did not dismiss credits');
await page.locator('#motion-toggle').click();
assert(await page.locator('#motion-toggle').getAttribute('aria-pressed')==='true','Motion pause state failed');
const frozen=await page.locator('#memory-sky').evaluate(el=>el.toDataURL());
await page.waitForTimeout(400);
assert(await page.locator('#memory-sky').evaluate(el=>el.toDataURL())===frozen,'Background continued animating while paused');
await page.locator('#motion-toggle').click();
await page.emulateMedia({reducedMotion:'reduce'});
await page.reload({waitUntil:'networkidle'});
assert(await page.locator('.reveal').first().evaluate(el=>getComputedStyle(el).opacity)==='1','Reduced-motion content is hidden');
assert(await page.locator('.fragment-journey').evaluate(el=>el.offsetHeight)<1600,'Reduced motion retains the long pinned scene');
assert(await page.locator('.fragment-tile').count()===7,'Reduced-motion collection is incomplete');
assert(await page.locator('.tile-story').first().isVisible(),'Reduced-motion card stories are hidden');
await page.evaluate(()=>localStorage.setItem('mne-site-language','zh'));
await page.setViewportSize({width:1440,height:1000});
await page.reload({waitUntil:'networkidle'});
for(const section of ['#story','#experience','#fragments','#atlas','#journal','#early-access'])await scrollToScene(section);
await page.evaluate(()=>scrollTo(0,0));
await page.screenshot({path:'artifacts/v2/full-static.png',fullPage:true});
assert(!errors.length&&!failures.length,JSON.stringify({errors,failures}));
await context.close();
// Actual touch events: horizontal card swipe and native vertical scrolling remain independent.
const touchContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'zh-CN'});
const touchPage=await touchContext.newPage();
await touchPage.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await touchPage.locator('#fragment-journey').evaluate(el=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,el.getBoundingClientRect().top+scrollY-90+(el.offsetHeight-document.querySelector('.fragment-sticky').offsetHeight-100)*.5);});
await touchPage.waitForTimeout(500);
const touch=await touchContext.newCDPSession(touchPage);
const box=await touchPage.locator('#fragment-viewport').boundingBox();
const before=await touchPage.locator('#fragment-story-index').innerText();
async function swipe(x,y,dx,dy) {
 await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
 for(let i=1;i<=8;i++){await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/8,y:y+dy*i/8}]});await touchPage.waitForTimeout(25);}
 await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await touchPage.waitForTimeout(400);
}
await swipe(250,box.y+150,-130,0);
assert(await touchPage.locator('#fragment-story-index').innerText()!==before,'Touch swipe did not change the card');
const yBefore=await touchPage.evaluate(()=>scrollY);
const newBox=await touchPage.locator('#fragment-viewport').boundingBox();
await swipe(180,newBox.y+220,0,-160);
assert(await touchPage.evaluate(()=>scrollY)>yBefore+30,'Card touch surface trapped vertical page scrolling');
await touchContext.close();
await browser.close();
console.log(JSON.stringify({status:'passed',mode:viewports.length?'full':'focused interactions',widths:viewports.length?viewports.map(v=>v.width):[390,1440],languages:['zh-CN','en'],checks:['layout and images','scroll demo forward and reverse','seven-card scroll navigation','touch swipe and native vertical scroll','keyboard card navigation','original card stories and translation','entry counters','week/month/year grouping','trend/bars/pie and conserved totals','chart inspection','journal and language persistence','dialog Escape','motion pause','reduced-motion static collection','no JavaScript or HTTP errors']},null,2));
