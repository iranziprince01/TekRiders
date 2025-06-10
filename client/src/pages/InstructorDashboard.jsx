import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiBook, FiPlus, FiBarChart2, FiBell, FiSettings, FiLogOut, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import CourseCreationForm from '../components/CourseCreationForm';
import CourseAnalytics from '../components/CourseAnalytics';
import UserProfile from '../components/UserProfile';

const TABS = [
  { key: 'courses', label: 'My Courses', icon: FiBook },
  { key: 'upload', label: 'Upload', icon: FiPlus },
  { key: 'analytics', label: 'Analytics', icon: FiBarChart2 },
  { key: 'notifications', label: 'Notifications', icon: FiBell },
  { key: 'profile', label: 'Profile', icon: FiUser },
  { key: 'settings', label: 'Settings', icon: FiSettings },
];

export default function TutorDashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({});
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    language: 'en',
    price: 0,
    thumbnail: null
  });
  const [sections, setSections] = useState([
    {
      id: 1,
      title: '',
      lessons: [
        {
          id: 1,
          title: '',
          type: 'video',
          content: null,
          duration: '',
          description: ''
        }
      ]
    }
  ]);

  // Fetch tutor's courses
  const fetchCourses = async () => {
    if (!user || !user._id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/courses/instructor/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data = await res.json();
      console.log('InstructorDashboard fetched courses:', data);
      console.log('InstructorDashboard user._id:', user._id);
      setCourses(data);
    } catch (err) {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, [user]);

  // Fetch notifications when tab is active
  useEffect(() => {
    if (activeTab === 'notifications') {
      fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(setNotifications)
        .catch(() => setNotifications([]));
    }
  }, [activeTab]);

  // Fetch settings when tab is active
  useEffect(() => {
    if (activeTab === 'settings' && user?._id) {
      setSettingsLoading(true);
      fetch(`/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => { setSettings(data.settings || {}); setSettingsLoading(false); })
        .catch(() => { setSettings({}); setSettingsLoading(false); });
    }
  }, [activeTab, user]);

  // Delete course (local only, for now)
  const handleDelete = async (courseId) => {
    if (!window.confirm(t('Are you sure you want to delete this course?'))) return;
    setCourses(courses.filter(c => c._id !== courseId));
  };

  // Status badge color
  const statusColor = (status) => {
    if (status === 'approved') return 'success';
    if (status === 'pending') return 'warning';
    if (status === 'draft') return 'secondary';
    return 'info';
  };

  // Filtered courses
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    course.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Sidebar
  const SidebarItem = ({ icon: Icon, label, tab }) => (
    <div
      className={`sidebar-item d-flex align-items-center p-3 mb-2 rounded-3 cursor-pointer ${activeTab === tab ? 'bg-primary text-white' : 'hover-bg-light'}`}
      onClick={() => setActiveTab(tab)}
      style={{ cursor: 'pointer' }}
    >
      <Icon className="me-3" size={20} />
      <span>{t(label)}</span>
    </div>
  );

  // Main content for each tab
  let mainContent;
  if (activeTab === 'courses') {
    mainContent = (
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>{t('My Courses')}</h2>
          <button className="btn btn-primary" onClick={() => setActiveTab('upload')}>
            <FiPlus className="me-2" /> {t('Upload New Course')}
          </button>
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder={t('Search courses...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="text-center py-5">{t('Loading...')}</div>
        ) : filteredCourses.length === 0 ? (
          <div className="alert alert-info">{t('No courses found. Click "Upload New Course" to add your first course.')}</div>
        ) : (
          <div className="row g-4">
            {filteredCourses.map(course => (
              <div key={course._id} className="col-md-6 col-lg-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{course.title}</h5>
                    <p className="card-text">{course.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className={`badge bg-${statusColor(course.status)}`}>{course.status}</span>
                      <div>
                        <button className="btn btn-sm btn-outline-primary me-2" title={t('Edit')}>
                          <FiEdit2 />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(course._id)} title={t('Delete')}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } else if (activeTab === 'upload') {
    mainContent = (
      <div className="container py-4">
        <h2 className="mb-4">{t('Upload New Course')}</h2>
        <CourseCreationForm
          onSuccess={() => { setActiveTab('courses'); fetchCourses(); }}
          formData={formData}
          setFormData={setFormData}
          sections={sections}
          setSections={setSections}
        />
      </div>
    );
  } else if (activeTab === 'analytics') {
    mainContent = (
      <div className="container py-4">
        <h2 className="mb-4">{t('Course Analytics')}</h2>
        <CourseAnalytics courses={courses} />
      </div>
    );
  } else if (activeTab === 'profile') {
    mainContent = (
      <div className="container py-4">
        <UserProfile />
      </div>
    );
  } else if (activeTab === 'notifications') {
    mainContent = (
      <div className="container py-4">
        <h2 className="mb-4">{t('Notifications')}</h2>
        {notifications.length === 0 ? (
          <div className="alert alert-info">{t('No notifications yet.')}</div>
        ) : (
          <ul className="list-group">
            {notifications.map(n => (
              <li key={n._id} className={`list-group-item d-flex justify-content-between align-items-center${n.read ? ' text-muted' : ''}`}>
                <span>{n.message}</span>
                {!n.read && <button className="btn btn-sm btn-outline-primary" onClick={() => markNotificationRead(n._id)}>{t('Mark as read')}</button>}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  } else if (activeTab === 'settings') {
    const handleSettingsChange = e => setSettings(s => ({ ...s, [e.target.name]: e.target.value }));
    const handleSettingsSubmit = async e => {
      e.preventDefault();
      setSettingsLoading(true); setSettingsError(''); setSettingsSuccess('');
      try {
        const res = await fetch(`/api/users/${user._id}/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(settings)
        });
        if (!res.ok) throw new Error('Failed to update settings');
        setSettingsSuccess(t('Settings updated successfully!'));
      } catch {
        setSettingsError(t('Error updating settings.'));
      } finally {
        setSettingsLoading(false);
      }
    };
    const markNotificationRead = async (id) => {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(notifications => notifications.map(n => n._id === id ? { ...n, read: true } : n));
    };
    mainContent = (
      <div className="container py-4">
        <h2 className="mb-4">{t('Settings')}</h2>
        <form onSubmit={handleSettingsSubmit} className="mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">{t('Language')}</label>
              <select className="form-select" name="language" value={settings.language || ''} onChange={handleSettingsChange}>
                <option value="">{t('Select language')}</option>
                <option value="en">English</option>
                <option value="rw">Kinyarwanda</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">{t('Email Notifications')}</label>
              <select className="form-select" name="emailNotifications" value={settings.emailNotifications || ''} onChange={handleSettingsChange}>
                <option value="">{t('Select')}</option>
                <option value="on">{t('On')}</option>
                <option value="off">{t('Off')}</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary me-2" type="submit" disabled={settingsLoading}>{settingsLoading ? t('Saving...') : t('Save')}</button>
          </div>
          {settingsError && <div className="alert alert-danger mt-3">{settingsError}</div>}
          {settingsSuccess && <div className="alert alert-success mt-3">{settingsSuccess}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="dashboard-container d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="sidebar bg-white border-end" style={{ width: 260, position: 'fixed', height: '100vh' }}>
        <div className="p-4">
          <h3 className="mb-4">{t('TekRiders')}</h3>
          {TABS.map(tab => (
            <SidebarItem key={tab.key} icon={tab.icon} label={tab.label} tab={tab.key} />
          ))}
          <div className="sidebar-item d-flex align-items-center p-3 mt-4 rounded-3 cursor-pointer text-danger" onClick={logout} style={{ cursor: 'pointer' }}>
            <FiLogOut className="me-3" size={20} />
            <span>{t('Logout')}</span>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div style={{ marginLeft: 260, width: '100%' }}>{mainContent}</div>
    </div>
  );
} 