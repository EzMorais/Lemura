## 2026-09-19T21:17:00Z

Lead Implementation Worker for Galeria Lemura technical improvements.
Working directory: d:\Lemura\.agents\worker_impl_1

Scope of Implementation:
1. R1: Room Count & Data (C1):
   - Update index.html lines 17 and 19: <span data-salas-total>12</span> instead of 16.
   - Update css/styles.css: .donut__value { stroke-dashoffset: 376.8; } instead of 408.2.
   - Update anuncie.html line 217: "São 12 salas na galeria e 3 ainda estão livres."
   - Ensure js/salas.js stat and donut initialization functions independently of LemuraTemplates.

2. R2: Accessibility (A1, A2, A3, A4, A5):
   - A1: Add skip link (<a class="lm-pular" href="#conteudo">Pular para o conteúdo</a>) as first child of <body> in index.html and 404.html. Add id="conteudo" to <main> in index.html. Add styles for .lm-pular and .lm-pular:focus in css/styles.css.
   - A2: Upgrade FAQ accordion in index.html with accessible ARIA attributes (buttons: id="faq-btn-N", aria-expanded="false", aria-controls="faq-panel-N"; panels: id="faq-panel-N", role="region", aria-labelledby="faq-btn-N", aria-hidden="true"). Rewrite js/script.js to toggle ARIA attributes cleanly without legacy Tailwind classes. Include <script src="js/script.js"></script> in index.html before </body>.
   - A3: Add universal :focus-visible rules in css/styles.css and css/vitrine.css, with high-contrast outlines for both light and dark backgrounds.
   - A4: Fix contrast issues: darken --lm-claro in css/vitrine.css to #4b4d53 (achieving >7.5:1 ratio). Darken .lm-diferenciais background to #636257 with white text (opacity 0.92). Darken .lm-vizinhos background to #765e56 with white text (opacity 0.92). Increase footer small text opacity to 0.60.

3. R3: Performance and Security (D1, D2, D3, D4):
   - D1: Remove <script src="https://cdn.tailwindcss.com"></script> and <script src="js/tailwind-config.js"></script> from index.html. Define .antialiased { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } in css/styles.css. Remove 'unsafe-eval' and https://cdn.tailwindcss.com from CSP script-src across all HTML files. Update SECURITY.md.
   - D2: Create assets/fonts/ directory. Download/save the 6 WOFF2 font files from Google Fonts (Figtree normal & italic, Space Mono 400 & 700 normal & italic). Add @font-face rules in css/styles.css referencing url("../assets/fonts/..."). Remove external Google Fonts preconnect and stylesheet links across all HTML files and scripts/gerar.mjs. Update CSP font-src and style-src to eliminate googleapis/gstatic.
   - D3 & D4: Generate responsive variants of hero-bg.jpg (assets/hero-bg-768.jpg and assets/hero-bg-1280.jpg). In index.html line 17, add srcset="assets/hero-bg-768.jpg 768w, assets/hero-bg-1280.jpg 1280w, assets/hero-bg.jpg 1920w" sizes="100vw" while strictly preserving src="assets/hero-bg.jpg" and fetchpriority="high". Add explicit width and height to modalidades.html images and loading="lazy" decoding="async" to localizacao.html.

4. R4: SEO, Schema & Metadata (C3, E2, E3):
   - C3: Add "url": "https://lemura.com.br/" and "telephone": "+55 15 99999-9999" (or real phone) to Schema.org LocalBusiness in index.html.
   - E2: Update og:image and twitter:image to absolute URLs (https://lemura.com.br/assets/og-image.jpg) in index.html, anuncie.html, lojas.html, modalidades.html, localizacao.html. Update js/lemura-config.js with siteUrl: "https://lemura.com.br" and run static generator.
   - E3: Update titles and meta descriptions in modalidades.html, localizacao.html, and anuncie.html to include "Porangaba" and "salas comerciais".

Test Execution & Build:
- Run the test suite:
  cmd /c 'set ELECTRON_RUN_AS_NODE=1 && "C:\Users\morai\AppData\Local\Programs\Microsoft VS Code\Code.exe" --test tests/*.test.mjs'
- Run the static generator:
  cmd /c 'set ELECTRON_RUN_AS_NODE=1 && "C:\Users\morai\AppData\Local\Programs\Microsoft VS Code\Code.exe" scripts/gerar.mjs'
- Ensure all tests pass with exit code 0.
- Deliver your detailed report to d:\Lemura\.agents\worker_impl_1\handoff.md and notify the orchestrator via send_message.
