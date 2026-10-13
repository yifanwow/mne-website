export function setupDetails({text}) {
  const filter=document.querySelector('#detail-filter');
  const hide=document.querySelector('#hide-archived');
  hide.addEventListener('click',()=>{
    const hidden=hide.getAttribute('aria-checked')!=='true';
    hide.setAttribute('aria-checked',String(hidden));filter.classList.toggle('hide-archived',hidden);
    document.querySelector('#filter-count').textContent=hidden?'2':'3';
  });

  const info=document.querySelector('#photo-info-toggle');
  info.addEventListener('click',()=>{
    const expanded=info.getAttribute('aria-expanded')!=='true';
    info.setAttribute('aria-expanded',String(expanded));document.querySelector('#detail-info').classList.toggle('show-info',expanded);
  });

  const quick=document.querySelector('#quick-photo'),menu=document.querySelector('#quick-menu'),toast=document.querySelector('#quick-toast');
  let holdTimer=0,held=false,pinned=false,saved=null,pressStart=null;
  function showMenu(open) {menu.hidden=!open;quick.setAttribute('aria-expanded',String(open));}
  const visual=document.querySelector('.quick-visual');
  visual.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')showMenu(true);});
  visual.addEventListener('pointerleave',()=>{if(!pinned)showMenu(false);clearTimeout(holdTimer);});
  quick.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    pressStart={x:event.clientX,y:event.clientY};
    held=false;holdTimer=setTimeout(()=>{held=true;pinned=true;showMenu(true);},450);
  });
  quick.addEventListener('pointermove',event=>{if(pressStart&&Math.hypot(event.clientX-pressStart.x,event.clientY-pressStart.y)>10)clearTimeout(holdTimer);});
  quick.addEventListener('pointerup',()=>clearTimeout(holdTimer));
  quick.addEventListener('pointercancel',()=>{clearTimeout(holdTimer);held=false;});
  quick.addEventListener('contextmenu',event=>{event.preventDefault();pinned=true;showMenu(true);});
  quick.addEventListener('click',()=>{if(held){held=false;return;}pinned=!pinned;showMenu(pinned);});
  menu.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
    saved=button.dataset.quickAlbum;toast.textContent=text(saved==='archive'?'detailSavedArchive':'detailSavedRecent');
    toast.hidden=false;pinned=false;showMenu(false);visual.classList.add('saved');
  }));
  document.addEventListener('pointerdown',event=>{if(!visual.contains(event.target)){pinned=false;showMenu(false);}});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){pinned=false;showMenu(false);quick.focus();}});

  const aspect=document.querySelector('.aspect-gallery');
  const choices=[...document.querySelectorAll('[data-aspect-choice]')];
  choices.forEach(button=>button.addEventListener('click',()=>{
    aspect.dataset.aspect=button.dataset.aspectChoice;
    choices.forEach(choice=>choice.setAttribute('aria-pressed',String(choice===button)));
  }));
  function refresh() {
    document.querySelector('.aspect-controls').setAttribute('aria-label',text('detailAspectLabel'));
    quick.setAttribute('aria-label',text('detailPress'));
    if(saved)toast.textContent=text(saved==='archive'?'detailSavedArchive':'detailSavedRecent');
  }
  refresh();return {refresh};
}
