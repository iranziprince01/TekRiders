import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiBook, FiUser, FiBell, FiBarChart2, FiCalendar, 
  FiBookmark, FiDownload, FiSettings, FiLogOut, FiAward, FiTarget, FiVolume2, FiGlobe, FiHeadphones, FiMic, FiEye, FiMessageCircle, FiStar, FiPieChart, FiCheckCircle, FiFolder, FiFileText, FiBarChart, FiChevronDown, FiChevronUp, FiHome
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import Profile from '../components/Profile';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const LearnerDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    completedCourses: 0,
    inProgress: 0,
    certificates: 0,
    totalHours: 0
  });
  const [timeRange, setTimeRange] = useState('week');
  const [expanded, setExpanded] = useState({});
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [homeLoading, setHomeLoading] = useState(false);
  const [homeError, setHomeError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [tutors, setTutors] = useState({});

  const toggleSection = (section) => setExpanded(prev => ({ ...prev, [section]: !prev[section] }));

  // Helper to title-case words, but keep 'AI' uppercase
  function toTitleCase(str) {
    if (!str) return '';
    return str.split(' ').map(word => word === 'AI' ? 'AI' : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }

  const SidebarSection = ({ icon: Icon, title, sectionKey, children }) => (
    <div className="mb-4">
      <div className="d-flex align-items-center justify-content-between sidebar-section-header px-2 py-2 mb-2" style={{cursor:'pointer', fontSize:'1.09rem', color:'#222', fontWeight:600, letterSpacing:'0.01em', textTransform:'none'}} onClick={() => toggleSection(sectionKey)}>
        <span className="d-flex align-items-center"><Icon className="me-2" size={20} /> {toTitleCase(title)}</span>
        {children && (expanded[sectionKey] ? <FiChevronUp /> : <FiChevronDown />)}
      </div>
      {(!children || expanded[sectionKey]) && <div className="ps-2">{children}</div>}
    </div>
  );

  // Sidebar menu items for learner dashboard (no dropdowns, new order)
  const sidebarMenus = [
    { label: 'Home', tab: 'home', icon: FiHome },
    { label: 'My Courses', tab: 'courses', icon: FiBook },
    { label: 'Progress', tab: 'progress', icon: FiTarget },
    { label: 'Achievements', tab: 'achievements', icon: FiAward },
    { label: 'Accessibility', tab: 'accessibility', icon: FiVolume2 },
        { label: 'Profile', tab: 'profile', icon: FiUser },
  ];

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API calls
    setCourses([
      {
        id: 1,
        title: 'Introduction to Programming',
        progress: 75,
        lastAccessed: '2024-03-20',
        tutor: 'John Doe',
        thumbnail: 'https://picsum.photos/300/200'
      },
      // Add more courses...
    ]);

    setNotifications([
      {
        id: 1,
        type: 'course',
        message: 'New module available in Introduction to Programming',
        time: '2 hours ago'
      },
      // Add more notifications...
    ]);
  }, []);

  // Fetch approved courses for Home tab
  useEffect(() => {
    if (activeTab === 'home') {
      setHomeLoading(true);
      setHomeError('');
      axios.get('/api/courses/approved')
        .then(res => {
          setApprovedCourses(res.data);
          setHomeLoading(false);
        })
        .catch(err => {
          setHomeError('Failed to load courses.');
          setHomeLoading(false);
        });
    }
  }, [activeTab]);

  // Unique categories for filter
  const categories = Array.from(new Set(approvedCourses.map(c => c.category).filter(Boolean)));

  // Filtered courses
  const filteredCourses = approvedCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || (course.description && course.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !category || course.category === category;
    return matchesSearch && matchesCategory;
  });

  const enrollmentData = [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 6 },
    { name: 'Wed', value: 8 },
    { name: 'Thu', value: 7 },
    { name: 'Fri', value: 9 },
    { name: 'Sat', value: 11 },
    { name: 'Sun', value: 12 }
  ];

  const demographicsData = [
    { name: t('Male'), value: 45 },
    { name: t('Female'), value: 55 }
  ];

  const topLessons = [
    { title: t('Introduction to Programming'), completion: '85%', score: 92, learners: 120 },
    { title: t('Web Development Basics'), completion: '78%', score: 88, learners: 95 },
    { title: t('Data Structures'), completion: '65%', score: 82, learners: 75 }
  ];

  const recentActivity = [
    { type: t('Assignment'), course: t('Web Development'), date: '2024-03-15', status: t('Completed') },
    { type: t('Quiz'), course: t('Programming'), date: '2024-03-14', status: t('In Progress') },
    { type: t('Project'), course: t('Data Science'), date: '2024-03-13', status: t('Not Started') }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const accentColor = '#ffb300'; // Example accent color, adjust as needed or use your theme variable
  const grayColor = '#666'; // Use a neutral gray for inactive
  const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.03, backgroundColor: 'rgba(56, 189, 248, 0.08)' }}
      whileTap={{ scale: 0.98 }}
      className={`sidebar-item d-flex align-items-center mb-2 rounded-4 px-3 py-2 fw-normal ${active ? 'bg-primary text-white shadow-sm' : ''}`}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        transition: 'background 0.2s, color 0.2s',
        fontSize: '0.98rem',
        letterSpacing: '0.01em',
        boxShadow: active ? '0 2px 8px rgba(56, 189, 248, 0.13)' : undefined,
        color: active ? undefined : grayColor,
        textTransform: 'none',
        fontWeight: active ? 500 : 400
      }}
    >
      <Icon className="me-3" size={19} />
      <span>{toTitleCase(label)}</span>
    </motion.div>
  );

  // Get user details from AuthContext
  const displayName = user?.firstName || user?.name || user?.email?.split('@')[0] || '';
  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=200`;

  // Fetch tutor info for each course
  useEffect(() => {
    const fetchTutors = async () => {
      const tutorIds = Array.from(new Set(filteredCourses.map(c => c.author).filter(Boolean)));
      const tutorData = {};
      await Promise.all(tutorIds.map(async (id) => {
        try {
          const res = await axios.get(`/api/users/${id}`);
          tutorData[id] = res.data;
        } catch (e) {
          tutorData[id] = null;
        }
      }));
      setTutors(tutorData);
    };
    if (activeTab === 'home' && filteredCourses.length > 0) fetchTutors();
    // eslint-disable-next-line
  }, [activeTab, filteredCourses.length]);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'courses':
        return (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">{t('My Courses')}</h5>
            </div>
            <div className="card-body">
              <div className="row g-4">
                {courses.map(course => (
                  <div key={course.id} className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <img 
                        src={course.thumbnail} 
                        className="card-img-top" 
                        alt={course.title}
                        style={{ height: 160, objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h6 className="card-title">{course.title}</h6>
                        <p className="text-muted small mb-2">{course.tutor}</p>
                        <div className="progress mb-2" style={{ height: 6 }}>
                          <div 
                            className="progress-bar" 
                            role="progressbar" 
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">{course.progress}% {t('complete')}</small>
                          <Link to={`/course/${course.id}`} className="btn btn-sm btn-primary">
                            {t('Continue')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">{t('Notifications')}</h5>
            </div>
            <div className="card-body">
              {notifications.map(notification => (
                <div key={notification.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <div className="flex-grow-1">
                    <p className="mb-0">{t(notification.message)}</p>
                    <small className="text-muted">{t(notification.time)}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'home':
        return (
          <div className="container-fluid px-0">
            <div className="d-flex flex-wrap align-items-center mb-4 gap-3">
              <input
                className="form-control"
                style={{ maxWidth: 320 }}
                placeholder={t('Search courses...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className="form-select"
                style={{ maxWidth: 220 }}
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">{t('All Categories')}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {homeLoading ? (
              <div className="text-center py-5">{t('Loading...')}</div>
            ) : homeError ? (
              <div className="alert alert-danger">{homeError}</div>
            ) : filteredCourses.length === 0 ? (
              <div className="alert alert-info">{t('No courses found.')}</div>
            ) : (
              <div className="row g-4">
                {filteredCourses.map(course => (
                  <div key={course._id} className="col-md-4 col-lg-3">
                    <div className="card h-100 border-0 shadow-sm">
                      <img
                        src={course.thumbnail ? `/api/uploads/${course.thumbnail}` : 'https://picsum.photos/300/200'}
                        className="card-img-top"
                        alt={course.title}
                        style={{ height: 160, objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h6 className="card-title fw-bold">{course.title}</h6>
                        <p className="text-muted small mb-2">{course.category} &bull; {course.language?.toUpperCase()}</p>
                        <p className="small mb-2" style={{ minHeight: 48 }}>{course.description?.slice(0, 80)}{course.description?.length > 80 ? '...' : ''}</p>
                        <div className="d-flex align-items-center mt-2">
                          <span className="me-2" style={{ fontSize: 13, color: '#888' }}>{t('By')} {tutors[course.author]?.firstName || ''} {tutors[course.author]?.lastName || 'Tutor'}</span>
                        </div>
                        <Link to={`/course/${course._id}`} className="btn btn-primary btn-sm mt-2">Enroll Now</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return (
          <>
            {/* Stats Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted mb-2">{t('Completed Courses')}</h6>
                    <h3 className="mb-0">{stats.completedCourses}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted mb-2">{t('In Progress')}</h6>
                    <h3 className="mb-0">{stats.inProgress}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted mb-2">{t('Certificates')}</h6>
                    <h3 className="mb-0">{stats.certificates}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted mb-2">{t('Total Hours')}</h6>
                    <h3 className="mb-0">{stats.totalHours}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Courses */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0">{t('Recent Courses')}</h5>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  {courses.map(course => (
                    <div key={course.id} className="col-md-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <img 
                          src={course.thumbnail} 
                          className="card-img-top" 
                          alt={course.title}
                          style={{ height: 160, objectFit: 'cover' }}
                        />
                        <div className="card-body">
                          <h6 className="card-title">{course.title}</h6>
                          <p className="text-muted small mb-2">{course.tutor}</p>
                          <div className="progress mb-2" style={{ height: 6 }}>
                            <div 
                              className="progress-bar" 
                              role="progressbar" 
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">{course.progress}% {t('complete')}</small>
                            <Link to={`/course/${course.id}`} className="btn btn-sm btn-primary">
                              {t('Continue')}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0">{t('Recent Notifications')}</h5>
              </div>
              <div className="card-body">
                {notifications.map(notification => (
                  <div key={notification.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <div className="flex-grow-1">
                      <p className="mb-0">{t(notification.message)}</p>
                      <small className="text-muted">{t(notification.time)}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard-container d-flex" style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e6f6fc 60%, #fafdff 100%)' }}>
      {/* Sidebar */}
      <div className="sidebar border-end shadow-lg d-flex flex-column" style={{ width: 300, position: 'fixed', height: '100vh', background: 'rgba(255,255,255,0.97)', borderRadius: '0 2rem 2rem 0', boxShadow: '0 4px 32px rgba(56, 189, 248, 0.10)', justifyContent: 'space-between' }}>
        <div className="p-4" style={{ marginTop: '2.5rem' }}>
          {sidebarMenus.map((item, idx) => (
            <motion.div
                  key={item.tab}
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(56, 189, 248, 0.08)' }}
              whileTap={{ scale: 0.98 }}
              className={`sidebar-item d-flex align-items-center rounded-4 px-3 py-2 fw-normal ${activeTab === item.tab ? 'bg-primary text-white shadow-sm' : ''}`}
                  onClick={() => setActiveTab(item.tab)}
              style={{
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
                fontSize: '0.98rem',
                letterSpacing: '0.01em',
                boxShadow: activeTab === item.tab ? '0 2px 8px rgba(56, 189, 248, 0.13)' : undefined,
                color: activeTab === item.tab ? undefined : '#666',
                textTransform: 'none',
                fontWeight: activeTab === item.tab ? 500 : 400,
                marginBottom: idx !== sidebarMenus.length - 1 ? '1.2rem' : 0 // Add gap between items
              }}
            >
              <item.icon className="me-3" size={19} />
              <span>{toTitleCase(item.label)}</span>
            </motion.div>
          ))}
        </div>
        <div className="p-4" style={{ position: 'absolute', bottom: '7rem', width: '100%' }}>
          <div
            className="sidebar-item d-flex align-items-center p-3 rounded-3 cursor-pointer text-danger"
            onClick={() => { logout(); navigate('/login'); }}
            style={{ cursor: 'pointer', color: '#e53935', fontWeight: 600, fontSize: '1.08rem', background: 'none' }}
          >
            <FiLogOut className="me-3" size={20} />
            <span>{t('Logout')}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1" style={{ marginLeft: 300 }}>
        <div className="p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-3">
              <img
                src={avatarUrl}
                alt={displayName}
                className="rounded-circle"
                style={{ width: 44, height: 44, objectFit: 'cover', border: '2px solid #e3e3e3' }}
              />
              <div>
                <h2 className="mb-0" style={{ fontSize: '1.45rem' }}>{t('Welcome back')}, <span className="text-primary">{displayName}</span></h2>
                <div className="text-muted" style={{ fontSize: '1.02rem' }}>{user?.email}</div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="position-relative me-3">
                <FiBell size={24} className="text-muted" />
                {notifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {notifications.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard; 