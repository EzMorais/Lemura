# Project: Galeria Lemura Technical Improvements & Bugfixes

## Architecture
- **Static Core**: HTML5 (`index.html`, `404.html`, `modalidades.html`, `localizacao.html`, `anuncie.html`, `lojas.html`, `catalogo-fotos.html`).
- **Stylesheets**: `css/styles.css` (primary styles & custom properties), `css/vitrine.css` (vitrine & common UI).
- **Scripts**: Pure zero-dependency vanilla JS (`js/lemura-config.js`, `js/lemura-core.js`, `js/lemura-templates.js`, `js/salas.js`, `js/destaques.js`, `js/script.js`).
- **Data Models**: `data/salas.js` (12 commercial spaces: 9 occupied, 3 vacant), `data/lojistas.js` (merchant catalog).
- **Static Generator**: `scripts/gerar.mjs` generating `/lojas/<slug>/index.html`, `sitemap.xml`, and `robots.txt`.
- **Testing**: Node.js built-in test runner (`tests/site.test.mjs`, `tests/e2e.test.mjs`, `tests/assets.test.mjs`, `tests/challenger_stress.test.mjs`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | R1.1 | Correct static HTML room count (`data-salas-total="12"`, `data-salas-vagas="3"`) in `index.html` | M1 | ORIGINAL_REQUEST §R1 |
| 2 | R1.2 | Correct SVG donut offset (`376.8` for 25% free / 75% occupied) in `css/styles.css` & `js/salas.js` | M1 | ORIGINAL_REQUEST §R1 |
| 3 | R1.3 | Correct copy in `anuncie.html` ("São 12 salas na galeria") | M1 | Survey Obs 1.5 |
| 4 | R2.1 (A1) | Skip link `.lm-pular` pointing to `<main id="conteudo">` on all public pages (`index.html`, `404.html`) | M2 | ORIGINAL_REQUEST §R2 |
| 5 | R2.2 (A2) | Accessible FAQ Accordion (`aria-expanded`, `aria-controls`, panel IDs, `role="region"`, `aria-hidden`, and load `js/script.js`) | M2 | ORIGINAL_REQUEST §R2 |
| 6 | R2.3 (A3) | Universal `:focus-visible` styling for interactive elements on light & dark backgrounds | M2 | ORIGINAL_REQUEST §R2 |
| 7 | R2.4 (A4) | WCAG AA Contrast fixes (`--lm-claro`, `--lm-salvia`, `--lm-madeira`, footer text) | M2 | ORIGINAL_REQUEST §R2 |
| 8 | R2.5 (A5) | Screen-reader & no-JS static attribute parity | M2 | ORIGINAL_REQUEST §R2 |
| 9 | R3.1 (D1) | Eliminate Tailwind CDN & CSP `'unsafe-eval'`; consolidate `.antialiased` into `css/styles.css` | M3 | ORIGINAL_REQUEST §R3 |
| 10 | R3.2 (D2) | Self-host Figtree & Space Mono fonts (6 WOFF2 files in `assets/fonts/`), `@font-face`, remove Google CDN links and CSP font domains | M3 | ORIGINAL_REQUEST §R3 |
| 11 | R3.3 (D3) | Image optimization (`width`, `height`, `loading="lazy"`, `decoding="async"`) across static pages | M3 | ORIGINAL_REQUEST §R3 |
| 12 | R3.4 (D4) | Hero image responsive variants (`hero-bg-768.jpg`, `hero-bg-1280.jpg`) via `srcset` maintaining `fetchpriority="high"` & test compatibility | M3 | ORIGINAL_REQUEST §R3 |
| 13 | R4.1 (C3) | Schema.org `LocalBusiness` in `index.html` with valid `url` and `telephone` | M4 | ORIGINAL_REQUEST §R4 |
| 14 | R4.2 (E2) | Open Graph `og:image` absolute URLs (`https://lemura.com.br/assets/og-image.jpg`) across all pages | M4 | ORIGINAL_REQUEST §R4 |
| 15 | R4.3 (E3) | SEO keywords ("Porangaba" and "salas comerciais") in title and description of `modalidades.html`, `localizacao.html`, and `anuncie.html` | M4 | ORIGINAL_REQUEST §R4 |
| 16 | R5.1 | Comprehensive E2E test suite additions, 100% test pass, static build pass, adversarial and forensic audit validation | M5 | Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Room Count & Data Corrections | R1.1, R1.2, R1.3 (`index.html`, `css/styles.css`, `anuncie.html`, `js/salas.js`) | none | **DONE** |
| 2 | M2: Accessibility WCAG AA | R2.1 - R2.5 (`index.html`, `404.html`, `js/script.js`, `css/styles.css`, `css/vitrine.css`) | M1 | **DONE** |
| 3 | M3: Performance & Security | R3.1 - R3.4 (Tailwind CDN removal, CSP hardening, local WOFF2 fonts, image optimizations & responsive hero) | M2 | **DONE** |
| 4 | M4: SEO, Schema & Metadata | R4.1 - R4.3 (Schema.org `LocalBusiness`, absolute `og:image`, titles/meta descriptions, `scripts/gerar.mjs`) | M3 | **DONE** |
| 5 | M5: E2E Verification & Forensic Audit | Full test suite expansion (119/119 tests pass), adversarial stress tests, forensic audit clean verdict | M1, M2, M3, M4 | **DONE** |

## Key Outputs
- Test Suite: 119 tests passed across 17 suites in 369ms (100% pass rate, 0 failures).
- Static Generator: 6 stores generated, `sitemap.xml` and `robots.txt` updated.
- Security: CSP enforces `script-src 'self'` (0 occurrences of `'unsafe-eval'`), `font-src 'self'` (0 external font CDNs).
- Accessibility: 100% WCAG AA compliant on skip links, FAQ accordion, focus indicators, and text contrast.
- Data Integrity: 12 rooms total, 3 vacant, SVG donut offset 376.8 (25% free) both static and dynamic.
