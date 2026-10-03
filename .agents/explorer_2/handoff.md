# Survey Report: Photo Archive & Asset Integration Mapping
 **Agent**: Explorer 2 (Photo Archive & Asset Integration Specialist)  
**Date**: 2026-08-23T23:27:00Z  
**Target Workspace**: D:\Lemura  
**Photo Archive Source**: D:\dowlad\wetransfer_img_7151-jpg_2026-08-21_1937.zip  

---

## 1. Observation

### 1.1 Photo Archive Verification
- **File Location**: `D:\dowlad\wetransfer_img_7151-jpg_2026-08-21_1937.zip`
- **Archive Size**: `1,061,606,024` bytes (1.06 GB uncompressed)
- **Total Images**: Exactly **184** JPEG files (`IMG_7151.JPG` through `IMG_7368.JPG`)
- **Capture Equipment & Metadata**:
  - Camera: `Canon EOS REBEL T3i`
  - Sensor Resolution: `5184 × 3456` pixels (17.92 MP, 3:2 native aspect ratio)
  - Color Space: `sRBG`
  - Session Date: `2025-12-16` on location at Galeria Lemura (Porangaba/SP)
  - Thumbnails Catalog: `assets/catalogo/thumbs/` (184 images, max 480px, <40 KB each)
  - Metadata Index: `assets/catalogo/fotos.json` (184 entries)
  - Interactive Visual Catalog: `catalogo-fotos.html`

### 1.2 Photo Sequence Clusters & Range Analysis
Analysis of all 184 photos reveals 8 distinct chronological and thematic shooting sequences:

| Sequence | Range | Count | Primary Subject / Tenant | Mapped / Known |
|---|---|---|---|---|
| **Cluster 1** | `IMG_7151` - `IMG_7176` | 24 | Corporate Office & Law Firm (Elias & Krepski: entrance, conference table) | `IMG_7158`, `IMG_7165` |
| **Cluster 2** | `IMG_7177` - `IMG_7228` | 47 | Health & Wellness (Yandê: massage, physiotherapy, psychology, reception) | `IMG_7179`, `IMG_7205`, `IMG_7217`, `IMG_7286` |
| **Cluster 3** | `IMG_7229` - `IMG_7244` | 13 | Creative Studio & Social Projects (Espaço ZOE: art studio, workbench, craft supplies) | `IMG_7230` - `IMG_7236` |
| **Cluster 4** | `IMG_7245` - `IMG_7275` | 24 | Upper Floor, Architectural Details, Veranda & Green Views | `IMG_7259`, `IMG_7264`, `IMG_7269`, `IMG_7270` |
| **Cluster 5** | `IMG_7276` - `IMG_7305` | 25 | Vacant Suites (A, B, C), Ground Floor Hallway, Foyer, Stairs & Coworking | `IMG_7286`, `IMG_7287`, `IMG_7288`, `IMG_7292`, `IMG_7293`, `IMG_7294`, `IMG_7295`, `IMG_7296`, `IMG_7299`, `IMG_7300`, `IMG_7303` |
| **Cluster 6** | `IMG_7306` - `IMG_7330` | 19 | Dental Clinic (Equipment, chair, x-ray viewer, wax molds, instruments) | `IMG_7309`- `IMG_7312`, `IMG_7318`- `IMG_7328` (Unassigned / Reserve) |
| **Cluster 7** | `IMG_7331` - `IMG_7352` | 17 | Doces de Elisa (Sala 01: street vitrine, display case, coffee, pastries) & Tenant Board | `IMG_7336`, `IMG_7341`, `IMG_7343`, `IMG_7346`, `IMG_7348`- `IMG_7351` |
| **Cluster 8** | `IMG_7353` - `IMG_7368` | 15 | Façade, Exterior Street Views, Entrance Steps & Lemura Metal Lettering | `IMG_7357`, `IMG_7363`, `IMG_7365`, `IMG_7367` |
| **Total** | | **184** | | |


### 1.3 Updated Building Configuration (12 Spaces Total)
- **Authoritative Correction**: The total number of commercial spaces in Galeria Lemura is exactly **12 (DOZE) salas**, NOT 16.
- **Availability Breakdown**: Exactly **3 espaços livres** (Espaços A, B e C) and **9 espaços ocupados** (Total 3 livres de 12) distributed across Tërreo and Superior floors.


