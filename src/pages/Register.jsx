import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Contact.css'; 

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate(); 
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate fields
    if (!name || !email || !password || !confirmPassword) {
      setError(t('fill_all_fields'));
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-card" style={{maxWidth: '420px'}}> 
        <h1 className="contact-title">Créer un compte</h1>
        
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">{t('email_label')}</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('password_label')}</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Min. 6 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Retapez le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? '⏳ Inscription...' : "S'inscrire"}
          </button>

          <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: '#ea580c', fontWeight: 'bold' }}>
              Se connecter
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
