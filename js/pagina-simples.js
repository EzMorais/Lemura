/* =====================================================================
   Monta cabeçalho, rodapé e botão flutuante nas páginas de conteúdo fixo.
   A página indica o contexto pelo <body data-base="" data-ativo="">.
   ===================================================================== */

(function () {
  "use strict";

  var T = window.LemuraTemplates;
  if (!T) return;

  var base = document.body.getAttribute("data-base") || "";
  var ativo = document.body.getAttribute("data-ativo") || "";

  var cabecalho = document.getElementById("lm-header");
  if (cabecalho) cabecalho.innerHTML = T.cabecalho(base, ativo);

  var rodape = document.getElementById("lm-rodape");
  if (rodape) rodape.innerHTML = T.rodape(base);

  var flutuante = document.getElementById("lm-flutuante");
  if (flutuante) flutuante.outerHTML = T.botaoFlutuante();

  var aviso = document.getElementById("lm-aviso");
  if (aviso) aviso.innerHTML = T.avisoDemo();

  if (window.Lemura) {
    window.Lemura.ligarWhatsapp(document);
    window.Lemura.ligarMenu();
    window.Lemura.ligarCabecalho();
    window.Lemura.ligarAno();
    window.Lemura.observarReveal(document);
  }
})();
