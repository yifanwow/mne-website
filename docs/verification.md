# Website 2.4.0 verification · 2026-10-27

- `scripts/whats-new-qa.mjs` passes Chromium and WebKit for Chinese/English at 1780×1000, 1440×1000, 768×1024, 390×844 and 320×720. Globe place switching, three-photo reshuffle, remove/restore, count, zoom and keyboard rotation work. Visible rotation stops for global Pause, offscreen and Reduce Motion, and resumes after Pause. No page exceptions, missing resources or horizontal overflow occurred in those layouts.
- Twelve theme buttons respond. Available author-photo examples and explicit App-only placeholders switch correctly. Multi-selection retains other choices when closing, toggling or staging the current preview; reset works. A long press opens the actual pressed image, and an upward gesture stages only that image. New demos leave existing growth records unchanged. A separate WebKit mobile context with touch enabled passes real tap controls and keyboard selection.
- All four independent new cards switch their native story. PNGs match the committed App originals byte for byte; unlock conditions are absent from their UI. Desktop and phone screenshots reviewed under ignored `artifacts/update-2026-10-27/`. Element screenshots may include the existing fixed navigation at the capture viewport; real-device testing remains separate.
- Existing `scripts/evolution-qa.mjs` passes both engines at the same ten language/size combinations: original Journey review/create, eight independent palettes/icons, compact five-icon editing overview, pause/resume and privacy routes stay functional. Original thirty-card data is untouched.
- Removed the three inserted sections and their stylesheet reference from current HTML, normalized only cache version and source badge, and compared against 2.3.1: exact match. Preserved privacy HTML aliases/CSS/JS, existing card data and editing copy retain opening hashes; Journey code differs only in the asset cache version.
- Syntax, asset existence, bilingual copy, IDs, anchors and diff whitespace checks pass. Feature reference is committed App 0.9.478 (509), `5464db4`; later uncommitted 0.9.479 backend footprints are not presented as a released capability. No App build/test/static-check/device action, backend operation or SMB deployment occurred.

# Website 2.3.1 verification · 2026-10-25

- Restored the exact compact photo-editing section from 2.2.1: five SVG icon tiles, bilingual heading and short description, between Experience and Small things. Removed the replaced editor state, handlers, styles and unused copy. All other page content matches 2.3.0 after ignoring cache version changes.
- Updated `scripts/evolution-qa.mjs` passes Chromium and WebKit at five widths (1780, 1440, 768, 390 and 320), both languages: five static tiles, section order, no overflow, page exceptions or failed resources. Journey review/create, independent theme/icon selection, pause/resume and Reduce Motion remain functional. Desktop and 320px phone screenshots reviewed.
- Syntax/assets/copy checks pass. The four privacy files retain their opening hashes. This is a website-only update; NAS has not been synchronized.

# Website 2.3.0 verification · 2026-10-25

- `scripts/evolution-qa.mjs` passes Chromium and WebKit, Chinese/English at 1780×1000, 1440×1000, 768×1024, 390×844 and 320×720. Two seven-cover journey groups open; unchecking a tentative photo changes the draft count; confirming review, renaming, rejecting a blank name, creating and restarting work. Entered markup remains text. Demo actions leave growth records unchanged.
- Eight palettes and eight original App icons are independently selectable; changing palette retains the icon and keyboard focus. Five editor tools render; date/place suggestions stay in the draft until the illustrated save, and save does not reset Live preferences. Screenshots were reviewed at desktop and narrow phone widths under ignored `artifacts/update-2026-10-25/`.
- Entry sequence pause/resume and Reduce Motion pass both engines. A timer callback guard checks motion preference, visibility and manual takeover before advancing. Page exceptions, failed local-resource requests and horizontal overflow are absent in the covered layouts.
- `scripts/collection-qa.mjs` passes both engines/languages at 320×720 for all 30 cards, forward keyboard navigation, three categories, reduced-motion stories, re-entry counters and all 24 expanded journal entries. `scripts/stories-qa.mjs` passes Chromium at 10 layouts for existing scroll stories, pause/resume and manual reduced-motion steps.
- Privacy HTML aliases, CSS and JS retain their exact opening hashes; `/privacy`, `/privacy/` and `/privacy.html` return 200 locally. Ten new App artwork/icon files match their source bytes. Public asset permissions are readable. Syntax, local assets, bilingual keys, unique IDs, anchors and the new diff whitespace checks pass. Existing font-license text is preserved verbatim.
- The prior temporary WebKit cache could launch but lacked window resources and could not create a page. A complete temporary WebKit 26.5 install at `/private/tmp/mne-webkit-check-20261025` supplied the passing WebKit runs; Chromium used `/private/tmp/mne-playwright`. QA_ENGINE selects each engine for the new and collection suites. No iOS checks, build, simulator, backend operation, or NAS synchronization occurred. Browser emulation does not replace physical-device testing.
- Website snapshot: 2.3.0. App reference: local 0.9.385 (416), commit 55b6e09 plus working changes, not a release receipt. Existing 2.2.1 privacy work is backed up separately before this feature update. Full static ZIP includes the preserved privacy pages and excludes infrastructure configuration.

