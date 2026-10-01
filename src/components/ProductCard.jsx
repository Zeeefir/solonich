import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="product-card-box">
      {/* Обернули кликабельную часть в Link, чтобы открывалась страница товара */}
      <Link to={`/product/${product.id}`} className="card-link-wrapper" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Фотография товара */}
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

        {/* Информация о товаре */}
        <div className="card-content">
          <h3 className="card-item-title">{product.title}</h3>

          <div className="card-item-weight-only">
            <span className="weight-num">{product.weight}</span>
          </div>
        </div>
      </Link>

      {/* Кнопка "СОСТАВ" (ведет на страницу товара) */}
      <Link to={`/product/${product.id}`} className="btn-composition">
        СОСТАВ
      </Link>
    </div>
  );
}