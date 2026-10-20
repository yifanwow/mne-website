import {refineCopy} from './refine-copy.js?v=1.9.2';
import {setupFarewell} from './history.js?v=1.9.2';
import {setupSectionRail} from './section-rail.js?v=1.9.2';
import {storiesCopy} from './stories-copy.js?v=1.9.2';
import {setupStories} from './stories.js?v=1.9.2';
import { motionCopy } from './motion-copy.js?v=1.9.2';
import { initMotion } from './motion.js?v=1.9.2';
import { setupContacts } from './contacts.js?v=1.9.2';
import { setupDetails } from './details.js?v=1.9.2';
import { setupAlbums } from './albums.js?v=1.9.2';
import { setupProduct } from './product.js?v=1.9.2';
import { productCopy } from './product-copy.js?v=1.9.2';

// Public copy only. App services, credentials and photo-library data are never used here.
const copy = {
  zh: {
    skip:'跳到内容',navExperience:'体验',navFragments:'记忆碎片',navJournal:'开发手记',navStatus:'探索 Mne',
    heroEyebrow:'新的旅程从留下的空白开始。',heroLine1:'记忆碎片，',heroLine2:'掌指之间。',heroDescription:'照片是回忆的载体，选择你想留住的故事。',discover:'认识 Mne',whyMne:'为什么是 Mne',platform:'为 iPhone 而生 · iOS 18+ · 邀请制内测中',phoneCount:'24,680 份回忆',floatingTitle:'遇见美好，留下回忆。',floatingSub:'MEET BEAUTY. KEEP MEMORIES.',illustrationLabel:'界面示意 · 照片与数字为展示内容',scrollExplore:'向下探索',
    storyEyebrow:'关于去留，你比任何算法都懂。',storyLine1:'不是每张照片都要留下。',storyLine2:'但每一份记忆，都值得被认真对待。',storyDescription:'Mne，取名自记忆女神 Mnemosyne。<br>整理不是抹去，而是为真正重要的瞬间，留出空间。回望本身，也是人生的过程。',
    experienceIndex:'顺着直觉，回到记忆',experienceEyebrow:'少一点操作，多一点感受。',experienceTitle:'<span class="lilac">回望，</span>也可以纯粹且简单。',experienceDescription:'从一整片回忆，到某一个瞬间。<br>找到舒服的节奏，剩下的交给手指。',
    featureBrowseTitle:'<span class="lilac">远观，</span>或靠近。',featureBrowseDescription:'单列瀑布流、4 格、9 格与沉浸单图。App 内双指缩放，视角连续变化，始终留在那张照片附近。',featureGestureTitle:'<span class="lilac">靠近一张照片，</span>顺手做好。',featureGestureDescription:'单张浏览时，长按唤出触点旁的敏捷菜单。喜欢、加入最近相册，不必离开照片；上滑暂存，随时恢复。',featureRecoverTitle:'<span class="lilac">每次放下，</span>都有余地。',featureRecoverDescription:'暂存的照片，随时可以恢复。真正删除前，由 iOS 再次确认。让每个选择，都从容一点。',
    fragmentEyebrow:'回忆，是铸就我们人生的碎片。',fragmentLine1:'整理过去。',fragmentLine2:'重新认识自己。',fragmentDescription:'收集卡片，解锁成就，让整理也成为一场回到过去的历险。<br>在重温与选择之间，发现新的乐趣，也重新认识自己。',
    atlasIndex:'看看记忆的形状',atlasEyebrow:'时间留下轨迹，你留下故事。',atlasLine1:'让回忆，',atlasLine2:'有迹可循。',atlasDescription:'按周、月或年，回看记忆的起伏。选择某一年，或圈定一段岁月。照片、视频与容量估算，让回忆的轮廓更加清晰。',atlasTag1:'周 / 月 / 年',atlasTag2:'趋势 / 柱形 / 饼图',atlasPanelEyebrow:'回忆图谱',chartTrend:'趋势',chartBars:'柱形',statReviewed:'已检查',statRemoved:'已整理',statReleased:'估算腾出空间',atlasDisclaimer:'图表与统计为示例数据；实际空间释放取决于 iOS 与 iCloud。',
    privacyTitle:'照片，留在你的照片库。',privacyDescription:'照片和视频留在系统图库，不上传到 Mne 服务器。不登录也能整理；二十八张卡面随包提供。登录后可备份资料与整理记录，并发送使用概况；错误报告由你确认上传。',themeTitle:'让界面，顺应你的心情。',themeDescription:'白昼、暗夜、旧梦、青灰与 OLED nerd。五种主题与独立图标选择，中文与英文。一个始终熟悉的整理空间。',nativeTitle:'原生的，恰好的。',nativeDescription:'为 iPhone 打造。真实的系统材质、轻柔的触觉与克制的动效。支持系统减少动态效果，让节奏由你掌握。',
    journalIndex:'持续生长，慢慢打磨',journalEyebrow:'一个关于记忆的 App，也有自己的记忆。',journalTitle:'Mne 的开发手记。',sourceLabel:'当前源码',journalMore:'回看更早的故事',journalLess:'收起早期手记',
    accessLine1:'给照片一点空间。',accessLine2:'也给自己一点。',accessDescription:'Mne 正在邀请制内测中。<br>从浏览开始，把回忆慢慢整理成喜欢的样子。',accessCta:'看看最新进展',accessStatus:'邀请制 TestFlight 内测 · 暂无公开下载',footerTagline:'精简照片，是为了让真正的记忆更闪耀。',footerMade:'用心整理，用心创造。',creditsButton:'了解更多',creditsTitle:'在 Mne 之外，继续相遇。',backTop:'回到顶部 ↑'
  },
  en: {
    skip:'Skip to content',navExperience:'Experience',navFragments:'Fragments',navJournal:'Journal',navStatus:'Explore Mne',
    heroEyebrow:'A NEW JOURNEY BEGINS WITH THE SPACE YOU LEAVE.',heroLine1:'Fragments of memory,',heroLine2:'at your fingertips.',heroDescription:'Photos hold our memories. Choose the stories you want to keep.',discover:'Discover Mne',whyMne:'Why Mne',platform:'Made for iPhone · iOS 18+ · Invite-only beta',phoneCount:'24,680 memories',floatingTitle:'Meet beauty. Keep memories.',floatingSub:'MEET BEAUTY. KEEP MEMORIES.',illustrationLabel:'Interface illustration · Demo photos and numbers',scrollExplore:'SCROLL TO EXPLORE',
    storyEyebrow:'YOU KNOW WHAT MATTERS. BETTER THAN ANY ALGORITHM.',storyLine1:'Not every photo needs to stay.',storyLine2:'Every memory deserves a moment of care.',storyDescription:'Mne takes its name from Mnemosyne, the goddess of memory.<br>Curating makes room for the moments that matter. Looking back is part of living.',
    experienceIndex:'FOLLOW YOUR INTUITION',experienceEyebrow:'LESS DOING. MORE FEELING.',experienceTitle:'<span class="lilac">Looking back,</span> simply.',experienceDescription:'From a whole world of memories to a single moment.<br>Find your rhythm. Let your fingers take it from there.',
    featureBrowseTitle:'<span class="lilac">Step back.</span> Or get closer.',featureBrowseDescription:'A single column, four tiles, nine tiles, or one immersive photo. Pinch in the app to move fluidly between layouts, staying close to your focal photo.',featureGestureTitle:'<span class="lilac">Get closer.</span> Keep it within reach.',featureGestureDescription:'In single-photo view, hold to reveal a quick menu near your touch. Favorite or add to a recent album without leaving the photo. Swipe up to set it aside, and restore it anytime.',featureRecoverTitle:'<span class="lilac">Room</span> to change your mind.',featureRecoverDescription:'Restore anything you have set aside in Trash. Before a photo is truly deleted, iOS asks you to confirm. Every decision, at your own pace.',
    fragmentEyebrow:'MEMORIES ARE THE FRAGMENTS WE ARE MADE OF.',fragmentLine1:'Revisit your memories.',fragmentLine2:'Meet yourself again.',fragmentDescription:'Collect cards and unlock achievements as you adventure through your past.<br>Find joy in revisiting your memories, and meet yourself again along the way.',
    atlasIndex:'THE SHAPE OF YOUR MEMORIES',atlasEyebrow:'TIME LEAVES A TRACE. YOU LEAVE A STORY.',atlasLine1:'Your memories,',atlasLine2:'in perspective.',atlasDescription:'Look back by week, month, or year. Choose one year or a span of time. Photos, videos, and storage estimates bring the shape of your memories into focus.',atlasTag1:'Week / Month / Year',atlasTag2:'Trend / Bars / Pie',atlasPanelEyebrow:'Memory atlas',chartTrend:'Trend',chartBars:'Bars',statReviewed:'Reviewed',statRemoved:'Processed',statReleased:'Est. released',atlasDisclaimer:'Illustrative data. Actual storage release depends on iOS and iCloud.',
    privacyTitle:'Your photos stay in your library.',privacyDescription:'Photos and videos stay in your system library. Curate without signing in; all twenty-eight cards are bundled. Signed-in use backs up profile/activity data and sends session summaries; error reports require your confirmation.',themeTitle:'A space that feels like you.',themeDescription:'Daylight, Midnight, Old dream, Blue sage, and OLED nerd. Five themes with independently chosen icons. Chinese and English. A familiar space for your memories.',nativeTitle:'Native. Thoughtfully so.',nativeDescription:'Made for iPhone, with system materials, subtle haptics, and considered motion. Respects Reduce Motion, so the pace always feels right.',
    journalIndex:'GROWING, ONE DETAIL AT A TIME',journalEyebrow:'AN APP ABOUT MEMORIES HAS MEMORIES OF ITS OWN.',journalTitle:'The Mne journal.',sourceLabel:'Latest source',journalMore:'Look back a little further',journalLess:'Show fewer entries',
    accessLine1:'Make room for your photos.',accessLine2:'And for yourself.',accessDescription:'Mne is currently in invite-only beta.<br>Start by looking back. Shape your memories into something you love.',accessCta:'Follow our progress',accessStatus:'Invite-only TestFlight beta · No public download yet',footerTagline:'Less in your library. More in your memories.',footerMade:'Made with care.',creditsButton:'Beyond Mne',creditsTitle:'Meet me beyond Mne.',backTop:'Back to top ↑'
  }
};

