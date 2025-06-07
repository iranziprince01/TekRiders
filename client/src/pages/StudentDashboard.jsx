import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  FiBook, FiUser, FiBell, FiBarChart2, FiCalendar, 
  FiBookmark, FiDownload, FiSettings, FiLogOut 
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import Profile from '../components/Profile';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StudentDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
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

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API calls
    setCourses([
      {
        id: 1,
        title: 'Introduction to Programming',
        progress: 75,
        lastAccessed: '2024-03-20',
        instructor: 'John Doe',
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
    { title: t('Introduction to Programming'), completion: '85%', score: 92, students: 120 },
    { title: t('Web Development Basics'), completion: '78%', score: 88, students: 95 },
    { title: t('Data Structures'), completion: '65%', score: 82, students: 75 }
  ];

  const recentActivity = [
    { type: t('Assignment'), course: t('Web Development'), date: '2024-03-15', status: t('Completed') },
    { type: t('Quiz'), course: t('Programming'), date: '2024-03-14', status: t('In Progress') },
    { type: t('Project'), course: t('Data Science'), date: '2024-03-13', status: t('Not Started') }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`sidebar-item d-flex align-items-center p-3 mb-2 rounded-3 cursor-pointer ${
        active ? 'bg-primary text-white' : 'hover-bg-light'
      }`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Icon className="me-3" size={20} />
      <span>{t(label)}</span>
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
                        <p className="text-muted small mb-2">{course.instructor}</p>
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
                          <p className="text-muted small mb-2">{course.instructor}</p>
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
    <div className="dashboard-container d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="sidebar bg-white border-end" style={{ width: 280, position: 'fixed', height: '100vh' }}>
        <div className="p-4">
          <h3 className="mb-4">TekRiders</h3>
          <SidebarItem 
            icon={FiBook} 
            label={t('My Courses')} 
            active={activeTab === 'courses'} 
            onClick={() => setActiveTab('courses')} 
          />
          <SidebarItem 
            icon={FiUser} 
            label={t('Profile')} 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
          <SidebarItem 
            icon={FiBell} 
            label={t('Notifications')} 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')} 
          />
          <SidebarItem 
            icon={FiBarChart2} 
            label={t('Progress')} 
            active={activeTab === 'progress'} 
            onClick={() => setActiveTab('progress')} 
          />
          <SidebarItem 
            icon={FiCalendar} 
            label={t('Schedule')} 
            active={activeTab === 'schedule'} 
            onClick={() => setActiveTab('schedule')} 
          />
          <SidebarItem 
            icon={FiBookmark} 
            label={t('Bookmarks')} 
            active={activeTab === 'bookmarks'} 
            onClick={() => setActiveTab('bookmarks')} 
          />
          <SidebarItem 
            icon={FiDownload} 
            label={t('Downloads')} 
            active={activeTab === 'downloads'} 
            onClick={() => setActiveTab('downloads')} 
          />
          <SidebarItem 
            icon={FiSettings} 
            label={t('Settings')} 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
          <SidebarItem 
            icon={FiLogOut} 
            label={t('Logout')} 
            active={activeTab === 'logout'} 
            onClick={() => {/* Handle logout */}} 
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1" style={{ marginLeft: 280 }}>
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

export default StudentDashboard; 