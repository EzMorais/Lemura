# Relatório de Análise Arquitetural e de Dados — Galeria Lemura
**Agente**: Explorer 1 (Codebase, Data & Generator Specialist)  
**Data**: 2026-08-23T23:26:00Z  
**Repositório**: D:\Lemura  
**Escopo**: Mapeamento completo de arquitetura, fluxo de dados, gerador estático, templates, testes, CSP, plano de integração de fotos, planta interativa (12 salas) e galeria bento.

---

## 1. Observation

### 1.1. Estrutura Geral e Dependências (`package.json`)
- O projeto adota uma arquitetura **Zero Dependências Externas em Runtime e Build**.
- `package.json` declara:
  - `"type": "module"`
  - Scripts:
    - `"test": "node --test tests/*.test.mjs"`
    - `"gerar": "node scripts/gerar.mjs"`
    - `"site": "node scripts/servidor.mjs"`
    - `"publicar": "node scripts/gerar.mjs && node scripts/servidor.mjs"`
  - `"engines": { "node": ">=18" }`
  - Não há `dependencies` nem `devDependencies` instaladas via npm. O executor de testes e a API do gerador utilizam apenas módulos nativos do Node (`node:test`, `node:assert/strict`, `node:fs`, `node:path`, `node:url`, `node:child_process`, `node:vm`).

### 1.2. Mapeamento de Dados: Salas e Espaços (`data/salas.js`) — 12 Salas no Total
- **Correção Oficial de Requisito**: O total exato de espaços comerciais da Galeria Lemura é **12 (DOZE)**, sendo **9 ocupados** e **3 disponíveis** (Espaços A, B e C).
- Mapeamento das 12 salas por andar:
  - **Piso Térreo (5 salas)**:
    1. Sala 01: Ocupada por `doces-de-elisa` (Confeitaria de esquina com vitrine para a rua).
    2. Sala 02: Ocupada por `elias-krepski` (Elias & Krepski Advogados).
    3. Sala 03: Ocupada por `andrea-almeida` (Design de Sobrancelhas e Beleza, com banheiro privativo).
    4. Sala 04 / Espaço A: Disponível (`disponivel: true`, `identificacaoPublica: "Espaço A"`, vitrine para o corredor térreo).
    5. Sala 05 / Espaço B: Disponível (`disponivel: true`, `identificacaoPublica: "Espaço B"`, vitrine ao lado da área de convivência).
  - **Piso Superior (7 salas)**:
    6. Sala 06: Ocupada por `yande` (Recepção, clínica geral, nutrição, fonoaudiologia, banheiro privativo).
    7. Sala 07: Ocupada por `yande` (Fisioterapia e microfisioterapia).
    8. Sala 08: Ocupada por `yande` (Psicologia, psicanálise, psicopedagogia, banheiro privativo).
    9. Sala 09: Ocupada por `yande` (Massoterapia).
    10. Sala 10: Ocupada por `espaco-zoe` (Espaço ZOE — Ateliê coletivo e projetos sociais).
    11. Sala 11: Ocupada por `imobiliaria-fabiana` (Imobiliária Fabiana — CRECI 62417-F).
    12. Sala 12 / Espaço C: Disponível (`disponivel: true`, `identificacaoPublica: "Espaço C"`, banheiro privativo exclusivo).
- Resumo de ocupação:
  - **3 livres** (Espaços A, B e C) de **12 no total** (25% livre, 75% ocupado).
  - **9 ocupadas** (Doces de Elisa [1], Andrea Almeida [1], Yandê [4], Espaço ZOE [1], Imobiliária Fabiana [1], Elias & Krepski [1]).

### 1.3. Mapeamento de Dados: Lojistas (`data/lojistas.js`)
- `data/lojistas.js` define `global.LEMURA_LOJISTAS`, contendo 6 lojistas reais ativos (totalizando 9 salas ocupadas):
  1. `doces-de-elisa` (Alimentação, Sala 01, Destaque true, Capa + 3 produtos com fotos reais: `vitrine.jpg`, `doces.jpg`, `cafe.jpg`, WhatsApp próprio `5515996189778`).
  2. `andrea-almeida` (Beleza, Sala 3, Destaque true, sem capa, 2 serviços, WhatsApp próprio `5514998605606`, Instagram `andreaalmeidasobrancelhas`).
  3. `yande` (Saúde, Salas 6, 7, 8 e 9, Destaque true, Capa + 4 serviços com fotos reais: `atendimento.jpg`, `grupo.jpg`, `massoterapia.jpg`, `capa.jpg`, WhatsApp próprio `5515998853137`).
  4. `espaco-zoe` (Serviços, Sala 10, Destaque true, Capa + 2 produtos com fotos reais: `oficina.jpg`, `materiais.jpg`, WhatsApp próprio `5515998855186`).
  5. `imobiliaria-fabiana` (Serviços, Sala 11, Destaque false, sem capa, 2 serviços, WhatsApp próprio `5515991915960`).
  6. `elias-krepski` (Serviços, Sala 02, Destaque false, Capa + 1 serviço com foto: `reuniao.jpg`, sem WhatsApp próprio [usa galeria]).

