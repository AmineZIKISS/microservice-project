import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import './Products.css';

const API_URL = 'http://localhost:5002/api/products';

export default function Products() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) setSearchTerm(query);
  }, [searchParams]);

  const fetchProducts = () => {
    setLoading(true);
    setError(null);

    fetch(API_URL) 
      .then(res => {
        if (!res.ok) throw new Error('Erreur de chargement');
        return res.json();
      })
      .then(data => {
        // Backend returns both `name` and `title` — no mapping needed
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (loading) return;

    let result = [...products];

    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (sortOption === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name_az") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, sortOption, products, loading]);

  if (loading) return (
    <div style={{textAlign:'center', padding:'80px'}}>
      <h2>⏳ Chargement des produits...</h2>
    </div>
  );
  
  if (error) return (
    <div style={{textAlign:'center', padding:'80px', color:'red'}}>
      <h2>❌ Erreur: {error}</h2>
      <button onClick={fetchProducts} className="reset-btn" style={{marginTop:'20px'}}>
        Réessayer
      </button>
    </div>
  );

  return (
    <div className="products-page">
      <div className="container">
        
        <div className="products-header">
          <h1 className="shop-title">Boutique Artisanale</h1>
          <p className="shop-subtitle">Tous les produits</p>
          
          <button onClick={fetchProducts} className="refresh-btn">
            🔄 Rafraîchir
          </button>
        </div>

        <div className="products-toolbar">
          
          <div className="toolbar-item search-box">
            <input 
              type="text" 
              placeholder={t('search_placeholder')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="toolbar-item categories-filter">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="custom-select">
              <option value="all">{t('all_categories')}</option>
              <option value="Tapis">🧶 Tapis / Rugs</option>
              <option value="Céramique">🏺 Céramique / Ceramics</option>
              <option value="Bijoux">💎 Bijoux / Jewelry</option>
              <option value="Cuir">👜 Cuir / Leather</option>
              <option value="Cuisine">🍵 Cuisine / Kitchen</option>
              <option value="Décoration">🏮 Décoration / Home Decor</option>
              <option value="Beauté">✨ Beauté / Beauty</option>
              <option value="Mode">👗 Mode / Fashion</option>
            </select>
          </div>

          <div className="toolbar-item sort-filter">
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="custom-select">
              <option value="default">{t('sort_by')}</option>
              <option value="price_asc">{t('price_low_high')}</option>
              <option value="price_desc">{t('price_high_low')}</option>
              <option value="name_az">{t('name_az')}</option>
            </select>
          </div>

        </div>

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image-wrapper">
                   <img src={product.image} alt={product.name} className="product-img" />
                   <button className="add-cart-btn" onClick={() => addToCart(product)}>
                     + {t('add_to_cart')}
                   </button>
                </div>
                <div className="product-info">
                  <span className="product-cat">{product.category}</span>
                  <Link to={`/products/${product._id}`} className="product-name">
                    {product.name}
                  </Link>
                  <span className="product-price">{product.price} DH</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>{t('no_products')}</p>
              <button onClick={() => {setSearchTerm(''); setSelectedCategory('all');}} className="reset-btn">
                {t('view_all')}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}