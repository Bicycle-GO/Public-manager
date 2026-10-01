import { randomBytes, timingSafeEqual } from 'node:crypto';

const loginPage = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>조달온 로그인</title><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#f1f5fc;color:#20344f;font-family:system-ui,sans-serif}main{width:100%;max-width:440px;background:white;border:1px solid #dce5f2;border-radius:18px;padding:38px}h1{font-size:34px;color:#175cda}p{font-size:17px;line-height:1.8}label{display:block;margin:26px 0 12px}input,button{font:inherit;width:100%;padding:15px;border-radius:8px;font-size:18px}input{border:1px solid #b6c7e2}button{margin-top:20px;background:#175cda;border:0;color:white;cursor:pointer}.error{color:#ac382e}small{display:block;margin-top:22px;color:#637590}</style></head><body><main><h1>조달온</h1><p>공공조달관리사 학습 공간<br>접속 암호를 입력해 주세요.</p><form method="post" action="/login"><label for="password">접속 암호</label><input id="password" name="password" type="password" required autocomplete="current-password" autofocus><!--ERROR--><button>학습 시작하기</button></form><small>로그인은 최대 8시간 유지됩니다.</small></main></body></html>`;

export function createAuth(password = 'jin') {
 const sessions = new Map();
 return async function requireLogin(req, res, pathname) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const token = (req.headers.cookie || '').split(';').map(c=>c.trim()).find(c=>c.startsWith('jodalon_session='))?.slice('jodalon_session='.length);
  for (const [key, expires] of sessions) if (expires <= Date.now()) sessions.delete(key);
  if (pathname === '/login' && req.method === 'POST') {
   if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) { res.writeHead(403).end('Forbidden'); return false; }
   let body = '';
   for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > 2048) { res.writeHead(413).end(); return false; } }
   const given = Buffer.from(new URLSearchParams(body).get('password') || ''), expected = Buffer.from(password);
   if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    res.writeHead(401, {'Content-Type':'text/html; charset=utf-8'}).end(loginPage.replace('<!--ERROR-->', '<p class="error" role="alert">암호가 올바르지 않습니다.</p>')); return false;
   }
   if (token) sessions.delete(token);
   const key = randomBytes(32).toString('hex'); sessions.set(key, Date.now()+28800000);
   res.writeHead(303, {'Location':'/', 'Set-Cookie':`jodalon_session=${key}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`}).end(); return false;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405).end('Method not allowed'); return false; }
  if (sessions.has(token)) return true;
  if (['/', '/index.html', '/login'].includes(pathname)) res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'}).end(loginPage);
  else res.writeHead(401).end('Login required');
  return false;
 };
}