### 1.4. Módulos de Renderização e Templates (`js/lemura-templates.js`)
- Execução Híbrida: `js/lemura-templates.js` funciona tanto no navegador (via tags `<script>`) quanto no ambiente Node.js (avaliado via `new Function` em `scripts/gerar.mjs` ou via `vm.runInContext` em `tests/site.test.mjs`).
- Funções essenciais exportadas em `LemuraTemplates`:
  - `cardLoja(loja, base, opcoes)`: Card da vitrine com capa, selo de segmento, badge de box/sala, nome com link, chamada, chips de produtos e botão WhatsApp.
  - `cardSala(sala, base, opts)`: Card de vaga disponível com foto, nome público (ex.: "Espaço A"), modalidade, ficha de características (`Área`, `Andar`, `Banheiro privativo`, `Ar-condicionado`, `Vitrine para o corredor`), observação e botão de agendamento WhatsApp.
  - `cardProduto(loja, produto, base)`: Card de produto/serviço com imagem 4:3, título, descrição, preço e CTA de interesse.
  - `paginaLoja(loja, base, todas)`: Monta o `<main>` completo da página individual da loja, incluindo breadcrumbs, cabeçalho de destaque com logo/capa e botões de contato, descrição, vitrine de produtos, bloco de informações laterais (horários, formas de pagamento, contatos, localização), seção "Quem mais está na Lemura" e CTA de locação.
  - `metaLoja(loja)` / `jsonLdLoja(loja)`: Gera metatags SEO e dados estruturados Schema.org `LocalBusiness` com catálogo de ofertas `OfferCatalog`.

### 1.5. Gerador Estático (`scripts/gerar.mjs`)
- Fluxo de execução:
  1. Carrega `js/lemura-config.js`, `data/lojistas.js`, `data/salas.js` e `js/lemura-templates.js`.
  2. Executa validações rigorosas (`conferir()` e `conferirSalas()`):
     - Slugs válidos e únicos.
     - Nomes, segmentos válidos em `CFG.segmentos`.
     - Existência de arquivos de imagem no disco (`logo`, `capa`, `p.foto`, `sala.fotos`).
     - Consistência de salas: unicidade de número, correspondência de ocupante em `LEMURA_LOJISTAS`, integridade do flag `disponivel` vs `ocupante`.
     - Avisos para lojistas ativos sem sala atribuída e salas vagas com metragem pendente.
  3. Renderiza `/lojas/<slug>/index.html` para todas as lojas ativas.
  4. Renderiza `/lojas/index.html` (redirecionador `noindex` para `/lojas.html`).
  5. Limpa pastas órfãs antigas em `lojas/`.
  6. Gera `sitemap.xml` com `<loc>`, `<lastmod>`, `<changefreq>` e `<priority>` para a raiz e todas as páginas de loja.
  7. Gera `robots.txt`.

### 1.6. Configuração de CSP (Content Security Policy)
- Políticas observadas:
  - Em `index.html`:  
    `default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; frame-src https://www.google.com; script-src 'self' https://cdn.tailwindcss.com 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; upgrade-insecure-requests;`
  - Em `lojas.html`, `loja.html` e `/lojas/<slug>/index.html`:  
    `default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; upgrade-insecure-requests;`
- **Ponto crítico de integridade**: `script-src` NÃO permite `'unsafe-inline'` nas páginas geradas e de vitrine. Nenhum handler inline (`onclick`, `onchange`, etc.) ou script inline pode ser inserido no HTML renderizado. Toda interatividade (planta baixa, lightbox, abas de filtro) deve ser implementada via event listeners (`addEventListener`) em scripts `.js` externos.

