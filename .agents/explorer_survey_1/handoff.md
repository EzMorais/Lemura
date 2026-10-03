# Handoff Report — R1: Correções de Dados e Contagem de Salas (C1)

## 1. Observation

Direct observations from the Galeria Lemura codebase:

### Obs 1.1: Static HTML Room Counts in `index.html`
- **File**: `d:\Lemura\index.html`
- **Line 17 (Hero Section)**:
  ```html
  <p class="lm-kicker"><span aria-hidden="true">●</span> <span data-salas-vagas>3</span> de <span data-salas-total>16</span> espaços livres</p>
  ```
  `data-salas-total` contains verbatim text `"16"` instead of `"12"`.
- **Line 19 (Disponibilidade Section)**:
  ```html
  <div class="lm-ocupacao" aria-label="Indicador de espaços disponíveis"><svg class="donut" width="170" height="170" viewBox="0 0 200 200" aria-hidden="true"><circle class="donut__track" cx="100" cy="100" r="80"></circle><circle class="donut__value" cx="100" cy="100" r="80"></circle></svg><span><strong data-salas-vagas>3</strong> livres<br>de <span data-salas-total>16</span></span></div>
  ```
  `data-salas-total` contains verbatim text `"16"` instead of `"12"`.
  Both lines statically display "de 16 espaços livres" / "de 16" prior to any JavaScript execution.

### Obs 1.2: Static SVG Donut CSS in `css/styles.css`
- **File**: `d:\Lemura\css\styles.css`
- **Line 4**:
  ```css
  .donut__value{fill:none;stroke:var(--lm-ceu);stroke-width:14;stroke-linecap:round;stroke-dasharray:502.4;stroke-dashoffset:408.2;transition:stroke-dashoffset 1.2s}
  ```
  `stroke-dashoffset` is hardcoded to `408.2`.
  Mathematical derivation of `408.2`:
  - Circumference = $2 \cdot \pi \cdot r = 2 \cdot 3.14 \cdot 80 = 502.4$.
  - Free space proportion for 16 rooms: $3 / 16 = 0.1875$ (18.75% free, 81.25% occupied).
  - Offset = $502.4 \cdot (1 - 3/16) = 502.4 \cdot 0.8125 = 408.2$.
  - Therefore, `408.2` represents the legacy 16-room calculation.

### Obs 1.3: Single Source of Truth in `data/salas.js`
- **File**: `d:\Lemura\data\salas.js`
- **Lines 4-7, 26-29, 34-226**:
  - `LEMURA_SALAS` defines exactly 12 rooms:
    - **Piso Térreo** (6 rooms): 4 occupied (`"01"` Doces de Elisa, `"02"` Elias & Krepski, `"03"` Andrea Almeida, `"04"` Imobiliária Fabiana), 2 vacant (`"12"` Espaço A, `"13"` Espaço B).
    - **Piso Superior** (6 rooms): 5 occupied (`"05"`, `"06"`, `"07"`, `"08"` Yandê Saúde, `"09"` Espaço ZOE), 1 vacant (`"14"` Espaço C).
  - Total: 12 rooms. Available: 3 rooms (Espaços A, B e C). Occupied: 9 rooms.
  - Data integrity in `data/salas.js` is already 100% compliant with the 12-room specification.

### Obs 1.4: Dynamic Calculations in `js/salas.js`
- **File**: `d:\Lemura\js\salas.js`
- **Lines 25-38**:
  ```javascript
  function preencher(seletor, valor) {
    var alvos = document.querySelectorAll(seletor);
    for (var i = 0; i < alvos.length; i++) alvos[i].textContent = String(valor);
  }
  preencher("[data-salas-total]", SALAS.length);
  preencher("[data-salas-vagas]", vagas.length);

  /* ---- anel de ocupação ------------------------------------------
     O anel preenche a fatia LIVRE. dasharray 502.4 = 2·π·80. */
  var anel = document.querySelector(".donut__value");
  if (anel && SALAS.length) {
    var volta = 502.4;
    anel.style.strokeDashoffset = (volta * (1 - vagas.length / SALAS.length)).toFixed(1);
  }
  ```
  - `SALAS.length` is 12, `vagas.length` is 3.
  - When JS runs, `preencher("[data-salas-total]", 12)` overwrites the DOM nodes from `"16"` to `"12"`.
  - Dynamic dashoffset is calculated as: $(502.4 \cdot (1 - 3/12)) = 502.4 \cdot 0.75 = 376.8$.
  - However, line 18 contains `if (!T) return;` (`T = window.LemuraTemplates`). If `window.LemuraTemplates` fails or delays, neither DOM replacement nor donut adjustment fires.

