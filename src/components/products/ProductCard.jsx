import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; 
import { useTranslation } from 'react-i18next';

export default function ProductCard({ product }) {
  const { t } = useTranslation();
  const { addToCart } = useCart(); 
  
  // Handle both MongoDB _id and plain id
  const id = product._id || product.id;
  // Handle both name and title
  const name = product.name || product.title;

  const handleImageError = (e) => {
    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/13/3119925963_2_3_yXx93oMy.jpg';
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <Link to={`/products/${id}`}>
          <img 
            src={product.image} 
            alt={name} 
            className="product-img" 
            onError={handleImageError}
          />
        </Link>
        <button className="add-cart-btn" onClick={() => addToCart(product)}>
          + {t('add_to_cart') || 'Ajouter'}
        </button>
      </div>
      <div className="product-info">
        <span className="product-cat">{product.category}</span>
        <Link to={`/products/${id}`} className="product-name">
          {name}
        </Link>
        <span className="product-price">{product.price} DH</span>
      </div>
    </div>
  );
}