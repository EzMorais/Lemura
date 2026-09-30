import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { spawnSync } from "node:child_process";

const root = new URL("../", import.meta.url);

function load(relatives, seed = {}) {
  const context = vm.createContext({ ...seed });
  context.globalThis = context;
  context.window = context;
  for (const relative of relatives) {
    vm.runInContext(fs.readFileSync(new URL(relative, root), "utf8"), context);
  }
  return context;
}

test("a ficha de uma vaga distingue dado ausente de item não instalado", () => {
  const ctx = load(["js/lemura-config.js", "js/lemura-templates.js"]);
  const html = ctx.LemuraTemplates.cardSala({
    numero: "12",
    identificacaoPublica: "Espaço A",
    andar: "Térreo",
    area: 0,
    modalidade: "box-fixo",
    banheiroPrivativo: false,
    arCondicionado: null,
    vitrine: true,
    fotos: [],
    observacao: "",
  });

  assert.match(html, /Espaço A/);
  assert.match(html, /Área<\/dt><dd>Metragem a confirmar/);
  assert.match(html, /Banheiro privativo<\/dt><dd>Não/);
  assert.match(html, /Ar-condicionado<\/dt><dd>A confirmar/);
  assert.match(html, /Vitrine para o corredor<\/dt><dd>Sim/);
  assert.doesNotMatch(html, /Sala 12/);
});

test("sem número oficial, templates não criam URL de WhatsApp fictícia", () => {
  const ctx = load(["js/lemura-config.js", "js/lemura-templates.js"]);
  assert.equal(ctx.LemuraTemplates.urlWhatsapp("", "Olá"), "");
});

test("sem WhatsApp oficial, ações da galeria levam à localização", () => {
  const atributos = {};
  const link = {
    dataset: { msg: "Agendar visita" },
    textContent: "Agendar visita",
    setAttribute: (chave, valor) => { atributos[chave] = valor; },
    removeAttribute: (chave) => { delete atributos[chave]; },
    classList: { add() {}, remove() {} },
  };
  let iniciar;
  const document = {
    readyState: "loading",
    addEventListener: (evento, callback) => { if (evento === "DOMContentLoaded") iniciar = callback; },
    querySelectorAll: (seletor) => seletor === ".js-whatsapp" ? [link] : [],
    querySelector: () => null,
    getElementById: () => null,
  };
  const ctx = load(["js/lemura-config.js", "js/lemura-core.js"], { document, addEventListener() {} });
  iniciar();

  assert.equal(atributos.href, "localizacao.html");
  assert.equal(link.textContent, "Ver como chegar");
  assert.equal(atributos["aria-disabled"], undefined);
});

test("sem salas livres, a página mostra um aviso e não deixa uma grade vazia", () => {
  const totais = [{ textContent: "" }];
  const vagas = [{ textContent: "" }];
  const titulo = { textContent: "" };
  const grade = { hidden: false, innerHTML: "" };
  const secao = { hidden: true, querySelector: () => titulo };
  const aviso = { hidden: true };
  const document = {
    querySelectorAll: (seletor) => seletor === "[data-salas-total]" ? totais : seletor === "[data-salas-vagas]" ? vagas : [],
    querySelector: (seletor) => seletor === ".lm-disponibilidade__sem-vagas" ? aviso : null,
    getElementById: (id) => id === "salas-disponiveis" ? grade : id === "disponibilidade" ? secao : null,
  };
  const ctx = load(["js/salas.js"], {
    document,
    LEMURA_SALAS: [],
    LemuraTemplates: { cardSala() { return ""; } },
    Lemura: { observarReveal() {} },
  });

  assert.equal(totais[0].textContent, "0");
  assert.equal(vagas[0].textContent, "0");
  assert.equal(grade.hidden, true);
  assert.equal(secao.hidden, false);
  assert.equal(aviso.hidden, false);
  assert.match(titulo.textContent, /próxima disponibilidade/i);
});

test("lojista sem contato próprio nem contato da galeria não recebe link vazio", () => {
  const ctx = load(["js/lemura-config.js", "js/lemura-templates.js"]);
  const html = ctx.LemuraTemplates.cardLoja({ slug: "sem-contato", nome: "Sem Contato", segmento: "servicos", whatsapp: "", produtos: [] });
  assert.doesNotMatch(html, /href=""/);
  assert.match(html, /Contato indisponível/);
});

test("a home prioriza a foto da fachada e deixa as demais fotos preguiçosas", () => {
  const html = fs.readFileSync(new URL("index.html", root), "utf8");
  assert.match(html, /<img[^>]+src="assets\/galeria-fachada\.jpg"[^>]+fetchpriority="high"/s);
  assert.match(html, /id="galeria-ambientes"/);
  for (const path of ["prova/varanda.jpg", "prova/corredor.jpg", "prova/placas.jpg", "prova/vizinhanca.jpg"]) {
    assert.doesNotMatch(html, new RegExp(`<img[^>]+src="assets/${path.replace(".", "\\.")}"`, "s"));
  }
});

test("a home apresenta uma coleção ampla de fotos reais do ambiente", () => {
  const html = fs.readFileSync(new URL("index.html", root), "utf8");
  const section = html.match(/<section id="ambientes"[\s\S]*?<\/section>/)?.[0] || "";
  const photos = section.match(/<img\b[^>]*>/g) || [];
  assert.ok(photos.length >= 10, `esperava ao menos 10 fotos, encontrei ${photos.length}`);
  for (const photo of photos) assert.match(photo, /loading="lazy"/);
  const homePhotos = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+\.jpg)"/g)].map((match) => match[1]);
  assert.equal(new Set(homePhotos).size, homePhotos.length, "a home deve evitar repetir a mesma foto");
  assert.equal(homePhotos.length, 12, "hero, dez fotos de ambientes e uma foto dos lojistas");
});

test("o gerador relata contato ausente e área a medir sem chamar os dados de fictícios ou incompletos", () => {
  const run = spawnSync(process.execPath, ["scripts/gerar.mjs"], { cwd: new URL("..", import.meta.url), encoding: "utf8" });
  const output = run.stdout + run.stderr;
  assert.equal(run.status, 0);
  assert.match(output, /WhatsApp oficial ainda não foi informado/);
  assert.doesNotMatch(output, /número de exemplo/);
  assert.doesNotMatch(output, /ficha vai sair incompleta/);
});