### Obs 1.5: Outdated Copy in `anuncie.html`
- **File**: `d:\Lemura\anuncie.html`
- **Line 217**:
  ```html
  <p>São 16 salas na galeria e 3 ainda estão livres. Fale com a gente para conhecer o espaço e entender qual modalidade encaixa no seu negócio.</p>
  ```
  Static marketing copy explicitly asserts "São 16 salas na galeria e 3 ainda estão livres."

### Obs 1.6: Existing Test Coverage in `tests/`
- **File**: `d:\Lemura\tests\e2e.test.mjs`
  - **Lines 255-265 (F2.5)**:
    ```javascript
    it("F2.5: donut chart occupancy indicator formula calculation (2·π·r = 502.4)", () => {
      const circumference = 502.4; // 2 * PI * 80
      const total12 = 12;
      const vagas3 = 3;
      const offset12 = (circumference * (1 - vagas3 / total12)).toFixed(1);
      assert.equal(offset12, "376.8", "Donut offset for 3/12 must equal 376.8");

      const total16 = 16;
      const offset16 = (circumference * (1 - vagas3 / total16)).toFixed(1);
      assert.equal(offset16, "408.2", "Donut offset for 3/16 must equal 408.2");
    });
    ```
    Tests the mathematical function for both 12 and legacy 16.
  - **Lines 267-273 (F2.6)**:
    ```javascript
    it("F2.6: landing page index.html contains data attributes for dynamic room statistics", () => {
      const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
      assert.match(html, /data-salas-vagas/, "index.html must have data-salas-vagas indicator");
      assert.match(html, /data-salas-total/, "index.html must have data-salas-total indicator");
      assert.match(html, /class="donut__value"/, "index.html must have .donut__value SVG circle");
    });
    ```
    Checks only regex presence of attribute names, but does NOT assert that the text inside `data-salas-total` is `"12"`, nor does it check the static CSS dashoffset in `css/styles.css`.
- **Test execution command**:
  `cmd /c 'set ELECTRON_RUN_AS_NODE=1 && "C:\Users\morai\AppData\Local\Programs\Microsoft VS Code\Code.exe" --test tests/*.test.mjs'`
  Current status: 96 passing tests out of 96.

---

## 2. Logic Chain

1. **Premise (User Specification & Business Reality)**: Galeria Lemura has exactly 12 commercial spaces (DOZE), with 9 occupied and 3 available (Espaços A, B e C), as confirmed in `ORIGINAL_REQUEST.md` (Follow-up 2026-08-23T23:24:31Z & 2026-09-20T00:07:30Z) and `PLANO-MELHORIAS.md` (C1).
2. **Current Discrepancy in `index.html`**:
   - `data/salas.js` already models 12 rooms (Obs 1.3).
   - In `index.html`, lines 17 and 19 contain `<span data-salas-total>16</span>` (Obs 1.1).
   - For users with JavaScript disabled, slow networks, assistive technologies (screen readers during initial paint), and search engine crawlers (SEO), the page communicates "3 de 16 espaços livres" (18.75% availability) instead of the true "3 de 12 espaços livres" (25% availability).
   - When JS executes, it overwrites this value, causing a text flash / Cumulative Layout Shift (CLS) artifact.
3. **Current Discrepancy in `css/styles.css`**:
   - In `css/styles.css` line 4, `.donut__value` has `stroke-dashoffset: 408.2;` and `transition: stroke-dashoffset 1.2s;` (Obs 1.2).
   - $408.2$ corresponds to $502.4 \cdot (1 - 3/16)$.
   - For a 12-room setup with 3 vacant rooms, the vacancy ratio is $3 / 12 = 0.25$, meaning the occupied portion is $0.75$.
   - The required offset is $502.4 \cdot 0.75 = 376.8$.
   - Because `css/styles.css` has `408.2`, any page render before JS runs displays an arc of 18.75%. When JS runs, `js/salas.js` sets `strokeDashoffset = "376.8"`, triggering a 1.2s transition that visibly warps the donut from 18.75% to 25%. If JS is off, it remains frozen at the wrong proportion.
4. **Current Discrepancy in `anuncie.html`**:
   - `anuncie.html` line 217 states "São 16 salas na galeria e 3 ainda estão livres" (Obs 1.5). This directly contradicts the 12-room reality and must be updated to 12.
