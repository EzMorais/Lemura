# Segurança — Galeria Lemura

Este site é 100% estático (HTML/CSS/JS, sem backend, sem formulário enviado,
sem cookies, sem dados de usuário coletados). A estrutura de segurança abaixo
foi dimensionada para esse cenário e para hospedagem em **GitHub Pages**
(escolha atual do projeto).

O site tem duas famílias de páginas, com políticas ligeiramente diferentes:

- **`index.html`** — página institucional, que usa o Tailwind via CDN e embute
  o mapa do Google.
- **Vitrine** — `lojas.html`, `loja.html`, `anuncie.html`, `404.html` e as
  páginas geradas em `/lojas/<slug>/`. Não usam Tailwind nem iframes, e por
  isso rodam com uma CSP mais restrita.

## O que está implementado

- **Content-Security-Policy** (via `<meta http-equiv>` em todas as páginas):

  | Diretiva | `index.html` | Vitrine |
  | --- | --- | --- |
  | `script-src` | `'self'` | `'self'` |
  | `frame-src` | `www.google.com` (mapa) | herda `default-src 'self'` |
  | `style-src` | `'self' 'unsafe-inline'` | igual |
  | `font-src` | `'self'` | igual |
  | `img-src` | `'self'` | `'self'` |
  | `default-src` / `object-src` | `'self'` / `'none'` | `'self'` / `'none'` |

  Nenhuma página do site utiliza `'unsafe-eval'` nem scripts de CDNs
  externas. Todas as fontes (Figtree e Space Mono) são auto-hospedadas em
  `assets/fonts/` com WOFF2 local. `'unsafe-inline'` continua em `style-src`
  porque a cor de cada segmento é aplicada por atributo `style` — o valor sai de
  `js/lemura-config.js`, arquivo do repositório, e passa por escape.

- **`img-src 'self'`**: nenhuma imagem de terceiros é carregada, nem mesmo
  dos lojistas. Fotos precisam ser baixadas para `assets/lojas/`. Isso evita
  que um link externo vire canal de rastreamento dos visitantes.

- **Referrer-Policy**: `strict-origin-when-cross-origin` global (meta tag),
  mais `rel="noopener noreferrer"` em todos os links externos (WhatsApp,
  Instagram, Google Maps) — evita vazar a URL completa e protege contra
  *reverse tabnabbing*. Os links externos gerados pelos templates recebem
  esses atributos automaticamente.

- **Iframe do Google Maps** (`index.html`): `sandbox` restringindo o que o
  embed pode fazer (só script, same-origin e popups — sem acesso a
  formulários ou navegação do topo da página).

- **Sem scripts inline**: a config do Tailwind vive em
  `js/tailwind-config.js`, e nenhuma página usa `on*=` ou `<script>` embutido
  — o único inline é o bloco `application/ld+json` das páginas geradas, que
  não é executável e tem `<` escapado como `<`.

- **Injeção de HTML**: as páginas da vitrine montam conteúdo com `innerHTML` a
  partir de `data/lojistas.js`. Toda interpolação passa por `esc()`
  (`js/lemura-templates.js`), que escapa `& < > " '`, cobrindo contexto de
  texto e de atributo. Além disso:
  - `urlSegura()` só aceita `http(s)` em `href`, bloqueando um `javascript:`
    escrito por engano no cadastro;
  - números de telefone e WhatsApp passam por `digitos()`, que descarta
    qualquer caractere não numérico;
  - o `slug` é validado contra `^[a-z0-9-]+$` pelo gerador, e a página 404 só
    redireciona para um slug que existe no cadastro.

  Vale registrar o modelo de ameaça real: `data/lojistas.js` é um arquivo do
  repositório, editado por quem administra o site. O escape existe para conter
  erro de digitação e conteúdo colado de terceiros — não há entrada de usuário
  anônimo em lugar nenhum do site.

- **Sem checkout, sem pagamento, sem dados pessoais**: o site não coleta,
  transmite nem armazena nada do visitante. A busca da vitrine roda inteira no
  navegador; o único estado guardado é o filtro refletido na barra de endereço.

- **`robots.txt`** + **`sitemap.xml`**: gerados por `scripts/gerar.mjs` a
  partir de `siteUrl` em `js/lemura-config.js`. `loja.html` (pré-visualização)
  é marcada `noindex`.

- **`.well-known/security.txt`** (RFC 9116): canal de contato para divulgação
  responsável de vulnerabilidades — **trocar o e-mail placeholder** antes de
  publicar, ou remover o arquivo se não houver contato de segurança dedicado.

- **`.gitignore`**: evita commit acidental de `.env`, chaves, `node_modules/`
  e arquivos de SO/editor (hoje o projeto não tem nenhum segredo, isso é
  proteção para o futuro).

- **`.nojekyll`**: impede que o GitHub Pages rode os arquivos pelo processador
  Jekyll (evita transformação inesperada do conteúdo estático).

- **Sem dependências**: `package.json` não tem um único pacote instalado. Os
  scripts de geração e de servidor local usam só a biblioteca padrão do Node,
  o que elimina a superfície de ataque de cadeia de suprimentos.

## O que o GitHub Pages não permite (limitação da plataforma, não do código)

GitHub Pages serve arquivos estáticos sem deixar configurar **headers HTTP
customizados**. Isso significa que os itens abaixo **não podem** ser
implementados enquanto o site estiver só no GitHub Pages, porque dependem de
header real (uma tag `<meta>` não tem efeito para eles):

- `X-Frame-Options` / `frame-ancestors` real (proteção contra clickjacking)
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security` (HSTS) — porém `*.github.io` já é servido em
  HTTPS por padrão, e se um domínio próprio for usado, ative "Enforce HTTPS"
  em Settings → Pages do repositório.
- `Permissions-Policy` real

**Caminho para ativar isso no futuro**, sem trocar a forma como o site é
escrito: colocar o **Cloudflare (plano gratuito)** na frente do domínio e usar
*Transform Rules*/*Response Headers* para injetar esses headers, ou migrar a
hospedagem para **Netlify**, **Vercel** ou **Cloudflare Pages** (todos
suportam um arquivo de headers e continuam recebendo o mesmo HTML/CSS/JS deste
repositório sem mudanças).

## Decisão implementada: Tailwind e Fontes 100% Locais
 
A dependência do Tailwind Play CDN (`cdn.tailwindcss.com`) foi completamente
eliminada de `index.html`, permitindo a remoção de `script-src 'unsafe-eval'`.
Todos os estilos foram consolidados nos arquivos estáticos `css/styles.css` e
`css/vitrine.css`. As fontes Figtree e Space Mono foram baixadas em formato WOFF2
para `assets/fonts/` e declaradas via `@font-face`, removendo conexões externas a
`fonts.googleapis.com` e `fonts.gstatic.com`.

## Antes de publicar

- [ ] Preencher `siteUrl`, `whatsapp`, `endereco` e `instagram` em
      `js/lemura-config.js`
- [ ] Rodar `node scripts/gerar.mjs` — é ele que grava `robots.txt` e
      `sitemap.xml` com o domínio correto
- [ ] Trocar `SEU-DOMINIO-AQUI` e o e-mail placeholder em
      `.well-known/security.txt` (ou remover o arquivo)
- [ ] Preencher `telephone` e o endereço no JSON-LD de `index.html`
- [ ] Trocar `modoDemo` para `false` depois de cadastrar os lojistas reais
- [ ] Ativar "Enforce HTTPS" em Settings → Pages se usar domínio próprio
