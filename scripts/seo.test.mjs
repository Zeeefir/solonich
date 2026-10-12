import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getSeo } from '../src/seo.mjs';

const products = JSON.parse(readFileSync('src/data/products.json','utf8'));
test('SEO pages have unique metadata, public URLs and private-page exclusions', () => {
 const home = readFileSync('dist/index.html','utf8');
 assert.match(home, /<title>Квашеная капуста и соленья в Алматы — Солёныч<\/title>/);
 assert.match(home, /rel="icon" type="image\/png" href="\/logo.png"/);
 const titles = new Set();
 for (const product of products) {
  const html = readFileSync(`dist/product/${product.id}/index.html`,'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)[1];
  assert.ok(!titles.has(title)); titles.add(title);
  assert.ok(html.includes(`https://solonich.vercel.app/product/${product.id}`));
  const schema = JSON.parse(html.match(/<script id="site-schema" type="application\/ld\+json">(.*?)<\/script>/)[1]);
  assert.equal(schema['@graph'][1]['@type'],'Product');
  assert.equal(schema['@graph'][1].name,product.title);
 }
 const sitemap = readFileSync('dist/sitemap.xml','utf8');
 assert.equal((sitemap.match(/<url>/g)||[]).length,13);
 assert.ok(!sitemap.includes('/admin'));
 assert.match(readFileSync('dist/admin/index.html','utf8'),/noindex, nofollow/);
 assert.match(getSeo('/','EN',products).title,/Solonich/);
 assert.match(getSeo('/','KZ',products).title,/Алматы/);
});
