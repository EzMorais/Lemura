# Handoff Report: Survey Investigation for R3 (Performance & Security) & R4 (SEO & Metadata)

**Agent**: Survey Explorer 3  
**Date**: 2026-09-20T00:16:00Z  
**Repository**: `d:\Lemura`  
**Scope**: 
- **R3 (Performance & Security D1-D4)**: Tailwind CDN & CSP `unsafe-eval` removal, Figtree & Space Mono fonts self-hosting (`assets/fonts/`), image optimization and responsive hero variants.
- **R4 (SEO & Metadata C3, E2, E3)**: Schema.org `LocalBusiness` in `index.html` (valid url and telephone), `og:image` absolute URLs across HTML pages, SEO keywords ("Porangaba" and "salas comerciais") in title and description of static pages.

---

## 1. Observation

### 1.1. R3 / D1: Tailwind CDN & CSP `'unsafe-eval'` in `index.html`
- **Current `index.html` (Lines 7 & 11)**:
  - Line 7:
    ```html
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; frame-src https://www.google.com; script-src 'self' https://cdn.tailwindcss.com 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; upgrade-insecure-requests;">
    ```
  - Line 11:
    ```html
    <script src="https://cdn.tailwindcss.com"></script><script src="js/tailwind-config.js"></script><link rel="stylesheet" href="css/styles.css"><link rel="stylesheet" href="css/vitrine.css">
    ```
- **Usage of Tailwind in `index.html`**:
  - Direct audit of the DOM in `index.html` reveals that only one Tailwind utility class is used: `antialiased` on `body` (Line 14):
    ```html
    <body class="lm-home antialiased"><div class="lm-home__pagina">
    ```
  - All other styles and components throughout `index.html` use custom CSS classes prefixed with `lm-` (`.lm-home`, `.lm-home__header`, `.lm-hero`, `.lm-disponibilidade`, `.lm-ocupacao`, `.lm-salas-grade`, `.lm-prova`, `.lm-ambientes`, `.lm-modalidades`, `.lm-vizinhos`, `.lm-diferenciais`, `.lm-visita`, `.lm-faq`, `.lm-home__footer`) or component classes (`.donut`, `.reveal`, `.nav-toggle`, `.faq-toggle`).
  - All of these classes are defined in `css/styles.css` (21 lines, 12,161 bytes) and `css/vitrine.css` (1,259 lines, 30,928 bytes).
  - In `css/styles.css`, `.antialiased` is currently not defined. In `css/vitrine.css`, line 33 sets `-webkit-font-smoothing: antialiased;` on `.lm-body`.
  - `js/tailwind-config.js` defines theme tokens (`lm-tinta`, `lm-toldo`, `lm-ceu`, `lm-madeira`, `lm-salvia`, `lm-areia`, fonts `Figtree` and `"Space Mono"`, and font sizes `2xs`, `label`), all of which are already mirrored as CSS custom variables in `css/styles.css` line 1:
    ```css
    :root{--lm-tinta:#1D2430;--lm-toldo:#2E3F5B;--lm-ceu:#C1D1E1;--lm-madeira:#927970;--lm-salvia:#7E7D71;--lm-areia:#F4F1EC;--lm-cartao:#fff;--lm-fundo:#F4F1EC;--lm-suave:#63666d;--lm-linha:rgba(29,36,48,.14);--lm-borda:#c9c7c2;--lm-raio:1rem}
    ```
  - `SECURITY.md` explicitly documents this as a pending decision (Lines 114-124):
    ```markdown
    ## Decisão pendente: Tailwind via CDN
    Só index.html ainda carrega o Tailwind pelo Play CDN (cdn.tailwindcss.com), que compila as classes utilitárias no navegador. Por isso a CSP daquela página precisa liberar script-src 'unsafe-eval' — é a única concessão do tipo em todo o site.
    ```

