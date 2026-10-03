# Relatório de Investigação — Acessibilidade WCAG AA (R2: A1-A5)
**Data:** 2026-09-20  
**Agente:** Survey Explorer 2 (`.agents/explorer_survey_2`)  
**Escopo:** Galeria Lemura — Acessibilidade WCAG AA (A1, A2, A3, A4, A5)

---

## 1. Observation

### A1. Skip Link ("Pular para o conteúdo") e `<main id="conteudo">`
- **`index.html`**:
  - Linha 14: `<body class="lm-home antialiased"><div class="lm-home__pagina">` — **NÃO possui** o link `<a class="lm-pular" href="#conteudo">Pular para o conteúdo</a>`.
  - Linha 16: `<main>` — **NÃO possui** o atributo `id="conteudo"`.
- **`404.html`**:
  - Linha 41: `<body class="lm-body" data-base="" data-ativo="">`
  - Linha 43: `<div class="lm-pagina">` — **NÃO possui** o link `<a class="lm-pular" href="#conteudo">Pular para o conteúdo</a>`.
  - Linha 47: `<main id="conteudo">` — **Possui** `id="conteudo"`.
- **`anuncie.html`**:
  - Linha 49: `<a class="lm-pular" href="#conteudo">Pular para o conteúdo</a>` — **Presente**.
  - Linha 55: `<main id="conteudo">` — **Presente**.
- **`localizacao.html`**:
  - Linha 17: `<a class="lm-pular" href="#conteudo">Pular para o conteúdo</a>` — **Presente**.
  - Linha 20: `<main id="conteudo">` — **Presente**.
- **`lojas.html`**:
  - Linha 49: `<a class="lm-pular" href="#conteudo">Pular para o conteúdo</a>` — **Presente**.
  - Linha 55: `<main id="conteudo">` — **Presente**.
- **`modalidades.html`**:
  - Linha 18: `<a class="lm-pular" href="#conteudo">Pular para o conteúdo</a>` — **Presente**.
  - Linha 21: `<main id="conteudo">` — **Presente**.
- **`loja.html`**:
  - Linha 48: `<a class="lm-pular" href="#conteudo">Pular para o conteúdo</a>` — **Presente**.
  - Linha 54: `<main id="conteudo"></main>` — **Presente**.
- **`scripts/gerar.mjs`** e páginas geradas (`lojas/*/index.html`):
  - Linha 225: `<a class="lm-pular" href="#conteudo">Pular para o conteúdo</a>` — **Presente**.
  - Linha 231: `<main id="conteudo">` — **Presente**.
- **`catalogo-fotos.html`**:
  - Linhas 165–193: Não possui skip link nem `<main id="conteudo">` (estrutura interna com `<header>`, `<div class="filtros">`, `<div class="grade">`).
- **`css/vitrine.css`**:
  - Linhas 1230–1241: Define `.lm-pular { position: absolute; left: -9999px; top: 0; background: var(--lm-preto); color: #fff; padding: 0.75rem 1.25rem; border-radius: var(--lm-raio-sm); z-index: 300; }` e `.lm-pular:focus { left: 1rem; top: 1rem; }`.
  - Nota: `css/styles.css` não define `.lm-pular`. `--lm-preto` não existe em `css/styles.css` (onde a variável base é `--lm-tinta: #1D2430`).

---

