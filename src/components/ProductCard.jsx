import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  // Функция для выбора цвета плашки в зависимости от текста
  const getBadgeStyle = (text) => {
    switch (text?.toUpperCase()) {
      case 'ОСТРОЕ':
        return { backgroundColor: '#e53935' }; // Красный
      case 'ХИТ':
        return { backgroundColor: '#ffa726' }; // Оранжевый / Желтый
      case 'НОВИНКА':
        return { backgroundColor: '#43a047' }; // Зеленый
      case 'АКЦИЯ':
        return { backgroundColor: '#ab47bc' }; // Фиолетовый
      default:
        return { backgroundColor: '#e53935' }; // Цвет по умолчанию (красный)
    }
  };

  return (
    <div className="product-card-box">
      {/* Плашка с динамическим цветом */}
      {product.badge && (
        <span 
          className="card-badge" 
          style={getBadgeStyle(product.badge)}
        >
          {product.badge}
        </span>
      )}

      <Link to={`/product/${product.id}`} className="card-link-wrapper" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="card-image-wrapper">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.title} 
              className="product-card-img" 
            />
          ) : (
            <div className="placeholder-jar">🫙</div>
          )}
        </div>

        <div className="card-content">
          <h3 className="card-item-title">{product.title}</h3>

          <div className="card-item-weight-only">
            <span className="weight-num">{product.weight}</span>
          </div>
        </div>
      </Link>

      <Link to={`/product/${product.id}`} className="btn-composition">
        СОСТАВ
      </Link>
    </div>
  );
}