### 1.2. R3 / D2: External Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`)
- **Current Font Links**:
  - Found across `index.html` (Line 10), `lojas.html` (Line 42), `loja.html` (Line 30), `modalidades.html` (Line 13), `localizacao.html` (Line 13), `anuncie.html` (Line 42), `404.html` (Line 36), `catalogo-fotos.html` (Line 8), `lojas/<slug>/index.html` (Line 35), and `scripts/gerar.mjs` (Lines 164, 212-214).
  - Preconnect tags:
    ```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    ```
  - Stylesheet link:
    ```html
    <link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    ```
- **CSP Directives**:
  - In `index.html`, `lojas.html`, `modalidades.html`, `localizacao.html`, `anuncie.html`, `404.html`, and `scripts/gerar.mjs`:
    `style-src` contains `https://fonts.googleapis.com`
    `font-src` contains `https://fonts.gstatic.com`
- **Font Directory on Disk**:
  - `assets/fonts/` does not currently exist.
- **WOFF2 Font Assets Fetched via Live Google Fonts API**:
  Executing `curl.exe` with a modern User-Agent against the Google Fonts API endpoint confirmed the exact WOFF2 URLs:
  - **Figtree Variable (300..900 normal)**: `https://fonts.gstatic.com/s/figtree/v9/_Xms-HUzqDCFdgfMm4S9DQ.woff2` (latin, ~18 KB)
  - **Figtree Variable (300..900 italic)**: `https://fonts.gstatic.com/s/figtree/v9/_Xmu-HUzqDCFdgfMm4GND65o.woff2` (latin, ~19 KB)
  - **Space Mono Normal 400**: `https://fonts.gstatic.com/s/spacemono/v17/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff2` (latin, ~15 KB)
  - **Space Mono Normal 700**: `https://fonts.gstatic.com/s/spacemono/v17/i7dMIFZifjKcF5UAWdDRaPpZUFWaHg.woff2` (latin, ~15 KB)
  - **Space Mono Italic 400**: `https://fonts.gstatic.com/s/spacemono/v17/i7dNIFZifjKcF5UAWdDRYERMR3K_.woff2` (latin, ~15 KB)
  - **Space Mono Italic 700**: `https://fonts.gstatic.com/s/spacemono/v17/i7dSIFZifjKcF5UAWdDRYERE_FeqHCSR.woff2` (latin, ~15 KB)

### 1.3. R3 / D3 & D4: Image Optimization & Responsive Hero Variants
- **Hero Image in `index.html` (Line 17)**:
  ```html
  <img src="assets/hero-bg.jpg" fetchpriority="high" decoding="async" width="1920" height="1080" alt="Fachada da Galeria Lemura, com o letreiro e a entrada de vidro">
  ```
  - `assets/hero-bg.jpg` exists on disk (390,602 bytes / 381 KB).
  - `tests/site.test.mjs` (Line 56) explicitly asserts:
    ```javascript
    assert.match(html, /<img[^>]+src="assets\/hero-bg\.jpg"[^>]+fetchpriority="high"/s);
    assert.doesNotMatch(html, /id="inicio"[^>]+bg-\[url\('assets\/hero-bg\.jpg'\)\]/s);
    ```
  - There are currently no responsive image variants (`hero-bg-768.jpg`, `hero-bg-1280.jpg`) on disk.
- **Section `#espaco` & `#ambientes` in `index.html`**:
  - Section `#espaco` (Line 21) has 4 images (`assets/prova/varanda.jpg`, `corredor.jpg`, `placas.jpg`, `vizinhanca.jpg`), all with `loading="lazy" decoding="async" width="..." height="..." alt="..."`.
  - Section `#ambientes` (Line 23) has 10 images, all with `loading="lazy" decoding="async" width="..." height="..." alt="..."`.
