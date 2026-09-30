# Galeria Lemura

Site oficial da Galeria Lemura — boxes comerciais e espaços de cowork em Porangaba/SP.

O site tem duas frentes que se sustentam:

- **Institucional** (`index.html`) — apresenta a galeria e capta quem quer alugar um espaço.
- **Vitrine** (`lojas.html` e as páginas de cada loja) — hospeda os lojistas, que divulgam ali seus produtos e serviços.

Cada lojista ganha uma página com endereço próprio, produtos, horários e contato direto por
WhatsApp. Não há checkout: o site apresenta, e a negociação acontece direto entre lojista e
cliente. A página inicial mostra lojas em destaque, cada página de loja mostra os vizinhos e
todas terminam num convite para quem ainda não tem um box — é essa circulação que faz a galeria
se divulgar sozinha.

> **Aviso:** as imagens exibidas hoje são referências de banco de imagens e não representam o
> espaço real, e as lojas cadastradas são exemplos de demonstração. Substitua ambos antes da
> publicação definitiva.

---

## Como mexer no site

**Para cadastrar, atualizar ou remover lojistas, leia o [Guia da vitrine](GUIA-DO-LOJISTA.md).**
É o manual de operação do dia a dia, escrito passo a passo.

O resumo, para quem já conhece:

```bash
# 1. edite o cadastro
#    data/lojistas.js

# 2. gere as páginas das lojas, o sitemap e o robots.txt
node scripts/gerar.mjs

# 3. confira no navegador, em http://localhost:4173
node scripts/servidor.mjs

# 4. envie os arquivos para a hospedagem
```

Também disponíveis como `npm run gerar` e `npm run site`.

O passo 2 é obrigatório sempre que `data/lojistas.js` ou `js/lemura-config.js` mudarem.

---

## Estrutura

```text
index.html              Página institucional da galeria
lojas.html              Vitrine: busca, filtros por segmento e grade de lojas
loja.html               Pré-visualização de uma loja (?loja=slug) — não indexada
anuncie.html            Como o lojista publica e atualiza a página dele
404.html                Erro amigável, com resgate de links antigos de loja

data/lojistas.js        CADASTRO DAS LOJAS — a fonte única de dados
js/lemura-config.js     Domínio, WhatsApp, endereço, segmentos
js/lemura-templates.js  Templates compartilhados pelo navegador e pelo gerador
js/lemura-core.js       Comportamentos comuns a todas as páginas
js/lojas.js             Busca e filtros da vitrine
js/loja.js              Página dinâmica de pré-visualização
js/destaques.js         Lojas em destaque na página inicial
js/script.js            Acordeão de dúvidas da página inicial
js/pagina-simples.js    Cabeçalho e rodapé das páginas de conteúdo fixo
js/erro-404.js          Comportamento da página de erro

css/styles.css          Estilos da página institucional
css/vitrine.css         Estilos da vitrine, independentes do Tailwind

scripts/gerar.mjs       Gera /lojas/<slug>/, sitemap.xml e robots.txt
scripts/servidor.mjs    Servidor local para conferir antes de publicar

lojas/                  GERADO — uma pasta por loja. Não edite à mão.
sitemap.xml             GERADO
robots.txt              GERADO

assets/                 Imagens do site
assets/lojas/           Logotipos e fotos dos lojistas
```

### Decisões de projeto

**Sem build obrigatório para visualizar.** Os dados ficam num arquivo `.js` comum, não em
JSON carregado por `fetch`. Assim o site funciona ao abrir os arquivos direto no navegador,
sem servidor e sem erro de CORS.

**Páginas de loja estáticas.** O gerador grava uma página real por loja, com título, descrição,
link canônico, Open Graph e dados estruturados próprios. Isso é o que faz o Google indexar cada
lojista e o WhatsApp montar a pré-visualização certa quando alguém compartilha o link — coisas
que uma página montada só por JavaScript não entrega.

**Os templates são compartilhados.** `js/lemura-templates.js` roda igual no navegador e dentro
do `scripts/gerar.mjs`, então a vitrine dinâmica e as páginas geradas nunca divergem.

**Imagens só do próprio site.** A política de segurança (CSP) bloqueia imagens de outros
domínios. Fotos de lojistas precisam ser baixadas para `assets/lojas/`.

**Sem checkout.** O site é vitrine de divulgação. Preços são texto livre — inclusive
"sob consulta" — e todo botão leva para o WhatsApp do lojista.

---

## Antes de publicar

Em `js/lemura-config.js`:

- [ ] `siteUrl` — o domínio real, sem barra no fim
- [ ] `whatsapp` — o número da galeria, só dígitos, com país e DDD
- [ ] `endereco`, `instagram`, `email`
- [ ] `modoDemo: false`, depois de cadastrar os lojistas reais

Nos arquivos:

- [ ] Substituir as lojas de exemplo em `data/lojistas.js`
- [ ] Substituir as fotos de referência em `assets/` (roteiro abaixo)
- [ ] Preencher `telephone` nos dados estruturados de `index.html`
- [ ] Rodar `node scripts/gerar.mjs`
- [ ] Enviar o `sitemap.xml` ao Google Search Console

