import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, useSiteData, backendEnabled } from '../SiteData';
import useLanguage from '../useLanguage';
import './Management.css';
import { localizeError } from '../translations';
import { LogIn, ShieldCheck } from 'lucide-react';

const emptyProduct = () => ({ title:'',titleKz:'',titleEn:'',compositionRu:'',compositionKz:'',compositionEn:'',weight:'',image:'',badge:'',nutrition:{proteins:'',fats:'',carbs:'',calories:'',kJ:''},storage:{temp:'от -1°С до +4°С',humidity:'не более 85%',shelfLife:''} });
export default function AdminPage() {
 const { products, user, setUser, loading, error: dataError, refresh } = useSiteData();
 const lang = useLanguage(); const t = (ru,kz,en) => lang === 'EN' ? en : lang === 'KZ' ? kz : ru;
 const location = useLocation(); const navigate = useNavigate();
 const [draft,setDraft] = useState(() => location.pathname === '/admin/new' ? emptyProduct() : null); const [error,setError] = useState(''); const [notice,setNotice] = useState(''); const [busy,setBusy] = useState(false);
 const field = (key, value, group) => setDraft(prev => group ? {...prev,[group]: {...prev[group],[key]:value}} : {...prev,[key]:value});
 const logout = async () => {
  setBusy(true); setError('');
  try { await api('/logout', {}); setUser(null); navigate('/profile', { replace: true }); }
  catch(e) { setError(e.message); } finally { setBusy(false); }
 };
 const save = async event => {
  event.preventDefault(); setBusy(true); setError(''); setNotice('');
  try { await api(draft.id ? `/products/${draft.id}` : '/products', draft, draft.id ? 'PUT' : 'POST'); await refresh(); setDraft(null); setNotice(t('Товар сохранён', 'Өнім сақталды', 'Product saved')); }
  catch(e) { setError(e.message); } finally { setBusy(false); }
 };
 const remove = async product => {
  if (!window.confirm(t(`Удалить «${product.title}»?`, `«${product.titleKz}» жою керек пе?`, `Delete “${product.titleEn}”?`))) return;
  setBusy(true); setError(''); setNotice('');
  try { await api(`/products/${product.id}`,{},'DELETE'); await refresh(); setNotice(t('Товар удалён', 'Өнім жойылды', 'Product deleted')); if(draft?.id === product.id) setDraft(null); }
  catch(e) {setError(e.message);} finally {setBusy(false);}
 };
 if (!backendEnabled) return <section className="management-page"><h1>{t('Управление товарами доступно локально','Өнімдерді басқару жергілікті нұсқада қолжетімді','Product management is available in the local version')}</h1><Link to="/">{t('На главную','Басты бетке','Home')}</Link></section>;
 if (loading) return <section className="management-page">{t('Загрузка…','Жүктелуде…','Loading…')}</section>;
 if (!user || user.role !== 'admin') return <section className="management-page"><div className="account-panel admin-access-panel"><ShieldCheck className="admin-access-icon" size={36} aria-hidden="true" /><h1>{t('Доступ для администратора','Әкімшіге қолжетімді','Administrator access')}</h1><p>{t('Войдите в аккаунт владельца, чтобы управлять каталогом.','Каталогты басқару үшін иесінің аккаунтына кіріңіз.','Sign in to the owner account to manage the catalog.')}</p>{dataError && <p role="alert">{dataError}</p>}<Link to="/profile" className="management-primary"><LogIn size={20} aria-hidden="true" />{t('Войти в профиль','Жеке кабинетке кіру','Sign in')}</Link></div></section>;
 const textFields=[['title','Название RU','Атауы RU','Name RU'],['titleKz','Название KZ','Атауы KZ','Name KZ'],['titleEn','Название EN','Атауы EN','Name EN'],['weight','Вес (например, 500 г)','Салмағы (мысалы, 500 г)','Weight (e.g. 500 г)'],['image','Фото: /products/photo.jpg или HTTPS-ссылка','Фото: /products/photo.jpg немесе HTTPS-сілтеме','Image: /products/photo.jpg or HTTPS URL']];
 return <section className="management-page admin-page">
  <Link className="back-link" to="/profile">← {t('Мой профиль','Жеке кабинет','My account')}</Link>
  <div className="management-heading"><div><h1>{t('База товаров','Өнімдер базасы','Product database')}</h1><p>{t('Общая база','Ортақ база','Shared database')} · {products.length} {t('товаров','өнім','products')}</p></div><div className="management-actions"><button className="management-primary" disabled={busy} onClick={()=>{setDraft(emptyProduct());setError('');setNotice('');}}>{t('+ Добавить товар','+ Өнім қосу','+ Add product')}</button><button className="management-secondary" disabled={busy} onClick={logout}>{t('Выйти из аккаунта','Аккаунттан шығу','Sign out')}</button></div></div>
  <p>{t('Добавьте название и состав на трёх языках. Укажите путь к фотографии из папки public/products или HTTPS-ссылку. Изменения сразу появятся в каталоге.','Атауы мен құрамын үш тілде толтырыңыз. public/products папкасындағы фотоның жолын немесе HTTPS-сілтемені көрсетіңіз. Өзгерістер каталогта бірден көрсетіледі.','Enter the name and ingredients in all three languages. Use an image from public/products or an HTTPS URL. Saved changes appear immediately in the catalog.')}</p>
  {(error || dataError) && <p className="form-error" role="alert">{error ? localizeError(error, lang) : dataError}</p>}{notice && <p className="form-success" role="status">{notice}</p>}
  {draft && <form className="product-editor" onSubmit={save}><h2>{draft.id ? t('Редактирование товара','Өнімді өңдеу','Edit product') : t('Новый товар','Жаңа өнім','New product')}</h2><div className="editor-grid">
   {textFields.map(([key,...labels])=><label key={key}>{t(...labels)}<input required value={draft[key]} onChange={e=>field(key,e.target.value)} /></label>)}
   <label>{t('Плашка','Белгі','Badge')}<select value={draft.badge || ''} onChange={e=>field('badge',e.target.value)}><option value="">{t('Без плашки','Белгісіз','None')}</option>{[['ОСТРОЕ','Острое','Ащы','Spicy'],['ХИТ','Хит','Хит','Bestseller'],['НОВИНКА','Новинка','Жаңа','New'],['АКЦИЯ','Акция','Акция','Sale']].map(([value,...labels])=><option key={value} value={value}>{t(...labels)}</option>)}</select></label>
   {['Ru','Kz','En'].map(code=><label key={code}>{t('Состав','Құрамы','Ingredients')} {code.toUpperCase()}<textarea required value={draft[`composition${code}`]} onChange={e=>field(`composition${code}`,e.target.value)} /></label>)}
  </div><h3>{t('Пищевая ценность на 100 г','100 г тағамдық құндылығы','Nutrition per 100 g')}</h3><div className="editor-grid">
   {[['proteins','Белки, г','Ақуыздар, г','Protein, g'],['fats','Жиры, г','Майлар, г','Fat, g'],['carbs','Углеводы, г','Көмірсулар, г','Carbohydrates, g'],['calories','Энергия, ккал','Энергия, ккал','Energy, kcal'],['kJ','Энергия, кДж','Энергия, кДж','Energy, kJ']].map(([key,...labels])=><label key={key}>{t(...labels)}<input required placeholder={key==='calories'?'72 ккал':key==='kJ'?'301 кДж':'1,1 г'} value={draft.nutrition[key]} onChange={e=>field(key,e.target.value,'nutrition')} /></label>)}
   {[['temp','Температура хранения','Сақтау температурасы','Storage temperature'],['humidity','Влажность','Ылғалдылық','Humidity'],['shelfLife','Срок годности (например, 60 дней)','Жарамдылық мерзімі (мысалы, 60 дней)','Shelf life (e.g. 60 дней)']].map(([key,...labels])=><label key={key}>{t(...labels)}<input required value={draft.storage[key]} onChange={e=>field(key,e.target.value,'storage')} /></label>)}
  </div><div className="management-actions"><button className="management-primary" disabled={busy}>{t('Сохранить','Сақтау','Save')}</button><button className="management-secondary" type="button" disabled={busy} onClick={()=>setDraft(null)}>{t('Отмена','Бас тарту','Cancel')}</button></div></form>}
  <div className="admin-products">{products.map(p=><div className="admin-product" key={p.id}><span>#{p.id} · {lang==='EN'?p.titleEn:lang==='KZ'?p.titleKz:p.title}</span><div className="management-actions"><button disabled={busy} onClick={()=>{setDraft(structuredClone(p));setError('');setNotice('');}}>{t('Изменить','Өңдеу','Edit')}</button><button disabled={busy} onClick={()=>remove(p)}>{t('Удалить','Жою','Delete')}</button></div></div>)}</div>
 </section>;
}