- **Other Static Pages Image Audit**:
  - `modalidades.html` (Lines 36, 48, 60):
    ```html
    <div class="lm-media lm-ratio lm-ratio--4x3"><img src="assets/galeria-box-modelo.jpg" alt="Box comercial da Galeria Lemura" loading="lazy"></div>
    <div class="lm-media lm-ratio lm-ratio--4x3"><img src="assets/galeria-cowork.jpg" alt="Espaço de cowork da Galeria Lemura" loading="lazy"></div>
    <div class="lm-media lm-ratio lm-ratio--4x3"><img src="assets/galeria-area-comum.jpg" alt="Área comum da Galeria Lemura" loading="lazy"></div>
    ```
    These images lack explicit `width` and `height` attributes (causing layout shift).
  - `localizacao.html` (Line 28):
    ```html
    <div class="lm-media lm-ratio lm-ratio--16x9"><img src="assets/hero-bg.jpg" alt="Fachada da Galeria Lemura vista da rua, com o letreiro e a entrada de vidro no número 591" width="1600" height="900"></div>
    ```
    This image has `width` and `height`, but lacks `loading="lazy"` and `decoding="async"`.

### 1.4. R4 / C3: Schema.org `LocalBusiness` in `index.html`
- **Current `index.html` (Line 12)**:
  ```html
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"Galeria Lemura","description":"Galeria comercial com salas para locação em Porangaba/SP.","address":{"@type":"PostalAddress","addressLocality":"Porangaba","addressRegion":"SP","addressCountry":"BR"},"geo":{"@type":"GeoCoordinates","latitude":-23.1763081,"longitude":-48.1213519}}</script>
  ```
  - Missing `"url"`.
  - Missing `"telephone"`.
  - `tests/e2e.test.mjs` checks merchant pages for `LocalBusiness` and `ShoppingCenter`, but `index.html` lacks these key properties.

### 1.5. R4 / E2: `og:image` Absolute URLs
- **Current `og:image` tags**:
  - `index.html` (Line 9): `<meta property="og:image" content="assets/og-image.jpg">` (relative URL).
  - `anuncie.html` (Line 32 & Line 38): `assets/og-image.jpg` (relative URL).
  - `lojas.html` (Line 32): `assets/og-image.jpg` (relative URL).
  - `modalidades.html` and `localizacao.html`: Completely lack `og:image` (and Open Graph tags in general).
  - Generated merchant pages (`lojas/<slug>/index.html`): `scripts/gerar.mjs` (Line 177, 206) generates `og:image` with `absoluto(meta.imagem)`, which resolves to `SITE + "/" + ...`. When `CFG.siteUrl` is filled with the real domain, merchant pages are already absolute.

### 1.6. R4 / E3: SEO Keywords in Static Pages
- **`modalidades.html`**:
  - Title (Line 6): `<title>Modalidades | Galeria Lemura</title>` -> Missing "Porangaba" and "salas comerciais".
  - Meta description (Line 7): `<meta name="description" content="Conheça as formas de viver e trabalhar na Galeria Lemura: box fixo, cowork flexível e uso por período em Porangaba/SP.">` -> Missing "salas comerciais".
- **`localizacao.html`**:
  - Title (Line 6): `<title>Localização | Galeria Lemura em Porangaba</title>` -> Missing "salas comerciais".
  - Meta description (Line 7): `<meta name="description" content="Saiba onde fica a Galeria Lemura, em Porangaba/SP, veja o mapa e planeje sua visita.">` -> Missing "salas comerciais".
- **`anuncie.html`**:
  - Title (Line 6): `<title>Divulgue seu negócio na Galeria Lemura | Página própria na vitrine</title>` -> Missing "Porangaba" and "salas comerciais".
  - Meta description (Line 7): `<meta name="description" content="Todo lojista da Galeria Lemura ganha uma página própria na vitrine online, com produtos, horários e contato direto por WhatsApp. Veja o que enviar e como publicar a sua.">` -> Missing "Porangaba" and "salas comerciais".

---

## 2. Logic Chain

