# Galeria Lemura Editorial Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Galeria Lemura homepage into a refined institutional site with a gray fashion-editorial art direction and a separate rooms page.

**Architecture:** Keep the current static multi-page architecture. Move the existing data-driven availability section into a new root `salas.html`, retain its current rendering/data code, and refocus `index.html` on the gallery and its existing pages. Shared color tokens in `css/styles.css` and `css/vitrine.css` carry the monochrome identity into the rest of the site; generated navigation and sitemap remain driven by their current templates/build script.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, current room and merchant data, `scripts/gerar.mjs`.

**Spec:** `docs/superpowers/specs/2026-09-30-lemura-institutional-home-design.md`

## Global Constraints

- Preserve the static site and existing data-driven room/merchant behavior.
- Use light gray `#D9D9D9`, medium gray `#8E8E8E`, graphite `#2B2B2B`, and white/off-white neutrals; photographs keep natural color.
- Keep the result a multi-page institutional website, not a single-purpose landing page.
- Use only real, already optimized project images in shipped pages; never alter source photos in `C:\Users\morai\OneDrive\Desktop\awd`.
- Do not invent availability, room features, pricing, merchant names, services, or visit hours.
- The prominent “Conheça nossas salas” CTA opens `salas.html` in a new tab; ordinary navigation links stay in the current tab.
- Do not replace the existing logo asset or change the publishing architecture.

## Review Focus

- **No rooms are available:** the new page must retain the existing empty-state message and not leave a blank or stale count.
- **Room cards render from data:** every current vacant room must continue to use `data/salas.js` and its existing image/specification data.
- **Generated merchant pages:** their desktop/mobile navigation and footer must point to the new rooms page after `scripts/gerar.mjs` rebuilds them.
- **Color contrast:** medium gray is suitable for rules, large labels, or secondary surfaces; use graphite for small text when `#8E8E8E` on the light surface is too low contrast.
- **Mobile navigation:** all site sections and the rooms page must remain reachable with the existing keyboard-operable menu at narrow widths.

---

### Task 1: Prepare and review the new visual direction

**Files:**
- Create temporarily: `docs/superpowers/previews/lemura-home-editorial-preview.html`
- Create temporarily: `docs/superpowers/previews/lemura-home-editorial-desktop.png`
- Create temporarily: `docs/superpowers/previews/lemura-home-editorial-mobile.png`
- Use existing assets: `assets/galeria-fachada.jpg`, `assets/galeria-area-comum.jpg`, `assets/galeria-corredor.jpg`, `assets/galeria/varanda-vista.jpg`, `assets/lojas/yande/capa.jpg`

**Interfaces:**
- Consumes the approved spec and optimized project photos.
- Produces a browser-rendered visual of the homepage only; it does not modify shipped pages.

- [ ] **Step 1: Compose a standalone desktop homepage preview**

Create an editorial layout with a compact multi-page navigation, restrained LMR/Lemura wordmark treatment using the existing mark, asymmetrical photo-led introduction, and visible previews of the gallery, rooms, modalities, tenants, and location. Use the gray palette and real photos in natural color. Keep contact information and counts sourced from the repository; omit unverified values.

- [ ] **Step 2: Render desktop and mobile screenshots**

Use a browser screenshot at 1440px and 390px widths. Inspect that the heading is readable, the photos preserve their subject, all page navigation remains visible or reachable, and no horizontal overflow occurs.

- [ ] **Step 3: Show the preview and wait for visual approval**

Present the screenshot(s) to the user. Do not begin Tasks 2–5 until the user approves or requests changes to this preview. Apply any requested visual revisions here first.

### Task 2: Extract the rooms listing into `salas.html`

**Files:**
- Create: `salas.html`
- Modify: `index.html`
- Modify: `css/styles.css`
- Reuse: `data/salas.js`, `js/salas.js`, `js/lemura-templates.js`, `js/lemura-core.js`, `js/script.js`

**Interfaces:**
- Consumes: `window.LEMURA_SALAS`, `LemuraTemplates.cardSala`, `#salas-disponiveis`, `[data-salas-vagas]`, and `[data-salas-total]`.
- Produces: `salas.html` as the sole full availability listing; `index.html` links to it without rendering duplicate room cards.

- [ ] **Step 1: Create `salas.html` with the existing room listing markup and metadata**

Move the current `#disponibilidade` section and its empty state from `index.html`. Include viewport, title/description, canonical and Open Graph metadata consistent with the other public root pages. Load only the current local scripts needed for the shared header, room data/cards, reveal behavior, and footer.

- [ ] **Step 2: Keep the current data renderer and its no-vacancy state attached to the new page**

Keep `#salas-disponiveis`, `[data-salas-total]`, `[data-salas-vagas]`, `.lm-disponibilidade__sem-vagas`, and the current generated card API unchanged so `js/salas.js` renders the same three available rooms and graceful zero-room state.

- [ ] **Step 3: Replace the home availability list with a compact rooms preview link**

