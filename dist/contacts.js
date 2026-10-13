import { contactIcons } from './contact-icons.js';

export function setupContacts({getLanguage,text}) {
  document.querySelectorAll('[data-contact-icon]').forEach(el=>{el.innerHTML=contactIcons[el.dataset.contactIcon];});
  const container=document.querySelector('.wechat-contact');
  const button=document.querySelector('#wechat-toggle');
  const panel=document.querySelector('#wechat-popover');
  let pinned=false;
  function show(open) {
    panel.hidden=!open;
    button.setAttribute('aria-expanded',String(open));
  }
  container.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')show(true);});
  container.addEventListener('pointerleave',()=>{if(!pinned)show(false);});
  container.addEventListener('focusin',()=>show(true));
  container.addEventListener('focusout',event=>{if(!container.contains(event.relatedTarget)){pinned=false;show(false);}});
  button.addEventListener('click',()=>{pinned=!pinned;show(pinned);});
  document.addEventListener('pointerdown',event=>{if(!container.contains(event.target)){pinned=false;show(false);}});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){pinned=false;show(false);}});
  function refresh() {
    document.querySelector('.hero-contacts').setAttribute('aria-label',text('contactLabel'));
    document.querySelectorAll('.hero-contacts>a').forEach(link=>{
      const label=link.lastElementChild.textContent;
      link.setAttribute('aria-label',label);link.title=label;
    });
    button.setAttribute('aria-label',text('contactWechat'));button.title=text('contactWechat');
    panel.querySelector('img').alt=getLanguage()==='zh'?'叙己的微信公众号二维码':'Yifan’s WeChat public-account QR code';
  }
  refresh();
  return {refresh};
}