### A2. Acordeão de FAQ (`index.html` e `js/script.js`)
- **`index.html` (Linha 33)**:
  ```html
  <section id="faq" class="lm-faq reveal"><div><p class="lm-kicker">Dúvidas frequentes</p><h2>Antes da visita.</h2></div><div class="lm-faq__lista"><div class="faq-item"><button class="faq-toggle" type="button">Preciso assinar contrato longo?<span>+</span></button><div class="faq-panel"><div><p>Não necessariamente. Há modalidades flexíveis e box fixo para quem busca continuidade.</p></div></div></div><div class="faq-item"><button class="faq-toggle" type="button">A galeria funciona à noite?<span>+</span></button><div class="faq-panel"><div><p>Há possibilidade de uso diurno e noturno, conforme a modalidade e combinação prévia.</p></div></div></div><div class="faq-item"><button class="faq-toggle" type="button">Consigo alugar por poucas horas ou por dia?<span>+</span></button><div class="faq-panel"><div><p>Sim. O uso por período pode ser combinado por hora, turno ou diária.</p></div></div></div><div class="faq-item"><button class="faq-toggle" type="button">Quais negócios podem ocupar um espaço?<span>+</span></button><div class="faq-panel"><div><p>A galeria recebe atividades variadas. Fale com a equipe para avaliar estrutura e compatibilidade.</p></div></div></div><div class="faq-item"><button class="faq-toggle" type="button">Como agendo uma visita?<span>+</span></button><div class="faq-panel"><div><p>Use o contato da galeria para combinar o melhor dia e horário.</p></div></div></div></div></section>
  ```
  - **Falta**: `id` nos botões (`id="faq-btn-1"` ...).
  - **Falta**: `aria-expanded="false"` nos botões.
  - **Falta**: `aria-controls="faq-panel-1"` nos botões.
  - **Falta**: `id="faq-panel-1"` nos painéis.
  - **Falta**: `role="region"` nos painéis.
  - **Falta**: `aria-labelledby="faq-btn-1"` nos painéis.
  - **Falta**: `aria-hidden="true"` nos painéis quando recolhidos.
  - **Falta de Importação em `index.html` (Linha 36)**:
    `<script src="js/lemura-config.js"></script><script src="data/lojistas.js"></script><script src="data/salas.js"></script><script src="js/lemura-templates.js"></script><script src="js/lemura-core.js"></script><script src="js/salas.js"></script><script src="js/destaques.js"></script>`
    O arquivo `js/script.js` **NÃO é importado** em nenhuma linha de `index.html`! O acordeão está 100% inoperante na página inicial.
- **`js/script.js` (Linhas 11–38)**:
  ```javascript
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var toggle = item.querySelector(".faq-toggle");
      var chevron = item.querySelector(".faq-chevron");
      if (!toggle) return;

      toggle.addEventListener("click", function () {
        var estavaAberto = item.classList.contains("is-open");

        document.querySelectorAll(".faq-item.is-open").forEach(function (outro) {
          if (outro === item) return;
          outro.classList.remove("is-open");
          var outroChevron = outro.querySelector(".faq-chevron");
          if (outroChevron) {
            outroChevron.classList.remove("bg-neutral-950", "text-white");
            outroChevron.classList.add("bg-neutral-100", "text-neutral-500");
          }
        });

        item.classList.toggle("is-open", !estavaAberto);
        if (chevron) {
          chevron.classList.toggle("bg-neutral-950", !estavaAberto);
          chevron.classList.toggle("text-white", !estavaAberto);
          chevron.classList.toggle("bg-neutral-100", estavaAberto);
          chevron.classList.toggle("text-neutral-500", estavaAberto);
        }
      });
    });
  });
  ```
  - **Defeitos observados**:
    1. Procura `.faq-chevron`, mas o HTML de `index.html` contém apenas `<span>+</span>`.
    2. Manipula classes legadas do Tailwind (`bg-neutral-950`, `text-neutral-500`, etc.), que se tornam inócuas ou quebradas com a remoção da CDN do Tailwind.
    3. **Não altera `aria-expanded`** (`toggle.setAttribute("aria-expanded", !estavaAberto ? "true" : "false")`).
    4. **Não altera `aria-expanded`** nos outros itens que são fechados no loop.
    5. **Não altera `aria-hidden`** nos painéis.

---

### A3. Foco Visível por Teclado (`:focus-visible`)
- **`css/styles.css`**:
  - Linhas 1–21: O arquivo possui 21 linhas e **NENHUMA regra** de `:focus-visible` ou `:focus`.
  - `.nav-toggle` (Linha 12): `border: 0; background: none; font-size: 1.4rem;` sem estilo de foco.
  - `.faq-toggle` (Linha 9): `border: 0; background: none; font: 600 1.12rem Figtree; cursor: pointer;` sem estilo de foco.
  - `.lm-prova__trilho[tabindex="0"]` (Linha 5 & `index.html` Linha 21): Elemento navegável por teclado com `tabindex="0"`, sem indicador de foco estilizado.
