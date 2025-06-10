import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import { useAuth } from '../contexts/AuthContext';
import 'react-phone-input-2/lib/style.css';
import googleLogo from '../assets/google.webp';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      fetch('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(user => {
          localStorage.setItem('user', JSON.stringify({ ...user, token }));
          localStorage.setItem('token', token);
          navigate('/learner');
        })
        .catch(() => setError('Google authentication failed.'));
    }
  }, [navigate]);

  const handleRoleSelect = async (role) => {
    if (!pendingUser) return;
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pendingUser.token}`
        },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        const updatedUser = { ...pendingUser, role };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('token', pendingUser.token);
        setShowRoleModal(false);
        if (role === 'learner') navigate('/learner');
        else if (role === 'tutor') navigate('/tutor');
        else setError('Role not supported.');
      } else {
        setError('Failed to update role.');
      }
    } catch {
      setError('Failed to update role.');
    }
  };

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
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
              <input 
                type="email" 
                className="form-control form-control-lg" 
                placeholder={t('Email')} 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
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
          <div className="text-center my-3" style={{fontWeight:500}}>OR</div>
          <button
            type="button"
            className="w-100 d-flex align-items-center justify-content-center py-3 mb-2"
            style={{
              background: '#e6f0f6',
              border: '1.5px solid #b6e0fa',
              borderRadius: 10,
              fontSize: '1.15rem',
              fontWeight: 500,
              color: '#222',
              outline: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
              marginBottom: 16
            }}
            onClick={() => window.location.href = '/api/auth/google'}
          >
            <img src={googleLogo} alt="Google" style={{width:28, height:28, marginRight:16}} />
            Continue With Google
          </button>
          <div className="text-center mt-3">
            <span className="text-muted">{t("Don't have an account?")} </span>
            <Link to="/signup" className="footer-link" style={{color: 'var(--main-color)', fontWeight: 500}}>{t('Sign Up')}</Link>
          </div>
        </div>
      </div>
      <Footer />
      {/* Role selection modal for Google login */}
      {showRoleModal && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:12,padding:32,minWidth:320,boxShadow:'0 4px 32px rgba(56,189,248,0.10)'}}>
            <h4 style={{fontWeight:700,marginBottom:16}}>Choose Your Role</h4>
            <p style={{marginBottom:24}}>Please select whether you are a learner or a tutor to continue.</p>
            <div className="d-flex gap-3 justify-content-center">
              <button className="btn btn-primary" style={{minWidth:120}} onClick={()=>handleRoleSelect('learner')}>Learner</button>
              <button className="btn btn-outline-primary" style={{minWidth:120}} onClick={()=>handleRoleSelect('tutor')}>Tutor</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login; 