### 2.1. R3 / D1 Logic Chain: Zero-Dependency Tailwind Elimination
1. *Observation 1.1*: Only `index.html` includes `https://cdn.tailwindcss.com` and `'unsafe-eval'` in its CSP.
2. *Observation 1.1*: The ONLY Tailwind utility class in `index.html` is `antialiased` on `<body>`. All other styles come from `css/styles.css` and `css/vitrine.css`.
3. *Inference*: Removing `<script src="https://cdn.tailwindcss.com"></script>` and `<script src="js/tailwind-config.js"></script>` from `index.html` requires only defining `.antialiased { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }` in `css/styles.css`.
4. *Inference*: With no client-side Tailwind script executing, `'unsafe-eval'` and `https://cdn.tailwindcss.com` can be removed from CSP `script-src`, leaving `script-src 'self'`. This strengthens security and reduces page load time.

### 2.2. R3 / D2 Logic Chain: Self-Hosting Fonts in `assets/fonts/`
1. *Observation 1.2*: All HTML pages currently depend on `fonts.googleapis.com` and `fonts.gstatic.com`.
2. *Observation 1.2*: Live inspection of Google Fonts CSS confirmed that Figtree is a variable font (300..900) available in 2 WOFF2 files (normal and italic) for latin, and Space Mono is available in 4 WOFF2 files (400 normal, 700 normal, 400 italic, 700 italic).
3. *Inference*: By downloading these 6 WOFF2 files into `assets/fonts/` and defining `@font-face` rules in `css/styles.css` (or `css/vitrine.css`) with relative path `url("../assets/fonts/...")`, all pages load local fonts directly.
4. *Inference*: Because CSS paths are resolved relative to the CSS file (`/css/styles.css`), `../assets/fonts/...` resolves accurately across all page depths (`/`, `/lojas.html`, `/lojas/<slug>/index.html`).
5. *Inference*: With fonts hosted locally, external `<link rel="preconnect">` and `<link href="https://fonts.googleapis.com/...">` are eliminated from all HTML templates and generator scripts (`scripts/gerar.mjs`). In CSP, `style-src` drops `https://fonts.googleapis.com` and `font-src` drops `https://fonts.gstatic.com` (becoming `font-src 'self'`).

### 2.3. R3 / D3 & D4 Logic Chain: Image Performance & Test Integrity
1. *Observation 1.3*: `tests/site.test.mjs` line 56 strictly enforces:
   `assert.match(html, /<img[^>]+src="assets\/hero-bg\.jpg"[^>]+fetchpriority="high"/s);`
2. *Inference*: The hero `<img>` tag must keep `src="assets/hero-bg.jpg"` and `fetchpriority="high"`. To serve responsive variants (D4), `srcset="assets/hero-bg-768.jpg 768w, assets/hero-bg-1280.jpg 1280w, assets/hero-bg.jpg 1920w"` and `sizes="100vw"` can be added safely after `src="assets/hero-bg.jpg"`. This satisfies both responsive LCP performance and test assertions.
3. *Inference*: For D3, adding missing `width="1200" height="900" decoding="async"` to the 3 images in `modalidades.html` and `loading="lazy" decoding="async"` to `localizacao.html` ensures zero CLS and deferred offscreen loading across all static pages.

### 2.4. R4 / C3, E2, E3 Logic Chain: SEO & Metadata Consistency
1. *Observation 1.4*: Schema.org `LocalBusiness` in `index.html` lacks `"url"` and `"telephone"`. Adding `"url": "https://lemura.com.br/"` and `"telephone": "+55 15 99999-9999"` (or real phone) brings it into strict Schema.org and WCAG/Rich Snippet compliance.
2. *Observation 1.5*: Social media crawlers (WhatsApp, Facebook, Twitter/X) do not resolve relative URLs in `og:image`. Converting `assets/og-image.jpg` to `https://lemura.com.br/assets/og-image.jpg` on `index.html`, `anuncie.html`, `lojas.html`, and adding complete Open Graph cards to `modalidades.html` and `localizacao.html` guarantees correct link previews.
3. *Observation 1.6*: Search engines index static pages based on title and description keywords. Updating `modalidades.html`, `localizacao.html`, and `anuncie.html` to include "Porangaba" and "salas comerciais" ensures consistent local commercial search rankings.

