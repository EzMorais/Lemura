/* =====================================================================
   PÁGINA DINÂMICA DE UMA LOJA — loja.html?loja=slug
   ---------------------------------------------------------------------
   Usada como pré-visualização. A versão pública e indexável de cada
   loja fica em /lojas/<slug>/, gerada por scripts/gerar.mjs.
   ===================================================================== */

(function () {
  "use strict";

  var T = window.LemuraTemplates;
  var LOJAS = window.Lemura.lojas();
  var main = document.getElementById("conteudo");

  document.getElementById("lm-header").innerHTML = T.cabecalho("", "lojas");
  document.getElementById("lm-rodape").innerHTML = T.rodape("");
  document.getElementById("lm-flutuante").outerHTML = T.botaoFlutuante();

  var params = new URLSearchParams(window.location.search);
  var slug = params.get("loja") || params.get("slug") || "";
  var loja = slug ? window.Lemura.lojaPorSlug(slug) : null;

  if (!loja || loja.ativo === false) {
    document.title = "Loja não encontrada | Galeria Lemura";
    main.innerHTML =
      '<section class="lm-bloco">' +
        '<p class="lm-eyebrow">Galeria Lemura</p>' +
        '<h1 class="lm-titulo">Não encontramos esta loja.</h1>' +
        '<p class="lm-subtitulo">O endereço pode ter mudado ou a loja não está mais na galeria. ' +
          "Veja abaixo quem está na Lemura hoje.</p>" +
        '<a class="lm-btn" href="lojas.html">Ver todas as lojas</a>' +
      "</section>" +
      '<section class="lm-secao" style="margin-top:.75rem">' +
        '<h2 class="lm-titulo" style="font-size:1.5rem">Lojas da galeria</h2>' +
        '<div class="lm-grade lm-grade--3">' +
          LOJAS.slice(0, 6)
            .map(function (l) {
              return T.cardLoja(l, "");
            })
            .join("") +
        "</div>" +
      "</section>";
    window.Lemura.observarReveal(main);
    return;
  }

  /* ---- conteúdo ---- */
  main.innerHTML = T.paginaLoja(loja, "", LOJAS);

  /* ---- metadados (ajuda quem compartilha o link de pré-visualização) ---- */
  var meta = T.metaLoja(loja);
  document.title = meta.titulo;

  function definirMeta(seletor, atributo, valor) {
    var el = document.head.querySelector(seletor);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(atributo, seletor.replace(/^meta\[[^=]+="|"\]$/g, ""));
      document.head.appendChild(el);
    }
    el.setAttribute("content", valor);
  }

  definirMeta('meta[name="description"]', "name", meta.descricao);
  definirMeta('meta[property="og:title"]', "property", meta.titulo);
  definirMeta('meta[property="og:description"]', "property", meta.descricao);
  definirMeta('meta[property="og:type"]', "property", "website");

  var canonico = document.createElement("link");
  canonico.rel = "canonical";
  canonico.href = String(window.LEMURA_CONFIG.siteUrl || "").replace(/\/$/, "") + "/" + meta.caminho;
  document.head.appendChild(canonico);

  window.Lemura.observarReveal(main);
})();
