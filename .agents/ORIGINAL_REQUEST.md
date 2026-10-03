# Original User Request

## 2026-08-23T23:21:04Z

Expand and enrich the official website for Galeria Lemura (a commercial hub in Porangaba/SP) by integrating the official dataset of 184 real high-resolution photos, building an interactive floor plan for ground and upper floors, modernizing the visual gallery with a Bento Grid and lightweight responsive lightbox, and enriching merchant/tenant showcases.

Working directory: D:\Lemura
Integrity mode: demo

## Requirements

### R1. Photo Assets & Catalog Integration
Integrate the curated high-resolution photography assets processed from D:\dowload\wetransfer_img_7151-jpg_2026-08-21_1937.zip into the site structure (assets/galeria/, assets/salas/, assets/lojas/). Ensure all images are appropriately credited and referenced.

### R2. Interactive Floor Plan (Térreo & Piso Superior)
Implement an interactive visual architectural floor plan in index.html displaying all 16 rooms:
- Visual distinction between Occupied rooms (showing merchant name/slug link) and Vacant rooms (Spaces A, B, and C with pulsing availability badges).
- Clicking any room opens a detail drawer/modal with real photos of that space, specifications (floor, private bath, AC, corridor window), and direct WhatsApp booking CTA.
- Responsive toggle between Ground Floor (Térreo) and Upper Floor (Superior).

### R3. Modern Editorial Bento Gallery with Native Lightbox
Upgrade the environment and showcase gallery into a modern, responsive Bento Grid layout with category filters:
- Categories: Todos, Fachada & Acessos, Áreas Comuns & Varanda, Salas Comerciais, Lojas em Ação.
- Native, zero-dependency, ultra-fast Lightbox modal supporting keyboard navigation (Esc, Arrow keys) and mobile swipe gestures, compliant with strict CSP.

### R4. Enriched Merchant Vitrines & Data Consistency
Update data/salas.js, data/lojistas.js, and js/lemura-templates.js to link enriched photo galleries, room badges (e.g. 📍 Piso Térreo • Sala 01), and real merchant services. Run static generator (scripts/gerar.mjs) to produce SEO-optimized static pages in /lojas/<slug>/index.html.

## Acceptance Criteria

### Interactive Floor Plan
- [ ] Both floors toggle smoothly and display all 16 rooms with correct occupancy and vacancy states.
- [ ] Clicking a vacant room (Spaces A, B, C) opens the detail view with real interior photos and WhatsApp link.
- [ ] Clicking an occupied room links directly to that merchant's showcase page.

### Bento Gallery & Lightbox
- [ ] Category tabs filter the gallery dynamically without page reloads.
- [ ] Clicking any photo opens the high-resolution lightbox with caption and navigation arrows.
- [ ] Pressing Escape or clicking outside closes the lightbox cleanly.

### Build & Integrity
- [ ] Static generator npm run gerar (or node scripts/gerar.mjs) builds all static pages without errors.
- [ ] All tests in npm test (tests/site.test.mjs) pass with 100% success.
- [ ] CSP integrity is preserved (no broken inline scripts or unauthorized external CDN resources).

## Follow-up — 2026-08-23T23:24:31Z

IMPORTANT CORRECTION FROM USER:
The total number of commercial spaces/rooms in Galeria Lemura is 12 (DOZE), NOT 16!
Please update all floor plan models, data schemas in `data/salas.js`, indicators, donut charts, and copy to reflect exactly 12 spaces in total.

## Follow-up — 2026-08-23T23:24:45Z

CONFIRMATION FROM USER:
Total spaces: 12 spaces.
Available spaces: Exactly 3 spaces are available (Espaços A, B e C), and the other 9 spaces are occupied.
Ensure all availability calculations, floor plans, donut indicators, and cards match this exact breakdown: 3 livres de 12 no total.

## 2026-09-20T00:07:30Z

Implementar o plano técnico completo de melhorias e correções da Galeria Lemura em `d:/Lemura`, cobrindo correções críticas de dados, acessibilidade integral (WCAG), performance/segurança e SEO/metadados.

Working directory: d:/Lemura
Integrity mode: development

