import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';

import useTheme from './hooks/useTheme';

function App() {
  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      
      <Header />

      <main className="main-content" style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h2>Page introuvable 404 🚫</h2>
            </div>
          } />
        </Routes>
      </main>

      <Footer />
      
    </div>
  );
}

export default App;