## Earlier verification

# Website 2.1.1 verification · 2026-10-23

- Focused Chromium and WebKit browser checks pass Chinese/English at 1440×1000, 768×1024, 390×844 and 320×720. DOM order is Experience → Photo editing → Small things, with one editing overview and all five tools. Introductory copy and language-specific sharing metadata update correctly, with no horizontal overflow, page errors or failed resource requests.
- Experience scroll progresses through browsing, close view and recovery, and reverses back to browsing after the content move. Editing overview remains visible under Reduce Motion. Screenshots under ignored `artifacts/v20/` were reviewed for desktop and phone copy and editing layout.
- JavaScript syntax, local assets, unique IDs, anchors, bilingual keys and whitespace checks pass. This is a website copy/layout update; no App or NAS operations were performed. Delivery is a complete static 2.1.1 ZIP; local preview remains running.

## Earlier verification

# Website 2.1.0 verification · 2026-10-23

- `scripts/album-icons-qa.mjs` passes Chromium and WebKit in Chinese/English at 1440×1000, 768×1024, 390×844 and 320×720. Default plus 21 icon options use three columns; modal bounds and labels fit. Selection applies immediately, persists through cancel/Done and language changes, and can restore default. Done does not delete an album. Cover selection, rename, keyboard reorder and reset retain the intended icon state. Row, quick-archive bubble and 02A menu share the chosen symbol without incrementing growth counts or duplicating SVG IDs.
- A focused Chromium smoke run selects every one of the 21 options, reopens the picker and verifies its selected state. Desktop and narrow English picker screenshots are visually reviewed under ignored `artifacts/v19/`; icon labels wrap within tiles and the scrolling body retains a fixed header. Memory-box SVG keeps its production geometry with a tighter icon viewBox.
- `scripts/native-ui-qa.mjs` passes both engines, 10 layouts each: four albums, seven different photos per album (28 total), pointer-following drag/reorder, cover selection, rename and growth detail opening. No document overflow, page errors or failed resource requests.
- `scripts/latest-qa.mjs` passes both engines, 12 layouts each: passive metadata, plant/building previews, independent archive/video filters, six App theme choices with four unavailable web previews, Escape and reduced motion. `scripts/stories-qa.mjs` passes both engines, 10 layouts each: two stories advance/reverse, fit their viewport, pause/resume and retain manual steps under Reduce Motion. Scroll demonstrations do not record growth activity.
- Website syntax, static assets, unique HTML IDs, bilingual keys and whitespace pass. No iOS engineering or NAS deployment is part of this update. Browser emulation does not replace physical-device testing. Delivery is a full static 2.1.0 ZIP; preview remains available locally.

## Earlier verification

# Website 2.0.0 verification · 2026-10-23

