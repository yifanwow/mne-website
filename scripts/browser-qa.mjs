// Uses the desktop's bundled Playwright and a temporary test browser. Not needed to run the website.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import fs from 'node:fs/promises';
const browser = await chromium.launch({headless:true});
const errors = [];
const failures = [];
await fs.mkdir('artifacts', {recursive:true});
const context = await browser.newContext({locale:'zh-CN'});
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
for (const viewport of [{width:1440,height:1000},{width:1024,height:900},{width:768,height:1024},{width:390,height:844},{width:320,height:720}]) {
  await page.setViewportSize(viewport);
  await page.goto('http://127.0.0.1:4173/', {waitUntil:'networkidle'});
  await page.waitForTimeout(1700);
  await page.screenshot({path:`artifacts/hero-zh-${viewport.width}.png`});
  const overflow = await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth}));
  if (overflow.scroll > overflow.width) throw new Error(`Horizontal overflow at ${viewport.width}: ${overflow.scroll}`);
  const brokenImages = await page.locator('img').evaluateAll(images => images.filter(img => img.complete && img.naturalWidth === 0).map(img => img.src));
  if (brokenImages.length) throw new Error(`Broken images: ${brokenImages}`);
  for (const section of ['#story','#experience','#fragments','.atlas','#journal','#early-access']) { await page.locator(section).scrollIntoViewIfNeeded(); await page.waitForTimeout(1100); }
  await page.screenshot({path:`artifacts/full-zh-${viewport.width}.png`,fullPage:true});
  await page.evaluate(() => scrollTo(0,0));
  await page.locator('#language-toggle').click();
  await page.waitForTimeout(400);
  if (await page.locator('html').getAttribute('lang') !== 'en') throw new Error('English language toggle failed');
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(`English overflow at ${viewport.width}`);
  const clippedContent = await page.locator('.hero-copy, .story-content, .section-heading, .atlas-copy, .journal-heading, .footer-top').evaluateAll(elements => elements.filter(el => {
    const rect = el.getBoundingClientRect();
    return rect.left < 0 || rect.right > innerWidth + 1;
  }).map(el => el.className));
  if (clippedContent.length) throw new Error(`Clipped English content at ${viewport.width}: ${clippedContent.join(', ')}`);
  await page.screenshot({path:`artifacts/hero-en-${viewport.width}.png`});
  await page.reload();
  if (await page.locator('html').getAttribute('lang') !== 'en') throw new Error('Language did not persist');
  await page.locator('#language-toggle').click();
}
await page.locator('[data-density="3"]').click();
if (await page.locator('#demo-grid').getAttribute('data-columns') !== '3') throw new Error('Gallery density toggle failed');
await page.locator('[data-density="1"]').click();
if (await page.locator('[data-density="1"]').getAttribute('aria-pressed') !== 'true') throw new Error('Gallery accessibility state failed');
await page.locator('[data-chart="bars"]').click();
if (await page.locator('#memory-chart .bar').count() !== 12) throw new Error('Bar chart failed');
await page.locator('[data-chart="trend"]').click();
if (await page.locator('#memory-chart .trend-line').count() !== 1) throw new Error('Trend chart failed');
await page.locator('#timeline-expand').click();
if (await page.locator('.timeline-entry:not([hidden])').count() !== 9) throw new Error('Journal expansion failed');
await page.locator('#language-toggle').click();
if (await page.locator('.timeline-entry:not([hidden])').count() !== 9) throw new Error('Expansion lost during language switch');
await page.locator('#timeline-expand').click();
if (await page.locator('.timeline-entry:not([hidden])').count() !== 4) throw new Error('Journal collapse failed');
await page.locator('#credits-open').click();
if (!await page.locator('#credits-dialog').evaluate(el => el.open)) throw new Error('Credits dialog failed');
await page.keyboard.press('Escape');
if (await page.locator('#credits-dialog').evaluate(el => el.open)) throw new Error('Escape did not close dialog');
await page.emulateMedia({reducedMotion:'reduce'});
await page.reload();
if (await page.locator('.reveal').first().evaluate(el => getComputedStyle(el).opacity) !== '1') throw new Error('Reduce Motion content hidden');
await page.evaluate(() => { localStorage.setItem('mne-site-language','zh'); });
await page.setViewportSize({width:1440,height:1000});
await page.reload();
for (const section of ['#story','#experience','#fragments','.atlas','#journal','#early-access']) { await page.locator(section).scrollIntoViewIfNeeded(); }
await page.evaluate(() => scrollTo(0,0));
await page.screenshot({path:'artifacts/full-final.png',fullPage:true});
await page.screenshot({path:'artifacts/hero-final.png'});
if (errors.length || failures.length) throw new Error(JSON.stringify({errors,failures}));
console.log(JSON.stringify({status:'passed',widths:[1440,1024,768,390,320],languages:['zh-CN','en'],checks:['no horizontal overflow','all images load','no JS errors or HTTP failures','language persistence','gallery layouts','chart types','journal expansion and collapse','modal keyboard dismissal','reduced motion']},null,2));
await browser.close();
