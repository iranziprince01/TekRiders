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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, coursesData, dbsData] = await Promise.all([
          adminService.getUsers(),
          adminService.getCourses(),
          adminService.getAllDatabases()
        ]);
        setUsers(usersData);
        setCourses(coursesData);
        setDbs(dbsData);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      if (action === 'approve') {
        await adminService.updateCourseStatus(courseId, 'approved');
        setCourses(courses.map(course => 
          course.id === courseId ? { ...course, status: 'approved' } : course
        ));
      } else if (action === 'reject') {
        await adminService.updateCourseStatus(courseId, 'rejected');
        setCourses(courses.map(course => 
          course.id === courseId ? { ...course, status: 'rejected' } : course
        ));
      } else if (action === 'flag') {
        await adminService.flagCourse(courseId);
        setCourses(courses.map(course => 
          course.id === courseId ? { ...course, status: 'flagged', flags: (course.flags || 0) + 1 } : course
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
            <StatCard
              icon={FiUsers}
              value={users.length}
              label={t('Total Users')}
              color="primary"
            />
          </div>
          <div className="col-md-3">
            <StatCard
              icon={FiBook}
              value={courses.length}
              label={t('Total Courses')}
              color="success"
            />
          </div>
          <div className="col-md-3">
            <StatCard
              icon={FiFlag}
              value={courses.filter(c => c.status === 'flagged').length}
              label={t('Flagged Content')}
              color="warning"
            />
          </div>
          <div className="col-md-3">
            <StatCard
              icon={FiAlertCircle}
              value={courses.filter(c => c.status === 'pending').length}
              label={t('Pending Reviews')}
              color="danger"
            />
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
  } else if (activeTab === 'users') {
    mainContent = (
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>{t('User Management')}</h2>
          <div className="d-flex gap-2">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FiSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder={t('Search users...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">{t('All Roles')}</option>
              <option value="student">{t('Students')}</option>
              <option value="instructor">{t('Instructors')}</option>
            </select>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">{t('All Status')}</option>
              <option value="active">{t('Active')}</option>
              <option value="suspended">{t('Suspended')}</option>
            </select>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th>{t('User')}</th>
                  <th>{t('Role')}</th>
                  <th>{t('Status')}</th>
                  <th>{t('Join Date')}</th>
                  <th>{t('Last Active')}</th>
                  <th>{t('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="ms-3">
                          <h6 className="mb-0">{user.name}</h6>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge bg-${user.role === 'instructor' ? 'primary' : 'secondary'}-subtle text-${user.role === 'instructor' ? 'primary' : 'secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge bg-${user.status === 'active' ? 'success' : 'danger'}-subtle text-${user.status === 'active' ? 'success' : 'danger'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                    <td>{new Date(user.lastActive).toLocaleDateString()}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleUserAction(user.id, 'view')}
                        >
                          <FiUserCheck />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleUserAction(user.id, 'suspend')}
                        >
                          <FiUserX />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer bg-white">
            <Pagination
              totalItems={filteredUsers.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    );
  } else if (activeTab === 'courses') {
    mainContent = (
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>{t('Course Moderation')}</h2>
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <span className="input-group-text bg-white">
              <FiSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder={t('Search courses...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th>{t('Course')}</th>
                  <th>{t('Instructor')}</th>
                  <th>{t('Status')}</th>
                  <th>{t('Submitted')}</th>
                  <th>{t('Flags')}</th>
                  <th>{t('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentCourses.map(course => (
                  <tr key={course.id}>
                    <td>
                      <h6 className="mb-0">{course.title}</h6>
                    </td>
                    <td>{course.instructor}</td>
                    <td>
                      <span className={`badge bg-${
                        course.status === 'pending' ? 'warning' :
                        course.status === 'flagged' ? 'danger' :
                        'success'
                      }-subtle text-${
                        course.status === 'pending' ? 'warning' :
                        course.status === 'flagged' ? 'danger' :
                        'success'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td>{new Date(course.submittedDate).toLocaleDateString()}</td>
                    <td>
                      {course.flags > 0 ? (
                        <span className="badge bg-danger-subtle text-danger">
                          {course.flags} {t('flags')}
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleCourseAction(course.id, 'approve')}
                        >
                          <FiCheckCircle />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleCourseAction(course.id, 'reject')}
                        >
                          <FiXCircle />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleCourseAction(course.id, 'flag')}
                        >
                          <FiFlag />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer bg-white">
            <Pagination
              totalItems={filteredCourses.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
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