// Product illustrations use fixed data and transient page state only.
export function setupProduct({text}) {
  const studio=document.querySelector('#shortcut-studio'),surface=document.querySelector('#shortcut-surface');
  const menu=document.querySelector('#shortcut-menu'),open=document.querySelector('#shortcut-open');
  const status=document.querySelector('#shortcut-status'),activity=document.querySelector('#growth-events');
  const photos=['shop','harbor','lamplight'];
  const favorites=new Set(),members=new Set(),reviewed=new Set(),countedLikes=new Set(),countedArchives=new Set();
  let selected=0,mode='grid',menuOpen=false,hold=0,press=null,held=false,events=[],notice=null,hoverSuppressedUntil=0;
  let scenario='central',scope='all';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const scenarios={low:{photo:.2048,video:.078,index:.018272},central:{photo:1.024,video:.39,index:.05768},high:{photo:2.048,video:1.04,index:.210176}};
  const format=value=>value.toFixed(2);
  function setMenu(value) {
    // Hiding an overlay emits pointerenter on the thumbnail underneath; it is not new hover intent.
    if(!value&&menuOpen)hoverSuppressedUntil=performance.now()+500;
    menuOpen=value;menu.hidden=!value;open.setAttribute('aria-expanded',String(value));studio.classList.toggle('menu-open',value);
  }
  function renderEvents() {
    document.querySelector('#growth-reviewed').textContent=(1284+reviewed.size).toLocaleString();
    document.querySelector('#growth-organized').textContent=(328+countedLikes.size+countedArchives.size).toLocaleString();
    activity.replaceChildren(...events.slice(0,3).map(event=>{
      const row=document.createElement('li'),mark=document.createElement('i'),body=document.createElement('div'),label=document.createElement('strong'),date=document.createElement('small');
      mark.textContent=event.kind==='growthLike'?'♡':event.kind==='growthArchive'?'+':'↗';
      label.textContent=text(event.kind);date.textContent=text('growthNow');body.append(label,date);row.append(mark,body);return row;
    }));
    if(!events.length) {
      const row=document.createElement('li'),mark=document.createElement('i'),body=document.createElement('div'),label=document.createElement('strong'),date=document.createElement('small');
      mark.textContent='↗';label.textContent=text('growthEarlier');date.textContent=text('growthSeed');body.append(label,date);row.append(mark,body);activity.append(row);
    }
  }
  function record(kind) {events.unshift({kind});if(events.length>12)events.length=12;renderEvents();}
  function describePhoto() {
    const id=photos[selected],liked=favorites.has(id),member=members.has(id);
    surface.style.setProperty('--active-photo',`url('./assets/photos/${id}.webp')`);
    surface.dataset.selected=String(selected);
    document.querySelector('#shortcut-resolution').textContent=selected===1?'4027 × 2265':'2268 × 4032';
    open.tabIndex=mode==='single'?0:-1;open.setAttribute('aria-hidden',String(mode!=='single'));
    document.querySelectorAll('[data-shortcut-photo]').forEach(button=>{
      button.setAttribute('aria-pressed',String(Number(button.dataset.shortcutPhoto)===selected));
      button.setAttribute('aria-label',`${text('shortcutOpen')} ${Number(button.dataset.shortcutPhoto)+1}`);
    });
    const favorite=document.querySelector('[data-shortcut-action="favorite"]');
    favorite.querySelector('span:last-child').textContent=text(liked?'shortcutUnlike':'shortcutLike');favorite.setAttribute('aria-pressed',String(liked));
    document.querySelector('[data-shortcut-action="remove"]').hidden=!member;
    document.querySelector('#shortcut-membership').textContent=text(member?'shortcutMember':'shortcutEmptyAlbum');
    document.querySelector('#shortcut-favorite-mark').hidden=!liked;
  }
  function seePhoto() {if(!reviewed.has(photos[selected])){reviewed.add(photos[selected]);record('growthReview');}}
  document.querySelectorAll('[data-shortcut-mode]').forEach(button=>button.addEventListener('click',()=>{
    mode=button.dataset.shortcutMode;surface.dataset.mode=mode;setMenu(false);
    document.querySelectorAll('[data-shortcut-mode]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
    if(mode==='single')seePhoto();
    describePhoto();
  }));
  document.querySelectorAll('[data-shortcut-photo]').forEach(button=>{
    button.addEventListener('click',()=>{selected=Number(button.dataset.shortcutPhoto);describePhoto();seePhoto();setMenu(true);});
    button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&mode==='grid'&&!menuOpen&&performance.now()>hoverSuppressedUntil){selected=Number(button.dataset.shortcutPhoto);describePhoto();setMenu(true);}});
    button.addEventListener('contextmenu',event=>{event.preventDefault();selected=Number(button.dataset.shortcutPhoto);describePhoto();seePhoto();setMenu(true);});
    let timer=0,start=null;
    button.addEventListener('pointerdown',event=>{if(event.button!==0)return;start={x:event.clientX,y:event.clientY};timer=setTimeout(()=>{selected=Number(button.dataset.shortcutPhoto);describePhoto();seePhoto();setMenu(true);},420);});
    button.addEventListener('pointermove',event=>{if(start&&Math.hypot(event.clientX-start.x,event.clientY-start.y)>10)clearTimeout(timer);});
    for(const event of ['pointerup','pointercancel','pointerleave'])button.addEventListener(event,()=>clearTimeout(timer));
  });
  open.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')setMenu(true);});
  open.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;press={x:event.clientX,y:event.clientY};held=false;
    hold=setTimeout(()=>{held=true;seePhoto();setMenu(true);},420);
  });
  open.addEventListener('pointermove',event=>{if(press&&Math.hypot(event.clientX-press.x,event.clientY-press.y)>10)clearTimeout(hold);});
  for(const name of ['pointerup','pointercancel','pointerleave'])open.addEventListener(name,()=>clearTimeout(hold));
  open.addEventListener('click',()=>{if(held){held=false;return;}seePhoto();setMenu(true);});
  open.addEventListener('contextmenu',event=>{event.preventDefault();seePhoto();setMenu(true);});
  document.querySelector('#shortcut-close').addEventListener('click',()=>{setMenu(false);open.focus();});
  document.addEventListener('pointerdown',event=>{if(!surface.contains(event.target))setMenu(false);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuOpen){setMenu(false);open.focus();}});
  document.querySelectorAll('[data-shortcut-action]').forEach(button=>button.addEventListener('click',()=>{
    const id=photos[selected];
    if(button.dataset.shortcutAction==='favorite') {
      if(favorites.has(id)){favorites.delete(id);notice='shortcutUnliked';record('growthUnlike');}
      else {favorites.add(id);countedLikes.add(id);notice='shortcutLiked';record('growthLike');}
    } else if(button.dataset.shortcutAction==='remove') {
      members.delete(id);notice='shortcutRemoved';record('growthRemove');
    } else {
      if(members.has(id))notice='shortcutAlready';
      else {members.add(id);countedArchives.add(id);notice='shortcutAdded';record('growthArchive');}
    }
    setMenu(false);describePhoto();status.textContent=text(notice);
    if(!reduced.matches)status.animate([{opacity:.3,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:350});
  }));

  function renderStorage() {
    const estimate=scenarios[scenario],photo=10.24+estimate.photo,video=2.6+estimate.video,total=photo+video+estimate.index;
    const values={all:total,photos:photo,videos:video,index:estimate.index};
    const value=document.querySelector('#insight-total');value.textContent=format(values[scope]);
    document.querySelector('#insight-total-label').textContent=text(scope==='photos'?'insightPhotos':scope==='videos'?'insightVideos':scope==='index'?'insightIndex':'insightAll');
    document.querySelector('#insight-photo-total').textContent=format(photo)+' GB';
    document.querySelector('#insight-video-total').textContent=format(video)+' GB';
    document.querySelector('#insight-photo-cache').textContent=format(estimate.photo)+' GB';
    document.querySelector('#insight-video-cache').textContent=format(estimate.video)+' GB';
    document.querySelector('#insight-index-total').textContent=format(estimate.index)+' GB';
    const parts=[['photos',photo],['videos',video],['index',estimate.index]];let offset=0;
    for(const [key,part] of parts) {
      const segment=document.querySelector(`[data-storage-segment="${key}"]`),length=part/total*100;
      segment.setAttribute('stroke-dasharray',`${length} ${100-length}`);segment.setAttribute('stroke-dashoffset',String(-offset));
      segment.style.opacity=scope==='all'||scope===key?'1':'.16';offset+=length;
    }
    document.querySelector('#storage-ring').setAttribute('aria-label',`${text('insightAll')}: ${format(total)} GB. ${text('insightPhotos')}: ${format(photo)} GB. ${text('insightVideos')}: ${format(video)} GB.`);
    document.querySelectorAll('[data-storage-scope]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.storageScope===scope)));
    document.querySelectorAll('[data-storage-scenario]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.storageScenario===scenario)));
  }
  document.querySelectorAll('[data-storage-scope]').forEach(button=>button.addEventListener('click',()=>{scope=button.dataset.storageScope;renderStorage();}));
  document.querySelectorAll('[data-storage-scenario]').forEach(button=>button.addEventListener('click',()=>{scenario=button.dataset.storageScenario;renderStorage();}));
  function refresh() {
    describePhoto();renderEvents();renderStorage();status.textContent=text(notice||'shortcutHint');
    open.setAttribute('aria-label',text('shortcutOpen'));document.querySelector('#shortcut-close').setAttribute('aria-label',text('shortcutClose'));
    document.querySelector('.shortcut-studio .product-modes').setAttribute('aria-label',text('shortcutModesLabel'));
    document.querySelector('.storage-studio .product-modes').setAttribute('aria-label',text('storageScenarioLabel'));
    document.querySelector('.growth-subheading>a').setAttribute('aria-label',text('growthTry'));
  }
  refresh();return {refresh};
}