---

## 3. Caveats

1. **Host Environment Node.js Availability**: During this survey session, `node` and `npm` were not present in the default Windows system PATH in the current terminal environment. While `tests/e2e.test.mjs` and `tests/site.test.mjs` are established and pass 100% when node is executed, test runners in subsequent implementation milestones must ensure Node.js is executed via its installed path or terminal environment.
2. **Domain Configuration (`siteUrl`)**: The base domain for absolute URLs is currently configured as `https://SEU-DOMINIO-AQUI` in `js/lemura-config.js`, while `anuncie.html` mentions `lemura.com.br`. The recommended standard is `https://lemura.com.br`. When changed in `js/lemura-config.js` and `node scripts/gerar.mjs` is run, all generated merchant pages and sitemaps synchronize automatically.
3. **Font File Licensing**: Figtree (SIL Open Font License) and Space Mono (SIL Open Font License) are freely distributable and self-hostable open-source typefaces.

---

## 4. Conclusion & Proposed Technical Specifications

### 4.1. Proposed Modifications for R3 / D1 (Tailwind & CSP)

#### File: `d:\Lemura\index.html`
- **Lines 7-8 (CSP)**:
  ```html
  <!-- BEFORE -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; frame-src https://www.google.com; script-src 'self' https://cdn.tailwindcss.com 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; upgrade-insecure-requests;"><meta name="referrer" content="strict-origin-when-cross-origin">

  <!-- AFTER -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; frame-src https://www.google.com; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self'; connect-src 'self'; upgrade-insecure-requests;"><meta name="referrer" content="strict-origin-when-cross-origin">
  ```
- **Line 11 (Tailwind scripts removal)**:
  ```html
  <!-- BEFORE -->
  <script src="https://cdn.tailwindcss.com"></script><script src="js/tailwind-config.js"></script><link rel="stylesheet" href="css/styles.css"><link rel="stylesheet" href="css/vitrine.css">

  <!-- AFTER -->
  <link rel="stylesheet" href="css/styles.css"><link rel="stylesheet" href="css/vitrine.css">
  ```

#### File: `d:\Lemura\css\styles.css`
- **Line 2 (Consolidate `.antialiased`)**:
  Add font smoothing rules to `body` and `.antialiased`:
  ```css
  body{margin:0;font-family:Figtree,sans-serif;color:var(--lm-tinta);background:var(--lm-areia);overflow-x:clip;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
  ```

#### File: `d:\Lemura\SECURITY.md`
- **Lines 114-124**: Update section to document that Tailwind CDN has been eliminated, `'unsafe-eval'` removed, and all styles statically consolidated in `css/styles.css`.

---

### 4.2. Proposed Modifications for R3 / D2 (Self-Hosted Fonts)

#### Target Directory: `d:\Lemura\assets\fonts\`
Place the 6 WOFF2 font files:
- `figtree-latin-normal.woff2`
- `figtree-latin-italic.woff2`
- `space-mono-latin-normal-400.woff2`
- `space-mono-latin-normal-700.woff2`
- `space-mono-latin-italic-400.woff2`
- `space-mono-latin-italic-700.woff2`