- `scripts/latest-qa.mjs` passes Chromium and WebKit, Chinese/English, at 1780×1000, 1440×1000, 1024×900, 768×1024, 390×844 and 320×720. Five metadata fields are visible without a button. Theme examples switch, archive/video filters stay independent of the main photo filter, media preference survives a theme change, six chooser entries fit inside the phone, and Escape dismisses the chooser. Three unsupported photographic previews remain explicitly unavailable rather than displaying invented examples. No page/resource errors or horizontal overflow.
- Main feature prose computes to at least 16px; responsive edits simplify copy instead of reducing core reading sizes. Desktop/mobile screenshots were reviewed under ignored `artifacts/v18/`, including 320px English metadata and the final desktop theme layout. The enlarged mobile header stays on one line.
- `scripts/stories-qa.mjs` passes both engines/languages at five sizes. Both five-step stories advance/reverse correctly, fit the pinned viewport, preserve counts, pause/resume, and offer manual steps under Reduce Motion.
- `scripts/collection-qa.mjs` passes all 28 cards across three categories in both engines/languages at 320×720, with visible controls. Category switching, reduced motion, repeated-entry counters and all 22 expanded journal entries pass. A concise short-screen introduction and content-dependent artwork budget preserve larger card prose.
- All website/maintenance JavaScript syntax, static references, bilingual keys, unique IDs and whitespace pass. These checks apply only to the website; no iOS build, App tests, device operation, backend change or NAS deployment was performed. Local App source snapshot is 0.9.320 (351), not a public-release claim.
- Delivery is a full static 2.0.0 ZIP with per-file hashes. Local preview is retained for review; the website source is backed up separately from the private App repository.

## Earlier verification

# Website 1.9.4 photo verification · 2026-10-20

- Chromium and WebKit pass a photo smoke check at 1440×1000 and 390×844. The selected single-photo image and active filmstrip image both use the author's existing `moon.webp`; it loads correctly, remains visible in the close-view phase and returns after the recovery animation. No page errors. Static references, bilingual copy, unique IDs, syntax of modified motion code, and whitespace checks pass.
- The change swaps Moon and Autumn in the same demonstration array, preserving unique assets and existing transitions. Other sections retain their current layout. Screenshots are under ignored `artifacts/v17/`.
- NAS update uses `scripts/sync-nas.mjs`, targeting the existing SMB-mounted `/Volumes/docker/mne-website`. The script backs up the old project first, preserves the live `site` directory, writes the new index last, and preserves Docker/Nginx configuration. Post-sync file manifest and production checks are recorded in the task; no iOS source is modified.

## Earlier verification

# Website 1.9.3 layout verification · 2026-10-20

- Chromium and WebKit pass a geometry smoke check of Quick Actions and Quick Duplicate Check in Chinese/English at 1710×1000, 1920×1200, 1440×900, 1024×768 and 768×1024. While pinned, the combined text/visual content is vertically centered below the fixed header: upper/lower clear-space difference stays within 25px and pinned content fits within the viewport.
- `scripts/stories-qa.mjs` passes both engines/languages at five desktop/tablet/mobile sizes, covering all five steps forward and backward, preview states, no recorded growth changes, no clipping/overflow, pause/resume, and manual static steps under Reduced Motion. The new minimum height applies only to the two-column layout with normal motion; phone stacking remains unchanged.
- Chinese and English desktop screenshots under ignored `artifacts/v16/` were visually reviewed. Static references, bilingual keys, unique IDs and whitespace pass. Full static delivery is 1.9.3; no iOS or NAS changes.

## Earlier verification

# Website 1.9.2 navigation verification · 2026-10-20

- Chromium and WebKit smoke checks pass Chinese/English at 1640×900, 1710×1000, 1920×1080 and 1640×600. Directory text computes to 12px and the current chapter to 14px; active state follows Experience, Farewell and Insights. The active entry remains within the scrollable directory in short windows.
- The rail fits below the site header and within the viewport, with at least 45px clear space before main content (54px at the minimum supported width), no horizontal overflow or page errors. Collapse/expand and a chapter jump under Reduced Motion pass; the rail stays hidden at 1440px. Desktop Chinese and English screenshots under ignored `artifacts/v15/` were visually reviewed after transitions settled.
- Static reference, bilingual copy, unique ID, whitespace and modified JavaScript syntax checks pass. Delivery is full static website 1.9.2; no App changes or NAS deployment.

## Earlier verification

# Website 1.9.1 visual verification · 2026-10-20

