import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Signup = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

  const submit = async e => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone, password, role })
    });
    const data = await res.json();
    if (res.ok) {
      alert('Registered successfully');
      window.location.href = '/login';
    } else {
      alert(data.message || 'Signup failed');
    }
  };

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
            <div className="mb-3">
              <PhoneInput
                country={'rw'}
                value={phone}
                onChange={phone => setPhone(phone)}
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
                className="form-select form-select-lg" 
                required
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="">{t('Select your role')}</option>
                <option value="student">{t('Student')}</option>
                <option value="instructor">{t('Instructor')}</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2 mt-2" style={{fontWeight: 600}}>{t('Sign Up')}</button>
          </form>
          <div className="text-center mt-3">
            <span className="text-muted">{t('Already have an account?')} </span>
            <Link to="/login" className="footer-link" style={{color: 'var(--main-color)', fontWeight: 500}}>{t('Log In')}</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup; 