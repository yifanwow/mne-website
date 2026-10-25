// Website-only checks. Does not build, test or interact with the iOS project.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin=process.env.PREVIEW_ORIGIN||'http://127.0.0.1:4173';
const output=process.env.QA_OUTPUT||'artifacts/privacy-2.2.1';
await fs.mkdir(output,{recursive:true});
const report={routes:[],browsers:[],screenshots:[],iosOperations:'none'};
const raw=await fs.readFile('dist/privacy/index.html','utf8');
assert.equal(raw,await fs.readFile('dist/privacy.html','utf8'),'Privacy aliases diverged');
assert(!raw.includes('{{CONTACT_EMAIL}}'),'Unconfirmed contact placeholder');
const ids=[...raw.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate policy IDs');
for(const route of ['/privacy','/privacy/','/privacy.html']){
  const response=await fetch(origin+route,{redirect:'manual'});
  assert.equal(response.status,200);
  const resolved=await fetch(origin+route);
  assert(resolved.headers.get('content-type').includes('text/html'));
  assert((await resolved.text()).includes('默认启用的使用统计'));
  report.routes.push({path:route,status:response.status,finalStatus:resolved.status});
}
for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]]){
  const browser=await engine.launch({headless:true});
  try {
    const context=await browser.newContext({locale:'zh-CN'});
    const page=await context.newPage(),errors=[],remoteRequests=[],edgePrefetchRefusals=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{
      if(response.status()<400)return;
      // Speed Brain deliberately returns 503 for uncached speculative prefetches.
      // Keep those visible in the report; actual navigation must still return 200.
      const purpose=response.request().headers()['sec-purpose'];
      const refusal=response.headers()['cf-speculation-refused'];
      if(response.status()===503&&refusal?.startsWith('prefetch refused:')&&response.headers().server==='cloudflare'&&response.url().startsWith(origin)){
        edgePrefetchRefusals.push({url:response.url(),status:503,reason:refusal,requestPurpose:purpose||null,resourceType:response.request().resourceType()});
      }else {
        errors.push(response.status()+' '+response.url());
        console.log(JSON.stringify({unexpectedResponse:{status:response.status(),url:response.url(),purpose:purpose||null,resourceType:response.request().resourceType(),edgeRefusal:refusal||null}}));
      }
    });
    page.on('request',request=>{if(!request.url().startsWith(origin))remoteRequests.push(request.url());});
    for(const [width,height] of [[1440,1080],[390,1000],[320,800]]){
      await page.setViewportSize({width,height});
      for(const language of ['zh','en']){
        assert([200,304].includes((await page.goto(origin+'/privacy/?lang='+language,{waitUntil:'networkidle'})).status()),'Policy navigation failed');
        await page.evaluate(()=>document.fonts.ready);
        const selected=page.locator('[data-policy-language="'+language+'"]');
        assert(await selected.isVisible(),name+' wrong language');
        assert.equal(await page.locator('article:visible').count(),1);
        assert.equal(await selected.locator('section').count(),12);
        assert(await page.title().then(title=>title.includes(language==='zh'?'隐私政策':'Privacy Policy')));
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+' overflow '+width+' '+language);
        assert(await selected.locator('section p').first().evaluate(element=>parseFloat(getComputedStyle(element).fontSize)>=16));
        assert(await selected.locator('.policy-heading').evaluate(element=>element.getBoundingClientRect().top<200),'Language adds blank space');
        assert(await page.evaluate(()=>document.fonts.check('400 17px "Inter"')&&document.fonts.check('400 17px "Noto Sans SC"')));
        for(const anchor of await selected.locator('a[href^="#"]').all()){
          const id=(await anchor.getAttribute('href')).slice(1);
          assert.equal(await page.locator('[id="'+id+'"]').count(),1,'Broken section anchor');
        }
        if(name==='Chromium'&&width!==320){
          const file=output+'/'+(width===1440?'desktop':'mobile')+'-'+language+'.png';
          await page.screenshot({path:file});
          report.screenshots.push(file);
        }
      }
    }
    await page.locator('[data-language="zh"]').click();
    assert.equal(await page.evaluate(()=>localStorage.getItem('mne-site-language')),'zh');
    await page.locator('[data-language="en"]').click();
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    await page.goto(origin+'/privacy/#zh-controls',{waitUntil:'networkidle'});
    assert(await page.locator('#privacy-zh').isVisible(),'Deep-link language is hidden');
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.locator('html').evaluate(element=>getComputedStyle(element).scrollBehavior),'auto');
    await page.goto(origin+'/',{waitUntil:'networkidle'});
    const footer=page.locator('footer a[href="/privacy"]');
    assert.equal(await footer.count(),1);
    assert((await footer.innerText()).includes('Privacy Policy'));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Homepage footer causes overflow');
    const navigation=page.waitForNavigation();
    await footer.click();
    const navigationResponse=await navigation;
    // WebKit may restore this already-visited document without a network response.
    if(navigationResponse)assert([200,304].includes(navigationResponse.status()),'Footer navigation failed');
    await page.waitForURL('**/privacy');
    assert(await page.locator('#privacy-en').isVisible(),'Homepage language preference not shared');

    const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
    for(const route of ['/privacy','/privacy/','/privacy.html']){
      const p=await nojs.newPage();
      assert([200,304].includes((await p.goto(origin+route,{waitUntil:'networkidle'})).status()),'No-JS navigation failed');
      assert.equal(await p.locator('article:visible').count(),2,'No-JS policy missing');
      assert.equal(await p.locator('section').count(),24);
      assert((await p.locator('#privacy-zh').innerText()).includes('yifanovo@gmail.com'));
      assert((await p.locator('#privacy-en').innerText()).includes('Usage statistics enabled by default'));
      assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No-JS overflow');
      await p.close();
    }
    const locked=await browser.newContext({locale:'en-US'});
    await locked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage disabled');}}));
    const blocked=await locked.newPage();
    await blocked.goto(origin+'/privacy.html',{waitUntil:'networkidle'});
    assert(await blocked.locator('#privacy-en').isVisible(),'Blocked storage breaks reading');
    assert.equal(errors.length,0,errors.join('\n'));
    assert.equal(remoteRequests.length,0,'Policy/homepage loaded external services: '+remoteRequests.join(', '));
    report.browsers.push({name,layouts:6,withoutJavaScript:'3 routes / 24 sections',language:'switch / reload / shared preference / deep link / blocked storage',fonts:'local Inter + Noto Sans SC',errors:0,edgePrefetchRefusals});
  } finally { await browser.close(); }
}
await fs.writeFile(output+'/verification.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
