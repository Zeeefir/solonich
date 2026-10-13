import { formatUnit } from '../translations';
import useLanguage from '../useLanguage';
import { useParams, Link } from 'react-router-dom';
import { useSiteData } from '../SiteData';
import { ArrowLeft, Flame, Home } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams();
  const lang = useLanguage();
  const { products: productsData, loading, error } = useSiteData();
  const product = productsData.find(p => p.id === Number(id));

  const getBadgeStyle = (text) => {
    switch (text?.toUpperCase()) {
      case 'ОСТРОЕ': return { backgroundColor: '#e53935' };
      case 'ХИТ': return { backgroundColor: '#ffa726' };
      case 'НОВИНКА': return { backgroundColor: '#43a047' };
      case 'АКЦИЯ': return { backgroundColor: '#ab47bc' };
      default: return { backgroundColor: '#e53935' };
    }
  };

  if (loading || error) return <section className="management-page">{error || (lang === 'EN' ? 'Loading…' : lang === 'KZ' ? 'Жүктелуде…' : 'Загрузка…')}</section>;
  if (!product) {
    return (
      <div className="not-found-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>{lang === 'EN' ? "Product not found" : lang === 'RU' ? 'Товар не найден' : 'Өнім табылмады'}</h2>
        <p style={{ color: '#666', marginBottom: '20px', fontSize: '1.05rem' }}>
          {lang === 'EN' ? "This product may have been removed, or the address is incorrect." : lang === 'RU' ? 'Возможно, он был удален или указан неверный адрес.' : 'Мүмкін ол жойылған немесе мекенжай қате.'}
        </p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#c93b2b', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: 600 }}>
          <Home size={18} /> {lang === 'EN' ? "Home" : lang === 'RU' ? 'На главную' : 'Басты бетке'}
        </Link>
      </div>
    );
  }

  const isRu = lang === 'RU';
  const composition = lang === 'EN' ? product.compositionEn : isRu ? product.compositionRu : product.compositionKz;
  const { nutrition, storage } = product;

  return (
    <div className="product-page-container">

      <div className="product-detail-card">
        
        {/* Левая колонка с фото на всю высоту */}
        <div 
          className="product-detail-media" 
          style={{ 
            position: 'relative', 
            width: '100%', 
            borderRadius: '16px', 
            overflow: 'hidden',
            backgroundColor: '#faf7f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #ebdcc7'
          }}
        >
          {product.badge && (
            <span 
              className="spice-tag" 
              style={{
                ...getBadgeStyle(product.badge),
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 3,
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '800',
                fontSize: '0.8rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              <Flame size={14} /> {lang === 'EN' ? ({ 'ОСТРОЕ': 'SPICY', 'ХИТ': 'BESTSELLER', 'НОВИНКА': 'NEW', 'АКЦИЯ': 'SALE' }[product.badge] || product.badge) : isRu ? product.badge : ({ 'ОСТРОЕ': 'АЩЫ', 'ХИТ': 'ХИТ', 'НОВИНКА': 'ЖАҢА', 'АКЦИЯ': 'АКЦИЯ' }[product.badge] || product.badge)}
            </span>
          )}
          
          {product.image ? (
            <img 
              src={product.image} 
              alt={lang === 'EN' ? product.titleEn : isRu ? product.title : product.titleKz} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                display: 'block'
              }} 
            />
          ) : (
            <div className="placeholder-jar-large" style={{ fontSize: '70px' }}>🫙</div>
          )}
        </div>

        {/* Правая колонка с текстом */}
        <div className="product-detail-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <h1 className="product-detail-title" style={{ lineHeight: '1.2', margin: 0, fontWeight: '900', color: '#2b1f17' }}>{lang === 'EN' ? product.titleEn : isRu ? product.title : product.titleKz}</h1>
              {product.weight && (
                <span style={{ 
                  backgroundColor: '#f0e6dc', 
                  color: '#5c4033', 
                  padding: '6px 14px', 
                  borderRadius: '10px', 
                  fontSize: '0.95rem', 
                  fontWeight: '800',
                  letterSpacing: '0.5px'
                }}>
                  {lang === 'EN' ? product.weight.replace('г', 'g') : product.weight}
                </span>
              )}
            </div>

            {product.description && <p className="detail-description" style={{ margin: '0 0 16px 0', fontSize: '1.05rem', lineHeight: '1.5', color: '#5a4b40' }}>{product.description}</p>}

            {/* Блок состава */}
            <div className="product-ingredients" style={{ border: '1px solid #ebdcc7', borderRadius: '16px', overflow: 'hidden', background: '#faf8f5', padding: '16px 20px', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.05rem', margin: '0 0 6px 0', fontWeight: '900', color: '#2b1f17' }}>
                {lang === 'EN' ? "Ingredients:" : isRu ? 'Состав продукта:' : 'Құрамы:'}
              </h3>
              <p style={{ fontSize: '0.95rem', margin: 0, lineHeight: '1.5', color: '#3b2e25', fontWeight: '500' }}>{composition}</p>
            </div>

            {/* Блок пищевой ценности (БЖУ и калории) */}
            {nutrition && nutrition.calories && (
              <div className="nutrition-section" style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#2b1f17', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {lang === 'EN' ? "Nutrition per 100 g:" : isRu ? 'Пищевая ценность на 100 г:' : '100 г өнімнің тағамдық құндылығы:'}
                </h4>
                <div className="nutrition-grid">
                  <div style={{ background: '#fff4ec', border: '1px solid #f3dec4', borderRadius: '12px', padding: '10px 6px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#7a6a5c', fontWeight: '700', marginBottom: '2px' }}>{lang === 'EN' ? "Energy" : isRu ? 'Энергия' : 'Энергия'}</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#bb2a2a' }}>{formatUnit(nutrition.calories, lang)}</span>
                    {nutrition.kJ && <span style={{ fontSize: '0.65rem', color: '#9e8e80', fontWeight: '600' }}>{formatUnit(nutrition.kJ, lang)}</span>}
                  </div>
                  <div style={{ background: '#fcf8f2', border: '1px solid #ebdccb', borderRadius: '12px', padding: '10px 6px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#7a6a5c', fontWeight: '700', marginBottom: '2px' }}>{lang === 'EN' ? "Carbohydrates" : isRu ? 'Углеводы' : 'Көмірсулар'}</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#2b1f17' }}>{formatUnit(nutrition.carbs, lang)}</span>
                  </div>
                  <div style={{ background: '#fcf8f2', border: '1px solid #ebdccb', borderRadius: '12px', padding: '10px 6px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#7a6a5c', fontWeight: '700', marginBottom: '2px' }}>{lang === 'EN' ? "Protein" : isRu ? 'Белки' : 'Ақуыздар'}</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#2b1f17' }}>{formatUnit(nutrition.proteins, lang)}</span>
                  </div>
                  <div style={{ background: '#fcf8f2', border: '1px solid #ebdccb', borderRadius: '12px', padding: '10px 6px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#7a6a5c', fontWeight: '700', marginBottom: '2px' }}>{lang === 'EN' ? "Fat" : isRu ? 'Жиры' : 'Майлар'}</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#2b1f17' }}>{formatUnit(nutrition.fats || '0 г', lang)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Блок хранения и сроков */}
            {storage && storage.shelfLife && (
              <div className="storage-grid">
                <div style={{ background: '#faf8f5', border: '1px solid #ebdcc7', borderRadius: '12px', padding: '10px 12px', flex: 1 }}>
                  <span style={{ fontWeight: '800', color: '#2b1f17', display: 'block', marginBottom: '2px' }}>{lang === 'EN' ? "Storage:" : isRu ? 'Хранение:' : 'Сақтау:'}</span>
                  <span style={{ color: '#5a4b40' }}>t {lang === 'EN' ? storage.temp.replace(/^от (.+) до (.+)$/, '$1 to $2') : isRu ? storage.temp : storage.temp.replace(/^от (.+) до (.+)$/, '$1-тан $2-қа дейін')}, {lang === 'EN' ? "humidity" : isRu ? 'влажность' : 'ылғалдылық'} {lang === 'EN' ? storage.humidity.replace('не более', 'up to') : isRu ? storage.humidity : storage.humidity.replace(/^не более (.+)$/, '$1-дан аспайды')}</span>
                </div>
                <div style={{ background: '#faf8f5', border: '1px solid #ebdcc7', borderRadius: '12px', padding: '10px 12px', flex: 1 }}>
                  <span style={{ fontWeight: '800', color: '#2b1f17', display: 'block', marginBottom: '2px' }}>{lang === 'EN' ? "Shelf life:" : isRu ? 'Срок годности:' : 'Жарамдылық мерзімі:'}</span>
                  <span style={{ color: '#5a4b40' }}>{lang === 'EN' ? storage.shelfLife.replace('дней', 'days') : isRu ? storage.shelfLife : storage.shelfLife.replace('дней', 'күн')}</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '24px' }}>
            <Link 
              to="/#catalog"
              className="btn-to-main"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px', 
                padding: '16px 20px', 
                backgroundColor: '#bb2a2a', 
                color: '#fff', 
                borderRadius: '14px', 
                textDecoration: 'none', 
                fontWeight: '900',
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                boxShadow: '0 6px 18px rgba(187, 42, 42, 0.25)',
                transition: 'background 0.22s'
              }}
            >
              <ArrowLeft size={18} /> {lang === 'EN' ? "Back to products" : isRu ? 'Назад в каталог' : 'Каталогқа оралу'}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
