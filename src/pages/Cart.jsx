// src/pages/Cart.jsx
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import './Cart.css';

export default function Cart() {
  const { t } = useTranslation(); 
  const { cart, removeFromCart, updateQuantity, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h2>{t('empty_cart_title')}</h2>
          <p>{t('empty_cart_text')}</p>
          <Link to="/products" className="back-link">
            {t('see_products')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">
        {t('cart_title')} ({cart.length} {t('articles')})
      </h1>
      
      <div className="cart-items-list">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} className="cart-item-img" />
            <div className="item-details">
              <h3>{item.title}</h3>
              <p className="item-price">{item.price} DH</p>
            </div>

            <div className="qty-controls">
              <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn">-</button>
              <span className="qty-value">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn">+</button>
            </div>

            <div className="item-subtotal">
              {(item.price * item.quantity).toFixed(2)} DH
            </div>

            <button 
              onClick={() => removeFromCart(item.id)}
              className="remove-btn"
              title={t('remove')} 
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="total-label">
          {t('total')}: 
          <span className="total-price">{total.toFixed(2)} DH</span>
        </div>
        <button className="checkout-btn">
          {t('checkout')}
        </button>
      </div>
    </div>
  );
}