- A browser smoke check in Chromium and WebKit covers Chinese/English at 1440×1000, 768×1024, 390×844 and 320×720. All 13 marketing headings from Experience through Quick Duplicate Check have a theme-purple opening phrase and a white continuation, using the existing `.lilac` token. No horizontal document overflow or page script errors.
- Desktop Details and mobile Experience screenshots were visually reviewed under ignored `artifacts/v14/`. Copy, font sizes, natural wrapping and animation logic remain unchanged; native App UI headings keep their existing styling.
- Website JavaScript syntax, bilingual keys, local references, unique IDs and whitespace pass. Full NAS static replacement package is 1.9.1; App source is unchanged.

## Earlier verification

# Website 1.9.0 verification · 2026-10-20

- `scripts/experience-qa.mjs`: Chromium and WebKit pass Chinese/English at 1780×1000, 1440×1000, 768×1024, 390×844 and 320×720. The moved single-photo story advances through hold, favorite, dismissal, reopen, recent-album archive, feedback, set-aside and restore, and rewinds with native scrolling. Metadata remains fixed relative to the phone; the menu stays inside its width and clear of top chrome / filmstrip. No horizontal document overflow or site resource/runtime errors.
- Hero and Experience copy use the requested new wording in both languages. At 1780 px, the unobtrusive rail has a transparent panel and at least 100 px clear space before the content. Collapse/expand works; smaller viewports hide the rail. Its unchanged persistence/jump implementation was covered in 1.8.0.
- `scripts/stories-qa.mjs`: both engines/languages at 1440×1000, 1024×900, 768×1024, 390×844 and 320×720 pass the two five-step stories forward and backward. Quick actions remains in waterfall mode throughout, showing the preview for steps 1–3 and dismissing it at step 4; the old single overlay remains hidden. Pause/resume, Reduced Motion manual steps, fit within the sticky viewport and unchanged cumulative activity totals pass.
- Desktop and narrow mobile screenshots were visually reviewed under ignored `artifacts/v13/`, including Chinese 390 px and English 320 px. All website/maintenance JavaScript syntax, static asset references, bilingual keys, unique IDs and whitespace checks pass.
- This is website-only verification, not a physical device / Vivaldi or iOS build claim. App source is unchanged at 0.9.190 (221). Deliver a full static ZIP with SHA-256 manifest; no NAS access or server configuration changes. Local preview remains running.

## Earlier verification

# Website 1.8.0 verification · 2026-10-20

- `scripts/refine-qa.mjs`: Chromium and WebKit pass Chinese/English at 1780×1000, 1440×1000, 1024×900, 768×1024, 390×844 and 320×720. Chapter order places design before Experience and interactive Farewell immediately after Atlas. No horizontal document overflow; both shortened scroll stories fit the pinned viewport.
- Atlas defaults to 2017—2026 with ten yearly bars and total 24,680. Week/month/year and bars/trend/pie preserve totals; year subsets change the range summary independently of Farewell.
- Farewell supports two date bases, year bounds, three periods and three charts; totals stay 6,240 across grouping and date-basis changes. A date range without deletion events returns zero with a clear empty state; crossed bounds normalize. Lifetime 7,860 is unchanged. Keyboard End reads the last bucket; pie has at most twelve entries.
- At 1780 px the page rail highlights the current chapter, collapses/expands, preserves its preference on reload and jumps by click. It is hidden below 1640 px and does not overlap the content gutter. Test navigation explicitly disables smooth scrolling before deterministic geometry assertions.
- Updated single-photo demonstration retains the existing phase behavior and shows separate metadata/tool chrome, fixed status/pill and nine filmstrip thumbnails. Small English screenshots of the larger capacity and growth readouts were inspected; figures fit at 320 px.
- `scripts/stories-qa.mjs` passes both engines/languages at five widths: two five-step scenes advance and reverse, do not create activity records, support pause/resume and reduce to static/manual steps under Reduce Motion. Runways are remeasured so later card scenes retain their trigger positions.
- The 28-card collection, both languages at 320×720, all category captions/controls, Reduced Motion, 20 expanded journal entries and repeated-entry counters reaching 32,768 pass in Chromium and WebKit.
- Current captures are under ignored `artifacts/v12/`; desktop rail/design/history, English mobile capacity/growth and the single-photo layout were visually reviewed. Website syntax, local references, unique IDs and bilingual keys pass. No physical iPhone, iOS App tests/build, Vivaldi or NAS deployment is claimed.
- Delivery remains a full static replacement ZIP with SHA-256 manifest, preserving existing NAS infrastructure. Local preview remains running.

