import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useLanguage from '../useLanguage';
import { api, useSiteData, backendEnabled } from '../SiteData';
import './Management.css';
import { localizeError } from '../translations';
import { cloudEnabled } from '../cloud';
import Reviews from '../components/Reviews';

export default function ProfilePage() {
  const lang = useLanguage();
  const t = (ru, kz, en) => lang === 'EN' ? en : lang === 'KZ' ? kz : ru;
  const { user, setUser } = useSiteData();
  const navigate = useNavigate();
  const location = useLocation();
  const setup = location.pathname === '/setup';
  const [register, setRegister] = useState(false);
  const [needed, setNeeded] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [pendingEmail,setPendingEmail] = useState('');
  const [resendWait,setResendWait] = useState(0);
  useEffect(()=>{if(!resendWait)return;const timer=setTimeout(()=>setResendWait(resendWait-1),1000);return()=>clearTimeout(timer);},[resendWait]);
  useEffect(() => { if (setup && backendEnabled) api('/setup').then(x => setNeeded(x.needed)).catch(() => setError('Failed to fetch')); }, [setup, lang]);
  const submit = async event => {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      const input = Object.fromEntries(new FormData(event.currentTarget));
      const result = await api(setup ? '/setup' : register ? '/register' : '/login', input);
      if (result.confirmationRequired) { setPendingEmail(input.email); setResendWait(60); setNotice(t('Введите 6-значный код из письма.', 'Хаттағы 6 таңбалы кодты енгізіңіз.', 'Enter the 6-digit code from your email.')); return; }
      setUser(result.user); navigate(result.user.role === 'admin' ? '/admin' : '/profile');
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  const logout = async () => { setError(''); try { await api('/logout', {}); setUser(null); } catch(e) { setError(e.message); } };
  const verify = async event => {event.preventDefault();setBusy(true);setError('');try{const code=new FormData(event.currentTarget).get('code');const result=await api('/verify',{email:pendingEmail,code});setUser(result.user);setPendingEmail('');setNotice('');navigate('/profile');}catch{setError('Invalid verification code');}finally{setBusy(false);}};
  const resend = async()=>{setBusy(true);try{await api('/resend',{email:pendingEmail});setResendWait(60);}catch{setError('Failed to send email');}finally{setBusy(false);}};
  if (!backendEnabled) return <section className="management-page"><h1>{t('Профиль работает в локальной версии', 'Жеке кабинет жергілікті нұсқада жұмыс істейді', 'Accounts are available in the local version')}</h1><Link to="/">{t('На главную', 'Басты бетке', 'Home')}</Link></section>;
  return <section className="management-page">
    <Link to="/" className="back-link">← {t('На главную', 'Басты бетке', 'Home')}</Link>
    <div className="account-panel">
      <h1>{setup ? t('Создать администратора', 'Әкімші құру', 'Create administrator') : t('Личный кабинет', 'Жеке кабинет', 'My account')}</h1>
      {error && <p className="form-error" role="alert">{localizeError(error, lang)}</p>}
      {notice && <p className="form-success" role="status">{notice}</p>}
      {pendingEmail ? <><p>{pendingEmail}</p><form onSubmit={verify}><label>{t('Код подтверждения','Растау коды','Verification code')}<input name="code" required pattern="[0-9]{6}" minLength={6} maxLength={6} inputMode="numeric" autoComplete="one-time-code"/></label><button className="management-primary" disabled={busy}>{t('Подтвердить почту','Email растау','Confirm email')}</button></form><button className="management-secondary" disabled={busy||resendWait>0} onClick={resend}>{resendWait?resendWait+' сек':t('Отправить код снова','Кодты қайта жіберу','Resend code')}</button><button className="management-secondary" onClick={()=>setPendingEmail('')}>{t('Назад','Артқа','Back')}</button></> : user && !setup ? <>
        <p>{user.name}</p><p>{user.email}</p>
        <p>{user.role === 'admin' ? t('Администратор', 'Әкімші', 'Administrator') : t('Покупатель', 'Сатып алушы', 'Customer')}</p>
        {user.role === 'admin' && <Link className="management-primary" to="/admin">{t('Админ-панель', 'Әкімші панелі', 'Admin panel')}</Link>}
        <button className="management-secondary" onClick={logout}>{t('Выйти', 'Шығу', 'Sign out')}</button>
      </> : setup && needed === false ? <p>{t('Администратор уже создан. Войдите в профиль.', 'Әкімші бұрын құрылған. Жеке кабинетке кіріңіз.', 'Administrator is already configured. Sign in to your account.')} <Link to="/profile">{t('Войти', 'Кіру', 'Sign in')}</Link></p> : <>
        {setup && <p>{t('Код настройки находится в файле data/admin-setup-code.txt на вашем компьютере. После создания администратора код будет удалён.', 'Баптау коды компьютердегі data/admin-setup-code.txt файлында. Әкімші құрылғаннан кейін код жойылады.', 'Find the setup code in data/admin-setup-code.txt on your computer. It is removed after administrator creation.')}</p>}
        <form onSubmit={submit}>
          {(register || setup) && <label>{t('Имя', 'Аты', 'Name')}<input name="name" required maxLength={80} autoComplete="name" /></label>}
          <label>Email<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
          <label>{t('Пароль', 'Құпиясөз', 'Password')}<input name="password" type="password" required minLength={register&&cloudEnabled?6:register||setup?10:1} maxLength={register&&cloudEnabled?6:128} pattern={register&&cloudEnabled?'(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{6}':undefined} autoComplete={register || setup ? 'new-password' : 'current-password'} /></label>
          {(register || setup) && <small>{cloudEnabled?t('6 символов: цифра, большая и маленькая английские буквы.','6 таңба: сан, ағылшынша бас және кіші әріптер.','6 characters: a digit, uppercase and lowercase English letters.'):t('Не менее 10 символов', 'Кемінде 10 таңба', 'At least 10 characters')}</small>}
          {setup && <label>{t('Код настройки', 'Баптау коды', 'Setup code')}<input name="setupCode" required autoComplete="off" /></label>}
          <button className="management-primary" disabled={busy || (setup && needed !== true)}>{busy ? t('Подождите…', 'Күтіңіз…', 'Please wait…') : setup ? t('Создать администратора', 'Әкімші құру', 'Create administrator') : register ? t('Зарегистрироваться', 'Тіркелу', 'Create account') : t('Войти', 'Кіру', 'Sign in')}</button>
        </form>
        {!setup && <button className="management-secondary" onClick={() => {setRegister(!register); setError('');}}>{register ? t('Уже есть аккаунт? Войти', 'Аккаунт бар ма? Кіру', 'Already registered? Sign in') : t('Нет аккаунта? Регистрация', 'Аккаунт жоқ па? Тіркелу', 'New here? Create an account')}</button>}
      </>}
    </div>
    {user&&cloudEnabled&&<Reviews mine />}
  </section>;
}
