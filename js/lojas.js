/* =====================================================================
   DIRETÓRIO DE LOJAS — busca, filtros por segmento e grade
   Usado por lojas.html
   ===================================================================== */

(function () {
  "use strict";

  var T = window.LemuraTemplates;
  var CFG = window.LEMURA_CONFIG || {};
  var LOJAS = window.Lemura.lojas();

  var elGrade = document.getElementById("lm-grade");
  var elFiltros = document.getElementById("lm-filtros");
  var elBusca = document.getElementById("lm-busca");
  var elLimpar = document.getElementById("lm-limpar");
  var elResultado = document.getElementById("lm-resultado");
  var elVazio = document.getElementById("lm-sem-resultado");
  var elNumeros = document.getElementById("lm-numeros");

  var estado = { termo: "", segmento: "" };

  /* ---------------------------------------------------------------
     Estrutura fixa da página
     --------------------------------------------------------------- */
  document.getElementById("lm-header").innerHTML = T.cabecalho("", "lojas");
  document.getElementById("lm-rodape").innerHTML = T.rodape("");
  document.getElementById("lm-flutuante").outerHTML = T.botaoFlutuante();
  document.getElementById("lm-aviso").innerHTML = T.avisoDemo();

  /* ---------------------------------------------------------------
     Índice de busca (sem acento, minúsculo)
     --------------------------------------------------------------- */
  function indexar(loja) {
    var seg = T.segmentoDe(loja.segmento);
    var partes = [
      loja.nome,
      loja.chamada,
      loja.descricao,
      loja.box,
      seg.nome,
      seg.curto,
      (loja.tags || []).join(" "),
      (loja.produtos || [])
        .map(function (p) {
          return (p.nome || "") + " " + (p.descricao || "");
        })
        .join(" "),
    ];
    return T.semAcento(partes.join(" ")).toLowerCase();
  }

  LOJAS.forEach(function (l) {
    l.__indice = indexar(l);
  });

  function filtrar() {
    var termo = T.semAcento(estado.termo).toLowerCase().trim();
    var palavras = termo ? termo.split(/\s+/) : [];

    return LOJAS.filter(function (l) {
      if (estado.segmento && l.segmento !== estado.segmento) return false;
      if (!palavras.length) return true;
      return palavras.every(function (p) {
        return l.__indice.indexOf(p) !== -1;
      });
    });
  }

  /* ---------------------------------------------------------------
     Números da abertura
     --------------------------------------------------------------- */
  function montarNumeros() {
    var segmentos = {};
    var produtos = 0;
    LOJAS.forEach(function (l) {
      segmentos[l.segmento] = true;
      produtos += (l.produtos || []).length;
    });

    var itens = [
      LOJAS.length + (LOJAS.length === 1 ? " loja na vitrine" : " lojas na vitrine"),
      Object.keys(segmentos).length + " segmentos",
      produtos + (produtos === 1 ? " produto e serviço divulgado" : " produtos e serviços divulgados"),
    ];

    elNumeros.innerHTML = itens
      .map(function (t) {
        return '<li class="lm-chip">' + T.esc(t) + "</li>";
      })
      .join("");
  }

  /* ---------------------------------------------------------------
     Filtros por segmento (só aparecem os que têm loja)
     --------------------------------------------------------------- */
  function montarFiltros() {
    var contagem = {};
    LOJAS.forEach(function (l) {
      contagem[l.segmento] = (contagem[l.segmento] || 0) + 1;
    });

    var botoes = [
      '<button type="button" class="lm-filtro" data-seg="">Todas' +
        '<span class="lm-filtro__conta">' + LOJAS.length + "</span></button>",
    ];

    (CFG.segmentos || []).forEach(function (seg) {
      if (!contagem[seg.id]) return;
      botoes.push(
        '<button type="button" class="lm-filtro" data-seg="' + T.esc(seg.id) + '">' +
          T.iconeSegmento(seg, 15) +
          T.esc(seg.curto || seg.nome) +
          '<span class="lm-filtro__conta">' + contagem[seg.id] + "</span>" +
        "</button>"
      );
    });

    elFiltros.innerHTML = botoes.join("");

    elFiltros.querySelectorAll(".lm-filtro").forEach(function (b) {
      b.addEventListener("click", function () {
        estado.segmento = b.dataset.seg === estado.segmento ? "" : b.dataset.seg;
        aplicar();
      });
    });
  }

  function marcarFiltroAtivo() {
    elFiltros.querySelectorAll(".lm-filtro").forEach(function (b) {
      var ativo = b.dataset.seg === estado.segmento;
      b.classList.toggle("is-ativo", ativo);
      b.setAttribute("aria-pressed", String(ativo));
    });
  }

  /* ---------------------------------------------------------------
     Renderização
     --------------------------------------------------------------- */
  var primeiraRenderizacao = true;

  function renderizar(lista) {
    elGrade.innerHTML = lista
      .map(function (l, i) {
        return T.cardLoja(l, "", { eager: i < 3 });
      })
      .join("");
    window.Lemura.ajustarLinksLocais(elGrade);

    elVazio.hidden = lista.length > 0;
    elGrade.hidden = lista.length === 0;

    var texto;
    if (!lista.length) {
      texto = "Nenhum resultado";
    } else if (lista.length === LOJAS.length && !estado.termo && !estado.segmento) {
      texto = "Mostrando todas as " + lista.length + " lojas";
    } else {
      texto = lista.length + (lista.length === 1 ? " loja encontrada" : " lojas encontradas");
    }
    elResultado.textContent = texto;

    if (primeiraRenderizacao) {
      window.Lemura.observarReveal(elGrade);
      primeiraRenderizacao = false;
    } else {
      /* Ao filtrar, os cards entram já visíveis: repetir a animação a
         cada tecla digitada deixa a busca inquieta. */
      elGrade.querySelectorAll(".reveal").forEach(function (el) {
        el.classList.add("reveal-visible");
      });
    }
  }

  /* ---------------------------------------------------------------
     Endereço da página reflete os filtros (link compartilhável)
     --------------------------------------------------------------- */
  function sincronizarUrl() {
    var params = new URLSearchParams();
    if (estado.segmento) params.set("seg", estado.segmento);
    if (estado.termo) params.set("q", estado.termo);
    var busca = params.toString();
    var novo = window.location.pathname + (busca ? "?" + busca : "") + window.location.hash;
    window.history.replaceState(null, "", novo);
  }

  function aplicar() {
    marcarFiltroAtivo();
    elLimpar.classList.toggle("is-visivel", !!estado.termo);
    renderizar(filtrar());
    sincronizarUrl();
  }

  function lerUrl() {
    var params = new URLSearchParams(window.location.search);
    var seg = params.get("seg") || "";
    if (seg && (CFG.segmentos || []).some(function (s) { return s.id === seg; })) {
      estado.segmento = seg;
    }
    estado.termo = params.get("q") || "";
    elBusca.value = estado.termo;
  }

  /* ---------------------------------------------------------------
     Eventos
     --------------------------------------------------------------- */
  var temporizador = null;
  elBusca.addEventListener("input", function () {
    clearTimeout(temporizador);
    temporizador = setTimeout(function () {
      estado.termo = elBusca.value;
      aplicar();
    }, 140);
  });

  elBusca.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      elBusca.value = "";
      estado.termo = "";
      aplicar();
    }
  });

  elLimpar.addEventListener("click", function () {
    elBusca.value = "";
    estado.termo = "";
    elBusca.focus();
    aplicar();
  });

  document.getElementById("lm-resetar").addEventListener("click", function () {
    elBusca.value = "";
    estado.termo = "";
    estado.segmento = "";
    aplicar();
    elBusca.focus();
  });

  /* ---------------------------------------------------------------
     Início
     --------------------------------------------------------------- */
  montarNumeros();
  montarFiltros();
  lerUrl();
  aplicar();

  window.Lemura.ligarMenu();
  window.Lemura.ligarCabecalho();
  window.Lemura.ligarAno();
  window.Lemura.observarReveal(document);
})();
