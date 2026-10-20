import {farewellEvents} from './sample-memory.js?v=1.8.0';
import {uiIcon} from './native-ui.js?v=1.8.0';
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const palette=['#c2a6fa','#a17ddb','#dec2fa','#8a73ba','#bab0e8','#daa4da','#9794d6','#6e6191'];

// Read-only illustration of FarewellDistributionView. Capture/deletion dates are distinct;
// filtering never rewrites lifetime totals, guesses missing history, or restores photographs.
export function setupFarewell({text}) {
 const root=document.querySelector('#farewell-panel'),chart=root.querySelector('#farewell-chart'),shape=root.querySelector('#farewell-chart-shape'),legend=root.querySelector('#farewell-legend');
 const start=root.querySelector('#farewell-start'),end=root.querySelector('#farewell-end');
 let basis='capture',period='year',style='bars',buckets=[],selected=-1,total=0;
 root.querySelectorAll('[data-history-icon]').forEach(el=>el.innerHTML=uiIcon(el.dataset.historyIcon));
 for(const select of [start,end])for(let y=2017;y<=2026;y++){const option=document.createElement('option');option.value=String(y);option.textContent=String(y);select.append(option);}
 start.value='2017';end.value='2026';
 function dateStart(date){const d=new Date(date);if(period==='year')return new Date(Date.UTC(d.getUTCFullYear(),0,1));if(period==='month')return new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1));d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d;}
 function label(bucket){const d=bucket.date;if(period==='year')return String(d.getUTCFullYear());return `${d.getUTCFullYear()}/${String(d.getUTCMonth()+1).padStart(2,'0')}`+(period==='week'?`/${String(d.getUTCDate()).padStart(2,'0')}`:'');}
 function snapshot(){
  const records=farewellEvents.filter(e=>e[basis].getUTCFullYear()>=Number(start.value)&&e[basis].getUTCFullYear()<=Number(end.value));
  const grouped=new Map();for(const item of records){const key=+dateStart(item[basis]);grouped.set(key,(grouped.get(key)||0)+1);}
  buckets=[...grouped].sort((a,b)=>a[0]-b[0]).map(([date,count])=>({date:new Date(date),count}));total=records.length;
  root.querySelector('#farewell-recorded').textContent=total.toLocaleString();root.querySelector('#farewell-photos').textContent=records.filter(e=>!e.isVideo).length.toLocaleString();root.querySelector('#farewell-videos').textContent=records.filter(e=>e.isVideo).length.toLocaleString();
 }
 function render(){
  snapshot();selected=-1;legend.replaceChildren();chart.dataset.type=style;chart.dataset.period=period;chart.dataset.basis=basis;chart.setAttribute('aria-label',text('farewellChartLabel'));
  root.querySelector('#farewell-basis-note').textContent=text(basis==='capture'?'farewellCaptureNote':'farewellDeleteNote');root.querySelector('#farewell-hint').textContent=text('historyHint');
  if(!total){shape.innerHTML='';const message=document.createElementNS('http://www.w3.org/2000/svg','text');message.setAttribute('x','280');message.setAttribute('y','115');message.setAttribute('text-anchor','middle');message.setAttribute('class','axis-label');message.textContent='—';shape.append(message);root.querySelector('#farewell-peak').textContent='—';root.querySelector('#farewell-quiet').textContent='—';root.querySelector('#farewell-hint').textContent=text('historyEmpty');return;}
  const peak=buckets.reduce((a,b)=>a.count>b.count?a:b),quiet=buckets.reduce((a,b)=>a.count<b.count?a:b);
  root.querySelector('#farewell-peak').textContent=`${peak.count.toLocaleString()} · ${label(peak)}`;root.querySelector('#farewell-quiet').textContent=`${quiet.count.toLocaleString()} · ${label(quiet)}`;
  if(style==='pie'){
   let segments=buckets;
   if(buckets.length>12){const top=[...buckets].sort((a,b)=>b.count-a.count).slice(0,11),kept=new Set(top.map(b=>+b.date));segments=[...top,{date:null,count:buckets.filter(b=>!kept.has(+b.date)).reduce((s,b)=>s+b.count,0)}];}
   let angle=-Math.PI/2;shape.innerHTML=segments.map((b,i)=>{const endAngle=angle+b.count/total*Math.PI*2,x1=280+Math.cos(angle)*80,y1=111+Math.sin(angle)*80,x2=280+Math.cos(endAngle-.008)*80,y2=111+Math.sin(endAngle-.008)*80,path=`M${x1},${y1}A80,80 0 ${endAngle-angle>Math.PI?1:0},1 ${x2},${y2}`;angle=endAngle;return segments.length===1?`<circle cx="280" cy="111" r="80" stroke="${palette[0]}" stroke-width="30" fill="none"/>`:`<path class="pie-segment" d="${path}" stroke="${palette[i%palette.length]}" stroke-width="30" fill="none"/>`;}).join('')+`<text x="280" y="109" class="pie-total" text-anchor="middle">${total.toLocaleString()}</text><text x="280" y="130" class="axis-label" text-anchor="middle">${text('atlasMemories')}</text>`;
   segments.forEach((b,i)=>{const button=document.createElement('button');button.type='button';button.innerHTML=`<i style="background:${palette[i%palette.length]}"></i><span></span><b>${b.count.toLocaleString()}</b>`;button.querySelector('span').textContent=b.date?label(b):text('historyOther');button.addEventListener('click',()=>{root.querySelector('#farewell-hint').textContent=`${b.date?label(b):text('historyOther')} · ${b.count.toLocaleString()} ${text('atlasMemories')}`;});legend.append(button);});return;
  }
  const left=35,right=529,top=28,bottom=202,ceiling=Math.ceil(peak.count/50)*50,x=i=>buckets.length===1?282:left+i/(buckets.length-1)*(right-left),y=count=>bottom-count/ceiling*(bottom-top);
  let content=Array.from({length:4},(_,i)=>`<path class="chart-guide" d="M${left},${y(ceiling*i/3)}H${right}"/><text class="axis-label" x="${left-9}" y="${y(ceiling*i/3)+3}" text-anchor="end">${Math.round(ceiling*i/3)}</text>`).join('');
  if(style==='bars'){const width=Math.min(25,494/buckets.length*.55);content+=buckets.map((b,i)=>`<rect class="bar" x="${x(i)-width/2}" y="${y(b.count)}" width="${width}" height="${bottom-y(b.count)}" rx="2"><title>${label(b)}: ${b.count}</title></rect>`).join('');}
  else {const line=buckets.map((b,i)=>`${i?'L':'M'}${x(i)},${y(b.count)}`).join(' ');content+=`<path d="${line}L${x(buckets.length-1)},${bottom}L${x(0)},${bottom}Z" fill="url(#farewellFill)" stroke="none"/><path class="trend-line" fill="none" d="${line}"/>`;}
  const ticks=new Set(Array.from({length:Math.min(6,buckets.length)},(_,i)=>Math.round(i/Math.max(1,Math.min(6,buckets.length)-1)*(buckets.length-1))));for(const i of ticks)content+=`<text x="${x(i)}" y="223" class="axis-label" text-anchor="middle">${label(buckets[i])}</text>`;
  shape.innerHTML=content+'<g id="farewell-selection"></g>';
 }
 function inspect(index){if(!buckets.length||style==='pie')return;selected=clamp(index,0,buckets.length-1);const b=buckets[selected],x=buckets.length===1?282:35+selected/(buckets.length-1)*494;root.querySelector('#farewell-selection').innerHTML=`<path d="M${x},25V202" stroke="#c2a6fa" stroke-width=".8" stroke-dasharray="3 4"/>`;root.querySelector('#farewell-hint').textContent=`${text('atlasSelected')} · ${label(b)} · ${b.count.toLocaleString()} ${text('atlasMemories')}`;}
 function inspectPointer(event){const r=chart.getBoundingClientRect();inspect(Math.round(clamp(((event.clientX-r.left)/r.width*560-35)/494)*(buckets.length-1)));}
 chart.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')inspectPointer(e);});chart.addEventListener('pointerdown',inspectPointer);
 chart.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();inspect(e.key==='Home'?0:e.key==='End'?buckets.length-1:Math.max(0,selected)+(e.key==='ArrowRight'?1:-1));});
 for(const [attr,set] of [['basis',value=>basis=value],['period',value=>period=value],['chart',value=>style=value]])root.querySelectorAll(`[data-history-${attr}]`).forEach(button=>button.addEventListener('click',()=>{set(button.getAttribute(`data-history-${attr}`));root.querySelectorAll(`[data-history-${attr}]`).forEach(el=>{el.setAttribute('aria-pressed',String(el===button));el.classList.toggle('active',el===button);});render();window.dispatchEvent(new Event('mne:layout'));}));
 for(const select of [start,end])select.addEventListener('change',()=>{if(Number(start.value)>Number(end.value)){if(select===start)end.value=start.value;else start.value=end.value;}render();window.dispatchEvent(new Event('mne:layout'));});
 function refresh(){start.setAttribute('aria-label',text('atlasStart'));end.setAttribute('aria-label',text('atlasEnd'));root.querySelectorAll('[data-label-key]').forEach(el=>el.setAttribute('aria-label',text(el.dataset.labelKey)));render();}
 refresh();return {refresh};
}
