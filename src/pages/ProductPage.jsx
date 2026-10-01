import { useParams, Link } from 'react-router-dom';
import productsData from '../data/products.json';
import { ArrowLeft, CheckCircle2, Thermometer, Flame } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams();
  
  // Превращаем id из строки в число, чтобы поиск по products.json сработал корректно
  const product = productsData.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="not-found-container">
        <h2>Товар не найден</h2>
        <Link to="/" className="btn-primary">Вернуться в каталог</Link>
      </div>
    );
  }

  return (
    <div className="product-page-container">
      <Link to="/" className="back-link">
        <ArrowLeft size={20} />
        <span>Назад в каталог</span>
      </Link>

      <div className="product-detail-card">
        <div className="product-detail-media">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="product-detail-content">
          <div className="detail-header">
            <span className="detail-weight">{product.weight}</span>
            {product.spiciness > 0 && (
              <span className="spice-tag">
                <Flame size={16} /> Острота: {'🌶️'.repeat(product.spiciness)}
              </span>
            )}
          </div>

          <h1>{product.title}</h1>
          <p className="detail-description">{product.description}</p>

          <div className="info-block composition-block">
            <h3>🌱 Состав продукта:</h3>
            <p className="ingredients-text">{product.ingredients}</p>
          </div>

          <div className="info-grid">
            <div className="info-box">
              <div className="info-box-header">
                <CheckCircle2 size={20} color="#c62828" />
                <span>Пищевая ценность</span>
              </div>
              <p>{product.calories}</p>
            </div>

            <div className="info-box">
              <div className="info-box-header">
                <Thermometer size={20} color="#c62828" />
                <span>Условия хранения</span>
              </div>
              <p>{product.shelfLife}</p>
            </div>
          </div>

          <button className="product-page-buy-btn">
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
}