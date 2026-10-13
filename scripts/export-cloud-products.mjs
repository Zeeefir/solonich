import { DatabaseSync } from 'node:sqlite';
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
let products;
if (existsSync('data/solonich.sqlite')) {
 const db=new DatabaseSync('data/solonich.sqlite',{readOnly:true});
 products=db.prepare('SELECT id,content FROM products ORDER BY id').all().map(({id,content})=>({...JSON.parse(content),id}));
 db.close();
} else products=JSON.parse(readFileSync('src/data/products.json','utf8'));
const values=products.map(({id,...content})=>`(${Number(id)}, '${JSON.stringify(content).replaceAll("'","''")}'::jsonb)`).join(',\n');
const sql=`-- Public product catalog only; no accounts, passwords or sessions.\nbegin;\n${values ? `insert into public.products(id,content) values\n${values}\non conflict(id) do nothing;` : ''}\nselect setval('public.products_id_seq',greatest(coalesce((select max(id) from public.products),0)+1,1),false);\ncommit;\n`;
writeFileSync('supabase/seed-products.sql',sql);
console.log(`Prepared ${products.length} products for online import`);
