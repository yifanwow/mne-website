import {uiIcon,albumSamples} from './native-ui.js?v=1.9.4';
import {statisticSVG} from './app-art.js?v=1.9.4';
import {shortcutPhotos as photos} from './photo-catalog.js?v=1.9.4';
// Adapted from PhotoPreviewActions, PhotoQuickMenuGeometry, and ProfileStatisticDetailContent.
export function setupProduct({text}) {
 const surface=document.querySelector('#shortcut-surface'),grid=document.querySelector('#native-waterfall'),open=document.querySelector('#shortcut-open');
 const preview=document.querySelector('#native-preview'),previewPhoto=document.querySelector('#native-preview-photo'),bubble=document.querySelector('#native-recent-bubble'),strip=document.querySelector('#native-action-strip');
 const singleOverlay=document.querySelector('#native-single-overlay'),menu=document.querySelector('#shortcut-menu'),status=document.querySelector('#shortcut-status');
 const picker=document.querySelector('#shortcut-album-picker'),stats=document.querySelector('#native-growth-stats'),statDialog=document.querySelector('#growth-dialog');
 const favorite=new Set(),pending=new Set(),seen=new Set(),likedRecords=new Set(),archiveRecords=new Set(),members=new Map(photos.map(p=>[p.id,new Set()]));
 const recent=[...albumSamples,{id:'archive',key:null}];let selected=0,mode='grid',removing=false,previewOpen=false,menuOpen=false,point={x:150,y:240},hold=0,held=false,start=null,notice=null,statKind='reviewed',hoverUntil=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const name=a=>a.key?text(a.key):'Mne Archive';const current=()=>photos[selected];const memberships=()=>members.get(current().id);
 function recordView(){seen.add(current().id);renderStats();}
 function close(){const wasOpen=previewOpen||menuOpen;previewOpen=false;menuOpen=false;removing=false;preview.hidden=true;singleOverlay.hidden=true;open.setAttribute('aria-expanded','false');if(wasOpen)hoverUntil=performance.now()+400;}
 function setMode(value){mode=value;surface.dataset.mode=mode;close();document.querySelectorAll('[data-shortcut-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.shortcutMode===mode)));if(mode==='single')recordView();renderPhoto();}
 function renderPhoto(){
  surface.dataset.preview=String(previewOpen);
  const p=current();surface.style.setProperty('--active-photo',`url('./assets/photos/${p.id}.webp')`);
  document.querySelector('#shortcut-resolution').textContent=`${p.width} × ${p.height}`;
  document.querySelector('#shortcut-membership').textContent=memberships().size?[...memberships()].map(id=>name(recent.find(a=>a.id===id))).join(' · '):text('shortcutEmptyAlbum');
  open.tabIndex=mode==='single'?0:-1;open.setAttribute('aria-hidden',String(mode!=='single'));open.setAttribute('aria-label',text('shortcutOpen'));
  document.querySelectorAll('[data-filmstrip-photo]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.filmstripPhoto)===selected)));
  if(previewOpen)renderPreview();if(menuOpen)renderSingleMenu();
 }
 function photoButton(p,i,film=false){
  const b=document.createElement('button');b.type='button';b.dataset[film?'filmstripPhoto':'shortcutPhoto']=String(i);b.setAttribute('aria-label',`${text('shortcutPhotoInfo')} ${i+1}`);b.innerHTML=`<img src="./assets/photos/${p.id}.webp" alt="" loading="lazy" draggable="false">`;
  if(film)b.addEventListener('click',()=>{selected=i;close();recordView();renderPhoto();});
  else {
   b.style.setProperty('--photo-ratio',p.width/p.height);
   b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&mode==='grid'&&!previewOpen&&performance.now()>hoverUntil){selected=i;showPreview();}});
   b.addEventListener('pointerdown',e=>beginPress(e,()=>{selected=i;showPreview();}));
   b.addEventListener('pointermove',movePress);for(const event of ['pointerup','pointercancel','pointerleave'])b.addEventListener(event,()=>clearTimeout(hold));
   b.addEventListener('contextmenu',e=>{e.preventDefault();selected=i;showPreview();});
   b.addEventListener('click',()=>{if(held){held=false;return;}selected=i;setMode('single');});
  }
  return b;
 }
 function layoutWaterfall(){
  const width=(grid.clientWidth-8)/3,heights=[0,0,0];
  [...grid.children].forEach((button,i)=>{const column=heights.indexOf(Math.min(...heights)),height=width*photos[i].height/photos[i].width;button.style.width=width+'px';button.style.height=height+'px';button.style.transform=`translate(${column*(width+4)}px,${heights[column]}px)`;heights[column]+=height+4;});
 }
 function beginPress(e,callback){if(e.button!==0)return;start={x:e.clientX,y:e.clientY};held=false;clearTimeout(hold);hold=setTimeout(()=>{held=true;callback();},400);}
 function movePress(e){if(start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>12)clearTimeout(hold);}
 function showPreview(){if(mode!=='grid')return;previewOpen=true;removing=false;preview.hidden=false;singleOverlay.hidden=true;recordView();renderPhoto();}
 function renderPreview(){
  const p=current(),h=surface.clientHeight,w=surface.clientWidth,scale=Math.min((w-36)/p.width,Math.min(520,h*.55)/p.height);
  const width=p.width*scale*1.05,height=p.height*scale*1.05;
  previewPhoto.style.cssText=`background-image:url('./assets/photos/${p.id}.webp');width:${width}px;height:${height}px;left:${(w-width)/2}px;top:${Math.max(20,h*.4-height/2)}px;`;
  bubble.replaceChildren();const targets=removing?recent.filter(a=>memberships().has(a.id)):recent;
  bubble.hidden=!targets.length;for(const a of targets){const b=document.createElement('button');b.type='button';b.dataset.previewAlbum=a.id;b.innerHTML=`${uiIcon(removing?'remove':'add')}<span></span>`;b.querySelector('span').textContent=name(a);b.addEventListener('click',()=>commit(removing?'remove':'album',a.id));bubble.append(b);}
  strip.replaceChildren();const actions=[['favorite',favorite.has(p.id)?'shortcutUnlike':'shortcutLike','heart'],['picker','shortcutAdd','add']];
  if(memberships().size)actions.push(['removeMode','shortcutRemove','remove']);actions.push(['trash',pending.has(p.id)?'shortcutRestore':'shortcutTrash',pending.has(p.id)?'restore':'trash']);
  for(const [action,key,icon] of actions){const b=document.createElement('button');b.type='button';b.dataset.previewAction=action;b.innerHTML=`${uiIcon(icon)}<span></span>`;b.querySelector('span').textContent=text(key);b.setAttribute('aria-pressed',String(action==='favorite'?favorite.has(p.id):action==='removeMode'&&removing));if(action==='trash'&&!pending.has(p.id))b.className='destructive';b.addEventListener('click',()=>act(action));strip.append(b);}
 }
 function showSingle(e){
  if(mode!=='single')return;const r=surface.getBoundingClientRect();point={x:typeof e?.clientX==='number'?e.clientX-r.left:r.width/2,y:typeof e?.clientY==='number'?e.clientY-r.top:r.height*.5};
  menuOpen=true;removing=false;singleOverlay.hidden=false;open.setAttribute('aria-expanded','true');renderSingleMenu();
 }
 function renderSingleMenu(){
  menu.replaceChildren();const rows=[['favorite',favorite.has(current().id)?'shortcutUnlike':'shortcutLike','heart'],['picker','shortcutAdd','add']];if(memberships().size)rows.push(['removeMode','shortcutRemove','remove']);
  for(const [action,key,icon] of rows){const b=document.createElement('button');b.type='button';b.dataset.singleAction=action;b.innerHTML=`${uiIcon(icon)}<span></span>`;b.querySelector('span').textContent=text(key);b.addEventListener('click',()=>act(action));menu.append(b);}
  const title=document.createElement('small');title.textContent=text(removing?'shortcutRemove':'shortcutRecent');menu.append(title);
  const targets=removing?recent.filter(a=>memberships().has(a.id)):recent;
  for(const a of targets){const b=document.createElement('button');b.type='button';b.dataset.singleAlbum=a.id;b.innerHTML=`${uiIcon(removing?'remove':'album')}<span></span>`;b.querySelector('span').textContent=name(a);b.addEventListener('click',()=>commit(removing?'remove':'album',a.id));menu.append(b);}
  // Same bounding and above/below preference as PhotoQuickMenuGeometry.frame.
  const w=surface.clientWidth,h=surface.clientHeight,width=Math.min(272,w-24),count=rows.length+targets.length,height=Math.min(count*44+(count>2?42:2),h-24);
  const x=Math.max(12,Math.min(point.x-width/2,w-width-12)),preferred=point.y+height+26<=h?point.y+14:point.y-height-14;
  menu.style.cssText=`width:${width}px;height:${height}px;left:${x}px;top:${Math.max(12,Math.min(preferred,h-height-12))}px;`;
 }
 function act(action){
  if(action==='removeMode'){removing=!removing;if(mode==='grid')renderPreview();else renderSingleMenu();return;}
  if(action==='picker'){openPicker();return;}
  if(action==='trash'){pending.has(current().id)?pending.delete(current().id):pending.add(current().id);notice=pending.has(current().id)?'shortcutTrashed':'shortcutRestored';renderPreview();}
  else commit('favorite');status.textContent=text(notice);
 }
 function commit(action,target){
  const id=current().id;
  if(action==='favorite'){if(favorite.has(id)){favorite.delete(id);notice='shortcutUnliked';}else{favorite.add(id);likedRecords.add(id);notice='shortcutLiked';}}
  else if(action==='album'){memberships().add(target);archiveRecords.add(`${id}:${target}`);notice='shortcutAdded';}
  else{memberships().delete(target);notice='shortcutRemoved';removing=false;}
  if(mode==='single')close();renderPhoto();renderStats();status.textContent=text(notice);
 }
 function openPicker(){
  document.querySelector('#shortcut-picker-list').replaceChildren(...recent.map(a=>{const b=document.createElement('button');b.type='button';b.innerHTML=`${uiIcon('album')}<span></span>`;b.querySelector('span').textContent=name(a);b.addEventListener('click',()=>{commit('album',a.id);picker.close();});return b;}));picker.showModal();
 }
 grid.replaceChildren(...photos.map((p,i)=>photoButton(p,i)));document.querySelector('#native-filmstrip').replaceChildren(...photos.map((p,i)=>photoButton(p,i,true)));
 open.addEventListener('pointerdown',e=>beginPress(e,()=>showSingle(e)));open.addEventListener('pointermove',movePress);for(const event of ['pointerup','pointercancel','pointerleave'])open.addEventListener(event,()=>clearTimeout(hold));
 open.addEventListener('contextmenu',e=>{e.preventDefault();showSingle(e);});open.addEventListener('click',e=>{if(held){held=false;return;}showSingle(e);});
 document.querySelector('#native-preview-close').addEventListener('click',close);document.querySelector('#native-menu-close').addEventListener('click',close);
 previewPhoto.addEventListener('click',()=>setMode('single'));
 document.querySelector('#shortcut-picker-close').addEventListener('click',()=>picker.close());
 document.querySelectorAll('[data-shortcut-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.shortcutMode)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});new ResizeObserver(()=>{layoutWaterfall();if(previewOpen)renderPreview();if(menuOpen)renderSingleMenu();}).observe(surface);
 const usage=document.querySelector('#storage-open'),storage=document.querySelector('#native-storage-content');usage.addEventListener('click',()=>{storage.hidden=!storage.hidden;usage.setAttribute('aria-expanded',String(!storage.hidden));});
 function counts(){return {reviewed:32768+seen.size,processed:16384+likedRecords.size+archiveRecords.size,space:'86.4'};}
 function renderStats(){
  stats.replaceChildren();const c=counts();
  for(const [kind,label,art,value] of [['reviewed','growthReviewed','reviewed',c.reviewed],['processed','growthOrganized','removed',c.processed],['space','growthReleased','space',c.space]]){
   const b=document.createElement('button');b.type='button';b.className='native-stat';b.dataset.growthKind=kind;b.innerHTML=`<span class="native-stat-art">${statisticSVG(art).replaceAll('stat-'+art,'growth-'+art)}</span><strong>${value.toLocaleString()}${kind==='space'?'<small> GB</small>':''}</strong><span></span>`;b.lastElementChild.textContent=text(label);b.setAttribute('aria-label',`${text('growthTap')}: ${text(label)}`);b.addEventListener('click',()=>{statKind=kind;renderStatDetail();statDialog.showModal();});stats.append(b);
  }
 }
 function renderStatDetail(){
  const container=document.querySelector('#growth-dialog-content'),c=counts(),kind=statKind,art=kind==='processed'?'removed':kind;
  container.innerHTML=`<div class="native-detail-art">${statisticSVG(art).replaceAll('stat-'+art,'detail-'+art)}</div><h3></h3><strong class="native-detail-value">${c[kind].toLocaleString()}${kind==='space'?' GB':''}</strong>`;
  container.querySelector('h3').textContent=text(kind==='reviewed'?'growthReviewed':kind==='processed'?'growthOrganized':'growthReleased');
  container.querySelector('h3').id='growth-dialog-title';statDialog.setAttribute('aria-labelledby','growth-dialog-title');
  const dl=document.createElement('dl');dl.className='native-stat-breakdown';
  const rows=kind==='processed'?[['growthDeleted',7860],['growthArchived',6460+archiveRecords.size],['growthLiked',2064+likedRecords.size]]:kind==='space'?[['growthKnown','77.76 GB'],['growthEstimated','8.64 GB']]:[['growthPhotos',27200+seen.size],['growthVideos',5568]];
  for(const [key,value] of rows){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=text(key);dd.textContent=value.toLocaleString();dl.append(dt,dd);}container.append(dl);
  if(kind==='reviewed'){
   const panels=document.createElement('div');panels.className='native-footprint-panels';
   panels.innerHTML='<article><small></small><strong></strong><p></p></article><article><small></small><strong></strong><p></p></article>';
   panels.children[0].querySelector('small').textContent=text('growthReadTime');panels.children[0].querySelector('strong').textContent=text('growthTime');panels.children[0].querySelector('p').textContent=text('growthFilm');
   panels.children[1].querySelector('small').textContent=text('growthReadRoom');panels.children[1].querySelector('strong').textContent='≈ '+((27200+seen.size)*.1016*.1524).toFixed(2)+' m²';panels.children[1].querySelector('p').textContent=text('growthArea');container.append(panels);
  }
  const p=document.createElement('p');p.className='native-model-note';p.hidden=true;p.textContent=text(kind==='reviewed'?'growthReviewedNote':kind==='processed'?'growthProcessedNote':'growthResourceNote');
  const info=document.createElement('button');info.type='button';info.className='native-detail-info';info.innerHTML=uiIcon('info')+'<span>info</span>';info.setAttribute('aria-expanded','false');let timer=0;
  info.addEventListener('click',()=>{clearTimeout(timer);p.hidden=!p.hidden;info.setAttribute('aria-expanded',String(!p.hidden));if(!p.hidden)timer=setTimeout(()=>{p.hidden=true;info.setAttribute('aria-expanded','false');},5000);});container.append(info,p);
 }
 document.querySelector('#growth-done').addEventListener('click',()=>statDialog.close());
 for(const dialog of [picker,statDialog])dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
 function refresh(){renderPhoto();renderStats();if(statDialog.open)renderStatDetail();document.querySelectorAll('.product-modes')[0]?.setAttribute('aria-label',text('shortcutModesLabel'));previewPhoto.setAttribute('aria-label',text('shortcutSingle'));document.querySelector('#native-preview-close').setAttribute('aria-label',text('shortcutClose'));document.querySelector('#native-menu-close').setAttribute('aria-label',text('shortcutClose'));document.querySelector('#shortcut-picker-close').setAttribute('aria-label',text('shortcutClose'));status.textContent=text(notice||'shortcutHint');}
 function presentShortcut(step) {
  // Deterministic presentation state: reversing the page scroll reverses the demonstration.
  // Scroll illustrations never create activity records or change the user's album edit demo.
  close();selected=0;mode='grid';surface.dataset.mode=mode;
  const id=current().id;favorite.delete(id);members.get(id).clear();
  if(step>=2)favorite.add(id);
  if(step>=3)members.get(id).add('main');
  if(step>=1&&step<=3){previewOpen=true;preview.hidden=false;}
  renderPhoto();
  const touch=surface.querySelector('.cinema-touch');touch.hidden=step===4;
  const target=step===3?bubble.querySelector('[data-preview-album="main"]'):step===2?strip.querySelector('[data-preview-action="favorite"]'):step===1?previewPhoto:step===0?grid.firstElementChild:null;
  const frame=surface.getBoundingClientRect(),targetFrame=target?.getBoundingClientRect();
  touch.style.left=(targetFrame?(targetFrame.x+targetFrame.width/2-frame.x)/frame.width*100:60)+'%';
  touch.style.top=(targetFrame?(targetFrame.y+targetFrame.height/2-frame.y)/frame.height*100:55)+'%';
 }
 refresh();return {refresh,presentShortcut};
}
