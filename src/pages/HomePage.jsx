import productsData from '../data/products.json';
import ProductCard from '../components/ProductCard';
import { ChevronLeft, ChevronRight, Leaf, Award, Apple, Store, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const partners = [
    'МАГНУМ',
    'METRO',
    'РАМСТОР',
    'INTERFOOD',
    'SMALL'
  ];

  return (
    <main className="main-container">
      {/* 1. БАННЕР HERO */}
      <section className="hero-banner">
        <div className="hero-center-content">
          <h1 className="hero-main-title">
            ВОЗРОЖДАЯ ЗАБЫТЫЕ<br />ТРАДИЦИИ ВКУСА
          </h1>
          <p className="hero-subtext">
            Настоящие домашние соленья<br />из свежайших овощей
          </p>
          <a href="#catalog" className="btn-to-catalog">
            В КАТАЛОГ
          </a>
        </div>
      </section>

      {/* 2. КРУГЛАЯ ПЛАШКА С КАПУСТОЙ НА СТЫКЕ */}
      <div className="middle-badge-overlap">
        <div className="farmer-badge-icon">
          <img src="/cabbage.png" alt="Капуста" className="farmer-badge-img" />
        </div>
      </div>

      {/* 3. СЕКЦИЯ КАТАЛОГА */}
      <section id="catalog" className="catalog-section">
        <div className="catalog-container">
          <div className="catalog-top-bar">
            <h2 className="catalog-heading">Каталог товаров</h2>
            <div className="catalog-line"></div>
            <div className="slider-arrows">
              <button className="arrow-btn disabled"><ChevronLeft size={18} /></button>
              <button className="arrow-btn active"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="products-grid">
            {productsData.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. СЕКЦИЯ "О КОМПАНИИ" */}
      <section id="about" className="about-section">
        <div className="about-container">
          
          <div className="about-header-bar">
            <h2 className="about-heading">О компании</h2>
            <div className="about-line"></div>
          </div>

          <div className="about-hero-card">
            <p className="about-intro-text">
              Казахстанская производственно-торговая компания <strong>ТОО «LVR ASIA»</strong> под торговой маркой <strong>«Солёныч»</strong> специализируется на производстве натуральной солёно-квашеной продукции.
            </p>
            <p className="about-body-text">
              При изготовлении мы строго придерживаемся старинных, исконно традиционных рецептур производства солёных, квашеных и мочёных овощей. Используем исключительно естественные консерванты (соль, сахар), а также отборные природные приправы и специи.
            </p>
            
            <div className="about-highlight-box">
              <Award className="highlight-icon" size={24} />
              <span>
                Товарный знак <strong>«Солёныч»</strong> — это гарантия вкуса и высокого качества без химических и биологических добавок.
              </span>
            </div>
          </div>

          {/* Блок Партнёры */}
          <div className="partners-block">
            <div className="about-header-bar">
              <h3 className="about-subheading">Наши партнёры</h3>
              <div className="about-line"></div>
            </div>
            
            <p className="partners-subtext">
              Широкий ассортимент нашей продукции вы можете встретить как в небольших магазинах у дома, так и в крупнейших торговых сетях:
            </p>

            <div className="partners-chips">
              {partners.map((partner, index) => (
                <div key={index} className="partner-chip">
                  <Store size={18} className="chip-icon" />
                  <span>{partner}</span>
                </div>
              ))}
              <div className="partner-chip empty-chip">
                <span>и в других магазинах</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. СЕКЦИЯ "НАШИ ПРЕИМУЩЕСТВА" (В самом низу перед подвалом) */}
      <section id="advantages" className="advantages-banner-section">
        <div className="advantages-overlay">
          <h2 className="advantages-main-title">Наши преимущества</h2>
          
          <div className="advantages-grid">
            {/* 1 Преимущество */}
            <div className="adv-card">
              <div className="adv-icon-badge">
                <ShieldCheck size={38} className="adv-icon-green" />
                <span className="badge-text-inner">100%</span>
              </div>
              <h3 className="adv-title">ПРОДУКЦИЯ ПРЕМИУМ КАЧЕСТВА</h3>
              <p className="adv-desc">
                Используя естественные консерванты, природные приправы и специи
              </p>
            </div>

            {/* 2 Преимущество */}
            <div className="adv-card">
              <div className="adv-icon-badge circle-badge">
                <Leaf size={38} className="adv-icon-green" />
                <span className="badge-sub-text">100% NATURAL</span>
              </div>
              <h3 className="adv-title">ПОЛНОСТЬЮ НАТУРАЛЬНАЯ</h3>
              <p className="adv-desc">
                Гарантия вкуса и качества без химических и биологических добавок
              </p>
            </div>

            {/* 3 Преимущество */}
            <div className="adv-card">
              <div className="adv-icon-badge leaf-outline">
                <Apple size={36} className="adv-icon-green" />
              </div>
              <h3 className="adv-title">СВЕЖИЕ ОВОЩИ И ФРУКТЫ</h3>
              <p className="adv-desc">
                Прямые поставки овощей и фруктов от фермеров
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}