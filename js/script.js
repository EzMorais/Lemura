/* =====================================================================
   COMPORTAMENTOS EXCLUSIVOS DA PÁGINA INICIAL — ACORDEÃO FAQ (WCAG AA)
   ---------------------------------------------------------------------
   O número de WhatsApp, o menu, o ano do rodapé e a revelação das
   seções ficam em js/lemura-config.js e js/lemura-core.js, usados por
   todas as páginas do site.

   Aqui fica o controle acessível do acordeão das dúvidas frequentes.
   ===================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  var itens = document.querySelectorAll(".faq-item");
  if (!itens.length) return;

  itens.forEach(function (item) {
    var botao = item.querySelector(".faq-toggle");
    var painel = item.querySelector(".faq-panel");
    var icone = item.querySelector(".faq-icone");
    if (!botao || !painel) return;

    botao.addEventListener("click", function () {
      var estaAberto = item.classList.contains("is-open");
      var novoEstado = !estaAberto;

      // Fecha os outros acordeões
      itens.forEach(function (outro) {
        if (outro === item) return;
        outro.classList.remove("is-open");
        var outroBtn = outro.querySelector(".faq-toggle");
        var outroPainel = outro.querySelector(".faq-panel");
        var outroIcone = outro.querySelector(".faq-icone");
        if (outroBtn) outroBtn.setAttribute("aria-expanded", "false");
        if (outroPainel) outroPainel.setAttribute("aria-hidden", "true");
        if (outroIcone) outroIcone.textContent = "+";
      });

      // Alterna o item atual
      item.classList.toggle("is-open", novoEstado);
      botao.setAttribute("aria-expanded", String(novoEstado));
      painel.setAttribute("aria-hidden", String(!novoEstado));
      if (icone) icone.textContent = novoEstado ? "−" : "+";
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var galeria = document.querySelector(".lm-ambientes__grade");
  if (!galeria) return;

  var figuras = Array.from(galeria.querySelectorAll("figure"));
  var botaoMais = document.querySelector(".lm-ambientes__mais");
  if (botaoMais) {
    botaoMais.addEventListener("click", function () {
      var expandida = botaoMais.getAttribute("aria-expanded") === "true";
      figuras.slice(6).forEach(function (figura) { figura.hidden = expandida; });
      botaoMais.setAttribute("aria-expanded", String(!expandida));
      botaoMais.innerHTML = expandida ? 'Ver todas as fotos <span aria-hidden="true">↓</span>' : 'Mostrar menos <span aria-hidden="true">↑</span>';
    });
  }
  var dialogo = document.createElement("dialog");
  dialogo.className = "lm-galeria__dialog";
  dialogo.setAttribute("aria-label", "Fotos dos ambientes da Galeria Lemura");
  dialogo.innerHTML = '<div class="lm-galeria__topo"><strong>Galeria Lemura</strong><button class="lm-galeria__controle lm-galeria__fechar" type="button" data-galeria-fechar>Fechar <span aria-hidden="true">&times;</span></button></div><img class="lm-galeria__imagem" alt=""><div class="lm-galeria__rodape"><button class="lm-galeria__controle" type="button" data-galeria-anterior aria-label="Foto anterior">&lsaquo;</button><p class="lm-galeria__legenda"></p><span class="lm-galeria__contador" aria-live="polite"></span><button class="lm-galeria__controle" type="button" data-galeria-proxima aria-label="Proxima foto">&rsaquo;</button></div>';
  document.body.appendChild(dialogo);
  if (typeof dialogo.showModal !== "function") return;

  var imagemModal = dialogo.querySelector(".lm-galeria__imagem");
  var legendaModal = dialogo.querySelector(".lm-galeria__legenda");
  var contador = dialogo.querySelector(".lm-galeria__contador");
  var indiceAtual = 0;
  var acionadorAtual = null;
  var toqueInicioX = 0;
  var toqueInicioY = 0;

  figuras.forEach(function (figura, indice) {
    var imagem = figura.querySelector("img");
    var legenda = figura.querySelector("figcaption");
    if (!imagem || !legenda) return;

    var botao = document.createElement("button");
    botao.type = "button";
    botao.className = "lm-galeria__abrir";
    botao.setAttribute("aria-label", "Ampliar foto: " + legenda.textContent.trim());
    figura.insertBefore(botao, imagem);
    botao.appendChild(imagem);
    botao.addEventListener("click", function () {
      indiceAtual = indice;
      acionadorAtual = botao;
      atualizarImagem();
      dialogo.showModal();
    });
  });

  dialogo.addEventListener("close", function () {
    if (acionadorAtual) acionadorAtual.focus();
  });

  function atualizarImagem() {
    var figura = figuras[indiceAtual];
    var imagem = figura.querySelector("img");
    var legenda = figura.querySelector("figcaption");
    imagemModal.src = imagem.dataset.lightboxSrc || imagem.currentSrc || imagem.src;
    imagemModal.alt = imagem.alt;
    legendaModal.textContent = legenda.textContent.trim();
    contador.textContent = (indiceAtual + 1) + " / " + figuras.length;
  }

  dialogo.querySelector("[data-galeria-fechar]").addEventListener("click", function () {
    dialogo.close();
  });

  dialogo.querySelector("[data-galeria-anterior]").addEventListener("click", function () {
    indiceAtual = (indiceAtual - 1 + figuras.length) % figuras.length;
    atualizarImagem();
  });

  dialogo.querySelector("[data-galeria-proxima]").addEventListener("click", function () {
    indiceAtual = (indiceAtual + 1) % figuras.length;
    atualizarImagem();
  });

  dialogo.addEventListener("click", function (evento) {
    if (evento.target === dialogo) dialogo.close();
  });

  dialogo.addEventListener("keydown", function (evento) {
    if (evento.key === "ArrowLeft") {
      indiceAtual = (indiceAtual - 1 + figuras.length) % figuras.length;
      atualizarImagem();
    } else if (evento.key === "ArrowRight") {
      indiceAtual = (indiceAtual + 1) % figuras.length;
      atualizarImagem();
    }
  });

  dialogo.addEventListener("touchstart", function (evento) {
    toqueInicioX = evento.changedTouches[0].clientX;
    toqueInicioY = evento.changedTouches[0].clientY;
  }, { passive: true });

  dialogo.addEventListener("touchend", function (evento) {
    var deltaX = evento.changedTouches[0].clientX - toqueInicioX;
    var deltaY = evento.changedTouches[0].clientY - toqueInicioY;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    indiceAtual = (indiceAtual + (deltaX < 0 ? 1 : -1) + figuras.length) % figuras.length;
    atualizarImagem();
  }, { passive: true });
});