## Previous verification

# Website 1.7.0 verification · 2026-10-20

- Source snapshot confirmed against GitHub at the start and end of work: `294634c4728d928d1f179ab7de3d690d38ba47c5`, App 0.9.190 (221). Only the website is changed; no iOS tests, static checks, build, simulator, archive, account action or NAS deployment was run.
- `scripts/stories-qa.mjs`: Chromium and WebKit, Chinese and English at 1440×1000, 1024×900, 768×1024, 390×844 and 320×720. All three five-step stories advance and reverse with page scroll, fit their sticky viewport and contain complete native demonstration surfaces without horizontal document overflow. Shortcut preview/single menus and Farewell range counts match the presented step. Scrolling does not add to cumulative growth.
- Both engines pass Reduce Motion's static/manual chapter navigation and removal of long scroll runways, plus pause/freeze/resume. Final small-English copy and explicit bounded-grid frosting were checked again in both engines after visual refinements.
- `scripts/native-ui-qa.mjs`: four seven-photo albums with 28 distinct photos, real pointer-following drag/reorder, seven cover slots/candidates, pinned covers, rename retention and growth details pass in Chromium/WebKit; both languages at the same five sizes remain free of horizontal overflow. Default Chinese album names are four two-character titles.
- `scripts/product-touch-qa.mjs`: Chinese/English at 390×844, native Chromium touch drag, WebKit tap/keyboard flows, cover changes, capacity disclosures and growth dialogs pass. These are browser-engine checks, not physical iPhone or Vivaldi verification.
- `scripts/collection-qa.mjs`: every one of the 28 card captions/navigation states, category counts 12/10/6, Reduced Motion galleries, repeated-entry counters and all 20 expanded journal entries pass in both engines and languages at 320×720. Mysteries remain veiled; cards show stories, not unlock conditions.
- All website/maintenance JavaScript syntax, direct asset paths, unique IDs, bilingual keys and whitespace pass. Screenshots under ignored `artifacts/v11/` were visually reviewed, including desktop and narrow English mobile. Previous album/card check suites retain their existing ignored screenshot folders.
- Full static replacement ZIP includes updated instructions and a per-file SHA-256 manifest, excluding Docker/Nginx/server configuration. Local preview remains running at the user's request.

## Earlier verification

# Website 1.6.0 verification · 2026-10-17

- Chromium and WebKit pass Chinese and English at 1440×1000, 1024×900, 768×1024, 390×844 and 320×720 without horizontal document overflow or site errors. Current screenshots are under ignored `artifacts/v10/`; final viewport captures were reviewed separately to avoid fixed-header and entrance-transition capture artifacts.
- Four albums each contain seven photographs, with 28 unique assets across albums. Actual mouse dragging changes order in both engines; the lifted row is measured to follow pointer coordinates. Cover slots/candidates, ordered pinned covers and retained custom names pass.
- Grid preview has recent album bubbles and a horizontal action strip. Single-photo mode uses a distinct vertical menu, clamped to the photo surface with a maximum 272 px width. Favorite/membership sharing, removing from actual memberships, and dismissal after single-mode actions pass.
- Storage open/close and expandable breakdown use the App's reference model and layout. Growth statistics open the corresponding detail dialog, including processed action counts and reviewed time/print-area panels.
- At 390×844 in both languages, Chromium native touch events verify dragging from the reorder handle, cover choice, single-photo actions, album addition/removal, storage disclosures and growth details. WebKit native tap flows pass; its reorder is keyboard-tested in that mobile run, with actual mouse drag covered by the desktop run. These checks are not physical iPhone or Vivaldi verification.
- Static validation covers JavaScript syntax, asset paths, bilingual keys, unique IDs and whitespace. Production module/style URL revisions are 1.6.0. No iOS build or NAS update was performed. Local preview remains running at the user's request.

## Website 1.5.0 verification · historical