### 1.4 Existing Asset Pipeline & Test Baseline
- `scripts/preparar-fotos.py`: Python/Pillow script with `MANI4ESTO` dictionary targeting Web formats (Q82, Lanczos resampling, target under 400 KB).
- `scripts/gerar.mjs`: Static site generator reading `data/salas.js` and `data/lojistas.js` to emit static HTML under `/lojas/<slug>/index.html`.
- `tests/site.test.mjs`: 6 test suites verifying card rendering, lazy loading, proof images, and generation integrity:
  - `npm test`: **6/6 passed (183ms)**

---

## 2. Logic Chain

### 2.1 From Archive to Site Integration (R1)
1. **Source Authenticity**: All institutional and merchant images are 100% genuine on-site photographs from the 2025-12-16 session in Porangaba/SP. Zero stock photography is required for real tenants.
2. **Directory Separation**: Assets are cleanly isolated into:
   - `assets/galeria/`: Curated architectural and environmental highlights.
   - `assets/salas/vaga-a/`, `assets/salas/vaga-b/`, `assets/salas/vaga-c/`: High-resolution interior, entrance, and amenity shots for vacant spaces.
   - `assets/lojas/<slug?_`: Merchant showcases (cover, products, workspace).
   - `assets/prova/`: Verification proof shots (`corredor.jpg`, `placas.jpg`, `varanda.jpg`, `vizinhanca.jpg`).
3. **Deprecation of Demo Assets**: The placeholder directories in `assets/lojas/` (`atelier-mare`, `base-cowork-lemura`, `clinica-vitalis`, `forno-e-grao`, `norte-contabilidade`, `studio-lumen`) and `CREDITOS.md` were confirmed as legacy Pexels demos; all live routes are populated by real local businesses (`doces-de-elisa`, `yande`, `espaco-zoe`, `elias-krepski`, `andrea-almeida`, `imobiliaria-fabiana`).

### 2.2 Interactive Floor Plan Photo Mappings (R2)
1. All 12 commercial rooms in `data/salas.js` are systematically accounted for across Ground (Térreo) and Upper (Superior) floors.
2. Occupied rooms link directly to merchant pages with rich photo showcases.
3. Vacant rooms (Espaços A, B, C) feature dedicated multi-photo sets (`principal.jpg`, `interior.jpg`, `corredor.jpg`, `banheiro.jpg`) inside modal/drawer components with direct WhatsApp CTAs.


### 2.3 Bento Grid & Lightbox Categorization (R3)
1. Requirements mandate 5 filterable categories:
   - `Todos` (all curated items)
   - `Fachada & Acessos` (external perspective, street interface, entrance staircase, metal lettering)
   - `Áreas Comuns & Varanda` (corridors, communal high tables, upper lounge, open-air terrace, directory panel, restroom)
   - `Salas Comerciais` (vacant spaces A, B, C, model suites, private bathrooms)
   - `Lojas em Ação` (patisserie, physiotherapy, psychology, massage, art studio, law office)
2. Bento Grid rhythm incorporates varied aspect ratios (`16:9`, `4:3`, `3:4`) and CSS grid spans (`col-span-1`, `col-span-2`, `row-span-1`, `row-span-2`) for visual interest.
3. Zero-dependency native Lightbox supports `Escape` key, Left/Right arrow navigation, touch swipe, and maintains strict Content Security Policy (no inline script handlers).

---

## 3. Caveats

1. **Unidentified Dental Clinic (`IMG_7306`–`IMG_7330`)**: Shows a dental clinic (dental chair, x-ray viewer, wax models). This tenant has not yet been identified by room number or business name; these photos are kept in the archive reserve and must NOT be attributed to Andrea Almeida (sobrancelhas/estética) or other tenants.
2. **Image Privacy & Human Subject Clearance**: Photos with identifiable persons (`IMG_7245`, `IMG_7246`, `IMG_7309`, `IMG_7310`, `IMG_7330` – `IMG_7333`) are withheld from public web deployment pending signed image rights agreements.
3. **Tenants Without Photography**: Andrea Almeida (Sala 03) and Imobiliária Fabiana (serviços imobiliários) currently have no confirmed session photos; both are represented by styled initials/monogram cards as designed.
4. **Room Floor Area Measurements**: Metragens remain marked as `area: 0` (exhibited as "A medir" per project convention) until physical architectural measurements are finalized.