---

## Roteiro para as fotos oficiais

Faça as fotos com o espaço limpo, organizado e com toda a iluminação acesa. Sempre que possível, aproveite a luz natural do início da manhã ou do fim da tarde.

### Configuração recomendada

- Fotografe na horizontal e preferencialmente na proporção 4:3.
- Entregue os arquivos em JPG, com pelo menos 2000 px no lado maior.
- Mantenha paredes, portas e colunas visualmente retas.
- Evite o efeito exagerado de lentes ultra-angulares.
- Faça uma versão do ambiente vazio e outra mostrando o uso real.
- Retire fios, placas provisórias, objetos pessoais e informações de clientes.
- Use cores naturais, boa luminosidade e filtros discretos.

#### 1. Fachada

Arquivo que será substituído: `assets/galeria-fachada.jpg`

- Fotografe a fachada inteira, de frente e levemente na diagonal.
- Inclua o letreiro da Lemura e a entrada.
- Evite carros ou objetos bloqueando a visão.
- Faça uma versão durante o dia e outra no começo da noite, com as luzes acesas.

#### 2. Área comum

Arquivo que será substituído: `assets/galeria-area-comum.jpg`

- Mostre circulação, mobiliário e acabamento no mesmo enquadramento.
- Organize o ambiente e use poucos elementos acolhedores, como plantas.
- Faça uma foto ampla e alguns detalhes do espaço.

#### 3. Box modelo

Arquivo que será substituído: `assets/galeria-box-modelo.jpg`

- Prepare um box completo como exemplo de uso profissional.
- Fotografe a partir da porta e de um canto interno para mostrar profundidade.
- Registre detalhes de bancada, iluminação, tomadas e acabamento.

#### 4. Espaço cowork

Arquivo que será substituído: `assets/galeria-cowork.jpg`

- Mostre mesas, cadeiras, tomadas e espaço de circulação.
- Faça uma foto vazia e outra com duas ou três pessoas trabalhando naturalmente.
- Evite telas exibindo informações pessoais ou confidenciais.

#### 5. Corredor interno

Arquivo que será substituído: `assets/galeria-corredor.jpg`

- Fotografe de forma centralizada, com portas e iluminação alinhadas.
- Acenda todas as luzes e retire objetos temporários do caminho.
- Mostre a sensação de organização, segurança e bom acabamento.

#### 6. Entrada e recepção

Arquivo que será substituído: `assets/galeria-entrada.jpg`

- Mostre claramente o acesso, a identidade visual e a recepção.
- Inclua o controle de acesso, se houver, sem expor informações pessoais.
- Registre uma visão externa entrando e outra visão interna recebendo o visitante.

### Fotos extras que valorizam o site

- Vista da rua mostrando o acesso e o contexto comercial.
- Estacionamento ou área de parada, se disponível.
- Letreiro e logotipo em close.
- Detalhes de iluminação, fechaduras, tomadas, acabamento e climatização.
- Boxes ocupados por alimentação, estética, saúde, boutique ou serviços.
- Profissional atendendo um cliente, mediante autorização de uso de imagem.
- Movimento natural de pessoas na área comum.
- Fotos verticais para Instagram, stories e WhatsApp.
- Uma foto ampla para o topo do site (`assets/hero-bg.jpg`).
- Uma foto panorâmica clara para o rodapé (`assets/cta-bg.jpg`).

### Fotos das lojas

Cada lojista precisa de um logotipo quadrado, uma capa horizontal e uma foto por
produto. As especificações estão na [seção 5 do Guia da vitrine](GUIA-DO-LOJISTA.md#5-fotos-e-logotipos).
Enquanto as fotos não chegam, o site gera sozinho um visual com as iniciais da loja.

### Imagens especiais do site

#### Topo — `hero-bg.jpg`

A imagem deve ser ampla e discreta. Deixe a região central visualmente limpa para que o título e os botões continuem legíveis.

#### Rodapé — `cta-bg.jpg`

Produza uma composição horizontal bem larga, clara e com poucos elementos, pois ela será usada atrás da chamada final.

#### Compartilhamento — `og-image.jpg`

Crie uma imagem com exatamente **1200 × 630 px**, incluindo o logotipo e uma mensagem curta. Ela aparecerá quando o site for compartilhado no WhatsApp e nas redes sociais.

### Preparação dos arquivos

- Mantenha os arquivos originais em segurança.
- Exporte as versões do site em JPG, perfil de cor sRGB e qualidade entre 75% e 85%.
- Procure manter cada arquivo abaixo de 500 KB sem perda visual significativa.
- Preserve os nomes indicados neste roteiro para substituir as referências sem alterar o HTML.
- Confirme a autorização de uso de imagem de todas as pessoas identificáveis.

Os créditos e links das imagens provisórias estão em [`assets/REFERENCIAS.md`](assets/REFERENCIAS.md). Uma versão isolada deste roteiro também está disponível em [`assets/ROTEIRO-DE-FOTOS.md`](assets/ROTEIRO-DE-FOTOS.md).
