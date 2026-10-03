# Relatório de Exploração Técnica: UI/UX, Planta Baixa Interativa (12 Salas) & Bento Gallery com Lightbox Nativo
**Data**: 2026-08-23T23:26:00Z
**Autor**: Explorer 3 (UI/UX, Floor Plan & Bento Gallery Specialist)
**Status**: Concluído / Pronto para Implementação
**Alvo**: Galeria Lemura (`D:\Lemura`)

---

## 1. Observation (Observações Diretas do Codebase)

### 1.1 Arquitetura de Arquivos e Código Atual
- `index.html`:
  - Landing page principal estruturada em seções: `#inicio` (linha 17), `#disponibilidade` (linha 19), `#espaco` (linha 21), `#ambientes` (linha 23), `#modalidades` (linha 25), `#lojas` (linha 27), `#diferenciais` (linha 29), `#visita` (linha 31), `#faq` (linha 33).
  - Linha 7 define a Content Security Policy (CSP) estrita: default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; frame-src https://www.google.com; script-src 'self' https://cdn.tailwindcss.com 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; upgrade-insecure-requests;
  - Restrições de CSP: Proibido o uso de event handlers inline (onclick); sem scripts externos de CDN para lightbox ou componentes de terceiros; arquitetura 100% Vanilla JS nativo e CSS próprio.
  - Linha 19 define a seção `#disponibilidade`: cabeçalho, donut chart de ocupação (.donut) e container `#salas-disponiveis.lm-salas-grade`.
  - Linha 23 define a seção `#ambientes`: grade de fotos de ambientação com 10 figuras estáticas com loading lazy.
  - Linha 36 carrega a sequência de scripts: `js/lemura-config.js` -> `data/lojistas.js` -> `data/salas.js` -> `js/lemura-templates.js` -> `js/lemura-core.js` -> `js/salas.js` -> `js/destaques.js`.

### 1.2 Sistema de Dados e Atualização de Escopo (12 Espaços Comerciais)
- **Especificação Autorizada (Requirement Update)**:
  - **Total de salas**: Exatamente **12 espaços comerciais** no total (e não 16).
  - **Distribuição de Ocupação**: Exatamente **3 espaços disponíveis** (Espaços A, B e C) e **9 espaços ocupados** (3 livres de 12 no total).
  - **Divisão por Pavimento**:
    - **Piso Térreo (6 espaços)**:
      - Sala 01: Ocupada por `Doces de Elisa` (esquina com vitrine para calçada e corredor).
      - Sala 02: Ocupada / Reservada.
      - Sala 03: Ocupada por `Andrea Almeida` (com banheiro privativo).
      - Sala 04: Ocupada / Reservada.
      - Sala 12 (`Espaço A`): **Disponível** (vitrine ampla para o corredor térreo).
      - Sala 13 (`Espaço B`): **Disponível** (vitrine para o corredor, ao lado das mesas).
      - *Subtotal Térreo*: 4 ocupadas + 2 livres = 6 salas.
    - **Piso Superior (6 espaços)**:
      - Sala 05: Ocupada por `Yandê Saúde` (Recepção da clínica, banheiro privativo).
      - Sala 06: Ocupada por `Yandê Saúde` (Fisioterapia e microfisioterapia).
      - Sala 07: Ocupada por `Yandê Saúde` (Psicologia e psicopedagogia, banheiro privativo).
      - Sala 08: Ocupada por `Yandê Saúde` (Massoterapia).
      - Sala 09: Ocupada por `Espaço ZOE` (Ateliê coletivo e artes).
      - Sala 14 (`Espaço C`): **Disponível** (com **banheiro privativo exclusivo**).
      - *Subtotal Superior*: 5 ocupadas + 1 livre = 6 salas.
    - *Total Geral*: 6 (Térreo) + 6 (Superior) = **12 salas comerciais** (9 ocupadas, 3 livres).

### 1.3 Acervo de Imagens e Testes Automatizados
- **184 Fotos Reais** da sessão de 16/12/2025 catalogadas em `assets/catalogo/fotos.json`. Imagens de alta resolução organizadas em `assets/galeria/` (15 fotos), `assets/salas/vaga-a/` (4 fotos), `assets/salas/vaga-b/` (4 fotos), `assets/salas/vaga-c/` (3 fotos), `assets/lojas/` e `assets/prova/` (4 fotos).
- **`tests/site.test.mjs`**: 6 testes automatizados que validam `cardSala`, links seguros de WhatsApp, imagem prioritária do hero, presença de >= 10 imagens loading lazy em `#ambientes` e execução limpa do gerador estático. Todos os testes passam 100%.

---

## 2. Logic Chain (Cadeia de Raciocínio & Decisões de Design Técnico)

### 2.1 Requisito R2: Planta Baixa Arquitetônica Visual Interativa (12 Salas)
1. **Controle de Pavimentos (Floor Switcher Segmentado)**:
   - Alternador de abas: `[ Térreo (Piso 01) | Superior (Piso 02) ]` com marcação semântica ARIA (role="tablist", role="tab", aria-selected="true/false").
   - Badges de disponibilidade em tempo real: Térreo (2 livres de 6 salas) e Superior (1 livre de 6 salas).
   - Indicador de ocupação donut sincronizado: 3 livres de 12 no total (arco preenchendo 25% livre).
