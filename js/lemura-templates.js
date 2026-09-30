/* =====================================================================
   TEMPLATES COMPARTILHADOS DA GALERIA LEMURA
   ---------------------------------------------------------------------
   Este arquivo é usado em dois lugares ao mesmo tempo:

   1) No navegador, por lojas.html e loja.html (conteúdo dinâmico);
   2) No Node, por scripts/gerar.mjs, que grava as páginas estáticas
      de cada loja em /lojas/<slug>/index.html.

   Por isso ele não usa `import`/`export`: apenas registra o objeto
   global `LemuraTemplates`. Não altere essa estrutura.

   `base` é o prefixo até a raiz do site:
     - páginas da raiz (lojas.html, loja.html) -> ""
     - páginas geradas (/lojas/slug/)          -> "../../"
   ===================================================================== */

(function (global) {
  "use strict";

  var CFG = global.LEMURA_CONFIG || {};

  /* ==================================================================
     UTILITÁRIOS
     ================================================================== */

  function esc(valor) {
    return String(valor == null ? "" : valor)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function textoSimples(valor) {
    return String(valor == null ? "" : valor).replace(/\s+/g, " ").trim();
  }

  function cortar(texto, limite) {
    var t = textoSimples(texto);
    if (t.length <= limite) return t;
    return t.slice(0, limite - 1).replace(/[\s,;.]+\S*$/, "") + "…";
  }

  function semAcento(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  }

  function slugificar(texto) {
    return semAcento(texto)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function iniciais(nome) {
    var partes = textoSimples(nome)
      .split(" ")
      .filter(function (p) {
        return p.length > 1 || /[0-9]/.test(p);
      });
    if (!partes.length) return "LM";
    if (partes.length === 1) return semAcento(partes[0]).slice(0, 2).toUpperCase();
    return semAcento(partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

  function digitos(valor) {
    return String(valor || "").replace(/\D/g, "");
  }

  /* Só deixa passar endereços http(s). Protege contra um "javascript:"
     digitado por engano — ou de má-fé — no cadastro de uma loja. */
  function urlSegura(valor) {
    var u = String(valor || "").trim();
    return /^https?:\/\//i.test(u) ? u : "";
  }

  function segmentoDe(id) {
    var lista = CFG.segmentos || [];
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id === id) return lista[i];
    }
    return { id: id || "outros", nome: "Outros", curto: "Outros", cor: "#f2f2f2", icone: "" };
  }

  function iconeSegmento(seg, tamanho) {
    var s = tamanho || 18;
    return (
      '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.5" aria-hidden="true">' + (seg.icone || "") + "</svg>"
    );
  }

  /* Cor estável a partir do slug, para os visuais sem foto. */
  function corDoSlug(slug) {
    var paleta = (CFG.segmentos || []).map(function (s) {
      return s.cor;
    });
    if (!paleta.length) paleta = ["#edf4ea", "#ebebfc", "#f7eff7"];
    var h = 0;
    var s = String(slug || "lemura");
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return paleta[h % paleta.length];
  }

  function urlWhatsapp(numero, mensagem) {
    var n = digitos(numero) || digitos(CFG.whatsapp);
    if (!n) return "";
    return "https://wa.me/" + n + "?text=" + encodeURIComponent(mensagem || "");
  }

  /* Contato de WhatsApp da loja, com retorno para o número da galeria. */
  function whatsappDaLoja(loja, mensagemPropria, mensagemGaleria) {
    var proprio = digitos(loja.whatsapp);
    if (proprio) return urlWhatsapp(proprio, mensagemPropria);
    return urlWhatsapp(CFG.whatsapp, mensagemGaleria || mensagemPropria);
  }

  function temWhatsappProprio(loja) {
    return !!digitos(loja.whatsapp);
  }

  function formatarNumero(numero) {
    var d = digitos(numero);
    if (d.length < 12) return numero || "";
    return "+" + d.slice(0, 2) + " " + d.slice(2, 4) + " " + d.slice(4, d.length - 4) + "-" + d.slice(-4);
  }

  /* ==================================================================
     BLOCOS VISUAIS
     ================================================================== */

  var RATIOS = {
    "16x9": "lm-ratio lm-ratio--16x9",
    "4x3": "lm-ratio lm-ratio--4x3",
    "1x1": "lm-ratio lm-ratio--1x1",
    "21x9": "lm-ratio lm-ratio--21x9",
  };

  /* width/height só para o navegador reservar a altura antes de baixar a
     imagem. O tamanho real vem do CSS; o que importa é a proporção. */
  var DIMENSOES = {
    "16x9": [1600, 900],
    "4x3": [1200, 900],
    "1x1": [800, 800],
    "21x9": [2100, 900],
  };

  /**
   * Imagem com retorno elegante para quando o lojista ainda não enviou fotos.
   * opts: { src, alt, base, marca, cor, ratio, classe, eager }
   */
  function midia(opts) {
    var o = opts || {};
    var classes = "lm-media " + (RATIOS[o.ratio] || RATIOS["4x3"]) + (o.classe ? " " + o.classe : "");

    if (o.src) {
      var dim = DIMENSOES[o.ratio] || DIMENSOES["4x3"];
      var caminho = (o.base || "") + o.src;
      var extensao = caminho.slice(caminho.lastIndexOf("."));
      var semExtensao = caminho.slice(0, caminho.length - extensao.length);
      var srcset = semExtensao + "-480" + extensao + " 480w, " +
        semExtensao + "-960" + extensao + " 960w, " + caminho + " 1600w";
      return (
        '<div class="' + classes + '">' +
        '<img src="' + esc(caminho) + '" srcset="' + esc(srcset) + '"' +
        ' sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"' +
        ' alt="' + esc(o.alt || o.marca || "") + '"' +
        ' width="' + dim[0] + '" height="' + dim[1] + '"' +
        (o.eager ? "" : ' loading="lazy"') + ' decoding="async">' +
        "</div>"
      );
    }

    return (
      '<div class="' + classes + ' lm-media--vazia" style="--lm-tom:' + esc(o.cor || "#f0f0f0") + '" ' +
      'role="img" aria-label="' + esc(o.alt || o.marca || "Imagem ainda não enviada") + '">' +
      '<span class="lm-media__iniciais" aria-hidden="true">' + esc(iniciais(o.marca || "Lemura")) + "</span>" +
      "</div>"
    );
  }

  function selo(seg) {
    return (
      '<span class="lm-selo" style="background:' + esc(seg.cor) + '">' +
      iconeSegmento(seg, 14) +
      esc(seg.curto || seg.nome) +
      "</span>"
    );
  }

  function setaDupla(tamanho) {
    var s = tamanho || 16;
    var svg =
      '<svg width="' + s + '" height="' + s + '" viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
      '<path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';
    return '<span class="btn-arrow"><span>' + svg + "</span><span>" + svg + "</span></span>";
  }

  var ICONE_WHATS =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 004.75 1.21h.01' +
    'c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.03c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.8-.11' +
    '-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.35-.15-.19-1.17-1.56-1.17-2.98s.73-2.11 1-2.4c.26-.29.57-.36' +
    '.76-.36.19 0 .38 0 .55.01.17.01.41-.07.64.49.24.58.81 2 .88 2.14.07.15.11.32.02.51-.09.19-.14.3-.28.47-.14.16' +
    '-.29.36-.42.48-.14.13-.28.28-.12.55.15.27.68 1.12 1.46 1.82 1 .89 1.85 1.17 2.12 1.3.26.13.42.11.57-.07.16-.18' +
    '.66-.77.84-1.03.18-.27.36-.22.6-.13.24.09 1.53.72 1.79.85.26.13.44.19.5.3.07.11.07.62-.17 1.3z"/></svg>';

  var ICONE_INSTA =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
    'aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/>' +
    '<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';

  var ICONE_LOCAL =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
    'aria-hidden="true"><path d="M12 21s7-6.1 7-11.5A7 7 0 005 9.5C5 14.9 12 21 12 21z"/>' +
    '<circle cx="12" cy="9.5" r="2.5"/></svg>';

  function acaoWhatsapp(url, classe, conteudo, ariaLabel) {
    if (!url) {
      return '<span class="' + esc(classe) + ' lm-btn--indisponivel" aria-disabled="true">Contato indisponível</span>';
    }
    return '<a class="' + esc(classe) + '" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer"' +
      (ariaLabel ? ' aria-label="' + esc(ariaLabel) + '"' : "") + '>' + conteudo + '</a>';
  }

  /* ==================================================================
     CARD DE LOJA (usado no diretório e na home)
     ================================================================== */

  function cardLoja(loja, base, opcoes) {
    var o = opcoes || {};
    var b = base || "";
    var seg = segmentoDe(loja.segmento);
    var cor = corDoSlug(loja.slug);
    var url = b + "lojas/" + esc(loja.slug) + "/";

    var chips = (loja.produtos || [])
      .filter(function (p) {
        return p && p.nome;
      })
      .slice(0, 3)
      .map(function (p) {
        return '<li class="lm-chip">' + esc(p.nome) + "</li>";
      })
      .join("");

    var restantes = (loja.produtos || []).length - 3;
    if (restantes > 0) {
      chips += '<li class="lm-chip lm-chip--mais">+' + restantes + "</li>";
    }

    var msg =
      "Olá, " + textoSimples(loja.nome) + "! Vi a loja de vocês no site da Galeria Lemura e gostaria de mais informações.";
    var msgGaleria =
      "Olá! Vi a loja " + textoSimples(loja.nome) + " no site da Galeria Lemura e gostaria de falar com eles.";

    return (
      '<article class="lm-card reveal' + (o.classe ? " " + o.classe : "") + '">' +
        midia({
          src: loja.capa,
          base: b,
          marca: loja.nome,
          cor: cor,
          ratio: "16x9",
          alt: "Imagem da loja " + textoSimples(loja.nome),
          classe: "lm-card__capa",
          eager: !!o.eager,
        }) +
        '<div class="lm-card__corpo">' +
          '<div class="lm-card__topo">' +
            selo(seg) +
            (loja.box ? '<span class="lm-card__box">' + esc(loja.box) + "</span>" : "") +
          "</div>" +
          '<h3 class="lm-card__nome">' +
            '<a class="lm-stretched" href="' + url + '">' + esc(loja.nome) + "</a>" +
          "</h3>" +
          (loja.chamada ? '<p class="lm-card__chamada">' + esc(cortar(loja.chamada, 130)) + "</p>" : "") +
          (chips ? '<ul class="lm-chips">' + chips + "</ul>" : "") +
          '<div class="lm-card__rodape">' +
            '<span class="lm-card__ver">Conhecer' + setaDupla(14) + "</span>" +
            acaoWhatsapp(whatsappDaLoja(loja, msg, msgGaleria), "lm-card__whats lm-zt", ICONE_WHATS,
              "Falar com " + loja.nome + " no WhatsApp") +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  /* ==================================================================
     CARD DE SALA DISPONÍVEL
     ================================================================== */

  var MODALIDADES = {
    "box-fixo": "Box fixo",
    cowork: "Cowork flexível",
    periodo: "Uso por período",
  };

  function valorEstado(valor) {
    if (valor === true) return "Sim";
    if (valor === false) return "Não";
    return "A confirmar";
  }

  function linhaFicha(rotulo, valor) {
    return '<div><dt>' + esc(rotulo) + '</dt><dd>' + esc(valor) + '</dd></div>';
  }

  function cardSala(sala, base, opts) {
    var b = base || "";
    var o = opts || {};
    var nomePublico = sala.identificacaoPublica || ("Sala " + sala.numero);
    var rotulo = esc(nomePublico);
    var modalidade = MODALIDADES[sala.modalidade] || "";

    var ficha =
      linhaFicha("Área", sala.area ? sala.area + " m²" : "Metragem a confirmar") +
      linhaFicha("Andar", sala.andar || "A confirmar") +
      linhaFicha("Banheiro privativo", valorEstado(sala.banheiroPrivativo)) +
      linhaFicha("Ar-condicionado", valorEstado(sala.arCondicionado)) +
      linhaFicha("Vitrine para o corredor", valorEstado(sala.vitrine));

    var msg =
      "Olá! Vi o " + textoSimples(nomePublico) +
      " disponível no site da Galeria Lemura e gostaria de saber mais sobre a locação.";

    return (
      '<article class="lm-sala reveal' + (o.classe ? " " + o.classe : "") + '">' +
        midia({
          src: (sala.fotos || [])[0],
          base: b,
          marca: rotulo,
          cor: "#ebebfc",
          ratio: "4x3",
          alt: textoSimples(nomePublico) + " disponível na Galeria Lemura",
          classe: "lm-sala__capa",
          eager: !!o.eager,
        }) +
        '<div class="lm-sala__corpo">' +
          '<div class="lm-sala__topo">' +
            '<h3 class="lm-sala__nome">' + rotulo + "</h3>" +
            '<span class="lm-sala__status">Disponível</span>' +
          "</div>" +
          (modalidade ? '<p class="lm-sala__modalidade">' + esc(modalidade) + "</p>" : "") +
          '<dl class="lm-sala__ficha">' + ficha + "</dl>" +
          (sala.observacao ? '<p class="lm-sala__obs">' + esc(sala.observacao) + "</p>" : "") +
          (urlWhatsapp(CFG.whatsapp, msg)
            ? '<a class="lm-btn lm-btn--bloco lm-zt" href="' + esc(urlWhatsapp(CFG.whatsapp, msg)) + '" target="_blank" rel="noopener noreferrer">Consultar este espaço</a>'
            : '<a class="lm-btn lm-btn--bloco" href="localizacao.html">Ver como chegar</a>') +
        "</div>" +
      "</article>"
    );
  }

  /* ==================================================================
     PÁGINA DE UMA LOJA — conteúdo do <main>
     ================================================================== */

  function linhaInfo(rotulo, valor) {
    if (!valor) return "";
    return (
      '<div class="lm-info__linha"><dt>' + esc(rotulo) + "</dt><dd>" + valor + "</dd></div>"
    );
  }

  function cardProduto(loja, produto, base) {
    var b = base || "";
    var msg =
      "Olá, " + textoSimples(loja.nome) + "! Vi \"" + textoSimples(produto.nome) +
      "\" no site da Galeria Lemura e gostaria de mais informações.";
    var msgGaleria =
      "Olá! Vi \"" + textoSimples(produto.nome) + "\" da loja " + textoSimples(loja.nome) +
      " no site da Galeria Lemura e gostaria de falar com eles.";

    return (
      '<article class="lm-produto reveal">' +
        midia({
          src: produto.foto,
          base: b,
          marca: produto.nome,
          cor: corDoSlug(loja.slug + produto.nome),
          ratio: "4x3",
          alt: textoSimples(produto.nome) + " — " + textoSimples(loja.nome),
          classe: "lm-produto__foto",
        }) +
        '<div class="lm-produto__corpo">' +
          '<h3 class="lm-produto__nome">' + esc(produto.nome) + "</h3>" +
          (produto.descricao ? '<p class="lm-produto__desc">' + esc(produto.descricao) + "</p>" : "") +
          '<div class="lm-produto__rodape">' +
            (produto.preco ? '<span class="lm-produto__preco">' + esc(produto.preco) + "</span>" : "<span></span>") +
            acaoWhatsapp(whatsappDaLoja(loja, msg, msgGaleria), "lm-produto__cta", ICONE_WHATS + "Tenho interesse") +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function paginaLoja(loja, base, todas) {
    var b = base || "";
    var seg = segmentoDe(loja.segmento);
    var cor = corDoSlug(loja.slug);
    var proprio = temWhatsappProprio(loja);

    var msgLoja =
      "Olá, " + textoSimples(loja.nome) + "! Vi a página de vocês no site da Galeria Lemura e gostaria de mais informações.";
    var msgGaleria =
      "Olá! Vi a loja " + textoSimples(loja.nome) + " no site da Galeria Lemura e gostaria de falar com eles.";

    /* ---- produtos ---- */
    var produtos = (loja.produtos || []).filter(function (p) {
      return p && p.nome;
    });
    var htmlProdutos = produtos.length
      ? '<div class="lm-grade lm-grade--3">' +
          produtos
            .map(function (p) {
              return cardProduto(loja, p, b);
            })
            .join("") +
        "</div>"
      : '<p class="lm-vazio">Esta loja ainda não publicou seus produtos e serviços. ' +
        "Fale direto pelo WhatsApp para saber o que ela oferece.</p>";

    /* ---- horários ---- */
    var horarios = (loja.horarios || []).filter(function (h) {
      return h && h.dias;
    });
    var htmlHorarios = horarios.length
      ? '<ul class="lm-horarios">' +
          horarios
            .map(function (h) {
              return "<li><span>" + esc(h.dias) + "</span><strong>" + esc(h.horas || "—") + "</strong></li>";
            })
            .join("") +
        "</ul>"
      : "";

    /* ---- pagamentos ---- */
    var pagamentos = (loja.pagamentos || []).filter(Boolean);
    var htmlPagamentos = pagamentos.length
      ? '<ul class="lm-chips lm-chips--claro">' +
          pagamentos
            .map(function (p) {
              return '<li class="lm-chip">' + esc(p) + "</li>";
            })
            .join("") +
        "</ul>"
      : "";

    /* ---- contato ---- */
    var contato = "";
    if (proprio) {
      contato += linhaInfo(
        "WhatsApp",
        '<a href="' + esc(urlWhatsapp(loja.whatsapp, msgLoja)) + '" target="_blank" rel="noopener noreferrer">' +
          esc(formatarNumero(loja.whatsapp)) + "</a>"
      );
    }
    if (loja.telefone) {
      contato += linhaInfo(
        "Telefone",
        '<a href="tel:' + esc(digitos(loja.telefone)) + '">' + esc(loja.telefone) + "</a>"
      );
    }
    if (loja.instagram) {
      contato += linhaInfo(
        "Instagram",
        '<a href="https://instagram.com/' + esc(loja.instagram) + '" target="_blank" rel="noopener noreferrer">@' +
          esc(loja.instagram) + "</a>"
      );
    }
    if (loja.email) {
      contato += linhaInfo("E-mail", '<a href="mailto:' + esc(loja.email) + '">' + esc(loja.email) + "</a>");
    }
    var siteLoja = urlSegura(loja.site);
    if (siteLoja) {
      contato += linhaInfo(
        "Site",
        '<a href="' + esc(siteLoja) + '" target="_blank" rel="noopener noreferrer">' +
          esc(siteLoja.replace(/^https?:\/\//, "").replace(/\/$/, "")) + "</a>"
      );
    }

    /* ---- outras lojas da galeria ---- */
    var outras = (todas || [])
      .filter(function (l) {
        return l.slug !== loja.slug && l.ativo !== false;
      })
      .sort(function (a, c) {
        var pa = (a.segmento === loja.segmento ? 0 : 1) + (a.destaque ? 0 : 0.5);
        var pc = (c.segmento === loja.segmento ? 0 : 1) + (c.destaque ? 0 : 0.5);
        return pa - pc;
      })
      .slice(0, 3);

    var htmlOutras = outras.length
      ? '<section class="lm-secao reveal" aria-labelledby="outras-lojas">' +
          '<div class="lm-secao__cabeca">' +
            '<div>' +
              '<p class="lm-eyebrow">' + ICONE_LOCAL + "Na mesma galeria</p>" +
              '<h2 id="outras-lojas" class="lm-titulo">Quem mais está na Lemura</h2>' +
            "</div>" +
            '<a class="lm-btn lm-btn--linha" href="' + b + 'lojas.html">Ver todas as lojas</a>' +
          "</div>" +
          '<div class="lm-grade lm-grade--3">' +
            outras
              .map(function (l) {
                return cardLoja(l, b);
              })
              .join("") +
          "</div>" +
        "</section>"
      : "";

    /* ---- montagem ---- */
    return (
      /* trilha */
      '<nav class="lm-trilha" aria-label="Você está em">' +
        '<a href="' + b + 'index.html">Início</a><span aria-hidden="true">/</span>' +
        '<a href="' + b + 'lojas.html">Lojas</a><span aria-hidden="true">/</span>' +
        "<span aria-current=\"page\">" + esc(loja.nome) + "</span>" +
      "</nav>" +

      /* topo da loja */
      '<section class="lm-loja-topo reveal">' +
        midia({
          src: loja.capa,
          base: b,
          marca: loja.nome,
          cor: cor,
          ratio: "21x9",
          alt: "Imagem da loja " + textoSimples(loja.nome),
          classe: "lm-loja-topo__capa",
          eager: true,
        }) +
        '<div class="lm-loja-topo__corpo">' +
          '<div class="lm-loja-topo__marca">' +
            midia({
              src: loja.logo,
              base: b,
              marca: loja.nome,
              cor: cor,
              ratio: "1x1",
              alt: "Logotipo de " + textoSimples(loja.nome),
              classe: "lm-logo",
              eager: true,
            }) +
          "</div>" +
          '<div class="lm-loja-topo__texto">' +
            '<div class="lm-loja-topo__selos">' +
              selo(seg) +
              (loja.box ? '<span class="lm-card__box">' + esc(loja.box) + "</span>" : "") +
            "</div>" +
            "<h1>" + esc(loja.nome) + "</h1>" +
            (loja.chamada ? '<p class="lm-loja-topo__chamada">' + esc(loja.chamada) + "</p>" : "") +
            '<div class="lm-acoes">' +
              acaoWhatsapp(whatsappDaLoja(loja, msgLoja, msgGaleria), "lm-btn lm-btn--whats", ICONE_WHATS +
                (proprio ? "Falar com a loja" : "Falar pela galeria")) +
              (loja.instagram
                ? '<a class="lm-btn lm-btn--linha" href="https://instagram.com/' + esc(loja.instagram) +
                  '" target="_blank" rel="noopener noreferrer">' + ICONE_INSTA + "Instagram</a>"
                : "") +
              '<a class="lm-btn lm-btn--linha" href="' + esc(urlSegura(CFG.mapsUrl) || "#") + '" target="_blank" ' +
                'rel="noopener noreferrer">' + ICONE_LOCAL + "Como chegar</a>" +
            "</div>" +
            (proprio ? "" : (digitos(CFG.whatsapp)
              ? '<p class="lm-nota">O contato desta loja é feito pelo WhatsApp da Galeria Lemura, que encaminha você direto para o lojista.</p>'
              : '<p class="lm-nota">Contato em atualização.</p>')) +
          "</div>" +
        "</div>" +
      "</section>" +

      /* corpo: descrição + produtos | informações */
      '<div class="lm-colunas">' +
        '<div class="lm-colunas__principal">' +
          (loja.descricao
            ? '<section class="lm-secao reveal">' +
                '<p class="lm-eyebrow">' + iconeSegmento(seg, 18) + esc(seg.nome) + "</p>" +
                '<h2 class="lm-titulo">Sobre a loja</h2>' +
                '<div class="lm-texto">' +
                  String(loja.descricao)
                    .split(/\n{2,}/)
                    .map(function (p) {
                      return "<p>" + esc(p.trim()) + "</p>";
                    })
                    .join("") +
                "</div>" +
              "</section>"
            : "") +

          '<section class="lm-secao reveal" id="produtos" aria-labelledby="titulo-produtos">' +
            '<p class="lm-eyebrow">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
              'stroke-width="1.5" aria-hidden="true"><path d="M6 2l1.5 5h9L18 2"/><path d="M4 7h16l-1 14H5L4 7z"/>' +
              "</svg>Vitrine</p>" +
            '<h2 id="titulo-produtos" class="lm-titulo">Produtos e serviços</h2>' +
            (proprio || digitos(CFG.whatsapp)
              ? '<p class="lm-subtitulo">Fale direto com a loja pelo WhatsApp para valores atualizados, disponibilidade e agendamento. A Galeria Lemura não realiza vendas nem cobranças pelo site.</p>'
              : '<p class="lm-subtitulo">Consulte os horários e as informações disponíveis para conhecer este negócio. O contato desta loja está em atualização.</p>') +
            htmlProdutos +
          "</section>" +
        "</div>" +

        '<aside class="lm-colunas__lateral">' +
          '<div class="lm-info reveal">' +
            "<h2>Informações</h2>" +
            (htmlHorarios
              ? '<div class="lm-info__bloco"><h3>Horário de atendimento</h3>' + htmlHorarios + "</div>"
              : "") +
            (htmlPagamentos
              ? '<div class="lm-info__bloco"><h3>Formas de pagamento</h3>' + htmlPagamentos + "</div>"
              : "") +
            (contato ? '<div class="lm-info__bloco"><h3>Contato</h3><dl class="lm-info__lista">' + contato + "</dl></div>" : "") +
            '<div class="lm-info__bloco">' +
              "<h3>Onde encontrar</h3>" +
              "<p>" + esc(CFG.nome || "Galeria Lemura") + (loja.box ? " — " + esc(loja.box) : "") + "</p>" +
              '<p class="lm-info__endereco">' + esc(CFG.endereco || "") + "</p>" +
              '<a class="lm-btn lm-btn--linha lm-btn--bloco" href="' + esc(urlSegura(CFG.mapsUrl) || "#") + '" ' +
                'target="_blank" rel="noopener noreferrer">Abrir no mapa</a>' +
            "</div>" +
          "</div>" +
        "</aside>" +
      "</div>" +

      htmlOutras +

      /* chamada da galeria */
      '<section class="lm-cta-galeria reveal">' +
        "<div>" +
          '<p class="lm-eyebrow lm-eyebrow--claro">Galeria Lemura</p>' +
          "<h2>Quer a sua marca nesta vitrine?</h2>" +
          "<p>Todo lojista da Lemura ganha uma página como esta, sem custo adicional. " +
            '<span data-salas-vagas>3</span> espaços disponíveis.</p>' +
        "</div>" +
        '<div class="lm-cta-galeria__acoes">' +
          '<a class="lm-btn lm-btn--claro" href="' + b + 'anuncie.html">Quero divulgar meu negócio</a>' +
          '<a class="lm-btn lm-btn--fantasma" href="' + b + 'lojas.html">Ver todas as lojas</a>' +
        "</div>" +
      "</section>"
    );
  }

  /* ==================================================================
     CABEÇALHO E RODAPÉ DAS PÁGINAS INTERNAS
     ================================================================== */

  function cabecalho(base, ativo) {
    var b = base || "";
    function item(href, rotulo, chave) {
      return (
        '<a href="' + b + href + '" class="lm-nav__item' + (ativo === chave ? " is-ativo" : "") + '"' +
        (ativo === chave ? ' aria-current="page"' : "") + ">" + rotulo + "</a>"
      );
    }
    var msg = "Olá! Conheci a Galeria Lemura pelo site e gostaria de saber mais sobre vocês.";

    return (
      '<header class="lm-header" id="header">' +
        '<div class="lm-header__barra">' +
          '<a href="' + b + 'index.html" class="lm-marca" aria-label="Galeria Lemura"><img src="' + b + 'assets/lemura-simbolo.svg" alt=""><span>LEMURA</span></a>' +
          '<nav class="lm-nav" id="nav" aria-label="Navegação principal">' +
            '<a href="' + b + 'index.html#disponibilidade" class="lm-nav__item">Salas</a>' +
            '<a href="' + b + 'index.html#ambientes" class="lm-nav__item">Ambientes</a>' +
            item("lojas.html", "Lojistas", "lojas") +
            item("modalidades.html", "Modalidades", "modalidades") +
            item("localizacao.html", "Localização", "localizacao") +
            '<a href="' + b + 'index.html#faq" class="lm-nav__item">Dúvidas</a>' +
          "</nav>" +
          (urlWhatsapp(CFG.whatsapp, msg)
            ? acaoWhatsapp(urlWhatsapp(CFG.whatsapp, msg), "lm-header__cta", "Conversar com a Lemura")
            : '<a class="lm-header__cta" href="' + b + 'localizacao.html">Como chegar</a>') +
          '<button type="button" class="nav-toggle lm-so-mobile" id="navToggle" aria-label="Abrir menu" ' +
            'aria-expanded="false" aria-controls="nav-mobile">' +
            '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
            '<path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>' +
          "</button>" +
        "</div>" +
        '<div class="nav-panel lm-header__mobile" id="nav-mobile">' +
          /* O div sem classe existe para o painel fechado medir zero:
             padding e borda ficam no filho de dentro. */
          "<div>" +
          '<div class="lm-header__mobile-lista">' +
            '<a href="' + b + 'index.html#disponibilidade">Salas</a>' +
            '<a href="' + b + 'index.html#ambientes">Ambientes</a>' +
            '<a href="' + b + 'lojas.html">Lojistas</a>' +
            '<a href="' + b + 'modalidades.html">Modalidades</a>' +
            '<a href="' + b + 'localizacao.html">Localização</a>' +
            '<a href="' + b + 'index.html#faq">Dúvidas</a>' +
            (urlWhatsapp(CFG.whatsapp, msg)
              ? acaoWhatsapp(urlWhatsapp(CFG.whatsapp, msg), "lm-header__mobile-cta", "Conversar com a Lemura")
              : '<a class="lm-header__mobile-cta" href="' + b + 'localizacao.html">Como chegar</a>') +
          "</div>" +
          "</div>" +
        "</div>" +
      "</header>"
    );
  }

  function rodape(base) {
    var b = base || "";
    var insta = CFG.instagram
      ? '<a href="https://instagram.com/' + esc(CFG.instagram) + '" target="_blank" rel="noopener noreferrer">@' +
        esc(CFG.instagram) + "</a>"
      : "Instagram em breve";

    return (
      '<footer class="lm-rodape">' +
        '<div class="lm-rodape__grade">' +
          "<div>" +
            '<span class="lm-rodape__marca"><img src="' + b + 'assets/lemura-simbolo.svg" alt=""><span>LEMURA</span></span>' +
            "<p>Galeria comercial em " + esc((CFG.cidade || "Porangaba") + "/" + (CFG.estado || "SP")) + ".</p>" +
          "</div>" +
          "<div>" +
            "<h4>Navegar</h4>" +
            '<a href="' + b + 'index.html">Início</a>' +
            '<a href="' + b + 'index.html#disponibilidade">Salas disponíveis</a>' +
            '<a href="' + b + 'index.html#ambientes">Ambientes</a>' +
            '<a href="' + b + 'modalidades.html">Modalidades</a>' +
            '<a href="' + b + 'lojas.html">Lojas da galeria</a>' +
            '<a href="' + b + 'localizacao.html">Localização</a>' +
            '<a href="' + b + 'anuncie.html">Divulgue seu negócio</a>' +
          "</div>" +
          "<div>" +
            "<h4>Contato</h4>" +
            "<p>" + (CFG.whatsapp ? "WhatsApp: " + esc(formatarNumero(CFG.whatsapp)) : "WhatsApp em atualização") + "</p>" +
            "<p>" + esc(CFG.endereco || "") + "</p>" +
          "</div>" +
          "<div>" +
            "<h4>Redes</h4>" +
            "<p>" + insta + "</p>" +
          "</div>" +
        "</div>" +
        '<div class="lm-rodape__base">' +
          '<span>© <span id="year"></span> ' + esc(CFG.nome || "Galeria Lemura") + ". Todos os direitos reservados.</span>" +
          '<span class="lm-rodape__aviso">Vitrine de divulgação. As negociações acontecem direto com cada lojista.</span>' +
        "</div>" +
      "</footer>"
    );
  }

  function botaoFlutuante() {
    var msg = "Olá! Vi o site da Galeria Lemura e gostaria de mais informações.";
    var url = urlWhatsapp(CFG.whatsapp, msg);
    return url ? acaoWhatsapp(url, "lm-flutuante", ICONE_WHATS, "Falar no WhatsApp") : "";
  }

  function avisoDemo() {
    if (!CFG.modoDemo) return "";
    return (
      '<div class="lm-aviso-demo" role="note">' +
      "<strong>Conteúdo de demonstração.</strong> As lojas exibidas são exemplos para mostrar como a vitrine funciona. " +
      "Cadastre os lojistas reais em <code>data/lojistas.js</code> e desative o aviso em <code>js/lemura-config.js</code>." +
      "</div>"
    );
  }

  /* ==================================================================
     METADADOS E DADOS ESTRUTURADOS
     ================================================================== */

  function metaLoja(loja) {
    var seg = segmentoDe(loja.segmento);
    var cidade = (CFG.cidade || "Porangaba") + "/" + (CFG.estado || "SP");
    var descricao = cortar(loja.chamada || loja.descricao || "", 150);
    if (!descricao) {
      descricao = loja.nome + " — " + seg.nome + " na Galeria Lemura, em " + cidade + ".";
    } else {
      descricao = descricao + " Na Galeria Lemura, em " + cidade + ".";
    }
    return {
      titulo: loja.nome + " — " + seg.curto + " na Galeria Lemura | " + cidade,
      descricao: cortar(descricao, 160),
      caminho: "lojas/" + loja.slug + "/",
      imagem: loja.capa || loja.logo || "assets/og-image.jpg",
    };
  }

  function jsonLdLoja(loja) {
    var seg = segmentoDe(loja.segmento);
    var base = String(CFG.siteUrl || "").replace(/\/$/, "");
    var url = base + "/lojas/" + loja.slug + "/";

    var dados = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: loja.nome,
      description: textoSimples(loja.chamada || loja.descricao || ""),
      url: url,
      address: {
        "@type": "PostalAddress",
        addressLocality: CFG.cidade || "Porangaba",
        addressRegion: CFG.estado || "SP",
        addressCountry: "BR",
      },
      containedInPlace: {
        "@type": "ShoppingCenter",
        name: CFG.nome || "Galeria Lemura",
        url: base + "/",
      },
      additionalType: seg.nome,
    };

    if (digitos(loja.whatsapp)) dados.telephone = "+" + digitos(loja.whatsapp);
    else if (loja.telefone) dados.telephone = loja.telefone;
    if (loja.capa) dados.image = base + "/" + loja.capa;
    if (loja.instagram) dados.sameAs = ["https://instagram.com/" + loja.instagram];

    var produtos = (loja.produtos || []).filter(function (p) {
      return p && p.nome;
    });
    if (produtos.length) {
      dados.hasOfferCatalog = {
        "@type": "OfferCatalog",
        name: "Produtos e serviços de " + loja.nome,
        itemListElement: produtos.map(function (p, i) {
          return {
            "@type": "Offer",
            position: i + 1,
            itemOffered: {
              "@type": "Service",
              name: p.nome,
              description: textoSimples(p.descricao || ""),
            },
          };
        }),
      };
    }

    return dados;
  }

  /* ==================================================================
     EXPORTAÇÃO
     ================================================================== */

  global.LemuraTemplates = {
    esc: esc,
    textoSimples: textoSimples,
    cortar: cortar,
    semAcento: semAcento,
    slugificar: slugificar,
    iniciais: iniciais,
    digitos: digitos,
    urlSegura: urlSegura,
    segmentoDe: segmentoDe,
    iconeSegmento: iconeSegmento,
    corDoSlug: corDoSlug,
    urlWhatsapp: urlWhatsapp,
    whatsappDaLoja: whatsappDaLoja,
    temWhatsappProprio: temWhatsappProprio,
    formatarNumero: formatarNumero,
    midia: midia,
    selo: selo,
    setaDupla: setaDupla,
    cardLoja: cardLoja,
    cardSala: cardSala,
    cardProduto: cardProduto,
    paginaLoja: paginaLoja,
    cabecalho: cabecalho,
    rodape: rodape,
    botaoFlutuante: botaoFlutuante,
    avisoDemo: avisoDemo,
    metaLoja: metaLoja,
    jsonLdLoja: jsonLdLoja,
    icones: { whatsapp: ICONE_WHATS, instagram: ICONE_INSTA, local: ICONE_LOCAL },
    /* Permite ao gerador Node injetar a configuração depois do carregamento. */
    usarConfig: function (cfg) {
      CFG = cfg || {};
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
