# Segurança — Galeria Lemura

Este site é 100% estático (HTML/CSS/JS, sem backend, sem formulário, sem
cookies, sem dados de usuário coletados). A estrutura de segurança abaixo
foi dimensionada para esse cenário e para hospedagem em **GitHub Pages**
(escolha atual do projeto).

## O que está implementado

- **Content-Security-Policy** (`index.html`, via `<meta http-equiv>`):
  restringe scripts/estilos/fontes/iframes às origens realmente usadas
  (`cdn.tailwindcss.com`, `fonts.googleapis.com`, `fonts.gstatic.com`,
  `www.google.com` para o mapa) e bloqueia tudo o mais por padrão
  (`default-src 'self'`, `object-src 'none'`). Testado com um listener de
  `securitypolicyviolation` no navegador: **zero violações** com o site
  atual.
- **Referrer-Policy**: `strict-origin-when-cross-origin` global (meta tag),
  mais `rel="noopener noreferrer"` em todos os links externos (WhatsApp,
  Google Maps) — evita vazar a URL completa do site para terceiros e
  protege contra *reverse tabnabbing*.
- **Iframe do Google Maps**: `sandbox` restringindo o que o embed pode
  fazer (só script, same-origin e popups — sem acesso a formulários ou
  navegação do topo da página).
- **Sem scripts inline**: a config do Tailwind foi movida para
  `js/tailwind-config.js` (era um `<script>` inline em `index.html`) para
  não precisar de `'unsafe-inline'` em `script-src`.
- **`js/script.js`** revisado: usa apenas `textContent`/`setAttribute`/
  `classList`, nunca `innerHTML`/`eval`/`document.write` — sem vetor de
  XSS via DOM.
- **`robots.txt`** + **`sitemap.xml`**: controlam indexação (trocar
  `SEU-DOMINIO-AQUI` pelo domínio real antes de publicar).
- **`.well-known/security.txt`** (RFC 9116): canal de contato para
  divulgação responsável de vulnerabilidades — **trocar o e-mail
  placeholder** antes de publicar, ou remover o arquivo se não houver
  contato de segurança dedicado.
- **`.gitignore`**: evita commit acidental de `.env`, chaves, `node_modules/`
  e arquivos de SO/editor (hoje o projeto não tem nenhum segredo, isso é
  proteção para o futuro).
- **`.nojekyll`**: impede que o GitHub Pages rode os arquivos pelo
  processador Jekyll (evita transformação inesperada do conteúdo estático).

## O que o GitHub Pages não permite (limitação da plataforma, não do código)

GitHub Pages serve arquivos estáticos sem deixar configurar **headers HTTP
customizados**. Isso significa que os itens abaixo **não podem** ser
implementados enquanto o site estiver só no GitHub Pages, porque dependem
de header real (uma tag `<meta>` não tem efeito para eles):

- `X-Frame-Options` / `frame-ancestors` real (proteção contra clickjacking)
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security` (HSTS) — porém `*.github.io` já é servido em
  HTTPS por padrão, e se um domínio próprio for usado, ative "Enforce
  HTTPS" em Settings → Pages do repositório.
- `Permissions-Policy` real

**Caminho para ativar isso no futuro**, sem trocar a forma como o site é
escrito: colocar o **Cloudflare (plano gratuito)** na frente do domínio e
usar *Transform Rules*/*Response Headers* para injetar esses headers, ou
migrar a hospedagem para **Netlify**, **Vercel** ou **Cloudflare Pages**
(todos suportam um arquivo de headers e continuam recebendo o mesmo
HTML/CSS/JS deste repositório sem mudanças).

## Decisão pendente: Tailwind via CDN

O Tailwind carrega hoje via Play CDN (`cdn.tailwindcss.com`), que compila
as classes utilitárias no navegador. Por isso a CSP precisa liberar
`script-src 'unsafe-eval'` para esse domínio — é a única concessão do
tipo na política atual. Migrar para um build estático do Tailwind (já
sinalizado como melhoria futura) elimina essa necessidade e permite uma
CSP ainda mais restrita.

## Antes de publicar

- [ ] Trocar `SEU-DOMINIO-AQUI` em `robots.txt`, `sitemap.xml` e
      `.well-known/security.txt`
- [ ] Trocar o e-mail placeholder em `.well-known/security.txt` (ou remover
      o arquivo)
- [ ] Preencher `WHATSAPP_NUMBER` (`js/script.js`) e `telephone`/endereço
      (`index.html`, JSON-LD) — ver `SECURITY.md` não cobre isso, é do
      levantamento de conteúdo anterior
- [ ] Ativar "Enforce HTTPS" em Settings → Pages se usar domínio próprio