---

## 4. Conclusion & Actionable Proposals

### 4.1 Master Floor Plan Room Photo Mapping (12 Spaces Total: 9 Occupied + 3 Vacant)

| Sala # | Floor | Tenant / Public ID | Status | Photo Assets | Highlights & Specifications |
|---|---|---|---|---|---|
| **01** | Térreo | Doces de Elisa (`doces-de-elisa`) | Ocupada | `assets/lojas/doces-de-elisa/capa.jpg`<br>`assets/lojas/doces-de-elisa/vitrine.jpg`<br>`assets/lojas/doces-de-elisa/cafe.jpg`<br>`assets/lojas/doces-de-elisa/doces.jpg` | Esquina, vitrine para calçada/rua, ar-condicionado, confeitaria e café |
| **c2** | Térreo | Elias & Krepski Advogados (`elias-krepski`) | Ocupada | `assets/lojas/elias-krepski/capa.jpg`<br>`assets/lojas/elias-krepski/reuniao.jpg` | Escritório de advocacia, sala de reuniões corporativa, ar-condicionado |
| **03** | Térreo | Andrea Almeida (`andrea-almeida`) | Ocupada | Monograma / Iniciais (sem foto segura) | Banheiro privativo, ar-condicionado, design de sobrancelhas estética |
| **04** | Térreo | Comercial Tërreo | Ocupada | `assets/galeria/corredor-terreo.jpg` | Vitrine de vidro para circulação térrea, ar-condicionado |
| **05** | Superior | Yandê Saöde & Bem Estar (`yande`) | Ocupada | `assets/lojas/yande/capa.jpg` | Recepção da Yandé, clínica geral, nutrição, fonoaudiologia, banheiro privativo |
| **06** | Superior | Yandê Saöde & Bem Estar (`yande`) | Ocupada | `assets/lojas/yande/atendimento.jpg` | Sala de fisioterapia e microfisioterapia, maca clínica, ar-condicionado |
| **07** | Superior | Yandê Saúde & Bem Estar (`yande`) | Ocupada | `assets/lojas/yande/grupo.jpg` | Sala de psicologia, psicanálise e psicopedagogia, poltronas, banheiro privativo |
| **08** | Superior | Yandê Saúde & Bem Estar (`yande`) | Ocupada | `assets/lojas/yande/massoterapia.jpg` | Sala de massoterapia, maca e toalhas, ar-condicionado |
| **c9** | Superior | Espaço ZOE (`espaco-zoe`) | Ocupada | `assets/lojas/espaco-zoe/capa.jpg`<br>`assets/lojas/espaco-zoe/oficina.jpg`<br>`assets/lojas/espaco-zoe/materiais.jpg` | Ateliê coletivo, projetos sociais, bancadas e materiais de arte |
| **c10** | Tërreo | **Espaço A** (Disponível) | **Livre** | `assets/salas/vaga-a/principal.jpg`<br>`assets/salas/vaga-a/interior.jpg`<br>`assets/salas/vaga-a/corredor.jpg`<br>`assets/salas/vaga-a/ampla.jpg` | Vitrine de vidro para corredor do térreo, fluxo principal da entrada |
| **c11** | Tërreo | **Espaço B** (Disponível) | **Livre** | `assets/salas/vaga-b/principal.jpg`<br>`assets/salas/vaga-b/interior.jpg`<br>`assets/salas/vaga-b/corredor.jpg`<br>`assets/salas/vaga-b/ampla.jpg` | Vitrine de vidro ao lado da área de mesas compartilhadas |
| **c12** | Superior | **Espaço C** (Disponêvel) | **Livre** | `assets/salas/vaga-c/principal.jpg`<br>`assets/salas/vaga-c/interior.jpg`<br>`assets/salas/vaga-c/banheiro.jpg` | Piso superior, ambiente privativo silencioso com **banheiro privativo exclusivo** |


