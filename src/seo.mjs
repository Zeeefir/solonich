import { assetUrl } from './assetUrl.mjs';
export const siteUrl = import.meta.env?.VITE_SITE_URL || globalThis.process?.env?.VITE_SITE_URL || 'https://solonich.vercel.app';
const home = {
 RU: { title: 'Квашеная капуста и соленья в Казахстане — Солёныч', description: 'Квашеная капуста в Алматы — «Солёныч», Казахстан. Солёная капуста, солёные огурцы, морковь по-корейски, аджика и овощные салаты. Каталог и состав.' },
 KZ: { title: 'Қазақстандағы ашытылған қырыққабат пен тұздалған өнімдер — Солёныч', description: 'Қазақстандағы «Солёныч»: ашытылған және тұздалған қырыққабат, қияр, корейше сәбіз, аджика және көкөніс салаттары. Алматыдағы өндіріс, өнімдер каталогы мен құрамы.' },
 EN: { title: 'Sauerkraut and pickles in Kazakhstan — Solonich', description: 'Solonich sauerkraut and salted cabbage in Kazakhstan. Made in Almaty: salted cucumbers, Korean-style carrots, adjika and vegetable salads. Browse products and ingredients.' },
};
export function getSeo(pathname, language = 'RU', products = []) {
 const lang = home[language] ? language : 'RU';
 const privatePage = /^\/(admin|profile|setup)(\/|$)/.test(pathname);
 const product = products.find(p => pathname === `/product/${p.id}`);
 const name = product && (lang === 'EN' ? product.titleEn : lang === 'KZ' ? product.titleKz : product.title);
 const title = privatePage ? (lang === 'EN' ? 'My account — Solonich' : lang === 'KZ' ? 'Жеке кабинет — Солёныч' : 'Личный кабинет — Солёныч') : product ? `${name} — ${lang === 'EN' ? 'Solonich, Kazakhstan' : lang === 'KZ' ? 'Солёныч, Қазақстан' : 'Солёныч, Казахстан'}` : home[lang].title;
 const description = product ? (lang === 'EN' ? `${name}, ${product.weight.replace('г','g')}. Ingredients, nutrition, storage and shelf life. Solonich vegetable products from Almaty, Kazakhstan.` : lang === 'KZ' ? `${name}, ${product.weight}. Құрамы, тағамдық құндылығы, сақтау шарттары және жарамдылық мерзімі. «Солёныч», Алматы, Қазақстан.` : `${name}, ${product.weight}. Состав, пищевая ценность, условия хранения и срок годности. Овощная продукция «Солёныч», Алматы, Казахстан.`) : home[lang].description;
 const canonical = `${siteUrl}${product ? `/product/${product.id}` : privatePage ? pathname : '/'}`;
 const organization = { '@type':'Organization', '@id':`${siteUrl}/#organization`, name:'Солёныч', alternateName:'Solonich', legalName:'ТОО «LVR Asia»', url:siteUrl, logo:new URL(assetUrl('/logo.png'),siteUrl).href, telephone:'+77079903960', email:'info@solenich.kz', address:{'@type':'PostalAddress', addressLocality:'Алматы', addressCountry:'KZ'} };
 const schema = privatePage ? null : { '@context':'https://schema.org', '@graph': [organization, product ? { '@type':'Product', name, description, url:canonical, ...(product.image ? { image:new URL(assetUrl(product.image),siteUrl).href } : {}), brand:{'@type':'Brand',name:'Солёныч',alternateName:'Solonich'} } : { '@type':'WebSite', '@id':`${siteUrl}/#website`, name:'Солёныч', alternateName:'Solonich', url:siteUrl, publisher:{'@id':`${siteUrl}/#organization`} }] };
 return { title, description, canonical, schema, robots:privatePage ? 'noindex, nofollow' : 'index, follow', image:product?.image ? new URL(assetUrl(product.image),siteUrl).href : new URL(assetUrl('/logo.png'),siteUrl).href, locale:lang==='EN'?'en_US':lang==='KZ'?'kk_KZ':'ru_RU' };
}
