import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Contact.css';

export default function Contact() {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('error_name');
    if (!formData.email.trim()) {
      newErrors.email = t('error_email');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('error_email_format');
    }
    if (!formData.message.trim()) newErrors.message = t('error_message');
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setIsSending(true);
      setErrors({});

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: "a6e8c3ab-a914-4249-adfa-ee34ffdeb281",
            name: formData.name,
            email: formData.email,
            message: formData.message,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setIsSubmitted(true);
          setFormData({ name: '', email: '', message: '' });
        } else {
          alert("Une erreur s'est produite. Veuillez réessayer.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Erreur de connexion.");
      } finally {
        setIsSending(false);
        
        if (isSubmitted) {
            setTimeout(() => setIsSubmitted(false), 5000);
        }
      }
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-card">
        <h1 className="contact-title">{t('contact_us')}</h1>

        {isSubmitted ? (
          <div className="success-message">
            {t('success_msg')}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            
            <input type="hidden" name="access_key" value="a6e8c3ab-a914-4249-adfa-ee34ffdeb281" />

            <div className="form-group">
              <label className="form-label">{t('name_label')}</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                placeholder={t('name_placeholder')}
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                disabled={isSending}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('email_label')}</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                placeholder={t('email_placeholder')}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                disabled={isSending}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('message_label')}</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange}
                rows="5"
                placeholder={t('message_placeholder')}
                className={`form-input form-textarea ${errors.message ? 'input-error' : ''}`}
                disabled={isSending}
              ></textarea>
              {errors.message && <span className="error-text">{errors.message}</span>}
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSending}
              style={{ opacity: isSending ? 0.7 : 1 }}
            >
              {isSending ? "Envoi en cours..." : t('send_btn')}
            </button>
            
          </form>
        )}
      </div>
    </div>
  );
}