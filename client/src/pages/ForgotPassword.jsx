import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || t('If this email exists, a password reset link will be sent.'));
      } else {
        setError(data.message || t('Failed to process forgot password.'));
      }
    } catch (err) {
      setError(t('Network error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-bg d-flex align-items-center justify-content-center min-vh-100" style={{background: 'linear-gradient(120deg, #e6f6fc 60%, #fafdff 100%)'}}>
        <div className="auth-card p-4 p-md-5 rounded-4 shadow-lg" style={{maxWidth: 400, width: '100%'}}>
          <div className="text-center mb-4">
            <h2 className="h4 mt-3 mb-2" style={{fontWeight: 700}}>{t('Forgot Password')}</h2>
            <p className="text-muted mb-0" style={{fontSize: '1.05rem'}}>{t("Enter your email and we'll send you a reset link.")}</p>
          </div>
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div className="mb-3">
              <input type="email" className="form-control form-control-lg" id="forgot-email" placeholder={t('Email')} required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2 mt-2" style={{fontWeight: 600}} disabled={loading}>
              {loading ? t('Sending...') : t('Reset Password')}
            </button>
          </form>
          {message && <div className="alert alert-success mt-3">{message}</div>}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <div className="text-center mt-3">
            <Link to="/login" className="footer-link" style={{color: 'var(--main-color)', fontWeight: 500}}>
              <i className="bi bi-arrow-left"></i> {t('Back to Log In')}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword; 