import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function RoleSelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get token from query or localStorage
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get('token') || localStorage.getItem('token');

  const handleRoleSelect = async (role) => {
    setLoading(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem('user', JSON.stringify({ ...user, token, role }));
        localStorage.setItem('token', token);
        if (role === 'learner') navigate('/learner');
        else if (role === 'tutor') navigate('/tutor');
        else setError('Role not supported.');
      } else {
        setError('Failed to update role.');
      }
    } catch {
      setError('Failed to update role.');
    }
    setLoading(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{background: 'linear-gradient(120deg, #e6f6fc 60%, #fafdff 100%)'}}>
      <div className="auth-card p-4 p-md-5 rounded-4 shadow-lg" style={{maxWidth: 400, width: '100%'}}>
        <div className="text-center mb-4">
          <h2 className="h4 mt-3 mb-2" style={{fontWeight: 700}}>Choose Your Role</h2>
          <p>Please select whether you are a learner or a tutor to continue.</p>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="d-flex gap-3 justify-content-center">
          <button className="btn btn-primary" style={{minWidth:120}} onClick={()=>handleRoleSelect('learner')} disabled={loading}>Learner</button>
          <button className="btn btn-outline-primary" style={{minWidth:120}} onClick={()=>handleRoleSelect('tutor')} disabled={loading}>Tutor</button>
        </div>
      </div>
    </div>
  );
} 