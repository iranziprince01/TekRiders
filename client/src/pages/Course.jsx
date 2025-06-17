import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiCheckCircle, FiBookOpen, FiMessageCircle, FiEdit2, FiUsers, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL + '/api';

const MOCK_LEARNERS = [
  { name: 'Alice', avatar: '/default-avatar.png', progress: 80 },
  { name: 'Bob', avatar: '/default-avatar.png', progress: 60 },
  { name: 'Charlie', avatar: '/default-avatar.png', progress: 40 },
];

export default function Course() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeLesson, setActiveLesson] = useState(0);
  const [activeTab, setActiveTab] = useState('content');
  const [notes, setNotes] = useState({}); // notes per lesson
  const [questions, setQuestions] = useState([]); // Q&A
  const [questionInput, setQuestionInput] = useState('');
  const [completedLessons, setCompletedLessons] = useState([]);
  const [learners, setLearners] = useState([]);
  const [learnersLoading, setLearnersLoading] = useState(false);
  const [learnersError, setLearnersError] = useState('');
  const [tutorInfo, setTutorInfo] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/courses/${courseId}`);
        // Only allow access if course is approved
        if (res.data.status !== 'approved') {
          setError('This course is not approved or not available.');
          setCourse(null);
        } else {
          setCourse(res.data);
          // Fetch tutor info
          const tutorRes = await axios.get(`${API_URL}/users/${res.data.author}`);
          setTutorInfo(tutorRes.data);
        }
      } catch (err) {
        setError('Failed to load course.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Prepare lessons/videos
  const lessons = Array.isArray(course?.content) && course.content.length > 0
    ? course.content
    : (Array.isArray(course?.videos) ? course.videos.map((v, idx) => ({
        title: v.originalname || `Lesson ${idx + 1}`,
        videoUrl: `/api/uploads/${v.filename}`,
        description: course.description,
        duration: '',
      })) : []);

  const handleMarkComplete = idx => {
    setCompletedLessons(prev => prev.includes(idx) ? prev : [...prev, idx]);
  };

  const handleAddQuestion = () => {
    if (questionInput.trim()) {
      setQuestions(qs => [
        ...qs,
        { text: questionInput, user: user?.firstName || user?.email, date: new Date().toLocaleString() }
      ]);
      setQuestionInput('');
    }
  };

  const handleNoteChange = (lessonIdx, value) => {
    setNotes(prev => ({ ...prev, [lessonIdx]: value }));
  };

  const fetchFellowLearners = async () => {
    setLearnersLoading(true);
    setLearnersError('');
    try {
      // Try public access first
      let res;
      try {
        res = await axios.get(`${API_URL}/courses/${courseId}/enrolled`);
      } catch (err) {
        // If unauthorized, try with token
        const token = localStorage.getItem('token');
        res = await axios.get(`${API_URL}/courses/${courseId}/enrolled`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setLearners(res.data);
    } catch (err) {
      setLearnersError('Failed to load fellow learners.');
    } finally {
      setLearnersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'learners') {
      fetchFellowLearners();
    }
    // eslint-disable-next-line
  }, [activeTab, courseId]);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="alert alert-danger w-100 text-center mb-4" style={{maxWidth: 500}}>{error}</div>
      <div className="d-flex gap-3">
        <button className="btn btn-outline-primary" onClick={() => navigate(-1)}><FiArrowLeft className="me-2" />Go Back</button>
        <button className="btn btn-primary" onClick={() => window.location.reload()}><FiRefreshCw className="me-2" />Retry</button>
      </div>
    </div>
  );
  if (!course) return null;

  return (
    <div className="container-fluid py-4" style={{ background: '#f6f8fa', minHeight: '80vh' }}>
      <div className="mb-3">
        <button className="btn btn-outline-primary" onClick={() => navigate('/learner')}>
          &larr; Back to Dashboard
        </button>
      </div>
      <div className="row" style={{ maxWidth: 1300, margin: '0 auto' }}>
        {/* Sidebar: Lessons */}
        <div className="col-lg-3 mb-4 mb-lg-0">
          <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 18, background: '#fff' }}>
            <h5 className="fw-bold mb-3"><FiBookOpen className="me-2" />Lessons</h5>
            <ul className="list-group list-group-flush">
              {lessons.map((lesson, idx) => (
                <li
                  key={idx}
                  className={`list-group-item d-flex align-items-center justify-content-between px-0 py-2 ${activeLesson === idx ? 'fw-bold text-primary' : ''}`}
                  style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                  onClick={() => setActiveLesson(idx)}
                >
                  <span>🎬 {lesson.title}</span>
                  {completedLessons.includes(idx) && <FiCheckCircle className="text-success ms-2" />}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <div className="progress" style={{ height: 8 }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
                />
              </div>
              <div className="small text-muted mt-1">Progress: {completedLessons.length} / {lessons.length}</div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className="card border-0 shadow-lg p-4" style={{ borderRadius: 24, background: '#fff', minHeight: 420 }}>
            {/* Course Header */}
            <div className="d-flex flex-column flex-md-row align-items-md-center mb-4 gap-4">
              <img
                src={course.thumbnail ? `/api/uploads/${course.thumbnail}` : 'https://picsum.photos/300/200'}
                alt={course.title}
                style={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 16, border: '2px solid #e3e3e3' }}
              />
              <div style={{ flex: 1 }}>
                <h2 className="fw-bold mb-2">{course.title}</h2>
                <div className="mb-2 text-muted">{course.category} &bull; {course.language?.toUpperCase()}</div>
                <div className="mb-3" style={{ color: '#444' }}>{course.description}</div>
                {/* Only show tutor full name and role */}
                <div className="mt-2">
                  <span className="fw-semibold" style={{ fontSize: '1.12rem' }}>{tutorInfo?.firstName} {tutorInfo?.lastName}</span>
                  <span className="badge bg-secondary ms-2" style={{ fontSize: '0.95rem' }}>{tutorInfo?.role?.toUpperCase()}</span>
                </div>
              </div>
            </div>
            {/* Tabs */}
            <div className="mb-3">
              <button className={`btn btn-sm me-2 ${activeTab === 'content' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('content')}>Content</button>
              <button className={`btn btn-sm me-2 ${activeTab === 'notes' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('notes')}><FiEdit2 className="me-1" />Notes</button>
              <button className={`btn btn-sm me-2 ${activeTab === 'qa' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('qa')}><FiMessageCircle className="me-1" />Q&A</button>
              <button className={`btn btn-sm ${activeTab === 'learners' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('learners')}><FiUsers className="me-1" />Fellow Learners</button>
            </div>
            {activeTab === 'content' && (
              <div>
                {lessons[activeLesson]?.videoUrl ? (
                  <video
                    controls
                    style={{ borderRadius: 12, background: '#000', width: '100%', minHeight: 260, maxHeight: 400, objectFit: 'cover' }}
                    src={lessons[activeLesson].videoUrl}
                    poster={course.thumbnail ? `/api/uploads/${course.thumbnail}` : undefined}
                    onEnded={() => handleMarkComplete(activeLesson)}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="text-muted text-center py-5">No content available for this lesson.</div>
                )}
                <div className="mt-3" style={{ color: '#444' }}>{lessons[activeLesson]?.description}</div>
              </div>
            )}
            {activeTab === 'notes' && (
              <div>
                <div className="alert alert-info py-2 mb-2" style={{fontSize: '0.97rem'}}>Notes will be saved when this feature is enabled.</div>
                <textarea
                  className="form-control"
                  rows={6}
                  placeholder="Write your notes here..."
                  value={notes[activeLesson] || ''}
                  onChange={e => handleNoteChange(activeLesson, e.target.value)}
                />
              </div>
            )}
            {activeTab === 'qa' && (
              <div>
                <div className="alert alert-info py-2 mb-2" style={{fontSize: '0.97rem'}}>Q&amp;A will be saved when this feature is enabled.</div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    placeholder="Ask a question about this lesson..."
                    value={questionInput}
                    onChange={e => setQuestionInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddQuestion()}
                  />
                  <button className="btn btn-primary btn-sm mt-2" onClick={handleAddQuestion}>Post Question</button>
                </div>
                <div>
                  {questions.length === 0 ? (
                    <div className="text-muted">No questions yet. Be the first to ask!</div>
                  ) : (
                    <ul className="list-group">
                      {questions.map((q, idx) => (
                        <li key={idx} className="list-group-item d-flex flex-column align-items-start">
                          <span className="fw-semibold">{q.user}</span>
                          <span>{q.text}</span>
                          <span className="text-muted small mt-1">{q.date}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'learners' && (
              <div>
                <h5 className="mb-3"><FiUsers className="me-2" />Fellow Learners</h5>
                {learnersLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : learnersError ? (
                  <div className="alert alert-danger">{learnersError}</div>
                ) : learners.length === 0 ? (
                  <div>No fellow learners enrolled yet.</div>
                ) : (
                  <div className="row g-3">
                    {learners.map((learner, idx) => (
                      <div key={learner._id || idx} className="col-6 col-md-4 col-lg-6">
                        <div className="d-flex align-items-center p-2 bg-light rounded-3 shadow-sm">
                          <img src={learner.avatar || '/default-avatar.png'} alt={learner.name || learner.email} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e3e3e3', marginRight: 10 }} />
                          <div>
                            <div className="fw-semibold">{learner.name || learner.email}</div>
                            {learner.progress !== undefined && (
                              <div className="small text-muted">Progress: {learner.progress}%</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 