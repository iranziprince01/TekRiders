import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { t } = useTranslation();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (!role) {
      setShowRoleModal(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    const result = await signup(email, password, role);
    if (!result.success) {
      setError(result.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

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
        .catch(() => {});
    }
  }, [navigate]);

  return (
    <>
      <div className="auth-bg d-flex align-items-center justify-content-center min-vh-100" style={{background: 'linear-gradient(120deg, #e6f6fc 60%, #fafdff 100%)'}}>
        <div className="auth-card p-4 p-md-5 rounded-4 shadow-lg" style={{maxWidth: 400, width: '100%'}}>
          <div className="text-center mb-4">
            <h2 className="h4 mt-3 mb-2" style={{fontWeight: 700}}>{t('Sign Up')}</h2>
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
            <div className="mb-3">
              <select
                id="role"
                className="form-select form-select-lg"
                value={role}
                onChange={e => setRole(e.target.value)}
                required
                style={{ fontWeight: 500, color: role ? '#222' : '#888' }}
              >
                <option value="" disabled>Select Role</option>
                <option value="learner">Learner</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2 mt-2" style={{fontWeight: 600}}>{t('Sign Up')}</button>
            {success && <div className="alert alert-success mt-2">{t('Account created! You can now log in.')}</div>}
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </form>
          <div className="text-center mt-3">
            <span className="text-muted">{t('Already have an account?')} </span>
            <Link to="/login" className="footer-link" style={{color: 'var(--main-color)', fontWeight: 500}}>{t('Log In')}</Link>
          </div>
        </div>
      </div>
      <Footer />
      {/* Role selection modal */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Please Select a Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You must choose whether you are a learner or a tutor to continue.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowRoleModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Signup; 