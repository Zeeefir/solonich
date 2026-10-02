import { useParams, Link } from 'react-router-dom';
import productsData from '../data/products.json';
import { ArrowLeft, Flame, Home } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams();
  
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

  if (!product) {
    return (
      <div className="not-found-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Товар не найден</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Возможно, он был удален или указан неверный адрес.</p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#c93b2b', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: 600 }}>
          <Home size={18} /> На главную
        </Link>
      </div>
    );
  }

  return (
    <div className="product-page-container">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} />
        <span>Назад в каталог</span>
      </Link>

      <div className="product-detail-card" style={{ gap: '24px', padding: '24px 30px', alignItems: 'start' }}>
        
        <div 
          className="product-detail-media" 
          style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: '420px', 
            height: '380px', 
            borderRadius: '12px', 
            overflow: 'hidden',
            backgroundColor: '#faf7f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {product.badge && (
            <span 
              className="spice-tag" 
              style={{
                ...getBadgeStyle(product.badge),
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 3,
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: '700',
                fontSize: '0.75rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              <Flame size={14} /> {product.badge}
            </span>
          )}
          
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.title} 
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

        <div className="product-detail-content" style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          
          {/* Заголовок и граммовка */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '2px' }}>
            <h1 style={{ fontSize: '1.6rem', lineHeight: '1.2', margin: 0 }}>{product.title}</h1>
            {product.weight && (
              <span style={{ 
                backgroundColor: '#f0e6dc', 
                color: '#5c4033', 
                padding: '4px 10px', 
                borderRadius: '8px', 
                fontSize: '0.85rem', 
                fontWeight: '700',
                letterSpacing: '0.5px'
              }}>
                {product.weight}
              </span>
            )}
          </div>

          {product.description && <p className="detail-description" style={{ margin: '0 0 6px 0', fontSize: '0.9rem' }}>{product.description}</p>}

          {/* Общий контейнер для составов с внешней рамкой и скруглением по краям */}
          <div style={{ border: '1px solid #eee5d8', borderRadius: '12px', overflow: 'hidden', background: '#faf8f5' }}>
            
            {/* Блок состава на русском */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee5d8' }}>
              <h3 style={{ fontSize: '0.98rem', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>🌱 Состав продукта:</h3>
              <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.45', color: '#444' }}>{product.compositionRu}</p>
            </div>

            {/* Блок состава на казахском */}
            {product.compositionKz && (
              <div style={{ padding: '12px 16px' }}>
                <h3 style={{ fontSize: '0.98rem', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>🌱 Құрамы:</h3>
                <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.45', color: '#444' }}>{product.compositionKz}</p>
              </div>
            )}

          </div>

          {/* Кнопка «На главную» */}
          <div style={{ marginTop: '12px' }}>
            <Link 
              to="/" 
              className="btn-to-main"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px', 
                padding: '12px 18px', 
                backgroundColor: '#c93b2b', 
                color: '#fff', 
                borderRadius: '10px', 
                textDecoration: 'none', 
                fontWeight: '700',
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(201, 59, 43, 0.25)',
                transition: 'background 0.2s'
              }}
            >
              <Home size={16} /> На главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}