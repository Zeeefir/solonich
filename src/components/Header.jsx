import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const [activeSection, setActiveSection] = useState('catalog');
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  
  const navRef = useRef(null);
  const itemRefs = useRef({});
  const location = useLocation();
  const navigate = useNavigate();

  const isScrollingToSection = useRef(false);
  const isProductPage = location.pathname.startsWith('/product');

  const navItems = [
    { id: 'catalog', label: 'Каталог' },
    { id: 'about', label: 'О компании' },
    { id: 'advantages', label: 'Преимущества' },
    { id: 'contacts', label: 'Где мы находимся' },
  ];

  useEffect(() => {
    if (isProductPage) return;
    const sectionIds = navItems.map((item) => item.id);
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingToSection.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -40% 0px', threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isProductPage]);

  useEffect(() => {
    if (isProductPage) return;
    const activeNode = itemRefs.current[activeSection];
    if (activeNode && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const activeRect = activeNode.getBoundingClientRect();

      setPillStyle({
        left: activeRect.left - navRect.left,
        width: activeRect.width,
      });
    }
  }, [activeSection, isProductPage]);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (isProductPage) {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('catalog');
    }
  };

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setActiveSection(id);
    isScrollingToSection.current = true;

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        isScrollingToSection.current = false;
      }, 800);
    }
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="/" onClick={handleLogoClick} className="logo-wrapper" aria-label="На главную">
          <img src="/logo.png" alt="Солёныч" className="logo-img" />
        </a>

        {isProductPage ? (
          <div className="header-promo-text">
            <Sparkles size={18} color="#c62828" />
            <span>Выбирайте нас:</span> у нас всё из натуральных продуктов!
          </div>
        ) : (
          <nav className="header-nav" ref={navRef}>
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
                className={`nav-item-link ${activeSection === item.id ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {/* Кнопки Instagram и WhatsApp с надежными SVG-иконками */}
        <div className="header-right">
          <a
            href="https://www.instagram.com/solenich.kz?stkn=MXhiZ290eDZnN2xoOQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="social-header-btn instagram-header-btn"
            title="Перейти в Instagram"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span className="social-btn-text">Instagram</span>
          </a>

          <a
            href="https://wa.me/77079903960"
            target="_blank"
            rel="noopener noreferrer"
            className="social-header-btn whatsapp-header-btn"
            title="Написать в WhatsApp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <span className="social-btn-text">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
}