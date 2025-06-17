import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiEdit2, FiBarChart2, FiUsers, FiArrowLeft, FiRefreshCw, FiActivity } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL + '/api';

const MOCK_ANALYTICS = {
  enrollments: 120,
  completions: 80,
  ratings: 4.7,
  revenue: 1500,
  chartData: [
    { date: '2024-06-01', enrollments: 10, completions: 5 },
    { date: '2024-06-02', enrollments: 20, completions: 10 },
    { date: '2024-06-03', enrollments: 30, completions: 20 },
    { date: '2024-06-04', enrollments: 40, completions: 30 },
  ]
};
const MOCK_STUDENTS = [
  { name: 'Alice', avatar: '/default-avatar.png', progress: 80 },
  { name: 'Bob', avatar: '/default-avatar.png', progress: 60 },
  { name: 'Charlie', avatar: '/default-avatar.png', progress: 40 },
];
const MOCK_ACTIVITY = [
  { type: 'enrollment', user: 'Alice', date: '2024-06-01' },
  { type: 'completion', user: 'Bob', date: '2024-06-02' },
  { type: 'question', user: 'Charlie', date: '2024-06-03' },
];

export default function InstructorCourse() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [owner, setOwner] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(0);

  const fetchCourse = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourse(res.data);
      if (res.data.author) {
        const userRes = await axios.get(`${API_URL.replace('/api','')}/api/users/${res.data.author}`);
        setOwner(userRes.data);
      }
    } catch (err) {
      setError('Failed to load course. It may not exist or you may not have access.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledStudents = async () => {
    setStudentsLoading(true);
    setStudentsError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/courses/${courseId}/enrolled`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (err) {
      setStudentsError('Failed to load enrolled students.');
    } finally {
      setStudentsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/courses/${courseId}/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(res.data);
    } catch (err) {
      setAnalyticsError('No analytics endpoint found. Showing mock data.');
      setAnalytics(null);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
    if (activeTab === 'enrolled') {
      fetchEnrolledStudents();
    }
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
    // eslint-disable-next-line
  }, [courseId, activeTab]);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="alert alert-danger w-100 text-center mb-4" style={{maxWidth: 500}}>{error}</div>
      <div className="d-flex gap-3">
        <button className="btn btn-outline-primary" onClick={() => navigate(-1)}><FiArrowLeft className="me-2" />Go Back</button>
        <button className="btn btn-primary" onClick={fetchCourse}><FiRefreshCw className="me-2" />Retry</button>
      </div>
    </div>
  );
  if (!course) return null;

  // Prepare lessons/videos
  const lessons = Array.isArray(course.content) && course.content.length > 0
    ? course.content
    : (Array.isArray(course.videos) ? course.videos.map((v, idx) => ({
        title: v.originalname || `Lesson ${idx + 1}`,
        videoUrl: `/api/uploads/${v.filename}`,
        description: course.description,
        duration: '',
      })) : []);

  return (
    <div className="container-fluid py-4" style={{ background: '#f6f8fa', minHeight: '80vh' }}>
      <div className="mb-3">
        <button className="btn btn-outline-primary" onClick={() => navigate('/tutor')}>
          &larr; Back to Dashboard
        </button>
      </div>
      <div className="row" style={{ maxWidth: 1300, margin: '0 auto' }}>
        {/* Sidebar: Lessons */}
        <div className="col-lg-3 mb-4 mb-lg-0">
          <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 18, background: '#fff' }}>
            <h5 className="fw-bold mb-3">Lessons</h5>
            <ul className="list-group list-group-flush">
              {lessons.length === 0 && <li className="list-group-item">No lessons uploaded yet.</li>}
              {lessons.map((lesson, idx) => (
                <li
                  key={idx}
                  className={`list-group-item px-0 py-2 ${selectedLesson === idx ? 'fw-bold text-primary' : ''}`}
                  style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                  onClick={() => setSelectedLesson(idx)}
                >
                  <span style={{ marginRight: 8 }}>🎬</span>{lesson.title || `Lesson ${idx + 1}`}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Main Content */}
        <div className="col-lg-9">
          <div className="card border-0 shadow-lg p-4" style={{ borderRadius: 24, background: '#fff', minHeight: 420 }}>
            {/* Course Header */}
            <div className="d-flex flex-column flex-md-row align-items-md-center mb-4 gap-4">
              <img
                src={course.thumbnail ? `/api/uploads/${course.thumbnail}` : 'https://picsum.photos/300/200'}
                alt={course.title}
                style={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 16, border: '2px solid #e3e3e3' }}
              />
              <div>
                <h2 className="fw-bold mb-2">{course.title}</h2>
                <div className="mb-2 text-muted">{course.category} &bull; {course.language?.toUpperCase()}</div>
                <div className="mb-3" style={{ color: '#444' }}>{course.description}</div>
                {course.price && course.price > 0 && (
                  <div className="mb-3">
                    <span className="badge bg-success fs-6">${course.price}</span>
                  </div>
                )}
                <div className="d-flex align-items-center mt-2">
                  <img src={owner?.avatar || '/default-avatar.png'} alt="Tutor Avatar" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e3e3e3' }} />
                  <div className="ms-3">
                    <div className="fw-semibold" style={{ fontSize: '1.08rem' }}>{owner?.firstName ? `${owner.firstName}${owner.lastName ? ' ' + owner.lastName : ''}` : owner?.name || 'Course Owner'}</div>
                    <div className="text-muted small">{owner?.email}</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Video Player */}
            {lessons[selectedLesson] && lessons[selectedLesson].videoUrl && (
              <div className="mb-4">
                <video
                  controls
                  className="w-100 rounded-3 shadow-sm"
                  style={{ maxHeight: 420, background: '#000' }}
                  src={lessons[selectedLesson].videoUrl}
                  poster={course.thumbnail ? `/api/uploads/${course.thumbnail}` : undefined}
                />
                <div className="mt-2">
                  <h5 className="fw-bold mb-1">{lessons[selectedLesson].title}</h5>
                  <div className="text-muted mb-2">{lessons[selectedLesson].duration}</div>
                  <div>{lessons[selectedLesson].description}</div>
                </div>
              </div>
            )}
            {/* Course Stats */}
            <div className="row mt-4 g-3">
              <div className="col-md-3">
                <div className="bg-light rounded-3 p-3 text-center">
                  <div className="fw-bold" style={{ fontSize: 22 }}>{course.enrolled ?? 0}</div>
                  <div className="small text-muted">Enrollments</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bg-light rounded-3 p-3 text-center">
                  <div className="fw-bold" style={{ fontSize: 22 }}>{course.completions ?? 0}</div>
                  <div className="small text-muted">Completions</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bg-light rounded-3 p-3 text-center">
                  <div className="fw-bold" style={{ fontSize: 22 }}>{course.rating ?? 0}</div>
                  <div className="small text-muted">Avg. Rating</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bg-light rounded-3 p-3 text-center">
                  <div className="fw-bold" style={{ fontSize: 22 }}>${course.revenue ?? 0}</div>
                  <div className="small text-muted">Revenue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 