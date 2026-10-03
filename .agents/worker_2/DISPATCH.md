# DISPATCH

## 2026-08-23T23:36:00Z
You are Worker 2 (Data Layer, 12-Space Configuration & Merchant Vitrines Specialist) for Milestone 2.
Authoritative user request: D:\Lemura\.agents\ORIGINAL_REQUEST.md
Project plan: C:\Users\morai\.gemini\antigravity\brain\9dea7b89-76bf-45aa-b97a-b50458bf183e\PROJECT.md
Survey report: D:\Lemura\.agents\explorer_1\handoff.md
Asset mapping: D:\Lemura\.agents\explorer_2\handoff.md
Workspace root: D:\Lemura

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your mission is to execute Milestone 2 (Data Layer, 12-Space Configuration, Merchant Vitrines & SSG):
1. Read D:\Lemura\.agents\ORIGINAL_REQUEST.md, PROJECT.md, and the explorer handoff reports.
2. Update `data/salas.js` to strictly contain the official 12 commercial rooms (DOZE salas no total):
   - Piso Térreo (6 salas):
     * Sala 01: Ocupada por `doces-de-elisa` (vitrine para calçada/rua, AC, fotos)
     * Sala 02: Ocupada / Reservada (Elias & Krepski Advogados)
     * Sala 03: Ocupada por `andrea-almeida` (banheiro privativo, AC)
     * Sala 04: Ocupada / Reservada (Comercial Térreo)
     * Sala 12: `identificacaoPublica: "Espaço A"`, disponível: true, vitrine para o corredor térreo, fotos
     * Sala 13: `identificacaoPublica: "Espaço B"`, disponível: true, vitrine ao lado das mesas, fotos
   - Piso Superior (6 salas):
     * Sala 05: Ocupada por `yande` (Recepção da clínica, banheiro privativo, fotos)
     * Sala 06: Ocupada por `yande` (Fisioterapia, fotos)
     * Sala 07: Ocupada por `yande` (Psicologia, banheiro privativo, fotos)
     * Sala 08: Ocupada por `yande` (Massoterapia, fotos)
     * Sala 09: Ocupada por `espaco-zoe` (Ateliê coletivo, projetos sociais, fotos)
     * Sala 14: `identificacaoPublica: "Espaço C"`, disponível: true, banheiro privativo exclusivo, fotos
   - Ensure EXACT breakdown: 12 spaces total, 9 occupied, 3 available (3 livres de 12 no total).
3. Update `data/lojistas.js` and `js/lemura-templates.js` to render enriched merchant vitrines with real location badges (e.g. `📍 Piso Térreo • Sala 01`, `📍 Piso Superior • Salas 05 a 08`, `📍 Piso Térreo • Sala 03`), rich photo galleries, real merchant services, and SEO schema.
4. Run `node scripts/gerar.mjs` to regenerate `/lojas/<slug>/index.html`, `/lojas/index.html`, `sitemap.xml`, and `robots.txt`.
5. Run tests `node --test tests/site.test.mjs tests/e2e.test.mjs` to verify 100% pass.
6. Write your handoff report (handoff.md) and report back via send_message.
