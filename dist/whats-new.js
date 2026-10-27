import {globeLand} from './globe-land.js?v=2.4.0';

// Fixed demonstration only. Photography is never geolocated or classified by this page.
const places=[
 {key:'footprintSeattle',lat:47.6,lon:-122.3,visits:['2022 / 08','2024 / 10','2026 / 09'],days:44,photos:['harbor','cityglow','station','roof','window','wire']},
 {key:'footprintKyoto',lat:35,lon:135.8,visits:['2021 / 04','2023 / 11','2026 / 04'],days:204,photos:['blossom','garden','fern','meadow','treeline','flowerfield']},
 {key:'footprintHangzhou',lat:30.3,lon:120.2,visits:['2020 / 06','2022 / 06','2025 / 10'],days:382,photos:['waterfall','forest','autumn','sea','stones','lamplight']},
 {key:'footprintReykjavik',lat:64.1,lon:-21.9,visits:['2019 / 12','2024 / 01'],days:1000,photos:['night','moon','rainbow','evening','dawn','sunset']}
];
const themes=[
 ['cats','newCats','M5 10 4 4l6 3h4l6-3-1 6a7 7 0 1 1-14 0ZM8 13h.01M16 13h.01M10 17l2 1 2-1'],
 ['dogs','newDogs','M7 8 3 5l-1 8 5 2m10-7 4-3 1 8-5 2M7 7h10v10a5 5 0 0 1-10 0ZM9 12h.01M15 12h.01M10 16h4'],
 ['birds','newBirds','M4 15c0-6 8-3 9-8a4 4 0 0 1 7 3l2 2-3 1c-1 6-9 8-15 2Zm1 0-3 4m10-6-5 2',null],
 ['plants','newPlants','M20 3C7 2 2 8 5 16s17 6 15-13ZM4 21 15 10',['fern','meadow','garden']],
 ['food','newFood','M4 3v6a3 3 0 0 0 6 0V3M7 3v18M18 3c-4 3-4 8 0 9h2M20 3v18'],
 ['buildings','newBuildings','M3 21V8l8-4v17m0-11h10v11M6 10h2m-2 4h2m7-1h2m-2 4h2',['roof','station','window']],
 ['nightSky','newNight','M15 3A8 8 0 1 0 21 15 9 9 0 0 1 15 3ZM18 3v5m-2-3h4',['moon','night','evening']],
 ['sunset','newSunset','M3 18h18M6 15a6 6 0 0 1 12 0M12 2v4M3 8l3 2m15-2-3 2M3 21h18',['sunset','dawn','rainbow']],
 ['dolls','newDolls','M7 8a3 3 0 1 1 0-5l3 2h4l3-2a3 3 0 1 1 0 5l2 5a7 7 0 0 1-14 0ZM9 11h.01M15 11h.01M10 15l2 1 2-1'],
 ['sea','newSea','M2 8q3-4 6 0t6 0 6 0M2 13q3-4 6 0t6 0 6 0M2 18q3-4 6 0t6 0 6 0',['sea','harbor']],
 ['computers','newComputers','M3 4h18v12H3ZM12 16v5M8 21h8'],
 ['smallPets','newPets','M5 9a4 4 0 1 1 5-5h4a4 4 0 1 1 5 5c5 9-1 13-7 13S0 18 5 9ZM8 12v1m8-1v1M10 17l2 1 2-1m-2 1v2']
];
const svg=path=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
const photos=(ids)=>ids.map(id=>`<img src="./assets/photos/${id}.webp" alt="" loading="lazy" draggable="false">`).join('');
const rad=Math.PI/180;
const land=globeLand.map(rows=>rows.flatMap(([lat,columns,bits])=>{
 const dots=[];let index=0;
 for(const digit of bits)for(let shift=3;shift>=0&&index<columns;shift--,index++)if(parseInt(digit,16)>>shift&1){const lon=(-180+(index+.5)*360/columns)*rad;dots.push([Math.sin(lat*rad),Math.cos(lat*rad),Math.sin(lon),Math.cos(lon)]);}
 return dots;
}));

