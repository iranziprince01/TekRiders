import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers,
  FiBook,
  FiFlag,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiAlertCircle,
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiInfo,
  FiAlertTriangle,
  FiCheck,
  FiLoader,
  FiLogOut
} from 'react-icons/fi';
import { adminService } from '../services/adminService';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [notification, setNotification] = useState(null);
  const [dbs, setDbs] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalCourses: 0, coursesByStatus: {}, usersByRole: {} });
  const [courseStatusTab, setCourseStatusTab] = useState('all');
  const [userRoleTab, setUserRoleTab] = useState('all');

  const userTabs = [
    { key: 'all', label: t('All') },
    { key: 'learner', label: t('Learners') },
    { key: 'tutor', label: t('Tutors') }
  ];
  const learners = users.filter(user => user.role === 'learner');
  const tutors = users.filter(user => user.role === 'tutor');
  const userRoles = {
    all: users,
    learner: learners,
    tutor: tutors
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usersRes, coursesRes, analyticsRes, dbsRes] = await Promise.all([
          adminService.getUsers(),
          adminService.getCourses(),
          adminService.getAnalytics(),
          adminService.getAllDatabases()
        ]);
        setUsers(usersRes);
        setCourses(coursesRes);
        setAnalytics(analyticsRes);
        setDbs(dbsRes);
      } catch (err) {
        setError('Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Refetch courses when switching to courses tab
  useEffect(() => {
    if (activeTab === 'courses') {
      setLoading(true);
      setError(null);
      adminService.getCourses()
        .then(setCourses)
        .catch(() => setError('Failed to load courses.'))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  // Notification component
  const Notification = ({ message, type, onClose }) => (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`}
      role="alert"
      style={{ zIndex: 1050 }}
    >
      {message}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </motion.div>
  );

  // Modal component
  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {children}
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>
    );
  };

  // Stats cards component
  const StatCard = ({ icon: Icon, value, label, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card border-0 shadow-sm h-100"
    >
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className={`rounded-circle p-3 bg-${color}-subtle me-3`}>
            <Icon className={`text-${color} display-6`} />
          </div>
          <div>
            <h3 className="mb-0">{value}</h3>
            <p className="text-muted mb-0">{label}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Pagination component
  const Pagination = ({ totalItems, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
            </button>
          </li>
          {pages.map(page => (
            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight />
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  // User actions
  const handleUserAction = async (userId, action) => {
    try {
      setLoading(true);
      if (action === 'suspend') {
        await adminService.updateUserStatus(userId, 'suspended');
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: 'suspended' } : user
        ));
      } else if (action === 'activate') {
        await adminService.updateUserStatus(userId, 'active');
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: 'active' } : user
        ));
      }
      setNotification({
        type: 'success',
        message: `User ${action === 'suspend' ? 'suspended' : 'activated'} successfully!`
      });
    } catch (err) {
      setNotification({
        type: 'danger',
        message: `Failed to ${action} user. Please try again.`
      });
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  // Course actions
  const handleCourseAction = async (courseId, action) => {
    try {
      setLoading(true);
      if (action === 'approve' || action === 'reject') {
        await adminService.moderateCourse(courseId, action);
        setCourses(courses.map(course => 
          course.id === courseId ? { ...course, status: action === 'approve' ? 'approved' : 'rejected' } : course
        ));
      }
      setNotification({
        type: 'success',
        message: `Course ${action}ed successfully!`
      });
    } catch (err) {
      setNotification({
        type: 'danger',
        message: `Failed to ${action} course. Please try again.`
      });
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handleUserRoleUpdate = async (userId, newRole) => {
    try {
      setLoading(true);
      await adminService.updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setNotification({
        type: 'success',
        message: `User role updated to ${newRole} successfully!`
      });
    } catch (err) {
      setNotification({
        type: 'danger',
        message: `Failed to update user role. Please try again.`
      });
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsData = await adminService.getAnalytics();
      setAnalytics(analyticsData);
    } catch (err) {
      setError('Failed to load analytics data. Please try again.');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      (course.title && course.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.instructor && course.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Filter courses by status
  const approvedCourses = courses.filter(course => course.status === 'approved');
  const rejectedCourses = courses.filter(course => course.status === 'rejected');
  const pendingCourses = courses.filter(course => course.status === 'pending');

  // Paginate items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);

  let mainContent;

  if (loading) {
    mainContent = (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <FiLoader className="display-4 text-primary animate-spin" />
      </div>
    );
  } else if (error) {
    mainContent = (
      <div className="alert alert-danger m-4" role="alert">
        <FiAlertTriangle className="me-2" />
        {error}
      </div>
    );
  } else if (activeTab === 'overview') {
    mainContent = (
      <div className="container py-4">
        <h2 className="mb-4">{t('Admin Overview')}</h2>
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card h-100 shadow-sm card-hover" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('users')}>
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <span className="fs-1 mb-2"><i className="bi bi-people"></i></span>
                <h4 className="mb-1">{analytics.totalUsers}</h4>
                <div className="text-muted">{t('Total Users')}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100 shadow-sm card-hover" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('courses')}>
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <span className="fs-1 mb-2"><i className="bi bi-journal-bookmark"></i></span>
                <h4 className="mb-1">{analytics.totalCourses}</h4>
                <div className="text-muted">{t('Total Courses')}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100 shadow-sm card-hover" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/courses/flagged')}>
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <span className="fs-1 mb-2"><i className="bi bi-flag"></i></span>
                <h4 className="mb-1">{analytics.coursesByStatus.flagged || 0}</h4>
                <div className="text-muted">{t('Flagged Content')}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card h-100 shadow-sm card-hover" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/courses/pending')}>
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <span className="fs-1 mb-2"><i className="bi bi-exclamation-circle"></i></span>
                <h4 className="mb-1">{analytics.coursesByStatus.pending || 0}</h4>
                <div className="text-muted">{t('Pending Reviews')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">{t('Recent Activity')}</h5>
          </div>
          <div className="card-body">
            <div className="list-group list-group-flush">
              {[...users, ...courses].slice(0, 5).map((item, index) => (
                <div key={index} className="list-group-item px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{item.name || item.title}</h6>
                      <small className="text-muted">
                        {item.role ? `${item.role} - ${item.email}` : `Course by ${item.instructor}`}
                      </small>
                    </div>
                    <span className="badge bg-primary-subtle text-primary">
                      {item.status || 'Active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CouchDB Databases */}
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">{t('CouchDB Databases')}</h5>
          </div>
          <div className="card-body">
            {dbs.length === 0 ? (
              <span className="text-muted">{t('No databases found.')}</span>
            ) : (
              <ul className="list-group list-group-flush">
                {dbs.map((db, idx) => (
                  <li key={db} className="list-group-item px-0">
                    <span className="fw-bold">{idx + 1}.</span> {db}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  } else if (activeTab === 'dashboard') {
    mainContent = (
      <div className="container py-4">
        <h2 className="mb-4">{t('Admin Dashboard')}</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{t('Approved Courses')}</h5>
                <p className="card-text">{approvedCourses.length} courses</p>
                <Link to="/admin/courses/approved" className="btn btn-primary">{t('View All')}</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{t('Rejected Courses')}</h5>
                <p className="card-text">{rejectedCourses.length} courses</p>
                <Link to="/admin/courses/rejected" className="btn btn-primary">{t('View All')}</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{t('Pending Courses')}</h5>
                <p className="card-text">{pendingCourses.length} courses</p>
                <Link to="/admin/courses/pending" className="btn btn-primary">{t('View All')}</Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{t('Tutors')}</h5>
                <p className="card-text">{tutors.length} tutors</p>
                <Link to="/admin/users/tutors" className="btn btn-primary">{t('View All')}</Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{t('Learners')}</h5>
                <p className="card-text">{learners.length} learners</p>
                <Link to="/admin/users/learners" className="btn btn-primary">{t('View All')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (activeTab === 'users') {
    mainContent = (
      <div className="container py-4">
        <h2 className="mb-4">{t('User Management')}</h2>
        <div className="mb-3 d-flex gap-2">
          {userTabs.map(tab => (
            <button
              key={tab.key}
              className={`btn btn-${userRoleTab === tab.key ? 'primary' : 'outline-primary'}`}
              onClick={() => setUserRoleTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="row g-4">
          {userRoles[userRoleTab].length === 0 ? (
            <div className="alert alert-info">{t('No users found.')}</div>
          ) : (
            userRoles[userRoleTab].map(user => (
              <div key={user.id} className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{user.name}</h5>
                    <p className="card-text">{user.email}</p>
                    <div className="mb-2"><strong>{t('Role')}:</strong> {user.role}</div>
                    <div className="mb-2"><strong>{t('Status')}:</strong> {user.status}</div>
                    <div className="d-flex gap-2 mt-2">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedItem(user); setModalType('view'); setShowModal(true); }}>{t('View')}</button>
                      {user.status !== 'suspended' ? (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleUserAction(user.id, 'suspend')}>{t('Suspend')}</button>
                      ) : (
                        <button className="btn btn-sm btn-outline-success" onClick={() => handleUserAction(user.id, 'activate')}>{t('Activate')}</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  } else if (activeTab === 'courses') {
    const statusTabs = [
      { key: 'all', label: t('All') },
      { key: 'approved', label: t('Approved') },
      { key: 'pending', label: t('Pending') },
      { key: 'rejected', label: t('Rejected') }
    ];
    const statusCourses = {
      all: courses,
      approved: approvedCourses,
      pending: pendingCourses,
      rejected: rejectedCourses
    };
    mainContent = (
      <div className="container py-4">
        <h2 className="mb-4">{t('Courses')}</h2>
        <div className="mb-3 d-flex gap-2">
          {statusTabs.map(tab => (
            <button
              key={tab.key}
              className={`btn btn-${courseStatusTab === tab.key ? 'primary' : 'outline-primary'}`}
              onClick={() => setCourseStatusTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-center py-5"><FiLoader className="display-4 text-primary animate-spin" /></div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="row g-4">
            {statusCourses[courseStatusTab].length === 0 ? (
              <div className="alert alert-info">{t('No courses found.')}</div>
            ) : (
              statusCourses[courseStatusTab].map(course => (
                <div key={course.id} className="col-md-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{course.title}</h5>
                      <p className="card-text">{course.description}</p>
                      <div className="mb-2"><strong>{t('Instructor')}:</strong> {course.instructor}</div>
                      <div className="mb-2"><strong>{t('Status')}:</strong> {course.status}</div>
                      <div className="d-flex gap-2 mt-2">
                        {course.status === 'pending' && (
                          <>
                            <button className="btn btn-sm btn-outline-success" onClick={() => handleCourseAction(course.id, 'approve')}>{t('Approve')}</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleCourseAction(course.id, 'reject')}>{t('Reject')}</button>
                          </>
                        )}
                        {course.status === 'approved' && (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleCourseAction(course.id, 'reject')}>{t('Reject')}</button>
                        )}
                        {course.status === 'rejected' && (
                          <button className="btn btn-sm btn-outline-success" onClick={() => handleCourseAction(course.id, 'approve')}>{t('Approve')}</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container-fluid admin-dashboard-bg min-vh-100">
      {/* Top Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-3 px-md-5 py-2 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 logo-hover" style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--main-color)', textDecoration: 'none' }}>
            <span>Tek Riders</span>
          </Link>
          <button className="btn btn-outline-secondary btn-sm d-none d-md-inline-flex align-items-center" onClick={() => navigate('/')}>🏠 {t('Go to Homepage')}</button>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="fw-bold text-primary d-none d-md-inline">{t('Admin Dashboard')}</span>
          <div className="dropdown">
            <button className="btn btn-link dropdown-toggle text-dark text-decoration-none d-flex align-items-center" type="button" id="adminMenu" data-bs-toggle="dropdown">
              <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&size=32`} alt={user?.name} className="rounded-circle me-2" width="32" height="32" />
              <span className="fw-semibold">{user?.name || 'Admin'}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link className="dropdown-item" to="/profile">{t('Profile')}</Link>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => { logout(); navigate('/'); }}>{t('Logout')}</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar min-vh-100 border-end p-0">
          <div className="position-sticky pt-4">
            <ul className="nav flex-column gap-2">
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link text-start w-100 d-flex align-items-center gap-2 rounded-3 ${activeTab === 'overview' ? 'active bg-primary text-white' : 'text-dark'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <FiBarChart2 size={20} /> <span>{t('Overview')}</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link text-start w-100 d-flex align-items-center gap-2 rounded-3 ${activeTab === 'users' ? 'active bg-primary text-white' : 'text-dark'}`}
                  onClick={() => setActiveTab('users')}
                >
                  <FiUsers size={20} /> <span>{t('Users')}</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link text-start w-100 d-flex align-items-center gap-2 rounded-3 ${activeTab === 'courses' ? 'active bg-primary text-white' : 'text-dark'}`}
                  onClick={() => setActiveTab('courses')}
                >
                  <FiBook size={20} /> <span>{t('Courses')}</span>
                </button>
              </li>
              <li className="nav-item mt-4">
                <button
                  className="nav-link btn btn-link text-start w-100 d-flex align-items-center gap-2 rounded-3 text-danger"
                  onClick={() => { logout(); navigate('/login'); }}
                >
                  <FiLogOut size={20} /> <span>{t('Logout')}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          {mainContent}
        </main>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalType === 'view' ? 'User Details' :
          modalType === 'suspend' ? 'Suspend User' :
          modalType === 'approve' ? 'Approve Course' :
          modalType === 'reject' ? 'Reject Course' :
          modalType === 'flag' ? 'Flag Course' : 'Confirm Action'
        }
      >
        {modalType === 'view' && selectedItem && (
          <div>
            <h5>{selectedItem.name}</h5>
            <p className="text-muted">{selectedItem.email}</p>
            <div className="row mt-3">
              <div className="col-6">
                <p><strong>Role:</strong> {selectedItem.role}</p>
                <p><strong>Status:</strong> {selectedItem.status}</p>
              </div>
              <div className="col-6">
                <p><strong>Join Date:</strong> {new Date(selectedItem.joinDate).toLocaleDateString()}</p>
                <p><strong>Last Active:</strong> {new Date(selectedItem.lastActive).toLocaleDateString()}</p>
              </div>
            </div>
            {selectedItem.role === 'student' && (
              <div className="mt-3">
                <p><strong>Courses Enrolled:</strong> {selectedItem.coursesEnrolled}</p>
                <p><strong>Completed Courses:</strong> {selectedItem.completedCourses}</p>
              </div>
            )}
            {selectedItem.role === 'instructor' && (
              <div className="mt-3">
                <p><strong>Courses Created:</strong> {selectedItem.coursesCreated}</p>
                <p><strong>Total Students:</strong> {selectedItem.totalStudents}</p>
              </div>
            )}
          </div>
        )}
        {(modalType === 'suspend' || modalType === 'approve' || modalType === 'reject' || modalType === 'flag') && (
          <div>
            <p>Are you sure you want to {modalType} {selectedItem?.name || selectedItem?.title}?</p>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className={`btn btn-${
                  modalType === 'approve' ? 'success' :
                  modalType === 'reject' || modalType === 'suspend' ? 'danger' :
                  'warning'
                }`}
                onClick={() => handleUserAction(selectedItem.id, modalType)}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard; 