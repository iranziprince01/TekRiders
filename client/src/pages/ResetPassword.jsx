import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Footer from '../components/Footer';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Password has been reset successfully.');
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-bg d-flex align-items-center justify-content-center min-vh-100" style={{background: 'linear-gradient(120deg, #e6f6fc 60%, #fafdff 100%)'}}>
        <div className="auth-card p-4 p-md-5 rounded-4 shadow-lg" style={{maxWidth: 400, width: '100%'}}>
          <div className="text-center mb-4">
            <h2 className="h4 mt-3 mb-2" style={{fontWeight: 700}}>Reset Password</h2>
            <p className="text-muted mb-0" style={{fontSize: '1.05rem'}}>Enter your new password below.</p>
          </div>
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div className="mb-3 position-relative">
              <input type={showPassword ? 'text' : 'password'} className="form-control form-control-lg" placeholder="New Password" required value={password} onChange={e => setPassword(e.target.value)} />
              <span onClick={() => setShowPassword(v => !v)} style={{position:'absolute',right:16,top:14,cursor:'pointer',fontSize:'1.2rem',color:'#399ff7'}} title={showPassword ? 'Hide' : 'Show'}>
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            <div className="mb-3 position-relative">
              <input type={showConfirm ? 'text' : 'password'} className="form-control form-control-lg" placeholder="Confirm Password" required value={confirm} onChange={e => setConfirm(e.target.value)} />
              <span onClick={() => setShowConfirm(v => !v)} style={{position:'absolute',right:16,top:14,cursor:'pointer',fontSize:'1.2rem',color:'#399ff7'}} title={showConfirm ? 'Hide' : 'Show'}>
                {showConfirm ? '🙈' : '👁️'}
              </span>
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2 mt-2" style={{fontWeight: 600}} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          {message && <div className="alert alert-success mt-3">{message} <Link to="/login">Log In</Link></div>}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <div className="text-center mt-3">
            <Link to="/login" className="footer-link" style={{color: 'var(--main-color)', fontWeight: 500}}>
              <i className="bi bi-arrow-left"></i> Back to Log In
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword; 