2. **Mapa Arquitetônico Espacial (Spatial Layout)**:
   - Representação espacial intuitiva que valoriza a circulação e a experiência de visita à galeria:
     - **Térreo**: Acesso principal Rua 591 -> Hall de Entrada -> Escadaria para o Piso Superior -> Corredor Central de Circulação -> Mesas de Convivência -> Banheiro Social.
       - Disposição das 6 salas em torno do corredor: Sala 01 (Doces de Elisa), Sala 02, Sala 03 (Andrea Almeida), Sala 04, Sala 12 (Espaço A - Vaga Livre), Sala 13 (Espaço B - Vaga Livre).
     - **Piso Superior**: Escadaria de Acesso -> Hall Superior -> Corredor Superior -> Varanda Panorâmica (com toldo azul e vista verde) -> Banheiro Social.
       - Disposição das 6 salas: Ala Yandê Integrada (Salas 05, 06, 07, 08), Sala 09 (Espaço ZOE), Sala 14 (Espaço C - Vaga Livre com Banheiro Privativo).
3. **Diferenciação Visual dos Estados das Salas**:
   - **Salas Vagas (Espaços A, B, C)**: Borda destacada em gradiente âmbar/dourado (`--lm-ouro: #e3a953`), badge pulsante animado em CSS (`@keyframes lm-pulse`), rótulo claro `📍 Espaço A • Sala 12`, clique abre a Gaveta/Modal de Ficha Técnica da Sala com fotos reais.
   - **Salas Ocupadas por Lojistas**: Estilo escuro institucional elegante com selo do segmento comercial, nome do lojista em destaque e clique redirecionando diretamente para a vitrine `/lojas/<slug>/`.
   - **Salas Ocupadas / Reservadas**: Estilo discreto e elegante indicando ocupação contínua.
4. **Gaveta / Modal de Detalhes Técnicos da Sala (Drawer Component)**:
   - Acessível (role="dialog", aria-modal="true", aria-labelledby="modal-sala-titulo").
   - Carrossel / Galeria com fotos reais do interior e fachada da vaga selecionada:
     - *Espaço A*: assets/salas/vaga-a/principal.jpg, interior.jpg, corredor.jpg, ampla.jpg
     - *Espaço B*: assets/salas/vaga-b/principal.jpg, interior.jpg, corredor.jpg, ampla.jpg
     - *Espaço C*: assets/salas/vaga-c/principal.jpg, interior.jpg, banheiro.jpg
   - Matriz de especificações técnicas: Pavimento (Térreo / Superior), Metragem (A medir no local), Vitrine para corredor (Vidro temperado), Banheiro (Privativo no Espaço C / Social nos Espaços A e B), Climatização (Infraestrutura para ar-condicionado), Diferenciais de localização e fluxo de circulação.
   - Botão de Agendamento Direto WhatsApp (CTA): Link com mensagem pré-formatada para agendamento de visita.
   - Fechamento intuitivo via teclado (`Esc`), botão (`×`) ou clique no backdrop.

### 2.2 Requisito R3: Bento Grid Gallery Editorial com Lightbox Nativo
1. **Layout Bento Grid Moderno & Responsivo**:
   - Transforma a seção `#ambientes` em uma grade editorial assimétrica com CSS Grid (grid-template-columns: repeat(4, 1fr); grid-auto-rows: 240px; gap: 14px; com breakpoints em 1024px, 768px e 480px).
   - Variações assimétricas de cards Bento: Hero Bento (2x2), Wide Bento (2x1), Tall Bento (1x2), Standard Bento (1x1).
   - Legendas refinadas com gradiente scrim escuro, tags mono e efeito de zoom suave no hover (`scale(1.04)`).
2. **Filtro Dinâmico por 5 Categorias (sem recarregar a página)**:
   - Categorias: Todos, Fachada & Acessos, Áreas Comuns & Varanda, Salas Comerciais, Lojas em Ação.
   - Filtragem instantânea via data-cat com animação fluida respeitando prefers-reduced-motion.
3. **Lightbox Nativo Zero-Dependency**:
   - **Zero dependências externas** (sem bibliotecas terceiras como jQuery ou Fancybox).
   - **Conformidade estrita com CSP** (sem handlers inline, sem eval).
   - **Controles de Navegação**: Botões Anterior (‹), Próximo (›) e Fechar (×).
   - **Atalhos de Teclado**: Escape (fecha), Seta Esquerda (anterior), Seta Direita (próxima), Home/End.
   - **Gestos Touch Mobile**: Deslizar para a esquerda (swipe left > 50px), deslizar para a direita (swipe right > 50px), deslizar para baixo (swipe down > 70px) ou toque fora fecha.
   - **Legenda Completa**: Tag da categoria, Título da foto, Descrição detalhada e Contador (Foto X de Y).
   - **Acessibilidade**: role="dialog", aria-modal="true", bloqueio de rolagem do body (overflow: hidden) e restauração de foco ao fechar.