- Chromium and WebKit pass both languages at 1440×1000, 1024×900, 768×1024, 390×844 and 320×720: no horizontal overflow or clipped interactive controls in album, shortcut, or storage/growth modules.
- Album edit gathers rows to 85 px, unfolds the main row to 168 px, retains a custom name, changes cover choice, and changes actual DOM order upward/downward and to the top.
- Waterfall and single-photo menus share favorite/membership state; completed actions appear in the illustrative activity trail. Removing membership does not reduce cumulative progress. Overlay dismissal cannot accidentally hover-select a thumbnail behind it.
- Storage totals reproduce the documented low/reference/high model (13.14/14.31/16.14 GB). Reference photo/cache and video/cache scopes are 11.26/2.99 GB. Model disclosure and Reduced Motion controls work.
- Native browser touch checks in Chromium and WebKit at 390×844, Chinese and English, pass reorder, cover selection, both menu modes, membership preservation, activity totals and storage selection.
- JavaScript syntax, asset paths, bilingual keys, unique IDs and whitespace checks pass. Screenshots were reviewed under ignored artifacts/v9/. Long element captures can include fixed header/skip-link overlays outside their normal viewport; these are capture artifacts.
- Local preview remains running at the user's request. No NAS connection, iOS build or physical device testing. Website 1.5.0 does not change App 0.9.127 (158).

## Earlier checks

Version 1.4.0:

- Source content verified from GitHub commit cf56cac2ce6a4f8e241f2dfcae058254ef3f322c (App 0.9.127 / 158), not inferred from local uncommitted files. New cards use the corresponding original asset sets and names/stories from MemorySeal and AppLanguage.
- Chromium and WebKit pass feature interactions and Chinese/English layout at 1440, 1024, 768, 390 and 320 px: four/two/one columns, no horizontal overflow, visible switches/info/ratio controls, portrait quick menu, six correct ratio frames, complete logo replay, and current source badge/journal.
- Both engines pass album edit gather/unfold, name editing, cover choice and pin feedback; three card category sizes (6/8/6), five obscured mysteries and keyboard End/Home; Atlas range filtering, crossed-bound normalization, total restoration, storage expansion and annual grouping.
- On 320×720, both engines pass all twenty card captions in both languages with controls inside the viewport, sixteen journal entries and preserved expansion on language change, repeated-entry counters, and all three Reduced Motion category grids. Caption height changes refit the artwork.
- Mobile WebKit passes touch checks at 320, 390 and 768 px in both languages: native vertical scrolling, sixty changing card frames, photo filter/readout/menu/ratio controls, single-row contacts, and learn-more dialog.
- Desktop, English mobile and Reduced Motion screenshots visually reviewed; current images are under ignored artifacts/v8/. Final harbor orientation and stack-photo decoration were visually checked separately; they do not change layout geometry.
- JavaScript syntax, asset references, unique IDs, bilingual keys and whitespace checked. No iOS build, real device test, Vivaldi test or NAS deployment was performed in this request.
- Deliverable is a full static site update ZIP with offline instructions and SHA-256 manifest. Existing NAS infrastructure files are excluded.

## Historical verification

### 2026-10-13

Version 1.3.2 feature-card layout checks:

- 02B uses four portrait cards in one desktop row, two columns at ≤1000 px, and one column at ≤600 px. All four visual areas share a 370 px height; flexible galleries leave room for the controls in both languages.
- Chromium and WebKit pass Chinese and English layout checks at 1440, 1024, 768, 390 and 320 px: expected column counts, no horizontal overflow, portrait cards, and no clipped switches, hints or ratio controls. Screenshots were visually reviewed under ignored `artifacts/v7/details/`.
- Archive filtering, information expansion/collapse, hover and click album-menu behavior, album feedback, and six-image ratio geometry continue to pass in both engines. The quick-album photo is portrait again; all 31 photographs remain unique across the page.
- Logo replay, five-year chart and current App development entry remain verified. Release URLs now use 1.3.2.

Version 1.3.1 interaction, artwork and journal checks:

