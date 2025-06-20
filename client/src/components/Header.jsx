import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { FiSun, FiMoon, FiEye } from 'react-icons/fi';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState(i18n.language === 'kin' ? 'Kn' : 'En');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('highContrast') === 'true');

  // Theme switcher effect (applies to all pages)
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', highContrast);
  }, [theme, highContrast]);

  const handleLangSwitch = (lng) => {
    setLang(lng);
    i18n.changeLanguage(lng === 'Kn' ? 'kin' : 'en');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Scroll to top for Home
  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    }
  };

  // Scroll to Featured Courses section
  const handleCoursesClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById('courses-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('courses-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <header className="header glass-header shadow-sm sticky-top py-2" style={{borderBottom: '2px solid #2196f3', background: '#fff'}}>
      <nav className="navbar navbar-expand-lg container">
        <Link to="/" className="navbar-brand" style={{ fontWeight: 900, fontSize: '1.7rem', color: '#399ff7', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px', textDecoration: 'none' }}>
          Tek Riders
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4 gap-2 align-items-lg-center">
            <li className="nav-item">
              <a href="/" onClick={handleHomeClick} className="nav-link fw-bold">{t('Home')}</a>
            </li>
            <li className="nav-item">
              <Link to="/signup" className="nav-link fw-bold">{t('Tutors')}</Link>
            </li>
            <li className="nav-item">
              <a href="#courses-section" onClick={handleCoursesClick} className="nav-link fw-bold">{t('Courses')}</a>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            <Link to="/signup" className="btn btn-primary fw-bold px-3">{t('Join')}</Link>
            <div className="theme-switcher btn-group me-2" role="group" aria-label={t('Theme switcher')}>
              <button
                className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => theme !== 'light' && setTheme('light')}
                type="button"
                style={{fontWeight: 600, minWidth: 44}}
                aria-label="Light Theme"
                aria-pressed={theme === 'light'}
              >
                <FiSun size={18} />
              </button>
              <button
                className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => theme !== 'dark' && setTheme('dark')}
                type="button"
                style={{fontWeight: 600, minWidth: 44}}
                aria-label="Dark Theme"
                aria-pressed={theme === 'dark'}
              >
                <FiMoon size={18} />
              </button>
              <button
                className={`btn btn-sm ${highContrast ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setHighContrast(h => !h)}
                type="button"
                style={{fontWeight: 600, minWidth: 44}}
                aria-label="High Contrast Mode"
                aria-pressed={highContrast}
              >
                <FiEye size={18} />
              </button>
            </div>
            <div className="lang-switcher btn-group" role="group" aria-label={t('Language switcher')}>
              <button
                className={`btn btn-sm ${lang === 'Kn' ? 'btn-primary' : 'btn-outline-primary'} lang-btn`}
                onClick={() => handleLangSwitch('Kn')}
                type="button"
                style={{fontWeight: 600, minWidth: 44}}
              >
                Kn
              </button>
              <button
                className={`btn btn-sm ${lang === 'En' ? 'btn-primary' : 'btn-outline-primary'} lang-btn`}
                onClick={() => handleLangSwitch('En')}
                type="button"
                style={{fontWeight: 600, minWidth: 44}}
              >
                En
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 