import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Profile = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+250 123 456 789',
    bio: 'Passionate about learning programming and technology.',
    location: 'Kigali, Rwanda',
    interests: ['Web Development', 'Mobile Apps', 'Data Science'],
    education: 'High School Graduate',
    skills: ['HTML', 'CSS', 'JavaScript', 'Python'],
    languages: ['English', 'Kinyarwanda', 'French']
  });

  const [formData, setFormData] = useState(profile);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (e, field) => {
    const values = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({
      ...prev,
      [field]: values
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to update profile
    setProfile(formData);
    setIsEditing(false);
  };

  const ProfileField = ({ label, value, name, type = 'text', isArray = false }) => (
    <div className="mb-3">
      <label className="form-label text-muted">{label}</label>
      {isEditing ? (
        isArray ? (
          <input
            type="text"
            className="form-control"
            value={formData[name].join(', ')}
            onChange={(e) => handleArrayInputChange(e, name)}
            placeholder={`Enter ${label.toLowerCase()} separated by commas`}
          />
        ) : (
          <input
            type={type}
            className="form-control"
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
          />
        )
      ) : (
        <p className="mb-0">{isArray ? value.join(', ') : value}</p>
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
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 text-center mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${profile.name}&size=200`}
                  alt={profile.name}
                  className="rounded-circle mb-3"
                  style={{ width: 150, height: 150 }}
                />
                {isEditing && (
                  <div className="mb-3">
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        // TODO: Implement image upload
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-6">
                    <ProfileField
                      label={t('Full Name')}
                      value={profile.name}
                      name="name"
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
                    <ProfileField
                      label={t('Location')}
                      value={profile.location}
                      name="location"
                    />
                  </div>
                  <div className="col-md-6">
                    <ProfileField
                      label={t('Education')}
                      value={profile.education}
                      name="education"
                    />
                    <ProfileField
                      label={t('Bio')}
                      value={profile.bio}
                      name="bio"
                    />
                    <ProfileField
                      label={t('Interests')}
                      value={profile.interests}
                      name="interests"
                      isArray
                    />
                    <ProfileField
                      label={t('Skills')}
                      value={profile.skills}
                      name="skills"
                      isArray
                    />
                    <ProfileField
                      label={t('Languages')}
                      value={profile.languages}
                      name="languages"
                      isArray
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