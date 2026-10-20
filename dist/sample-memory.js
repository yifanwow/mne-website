// Deterministic illustrative data, never a query of the visitor's photo library.
export const retainedTotal=24680,retainedPhotoCount=20160;
const seasonal=[34,68,48,96,74,53,135,86,115,148,64,92];
const yearWeights=[.4,.63,.49,.92,.57,1.12,.72,1.28,1.04,1.43];
const weights=Array.from({length:118},(_,i)=>seasonal[i%12]*yearWeights[Math.floor(i/12)]*(i%17===0?1.8:1));
function dates(total){
 const sum=weights.reduce((a,b)=>a+b,0),counts=weights.map(w=>Math.round(w/sum*total));counts[counts.length-1]+=total-counts.reduce((a,b)=>a+b,0);
 return counts.flatMap((count,i)=>{const y=2017+Math.floor(i/12),m=i%12,days=i===117?20:new Date(Date.UTC(y,m+1,0)).getUTCDate();return Array.from({length:count},(_,j)=>new Date(Date.UTC(y,m,1+Math.floor(j/count*days))));});
}
export const retainedDates=dates(retainedTotal);
export const farewellEvents=dates(6240).map((capture,i)=>({capture,farewell:new Date(Date.UTC(2026,7,20+(i*17%61))),isVideo:i%52<7}));
