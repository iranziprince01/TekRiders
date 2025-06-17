import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateProfile, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: user?.address || '',
    avatar: user?.avatar || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => ({ ...f, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const result = await updateProfile(user._id, form);
      if (result.success) {
        // Fetch updated profile and update AuthContext
        const token = localStorage.getItem('token');
        const res = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const updatedUser = await res.json();
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        setSuccess(t('Profile updated successfully'));
        setIsEditing(false);
      } else {
        setError(result.message || t('Failed to update profile'));
      }
    } catch (err) {
      setError(t('An error occurred while updating profile'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container py-4">
      {/* Profile Header */}
      <div className="row mb-4">
        <div className="col-md-3 text-center">
          <img
            src={form.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(form.firstName + ' ' + form.lastName) + '&size=200'}
            alt={form.firstName + ' ' + form.lastName}
            className="rounded-circle mb-3"
            style={{ width: 200, height: 200, objectFit: 'cover' }}
          />
          <button className="btn btn-outline-primary" onClick={() => setIsEditing(e => !e)}>
                <FiEdit2 className="me-2" />
                {t('Edit Profile')}
          </button>
        </div>
        <div className="col-md-9">
          <div className="d-flex flex-column align-items-start">
            <h2 className="mb-1">{form.firstName} {form.lastName}</h2>
            <p className="text-muted mb-2">{user?.role}</p>
            <p className="mb-3">{form.address}</p>
            <p className="mb-3">{form.email}</p>
          </div>
        </div>
      </div>
      {isEditing && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">{t('First Name')}</label>
              <input className="form-control" name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">{t('Last Name')}</label>
              <input className="form-control" name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">{t('Address')}</label>
              <input className="form-control" name="address" value={form.address} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">{t('Email')}</label>
              <input className="form-control" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label">{t('Profile Picture')}</label>
              <input className="form-control" type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary me-2" type="submit" disabled={loading}>{loading ? t('Saving...') : t('Save')}</button>
            <button className="btn btn-secondary" type="button" onClick={() => setIsEditing(false)}>{t('Cancel')}</button>
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">{success}</div>}
        </form>
      )}
    </div>
  );
};

export default Profile; 