export function setupWhatsNew({text,reducedMotion}){
 const root=document.querySelector('#footprint-studio'),canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d'),stage=root.querySelector('.footprint-orb');
 const callout=root.querySelector('.footprint-callout'),placeList=root.querySelector('.footprint-places');
 let longitude=-122.3,latitude=25,zoom=1,selected=0,round=0,spin=true,visible=false,frame=0,last=0,size=0,drag=null;
 const hidden=new Set(),pins=[];
 function draw(){
  if(!ctx||!size)return;
  const w=size,cx=w/2,cy=w/2,r=w*.42*zoom,sl=Math.sin(latitude*rad),cl=Math.cos(latitude*rad),so=Math.sin(longitude*rad),co=Math.cos(longitude*rad);
  function project(a,b,c,d){const x=b*(c*co-d*so),z=b*(d*co+c*so);return [cx+r*x,cy-r*(a*cl-z*sl),a*sl+z*cl];}
  ctx.clearRect(0,0,w,w);ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();
  const fill=ctx.createRadialGradient(cx-r*.25,cy-r*.3,r*.1,cx,cy,r);fill.addColorStop(0,'#322442');fill.addColorStop(1,'#120d1f');ctx.fillStyle=fill;ctx.fillRect(0,0,w,w);
  for(const dot of land[zoom>1.5?1:0]){const [x,y,z]=project(...dot);if(z<0)continue;ctx.fillStyle=`rgba(198,170,237,${.18+z*.64})`;ctx.beginPath();ctx.arc(x,y,(zoom>1.5?.85:1.15)*Math.min(1.4,zoom),0,7);ctx.fill();}
  ctx.restore();ctx.strokeStyle='#c2a6fa35';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();
  pins.forEach((pin,i)=>{const p=places[i],[x,y,z]=project(Math.sin(p.lat*rad),Math.cos(p.lat*rad),Math.sin(p.lon*rad),Math.cos(p.lon*rad));pin.hidden=hidden.has(i)||z<.06||x<10||x>w-10||y<10||y>w-10;pin.style.left=x+'px';pin.style.top=y+'px';});
 }
 function allowed(){return visible&&spin&&!drag&&!document.hidden&&!reducedMotion.matches&&!document.body.classList.contains('motion-paused');}
 function tick(now){frame=0;if(!allowed()){last=0;return;}if(last&&now-last<50){frame=requestAnimationFrame(tick);return;}if(last)longitude+=(now-last)*.002;last=now;draw();frame=requestAnimationFrame(tick);}
 function syncMotion(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;if(allowed())frame=requestAnimationFrame(tick);root.querySelector('[data-globe-spin]').disabled=reducedMotion.matches;root.querySelector('[data-globe-spin]').textContent=text(reducedMotion.matches?'footprintStill':spin?'footprintPause':'footprintPlay');root.querySelector('[data-globe-spin]').setAttribute('aria-pressed',String(spin));}
 function stopSpin(){spin=false;syncMotion();}
 function choose(i){if(hidden.has(i))return;selected=i;round=0;longitude=places[i].lon;latitude=places[i].lat*.55;stopSpin();renderPlace();draw();}
 function renderPlace(){
  root.querySelector('.footprint-status').textContent=hidden.has(selected)?text('footprintRemoved'):'';
  root.querySelector('.footprint-count').textContent=`${places.length-hidden.size} ${text('footprintCount')}`;
  placeList.querySelectorAll('button').forEach((b,i)=>{b.textContent=text(places[i].key);b.disabled=hidden.has(i);b.setAttribute('aria-pressed',String(i===selected&&!hidden.has(i)));pins[i].setAttribute('aria-label',text(places[i].key));pins[i].setAttribute('aria-pressed',String(i===selected));});
  root.querySelector('[data-globe-restore]').hidden=!hidden.size;
  if(hidden.has(selected)){callout.hidden=true;return;}callout.hidden=false;
  const p=places[selected];root.querySelector('.footprint-place-name').textContent=text(p.key);
  root.querySelector('.footprint-months').textContent=p.visits.join(' · ');root.querySelector('.footprint-last-date').textContent=p.visits.at(-1);root.querySelector('.footprint-days').textContent=String(p.days);
  const fan=root.querySelector('.footprint-photo-fan');fan.innerHTML=photos(p.photos.slice(round*3,round*3+3));fan.setAttribute('aria-label',text('footprintShuffle'));
 }
 places.forEach((p,i)=>{const b=document.createElement('button');b.type='button';b.addEventListener('click',()=>choose(i));placeList.append(b);const pin=document.createElement('button');pin.type='button';pin.className='footprint-pin';pin.innerHTML=svg('M12 3v18M3 12h18M6 6l12 12M6 18 18 6');pin.addEventListener('click',()=>choose(i));stage.append(pin);pins.push(pin);});
 root.querySelector('[data-globe-shuffle]').addEventListener('click',()=>{round=1-round;renderPlace();const fan=root.querySelector('.footprint-photo-fan');if(!reducedMotion.matches&&!document.body.classList.contains('motion-paused'))fan.animate([{transform:'scale(.88)',opacity:.3},{transform:'none',opacity:1}],{duration:420,easing:'ease-out'});});
 root.querySelector('[data-globe-remove]').addEventListener('click',()=>{hidden.add(selected);callout.hidden=true;stopSpin();renderPlace();draw();root.querySelector('.footprint-status').textContent=text('footprintRemoved');root.querySelector('[data-globe-restore]').focus({preventScroll:true});});
 root.querySelector('[data-globe-restore]').addEventListener('click',()=>{hidden.clear();choose(selected);root.querySelector('.footprint-status').textContent='';placeList.children[selected].focus({preventScroll:true});});
 function setZoom(value){zoom=Math.max(1,Math.min(2.5,value));root.querySelector('[data-globe-in]').disabled=zoom>=2.5;root.querySelector('[data-globe-out]').disabled=zoom<=1;draw();}
 root.querySelector('[data-globe-in]').addEventListener('click',()=>{stopSpin();setZoom(zoom+.5);});root.querySelector('[data-globe-out]').addEventListener('click',()=>{stopSpin();setZoom(zoom-.5);});root.querySelector('[data-globe-spin]').addEventListener('click',()=>{spin=!spin;syncMotion();});
 // Touch keeps vertical page scrolling. Only a clear horizontal drag captures the globe.
 // 手机保留纵向页面滚动，只在明确横向拖动后接管地球旋转。
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,lon:longitude,lat:latitude,locked:e.pointerType==='mouse'};stopSpin();if(drag.locked)canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.locked&&Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)*1.3){drag.locked=true;canvas.setPointerCapture(e.pointerId);}if(!drag.locked)return;longitude=drag.lon-dx*.32;latitude=Math.max(-60,Math.min(60,drag.lat+dy*.22));draw();});
 const end=()=>{drag=null;syncMotion();};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);canvas.addEventListener('lostpointercapture',end);
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key))return;e.preventDefault();stopSpin();if(e.key==='+'||e.key==='-')setZoom(zoom+(e.key==='+'?.5:-.5));else{longitude+=e.key==='ArrowLeft'?-10:e.key==='ArrowRight'?10:0;latitude=Math.max(-60,Math.min(60,latitude+(e.key==='ArrowUp'?10:e.key==='ArrowDown'?-10:0)));draw();}});
 new ResizeObserver(()=>{size=stage.clientWidth;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(size*dpr);canvas.height=Math.round(size*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);draw();}).observe(stage);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncMotion();},{threshold:.15}).observe(stage);
 document.addEventListener('visibilitychange',syncMotion);new MutationObserver(syncMotion).observe(document.body,{attributes:true,attributeFilter:['class']});reducedMotion.addEventListener('change',syncMotion);

 const themeRoot=document.querySelector('#new-tools'),themeButtons=themeRoot.querySelector('.new-theme-buttons');let theme='sea';
 themes.forEach(([id,key,path],i)=>{const b=document.createElement('button');b.type='button';b.dataset.newTheme=id;b.innerHTML=svg(path)+'<span></span>';if(i===8){const label=document.createElement('p');label.dataset.i18n='themesNewMore';label.className='new-theme-divider';themeButtons.append(label);}b.addEventListener('click',()=>{theme=id;renderTheme();});themeButtons.append(b);});
 function renderTheme(){const item=themes.find(t=>t[0]===theme);themeRoot.querySelectorAll('[data-new-theme]').forEach(b=>{const t=themes.find(t=>t[0]===b.dataset.newTheme);b.querySelector('span').textContent=text(t[1]);b.setAttribute('aria-pressed',String(t[0]===theme));});themeRoot.querySelector('.new-theme-divider').textContent=text('themesNewMore');themeRoot.querySelector('.new-theme-name').textContent=text(item[1]);themeRoot.querySelector('.new-theme-preview').style.setProperty('--new-photo-count',String(item[3]?.length||3));themeRoot.querySelector('.new-theme-preview').innerHTML=item[3]?photos(item[3]):`<div class="new-theme-empty">${svg(item[2])}<p>${text('themesNewApp')}</p></div>`;}

 const selectionRoot=themeRoot.querySelector('.selection-demo'),selectedPhotos=new Set([0,2]),stagedPhotos=new Set(),selectionImages=['autumn','moon','lamplight','shop','room','stilllife'];let preview=false,previewIndex=1,holdTimer=0,holdTriggered=false;
 function renderSelection(){selectionRoot.dataset.preview=String(preview);selectionRoot.dataset.staged=String(stagedPhotos.size>0);selectionRoot.querySelectorAll('[data-select-photo]').forEach((b,i)=>{b.setAttribute('aria-pressed',String(selectedPhotos.has(i)));b.disabled=stagedPhotos.has(i);b.setAttribute('aria-label',text('selectionPhoto').replace('{n}',String(i+1)));});selectionRoot.querySelector('.selection-count').textContent=`${text('selectionCount')} ${selectedPhotos.size} ${text('selectionUnit')}`;selectionRoot.querySelector('.selection-overlay').hidden=!preview;selectionRoot.querySelector('[data-selection-reset]').hidden=!stagedPhotos.size;selectionRoot.querySelector('[data-selection-open]').disabled=stagedPhotos.has(1);selectionRoot.querySelector('.selection-status').textContent=text(stagedPhotos.size?'selectionStaged':'selectionBrowse');selectionRoot.querySelector('.selection-large img').src=`./assets/photos/${selectionImages[previewIndex]}.webp`;}
 selectionRoot.querySelectorAll('[data-select-photo]').forEach((b,i)=>{b.addEventListener('click',()=>{if(holdTriggered&&preview){holdTriggered=false;return;}selectedPhotos.has(i)?selectedPhotos.delete(i):selectedPhotos.add(i);renderSelection();});b.addEventListener('pointerdown',e=>{if(e.button!==0||stagedPhotos.has(i))return;holdTriggered=false;holdTimer=setTimeout(()=>{holdTriggered=true;previewIndex=i;preview=true;renderSelection();},450);});for(const event of ['pointerup','pointercancel','pointerleave'])b.addEventListener(event,()=>clearTimeout(holdTimer));b.addEventListener('pointermove',e=>{if(Math.abs(e.movementX)+Math.abs(e.movementY)>4)clearTimeout(holdTimer);});b.addEventListener('contextmenu',e=>e.preventDefault());});
 const open=()=>{previewIndex=1;preview=true;renderSelection();selectionRoot.querySelector('[data-selection-close]').focus({preventScroll:true});};
 selectionRoot.querySelector('[data-selection-open]').addEventListener('click',open);
 function closePreview(){preview=false;renderSelection();selectionRoot.querySelector('[data-selection-open]').focus({preventScroll:true});}
 function togglePreview(){selectedPhotos.has(previewIndex)?selectedPhotos.delete(previewIndex):selectedPhotos.add(previewIndex);closePreview();}
 function stagePreview(){selectedPhotos.delete(previewIndex);stagedPhotos.add(previewIndex);preview=false;renderSelection();selectionRoot.querySelector('[data-selection-reset]').focus({preventScroll:true});}
 selectionRoot.querySelector('[data-selection-close]').addEventListener('click',closePreview);selectionRoot.querySelector('[data-selection-toggle]').addEventListener('click',togglePreview);selectionRoot.querySelector('[data-selection-stage]').addEventListener('click',stagePreview);selectionRoot.querySelector('[data-selection-reset]').addEventListener('click',()=>{stagedPhotos.clear();selectedPhotos.clear();selectedPhotos.add(0);selectedPhotos.add(2);renderSelection();});
 let swipe=null;const swipeTarget=selectionRoot.querySelector('.selection-large');swipeTarget.addEventListener('pointerdown',e=>{swipe={id:e.pointerId,y:e.clientY};swipeTarget.setPointerCapture(e.pointerId);});swipeTarget.addEventListener('pointerup',e=>{if(!swipe||swipe.id!==e.pointerId)return;const dy=e.clientY-swipe.y;swipe=null;if(dy>45)togglePreview();else if(dy< -45)stagePreview();});swipeTarget.addEventListener('pointercancel',()=>swipe=null);selectionRoot.addEventListener('keydown',e=>{if(preview&&e.key==='Escape')closePreview();});
 const cards=document.querySelector('#new-fragments');let card=0;
 cards.querySelectorAll('[data-new-card]').forEach((b,i)=>{b.addEventListener('click',()=>{card=i;renderCards();});b.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||reducedMotion.matches||document.body.classList.contains('motion-paused'))return;const r=b.getBoundingClientRect();b.style.setProperty('--card-x',((e.clientX-r.left)/r.width-.5)*8+'deg');b.style.setProperty('--card-y',-((e.clientY-r.top)/r.height-.5)*8+'deg');});b.addEventListener('pointerleave',()=>{b.style.setProperty('--card-x','0deg');b.style.setProperty('--card-y','0deg');});});
 function renderCards(){cards.querySelectorAll('[data-new-card]').forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===card));b.setAttribute('aria-label',text('newCardsName'+i));b.querySelector('img').alt=text('newCardsName'+i);});cards.querySelector('.new-card-name').textContent=text('newCardsName'+card);cards.querySelector('.new-card-story').textContent=text('newCardsStory'+card);}
 function refresh(){renderPlace();renderTheme();renderSelection();renderCards();canvas.setAttribute('aria-label',text('footprintCanvas'));placeList.setAttribute('aria-label',text('footprintPlaces'));themeButtons.setAttribute('aria-label',text('themesNewLabel'));root.querySelector('[data-globe-in]').setAttribute('aria-label',text('footprintZoomIn'));root.querySelector('[data-globe-out]').setAttribute('aria-label',text('footprintZoomOut'));syncMotion();draw();}
 setZoom(1);refresh();return {refresh};
}
