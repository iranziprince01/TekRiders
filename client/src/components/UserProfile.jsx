import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiEdit2, FiAward, FiBook, FiClock, FiStar, FiSettings, FiUser } from 'react-icons/fi';

const UserProfile = () => {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    lastName: user?.lastName || '',
    profession: user?.profession || '',
    address: user?.address || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    phone: user?.phone || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      setSuccess(t('Profile updated successfully!'));
      setEditing(false);
      // Fetch updated profile and update AuthContext
      const updatedRes = await fetch(`/api/users/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (updatedRes.ok) {
        const updatedUser = await updatedRes.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      setError(t('Error updating profile.'));
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ icon: Icon, label, active, onClick }) => (
    <button
      className={`btn ${active ? 'btn-primary' : 'btn-outline-primary'} me-2`}
      onClick={onClick}
    >
      <Icon className="me-2" />
      {label}
    </button>
  );

  const StatCard = ({ icon: Icon, value, label }) => (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body text-center">
        <Icon className="display-4 text-primary mb-3" />
        <h3>{value}</h3>
        <p className="text-muted mb-0">{label}</p>
      </div>
    </div>
  );

  const CourseCard = ({ course }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="card border-0 shadow-sm mb-3"
    >
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="img-fluid rounded-start h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{course.title}</h5>
            <div className="mb-3">
              <div className="progress" style={{ height: 6 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <small className="text-muted">
                {course.progress}% {t('complete')}
              </small>
            </div>
            <p className="text-muted small mb-0">
              {t('Last accessed')}: {course.lastAccessed}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const CertificateCard = ({ certificate }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="card border-0 shadow-sm mb-3"
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="mb-1">{certificate.title}</h5>
            <p className="text-muted small mb-0">
              {t('Issued by')}: {certificate.issuer}
            </p>
            <p className="text-muted small mb-0">
              {t('Date')}: {certificate.issueDate}
            </p>
          </div>
          <button className="btn btn-outline-primary">
            {t('View')}
          </button>
        </div>
      </div>
    </motion.div>
  );

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
          <button className="btn btn-outline-primary" onClick={() => setEditing(e => !e)}>
            <FiEdit2 className="me-2" />
            {t('Edit Profile')}
          </button>
        </div>
        <div className="col-md-9">
          <div className="d-flex flex-column align-items-start">
            <h2 className="mb-1">{form.firstName} {form.middleName} {form.lastName}</h2>
            <p className="text-muted mb-2">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}</p>
            <p className="mb-3">{form.profession}</p>
            <p className="mb-3">{form.address}</p>
            <p className="mb-3">{form.email}</p>
            {form.phone && <p className="mb-3">{form.phone}</p>}
          </div>
        </div>
      </div>

      {/* Tutor Stats Overview */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <StatCard
            icon={FiBook}
            value={user?.stats?.coursesPublished || 0}
            label={t('Courses Published')}
          />
        </div>
        <div className="col-md-6">
          <StatCard
            icon={FiUser}
            value={user?.stats?.totalLearners || 0}
            label={t('Total Learners Enrolled')}
          />
        </div>
      </div>

      {/* No tabs for tutor profile */}

      {editing && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">{t('First Name')}</label>
              <input className="form-control" name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">{t('Middle Name')}</label>
              <input className="form-control" name="middleName" value={form.middleName} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">{t('Last Name')}</label>
              <input className="form-control" name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">{t('Profession')}</label>
              <input className="form-control" name="profession" value={form.profession} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">{t('Address')}</label>
              <input className="form-control" name="address" value={form.address} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">{t('Email')}</label>
              <input className="form-control" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">{t('Phone')}</label>
              <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="col-12">
              <label className="form-label">{t('Profile Picture')}</label>
              <input className="form-control" type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary me-2" type="submit" disabled={loading}>{loading ? t('Saving...') : t('Save')}</button>
            <button className="btn btn-secondary" type="button" onClick={() => setEditing(false)}>{t('Cancel')}</button>
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">{success}</div>}
        </form>
      )}
    </div>
  );
};

export default UserProfile; 