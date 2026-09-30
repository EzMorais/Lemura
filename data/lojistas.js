/* =====================================================================
   LOJISTAS DA GALERIA LEMURA — FONTE ÚNICA DE DADOS
   ---------------------------------------------------------------------
   Tudo o que aparece em /lojas.html e nas páginas individuais de cada
   loja sai daqui. Para cadastrar, atualizar ou remover um lojista,
   edite apenas este arquivo.

   Os lojistas abaixo são REAIS e correspondem à ocupação da Galeria
   Lemura (sessão de 16/12/2025). As fotos são genuínas do espaço.

   A ocupação de cada sala é declarada em data/salas.js, pelo campo
   `ocupante`, que aponta para o `slug` de um lojista daqui.
   ---------------------------------------------------------------------

   CAMPOS DE CADA LOJA
   ---------------------------------------------------------------------
   slug        (obrigatório) endereço da loja no site: só letras minúsculas,
                             números e hífen. Vira /lojas/o-slug/
   nome        (obrigatório) nome comercial exibido
   segmento    (obrigatório) um dos `id` listados em js/lemura-config.js
   box                       identificação do espaço (com badge de localização)
   chamada                   uma linha curta, aparece no card do diretório
   descricao                 texto de apresentação (1 a 3 parágrafos)
   destaque                  true = aparece também na página inicial
   ativo                     false = some do site sem precisar apagar o cadastro

   logo                      caminho da imagem quadrada. Ex.: "assets/lojas/yande/logo.jpg"
   capa                      caminho da imagem horizontal (proporção 16:9)
                             Sem imagem, o site gera um visual próprio com as iniciais.

   whatsapp                  só dígitos, com país e DDD. Ex.: "5515998853137"
                             Vazio = os botões usam o WhatsApp da galeria.
   instagram                 usuário sem "@"
   telefone                  como deve ser exibido. Ex.: "(15) 99885-3137"
   email
   site                      URL completa, com https://

   horarios    lista de { dias, horas }
   pagamentos  lista de textos. Ex.: ["Pix", "Débito", "Crédito"]
   tags        palavras usadas pela busca do diretório

   produtos    lista de produtos ou serviços divulgados:
               { nome, descricao, preco, foto, destaque }
   ===================================================================== */

