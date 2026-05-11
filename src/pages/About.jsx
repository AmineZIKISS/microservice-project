import { useTranslation } from 'react-i18next';
import missionImg from '../assets/mission.jpg';
import './About.css';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>{t('about_title')}</h1>
          <p>{t('about_subtitle')}</p>
        </div>
      </div>

      <div className="container">
        
        <section className="mission-section">
          <div className="mission-text">
            <h2>{t('mission_title')}</h2>
            <p>{t('mission_desc')}</p>
            <p>
              Depuis 2023, Artisanashop s'engage à sélectionner les meilleures pièces 
              faites à la main, directement depuis les ateliers de Fès, Marrakech et Agadir.
            </p>
          </div>
          <div className="mission-image">
            <img 
              src={missionImg} 
              alt="Artisan Marocain" 
            />
          </div>
        </section>

        <section className="values-section">
          <div className="value-card">
            <span className="value-icon">💎</span>
            <h3>{t('value_1')}</h3>
            <p>Chaque produit est unique et raconte une histoire vraie.</p>
          </div>
          <div className="value-card">
            <span className="value-icon">🌟</span>
            <h3>{t('value_2')}</h3>
            <p>Des matériaux nobles et une finition irréprochable.</p>
          </div>
          <div className="value-card">
            <span className="value-icon">🤝</span>
            <h3>{t('value_3')}</h3>
            <p>Nous garantissons une rémunération juste pour nos artisans.</p>
          </div>
        </section>

        <section className="stats-section">
            <div className="stat-item">
                <span className="stat-number">+50</span>
                <span className="stat-label">Artisans Partenaires</span>
            </div>
            <div className="stat-item">
                <span className="stat-number">+1200</span>
                <span className="stat-label">Clients Heureux</span>
            </div>
            <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Fait Main</span>
            </div>
        </section>

      </div>
    </div>
  );
}