### 1.7. Suite de Testes (`tests/site.test.mjs`)
- Testes atualmente passando com 100% de sucesso (6 testes):
  1. `a ficha de uma vaga distingue dado ausente de item não instalado`: Assegura que `cardSala` renderize "A medir", "Não", "A confirmar", "Sim" e oculte o número provisório quando houver `identificacaoPublica` ("Espaço A").
  2. `sem número oficial, templates não criam URL de WhatsApp fictícia`: Valida `urlWhatsapp("", "Olá") === ""`.
  3. `lojista sem contato próprio nem contato da galeria não recebe link vazio`: Assegura fallback para `Contato indisponível` sem `href=""`.
  4. `a home usa imagem prioritária no hero e deixa as demais fotos preguiçosas`: Garante `<img src="assets/hero-bg.jpg" fetchpriority="high">` e lazy loading em `assets/prova/varanda.jpg`, `corredor.jpg`, `placas.jpg`, `vizinhanca.jpg`.
  5. `a home apresenta uma coleção ampla de fotos reais do ambiente`: Assegura que a seção `<section id="ambientes">` contenha ao menos 10 tags `<img>`, todas com `loading="lazy"`.
  6. `o gerador relata contato ausente e área a medir sem chamar os dados de fictícios ou incompletos`: Executa `scripts/gerar.mjs` e valida ausência de termos proibidos.

### 1.8. Catálogo Fotográfico (184 Fotos) e Processamento
- Arquivo fonte original: `D:\dowload\wetransfer_img_7151-jpg_2026-08-21_1937.zip` (sessão de 16/12/2025).
- Catálogo indexado: `assets/catalogo/fotos.json` mapeia todas as 184 fotos com suas 184 miniaturas em `assets/catalogo/thumbs/IMG_*.jpg`.
- Visualizador de catálogo completo: `catalogo-fotos.html`.
- Scripts de automação:
  - `scripts/preparar-fotos.py`: recorta e otimiza imagens de alta resolução com Pillow (LANCZOS, teto 400 KB, qualidade 82, conversão RGB com EXIF transpose).
  - `scripts/gerar-catalogo.py`: gera miniaturas e reconstrói `fotos.json` e `catalogo-fotos.html`.

---

## 2. Logic Chain

1. **Ajuste para 12 Salas (9 Ocupadas + 3 Disponíveis)**:  
   Com a confirmação oficial do usuário de exatamente 12 salas, `data/salas.js`, o indicador donut no hero/disponibilidade (`3 livres de 12`) e a Planta Baixa Interativa devem mapear exatamente os 12 espaços (5 no térreo e 7 no superior). Isso elimina entradas provisórias fictícias (antigas 15 e 16) e atribui com exatidão os 6 lojistas ativos aos seus respectivos 9 espaços.

2. **Premissa de Compatibilidade Híbrida**:  
   Como `js/lemura-templates.js` é executado tanto no navegador quanto no Node.js (`scripts/gerar.mjs` via `Function` e `tests/site.test.mjs` via `vm`), qualquer nova função de formatação ou template (como badges `📍 Piso Térreo • Sala 01` ou drawers de sala) precisa manter a compatibilidade ES5/ES6 universal sem depender de APIs exclusivas de navegador (`window`, `document`) no corpo do módulo.

3. **Premissa de Estrita Conformidade CSP**:  
   Como o CSP proíbe scripts inline (`script-src 'self'`), novos componentes interativos da home (Planta Baixa Interativa de 12 salas e Bento Grid com Lightbox) devem ter seu HTML estático/estrutural definido no `index.html` (ou gerado via JS) e todo o comportamento dinâmico (handlers de clique, troca de abas térreo/superior, abertura de drawer, navegação por teclado do lightbox, gestos de swipe) isolado em arquivos de script dedicados (`js/planta.js`, `js/galeria-bento.js`, `js/salas.js`).

4. **Garantia dos Testes da Home (`tests/site.test.mjs`)**:  
   O teste 5 exige explicitamente:
   ```javascript
   const section = html.match(/<section id="ambientes"[\s\S]*?<\/section>/)?.[0] || "";
   const photos = section.match(/<img\b[^>]*>/g) || [];
   assert.ok(photos.length >= 10, `esperava ao menos 10 fotos, encontrei ${photos.length}`);
   for (const photo of photos) assert.match(photo, /loading="lazy"/);
   ```
   Ao modernizar a galeria para o layout Bento Grid com categorias, a `<section id="ambientes">` deve manter no mínimo 10 imagens reais com atributo `loading="lazy"`, garantindo que o Bento Grid atenda simultaneamente aos critérios de modernização e à asserção de teste automatizada.

