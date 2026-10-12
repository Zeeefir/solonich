import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = process.env.DATA_DIR || path.join(root, 'data');
mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, 'solonich.sqlite'));
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
 CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'customer');
 CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), expires INTEGER NOT NULL);`);
if (!db.prepare('SELECT COUNT(*) AS n FROM products').get().n && !existsSync(path.join(dataDir, '.seeded'))) {
 const insert = db.prepare('INSERT INTO products(id,content) VALUES (?,?)');
 for (const p of JSON.parse(readFileSync(path.join(root, 'src/data/products.json'), 'utf8'))) insert.run(p.id, JSON.stringify(p));
 writeFileSync(path.join(dataDir, '.seeded'), '1');
}
const setupPath = path.join(dataDir, 'admin-setup-code.txt');
if (!db.prepare("SELECT id FROM users WHERE role='admin'").get() && !existsSync(setupPath)) writeFileSync(setupPath, randomBytes(24).toString('hex'));
const sha = value => createHash('sha256').update(value).digest('hex');
function passwordHash(password) {
 const salt = randomBytes(16).toString('hex');
 return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}
function checkPassword(password, hash) {
 const [salt, expected] = hash.split(':');
 return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(expected, 'hex'));
}
const attempts = new Map();
function throttle(req) {
 const key = req.socket.remoteAddress;
 const now = Date.now();
 const record = attempts.get(key);
 if (!record || record.until < now) { attempts.set(key, { n: 1, until: now + 60000 }); return; }
 if (++record.n > 20) throw Object.assign(new Error('Too many attempts. Please wait a minute.'), { status: 429 });
}
const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
async function body(req) {
 let size = 0; const chunks = [];
 for await (const chunk of req) { size += chunk.length; if (size > 100000) fail('Request too large', 413); chunks.push(chunk); }
 try { return JSON.parse(Buffer.concat(chunks).toString()); } catch { fail('Invalid JSON'); }
}
function validateAccount(input) {
 const email = String(input.email || '').trim().toLowerCase();
 const name = String(input.name || '').trim();
 const password = String(input.password || '');
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) fail('Enter a valid email address');
 if (!name || name.length > 80) fail('Name must contain 1–80 characters');
 if (password.length < 10 || password.length > 128) fail('Password must contain 10–128 characters');
 return { email, name, password };
}
function validateProduct(p) {
 const result = {};
 for (const field of ['title','titleKz','titleEn','compositionRu','compositionKz','compositionEn','weight','image']) {
  const value = String(p[field] || '').trim();
  if (!value || value.length > 3000) fail(`Complete the field: ${field}`);
  result[field] = value;
 }
 if (!/^(\/[^/]|https:\/\/)/.test(result.image)) fail('Use a local image path or HTTPS image URL');
 result.badge = ['ОСТРОЕ','ХИТ','НОВИНКА','АКЦИЯ'].includes(p.badge) ? p.badge : null;
 for (const [group, fields] of Object.entries({ nutrition: ['proteins','fats','carbs','calories','kJ'], storage: ['temp','humidity','shelfLife'] })) {
  result[group] = {};
  for (const field of fields) {
   const value = String(p[group]?.[field] || '').trim();
   if (!value || value.length > 100) fail(`Complete the field: ${group}.${field}`);
   result[group][field] = value;
  }
 }
 return result;
}
function currentUser(req) {
 const token = req.headers.cookie?.split(';').map(x => x.trim()).find(x => x.startsWith('session='))?.slice(8);
 if (!token) return null;
 return db.prepare('SELECT u.id,u.email,u.name,u.role FROM sessions s JOIN users u ON s.user_id=u.id WHERE s.token=? AND s.expires>?').get(sha(token), Date.now()) || null;
}
function issueSession(res, userId) {
 const token = randomBytes(32).toString('hex');
 db.prepare('DELETE FROM sessions WHERE expires<?').run(Date.now());
 db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(sha(token), userId, Date.now() + 86400000 * 7);
 res.setHeader('Set-Cookie', `session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800`);
}
const server = createServer(async (req, res) => {
 res.setHeader('Content-Type', 'application/json; charset=utf-8');
 res.setHeader('Cache-Control', 'no-store');
 res.setHeader('X-Content-Type-Options', 'nosniff');
 const send = (value, status = 200) => { res.statusCode = status; res.end(JSON.stringify(value)); };
 try {
  const url = new URL(req.url, 'http://127.0.0.1:3001');
  const route = url.pathname;
  const method = req.method;
  if (!['GET','HEAD'].includes(method)) {
   const origin = req.headers.origin;
   if (!origin || !['http://127.0.0.1:5174','http://localhost:5174','http://127.0.0.1:5173','http://localhost:5173'].includes(origin)) fail('Invalid request origin', 403);
   if (!req.headers['content-type']?.startsWith('application/json')) fail('JSON content required', 415);
  }
  const user = currentUser(req);
  if (route === '/api/me' && method === 'GET') return send({ user });
  if (route === '/api/setup' && method === 'GET') return send({ needed: !db.prepare("SELECT id FROM users WHERE role='admin'").get() });
  if (route === '/api/products' && method === 'GET') return send(db.prepare('SELECT id,content FROM products ORDER BY id').all().map(row => ({ ...JSON.parse(row.content), id: row.id })));
  if (['/api/register','/api/setup'].includes(route) && method === 'POST') {
   throttle(req); const input = await body(req); const account = validateAccount(input);
   const setup = route === '/api/setup';
   if (setup) {
    if (db.prepare("SELECT id FROM users WHERE role='admin'").get()) fail('Administrator already configured', 409);
    const expected = existsSync(setupPath) ? readFileSync(setupPath, 'utf8').trim() : '';
    if (!expected || !timingSafeEqual(Buffer.from(sha(String(input.setupCode || ''))), Buffer.from(sha(expected)))) fail('Invalid setup code', 403);
   }
   if (db.prepare('SELECT id FROM users WHERE email=?').get(account.email)) fail('This email is already registered', 409);
   const created = db.prepare('INSERT INTO users(email,name,password,role) VALUES (?,?,?,?)').run(account.email, account.name, passwordHash(account.password), setup ? 'admin' : 'customer');
   if (setup && existsSync(setupPath)) unlinkSync(setupPath);
   issueSession(res, Number(created.lastInsertRowid));
   return send({ user: { id: Number(created.lastInsertRowid), email: account.email, name: account.name, role: setup ? 'admin' : 'customer' } }, 201);
  }
  if (route === '/api/login' && method === 'POST') {
   throttle(req); const input = await body(req);
   const found = db.prepare('SELECT * FROM users WHERE email=?').get(String(input.email || '').trim().toLowerCase());
   const password = String(input.password || '');
   if (password.length > 128 || !found || !checkPassword(password, found.password)) fail('Incorrect email or password', 401);
   issueSession(res, found.id); return send({ user: { id: found.id, name: found.name, email: found.email, role: found.role } });
  }
  if (route === '/api/logout' && method === 'POST') {
   const token = req.headers.cookie?.split(';').map(x => x.trim()).find(x => x.startsWith('session='))?.slice(8);
   if (token) db.prepare('DELETE FROM sessions WHERE token=?').run(sha(token));
   res.setHeader('Set-Cookie', 'session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'); return send({ ok: true });
  }
  if (route.startsWith('/api/products') && ['POST','PUT','DELETE'].includes(method)) {
   if (!user) fail('Please sign in', 401);
   if (user.role !== 'admin') fail('Administrator access required', 403);
   if (method === 'POST' && route === '/api/products') {
    const product = validateProduct(await body(req));
    const created = db.prepare('INSERT INTO products(content) VALUES (?)').run(JSON.stringify(product));
    return send({ ...product, id: Number(created.lastInsertRowid) }, 201);
   }
   const match = route.match(/^\/api\/products\/(\d+)$/);
   if (!match) fail('Not found', 404);
   const id = Number(match[1]);
   if (!db.prepare('SELECT id FROM products WHERE id=?').get(id)) fail('Product not found', 404);
   if (method === 'PUT') { const p = validateProduct(await body(req)); db.prepare('UPDATE products SET content=? WHERE id=?').run(JSON.stringify(p), id); return send({ ...p, id }); }
   if (method === 'DELETE') { db.prepare('DELETE FROM products WHERE id=?').run(id); return send({ ok: true }); }
  }
  fail('Not found', 404);
 } catch (error) { send({ error: error.status ? error.message : 'Server error' }, error.status || 500); }
});
server.listen(Number(process.env.PORT || 3001), '127.0.0.1', () => console.log('Local database API: http://127.0.0.1:3001'));