5. **Robustness in `js/salas.js`**:
   - The formula in `js/salas.js` line 37 dynamically computes `(502.4 * (1 - 3/12)).toFixed(1) === "376.8"`.
   - However, placing `preencher()` and `anel.style.strokeDashoffset` after `if (!T) return;` couples stat injection to `LemuraTemplates` loading. Decoupling ensures stat counters and donut initialization run even if template rendering is delayed.
6. **Test Suite Gap**:
   - The current tests pass (96/96), but test F2.6 in `tests/e2e.test.mjs` only tests attribute regex presence (`/data-salas-total/`), masking the fact that the static HTML has `16` and the static CSS has `408.2`.

---

## 3. Caveats

- **Scope boundary**: This survey is strictly read-only for R1 / C1. No edits to source code files were made during this phase.
- **Cross-requirement overlaps**:
  - `index.html` will also be edited by R2 (Accessibility — skip link, FAQ accordion) and R3 (Tailwind removal, fonts). Changes to line 17 and line 19 for C1 are localized to the hero kicker and availability heading.
  - `css/styles.css` will also be modified for A3 (focus-visible) and D1 (compiled CSS). Line 4 is currently minified/single-line; replacement must be precise.
- **Other pages**: Full repo search verified that no other pages (`lojas.html`, `modalidades.html`, `localizacao.html`, `404.html`, `catalogo-fotos.html`) contain room count numbers, except `anuncie.html` (line 217).

---

## 4. Conclusion

The data source `data/salas.js` is already accurate (12 rooms, 9 occupied, 3 vacant). However, three critical files contain outdated references to 16 rooms and must be updated:

1. **`index.html`**:
   - Line 17: Replace `<span data-salas-total>16</span>` with `<span data-salas-total>12</span>`.
   - Line 19: Replace `<span data-salas-total>16</span>` with `<span data-salas-total>12</span>`.
2. **`css/styles.css`**:
   - Line 4: Replace `stroke-dashoffset:408.2;` with `stroke-dashoffset:376.8;` in `.donut__value`.
3. **`anuncie.html`**:
   - Line 217: Replace `São 16 salas na galeria e 3 ainda estão livres.` with `São 12 salas na galeria e 3 ainda estão livres.`.
4. **`js/salas.js` (Resilience)**:
   - Ensure `preencher()` and `anel.style.strokeDashoffset` are evaluated independently of `window.LemuraTemplates`.
5. **`tests/e2e.test.mjs`**:
   - Enhance test F2.6 to assert:
     - `assert.match(html, /<span[^>]*data-salas-total[^>]*>12<\/span>/g)`
     - `assert.doesNotMatch(html, /<span[^>]*data-salas-total[^>]*>16<\/span>/)`
     - `assert.match(css, /\.donut__value\{[^}]*stroke-dashoffset:\s*376\.8/);`
     - `assert.match(anuncieHtml, /São 12 salas na galeria/);`

---

## 5. Verification Method

To independently verify after implementation:

1. **Static HTML Inspection**:
   - Check `index.html` lines 17 and 19:
     ```powershell
     Select-String -Path "d:\Lemura\index.html" -Pattern "data-salas-total"
     ```
     Expected result: Lines contain `>12<`, zero occurrences of `>16<`.
   - Check `anuncie.html` line 217:
     ```powershell
     Select-String -Path "d:\Lemura\anuncie.html" -Pattern "salas na galeria"
     ```
     Expected result: `São 12 salas na galeria e 3 ainda estão livres.`

2. **CSS Donut Dashoffset Inspection**:
   - Check `css/styles.css`:
     ```powershell
     Select-String -Path "d:\Lemura\css\styles.css" -Pattern "stroke-dashoffset"
     ```
     Expected result: `.donut__value` contains `stroke-dashoffset:376.8`.

3. **Automated Test Suite**:
   - Run the project test suite using the Node environment:
     ```powershell
     cmd /c 'set ELECTRON_RUN_AS_NODE=1 && "C:\Users\morai\AppData\Local\Programs\Microsoft VS Code\Code.exe" --test tests/*.test.mjs'
     ```
     Expected result: All tests pass with exit code 0.

4. **Static Generator Execution**:
   - Verify static generator runs cleanly:
     ```powershell
     cmd /c 'set ELECTRON_RUN_AS_NODE=1 && "C:\Users\morai\AppData\Local\Programs\Microsoft VS Code\Code.exe" scripts/gerar.mjs'
     ```
     Expected result: 6 stores generated, exit code 0.
