import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiCheckCircle, FiBookOpen, FiMessageCircle, FiEdit2 } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL + '/api';

export default function Course() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [owner, setOwner] = useState(null);
  const [activeLesson, setActiveLesson] = useState(0);
  const [activeTab, setActiveTab] = useState('content');
  const [notes, setNotes] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionInput, setQuestionInput] = useState('');
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/courses/${courseId}`);
        setCourse(res.data);
        // Fetch tutor/owner info
        if (res.data.author) {
          const userRes = await axios.get(`${API_URL.replace('/api','')}/api/users/${res.data.author}`);
          setOwner(userRes.data);
        }
      } catch (err) {
        setError('Failed to load course.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Mock lessons if not present
  const lessons = course?.content?.length
    ? course.content
    : [
        { title: 'Introduction', type: 'video', video: course?.videos?.[0], description: course?.description },
        { title: 'Lesson 2', type: 'video', video: course?.videos?.[1], description: 'Continue learning...' },
      ];

  const handleMarkComplete = idx => {
    setCompletedLessons(prev => prev.includes(idx) ? prev : [...prev, idx]);
  };

  const handleAddQuestion = () => {
    if (questionInput.trim()) {
      setQuestions(qs => [...qs, { text: questionInput, user: user?.firstName || user?.email, date: new Date().toLocaleString() }]);
      setQuestionInput('');
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!course) return null;

  return (
    <div className="container-fluid py-4" style={{ background: '#f6f8fa', minHeight: '80vh' }}>
      <div className="row" style={{ maxWidth: 1200, margin: '0 auto' }}>
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
                  <span>{lesson.title}</span>
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
            <div className="d-flex align-items-center mb-3 gap-3">
              <h3 className="fw-bold mb-0 flex-grow-1">{lessons[activeLesson]?.title}</h3>
              {!completedLessons.includes(activeLesson) && (
                <button className="btn btn-outline-success btn-sm" onClick={() => handleMarkComplete(activeLesson)}>
                  <FiCheckCircle className="me-1" /> Mark Complete
                </button>
              )}
            </div>
            <div className="mb-3">
              <button className={`btn btn-sm me-2 ${activeTab === 'content' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('content')}>Content</button>
              <button className={`btn btn-sm me-2 ${activeTab === 'notes' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('notes')}><FiEdit2 className="me-1" />Notes</button>
              <button className={`btn btn-sm ${activeTab === 'qa' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('qa')}><FiMessageCircle className="me-1" />Q&A</button>
            </div>
            {activeTab === 'content' && (
              <div>
                {lessons[activeLesson]?.type === 'video' && lessons[activeLesson]?.video ? (
                  <video controls style={{ borderRadius: 12, background: '#000', width: '100%', minHeight: 260, maxHeight: 400, objectFit: 'cover' }}>
                    <source src={`${API_URL}/courses/uploads/${lessons[activeLesson].video.filename}`} type={lessons[activeLesson].video.mimetype} />
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
                <textarea
                  className="form-control"
                  rows={6}
                  placeholder="Write your notes here..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
                    </div>
            )}
            {activeTab === 'qa' && (
              <div>
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
            </div>
        </div>
        {/* Right: Tutor & Course Info */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 18, background: '#fff' }}>
            <h5 className="fw-bold mb-2">Course Info</h5>
            <div className="mb-2 text-muted">{course.category} &bull; {course.language?.toUpperCase()}</div>
            <div className="mb-3" style={{ color: '#444' }}>{course.description}</div>
            {course.price && course.price > 0 && (
              <div className="mb-3">
                <span className="badge bg-success fs-6">${course.price}</span>
              </div>
            )}
            <div className="d-flex align-items-center mt-3">
                <img
                  src={owner?.avatar || '/default-avatar.png'}
                  alt="Tutor Avatar"
                style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e3e3e3' }}
                />
              <div className="ms-3">
                <div className="fw-semibold" style={{ fontSize: '1.08rem' }}>
                  {owner?.firstName
                    ? `${owner.firstName}${owner.lastName ? ' ' + owner.lastName : ''}`
                    : owner?.name || 'Course Owner'}
                </div>
                <div className="text-muted small">{owner?.email}</div>
              </div>
            </div>
          </div>
          {/* Resources or Attachments could go here */}
        </div>
      </div>
    </div>
  );
} 