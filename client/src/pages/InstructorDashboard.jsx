import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiBook, FiPlus, FiBarChart2, FiBell, FiSettings, FiLogOut, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import CourseCreationForm from '../components/CourseCreationForm';
import CourseAnalytics from '../components/CourseAnalytics';
import UserProfile from '../components/UserProfile';
import { useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL + '/api';

const TABS = [
  { key: 'courses', label: 'My Courses', icon: FiBook },
  { key: 'upload', label: 'Upload', icon: FiPlus },
  { key: 'analytics', label: 'Analytics', icon: FiBarChart2 },
  { key: 'profile', label: 'Profile', icon: FiUser },
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [showEnrolledModal, setShowEnrolledModal] = useState(false);
  const [quizSubmissions, setQuizSubmissions] = useState([]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [grading, setGrading] = useState({}); // { [quizId]: score }

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
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
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
            <div key={course._id || course.id} className="col-12 col-sm-6 col-lg-4 d-flex">
              {course._id ? (
                <div className="card dashboard-course-card flex-fill border-0 shadow-sm h-100 d-flex flex-column justify-content-between">
                  {console.log('Rendering tutor course card with _id:', course._id)}
                  <Link to={`/tutor/course/${course._id}`} className="text-decoration-none text-dark">
                    <div style={{ position: 'relative' }}>
                      <img
                        src={course.thumbnail ? `/api/uploads/${course.thumbnail}` : 'https://picsum.photos/300/200'}
                        className="card-img-top rounded-top"
                        alt={course.title}
                        style={{ height: 160, objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        zIndex: 2,
                        background: course.status === 'approved' ? '#1ec773' : (course.status === 'pending' ? '#ffc107' : '#6c757d'),
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 14,
                        borderRadius: 8,
                        padding: '0.32rem 1.1rem',
                        boxShadow: '0 4px 16px rgba(56,159,247,0.18), 0 1.5px 8px rgba(0,0,0,0.10)',
                        letterSpacing: '0.01em',
                      }}>{t(course.status.charAt(0).toUpperCase() + course.status.slice(1))}</span>
                    </div>
                    <div className="card-body pb-2">
                      <h5 className="card-title fw-bold mb-2 text-truncate" title={course.title}>{course.title}</h5>
                      <p className="text-muted small mb-2 text-truncate" title={course.description}>{course.description}</p>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <span className="badge bg-light text-primary fw-semibold">{course.category || t('No Category')}</span>
                        <span className="badge bg-info text-dark fw-semibold">Enrolled: {Array.isArray(course.enrolled) ? course.enrolled.length : (course.enrolled || 0)}</span>
                        <span className="badge bg-warning text-dark fw-semibold">Rating: {course.rating ?? 'N/A'}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="card-footer bg-white border-0 d-flex flex-wrap gap-2 justify-content-between pt-0 pb-3 px-3" style={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                    <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 flex-fill" onClick={() => handleEdit(course)}><FiEdit2 />{t('Update')}</button>
                    <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 flex-fill" onClick={() => handleAnalytics(course._id)}><FiBarChart2 />{t('Analytics')}</button>
                    <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 flex-fill" onClick={() => handleDelete(course._id)}><FiTrash2 />{t('Delete')}</button>
                    <button className="btn btn-outline-info btn-sm d-flex align-items-center gap-1 flex-fill" onClick={() => window.location.href = `/tutor/course/${course._id}/enrolled`}><FiUser />{t('View Enrolled Students')}</button>
                    <button className="btn btn-outline-dark btn-sm d-flex align-items-center gap-1 flex-fill" onClick={() => handleViewQuizzes(course._id)}><FiBook />{t('View Quiz Submissions')}</button>
                  </div>
                </div>
              ) : (
                <div className="card dashboard-course-card border-0 shadow-sm h-100 d-flex flex-column bg-warning-subtle align-items-center justify-content-center">
                  <span className="badge bg-danger">Invalid course data</span>
                </div>
              )}
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

  const handleEdit = (course) => {
    setEditCourse(course);
    setEditFormData({
      ...course,
      lessons: course.lessons || [],
      thumbnail: null // reset thumbnail for editing
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (data) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('description', data.description);
      formDataToSend.append('category', data.category);
      formDataToSend.append('language', data.language);
      formDataToSend.append('contentType', data.contentType);
      formDataToSend.append('content', JSON.stringify(data.lessons));
      if (data.thumbnail) {
        formDataToSend.append('image', data.thumbnail);
      }
      const response = await fetch(`/api/courses/${editCourse._id}`, {
        method: 'PUT',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to update course');
      setShowEditModal(false);
      fetchCourses();
    } catch (err) {
      alert('Failed to update course');
    }
  };

  const handleUpdate = (course) => {
    setSelectedCourse(course);
    setShowUpdateModal(true);
  };

  const handleAnalytics = (courseId) => {
    // Implement analytics functionality
    console.log('Analytics for course:', courseId);
  };

  // Fetch enrolled students for a course
  const handleViewEnrolled = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/courses/${courseId}/enrolled`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEnrolledStudents(data);
      setSelectedCourse(courseId);
      setShowEnrolledModal(true);
    } catch (err) {
      setEnrolledStudents([]);
      setShowEnrolledModal(true);
    }
  };

  // Fetch quiz submissions for a course
  const handleViewQuizzes = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/courses/${courseId}/quizzes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setQuizSubmissions(data);
      setSelectedCourse(courseId);
      setShowQuizModal(true);
    } catch (err) {
      setQuizSubmissions([]);
      setShowQuizModal(true);
    }
  };

  // Grade a quiz
  const handleGradeQuiz = async (quizId) => {
    try {
      const token = localStorage.getItem('token');
      const score = grading[quizId];
      await fetch(`/api/courses/quiz/${quizId}/grade`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ score })
      });
      setQuizSubmissions(qs => qs.map(q => q._id === quizId ? { ...q, graded: true, score } : q));
    } catch (err) {
      alert('Failed to grade quiz');
    }
  };

  return (
    <div className="dashboard-container d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="sidebar bg-white border-end d-flex flex-column" style={{ width: 260, position: 'fixed', height: '100vh', justifyContent: 'space-between' }}>
        <div className="p-4">
          {TABS.map(tab => (
            <SidebarItem key={tab.key} icon={tab.icon} label={tab.label} tab={tab.key} />
          ))}
        </div>
        <div className="p-4" style={{ position: 'absolute', bottom: '7rem', width: '100%' }}>
          <div className="sidebar-item d-flex align-items-center p-3 rounded-3 cursor-pointer text-danger" onClick={logout} style={{ cursor: 'pointer', color: '#e53935', fontWeight: 600, fontSize: '1.08rem', background: 'none' }}>
            <FiLogOut className="me-3" size={20} />
            <span>{t('Logout')}</span>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div style={{ marginLeft: 260, width: '100%' }}>{mainContent}</div>
      {/* Edit Course Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('Edit Course')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CourseCreationForm
            formData={editFormData}
            setFormData={setEditFormData}
            isEdit
            onSubmit={handleEditSubmit}
          />
        </Modal.Body>
      </Modal>
      {/* Modal for enrolled students */}
      {showEnrolledModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enrolled Students</h5>
                <button type="button" className="btn-close" onClick={() => setShowEnrolledModal(false)}></button>
              </div>
              <div className="modal-body">
                {enrolledStudents.length === 0 ? (
                  <div>No students enrolled.</div>
                ) : (
                  <ul className="list-group">
                    {enrolledStudents.map(student => (
                      <li key={student._id} className="list-group-item">
                        {student.name || student.email} ({student.email})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal for quiz submissions */}
      {showQuizModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Quiz Submissions</h5>
                <button type="button" className="btn-close" onClick={() => setShowQuizModal(false)}></button>
              </div>
              <div className="modal-body">
                {quizSubmissions.length === 0 ? (
                  <div>No quiz submissions yet.</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Learner</th>
                        <th>Answers</th>
                        <th>Score</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizSubmissions.map(q => (
                        <tr key={q._id}>
                          <td>{q.learnerId}</td>
                          <td>{JSON.stringify(q.answers)}</td>
                          <td>{q.graded ? q.score : '-'}</td>
                          <td>
                            {!q.graded && (
                              <div className="d-flex align-items-center">
                                <input
                                  type="number"
                                  className="form-control form-control-sm me-2"
                                  style={{ width: 80 }}
                                  value={grading[q._id] || ''}
                                  onChange={e => setGrading(g => ({ ...g, [q._id]: e.target.value }))}
                                  placeholder="Score"
                                />
                                <button className="btn btn-sm btn-success" onClick={() => handleGradeQuiz(q._id)}>Grade</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 