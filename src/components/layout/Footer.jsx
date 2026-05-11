import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo (2).jpg';
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        <div className="footer-section brand-section">
          <Link to="/">
            <img src={logo} alt="Shop.ma" className="footer-logo-img" />
          </Link>
          <p className="footer-text">
            {t('footer_desc')}
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">{t('footer_links')}</h3>
          <ul className="footer-links-list">
            <li><Link to="/">{t('home')}</Link></li>
            <li><Link to="/products">{t('products')}</Link></li>
            <li><Link to="/contact">{t('contact')}</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">{t('footer_contact')}</h3>
          <ul className="contact-list">
            <li><span className="icon">📍</span> Agadir souss massa</li>
            <li><span className="icon">📞</span> 0698701611</li>
            <li><span className="icon">✉️</span> Artisanashop.ma@gmail.com</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">{t('footer_follow')}</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
            <a href="https://wa.me/212698701611" target="_blank" rel="noreferrer" className="social-btn whatsapp"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Shop.ma. {t('rights_reserved')}</p>
      </div>
    </footer>
  );
}