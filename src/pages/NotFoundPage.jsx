import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import useLanguage from '../useLanguage';
import './Management.css';

export default function NotFoundPage() {
  const lang = useLanguage();
  const t = (ru, kz, en) => lang === 'EN' ? en : lang === 'KZ' ? kz : ru;

  return (
    <section className="management-page">
      <div className="account-panel admin-access-panel">
        <h1>{t('Страница не найдена', 'Бет табылмады', 'Page not found')}</h1>
        <p>{t('Возможно, адрес указан неверно или страница была удалена.', 'Мекенжай қате көрсетілген немесе бет жойылған болуы мүмкін.', 'The address may be incorrect, or the page may have been removed.')}</p>
        <Link to="/" className="management-primary">
          <Home size={20} aria-hidden="true" />
          {t('На главную', 'Басты бетке', 'Home')}
        </Link>
      </div>
    </section>
  );
}
