/* =====================================================================
   COMPORTAMENTOS COMPARTILHADOS POR TODAS AS PÁGINAS
   ---------------------------------------------------------------------
   Depende de js/lemura-config.js (carregado antes deste arquivo).
   ===================================================================== */

(function (global) {
  "use strict";

  var CFG = global.LEMURA_CONFIG || {};

  function digitos(valor) {
    return String(valor || "").replace(/\D/g, "");
  }

  function urlWhatsapp(mensagem, numero) {
    var n = digitos(numero) || digitos(CFG.whatsapp);
    var texto = mensagem || "Olá! Vi o site da Galeria Lemura e gostaria de mais informações.";
    if (!n) return "";
    return "https://wa.me/" + n + "?text=" + encodeURIComponent(texto);
  }

  function formatarNumero(numero) {
    var d = digitos(numero);
    if (d.length < 12) return String(numero || "");
    return "+" + d.slice(0, 2) + " " + d.slice(2, 4) + " " + d.slice(4, d.length - 4) + "-" + d.slice(-4);
  }

  /* ------------------------------------------------------------------
     Revelação das seções ao rolar. Pode ser chamada de novo depois de
     inserir conteúdo dinâmico na página.
     ------------------------------------------------------------------ */
  var observador = null;

  /* O navegador lista diretórios em file:// em vez de abrir index.html.
     Os links públicos continuam com a URL curta quando servidos por HTTP. */
  function ajustarLinksLocais(raiz) {
    if (!global.location || global.location.protocol !== "file:") return;
    (raiz || document).querySelectorAll("a[href]").forEach(function (link) {
      var destino = new URL(link.href);
      if (destino.protocol !== "file:" || !/\/lojas\/[a-z0-9-]+\/$/.test(destino.pathname)) return;
      destino.pathname += "index.html";
      link.href = destino.href;
    });
  }

  function observarReveal(raiz) {
    var contexto = raiz || document;
    ajustarLinksLocais(contexto);

    /* Cards editoriais também entram no ritmo da página, mesmo quando o
       HTML não precisa carregar a classe de animação manualmente. */
    contexto.querySelectorAll(
      ".lm-card, .lm-produto, .lm-passos li, .lm-lista-check li, #diferenciais li"
    ).forEach(function (el, indice) {
      el.classList.add("reveal", "reveal-card");
      el.style.setProperty("--reveal-delay", Math.min(indice % 3, 2) * 90 + "ms");
    });

    var alvos = contexto.querySelectorAll(".reveal:not(.reveal-visible)");
    if (!alvos.length) return;

    if (!("IntersectionObserver" in global)) {
      Array.prototype.forEach.call(alvos, function (el) {
        el.classList.add("reveal-visible");
      });
      return;
    }

    if (!observador) {
      observador = new IntersectionObserver(
        function (entradas) {
          entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
              entrada.target.classList.add("reveal-visible");
              observador.unobserve(entrada.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
      );
    }

    Array.prototype.forEach.call(alvos, function (el) {
      observador.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     Liga os elementos marcados com .js-whatsapp ao número configurado.
     ------------------------------------------------------------------ */
  function ligarWhatsapp(raiz) {
    (raiz || document).querySelectorAll(".js-whatsapp").forEach(function (el) {
      var url = urlWhatsapp(el.dataset.msg, el.dataset.numero);
      if (!url) {
        var destinoAlternativo = el.dataset.fallback || "localizacao.html";
        var textoAlternativo = el.dataset.fallbackLabel || "Ver como chegar";
        if (destinoAlternativo) {
          el.setAttribute("href", destinoAlternativo);
          el.removeAttribute("aria-disabled");
          el.removeAttribute("aria-label");
          el.classList.remove("lm-btn--indisponivel");
          el.textContent = textoAlternativo;
          return;
        }
        el.removeAttribute("href");
        el.setAttribute("aria-disabled", "true");
        el.classList.add("lm-btn--indisponivel");
        return;
      }
      el.setAttribute("href", url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    (raiz || document).querySelectorAll(".js-whatsapp-text").forEach(function (el) {
      el.textContent = CFG.whatsapp ? "WhatsApp: " + formatarNumero(CFG.whatsapp) : "WhatsApp em atualização · consulte a localização";
    });

    (raiz || document).querySelectorAll(".lm-visita__aviso").forEach(function (el) {
      el.hidden = !!CFG.whatsapp;
    });

    (raiz || document).querySelectorAll(".js-contato-pendente").forEach(function (el) {
      el.hidden = !!CFG.whatsapp;
    });

    (raiz || document).querySelectorAll(".js-contato-disponivel").forEach(function (el) {
      el.hidden = !CFG.whatsapp;
    });
  }

  /* ------------------------------------------------------------------
     Menu em telas pequenas.
     ------------------------------------------------------------------ */
  function ligarMenu() {
    var botao = document.getElementById("navToggle");
    var painel = document.getElementById("nav-mobile");
    if (!botao || !painel || botao.dataset.ligado === "1") return;
    botao.dataset.ligado = "1";

    botao.addEventListener("click", function () {
      var aberto = painel.classList.toggle("is-open");
      botao.setAttribute("aria-expanded", String(aberto));
      botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });

    painel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        painel.classList.remove("is-open");
        botao.setAttribute("aria-expanded", "false");
        botao.setAttribute("aria-label", "Abrir menu");
      });
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key !== "Escape" || !painel.classList.contains("is-open")) return;
      painel.classList.remove("is-open");
      botao.setAttribute("aria-expanded", "false");
      botao.setAttribute("aria-label", "Abrir menu");
      botao.focus();
    });
  }

  /* ------------------------------------------------------------------
     Sombra do cabeçalho ao rolar + ano no rodapé.
     ------------------------------------------------------------------ */
  function ligarCabecalho() {
    var header = document.getElementById("header");
    if (!header || header.dataset.ligado === "1") return;
    header.dataset.ligado = "1";

    var atualizar = function () {
      header.style.boxShadow = global.scrollY > 8 ? "0 12px 24px -16px rgba(0,0,0,0.25)" : "none";
    };
    global.addEventListener("scroll", atualizar, { passive: true });
    atualizar();
  }

  function ligarAno() {
    document.querySelectorAll("#year").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ------------------------------------------------------------------
     Inicialização
     ------------------------------------------------------------------ */
  function iniciar() {
    ligarWhatsapp(document);
    ligarMenu();
    ligarCabecalho();
    ligarAno();
    observarReveal(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }

  global.Lemura = {
    config: CFG,
    digitos: digitos,
    urlWhatsapp: urlWhatsapp,
    formatarNumero: formatarNumero,
    observarReveal: observarReveal,
    ajustarLinksLocais: ajustarLinksLocais,
    ligarWhatsapp: ligarWhatsapp,
    ligarMenu: ligarMenu,
    ligarCabecalho: ligarCabecalho,
    ligarAno: ligarAno,
    /* Lojas ativas, já ordenadas: destaques primeiro, depois alfabética. */
    lojas: function () {
      var lista = (global.LEMURA_LOJISTAS || []).filter(function (l) {
        return l && l.slug && l.ativo !== false;
      });
      return lista.sort(function (a, b) {
        if (!!b.destaque !== !!a.destaque) return b.destaque ? 1 : -1;
        return String(a.nome).localeCompare(String(b.nome), "pt-BR");
      });
    },
    lojaPorSlug: function (slug) {
      var lista = global.LEMURA_LOJISTAS || [];
      for (var i = 0; i < lista.length; i++) {
        if (lista[i].slug === slug) return lista[i];
      }
      return null;
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