Remove the complete availability-card section and its room-specific scripts from `index.html` where no longer needed. Add a concise editorial section linking to `salas.html` with `target="_blank"` and `rel="noopener noreferrer"`; do not repeat a room count on the homepage.

- [ ] **Step 4: Update the page-local CSS for the new room page**

Keep the existing room-card, availability, and empty-state styles intact. Add only the page wrapper/header/footer rules necessary for `salas.html` to fit the approved visual preview at desktop and mobile widths.

### Task 3: Refocus the homepage as a multi-page institutional home

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`
- Reuse: `js/destaques.js`, `js/script.js`, `js/lemura-core.js`, `data/lojistas.js`

**Interfaces:**
- Consumes: current gallery photos, merchant data, modalities and location copy, existing navigation interactions.
- Produces: an institutional homepage with existing content represented as clear links/previews to its site pages.

- [ ] **Step 1: Recompose the homepage sections in the approved order**

Use this order: introduction to the gallery, gallery/real-space photo selection, compact rooms preview, existing modalities, current merchant highlights, existing location/visit details, and the current FAQ. Preserve all verified text and contact fallback behavior; do not turn the page into one large CTA block.

- [ ] **Step 2: Update the hero copy and natural-color image treatment**

Use the approved institutional message (“Mais do que salas comerciais, um lugar para grandes planos.”), Porangaba context, and optimized facade image. Use `srcset`, `sizes`, dimensions, and eager loading already supported by the existing assets. Do not apply a blue or grayscale image filter.

- [ ] **Step 3: Rebuild gallery and section layouts to match the approved editorial preview**

Use an asymmetrical image grid for real spaces; avoid duplicated photos in adjacent cards. Keep cards/links to rooms, modalities, lojistas, location, and FAQ as paths into the rest of the site.

- [ ] **Step 4: Keep navigation and content interactions functional**

Update desktop and mobile navigation labels/targets. Preserve the skip link, menu toggle semantics, FAQ `aria-expanded`/`aria-controls`, lightbox behavior, and reveal behavior. Ordinary internal links open in the same tab.

### Task 4: Apply the monochrome editorial identity across public pages

**Files:**
- Modify: `css/styles.css`
- Modify: `css/vitrine.css`
- Modify: `js/lemura-templates.js`
- Modify: `lojas.html`
- Modify: `modalidades.html`
- Modify: `localizacao.html`
- Modify: `scripts/gerar.mjs`

**Interfaces:**
- Consumes: shared `--lm-*` tokens and current page/template class names.
- Produces: a consistent neutral identity and rooms links in existing and generated public navigation.

- [ ] **Step 1: Reassign shared design tokens to the supplied gray palette**

Set graphite tokens to `#2B2B2B`, light-gray surfaces to `#D9D9D9`, and medium-gray decorative/secondary roles to `#8E8E8E`. Map former blue, pink, cyan, violet, wood, and sage uses to neutral semantic roles or replace them with graphite/gray rules; preserve readable text contrast on off-white surfaces.

- [ ] **Step 2: Review hard-coded accent colors in public CSS**

In `css/styles.css` and `css/vitrine.css`, replace remaining non-neutral button, badge, hover, status, focus, border, and background colors with the shared gray tokens. Preserve semantic statuses through text/icons and borders as well as color.

- [ ] **Step 3: Point shared and static navigation to `salas.html`**

Update desktop/mobile header and footer links in `js/lemura-templates.js`, plus every `index.html#disponibilidade` room link or `data-fallback` in `lojas.html` and `modalidades.html`. Leave other page routes and page-specific active states intact.

- [ ] **Step 4: Add the rooms route to generated SEO output**

Update `gerarSitemap()` and any canonical/page metadata definitions in `scripts/gerar.mjs` so generated `sitemap.xml` includes `/salas.html` and merchant pages retain the shared link to it. Do not hand-edit generated pages as the source of truth.

### Task 5: Build and visually inspect the complete site

**Files:**
- Generated by the existing build: `lojas/`, `lojas.html`, `sitemap.xml`
- Inspect: `index.html`, `salas.html`, `modalidades.html`, `localizacao.html`, `lojas.html`, one generated merchant page

**Interfaces:**
- Consumes: all completed page, CSS, routing, and template changes.
- Produces: rebuilt static output that matches the approved preview and links between the site pages correctly.

- [ ] **Step 1: Generate the static site output**

Run `node scripts/gerar.mjs`. Expected: generator completes successfully; generated merchant pages and sitemap reflect the new route and shared navigation.

- [ ] **Step 2: Inspect desktop and mobile browser views**

Open the homepage and rooms page at 1440px and 390px widths, plus one generated merchant page. Confirm the actual colors are neutral, text remains legible, photos render without blue tint, no page overflows horizontally, and the header/menu links are present.

- [ ] **Step 3: Exercise navigation and room states in-browser**

Confirm the home CTA opens `salas.html` in a new tab; normal navigation stays in the current tab; the room cards and 3-of-12 count render from `data/salas.js`; the room page's empty-state markup is present for its runtime zero-vacancy path; FAQ, lightbox, and mobile menu still work.

---