Object.assign(copy.zh, motionCopy.zh, productCopy.zh, storiesCopy.zh, refineCopy.zh);
Object.assign(copy.en, motionCopy.en, productCopy.en, storiesCopy.en, refineCopy.en);

// Verified against GitHub 294634c472, 2026-10-20. Source progress is not a public release.
const journal = [
  {"date": "2026-10-20", "version": "0.9.189 — 0.9.190 (221)", "tag": {"zh": "卡面更新", "en": "Artwork update"}, "title": {"zh": "七星照见来路，星火汇成回忆。", "en": "Seven stars. A spark passed on."}, "body": {"zh": "七星与星火相传换上最新完整透明卡画，保留既有收藏记录；白昼主题的柔光与轮廓继续打磨。当前源码 0.9.190（221），App 内更新日志截至 0.9.185；当前构建未确认发布。", "en": "New original transparent artwork for Seven stars and Passing the spark, preserving existing collection records. Refined light and contours in Daylight. Current source is 0.9.190 (221); in-app notes cover through 0.9.185. This source build is not confirmed released."}},
  {"date": "2026-10-19", "version": "0.9.182 — 0.9.188", "tag": {"zh": "快速查重", "en": "Quick duplicate check"}, "title": {"zh": "相似的瞬间，留给你亲自选择。", "en": "Similar moments. Your choice."}, "body": {"zh": "新增实验性快速查重：按日期查看相似候选，大图优先保留、小图对照，可逐组选择、预览与暂存。结果和进度缓存在本机，暂停后可继续，不会自动删除。完善容量读取与主题；错误报告由登录用户主动确认上传。", "en": "Experimental duplicate checking groups similar candidates by date, with a large preferred photo, smaller comparisons, selection, preview and reversible staging. Results and progress are cached on device for continuation, with no automatic deletion. Refined capacity reading and themes; signed-in users explicitly confirm error-report uploads."}},
  {"date": "2026-10-18", "version": "0.9.149 — 0.9.181", "tag": {"zh": "回望与告别", "en": "Looking back & letting go"}, "title": {"zh": "每一次放下，都有自己的轨迹。", "en": "Every farewell leaves its trace."}, "body": {"zh": "实验性告别图表只读本机成功删除明细，可按拍摄日期或告别日期回看，累计数量与有日期的历史分开。瀑布流暂存与恢复有了更清晰的标记，视频和 Live 浏览、相册筛选及容量状态持续打磨。", "en": "The experimental Farewell chart reads local successful-deletion records by capture or farewell date, keeping lifetime totals separate from dated coverage. Clearer staging and recovery marks, alongside continued refinements to video/Live browsing, album filtering and capacity states."}},
  {"date": "2026-10-17", "version": "0.9.128 — 0.9.148", "tag": {"zh": "重温与收藏", "en": "Revisit & collect"}, "title": {"zh": "回忆更近，旅途更长。", "en": "Closer memories. A longer journey."}, "body": {"zh": "内置成就增至二十八张，普通十二、主题十、三星六。新增传说、永恒、连续整理与旧日来信等卡片；邀请卡仍为占位，归因未接入。完善单张视频、Live 自动播放与全屏缩放，整理时仍由你决定照片的去留。", "en": "The collection grows to 28 bundled cards: twelve ordinary, ten themed and six on the three-star shelf. New Legend, Eternity, consecutive-day and Letter from the past cards; invitation cards remain placeholders without attribution support. Refined video, Live playback and fullscreen zoom keep your choices in your hands."}},

  {date:'2026-10-16',version:'0.9.127 (158)',tag:{zh:'已上传构建',en:'Build uploaded'},title:{zh:'故事有了封面，回望有了新的回响。',en:'A cover for your stories. New echoes of the past.'},body:{zh:'相册可自选最多七张封面、改名和置顶，编辑时预览轻轻聚拢。二十张成就卡分为三类，新增八张主题卡；回忆图谱默认按年展示，可探索年份区间与容量构成。瀑布流与单张模式共享敏捷小菜单，照片、视频和缓存构成也更清晰；成功操作积累成成长记录。完善首次语言选择、六段教程与生日星座。构建 158 已上传 App Store Connect，上传时 Apple 开始处理；尚未核验处理完成或外测分发。',en:'Choose up to seven album covers, rename and pin albums, and watch previews gather in Edit. Twenty achievement cards across three shelves, including eight new themed cards. Shared waterfall/single-photo quick menus, successful-action records, and clearer photo, video, and cache totals accompany yearly bars, year ranges, language choice, six guides, and birthday/zodiac profiles. Build 158 was uploaded to App Store Connect and entered Apple processing; completion and external distribution have not been verified.'}},
  {date:'2026-10-14',version:'0.9.51 — 0.9.60',tag:{zh:'浏览与手势',en:'Browsing & gestures'},title:{zh:'让动作更轻，让回忆不断。',en:'Lighter gestures. Unbroken memories.'},body:{zh:'喜欢、归档与相册编辑更快响应，失败会撤回对应操作。时间浏览条与日期气泡一起出现，可拖动穿梭；单图下滑、胶片切换和恢复反馈继续打磨。新增六段录屏教程，回忆图谱支持具体年份与区间。',en:'Likes, archiving, and album edits respond sooner, with rollback when an operation fails. A draggable timeline rail and date bubble, refined single-photo returns, filmstrip transitions, and recovery feedback. Six video guides and specific-year/range selection in Memory Atlas.'}},
  {date:'2026-10-14',version:'0.9.8 — 0.9.50',tag:{zh:'收藏与发现',en:'Collection & discovery'},title:{zh:'沿着星光，拾起新的碎片。',en:'Follow the starlight. Find another fragment.'},body:{zh:'成就收藏走进双列画廊，卡片随倾斜轻轻回应。五张神秘碎片藏起名字与故事，等待亲自发现。完善上滑暂存、下滑返回、相册信息与磨砂星空，让照片始终完整留在画面里。',en:'A two-column achievement gallery, with cards that respond gently to device tilt. Five mysterious fragments keep their names and stories veiled until discovered. Refined set-aside and return gestures, album readouts, and frosted starfields keep photographs complete and in view.'}},
  { date:'2026-10-13', version:'0.9.7 (38)', tag:{zh:'源码更新',en:'Source update'}, title:{zh:'常用的动作，就在手边。',en:'Keep familiar actions close.'}, body:{zh:'单图长按菜单跟随触点，保留五个最近成功添加的相册；上滑时预载的下一张自然接棒。成就详情轻触旋转，深下拉带来更完整的历险感，白昼主题也更清晰柔和。当前为源码进展，构建与上传待自行完成。',en:'A press-anchored photo menu with five recently used albums, and a preloaded next photo that takes over as you swipe. Tap to spin achievement details, explore deeper pull gestures, and enjoy a calmer, clearer Daylight theme. This is source progress; building and uploading remain pending.'}},
  { date:'2026-10-13', version:'0.9.4 — 0.9.6', tag:{zh:'设计打磨',en:'Design refinements'}, title:{zh:'让记忆盒，像一束柔和的光。',en:'A softer light for the memory box.'}, body:{zh:'逐步调整桌面图标的尺寸、位置与线宽，让盒子的轮廓更清楚；为线条加入磨砂玻璃、内部柔光与细微颗粒。五套主题图标同步打磨，保留记忆盒最初的辨识度。',en:'Refined the app icon’s scale, placement, and stroke weight for a clearer silhouette. Frosted glass, soft inner light, and fine grain add depth to the lines. All five theme icons share the same considered memory-box identity.'}},
  { date:'2026-10-13', version:'0.8.9 — 0.9.3', tag:{zh:'交互打磨',en:'Interaction refinements'}, title:{zh:'回望过去，也发现新的乐趣。',en:'Look back, and find something new.'}, body:{zh:'诗句随着下拉浮现，卡片在旋转与透视中回应探索；整理动作、相册信息与成功归档记录更加连贯。照片仍完整等比展示，喜欢与相册标识留在固定的位置，让每次选择都有清晰的回应。',en:'Poetry appears as you pull, while rotating cards and perspective invite exploration. Refined curation gestures, album information, and local records of successful actions. Photos remain complete and proportional, with stable favorite and album markers to make every choice feel clear.'}},
  { date:'2026-10-13', version:'0.8.8 (29)', tag:{zh:'源码更新',en:'Source update'}, title:{zh:'记忆，也有自己的面孔。',en:'A face for your memories.'}, body:{zh:'接入三款已确认的碎片女神头像，保留游客的选择；完善视频播放、成就翻卡、系统背景材质与浏览手势。回忆图谱统一按照片与视频计数。当前为源码更新，尚未构建或上传。',en:'Three approved fragment-goddess avatars with persistent guest preferences. Refined video playback, achievement-card flips, system background materials, and browsing gestures. Memory Atlas now counts photos and videos together. This source update has not been built or uploaded.'}},
  { date:'2026-10-12', version:'0.8.3 (24)', tag:{zh:'源码更新',en:'Source update'}, title:{zh:'让浏览更流畅，让去留更从容。',en:'A calmer way to browse and decide.'}, body:{zh:'快速日期轨、年 / 月跳转、横向扫选与相册筛选。全相册胶片条按需加载，回收站增加分页和设备倾斜。回忆图谱完善日期边界与资源大小说明。浏览与整理体验继续在真实设备上打磨。',en:'A draggable date rail, year/month navigation, sweep selection, and album filters. An on-demand filmstrip, paginated Trash with device tilt, and clearer Atlas date boundaries and size estimates. Browsing and curation continue to be refined on real devices.'}},
  { date:'2026-10-12', version:'0.8.2 (23)', tag:{zh:'私人内测',en:'Private beta'}, title:{zh:'从原型，走到你的 iPhone。',en:'From a prototype to your iPhone.'}, body:{zh:'构建 23 进入邀请制 TestFlight 内部测试。针对大图库优化单图加载和预览手势，完善真实账号与元数据备份；照片和视频留在系统图库。',en:'Build 23 entered invite-only internal TestFlight testing. Photo loading and preview gestures were refined for large libraries, alongside account access and metadata backups. Photos and videos remain in the system library.'}},
  { date:'2026-10-12', version:'0.5 — 0.8', tag:{zh:'设计打磨',en:'Design refinements'}, title:{zh:'碎片、星轨，以及恰好的留白。',en:'Fragments, constellations, and room to breathe.'}, body:{zh:'确认七张疏朗成就卡面，接入真实进度解锁与主题外光。完善玻璃记忆盒图标、星轨统计、完整等比照片容器，以及五秒 Mnemosyne 品牌开屏。',en:'Seven sparse achievement artworks, real progress-based unlocks, and a subtle theme glow. Glass memory-box icons, celestial statistics, aspect-fit photo containers, and a five-second Mnemosyne launch sequence.'}},
  { date:'2026-10-11', version:'0.2 — 0.5', tag:{zh:'交互与身份',en:'Interaction & identity'}, title:{zh:'回忆开始有了自己的形状。',en:'Memories begin to take shape.'}, body:{zh:'重建连续缩放与焦点补偿，增加照片 / 视频整理、You 身份舞台、真实整理统计、回忆图谱与五种主题。回收站重新设计拖动与物理交互。',en:'Continuous zoom with focal anchoring, photo/video curation, the You identity stage, activity statistics, Memory Atlas, and five themes. Trash drag gestures and physics were rebuilt.'}},
  { date:'2026-09-04', version:'', tag:{zh:'浏览性能',en:'Browsing performance'}, title:{zh:'让手势跟上你的直觉。',en:'Keeping up with your intuition.'}, body:{zh:'优化瀑布流缩放热路径，补齐跨密度连续手势。为布局加入可见区间索引，减少大图库缩放与滚动时的主线程开销。',en:'Refined the masonry zoom path and continuous gestures across densities. A visible-range index reduced layout work when scrolling and zooming through large libraries.'}},
  { date:'2026-08-28', version:'', tag:{zh:'预览与布局',en:'Preview & layout'}, title:{zh:'靠近一张照片，不打断浏览。',en:'A closer look, without losing your place.'}, body:{zh:'修复长按预览层级与点击关闭行为。照片位置和滚动偏移一起插值，让双指缩放的焦点保持稳定。',en:'Refined long-press preview layering and tap-to-dismiss behavior. Photo frames and scroll offsets interpolate together to preserve the pinch focal point.'}},
  { date:'2026-08-25', version:'', tag:{zh:'视觉与结构',en:'Visual foundations'}, title:{zh:'安静的界面，清晰的层次。',en:'Quiet surfaces. Clear structure.'}, body:{zh:'统一 Photos 功能区，建立磨砂标题、边缘暗角与日期跟随。整理页面、布局、手势和系统服务的代码边界。',en:'Unified Photos controls, frosted titles, subtle edge shading, and focal-date tracking. Separated pages, layouts, gestures, and system services.'}},
  { date:'2026-08-21', version:'', tag:{zh:'整理手势',en:'Curation gestures'}, title:{zh:'一划放下，随时回来。',en:'Set it aside. Come back whenever.'}, body:{zh:'串联单图与长按预览的上滑暂存动画。修复预览和网格的手势竞争，完善多选与恢复反馈。',en:'Connected upward-swipe animations in single-photo and long-press preview modes. Refined gesture coordination, selection, and recovery feedback.'}},
  { date:'2026-08-19 — 20', version:'', tag:{zh:'故事起点',en:'The beginning'}, title:{zh:'精简照片，让记忆更闪耀。',en:'Less in your library. More in your memories.'}, body:{zh:'建立 1 / 4 / 9、单列瀑布流、缩放焦点与长按预览。完成临时回收站、恢复、系统确认删除、Mne Archive 和基础统计。',en:'The first browsing layouts, masonry flow, anchored zoom, and long-press previews. Temporary Trash, recovery, system-confirmed deletion, Mne Archive, and initial statistics.'}}
];

