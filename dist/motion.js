import {retainedDates,retainedTotal,retainedPhotoCount} from './sample-memory.js?v=1.9.2';
import {uiIcon,albumSamples} from './native-ui.js?v=1.9.2';
import { memoryBoxSVG, logoLengths, statisticSVG } from './app-art.js?v=1.9.2';
import { fragments as collection } from './fragments-data.js?v=1.9.2';

const clamp = (v, min=0, max=1) => Math.min(max, Math.max(min,v));
const lerp = (a,b,t) => a+(b-a)*t;
const smooth = t => { t=clamp(t); return t*t*(3-2*t); };
const photography = ['waterfall','autumn','night','moon','fern','window','wire','amber','rainbow','cityglow','meadow','room'];

export function initMotion({getLanguage,text,reducedMotion}) {
  let paused = false;
  let sceneMetrics = {};
  let scrollIndex = 0, manualOffset = 0, displayIndex = 0, targetIndex = 0, activeIndex = -1;
  let drag = null, tilt = {x:0,y:0};
  let cardWidth=230, compact=innerWidth<=850, scrollDirty=false, fragmentsDirty=false, lastDemo=-1, lastFragments=-1;
  let measuredWidth=innerWidth,measuredHeight=innerHeight;
  const logo = document.querySelector('#logo-art');
  logo.innerHTML = memoryBoxSVG();
  const study=document.querySelector('#box-study-art');
  study.innerHTML = memoryBoxSVG('boxStudyInk');
  const replay = document.querySelector('#logo-replay');
  const studyReplay=document.querySelector('#box-study-replay');
  function drawLogo(art,button) {
    const paths=[...art.querySelectorAll('[data-logo-stroke]')];
    const total=logoLengths.reduce((a,b)=>a+b,0);
    let delay=0;
    paths.forEach((path,i)=>{
      path.getAnimations().forEach(a=>a.cancel());
      path.style.strokeDashoffset='0';
      if(reducedMotion.matches || paused || typeof path.animate!=='function') { path.style.strokeDashoffset='0'; return; }
      path.style.strokeDasharray='1';
      const duration=2100*logoLengths[i]/total;
      const animation=path.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{duration,delay,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'});
      animation.onfinish=()=>{path.style.strokeDashoffset='0';animation.cancel();};
      delay+=duration;
    });
    button.classList.remove('playing');
    if(!reducedMotion.matches && !paused) { requestAnimationFrame(()=>button.classList.add('playing')); }
  }
  const playLogo=()=>drawLogo(logo,replay);
  const playStudy=()=>drawLogo(study,studyReplay);
  replay.addEventListener('click',playLogo);
  studyReplay.addEventListener('click',playStudy);
  studyReplay.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')playStudy();});
  const studyObserver=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)) {playStudy();studyObserver.disconnect();}
  },{threshold:.45});
  studyObserver.observe(studyReplay);
  playLogo();

  // Scroll owns the demonstration. No wheel interception, scroll lock or required input.
  const demo=document.querySelector('#scroll-demo-gallery');
  const demoCards=photography.map((photo,i)=>{
    const el=document.createElement('div');
    el.className='scroll-demo-photo';
    el.innerHTML=`<img src="./assets/photos/${photo}.webp" alt="" loading="lazy"><span>${String(i+1).padStart(2,'0')}</span>`;
    demo.append(el);return el;
  });
  document.querySelectorAll('[data-experience-icon]').forEach(el=>el.innerHTML=uiIcon(el.dataset.experienceIcon));
  document.querySelector('.demo-filmstrip').innerHTML=photography.slice(0,9).map((photo,i)=>`<span class="${i===1?'active':''}"><img src="./assets/photos/${photo}.webp" alt="" loading="lazy"></span>`).join('');
  const demoPhone=document.querySelector('.demo-phone');
  const decision=document.querySelector('#demo-decision');
  const phaseLabels=[...document.querySelectorAll('.demo-phase-indicator>span')];
  const quickLayer=demoPhone.querySelector('.demo-quick-layer'),quickMenu=quickLayer.querySelector('.demo-quick-menu');
  let menuLanguage='';
  function renderDemoMenu() {
    if(menuLanguage===getLanguage())return;
    menuLanguage=getLanguage();
    quickMenu.innerHTML=`<div data-demo-action="favorite">${uiIcon('heart')}<span>${text('shortcutLike')}</span></div><div>${uiIcon('add')}<span>${text('shortcutAdd')}</span></div><small>${text('shortcutRecent')}</small>${[...albumSamples,{id:'archive',key:null}].map(a=>`<div data-demo-album="${a.id}">${uiIcon('album')}<span>${a.key?text(a.key):'Mne Archive'}</span>${a.id==='main'?uiIcon('check'):''}</div>`).join('')}`;
    quickLayer.querySelector('.demo-quick-feedback').innerHTML=uiIcon('check')+`<span>${text('shortcutAdded')} · ${text('albumName')}</span>`;
    quickLayer.querySelector('.demo-like-feedback').innerHTML=uiIcon('heart')+`<span>${text('shortcutLiked')}</span>`;
  }
  function demoLayout(i,columns) {
    const width=(244-(columns-1)*4)/columns;
    return {x:4+(i%columns)*(width+4),y:Math.floor(i/columns)*(width*1.777+4),w:width,h:width*1.777};
  }
  function paintDemo(progress) {
    const p=reducedMotion.matches ? 0 : progress;
    const zoom=smooth(p/.24), close=smooth((p-.28)/.12);
    const discard=smooth((p-.64)/.13), recover=smooth((p-.82)/.14);
    renderDemoMenu();
    // Long press → favorite → recent album → dismiss. Native scrolling is reversible.
    const action=p<.40?'browse':p<.46?'open':p<.49?'favorite':p<.53?'liked':p<.56?'reopen':p<.59?'archive':p<.64?'saved':p<.82?'set-aside':'restore';
    demoPhone.dataset.action=action;
    demoPhone.dataset.liked=String(p>=.46);
    const favoriteLabel=quickMenu.querySelector('[data-demo-action="favorite"] span'),favoriteText=text(p>=.46?'shortcutUnlike':'shortcutLike');
    if(favoriteLabel.textContent!==favoriteText)favoriteLabel.textContent=favoriteText;
    quickLayer.classList.toggle('menu-visible',['open','favorite','reopen','archive'].includes(action));
    quickLayer.classList.toggle('saved',p>=.59&&p<.64);
    demoPhone.querySelector('.demo-single-footer').classList.toggle('liked',p>=.46);
    demoPhone.querySelector('.demo-single-footer').classList.toggle('archived',p>=.56);
    demoCards.forEach((el,i)=>{
      const a=demoLayout(i,3), b=demoLayout(i,2);
      const x=lerp(lerp(a.x,b.x,zoom),4,close);
      const y=lerp(lerp(a.y,b.y,zoom),16,close)-(i===1?discard*(1-recover)*235:0);
      const width=lerp(lerp(a.w,b.w,zoom),244,close);
      const height=lerp(lerp(a.h,b.h,zoom),346,close);
      const opacity=i===1 ? 1-discard*(1-recover) : 1-close;
      el.style.width=`${width}px`;
      el.style.height=`${height}px`;
      el.style.transform=`translate3d(${x}px,${y}px,0)`;
      el.style.opacity=String(opacity);
      el.style.zIndex=i===1?'2':'1';
    });
    decision.style.opacity=String(discard*(1-recover));
    decision.style.transform=`translate(-50%,${(1-discard)*15}px)`;
    decision.classList.toggle('recovering',p>.80);
    const pending=discard*(1-recover)>.5,footer=demoPhone.querySelector('.demo-footer-pill');
    footer.textContent=text(pending?'demoRecover':'demoSingleHint');footer.classList.toggle('pending',pending);
    const phase=p<.28?0:p<.80?1:2;
    demoPhone.dataset.phase=String(phase);
    phaseLabels.forEach((el,i)=>el.classList.toggle('active',i===phase));
    document.querySelectorAll('.feature-chapter').forEach((el,i)=>{
      el.classList.toggle('current',i===phase);
      el.setAttribute('aria-hidden',String(!reducedMotion.matches&&i!==phase));
    });
  }

  // The three shelves follow the App: twelve ordinary, ten themed, and Fool + five mysteries.
  let fragments=collection.filter(card=>card.category==='themed');
  const viewport=document.querySelector('#fragment-viewport');
  function createFragmentCards() { return fragments.map((fragment,i)=>{
    const card=document.createElement('figure');
    card.className='fragment-tile';
    card.classList.toggle('veiled',!!fragment.mystery);
    card.innerHTML=`<img src="./assets/${fragment.asset}" width="500" height="700" loading="lazy" draggable="false" alt=""><figcaption><span class="tile-title"></span><p class="tile-story"></p></figcaption>`;
    card.dataset.index=i;viewport.append(card);return card;
  }); }
  let fragmentCards=createFragmentCards();
  const dots=document.querySelector('#fragment-nav-dots');
  dots.innerHTML=fragments.map(()=>'<i></i>').join('');
  const previous=document.querySelector('#fragment-prev');
  const next=document.querySelector('#fragment-next');
  document.querySelectorAll('[data-card-category]').forEach(button=>button.addEventListener('click',()=>{
    if(drag)finishDrag();
    fragments=collection.filter(card=>card.category===button.dataset.cardCategory);
    viewport.replaceChildren();fragmentCards=createFragmentCards();
    dots.innerHTML=fragments.map(()=>'<i></i>').join('');
    document.querySelectorAll('[data-card-category]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
    displayIndex=targetIndex=0;activeIndex=-1;lastFragments=-1;
    describeFragment(true);measure();selectFragment(0);
  }));
  function describeFragment(force=false) {
    const index=Math.round(clamp(displayIndex,0,fragments.length-1));
    if(index===activeIndex && !force) return;
    activeIndex=index;
    const story=document.querySelector('.fragment-story'),previousHeight=story.offsetHeight;
    const lang=getLanguage(), fragment=fragments[index];
    document.querySelector('#fragment-name').textContent=fragment.name[lang];
    document.querySelector('#fragment-story-text').textContent=fragment.story[lang];
    document.querySelector('#fragment-story-index').textContent=`${String(index+1).padStart(2,'0')} / ${String(fragments.length).padStart(2,'0')}`;
    [...dots.children].forEach((el,i)=>el.classList.toggle('active',i===index));
    previous.disabled=index===0;next.disabled=index===fragments.length-1;
    fragmentCards.forEach((el,i)=>{
      el.classList.toggle('active',i===index);
      el.setAttribute('aria-hidden',String(!reducedMotion.matches&&i!==index));
      el.querySelector('img').alt=fragments[i].name[lang];
      el.querySelector('.tile-title').textContent=fragments[i].name[lang];
      el.querySelector('.tile-story').textContent=fragments[i].story[lang];
    });
    // Longer translated names may wrap. Refit the artwork only when the caption height changes.
    if(story.offsetHeight!==previousHeight)requestAnimationFrame(measure);
  }
  function paintFragments() {
    const spacing=cardWidth*(innerWidth<600?.88:.94);
    fragmentCards.forEach((el,i)=>{
      const delta=i-displayIndex, distance=Math.abs(delta);
      const focus=Math.max(0,1-distance), depth=Math.min(distance,3);
      el.style.transform=`translateX(calc(-50% + ${delta*spacing}px)) translateY(${18+depth*23-focus*16}px) translateZ(${-depth*65}px) rotateY(${clamp(-delta*21,-48,48)+tilt.x*8*focus}deg) rotateZ(${delta*2.8}deg) rotateX(${-tilt.y*10*focus}deg) scale(${1-depth*.085})`;
      el.style.opacity=String(compact&&distance>2.8?0:clamp(1-distance*.38,.08,1));
      el.style.zIndex=String(100-Math.round(distance*10));
      if(!compact) {
        el.style.filter=`brightness(${1-depth*.16}) blur(${Math.max(0,distance-1)*.45}px) drop-shadow(0 0 ${8+focus*18}px #c2a6fa${focus>.5?'55':'15'})`;
        el.style.setProperty('--light-x',`${50+tilt.x*70}%`);
        el.style.setProperty('--light-y',`${50+tilt.y*70}%`);
      } else el.style.removeProperty('filter');
    });
    describeFragment();
  }
  function selectFragment(index) {
    viewport.classList.remove('scroll-driven');
    targetIndex=clamp(index,0,fragments.length-1);
    manualOffset=targetIndex-scrollIndex;
    displayIndex=targetIndex;
    paintFragments();
  }
  previous.addEventListener('click',()=>selectFragment(activeIndex-1));
  next.addEventListener('click',()=>selectFragment(activeIndex+1));
  viewport.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'||event.key==='ArrowLeft') {event.preventDefault();selectFragment(activeIndex+(event.key==='ArrowRight'?1:-1));}
    if(event.key==='Home'||event.key==='End') {event.preventDefault();selectFragment(event.key==='Home'?0:fragments.length-1);}
  });
  viewport.addEventListener('pointerdown',event=>{
    if(event.button!==0) return;
    drag={x:event.clientX,y:event.clientY,index:displayIndex,pointerId:event.pointerId};
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('dragging');
  });
  viewport.addEventListener('pointermove',event=>{
    if(!drag&&event.pointerType!=='mouse')return;
    if(!compact&&!reducedMotion.matches) {
      const rect=viewport.getBoundingClientRect();
      tilt={x:(event.clientX-rect.left)/rect.width-.5,y:(event.clientY-rect.top)/rect.height-.5};
    }
    if(drag) {
      const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
      if(Math.abs(dy)>Math.abs(dx)+15) {finishDrag();return;}
      displayIndex=clamp(drag.index-dx/(innerWidth<600?135:200),0,fragments.length-1);
      targetIndex=displayIndex;manualOffset=displayIndex-scrollIndex;
    }
    fragmentsDirty=true;scrollDirty=true;
    if(paused||reducedMotion.matches) {paintFragments();fragmentsDirty=false;}
  });
  function finishDrag() {
    if(!drag) return;
    if(viewport.hasPointerCapture(drag.pointerId))viewport.releasePointerCapture(drag.pointerId);
    drag=null;tilt={x:0,y:0};viewport.classList.remove('dragging');selectFragment(Math.round(displayIndex));
  }
  viewport.addEventListener('pointerup',finishDrag);
  viewport.addEventListener('pointercancel',finishDrag);
  viewport.addEventListener('pointerleave',()=>{if(!drag){tilt={x:0,y:0};paintFragments();}});

  // Exact celestial icon coordinates and readout slots from ProfileStatColumn.
  document.querySelectorAll('[data-stat]').forEach(el=>el.querySelector('.stat-art').innerHTML=statisticSVG(el.dataset.stat));
  const countElements=[...document.querySelectorAll('[data-count]')];
  let countStart=0,countFinished=false,counterVisible=false;
  function countValue(el,p) {
    const decimals=Number(el.dataset.decimals||0);
    el.textContent=(Number(el.dataset.count)*p).toLocaleString(getLanguage()==='zh'?'zh-CN':'en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
  }
  const counterObserver=new IntersectionObserver(entries=>{
    for(const entry of entries) {
      const visible=entry.isIntersecting&&entry.intersectionRatio>=.12;
      if(visible&&!counterVisible) {
        countStart=performance.now();countFinished=false;
        countElements.forEach(el=>countValue(el,reducedMotion.matches||paused?1:0));
        if(reducedMotion.matches||paused)countFinished=true;
      } else if(!visible&&counterVisible) {
        countStart=0;countFinished=true;countElements.forEach(el=>countValue(el,1));
      }
      counterVisible=visible;
    }
  },{threshold:[0,.12]});
  counterObserver.observe(document.querySelector('.app-profile-preview'));

  // Ten calendar years, through the fixed illustration date 2026-10-20.
  const captures=retainedDates;
  let period='year',chartType='bars',buckets=[],startYear=2017,endYear=2026;
  let selectedBucket=null;
  const chart=document.querySelector('#memory-chart');
  const group=document.querySelector('#chart-shape');
  const legend=document.querySelector('#chart-legend');
  function groupCaptures() {
    const grouped=new Map();
    for(const date of captures) {
      if(date.getUTCFullYear()<startYear||date.getUTCFullYear()>endYear)continue;
      let start;
      if(period==='year')start=new Date(Date.UTC(date.getUTCFullYear(),0,1));
      else if(period==='month')start=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),1));
      else {start=new Date(date);start.setUTCDate(date.getUTCDate()-((date.getUTCDay()+6)%7));}
      const key=start.getTime();grouped.set(key,(grouped.get(key)||0)+1);
    }
    buckets=[...grouped.entries()].sort((a,b)=>a[0]-b[0]).map(([date,count])=>({date:new Date(date),count}));
  }
  function bucketLabel(bucket,compact=false) {
    const d=bucket.date;
    if(period==='year')return String(d.getUTCFullYear());
    if(period==='week')return `${d.getUTCFullYear()}/${d.getUTCMonth()+1}/${d.getUTCDate()}`;
    return `${d.getUTCFullYear()}/${String(d.getUTCMonth()+1).padStart(2,'0')}`;
  }
  function renderChart() {
    groupCaptures();selectedBucket=null;
    const peak=buckets.reduce((a,b)=>b.count>a.count?b:a);
    const quiet=buckets.reduce((a,b)=>b.count<a.count?b:a);
    document.querySelector('#atlas-peak').textContent=`${peak.count.toLocaleString()} · ${bucketLabel(peak)}`;
    document.querySelector('#atlas-quiet').textContent=`${quiet.count.toLocaleString()} · ${bucketLabel(quiet)}`;
    document.querySelector('#atlas-chart-hint').textContent=text('atlasChartHint');
    legend.replaceChildren();
    chart.dataset.type=chartType;chart.dataset.period=period;
    chart.setAttribute('aria-label',getLanguage()==='zh'?'照片与视频分布示例，非真实用户数据':'Illustrative photo and video distribution, not real user data');
    const total=buckets.reduce((a,b)=>a+b.count,0);
    const photos=Math.round(total*retainedPhotoCount/retainedTotal),videos=total-photos;
    for(const [selector,value] of [['.production-atlas-heading [data-count]',total],['.media-counts>span:first-child [data-count]',photos],['.media-counts>span:last-child [data-count]',videos],['.resource-readout [data-count]',total/100]]) {
      const el=document.querySelector(selector);el.dataset.count=String(value);
      if(countFinished)countValue(el,1);
    }
    document.querySelector('#storage-photos').textContent=`${(photos/100).toFixed(2)} GB`;
    document.querySelector('#storage-videos').textContent=`${(videos/100).toFixed(2)} GB`;
    if(chartType==='pie') {
      const palette=['#c2a6fa','#a17ddb','#dec2fa','#8a73ba','#bab0e8','#daa4da','#9794d6','#6e6191'];
      // Match the app's cap of 12 sectors: 11 principal buckets and an explicit Other.
      let segments=buckets;
      if(buckets.length>12) {const principal=[...buckets].sort((a,b)=>b.count-a.count).slice(0,11);const dates=new Set(principal.map(b=>b.date.getTime()));segments=[...principal,{date:null,count:buckets.filter(b=>!dates.has(b.date.getTime())).reduce((a,b)=>a+b.count,0)}];}
      let angle=-Math.PI/2;
      group.innerHTML=segments.map((bucket,i)=>{
        const end=angle+bucket.count/total*Math.PI*2, large=end-angle>Math.PI?1:0;
        const x1=280+Math.cos(angle)*80,y1=111+Math.sin(angle)*80,x2=280+Math.cos(end-.008)*80,y2=111+Math.sin(end-.008)*80;
        const d=`M${x1},${y1}A80,80 0 ${large},1 ${x2},${y2}`;
        angle=end;
        if(segments.length===1)return `<circle cx="280" cy="111" r="80" stroke="${palette[0]}" stroke-width="30" fill="none"/>`;
        return `<path d="${d}" fill="none" stroke="${palette[i%palette.length]}" stroke-width="30" class="pie-segment"><title>${bucket.date?bucketLabel(bucket):getLanguage()==='zh'?'其他阶段':'Other periods'}: ${bucket.count}</title></path>`;
      }).join('')+`<text x="280" y="109" class="pie-total" text-anchor="middle">${total.toLocaleString()}</text><text x="280" y="128" class="axis-label" text-anchor="middle">${text('atlasMemories')}</text>`;
      segments.forEach((bucket,i)=>{const el=document.createElement('span');el.innerHTML=`<i style="background:${palette[i%palette.length]}"></i>${bucket.date?bucketLabel(bucket):getLanguage()==='zh'?'其他阶段':'Other periods'} <b>${bucket.count}</b>`;legend.append(el);});
      return;
    }
    const ceiling=Math.max(1,Math.ceil(peak.count/50)*50),left=31,right=535,top=28,bottom=202;
    const x=i=>buckets.length===1?(left+right)/2:left+i/(buckets.length-1)*(right-left);
    const y=v=>bottom-v/ceiling*(bottom-top);
    let content=Array.from({length:4},(_,i)=>{const value=ceiling*i/3;return `<path d="M${left},${y(value)}H${right}" class="chart-guide"/><text x="${left-8}" y="${y(value)+3}" class="axis-label" text-anchor="end">${Math.round(value)}</text>`;}).join('');
    const points=buckets.map((bucket,i)=>[x(i),y(bucket.count)]);
    if(chartType==='bars') {
      const width=Math.min(25,(right-left)/Math.max(1,buckets.length)*.55);
      content+=points.map(([px,py],i)=>`<rect class="bar" x="${px-width/2}" y="${py}" width="${width}" height="${bottom-py}" rx="3"><title>${bucketLabel(buckets[i])}: ${buckets[i].count}</title></rect>`).join('');
    } else {
      const line=points.map(([px,py],i)=>`${i?'L':'M'}${px},${py}`).join(' ');
      content+=`<path d="${line}L${x(points.length-1)},${bottom}L${x(0)},${bottom}Z" fill="url(#chartFill)" stroke="none"/><path class="trend-line" d="${line}"/>`;
    }
    const marks=new Set([buckets.indexOf(peak),buckets.indexOf(quiet)]);
    for(const i of marks) {const [px,py]=points[i];content+=`<circle cx="${px}" cy="${py}" r="3" fill="#c2a6fa" stroke="none"/><text x="${px}" y="${py-9}" class="point-label" text-anchor="middle">${buckets[i].count}</text>`;}
    const ticks=new Set(Array.from({length:Math.min(6,buckets.length)},(_,i)=>Math.round(i/Math.max(1,Math.min(6,buckets.length)-1)*(buckets.length-1))));
    for(const i of ticks)content+=`<text x="${x(i)}" y="223" class="axis-label" text-anchor="middle">${bucketLabel(buckets[i],buckets.length>12)}</text>`;
    group.innerHTML=content+`<g id="chart-selection"></g>`;
  }
  document.querySelectorAll('[data-chart]').forEach(button=>button.addEventListener('click',()=>{
    chartType=button.dataset.chart;
    document.querySelectorAll('[data-chart]').forEach(el=>{el.classList.toggle('active',el===button);el.setAttribute('aria-pressed',String(el===button));});renderChart();
  }));
  document.querySelectorAll('button[data-period]').forEach(button=>button.addEventListener('click',()=>{
    period=button.dataset.period;
    document.querySelectorAll('button[data-period]').forEach(el=>{el.classList.toggle('active',el===button);el.setAttribute('aria-pressed',String(el===button));});renderChart();
  }));
  const rangeStart=document.querySelector('#atlas-start'),rangeEnd=document.querySelector('#atlas-end');
  [rangeStart,rangeEnd].forEach(select=>select.addEventListener('change',()=>{
    startYear=Number(rangeStart.value);endYear=Number(rangeEnd.value);
    if(startYear>endYear) {if(select===rangeStart)endYear=startYear;else startYear=endYear;}
    rangeStart.value=String(startYear);rangeEnd.value=String(endYear);renderChart();
    // Controls are a deliberate action; show their current snapshot even before the entrance counter.
    document.querySelectorAll('.production-atlas [data-count]').forEach(el=>countValue(el,1));
  }));
  function inspectChart(event) {
    if(chartType==='pie')return;
    const rect=chart.getBoundingClientRect();
    const fraction=clamp(((event.clientX-rect.left)/rect.width*560-31)/504);
    const index=Math.round(fraction*(buckets.length-1));
    if(selectedBucket===index)return;selectedBucket=index;
    const bucket=buckets[index];
    document.querySelector('#atlas-chart-hint').textContent=`${text('atlasSelected')} · ${bucketLabel(bucket)} · ${bucket.count} ${text('atlasMemories')}`;
    const x=buckets.length===1?283:31+index/(buckets.length-1)*504;
    document.querySelector('#chart-selection').innerHTML=`<path d="M${x},25V202" stroke="#c2a6fa" stroke-width=".8" stroke-dasharray="3 4"/>`;
  }
  chart.addEventListener('pointermove',event=>{if(event.pointerType==='mouse')inspectChart(event);});
  chart.addEventListener('pointerdown',inspectChart);

  // One isolated, capped background canvas. Pause while hidden and respect system motion preferences.
  const canvas=document.querySelector('#memory-sky'),ctx=canvas.getContext('2d');
  let skyWidth=innerWidth,skyHeight=innerHeight,frame=0,lastSky=0;
  const stars=Array.from({length:148},(_,i)=>({x:((i*0.61803398875+.17)%1),y:((i*0.41421356237+.31)%1),r:i%13===0?1.4:.4+(i%4)*.19,phase:i*1.87,period:2.4+(i%8)*.57}));
  function sizeSky() {
    skyWidth=innerWidth;skyHeight=innerHeight;
    const dpr=Math.min(devicePixelRatio||1,1.5);
    canvas.width=Math.round(skyWidth*dpr);canvas.height=Math.round(skyHeight*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);
  }
  function drawSky(time=0) {
    if(!ctx)return;ctx.clearRect(0,0,skyWidth,skyHeight);
    const staticSky=reducedMotion.matches||paused;
    const shift=staticSky?0:Math.sin(window.scrollY/1800)*16;
    stars.forEach((star,i)=>{
      const pulse=staticSky?.55:.22+.65*Math.pow(.5+.5*Math.sin(time/1000/star.period*Math.PI*2+star.phase),2);
      const x=star.x*skyWidth+(staticSky?0:Math.sin(time/16000+star.phase)*3),y=star.y*skyHeight+shift;
      ctx.fillStyle=`rgba(206,186,236,${pulse})`;ctx.beginPath();ctx.arc(x,y,star.r,0,Math.PI*2);ctx.fill();
      if(i%13===0) {
        const glow=ctx.createRadialGradient(x,y,0,x,y,10);glow.addColorStop(0,`rgba(215,188,255,${pulse*.35})`);glow.addColorStop(1,'rgba(215,188,255,0)');ctx.fillStyle=glow;ctx.fillRect(x-10,y-10,20,20);
        const reach=3+pulse*4;ctx.strokeStyle=`rgba(228,211,255,${pulse*.7})`;ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(x-reach,y);ctx.lineTo(x+reach,y);ctx.moveTo(x,y-reach);ctx.lineTo(x,y+reach);ctx.stroke();
      }
    });
    if(!staticSky) {
      const cycle=(time%17000)/17000;
      if(cycle>.78&&cycle<.86) {
        const p=(cycle-.78)/.08,x=skyWidth*(.72-p*.28),y=skyHeight*(.13+p*.16);
        const tail=ctx.createLinearGradient(x,y,x+80,y-45);tail.addColorStop(0,`rgba(226,206,255,${Math.sin(p*Math.PI)*.65})`);tail.addColorStop(1,'rgba(226,206,255,0)');ctx.strokeStyle=tail;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+80,y-45);ctx.stroke();
      }
    }
    ctx.strokeStyle='rgba(189,155,233,.055)';ctx.lineWidth=.6;
    for(const [a,b] of [[3,16],[16,29],[29,42],[9,22],[22,35]]) {const s=stars[a],e=stars[b];ctx.beginPath();ctx.moveTo(s.x*skyWidth,s.y*skyHeight+shift);ctx.lineTo(e.x*skyWidth,e.y*skyHeight+shift);ctx.stroke();}
  }
  function measure() {
    measuredWidth=innerWidth;measuredHeight=innerHeight;
    compact=innerWidth<=850;lastDemo=-1;lastFragments=-1;
    const mobile=innerWidth<=600;
    const sequence=document.querySelector('.feature-sequence');
    sequence.style.removeProperty('height');
    if(mobile&&!reducedMotion.matches) {
      const captionHeight=Math.max(sequence.offsetHeight,...[...sequence.children].map(el=>el.scrollHeight));
      sequence.style.height=`${captionHeight}px`;
    }
    const demoPin=document.querySelector('.experience-pinned');
    const phoneRoom=innerHeight-(parseFloat(getComputedStyle(demoPin).top)||0)-demoPin.querySelector('.section-heading').offsetHeight-sequence.offsetHeight-document.querySelector('.demo-phase-indicator').offsetHeight-document.querySelector('.demo-note').offsetHeight-62;
    const demoScale=mobile?clamp(phoneRoom/557,.35,.85):clamp((innerHeight-320)/557,.7,1.48);
    document.querySelector('.experience-phone-wrap').style.setProperty('--demo-scale',demoScale);
    if(!reducedMotion.matches) {
      const pin=document.querySelector('.fragment-sticky');
      const otherHeight=['.fragment-heading','.fragment-categories','.fragment-story','.fragment-navigation','.fragment-hint'].reduce((total,selector)=>total+pin.querySelector(selector).offsetHeight,0);
      const budget=clamp(innerHeight-(parseFloat(getComputedStyle(pin).top)||0)-otherHeight-68,170,650);
      viewport.style.height=`${budget}px`;
      fragmentCards.forEach(card=>card.style.width=`${Math.min(mobile?280:400,(budget-46)/1.4)}px`);
    } else {
      viewport.style.removeProperty('height');fragmentCards.forEach(card=>card.style.removeProperty('width'));
    }
    cardWidth=fragmentCards[0].offsetWidth;
    for(const [key,selector,pinSelector,triggerSelector] of [
      ['experience','#experience-story','.experience-pinned','.section-heading h2'],
      ['fragments','#fragment-journey','.fragment-sticky','[data-i18n="fragmentEyebrow"]']
    ]) {
      const el=document.querySelector(selector),rect=el.getBoundingClientRect();
      const pin=el.querySelector(pinSelector),pinRect=pin.getBoundingClientRect();
      const trigger=pin.querySelector(triggerSelector),triggerRect=trigger.getBoundingClientRect();
      // Recover the heading's natural position even when its parent is already sticky.
      const naturalTop=rect.top+scrollY;
      const triggerTop=naturalTop+triggerRect.top-pinRect.top;
      const pinTop=parseFloat(getComputedStyle(pin).top)||0;
      const start=triggerTop-innerHeight*.68;
      const end=Math.max(start+1,naturalTop+rect.height-pin.offsetHeight-pinTop);
      sceneMetrics[key]={start,end};
      el.dataset.motionStart=String(start);el.dataset.motionEnd=String(end);
    }
    sizeSky();updateScroll();drawSky();
  }
  function updateScroll() {
    const exp=sceneMetrics.experience,frag=sceneMetrics.fragments;if(!exp||!frag)return;
    const demoProgress=clamp((scrollY-exp.start)/(exp.end-exp.start));
    if(!paused&&demoProgress!==lastDemo) {paintDemo(demoProgress);lastDemo=demoProgress;}
    if(!paused&&!reducedMotion.matches&&!drag) {
      scrollIndex=clamp((scrollY-frag.start)/(frag.end-frag.start))*(fragments.length-1);
      targetIndex=clamp(scrollIndex+manualOffset,0,fragments.length-1);
      displayIndex=targetIndex;
      if(displayIndex!==lastFragments)viewport.classList.add('scroll-driven');
    }
    if(displayIndex!==lastFragments||drag||fragmentsDirty) {paintFragments();lastFragments=displayIndex;fragmentsDirty=false;}
    document.querySelector('.ambient-background').style.setProperty('--sky-shift',`${Math.sin(scrollY/1600)*35}px`);
  }
  function tick(time) {
    if(document.hidden||paused||reducedMotion.matches){frame=0;return;}
    if(scrollDirty) {scrollDirty=false;updateScroll();}
    if(time-lastSky>1000/(compact?18:24)) {drawSky(time);lastSky=time;}
    if(countStart&&!countFinished) {const p=clamp((time-countStart)/1500);countElements.forEach(el=>countValue(el,1-Math.pow(1-p,3)));if(p===1)countFinished=true;}
    frame=requestAnimationFrame(tick);
  }
  function start() {if(!frame&&!document.hidden&&!paused&&!reducedMotion.matches)frame=requestAnimationFrame(tick);}
  const pauseButton=document.querySelector('#motion-toggle');
  pauseButton.addEventListener('click',()=>{
    paused=!paused;document.body.classList.toggle('motion-paused',paused);
    pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.querySelector('span').textContent=paused?'▷':'Ⅱ';
    pauseButton.setAttribute('aria-label',text(paused?'motionResume':'motionPause'));
    [logo,study].forEach(art=>art.querySelectorAll('path').forEach(el=>el.getAnimations().forEach(a=>paused?a.pause():a.play())));
    if(paused){cancelAnimationFrame(frame);frame=0;if(countStart){countElements.forEach(el=>countValue(el,1));countFinished=true;}drawSky();}else start();
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();});
  reducedMotion.addEventListener('change',()=>{
    playLogo();playStudy();countElements.forEach(el=>countValue(el,1));countFinished=true;
    if(reducedMotion.matches){cancelAnimationFrame(frame);frame=0;paintDemo(0);drawSky();}else start();
    measure();
  });
  window.addEventListener('resize',()=>{
    // Safari's moving address bar must not resize the cards and remap scroll progress mid-gesture.
    if(innerWidth<=850&&innerWidth===measuredWidth&&Math.abs(innerHeight-measuredHeight)<140) {sizeSky();return;}
    measure();
  },{passive:true});
  window.addEventListener('scroll',()=>{scrollDirty=true;},{passive:true});
  window.addEventListener('mne:layout',measure);
  function refresh() {
    // Translated text changes document height. Keep the reader's chosen card through that reflow.
    const heldIndex=displayIndex;
    viewport.setAttribute('aria-label',text('fragmentGalleryLabel'));
    previous.setAttribute('aria-label',text('fragmentsPrevious'));next.setAttribute('aria-label',text('fragmentsNext'));
    replay.setAttribute('aria-label',text('logoReplay'));
    studyReplay.setAttribute('aria-label',text('logoReplay'));
    pauseButton.setAttribute('aria-label',text(paused?'motionResume':'motionPause'));
    document.querySelector('.atlas-period').setAttribute('aria-label',text('atlasPeriod'));
    rangeStart.setAttribute('aria-label',text('atlasStart'));rangeEnd.setAttribute('aria-label',text('atlasEnd'));
    document.querySelector('.fragment-categories').setAttribute('aria-label',getLanguage()==='zh'?'成就分类':'Achievement categories');
    document.querySelector('.production-chart-controls').setAttribute('aria-label',getLanguage()==='zh'?'图表类型':'Chart type');
    describeFragment(true);renderChart();paintDemo(Math.max(0,lastDemo));measure();
    selectFragment(heldIndex);
    if(countFinished)countElements.forEach(el=>countValue(el,1));
  }
  paintFragments();paintDemo(0);renderChart();measure();start();
  return {refresh};
}
