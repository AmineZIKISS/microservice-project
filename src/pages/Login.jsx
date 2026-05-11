import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Contact.css'; 

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate(); 
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError(t('fill_all_fields')); 
      return;
    }


    login(email);
    navigate('/'); 
  };

  return (
    <div className="contact-page">
      <div className="contact-card" style={{maxWidth: '400px'}}> 
        <h1 className="contact-title">{t('login_title')}</h1>
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">{t('email_label')}</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="admin@shop.ma"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('password_label')}</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}

          <button type="submit" className="submit-btn">
            {t('login_btn')}
          </button>

        </form>
      </div>
    </div>
  );
}