let sceneMotion = null;
let contacts = null;
let details = null;
let albums = null;
let product = null;
let stories = null;
let farewell = null;
let sectionRail = null;
let language = 'zh';
let expanded = false;
try { language = localStorage.getItem('mne-site-language') || (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'); } catch { /* Storage may be disabled; browsing still works. */ }
if (!copy[language]) language = 'zh';
const timeline = document.querySelector('#timeline');
const timelineButton = document.querySelector('#timeline-expand');

function renderTimeline() {
  timeline.replaceChildren(...journal.map((entry, i) => {
    const article = document.createElement('article');
    article.className = 'timeline-entry reveal';
    article.hidden = i > 3 && !expanded;
    const date = document.createElement('div');
    date.className = 'timeline-date';
    const time = document.createElement('time');
    time.dateTime = entry.date.slice(0,10);
    time.textContent = entry.date;
    date.append(time);
    if (entry.version) { const version = document.createElement('small'); version.textContent = entry.version; date.append(version); }
    const heading = document.createElement('h3');
    heading.textContent = entry.title[language];
    const tag = document.createElement('span');
    tag.textContent = entry.tag[language];
    heading.append(tag);
    const body = document.createElement('p');
    body.textContent = entry.body[language];
    article.append(date, heading, body);
    return article;
  }));
  timelineButton.querySelector('[data-i18n]').textContent = copy[language][expanded ? 'journalLess' : 'journalMore'];
  timelineButton.querySelector('.expand-icon').textContent = expanded ? '−' : '+';
  timelineButton.setAttribute('aria-expanded', String(expanded));
  observeReveals();
}

function applyLanguage() {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = copy[language][el.dataset.i18n];
    if (value !== undefined) el.innerHTML = value; // Only the fixed local copy table contains markup.
  });
  document.querySelector('.lang-zh').classList.toggle('active', language === 'zh');
  document.querySelector('.lang-en').classList.toggle('active', language === 'en');
  document.querySelector('#language-toggle').setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
  document.title = language === 'zh' ? 'Mne — 记忆碎片，掌指之间。' : 'Mne — Fragments of memory, at your fingertips.';
  const description = language === 'zh' ? 'Mne，一款安静的 iPhone 照片整理 App。由你决定每张照片的去留，让真正的记忆更闪耀。' : 'Mne is a quiet, intuitive iPhone app for curating your photo library. Your photos. Your decisions. Room for what matters.';
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = description;
  const zh = language === 'zh';
  document.querySelector('.site-header nav').setAttribute('aria-label', zh ? '主导航' : 'Main navigation');
  document.querySelector('.brand').setAttribute('aria-label', zh ? 'Mne 首页' : 'Mne home');
  document.querySelector('.hero-stage').setAttribute('aria-label', zh ? 'Mne 界面示意' : 'Mne interface illustration');
  document.querySelector('#memory-chart').setAttribute('aria-label', zh ? '照片分布示例，非真实用户数据' : 'Illustrative photo distribution, not real user data');
  document.querySelector('#credits-close').setAttribute('aria-label', zh ? '关闭' : 'Close');
  renderTimeline();
  sceneMotion?.refresh();
  contacts?.refresh();
  details?.refresh();
  albums?.refresh();
  product?.refresh();
  stories?.refresh();
  farewell?.refresh();
  sectionRail?.refresh();
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  }
}, { threshold: .12, rootMargin: '0px 0px -20px 0px' }) : null;

