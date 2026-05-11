import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch'; 

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, loading, error } = useFetch(`https://fakestoreapi.com/products/${id}`);

  if (loading) return <div style={{textAlign:'center', padding:'50px'}}>Chargement du produit... ⏳</div>;
  if (error) return <div style={{textAlign:'center', color:'red'}}>Erreur: {error}</div>;
  if (!product) return <div style={{textAlign:'center'}}>Produit introuvable</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '30px', alignItems:'flex-start' }}>
      <img 
        src={product.image} 
        alt={product.title} 
        style={{ width: '300px', objectFit: 'contain', border: '1px solid #eee', padding: '10px', borderRadius: '8px' }} 
      />
      
      <div>
        <h1 style={{fontSize:'1.8rem', marginBottom:'10px'}}>{product.title}</h1>
        <p style={{ color: '#ea580c', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '10px' }}>{product.price} DH</p>
        <span style={{ background: '#eee', padding: '5px 10px', borderRadius: '4px', fontSize: '0.9rem' }}>{product.category}</span>
        <p style={{ lineHeight: '1.6', marginTop: '20px', color: '#555' }}>{product.description}</p>
        
        <button 
          onClick={() => navigate(-1)} 
          style={{ marginTop: '30px', padding: '10px 25px', background: '#333', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
        >
          Retour
        </button>
      </div>
    </div>
  );
}