- Before the fix, both Chromium and WebKit desktop tests confirmed that all three ratio choices produced the same capped 184 px height. The information click also overlapped with its hover state. This reproduced a visible-feedback defect, rather than a failed click handler, on the tested browsers.
- After the fix, six photographs form a calculated masonry layout. Adaptive mode retains three original proportions; fixed 9:16 and 4:6 modes have measured correct geometry and visibly different dimensions. Images remain complete. The quick-album image is a true landscape photograph.
- Information explicitly expands and collapses; its readout grows by 16 px in both desktop engines. Hover-open album menus respond to click and reopen, and album actions remain functional. Critical controls initialize before decorative motion. Release-version URLs prevent mixing cached module and stylesheet revisions.
- The 01 logo animates on entry, hover and click, then retains all five complete strokes. Reduce Motion keeps a static complete logo. The mobile prologue has 44 px bottom spacing.
- The cleaning statistic uses an inline SVG sun. The illustration spans January 2022 through October 13, 2026, with 58 monthly groups and five yearly groups. Weekly/monthly/yearly totals remain 1,284; long pie charts keep the twelve-sector cap.
- Development notes and source badge now reflect local App source 0.9.7 (38), with three additional chronological entries and 13 total entries. Building/uploading is still described as pending, in agreement with the App checklist.
- Full Chromium checks pass at five viewport sizes in Chinese and English; mobile WebKit passes at 320, 390 and 768 px in both languages. Dedicated desktop Chromium and WebKit interaction/geometry checks pass. Screenshots are under ignored `artifacts/v6/`.
- Vivaldi verification uses an isolated temporary profile only; it never reads the user's normal profile. The installed application did not initialize under the pipe-based automation launch. Its normal user-profile behavior is not inferred from that startup failure.
- A subsequent standard DevTools connection also failed to initialize this installed Vivaldi in the isolated environment. No Vivaldi pass is claimed. After the completed browser runs, decorative demo images and the status toast were made non-intercepting; an additional desktop rerun was not approved and was stopped. That last CSS adjustment has static validation only.

Version 1.3.0 mobile and product-feature checks passed:

- Chromium: Chinese and English at 320, 390, 768, 1024 and 1440 px. Existing gallery, card touch/keyboard, statistics, chart, journal, QR, pause and Reduce Motion checks pass.
- WebKit: Chinese and English at 320, 390 and 768 px. Mobile text aligns left; contact icons stay in a single row with accessible names. The philosophy marker is SVG, avoiding emoji presentation.
- Card scroll updates are combined into animation frames. Card width is cached outside the scroll path; mobile animated blur/shadow filters and competing CSS transitions are removed. All 60 sampled WebKit scroll frames produce changing card transforms. This is an engine-level interaction check, not a physical iPhone frame-rate guarantee.
- The moving mobile browser bar does not remap card sizes for small height changes. Enlarged captions and cards fit the viewport in both languages, including 320 px English.
- 02B: archive filtering and restoration, photo readout, desktop hover menu, long press, touch menu, archive/recent-album feedback, Escape, ratio choices and translated feedback pass. Ratio demo images use contain, matching the app's complete-image layout.
- All 28 photograph elements use distinct assets across the hero, 02A and 02B. Seventeen additional exports come from the owner's original folder with EXIF omitted.
- The learn-more dialog links to photography, writing and the personal website.
- Update script tested on a local copy of the NAS project: configuration is preserved, a full backup is retained, only changed website bytes are replaced and all 53 packaged files pass SHA-256 verification. It does not restart containers.
- Screenshots were visually reviewed; this revision's captures are under ignored `artifacts/v5/`.

The live NAS `/healthz` returned `ok` before this website synchronization. Public delivery of the new bytes is checked after synchronization; no container rebuild or infrastructure change is required for a static bind mount.

NAS deployment preparation:

- Compose YAML parses correctly; loopback port binding, read-only site/config mounts, temporary runtime directories and healthcheck are checked.
- Standalone deployment staging and SHA-256 verification pass for all 34 packaged files.
- Docker and Nginx runtime validation are pending on NAS: this Mac has no Docker, and NAS SSH refused the connection. No container, DNS record, certificate or reverse proxy has been started/changed by this preparation.
- Finder share is mounted at `/Volumes/docker`, corresponding to the existing NAS `/volume1/docker` layout. Container startup instructions are in `docs/nas-hosting.md`.

Version 1.2.0 composition checks passed in local Chromium at 320, 390, 768, 1024 and 1440 px:

