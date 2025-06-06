import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer-modern">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-col">
            <h5>{t('About')}</h5>
            <Link to="/about">{t('About Us')}</Link>
            <Link to="/courses">{t('Courses')}</Link>
          </div>
          <div className="footer-col">
            <h5>{t('Legal')}</h5>
            <Link to="/privacy">{t('Privacy')}</Link>
            <Link to="/terms">{t('Terms')}</Link>
          </div>
          <div className="footer-col">
            <h5>{t('Contact')}</h5>
            <a href="mailto:info.tekriders@gmail.com" aria-label="Email"><i className="bi bi-envelope"></i> info.tekriders@gmail.com</a>
            <a href="https://wa.me/250785961427" target="_blank" rel="noopener" aria-label="Whatsapp"><i className="bi bi-whatsapp"></i> +250785961427</a>
            <span><i className="bi bi-geo-alt"></i> KK 69 St</span>
          </div>
          <div className="footer-col social">
            <h5>{t('Connect')}</h5>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener"><i className="bi bi-instagram"></i></a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener"><i className="bi bi-linkedin"></i></a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Tek Riders. {t('All rights reserved.')}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 