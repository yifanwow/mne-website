import {uiIcon} from './native-ui.js?v=1.7.0';
const clamp=(value,min=0,max=1)=>Math.min(max,Math.max(min,value));

// Page scroll drives a few bounded presentation states. There is no wheel interception,
// nested gesture capture, photograph analysis, or deletion in these web illustrations.
export function setupStories({text,product,reducedMotion}) {
  const scenes=[...document.querySelectorAll('[data-scroll-story]')].map(element=>({element,kind:element.dataset.scrollStory,pin:element.querySelector('.story-pin'),step:-1,manual:0,start:0,end:1,progress:0}));
  let frame=0,measuredWidth=innerWidth,measuredHeight=innerHeight,measuring=false;
  document.querySelectorAll('[data-demo-icon]').forEach(el=>el.innerHTML=uiIcon(el.dataset.demoIcon));
  for(const scene of scenes) {
    const navigation=scene.element.querySelector('.story-steps');
    for(let i=0;i<5;i++){
      const button=document.createElement('button');button.type='button';button.dataset.storyStep=String(i);button.innerHTML=`<span>0${i+1}</span><i></i>`;
      button.addEventListener('click',()=>{
        if(reducedMotion.matches){scene.manual=i;paint(scene,i,i/4,true);}
        else scrollTo({top:scene.start+(i+.3)/5*(scene.end-scene.start),behavior:'smooth'});
      });navigation.append(button);
    }
  }
  const chart=document.querySelector('#farewell-chart');
  for(const year of [2022,2023,2024,2025,2026]){
    const column=document.createElement('div');column.className='farewell-bar-column';column.innerHTML=`<div><span class="farewell-bar-count"></span><i></i></div><small>${year}</small>`;chart.append(column);
  }
  function paintDuplicate(step,progress){
    const count=step===0?Math.round(584*clamp(progress*5)):584;
    document.querySelector('#scan-count').textContent=`${count.toLocaleString()} / 1,284 · ${text('duplicateSkipped')} 0`;
    document.querySelector('#scan-status').textContent=text(step===4?'duplicateSaved':'duplicateScanning');
    document.querySelector('#scan-action').textContent=text(step===4?'duplicateContinue':'duplicatePause');
    document.querySelector('#duplicate-selection-label').textContent=text(step>=3?'duplicateRecover':step===2?'duplicateSelectCount':'duplicateSelect');
    document.querySelector('#duplicate-story').style.setProperty('--scan',String(count/1284));
  }
  function paintFarewell(step){
    const values=step>=3?[0,0,0,0,36]:step>=2?[0,0,0,18,36]:[7,10,14,9,14];
    const total=values.reduce((a,b)=>a+b,0);
    document.querySelector('#farewell-recorded').textContent=String(total);
    document.querySelector('#farewell-range').textContent=step>=3?'2026':'2022 — 2026';
    document.querySelector('#farewell-basis-note').textContent=text(step>=2?'farewellDeleteNote':'farewellCaptureNote');
    chart.setAttribute('aria-label',text('farewellChartLabel'));
    [...chart.children].forEach((column,i)=>{
      column.querySelector('.farewell-bar-count').textContent=String(values[i]);
      column.querySelector('i').style.height=`${values[i]/36*100}px`;
      column.dataset.empty=String(values[i]===0);column.classList.toggle('outside',step>=3&&i<4);
    });
  }
  function paint(scene,step,progress,force=false){
    const changed=scene.step!==step||force;scene.progress=progress;
    scene.element.style.setProperty('--story-progress',String(progress));
    scene.element.style.setProperty('--step-progress',String(reducedMotion.matches?1:clamp(progress*5-step)));
    if(scene.kind==='duplicates')paintDuplicate(step,progress);
    if(!changed)return;
    scene.step=step;scene.element.dataset.step=String(step);
    scene.element.querySelector('.story-step-number').textContent=`0${step+1} / 05`;
    scene.element.querySelector('.story-step-title').textContent=text(`${scene.kind}Step${step}Title`);
    scene.element.querySelector('.story-step-body').textContent=text(`${scene.kind}Step${step}Body`);
    scene.element.querySelectorAll('[data-story-step]').forEach((button,i)=>{
      button.setAttribute('aria-label',text(`${scene.kind}Step${i}Title`));button.setAttribute('aria-current',String(i===step));
    });
    if(scene.kind==='shortcut')product.presentShortcut(step);
    if(scene.kind==='farewell')paintFarewell(step);
  }
  function update(){
    frame=0;if(document.hidden||document.body.classList.contains('motion-paused'))return;
    for(const scene of scenes){
      const progress=clamp((scrollY-scene.start)/(scene.end-scene.start));
      paint(scene,reducedMotion.matches?scene.manual:Math.min(4,Math.floor(progress*5)),progress);
    }
  }
  function requestUpdate(){if(!frame)frame=requestAnimationFrame(update);}
  function measure(){
    if(measuring)return;measuring=true;
    measuredWidth=innerWidth;measuredHeight=innerHeight;
    for(const scene of scenes){
      const visual=scene.element.querySelector('.story-visual'),phone=visual.querySelector('.cinema-phone');
      const height=Number(visual.dataset.baseHeight),mobile=innerWidth<=760;
      const copy=scene.element.querySelector('.story-copy'),top=parseFloat(getComputedStyle(scene.pin).top)||0;
      const caption=copy.querySelector('.story-step-body'),title=copy.querySelector('.story-step-title');let maxCaption=0,maxTitle=0;
      copy.querySelector('.story-caption').style.removeProperty('--caption-height');copy.querySelector('.story-caption').style.removeProperty('--caption-title-height');
      for(let i=0;i<5;i++){caption.textContent=text(`${scene.kind}Step${i}Body`);title.textContent=text(`${scene.kind}Step${i}Title`);maxCaption=Math.max(maxCaption,caption.scrollHeight);maxTitle=Math.max(maxTitle,title.scrollHeight);}
      copy.querySelector('.story-caption').style.setProperty('--caption-height',maxCaption+'px');copy.querySelector('.story-caption').style.setProperty('--caption-title-height',maxTitle+'px');
      // Always reserve the longest translated caption before sizing the phone.
      caption.textContent=text(`${scene.kind}Step${Math.max(0,scene.step)}Body`);title.textContent=text(`${scene.kind}Step${Math.max(0,scene.step)}Title`);
      const room=reducedMotion.matches?height:mobile?Math.max(180,innerHeight-top-copy.offsetHeight-48):Math.max(350,innerHeight-top-75);
      const scale=Math.min(1,visual.clientWidth/360,room/height);
      visual.style.height=`${height*scale}px`;phone.style.setProperty('--cinema-scale',String(scale));
      const sceneTop=scene.element.getBoundingClientRect().top+scrollY;
      const titleOffset=copy.querySelector('h3').getBoundingClientRect().top-scene.pin.getBoundingClientRect().top;
      scene.start=sceneTop+titleOffset-innerHeight*.68;
      scene.end=Math.max(scene.start+1,sceneTop+scene.element.offsetHeight-scene.pin.offsetHeight-top);
      scene.element.dataset.motionStart=String(scene.start);scene.element.dataset.motionEnd=String(scene.end);
    }
    measuring=false;update();
  }
  function refresh(){
    for(const scene of scenes){scene.element.querySelector('.story-steps').setAttribute('aria-label',text('storySelectStep'));paint(scene,Math.max(0,scene.step),scene.progress,true);}
    requestAnimationFrame(measure);
  }
  addEventListener('scroll',requestUpdate,{passive:true});
  addEventListener('resize',()=>{if(innerWidth<=850&&innerWidth===measuredWidth&&Math.abs(innerHeight-measuredHeight)<140)return;measure();},{passive:true});
  addEventListener('mne:layout',()=>requestAnimationFrame(measure));
  reducedMotion.addEventListener('change',measure);
  new MutationObserver(requestUpdate).observe(document.body,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',requestUpdate);
  for(const scene of scenes)new ResizeObserver(()=>requestAnimationFrame(measure)).observe(scene.element.querySelector('.story-copy'));
  document.fonts?.ready.then(measure);refresh();return {refresh};
}
