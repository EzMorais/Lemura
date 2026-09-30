/* =====================================================================
   CONFIGURAÇÃO CENTRAL DA GALERIA LEMURA
   ---------------------------------------------------------------------
   Este é o único arquivo que precisa ser ajustado antes de publicar.
   Todos os outros arquivos leem as informações daqui.
   ===================================================================== */

(function (global) {
  "use strict";

  global.LEMURA_CONFIG = {
    /* ---------------------------------------------------------------
       1) IDENTIDADE E ENDEREÇO PÚBLICO
       --------------------------------------------------------------- */

    // Domínio final do site, SEM barra no fim.
    // Usado nos links canônicos, no compartilhamento e no sitemap.xml.
    siteUrl: "https://lemura.com.br",

    nome: "Galeria Lemura",
    cidade: "Porangaba",
    estado: "SP",

    /* ---------------------------------------------------------------
       2) CONTATO OFICIAL DA GALERIA
       --------------------------------------------------------------- */

    // Código do país + DDD + número, só dígitos.
    // Ex.: "5515999999999" para +55 15 99999-9999
    whatsapp: "", // pendente: manter vazio para não gerar links fictícios

    // Perfil do Instagram da galeria, sem o "@". Deixe "" se ainda não existir.
    instagram: "",

    email: "",

    endereco: "Rua Quatro de Junho, 591 · Centro · Porangaba/SP",

    mapsUrl:
      "https://www.google.com.br/maps/place/Galeria+Lemura/@-23.176229,-48.1239561,17z/data=!4m10!1m2!2m1!1slemura+galeria!3m6!1s0x94c6897672c69b79:0x5d71796fa3087f7c!8m2!3d-23.1763081!4d-48.1213519!15sCg5sZW11cmEgZ2FsZXJpYeABAA!16s%2Fg%2F11wjptf0tb",

    geo: { lat: -23.1763081, lng: -48.1213519 },

    /* ---------------------------------------------------------------
       3) MODO DEMONSTRAÇÃO
       ---------------------------------------------------------------
       Enquanto estiver `true`, o site exibe um aviso discreto de que as
       lojas listadas são exemplos.
       Assim que cadastrar os lojistas reais em data/lojistas.js,
       troque para `false`.
       --------------------------------------------------------------- */
    // Desligado em 21/08/2026: os lojistas em data/lojistas.js passaram a
    // ser reais, então o aviso de demonstração estaria mentindo.
    modoDemo: false,

    /* ---------------------------------------------------------------
       4) SEGMENTOS DA GALERIA
       ---------------------------------------------------------------
       O campo `segmento` de cada loja (em data/lojistas.js) precisa ser
       igual a um dos `id` abaixo.
       Para criar um segmento novo, basta acrescentar um item aqui.
       --------------------------------------------------------------- */
    segmentos: [
      {
        id: "alimentacao",
        nome: "Alimentação & Gastronomia",
        curto: "Alimentação",
        cor: "#F4F1EC",
        icone:
          '<path d="M6 3v7a3 3 0 006 0V3M6 3v18M9 10v11M15 3c-1.5 0-2 2-2 4.5S13.5 12 15 12s2-2 2-4.5S16.5 3 15 3zM15 12v9"/>',
      },
      {
        id: "saude",
        nome: "Saúde & Bem-estar",
        curto: "Saúde",
        cor: "#C1D1E1",
        icone:
          '<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/>',
      },
      {
        id: "beleza",
        nome: "Beleza & Estética",
        curto: "Beleza",
        cor: "#927970",
        icone:
          '<path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4L12 2z"/><path d="M18 16.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z"/>',
      },
      {
        id: "servicos",
        nome: "Serviços Profissionais",
        curto: "Serviços",
        cor: "#C1D1E1",
        icone:
          '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>',
      },
      {
        id: "varejo",
        nome: "Varejo & Boutique",
        curto: "Varejo",
        cor: "#F4F1EC",
        icone: '<path d="M6 2l1.5 5h9L18 2"/><path d="M4 7h16l-1 14H5L4 7z"/>',
      },
      {
        id: "cowork",
        nome: "Cowork & Escritório",
        curto: "Cowork",
        cor: "#7E7D71",
        icone:
          '<circle cx="9" cy="8" r="3"/><path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2c2.9.4 5 2.4 5 5.8"/>',
      },
    ],
  };
})(typeof window !== "undefined" ? window : globalThis);
