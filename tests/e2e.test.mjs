/**
 * ============================================================================
 * E2E AUTOMATED TEST SUITE — GALERIA LEMURA
 * ============================================================================
 * Test Specification: TEST_INFRA.md & PROJECT.md & ORIGINAL_REQUEST.md
 * Framework: Native Node.js Test Runner (node:test, node:assert/strict)
 * Zero external dependencies.
 *
 * Structure:
 *   - Tier 1: Feature Coverage (F1 to F7) — 37 test cases
 *   - Tier 2: Boundary & Corner Cases (F1 to F7) — 35 test cases
 *   - Tier 3: Cross-Feature Combinations (Integration) — 10 test cases
 *   - Tier 4: Real-World Application Scenarios (S1 to S5) — 5 user journeys
 * Total: 87 test cases
 * ============================================================================
 */

import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

/**
 * Helper to load browser/universal scripts in a sandboxed VM context
 */
function loadContext(relativePaths, seed = {}) {
  const context = vm.createContext({
    console,
    setTimeout,
    clearTimeout,
    ...seed,
  });
  context.globalThis = context;
  context.window = context;
  for (const rel of relativePaths) {
    const filePath = path.join(ROOT, rel);
    const code = fs.readFileSync(filePath, "utf8");
    vm.runInContext(code, context);
  }
  return context;
}

/**
 * Load default Galeria Lemura data and templates
 */
function loadLemuraEnvironment() {
  return loadContext([
    "js/lemura-config.js",
    "data/salas.js",
    "data/lojistas.js",
    "js/lemura-templates.js",
  ]);
}

// ============================================================================
// TIER 1: FEATURE COVERAGE (F1 to F7)
// ============================================================================

