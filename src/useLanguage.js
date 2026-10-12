import { useEffect, useState } from 'react';

export default function useLanguage() {
  const readLanguage = () => ['RU', 'KZ', 'EN'].includes(localStorage.getItem('app_lang')) ? localStorage.getItem('app_lang') : 'RU';
  const [lang, setLang] = useState(readLanguage);
  useEffect(() => {
    const update = () => setLang(readLanguage());
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang === 'KZ' ? 'kk' : lang === 'EN' ? 'en' : 'ru';
  }, [lang]);
  return lang;
}
