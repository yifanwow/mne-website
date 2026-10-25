import {uiIcon} from './native-ui.js?v=2.3.0';
import {memoryBoxSVG} from './app-art.js?v=2.3.0';
// Same order as AlbumIcon.allCases. SVG counterparts avoid platform emoji substitutions.
export const albumIconChoices=[
 ['cat','albumGlyphCat','M5 9 4 3l6 4h4l6-4-1 6a8 8 0 1 1-14 0ZM8 13h.01M16 13h.01M10 17l2 1 2-1'],
 ['dog','albumGlyphDog','M7 8 3 5 2 13l5 2m10-7 4-3 1 8-5 2M7 7h10v10a5 5 0 0 1-10 0ZM9 12h.01M15 12h.01M10 16h4l-2 2Z'],
 ['bird','albumGlyphBird','M4 15c0-6 8-3 9-8a4 4 0 0 1 7 3l2 2-3 1c-1 6-9 8-15 2Zm1 0-3 4m10-6-5 2m9-7h.01'],
 ['game','albumGlyphGame','M7 7h10c5 0 7 12 3 12-2 0-3-4-5-4H9c-2 0-3 4-5 4C0 19 2 7 7 7ZM5 10v5m-2-3h5m8 0h.01m3-2h.01'],
 ['movie','albumGlyphMovie','M3 4h18v16H3ZM7 4v16M17 4v16M3 9h4m-4 6h4m10-6h4m-4 6h4'],
 ['computer','albumGlyphComputer','M2 3h20v14H2Zm10 14v4m-5 0h10'],
 ['man','albumGlyphMan','M10 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0M12 7v8m-5-4 5-4 5 4m-5 4-4 7m4-7 4 7'],
 ['heart','albumGlyphHeart','M21 6c-3-4-7-1-9 1C10 5 6 2 3 6c-4 6 9 15 9 15s13-9 9-15Z'],
 ['woman','albumGlyphWoman','M10 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0M12 7 7 17h10L12 7Zm-5 4 5-4 5 4m-7 6v5m4-5v5'],
 ['doll','albumGlyphDoll','M7 6a3 3 0 1 1 0-4m10 4a3 3 0 1 0 0-4M5 7a7 7 0 1 1 14 0c0 4-14 4-14 0ZM9 6h.01M15 6h.01M8 11c-8 2-5 7-2 5-4 7 4 9 6 4 2 5 10 3 6-4 3 2 6-3-2-5'],
 ['mne','albumGlyphMne',''],
 ['literature','albumGlyphLiterature','M5 3h15v18H6a3 3 0 0 1 0-6h14M5 3v12M9 7h7m-7 4h5M6 18h13'],
 ['couple','albumGlyphCouple','M5 6a3 3 0 1 0 6 0 3 3 0 0 0-6 0M14 5a3 3 0 1 0 6 0 3 3 0 0 0-6 0M2 21v-4a6 6 0 0 1 12 0v4m-1-9a6 6 0 0 1 9 5v4'],
 ['brokenHeart','albumGlyphBrokenHeart','M21 6c-3-4-7-1-9 1C10 5 6 2 3 6c-4 6 9 15 9 15s13-9 9-15ZM13 5l-3 5 4 3-3 5'],
 ['airplane','albumGlyphAirplane','m3 12 7-3V4c0-4 4-4 4 0v5l7 3v3l-7-2v5l3 2v2l-5-1-5 1v-2l3-2v-5l-7 2Z'],
 ['photography','albumGlyphPhotography','M3 6h4l2-3h6l2 3h4v14H3ZM8 13a4 4 0 1 0 8 0 4 4 0 0 0-8 0M18 9h.01'],
 ['architecture','albumGlyphArchitecture','M3 21V6l8-3v18m0-11h10v11M6 9h2m-2 4h2m-2 4h2m7-3h2m-2 4h2M1 21h22'],
 ['mountain','albumGlyphMountain','m1 21 8-16 9 16ZM6 12l3 2 3-3m0 1 4-9 7 18h-5'],
 ['flower','albumGlyphFlower','M12 10c-7-13-13-3-4 3-13 0-8 11 1 4-3 12 9 12 6 0 9 7 14-4 1-4 9-6 3-16-4-3Zm0 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6'],
 ['food','albumGlyphFood','M4 3v6a3 3 0 0 0 6 0V3M7 3v18M18 3c-4 3-4 8 0 9h2M20 3v18'],
 ['study','albumGlyphStudy','m1 8 11-5 11 5-11 5ZM5 10v7c4 4 10 4 14 0v-7m4-2v10']
].map(([id,key,path])=>({id,key,path}));
let selections=new Map([['main','mne']]),serial=0;
export function selectedAlbumIcon(id){return selections.get(id)||null;}
export function setAlbumIcon(id,icon){if(icon)selections.set(id,icon);else selections.delete(id);window.dispatchEvent(new CustomEvent('mne:album-icon',{detail:{id,icon}}));}
export function resetAlbumIcons(){selections=new Map([['main','mne']]);window.dispatchEvent(new Event('mne:album-icon'));}
export function albumIconSVG(icon){
 if(icon==='mne')return memoryBoxSVG(`album-glyph-${++serial}`).replace('viewBox="0 0 100 100"','viewBox="20 12 60 72"');
 const item=albumIconChoices.find(item=>item.id===icon);if(!item)return uiIcon('album');
 return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${item.path}"/></svg>`;
}
export function albumSymbol(id,badge){const icon=selectedAlbumIcon(id);if(!icon)return uiIcon(badge==='remove'?'remove':badge==='add'?'add':'album');return `<span class="web-album-glyph">${albumIconSVG(icon)}${badge?`<i aria-hidden="true">${badge==='remove'?'−':'+'}</i>`:''}</span>`;}
