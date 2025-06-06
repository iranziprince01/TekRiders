import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const Login = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const submit = async e => {
    e.preventDefault();
    const email = e.target.elements['login-email'].value;
    const password = e.target.elements['login-password'].value;
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      window.location.href = '/dashboard';
    } else {
      alert(data.message || 'Login failed');
    }
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
              <input type="email" className="form-control form-control-lg" id="login-email" placeholder={t('Email')} required />
            </div>
            <div className="mb-3 position-relative">
              <input type={showPassword ? 'text' : 'password'} className="form-control form-control-lg" id="login-password" placeholder={t('Password')} required value={password} onChange={e => setPassword(e.target.value)} />
              <span onClick={() => setShowPassword(v => !v)} style={{position:'absolute',right:16,top:14,cursor:'pointer',fontSize:'1.2rem',color:'#399ff7'}} title={showPassword ? 'Hide' : 'Show'}>
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            <div className="d-flex justify-content-end mb-2">
              <Link to="/forgot-password" className="footer-link small" style={{color: 'var(--main-color)', textDecoration: 'underline'}}>{t('Forgot Password')}?</Link>
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2 mt-2" style={{fontWeight: 600}}>{t('Log In')}</button>
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