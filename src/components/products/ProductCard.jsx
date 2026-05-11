import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; 

export default function ProductCard({ id, title, price, image, category }) {
  const { addToCart } = useCart(); 
  return (
    <div className="product-card" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', width: '250px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s', position: 'relative' }}>
      
      <Link to={`/products/${id}`}>
        <img src={image} alt={title} style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '10px', cursor:'pointer' }} />
      </Link>
      
      <h3 style={{ margin: '10px 0', fontSize: '1rem', textAlign: 'center', height: '50px', overflow: 'hidden' }}>
        {title}
      </h3>
      
      <span style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>{category}</span>
      <p style={{ fontWeight: 'bold', color: '#ea580c', marginTop: '10px' }}>{price} DH</p>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Link 
          to={`/products/${id}`} 
          style={{ textDecoration: 'none', color: '#333', border: '1px solid #333', padding: '8px 12px', borderRadius: '4px', fontSize: '0.8rem' }}
        >
          Détails
        </Link>

        <button 
          onClick={() => addToCart({ id, title, price, image })}
          style={{ 
            backgroundColor: '#16a34a', 
            color: 'white', 
            border: 'none', 
            padding: '8px 12px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          + Panier
        </button>
      </div>
    </div>
  );
}