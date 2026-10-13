import useLanguage from '../useLanguage';
import { getActiveSection } from '../activeSection.mjs';
import { useState, useEffect, useRef } from 'react';
import { Sparkles, Globe, ChevronDown, Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const [activeSection, setActiveSection] = useState('catalog');
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  
  const lang = useLanguage();
  
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navRef = useRef(null);
  const itemRefs = useRef({});
  const langDropdownRef = useRef(null);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isScrollingToSection = useRef(false);
  const isProductPage = location.pathname !== '/';

  const navItems = [
    { id: 'catalog', label: lang === 'EN' ? "Catalog" : lang === 'RU' ? 'Каталог' : 'Каталог' },
    { id: 'about', label: lang === 'EN' ? "About us" : lang === 'RU' ? 'О компании' : 'Компания туралы' },
    { id: 'advantages', label: lang === 'EN' ? "Why choose us" : lang === 'RU' ? 'Преимущества' : 'Артықшылықтар' },
    { id: 'contacts', label: lang === 'EN' ? "Find us" : lang === 'RU' ? 'Где мы находимся' : 'Біздің мекенжай' },
  ];

  const selectLanguage = (selectedLang) => {
    try { localStorage.setItem('app_lang', selectedLang); } catch { /* Language remains usable when browser storage is blocked. */ }
    setIsLangOpen(false);
    // Отправляем событие, чтобы шапка мгновенно обновилась без перезагрузки
    window.dispatchEvent(new CustomEvent('languagechange', { detail: selectedLang }));
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsLangOpen(false);
        setIsMenuOpen(false);
        if (isMenuOpen) menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isProductPage) return;
    const sectionIds = ['catalog', 'about', 'advantages', 'contacts'];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    let frame = 0;
    const updateSection = () => {
      frame = 0;
      if (isScrollingToSection.current) return;
      const marker = Math.max(100, window.innerHeight * 0.25);
      setActiveSection(getActiveSection(sections.map(section => ({ id: section.id, top: section.getBoundingClientRect().top })), marker));
    };
    const scheduleUpdate = () => { if (!frame) frame = requestAnimationFrame(updateSection); };
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    scheduleUpdate();
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [isProductPage, lang]);

  useEffect(() => {
    if (isProductPage) return;
    const updatePill = () => {
      const activeNode = itemRefs.current[activeSection];
      if (!activeNode || !navRef.current) return;
      const navRect = navRef.current.getBoundingClientRect();
      const activeRect = activeNode.getBoundingClientRect();

      setPillStyle({
        left: activeRect.left - navRect.left,
        width: activeRect.width,
      });
    };
    updatePill();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(updatePill) : null;
    if (navRef.current) observer?.observe(navRef.current);
    window.addEventListener('resize', updatePill);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updatePill);
    };
  }, [activeSection, isProductPage, lang, isMenuOpen]);

  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (isProductPage) {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      setActiveSection('catalog');
    }
  };

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setActiveSection(id);
    isScrollingToSection.current = true;

    const element = document.getElementById(id);
    if (element) {
      requestAnimationFrame(() => element.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
      setTimeout(() => {
        isScrollingToSection.current = false;
      }, 800);
    }
  };

  return (
    <header ref={headerRef} className={`site-header${isMenuOpen ? ' is-menu-open' : ''}${isProductPage ? ' is-product-page' : ''}`}>
      <div className="header-inner">
        <a href="/" onClick={handleLogoClick} className="logo-wrapper" aria-label={lang === 'EN' ? "Home" : lang === 'RU' ? 'На главную' : 'Басты бетке'}>
          <img src="/logo.png" alt="Солёныч" className="logo-img" />
        </a>

        {isProductPage ? (
          <div className="header-promo-text">
            <Sparkles size={18} color="#c62828" />
            <span>{lang === 'EN' ? "Choose us:" : lang === 'RU' ? 'Выбирайте нас:' : 'Бізді таңдаңыз:'}</span> {lang === 'EN' ? "made with natural ingredients!" : lang === 'RU' ? 'у нас всё из натуральных продуктов!' : 'бәрі табиғи өнімдерден!'}
          </div>
        ) : (
          <nav id="main-navigation" className="header-nav" ref={navRef} aria-label={lang === 'EN' ? "Main navigation" : lang === 'RU' ? 'Основное меню' : 'Негізгі мәзір'}>
            <div
              className="pill-bg-indicator"
              style={{
                transform: `translateX(${pillStyle.left}px)`,
                width: `${pillStyle.width}px`,
              }}
            />

            {navItems.map((item) => (
              <a
                key={item.id}
                ref={(el) => (itemRefs.current[item.id] = el)}
                href={`/#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                aria-current={activeSection === item.id ? 'location' : undefined}
                className={`nav-item-link ${activeSection === item.id ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <div className="header-right-group">
          <div className="lang-dropdown-container" ref={langDropdownRef}>
            <button 
              className="lang-dropdown-btn"
              aria-expanded={isLangOpen}
              aria-controls="language-options"
              onClick={() => setIsLangOpen(!isLangOpen)}
              title={lang === 'EN' ? "Choose language" : lang === 'RU' ? 'Выбрать язык' : 'Тілді таңдау'}
            >
              <Globe size={18} className="lang-globe-icon" />
              <span className="lang-current-text">{lang}</span>
              <ChevronDown size={14} className={`lang-chevron ${isLangOpen ? 'open' : ''}`} />
            </button>

            {isLangOpen && (
              <div id="language-options" className="lang-dropdown-menu">
                <button 
                  className={`lang-option ${lang === 'RU' ? 'active' : ''}`}
                  onClick={() => selectLanguage('RU')}
                >
                  Русский (RU)
                </button>
                <button 
                  className={`lang-option ${lang === 'KZ' ? 'active' : ''}`}
                  onClick={() => selectLanguage('KZ')}
                >
                  Қазақша (KZ)
                </button>
                <button className={`lang-option ${lang === 'EN' ? 'active' : ''}`} onClick={() => selectLanguage('EN')}>English (EN)</button>
              </div>
            )}
          </div>

          <div className="header-right">
            <a
              href="https://www.instagram.com/solenich.kz?stkn=MXhiZ290eDZnN2xoOQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="social-header-btn instagram-header-btn"
              title={lang === 'EN' ? "Visit Instagram" : lang === 'RU' ? 'Перейти в Instagram' : 'Instagram-ға өту'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span className="social-btn-text">Instagram</span>
            </a>

            <a
              href="https://api.whatsapp.com/send?phone=77079903960"
              target="_blank"
              rel="noopener noreferrer"
              className="social-header-btn whatsapp-header-btn"
              title={lang === 'EN' ? "Message us on WhatsApp" : lang === 'RU' ? 'Написать в WhatsApp' : 'WhatsApp-та жазу'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span className="social-btn-text">WhatsApp</span>
            </a>
          </div>
        </div>
        {!isProductPage && (
          <button
            ref={menuButtonRef}
            type="button"
            className="mobile-menu-toggle"
            aria-label={lang === 'EN' ? (isMenuOpen ? 'Close menu' : 'Open menu') : lang === 'RU' ? (isMenuOpen ? 'Закрыть меню' : 'Открыть меню') : (isMenuOpen ? 'Мәзірді жабу' : 'Мәзірді ашу')}
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation"
            onClick={() => { setIsMenuOpen(!isMenuOpen); setIsLangOpen(false); }}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </div>
    </header>
  );
}
