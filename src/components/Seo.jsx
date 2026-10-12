import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useLanguage from '../useLanguage';
import { useSiteData } from '../SiteData';
import { getSeo } from '../seo.mjs';

export default function Seo() {
 const { pathname } = useLocation();
 const lang = useLanguage();
 const { products, loading } = useSiteData();
 useEffect(() => {
  if (loading) return;
  const seo = getSeo(pathname, lang, products);
  document.title = seo.title;
  const meta = (attribute, key, value) => {
   let node = document.head.querySelector(`meta[${attribute}="${key}"]`);
   if (!node) { node = document.createElement('meta'); node.setAttribute(attribute, key); document.head.append(node); }
   node.content = value;
  };
  meta('name','description',seo.description); meta('name','robots',seo.robots);
  for (const [key,value] of Object.entries({title:seo.title,description:seo.description,url:seo.canonical,image:seo.image,locale:seo.locale,site_name:lang==='EN'?'Solonich':'Солёныч',type:pathname.startsWith('/product/')?'product':'website'})) meta('property',`og:${key}`,value);
  meta('name','twitter:card','summary'); meta('name','twitter:title',seo.title); meta('name','twitter:description',seo.description); meta('name','twitter:image',seo.image);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel='canonical'; document.head.append(canonical); }
  canonical.href = seo.canonical;
  let schema = document.getElementById('site-schema');
  if (seo.schema) { if (!schema) { schema=document.createElement('script'); schema.id='site-schema'; schema.type='application/ld+json'; document.head.append(schema); } schema.textContent=JSON.stringify(seo.schema); }
  else schema?.remove();
 }, [pathname,lang,products,loading]);
 return null;
}
