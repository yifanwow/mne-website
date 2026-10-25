import {uiIcon} from './native-ui.js?v=2.3.0';
const themeData=[
 {id:'cats',key:'subjectCats',icon:'M5 9 4 3l6 4h4l6-4-1 6a8 8 0 1 1-14 0ZM8 13h.01M16 13h.01M10 17l2 1 2-1'},
 {id:'dogs',key:'subjectDogs',icon:'M7 8 3 5 2 13l5 2m10-7 4-3 1 8-5 2M7 7h10v10a5 5 0 0 1-10 0ZM9 12h.01M15 12h.01M10 16h4l-2 2Z'},
 {id:'birds',key:'subjectBirds',icon:'M4 15c0-6 8-3 9-8a4 4 0 0 1 7 3l2 2-3 1c-1 6-9 8-15 2Zm1 0-3 4m10-6-5 2m9-7h.01'},
 {id:'plants',key:'subjectPlants',icon:'M20 3C7 2 2 8 5 16s17 6 15-13ZM4 21 15 10',photos:['garden','fern','flowerfield','forest','meadow','blossom'],video:4},
 {id:'food',key:'subjectFood',icon:'M4 3v6a3 3 0 0 0 6 0V3M7 3v18M18 3c-4 3-4 8 0 9h2M20 3v18'},
 {id:'buildings',key:'subjectBuildings',icon:'M3 21V8l8-4v17m0-11h10v11M6 10h2m-2 4h2m-2 4h2m7-5h2m-2 4h2M1 21h22',photos:['city','station','roof','skyline','window','harbor'],video:5}
];
function symbol(path){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;}
export function setupSubjects({text,reducedMotion}){
 const root=document.querySelector('#subject-studio'),gallery=root.querySelector('#subject-gallery'),chooser=root.querySelector('#subject-chooser'),switcher=root.querySelector('#subject-switch');
 const archive=root.querySelector('#subject-show-archived'),media=root.querySelector('#subject-media');
 let current='plants',chooserOpen=false;
 function setChooser(open){chooserOpen=open;chooser.hidden=!open;switcher.setAttribute('aria-expanded',String(open));if(open)(chooser.querySelector('[aria-pressed="true"]')||chooser.querySelector('button:not(:disabled)')).focus();}
 function choose(id){current=id;setChooser(false);render();if(!reducedMotion.matches&&!document.body.classList.contains('motion-paused'))gallery.animate([{opacity:.35,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'ease-out'});}
 function render(){
  const theme=themeData.find(t=>t.id===current);
  root.dataset.theme=current;root.querySelector('#subject-name').textContent=text(theme.key);
  switcher.innerHTML=symbol(theme.icon)+`<span>${text(theme.key)}</span>`+uiIcon('advance');
  const columns=[document.createElement('div'),document.createElement('div')];gallery.replaceChildren(...columns);let count=0;
  theme.photos.forEach((photo,i)=>{
   const archived=i===0,video=i===theme.video;
   if(archived&&!archive.checked||media.value==='videos'&&!video||media.value==='photos'&&video)return;
   const figure=document.createElement('figure');figure.dataset.video=String(video);figure.dataset.archived=String(archived);
   const img=document.createElement('img');img.src=`./assets/photos/${photo}.webp`;img.alt='';img.loading='lazy';figure.append(img);
   if(video){const badge=document.createElement('span');badge.className='subject-video';badge.innerHTML=uiIcon('video')+' 0:12';figure.append(badge);}
   if(archived){const badge=document.createElement('span');badge.className='subject-archive';badge.innerHTML=uiIcon('album');figure.append(badge);}
   columns[count%2].append(figure);count++;
  });
  root.querySelector('#subject-count').textContent=`${count} ${text('subjectsCount')}`;
  root.querySelectorAll('[data-subject-theme],[data-subject-preview]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.subjectTheme||b.dataset.subjectPreview)===current)));
 }
 themeData.forEach(theme=>{
  const b=document.createElement('button');b.type='button';b.dataset.subjectTheme=theme.id;b.disabled=!theme.photos;b.innerHTML=symbol(theme.icon)+'<span></span>';b.querySelector('span').textContent=text(theme.key);
  b.addEventListener('click',()=>choose(theme.id));chooser.querySelector('.subject-theme-grid').append(b);
 });
 root.querySelectorAll('[data-subject-preview]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.subjectPreview)));
 archive.addEventListener('change',render);media.addEventListener('change',render);
 switcher.addEventListener('click',()=>setChooser(!chooserOpen));
 document.addEventListener('pointerdown',event=>{if(chooserOpen&&!chooser.contains(event.target)&&!switcher.contains(event.target))setChooser(false);});
 root.addEventListener('keydown',event=>{if(event.key==='Escape'&&chooserOpen){setChooser(false);switcher.focus();}});
 function refresh(){
  root.querySelectorAll('[data-subject-theme]').forEach(b=>{const t=themeData.find(t=>t.id===b.dataset.subjectTheme);b.querySelector('span').textContent=text(t.key);if(b.disabled)b.title=text('subjectsAppOnly');});
  switcher.setAttribute('aria-label',text('subjectsAlbum'));media.setAttribute('aria-label',text('subjectsFilter'));root.querySelector('.subject-previews').setAttribute('aria-label',text('subjectsTry'));root.querySelector('#subject-filters summary').setAttribute('aria-label',text('subjectsFilter'));
  render();
 }
 refresh();return {refresh};
}
