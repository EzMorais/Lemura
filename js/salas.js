/* =====================================================================
   SALAS DISPONÍVEIS NA HOME
   ---------------------------------------------------------------------
   Lê data/salas.js e preenche:
     #salas-disponiveis   grade com uma ficha por sala livre
     [data-salas-total]   número total de salas
     [data-salas-vagas]   número de salas livres
   Se não houver sala livre, a seção #disponibilidade some da página em
   vez de anunciar vaga que não existe.
   ===================================================================== */

(function () {
  "use strict";

  var SALAS = window.LEMURA_SALAS || [];
  var vagas = SALAS.filter(function (s) {
    return s.disponivel === true;
  });

  /* ---- números espalhados pela página ---------------------------- */
  function preencher(seletor, valor) {
    var alvos = document.querySelectorAll(seletor);
    for (var i = 0; i < alvos.length; i++) alvos[i].textContent = String(valor);
  }
  preencher("[data-salas-total]", SALAS.length);
  preencher("[data-salas-vagas]", vagas.length);

  var T = window.LemuraTemplates;
  if (!T) return;

  /* ---- grade de fichas -------------------------------------------- */
  var grade = document.getElementById("salas-disponiveis");
  if (!grade) return;

  var secao = document.getElementById("disponibilidade");

  if (!vagas.length) {
    if (secao) secao.hidden = false;
    grade.hidden = true;
    var tituloSemVagas = secao && secao.querySelector(".lm-secao-cabeca h2");
    if (tituloSemVagas) tituloSemVagas.textContent = "Consulte a próxima disponibilidade.";
    var avisoSemVagas = document.querySelector(".lm-disponibilidade__sem-vagas");
    if (avisoSemVagas) avisoSemVagas.hidden = false;
    return;
  }

  grade.innerHTML = vagas
    .map(function (sala, i) {
      return T.cardSala(sala, "", { eager: i < 3 });
    })
    .join("");

  /* Os cards nascem com .reveal depois que o observer global já rodou —
     sem esta chamada eles ficariam invisíveis. */
  window.Lemura.observarReveal(grade);
})();
