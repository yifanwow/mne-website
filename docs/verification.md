# Website verification · 2026-10-12

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

Limits: browser emulation is not physical iPhone/iPad Safari testing. NAS has not been deployed. The website uses illustrative phone/gallery/chart content, not live app screenshots or real user data.