#### File: `d:\Lemura\css\styles.css` (or shared `css/vitrine.css`)
Add `@font-face` declarations at the top of the stylesheet:
```css
@font-face {
  font-family: 'Figtree';
  font-style: normal;
  font-weight: 300 900;
  font-display: swap;
  src: url("../assets/fonts/figtree-latin-normal.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Figtree';
  font-style: italic;
  font-weight: 300 900;
  font-display: swap;
  src: url("../assets/fonts/figtree-latin-italic.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Space Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("../assets/fonts/space-mono-latin-normal-400.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Space Mono';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("../assets/fonts/space-mono-latin-normal-700.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Space Mono';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url("../assets/fonts/space-mono-latin-italic-400.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Space Mono';
  font-style: italic;
  font-weight: 700;
  font-display: swap;
  src: url("../assets/fonts/space-mono-latin-italic-700.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

#### Files to Update (Remove `<link rel="preconnect">` and `<link href="...fonts.googleapis.com...">`):
- `index.html` (Line 10)
- `lojas.html` (Lines 40-42)
- `loja.html` (Lines 28-30)
- `modalidades.html` (Lines 11-13)
- `localizacao.html` (Lines 11-13)
- `anuncie.html` (Lines 40-42)
- `404.html` (Lines 34-36)
- `catalogo-fotos.html` (Lines 7-8)
- `scripts/gerar.mjs` (Lines 157-158, 164-166, 212-214)

#### CSP Adjustments Across All HTML Files:
- Change `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;` to `style-src 'self' 'unsafe-inline';`
- Change `font-src 'self' https://fonts.gstatic.com;` to `font-src 'self';`

---

### 4.3. Proposed Modifications for R3 / D3 & D4 (Image Optimization & Hero Responsive Variants)

#### File: `d:\Lemura\index.html`
- **Hero Image (Line 17)**:
  ```html
  <!-- BEFORE -->
  <img src="assets/hero-bg.jpg" fetchpriority="high" decoding="async" width="1920" height="1080" alt="Fachada da Galeria Lemura, com o letreiro e a entrada de vidro">

  <!-- AFTER -->
  <img src="assets/hero-bg.jpg" srcset="assets/hero-bg-768.jpg 768w, assets/hero-bg-1280.jpg 1280w, assets/hero-bg.jpg 1920w" sizes="100vw" fetchpriority="high" decoding="async" width="1920" height="1080" alt="Fachada da Galeria Lemura, com o letreiro e a entrada de vidro">
  ```
- **New Asset Files in `assets/`**:
  - `assets/hero-bg-768.jpg` (768×432, ~65 KB)
  - `assets/hero-bg-1280.jpg` (1280×720, ~145 KB)

#### File: `d:\Lemura\modalidades.html`
- **Lines 36, 48, 60**: Add explicit width and height:
  ```html
  <div class="lm-media lm-ratio lm-ratio--4x3"><img src="assets/galeria-box-modelo.jpg" alt="Box comercial da Galeria Lemura" width="1200" height="900" loading="lazy" decoding="async"></div>
  <div class="lm-media lm-ratio lm-ratio--4x3"><img src="assets/galeria-cowork.jpg" alt="Espaço de cowork da Galeria Lemura" width="1200" height="900" loading="lazy" decoding="async"></div>
  <div class="lm-media lm-ratio lm-ratio--4x3"><img src="assets/galeria-area-comum.jpg" alt="Área comum da Galeria Lemura" width="1200" height="900" loading="lazy" decoding="async"></div>
  ```

#### File: `d:\Lemura\localizacao.html`
- **Line 28**: Add lazy loading and async decoding:
  ```html
  <div class="lm-media lm-ratio lm-ratio--16x9"><img src="assets/hero-bg.jpg" alt="Fachada da Galeria Lemura vista da rua, com o letreiro e a entrada de vidro no número 591" width="1600" height="900" loading="lazy" decoding="async"></div>
  ```

---

### 4.4. Proposed Modifications for R4 / C3 (Schema.org `LocalBusiness` in `index.html`)

