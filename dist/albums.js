// Album-list illustration. Every operation stays in this page; no Photos/API access.
export function setupAlbums({text}) {
  const studio=document.querySelector('#album-studio'),list=document.querySelector('#album-list');
  const edit=document.querySelector('#album-edit'),pin=document.querySelector('#album-pin');
  const main=document.querySelector('#album-stack'),name=document.querySelector('#album-name');
  const cover=document.querySelector('#album-cover'),status=document.querySelector('#album-status');
  let editing=false,customName=false;
  function announce(key){status.textContent=text(key);}
  function refresh() {
    edit.textContent=text(editing?'albumDone':'albumEdit');edit.setAttribute('aria-pressed',String(editing));
    pin.textContent=text(list.firstElementChild===main?'albumPinned':'albumPin');
    pin.setAttribute('aria-pressed',String(list.firstElementChild===main));
    name.setAttribute('aria-label',text('albumNameLabel'));name.readOnly=!editing;
    if(!customName)name.value=text('albumName');
    document.querySelectorAll('[data-cover]').forEach((button,i)=>button.setAttribute('aria-label',`${text('albumChooseCover')} ${i+1}`));
    document.querySelectorAll('[data-album-move]').forEach(button=>{
      button.disabled=!editing;button.setAttribute('aria-label',text(button.dataset.albumMove==='up'?'albumMoveUp':'albumMoveDown'));
    });
    document.querySelector('#album-title').textContent=text(editing?'albumEditHeading':'albumBrowseHeading');
    status.textContent=text(editing?'albumEditHint':'albumBrowseHint');
  }
  function moveRow(row,before) {
    const positions=new Map([...list.children].map(el=>[el,el.getBoundingClientRect().top]));
    list.insertBefore(row,before);
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches)for(const el of list.children) {
      const delta=positions.get(el)-el.getBoundingClientRect().top;
      if(delta)el.animate([{transform:`translateY(${delta}px)`},{transform:'translateY(0)'}],{duration:450,easing:'cubic-bezier(.2,.7,.2,1)'});
    }
    refresh();announce('albumReordered');
  }
  edit.addEventListener('click',()=>{editing=!editing;studio.classList.toggle('editing',editing);refresh();});
  pin.addEventListener('click',()=>{if(list.firstElementChild!==main)moveRow(main,list.firstElementChild);else announce('albumPinned');});
  name.addEventListener('input',()=>{customName=true;});
  name.addEventListener('blur',()=>{if(!name.value.trim()){customName=false;name.value=text('albumName');}});
  studio.addEventListener('transitionend',event=>{if(event.propertyName==='height')window.dispatchEvent(new Event('mne:layout'));});
  document.querySelectorAll('[data-album-move]').forEach(button=>button.addEventListener('click',()=>{
    const row=button.closest('.album-row');
    if(button.dataset.albumMove==='up'&&row.previousElementSibling)moveRow(row,row.previousElementSibling);
    else if(button.dataset.albumMove==='down'&&row.nextElementSibling)moveRow(row.nextElementSibling,row);
  }));
  document.querySelectorAll('[data-cover]').forEach(button=>button.addEventListener('click',()=>{
    cover.style.backgroundImage=`url('./assets/photos/${button.dataset.cover}.webp')`;
    document.querySelectorAll('[data-cover]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
    announce('albumCoverChanged');
  }));
  refresh();return {refresh};
}
