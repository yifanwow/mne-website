import {uiIcon} from './native-ui.js?v=2.4.1';

// Bounded, fictional groups illustrate JourneyGroupCard → JourneyGroupEditor → album draft.
// No library, coordinates, network lookup or real success records are accessed by this demo.
const journeys=[
 {name:'journeySea',region:'journeyRegionSea',range:'2025 / 10 / 03 — 10 / 05',photos:['cityglow','station','roof','window','night','littleworld','wire']},
 {name:'journeyWoods',region:'journeyRegionWoods',range:'2026 / 04 / 06 — 04 / 08',photos:['forest','garden','fern','meadow','flowerfield','waterfall','treeline']}
];
const palettes=[
 ['light','themeLight','#e8e7e3','#f5f2ed','#a35733','#6b6157','#29231f'],
 ['clearSky','themeClearSky','#dfeaf7','#f9fcff','#1f61ad','#4a5e78','#16283e'],
 ['wilderness','themeWilderness','#e5eddf','#fafcf7','#2e6b42','#4f614d','#223324'],
 ['mist','themeMist','#ece6f4','#fdfaff','#875cb8','#6b5e80','#33253f'],
 ['dark','themeDark','#0f1114','#1f2129','#c7d4f0','#9ea6b8','#eeeef2'],
 ['dreamPurple','themeDreamPurple','#140e21','#291f3b','#c2a6fa','#ab9ec2','#ece7f0'],
 ['sage','themeSage','#0b0e0f','#1a1f21','#abd4c7','#99a8a8','#e5eeeb'],
 ['oled','themeOled','#000000','#0e0e0e','#cafa5e','#a3a3a3','#f2f2f2']
];

