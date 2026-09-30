/* =====================================================================
   SERVIDOR LOCAL PARA CONFERIR O SITE ANTES DE PUBLICAR
   ---------------------------------------------------------------------
   Na pasta do projeto:

       node scripts/servidor.mjs

   Depois abra http://localhost:4173 no navegador.
   Para parar, aperte Ctrl + C.

   Serve só os arquivos desta pasta, e só para a sua máquina.
   Não usa nenhuma biblioteca externa.
   ===================================================================== */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORTA = Number(process.env.PORTA || 4173);

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function resolverArquivo(urlPath) {
  let alvo = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  if (alvo.endsWith("/")) alvo += "index.html";

  const absoluto = path.resolve(RAIZ, "." + alvo);

  /* Nunca sair da pasta do projeto. */
  if (absoluto !== RAIZ && !absoluto.startsWith(RAIZ + path.sep)) return null;

  if (fs.existsSync(absoluto) && fs.statSync(absoluto).isDirectory()) {
    const indice = path.join(absoluto, "index.html");
    return fs.existsSync(indice) ? indice : null;
  }
  return fs.existsSync(absoluto) && fs.statSync(absoluto).isFile() ? absoluto : null;
}

const servidor = http.createServer((req, res) => {
  const arquivo = resolverArquivo(req.url || "/");

  if (arquivo) {
    const tipo = TIPOS[path.extname(arquivo).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": tipo, "Cache-Control": "no-cache" });
    fs.createReadStream(arquivo).pipe(res);
    console.log("  200  " + req.url);
    return;
  }

  const erro404 = path.join(RAIZ, "404.html");
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  if (fs.existsSync(erro404)) fs.createReadStream(erro404).pipe(res);
  else res.end("<h1>404</h1>");
  console.log("  404  " + req.url);
});

servidor.listen(PORTA, "127.0.0.1", () => {
  console.log("");
  console.log("  Galeria Lemura rodando na sua máquina:");
  console.log("");
  console.log(`     http://localhost:${PORTA}`);
  console.log(`     http://localhost:${PORTA}/lojas.html`);
  console.log(`     http://localhost:${PORTA}/anuncie.html`);
  console.log("");
  console.log("  Ctrl + C para parar.");
  console.log("");
});