- **`css/vitrine.css`**:
  - Linhas 1243–1248:
    ```css
    .lm-body a:focus-visible,
    .lm-body button:focus-visible,
    .lm-body input:focus-visible {
      outline: 2px solid var(--lm-tinta);
      outline-offset: 2px;
    }
    ```
    - Restrito exclusivamente a `.lm-body`. A página `index.html` usa `<body class="lm-home antialiased">`. Portanto, **nenhum elemento de `index.html` recebe essa regra**!
    - Linha 989: `.lm-busca input:focus { outline: none; border-color: var(--lm-tinta); background: #fff; }` — remove o contorno do campo de busca.
    - O valor `var(--lm-tinta)` é `#1D2430`. Em seções de fundo escuro (`.lm-hero`, `.lm-disponibilidade`, `.lm-home__footer`, onde o fundo é exatamente `#1D2430`), o contorno `#1D2430` tem **contraste 1.00:1 (invisível)**.

---

### A4. Relações de Contraste WCAG AA (Cálculos de Luminância Relativa)
Script de medição: `.agents/explorer_survey_2/calc_contrast.ps1` executado via PowerShell.

| Par de Cores / Elemento | Texto (Hex/RGBA) | Fundo (Hex) | Contraste Medido | Limiar WCAG AA | Diagnóstico |
|---|---|---|---|---|---|
| `--lm-suave` sobre areia | `#63666d` | `#F4F1EC` (`--lm-areia`) | **5.10 : 1** | 4.5 : 1 (Texto normal) | **PASSOU** |
| `--lm-suave` sobre branco | `#63666d` | `#FFFFFF` | **5.75 : 1** | 4.5 : 1 (Texto normal) | **PASSOU** |
| `--lm-suave` sobre areia escura | `#63666d` | `#eae5dc` (`--lm-areia-escura`) | **4.58 : 1** | 4.5 : 1 (Texto normal) | **PASSOU (No limite)** |
| `--lm-suave` sobre céu (`.lm-prova`) | `#63666d` | `#C1D1E1` (`--lm-ceu`) | **3.69 : 1** | 4.5 : 1 (Texto normal) | **FALHOU** |
| `--lm-claro` (`vitrine.css` L16) s/ areia | `#a3a3a3` | `#F4F1EC` (`--lm-areia`) | **2.24 : 1** | 4.5 : 1 (Texto normal) | **FALHOU CRÍTICO** |
| `--lm-claro` (`vitrine.css` L16) s/ branco | `#a3a3a3` | `#FFFFFF` | **2.52 : 1** | 4.5 : 1 (Texto normal) | **FALHOU CRÍTICO** |
| Branco sobre `--lm-salvia` (Título `strong` 1.35rem) | `#FFFFFF` | `#7E7D71` (`--lm-salvia`) | **4.15 : 1** | 3.0 : 1 (Texto grande/negrito) | **PASSOU** |
| Branco sobre `--lm-salvia` (Texto normal < 18pt) | `#FFFFFF` | `#7E7D71` (`--lm-salvia`) | **4.15 : 1** | 4.5 : 1 (Texto normal) | **FALHOU** |
| `rgba(255,255,255, 0.72)` s/ `--lm-salvia` | `#DBDBD7` (mesclado) | `#7E7D71` (`--lm-salvia`) | **2.99 : 1** | 4.5 : 1 (Texto normal) | **FALHOU SEVERO** |
| `rgba(255,255,255, 0.62)` s/ `--lm-salvia` | `#CECEC9` (mesclado) | `#7E7D71` (`--lm-salvia`) | **2.63 : 1** | 4.5 : 1 (Texto normal) | **FALHOU SEVERO** |
| Branco sobre `--lm-salvia` escurecido `#6C6B60` | `#FFFFFF` | `#6C6B60` | **5.37 : 1** | 4.5 : 1 (Texto normal) | **PASSOU** |
| Branco sobre `--lm-madeira` (Título `h2`) | `#FFFFFF` | `#927970` (`--lm-madeira`) | **4.05 : 1** | 3.0 : 1 (Texto grande) | **PASSOU** |
| `rgba(255,255,255, 0.75)` s/ `--lm-madeira` | `#E4DEDB` (mesclado) | `#927970` (`--lm-madeira`) | **3.04 : 1** | 4.5 : 1 (Texto normal) | **FALHOU** |
| Branco sobre `--lm-madeira` escurecido `#836a61` | `#FFFFFF` | `#836a61` | **5.00 : 1** | 4.5 : 1 (Texto normal) | **PASSOU** |
| Texto `--lm-tinta` sobre `--lm-ceu` | `#1D2430` | `#C1D1E1` | **10.00 : 1** | 4.5 : 1 (Texto normal) | **PASSOU** |
| Donut `.donut__value` sobre `--lm-tinta` | `#C1D1E1` | `#1D2430` | **10.00 : 1** | 3.0 : 1 (Gráficos/UI) | **PASSOU** |
| `.lm-home__footer small` sobre `--lm-tinta` | `rgba(255,255,255, 0.45)` [#83878D] | `#1D2430` | **4.32 : 1** | 4.5 : 1 (Texto pequeno) | **FALHOU LEVE** |
| `.lm-home__footer small` com alpha `0.55` | `rgba(255,255,255, 0.55)` [#999CA2] | `#1D2430` | **5.66 : 1** | 4.5 : 1 (Texto pequeno) | **PASSOU** |

---

### A5. Atributos Iniciais Estáticos vs. Renderização Dinâmica
- **`index.html` (Linha 17 - Hero)**:
  `<p class="lm-kicker"><span aria-hidden="true">●</span> <span data-salas-vagas>3</span> de <span data-salas-total>16</span> espaços livres</p>`
  - Contém o número estático `16` em vez do total real `12`.
- **`index.html` (Linha 19 - Disponibilidade)**:
  `<span><strong data-salas-vagas>3</strong> livres<br>de <span data-salas-total>16</span></span>`
  - Contém o número estático `16` em vez do total real `12`.
- **`css/styles.css` (Linha 4 - Donut SVG)**:
  `.donut__value{ ... stroke-dasharray:502.4; stroke-dashoffset:408.2; ... }`
  - `408.2` corresponde a $502.4 \times (1 - 3/16)$. Hardcoded para 16 salas.
  - Para 12 salas (3 vagas de 12 = 25% livre, 75% ocupado): $502.4 \times (1 - 3/12) = 502.4 \times 0.75 = 376.8$.
- **`index.html` (Linha 35 - Rodapé)**:
  `<small>© <span id="year"></span> Galeria Lemura.</small>`
  - Tag vazia dependente de JS (`document.getElementById("year").textContent = ...`).

---

## 2. Logic Chain

1. **A1 (Skip Links & `<main>`):**
   - Usuários com navegação por teclado ou leitores de tela precisam de um salto direto ao conteúdo principal para evitar passar por todos os links do cabeçalho em todas as páginas (Critério de Sucesso WCAG 2.4.1 — Bypass Blocks).
   - Enquanto `anuncie.html`, `localizacao.html`, `lojas.html`, `modalidades.html` e as páginas geradas de lojas implementam `.lm-pular` apontando para `<main id="conteudo">`, a página inicial (`index.html`) e a página `404.html` não possuem o skip link. Em `index.html`, o `<main>` sequer possui o `id="conteudo"`.
   - Adicionar `<a class="lm-pular" href="#conteudo">Pular para o conteúdo</a>` como primeiro filho de `<body>` em `index.html` e `404.html`, juntamente com `id="conteudo"` em `<main>`, equaliza todas as páginas públicas do repositório.

2. **A2 (Acordeão de FAQ):**
   - De acordo com o padrão WAI-ARIA Accordion Pattern (Critérios 4.1.2 Name, Role, Value e 1.3.1 Info and Relationships), botões expansíveis precisam comunicar seu estado recolhido/expandido (`aria-expanded="false|true"`) e a relação com o conteúdo controlado (`aria-controls="id-do-painel"`).
   - O painel controlado deve ser identificado como uma região acessível (`role="region"`), associado ao título/botão (`aria-labelledby="id-do-botao"`) e ter seu estado de visibilidade refletido (`aria-hidden="true|false"` ou atributo `hidden`).
   - Atualmente, `index.html` não possui nenhum desses atributos estáticos, e `js/script.js` não é importado em `index.html`. Mesmo se fosse importado, `js/script.js` busca `.faq-chevron` (que não existe no markup) e alterna classes utilitárias do Tailwind sem tocar em `aria-expanded` ou `aria-hidden`.
   - É necessário reescrever o markup estático com atributos ARIA completos e atualizar `js/script.js` para alternar esses atributos em sincronia com a classe `.is-open`, além de incluí-lo no final de `index.html`.

3. **A3 (Foco Visível por Teclado):**
   - Critério WCAG 2.4.7 (Focus Visible) e WCAG 2.2 2.4.13 (Focus Appearance) exigem que qualquer elemento operável por teclado apresente um indicador de foco com contraste mínimo de 3:1 em relação às cores adjacentes.
   - A única declaração existente está em `css/vitrine.css` e é restrita ao seletor `.lm-body :focus-visible`, deixando `index.html` (que usa `.lm-home`) sem qualquer indicador personalizado.
   - Ademais, usar `outline: 2px solid var(--lm-tinta)` em seções com fundo `--lm-tinta` gera contraste nulo (1:1).
   - É necessário criar regras universais `:focus-visible` em `css/styles.css` e `css/vitrine.css`, com suporte adaptativo a fundos claros e escuros (ex.: `outline: 2px solid currentColor; outline-offset: 3px;` ou especificações explícitas por bloco).

4. **A4 (Contraste de Cores):**
   - Critério WCAG 1.4.3 (Contrast Minimum - Level AA) exige 4.5:1 para texto normal e 3:1 para texto grande (≥ 18pt ou ≥ 14pt em negrito).
   - O teste matemático prova que `--lm-suave` (`#63666d`) sobre areia (`#F4F1EC`) tem ratio 5.10:1 (conforme).
   - Porém, a cor `--lm-claro` (`#a3a3a3`) em `css/vitrine.css` tem ratio 2.24:1 sobre areia e 2.52:1 sobre branco, afetando cards, breadcrumbs, tags e textos auxiliares de forma crítica. Substituir `--lm-claro` por um tom escurecido como `#575a61` (6.13:1) ou `#4b4d53` (7.50:1) resolve a não-conformidade.
   - A cor `--lm-salvia` (`#7E7D71`) em `.lm-diferenciais` impede que texto normal em branco (4.15:1) ou branco translúcido (`rgba(255,255,255, 0.72)` = 2.99:1) atinja 4.5:1. Escurecer o fundo para `#6C6B60` ou `#636257` e aumentar a opacidade do texto para `rgba(255,255,255, 0.9)` ou branco puro atinge 5.37:1 a 6.15:1.
   - O texto de créditos do rodapé (`.lm-home__footer small`) usa `rgba(255,255,255, 0.45)`, resultando em 4.32:1 (abaixo de 4.5:1). Aumentar a opacidade para `0.55` eleva o contraste para 5.66:1.

5. **A5 (Atributos Iniciais e Renderização Dinâmica):**
   - Leitores de tela analisam a árvore de acessibilidade no momento do parse do DOM. Se a contagem inicial no HTML declara "16 espaços", mas os dados reais e a lógica são de "12 espaços", o usuário de leitor de tela ou sem JavaScript recebe informação falsa ("3 de 16 espaços livres").
   - O valor do anel SVG (`.donut__value`) em `css/styles.css` inicia estaticamente em `408.2` (18.75% livre), enquanto o correto para 3 de 12 vagas é `376.8` (25% livre).
   - Padronizar o HTML inicial com `12` e o CSS inicial com `376.8` garante que tanto o leitor de tela quanto navegadores com JS lento/desativado apresentem a métrica correta de negócio imediatamente.

---

## 3. Caveats

1. **Runtimes de Teste Locais**: Nem `node` nem `python` estão no `PATH` global do terminal do ambiente do usuário Windows (confirmado via `where.exe node` e `where.exe python`). As validações executadas utilizaram scripts nativos em PowerShell. Testes com `npm test` deverão rodar no container/ambiente configurado de CI ou pelo executor de testes do orquestrador.
2. **`catalogo-fotos.html`**: É uma página utilitária interna de catálogo das 184 fotos gerada por `scripts/gerar-catalogo.py`. Recomenda-se adicionar o skip link e `<main id="conteudo">` para manter consistência absoluta, embora não seja uma página comercial voltada ao consumidor final.
3. **Imagens de Fundo sem Texto**: As imagens do carrossel (`.lm-prova`) e bento grid possuem `alt` descritivo já implementado conforme exigido pelo F7.5 dos testes E2E.

---

## 4. Conclusion & Especificações Técnicas de Mudança

### Propostas Exatas de Alteração de Código:

#### 1. Em `index.html`:
- **Skip Link e `<main id="conteudo">`**:
  - Inserir logo após `<body class="lm-home antialiased">`:
    ```html
    <a class="lm-pular" href="#conteudo">Pular para o conteúdo</a>
    ```
  - Alterar a tag `<main>` na linha 16 para:
    ```html
    <main id="conteudo">
    ```
- **Contagem Estática Inicial (A5 / C1)**:
  - Linha 17 (Hero):
    ```html
    <!-- ANTES: -->
    <p class="lm-kicker"><span aria-hidden="true">●</span> <span data-salas-vagas>3</span> de <span data-salas-total>16</span> espaços livres</p>
    <!-- DEPOIS: -->
    <p class="lm-kicker"><span aria-hidden="true">●</span> <span data-salas-vagas>3</span> de <span data-salas-total>12</span> espaços livres</p>
    ```
  - Linha 19 (Disponibilidade):
    ```html
    <!-- ANTES: -->
    <span><strong data-salas-vagas>3</strong> livres<br>de <span data-salas-total>16</span></span>
    <!-- DEPOIS: -->
    <span><strong data-salas-vagas>3</strong> livres<br>de <span data-salas-total>12</span></span>
    ```
- **Rodapé Ano Estático**:
  - Linha 35: `<small>© <span id="year">2026</span> Galeria Lemura.</small>`
- **Markup do FAQ (A2)**:
  - Substituir a seção `<section id="faq" ...>` por:
    ```html
    <section id="faq" class="lm-faq reveal" aria-labelledby="titulo-faq">
      <div>
        <p class="lm-kicker">Dúvidas frequentes</p>
        <h2 id="titulo-faq">Antes da visita.</h2>
      </div>
      <div class="lm-faq__lista">
        <div class="faq-item">
          <button class="faq-toggle" type="button" id="faq-btn-1" aria-expanded="false" aria-controls="faq-panel-1">
            <span>Preciso assinar contrato longo?</span>
            <span class="faq-icone" aria-hidden="true">+</span>
          </button>
          <div class="faq-panel" id="faq-panel-1" role="region" aria-labelledby="faq-btn-1" aria-hidden="true">
            <div><p>Não necessariamente. Há modalidades flexíveis e box fixo para quem busca continuidade.</p></div>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-toggle" type="button" id="faq-btn-2" aria-expanded="false" aria-controls="faq-panel-2">
            <span>A galeria funciona à noite?</span>
            <span class="faq-icone" aria-hidden="true">+</span>
          </button>
          <div class="faq-panel" id="faq-panel-2" role="region" aria-labelledby="faq-btn-2" aria-hidden="true">
            <div><p>Há possibilidade de uso diurno e noturno, conforme a modalidade e combinação prévia.</p></div>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-toggle" type="button" id="faq-btn-3" aria-expanded="false" aria-controls="faq-panel-3">
            <span>Consigo alugar por poucas horas ou por dia?</span>
            <span class="faq-icone" aria-hidden="true">+</span>
          </button>
          <div class="faq-panel" id="faq-panel-3" role="region" aria-labelledby="faq-btn-3" aria-hidden="true">
            <div><p>Sim. O uso por período pode ser combinado por hora, turno ou diária.</p></div>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-toggle" type="button" id="faq-btn-4" aria-expanded="false" aria-controls="faq-panel-4">
            <span>Quais negócios podem ocupar um espaço?</span>
            <span class="faq-icone" aria-hidden="true">+</span>
          </button>
          <div class="faq-panel" id="faq-panel-4" role="region" aria-labelledby="faq-btn-4" aria-hidden="true">
            <div><p>A galeria recebe atividades variadas. Fale com a equipe para avaliar estrutura e compatibilidade.</p></div>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-toggle" type="button" id="faq-btn-5" aria-expanded="false" aria-controls="faq-panel-5">
            <span>Como agendo uma visita?</span>
            <span class="faq-icone" aria-hidden="true">+</span>
          </button>
          <div class="faq-panel" id="faq-panel-5" role="region" aria-labelledby="faq-btn-5" aria-hidden="true">
            <div><p>Use o contato da galeria para combinar o melhor dia e horário.</p></div>
          </div>
        </div>
      </div>
    </section>
    ```
- **Inclusão do Script do FAQ**:
  - Na linha 36 de `index.html`, adicionar `<script src="js/script.js"></script>` antes de `</body>`.

---

#### 2. Em `404.html`:
- Inserir logo após `<body class="lm-body" ...>` (linha 41):
  ```html
  <a class="lm-pular" href="#conteudo">Pular para o conteúdo</a>
  ```

---

#### 3. Em `js/script.js`:
- Reescrever com lógica pura, zero dependências, suporte completo a ARIA e teclado:
  ```javascript
  /* =====================================================================
     COMPORTAMENTOS EXCLUSIVOS DA PÁGINA INICIAL — ACORDEÃO FAQ (WCAG AA)
     ===================================================================== */
  document.addEventListener("DOMContentLoaded", function () {
    var itens = document.querySelectorAll(".faq-item");
    if (!itens.length) return;

    itens.forEach(function (item) {
      var botao = item.querySelector(".faq-toggle");
      var painel = item.querySelector(".faq-panel");
      var icone = item.querySelector(".faq-icone");
      if (!botao || !painel) return;

      botao.addEventListener("click", function () {
        var estaAberto = item.classList.contains("is-open");
        var novoEstado = !estaAberto;

        // Fecha os outros acordeões
        itens.forEach(function (outro) {
          if (outro === item) return;
          outro.classList.remove("is-open");
          var outroBtn = outro.querySelector(".faq-toggle");
          var outroPainel = outro.querySelector(".faq-panel");
          var outroIcone = outro.querySelector(".faq-icone");
          if (outroBtn) outroBtn.setAttribute("aria-expanded", "false");
          if (outroPainel) outroPainel.setAttribute("aria-hidden", "true");
          if (outroIcone) outroIcone.textContent = "+";
        });

        // Alterna o item atual
        item.classList.toggle("is-open", novoEstado);
        botao.setAttribute("aria-expanded", String(novoEstado));
        painel.setAttribute("aria-hidden", String(!novoEstado));
        if (icone) icone.textContent = novoEstado ? "−" : "+";
      });
    });
  });
  ```

---

#### 4. Em `css/styles.css`:
- **Donut SVG (A5 / C1)**:
  - Na linha 4, alterar `stroke-dashoffset: 408.2;` para:
    `stroke-dashoffset: 376.8;`
- **Foco Visível Universal (:focus-visible)**:
  - Adicionar ao final de `css/styles.css`:
    ```css
    /* Acessibilidade WCAG AA: Foco visível */
    :focus-visible {
      outline: 2px solid var(--lm-tinta);
      outline-offset: 3px;
    }

    /* Foco em seções escuras */
    .lm-disponibilidade :focus-visible,
    .lm-hero :focus-visible,
    .lm-home__footer :focus-visible,
    .lm-vizinhos :focus-visible {
      outline: 2px solid #ffffff;
      outline-offset: 3px;
      box-shadow: 0 0 0 4px rgba(29, 36, 48, 0.7);
    }

    /* Estilo do link pular para o conteúdo na home */
    .lm-pular {
      position: absolute;
      left: -9999px;
      top: 0;
      background: var(--lm-tinta);
      color: #ffffff;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-weight: 700;
      z-index: 300;
      text-decoration: underline;
    }
    .lm-pular:focus,
    .lm-pular:focus-visible {
      left: 1rem;
      top: 1rem;
      outline: 2px solid #ffffff;
      outline-offset: 2px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }

    /* Suporte a FAQ com painel visível/oculto para leitores de tela */
    .faq-panel[aria-hidden="true"] {
      visibility: hidden;
    }
    .faq-panel[aria-hidden="false"] {
      visibility: visible;
    }
    .faq-toggle:focus-visible {
      outline: 2px solid var(--lm-tinta);
      outline-offset: 2px;
      border-radius: 4px;
    }
    .faq-icone {
      font-size: 1.4rem;
      font-weight: 400;
      line-height: 1;
      transition: transform 0.2s ease;
    }

    /* Correções de Contraste WCAG AA (A4) */
    .lm-diferenciais {
      background: #636257; /* Salvia escurecido para contraste WCAG AA 6.15:1 */
    }
    .lm-diferenciais span {
      color: rgba(255, 255, 255, 0.92); /* Contraste > 5.0:1 */
    }
    .lm-vizinhos {
      background: #765e56; /* Madeira escurecido para contraste WCAG AA 5.99:1 */
    }
    .lm-vizinhos > div > p {
      color: rgba(255, 255, 255, 0.92); /* Contraste > 5.0:1 */
    }
    .lm-home__footer small {
      color: rgba(255, 255, 255, 0.60); /* Contraste 6.47:1 */
    }
    ```

---

#### 5. Em `css/vitrine.css`:
- **Contraste de `--lm-claro` (A4)**:
  - Linha 16: Alterar `--lm-claro: #a3a3a3;` para:
    `--lm-claro: #4b4d53;` (Gera contraste de **7.50:1** sobre areia e **8.45:1** sobre branco).
- **Foco Universal**:
  - Linhas 1243–1248: Remover restrição `.lm-body` e aplicar foco universal para links, botões e campos de entrada.

---

## 5. Verification Method

Para verificação automatizada e independente quando os agentes de implementação concluírem suas etapas:

### 1. Testes Automatizados a Adicionar em `tests/e2e.test.mjs`
Inserir novas asserções no bloco `F7.5`:
```javascript
it("F7.6: WCAG AA Accessibility Checklist (A1, A2, A3, A4, A5)", () => {
  // A1: Skip link e <main id="conteudo"> em todas as páginas públicas
  const paginas = [
    "index.html",
    "404.html",
    "anuncie.html",
    "localizacao.html",
    "lojas.html",
    "modalidades.html",
  ];
  for (const pag of paginas) {
    const conteudo = fs.readFileSync(path.join(ROOT, pag), "utf8");
    assert.match(
      conteudo,
      /<a class="lm-pular" href="#conteudo">/,
      `${pag} deve possuir o skip link .lm-pular`
    );
    assert.match(
      conteudo,
      /<main\b[^>]*\bid="conteudo"/,
      `${pag} deve possuir <main id="conteudo">`
    );
  }

  // A2: FAQ Accordion possui atributos ARIA coerentes
  const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  assert.match(indexHtml, /<button class="faq-toggle"[^>]+aria-expanded="false"/, "FAQ toggle deve iniciar com aria-expanded='false'");
  assert.match(indexHtml, /<button class="faq-toggle"[^>]+aria-controls="faq-panel-1"/, "FAQ toggle deve ter aria-controls");
  assert.match(indexHtml, /<div class="faq-panel"[^>]+id="faq-panel-1"[^>]+role="region"[^>]+aria-labelledby="faq-btn-1"[^>]+aria-hidden="true"/, "FAQ panel deve ter ID, role, aria-labelledby e aria-hidden");
  assert.match(indexHtml, /<script src="js\/script\.js"><\/script>/, "index.html deve importar js/script.js");

  // A3: Foco visível no CSS
  const stylesCss = fs.readFileSync(path.join(ROOT, "css/styles.css"), "utf8");
  assert.match(stylesCss, /:focus-visible/, "css/styles.css deve definir :focus-visible");

  // A5 / C1: Contagem de 12 salas estática no HTML
  assert.match(indexHtml, /<span data-salas-vagas>3<\/span> de <span data-salas-total>12<\/span> espaços livres/, "Hero deve indicar 3 de 12");
  assert.match(indexHtml, /<strong data-salas-vagas>3<\/strong> livres<br>de <span data-salas-total>12<\/span>/, "Disponibilidade deve indicar 3 livres de 12");
  assert.match(stylesCss, /stroke-dashoffset:\s*376\.8/, "Donut CSS inicial deve ser 376.8 para proporção 3/12");
});
```

### 2. Condições de Invalidação
- O relatório será invalidado se qualquer página pública (`index.html`, `404.html`, etc.) for publicada sem `<a class="lm-pular" href="#conteudo">` ou sem `<main id="conteudo">`.
- Será invalidado se `index.html` continuar carregando o número `16` no HTML estático ou se o acordeão FAQ permanecer sem atualização de `aria-expanded` e `aria-hidden` ao clique.
- Será invalidado se `--lm-claro` permanecer como `#a3a3a3`, falhando no contraste mínimo de 4.5:1.
