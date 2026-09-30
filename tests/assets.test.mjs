import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const rootPath = fileURLToPath(root);

test("catálogo de fotos possui exatamente 184 fotos indexadas e miniaturas válidas", () => {
  const jsonPath = path.join(rootPath, "assets", "catalogo", "fotos.json");
  assert.ok(fs.existsSync(jsonPath), "fotos.json deve existir");
  const fotos = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  assert.equal(fotos.length, 184, "deve conter exatamente 184 fotos");

  const thumbsDir = path.join(rootPath, "assets", "catalogo", "thumbs");
  assert.ok(fs.existsSync(thumbsDir), "pasta de thumbs deve existir");
  const thumbs = fs.readdirSync(thumbsDir).filter(f => f.toLowerCase().endsWith(".jpg"));
  assert.equal(thumbs.length, 184, "deve conter 184 miniaturas");
});

test("todos os ativos gerados em assets/ atendem ao teto de 400KB", () => {
  const tetoBytes = 400 * 1024;
  const pastas = [
    path.join(rootPath, "assets", "galeria"),
    path.join(rootPath, "assets", "salas", "vaga-a"),
    path.join(rootPath, "assets", "salas", "vaga-b"),
    path.join(rootPath, "assets", "salas", "vaga-c"),
    path.join(rootPath, "assets", "lojas", "doces-de-elisa"),
    path.join(rootPath, "assets", "lojas", "yande"),
    path.join(rootPath, "assets", "lojas", "espaco-zoe"),
    path.join(rootPath, "assets", "lojas", "elias-krepski"),
    path.join(rootPath, "assets", "prova"),
  ];

  for (const pasta of pastas) {
    assert.ok(fs.existsSync(pasta), `pasta ${pasta} deve existir`);
    const arquivos = fs.readdirSync(pasta).filter(f => f.toLowerCase().endsWith(".jpg"));
    assert.ok(arquivos.length > 0, `pasta ${pasta} deve ter arquivos jpg`);
    for (const arq of arquivos) {
      const filePath = path.join(pasta, arq);
      const stat = fs.statSync(filePath);
      assert.ok(stat.size <= tetoBytes, `Arquivo ${filePath} (${Math.round(stat.size/1024)}KB) excede o teto de 400KB`);
      assert.ok(stat.size > 1000, `Arquivo ${filePath} parece vazio ou corrompido`);
    }
  }
});

test("todas as imagens declaradas em data/salas.js e data/lojistas.js existem fisicamente", () => {
  const context = vm.createContext({});
  context.globalThis = context;
  context.window = context;

  vm.runInContext(fs.readFileSync(path.join(rootPath, "data", "salas.js"), "utf8"), context);
  vm.runInContext(fs.readFileSync(path.join(rootPath, "data", "lojistas.js"), "utf8"), context);

  const salas = context.LEMURA_SALAS || [];
  const lojistas = context.LEMURA_LOJISTAS || [];

  for (const sala of salas) {
    for (const foto of sala.fotos || []) {
      if (foto) {
        const p = path.join(rootPath, foto);
        assert.ok(fs.existsSync(p), `Foto de sala não encontrada: ${foto}`);
      }
    }
  }

  for (const loja of lojistas) {
    if (loja.capa) {
      const p = path.join(rootPath, loja.capa);
      assert.ok(fs.existsSync(p), `Capa de lojista não encontrada: ${loja.capa}`);
    }
    if (loja.logo) {
      const p = path.join(rootPath, loja.logo);
      assert.ok(fs.existsSync(p), `Logo de lojista não encontrada: ${loja.logo}`);
    }
    for (const prod of loja.produtos || []) {
      if (prod.foto) {
        const p = path.join(rootPath, prod.foto);
        assert.ok(fs.existsSync(p), `Foto de produto não encontrada: ${prod.foto}`);
      }
    }
  }
});
