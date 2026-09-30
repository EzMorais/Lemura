/* =====================================================================
   LOJAS EM DESTAQUE NA PÁGINA INICIAL
   ---------------------------------------------------------------------
   Mostra até 3 lojas na seção "Vitrine Lemura" do index.html.
   Entram primeiro as marcadas com `destaque: true` em data/lojistas.js.
   ===================================================================== */

(function () {
  "use strict";

  var T = window.LemuraTemplates;
  var alvo = document.getElementById("destaques-lojas");
  if (!T || !alvo) return;

  var lojas = window.Lemura.lojas();
  var secao = document.getElementById("lojas");

  /* Sem nenhuma loja cadastrada, a seção inteira sai do ar em vez de
     aparecer vazia. */
  if (!lojas.length) {
    if (secao) secao.hidden = true;
    return;
  }

  var destaques = lojas.filter(function (l) {
    return l.destaque;
  });

  /* Completa com as demais quando há menos de três em destaque. */
  if (destaques.length < 3) {
    lojas.forEach(function (l) {
      if (destaques.length < 3 && destaques.indexOf(l) === -1) destaques.push(l);
    });
  }

  alvo.innerHTML = destaques
    .slice(0, 3)
    .map(function (l) {
      return T.cardLoja(l, "");
    })
    .join("");

  window.Lemura.observarReveal(alvo);
})();
