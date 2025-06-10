import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState(i18n.language === 'kin' ? 'KIN' : 'EN');

  const handleLangSwitch = (lng) => {
    setLang(lng);
    i18n.changeLanguage(lng === 'KIN' ? 'kin' : 'en');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header glass-header shadow-sm sticky-top py-2" data-aos="fade-down">
      <nav className="container d-flex align-items-center justify-content-between">
        {/* Logo or Brand Name */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 logo-hover" style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--main-color)', textDecoration: 'none' }}>
          {/* You can replace this with an <img src=... /> if you have a logo */}
          <span>{t('Tek Riders')}</span>
        </Link>
        <div className="d-flex align-items-center gap-3">
          {/* Language Switcher */}
          <div className="lang-switcher btn-group" role="group" aria-label={t('Language switcher')}>
            <button
              className={`btn btn-sm ${lang === 'KIN' ? 'btn-primary' : 'btn-outline-primary'} lang-btn`}
              onClick={() => handleLangSwitch('KIN')}
              type="button"
            >
              {t('Kin')}
            </button>
            <button
              className={`btn btn-sm ${lang === 'EN' ? 'btn-primary' : 'btn-outline-primary'} lang-btn`}
              onClick={() => handleLangSwitch('EN')}
              type="button"
            >
              {t('En')}
            </button>
          </div>
          {user && (
            <>
              {user.role === 'student' && (
                <Link to="/student" className="btn btn-outline-primary">
                  {t('My Learning')}
                </Link>
              )}
              {user.role === 'instructor' && (
                <Link to="/instructor" className="btn btn-outline-primary">
                  {t('Instructor Dashboard')}
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-outline-primary">
                  {t('Admin Dashboard')}
                </Link>
              )}
            </>
          )}
        </div>
        <div className="d-flex align-items-center">
          {user ? (
            <div className="dropdown">
              <button
                className="btn btn-link dropdown-toggle text-dark text-decoration-none"
                type="button"
                id="userMenu"
                data-bs-toggle="dropdown"
              >
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&size=32`}
                  alt={user.name}
                  className="rounded-circle me-2"
                  width="32"
                  height="32"
                />
                {user.name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    {t('Profile')}
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    {t('Logout')}
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">
                {t('Login')}
              </Link>
              <Link to="/register" className="btn btn-primary">
                {t('Sign Up')}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header; 