// Ported from Mne's production geometry, not traced from a screenshot.
// MemoryBoxGeometry.swift · ProfileStatisticSymbol.swift · ProfileMeteorArt.swift.
const strokes = [
  [[.22,.65],[.22,.29],[.50,.47],[.78,.29],[.78,.65]],
  [[.22,.65],[.50,.81],[.78,.65]],
  [[.50,.55],[.50,.81]],
  [[.31,.235],[.50,.125],[.69,.235]],
  [[.59,.63],[.69,.57]]
].map(points => points.map(([x,y]) => [(.5+(x-.5)*.88)*100,(.5+(y-.5)*.88)*100]));
export const logoLengths = strokes.map(points => points.slice(1).reduce((sum,p,i) => sum+Math.hypot(p[0]-points[i][0],p[1]-points[i][1]),0));

export function memoryBoxSVG() {
  // A vertical stroke has zero bounding-box width. Use the shared icon coordinates for its gradient.
  return `<svg class="memory-box-mark" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="boxInk" gradientUnits="userSpaceOnUse" x1="20" y1="12" x2="78" y2="84"><stop stop-color="#e9ddff"/><stop offset=".55" stop-color="#c2a6fa"/><stop offset="1" stop-color="#8063a9"/></linearGradient></defs><g stroke="url(#boxInk)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none">${strokes.map((points,i)=>`<path data-logo-stroke="${i}" pathLength="1" d="${points.map(([x,y],j)=>`${j?'L':'M'}${x},${y}`).join(' ')}"/>`).join('')}</g></svg>`;
}

function star(x,y,r,rotation=0) {
  return Array.from({length:8},(_,i)=>{
    const a=i*Math.PI/4+rotation, distance=i%2===0?r:r*.18;
    return `${i?'L':'M'}${(x+Math.cos(a)*distance).toFixed(3)},${(y+Math.sin(a)*distance).toFixed(3)}`;
  }).join(' ')+'Z';
}
function orbitArc(from,to) {
  return Array.from({length:25},(_,i)=>{
    const a=(from+(to-from)*i/24)*Math.PI/180;
    return `${i?'L':'M'}${39+Math.cos(a)*28},${31+Math.sin(a)*28}`;
  }).join(' ');
}
export function statisticSVG(kind) {
  const id=`stat-${kind}`;
  const gradient=`<linearGradient id="${id}-ink" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#c2a6fa"/></linearGradient>`;
  const fade=`<linearGradient id="${id}-fade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="white"/><stop offset=".4" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity=".32"/></linearGradient><mask id="${id}-mask"><rect width="78" height="65" fill="url(#${id}-fade)"/></mask>`;
  let defs='', art='';
  if(kind==='reviewed') {
    art=`<circle cx="39" cy="32" r="24" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/>`;
    for(const [x,y,r] of [[38,28,16],[18,19,6],[61,10,5]]) art+=`<path d="${star(x,y,r,-Math.PI/2)}" fill="url(#${id}-ink)" stroke="none"/>`;
    for(let i=0;i<9;i++) { const a=i*Math.PI*2/9;art+=`<circle cx="${39+Math.cos(a)*29+.5}" cy="${32+Math.sin(a)*25+.5}" r=".5" fill="#fff" opacity=".6" stroke="none"/>`; }
  } else if(kind==='removed') {
    const heads=[[50,19,9],[25,21,3.5],[59,41,5]];
    defs=`<mask id="${id}-moat"><rect x="-2" y="-2" width="82" height="69" fill="white"/>${heads.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r+4}" fill="black"/>`).join('')}</mask>`;
    art=`<g mask="url(#${id}-moat)" fill="none" stroke="#fff" stroke-opacity=".32" stroke-width=".6"><path d="${orbitArc(200,270)}"/><path d="${orbitArc(0,75)}"/></g>`;
    const trails=[[26,40,36,26,.9,1],[16,38,19,30,.55,.62],[43,50,48,42,.65,.78]];
    heads.forEach(([x,y,r],i)=>{const [sx,sy,cx,cy,w,op]=trails[i];art+=`<path mask="url(#${id}-moat)" d="M${sx},${sy}Q${cx},${cy} ${x},${y}" fill="none" stroke="url(#${id}-ink)" stroke-width="${w}" opacity="${op}"/><path d="${star(x,y,r)}" fill="url(#${id}-ink)" opacity="${op}" stroke="none"/>`;});
    for(const [x,y,r,op] of [[23,43,1,.65],[20,47,.75,.45],[17,51,.55,.3],[13,41,.7,.48],[11,44,.5,.32],[40,53,.8,.5],[37,56,.6,.34],[34,59,.45,.2]]) art+=`<circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="${op}" stroke="none"/>`;
  } else {
    defs=`<linearGradient id="${id}-moon"><stop stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#c2a6fa" stop-opacity=".38"/></linearGradient><mask id="${id}-crescent"><ellipse cx="51" cy="31.5" rx="16" ry="18.5" fill="white"/><ellipse cx="55.5" cy="24.5" rx="13.5" ry="15.5" fill="black"/></mask>`;
    art=`<circle cx="33" cy="26" r="19" fill="url(#${id}-moon)" stroke="none"/><rect x="35" y="13" width="32" height="37" fill="#fff" mask="url(#${id}-crescent)" stroke="none"/>`;
    for(const n of [0,4]) art+=`<ellipse cx="38.5" cy="27.5" rx="${32.5+n}" ry="${26.5-n}" fill="none" stroke="#fff" stroke-width=".5" opacity=".25"/>`;
    for(const [x,y] of [[24,18],[30,32],[40,23]]) art+=`<circle cx="${x+1.5}" cy="${y+1.5}" r="1.5" fill="none" stroke="#c2a6fa" stroke-width=".7" opacity=".5"/>`;
  }
  return `<svg viewBox="0 0 78 65" aria-hidden="true"><defs>${gradient}${fade}${defs}</defs><g mask="url(#${id}-mask)">${art}</g></svg>`;
}
