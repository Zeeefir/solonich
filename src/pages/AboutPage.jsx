import React from 'react';
import { Leaf, Award, Truck, Users, Store } from 'lucide-react';

export default function AboutPage() {
  const partners = [
    'МАГНУМ',
    'METRO',
    'РАМСТОР',
    'INTERFOOD',
    'SMALL'
  ];

  return (
    <main className="main-container">
      <section className="about-section">
        <div className="about-container">
          
          {/* Заголовок с нашей черной полосой */}
          <div className="about-header-bar">
            <h1 className="about-heading">О компании</h1>
            <div className="about-line"></div>
          </div>

          {/* Главный карточный блок */}
          <div className="about-hero-card">
            <p className="about-intro-text">
              Казахстанская производственно-торговая компания <strong>ТОО «LVR ASIA»</strong> под торговой маркой <strong>«Солёныч»</strong> специализируется на производстве натуральной солёно-квашеной продукции.
            </p>
            <p className="about-body-text">
              При изготовлении мы строго придерживаемся старинных, исконно традиционных рецептур производства солёных, квашеных и мочёных овощей. Используем исключительно естественные консерванты (соль, сахар), а также отборные природные приправы и специи.
            </p>
            
            {/* Выделенный блок гарантии качества */}
            <div className="about-highlight-box">
              <Award className="highlight-icon" size={24} />
              <span>
                Товарный знак <strong>«Солёныч»</strong> — это гарантия вкуса и высокого качества без химических и биологических добавок.
              </span>
            </div>
          </div>

          {/* Сетка преимуществ с иконками */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Leaf size={22} />
              </div>
              <h3>100% Натурально</h3>
              <p>Только соль, сахар и природные специи. Без химии и искусственных добавок.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Award size={22} />
              </div>
              <h3>Традиции вкуса</h3>
              <p>Сохраняем старинные рецепты и технологии традиционной домашней засолки.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Truck size={22} />
              </div>
              <h3>Надёжная доставка</h3>
              <p>Оперативное формирование заказов и своевременная доставка покупателям.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Users size={22} />
              </div>
              <h3>Честный подход</h3>
              <p>Высокое качество, доступные цены и гибкие условия для партнёров.</p>
            </div>
          </div>

          {/* Блок партнёров */}
          <div className="partners-block">
            <div className="about-header-bar">
              <h2 className="about-subheading">Наши партнёры</h2>
              <div className="about-line"></div>
            </div>
            
            <p className="partners-subtext">
              Широкий ассортимент продукции «Солёныч» вы можете встретить как в небольших магазинах у дома, так и в крупнейших торговых сетях:
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
    </main>
  );
}