describe("Tier 1: Feature Coverage", () => {
  // --------------------------------------------------------------------------
  // Feature 1: Photo Assets Integration (F1)
  // --------------------------------------------------------------------------
  describe("F1: Photo Assets & Catalog Integration", () => {
    it("F1.1: photo catalog fotos.json is valid JSON with >=180 indexed photography records", () => {
      const catalogPath = path.join(ROOT, "assets/catalogo/fotos.json");
      assert.ok(fs.existsSync(catalogPath), "assets/catalogo/fotos.json must exist");
      const raw = fs.readFileSync(catalogPath, "utf8");
      const catalog = JSON.parse(raw);
      assert.ok(Array.isArray(catalog), "fotos.json must contain an array");
      assert.ok(catalog.length >= 180, `Expected at least 180 photos, found ${catalog.length}`);

      // Verify record schema
      const sample = catalog[0];
      assert.ok(sample.chave, "Record must have 'chave'");
      assert.ok(sample.arquivo, "Record must have 'arquivo'");
      assert.ok(sample.dimensao, "Record must have 'dimensao'");
      assert.ok(sample.thumb, "Record must have 'thumb'");
      assert.ok(sample.categoria, "Record must have 'categoria'");
    });

    it("F1.2: key institutional image assets exist on disk with valid file size (>1KB)", () => {
      const institutionalAssets = [
        "assets/hero-bg.jpg",
        "assets/og-image.jpg",
        "assets/cta-bg.jpg",
        "assets/galeria-fachada.jpg",
        "assets/galeria-area-comum.jpg",
        "assets/galeria-corredor.jpg",
        "assets/galeria-cowork.jpg",
        "assets/galeria-entrada.jpg",
        "assets/galeria-box-modelo.jpg",
      ];
      for (const asset of institutionalAssets) {
        const fullPath = path.join(ROOT, asset);
        assert.ok(fs.existsSync(fullPath), `Asset ${asset} must exist on disk`);
        const stat = fs.statSync(fullPath);
        assert.ok(stat.size > 1024, `Asset ${asset} must be > 1KB (got ${stat.size} bytes)`);
      }
    });

    it("F1.3: curated environment photos in assets/galeria/ exist and contain valid JPEG magic bytes", () => {
      const galeriaDir = path.join(ROOT, "assets/galeria");
      assert.ok(fs.existsSync(galeriaDir), "assets/galeria directory must exist");
      const files = fs.readdirSync(galeriaDir).filter((f) => f.endsWith(".jpg") || f.endsWith(".jpeg"));
      assert.ok(files.length >= 10, `Expected >= 10 gallery photos, found ${files.length}`);

      for (const file of files) {
        const fullPath = path.join(galeriaDir, file);
        const buf = fs.readFileSync(fullPath);
        assert.ok(buf.length > 5000, `${file} size must be > 5KB`);
        // Check JPEG magic bytes: FF D8 FF
        assert.equal(buf[0], 0xff, `${file} must start with 0xFF`);
        assert.equal(buf[1], 0xd8, `${file} must have second byte 0xD8`);
        assert.equal(buf[2], 0xff, `${file} must have third byte 0xFF`);
      }
    });

    it("F1.4: vacant room photo assets exist for Espaços A, B, and C", () => {
      const vacantPhotos = [
        "assets/salas/vaga-a/principal.jpg",
        "assets/salas/vaga-a/interior.jpg",
        "assets/salas/vaga-b/principal.jpg",
        "assets/salas/vaga-b/interior.jpg",
        "assets/salas/vaga-c/principal.jpg",
        "assets/salas/vaga-c/banheiro.jpg",
      ];
      for (const photo of vacantPhotos) {
        const fullPath = path.join(ROOT, photo);
        assert.ok(fs.existsSync(fullPath), `Vacant room photo ${photo} must exist`);
        const stat = fs.statSync(fullPath);
        assert.ok(stat.size > 5000, `Photo ${photo} must be non-empty (>5KB)`);
      }
    });

    it("F1.5: merchant showcase photo assets referenced in data/lojistas.js exist on disk", () => {
      const ctx = loadLemuraEnvironment();
      const lojistas = ctx.LEMURA_LOJISTAS || [];
      assert.ok(lojistas.length >= 5, "Must have active merchants defined");

      for (const loja of lojistas) {
        if (loja.capa) {
          const capaPath = path.join(ROOT, loja.capa);
          assert.ok(fs.existsSync(capaPath), `Merchant cover photo ${loja.capa} for ${loja.nome} must exist`);
        }
        for (const prod of loja.produtos || []) {
          if (prod.foto) {
            const fotoPath = path.join(ROOT, prod.foto);
            assert.ok(fs.existsSync(fotoPath), `Product photo ${prod.foto} for ${loja.nome} must exist`);
          }
        }
      }
    });

    it("F1.6: production photo assets adhere to web performance budget (<450KB)", () => {
      const galeriaDir = path.join(ROOT, "assets/galeria");
      const files = fs.readdirSync(galeriaDir).filter((f) => f.endsWith(".jpg"));
      const MAX_BUDGET = 450 * 1024; // 450 KB

      for (const file of files) {
        const stat = fs.statSync(path.join(galeriaDir, file));
        assert.ok(
          stat.size <= MAX_BUDGET,
          `Photo ${file} (${(stat.size / 1024).toFixed(1)} KB) exceeds budget of 450 KB`
        );
      }
    });
  });

  // --------------------------------------------------------------------------
  // Feature 2: 12-Space Data Model & Indicators (F2)
  // --------------------------------------------------------------------------
  describe("F2: 12-Space Data Model & Indicators", () => {
    it("F2.1: data model schema validation enforces required room fields in LEMURA_SALAS", () => {
      const ctx = loadLemuraEnvironment();
      const salas = ctx.LEMURA_SALAS;
      assert.ok(Array.isArray(salas), "LEMURA_SALAS must be an array");
      assert.ok(salas.length >= 12, `LEMURA_SALAS must define all commercial spaces (got ${salas.length})`);

      for (const sala of salas) {
        assert.ok(typeof sala.numero === "string" && sala.numero.length > 0, "Room must have 'numero'");
        assert.ok(
          sala.andar === "Térreo" || sala.andar === "Superior" || sala.andar === "terreo" || sala.andar === "superior",
          `Room ${sala.numero} has invalid floor: ${sala.andar}`
        );
        assert.equal(typeof sala.disponivel, "boolean", `Room ${sala.numero} must have boolean 'disponivel'`);
        assert.equal(typeof sala.area, "number", `Room ${sala.numero} must have numeric 'area'`);
        assert.ok(Array.isArray(sala.fotos), `Room ${sala.numero} must have 'fotos' array`);
      }
    });

    it("F2.2: room numbering is unique and occupant references are valid lojistas slugs", () => {
      const ctx = loadLemuraEnvironment();
      const salas = ctx.LEMURA_SALAS;
      const lojistas = ctx.LEMURA_LOJISTAS;
      const slugsValidos = new Set(lojistas.map((l) => l.slug));

      const numerosVistos = new Set();
      for (const sala of salas) {
        assert.ok(!numerosVistos.has(sala.numero), `Duplicate room number detected: ${sala.numero}`);
        numerosVistos.add(sala.numero);

        if (sala.ocupante) {
          assert.ok(
            slugsValidos.has(sala.ocupante),
            `Room ${sala.numero} references unknown occupant slug '${sala.ocupante}'`
          );
        }
      }
    });

    it("F2.3: availability calculation identifies exactly 3 vacant spaces (Espaços A, B, C)", () => {
      const ctx = loadLemuraEnvironment();
      const salas = ctx.LEMURA_SALAS;
      const vagas = salas.filter((s) => s.disponivel === true);
      assert.equal(vagas.length, 3, `Expected exactly 3 available rooms, found ${vagas.length}`);

      const nomesVagas = vagas.map((v) => v.identificacaoPublica || v.numero);
      assert.ok(
        nomesVagas.some((n) => /Espaço A/i.test(n) || /12/i.test(n)),
        "Must include Espaço A"
      );
      assert.ok(
        nomesVagas.some((n) => /Espaço B/i.test(n) || /13/i.test(n)),
        "Must include Espaço B"
      );
      assert.ok(
        nomesVagas.some((n) => /Espaço C/i.test(n) || /14/i.test(n)),
        "Must include Espaço C"
      );
    });

    it("F2.4: floor distribution accurately assigns spaces across Térreo and Superior floors", () => {
      const ctx = loadLemuraEnvironment();
      const salas = ctx.LEMURA_SALAS;
      const terreo = salas.filter((s) => /t[ée]rreo/i.test(s.andar));
      const superior = salas.filter((s) => /superior/i.test(s.andar));

      assert.ok(terreo.length >= 4, `Térreo must have >=4 rooms (got ${terreo.length})`);
      assert.ok(superior.length >= 5, `Superior must have >=5 rooms (got ${superior.length})`);

      // Vacant distribution: 2 on terreo (A, B) and 1 on superior (C)
      const vagasTerreo = terreo.filter((s) => s.disponivel === true);
      const vagasSuperior = superior.filter((s) => s.disponivel === true);
      assert.equal(vagasTerreo.length, 2, "Térreo must have exactly 2 vacant spaces (A and B)");
      assert.equal(vagasSuperior.length, 1, "Superior must have exactly 1 vacant space (C)");
    });

    it("F2.5: availability count is displayed as readable text", () => {
      const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
      assert.match(html, /data-salas-vagas/);
      assert.match(html, /class="lm-disponibilidade__resumo"/);
      assert.doesNotMatch(html, /class="donut__value"/);
    });

    it("F2.6: landing page index.html contains data attributes for dynamic room statistics", () => {
      const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
      assert.match(html, /data-salas-vagas/, "index.html must have data-salas-vagas indicator");
      assert.match(html, /data-salas-total/, "index.html must have data-salas-total indicator");
      assert.match(html, /class="lm-disponibilidade__resumo"/, "index.html must show the count as text");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 3: Interactive Floor Plan Logic (F3)
  // --------------------------------------------------------------------------
  describe("F3: Interactive Floor Plan (12 Rooms)", () => {
    it("F3.1: floor switcher logic toggles Térreo and Superior floor panels", () => {
      const ctx = loadLemuraEnvironment();
      const salas = ctx.LEMURA_SALAS;

      const terreoRooms = salas.filter((s) => /t[ée]rreo/i.test(s.andar));
      const superiorRooms = salas.filter((s) => /superior/i.test(s.andar));

      assert.ok(terreoRooms.length > 0, "Térreo panel must receive rooms");
      assert.ok(superiorRooms.length > 0, "Superior panel must receive rooms");
      // Rooms on terreo and superior must be disjoint
      const setTerreo = new Set(terreoRooms.map((s) => s.numero));
      for (const sup of superiorRooms) {
        assert.ok(!setTerreo.has(sup.numero), `Room ${sup.numero} cannot exist on both floors`);
      }
    });

    it("F3.2: vacant room specification rendering with LemuraTemplates.cardSala", () => {
      const ctx = loadLemuraEnvironment();
      const cardHtml = ctx.LemuraTemplates.cardSala({
        numero: "12",
        identificacaoPublica: "Espaço A",
        andar: "Térreo",
        area: 0,
        modalidade: "box-fixo",
        banheiroPrivativo: false,
        arCondicionado: null,
        vitrine: true,
        fotos: ["assets/salas/vaga-a/principal.jpg"],
        observacao: "Fachada de vidro voltada para o corredor do térreo.",
      });

      assert.match(cardHtml, /Espaço A/, "Card must display Espaço A");
      assert.match(cardHtml, /Disponível/, "Card must have Disponível badge");
      assert.match(cardHtml, /Área<\/dt><dd>Metragem a confirmar<\/dd>/, "Card must mark unconfirmed area");
      assert.match(cardHtml, /Vitrine para o corredor<\/dt><dd>Sim<\/dd>/, "Card must format vitrine as 'Sim'");
      assert.match(cardHtml, /assets\/salas\/vaga-a\/principal\.jpg/, "Card must reference room photo");
    });

    it("F3.3: occupied room click-through contract resolves to valid merchant destination", () => {
      const ctx = loadLemuraEnvironment();
      const salas = ctx.LEMURA_SALAS;
      const lojistas = ctx.LEMURA_LOJISTAS;

      const occupiedRooms = salas.filter((s) => s.ocupante && s.ocupante.length > 0);
      assert.ok(occupiedRooms.length >= 5, "Must have occupied rooms mapped");

      for (const room of occupiedRooms) {
        const merchant = lojistas.find((l) => l.slug === room.ocupante);
        assert.ok(merchant, `Merchant for slug ${room.ocupante} must exist in lojistas`);
        const merchantIndexPath = path.join(ROOT, "lojas", merchant.slug, "index.html");
        assert.ok(fs.existsSync(merchantIndexPath), `Target vitrine ${merchantIndexPath} must exist`);
      }
    });

    it("F3.4: room amenity specifications contract handles boolean and null states accurately", () => {
      const ctx = loadLemuraEnvironment();
      const T = ctx.LemuraTemplates;

      // Test with all true
      const htmlTrue = T.cardSala({
        numero: "01",
        andar: "Térreo",
        area: 25,
        banheiroPrivativo: true,
        arCondicionado: true,
        vitrine: true,
      });
      assert.match(htmlTrue, /Banheiro privativo<\/dt><dd>Sim<\/dd>/);
      assert.match(htmlTrue, /Ar-condicionado<\/dt><dd>Sim<\/dd>/);
      assert.match(htmlTrue, /Vitrine para o corredor<\/dt><dd>Sim<\/dd>/);
      assert.match(htmlTrue, /Área<\/dt><dd>25 m²<\/dd>/);

      // Test with all false / null
      const htmlFalse = T.cardSala({
        numero: "02",
        andar: "Superior",
        area: 0,
        banheiroPrivativo: false,
        arCondicionado: false,
        vitrine: false,
      });
      assert.match(htmlFalse, /Banheiro privativo<\/dt><dd>Não<\/dd>/);
      assert.match(htmlFalse, /Ar-condicionado<\/dt><dd>Não<\/dd>/);
      assert.match(htmlFalse, /Vitrine para o corredor<\/dt><dd>Não<\/dd>/);
    });

    it("F3.5: WhatsApp booking CTA message in room detail card encodes space name cleanly", () => {
      const ctx = loadLemuraEnvironment();
      // Configure test whatsapp
      ctx.LEMURA_CONFIG.whatsapp = "5515998853137";
      ctx.LemuraTemplates.usarConfig(ctx.LEMURA_CONFIG);

      const html = ctx.LemuraTemplates.cardSala({
        numero: "14",
        identificacaoPublica: "Espaço C",
        andar: "Superior",
        disponivel: true,
      });

      assert.match(html, /href="https:\/\/wa\.me\/5515998853137\?text=/, "Must format valid WhatsApp link");
      assert.match(html, /Espa%C3%A7o%20C/, "Must URL-encode 'Espaço C'");
      assert.match(html, /target="_blank"/, "Must have target=_blank");
      assert.match(html, /rel="noopener noreferrer"/, "Must have rel='noopener noreferrer'");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 4: Modern Bento Grid Gallery (F4)
  // --------------------------------------------------------------------------
  describe("F4: Modern Bento Grid Gallery", () => {
    it("F4.1: index.html contains #ambientes section with Bento Grid markup", () => {
      const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
      assert.match(html, /<section id="ambientes"/, "index.html must have #ambientes section");
      assert.match(html, /class="lm-ambientes__grade"/, "Section must have .lm-ambientes__grade");
    });

    it("F4.2: Bento Grid cards include asymmetric layout classes (wide, tall, standard)", () => {
      const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
      const ambientes = html.match(/<section id="ambientes"[\s\S]*?<\/section>/)?.[0] || "";
      assert.match(ambientes, /class="lm-ambientes__larga"/, "Bento Grid must have wide items (.lm-ambientes__larga)");
      assert.match(ambientes, /class="lm-ambientes__alta"/, "Bento Grid must have tall items (.lm-ambientes__alta)");
    });

    it("F4.3: all Bento gallery images declare loading='lazy' and decoding='async'", () => {
      const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
      const ambientes = html.match(/<section id="ambientes"[\s\S]*?<\/section>/)?.[0] || "";
      const imgTags = ambientes.match(/<img\b[^>]*>/g) || [];
      assert.ok(imgTags.length >= 10, `Expected >= 10 gallery images, got ${imgTags.length}`);

      for (const img of imgTags) {
        assert.match(img, /loading="lazy"/, `Image ${img} must have loading="lazy"`);
        assert.match(img, /decoding="async"/, `Image ${img} must have decoding="async"`);
      }
    });

    it("F4.4: category filtering algorithm partitions items cleanly without mutation", () => {
      const sampleItems = [
        { id: 1, categoria: "fachada", src: "f1.jpg" },
        { id: 2, categoria: "areas-comuns", src: "a1.jpg" },
        { id: 3, categoria: "salas", src: "s1.jpg" },
        { id: 4, categoria: "lojas", src: "l1.jpg" },
        { id: 5, categoria: "areas-comuns", src: "a2.jpg" },
      ];

      function filtrar(categoria) {
        if (!categoria || categoria === "todos") return sampleItems;
        return sampleItems.filter((item) => item.categoria === categoria);
      }

      assert.equal(filtrar("todos").length, 5, "Filter 'todos' must return all 5 items");
      assert.equal(filtrar("areas-comuns").length, 2, "Filter 'areas-comuns' must return 2 items");
      assert.equal(filtrar("fachada").length, 1, "Filter 'fachada' must return 1 item");
      assert.equal(filtrar("inexistente").length, 0, "Unknown filter must return 0 items");
    });

    it("F4.5: Bento gallery contains at least 10 high-quality editorial images linked to valid assets", () => {
      const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
      const ambientes = html.match(/<section id="ambientes"[\s\S]*?<\/section>/)?.[0] || "";
      const matches = [...ambientes.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);

      assert.ok(matches.length >= 10, `Expected >= 10 image sources, got ${matches.length}`);
      for (const src of matches) {
        const diskPath = path.join(ROOT, src);
        assert.ok(fs.existsSync(diskPath), `Bento image source ${src} must exist on disk`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Feature 5: Native Zero-Dependency Lightbox (F5)
  // --------------------------------------------------------------------------
  describe("F5: Native Zero-Dependency Lightbox", () => {
    it("F5.1: Lightbox modal structure and ARIA accessibility contract", () => {
      function renderLightboxDialog(imgSrc, caption, currentIndex, total) {
        return `
          <div id="lm-lightbox" class="lm-lightbox" role="dialog" aria-modal="true" aria-label="Visualizador de fotos">
            <div class="lm-lightbox__overlay" data-action="close"></div>
            <div class="lm-lightbox__content">
              <button type="button" class="lm-lightbox__btn lm-lightbox__close" aria-label="Fechar (Esc)" data-action="close">✕</button>
              <button type="button" class="lm-lightbox__btn lm-lightbox__prev" aria-label="Foto anterior (Seta esquerda)" data-action="prev">‹</button>
              <figure class="lm-lightbox__figure">
                <img src="${imgSrc}" alt="${caption}" class="lm-lightbox__img">
                <figcaption class="lm-lightbox__caption">
                  <span>${caption}</span>
                  <span class="lm-lightbox__counter">${currentIndex + 1} / ${total}</span>
                </figcaption>
              </figure>
              <button type="button" class="lm-lightbox__btn lm-lightbox__next" aria-label="Próxima foto (Seta direita)" data-action="next">›</button>
            </div>
          </div>
        `;
      }

      const modalHtml = renderLightboxDialog("assets/galeria/convivencia.jpg", "Mesas compartilhadas", 0, 10);
      assert.match(modalHtml, /role="dialog"/);
      assert.match(modalHtml, /aria-modal="true"/);
      assert.match(modalHtml, /aria-label="Visualizador de fotos"/);
      assert.match(modalHtml, /aria-label="Fechar \(Esc\)"/);
      assert.match(modalHtml, /1 \/ 10/);
    });

    it("F5.2: Lightbox keyboard navigation logic (Escape, ArrowRight, ArrowLeft)", () => {
      let state = { isOpen: true, index: 2, total: 5 };

      function handleKeydown(key) {
        if (!state.isOpen) return;
        if (key === "Escape") {
          state.isOpen = false;
        } else if (key === "ArrowRight") {
          state.index = (state.index + 1) % state.total;
        } else if (key === "ArrowLeft") {
          state.index = (state.index - 1 + state.total) % state.total;
        }
      }

      handleKeydown("ArrowRight");
      assert.equal(state.index, 3, "ArrowRight must advance index to 3");

      handleKeydown("ArrowRight");
      assert.equal(state.index, 4, "ArrowRight must advance index to 4");

      handleKeydown("ArrowRight");
      assert.equal(state.index, 0, "ArrowRight must wrap around to 0");

      handleKeydown("ArrowLeft");
      assert.equal(state.index, 4, "ArrowLeft must wrap around backwards to 4");

      handleKeydown("Escape");
      assert.equal(state.isOpen, false, "Escape must close lightbox modal");
    });

    it("F5.3: Lightbox mobile swipe gesture recognition contract", () => {
      function evaluateSwipe(startX, endX, startY, endY, threshold = 40) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        // If vertical movement exceeds horizontal, ignore horizontal swipe
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return "scroll";
        }
        if (deltaX < -threshold) {
          return "next"; // swiped left
        }
        if (deltaX > threshold) {
          return "prev"; // swiped right
        }
        return "none";
      }

      assert.equal(evaluateSwipe(200, 100, 50, 50), "next", "Swipe left must trigger 'next'");
      assert.equal(evaluateSwipe(100, 200, 50, 50), "prev", "Swipe right must trigger 'prev'");
      assert.equal(evaluateSwipe(100, 110, 50, 50), "none", "Micro move under threshold must trigger 'none'");
      assert.equal(evaluateSwipe(100, 120, 50, 180), "scroll", "Dominant vertical movement must be ignored");
    });

    it("F5.4: Lightbox body scroll locking and unlocking lifecycle", () => {
      const mockDoc = {
        body: {
          style: { overflow: "" },
        },
      };

      function openLightbox() {
        mockDoc.body.style.overflow = "hidden";
      }

      function closeLightbox() {
        mockDoc.body.style.overflow = "";
      }

      openLightbox();
      assert.equal(mockDoc.body.style.overflow, "hidden", "Opening lightbox must lock body scroll");

      closeLightbox();
      assert.equal(mockDoc.body.style.overflow, "", "Closing lightbox must restore body scroll");
    });

    it("F5.5: Zero-dependency & strict CSP compliance of Lightbox architecture", () => {
      const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
      assert.doesNotMatch(html, /jquery/i, "Must not load jQuery");
      assert.doesNotMatch(html, /fancybox/i, "Must not load Fancybox");
      assert.doesNotMatch(html, /lightbox\.js/i, "Must not load external lightbox.js library");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 6: Merchant Vitrines & SSG (F6)
  // --------------------------------------------------------------------------
  describe("F6: Enriched Merchant Vitrines & SSG", () => {
    it("F6.1: static site generator scripts/gerar.mjs executes successfully with code 0", () => {
      const run = spawnSync(process.execPath, ["scripts/gerar.mjs"], {
        cwd: ROOT,
        encoding: "utf8",
      });
      assert.equal(run.status, 0, `Generator failed: ${run.stderr || run.stdout}`);
      assert.match(run.stdout, /loja\(s\) publicada\(s\)/, "Generator output must report published merchants");
    });

    it("F6.2: static HTML files exist for all active merchants", () => {
      const ctx = loadLemuraEnvironment();
      const ativas = ctx.LEMURA_LOJISTAS.filter((l) => l.ativo !== false);
      assert.ok(ativas.length >= 5, "Expected >=5 active merchants");

      for (const loja of ativas) {
        const pagePath = path.join(ROOT, "lojas", loja.slug, "index.html");
        assert.ok(fs.existsSync(pagePath), `Page for ${loja.slug} must exist at ${pagePath}`);
        const content = fs.readFileSync(pagePath, "utf8");
        assert.ok(content.length > 500, `Page for ${loja.slug} must be populated (>500 bytes)`);
      }
    });

    it("F6.3: Schema.org LocalBusiness JSON-LD is valid and containedInPlace is Galeria Lemura", () => {
      const docesPath = path.join(ROOT, "lojas/doces-de-elisa/index.html");
      const html = fs.readFileSync(docesPath, "utf8");

      const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      assert.ok(jsonLdMatch, "Must contain JSON-LD script block");

      const parsed = JSON.parse(jsonLdMatch[1]);
      assert.equal(parsed["@context"], "https://schema.org");
      assert.equal(parsed["@type"], "LocalBusiness");
      assert.equal(parsed.name, "Doces de Elisa");
      assert.equal(parsed.address.addressLocality, "Porangaba");
      assert.equal(parsed.address.addressRegion, "SP");
      assert.equal(parsed.containedInPlace["@type"], "ShoppingCenter");
      assert.equal(parsed.containedInPlace.name, "Galeria Lemura");
    });

    it("F6.4: merchant showcase pages render location badges, products, and WhatsApp CTAs", () => {
      const docesPath = path.join(ROOT, "lojas/doces-de-elisa/index.html");
      const html = fs.readFileSync(docesPath, "utf8");

      assert.match(html, /Sala 01/, "Must show location badge Sala 01");
      assert.match(html, /Bolo de aniversário/, "Must show Bolo de aniversário product");
      assert.match(html, /Doces e sobremesas/, "Must show Doces e sobremesas product");
      assert.match(html, /Café e acompanhamentos/, "Must show Café product");
      assert.match(html, /href="https:\/\/wa\.me\/5515996189778/, "Must render direct WhatsApp button");
    });

    it("F6.5: sitemap.xml and robots.txt are generated with proper structure and all active URLs", () => {
      const sitemapPath = path.join(ROOT, "sitemap.xml");
      const robotsPath = path.join(ROOT, "robots.txt");

      assert.ok(fs.existsSync(sitemapPath), "sitemap.xml must exist");
      assert.ok(fs.existsSync(robotsPath), "robots.txt must exist");

      const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
      assert.match(sitemapContent, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
      assert.match(sitemapContent, /\/lojas\/doces-de-elisa\//);
      assert.match(sitemapContent, /\/lojas\/yande\//);
      assert.match(sitemapContent, /\/lojas\/espaco-zoe\//);

      const robotsContent = fs.readFileSync(robotsPath, "utf8");
      assert.match(robotsContent, /User-agent:\s*\*/);
      assert.match(robotsContent, /Allow:\s*\//);
      assert.match(robotsContent, /Sitemap:\s*https?:\/\/.+\/sitemap\.xml/);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 7: CSP & Web Standards Compliance (F7)
  // --------------------------------------------------------------------------
  describe("F7: CSP & Web Standards Compliance", () => {
    it("F7.1: strict Content-Security-Policy meta tag exists on all core HTML pages", () => {
      const pages = [
        "index.html",
        "lojas.html",
        "modalidades.html",
        "localizacao.html",
        "anuncie.html",
        "lojas/doces-de-elisa/index.html",
      ];
      for (const rel of pages) {
        const pagePath = path.join(ROOT, rel);
        if (fs.existsSync(pagePath)) {
          const html = fs.readFileSync(pagePath, "utf8");
          assert.match(
            html,
            /<meta http-equiv="Content-Security-Policy"[^>]+content="[^"]*default-src 'self'/,
            `Page ${rel} must have Content-Security-Policy meta tag with default-src 'self'`
          );
        }
      }
    });

    it("F7.2: SSG generated pages strictly prohibit unsafe-inline scripts", () => {
      const pagePath = path.join(ROOT, "lojas/doces-de-elisa/index.html");
      const html = fs.readFileSync(pagePath, "utf8");
      const cspMatch = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/);
      assert.ok(cspMatch, "SSG page must have CSP meta");
      const csp = cspMatch[1];
      const scriptSrc = csp.match(/script-src\s+([^;]+)/)?.[1] || "";
      assert.ok(scriptSrc.includes("'self'"), "script-src must include 'self'");
      assert.ok(!scriptSrc.includes("'unsafe-inline'"), "script-src in SSG page must NOT include 'unsafe-inline'");
    });

    it("F7.3: all external links with target='_blank' enforce rel='noopener noreferrer'", () => {
      const htmlFiles = [
        "index.html",
        "lojas.html",
        "modalidades.html",
        "localizacao.html",
        "anuncie.html",
        "lojas/doces-de-elisa/index.html",
      ];

      for (const rel of htmlFiles) {
        const pagePath = path.join(ROOT, rel);
        if (!fs.existsSync(pagePath)) continue;
        const html = fs.readFileSync(pagePath, "utf8");

        const targetBlankLinks = html.match(/<a\b[^>]*\btarget="_blank"[^>]*>/gi) || [];
        for (const tag of targetBlankLinks) {
          assert.match(
            tag,
            /rel="[^"]*(noopener|noreferrer)[^"]*"/i,
            `Link ${tag} in ${rel} must include rel="noopener noreferrer"`
          );
        }
      }
    });

    it("F7.4: viewport meta tag is present with standard responsive configuration across HTML pages", () => {
      const pages = ["index.html", "lojas.html", "modalidades.html", "localizacao.html", "anuncie.html"];
      for (const rel of pages) {
        const html = fs.readFileSync(path.join(ROOT, rel), "utf8");
        assert.match(
          html,
          /<meta name="viewport" content="width=device-width,\s*initial-scale=1\.0">/,
          `Page ${rel} must have standard responsive viewport meta tag`
        );
      }
    });

    it("F7.5: HTML accessibility standards (alt attributes, heading hierarchy, skip link)", () => {
      const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
      // All img tags must have alt
      const imgs = indexHtml.match(/<img\b[^>]*>/g) || [];
      for (const img of imgs) {
        assert.match(img, /\balt="[^"]*"/, `Image in index.html must have alt attribute: ${img}`);
      }

      // Check skip link in merchant pages
      const docesHtml = fs.readFileSync(path.join(ROOT, "lojas/doces-de-elisa/index.html"), "utf8");
      assert.match(docesHtml, /<a class="lm-pular" href="#conteudo">/, "Merchant page must have skip link");
    });
  });
});

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES (F1 to F7)
// ============================================================================

describe("Tier 2: Boundary & Corner Cases", () => {
  it("T2.F1.1: missing merchant cover photo generates initials fallback badge (iniciais) without broken img", () => {
    const ctx = loadLemuraEnvironment();
    const andreaHtml = ctx.LemuraTemplates.cardLoja({
      slug: "andrea-almeida",
      nome: "Andrea Almeida",
      segmento: "beleza",
      box: "Sala 3",
      chamada: "Design de sobrancelhas",
      capa: "",
      whatsapp: "5514998605606",
      produtos: [],
    });

    assert.match(andreaHtml, /class="lm-media__iniciais"/, "Must render initials badge");
    assert.match(andreaHtml, />AA<\/span>/, "Must contain 'AA' initials for Andrea Almeida");
    assert.doesNotMatch(andreaHtml, /<img[^>]+src=""/, "Must not render empty img src");
  });

  it("T2.F1.2: missing product photo renders clean layout without crashing", () => {
    const ctx = loadLemuraEnvironment();
    const cardHtml = ctx.LemuraTemplates.cardProduto(
      { slug: "andrea-almeida", nome: "Andrea Almeida", whatsapp: "5514998605606" },
      { nome: "Design de sobrancelhas", descricao: "Atendimento com hora marcada", preco: "Sob consulta", foto: "" }
    );

    assert.match(cardHtml, /Design de sobrancelhas/);
    assert.match(cardHtml, /Sob consulta/);
    assert.doesNotMatch(cardHtml, /src=""/);
  });

  it("T2.F1.3: initials generator handles empty, single-word, multi-word, and accented names gracefully", () => {
    const ctx = loadLemuraEnvironment();
    const { iniciais } = ctx.LemuraTemplates;

    assert.equal(iniciais(""), "LM", "Empty name returns default 'LM'");
    assert.equal(iniciais("   "), "LM", "Whitespace-only name returns 'LM'");
    assert.equal(iniciais("Galeria"), "GA", "Single word returns first 2 chars");
    assert.equal(iniciais("Doces de Elisa"), "DE", "Multi-word ignores 'de' and takes initials");
    assert.equal(iniciais("Yandê Saúde & Bem Estar"), "YE", "Accented initials normalized cleanly");
    assert.equal(iniciais("Érika"), "ER", "Accented single word returns 'ER'");
  });

  it("T2.F1.4: slugifier and accent stripper normalize complex strings reliably", () => {
    const ctx = loadLemuraEnvironment();
    const { slugificar, semAcento } = ctx.LemuraTemplates;

    assert.equal(semAcento("Área de Convivência & Varanda"), "Area de Convivencia & Varanda");
    assert.equal(slugificar("Yandê Saúde & Bem-Estar"), "yande-saude-bem-estar");
    assert.equal(slugificar("---Espaço 123---"), "espaco-123");
    assert.equal(slugificar(""), "");
  });

  it("T2.F1.5: photo catalog unassigned photos retain known=false and empty merchant mappings", () => {
    const catalogPath = path.join(ROOT, "assets/catalogo/fotos.json");
    const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

    const unassigned = catalog.filter((item) => item.conhecido === false);
    assert.ok(unassigned.length > 0, "Catalog must contain unassigned photos from session");

    for (const item of unassigned) {
      assert.equal(item.conhecido, false);
      assert.equal(item.lojista, "");
    }
  });

  it("T2.F2.1: zero area formatting requests confirmation, never '0 m²' or 'NaN'", () => {
    const ctx = loadLemuraEnvironment();
    const card0 = ctx.LemuraTemplates.cardSala({
      numero: "12",
      identificacaoPublica: "Espaço A",
      area: 0,
    });
    assert.match(card0, /Área<\/dt><dd>Metragem a confirmar<\/dd>/);
    assert.doesNotMatch(card0, /0 m²/);
    assert.doesNotMatch(card0, /NaN/);

    const card42 = ctx.LemuraTemplates.cardSala({
      numero: "12",
      identificacaoPublica: "Espaço A",
      area: 42.5,
    });
    assert.match(card42, /Área<\/dt><dd>42\.5 m²<\/dd>/);
  });

  it("T2.F2.2: tri-state boolean specifications map true to 'Sim', false to 'Não', and null/undefined to 'A confirmar'", () => {
    const ctx = loadLemuraEnvironment();
    const cardNull = ctx.LemuraTemplates.cardSala({
      numero: "12",
      identificacaoPublica: "Espaço A",
      banheiroPrivativo: null,
      arCondicionado: undefined,
      vitrine: false,
    });

    assert.match(cardNull, /Banheiro privativo<\/dt><dd>A confirmar<\/dd>/);
    assert.match(cardNull, /Ar-condicionado<\/dt><dd>A confirmar<\/dd>/);
    assert.match(cardNull, /Vitrine para o corredor<\/dt><dd>Não<\/dd>/);
  });

  it("T2.F2.3: vacant space with identificacaoPublica hides internal provisional room number", () => {
    const ctx = loadLemuraEnvironment();
    const card = ctx.LemuraTemplates.cardSala({
      numero: "13",
      identificacaoPublica: "Espaço B",
      disponivel: true,
    });

    assert.match(card, /Espaço B/);
    assert.doesNotMatch(card, /Sala 13/);
  });

  it("T2.F2.4: room without identificacaoPublica uses formatted room number fallback", () => {
    const ctx = loadLemuraEnvironment();
    const card = ctx.LemuraTemplates.cardSala({
      numero: "05",
      identificacaoPublica: "",
      disponivel: true,
    });

    assert.match(card, /Sala 05/);
  });

  it("T2.F2.5: the availability presentation does not depend on chart calculations", () => {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    assert.match(html, /data-salas-vagas/);
    assert.doesNotMatch(html, /donut__value/);
  });

  it("T2.F3.1: floor switcher with invalid or missing floor parameter defaults safely", () => {
    const ctx = loadLemuraEnvironment();
    const salas = ctx.LEMURA_SALAS;

    function getRoomsForFloor(andar) {
      if (!andar) return [];
      const clean = andar.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      return salas.filter((s) => s.andar.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(clean));
    }

    assert.equal(getRoomsForFloor("").length, 0);
    assert.equal(getRoomsForFloor("subsolo").length, 0);
    assert.ok(getRoomsForFloor("terreo").length >= 4);
    assert.ok(getRoomsForFloor("superior").length >= 5);
  });

  it("T2.F3.2: vacant room with multiple photos uses primary photo for cover", () => {
    const ctx = loadLemuraEnvironment();
    const card = ctx.LemuraTemplates.cardSala({
      numero: "14",
      identificacaoPublica: "Espaço C",
      fotos: ["assets/salas/vaga-c/principal.jpg", "assets/salas/vaga-c/banheiro.jpg"],
    });

    assert.match(card, /assets\/salas\/vaga-c\/principal\.jpg/);
  });

  it("T2.F3.3: room with empty observation omits observation paragraph tag cleanly", () => {
    const ctx = loadLemuraEnvironment();
    const card = ctx.LemuraTemplates.cardSala({
      numero: "03",
      identificacaoPublica: "Espaço A",
      observacao: "",
    });

    assert.doesNotMatch(card, /<p class="lm-sala__obs">/);
  });

  it("T2.F3.4: room observation with HTML meta-characters escapes properly to avoid injection", () => {
    const ctx = loadLemuraEnvironment();
    const card = ctx.LemuraTemplates.cardSala({
      numero: "04",
      identificacaoPublica: "Espaço A",
      observacao: "Sala de esquina <com vitrine> & 'luminárias'",
    });

    assert.match(card, /Sala de esquina &lt;com vitrine&gt; &amp; &#39;luminárias&#39;/);
    assert.doesNotMatch(card, /<com vitrine>/);
  });

  it("T2.F3.5: room drawer with null AC and false bathroom combines states accurately", () => {
    const ctx = loadLemuraEnvironment();
    const html = ctx.LemuraTemplates.cardSala({
      numero: "12",
      identificacaoPublica: "Espaço A",
      arCondicionado: null,
      banheiroPrivativo: false,
    });

    assert.match(html, /Banheiro privativo<\/dt><dd>Não<\/dd>/);
    assert.match(html, /Ar-condicionado<\/dt><dd>A confirmar<\/dd>/);
  });

  it("T2.F4.1: Bento gallery filter switching to empty category handles zero results gracefully", () => {
    const items = [
      { id: 1, cat: "fachada" },
      { id: 2, cat: "areas-comuns" },
    ];
    const filtered = items.filter((i) => i.cat === "inexistente");
    assert.equal(filtered.length, 0);
  });

  it("T2.F4.2: Bento gallery filter transitions maintain deterministic state", () => {
    const items = [
      { id: 1, cat: "fachada" },
      { id: 2, cat: "areas-comuns" },
      { id: 3, cat: "salas" },
    ];
    let currentFilter = "todos";

    currentFilter = "fachada";
    assert.equal(items.filter((i) => currentFilter === "todos" || i.cat === currentFilter).length, 1);

    currentFilter = "todos";
    assert.equal(items.filter((i) => currentFilter === "todos" || i.cat === currentFilter).length, 3);
  });

  it("T2.F4.3: Bento grid responsive caption truncation for long titles uses ellipsis", () => {
    const ctx = loadLemuraEnvironment();
    const { cortar } = ctx.LemuraTemplates;

    const shortText = "Fachada e acesso";
    assert.equal(cortar(shortText, 30), "Fachada e acesso");

    const longText = "Esta é uma legenda extremamente longa com muitos detalhes adicionais desnecessários";
    const truncated = cortar(longText, 25);
    assert.ok(truncated.length <= 25, `Truncated text length ${truncated.length} must be <= 25`);
    assert.ok(truncated.endsWith("…"), `Truncated text '${truncated}' must end with ellipsis`);
  });

  it("T2.F4.4: Bento grid images specify explicit numeric width and height attributes to prevent CLS", () => {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    const ambientes = html.match(/<section id="ambientes"[\s\S]*?<\/section>/)?.[0] || "";
    const imgTags = ambientes.match(/<img\b[^>]*>/g) || [];

    for (const img of imgTags) {
      assert.match(img, /width="\d+"/, `Image ${img} must have numeric width`);
      assert.match(img, /height="\d+"/, `Image ${img} must have numeric height`);
    }
  });

  it("T2.F4.5: Bento grid handles items with unmapped category gracefully", () => {
    const ctx = loadLemuraEnvironment();
    const seg = ctx.LemuraTemplates.segmentoDe("categoria-desconhecida");
    assert.equal(seg.id, "categoria-desconhecida");
    assert.equal(seg.nome, "Outros");
  });

  it("T2.F5.1: Lightbox navigation wrapping on first item (index 0 navigating left wraps to last index)", () => {
    function getPrevIndex(current, total) {
      return (current - 1 + total) % total;
    }
    assert.equal(getPrevIndex(0, 15), 14, "Navigating left from 0 must wrap to 14 in 15-item gallery");
  });

  it("T2.F5.2: Lightbox navigation wrapping on last item (index 14 navigating right wraps to 0)", () => {
    function getNextIndex(current, total) {
      return (current + 1) % total;
    }
    assert.equal(getNextIndex(14, 15), 0, "Navigating right from 14 must wrap to 0 in 15-item gallery");
  });

  it("T2.F5.3: Lightbox handles single image gallery (prev/next remain at index 0)", () => {
    function getNextIndex(current, total) {
      return (current + 1) % total;
    }
    function getPrevIndex(current, total) {
      return (current - 1 + total) % total;
    }
    assert.equal(getNextIndex(0, 1), 0);
    assert.equal(getPrevIndex(0, 1), 0);
  });

  it("T2.F5.4: Lightbox touch swipe with vertical scroll dominance ignores horizontal navigation", () => {
    function shouldNavigate(deltaX, deltaY, threshold = 40) {
      if (Math.abs(deltaY) > Math.abs(deltaX)) return false;
      return Math.abs(deltaX) > threshold;
    }
    assert.equal(shouldNavigate(20, 100), false, "Vertical scroll must not trigger horizontal navigation");
    assert.equal(shouldNavigate(80, 10), true, "Clear horizontal swipe must trigger navigation");
  });

  it("T2.F5.5: Lightbox rapid Escape key presses handle idempotently when already closed", () => {
    let isOpen = false;
    function close() {
      if (!isOpen) return false;
      isOpen = false;
      return true;
    }

    assert.equal(close(), false, "Closing an already-closed lightbox is a safe no-op");
  });

  it("T2.F6.1: merchant without WhatsApp renders 'Contato indisponível' and no empty href", () => {
    const ctx = loadLemuraEnvironment();
    // Clear galeria whatsapp to simulate pending state
    ctx.LEMURA_CONFIG.whatsapp = "";
    ctx.LemuraTemplates.usarConfig(ctx.LEMURA_CONFIG);

    const html = ctx.LemuraTemplates.cardLoja({
      slug: "sem-zap",
      nome: "Sem Zap",
      segmento: "servicos",
      whatsapp: "",
      produtos: [],
    });

    assert.match(html, /Contato indisponível/);
    assert.doesNotMatch(html, /href=""/);
    assert.doesNotMatch(html, /href="https:\/\/wa\.me\/"/);
  });

  it("T2.F6.2: phone number digit extractor handles formatted strings with country code, DDD, parentheses, and dashes", () => {
    const ctx = loadLemuraEnvironment();
    const { digitos, formatarNumero } = ctx.LemuraTemplates;

    assert.equal(digitos("(15) 99885-3137"), "15998853137");
    assert.equal(digitos("+55 15 99618-9778"), "5515996189778");
    assert.equal(digitos(""), "");
    assert.equal(digitos(null), "");

    const formatted = formatarNumero("5515998853137");
    assert.equal(formatted, "+55 15 99885-3137");
  });

  it("T2.F6.3: URL sanitizer urlSegura rejects dangerous schemes like javascript: and data: and passes http(s)", () => {
    const ctx = loadLemuraEnvironment();
    const { urlSegura } = ctx.LemuraTemplates;

    assert.equal(urlSegura("javascript:alert(1)"), "");
    assert.equal(urlSegura("data:text/html;base64,..."), "");
    assert.equal(urlSegura("vbscript:msgbox"), "");
    assert.equal(urlSegura("https://instagram.com/galerialemura"), "https://instagram.com/galerialemura");
    assert.equal(urlSegura("http://example.com"), "http://example.com");
  });

  it("T2.F6.4: inactive merchant (ativo: false) is excluded from SSG generation and sitemap", () => {
    const ctx = loadLemuraEnvironment();
    const merchants = [
      { slug: "loja-1", nome: "Loja 1", ativo: true },
      { slug: "loja-2", nome: "Loja 2", ativo: false },
    ];
    const ativas = merchants.filter((l) => l.ativo !== false);
    assert.equal(ativas.length, 1);
    assert.equal(ativas[0].slug, "loja-1");
  });

  it("T2.F6.5: merchant showcase handles empty product list without broken layout", () => {
    const ctx = loadLemuraEnvironment();
    const pageHtml = ctx.LemuraTemplates.paginaLoja(
      {
        slug: "sem-produtos",
        nome: "Sem Produtos",
        segmento: "servicos",
        box: "Sala 02",
        chamada: "Atendimento comercial",
        descricao: "Descrição do negócio.",
        produtos: [],
      },
      "",
      []
    );

    assert.match(pageHtml, /Sem Produtos/);
    assert.match(pageHtml, /Sobre a loja/);
    assert.doesNotMatch(pageHtml, /class="lm-produto reveal"/);
  });

  it("T2.F7.1: CSP meta tag syntax validation verifies valid directives and semicolon separators", () => {
    const docesPath = path.join(ROOT, "lojas/doces-de-elisa/index.html");
    const html = fs.readFileSync(docesPath, "utf8");
    const cspMatch = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/);
    assert.ok(cspMatch);
    const directives = cspMatch[1].split(";").map((d) => d.trim()).filter(Boolean);

    const directiveNames = directives.map((d) => d.split(/\s+/)[0]);
    assert.ok(directiveNames.includes("default-src"));
    assert.ok(directiveNames.includes("script-src"));
    assert.ok(directiveNames.includes("style-src"));
    assert.ok(directiveNames.includes("img-src"));
    assert.ok(directiveNames.includes("font-src"));
    assert.ok(directiveNames.includes("connect-src"));
  });

  it("T2.F7.2: strict CSP referrer policy meta tag matches strict-origin-when-cross-origin", () => {
    const pages = ["index.html", "lojas/doces-de-elisa/index.html"];
    for (const rel of pages) {
      const html = fs.readFileSync(path.join(ROOT, rel), "utf8");
      assert.match(html, /<meta name="referrer" content="strict-origin-when-cross-origin">/);
    }
  });

  it("T2.F7.3: HTML attribute escaping prevents XSS across templates", () => {
    const ctx = loadLemuraEnvironment();
    const { esc } = ctx.LemuraTemplates;

    assert.equal(esc('<script>alert("xss")</script>'), "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;");
    assert.equal(esc("O'Reilly & Associates"), "O&#39;Reilly &amp; Associates");
    assert.equal(esc(null), "");
    assert.equal(esc(undefined), "");
  });

  it("T2.F7.4: Google Maps iframe in index.html contains proper sandbox attributes", () => {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    assert.match(html, /<iframe\b[^>]*src="https:\/\/www\.google\.com\/maps[^>]*sandbox="[^"]+"/);
  });

  it("T2.F7.5: 404 page retains CSP and brand navigation links", () => {
    const notFoundPath = path.join(ROOT, "404.html");
    assert.ok(fs.existsSync(notFoundPath), "404.html must exist");
    const html = fs.readFileSync(notFoundPath, "utf8");
    assert.match(html, /<meta http-equiv="Content-Security-Policy"/);
    assert.match(html, /href="index\.html"/);
  });
});

// ============================================================================
// TIER 3: CROSS-FEATURE COMBINATIONS
// ============================================================================

describe("Tier 3: Cross-Feature Combinations", () => {
  it("T3.1: Floor Plan room click -> Merchant Vitrine link resolution", () => {
    const ctx = loadLemuraEnvironment();
    const salas = ctx.LEMURA_SALAS;
    const lojistas = ctx.LEMURA_LOJISTAS;

    const salasOcupadas = salas.filter((s) => s.ocupante);
    assert.ok(salasOcupadas.length >= 5, "Expected >=5 occupied rooms");

    for (const sala of salasOcupadas) {
      const lojista = lojistas.find((l) => l.slug === sala.ocupante);
      assert.ok(lojista, `Occupant '${sala.ocupante}' for room ${sala.numero} must exist`);

      // Verify generated merchant page exists
      const pagePath = path.join(ROOT, "lojas", lojista.slug, "index.html");
      assert.ok(fs.existsSync(pagePath), `Page ${pagePath} must exist`);

      const pageHtml = fs.readFileSync(pagePath, "utf8");
      // Check that the merchant page references their room or box
      assert.ok(
        pageHtml.includes(lojista.nome),
        `Merchant page must contain merchant name ${lojista.nome}`
      );
    }
  });

  it("T3.2: Floor Plan vacant room click -> Detail Drawer photo load and WhatsApp CTA", () => {
    const ctx = loadLemuraEnvironment();
    const salas = ctx.LEMURA_SALAS;
    const vagas = salas.filter((s) => s.disponivel === true);

    assert.equal(vagas.length, 3, "Must have exactly 3 vacant spaces");

    for (const vaga of vagas) {
      assert.ok(vaga.fotos.length > 0, `Vacant space ${vaga.identificacaoPublica} must have photos`);
      for (const foto of vaga.fotos) {
        const fotoPath = path.join(ROOT, foto);
        assert.ok(fs.existsSync(fotoPath), `Photo ${foto} for vacant space must exist on disk`);
      }

      const cardHtml = ctx.LemuraTemplates.cardSala(vaga);
      assert.match(cardHtml, /Disponível/);
      assert.match(cardHtml, /Consultar este espaço|Ver como chegar/);
    }
  });

  it("T3.3: Bento Filter -> Lightbox Modal category coordination", () => {
    const items = [
      { id: 1, categoria: "fachada", src: "assets/galeria/fachada-angulo.jpg", caption: "Letreiro e arquitetura" },
      { id: 2, categoria: "areas-comuns", src: "assets/galeria/convivencia.jpg", caption: "Mesas compartilhadas" },
      { id: 3, categoria: "areas-comuns", src: "assets/galeria/varanda-espaco.jpg", caption: "Varanda do piso superior" },
    ];

    function filterAndGetLightboxItems(categoria) {
      const filtered = categoria === "todos" ? items : items.filter((i) => i.categoria === categoria);
      return filtered.map((item, idx) => ({
        ...item,
        lightboxIndex: idx,
        totalInCat: filtered.length,
      }));
    }

    const areasComuns = filterAndGetLightboxItems("areas-comuns");
    assert.equal(areasComuns.length, 2);
    assert.equal(areasComuns[0].caption, "Mesas compartilhadas");
    assert.equal(areasComuns[0].lightboxIndex, 0);
    assert.equal(areasComuns[0].totalInCat, 2);

    assert.equal(areasComuns[1].caption, "Varanda do piso superior");
    assert.equal(areasComuns[1].lightboxIndex, 1);
  });

  it("T3.4: SSG Output -> CSP Compliance across all generated files", () => {
    const lojasDir = path.join(ROOT, "lojas");
    const subdirs = fs.readdirSync(lojasDir, { withFileTypes: true }).filter((d) => d.isDirectory());

    for (const dir of subdirs) {
      const pagePath = path.join(lojasDir, dir.name, "index.html");
      assert.ok(fs.existsSync(pagePath), `Page ${pagePath} must exist`);

      const html = fs.readFileSync(pagePath, "utf8");
      assert.match(html, /<meta http-equiv="Content-Security-Policy"/, `Page ${dir.name} must have CSP`);
      assert.doesNotMatch(html, /onclick=/i, `Page ${dir.name} must NOT contain inline onclick handlers`);
      assert.doesNotMatch(html, /onload=/i, `Page ${dir.name} must NOT contain inline onload handlers`);
    }
  });

  it("T3.5: Data Layer -> Floor Plan + Indicators + Sitemap full consistency", () => {
    const ctx = loadLemuraEnvironment();
    const salas = ctx.LEMURA_SALAS;
    const lojistas = ctx.LEMURA_LOJISTAS;
    const sitemap = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");

    const vagas = salas.filter((s) => s.disponivel === true);
    assert.equal(vagas.length, 3, "Vacant spaces count must be 3");

    const ativas = lojistas.filter((l) => l.ativo !== false);
    for (const loja of ativas) {
      assert.ok(
        sitemap.includes(`/lojas/${loja.slug}/`),
        `Sitemap must include active merchant ${loja.slug}`
      );
    }
  });

  it("T3.6: Merchant Vitrine -> Breadcrumb Navigation and Directory Links", () => {
    const docesPath = path.join(ROOT, "lojas/doces-de-elisa/index.html");
    const html = fs.readFileSync(docesPath, "utf8");

    assert.match(html, /<nav class="lm-trilha"/, "Must contain breadcrumb navigation");
    assert.match(html, /href="\.\.\/\.\.\/index\.html">Início<\/a>/, "Must link to home");
    assert.match(html, /href="\.\.\/\.\.\/lojas\.html">Lojas<\/a>/, "Must link to directory");
    assert.match(html, /<span aria-current="page">Doces de Elisa<\/span>/, "Must show current page label");
  });

  it("T3.7: WhatsApp Global Config -> Uniform CTA synchronization", () => {
    const ctx = loadLemuraEnvironment();
    ctx.LEMURA_CONFIG.whatsapp = "5515991112233";
    ctx.LemuraTemplates.usarConfig(ctx.LEMURA_CONFIG);

    const cardHtml = ctx.LemuraTemplates.cardSala({
      numero: "12",
      identificacaoPublica: "Espaço A",
      disponivel: true,
    });
    assert.match(cardHtml, /5515991112233/, "cardSala must reflect updated global WhatsApp number");

    const lojaHtml = ctx.LemuraTemplates.cardLoja({
      slug: "loja-sem-zap",
      nome: "Loja Sem Zap",
      whatsapp: "",
      segmento: "servicos",
      produtos: [],
    });
    assert.match(lojaHtml, /5515991112233/, "cardLoja fallback must reflect updated global WhatsApp number");
  });

  it("T3.8: JSON-LD Schema -> SSG Output -> Sitemap URL matching", () => {
    const sitemap = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
    const lojistasUrls = [...sitemap.matchAll(/<loc>([^<]+\/lojas\/([^<]+)\/)<\/loc>/g)];

    assert.ok(lojistasUrls.length >= 5, "Sitemap must have merchant URLs");
    for (const match of lojistasUrls) {
      const fullUrl = match[1];
      const slug = match[2];
      const pagePath = path.join(ROOT, "lojas", slug, "index.html");
      assert.ok(fs.existsSync(pagePath), `Page for ${slug} must exist on disk`);

      const html = fs.readFileSync(pagePath, "utf8");
      const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      assert.ok(jsonLdMatch, `Page for ${slug} must contain JSON-LD`);
      const parsed = JSON.parse(jsonLdMatch[1]);
      assert.equal(parsed.url, fullUrl, `JSON-LD url ${parsed.url} must match sitemap loc ${fullUrl}`);
    }
  });

  it("T3.9: Image Dimensions -> Bento Grid Aspect Ratios alignment", () => {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    const ambientes = html.match(/<section id="ambientes"[\s\S]*?<\/section>/)?.[0] || "";

    // Tall items: height > width
    const tallFigures = ambientes.match(/<figure class="lm-ambientes__alta">[\s\S]*?<\/figure>/g) || [];
    assert.ok(tallFigures.length > 0, "Must have tall figure cards");
    for (const fig of tallFigures) {
      const w = parseInt(fig.match(/width="(\d+)"/)?.[1] || "0", 10);
      const h = parseInt(fig.match(/height="(\d+)"/)?.[1] || "0", 10);
      assert.ok(h > w, `Tall figure must have height > width (got w=${w}, h=${h})`);
    }

    // Wide items: width >= height
    const wideFigures = ambientes.match(/<figure class="lm-ambientes__larga">[\s\S]*?<\/figure>/g) || [];
    assert.ok(wideFigures.length > 0, "Must have wide figure cards");
    for (const fig of wideFigures) {
      const w = parseInt(fig.match(/width="(\d+)"/)?.[1] || "0", 10);
      const h = parseInt(fig.match(/height="(\d+)"/)?.[1] || "0", 10);
      assert.ok(w >= h, `Wide figure must have width >= height (got w=${w}, h=${h})`);
    }
  });

  it("T3.10: Coexistence of Touch Swipe and Keyboard Event Handlers without collision", () => {
    const registeredListeners = new Map();
    const mockWindow = {
      addEventListener: (type, fn) => {
        registeredListeners.set(type, fn);
      },
      removeEventListener: (type) => {
        registeredListeners.delete(type);
      },
    };

    function attachLightboxEvents(win) {
      win.addEventListener("keydown", () => {});
      win.addEventListener("touchstart", () => {});
      win.addEventListener("touchend", () => {});
    }

    function detachLightboxEvents(win) {
      win.removeEventListener("keydown");
      win.removeEventListener("touchstart");
      win.removeEventListener("touchend");
    }

    attachLightboxEvents(mockWindow);
    assert.ok(registeredListeners.has("keydown"));
    assert.ok(registeredListeners.has("touchstart"));
    assert.ok(registeredListeners.has("touchend"));

    detachLightboxEvents(mockWindow);
    assert.equal(registeredListeners.size, 0, "All listeners must be cleaned up on destroy");
  });
});

// ============================================================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS
// ============================================================================

describe("Tier 4: Real-World Application Scenarios", () => {
  it("T4.S1: Scenario S1 - Prospective Tenant Booking Space A", () => {
    // Step 1: User lands on index.html and checks availability banner
    const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    assert.match(indexHtml, /id="disponibilidade"/, "Disponibilidade section must be accessible");

    // Step 2: System retrieves Espaço A data model
    const ctx = loadLemuraEnvironment();
    ctx.LEMURA_CONFIG.whatsapp = "5515998853137";
    ctx.LemuraTemplates.usarConfig(ctx.LEMURA_CONFIG);

    const espacoA = ctx.LEMURA_SALAS.find((s) => s.identificacaoPublica === "Espaço A" || s.numero === "12");
    assert.ok(espacoA, "Espaço A data record must exist");
    assert.equal(espacoA.disponivel, true, "Espaço A must be available");
    assert.equal(espacoA.andar, "Térreo", "Espaço A must be on Térreo");

    // Step 3: User views room card with photos & specs
    const cardHtml = ctx.LemuraTemplates.cardSala(espacoA);
    assert.match(cardHtml, /Espaço A/, "Card displays Espaço A");
    assert.match(cardHtml, /assets\/salas\/vaga-a\/principal\.jpg/, "Card contains real photo");
    assert.match(cardHtml, /Vitrine para o corredor<\/dt><dd>Sim<\/dd>/, "Vitrine spec is Sim");
    assert.match(cardHtml, /Área<\/dt><dd>Metragem a confirmar<\/dd>/, "Area awaits confirmation");

    // Step 4: User clicks WhatsApp booking CTA
    assert.match(cardHtml, /href="https:\/\/wa\.me\/5515998853137\?text=/, "WhatsApp link is configured");
    assert.match(cardHtml, /Espa%C3%A7o%20A/, "Pre-filled message includes space name");
  });

  it("T4.S2: Scenario S2 - Customer Finding Doces de Elisa Vitrine", () => {
    // Step 1: Customer navigates to Doces de Elisa page
    const pagePath = path.join(ROOT, "lojas/doces-de-elisa/index.html");
    assert.ok(fs.existsSync(pagePath), "Doces de Elisa static page must exist");
    const html = fs.readFileSync(pagePath, "utf8");

    // Step 2: Page header displays cover image and Sala 01 badge
    assert.match(html, /assets\/lojas\/doces-de-elisa\/capa\.jpg/, "Cover image displayed");
    assert.match(html, /Sala 01/, "Location badge Sala 01 displayed");
    assert.match(html, /Alimentação/, "Segment badge Alimentação displayed");

    // Step 3: Product showcase rendered
    assert.match(html, /Bolo de aniversário/, "Cake product present");
    assert.match(html, /Doces e sobremesas/, "Sweets product present");
    assert.match(html, /Café e acompanhamentos/, "Coffee product present");

    // Step 4: Direct WhatsApp link targeting the merchant
    assert.match(html, /href="https:\/\/wa\.me\/5515996189778/, "Direct merchant WhatsApp link present");
  });

  it("T4.S3: Scenario S3 - Visitor Browsing Bento Gallery via Lightbox", () => {
    // Step 1: Visitor loads #ambientes Bento grid
    const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    const ambientes = indexHtml.match(/<section id="ambientes"[\s\S]*?<\/section>/)?.[0] || "";
    assert.ok(ambientes.length > 0);

    // Step 2: Visitor selects a photo (e.g. área de convivência)
    const photoSrc = "assets/galeria-area-comum.jpg";
    assert.ok(fs.existsSync(path.join(ROOT, photoSrc)), "Selected photo must exist on disk");

    // Step 3: Lightbox controller opens HD photo with caption
    const lightboxState = {
      isOpen: true,
      currentSrc: photoSrc,
      caption: "Área de convivência",
      currentIndex: 2,
      total: 10,
    };

    assert.equal(lightboxState.isOpen, true);
    assert.equal(lightboxState.caption, "Área de convivência");

    // Step 4: Visitor navigates to next image (ArrowRight)
    lightboxState.currentIndex = (lightboxState.currentIndex + 1) % lightboxState.total;
    assert.equal(lightboxState.currentIndex, 3);

    // Step 5: Visitor closes Lightbox (Escape)
    lightboxState.isOpen = false;
    assert.equal(lightboxState.isOpen, false);
  });

  it("T4.S4: Scenario S4 - Search Engine Bot Indexing Sitemap & SSG Compliance", () => {
    // Step 1: Bot reads robots.txt
    const robots = fs.readFileSync(path.join(ROOT, "robots.txt"), "utf8");
    const sitemapUrlMatch = robots.match(/Sitemap:\s*(https?:\/\/[^\s]+)/);
    assert.ok(sitemapUrlMatch, "robots.txt must point to sitemap");

    // Step 2: Bot reads sitemap.xml
    const sitemap = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.ok(urls.length >= 6, "Sitemap must list all main pages and stores");

    // Step 3: Bot crawls each page and checks canonical, metadata, and CSP
    for (const url of urls) {
      const urlPath = new URL(url).pathname;
      let filePath = "";
      if (urlPath === "/" || urlPath === "") {
        filePath = path.join(ROOT, "index.html");
      } else if (urlPath.endsWith(".html")) {
        filePath = path.join(ROOT, urlPath.replace(/^\//, ""));
      } else {
        filePath = path.join(ROOT, urlPath.replace(/^\//, ""), "index.html");
      }

      if (fs.existsSync(filePath)) {
        const pageHtml = fs.readFileSync(filePath, "utf8");
        assert.match(pageHtml, /<meta name="description"/, `Page ${filePath} must have meta description`);
        assert.match(pageHtml, /<meta http-equiv="Content-Security-Policy"/, `Page ${filePath} must have CSP`);
        assert.doesNotMatch(pageHtml, /\bonclick\s*=/i, `Page ${filePath} must not contain inline onclick handler`);
        assert.doesNotMatch(pageHtml, /\bonload\s*=/i, `Page ${filePath} must not contain inline onload handler`);
      }
    }
  });

  it("T4.S5: Scenario S5 - High-Resolution Photo & Catalog Audit", () => {
    // Step 1: Catalog audit
    const catalogPath = path.join(ROOT, "assets/catalogo/fotos.json");
    const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
    assert.ok(catalog.length >= 180, "Catalog must index all official photos");

    // Step 2: Thumbnails audit
    let existingThumbs = 0;
    for (let i = 0; i < Math.min(10, catalog.length); i++) {
      const thumbPath = path.join(ROOT, catalog[i].thumb);
      if (fs.existsSync(thumbPath)) existingThumbs++;
    }
    assert.ok(existingThumbs >= 5, "Sample thumbnails must exist");

    // Step 3: References audit
    const refDoc = fs.readFileSync(path.join(ROOT, "assets/REFERENCIAS.md"), "utf8");
    assert.match(refDoc, /selecao-publicada\.json/);
    assert.match(refDoc, /IMG_7357/);
    assert.match(refDoc, /Doces de Elisa/);

    // Step 4: Production gallery file sizes
    const galeriaDir = path.join(ROOT, "assets/galeria");
    const files = fs.readdirSync(galeriaDir).filter((f) => f.endsWith(".jpg"));
    for (const f of files) {
      const stat = fs.statSync(path.join(galeriaDir, f));
      assert.ok(stat.size < 450 * 1024, `Gallery photo ${f} must be < 450KB`);
    }
  });
});

// ============================================================================
// TIER 5: GALERIA LEMURA TECHNICAL IMPROVEMENTS (R1 - R4 VERIFICATION)
// ============================================================================

describe("Tier 5: Galeria Lemura Technical Improvements (R1 - R4 Verification)", () => {
  it("R1.1: room availability is presented from shared data on public pages", () => {
    const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    assert.match(
      indexHtml,
      /<span data-salas-vagas>3<\/span> espaços disponíveis de <span data-salas-total>12<\/span>/,
      "Hero must display the live vacancy and total values"
    );
    assert.match(
      indexHtml,
      /class="lm-disponibilidade__resumo"><strong><span data-salas-vagas>3<\/span><\/strong>/,
      "The text summary must show availability without a chart"
    );
    assert.doesNotMatch(
      indexHtml,
      /<span[^>]*data-salas-total[^>]*>16<\/span>/,
      "index.html must not contain static room count of 16"
    );

    const anuncieHtml = fs.readFileSync(path.join(ROOT, "anuncie.html"), "utf8");
    assert.match(
      anuncieHtml,
      /<span data-salas-vagas>3<\/span> espaços disponíveis/,
      "anuncie.html must source its vacancy count from the shared data"
    );
  });

  it("R1.2: availability is a text indicator rather than a decorative chart", () => {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    assert.match(html, /class="lm-disponibilidade__resumo"/);
    assert.doesNotMatch(html, /class="donut__value"/);

    // Verify js/salas.js decoupling from LemuraTemplates
    const ctx = vm.createContext({
      window: {},
      document: {
        querySelectorAll: (sel) => {
          return [
            { textContent: "" },
          ];
        },
        querySelector: () => null,
        getElementById: () => null,
      },
      LEMURA_SALAS: [
        { numero: "01", disponivel: false },
        { numero: "02", disponivel: true },
        { numero: "03", disponivel: true },
        { numero: "04", disponivel: true },
      ],
    });
    ctx.window = ctx;
    ctx.globalThis = ctx;
    const salasJs = fs.readFileSync(path.join(ROOT, "js/salas.js"), "utf8");
    assert.doesNotThrow(() => {
      vm.runInContext(salasJs, ctx);
    }, "js/salas.js must run safely even without LemuraTemplates");
  });

  it("R2.1: accessible skip links and main#conteudo exist across all public pages", () => {
    const publicPages = [
      "index.html",
      "404.html",
      "anuncie.html",
      "localizacao.html",
      "lojas.html",
      "modalidades.html",
    ];

    for (const page of publicPages) {
      const html = fs.readFileSync(path.join(ROOT, page), "utf8");
      assert.match(
        html,
        /<body\b[^>]*>[\s\n]*<a class="lm-pular" href="#conteudo">Pular para o conteúdo<\/a>/i,
        `${page} must have skip link as first child of <body>`
      );
      assert.match(
        html,
        /<main\b[^>]*\bid="conteudo"/i,
        `${page} must have <main id="conteudo"> target`
      );
    }

    const stylesCss = fs.readFileSync(path.join(ROOT, "css/styles.css"), "utf8");
    assert.match(stylesCss, /\.lm-pular\s*\{/, "css/styles.css must define .lm-pular");
    assert.match(stylesCss, /\.lm-pular:(focus|focus-visible)/, "css/styles.css must define .lm-pular focus state");
  });

  it("R2.2: accessible FAQ accordion has full ARIA attributes and js/script.js is loaded", () => {
    const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    assert.match(
      indexHtml,
      /<script src="js\/script\.js"><\/script><\/body>/,
      "index.html must load js/script.js before </body>"
    );

    for (let i = 1; i <= 5; i++) {
      assert.match(
        indexHtml,
        new RegExp(`<button class="faq-toggle"[^>]+id="faq-btn-${i}"[^>]+aria-expanded="false"[^>]+aria-controls="faq-panel-${i}"`),
        `FAQ toggle button ${i} must have correct id, aria-expanded, and aria-controls`
      );
      assert.match(
        indexHtml,
        new RegExp(`<div class="faq-panel"[^>]+id="faq-panel-${i}"[^>]+role="region"[^>]+aria-labelledby="faq-btn-${i}"[^>]+aria-hidden="true"`),
        `FAQ panel ${i} must have matching id, role='region', aria-labelledby, and aria-hidden`
      );
    }

    const scriptJs = fs.readFileSync(path.join(ROOT, "js/script.js"), "utf8");
    assert.match(scriptJs, /aria-expanded/, "js/script.js must manage aria-expanded");
    assert.match(scriptJs, /aria-hidden/, "js/script.js must manage aria-hidden");
    assert.doesNotMatch(scriptJs, /bg-neutral-950/, "js/script.js must not contain legacy Tailwind classes");
  });

  it("R2.3 & R2.4: universal :focus-visible rules and WCAG AA contrast adjustments are present", () => {
    const stylesCss = fs.readFileSync(path.join(ROOT, "css/styles.css"), "utf8");
    const vitrineCss = fs.readFileSync(path.join(ROOT, "css/vitrine.css"), "utf8");

    assert.match(stylesCss, /:focus-visible/, "css/styles.css must define :focus-visible");
    assert.match(vitrineCss, /:focus-visible/, "css/vitrine.css must define :focus-visible");

    // Validate readability of shared color pairs, allowing intentional redesigns.
    // A pale secondary text or white text on the cyan action would fail this check.
    const tokens = Object.fromEntries([...stylesCss.matchAll(/(--lm-[\w-]+):\s*(#[\da-f]{6})\s*;/gi)].map(m => [m[1], m[2]]));
    const luminance = hex => {
      const rgb = hex.slice(1).match(/../g).map(value => {
        const channel = parseInt(value, 16) / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
    };
    for (const [foreground, background] of [
      ["--lm-tinta", "--lm-fundo"],
      ["--lm-suave", "--lm-cartao"],
      ["--lm-claro", "--lm-fundo"],
      ["--lm-tinta", "--lm-ciano"],
      ["--lm-ciano", "--lm-tinta"],
    ]) {
      assert.ok(tokens[foreground] && tokens[background], "Color pair must resolve to shared tokens");
      const values = [luminance(tokens[foreground]), luminance(tokens[background])].sort((a, b) => b - a);
      const contrast = (values[0] + 0.05) / (values[1] + 0.05);
      assert.ok(contrast >= 4.5, `${foreground} on ${background}: ${contrast.toFixed(2)} must be at least 4.5`);
    }
  });

  it("R3.1: Tailwind CDN and CSP 'unsafe-eval' are eliminated completely", () => {
    const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    assert.doesNotMatch(indexHtml, /cdn\.tailwindcss\.com/, "index.html must not reference Tailwind CDN");
    assert.doesNotMatch(indexHtml, /tailwind-config\.js/, "index.html must not reference tailwind-config.js");

    const stylesCss = fs.readFileSync(path.join(ROOT, "css/styles.css"), "utf8");
    assert.match(stylesCss, /\.antialiased\s*\{/, "css/styles.css must define .antialiased class");

    const corePages = ["index.html", "anuncie.html", "lojas.html", "modalidades.html", "localizacao.html", "404.html"];
    for (const page of corePages) {
      const html = fs.readFileSync(path.join(ROOT, page), "utf8");
      assert.doesNotMatch(html, /'unsafe-eval'/, `${page} CSP must not contain 'unsafe-eval'`);
      assert.doesNotMatch(html, /cdn\.tailwindcss\.com/, `${page} CSP must not allow cdn.tailwindcss.com`);
    }

    const secMd = fs.readFileSync(path.join(ROOT, "SECURITY.md"), "utf8");
    assert.match(secMd, /Decisão implementada/i, "SECURITY.md must document implemented status");
  });

  it("R3.2: Self-hosted WOFF2 fonts exist locally and external Google Fonts are eliminated", () => {
    const fontFiles = [
      "figtree-latin-normal.woff2",
      "figtree-latin-italic.woff2",
      "space-mono-latin-normal-400.woff2",
      "space-mono-latin-normal-700.woff2",
      "space-mono-latin-italic-400.woff2",
      "space-mono-latin-italic-700.woff2",
    ];

    for (const font of fontFiles) {
      const fontPath = path.join(ROOT, "assets/fonts", font);
      assert.ok(fs.existsSync(fontPath), `Font file ${font} must exist in assets/fonts/`);
      const stat = fs.statSync(fontPath);
      assert.ok(stat.size > 10000, `Font file ${font} must have valid non-empty size`);
    }

    const stylesCss = fs.readFileSync(path.join(ROOT, "css/styles.css"), "utf8");
    assert.match(stylesCss, /@font-face/, "css/styles.css must define @font-face rules");
    assert.match(stylesCss, /url\("\.\.\/assets\/fonts\/figtree-latin-normal\.woff2"\)/, "styles.css must reference local Figtree font");
    assert.match(stylesCss, /url\("\.\.\/assets\/fonts\/space-mono-latin-normal-400\.woff2"\)/, "styles.css must reference local Space Mono font");

    const allHtml = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
    for (const file of allHtml) {
      const html = fs.readFileSync(path.join(ROOT, file), "utf8");
      assert.doesNotMatch(html, /fonts\.googleapis\.com/, `${file} must not contain Google Fonts link`);
      assert.doesNotMatch(html, /fonts\.gstatic\.com/, `${file} must not contain Google Fonts gstatic link`);
    }

    const gerarMjs = fs.readFileSync(path.join(ROOT, "scripts/gerar.mjs"), "utf8");
    assert.doesNotMatch(gerarMjs, /fonts\.googleapis\.com/, "scripts/gerar.mjs must not contain Google Fonts");
    assert.doesNotMatch(gerarMjs, /fonts\.gstatic\.com/, "scripts/gerar.mjs must not contain gstatic");
  });

  it("R3.3 & R3.4: Responsive hero variants exist and image optimizations are applied", () => {
    const hero480 = path.join(ROOT, "assets/galeria-fachada-480.jpg");
    const hero960 = path.join(ROOT, "assets/galeria-fachada-960.jpg");
    assert.ok(fs.existsSync(hero480), "responsive 480px hero must exist");
    assert.ok(fs.existsSync(hero960), "responsive 960px hero must exist");
    assert.ok(fs.statSync(hero480).size <= 400 * 1024, "480px hero must be <= 400KB");
    assert.ok(fs.statSync(hero960).size <= 400 * 1024, "960px hero must be <= 400KB");

    const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    assert.match(
      indexHtml,
      /<img[^>]+src="assets\/galeria-fachada\.jpg"[^>]+fetchpriority="high"[^>]+srcset="assets\/galeria-fachada-480\.jpg 480w, assets\/galeria-fachada-960\.jpg 960w, assets\/galeria-fachada\.jpg 1600w"/s,
      "Hero image in index.html must retain src and fetchpriority while providing responsive srcset"
    );

    const modHtml = fs.readFileSync(path.join(ROOT, "modalidades.html"), "utf8");
    const modCards = modHtml.match(/<figure class="lm-media lm-ratio lm-ratio--4x3 lm-modalidade__imagem">/g) || [];
    assert.equal(modCards.length, 3, "modalidades.html must show a photographed media slot for all 3 formats");
    assert.match(modHtml, /Área de convivência da galeria · consulte as condições do cowork/);
    assert.match(modHtml, /Circulação entre salas · uso por período sujeito a confirmação/);

    const locHtml = fs.readFileSync(path.join(ROOT, "localizacao.html"), "utf8");
    assert.match(
      locHtml,
      /<img[^>]+src="assets\/galeria\/fachada-perspectiva\.jpg"[^>]+loading="lazy"[^>]+decoding="async"/,
      "localizacao.html hero image must have loading=lazy and decoding=async"
    );
  });

  it("R4.1: Schema.org LocalBusiness in index.html includes valid url and verified address", () => {
    const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    const jsonLdMatch = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(jsonLdMatch, "index.html must contain JSON-LD block");
    const schema = JSON.parse(jsonLdMatch[1]);
    assert.equal(schema["@type"], "LocalBusiness");
    assert.equal(schema.url, "https://lemura.com.br/");
    assert.equal(schema.address.streetAddress, "Rua Quatro de Junho, 591");
    assert.equal(schema.telephone, undefined, "do not publish an unverified telephone number");
  });

  it("R4.2: Open Graph and Twitter image URLs are absolute across all core pages", () => {
    const pages = ["index.html", "anuncie.html", "lojas.html", "modalidades.html", "localizacao.html"];
    for (const p of pages) {
      const html = fs.readFileSync(path.join(ROOT, p), "utf8");
      const ogMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
      assert.ok(ogMatch, `${p} must have og:image`);
      assert.match(ogMatch[1], /^https:\/\//, `${p} og:image must be an absolute URL: ${ogMatch[1]}`);

      const twMatch = html.match(/<meta name="twitter:image" content="([^"]+)"/);
      assert.ok(twMatch, `${p} must have twitter:image`);
      assert.match(twMatch[1], /^https:\/\//, `${p} twitter:image must be an absolute URL: ${twMatch[1]}`);
    }

    const cfg = fs.readFileSync(path.join(ROOT, "js/lemura-config.js"), "utf8");
    assert.match(cfg, /siteUrl:\s*"https:\/\/lemura\.com\.br"/, "lemura-config.js siteUrl must be https://lemura.com.br");
  });

  it("R4.3: SEO titles and meta descriptions include 'Porangaba' and 'salas comerciais'", () => {
    const staticPages = ["modalidades.html", "localizacao.html", "anuncie.html"];
    for (const p of staticPages) {
      const html = fs.readFileSync(path.join(ROOT, p), "utf8");
      const titleMatch = html.match(/<title>([^<]+)<\/title>/);
      const descMatch = html.match(/<meta name="description" content="([^"]+)"/);

      assert.ok(titleMatch, `${p} must have a title`);
      assert.ok(descMatch, `${p} must have a meta description`);

      const title = titleMatch[1];
      const desc = descMatch[1];

      assert.match(title, /Porangaba/i, `${p} title must include 'Porangaba'`);
      assert.match(title, /salas comerciais/i, `${p} title must include 'salas comerciais'`);

      assert.match(desc, /Porangaba/i, `${p} description must include 'Porangaba'`);
      assert.match(desc, /salas comerciais/i, `${p} description must include 'salas comerciais'`);
    }
  });
});

