// Local preview server: serves the repo at http://localhost:8123/German-Expert/
// (same path as GitHub Pages, so root-relative links like those in 404.html work).
// Run from anywhere:  node scripts/serve.js        Stop: Ctrl+C
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 8123;
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.xml': 'application/xml' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (!p.startsWith('/German-Expert/')) { res.writeHead(302, { Location: '/German-Expert/' }); return res.end(); }
  p = p.slice('/German-Expert'.length);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': T[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(buf);
  });
}).listen(PORT, () => console.log(`Live site:  http://localhost:${PORT}/German-Expert/\nRedesign:   http://localhost:${PORT}/German-Expert/v2.html`));
