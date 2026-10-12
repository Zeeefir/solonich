import useLanguage from '../useLanguage';

import { Leaf, Award, Truck, Users, Store } from 'lucide-react';

export default function AboutPage() {
  const isRu = useLanguage() === 'RU';
  const partners = [
    'МАГНУМ',
    'ADK',
    'TOIMART',
    'GRAND PARK'
  ];

  return (
    <main className="main-container">
      <section className="about-section">
        <div className="about-container">
          
          {/* Заголовок с нашей черной полосой */}
          <div className="about-header-bar">
            <h1 className="about-heading">{isRu ? "о компании" : "компания туралы"}</h1>
            <div className="about-line"></div>
          </div>

          {/* Главный карточный блок */}
          <div className="about-hero-card">
            <p className="about-intro-text">
              {isRu ? <>Казахстанская производственно-торговая компания <strong>ТОО «LVR Asia»</strong> под торговой маркой <strong>«Солёныч»</strong> специализируется на производстве натуральной солёно-квашеной продукции.</> : <>Қазақстандық өндірістік-сауда компаниясы <strong>«LVR Asia» ЖШС</strong> <strong>«Солёныч»</strong> сауда маркасымен табиғи тұздалған және ашытылған өнімдер өндіруге маманданған.</>}
            </p>
            <p className="about-body-text">
              {isRu ? "При изготовлении мы строго придерживаемся старинных, исконно традиционных рецептур производства солёных, квашеных и мочёных овощей. Используем исключительно естественные консерванты (соль, сахар), а также отборные природные приправы и специи." : "Өнім дайындауда тұздалған, ашытылған және тұздыққа салынған көкөністердің ежелгі дәстүрлі рецептерін қатаң сақтаймыз. Тек табиғи консерванттарды (тұз, қант), сондай-ақ іріктелген табиғи дәмдеуіштерді пайдаланамыз."}
            </p>
            
            {/* Выделенный блок гарантии качества */}
            <div className="about-highlight-box">
              <Award className="highlight-icon" size={24} />
              <span>
                {isRu ? <>Товарный знак <strong>«Солёныч»</strong> — это гарантия вкуса и высокого качества без химических и биологических добавок.</> : <><strong>«Солёныч»</strong> сауда белгісі — химиялық және биологиялық қоспаларсыз дәм мен жоғары сапаның кепілі.</>}
              </span>
            </div>
          </div>

          {/* Сетка преимуществ с иконками */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Leaf size={22} />
              </div>
              <h3>{isRu ? "100% Натурально" : "100% Табиғи"}</h3>
              <p>{isRu ? "Только соль, сахар и природные специи. Без химии и искусственных добавок." : "Тек тұз, қант және табиғи дәмдеуіштер. Химиялық және жасанды қоспаларсыз."}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Award size={22} />
              </div>
              <h3>{isRu ? "Традиции вкуса" : "Дәм дәстүрлері"}</h3>
              <p>{isRu ? "Сохраняем старинные рецепты и технологии традиционной домашней засолки." : "Үй жағдайында тұздаудың ежелгі рецептері мен дәстүрлі технологияларын сақтаймыз."}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Truck size={22} />
              </div>
              <h3>{isRu ? "Надёжная доставка" : "Сенімді жеткізу"}</h3>
              <p>{isRu ? "Оперативное формирование заказов и своевременная доставка покупателям." : "Тапсырыстарды жедел дайындап, сатып алушыларға уақтылы жеткіземіз."}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Users size={22} />
              </div>
              <h3>{isRu ? "Честный подход" : "Адал ұстаным"}</h3>
              <p>{isRu ? "Высокое качество, доступные цены и гибкие условия для партнёров." : "Жоғары сапа, қолжетімді бағалар және серіктестерге икемді шарттар."}</p>
            </div>
          </div>

          {/* Блок партнёров */}
          <div className="partners-block">
            <div className="about-header-bar">
              <h2 className="about-subheading">{isRu ? "Наши партнёры" : "Біздің серіктестеріміз"}</h2>
              <div className="about-line"></div>
            </div>
            
            <p className="partners-subtext">
              {isRu ? "Широкий ассортимент продукции «Солёныч» вы можете встретить как в небольших магазинах у дома, так и в крупнейших торговых сетях:" : "«Солёныч» өнімдерінің кең ассортиментін үй маңындағы шағын дүкендерден де, ірі сауда желілерінен де таба аласыз:"}
            </p>

            <div className="partners-chips">
              {partners.map((partner, index) => (
                <div key={index} className="partner-chip">
                  <Store size={18} className="chip-icon" />
                  <span>{partner}</span>
                </div>
              ))}
              <div className="partner-chip empty-chip">
                <span>{isRu ? "и в других магазинах" : "және басқа дүкендерде"}</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
