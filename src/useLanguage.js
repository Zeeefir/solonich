import { useEffect, useState } from 'react';

export default function useLanguage() {
  const readLanguage = () => {
    try { const value = localStorage.getItem('app_lang'); return ['RU','KZ','EN'].includes(value) ? value : 'RU'; }
    catch { return 'RU'; }
  };
  const [lang, setLang] = useState(readLanguage);
  useEffect(() => {
    const update = () => setLang(readLanguage());
    window.addEventListener('storage', update);
    const select = event => { if (['RU','KZ','EN'].includes(event.detail)) setLang(event.detail); };
    window.addEventListener('languagechange', select);
    return () => { window.removeEventListener('storage', update); window.removeEventListener('languagechange', select); };
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang === 'KZ' ? 'kk' : lang === 'EN' ? 'en' : 'ru';
  }, [lang]);
  return lang;
}
