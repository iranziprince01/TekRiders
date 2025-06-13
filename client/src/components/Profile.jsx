import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    address: '',
    avatar: ''
  });

  const [formData, setFormData] = useState(profile);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      const userProfile = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        profession: user.profession || '',
        address: user.address || '',
        avatar: user.avatar || ''
      };
      setProfile(userProfile);
      setFormData(userProfile);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const result = await updateProfile(user._id, formData);
      if (result.success) {
        setProfile(result.data);
        setSuccess(t('Profile updated successfully'));
        setIsEditing(false);
      } else {
        setError(result.message || t('Failed to update profile'));
      }
    } catch (err) {
      setError(t('An error occurred while updating profile'));
    }
  };

  const ProfileField = ({ label, value, name, type = 'text' }) => (
    <div className="mb-3">
      <label className="form-label text-muted">{label}</label>
      {isEditing ? (
        <input
          type={type}
          className="form-control"
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
        />
      ) : (
        <p className="mb-0">{value || t('Not specified')}</p>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{t('Profile Information')}</h5>
          <button
            className={`btn ${isEditing ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <FiX className="me-2" />
                {t('Cancel')}
              </>
            ) : (
              <>
                <FiEdit2 className="me-2" />
                {t('Edit Profile')}
              </>
            )}
          </button>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 text-center mb-4">
                <img
                  src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&size=200`}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="rounded-circle mb-3"
                  style={{ width: 150, height: 150, objectFit: 'cover' }}
                />
              </div>
              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-6">
                    <ProfileField
                      label={t('First Name')}
                      value={profile.firstName}
                      name="firstName"
                    />
                    <ProfileField
                      label={t('Last Name')}
                      value={profile.lastName}
                      name="lastName"
                    />
                    <ProfileField
                      label={t('Email')}
                      value={profile.email}
                      name="email"
                      type="email"
                    />
                    <ProfileField
                      label={t('Phone')}
                      value={profile.phone}
                      name="phone"
                    />
                  </div>
                  <div className="col-md-6">
                    <ProfileField
                      label={t('Profession')}
                      value={profile.profession}
                      name="profession"
                    />
                    <ProfileField
                      label={t('Address')}
                      value={profile.address}
                      name="address"
                    />
                  </div>
                </div>
              </div>
            </div>
            {isEditing && (
              <div className="text-end mt-4">
                <button type="submit" className="btn btn-primary">
                  <FiSave className="me-2" />
                  {t('Save Changes')}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile; 