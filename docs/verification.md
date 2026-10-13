# Website verification · 2026-10-13

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
