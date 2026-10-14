import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, useSiteData } from '../SiteData';
import useLanguage from '../useLanguage';
import './Management.css';

export default function ProfilePage() {
 const {user,setUser}=useSiteData(); const navigate=useNavigate(); const lang=useLanguage();
 const t=(ru,kz,en)=>lang==='EN'?en:lang==='KZ'?kz:ru;
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const submit=async e=>{e.preventDefault();setBusy(true);setError('');try{const result=await api('/login',Object.fromEntries(new FormData(e.currentTarget)));if(result.user?.role!=='admin'){await api('/logout',{});setUser(null);throw new Error('Access denied');}setUser(result.user);navigate('/admin');}catch{setError(t('Вход доступен только администраторам. Проверьте email и пароль.','Кіру тек әкімшілерге қолжетімді. Email мен құпиясөзді тексеріңіз.','Administrator access only. Check your email and password.'));}finally{setBusy(false);}};
 const logout=async()=>{setBusy(true);try{await api('/logout',{});setUser(null);}finally{setBusy(false);}};
 return <section className="management-page"><Link to="/" className="back-link">← {t('На главную','Басты бетке','Home')}</Link><div className="account-panel"><h1>{t('Вход администратора','Әкімшінің кіруі','Administrator sign in')}</h1>{error&&<p className="form-error" role="alert">{error}</p>}{user?.role==='admin'?<><p>{user.email}</p><Link className="management-primary" to="/admin">{t('Управление каталогом','Каталогты басқару','Manage catalog')}</Link><button className="management-secondary" disabled={busy} onClick={logout}>{t('Выйти','Шығу','Sign out')}</button></>:<form onSubmit={submit}><label>Email<input name="email" type="email" required autoComplete="username"/></label><label>{t('Пароль','Құпиясөз','Password')}<input name="password" type="password" required autoComplete="current-password"/></label><button className="management-primary" disabled={busy}>{t('Войти','Кіру','Sign in')}</button></form>}</div></section>;
}
