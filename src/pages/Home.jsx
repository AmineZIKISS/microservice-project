import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';

import heroBg from '../assets/hero-bg.webp';
import promoBg from '../assets/promo-bg.jpg';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="home-container">
      
      <section 
        className="hero-section" 
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="overlay">
          <div className="hero-content">
            <h1 className="hero-title">{t('welcome_title')}</h1>
            <p className="hero-subtitle">{t('welcome_subtitle')}</p>
            <Link to="/products" className="main-btn">
              {t('shop_now')}
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-item">
          <span className="feature-icon">🚚</span>
          <h3>{t('feature_delivery')}</h3>
          <p>{t('feature_delivery_desc')}</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">💎</span>
          <h3>{t('feature_quality')}</h3>
          <p>{t('feature_quality_desc')}</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🛡️</span>
          <h3>{t('feature_payment')}</h3>
          <p>{t('feature_payment_desc')}</p>
        </div>
      </section>

      <section 
        className="promo-section"
        style={{ backgroundImage: `url(${promoBg})` }}
      >
        <div className="overlay dark-overlay">
          <div className="promo-content">
            <h2>Artisanat de Luxe</h2>
            <p>Découvrez notre collection exclusive de lanternes et céramiques.</p>
            <Link to="/products" className="secondary-btn">
              {t('view_all')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}