5. **Interatividade da Planta Baixa (R2 — 12 Salas)**:  
   A planta baixa arquitetônica no `index.html` deve renderizar visualmente:
   - Alternância fluida entre Piso Térreo (5 salas) e Piso Superior (7 salas).
   - 12 salas totais com distinção visual nítida:
     - 9 salas ocupadas exibindo o nome/slug do lojista e link para `/lojas/<slug>/`.
     - 3 salas disponíveis (Espaços A, B e C) com badge pulsante "Disponível".
   - Clique em qualquer sala abrindo drawer/modal com fotos reais, especificações completas (andar, banheiro, ar-condicionado, vitrine) e botão direto de agendamento WhatsApp.

6. **Bento Grid & Lightbox Nativo (R3)**:  
   - Bento Grid com 5 categorias: *Todos*, *Fachada & Acessos*, *Áreas Comuns & Varanda*, *Salas Comerciais*, *Lojas em Ação*.
   - Lightbox nativo zero-dependências com suporte a teclado (`Escape`, `ArrowLeft`, `ArrowRight`), clique fora para fechar, setas de navegação, legenda e foco acessível (`aria-modal="true"`).

---

## 3. Caveats

1. **Metragens das Salas**: Conforme documentado em `data/salas.js` e validado em `tests/site.test.mjs`, as metragens das salas não foram medidas nas fotos e permanecem como `area: 0` (exibidas como "A medir"). O gerador não deve ter dados de metragem inventados.
2. **Fotos Não Atribuídas (Odontologia / Pessoas)**: Conforme `assets/REFERENCIAS.md`, as fotos de consultório odontológico (IMG_7309 a 7312, 7318 a 7328) e fotos com pessoas identificáveis não devem ser associadas a lojistas específicos até autorização formal.
3. **Sem Dependências NPM**: Nenhuma biblioteca externa pode ser instalada via `npm install` sem violar a arquitetura zero-dependency do projeto.

---

## 4. Conclusion

O ecossistema Galeria Lemura está perfeitamente alinhado para a implementação dos 4 requisitos fundamentais com a especificação exata de **12 salas comerciais (9 ocupadas e 3 disponíveis)**:
1. **R1 (Fotos)**: Integração e catalogação das fotos reais de alta resolução no acervo do site.
2. **R2 (Planta Interativa 12 Salas)**: Planta responsiva Térreo/Superior para 12 salas, com badges pulsantes nas 3 vagas (A, B, C), links diretos para lojistas ocupados e drawer de detalhes com WhatsApp.
3. **R3 (Bento Gallery & Lightbox)**: Bento Grid editorial com 5 categorias e lightbox modal nativo ultra-rápido em conformidade estrita com CSP e mantendo >= 10 imagens lazy no `#ambientes`.
4. **R4 (Vitrines Enriquecidas & Badges)**: Badges completos de localização (`📍 Piso Térreo • Sala 01`, etc.), sincronização com `scripts/gerar.mjs` e 100% de aprovação em `npm test`.

---

## 5. Verification Method

Para verificar de forma independente as constatações deste relatório:

1. **Executar a suíte de testes do projeto**:
   ```bash
   npm test
   # ou: node --test tests/*.test.mjs
   ```
   *Critério de sucesso*: 6/6 testes passando com status 0.

2. **Executar o gerador de páginas estáticas**:
   ```bash
   npm run gerar
   # ou: node scripts/gerar.mjs
   ```
   *Critério de sucesso*: Geração bem-sucedida das 6 páginas de loja em `/lojas/<slug>/index.html`, `/lojas/index.html`, `sitemap.xml` e `robots.txt` sem erros de validação.

3. **Verificar integridade do catálogo e arquivos**:
   ```bash
   node -e "console.log('Salas:', LEMURA_SALAS.length); console.log('Lojistas:', LEMURA_LOJISTAS.length);"
   ```
   *Critério de sucesso*: 12 salas e 6 lojistas carregados com integridade.

4. **Condições de Invalidação**:
   - Falha em qualquer asserção de `tests/site.test.mjs`.
   - Quebra de CSP (presença de scripts inline ou CDNs não autorizados).
   - Incompatibilidade de templates no ambiente Node do gerador.
