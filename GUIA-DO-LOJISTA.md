# Guia da vitrine — como publicar e atualizar as lojas

Este é o manual de operação da vitrine da Galeria Lemura. Ele é escrito para quem
administra o site, não para programadores: se você conseguir editar um arquivo de
texto e rodar um comando, consegue manter a vitrine inteira.

---

## Índice

1. [Como o site está organizado](#1-como-o-site-está-organizado)
2. [Antes de publicar pela primeira vez](#2-antes-de-publicar-pela-primeira-vez)
3. [Cadastrar uma loja nova](#3-cadastrar-uma-loja-nova)
4. [Ficha completa de campos](#4-ficha-completa-de-campos)
5. [Fotos e logotipos](#5-fotos-e-logotipos)
6. [Atualizar ou tirar uma loja do ar](#6-atualizar-ou-tirar-uma-loja-do-ar)
7. [Ver o site na sua máquina antes de publicar](#7-ver-o-site-na-sua-máquina-antes-de-publicar)
8. [Publicar](#8-publicar)
9. [Criar um segmento novo](#9-criar-um-segmento-novo)
10. [Problemas comuns](#10-problemas-comuns)

---

## 1. Como o site está organizado

O site tem duas partes que conversam entre si:

**A parte institucional** — `index.html` — apresenta a galeria e captura interessados
em alugar um box.

**A vitrine** — `lojas.html` e as páginas de cada loja — apresenta quem já está
dentro da galeria.

As duas se alimentam: a página inicial mostra três lojas em destaque, cada página
de loja mostra os vizinhos, e todas terminam num convite para quem ainda não tem
um espaço. É essa circulação que faz a galeria se divulgar sozinha.

### Os arquivos que você vai mexer

| Arquivo | Para quê |
| --- | --- |
| `data/lojistas.js` | **O cadastro das lojas.** É aqui que você trabalha no dia a dia. |
| `js/lemura-config.js` | WhatsApp da galeria, domínio, endereço, segmentos. Mexe uma vez e esquece. |
| `assets/lojas/` | As fotos e logotipos dos lojistas. |

### Os arquivos que o computador escreve sozinho

Nunca edite estes à mão — o comando `node scripts/gerar.mjs` reescreve todos eles:

- `lojas/<slug>/index.html` — a página pública de cada loja
- `sitemap.xml` — o mapa do site enviado ao Google
- `robots.txt`

---

## 2. Antes de publicar pela primeira vez

Abra `js/lemura-config.js` e ajuste três coisas:

```js
siteUrl: "https://SEU-DOMINIO-AQUI",   // 1. o endereço real do site, sem barra no fim
whatsapp: "5515900000000",             // 2. o WhatsApp da galeria, só dígitos
modoDemo: true,                        // 3. troque para false ao cadastrar as lojas reais
```

Sobre o WhatsApp: escreva código do país + DDD + número, sem espaços, parênteses ou
traço. Para o telefone **+55 15 99999-9999**, escreva `"5515999999999"`.

Enquanto `modoDemo` estiver ligado, o site exibe um aviso amarelo dizendo que as
lojas são exemplos. Isso protege você de publicar as lojas fictícias por engano.

Aproveite também para preencher `endereco`, `instagram` e `email`.

> Toda vez que mexer neste arquivo, rode `node scripts/gerar.mjs` de novo. As páginas
> das lojas guardam esses dados dentro delas.

---

## 3. Cadastrar uma loja nova

**Passo 1.** Abra `data/lojistas.js`.

**Passo 2.** Copie um bloco de loja inteiro — de `{` até `},` — e cole logo abaixo.

**Passo 3.** Troque os valores pelos da loja nova. O mínimo indispensável é
`slug`, `nome` e `segmento`.

**Passo 4.** Salve e rode, na pasta do projeto:

```text
node scripts/gerar.mjs
```

**Passo 5.** Leia o que apareceu na tela. Se houver algum `x` vermelho, corrija e
rode de novo. Os avisos com `!` são sugestões, não impedem a publicação.

Um cadastro enxuto, só com o essencial, fica assim:

```js
{
  slug: "cafe-do-centro",
  nome: "Café do Centro",
  segmento: "alimentacao",
  box: "Box 12",
  chamada: "Cafeteria e lanches rápidos, das 7h às 19h.",
  descricao: "Um café pequeno para a pausa do dia.",
  destaque: false,
  ativo: true,
  logo: "",
  capa: "",
  whatsapp: "5515999998888",
  instagram: "cafedocentro",
  telefone: "",
  email: "",
  site: "",
  horarios: [
    { dias: "Segunda a sábado", horas: "07h – 19h" }
  ],
  pagamentos: ["Pix", "Débito", "Crédito"],
  tags: ["café", "lanche", "salgado"],
  produtos: [
    {
      nome: "Café expresso",
      descricao: "Grão torrado na semana.",
      preco: "R$ 6,00",
      foto: "",
      destaque: true
    }
  ]
},
```

### Sobre o `slug`

O `slug` vira o endereço público da loja: `seusite.com.br/lojas/cafe-do-centro/`.

Use só letras minúsculas, números e hífen. Sem acento, sem espaço, sem `ç`.
"Café do Centro" vira `cafe-do-centro`.

**Depois que a loja for divulgada, não troque o slug.** Todo link que o lojista
espalhou pararia de funcionar.

---

## 4. Ficha completa de campos

### Identificação

| Campo | Obrigatório | O que é |
| --- | :---: | --- |
| `slug` | sim | Endereço da loja no site. Só minúsculas, números e hífen. |
| `nome` | sim | Nome comercial, como deve aparecer. |
| `segmento` | sim | Um dos `id` de `js/lemura-config.js`: `alimentacao`, `saude`, `beleza`, `servicos`, `varejo`, `cowork`. |
| `box` | não | Identificação do espaço. Ex.: `"Box 04"`, `"Área Cowork"`. |

### Textos

| Campo | O que é |
| --- | --- |
| `chamada` | Uma linha, até cerca de 130 caracteres. Aparece no card da vitrine e é o texto que o Google mostra. Vale caprichar. |
| `descricao` | De um a três parágrafos. Para separar parágrafos, deixe **uma linha em branco** entre eles. |

### Comportamento

| Campo | O que faz |
| --- | --- |
| `destaque` | `true` põe a loja entre as três exibidas na página inicial. |
| `ativo` | `false` tira a loja do site sem apagar o cadastro. Útil para pausas. |

### Contato

| Campo | Formato |
| --- | --- |
| `whatsapp` | Só dígitos, com país e DDD: `"5515999998888"`. Deixando vazio, os botões da loja passam a levar para o WhatsApp da galeria com uma mensagem que já cita o nome dela. |
| `instagram` | Usuário sem `@`: `"cafedocentro"`. |
| `telefone` | Do jeito que deve aparecer: `"(15) 3999-0000"`. |
| `email` | `"contato@loja.com.br"` |
| `site` | URL completa, com `https://`. |

### Atendimento

```js
horarios: [
  { dias: "Segunda a sexta", horas: "09h – 18h" },
  { dias: "Sábado",          horas: "09h – 13h" },
  { dias: "Domingo",         horas: "Fechado" }
],
pagamentos: ["Pix", "Débito", "Crédito", "Dinheiro"],
tags: ["palavras", "que", "a busca", "encontra"]
```

As `tags` não aparecem na tela: servem para a busca do diretório. Coloque ali os
termos que um cliente digitaria e que não estão escritos no resto do cadastro.

### Produtos e serviços

```js
produtos: [
  {
    nome: "Nome do produto ou serviço",
    descricao: "Uma ou duas linhas explicando.",
    preco: "R$ 24,00",
    foto: "assets/lojas/cafe-do-centro/expresso.jpg",
    destaque: true
  }
]
```

O campo `preco` é texto livre, justamente porque **o site não vende nada**. Todos
estes valores funcionam:

- `"R$ 24,00"`
- `"A partir de R$ 180,00"`
- `"R$ 60,00/hora"`
- `"Sob consulta"`
- `"Agendamento gratuito"`
- `""` (vazio, e nenhum preço é exibido)

Cada produto ganha um botão **Tenho interesse** que abre o WhatsApp da loja com
uma mensagem já escrita citando aquele produto.

---

## 5. Fotos e logotipos

### Onde guardar

Crie uma pasta por loja dentro de `assets/lojas/`:

```text
assets/lojas/cafe-do-centro/logo.jpg
assets/lojas/cafe-do-centro/capa.jpg
assets/lojas/cafe-do-centro/expresso.jpg
```

E aponte no cadastro com o caminho a partir da raiz do projeto:

```js
logo: "assets/lojas/cafe-do-centro/logo.jpg",
capa: "assets/lojas/cafe-do-centro/capa.jpg",
```

### Formatos recomendados

| Imagem | Proporção | Tamanho mínimo | Observação |
| --- | --- | --- | --- |
| `logo` | quadrada (1:1) | 600 × 600 px | Fundo claro ou transparente. |
| `capa` | horizontal (16:9) | 1600 × 900 px | Aparece no card e no topo da página. |
| `foto` de produto | horizontal (4:3) | 1200 × 900 px | |

Exporte em JPG, qualidade entre 75% e 85%, mirando **menos de 500 KB por arquivo**.
Foto pesada deixa a vitrine lenta no celular, que é onde a maioria vai abrir.

### Sem foto, e agora?

Nada quebra. O site gera automaticamente um visual com as iniciais da loja, na cor
do segmento. Fica apresentável e você publica hoje, trocando pelas fotos reais
quando elas chegarem.

Dá para misturar os dois: a Clínica Vitalis e o Studio Lumen, no conteúdo de
demonstração, têm capa e fotos de produto mas **não** têm logotipo — o círculo da
marca aparece com as iniciais. É exatamente o que acontece com um lojista que
mandou fotos do espaço mas ainda não tem uma marca desenhada.

### As fotos que já estão no site

As lojas de demonstração vêm com fotos gratuitas do Pexels, só para você ver como
a vitrine fica cheia. **Elas não retratam a Lemura nem lojistas reais.** Os
créditos de cada uma estão em [`assets/lojas/CREDITOS.md`](assets/lojas/CREDITOS.md).

Ao cadastrar os lojistas verdadeiros, apague as pastas de exemplo dentro de
`assets/lojas/` junto com o arquivo de créditos.

### Imagens externas não funcionam

O site só carrega imagens dos próprios arquivos, por segurança. Um endereço de
Instagram, Google Drive ou site de terceiros **não vai aparecer**. Sempre baixe a
imagem e coloque em `assets/lojas/`.

---

## 6. Atualizar ou tirar uma loja do ar

**Mudou preço, horário ou entrou produto novo:** edite o cadastro em
`data/lojistas.js` e rode `node scripts/gerar.mjs`.

**Pausa temporária:** troque `ativo: true` para `ativo: false`. A loja some da
vitrine e da busca, e o cadastro fica guardado para quando voltar.

**Saída definitiva:** apague o bloco inteiro da loja, de `{` até `},`, e rode o
comando. O gerador apaga a pasta `lojas/<slug>/` sozinho.

Em qualquer um dos casos, quem tiver o link antigo cai numa página de erro que
oferece as outras lojas da galeria — ninguém fica sem saída.

---

## 7. Ver o site na sua máquina antes de publicar

```text
node scripts/servidor.mjs
```

Abra `http://localhost:4173` no navegador. Para parar, aperte `Ctrl + C`.

Vale conferir sempre:

- `http://localhost:4173/lojas.html` — a vitrine, a busca e os filtros
- `http://localhost:4173/lojas/o-slug-da-loja/` — a página da loja
- A mesma página com a janela estreita, simulando um celular

Para espiar uma loja recém-cadastrada sem gerar as páginas, existe também
`http://localhost:4173/loja.html?loja=o-slug-da-loja`. É só pré-visualização: o
endereço que se divulga é sempre `/lojas/o-slug-da-loja/`.

---

## 8. Publicar

O site é feito de arquivos estáticos — não precisa de servidor, banco de dados
nem mensalidade de hospedagem. Serve GitHub Pages, Netlify, Cloudflare Pages ou a
hospedagem que você já tiver.

A rotina completa, sempre nesta ordem:

```text
1. edite data/lojistas.js
2. node scripts/gerar.mjs      <- reescreve as páginas e o sitemap
3. node scripts/servidor.mjs   <- confira no navegador
4. envie os arquivos para a hospedagem
```

**O passo 2 não é opcional.** Sem ele, a loja nova aparece na vitrine mas o link
dela leva a uma página de erro.

### Depois de publicar

Cadastre o site no [Google Search Console](https://search.google.com/search-console)
e envie o `sitemap.xml`. É o que faz as páginas das lojas aparecerem na busca.

---

## 9. Criar um segmento novo

Abra `js/lemura-config.js` e acrescente um item na lista `segmentos`:

```js
{
  id: "pet",
  nome: "Pet & Veterinária",
  curto: "Pet",
  cor: "#eaf4f4",
  icone: '<circle cx="12" cy="12" r="9"/>'
}
```

- `id` — o que você escreve no campo `segmento` das lojas
- `curto` — o rótulo que cabe nos filtros e nos selos
- `cor` — um tom claro; os que já existem servem de referência
- `icone` — o miolo de um SVG desenhado numa área de 24 × 24

O filtro do novo segmento só aparece na vitrine depois que existir ao menos uma
loja usando ele.

---

## 10. Problemas comuns

**"A loja não aparece na vitrine."**
Confira se `ativo` não está `false` e se o `segmento` é exatamente um dos `id`
cadastrados. Depois rode `node scripts/gerar.mjs` e leia os erros.

**"O link da loja dá página de erro."**
Faltou rodar `node scripts/gerar.mjs` depois de cadastrar.

**"A página ficou toda em branco, sem cor nem formatação."**
Provavelmente falta uma vírgula ou uma aspa em `data/lojistas.js`. Cada bloco de
loja termina com `},` e cada campo com `,`. Rodar o gerador aponta o problema.

**"A foto não aparece."**
Três causas, nesta ordem de probabilidade: o caminho está escrito diferente do
nome real do arquivo (maiúsculas e minúsculas contam); a imagem está fora de
`assets/`; ou é um endereço de outro site — veja a
[seção 5](#5-fotos-e-logotipos).

**"Mudei o WhatsApp da galeria mas as páginas das lojas continuam no número antigo."**
Rode `node scripts/gerar.mjs`. As páginas geradas guardam o número dentro delas.

**"O aviso amarelo de demonstração continua aparecendo."**
Troque `modoDemo: true` para `modoDemo: false` em `js/lemura-config.js` e gere de
novo.

**"Preciso de duas lojas com o mesmo nome."**
Pode. O que não pode repetir é o `slug` — dê endereços diferentes, como
`estudio-a` e `estudio-b`.
