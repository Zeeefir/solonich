import useLanguage from '../useLanguage';
import { useSiteData } from '../SiteData';
import ProductCard from '../components/ProductCard';
import { Leaf, Award, Apple, Store, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const lang = useLanguage();
  const isRu = lang === 'RU';
  const { products: productsData, loading, error } = useSiteData();
  const partners = [
    lang === 'EN' ? 'MAGNUM' : 'МАГНУМ',
    'ADK',
    'TOIMART',
    'GRAND PARK',
  ];

  return (
    <main className="main-container">
      {/* 1. БАННЕР HERO */}
      <section className="hero-banner">
        <div className="hero-center-content">
          <div className="anniversary-badge"><span className="anniversary-star" aria-hidden="true">✦</span><span className="anniversary-number">10</span><span className="anniversary-years">{lang === 'EN' ? 'YEARS' : isRu ? 'ЛЕТ' : 'ЖЫЛ'}<small>{lang === 'EN' ? 'TOGETHER' : isRu ? 'ВМЕСТЕ С ВАМИ' : 'СІЗДЕРМЕН БІРГЕ'}</small></span><span className="anniversary-star" aria-hidden="true">✦</span></div>
          <h1 className="hero-main-title">
            {lang === 'EN' ? <>REVIVING TIME-HONOURED<br />FLAVOURS</> : isRu ? <>ВОЗРОЖДАЯ ЗАБЫТЫЕ<br />ТРАДИЦИИ ВКУСА</> : <>ҰМЫТЫЛҒАН ДӘМ<br />ДӘСТҮРЛЕРІН ЖАҢҒЫРТАМЫЗ</>}
          </h1>
          <p className="hero-subtext">
            {lang === 'EN' ? <>Traditional homemade pickles<br />made with fresh vegetables</> : isRu ? <>Настоящие домашние соленья<br />из свежайших овощей</> : <>Балғын көкөністерден<br />үйдегідей дайындалған тұздалған өнімдер</>}
          </p>
          <p className="anniversary-caption">{lang === 'EN' ? '10 years of flavour and tradition — thank you for being with us!' : isRu ? '10 лет вкуса и традиций — спасибо, что вы с нами!' : '10 жылдық дәм мен дәстүр — бізбен бірге болғандарыңызға рақмет!'}</p>
          <a href="#catalog" className="btn-to-catalog">
            {lang === 'EN' ? "VIEW PRODUCTS" : isRu ? "В КАТАЛОГ" : "КАТАЛОГҚА"}
          </a>
        </div>
      </section>

      {/* 2. КРУГЛАЯ ПЛАШКА С КАПУСТОЙ НА СТЫКЕ */}
      <div className="middle-badge-overlap">
        <div className="farmer-badge-icon">
          <img src="/cabbage.png" alt={lang === 'EN' ? "Cabbage" : isRu ? "Капуста" : "Қырыққабат"} className="farmer-badge-img" />
        </div>
      </div>

      {/* 3. СЕКЦИЯ КАТАЛОГА */}
      <div className="shared-grid-background">
      <section id="catalog" className="catalog-section">
        <div className="catalog-container">
          <div className="catalog-top-bar">
            <h2 className="catalog-heading">{lang === 'EN' ? "Our products" : isRu ? "Каталог товаров" : "Өнімдер каталогы"}</h2>
            <div className="catalog-line"></div>
          </div>

          <p className="catalog-intro">{lang === 'EN' ? 'Solonich sauerkraut, salted cucumbers, Korean-style carrots, adjika and vegetable salads — made in Almaty. Explore ingredients and nutrition for every product.' : isRu ? 'Квашеная капуста, солёные огурцы, морковь по-корейски, аджика и овощные салаты «Солёныч» — производство в Алматы. Выберите продукт, чтобы узнать состав и пищевую ценность.' : '«Солёныч» ашытылған қырыққабаты, тұздалған қияр, корейше сәбіз, аджика және көкөніс салаттары Алматыда өндіріледі. Өнімнің құрамы мен тағамдық құндылығын қараңыз.'}</p>
          <div className="products-grid">
            {loading && <p>{lang === 'EN' ? 'Loading products…' : isRu ? 'Загрузка товаров…' : 'Өнімдер жүктелуде…'}</p>}
            {error && <p role="alert">{error}</p>}
            {productsData.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. СЕКЦИЯ "О КОМПАНИИ И ПАРТНЕРАХ" */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-grid-columns">
            
            {/* Левая колонка: О компании */}
            <div className="about-card-col">
              <div className="about-header-bar">
                <h2 className="about-heading">{lang === 'EN' ? "About us" : isRu ? "О компании" : "Компания туралы"}</h2>
                <div className="about-line"></div>
              </div>

              <p className="about-intro-text">
                {lang === 'EN' ? <>Kazakhstan-based <strong>LVR Asia LLP</strong> produces natural salted and fermented vegetables under the <strong>Solonich</strong> brand.</> : isRu ? <>Казахстанская производственно-торговая компания <strong>ТОО «LVR Asia»</strong> под торговой маркой <strong>«Солёныч»</strong> специализируется на производстве натуральной солёно-квашеной продукции.</> : <>Қазақстандық өндірістік-сауда компаниясы <strong>«LVR Asia» ЖШС</strong> <strong>«Солёныч»</strong> сауда маркасымен табиғи тұздалған және ашытылған өнімдер өндіруге маманданған.</>}
              </p>
              <p className="about-body-text">
                {lang === 'EN' ? "We follow time-honoured recipes for salted, fermented and brined vegetables. We use natural preservatives (salt and sugar), carefully selected herbs and spices." : isRu ? "При изготовлении мы строго придерживаемся старинных, исконно традиционных рецептур производства солёных, квашеных и мочёных овощей. Используем исключительно естественные консерванты (соль, сахар), а также отборные природные приправы и специи." : "Өнім дайындауда тұздалған, ашытылған және тұздыққа салынған көкөністердің ежелгі дәстүрлі рецептерін қатаң сақтаймыз. Тек табиғи консерванттарды (тұз, қант), сондай-ақ іріктелген табиғи дәмдеуіштерді пайдаланамыз."}
              </p>
            </div>

            {/* Правая колонка: Наши партнёры */}
            <div className="about-card-col partners-col">
              <div className="about-header-bar">
                <h2 className="about-heading">{lang === 'EN' ? "Our partners" : isRu ? "Наши партнёры" : "Біздің серіктестеріміз"}</h2>
                <div className="about-line"></div>
              </div>
              
              <p className="partners-subtext">
                {lang === 'EN' ? "Find our wide range of products in local neighbourhood shops and major retail chains:" : isRu ? "Широкий ассортимент нашей продукции вы можете встретить как в небольших магазинах у дома, так и в крупнейших торговых сетях:" : "Өнімдеріміздің кең ассортиментін үй маңындағы шағын дүкендерден де, ірі сауда желілерінен де таба аласыз:"}
              </p>

              <div className="partners-chips">
                {partners.map((partner, index) => (
                  <div key={index} className="partner-chip">
                    <Store size={18} className="chip-icon" />
                    <span>{partner}</span>
                  </div>
                ))}
                <div className="partner-chip empty-chip">
                  <span>{lang === 'EN' ? "and other stores" : isRu ? "и в других магазинах" : "және басқа дүкендерде"}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Плашка на всю ширину внизу блока */}
          <div className="about-highlight-box full-width-highlight">
            <Award className="highlight-icon" size={26} />
            <span>
              {lang === 'EN' ? <>The <strong>Solonich</strong> brand stands for flavour and quality without chemical or biological additives.</> : isRu ? <>Товарный знак <strong>«Солёныч»</strong> — это гарантия вкуса и высокого качества без химических и биологических добавок.</> : <><strong>«Солёныч»</strong> сауда белгісі — химиялық және биологиялық қоспаларсыз дәм мен жоғары сапаның кепілі.</>}
            </span>
          </div>
        </div>
      </section>

      </div>

      {/* 5. СЕКЦИЯ "НАШИ ПРЕИМУЩЕСТВА" (4 ПЛАШКИ) */}
      <section id="advantages" className="advantages-banner-section">
        <div className="advantages-overlay">
          <h2 className="advantages-main-title">{lang === 'EN' ? "Why choose us" : isRu ? "Наши преимущества" : "Біздің артықшылықтарымыз"}</h2>
          
          <div className="advantages-grid">
            
            {/* Новая 4-я плашка */}
            <div className="adv-card">
              <div className="adv-icon-badge">
                <Award size={38} className="adv-icon-green" />
              </div>
              <h3 className="adv-title">{lang === 'EN' ? "10 YEARS IN KAZAKHSTAN" : isRu ? "10 ЛЕТ НА РЫНКЕ КАЗАХСТАНА" : "ҚАЗАҚСТАН НАРЫҒЫНДА 10 ЖЫЛ"}</h3>
              <p className="adv-desc">
                {lang === 'EN' ? "Years of experience making quality products you love" : isRu ? "Многолетний опыт производства качественной и любимой продукции для вас" : "Сіздер үшін сапалы әрі сүйікті өнімдерді өндірудегі көпжылдық тәжірибе"}
              </p>
            </div>

            <div className="adv-card">
              <div className="adv-icon-badge">
                <ShieldCheck size={38} className="adv-icon-green" />
              </div>
              <h3 className="adv-title">{lang === 'EN' ? "PREMIUM QUALITY" : isRu ? "ПРОДУКЦИЯ ПРЕМИУМ КАЧЕСТВА" : "ЖОҒАРЫ САПАЛЫ ӨНІМДЕР"}</h3>
              <p className="adv-desc">
                {lang === 'EN' ? "Made with natural preservatives, herbs and spices" : isRu ? "Используя естественные консерванты, природные приправы и специи" : "Табиғи консерванттар мен дәмдеуіштерді қолданамыз"}
              </p>
            </div>

            <div className="adv-card">
              <div className="adv-icon-badge circle-badge">
                <Leaf size={38} className="adv-icon-green" />
              </div>
              <h3 className="adv-title">{lang === 'EN' ? "ALL NATURAL" : isRu ? "ПОЛНОСТЬЮ НАТУРАЛЬНАЯ" : "ТОЛЫҒЫМЕН ТАБИҒИ"}</h3>
              <p className="adv-desc">
                {lang === 'EN' ? "Taste and quality without chemical or biological additives" : isRu ? "Гарантия вкуса и качества без химических и биологических добавок" : "Химиялық және биологиялық қоспаларсыз дәм мен сапа кепілі"}
              </p>
            </div>

            <div className="adv-card">
              <div className="adv-icon-badge leaf-outline">
                <Apple size={36} className="adv-icon-green" />
              </div>
              <h3 className="adv-title">{lang === 'EN' ? "FRESH FRUIT AND VEGETABLES" : isRu ? "СВЕЖИЕ ОВОЩИ И ФРУКТЫ" : "БАЛҒЫН КӨКӨНІСТЕР МЕН ЖЕМІСТЕР"}</h3>
              <p className="adv-desc">
                {lang === 'EN' ? "Fruit and vegetables sourced directly from farmers" : isRu ? "Прямые поставки овощей и фруктов от фермеров" : "Көкөністер мен жемістерді фермерлерден тікелей жеткіземіз"}
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
