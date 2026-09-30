/* =====================================================================
   SALAS DA GALERIA LEMURA — FONTE ÚNICA DE DADOS
   ---------------------------------------------------------------------
   Configuração Oficial: 12 salas comerciais no total (6 no Térreo e
   6 no Superior), sendo 9 ocupadas e 3 disponíveis (Espaços A, B e C).
   Todos os cálculos de ocupação, planta baixa, indicadores e fichas
   são gerados a partir desta estrutura.

   CAMPOS DE CADA SALA
   ---------------------------------------------------------------------
   numero               (obrigatório) identificação da sala. Ex.: "01"
   identificacaoPublica nome público da vaga disponível (ex.: "Espaço A")
   andar                "Térreo" ou "Superior"
   area                 metragem em m² (número; 0 = a medir)
   disponivel           true = sala disponível para locação (Espaços A, B, C)
   ocupante             slug do lojista em data/lojistas.js (ou "" se vaga)
   modalidade           "box-fixo", "cowork" ou "periodo"
   banheiroPrivativo    true/false/null
   arCondicionado       true/false/null
   vitrine              true = vitrine voltada para o corredor/rua
   fotos                array de caminhos de imagens em alta resolução
   observacao           descrição e destaques da sala

   REGRAS DE INTEGRIDADE
   ---------------------------------------------------------------------
   - Total de salas: exatamente 12 (DOZE) salas comerciais.
   - Disponíveis: exatamente 3 salas (Espaço A, Espaço B, Espaço C).
   - Ocupadas: exatamente 9 salas distribuídas entre os lojistas ativos.
   ===================================================================== */

