# Galeria Lemura: home institucional e página de salas

## Objetivo

Refinar o site atual da Galeria Lemura para apresentar primeiro o empreendimento e seus negócios. A home deve continuar funcionando como parte de um site multipágina, com navegação clara entre as áreas institucionais. A consulta de salas terá página própria, aberta em nova aba pelo CTA principal.

## Direção visual aprovada em conversa

- Usar a identidade monocromática enviada pela pessoa: cinza claro `#D9D9D9`, cinza médio `#8E8E8E` e grafite `#2B2B2B`, com branco/off-white para fundos e respiro.
- Adotar uma direção editorial inspirada em revistas de moda: composição de fotografia em destaque, tipografia expressiva e elegante, grelha editorial e hierarquia visual precisa. A inspiração se aplica à direção de arte do empreendimento; o conteúdo continua sendo sobre a Galeria Lemura, suas salas e seus lojistas, sem modelos, roupas ou funcionalidades de moda.
- Retirar os azuis e cores de destaque atuais da identidade visual. Fotografias permanecem com cor natural, sem filtro azul ou conversão forçada para escala de cinza.
- Usar tipografia editorial para títulos, texto simples e legível para navegação e conteúdo, linhas finas e espaçamento amplo. Evitar o tratamento visual de landing page com um único bloco de conversão ou ornamentos que prejudiquem a leitura.
- Usar fotos reais existentes. Dar prioridade à fachada e a ambientes reconhecíveis; evitar cortes que escondam contexto e evitar repetir a mesma foto em vários cartões. As fotos originais em `C:\Users\morai\OneDrive\Desktop\awd` são referência; o site deve usar versões já otimizadas no repositório ou gerar derivados web otimizados sem alterar os originais.

## Estrutura e comportamento

### Home (`index.html`)

1. Cabeçalho com marca Lemura e navegação para Início, A galeria, Salas, Lojistas, Modalidades e Localização. Em telas estreitas, manter menu acessível por teclado e leitor de tela.
2. Apresentação da Galeria Lemura em Porangaba, com foto real da fachada, título institucional e texto curto. CTA “Conheça nossas salas” direciona a `salas.html` em nova aba; o cabeçalho e os demais links internos continuam na mesma aba.
3. Resumo da galeria e seleção de fotos de ambientes.
4. Chamada compacta para salas, sem duplicar a listagem completa.
5. Resumo das modalidades já oferecidas: box fixo, cowork e uso por período.
6. Destaque de lojistas existentes, usando seus dados e imagens atuais.
7. Bloco de localização com endereço existente e acesso a mapa/visita.
8. Rodapé com navegação para as demais páginas do site.

### Salas (`salas.html`)

- Receber a disponibilidade e os cartões de sala que atualmente aparecem dentro da home.
- Reutilizar os dados e modelos já existentes em `data/salas.js`, `js/salas.js` e `js/lemura-templates.js`, preservando o comportamento, a informação disponível e os estados sem vagas.
- O acesso a `salas.html` abre em nova aba a partir do CTA destacado da home. Os links normais da navegação do site abrem na aba atual.

### Identidade entre páginas

- Consolidar as cores cinza nos tokens compartilhados de `css/styles.css` e revisar os estilos de vitrine em `css/vitrine.css` para que páginas públicas mantenham a mesma identidade sem cores azuis ou acentos saturados.
- Preservar hierarquia, conteúdo, navegação e funções existentes das páginas de lojas, modalidades e localização; limitar mudanças nelas à aplicação da identidade visual compartilhada.

## Conteúdo e fotografias

- Manter como fonte de verdade os dados e textos existentes no repositório, corrigindo apenas apresentação e hierarquia.
- Não inventar áreas, preços, disponibilidade, serviços, horários ou nomes de lojistas.
- Avaliar imagens do diretório `awd` vistas durante o brainstorm (fachada, convivência, circulação, salas e lojistas). A foto da fachada `IMG_7356.JPG` tem flare e letreiro antigo visíveis; é adequada apenas se o corte e a escala preservarem legibilidade e autenticidade. Preferir enquadramento com menos flare quando houver uma opção real melhor.
- Usar os derivados de imagem que já estão em `assets/` quando correspondam às fontes escolhidas, respeitando `srcset`, `sizes`, carregamento lazy e dimensões já usadas no projeto.

## Escopo técnico

- Alterar a home, acrescentar a página de salas, ajustar os estilos compartilhados e atualizar links de navegação, rodapé e sitemap/SEO necessários para a nova rota.
- Não substituir logos ou criar um novo símbolo vetorial nesta mudança; a referência monocromática orienta o tratamento visual, mas o símbolo final existente deve ser preservado até haver um arquivo de marca aprovado.
- Não mudar a estrutura de publicação estática do projeto.

## Critérios de aceite

- A home apresenta a galeria antes de conduzir a pessoa para consultar salas e inclui atalhos para as áreas institucionais do site.
- A página de salas apresenta os mesmos dados e comportamentos de disponibilidade que antes apareciam na home.
- O CTA destacado de salas abre a nova página em outra aba; navegação normal e links internos permanecem previsíveis.
- As páginas públicas usam a paleta cinza, mantêm contraste de leitura e continuam responsivas.
- Fotografias reais são exibidas com cores naturais, descrições alternativas úteis e versões apropriadas para a largura da tela.
- Nenhum conteúdo comercial ou dado de disponibilidade é inventado ou removido.