(function (global) {
  "use strict";

  global.LEMURA_LOJISTAS = [
    /* ------------------------------------------------------------- */
    /* DOCES DE ELISA — SALA 01 (TÉRREO)                            */
    /* ------------------------------------------------------------- */
    {
      slug: "doces-de-elisa",
      nome: "Doces de Elisa",
      segmento: "alimentacao",
      box: "📍 Piso Térreo • Sala 01",
      chamada: "Confeitaria artesanal e cafeteria de esquina com vitrine voltada para a rua.",
      descricao:
        "A Doces de Elisa ocupa a Sala 01 (esquina da Galeria Lemura), com ampla vitrine envidraçada para a calçada e ambiente climatizado. É a primeira parada ao chegar na galeria: balcão refrigerado com bolos do dia, tortas artesanais, doces finos e café expresso servido na hora.\n\nAlém do atendimento presencial no balcão e nas mesas de convivência da galeria, aceitamos encomendas personalizadas para aniversários e eventos especiais, tudo preparado com ingredientes de alta qualidade na cozinha da própria loja.",
      destaque: true,
      ativo: true,
      logo: "",
      capa: "assets/lojas/doces-de-elisa/capa.jpg",
      whatsapp: "5515996189778",
      instagram: "",
      telefone: "(15) 99618-9778",
      email: "",
      site: "",
      horarios: [
        { dias: "Segunda a Sábado", horas: "08:30 às 18:30" },
      ],
      pagamentos: ["Pix", "Cartão de Débito", "Cartão de Crédito", "Dinheiro"],
      tags: ["confeitaria", "doces", "bolo", "aniversário", "café", "salgados", "encomenda", "térreo", "sala 01"],
      produtos: [
        {
          nome: "Bolo de aniversário",
          descricao: "À pronta entrega ou por encomenda personalizada, montado com receitas exclusivas na loja.",
          preco: "Sob consulta",
          foto: "",
          destaque: true,
        },
        {
          nome: "Doces e sobremesas",
          descricao: "Vitrine refrigerada com doces finos individuais, brigadeiros gourmet e fatias de tortas artesanais.",
          preco: "Sob consulta",
          foto: "assets/lojas/doces-de-elisa/doces.jpg",
          destaque: true,
        },
        {
          nome: "Café e acompanhamentos",
          descricao: "Café expresso selecionado, cappuccinos e salgados quentes para saborear nas mesas da galeria.",
          preco: "Sob consulta",
          foto: "",
          destaque: true,
        },
      ],
    },

    /* ------------------------------------------------------------- */
    /* ELIAS & KREPSKI ADVOGADOS — SALA 02 (TÉRREO)                 */
    /* ------------------------------------------------------------- */
    {
      slug: "elias-krepski",
      nome: "Elias & Krepski Advogados",
      segmento: "servicos",
      box: "📍 Piso Térreo • Sala 02",
      chamada: "Advocacia corporativa e consultoria jurídica com sala de reuniões executiva.",
      descricao:
        "O escritório Elias & Krepski Advogados está sediado na Sala 02 da Galeria Lemura (Piso Térreo). Presta consultoria jurídica especializada, assessoria corporativa e representação contenciosa para empresas e clientes individuais em Porangaba e região.\n\nEspaço privativo equipado com sala de reuniões corporativa climatizada, proporcionando discrição, conforto e segurança em cada atendimento.",
      destaque: true,
      ativo: true,
      logo: "",
      capa: "assets/lojas/elias-krepski/capa.jpg",
      whatsapp: "",
      instagram: "",
      telefone: "",
      email: "",
      site: "",
      horarios: [
        { dias: "Segunda a Sexta", horas: "Com hora marcada" },
      ],
      pagamentos: ["Pix", "Transferência Bancária", "Boleto"],
      tags: ["advocacia", "advogado", "jurídico", "escritório", "direito", "empresarial", "térreo", "sala 02"],
      produtos: [
        {
          nome: "Consultoria e assessoria jurídica",
          descricao: "Atendimento corporativo e individual na sala de reuniões da Galeria Lemura. Agende pelo WhatsApp da galeria.",
          preco: "Sob consulta",
          foto: "assets/lojas/elias-krepski/reuniao.jpg",
          destaque: true,
        },
      ],
    },

    /* ------------------------------------------------------------- */
    /* ANDREA ALMEIDA — SALA 03 (TÉRREO)                            */
    /* ------------------------------------------------------------- */
    {
      slug: "andrea-almeida",
      nome: "Andrea Almeida",
      segmento: "beleza",
      box: "📍 Piso Térreo • Sala 03",
      chamada: "Design de sobrancelhas e estética com atendimento individual e banheiro privativo.",
      descricao:
        "Andrea Almeida atende na Sala 03 da Galeria Lemura (Piso Térreo). Um ambiente totalmente reservado, com banheiro privativo exclusivo e ar-condicionado, projetado para proporcionar máxima privacidade e bem-estar durante cada atendimento.\n\nEspecializada em design de sobrancelhas personalizado, micropigmentação, lash lifting e cuidados estéticos faciais, sempre com agendamento prévio individualizado.",
      destaque: true,
      ativo: true,
      logo: "",
      capa: "",
      whatsapp: "5514998605606",
      instagram: "andreaalmeidasobrancelhas",
      telefone: "(14) 99860-5606",
      email: "",
      site: "",
      horarios: [
        { dias: "Terça a Sábado", horas: "Com hora marcada" },
      ],
      pagamentos: ["Pix", "Cartão de Débito", "Cartão de Crédito", "Dinheiro"],
      tags: ["sobrancelha", "design de sobrancelhas", "beleza", "estética", "hora marcada", "térreo", "sala 03"],
      produtos: [
        {
          nome: "Design de sobrancelhas",
          descricao: "Mapeamento facial e design personalizado com atendimento individual e hora marcada.",
          preco: "Sob consulta",
          foto: "",
          destaque: true,
        },
        {
          nome: "Procedimentos de beleza e estética facial",
          descricao: "Cuidados estéticos faciais, micropigmentação e harmonização do olhar. Consulte opções pelo WhatsApp.",
          preco: "Sob consulta",
          foto: "",
          destaque: true,
        },
      ],
    },

    /* ------------------------------------------------------------- */
    /* IMOBILIÁRIA FABIANA — SALA 04 (TÉRREO)                       */
    /* ------------------------------------------------------------- */
    {
      slug: "imobiliaria-fabiana",
      nome: "Imobiliária Fabiana",
      segmento: "servicos",
      box: "📍 Piso Térreo • Sala 04",
      chamada: "Intermediação imobiliária e emissão de certificados digitais. CRECI 62417-F.",
      descricao:
        "A Imobiliária Fabiana Nogueira (CRECI 62417-F) atende na Sala 04 da Galeria Lemura (Piso Térreo). Com sólida atuação no mercado regional de Porangaba e cidades vizinhas, realiza intermediação segura de compra, venda e locação de imóveis urbanos, comerciais e rurais.\n\nTambém opera como autoridade certificadora credenciada para emissão rápida de certificados digitais e-CPF e e-CNPJ presenciais e online.",
      destaque: false,
      ativo: true,
      logo: "",
      capa: "",
      whatsapp: "5515991915960",
      instagram: "",
      telefone: "(15) 99191-5960",
      email: "",
      site: "",
      horarios: [
        { dias: "Segunda a Sexta", horas: "09:00 às 17:30" },
      ],
      pagamentos: ["Pix", "Boleto", "Cartão de Crédito", "Transferência Bancária"],
      tags: ["imobiliária", "imóveis", "creci", "certificado digital", "certificadora", "aluguel", "térreo", "sala 04"],
      produtos: [
        {
          nome: "Intermediação de imóveis",
          descricao: "Compra, venda, avaliação e locação de imóveis residenciais, comerciais e rurais. CRECI 62417-F.",
          preco: "Sob consulta",
          foto: "",
          destaque: true,
        },
        {
          nome: "Certificado digital",
          descricao: "Emissão e renovação de certificados e-CPF e e-CNPJ, com atendimento presencial ou validação por videoconferência.",
          preco: "Sob consulta",
          foto: "",
          destaque: true,
        },
      ],
    },

    /* ------------------------------------------------------------- */
    /* YANDÊ SAÚDE & BEM ESTAR — SALAS 05 A 08 (SUPERIOR)           */
    /* ------------------------------------------------------------- */
    {
      slug: "yande",
      nome: "Yandê Saúde & Bem Estar",
      segmento: "saude",
      box: "📍 Piso Superior • Salas 05 a 08",
      chamada: "Clínica integrada multidisciplinar: fisioterapia, psicologia, nutrição e massoterapia.",
      descricao:
        "A Yandê Saúde & Bem Estar ocupa uma ala integrada de quatro salas no Piso Superior da Galeria Lemura (Salas 05, 06, 07 e 08), reunindo um corpo clínico multidisciplinar completo em um único endereço de referência em Porangaba.\n\nEstrutura dos consultórios:\n- Sala 05: Recepção central da clínica, clínica geral, nutrição, iridologia e fonoaudiologia, com banheiro privativo.\n- Sala 06: Consultório de fisioterapia e microfisioterapia equipado com maca especializada.\n- Sala 07: Consultório de psicologia clínica, psicanálise e psicopedagogia em ambiente privativo com banheiro exclusivo.\n- Sala 08: Sala de massoterapia, terapias corporais relaxantes e drenagem linfática.\n\nAtendimento humanizado, acolhedor e sempre com hora marcada.",
      destaque: true,
      ativo: true,
      logo: "",
      capa: "assets/lojas/yande/capa.jpg",
      whatsapp: "5515998853137",
      instagram: "",
      telefone: "(15) 99885-3137",
      email: "",
      site: "",
      horarios: [
        { dias: "Segunda a Sexta", horas: "08:00 às 19:00" },
        { dias: "Sábado", horas: "Com agendamento prévio" },
      ],
      pagamentos: ["Pix", "Cartão de Débito", "Cartão de Crédito", "Dinheiro"],
      tags: [
        "fisioterapia", "microfisioterapia", "psicologia", "psicanálise", "psicopedagogia",
        "nutrição", "iridologia", "fonoaudiologia", "massoterapia", "clínica geral",
        "saúde", "bem-estar", "spa", "superior", "salas 05 a 08",
      ],
      produtos: [
        {
          nome: "Fisioterapia e microfisioterapia",
          descricao: "Sala 06. Reabilitação física, tratamento postural e microfisioterapia com atendimento individual.",
          preco: "Sob consulta",
          foto: "assets/lojas/yande/atendimento.jpg",
          destaque: true,
        },
        {
          nome: "Psicologia, psicanálise e psicopedagogia",
          descricao: "Sala 07. Acompanhamento terapêutico individual para crianças, jovens e adultos em ambiente privativo com banheiro.",
          preco: "Sob consulta",
          foto: "assets/lojas/yande/grupo.jpg",
          destaque: true,
        },
        {
          nome: "Massoterapia e terapias corporais",
          descricao: "Sala 08. Sessões individuais de massoterapia relaxante, terapêutica e drenagem linfática em maca preparada.",
          preco: "Sob consulta",
          foto: "assets/lojas/yande/massoterapia.jpg",
          destaque: true,
        },
        {
          nome: "Clínica geral, nutrição e fonoaudiologia",
          descricao: "Sala 05. Atendimentos integrados de saúde e nutrição na recepção da clínica Yandê.",
          preco: "Sob consulta",
          foto: "assets/lojas/yande/capa.jpg",
          destaque: false,
        },
      ],
    },

    /* ------------------------------------------------------------- */
    /* ESPAÇO ZOE — SALA 09 (SUPERIOR)                              */
    /* ------------------------------------------------------------- */
    {
      slug: "espaco-zoe",
      nome: "Espaço ZOE",
      segmento: "servicos",
      box: "📍 Piso Superior • Sala 09",
      chamada: "Ateliê coletivo, oficina de artes e projetos sociais de inclusão e saúde mental.",
      descricao:
        "O Espaço ZOE ocupa a Sala 09 no Piso Superior da Galeria Lemura. É uma iniciativa comunitária de artesanato e arte-educação orientada pelo propósito expresso em seu lema: oficina gratuita, amor, inclusão e valorização da saúde mental.\n\nA sala ampla conta com bancadas completas de oficina, acervo de materiais de arte organizados e ambiente acolhedor para turmas de artesanato, oficinas expressivas e encontros comunitários.",
      destaque: true,
      ativo: true,
      logo: "",
      capa: "assets/lojas/espaco-zoe/capa.jpg",
      whatsapp: "5515998855186",
      instagram: "",
      telefone: "(15) 99885-5186",
      email: "",
      site: "",
      horarios: [
        { dias: "Quarta a Sábado", horas: "Conforme turmas e oficinas" },
      ],
      pagamentos: ["Oficinas gratuitas", "Doações voluntárias", "Pix"],
      tags: ["artesanato", "oficina", "artes", "projeto social", "inclusão", "saúde mental", "ateliê", "superior", "sala 09"],
      produtos: [
        {
          nome: "Oficina de artes e artesanato",
          descricao: "Oficinas criativas e gratuitas abertas à comunidade. Consulte a programação de turmas e horários.",
          preco: "Gratuito",
          foto: "assets/lojas/espaco-zoe/oficina.jpg",
          destaque: true,
        },
        {
          nome: "Projetos sociais e inclusão",
          descricao: "Ações contínuas de integração social, expressão artística e apoio à saúde mental.",
          preco: "Sob consulta",
          foto: "assets/lojas/espaco-zoe/materiais.jpg",
          destaque: true,
        },
      ],
    },
  ];
})(typeof window !== "undefined" ? window : globalThis);
