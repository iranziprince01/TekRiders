import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [offlineError, setOfflineError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Offline session check
    if (!navigator.onLine) {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        setOfflineMode(true);
        setLoading(false);
      } else {
        setOfflineError('You must log in at least once while online to use offline features.');
        setLoading(false);
      }
      return;
    }
    // Online: normal logic
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else if (token) {
      // If token exists but no user, fetch latest profile from backend
      fetch('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(profile => {
          const userData = { ...profile, token };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (!navigator.onLine) {
      return { success: false, message: 'You must be online to log in.' };
    }
    try {
      const payload = { email, password };
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        const token = data.token;
        // Fetch the full user profile
        const profileRes = await fetch('/api/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profile = await profileRes.json();

        const userData = {
          ...profile,
          token,
        };
        if (!userData._id && profile.id) userData._id = profile.id;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        setUser(userData);
        setOfflineMode(false);
        
        // Redirect based on role
        if (userData.role === 'learner') {
          navigate('/learner');
        } else if (userData.role === 'tutor') {
          navigate('/tutor');
        } else if (userData.role === 'admin') {
          navigate('/admin');
        }
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setOfflineMode(false);
    navigate('/login');
  };

  const signup = async (email, password, role) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const updateProfile = async (userId, updates) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Update the user state and localStorage with new data
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true, data: updatedUser };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    setUser,
    updateProfile,
    offlineMode,
    offlineError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && (offlineError ? <div style={{color:'red',textAlign:'center',marginTop:'2rem'}}>{offlineError}</div> : children)}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 