// GitHub cf56cac2ce · MemorySeal / AppLanguage · 0.9.127 (158).
// Public previews show stories, never unlock conditions. Mysteries keep their names veiled.
export const fragments = [
  {id:'fool',name:{zh:'愚者',en:'The Fool'},story:{zh:'一次小小的告别。新的旅程，从留下的空白开始。',en:'One small farewell. A new journey begins in the space you leave behind.'}},
  {id:'keeper',name:{zh:'静藏者',en:'Quiet Keeper'},story:{zh:'一百次小小的告别，静静为重要的记忆留白。',en:'A hundred farewells. Quietly make room for what matters.'}},
  {id:'curator',name:{zh:'记忆策展人',en:'Memory Curator'},story:{zh:'收藏不是留住一切，而是选择你想讲述的故事。',en:'An archive is not everything you keep. It is the story you choose to tell.'}},
  {id:'mornings',name:{zh:'晨光',en:'Three Mornings'},story:{zh:'三次回到记忆的晨光里。不必急着整理完这一生。',en:'Return to your memories on three mornings. There is no need to rush.'}},
  {id:'tides',name:{zh:'潮汐',en:'Ten Tides'},story:{zh:'十日，十次潮汐。让杂音按照你的节奏退去。',en:'Ten days, ten tides. Let the noise recede at your own pace.'}},
  {id:'seasons',name:{zh:'时节',en:'Twenty Seasons'},story:{zh:'二十日的微小决定。时节流转，值得珍藏的碎片留下。',en:'Twenty days of small decisions. Seasons change; the meaningful fragments remain.'}},
  {id:'moon',name:{zh:'月相',en:'Moon Cycle'},story:{zh:'三十日的用心，无需连续。也为明天留一点空间。',en:'Thirty days of care, not necessarily in a row. Leave a little room for tomorrow.'}}
];
fragments.forEach((card,i)=>{card.category=i===0?'mystery':'ordinary';card.asset=`${card.id}.png`;});
const themed = [
  ['light-gatherer','拾光者','Light gatherer','那些记忆的碎片，共筑你我灵魂的归处。','Fragments of memory build a home for our souls.'],
  ['order-weaver','织序人','Order weaver','当散落的光影相连，故事便有了脉络。','When scattered light connects, a story finds its thread.'],
  ['chronicle-book','编年史书','Chronicle book','无数寻常的日子，终究写成独属于你的长卷。','Countless ordinary days become a chronicle that is yours alone.'],
  ['first-glance','一次回眸','A backward glance','如果能与过往对望，你会选择哪个瞬间？',"If you could meet the past’s gaze, which moment would you choose?"],
  ['traces-of-yesterday','往昔循迹','Tracing yesterday','沿着旧日的光，再走一遍来时的路。',"Follow yesterday’s light and walk the road you came by once more."],
  ['thousand-chapters','千章浪漫','A thousand chapters of romance','时间从不回应呼唤，但我们拥有的回忆会。','Time never answers our calls, but the memories we hold do.'],
  ['ebb-tide','退潮','Ebb tide','如果无法留下，至少我想决定离开的方向。','If I cannot stay, at least let me choose the direction I leave.'],
  ['world-beyond-walls','墙外的世界','The world beyond the walls','我们每一个人，都是自由的。','Every one of us is free.']
];
fragments.push(...themed.map(([id,zh,en,storyZH,storyEN])=>({id,category:'themed',asset:`${id}.webp`,name:{zh,en},story:{zh:storyZH,en:storyEN}})));
for(const id of ['magician','high-priestess','empress','wheel-of-fortune','lovers']) fragments.push({
  id,category:'mystery',mystery:true,asset:`${id}.webp`,
  name:{zh:'待发现的碎片',en:'An undiscovered fragment'},
  story:{zh:'名字与故事，留给你在回忆里亲自遇见。',en:'A name and a story, waiting for you to discover in your memories.'}
});
