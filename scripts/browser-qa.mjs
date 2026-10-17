// Browser QA is optional development tooling; the website itself has no dependencies.
import fs from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({locale:'zh-CN'});
const page=await context.newPage();
const errors=[],failures=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)failures.push(`${r.status()} ${r.url()}`);});
await fs.mkdir('artifacts/v6',{recursive:true});
const assert=(value,message)=>{if(!value)throw new Error(message);};
async function scrollToScene(selector,progress=0) {
  await page.locator(selector).evaluate((el,p)=>{
    document.documentElement.style.scrollBehavior='auto';
    const top=el.getBoundingClientRect().top+scrollY;
    if(el.dataset.motionStart)scrollTo(0,Number(el.dataset.motionStart)+p*(Number(el.dataset.motionEnd)-Number(el.dataset.motionStart)));
    else scrollTo(0,top-100);
  },progress);
  await page.waitForTimeout(550);
}
async function checkLayout(width) {
  const report=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,clipped:[...document.querySelectorAll('.hero-copy,.story-content,.section-heading,.feature-chapter,.fragment-story,.atlas-copy,.production-atlas-heading,.journal-heading,.footer-top,.detail-copy,.details-heading')].filter(el=>{
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
  const centreStroke=await page.locator('#logo-art .memory-box-mark').evaluate(async svg=>{
    const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));
    const image=new Image();image.src=url;await image.decode();
    const canvas=document.createElement('canvas');canvas.width=canvas.height=100;
    const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,100,100);
    const pixel=[...ctx.getImageData(50,64,1,1).data];URL.revokeObjectURL(url);return pixel;
  });
  assert(centreStroke[3]>240&&centreStroke[2]>130,'Finished logo is missing its centre stroke');
  assert(!(await page.locator('body').innerText()).includes('Do Not Open'),'Album reference remains visible');
  assert((await page.locator('.story-seal').innerText()).includes('叙己'),'Author signature missing');
  assert(await page.locator('.story-seal small').innerText()==='Tell your story','Author subtitle incorrect');
  await checkLayout(viewport.width);
  assert(await page.locator('#story .section-star svg').count()===1,'Philosophy marker is not SVG');
  if(viewport.width<=850) {
    const mobile=await page.evaluate(()=>{
      const contacts=[...document.querySelectorAll('.hero-contacts>a,.wechat-contact>button')];
      return {align:getComputedStyle(document.querySelector('.hero-copy')).textAlign,rows:contacts.map(el=>el.getBoundingClientRect().top),names:contacts.map(el=>el.getAttribute('aria-label')),size:parseFloat(getComputedStyle(document.querySelector('.hero-description')).fontSize)};
    });
    assert(mobile.align==='left'&&mobile.size>=15,'Mobile typography not updated');
    assert(mobile.rows.every(top=>Math.abs(top-mobile.rows[0])<1)&&mobile.names.every(Boolean),'Icon contacts are not a single accessible row');
  }
  const alignment=await page.evaluate(()=>{
    const nav=document.querySelector('.site-header nav'),r=nav.getBoundingClientRect();
    const button=document.querySelector('.hero-buttons .button'),b=button.getBoundingClientRect(),label=button.firstElementChild.getBoundingClientRect();
    return {navVisible:r.width>0,navError:Math.abs((r.left+r.right)/2-innerWidth/2),buttonError:Math.abs((label.left+label.right)/2-(b.left+b.right)/2)};
  });
  assert(!alignment.navVisible||alignment.navError<1,'Navigation is not centered');
  assert(alignment.buttonError<1,'Button text is not centered');
  assert(await page.locator('[data-i18n="heroDescription"]').innerText()==='照片是回忆的载体，选择你想留住的故事。','Updated hero copy missing');
  await page.screenshot({path:`artifacts/v6/hero-zh-${viewport.width}.png`});
  await scrollToScene('#story');await page.screenshot({path:`artifacts/v6/story-${viewport.width}.png`});
  // Observe the picture moving while the title is actually on screen, independently of scene progress data.
  for(const [scene,titleSelector,artSelector] of [
    ['#experience-story','.experience-pinned h2','.scroll-demo-photo'],
    ['#fragment-journey','[data-i18n="fragmentEyebrow"]','.fragment-tile']
  ]) {
    await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,0);});
    const naturalTop=await page.locator(titleSelector).evaluate(el=>el.getBoundingClientRect().top+scrollY);
    await page.evaluate(top=>scrollTo(0,top-innerHeight*.82),naturalTop);await page.waitForTimeout(300);
    const before=await page.locator(artSelector).first().evaluate(el=>el.getBoundingClientRect().width+':'+getComputedStyle(el).transform);
    await page.evaluate(top=>scrollTo(0,top-innerHeight*.58),naturalTop);await page.waitForTimeout(600);
    const after=await page.locator(artSelector).first().evaluate(el=>el.getBoundingClientRect().width+':'+getComputedStyle(el).transform);
    const visible=await page.locator(titleSelector).evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=document.querySelector('.site-header').getBoundingClientRect().bottom&&r.bottom<innerHeight;});
    assert(visible&&before!==after,`Title-led scroll start failed for ${scene} at ${viewport.width}`);
  }
  for(const [p,phase] of [[.02,'0'],[.5,'1'],[.9,'2']]) {
    await scrollToScene('#experience-story',p);
    assert(await page.locator('.demo-phone').getAttribute('data-phase')===phase,`Scroll demonstration phase ${phase} failed at ${viewport.width}`);
    if(p===.5)await page.screenshot({path:`artifacts/v6/experience-${viewport.width}.png`});
    if(p===.5)assert(await page.locator('.experience-pinned h2').evaluate(el=>el.getBoundingClientRect().top>=document.querySelector('.site-header').getBoundingClientRect().bottom),'Experience title scrolled out during playback');
  }
  await scrollToScene('#experience-story',.02);
  assert(await page.locator('.demo-phone').getAttribute('data-phase')==='0','Reverse scrolling did not restore the gallery');
  await scrollToScene('#fragment-journey',3/7);
  const focusStyle=await page.locator('.fragment-tile.active').evaluate(el=>({opacity:Number(getComputedStyle(el).opacity),background:getComputedStyle(el).backgroundColor}));
  if(viewport.width<=850)assert(await page.locator('.fragment-tile').first().evaluate(el=>getComputedStyle(el).filter==='none'&&getComputedStyle(el).transitionDuration==='0s'),'Mobile cards retain animated filters or transitions');
  assert(focusStyle.opacity>.98&&focusStyle.background.endsWith('31)'), `Focused card lacks an opaque foreground at ${viewport.width}: ${JSON.stringify(focusStyle)}`);
  assert((await page.locator('#fragment-story-index').innerText()).startsWith('04'),'Vertical scroll did not traverse card collection');
  await page.screenshot({path:`artifacts/v6/fragments-${viewport.width}.png`});
  assert(await page.locator('.fragment-hint').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight-8),'Card controls extend below the viewport');
  assert(await page.locator('.fragment-sticky .eyebrow').evaluate(el=>el.getBoundingClientRect().top>=document.querySelector('.site-header').getBoundingClientRect().bottom),'Fragment heading scrolled out during playback');
  await scrollToScene('#atlas');
  await page.locator('.production-atlas').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  assert(await page.locator('[data-stat="reviewed"] [data-count]').innerText()==='1,284','Entrance count did not reach 1,284');
  await page.screenshot({path:`artifacts/v6/atlas-${viewport.width}.png`});
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(150);
  await scrollToScene('#atlas');
  await page.locator('.production-stats').scrollIntoViewIfNeeded();await page.waitForTimeout(100);
  const replayCount=await page.locator('[data-stat="reviewed"] [data-count]').innerText();
  assert(replayCount!=='1,284','Counter did not replay after reentry');
  await page.waitForTimeout(1550);
  assert(await page.locator('[data-stat="reviewed"] [data-count]').innerText()==='1,284','Replayed counter did not reach final value');
  await scrollToScene('#journal');
  await scrollToScene('#early-access');
  await page.evaluate(()=>scrollTo(0,0));
  await page.locator('#language-toggle').click();
  await page.waitForTimeout(250);
  assert(await page.locator('html').getAttribute('lang')==='en','English toggle failed');
  await checkLayout(viewport.width);
  await page.screenshot({path:`artifacts/v6/hero-en-${viewport.width}.png`});
  for(const selector of ['#experience-story','#fragment-journey']) {
    await scrollToScene(selector,.5);
    const content=selector==='#experience-story'?'.feature-chapter.current':'.fragment-hint';
    assert(await page.locator(content).evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight-8),`English scene exceeds viewport at ${viewport.width}`);
    await page.screenshot({path:`artifacts/v6/${selector==='#experience-story'?'experience':'fragments'}-en-${viewport.width}.png`});
  }
  await page.reload();
  assert(await page.locator('html').getAttribute('lang')==='en','Language preference did not persist');
  await page.locator('#language-toggle').click();
}
await page.setViewportSize({width:1440,height:1000});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
for(const selector of ['#detail-filter','#detail-info','#detail-quick','#detail-aspect'])await page.locator(selector).scrollIntoViewIfNeeded();
await page.locator('#details').screenshot({path:'artifacts/v6/details-desktop.png'});
const photography=await page.locator('img[src*="/photos/"]').evaluateAll(els=>els.filter(el=>!el.closest('.native-screen,.native-dialog')).map(el=>el.getAttribute('src')));
assert(photography.length===31&&new Set(photography).size===31,'Editorial photograph placements repeat');
await page.locator('#hide-archived').click();
assert(await page.locator('#hide-archived').getAttribute('aria-checked')==='true','Archive filter switch failed');
await page.locator('#hide-archived').click();
assert(await page.locator('#filter-count').innerText()==='3','Archive filter cannot restore photographs');
await page.locator('#photo-info-toggle').click();
assert(await page.locator('#detail-info').evaluate(el=>el.classList.contains('show-info')),'Photo readout interaction failed');
await page.locator('#quick-photo').hover();
assert(await page.locator('#quick-menu').isVisible(),'Hover album menu failed');
await page.locator('[data-quick-album="archive"]').click();
assert((await page.locator('#quick-toast').innerText()).includes('Mne Archive'),'Archive menu action failed');
await page.mouse.move(2,2);
await page.locator('#quick-photo').dispatchEvent('pointerdown',{pointerType:'touch',pointerId:9,button:0,clientX:50,clientY:50});
await page.waitForTimeout(500);
assert(await page.locator('#quick-menu').isVisible(),'Long press did not open album menu');
await page.locator('#quick-photo').dispatchEvent('pointerup',{pointerType:'touch',pointerId:9,button:0});
await page.keyboard.press('Escape');
assert(!await page.locator('#quick-menu').isVisible(),'Album menu Escape did not close');
await page.locator('[data-aspect-choice="9:16"]').click();
assert(await page.locator('.aspect-gallery').getAttribute('data-aspect')==='9:16','Photo aspect interaction failed');
await page.locator('#language-toggle').click();
assert((await page.locator('#quick-toast').innerText()).includes('Added'),'Demo status did not translate');
await page.locator('#language-toggle').click();
await page.evaluate(()=>scrollTo(0,0));
await page.locator('#wechat-toggle').hover();
assert(await page.locator('#wechat-popover').isVisible(),'WeChat hover failed');
await page.mouse.move(2,2);
assert(!await page.locator('#wechat-popover').isVisible(),'WeChat hover did not dismiss');
await page.locator('#wechat-toggle').click();
assert(await page.locator('#wechat-popover').isVisible(),'WeChat click failed');
const qrBox=await page.locator('#wechat-popover').boundingBox();
assert(qrBox.x>=0&&qrBox.x+qrBox.width<=page.viewportSize().width,'WeChat QR is clipped');
await page.keyboard.press('Escape');
assert(!await page.locator('#wechat-popover').isVisible(),'WeChat Escape failed');
const socialUrls=await page.locator('.hero-contacts>a').evaluateAll(els=>els.map(el=>el.getAttribute('href')));
assert(JSON.stringify(socialUrls)===JSON.stringify(['https://github.com/yifanwow','https://instagram.com/yifanovo_','https://steamcommunity.com/id/yifanovo/','https://www.xiaohongshu.com/user/profile/5b2eb172f7e8b940e52e00c2']),'Portfolio contact destinations do not match');
await scrollToScene('#fragment-journey',3/7);
await page.locator('#fragment-next').click();
assert((await page.locator('#fragment-story-index').innerText()).startsWith('05'),'Card next button failed');
await page.locator('#fragment-viewport').focus();
await page.keyboard.press('ArrowLeft');
assert((await page.locator('#fragment-story-index').innerText()).startsWith('04'),'Card keyboard navigation failed');
await page.keyboard.press('End');
assert((await page.locator('#fragment-story-index').innerText()).startsWith('08'),'Last card is inaccessible');
await page.locator('#language-toggle').click();
assert(await page.locator('#fragment-name').innerText()==='The world beyond the walls','Card description did not change language');
await page.locator('#language-toggle').click();
await scrollToScene('#atlas');
await page.locator('button[data-period="month"]').click();
await page.locator('[data-chart="bars"]').click();
assert(await page.locator('#memory-chart .bar').count()===58,'Monthly bar chart failed');
await page.locator('button[data-period="week"]').click();
assert(await page.locator('#memory-chart .bar').count()>=52,'Weekly grouping failed');
await page.locator('[data-chart="pie"]').click();
assert(await page.locator('#chart-legend>span').count()===12,'Long-range pie sector limit failed');
const pieTotal=await page.locator('#chart-legend b').evaluateAll(els=>els.reduce((sum,el)=>sum+Number(el.textContent),0));
assert(pieTotal===1284,'Pie chart did not preserve total');
await page.locator('button[data-period="year"]').click();
assert(await page.locator('#memory-chart .pie-total').textContent()==='1,284','Yearly total is inconsistent');
await page.locator('button[data-period="month"]').click();
await page.locator('[data-chart="trend"]').click();
assert(await page.locator('#memory-chart .trend-line').count()===1,'Trend chart failed');
await page.locator('#memory-chart').scrollIntoViewIfNeeded();
const chartBox=await page.locator('#memory-chart').boundingBox();
await page.mouse.click(chartBox.x+chartBox.width*.6,chartBox.y+chartBox.height*.6);
assert((await page.locator('#atlas-chart-hint').innerText()).includes('当前阶段'),'Chart inspection failed');
await page.locator('#timeline-expand').click();
assert(await page.locator('.timeline-entry:not([hidden])').count()===16,'Journal expansion failed');
await page.locator('#language-toggle').click();
assert(await page.locator('.timeline-entry:not([hidden])').count()===16,'Expanded journal state was lost on language switch');
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
assert(await page.locator('.fragment-tile').count()===8,'Reduced-motion collection is incomplete');
assert(await page.locator('.tile-story').first().isVisible(),'Reduced-motion card stories are hidden');
await page.evaluate(()=>localStorage.setItem('mne-site-language','zh'));
await page.setViewportSize({width:1440,height:1000});
await page.reload({waitUntil:'networkidle'});
for(const section of ['#story','#experience','#fragments','#atlas','#journal','#early-access'])await scrollToScene(section);
await page.evaluate(()=>scrollTo(0,0));
await page.screenshot({path:'artifacts/v6/full-static.png',fullPage:true});
assert(!errors.length&&!failures.length,JSON.stringify({errors,failures}));
await context.close();
// Actual touch events: horizontal card swipe and native vertical scrolling remain independent.
const touchContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'zh-CN'});
const touchPage=await touchContext.newPage();
await touchPage.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await touchPage.locator('#wechat-toggle').tap();
assert(await touchPage.locator('#wechat-popover').isVisible(),'Touch could not open WeChat QR');
await touchPage.locator('#wechat-toggle').tap();
assert(!await touchPage.locator('#wechat-popover').isVisible(),'Touch could not close WeChat QR');
await touchPage.locator('#fragment-journey').evaluate(el=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,Number(el.dataset.motionStart)+(Number(el.dataset.motionEnd)-Number(el.dataset.motionStart))*.5);});
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
console.log(JSON.stringify({status:'passed',mode:viewports.length?'full':'focused interactions',widths:viewports.length?viewports.map(v=>v.width):[390,1440],languages:['zh-CN','en'],checks:['layout and images','scroll demo forward and reverse','categorized card scroll navigation','touch swipe and native vertical scroll','keyboard card navigation','original card stories and translation','repeated entry counters','centered navigation and button labels','opaque focused cards and visible scene controls','left-aligned mobile typography and single-row accessible icons','SVG section marker and mobile compositing','week/month/year grouping','trend/bars/pie and conserved totals','chart inspection','journal and language persistence','dialog Escape','motion pause','reduced-motion static collection','no JavaScript or HTTP errors']},null,2));
