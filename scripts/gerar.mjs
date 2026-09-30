/* =====================================================================
   GERADOR DAS PÁGINAS DE LOJA + SITEMAP
   ---------------------------------------------------------------------
   Como usar, na pasta do projeto:

       node scripts/gerar.mjs

   O que ele faz:
     1. Confere os dados de data/lojistas.js e avisa sobre problemas;
     2. Grava /lojas/<slug>/index.html para cada loja ativa;
     3. Apaga as páginas de lojas que saíram do cadastro;
     4. Reescreve sitemap.xml e robots.txt com o domínio configurado.

   Rode este comando sempre que mexer em data/lojistas.js.
   ===================================================================== */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE_LOJA = "../../";

/* ------------------------------------------------------------------ */
/* Carrega os arquivos do navegador dentro do Node                      */
/* ------------------------------------------------------------------ */

function carregar(relativo) {
  const codigo = fs.readFileSync(path.join(RAIZ, relativo), "utf8");
  new Function(codigo).call(globalThis);
}

carregar("js/lemura-config.js");
carregar("data/lojistas.js");
carregar("data/salas.js");
carregar("js/lemura-templates.js");

const CFG = globalThis.LEMURA_CONFIG;
const T = globalThis.LemuraTemplates;
const TODAS = globalThis.LEMURA_LOJISTAS || [];
const SALAS = globalThis.LEMURA_SALAS || [];

const SITE = String(CFG.siteUrl || "").replace(/\/$/, "");
const DOMINIO_PENDENTE = !SITE || SITE.includes("SEU-DOMINIO-AQUI");

const ZAP = String(CFG.whatsapp || "").replace(/\D/g, "");
const WHATSAPP_PENDENTE = !ZAP || ZAP === "5515900000000";

const avisos = [];
const erros = [];

/* ------------------------------------------------------------------ */
/* Conferência dos dados                                               */
/* ------------------------------------------------------------------ */

function conferir() {
  const vistos = new Set();
  const idsSegmento = new Set((CFG.segmentos || []).map((s) => s.id));

  for (const loja of TODAS) {
    const rotulo = loja.nome || loja.slug || "(loja sem nome)";

    if (!loja.slug) {
      erros.push(`${rotulo}: falta o campo "slug".`);
      continue;
    }
    if (!/^[a-z0-9-]+$/.test(loja.slug)) {
      erros.push(`${rotulo}: o slug "${loja.slug}" só pode ter letras minúsculas, números e hífen.`);
    }
    if (vistos.has(loja.slug)) {
      erros.push(`${rotulo}: o slug "${loja.slug}" está repetido. Cada loja precisa de um endereço único.`);
    }
    vistos.add(loja.slug);

    if (!loja.nome) erros.push(`${loja.slug}: falta o campo "nome".`);
    if (!idsSegmento.has(loja.segmento)) {
      erros.push(
        `${rotulo}: segmento "${loja.segmento}" não existe. ` +
          `Use um destes: ${[...idsSegmento].join(", ")}`
      );
    }

    if (!loja.chamada) avisos.push(`${rotulo}: sem "chamada". O card da vitrine fica com menos apelo.`);
    if (!loja.descricao) avisos.push(`${rotulo}: sem "descricao".`);
    if (!(loja.produtos || []).length) avisos.push(`${rotulo}: nenhum produto ou serviço cadastrado.`);
    if (!T.digitos(loja.whatsapp)) {
      avisos.push(`${rotulo}: sem WhatsApp próprio — os botões vão usar o número da galeria.`);
    }

    for (const campo of ["logo", "capa"]) {
      if (loja[campo] && !fs.existsSync(path.join(RAIZ, loja[campo]))) {
        avisos.push(`${rotulo}: arquivo "${loja[campo]}" (${campo}) não foi encontrado.`);
      }
    }
    for (const p of loja.produtos || []) {
      if (p.foto && !fs.existsSync(path.join(RAIZ, p.foto))) {
        avisos.push(`${rotulo} › ${p.nome}: foto "${p.foto}" não foi encontrada.`);
      }
    }
  }
}

