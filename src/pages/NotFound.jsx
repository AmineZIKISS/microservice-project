import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', color: '#dc2626' }}>
      <h1 style={{ fontSize: '3rem' }}>404</h1>
      <p style={{ fontSize: '1.5rem' }}>Oups! Page introuvable.</p>
      <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>
        Retour à l'accueil
      </Link>
    </div>
  );
}