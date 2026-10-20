// Web counterparts of the production line symbols; no emoji font rendering.
const paths={
  album:'<path d="M5 4h13M3 7h16"/><rect x="3" y="10" width="18" height="12" rx="3"/>',
  add:'<path d="M5 4h13M3 7h16"/><rect x="3" y="10" width="18" height="12" rx="3"/><path d="M12 13v6m-3-3h6"/>',
  remove:'<path d="M5 4h13M3 7h16"/><rect x="3" y="10" width="18" height="12" rx="3"/><path d="M9 16h6"/>',
  photo:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8" cy="9" r="1.3"/><path d="m4 17 5-5 4 4 3-3 5 4"/>',
  video:'<rect x="3" y="5" width="13" height="14" rx="3"/><path d="m16 10 5-3v10l-5-3"/>',
  heart:'<path d="M20.8 5.9a5 5 0 0 0-7.1 0L12 7.6l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 22l8.8-9a5 5 0 0 0 0-7.1Z"/>',
  trash:'<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',
  restore:'<path d="M7 4 2 9l5 5M2 9h11a6 6 0 0 1 0 12"/>',
  grip:'<path d="M5 8h14M5 12h14M5 16h14"/>',
  wrench:'<path d="m13 6 5 5 3-3a6 6 0 0 1-7 8L7 23l-4-4 7-7a6 6 0 0 1 8-7l-3 3Z"/>',
  pin:'<path d="M4 3h16M12 21V7m-5 5 5-5 5 5"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-11v1"/>',
  back:'<path d="m15 5-7 7 7 7"/>',
  share:'<path d="M8 8H5v13h14V8h-3M12 15V2m-4 4 4-4 4 4"/>',
  advance:'<path d="M12 4v16m-6-6 6 6 6-6"/>',
  grid:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
  scan:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M7 8h3M7 12h10M14 16h3"/>',
  pause:'<path d="M9 5v14M15 5v14"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  plus:'<path d="M12 4v16M4 12h16"/>'
};
export function uiIcon(name){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.album}</svg>`;}
export const albumSamples=[
  {id:'sea',key:'albumRowSea',count:7,photos:['sea','waterfall','harbor','skyline','city','dawn','sunset']},
  {id:'woods',key:'albumRowWoods',count:7,photos:['forest','garden','fern','autumn','meadow','flowerfield','treeline']},
  {id:'main',key:'albumName',count:7,photos:['shop','lamplight','stilllife','room','window','roof','station']},
  {id:'journey',key:'albumRowJourney',count:7,photos:['blossom','moon','night','bird','wildbird','rainbow','capture']}
];
