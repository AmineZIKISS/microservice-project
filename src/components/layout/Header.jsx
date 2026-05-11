import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import useTheme from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo (2).jpg';
import './Header.css';

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { cart } = useCart();
  const { user, logout } = useAuth();
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.body.dir = lng === 'ar' ? 'rtl' : 'ltr';
    setIsLangMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/products?search=${searchTerm}`);
    setShowSearch(false);
    setSearchTerm("");
  };

  const getCurrentLangLabel = () => {
    switch (i18n.language) {
      case 'ar': return 'العربية';
      case 'en': return 'EN';
      default: return 'FR';
    }
  };

  return (
    <header className="header-container">
      
      <div className="logo-section">
        <Link to="/">
          <img src={logo} alt="Shop.ma" className="site-logo" />        
        </Link>
      </div>
      
      <nav className="centered-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-text active" : "nav-text"}>
          {t('home')}
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? "nav-text active" : "nav-text"}>
          {t('products')}
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-text active" : "nav-text"}>
          {t('contact')}
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "nav-text active" : "nav-text"}>
          {t('about')}
        </NavLink>
      </nav>

      <div className="icons-section">
        
        <div className="lang-dropdown-container">
          <button 
            className="lang-pill-btn" 
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
          >
            {getCurrentLangLabel()} 
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '6px'}}>
              <path d="M1 1L5 5L9 1"></path>
            </svg>
          </button>

          {isLangMenuOpen && (
            <div className="lang-menu">
              <div onClick={() => changeLanguage('ar')} className={`lang-item ${i18n.language === 'ar' ? 'active' : ''}`}>العربية</div>
              <div onClick={() => changeLanguage('fr')} className={`lang-item ${i18n.language === 'fr' ? 'active' : ''}`}>FR</div>
              <div onClick={() => changeLanguage('en')} className={`lang-item ${i18n.language === 'en' ? 'active' : ''}`}>EN</div>
            </div>
          )}
        </div>

        <div className="divider"></div>

        <div className="search-trigger-container">
          <button className={`icon-btn ${showSearch ? 'active-search' : ''}`} onClick={() => setShowSearch(!showSearch)}>
            {showSearch ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            )}
          </button>
          {showSearch && (
            <form onSubmit={handleSearch} className="search-dropdown-input">
              <input ref={searchInputRef} type="text" placeholder={t('search_placeholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </form>
          )}
        </div>

        {user ? (
          <button onClick={logout} className="icon-btn" title={`Logout (${user.name})`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
          </button>
        ) : (
          <Link to="/login" className="icon-btn" title="Login">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </Link>
        )}

        <Link to="/cart" className="icon-btn cart-btn-container" title="Cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          {totalItems > 0 && <span className="cart-dot">{totalItems}</span>}
        </Link>
        
        <button onClick={toggleTheme} className="icon-btn">
             {theme === 'light' ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
             ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line></svg>
             )}
        </button>

      </div>
    </header>
  );
}