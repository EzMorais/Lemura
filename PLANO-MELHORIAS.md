# Plano de Melhorias — Galeria Lemura

Segue o plano completo, priorizado do que destrava mais valor para o que apenas lapida. Separado em __correções__ (o site está inconsistente ou inoperante) e __melhorias__ (o site funciona, mas pode ficar melhor).

---

## Correções críticas (fazer antes de tudo)

__C1. Bug de contagem de salas__

- Onde: `index.html` (hero e seção Disponibilidade) diz "3 de 16 espaços livres"; `data/salas.js` declara 12 salas no total (9 ocupadas + 3 disponíveis: Espaços A, B, C).
- Problema: o número mais decisivo do site está contraditório entre HTML e dados.
- Ação: definir o total real da galeria, corrigir o HTML para usar o texto/data padronizado e garantir que `data-salas-total` reflita o mesmo valor. Ajustar o donut (`.donut__value` tem `stroke-dashoffset` fixo em 408.2) para calcular a fração correta quando o total mudar.

__C2. Contato desativado__

- Onde: `js/lemura-config.js` — `whatsapp: ""`, `siteUrl: "https://SEU-DOMINIO-AQUI"`, `instagram: ""`, `email: ""`.
- Problema: `js/lemura-core.js` remove o `href` de todos os `.js-whatsapp` quando não há número, então "Agendar visita", o CTA do hero e da seção Visita não fazem nada hoje.
- Ação: preencher WhatsApp, e-mail, Instagram e o domínio final. Rodar `node scripts/gerar.mjs` depois.

__C3. Sitemap/robots e dados estruturados__

- Onde: `sitemap.xml`, `robots.txt` e o `<script type="application/ld+json">` de `index.html`.
- Problema: `siteUrl` placeholder contamina sitemap, canônicas e Open Graph; o `telephone` está ausente nos dados estruturados.
- Ação: preencher após definir o domínio real; incluir `telephone` e `url` no `LocalBusiness`.

---

## Acessibilidade

__A1. Link "pular para o conteúdo"__ no início do `<body>` de todas as páginas, apontando para `<main>`.

__A2. Acordeão de FAQ__ (`index.html` + `js/script.js`)

- Adicionar `aria-expanded` e `aria-controls` em cada `.faq-toggle`, com `id` no painel e `aria-labelledby` no contêiner.
- Manter `aria-hidden` coerente com o estado aberto/fechado.

__A3. Foco visível por teclado__

- Há `outline` removido/brando em botões e links. Restaurar um `:focus-visible` claro (`.nav-toggle`, `.faq-toggle`, links do menu e cards).

__A4. Contrastes__

- Textos claros sobre fundos claros (destaques na seção Lojistas e na vitrine). Revisar `--lm-suave` (`#63666d`) sobre `--lm-areia` e textos `rgba(255,255,255,.62)` sobre `--lm-salvia`, que ficam no limite.

__A5. Estados de conteúdo dinâmico__

- As contagens (`data-salas-vagas`) atualizam via JS; garantir que o valor inicial no HTML seja o real e não dependa de correção posterior (evita leitura errada por leitor de tela e por quem está com JS desligado).

---

## Desempenho

__D1. Tailwind via CDN__

- Onde: `index.html` — `https://cdn.tailwindcss.com` com `'unsafe-eval'` na CSP.
- Ação: gerar o CSS usado em build e servir como arquivo estático; remove `unsafe-eval` da CSP, o que também __melhora a segurança__.

__D2. Fontes externas__

- Onde: `<link>` para `fonts.googleapis.com` / `fonts.gstatic.com`.
- Ação: auto-hospedar as fontes (Figtree e Space Mono) em `assets/fonts/`, reduzindo conexões externas e latência.

__D3. Imagens__

- Revisar `width`/`height` e `loading` das imagens da seção "ambientes" e do carrossel "prova" (as maiores da página). Priorizar `fetchpriority="high"` no hero (já existe) e `loading="lazy"` no restante (já existe). Considerar formatos WebP/AVIF.

__D4. LCP do hero__

- O hero usa `assets/hero-bg.jpg` de 1920×1080. Servir uma variante responsiva (ex.: 1280 e 1920) evita baixar imagem grande no celular.

---

## Clareza editorial e conteúdo

__E1. Placeholders e promessas__

- Trocar/revisar textos de demonstração e números pendentes (`area: 0` = "a medir") para que a página só afirme o que é verdade sobre a galeria atual.
- Alinhar a linguagem comercial (ex.: "fotos reais", "vizinhança de verdade") com o que existe de fato.

__E2. Metadados sociais__

- `og:image` está como caminho relativo (`assets/og-image.jpg`). Trocar por URL absoluta com o domínio real, senão WhatsApp e redes sociais não montam a pré-visualização.

__E3. SEO de conteúdo__

- Revisar titles/descriptions das páginas fixas (`modalidades.html`, `localizacao.html`, `anuncie.html`) para incluir a cidade "Porangaba" e o termo "salas comerciais".

---

## Ordem sugerida de execução

1. C2 (contato) → C1 (contagem de salas) → C3 (domínio/sitemap) — *sem isso o site não converte nem indexa corretamente.*
2. A1, A2, A3 — *acessibilidade de teclado e leitores de tela.*
3. D1, D2 — *build do Tailwind e fontes locais; ganho grande e remove `unsafe-eval`.*
4. A4, A5, D3, D4 — *refinos.*
5. E1, E2, E3 — *consistência editorial e social.*

---

__Entregável:__ este plano é de conceitos e prioridades — não incluí a implementação. O `js/lemura-config.js` (número de WhatsApp, domínio), o total real de salas e o texto editorial são informações de negócio que só o responsável pela galeria tem, então essas decisões ficam com você. O restante (acessibilidade, build do Tailwind, fontes locais) segue como roteiro técnico a implementar sobre esta base.