(function (global) {
  "use strict";

  global.LEMURA_SALAS = [
    /* =================================================================
       PISO TÉRREO (6 salas: 4 ocupadas, 2 disponíveis)
       ================================================================= */
    {
      numero: "01",
      identificacaoPublica: "",
      andar: "Térreo",
      area: 0,
      disponivel: false,
      ocupante: "doces-de-elisa",
      modalidade: "box-fixo",
      banheiroPrivativo: false,
      arCondicionado: true,
      vitrine: true,
      fotos: ["assets/lojas/doces-de-elisa/capa.jpg"],
      observacao: "Sala de esquina no piso térreo, com vitrine envidraçada voltada para a calçada e rua.",
    },
    {
      numero: "02",
      identificacaoPublica: "",
      andar: "Térreo",
      area: 0,
      disponivel: false,
      ocupante: "elias-krepski",
      modalidade: "box-fixo",
      banheiroPrivativo: false,
      arCondicionado: true,
      vitrine: true,
      fotos: [
        "assets/lojas/elias-krepski/capa.jpg",
        "assets/lojas/elias-krepski/reuniao.jpg",
      ],
      observacao: "Elias & Krepski Advogados — Escritório corporativo com sala de reuniões e ar-condicionado.",
    },
    {
      numero: "03",
      identificacaoPublica: "",
      andar: "Térreo",
      area: 0,
      disponivel: false,
      ocupante: "andrea-almeida",
      modalidade: "box-fixo",
      banheiroPrivativo: true,
      arCondicionado: true,
      vitrine: false,
      fotos: [],
      observacao: "Andrea Almeida — Design de sobrancelhas e estética, com banheiro privativo exclusivo e ar-condicionado.",
    },
    {
      numero: "04",
      identificacaoPublica: "",
      andar: "Térreo",
      area: 0,
      disponivel: false,
      ocupante: "imobiliaria-fabiana",
      modalidade: "box-fixo",
      banheiroPrivativo: false,
      arCondicionado: true,
      vitrine: true,
      fotos: ["assets/galeria/corredor-terreo.jpg"],
      observacao: "Imobiliária Fabiana — Intermediação de imóveis e certificação digital no corredor comercial térreo.",
    },
    {
      numero: "12",
      identificacaoPublica: "Espaço A",
      andar: "Térreo",
      area: 0,
      disponivel: true,
      ocupante: "",
      modalidade: "box-fixo",
      banheiroPrivativo: false,
      arCondicionado: null,
      vitrine: true,
      fotos: [
        "assets/salas/vaga-a/principal.jpg",
        "assets/salas/vaga-a/interior.jpg",
      ],
      observacao: "Fachada de vidro voltada para o corredor do térreo, com passagem direta de quem entra pela rua.",
    },
    {
      numero: "13",
      identificacaoPublica: "Espaço B",
      andar: "Térreo",
      area: 0,
      disponivel: true,
      ocupante: "",
      modalidade: "box-fixo",
      banheiroPrivativo: false,
      arCondicionado: null,
      vitrine: true,
      fotos: [
        "assets/salas/vaga-b/principal.jpg",
        "assets/salas/vaga-b/interior.jpg",
      ],
      observacao: "Vitrine de vidro voltada para a área de circulação e mesas compartilhadas de convivência no térreo.",
    },

    /* =================================================================
       PISO SUPERIOR (6 salas: 5 ocupadas, 1 disponível)
       ================================================================= */
    {
      numero: "05",
      identificacaoPublica: "",
      andar: "Superior",
      area: 0,
      disponivel: false,
      ocupante: "yande",
      modalidade: "box-fixo",
      banheiroPrivativo: true,
      arCondicionado: true,
      vitrine: false,
      fotos: ["assets/lojas/yande/capa.jpg"],
      observacao: "Recepção da clínica Yandê. Atendimento em clínica geral, nutrição, iridologia e fonoaudiologia, com banheiro privativo.",
    },
    {
      numero: "06",
      identificacaoPublica: "",
      andar: "Superior",
      area: 0,
      disponivel: false,
      ocupante: "yande",
      modalidade: "box-fixo",
      banheiroPrivativo: false,
      arCondicionado: true,
      vitrine: false,
      fotos: ["assets/lojas/yande/atendimento.jpg"],
      observacao: "Yandê Saúde & Bem Estar — Consultório de fisioterapia e microfisioterapia.",
    },
    {
      numero: "07",
      identificacaoPublica: "",
      andar: "Superior",
      area: 0,
      disponivel: false,
      ocupante: "yande",
      modalidade: "box-fixo",
      banheiroPrivativo: true,
      arCondicionado: true,
      vitrine: false,
      fotos: ["assets/lojas/yande/grupo.jpg"],
      observacao: "Yandê Saúde & Bem Estar — Consultório de psicologia, psicanálise e psicopedagogia com banheiro privativo.",
    },
    {
      numero: "08",
      identificacaoPublica: "",
      andar: "Superior",
      area: 0,
      disponivel: false,
      ocupante: "yande",
      modalidade: "box-fixo",
      banheiroPrivativo: false,
      arCondicionado: true,
      vitrine: false,
      fotos: ["assets/lojas/yande/massoterapia.jpg"],
      observacao: "Yandê Saúde & Bem Estar — Sala de massoterapia, maca clínica e terapias corporais relaxantes.",
    },
    {
      numero: "09",
      identificacaoPublica: "",
      andar: "Superior",
      area: 0,
      disponivel: false,
      ocupante: "espaco-zoe",
      modalidade: "box-fixo",
      banheiroPrivativo: false,
      arCondicionado: true,
      vitrine: true,
      fotos: [
        "assets/lojas/espaco-zoe/capa.jpg",
        "assets/lojas/espaco-zoe/oficina.jpg",
        "assets/lojas/espaco-zoe/materiais.jpg",
      ],
      observacao: "Espaço ZOE — Sala ampla, ateliê coletivo, cursos de artesanato e projetos sociais de inclusão e saúde mental.",
    },
    {
      numero: "14",
      identificacaoPublica: "Espaço C",
      andar: "Superior",
      area: 0,
      disponivel: true,
      ocupante: "",
      modalidade: "box-fixo",
      banheiroPrivativo: true,
      arCondicionado: null,
      vitrine: false,
      fotos: [
        "assets/salas/vaga-c/principal.jpg",
        "assets/salas/vaga-c/banheiro.jpg",
      ],
      observacao: "Piso superior, ambiente privativo silencioso com banheiro privativo exclusivo dentro da sala.",
    },
  ];
})(typeof window !== "undefined" ? window : globalThis);