---

### 4.2 Bento Gallery Matrix & Category Tagging

| Asset Path | Source Key | Category Tag | Dimensions | Bento Grid Role / Aspect Ratio | Caption / Label |
|---|---|---|---|---|---|
| `assets/galeria/fachada-frontal.jpg` | `IMG_7367` | `fachada` | 1600 Õ 1200 | Col 2 / Row 2 (Featured Large) | Fachada principal com letreiro metálico e entrada |
| `assets/galeria/fachada-diagonal.jpg` | `IMG_7357` | `fachada` | 1600 Õ 1200 | Col 1 / Row 1 (Standard 4:3) | Fachada em ângulo com rampa e escadaria |
| `assets/galeria/fachada-angulo.jpg` | `IMG_7363` | `fachada` | 1200 × 1600 | Col 1 / Row 2 (Tall 3:4) | Perspectiva vertical do letreiro e arquitetura |
| `assets/galeria/letreiro-detalhe.jpg` | `IMG_7365` | `fachada` | 1600 Õ 1200 | Col 1 / Row 1 (Standard 4:3) | Detalhe do letreiro dourado Lemura |
| `assets/galeria/entrada-escada.jpg` | `IMG_7294` | `fachada` | 1600 × 1200 | Col 1 / Row 1 (Standard 4:3) | Acesso principal e escada ao piso superior |
| `assets/galeria/corredor-terreo.jpg` | `IMG_7296` | `ambientes` | 1600 × 1200 | Col 2 / Row 1 (Wide 16:9) | Corredor térreo com vitrines de vidro |
| `assets/galeria/area-comum-mesas.jpg` | `IMG_7293` | `ambientes` | 1600 × 1200 | Col 1 / Row 1 (Standard 4:3) | Área comum de convivência com mesas altas |
| `assets/galeria/cowork-trabalho.jpg` | `IMG_7303` | `ambientes` | 1600 × 1200 | Col 1 / Row 1 (Standard 4:3) | Espaço de trabalho compartilhado |
| `assets/galeria/convivencia.jpg` | `IMG_7259` | `ambientes` | 1200 × 1600 | Col 1 / Row 2 (Tall 3:4) | Convivência e mobiliário em madeira |
| `assets/galeria/arquitetura.jpg` | `IMG_7264` | `ambientes` | 1200 Õ 1600 | Col 1 / Row 2 (Tall 3:4) | Estrutura de madeira do teto e iluminação |
| `assets/galeria/varanda-vista.jpg` | `IMG_7269` | `ambientes` | 1200 × 1600 | Col 1 / Row 2 (Tall 3:4) | Varanda superior sob toldo azul com vista verde |
| `assets/galeria/varanda-espaco.jpg` | `IMG_7270` | `ambientes` | 1600 × 1200 | Col 2 / Row 1 (Wide 16:9) | Espaço aberto da varanda no piso superior |
| `assets/galeria/painel-hall.jpg` | `IMG_7348` | `ambientes` | 1600 Õ 1200 | Col 1 / Row 1 (Standard 4:3) | Painel diretório de salas no hall de entrada |
| `assets/galeria/placas-lojistas.jpg` | `IMG_7349` | `ambientes` | 1200 Õ 1600 | Col 1 / Row 2 (Tall 3:4) | Identificação dos lojistas da galeria |
| `assets/galeria/banheiro-comum.jpg` | `IMG_7315` | `ambientes` | 1200 × 1600 | Col 1 / Row 2 (Tall 3:4) | Banheiro de uso comum de apoio |
| `assets/salas/vaga-a/principal.jpg` | `IMG_7292` | `salas` | 1600 × 900 | Col 2 / Row 1 (Wide 16:9) | Espaço A (Térreo) — Vitrine voltada para o corredor |
| `assets/salas/vaga-a/interior.jpg` | `IMG_7299` | `salas` | 1200 × 900 | Col 1 / Row 1 (Standard 4:3) | Espaço A — Interior claro e pronto para ocupação |
| `assets/salas/vaga-b/principal.jpg` | `IMG_7295` | `salas` | 1600 Õ 900 | Col 2 / Row 1 (Wide 16:9) | Espaço B (Térreo) — Vitrine ao lado da área de mesas |
| `assets/salas/vaga-b/interior.jpg` | `IMG_7300` | `salas` | 1200 × 900 | Col 1 / Row 1 (Standard 4:3) | Espaço B — Interior com vitrine de vidro |
| `assets/salas/vaga-c/principal.jpg` | `IMG_7288` | `salas` | 1600 Õ 900 | Col 2 / Row 1 (Wide 16:9) | Espaço C (Superior) — Sala privativa |
| `assets/salas/vaga-c/banheiro.jpg` | `IMG_7287` | `salas` | 1200 × 900 | Col 1 / Row 1 (Standard 4:3) | Espaço C — Banheiro privativo exclusivo |
| `assets/lojas/doces-de-elisa/vitrine.jpg` | `IMG_7341` | `lojas` | 1200 × 900 | Col 1 / Row 1 (Standard 4:3) | Doces de Elisa — Vitrine refrigerada com bolos do dia |
| `assets/lojas/doces-de-elisa/doces.jpg` | `IMG_7346` | `lojas` | 1200 × 900 | Col 1 / Row 1 (Standard 4:3) | Doces de Elisa — Doces finos e sobremesas |
| `assets/lojas/doces-de-elisa/cafe.jpg` | `IMG_7343` | `lojas` | 1200 × 900 | Col 1 / Row 1 (Standard 4:3) | Doces de Elisa — Café expresso e acompanhamentos |
| `assets/lojas/yande/massoterapia.jpg` | `IMG_7179` | `lojas` | 1200 × 900 | Col 1 / Row 1 (Standard 4:3) | Yandê (Sala 8) — Sala de massoterapia |
| `assets/lojas/yande/atendimento.jpg` | `IMG_7205` | `lojas` | 1200 Õ 900 | Col 1 / Row 1 (Standard 4:3) | Yandê (Sala 6) — Atendimento em fisioterapia |
| `assets/lojas/yande/grupo.jpg` | `IMG_7217` | `lojas` | 1200 Õ 900 | Col 1 / Row 1 (Standard 4:3) | Yandê (Sala 7) — Consultório de psicologia |
| `assets/lojas/espaco-zoe/oficina.jpg` | `IMG_7230` | `lojas` | 1200 Õ 900 | Col 1 / Row 1 (Standard 4:3) | Espaço ZOE (Sala 9) — Bancada de oficina e artesanato |
| `assets/lojas/espaco-zoe/materiais.jpg` | `IMG_7232` | `lojas` | 1200 Õ 900 | Col 1 / Row 1 (Standard 4:3) | Espaço ZOE (Sala 9) — Materiais de arte e projetos sociais |
| `assets/lojas/elias-krepski/reuniao.jpg` | `IMG_7165` | `lojas` | 1200 Õ 900 | Col 1 / Row 1 (Standard 4:3) | Elias & Krepski — Sala de reuniões corporativa |

---

### 4.3 Target Image Optimization & Delivery Specs

- Top-level Banners: `assets/hero-bg.jpg` (1920 Õ 1080, Q82, <400 KB, fetchpriority="high"), `assets/og-image.jpg` (1200 × 630), `assets/cta-bg.jpg` (2400 × 1000).
- Bento Gallery & Modals: all images in assets/galeria/, assets/salas/, assets/lojas/ assert progressive JPEG encoding, sub-400 KB file sizes, and `decoding="async"` + `loading="lazy"` attributes.
- Thumbnails: `assets/catalogo/thumbs/*.jpg` (480 Õ 480 px max, Q 80, <40 KB).

---

## 5. Verification Method

1. **Catalog Verification**:
   `python scripts/gerar-catalogo.py`
   (Verifies all 184 photos are present, indexed, and mapped).

2. **Image Preparation Pipeline**:
   `python scripts/preparar-fotos.py`
   (Establishes all optimized web assets meeting <400 KB ceilings).

3. **Static Generation & Test Suite**:
   `npm test`
   (Verifies 100% pass rate for card rendering, home photos, and static generation).