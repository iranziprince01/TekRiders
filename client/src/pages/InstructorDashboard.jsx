import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiBook, FiPlus, FiBarChart2, FiBell, FiSettings, FiLogOut, FiTrash2, FiEdit2, FiUser, FiAward, FiStar, FiClock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import CourseCreationForm from '../components/CourseCreationForm';
import { localCourses } from '../services/db';
import { motion } from 'framer-motion';

export default function InstructorDashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState({
    name: user?.name || 'Jane Doe',
    email: user?.email || 'jane.doe@example.com',
    avatar: user?.avatar || 'https://ui-avatars.com/api/?name=Jane+Doe&size=200',
    bio: t('Passionate about teaching and technology. Helping students succeed in web development and programming.'),
    joinDate: 'March 2024',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Stats for instructor
  const stats = {
    courses: courses.length,
    students: courses.reduce((sum, c) => sum + (c.enrolled || 0), 0),
    avgRating: courses.length ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(2) : '-'
  };

  // StatCard component
  const StatCard = ({ icon: Icon, value, label }) => (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body text-center">
        <Icon className="display-4 text-primary mb-3" />
        <h3>{value}</h3>
        <p className="text-muted mb-0">{label}</p>
      </div>
    </div>
  );

  // Fetch instructor's courses
  useEffect(() => {
    if (!user) return;
    // Sample course for demonstration if no courses exist
    const sampleCourse = {
      _id: 'sample1',
      title: 'Web Development Fundamentals',
      description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
      status: 'approved',
      enrolled: 42,
      rating: 4.7,
      completionRate: 80,
      instructorId: user.id
    };
    localCourses.find({ selector: { instructorId: user.id } }).then(res => {
      if (res.docs.length === 0) {
        setCourses([sampleCourse]);
      } else {
        setCourses(res.docs);
      }
    });
  }, [user, showForm]);

  // Delete course
  const handleDelete = async (courseId) => {
    if (!window.confirm(t('Are you sure you want to delete this course?'))) return;
    const doc = await localCourses.get(courseId);
    await localCourses.remove(doc);
    setCourses(courses.filter(c => c._id !== courseId));
  };

  // Sidebar navigation
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

  // For avatar upload preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Main content
  let mainContent;
  if (activeTab === 'profile') {
    mainContent = (
      <div className="container py-4">
        {/* Profile Header */}
        <div className="row mb-4">
          <div className="col-md-3 text-center">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="rounded-circle mb-3"
              style={{ width: 200, height: 200, objectFit: 'cover' }}
            />
            {isEditing && (
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
            )}
            <button className="btn btn-outline-primary" onClick={() => setIsEditing(v => !v)}>
              <FiEdit2 className="me-2" />
              {t('Edit Profile')}
            </button>
          </div>
          <div className="col-md-9">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                {!isEditing ? (
                  <>
                    <h2 className="mb-1">{profile.name}</h2>
                    <p className="text-muted mb-2">{profile.email}</p>
                    <p className="mb-3">{profile.bio}</p>
                    <div className="d-flex gap-3">
                      <div>
                        <FiClock className="me-2" />
                        {t('Joined')} {profile.joinDate}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      className="form-control form-control-lg mb-2"
                      value={profile.name}
                      onChange={e => setProfile({ ...profile, name: e.target.value })}
                      placeholder={t('Full Name')}
                    />
                    <input
                      type="email"
                      className="form-control form-control-lg mb-2"
                      value={profile.email}
                      onChange={e => setProfile({ ...profile, email: e.target.value })}
                      placeholder={t('Email')}
                    />
                    <textarea
                      className="form-control mb-2"
                      value={profile.bio}
                      onChange={e => setProfile({ ...profile, bio: e.target.value })}
                      rows={3}
                      placeholder={t('Bio')}
                    />
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      value={profile.avatar}
                      onChange={e => setProfile({ ...profile, avatar: e.target.value })}
                      placeholder={t('Avatar URL')}
                    />
                  </>
                )}
              </div>
              <button className="btn btn-outline-primary d-none">
                <FiSettings className="me-2" />
                {t('Settings')}
              </button>
            </div>
          </div>
        </div>
        {/* Stats Overview */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <StatCard icon={FiBook} value={stats.courses} label={t('Courses Uploaded')} />
          </div>
          <div className="col-md-4">
            <StatCard icon={FiAward} value={stats.students} label={t('Total Students')} />
          </div>
          <div className="col-md-4">
            <StatCard icon={FiStar} value={stats.avgRating} label={t('Average Rating')} />
          </div>
        </div>
      </div>
    );
  } else if (activeTab === 'upload') {
    mainContent = (
      <div className="p-4">
        <h3 className="mb-4">{t('Upload New Course')}</h3>
        <CourseCreationForm onSuccess={() => { setShowForm(false); setActiveTab('courses'); }} />
      </div>
    );
  } else if (activeTab === 'courses') {
    mainContent = (
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">{t('My Courses')}</h3>
          <button className="btn btn-primary" onClick={() => setActiveTab('upload')}>
            <FiPlus className="me-2" /> {t('Add New Course')}
          </button>
        </div>
        <div className="row g-4">
          {courses.length === 0 && <div className="text-muted">{t('No courses uploaded yet.')}</div>}
          {courses.map(course => (
            <div key={course._id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow rounded-4 overflow-hidden">
                <div className="card-header bg-white d-flex justify-content-between align-items-center border-0 pb-2 pt-3 px-4">
                  <h5 className="mb-0 text-truncate" style={{ maxWidth: '70%' }}>{course.title}</h5>
                  <span className={`badge px-3 py-2 rounded-pill fw-semibold ${
                    course.status === 'approved' ? 'bg-success-subtle text-success' :
                    course.status === 'pending' ? 'bg-warning-subtle text-warning' :
                    course.status === 'rejected' ? 'bg-danger-subtle text-danger' :
                    'bg-secondary-subtle text-secondary'
                  }`} style={{ fontSize: '0.95em' }}>
                    {t(course.status || 'Draft')}
                  </span>
                </div>
                <div className="card-body pt-3 pb-2 px-4 d-flex flex-column justify-content-between">
                  <p className="text-muted small mb-2" style={{ minHeight: 40 }}>{course.description}</p>
                  <div className="mb-3 d-flex flex-wrap gap-2">
                    <span className="badge bg-info-subtle text-info fw-normal">
                      {t('Enrolled')}: <b>{course.enrolled || 0}</b>
                    </span>
                    <span className="badge bg-warning-subtle text-warning fw-normal">
                      {t('Avg. Rating')}: <b>{course.rating || '-'}</b>
                    </span>
                    <span className="badge bg-success-subtle text-success fw-normal">
                      {t('Completion')}: <b>{course.completionRate || '-'}%</b>
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 pt-0 pb-3 px-4">
                  <div className="d-flex gap-2 justify-content-end">
                    <button className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={() => setSelectedCourse(course)}>
                      <FiEdit2 className="me-1" /> {t('Edit')}
                    </button>
                    <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={() => setActiveTab('analytics')}>
                      <FiBarChart2 className="me-1" /> {t('Analytics')}
                    </button>
                    <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={() => handleDelete(course._id)}>
                      <FiTrash2 className="me-1" /> {t('Delete')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (activeTab === 'analytics') {
    mainContent = (
      <div className="p-4">
        <h3 className="mb-4">{t('Course Analytics')}</h3>
        <div className="alert alert-info">{t('Analytics coming soon!')}</div>
      </div>
    );
  } else if (activeTab === 'notifications') {
    mainContent = (
      <div className="p-4">
        <h3 className="mb-4">{t('Notifications')}</h3>
        <div className="alert alert-info">{t('No notifications yet.')}</div>
      </div>
    );
  } else if (activeTab === 'settings') {
    mainContent = (
      <div className="p-4">
        <h3 className="mb-4">{t('Settings')}</h3>
        <div className="alert alert-info">{t('Settings coming soon!')}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="sidebar bg-white border-end" style={{ width: 260, position: 'fixed', height: '100vh' }}>
        <div className="p-4">
          <h3 className="mb-4">{t('TekRiders')}</h3>
          <SidebarItem icon={FiBook} label="My Courses" tab="courses" />
          <SidebarItem icon={FiPlus} label="Upload New Course" tab="upload" />
          <SidebarItem icon={FiBarChart2} label="Analytics" tab="analytics" />
          <SidebarItem icon={FiBell} label="Notifications" tab="notifications" />
          <SidebarItem icon={FiSettings} label="Settings" tab="settings" />
          <SidebarItem icon={FiUser} label="Profile" tab="profile" />
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