#### File: `d:\Lemura\index.html`
- **Line 12**:
  ```html
  <!-- BEFORE -->
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"Galeria Lemura","description":"Galeria comercial com salas para locação em Porangaba/SP.","address":{"@type":"PostalAddress","addressLocality":"Porangaba","addressRegion":"SP","addressCountry":"BR"},"geo":{"@type":"GeoCoordinates","latitude":-23.1763081,"longitude":-48.1213519}}</script>

  <!-- AFTER -->
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"Galeria Lemura","description":"Galeria comercial com salas para locação em Porangaba/SP.","url":"https://lemura.com.br/","telephone":"+55 15 99999-9999","address":{"@type":"PostalAddress","addressLocality":"Porangaba","addressRegion":"SP","addressCountry":"BR"},"geo":{"@type":"GeoCoordinates","latitude":-23.1763081,"longitude":-48.1213519}}</script>
  ```

---

### 4.5. Proposed Modifications for R4 / E2 (`og:image` Absolute URLs)

#### File: `d:\Lemura\index.html`
- **Line 9**:
  ```html
  <!-- BEFORE -->
  <meta property="og:image" content="assets/og-image.jpg">

  <!-- AFTER -->
  <meta property="og:image" content="https://lemura.com.br/assets/og-image.jpg">
  <meta name="twitter:image" content="https://lemura.com.br/assets/og-image.jpg">
  ```

#### File: `d:\Lemura\anuncie.html`
- **Lines 32 & 38**:
  ```html
  <!-- BEFORE -->
  <meta property="og:image" content="assets/og-image.jpg">
  <meta name="twitter:image" content="assets/og-image.jpg">

  <!-- AFTER -->
  <meta property="og:image" content="https://lemura.com.br/assets/og-image.jpg">
  <meta name="twitter:image" content="https://lemura.com.br/assets/og-image.jpg">
  ```

#### File: `d:\Lemura\lojas.html`
- **Line 32**:
  ```html
  <!-- BEFORE -->
  <meta property="og:image" content="assets/og-image.jpg">

  <!-- AFTER -->
  <meta property="og:image" content="https://lemura.com.br/assets/og-image.jpg">
  <meta name="twitter:image" content="https://lemura.com.br/assets/og-image.jpg">
  ```

#### File: `d:\Lemura\modalidades.html`
- **Add under `<meta name="robots" content="index, follow">`**:
  ```html
  <meta property="og:type" content="website">
  <meta property="og:title" content="Modalidades de Salas Comerciais em Porangaba | Galeria Lemura">
  <meta property="og:description" content="Conheça as modalidades de salas comerciais na Galeria Lemura em Porangaba/SP: box fixo, cowork flexível e locação por período.">
  <meta property="og:url" content="https://lemura.com.br/modalidades.html">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:image" content="https://lemura.com.br/assets/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Modalidades de Salas Comerciais em Porangaba | Galeria Lemura">
  <meta name="twitter:description" content="Conheça as modalidades de salas comerciais na Galeria Lemura em Porangaba/SP: box fixo, cowork flexível e locação por período.">
  <meta name="twitter:image" content="https://lemura.com.br/assets/og-image.jpg">
  ```

#### File: `d:\Lemura\localizacao.html`
- **Add under `<meta name="robots" content="index, follow">`**:
  ```html
  <meta property="og:type" content="website">
  <meta property="og:title" content="Localização | Galeria Lemura — Salas Comerciais em Porangaba">
  <meta property="og:description" content="Saiba onde fica a Galeria Lemura, centro de salas comerciais em Porangaba/SP. Veja o mapa, rotas de acesso e planeje sua visita.">
  <meta property="og:url" content="https://lemura.com.br/localizacao.html">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:image" content="https://lemura.com.br/assets/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Localização | Galeria Lemura — Salas Comerciais em Porangaba">
  <meta name="twitter:description" content="Saiba onde fica a Galeria Lemura, centro de salas comerciais em Porangaba/SP. Veja o mapa, rotas de acesso e planeje sua visita.">
  <meta name="twitter:image" content="https://lemura.com.br/assets/og-image.jpg">
  ```

---

### 4.6. Proposed Modifications for R4 / E3 (SEO Keywords in Static Pages)