function observeReveals() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    if (revealObserver && !reducedMotion.matches) revealObserver.observe(el);
    else el.classList.add('visible');
  });
}

document.querySelector('#language-toggle').addEventListener('click', () => {
  language = language === 'zh' ? 'en' : 'zh';
  try { localStorage.setItem('mne-site-language', language); } catch { /* Optional preference only. */ }
  applyLanguage();
});
timelineButton.addEventListener('click', () => { expanded = !expanded; renderTimeline(); });

const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress');
let pendingFrame = false;
function updateScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 30);
  const range = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${range > 0 ? y / range : 0})`;
  pendingFrame = false;
}
window.addEventListener('scroll', () => { if (!pendingFrame) { pendingFrame = true; requestAnimationFrame(updateScroll); } }, {passive:true});
window.addEventListener('resize', updateScroll, {passive:true});

const stage = document.querySelector('.hero-stage');
const phone = document.querySelector('.hero-phone');
stage.addEventListener('pointermove', event => {
  if (reducedMotion.matches || event.pointerType !== 'mouse') return;
  const rect = stage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - .5;
  const y = (event.clientY - rect.top) / rect.height - .5;
  phone.style.transform = `rotate(8deg) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
});
stage.addEventListener('pointerleave', () => { phone.style.transform = ''; });
reducedMotion.addEventListener('change', () => { phone.style.transform = ''; observeReveals(); });

const dialog = document.querySelector('#credits-dialog');
document.querySelector('#credits-open').addEventListener('click', () => dialog.showModal());
document.querySelector('#credits-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});

contacts = setupContacts({getLanguage:()=>language, text:key=>copy[language][key]});
details = setupDetails({text:key=>copy[language][key]});
albums = setupAlbums({text:key=>copy[language][key]});
product = setupProduct({text:key=>copy[language][key]});
applyLanguage();
sceneMotion = initMotion({getLanguage:()=>language, text:key=>copy[language][key], reducedMotion});
sceneMotion.refresh();
updateScroll();

stories = setupStories({text:key=>copy[language][key],product,reducedMotion});

farewell = setupFarewell({text:key=>copy[language][key]});
sectionRail = setupSectionRail({text:key=>copy[language][key],reducedMotion});
