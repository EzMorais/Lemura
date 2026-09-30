import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('.');
http.createServer((req,res)=>{
  const url = new URL(req.url, 'http://127.0.0.1:4174');
  const file = path.resolve(root, decodeURIComponent(url.pathname.slice(1) || 'index.html'));
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404).end();return;}
    const ext=path.extname(file);
    const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.woff2':'font/woff2','.json':'application/json'};
    res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream'}).end(data);
  });
}).listen(4174,'127.0.0.1');