- Updated Chinese copy, matching English copy and document titles. The philosophy description includes the requested line break.
- Navigation is independently centered on the viewport; primary button labels are centered while arrows remain on the right. Both measured in the browser.
- Expanded memory-box design panel shows the original logo geometry and app icon, with separate SVG gradient identifiers.
- Larger scroll demos and card artwork adapt to viewport height. Chinese and English scene descriptions and card controls remain visible.
- Focused cards have an opaque foreground, raised placement, stronger light and pointer-driven sheen; neighboring cards recede with perspective, dimming and blur. Existing scroll, touch and keyboard navigation continue to pass.
- Leaving the statistics and returning restarts the count animation; final values are verified after each return.
- Denser twinkling stars, glowing points and an occasional meteor remain controlled by the pause button and system Reduce Motion.
- Existing chart, language persistence, QR, timeline, SVG, static assets and runtime error checks all pass. Desktop and mobile screenshots were visually reviewed.

Screenshots for this revision are under ignored `artifacts/v4/`.

Version 1.1.1 refinement checks passed in a full browser run across all five viewport widths:

- The finished SVG Logo was rasterized in the browser; the central vertical stroke is visible. It also remains visible after drawing finishes.
- Author signature is “叙己 / Tell your story”; album references have been removed from the rendered page.
- Photos and cards begin moving while their respective heading is visible, checked independently of the scene's progress mapping. Headings remain above the artwork during the pinned section.
- Portfolio contact links match the current public personal site. WeChat QR works on hover, click, touch and Escape; its panel stays within the viewport.
- Existing forward/reverse scrolling, card touch, language, chart, counter, timeline, pause and reduced-motion checks continue to pass.

Version 1.1 adds the owner's photography, scroll scenes, seven-card collection, production app geometry, and the memory-box animation.

Passed in local Chromium:

- Chinese and English at 320, 390, 768, 1024 and 1440 px: no horizontal overflow, clipped content regions, broken images, JavaScript errors or failed site requests.
- Native scroll advances and reverses the gallery / single-photo / set-aside-and-restore demonstration.
- Vertical scroll traverses all seven cards. Buttons, arrow keys, Home / End, original descriptions and language changes retain the selected card.
- Emulated mobile touch events swipe the card collection horizontally while vertical touch still scrolls the page.
- Entrance counters reach their declared illustrative values.
- Weekly, monthly and yearly grouping, trend / bars / pie switching, chart inspection, and total preservation. Long pie distributions display at most twelve sectors including Other.
- Ten journal entries, expansion / collapse, language persistence and credits-dialog Escape dismissal.
- Motion pause freezes the background. Reduced Motion replaces the pinned collection with a static grid containing every card and its story.
- Static source checks: JavaScript syntax, local assets, unique IDs, section anchors and both languages for every translation key.
- Visual review of desktop, tablet and phone screenshots; selected original photos were reviewed before export.

The initial full browser run covered the five viewport sizes. A focused interaction run verified the remaining controls and the selection-preservation fix. Browser emulation does not replace physical iPhone / iPad Safari testing. NAS has not been deployed.

## Original version · 2026-10-12

Passed in a local Chromium browser:

- Chinese and English at 320, 390, 768, 1024 and 1440 px widths.
- No document horizontal overflow, broken images, JavaScript exceptions or failed site requests.
- Language switching and persistence after reload.
- Single / four / nine tile illustration controls and accessible selected state.
- Trend / bar chart switching with the same illustrative dataset.
- Four visible journal entries, expansion to nine, language switch while expanded, and collapse.
- Credits dialog opening and Escape dismissal.
- Reduced-motion content visibility.
- Static checks: JavaScript syntax, unique HTML IDs, local asset paths, section links, and both language strings for every translation key.
- Visual review of desktop, tablet and mobile captures.

Screenshots are checkout-local under ignored `artifacts/` and are not published to GitHub. Browser checks require Playwright and its Chromium browser, independently of the dependency-free website:

```sh
node scripts/browser-qa.mjs
```

If Playwright is bundled elsewhere, set `PLAYWRIGHT_MODULE` to its absolute `index.mjs` path and `PLAYWRIGHT_BROWSERS_PATH` to the installed browser directory.

Limits: browser emulation is not physical iPhone/iPad Safari testing. NAS has not been deployed. Interface and statistics are illustrations, not live app screenshots or real user data. Current photography is the owner's authorized work.
