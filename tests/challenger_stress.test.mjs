// ============================================================================
// CHALLENGER 1 ADVERSARIAL STRESS-TEST SUITE
// Empirical Verification of Room Availability, FAQ A11y, CSP, and Self-Hosting
// ============================================================================

import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(".");

describe("Challenger 1 Empirical Stress Tests", () => {

  // --------------------------------------------------------------------------
  // 1. Room count data integrity and accessible status
  // --------------------------------------------------------------------------
  describe("Adversarial Test 1: Room Count Data Integrity & Text Status", () => {
    it("empirically verifies static HTML displays 12 rooms and 3 vacant without JS", () => {
      const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

      // Verify all occurrences of data-salas-total
      const totals = [...html.matchAll(/data-salas-total[^>]*>(\d+)</g)];
      assert.ok(totals.length >= 2, "Expected at least 2 data-salas-total markers");
      for (const m of totals) {
        assert.equal(m[1], "12", "Static data-salas-total must be 12");
      }

      // Verify all occurrences of data-salas-vagas
      const vagas = [...html.matchAll(/data-salas-vagas[^>]*>(\d+)</g)];
      assert.ok(vagas.length >= 2, "Expected at least 2 data-salas-vagas markers");
      for (const m of vagas) {
        assert.equal(m[1], "3", "Static data-salas-vagas must be 3");
      }

      // Verify no traces of outdated "16" in copy or numbers
      assert.doesNotMatch(html, />\s*16\s*<\/span>/, "Must not contain >16</span>");
      assert.doesNotMatch(html, /16\s*(espaços|salas)/i, "Must not state 16 salas or espaços");

      // Verify copy in anuncie.html
      const anuncie = fs.readFileSync(path.join(ROOT, "anuncie.html"), "utf8");
      assert.match(anuncie, /<span data-salas-vagas>3<\/span> espaços disponíveis/);
    });

    it("empirically validates data/salas.js dataset integrity", () => {
      const code = fs.readFileSync(path.join(ROOT, "data/salas.js"), "utf8");
      const ctx = vm.createContext({ window: {} });
      ctx.globalThis = ctx;
      vm.runInContext(code, ctx);

      const salas = ctx.LEMURA_SALAS || ctx.window.LEMURA_SALAS;
      assert.equal(salas.length, 12, "Must contain exactly 12 rooms");

      const vagas = salas.filter((s) => s.disponivel === true);
      assert.equal(vagas.length, 3, "Must have exactly 3 vacant rooms");

      const ocupadas = salas.filter((s) => s.disponivel === false);
      assert.equal(ocupadas.length, 9, "Must have exactly 9 occupied rooms");

      const terreo = salas.filter((s) => s.andar === "Térreo");
      const superior = salas.filter((s) => s.andar === "Superior");
      assert.equal(terreo.length, 6, "Térreo floor must have 6 rooms");
      assert.equal(superior.length, 6, "Superior floor must have 6 rooms");

      const nomesVagas = vagas.map((v) => v.identificacaoPublica).sort();
      assert.equal(nomesVagas[0], "Espaço A");
      assert.equal(nomesVagas[1], "Espaço B");
      assert.equal(nomesVagas[2], "Espaço C");
    });

    it("displays vacancy counts as text for assistive technology", () => {
      const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
      assert.match(html, /class="lm-disponibilidade__resumo"/);
      assert.doesNotMatch(html, /class="donut__value"/);

      const salasJs = fs.readFileSync(path.join(ROOT, "js/salas.js"), "utf8");
      const totalMock = [{ textContent: "" }];
      const vagasMock = [{ textContent: "" }];

      const ctx = vm.createContext({
        window: {
          LEMURA_SALAS: [
            { numero: "01", disponivel: false },
            { numero: "02", disponivel: false },
            { numero: "03", disponivel: false },
            { numero: "04", disponivel: false },
            { numero: "05", disponivel: false },
            { numero: "06", disponivel: false },
            { numero: "07", disponivel: false },
            { numero: "08", disponivel: false },
            { numero: "09", disponivel: false },
            { numero: "12", identificacaoPublica: "Espaço A", disponivel: true },
            { numero: "13", identificacaoPublica: "Espaço B", disponivel: true },
            { numero: "14", identificacaoPublica: "Espaço C", disponivel: true },
          ],
        },
        document: {
          querySelectorAll: (sel) => {
            if (sel === "[data-salas-total]") return totalMock;
            if (sel === "[data-salas-vagas]") return vagasMock;
            return [];
          },
          querySelector: () => null,
          getElementById: () => null,
        },
      });
      ctx.window.window = ctx.window;
      vm.runInContext(salasJs, ctx);

      assert.equal(totalMock[0].textContent, "12");
      assert.equal(vagasMock[0].textContent, "3");
    });
  });

  // --------------------------------------------------------------------------
  // 2. FAQ Accordion Accessibility & State Machine Stress-Test
  // --------------------------------------------------------------------------
  describe("Adversarial Test 2: FAQ Accordion Accessibility & Interaction Stress-Test", () => {
    it("empirically checks static WAI-ARIA accordion markup in index.html", () => {
      const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

      for (let i = 1; i <= 5; i++) {
        // Toggle button
        const btnTag = html.match(new RegExp(`<button[^>]+id="faq-btn-${i}"[^>]*>`))?.[0];
        assert.ok(btnTag, `Button faq-btn-${i} must exist`);
        assert.match(btnTag, /type="button"/, `Button ${i} must have type="button"`);
        assert.match(btnTag, /class="faq-toggle"/, `Button ${i} must have class="faq-toggle"`);
        assert.match(btnTag, /aria-expanded="false"/, `Button ${i} must start with aria-expanded="false"`);
        assert.match(btnTag, new RegExp(`aria-controls="faq-panel-${i}"`), `Button ${i} must control faq-panel-${i}`);

        // Panel
        const panelTag = html.match(new RegExp(`<div[^>]+id="faq-panel-${i}"[^>]*>`))?.[0];
        assert.ok(panelTag, `Panel faq-panel-${i} must exist`);
        assert.match(panelTag, /class="faq-panel"/, `Panel ${i} must have class="faq-panel"`);
        assert.match(panelTag, /role="region"/, `Panel ${i} must have role="region"`);
        assert.match(panelTag, new RegExp(`aria-labelledby="faq-btn-${i}"`), `Panel ${i} must be labelled by faq-btn-${i}`);
        assert.match(panelTag, /aria-hidden="true"/, `Panel ${i} must start with aria-hidden="true"`);
      }
    });

    it("empirically stress-tests the FAQ state machine across complex click interactions", () => {
      const scriptCode = fs.readFileSync(path.join(ROOT, "js/script.js"), "utf8");

      class MockClassList {
        constructor(cls = "") {
          this._set = new Set(cls.split(" ").filter(Boolean));
        }
        contains(c) { return this._set.has(c); }
        add(c) { this._set.add(c); }
        remove(c) { this._set.delete(c); }
        toggle(c, force) {
          if (force !== undefined) {
            if (force) this.add(c); else this.remove(c);
            return force;
          }
          if (this.contains(c)) { this.remove(c); return false; }
          this.add(c); return true;
        }
      }

      class MockEl {
        constructor(tag, attrs = {}) {
          this.tagName = tag.toUpperCase();
          this.attrs = { ...attrs };
          this.classList = new MockClassList(attrs.class || "");
          this.children = [];
          this.listeners = {};
          this.textContent = "";
        }
        setAttribute(k, v) { this.attrs[k] = String(v); }
        getAttribute(k) { return this.attrs[k] || null; }
        addEventListener(e, fn) {
          if (!this.listeners[e]) this.listeners[e] = [];
          this.listeners[e].push(fn);
        }
        click() {
          const fns = this.listeners["click"] || [];
          for (const fn of fns) fn({ type: "click" });
        }
        querySelector(sel) {
          if (sel === ".faq-toggle") return this.children.find((c) => c.classList.contains("faq-toggle"));
          if (sel === ".faq-panel") return this.children.find((c) => c.classList.contains("faq-panel"));
          if (sel === ".faq-icone") {
            for (const c of this.children) {
              if (c.classList.contains("faq-icone")) return c;
              const inner = c.querySelector(sel);
              if (inner) return inner;
            }
          }
          return null;
        }
      }

      // Create 5 accordion items
      const items = [];
      for (let i = 1; i <= 5; i++) {
        const item = new MockEl("div", { class: "faq-item" });
        const btn = new MockEl("button", {
          class: "faq-toggle",
          id: `faq-btn-${i}`,
          "aria-expanded": "false",
          "aria-controls": `faq-panel-${i}`,
        });
        const icon = new MockEl("span", { class: "faq-icone", "aria-hidden": "true" });
        icon.textContent = "+";
        btn.children.push(icon);

        const panel = new MockEl("div", {
          class: "faq-panel",
          id: `faq-panel-${i}`,
          role: "region",
          "aria-labelledby": `faq-btn-${i}`,
          "aria-hidden": "true",
        });
        item.children.push(btn, panel);
        items.push(item);
      }

      const initHandlers = [];
      const doc = {
        addEventListener: (e, fn) => { if (e === "DOMContentLoaded") initHandlers.push(fn); },
        querySelectorAll: (sel) => (sel === ".faq-item" ? items : []),
        querySelector: () => null,
      };

      const ctx = vm.createContext({ document: doc });
      vm.runInContext(scriptCode, ctx);
      assert.ok(initHandlers.length, "DOMContentLoaded handlers registered");
      initHandlers.forEach((handler) => handler());

      const verifyState = (activeIdx) => {
        for (let i = 0; i < 5; i++) {
          const itm = items[i];
          const btn = itm.querySelector(".faq-toggle");
          const pnl = itm.querySelector(".faq-panel");
          const icn = itm.querySelector(".faq-icone");

          if (i === activeIdx) {
            assert.equal(itm.classList.contains("is-open"), true);
            assert.equal(btn.getAttribute("aria-expanded"), "true");
            assert.equal(pnl.getAttribute("aria-hidden"), "false");
            assert.equal(icn.textContent, "−");
          } else {
            assert.equal(itm.classList.contains("is-open"), false);
            assert.equal(btn.getAttribute("aria-expanded"), "false");
            assert.equal(pnl.getAttribute("aria-hidden"), "true");
            assert.equal(icn.textContent, "+");
          }
        }
      };

      // Initial state: all closed
      verifyState(-1);

      // Sequence: Click 1 -> 1 opens
      items[0].querySelector(".faq-toggle").click();
      verifyState(0);

      // Sequence: Click 3 -> 1 closes, 3 opens (mutex)
      items[2].querySelector(".faq-toggle").click();
      verifyState(2);

      // Sequence: Click 3 again -> 3 closes (toggle)
      items[2].querySelector(".faq-toggle").click();
      verifyState(-1);

      // Sequence: Rapid consecutive clicks across all items
      const clickOrder = [0, 1, 2, 3, 4, 4, 3, 1, 0, 0];
      const expectedEndState = -1; // 0 was clicked twice at end, toggling off
      for (const idx of clickOrder) {
        items[idx].querySelector(".faq-toggle").click();
      }
      verifyState(expectedEndState);
    });

    it("empirically verifies CSS visibility rule coupling with aria-hidden", () => {
      const css = fs.readFileSync(path.join(ROOT, "css/styles.css"), "utf8");
      assert.match(
        css,
        /\.faq-panel\[aria-hidden="true"\]\s*\{\s*visibility:\s*hidden;?\s*\}/,
        "CSS must ensure closed accordion panels are hidden from assistive technology"
      );
      assert.match(
        css,
        /\.faq-panel\[aria-hidden="false"\]\s*\{\s*visibility:\s*visible;?\s*\}/,
        "CSS must ensure open accordion panels are visible"
      );
    });
  });

  // --------------------------------------------------------------------------
  // 3. CSP & Font Self-Hosting Integrity
  // --------------------------------------------------------------------------
  describe("Adversarial Test 3: CSP & Font Self-Hosting", () => {
    it("empirically verifies zero external font/script network references across all HTML files", () => {
      const htmlFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
      for (const f of htmlFiles) {
        const content = fs.readFileSync(path.join(ROOT, f), "utf8");
        assert.doesNotMatch(content, /fonts\.googleapis\.com/, `${f} must not contain fonts.googleapis.com`);
        assert.doesNotMatch(content, /fonts\.gstatic\.com/, `${f} must not contain fonts.gstatic.com`);
        assert.doesNotMatch(content, /cdn\.tailwindcss\.com/, `${f} must not contain cdn.tailwindcss.com`);
        assert.doesNotMatch(content, /'unsafe-eval'/, `${f} must not contain 'unsafe-eval' in CSP`);
      }
    });

    it("empirically validates strict CSP meta tag across public pages", () => {
      const publicPages = [
        "index.html",
        "404.html",
        "anuncie.html",
        "lojas.html",
        "modalidades.html",
        "localizacao.html",
      ];
      for (const p of publicPages) {
        const content = fs.readFileSync(path.join(ROOT, p), "utf8");
        const cspMatch = content.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i);
        assert.ok(cspMatch, `${p} must have CSP meta`);
        const csp = cspMatch[1];
        assert.match(csp, /script-src\s+'self'/, `${p} must enforce script-src 'self'`);
        assert.match(csp, /font-src\s+'self'/, `${p} must enforce font-src 'self'`);
      }
    });

    it("empirically verifies local WOFF2 font binary files have valid wOF2 magic header and correct sizes", () => {
      const fontDir = path.join(ROOT, "assets/fonts");
      const expectedFonts = [
        "figtree-latin-normal.woff2",
        "figtree-latin-italic.woff2",
        "space-mono-latin-normal-400.woff2",
        "space-mono-latin-normal-700.woff2",
        "space-mono-latin-italic-400.woff2",
        "space-mono-latin-italic-700.woff2",
      ];

      for (const fontName of expectedFonts) {
        const fontPath = path.join(fontDir, fontName);
        assert.ok(fs.existsSync(fontPath), `Font file ${fontName} must exist`);
        const stat = fs.statSync(fontPath);
        assert.ok(stat.size >= 15000, `Font ${fontName} size must be realistic (>= 15KB)`);

        // Check magic bytes: wOF2
        const buf = fs.readFileSync(fontPath);
        const magic = buf.toString("ascii", 0, 4);
        assert.equal(magic, "wOF2", `Font ${fontName} must have valid WOFF2 magic header 'wOF2'`);
      }
    });

    it("empirically verifies CSS @font-face rules link exclusively to local files", () => {
      const css = fs.readFileSync(path.join(ROOT, "css/styles.css"), "utf8");
      const fontFaceBlocks = [...css.matchAll(/@font-face\s*\{([^}]+)\}/g)];
      assert.equal(fontFaceBlocks.length, 6, "Expected 6 @font-face blocks for Figtree and Space Mono");

      for (const [_, block] of fontFaceBlocks) {
        const urlMatch = block.match(/url\("([^"]+)"\)/);
        assert.ok(urlMatch, `@font-face must define url(): ${block}`);
        const relativeUrl = urlMatch[1];
        assert.match(relativeUrl, /^\.\.\/assets\/fonts\/[\w-]+\.woff2$/, `URL must be local WOFF2 path: ${relativeUrl}`);

        // Verify the file physically resolves from css/ directory
        const resolvedPath = path.resolve(ROOT, "css", relativeUrl);
        assert.ok(fs.existsSync(resolvedPath), `Resolved font path must exist on disk: ${resolvedPath}`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Accessibility Skip Link & Universal Focus
  // --------------------------------------------------------------------------
  describe("Adversarial Test 4: Skip Navigation & Focus Indicators", () => {
    it("empirically verifies .lm-pular and main#conteudo exist as first interactive elements on public pages", () => {
      const pages = ["index.html", "404.html", "anuncie.html", "localizacao.html", "lojas.html", "modalidades.html"];
      for (const p of pages) {
        const html = fs.readFileSync(path.join(ROOT, p), "utf8");
        assert.match(html, /<body[^>]*>\s*<a class="lm-pular" href="#conteudo">Pular para o conteúdo<\/a>/i);
        assert.match(html, /<main[^>]*id="conteudo"/i);
      }
    });

    it("empirically verifies high-contrast :focus-visible rules exist in CSS", () => {
      const css = fs.readFileSync(path.join(ROOT, "css/styles.css"), "utf8");
      assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--lm-tinta\)/);
      assert.match(css, /\.lm-pular:(focus|focus-visible)\s*\{[^}]*outline:\s*2px solid #ffffff/);
    });
  });
});
