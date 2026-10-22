import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { getSeo, siteUrl } from '../src/seo.mjs';
const products = JSON.parse(readFileSync('src/data/products.json','utf8'));
const output = process.env.SITE_BUILD_DIRECTORY || 'dist';
const template = readFileSync(`${output}/index.html`,'utf8');
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const urls = ['/',...products.map(p=>`/product/${p.id}`)];
for (const route of [...urls,'/profile','/setup','/admin','/admin/new']) {
 const seo=getSeo(route,'RU',products);
 const tags = [`<title>${escape(seo.title)}</title>`,`<meta name="description" content="${escape(seo.description)}">`,`<meta name="robots" content="${seo.robots}">`,`<link rel="canonical" href="${seo.canonical}">`,...Object.entries({title:seo.title,description:seo.description,url:seo.canonical,image:seo.image,site_name:'Солёныч',locale:seo.locale,type:route.startsWith('/product/')?'product':'website'}).map(([key,value])=>`<meta property="og:${key}" content="${escape(value)}">`),'<meta name="twitter:card" content="summary">',`<meta name="twitter:image" content="${escape(seo.image)}">`, ...(seo.schema ? [`<script id="site-schema" type="application/ld+json">${JSON.stringify(seo.schema).replaceAll('<','\\u003c')}</script>`] : [])];
 let html=template.replace(/<!-- SEO_START -->[\s\S]*?<!-- SEO_END -->/, `<!-- SEO_START -->\n${tags.join('\n')}\n<!-- SEO_END -->`);
 const p=products.find(p=>route===`/product/${p.id}`);
 if (urls.includes(route)) {
  const fallback=p ? `<h1>${escape(p.title)} — Солёныч</h1><p>${escape(p.weight)}</p><h2>Состав</h2><p>${escape(p.compositionRu)}</p><a href="/">Каталог солений</a>` : `<h1>Квашеная капуста и соленья в Алматы — Солёныч</h1><p>${escape(seo.description)}</p><ul>${products.map(p=>`<li><a href="/product/${p.id}">${escape(p.title)}</a></li>`).join('')}</ul>`;
  html=html.replace('</body>',`<noscript>${fallback}</noscript></body>`);
 }
 const directory=route==='/'?output:`${output}${route}`;
 mkdirSync(directory,{recursive:true}); writeFileSync(`${directory}/index.html`,html);
}
writeFileSync(`${output}/sitemap.xml`,`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(route=>`<url><loc>${siteUrl}${route}</loc></url>`).join('')}</urlset>\n`);
writeFileSync(`${output}/robots.txt`,`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\nDisallow: /profile\nDisallow: /setup\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log(`SEO: ${urls.length} public pages, sitemap and robots generated`);
