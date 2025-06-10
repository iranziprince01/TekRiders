import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiBook, FiUser, FiBell, FiBarChart2, FiCalendar, 
  FiBookmark, FiDownload, FiSettings, FiLogOut, FiAward, FiTarget, FiVolume2, FiGlobe, FiHeadphones, FiMic, FiEye, FiMessageCircle, FiStar, FiPieChart, FiCheckCircle, FiFolder, FiFileText, FiBarChart, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import Profile from '../components/Profile';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

  const sidebarMenus = [
    {
      section: 'MY COURSES',
      icon: FiBook,
      key: 'courses',
      items: [
        { label: 'Current Courses', tab: 'currentCourses', icon: FiBook },
        { label: 'Completed Courses', tab: 'completedCourses', icon: FiCheckCircle },
        { label: 'Downloaded (Offline)', tab: 'downloadedCourses', icon: FiDownload },
        { label: 'Bookmarked', tab: 'bookmarked', icon: FiBookmark },
      ]
    },
    {
      section: 'DOWNLOADS',
      icon: FiDownload,
      key: 'downloads',
      items: [
        { label: 'Downloaded Courses', tab: 'downloadedCourses', icon: FiFolder },
        { label: 'Offline Lessons', tab: 'offlineLessons', icon: FiFileText },
        { label: 'Audio Files', tab: 'audioFiles', icon: FiHeadphones },
        { label: 'Storage Management', tab: 'storage', icon: FiPieChart },
      ]
    },
    {
      section: 'MY PROGRESS',
      icon: FiTarget,
      key: 'progress',
      items: [
        { label: 'Learning Progress', tab: 'learningProgress', icon: FiBarChart },
        { label: 'Test Results & Scores', tab: 'testResults', icon: FiBarChart2 },
        { label: 'Certificates Earned', tab: 'certificates', icon: FiAward },
        { label: 'Study Statistics', tab: 'studyStats', icon: FiPieChart },
      ]
    },
    {
      section: 'ACHIEVEMENTS',
      icon: FiAward,
      key: 'achievements',
      items: [
        { label: 'Badges & Certificates', tab: 'badges', icon: FiStar },
      ]
    },
    {
      section: 'AI ASSISTANT',
      icon: FiMessageCircle,
      key: 'ai',
      items: [
        { label: 'Chat Support', tab: 'chatSupport', icon: FiMessageCircle },
        { label: 'Voice Commands', tab: 'voiceCommands', icon: FiMic },
      ]
    },
    {
      section: 'ACCESSIBILITY',
      icon: FiVolume2,
      key: 'accessibility',
      items: [
        { label: 'Language Settings (Kinyarwanda/English)', tab: 'language', icon: FiGlobe },
        { label: 'Audio Controls', tab: 'audioControls', icon: FiHeadphones },
        { label: 'Voice-to-Text', tab: 'voiceToText', icon: FiMic },
        { label: 'Display Settings', tab: 'displaySettings', icon: FiEye },
      ]
    },
    {
      section: 'SETTINGS',
      icon: FiSettings,
      key: 'settings',
      items: [
        { label: 'Profile', tab: 'profile', icon: FiUser },
        { label: 'Preferences', tab: 'preferences', icon: FiSettings },
        { label: 'Notifications', tab: 'notifications', icon: FiBell },
        { label: 'Account', tab: 'account', icon: FiUser },
      ]
    },
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
      <div className="sidebar border-end shadow-lg" style={{ width: 300, position: 'fixed', height: '100vh', overflowY: 'auto', background: 'rgba(255,255,255,0.97)', borderRadius: '0 2rem 2rem 0', boxShadow: '0 4px 32px rgba(56, 189, 248, 0.10)' }}>
        <div className="p-4" style={{paddingTop: '4.5rem', paddingBottom: '2.5rem'}}>
          {sidebarMenus.map(section => (
            <SidebarSection key={section.key} icon={section.icon} title={section.section} sectionKey={section.key}>
              {section.items.map(item => (
                <SidebarItem
                  key={item.tab}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.tab}
                  onClick={() => setActiveTab(item.tab)}
                />
              ))}
            </SidebarSection>
          ))}
          <SidebarItem
            icon={FiLogOut}
            label={t('Logout')}
            active={false}
            onClick={() => { logout(); navigate('/login'); }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1" style={{ marginLeft: 300 }}>
        <div className="p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">{t('Welcome back')}, <span className="text-primary">John</span></h2>
            <div className="d-flex align-items-center">
              <div className="position-relative me-3">
                <FiBell size={24} className="text-muted" />
                {notifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {notifications.length}
                  </span>
                )}
              </div>
              <div className="dropdown">
                <img 
                  src="https://ui-avatars.com/api/?name=John+Doe" 
                  alt="Profile" 
                  className="rounded-circle" 
                  style={{ width: 40, height: 40, cursor: 'pointer' }}
                  data-bs-toggle="dropdown"
                />
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