---

## 3. Especificações Técnicas de Integração e Código

### 3.1 Marcação do DOM no `index.html`
- **Seção `#disponibilidade`**:
  - Cabeçalho atualizado com os dados de **3 de 12 espaços livres**.
  - Componente de alternância de pavimentos (#tab-terreo e #tab-superior).
  - Contêiner de planta espacial: #lm-planta-container com #painel-terreo e #painel-superior.
  - Drawer / Modal de sala: #modal-sala com backdrop, botão fechar e contêiner dinâmico de especificações e galeria.
- **Seção `#ambientes`**:
  - Filtros por categoria: .lm-bento-filtros com botões para as 5 categorias.
  - Grade Bento: #lm-bento-grid.lm-bento-grid contendo os cards com atributos data-lightbox-src, data-titulo, data-cat, data-desc e imagens com loading lazy.
- **Lightbox Global**:
  - #lm-lightbox contendo backdrop, botões de navegação, imagem central em alta definição e legenda com contador.

### 3.2 Classes CSS Consolidadas (`css/styles.css` e `css/vitrine.css`)
- .lm-planta-abas, .lm-planta-aba, .lm-planta-aba.is-ativa, .lm-planta-aba__badge
- .lm-mapa-grid, .lm-sala-bloco, .lm-sala-bloco--vaga, .lm-sala-bloco--ocupada, .dot-pulse
- .lm-modal-sala, .lm-modal-sala__backdrop, .lm-modal-sala__conteudo, .lm-modal-sala.is-aberto
- .lm-bento-filtros, .lm-bento-filtro, .lm-bento-grid, .lm-bento-card
- .lm-lightbox, .lm-lightbox.is-aberto, .lm-lightbox__img, .lm-lightbox__nav, .lm-lightbox__fechar

### 3.3 Módulos JavaScript Nativo
- **`js/salas.js`**: Sincronização com `data/salas.js` (12 salas: 3 vagas, 9 ocupadas), renderização dos dois pavimentos (Térreo e Superior) com 6 salas cada, alternância de abas e controle do Drawer de Especificações da Sala.
- **`js/galeria.js`**: Filtragem de categorias no Bento Grid e controlador completo do Lightbox nativo (teclado, gestos touch, foco acessível e scroll lock).

---

## 4. Caveats & Assumptions (Premissas e Riscos Identificados)

1. **Contagem de Salas Atualizada**: A contagem foi expressamente fixada em **12 salas comerciais** (3 disponíveis: Espaços A, B e C; 9 ocupadas). Arquivos como `data/salas.js` e templates devem refletir 12 itens no array.
2. **Preservação de Testes Automatizados**: `tests/site.test.mjs` requer que a seção `#ambientes` contenha no mínimo 10 tags <img> com loading lazy. A implementação do Bento Grid deve garantir que a grade renderize estaticamente no mínimo 10 fotos com esse atributo.
3. **CSP Rígido**: Nenhum handler inline (onclick) deve existir no HTML. Toda a interatividade deve ser atribuída via JavaScript em DOMContentLoaded.

---

## 5. Conclusion (Conclusão & Próximos Passos de Implementação)

O planejamento técnico de UI/UX está completamente especificado, validado e documentado. A equipe de implementação pode proceder com:
1. **Ajuste de Dados**: Sincronizar `data/salas.js` para a contagem oficial de 12 salas.
2. **Atualização HTML & CSS**: Aplicar a marcação da Planta Baixa, Bento Grid e Lightbox em `index.html` e consolidar os estilos em `css/styles.css` e `css/vitrine.css`.
3. **Lógica JS Nativa**: Implementar a alternância de pavimentos, drawer de sala, filtragem de categorias e visualizador lightbox em Vanilla JS.
4. **Validação Final**: Executar `npm test` e `npm run gerar` para atestar 100% de conformidade.

---

## 6. Verification Method (Método de Verificação Independente)

1. **Testes Unitários**:
   ```bash
   node --test tests/site.test.mjs
   ```
   *Critério*: 6 testes aprovados com 100% de sucesso.
2. **Gerador Estático**:
   ```bash
   node scripts/gerar.mjs
   ```
   *Critério*: Execução com código de saída 0 e geração das páginas de loja.
3. **Inspeção Visual e Funcional no Navegador**:
   - Planta Baixa: Alternância suave entre Térreo (6 salas, 2 livres) e Superior (6 salas, 1 livre).
   - Espaços Vagos: Badges pulsantes nos Espaços A, B e C; clique abre gaveta com fotos reais e WhatsApp.
   - Salas Ocupadas: Clique navega diretamente para /lojas/<slug>/.
   - Bento Gallery: Filtragem dinâmica nas 5 abas de categoria.
   - Lightbox: Abertura fluida, navegação por setas/teclado, fechamento com Esc e gestos de swipe no mobile.
