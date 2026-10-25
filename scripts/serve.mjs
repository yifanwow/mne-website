import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2' };
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const resource = pathname === '/privacy' || pathname === '/privacy/' ? '/privacy.html' :
      pathname === '/' ? '/index.html' : pathname;
    let file = path.resolve(root, '.' + resource);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
    // Match nginx's directory/index behavior for other static directories.
    if ((await fs.stat(file)).isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(301, {Location: pathname + '/' + new URL(req.url, 'http://localhost').search});
        return res.end();
      }
      file = path.join(file, 'index.html');
    }
    const data = await fs.readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-cache' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(port, host, () => console.log(`Mne · Local: http://${host}:${port}`));
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