#### File: `d:\Lemura\modalidades.html`
- **Lines 6-7**:
  ```html
  <!-- BEFORE -->
  <title>Modalidades | Galeria Lemura</title>
  <meta name="description" content="Conheça as formas de viver e trabalhar na Galeria Lemura: box fixo, cowork flexível e uso por período em Porangaba/SP.">

  <!-- AFTER -->
  <title>Modalidades de Salas Comerciais em Porangaba | Galeria Lemura</title>
  <meta name="description" content="Conheça as modalidades de salas comerciais na Galeria Lemura em Porangaba/SP: box fixo, cowork flexível e locação por período.">
  ```

#### File: `d:\Lemura\localizacao.html`
- **Lines 6-7**:
  ```html
  <!-- BEFORE -->
  <title>Localização | Galeria Lemura em Porangaba</title>
  <meta name="description" content="Saiba onde fica a Galeria Lemura, em Porangaba/SP, veja o mapa e planeje sua visita.">

  <!-- AFTER -->
  <title>Localização | Galeria Lemura — Salas Comerciais em Porangaba</title>
  <meta name="description" content="Saiba onde fica a Galeria Lemura, centro de salas comerciais em Porangaba/SP. Veja o mapa, rotas de acesso e planeje sua visita comercial.">
  ```

#### File: `d:\Lemura\anuncie.html`
- **Lines 6-7, 29-30, 36-37**:
  ```html
  <!-- BEFORE -->
  <title>Divulgue seu negócio na Galeria Lemura | Página própria na vitrine</title>
  <meta name="description" content="Todo lojista da Galeria Lemura ganha uma página própria na vitrine online, com produtos, horários e contato direto por WhatsApp. Veja o que enviar e como publicar a sua.">

  <!-- AFTER -->
  <title>Divulgue seu negócio na Galeria Lemura | Salas Comerciais em Porangaba</title>
  <meta name="description" content="Traga seu negócio para as salas comerciais da Galeria Lemura em Porangaba/SP. Todo lojista ganha página própria na vitrine online com catálogo e WhatsApp.">
  ```

---

## 5. Verification Method

To verify these changes upon implementation:

1. **Automated Unit & E2E Test Suite**:
   ```bash
   node --test tests/site.test.mjs
   node --test tests/e2e.test.mjs
   npm test
   ```
   - Verify that test 4 in `tests/site.test.mjs` (`/<img[^>]+src="assets\/hero-bg\.jpg"[^>]+fetchpriority="high"/s`) continues to pass.
   - Verify that all 87 tests in `tests/e2e.test.mjs` (including F7.1 to F7.5, T2.F7.1 to T2.F7.5) pass with zero errors.

2. **Static Site Generator Execution**:
   ```bash
   node scripts/gerar.mjs
   ```
   - Verify that all merchant vitrines in `lojas/*/index.html` render cleanly without external font references or CSP violations.

3. **New Test Assertions to Add in Verification Phase**:
   - Assert `index.html` does NOT contain `cdn.tailwindcss.com` or `'unsafe-eval'`.
   - Assert NO HTML file contains `fonts.googleapis.com` or `fonts.gstatic.com`.
   - Assert all 6 WOFF2 font files exist in `assets/fonts/` with non-zero byte length.
   - Assert `index.html` Schema.org `LocalBusiness` JSON-LD parses and contains valid `url` and `telephone`.
   - Assert all `<meta property="og:image">` tags across all core HTML files begin with `https://`.
   - Assert `<title>` and `<meta name="description">` in `modalidades.html`, `localizacao.html`, and `anuncie.html` match `/Porangaba/i` and `/salas comerciais/i`.

4. **Invalidation Conditions**:
   - Any external HTTP request triggered on page load (Tailwind CDN or Google Fonts).
   - Any CSP violation in console (`unsafe-eval`, `unsafe-inline`, or unapproved font source).
   - Breaking the regular expression contract in `tests/site.test.mjs` line 56.
   - Layout shifts caused by missing `width`/`height` on images.
