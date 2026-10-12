import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { once } from 'node:events';

test('accounts, administrator permissions, product CRUD and persistence', async () => {
 const folder = mkdtempSync(path.join(os.tmpdir(), 'solonich-test-'));
 assert.equal(path.dirname(path.resolve(folder)), path.resolve(os.tmpdir()));
 assert.ok(path.basename(folder).startsWith('solonich-test-'));
 let server;
 async function start() {
  server = spawn(process.execPath, ['server/index.mjs'], { env: { ...process.env, PORT: '3002', DATA_DIR: folder }, stdio: ['ignore','pipe','pipe'] });
  await new Promise((resolve,reject) => { server.stdout.once('data', resolve); server.once('error',reject); server.once('exit',code=>reject(new Error(`Server exited: ${code}`))); });
 }
 async function stop() { const stopped = once(server,'exit'); server.kill(); await stopped; }
 async function request(route, input, cookie, method='POST', origin='http://127.0.0.1:5174') {
  const response = await fetch(`http://127.0.0.1:3002/api${route}`, input === undefined ? {headers: cookie ? {cookie} : {}} : { method, headers: {'Content-Type':'application/json', Origin:origin, ...(cookie ? {cookie}: {})}, body: JSON.stringify(input) });
  return {status:response.status, value:await response.json(), cookie:response.headers.get('set-cookie')?.split(';')[0]};
 }
 try {
  await start();
  const initial = await request('/products'); assert.equal(initial.value.length,12);
  assert.ok(initial.value.every(p=>p.titleEn && p.compositionEn));
  const customer = await request('/register',{name:'Test customer',email:'customer@example.test',password:'test-password-123'}); assert.equal(customer.status,201); assert.equal(customer.value.user.role,'customer');
  assert.equal((await request('/products',initial.value[0],customer.cookie)).status,403);
  assert.equal((await request('/products',initial.value[0])).status,401);
  assert.equal((await request('/register',{name:'X',email:'bad',password:'short'})).status,400);
  assert.equal((await request('/login',{email:'customer@example.test',password:'incorrect'})).status,401);
  const admin = await request('/setup',{name:'Test admin',email:'admin@example.test',password:'test-admin-password',setupCode:readFileSync(path.join(folder,'admin-setup-code.txt'),'utf8')}); assert.equal(admin.status,201);
  assert.equal((await request('/setup')).value.needed,false);
  const forbidden = await request('/products',initial.value[0],admin.cookie,'POST','https://untrusted.example'); assert.equal(forbidden.status,403);
  const created = await request('/products',{...initial.value[0],title:'Test product'},admin.cookie); assert.equal(created.status,201);
  const id=created.value.id;
  const updated = await request(`/products/${id}`,{...created.value,titleEn:'Updated product'},admin.cookie,'PUT'); assert.equal(updated.status,200);
  await stop(); await start();
  const persisted = await request('/products'); assert.equal(persisted.value.find(p=>p.id===id).titleEn,'Updated product');
  assert.equal((await request('/me',undefined,admin.cookie)).value.user.role,'admin');
  assert.equal((await request(`/products/${id}`,{},customer.cookie,'DELETE')).status,403);
  assert.equal((await request(`/products/${id}`,{},admin.cookie,'DELETE')).status,200);
  assert.equal((await request('/products')).value.length,12);
  assert.equal((await request('/logout',{},admin.cookie)).status,200);
  assert.equal((await request('/me',undefined,admin.cookie)).value.user,null);
  const login = await request('/login',{email:'admin@example.test',password:'test-admin-password'}); assert.equal(login.status,200);
 } finally { if(server && server.exitCode===null) await stop(); rmSync(folder,{recursive:true,force:true}); }
});