export function setupEvolution({text,reducedMotion}){
 const root=document.querySelector('#journey-studio'),content=document.querySelector('#journey-content');
 const states=journeys.map(group=>({name:'',selected:new Set(group.photos),reviewed:false,created:false}));
 let step=0,active=0,manual=false,visible=false,played=false,timer=0,palette='dreamPurple',icon='dreamPurple';
 const state=()=>states[active],group=()=>journeys[active],groupName=()=>state().name||text(group().name);
 const image=(photo,extra='')=>`<img src="./assets/photos/${photo}.webp" alt="" loading="lazy" draggable="false" ${extra}>`;
 function stop(){clearInterval(timer);timer=0;}
 function autoplay(){stop();if(!visible||manual||played||reducedMotion.matches||document.hidden||document.body.classList.contains('motion-paused'))return;
  timer=setInterval(()=>{if(!visible||manual||reducedMotion.matches||document.hidden||document.body.classList.contains('motion-paused')){stop();return;}if(step>=2){played=true;stop();return;}setStep(step+1,false);if(step===2){played=true;stop();}},4200);
 }
 function setStep(value,byUser=true){if(byUser){manual=true;stop();}step=value;renderJourney();}
 function map(){return `<div class="journey-map"><svg viewBox="0 0 320 154" role="img" aria-label="${text('journeyMapLabel')}"><path class="map-land" d="M0 18 45 5l31 22 39-15 47 26 31-15 49 14 40-26 38 8v135H0Z"/><path class="map-road" d="m-10 110 95-8 32-35 80 20 63-49 70 23M47 0l37 102 52 55m57-134 4 64 85 68"/><path class="map-route" d="M61 103Q115 27 166 76T270 41"/><g class="map-stops"><circle cx="61" cy="103" r="5"/><circle cx="166" cy="76" r="5"/><circle cx="270" cy="41" r="5"/></g><g class="map-labels"><text x="61" y="129">${text('journeyOrigin')}</text><text x="166" y="102">${text('journeyAlong')}</text><text x="270" y="25">${text('journeyReturn')}</text></g></svg><small>${text('journeyMapLabel')}</small></div>`;}
 function renderJourney(){
  root.dataset.step=String(step);root.querySelectorAll('[data-journey-step]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.journeyStep)===step)));
  document.querySelector('#journey-caption').textContent=text('journeyCaption'+step);
  document.querySelector('#journey-nav-title').textContent=text(step===0?'journeyNative':step===1?'journeyEdit':'journeyCreate');
  content.replaceChildren();
  if(step===0){
   const intro=document.createElement('div');intro.className='journey-intro';intro.innerHTML=`<h3>${text('journeyNativeIntro')}</h3><p>${text('journeyNativeSub')}</p><small>${text('journeyPossible')}</small>`;content.append(intro);
   journeys.forEach((g,index)=>{
    const card=document.createElement('article');card.className='journey-native-card';
    card.innerHTML=`<div class="journey-card-top"><span>${uiIcon('album')}${text(g.region)}</span><small>7 ${text('journeyMemories')}</small></div><h4><span class="journey-card-name"></span><span aria-hidden="true">›</span></h4><p class="journey-dates">${g.range}</p><div class="journey-cover-fan">${g.photos.map((photo,i)=>`<span style="--i:${i}">${image(photo)}</span>`).join('')}</div><div class="journey-card-actions"><button type="button" data-open-journey="${index}">${uiIcon('wrench')}<span>${text('journeyEdit')}</span></button><button type="button" data-create-journey="${index}">${uiIcon('add')}<span>${text('journeyCreate')}</span></button></div>`;
    // Names originate in fixed copy or input.value; never interpolate a user's name as markup.
    card.querySelector('.journey-card-name').textContent=states[index].name||text(g.name);content.append(card);
   });
   content.querySelectorAll('[data-open-journey]').forEach(b=>b.addEventListener('click',()=>{active=Number(b.dataset.openJourney);setStep(1);}));
   content.querySelectorAll('[data-create-journey]').forEach(b=>b.addEventListener('click',()=>{active=Number(b.dataset.createJourney);setStep(2);}));
  }else if(step===1){
   if(!state().reviewed){
    const review=document.createElement('section');review.className='journey-review';review.innerHTML=`<strong>${text('journeyTentative')}</strong><p>${text('journeyTentativeNote')}</p>`;
    group().photos.slice(-2).forEach((photo,i)=>{const label=document.createElement('label');label.innerHTML=`${image(photo)}<span>${i===0?'2025 / 10 / 05':'2025 / 10 / 06'}</span><input type="checkbox" aria-label="${text('journeyTentative')} ${i+1}">`;const check=label.querySelector('input');check.checked=state().selected.has(photo);check.addEventListener('change',()=>{manual=true;stop();check.checked?state().selected.add(photo):state().selected.delete(photo);});review.append(label);});
    const finish=document.createElement('button');finish.type='button';finish.id='journey-review-finish';finish.className='journey-pill';finish.textContent=text('journeyFinish');finish.addEventListener('click',()=>{manual=true;stop();state().reviewed=true;renderJourney();});review.append(finish);content.append(review);
   }
   const detail=document.createElement('section');detail.className='journey-editor-details';detail.innerHTML=`<small>${text('journeyDetails')}</small><label>${text('journeyName')}<input id="journey-name" maxlength="24" aria-label="${text('journeyName')}"></label>${map()}<div class="journey-date-row"><span>${text('journeyRange')}</span><span>${group().range}</span></div>`;
   const input=detail.querySelector('input');input.value=groupName();input.addEventListener('input',()=>{manual=true;stop();state().name=input.value;});content.append(detail);
   const next=document.createElement('button');next.type='button';next.className='journey-pill';next.id='journey-to-album';next.textContent=text('journeyCreate');next.addEventListener('click',()=>setStep(2));content.append(next);
  }else{
   const draft=document.createElement('section');draft.className='journey-album-draft';
   if(state().created){draft.innerHTML=`<div class="journey-success">${uiIcon('check')}</div><h3>${text('journeyCreateDone')}</h3><strong class="journey-created-name"></strong><p>${text('journeyCreateDemo')}</p><div class="journey-album-mosaic">${[...state().selected].slice(0,4).map(p=>image(p)).join('')}</div><button type="button" class="journey-pill" id="journey-restart">${text('journeyRestart')}</button>`;draft.querySelector('.journey-created-name').textContent=groupName();draft.querySelector('#journey-restart').addEventListener('click',()=>{states[active]={name:'',selected:new Set(group().photos),reviewed:false,created:false};setStep(0);});}
   else{draft.innerHTML=`<label>${text('journeyName')}<input id="journey-album-name" maxlength="24" aria-label="${text('journeyName')}"></label><div class="journey-album-mosaic">${[...state().selected].slice(0,4).map(p=>image(p)).join('')}</div><strong class="journey-album-count">${state().selected.size} ${text('journeyMemories')}</strong><p>${text('journeyArchiveNote')}</p><button type="button" class="journey-pill" id="journey-confirm">${text('journeyCreate')}</button>`;const input=draft.querySelector('input');input.value=groupName();const confirm=draft.querySelector('#journey-confirm');input.addEventListener('input',()=>{manual=true;stop();state().name=input.value;confirm.disabled=!input.value.trim();});confirm.addEventListener('click',()=>{if(!input.value.trim())return;manual=true;stop();state().name=input.value.trim();state().created=true;renderJourney();});}
   content.append(draft);
  }
  content.scrollTop=0;
 }
 root.querySelectorAll('[data-journey-step]').forEach(b=>b.addEventListener('click',()=>setStep(Number(b.dataset.journeyStep))));
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;autoplay();},{threshold:.35}).observe(document.querySelector('.journey-phone'));
 document.addEventListener('visibilitychange',autoplay);new MutationObserver(autoplay).observe(document.body,{attributes:true,attributeFilter:['class']});reducedMotion.addEventListener('change',autoplay);

 function renderThemes(){
  const current=palettes.find(p=>p[0]===palette),preview=document.querySelector('#theme-preview');preview.dataset.theme=palette;
  for(const [name,value] of [['--demo-canvas',current[2]],['--demo-surface',current[3]],['--demo-accent',current[4]],['--demo-secondary',current[5]],['--demo-ink',current[6]]])preview.style.setProperty(name,value);
  document.querySelector('#theme-current-name').textContent=text(current[1]);const img=document.querySelector('#theme-current-icon');img.src=`./assets/themes/${icon}.png`;img.alt=text(palettes.find(p=>p[0]===icon)[1]);
  document.querySelector('#theme-options').replaceChildren();document.querySelector('#theme-icons').replaceChildren();
  palettes.forEach(([id,key,,,accent])=>{
   const b=document.createElement('button');b.type='button';b.dataset.themeChoice=id;b.setAttribute('aria-pressed',String(id===palette));b.innerHTML=`<i style="background:${accent}" aria-hidden="true"></i><span>${text(key)}</span>`;b.addEventListener('click',()=>{palette=id;renderThemes();document.querySelector(`[data-theme-choice="${id}"]`).focus({preventScroll:true});});document.querySelector('#theme-options').append(b);
   const i=document.createElement('button');i.type='button';i.dataset.iconChoice=id;i.setAttribute('aria-label',text(key));i.setAttribute('aria-pressed',String(id===icon));i.innerHTML=`<img src="./assets/themes/${id}.png" width="48" height="48" alt="" loading="lazy">`;i.title=text(key);i.addEventListener('click',()=>{icon=id;renderThemes();document.querySelector(`[data-icon-choice="${id}"]`).focus({preventScroll:true});});document.querySelector('#theme-icons').append(i);
  });
  document.querySelector('#theme-options').setAttribute('aria-label',text('themePaletteLabel'));document.querySelector('#theme-icons').setAttribute('aria-label',text('themeIconLabel'));
 }
 document.querySelectorAll('[data-evolution-icon]').forEach(el=>el.innerHTML=uiIcon(el.dataset.evolutionIcon));
 function refresh(){root.querySelector('.journey-steps').setAttribute('aria-label',text('journeyViewLabel'));renderJourney();renderThemes();}
 refresh();return {refresh};
}
