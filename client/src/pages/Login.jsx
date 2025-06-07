import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import { useAuth } from '../contexts/AuthContext';
import 'react-phone-input-2/lib/style.css';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [identifierType, setIdentifierType] = useState('email'); // 'email' or 'phone'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(identifier, identifierType, password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <>
      <div className="auth-bg d-flex align-items-center justify-content-center min-vh-100" style={{background: 'linear-gradient(120deg, #e6f6fc 60%, #fafdff 100%)'}}>
        <div className="auth-card p-4 p-md-5 rounded-4 shadow-lg" style={{maxWidth: 400, width: '100%'}}>
          <div className="text-center mb-4">
            <h2 className="h4 mt-3 mb-2" style={{fontWeight: 700}}>{t('Log In')}</h2>
          </div>
          <form autoComplete="off" onSubmit={submit}>
            <div className="mb-3">
              <div className="btn-group w-100 mb-2" role="group">
                <button 
                  type="button" 
                  className={`btn ${identifierType === 'email' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setIdentifierType('email')}
                >
                  {t('Email')}
                </button>
                <button 
                  type="button" 
                  className={`btn ${identifierType === 'phone' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setIdentifierType('phone')}
                >
                  {t('Phone')}
                </button>
              </div>
              {identifierType === 'email' ? (
                <input 
                  type="email" 
                  className="form-control form-control-lg" 
                  placeholder={t('Email')} 
                  required 
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                />
              ) : (
                <PhoneInput
                  country={'rw'}
                  value={identifier}
                  onChange={phone => setIdentifier(phone)}
                  inputClass="form-control form-control-lg"
                  containerClass="phone-input-container"
                  buttonClass="phone-input-button"
                  dropdownClass="phone-input-dropdown"
                  searchClass="phone-input-search"
                  inputProps={{
                    required: true,
                    placeholder: t('Phone Number')
                  }}
                />
              )}
            </div>
            <div className="mb-3 position-relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="form-control form-control-lg" 
                placeholder={t('Password')} 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              <span 
                onClick={() => setShowPassword(v => !v)} 
                style={{position:'absolute',right:16,top:14,cursor:'pointer',fontSize:'1.2rem',color:'#399ff7'}} 
                title={showPassword ? 'Hide' : 'Show'}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            <div className="d-flex justify-content-end mb-2">
              <Link to="/forgot-password" className="footer-link small" style={{color: 'var(--main-color)', textDecoration: 'underline'}}>{t('Forgot Password')}?</Link>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2 mt-2" 
              style={{fontWeight: 600}}
              disabled={loading}
            >
              {loading ? t('Logging in...') : t('Log In')}
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-muted">{t("Don't have an account?")} </span>
            <Link to="/signup" className="footer-link" style={{color: 'var(--main-color)', fontWeight: 500}}>{t('Sign Up')}</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login; 