// A local illustration of the current album editor; it never accesses Photos or an API.
export function setupAlbums({text}) {
  const studio=document.querySelector('#album-studio');
  const edit=document.querySelector('#album-edit');
  const pin=document.querySelector('#album-pin');
  const name=document.querySelector('#album-name');
  const cover=document.querySelector('#album-cover');
  let editing=false,pinned=false,customName=false;
  function refresh() {
    edit.textContent=text(editing?'albumDone':'albumEdit');
    edit.setAttribute('aria-pressed',String(editing));
    pin.textContent=text(pinned?'albumPinned':'albumPin');
    pin.setAttribute('aria-pressed',String(pinned));
    name.setAttribute('aria-label',text('albumNameLabel'));
    if(!customName)name.value=text('albumName');
    name.readOnly=!editing;
    document.querySelectorAll('[data-cover]').forEach((button,i)=>button.setAttribute('aria-label',`${text('albumChooseCover')} ${i+1}`));
  }
  edit.addEventListener('click',()=>{editing=!editing;studio.classList.toggle('editing',editing);refresh();});
  pin.addEventListener('click',()=>{pinned=!pinned;studio.classList.toggle('pinned',pinned);refresh();});
  name.addEventListener('input',()=>{customName=true;});
  studio.addEventListener('transitionend',event=>{if(event.propertyName==='height')window.dispatchEvent(new Event('mne:layout'));});
  name.addEventListener('blur',()=>{if(!name.value.trim()){customName=false;name.value=text('albumName');}});
  document.querySelectorAll('[data-cover]').forEach(button=>button.addEventListener('click',()=>{
    cover.style.backgroundImage=`url('./assets/photos/${button.dataset.cover}.webp')`;
    document.querySelectorAll('[data-cover]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
  }));
  refresh();return {refresh};
}
