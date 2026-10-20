import {albumSamples,uiIcon} from './native-ui.js?v=1.9.3';
// AlbumPreviewLayout + AlbumEditingPhase from the App, expressed in DOM coordinates.
export function setupAlbums({text}) {
 const studio=document.querySelector('#album-studio'),list=document.querySelector('#album-list'),scroll=document.querySelector('#album-scroll');
 const edit=document.querySelector('#album-edit'),status=document.querySelector('#album-status'),menu=document.querySelector('#album-menu');
 const dialog=document.querySelector('#album-dialog'),body=document.querySelector('#album-dialog-body');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.body.append(menu);
 let albums=albumSamples.map(a=>({...a,photos:[...a.photos],pins:[],custom:''})),editing=false,busy=false,drag=null,active=null,picked=[],dialogMode='',autoFrame=0;
 function title(a){return a.custom||text(a.key);}
 function photos(a){return [...a.pins,...a.photos.filter(p=>!a.pins.includes(p))].slice(0,7);}
 function layout() {
  for(const row of list.querySelectorAll('.native-album-row')) {
   const available=Math.max(0,row.clientWidth-32-8),side=Math.min(66,Math.max(0,Math.min(available,Math.max(52,available*.22))));
   const step=Math.min(40,Math.max(0,(available-side)/6));
   row.style.setProperty('--cover-side',side+'px');row.style.setProperty('--cover-step',step+'px');
  }
 }
 function announce(key){status.textContent=text(key);}
 function makeRow(a){
  const row=document.createElement('article');row.className='native-album-row';row.dataset.album=a.id;if(a.id==='main')row.id='album-stack';
  row.innerHTML=`<div class="native-album-heading"><span class="native-album-symbol">${uiIcon('album')}</span><div class="native-album-meta"><strong></strong><small></small></div></div><div class="native-album-fan"></div><div class="native-album-controls"><button type="button" class="native-album-tool">${uiIcon('wrench')}</button><button type="button" class="native-album-handle" aria-keyshortcuts="ArrowUp ArrowDown">${uiIcon('grip')}</button></div>`;
  row.querySelector('strong').textContent=title(a);row.querySelector('small').textContent=`7 ${text('insightCount')}`;
  const fan=row.querySelector('.native-album-fan');
  photos(a).forEach((p,i)=>{const tile=document.createElement('span');tile.className='native-cover';tile.style.setProperty('--i',i);tile.style.zIndex=7-i;tile.innerHTML=`<img src="./assets/photos/${p}.webp" width="66" height="66" alt="" loading="lazy" draggable="false">`;fan.append(tile);});
  const tool=row.querySelector('.native-album-tool'),handle=row.querySelector('.native-album-handle');
  tool.setAttribute('aria-label',`${text('albumTools')}: ${title(a)}`);tool.disabled=!editing||busy;
  handle.setAttribute('aria-label',`${text('albumDrag')}: ${title(a)}`);handle.disabled=!editing||busy;
  tool.addEventListener('click',()=>showMenu(a,tool));
  handle.addEventListener('pointerdown',event=>beginDrag(event,row,handle));
  handle.addEventListener('pointermove',moveDrag);handle.addEventListener('pointerup',()=>endDrag(false));handle.addEventListener('pointercancel',()=>endDrag(true));
  handle.addEventListener('keydown',event=>{
   if(!editing||!['ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();
   const index=albums.indexOf(a),next=index+(event.key==='ArrowUp'?-1:1);if(next<0||next>=albums.length)return;
   const before=positions();albums.splice(index,1);albums.splice(next,0,a);reorderDOM();animateRows(before);handle.focus();announce('albumReordered');
  });
  let hold=0,press=null;
  row.addEventListener('pointerdown',event=>{if(editing||busy||event.target.closest('button')||event.button!==0)return;press={x:event.clientX,y:event.clientY};hold=setTimeout(toggleEdit,420);});
  row.addEventListener('pointermove',event=>{if(press&&Math.hypot(event.clientX-press.x,event.clientY-press.y)>12)clearTimeout(hold);});
  for(const type of ['pointerup','pointercancel','pointerleave'])row.addEventListener(type,()=>clearTimeout(hold));
  return row;
 }
 function positions(){return new Map([...list.querySelectorAll('.native-album-row:not(.dragging)')].map(row=>[row,row.getBoundingClientRect().top]));}
 function animateRows(before){if(reduced.matches)return;for(const [row,y] of before){const d=y-row.getBoundingClientRect().top;if(Math.abs(d)>.5)row.animate([{transform:`translateY(${d}px)`},{transform:'none'}],{duration:240,easing:'cubic-bezier(.2,.7,.2,1)'});}}
 function reorderDOM(){for(const a of albums)list.append(list.querySelector(`[data-album="${a.id}"]`));}
 function render(){list.replaceChildren(...albums.map(makeRow));layout();}
 function beginDrag(event,row,handle){
  if(!editing||busy||event.button!==0)return;event.preventDefault();menu.hidden=true;
  const box=row.getBoundingClientRect(),placeholder=document.createElement('div');placeholder.className='native-album-placeholder';placeholder.style.height=box.height+'px';
  const original=[...albums];row.before(placeholder);row.classList.add('dragging');
  row.style.cssText+=`;position:fixed;left:${box.left}px;top:${box.top}px;width:${box.width}px;height:${box.height}px;z-index:150;`;
  // A revealed section can establish a containing block. Lift outside it so the row follows viewport coordinates.
  document.body.append(row);
  drag={row,handle,placeholder,original,pointer:event.pointerId,startY:event.clientY,startTop:box.top,lastY:event.clientY,offset:event.clientY-box.top};
  handle.setPointerCapture(event.pointerId);handle.setAttribute('aria-pressed','true');autoFrame=requestAnimationFrame(autoScroll);
 }
 function moveDrag(event){if(!drag||event.pointerId!==drag.pointer)return;event.preventDefault();drag.lastY=event.clientY;drag.row.style.top=(event.clientY-drag.offset)+'px';placePlaceholder();}
 function placePlaceholder(){
  if(!drag)return;const before=positions(),others=[...list.querySelectorAll('.native-album-row:not(.dragging)')];
  const target=others.find(row=>drag.lastY<row.getBoundingClientRect().top+row.offsetHeight/2);
  const currentNext=drag.placeholder.nextElementSibling;
  if(target&&currentNext!==target)list.insertBefore(drag.placeholder,target);
  else if(!target&&drag.placeholder!==list.lastElementChild)list.append(drag.placeholder);
  animateRows(before);
 }
 function autoScroll(){
  if(!drag)return;const box=scroll.getBoundingClientRect();let speed=0;
  if(drag.lastY<box.top+35)speed=-6;else if(drag.lastY>box.bottom-35)speed=6;
  if(speed){scroll.scrollTop+=speed;placePlaceholder();}autoFrame=requestAnimationFrame(autoScroll);
 }
 function endDrag(cancel){
  if(!drag)return;cancelAnimationFrame(autoFrame);const {row,handle,placeholder,pointer,original}=drag,oldTop=row.getBoundingClientRect().top;
  placeholder.replaceWith(row);row.classList.remove('dragging');for(const p of ['position','left','top','width','height','z-index'])row.style.removeProperty(p);
  if(handle.hasPointerCapture(pointer))handle.releasePointerCapture(pointer);handle.removeAttribute('aria-pressed');drag=null;
  albums=cancel?original:[...list.querySelectorAll('.native-album-row')].map(el=>albums.find(a=>a.id===el.dataset.album));
  if(cancel)reorderDOM();layout();const delta=oldTop-row.getBoundingClientRect().top;
  if(!reduced.matches&&Math.abs(delta)>.5)row.animate([{transform:`translateY(${delta}px)`},{transform:'none'}],{duration:230,easing:'ease-out'});
  announce(cancel?'albumEditHint':'albumReordered');
 }
 function phase(value){studio.dataset.phase=value;}
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,reduced.matches?0:ms));
 async function toggleEdit(){
  if(busy)return;busy=true;menu.hidden=true;edit.disabled=true;
  if(!editing){editing=true;phase('gathering');await wait(340);phase('travel');await wait(420);phase('settling');await wait(280);phase('collapsing');await wait(820);phase('editing');}
  else {phase('expanding');await wait(820);phase('returning');await wait(340);phase('browsing');editing=false;}
  busy=false;edit.disabled=false;refresh();window.dispatchEvent(new Event('mne:layout'));
 }
 function showMenu(a,button){
  active=a;menu.replaceChildren();
  for(const [action,key,icon] of [['covers','albumChooseCovers','photo'],['rename','albumRename','wrench'],['pin','albumMoveTop','pin'],['delete','albumDelete','trash']]){
   const b=document.createElement('button');b.type='button';b.dataset.albumAction=action;b.innerHTML=`${uiIcon(icon)}<span></span>`;b.querySelector('span').textContent=text(key);if(action==='delete')b.className='destructive';
   b.addEventListener('click',()=>{menu.hidden=true;if(action==='pin'){const before=positions();albums=albums.filter(v=>v!==a);albums.unshift(a);reorderDOM();animateRows(before);announce('albumReordered');}else openDialog(action);});menu.append(b);
  }
  menu.hidden=false;const r=button.getBoundingClientRect(),width=Math.min(250,innerWidth-24);menu.style.width=width+'px';menu.style.left=Math.max(12,Math.min(r.right-width,innerWidth-width-12))+'px';menu.style.top=Math.max(12,Math.min(r.bottom+7,innerHeight-menu.offsetHeight-12))+'px';
 }
 function openDialog(mode){dialogMode=mode;picked=[...active.pins];renderDialog();dialog.showModal();}
 function renderDialog(){
  document.querySelector('#album-dialog-title').textContent=dialogMode==='covers'?text('albumChooseCovers'):dialogMode==='rename'?text('albumRename'):text('albumDelete');
  body.replaceChildren();
  if(dialogMode==='rename'){
   const input=document.createElement('input');input.id='album-name';input.value=title(active);input.maxLength=40;input.setAttribute('aria-label',text('albumNameLabel'));body.append(input);requestAnimationFrame(()=>input.select());
  } else if(dialogMode==='delete'){
   const p=document.createElement('p');p.textContent=text('albumDeleteNote');body.append(p);
  } else {
   const hint=document.createElement('p');hint.textContent=text('albumCoversNote');body.append(hint);
   const slots=document.createElement('div');slots.className='native-cover-slots';
   for(let i=0;i<7;i++){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`${text('albumUnpinCover')} ${i+1}`);if(picked[i]){b.innerHTML=`<img src="./assets/photos/${picked[i]}.webp" alt=""><small>${i+1}</small>`;b.addEventListener('click',()=>{picked.splice(i,1);renderDialog();});}else {b.innerHTML=uiIcon('plus');b.disabled=true;}slots.append(b);}body.append(slots);
   const count=document.createElement('p');count.textContent=`${text('albumPinnedCovers')} ${picked.length} / 7`;body.append(count);
   const grid=document.createElement('div');grid.className='native-cover-grid';
   for(const photo of active.photos){const b=document.createElement('button');b.type='button';b.dataset.cover=photo;b.setAttribute('aria-pressed',String(picked.includes(photo)));b.setAttribute('aria-label',`${text('albumChooseCover')} ${active.photos.indexOf(photo)+1}`);b.innerHTML=`<img src="./assets/photos/${photo}.webp" alt="">${picked.includes(photo)?`<small>${picked.indexOf(photo)+1}</small>`:''}`;b.addEventListener('click',()=>{const at=picked.indexOf(photo);if(at>=0)picked.splice(at,1);else if(picked.length<7)picked.push(photo);renderDialog();});grid.append(b);}body.append(grid);
   const reset=document.createElement('button');reset.type='button';reset.className='native-text-button';reset.textContent=text('albumAutomatic');reset.addEventListener('click',()=>{picked=[];renderDialog();});body.append(reset);
  }
 }
 document.querySelector('#album-dialog-save').addEventListener('click',()=>{
  if(dialogMode==='covers')active.pins=[...picked];
  else if(dialogMode==='rename'){const name=body.querySelector('input').value.trim();if(!name){body.querySelector('input').focus();return;}active.custom=name;}
  else albums=albums.filter(a=>a!==active);
  dialog.close();render();announce(dialogMode==='covers'?'albumCoverChanged':dialogMode==='delete'?'albumDeleted':'albumRenamed');window.dispatchEvent(new Event('mne:layout'));
 });
 document.querySelector('#album-dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 document.addEventListener('pointerdown',event=>{if(!menu.contains(event.target)&&!event.target.closest('.native-album-tool'))menu.hidden=true;});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.hidden=true;if(drag)endDrag(true);}});
 scroll.addEventListener('scroll',()=>menu.hidden=true,{passive:true});
 edit.addEventListener('click',toggleEdit);
 document.querySelector('#album-reset').addEventListener('click',()=>{if(busy)return;if(drag)endDrag(true);albums=albumSamples.map(a=>({...a,photos:[...a.photos],pins:[],custom:''}));menu.hidden=true;render();announce('albumBrowseHint');});
 function refresh(){
  document.querySelector('#album-title').textContent=text(editing?'albumEditHeading':'albumBrowseHeading');edit.textContent=text(editing?'albumDone':'albumEdit');edit.setAttribute('aria-pressed',String(editing));
  for(const a of albums){const row=list.querySelector(`[data-album="${a.id}"]`);if(!row)continue;row.querySelector('strong').textContent=title(a);row.querySelector('small').textContent=`7 ${text('insightCount')}`;row.querySelector('.native-album-tool').disabled=!editing||busy;row.querySelector('.native-album-handle').disabled=!editing||busy;row.querySelector('.native-album-tool').setAttribute('aria-label',`${text('albumTools')}: ${title(a)}`);row.querySelector('.native-album-handle').setAttribute('aria-label',`${text('albumDrag')}: ${title(a)}`);}
  announce(editing?'albumEditHint':'albumBrowseHint');if(dialog.open)renderDialog();
 }
 new ResizeObserver(layout).observe(scroll);render();refresh();return {refresh};
}