function conferirSalas() {
  const vistos = new Set();
  const slugs = new Set(TODAS.map((l) => l.slug));

  for (const sala of SALAS) {
    const rotulo = `Sala ${sala.numero || "(sem número)"}`;

    if (!sala.numero) {
      erros.push(`${rotulo}: falta o campo "numero".`);
      continue;
    }
    if (vistos.has(sala.numero)) {
      erros.push(`${rotulo}: número repetido em data/salas.js.`);
      continue;
    }
    vistos.add(sala.numero);

    if (sala.ocupante && !slugs.has(sala.ocupante)) {
      erros.push(`${rotulo}: ocupante "${sala.ocupante}" não existe em data/lojistas.js.`);
    }
    if (sala.disponivel && sala.ocupante) {
      erros.push(`${rotulo}: está marcada como disponível mas tem ocupante.`);
    }
    if (sala.disponivel && !sala.area) {
      avisos.push(`${rotulo}: metragem pendente — a ficha exibirá “A medir”.`);
    }

    for (const foto of sala.fotos || []) {
      if (foto && !fs.existsSync(path.join(RAIZ, foto))) {
        avisos.push(`${rotulo}: foto "${foto}" não foi encontrada.`);
      }
    }
  }

  // Todo lojista ativo precisa estar em alguma sala, senão o mapa mente.
  const ocupados = new Set(SALAS.map((s) => s.ocupante).filter(Boolean));
  for (const loja of TODAS) {
    if (loja.ativo === false) continue;
    if (!ocupados.has(loja.slug)) {
      avisos.push(`${loja.nome}: não está atribuído a nenhuma sala em data/salas.js.`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Molde das páginas                                                   */
/* ------------------------------------------------------------------ */

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self'",
  "connect-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

function absoluto(caminho) {
  if (!caminho) return "";
  if (/^https?:\/\//.test(caminho)) return caminho;
  return SITE + "/" + String(caminho).replace(/^\//, "");
}

function paginaDeLoja(loja) {
  const meta = T.metaLoja(loja);
  const canonico = absoluto(meta.caminho);
  const imagem = absoluto(meta.imagem);
  const jsonLd = JSON.stringify(T.jsonLdLoja(loja), null, 2).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${T.esc(meta.titulo)}</title>
<meta name="description" content="${T.esc(meta.descricao)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${T.esc(canonico)}">

<!-- Arquivo gerado por scripts/gerar.mjs a partir de data/lojistas.js.
     Não edite à mão: as alterações se perdem na próxima geração. -->

<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="referrer" content="strict-origin-when-cross-origin">

<link rel="icon" type="image/svg+xml" href="${BASE_LOJA}assets/favicon.svg">
<link rel="icon" type="image/png" href="${BASE_LOJA}assets/favicon.png">
<link rel="apple-touch-icon" href="${BASE_LOJA}assets/apple-touch-icon.png">

<meta property="og:type" content="business.business">
<meta property="og:site_name" content="${T.esc(CFG.nome || "Galeria Lemura")}">
<meta property="og:title" content="${T.esc(meta.titulo)}">
<meta property="og:description" content="${T.esc(meta.descricao)}">
<meta property="og:url" content="${T.esc(canonico)}">
<meta property="og:locale" content="pt_BR">
<meta property="og:image" content="${T.esc(imagem)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${T.esc(meta.titulo)}">
<meta name="twitter:description" content="${T.esc(meta.descricao)}">
<meta name="twitter:image" content="${T.esc(imagem)}">


<link rel="stylesheet" href="${BASE_LOJA}css/styles.css">
<link rel="stylesheet" href="${BASE_LOJA}css/vitrine.css">

<script type="application/ld+json">
${jsonLd}
</script>
</head>
<body class="lm-body">

<a class="lm-pular" href="#conteudo">Pular para o conteúdo</a>

<div class="lm-pagina">

${T.cabecalho(BASE_LOJA, "lojas")}

  <main id="conteudo">
${T.paginaLoja(loja, BASE_LOJA, TODAS)}
  </main>

${T.rodape(BASE_LOJA)}

</div>

${T.botaoFlutuante()}

<script src="${BASE_LOJA}js/lemura-config.js"></script>
<script src="${BASE_LOJA}js/lemura-core.js"></script>
</body>
</html>
`;
}

function paginaIndiceLojas() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url=../lojas.html">
<link rel="canonical" href="${T.esc(SITE)}/lojas.html">
<meta name="robots" content="noindex, follow">
<title>Lojas da Galeria Lemura</title>
</head>
<body>
<p>Redirecionando para <a href="../lojas.html">as lojas da Galeria Lemura</a>…</p>
<script>location.replace("../lojas.html");</script>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* Sitemap e robots                                                    */
/* ------------------------------------------------------------------ */

function gerarSitemap(ativas) {
  const hoje = new Date().toISOString().slice(0, 10);
  const paginas = [
    { loc: SITE + "/", prioridade: "1.0", frequencia: "monthly" },
    { loc: SITE + "/modalidades.html", prioridade: "0.8", frequencia: "monthly" },
    { loc: SITE + "/lojas.html", prioridade: "0.9", frequencia: "weekly" },
    { loc: SITE + "/localizacao.html", prioridade: "0.8", frequencia: "monthly" },
    { loc: SITE + "/anuncie.html", prioridade: "0.7", frequencia: "monthly" },
    ...ativas.map((l) => ({
      loc: SITE + "/lojas/" + l.slug + "/",
      prioridade: "0.8",
      frequencia: "weekly",
    })),
  ];

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    "<!-- Arquivo gerado por scripts/gerar.mjs. Não edite à mão. -->\n" +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    paginas
      .map(
        (p) =>
          "  <url>\n" +
          `    <loc>${p.loc}</loc>\n` +
          `    <lastmod>${hoje}</lastmod>\n` +
          `    <changefreq>${p.frequencia}</changefreq>\n` +
          `    <priority>${p.prioridade}</priority>\n` +
          "  </url>\n"
      )
      .join("") +
    "</urlset>\n"
  );
}

function gerarRobots() {
  return (
    "# Arquivo gerado por scripts/gerar.mjs. Não edite à mão.\n" +
    "# loja.html é a pré-visualização e já se declara noindex;\n" +
    "# o endereço público de cada loja é /lojas/<slug>/\n" +
    "\n" +
    "User-agent: *\n" +
    "Allow: /\n" +
    "\n" +
    `Sitemap: ${SITE}/sitemap.xml\n`
  );
}

/* ------------------------------------------------------------------ */
/* Escrita                                                             */
/* ------------------------------------------------------------------ */

function limparPastasAntigas(pastaLojas, slugsAtivos) {
  if (!fs.existsSync(pastaLojas)) return [];
  const removidas = [];

  for (const item of fs.readdirSync(pastaLojas, { withFileTypes: true })) {
    if (!item.isDirectory() || slugsAtivos.has(item.name)) continue;

    const alvo = path.join(pastaLojas, item.name);
    const conteudo = fs.readdirSync(alvo);
    /* Só apaga o que foi gerado aqui. Nunca mexe em pastas com outros arquivos. */
    if (conteudo.length === 1 && conteudo[0] === "index.html") {
      fs.rmSync(alvo, { recursive: true, force: true });
      removidas.push(item.name);
    } else {
      avisos.push(`A pasta lojas/${item.name}/ não corresponde a nenhuma loja ativa, mas não está vazia — deixei como estava.`);
    }
  }
  return removidas;
}

function principal() {
  conferir();
  conferirSalas();

  if (erros.length) {
    console.error("\n  Não foi possível gerar as páginas. Corrija em data/lojistas.js:\n");
    erros.forEach((e) => console.error("   x  " + e));
    console.error("");
    process.exit(1);
  }

  const ativas = TODAS.filter((l) => l.ativo !== false).sort((a, b) =>
    String(a.nome).localeCompare(String(b.nome), "pt-BR")
  );

  const pastaLojas = path.join(RAIZ, "lojas");
  fs.mkdirSync(pastaLojas, { recursive: true });

  for (const loja of ativas) {
    const destino = path.join(pastaLojas, loja.slug);
    fs.mkdirSync(destino, { recursive: true });
    fs.writeFileSync(path.join(destino, "index.html"), paginaDeLoja(loja), "utf8");
  }

  fs.writeFileSync(path.join(pastaLojas, "index.html"), paginaIndiceLojas(), "utf8");

  const removidas = limparPastasAntigas(pastaLojas, new Set(ativas.map((l) => l.slug)));

  fs.writeFileSync(path.join(RAIZ, "sitemap.xml"), gerarSitemap(ativas), "utf8");
  fs.writeFileSync(path.join(RAIZ, "robots.txt"), gerarRobots(), "utf8");

  /* ---- relatório ---- */
  console.log("");
  console.log(`  Galeria Lemura — ${ativas.length} loja(s) publicada(s)`);
  console.log("");
  for (const loja of ativas) {
    const seg = T.segmentoDe(loja.segmento);
    const qtd = (loja.produtos || []).length;
    console.log(
      `   ok  /lojas/${loja.slug}/`.padEnd(42) +
        `${loja.nome} — ${seg.curto}, ${qtd} item(ns)`
    );
  }

  const inativas = TODAS.length - ativas.length;
  if (inativas > 0) console.log(`\n   --  ${inativas} loja(s) marcada(s) como inativa(s), fora do site.`);
  if (removidas.length) console.log(`   --  removidas: ${removidas.map((r) => "lojas/" + r + "/").join(", ")}`);

  console.log("\n   ok  sitemap.xml e robots.txt atualizados");

  if (avisos.length) {
    console.log("\n  Vale a pena conferir:\n");
    avisos.forEach((a) => console.log("   !   " + a));
  }

  if (DOMINIO_PENDENTE) {
    console.log("\n  ATENÇÃO: `siteUrl` ainda está com o valor de exemplo em js/lemura-config.js.");
    console.log("  Os links do sitemap e do compartilhamento só ficam corretos depois de trocar pelo domínio real.");
  }

  if (WHATSAPP_PENDENTE) {
    console.log("\n  ATENÇÃO: o WhatsApp oficial ainda não foi informado em js/lemura-config.js.");
    console.log("  Os contatos dependentes da galeria ficam indisponíveis até o preenchimento.");
  }

  if (CFG.modoDemo) {
    console.log("\n  Lembrete: `modoDemo` está ligado — o site exibe o aviso de conteúdo de demonstração.");
  }

  console.log("");
}

principal();
