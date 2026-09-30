/* =====================================================================
   PÁGINA 404
   ---------------------------------------------------------------------
   Duas funções:

   1) Rede de segurança. Se alguém abrir /lojas/<slug>/ antes das páginas
      estáticas terem sido geradas, e o slug existir no cadastro,
      levamos a pessoa para a versão dinâmica em vez de mostrar erro.
   2) Mostrar as lojas da galeria, para o visitante não sair de mãos
      vazias.
   ===================================================================== */

(function () {
  "use strict";

  var T = window.LemuraTemplates;

  /* ---- 1) resgate de /lojas/<slug>/ ---- */
  var partes = window.location.pathname.split("/").filter(Boolean);
  var i = partes.lastIndexOf("lojas");

  if (i !== -1 && partes[i + 1]) {
    var slug = partes[i + 1].replace(/\.html$/, "");
    /* Só redireciona para um slug que realmente existe no cadastro. */
    if (/^[a-z0-9-]+$/.test(slug) && window.Lemura.lojaPorSlug(slug)) {
      window.location.replace("loja.html?loja=" + encodeURIComponent(slug));
      return;
    }
  }

  /* ---- 2) vitrine de consolo ---- */
  var grade = document.getElementById("lm-grade-404");
  if (!grade) return;

  grade.innerHTML = window.Lemura
    .lojas()
    .slice(0, 6)
    .map(function (l) {
      return T.cardLoja(l, "");
    })
    .join("");

  window.Lemura.observarReveal(grade);
})();
