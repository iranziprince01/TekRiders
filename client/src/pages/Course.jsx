import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiCheckCircle, FiBookOpen, FiMessageCircle, FiEdit2, FiUsers, FiArrowLeft, FiRefreshCw, FiVolume2, FiEye, FiType, FiMic, FiSun, FiMoon } from 'react-icons/fi';
import PouchDB from 'pouchdb-browser';

const API_URL = import.meta.env.VITE_API_URL + '/api';

const MOCK_LEARNERS = [
  { name: 'Alice', avatar: '/default-avatar.png', progress: 80 },
  { name: 'Bob', avatar: '/default-avatar.png', progress: 60 },
  { name: 'Charlie', avatar: '/default-avatar.png', progress: 40 },
];

const localCourses = new PouchDB('courses');

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
  // Accessibility states
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('highContrast') === 'true');
  const [largeText, setLargeText] = useState(() => localStorage.getItem('largeText') === 'true');
  const [ttsLang, setTtsLang] = useState('en');
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [ttsText, setTtsText] = useState('');
  const [voiceInput, setVoiceInput] = useState('');
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError('');
      let loaded = false;
      try {
        const res = await axios.get(`${API_URL}/courses/${courseId}`);
        if (res.data.status !== 'approved') {
          setError('This course is not approved or not available.');
          setCourse(null);
        } else {
          setCourse(res.data);
          loaded = true;
          const tutorRes = await axios.get(`${API_URL}/users/${res.data.author}`);
          setTutorInfo(tutorRes.data);
        }
      } catch (err) {
        // API failed, try PouchDB
      }
      if (!loaded) {
        try {
          const doc = await localCourses.get(courseId);
          setCourse(doc);
          // Optionally fetch tutor info if available
        } catch (err) {
          setError('Failed to load course.');
        }
      }
      setLoading(false);
    };
    fetchCourse();
    // Fetch progress for this course
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/courses/${courseId}/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompletedLessons(res.data.completed || []);
      } catch {}
    };
    fetchProgress();
  }, [courseId]);

  // Prepare lessons/videos
  let lessons = [];
  if (Array.isArray(course?.content) && course.content.length > 0) {
    if (Array.isArray(course?.videos) && course.videos.length > 0) {
      lessons = course.content.map((lesson, idx) => ({
        ...lesson,
        videoUrl: course.videos[idx]?.filename ? `/api/uploads/${course.videos[idx].filename}` : undefined,
        originalname: course.videos[idx]?.originalname,
      }));
    } else {
      lessons = course.content;
    }
  } else if (Array.isArray(course?.videos)) {
    lessons = course.videos.map((v, idx) => ({
      title: v.originalname || `Lesson ${idx + 1}`,
      videoUrl: `/api/uploads/${v.filename}`,
      description: course.description,
      duration: '',
    }));
  }

  const handleMarkComplete = async idx => {
    if (completedLessons.includes(idx)) return;
    setCompletedLessons(prev => [...prev, idx]);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/courses/${courseId}/progress`, { lessonIndex: idx }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {}
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

  // Persist accessibility settings
  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('largeText', largeText);
    document.body.className = `${theme}${highContrast ? ' high-contrast' : ''}${largeText ? ' large-text' : ''}`;
  }, [theme, highContrast, largeText]);

  // Text-to-speech handler
  const handleSpeak = (text) => {
    if (!window.speechSynthesis) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = ttsLang === 'rw' ? 'rw-RW' : 'en-US';
    window.speechSynthesis.speak(utter);
  };

  // Voice-to-text (mocked)
  const handleVoiceToText = () => {
    setVoiceInput('Voice input (mocked): This is a sample note.');
  };

  // Transcript generation (mocked)
  const handleGenerateTranscript = () => {
    setTranscript('Transcript (mocked): This is an auto-generated transcript of the lesson video.');
  };

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
    <div
      className={`container-fluid py-4 course-page-root${theme === 'dark' ? ' dark-theme' : ''}${highContrast ? ' high-contrast' : ''}${largeText ? ' large-text' : ''}`}
      style={{ background: theme === 'dark' ? '#181c1f' : highContrast ? '#000' : '#f6f8fa', minHeight: '80vh', color: highContrast ? '#fff' : undefined }}
      aria-label="Course Page"
    >
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
                {/* Only show tutor full name and role if available */}
                <div className="mt-2">
                  {tutorInfo ? (
                    <>
                      <span className="fw-semibold" style={{ fontSize: '1.12rem' }}>{tutorInfo.firstName} {tutorInfo.lastName}</span>
                    </>
                  ) : course.authorEmail ? (
                    <span className="fw-semibold" style={{ fontSize: '1.12rem' }}>{course.authorEmail}</span>
                  ) : null}
                </div>
              </div>
            </div>
            {/* After the course header and before/after the lessons, render all lessons in a list with a checkmark if completed */}
            <div className="mb-4">
              <h4 className="fw-bold mb-3">Course Lessons</h4>
              <ul className="list-group list-group-flush mb-3">
                {lessons.map((lesson, idx) => (
                  <li
                    key={idx}
                    className={`list-group-item d-flex align-items-center justify-content-between px-0 py-2 ${activeLesson === idx ? 'fw-bold text-primary' : ''} ${largeText ? 'large-text' : ''}`}
                    style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: largeText ? '1.25rem' : '1.08rem' }}
                    onClick={() => setActiveLesson(idx)}
                    aria-label={`Lesson ${idx + 1}: ${lesson.title}`}
                  >
                    <span>{lesson.title}</span>
                    {completedLessons.includes(idx) && <FiCheckCircle className="text-success ms-2" aria-label="Completed" />}
                  </li>
                ))}
              </ul>
              {/* Main course progress bar */}
              <div className="mt-3">
                <div className="progress" style={{ height: 10, borderRadius: 8 }} aria-label="Course Progress">
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${(completedLessons.length / lessons.length) * 100}%`, borderRadius: 8 }}
                    aria-valuenow={completedLessons.length}
                    aria-valuemin={0}
                    aria-valuemax={lessons.length}
                  />
                </div>
                <div className="small text-muted mt-1">Progress: {completedLessons.length} / {lessons.length} lessons completed</div>
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
                    style={{ borderRadius: 12, background: '#000', width: '100%', minHeight: 260, maxHeight: 400, objectFit: 'cover', fontSize: largeText ? '1.35rem' : undefined }}
                    src={lessons[activeLesson].videoUrl}
                    poster={course.thumbnail ? `/api/uploads/${course.thumbnail}` : undefined}
                    onEnded={() => handleMarkComplete(activeLesson)}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : null}
                {lessons[activeLesson]?.audioUrl && (
                  <audio
                    controls
                    style={{ width: '100%', marginTop: 16, fontSize: largeText ? '1.35rem' : undefined }}
                    src={lessons[activeLesson].audioUrl}
                  >
                    Your browser does not support the audio element.
                  </audio>
                )}
                {lessons[activeLesson]?.pdfUrl && (
                  <div style={{ marginTop: 16 }}>
                    <iframe
                      src={lessons[activeLesson].pdfUrl}
                      title="Lesson PDF"
                      style={{ width: '100%', height: 480, border: '1px solid #eee', borderRadius: 8, background: '#fff', fontSize: largeText ? '1.35rem' : undefined }}
                    />
                    <div className={largeText ? 'large-text' : ''} style={{ marginTop: 8 }}>
                      <a href={lessons[activeLesson].pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">Open PDF in new tab</a>
                    </div>
                  </div>
                )}
                <div className={largeText ? 'large-text mt-3' : 'mt-3'} style={{ color: '#444', fontSize: largeText ? '1.25rem' : undefined }}>{lessons[activeLesson]?.description}</div>
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
        {/* Accessibility Panel as Third Column */}
        <div className="col-lg-3 mb-4 mb-lg-0">
          <div className="accessibility-panel card shadow-lg p-3" style={{ borderRadius: 18, background: theme === 'dark' ? '#23272b' : '#fff', color: theme === 'dark' || highContrast ? '#fff' : '#222', minWidth: 260 }} aria-label="Accessibility Settings">
            <div className="d-flex align-items-center mb-2 gap-2">
              <FiEye size={20} />
              <span className="fw-bold">Accessibility</span>
            </div>
            <div className="mb-2 d-flex gap-2">
              <button className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-outline-primary'}`} aria-label="Light Theme" onClick={() => setTheme('light')}><FiSun /></button>
              <button className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-outline-primary'}`} aria-label="Dark Theme" onClick={() => setTheme('dark')}><FiMoon /></button>
              <button className={`btn btn-sm ${highContrast ? 'btn-primary' : 'btn-outline-primary'}`} aria-label="High Contrast" onClick={() => setHighContrast(h => !h)}><FiEye /></button>
              <button className={`btn btn-sm ${largeText ? 'btn-primary' : 'btn-outline-primary'}`} aria-label="Large Text" onClick={() => setLargeText(l => !l)}><FiType /></button>
            </div>
            <div className="mb-2">
              <label className="form-label mb-1" htmlFor="ttsLang">TTS Language</label>
              <select id="ttsLang" className="form-select form-select-sm" value={ttsLang} onChange={e => setTtsLang(e.target.value)} aria-label="Text-to-Speech Language">
                <option value="en">English</option>
                <option value="rw">Kinyarwanda</option>
              </select>
            </div>
            <div className="mb-2">
              <button className="btn btn-outline-primary btn-sm me-2" aria-label="Read Lesson Content" onClick={() => handleSpeak(lessons[activeLesson]?.title + '. ' + (lessons[activeLesson]?.description || ''))}><FiVolume2 className="me-1" />Read Lesson</button>
              <button className="btn btn-outline-secondary btn-sm" aria-label="Voice Input" onClick={handleVoiceToText}><FiMic className="me-1" />Voice Input</button>
            </div>
            <div className="mb-2">
              <button className="btn btn-outline-primary btn-sm mb-1" aria-label="Generate Transcript" onClick={handleGenerateTranscript}>Generate Transcript</button>
              <textarea className="form-control form-control-sm" rows={2} value={transcript} readOnly placeholder="Transcript will appear here..." aria-label="Transcript" />
            </div>
            <div className="mb-1">
              <input className="form-control form-control-sm" value={voiceInput} onChange={e => setVoiceInput(e.target.value)} placeholder="Voice input will appear here..." aria-label="Voice Input" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 