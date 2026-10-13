# Website verification · 2026-10-13

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
