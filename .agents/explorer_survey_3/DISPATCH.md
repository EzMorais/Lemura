## 2026-09-20T00:08:52Z
<USER_REQUEST>
You are Survey Explorer 3 for Galeria Lemura improvements.
Your working directory is: d:\Lemura\.agents\explorer_survey_3
You MUST read d:\Lemura\.agents\ORIGINAL_REQUEST.md and d:\Lemura\PLANO-MELHORIAS.md before starting.
Your scope is R3 (Performance & Security D1-D4) and R4 (SEO & Metadata C3, E2, E3):
- R3 / D1: Tailwind CDN removal in index.html, removal of 'unsafe-eval' from CSP, and consolidation into static local CSS. Check what Tailwind utilities or styles index.html actually uses that might be missing in css/styles.css.
- R3 / D2: Self-hosting Figtree & Space Mono fonts in assets/fonts/ (WOFF2 format). Check current external font links (fonts.googleapis.com, fonts.gstatic.com), CSP font-src / style-src directives, and @font-face declarations needed. Check if font files already exist or need to be downloaded/placed.
- R3 / D3 & D4: Image optimization: width, height, loading='lazy', fetchpriority='high' on hero image, responsive variants for hero-bg.jpg.
- R4 / C3: Schema.org LocalBusiness in index.html (add valid url and telephone).
- R4 / E2: og:image absolute URLs across HTML pages.
- R4 / E3: SEO keywords ('Porangaba' and 'salas comerciais') in title and meta description tags of static pages (modalidades.html, localizacao.html, anuncie.html).
- Check existing tests in tests/ (e.g. tests/e2e.test.mjs, tests/site.test.mjs, tests/assets.test.mjs) and scripts (scripts/gerar.mjs).
- Detail exact files, lines, required code modifications, and test considerations.
- Deliver your report in d:\Lemura\.agents\explorer_survey_3\handoff.md and notify the orchestrator via send_message.
</USER_REQUEST>
