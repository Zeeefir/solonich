export const siteUrl = 'https://solonich.vercel.app';
const home = {
 RU: { title: 'Квашеная капуста и соленья в Алматы — Солёныч', description: 'Квашеная капуста, солёные огурцы, морковь по-корейски, аджика и овощные салаты «Солёныч» в Алматы. Каталог продукции, состав и контакты производителя.' },
 KZ: { title: 'Алматыдағы ашытылған қырыққабат пен тұздалған өнімдер — Солёныч', description: 'Алматыдағы «Солёныч»: ашытылған қырыққабат, тұздалған қияр, корейше сәбіз, аджика және көкөніс салаттары. Өнімдер каталогы, құрамы және өндірушінің байланыстары.' },
 EN: { title: 'Sauerkraut and pickled vegetables in Almaty — Solonich', description: 'Solonich sauerkraut, salted cucumbers, Korean-style carrots, adjika and vegetable salads in Almaty. Browse products, ingredients and manufacturer contacts.' },
};
export function getSeo(pathname, language = 'RU', products = []) {
 const lang = home[language] ? language : 'RU';
 const privatePage = /^\/(admin|profile|setup)(\/|$)/.test(pathname);
 const product = products.find(p => pathname === `/product/${p.id}`);
 const name = product && (lang === 'EN' ? product.titleEn : lang === 'KZ' ? product.titleKz : product.title);
 const title = privatePage ? (lang === 'EN' ? 'My account — Solonich' : lang === 'KZ' ? 'Жеке кабинет — Солёныч' : 'Личный кабинет — Солёныч') : product ? `${name} — ${lang === 'EN' ? 'Solonich, Almaty' : lang === 'KZ' ? 'Солёныч, Алматы' : 'Солёныч, Алматы'}` : home[lang].title;
 const description = product ? (lang === 'EN' ? `${name}, ${product.weight.replace('г','g')}. Ingredients, nutrition, storage and shelf life. Solonich vegetable products, Almaty.` : lang === 'KZ' ? `${name}, ${product.weight}. Құрамы, тағамдық құндылығы, сақтау шарттары және жарамдылық мерзімі. «Солёныч», Алматы.` : `${name}, ${product.weight}. Состав, пищевая ценность, условия хранения и срок годности. Овощная продукция «Солёныч» в Алматы.`) : home[lang].description;
 const canonical = `${siteUrl}${product ? `/product/${product.id}` : privatePage ? pathname : '/'}`;
 const organization = { '@type':'Organization', '@id':`${siteUrl}/#organization`, name:'Солёныч', alternateName:'Solonich', legalName:'ТОО «LVR Asia»', url:siteUrl, logo:`${siteUrl}/logo.png`, telephone:'+77079903960', email:'info@solenich.kz', address:{'@type':'PostalAddress', addressLocality:'Алматы', addressCountry:'KZ'} };
 const schema = privatePage ? null : { '@context':'https://schema.org', '@graph': [organization, product ? { '@type':'Product', name, description, url:canonical, ...(product.image ? { image:new URL(product.image,siteUrl).href } : {}), brand:{'@type':'Brand',name:'Солёныч',alternateName:'Solonich'} } : { '@type':'WebSite', '@id':`${siteUrl}/#website`, name:'Солёныч', alternateName:'Solonich', url:siteUrl, publisher:{'@id':`${siteUrl}/#organization`} }] };
 return { title, description, canonical, schema, robots:privatePage ? 'noindex, nofollow' : 'index, follow', image:product?.image ? new URL(product.image,siteUrl).href : `${siteUrl}/logo.png`, locale:lang==='EN'?'en_US':lang==='KZ'?'kk_KZ':'ru_RU' };
}
