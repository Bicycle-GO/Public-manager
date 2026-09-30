import http from 'node:http';
import { createAuth } from './auth.mjs';
import { pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(import.meta.dirname);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
export function createServer(options = {}) {
 const requireLogin = createAuth(options.password);
 return http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (!await requireLogin(req, res, pathname)) return;
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + sep) || file.slice(root.length+1).includes(sep) || !['.html', '.js', '.css', '.svg'].includes(extname(file))) { res.writeHead(404).end('Not found'); return; }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)], 'Cache-Control': 'no-store' }).end(req.method==='HEAD'?undefined:data);
  } catch { res.writeHead(404).end('Not found'); }
 });
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
 createServer().listen(Number(process.env.PORT) || 3000, '127.0.0.1', () => console.log('조달온 → http://127.0.0.1:3000'));
}
