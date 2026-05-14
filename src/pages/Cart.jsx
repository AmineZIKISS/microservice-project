import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import './Cart.css';

export default function Cart() {
  const { t } = useTranslation(); 
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper — get stable ID from either MongoDB _id or plain id
  const getId = (item) => item._id || item.id;

  const handleCheckout = async () => {
    if (!token) {
      alert(t('login_required_checkout') || 'Veuillez vous connecter pour passer la commande');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: getId(item),
          quantity: item.quantity
        }))
      };

      const response = await fetch('http://localhost:5003/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue lors de la commande');
      }

      alert('Commande passée avec succès !');
      clearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message);
      alert(`Erreur: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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
          <div key={getId(item)} className="cart-item">
            <img src={item.image} alt={item.name || item.title} className="cart-item-img" />
            <div className="item-details">
              <h3>{item.name || item.title}</h3>
              <p className="item-price">{item.price} DH</p>
            </div>

            <div className="qty-controls">
              <button onClick={() => updateQuantity(getId(item), -1)} className="qty-btn">-</button>
              <span className="qty-value">{item.quantity}</span>
              <button onClick={() => updateQuantity(getId(item), 1)} className="qty-btn">+</button>
            </div>

            <div className="item-subtotal">
              {(item.price * item.quantity).toFixed(2)} DH
            </div>

            <button 
              onClick={() => removeFromCart(getId(item))}
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
        {error && <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        <button 
          className="checkout-btn" 
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Traitement...' : t('checkout')}
        </button>
      </div>
    </div>
  );
}