## Requirements

### R1. Correções de Dados e Contagem de Salas (C1)
- Corrigir a contagem no HTML (`index.html`) e dados para refletir o total real de 12 salas (9 ocupadas, 3 disponíveis: Espaços A, B e C).
- Ajustar os atributos `data-salas-total` (12) e `data-salas-vagas` (3) no HTML inicial para não depender exclusivamente de JS.
- Ajustar o cálculo e estilo do donut SVG (`.donut__value`) no CSS (`css/styles.css`) e JS (`js/salas.js`) para a proporção correta com base no total de 12 salas (circunferência 502.4; 25% livre = stroke-dashoffset 376.8).

### R2. Acessibilidade (A1, A2, A3, A4, A5)
- Inserir link "Pular para o conteúdo" (`.lm-pular`) apontando para `<main id="conteudo">` no início do `<body>` de todas as páginas públicas (`index.html`, `404.html`, etc.).
- Tornar o acordeão de FAQ plenamente acessível em `index.html` e `js/script.js` (`aria-expanded`, `aria-controls`, IDs correspondentes no painel e controle coerente de `aria-hidden`).
- Garantir foco visível nítido (`:focus-visible`) em botões, links de menu/navegação, cards e toggles interativos.
- Revisar e corrigir relações de contraste de texto sobre fundos claros (`--lm-suave` sobre areia e textos claros sobre sálvia).

### R3. Performance e Segurança (D1, D2, D3, D4)
- Eliminar a dependência de runtime do Tailwind via CDN (`cdn.tailwindcss.com`) em `index.html` e remover `'unsafe-eval'` da Content-Security-Policy (CSP), consolidando qualquer estilo necessário em CSS estático local.
- Auto-hospedar as fontes Figtree e Space Mono em `assets/fonts/` (arquivos WOFF2 locais), atualizando referências de CSS e CSP para eliminar conexões externas de fontes.
- Revisar e otimizar dimensões e carregamento de imagens (`width`, `height`, `loading="lazy"`, `fetchpriority="high"` no hero) e preparar variantes responsivas.

### R4. SEO, Metadados e Dados Estruturados (C3, E2, E3)
- Corrigir dados estruturados Schema.org `LocalBusiness` em `index.html` adicionando URL e telefone válidos.
- Ajustar metadados Open Graph (`og:image`) para usar formato de URL absoluta consistente.
- Otimizar títulos e descrições das páginas estáticas (`modalidades.html`, `localizacao.html`, `anuncie.html`) incluindo os termos "Porangaba" e "salas comerciais".

## Acceptance Criteria

### Integridade dos Dados e Contagem
- [ ] O hero e a seção de disponibilidade em `index.html` exibem inicialmente "3 de 12 espaços livres", tanto no HTML estático quanto renderizado com JS.
- [ ] O donut SVG calcula e anima o preenchimento proporcional a 3 vagas de 12 salas (75% ocupado, 25% livre).

### Acessibilidade (WCAG)
- [ ] Usuários de teclado conseguem saltar diretamente para `<main id="conteudo">` via link de salto visível ao receber foco em todas as páginas públicas.
- [ ] Os botões de FAQ possuem `aria-expanded="false"` / `"true"` e controlam o respectivo painel via `aria-controls`.
- [ ] Todos os elementos interativos possuem indicador de foco visível (`:focus-visible`).
- [ ] Relação de contraste de texto atende ao padrão WCAG AA.

### Desempenho e CSP
- [ ] Nenhuma chamada externa a `cdn.tailwindcss.com` ocorre e `'unsafe-eval'` é removido da diretiva `script-src` da CSP.
- [ ] As fontes são servidas a partir de `assets/fonts/` sem dependência de CDNs de terceiros.
- [ ] Todas as páginas carregam sem erros de CSP ou console.

### SEO e Metadados
- [ ] Schema.org `LocalBusiness` contém `url` e `telephone` válidos.
- [ ] Tags `og:image` utilizam caminhos absolutos coerentes com a configuração.
- [ ] Páginas internas contêm referências a "Porangaba" e "salas comerciais" nos títulos e descrições.

