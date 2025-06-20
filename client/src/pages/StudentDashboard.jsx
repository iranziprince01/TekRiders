import { useState, useEffect, useRef } from 'react';
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
import { getLocalCourses } from '../services/db';

const LearnerDashboard = () => {
  const { t } = useTranslation();
  const { user, logout, offlineMode } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
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
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrolling, setEnrolling] = useState({}); // { [courseId]: boolean }
  const [enrollSuccess, setEnrollSuccess] = useState({}); // { [courseId]: boolean }
  const [enrollError, setEnrollError] = useState({}); // { [courseId]: string }
  const [courseProgress, setCourseProgress] = useState({}); // { [courseId]: [completedLessonIndices] }
  const [siteStatus, setSiteStatus] = useState(navigator.onLine ? 'Online' : 'Offline');
  const [badges, setBadges] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [achievementsError, setAchievementsError] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('highContrast') === 'true');
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [ttsLang, setTtsLang] = useState('en');
  const [voiceInput, setVoiceInput] = useState('');
  const [transcript, setTranscript] = useState('');
  const ttsRef = useRef(null);

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

  // Listen for online/offline events
  useEffect(() => {
    const updateStatus = () => setSiteStatus(navigator.onLine ? 'Online' : 'Offline');
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  // Fetch approved courses for Home tab
  useEffect(() => {
      setHomeLoading(true);
      setHomeError('');
    if (offlineMode) {
      getLocalCourses()
        .then(courses => {
          setApprovedCourses(courses.filter(c => c.status === 'approved'));
          setHomeLoading(false);
        })
        .catch(() => {
          setHomeError('No offline courses found. Please connect to the internet to sync courses.');
          setHomeLoading(false);
        });
    } else {
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
  }, [activeTab, offlineMode]);

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

  // Fetch enrolled courses for the learner
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user || !user._id) return;
      if (offlineMode) {
        // Offline: get all local courses and filter by enrolledCourses
        const localCourses = await getLocalCourses();
        const profile = JSON.parse(localStorage.getItem('user'));
        const enrolledIds = profile?.enrolledCourses || [];
        setEnrolledCourses(localCourses.filter(c => enrolledIds.includes(c._id)));
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const profileRes = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const enrolledIds = profileRes.data.enrolledCourses || [];
        if (enrolledIds.length === 0) {
          setEnrolledCourses([]);
          return;
        }
        // Fetch course details for each enrolled course
        const courseDetails = await Promise.all(
          enrolledIds.map(async (id) => {
            try {
              const res = await axios.get(`/api/courses/${id}`);
              return res.data;
            } catch {
              return null;
            }
          })
        );
        setEnrolledCourses(courseDetails.filter(Boolean));
      } catch (err) {
        setEnrolledCourses([]);
      }
    };
    fetchEnrolledCourses();
  }, [user, offlineMode]);

  // Fetch progress for all enrolled courses
  useEffect(() => {
    const fetchAllProgress = async () => {
      if (!enrolledCourses.length) return;
      if (offlineMode) {
        // Offline: get progress from localStorage or PouchDB (if implemented)
        const progressData = {};
        enrolledCourses.forEach(course => {
          const docId = `progress_${course._id}`;
          try {
            const doc = JSON.parse(localStorage.getItem(docId));
            progressData[course._id] = doc?.progress || [];
          } catch {
            progressData[course._id] = [];
          }
        });
        setCourseProgress(progressData);
        return;
      }
      const token = localStorage.getItem('token');
      const progressData = {};
      await Promise.all(enrolledCourses.map(async (course) => {
        try {
          const res = await axios.get(`/api/courses/${course._id}/progress`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          progressData[course._id] = res.data.completed || [];
        } catch {
          progressData[course._id] = [];
        }
      }));
      setCourseProgress(progressData);
    };
    fetchAllProgress();
  }, [enrolledCourses, offlineMode]);

  // Fetch badges and certificates when Achievements tab is active
  useEffect(() => {
    if (activeTab === 'achievements' && user?._id) {
      setAchievementsLoading(true);
      setAchievementsError('');
      Promise.all([
        axios.get(`/api/users/${user._id}/badges`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get(`/api/users/${user._id}/certificates`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ])
        .then(([badgesRes, certsRes]) => {
          setBadges(badgesRes.data);
          setCertificates(certsRes.data);
          setAchievementsLoading(false);
        })
        .catch(err => {
          setAchievementsError('Failed to load achievements.');
          setAchievementsLoading(false);
        });
    }
  }, [activeTab, user]);

  // Theme switcher effect (applies to all dashboard pages)
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', highContrast);
  }, [theme, highContrast]);

  // Text-to-speech (mock, browser SpeechSynthesis)
  const handleSpeak = (text) => {
    if (!window.speechSynthesis) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = ttsLang === 'rw' ? 'rw-RW' : 'en-US';
    window.speechSynthesis.speak(utter);
  };

  // Voice-to-text (mock, browser SpeechRecognition)
  const handleVoiceToText = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = ttsLang === 'rw' ? 'rw-RW' : 'en-US';
    recognition.onresult = (event) => {
      setVoiceInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  // Transcript auto-generation (mock)
  const handleGenerateTranscript = () => {
    setTranscript('This is a mock transcript. In production, integrate with Google Speech-to-Text API.');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'courses':
        return (
          <div className="container py-4">
            <h2 className="fw-bold mb-4" style={{letterSpacing: '0.01em'}}>My Courses</h2>
            <div className="row g-4">
              {enrolledCourses.length === 0 ? (
                <div className="col-12"><div className="alert alert-info">You have not enrolled in any courses yet.</div></div>
              ) : (
                enrolledCourses.map(course => (
                  <div key={course._id || course.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
                    <div className="card shadow-sm border-0 flex-fill h-100 p-3 course-card-coursera" style={{borderRadius: 18, transition: 'box-shadow 0.2s, transform 0.2s', minHeight: 340, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                      <img
                        src={course.thumbnail ? `/api/uploads/${course.thumbnail}` : 'https://picsum.photos/400/240'}
                        alt={course.title}
                        className="card-img-top mb-3"
                        style={{height: 160, objectFit: 'cover', borderRadius: 14, boxShadow: '0 2px 12px rgba(56,189,248,0.07)'}}
                      />
                      <div className="flex-grow-1 d-flex flex-column justify-content-between">
                        <h5 className="fw-bold mb-2 text-truncate" title={course.title}>{course.title}</h5>
                        <div className="mb-2 text-muted small text-truncate" title={course.category}>{course.category}</div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <img src={tutors[course.author]?.avatar || '/default-avatar.png'} alt="Tutor" style={{width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e3e3e3'}} />
                          <span className="fw-semibold" style={{fontSize: '1.01rem'}}>{tutors[course.author]?.firstName ? tutors[course.author].firstName + (tutors[course.author].lastName ? ' ' + tutors[course.author].lastName : '') : tutors[course.author]?.name || 'Tutor'}</span>
                        </div>
                        <Link to={`/course/${course._id || course.id}`} className="btn btn-primary w-100 mt-auto" style={{borderRadius: 10, padding: '0.7rem 0', fontWeight: 600}}>Go to Course</Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
          <div className="container py-4">
            <h2 className="fw-bold mb-4" style={{letterSpacing: '0.01em'}}>All Courses</h2>
            <div className="row g-4">
              {homeLoading ? (
                <div className="col-12 text-center py-5">Loading...</div>
              ) : homeError ? (
                <div className="col-12"><div className="alert alert-danger">{homeError}</div></div>
              ) : filteredCourses.length === 0 ? (
                <div className="col-12"><div className="alert alert-info">No courses found.</div></div>
              ) : (
                filteredCourses.map(course => {
                  const isEnrolled = enrolledCourses.some(ec => ec._id === course._id);
                  return (
                    <div key={course._id || course.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
                      <div
                        className="card shadow-sm border-0 flex-fill h-100 p-3 course-card-coursera"
                        style={{
                          borderRadius: 18,
                          transition: 'box-shadow 0.2s, transform 0.2s',
                          minHeight: 340,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          cursor: isEnrolled ? 'pointer' : 'default',
                        }}
                        onClick={() => {
                          if (isEnrolled) navigate(`/course/${course._id}`);
                        }}
                        tabIndex={isEnrolled ? 0 : -1}
                        aria-label={isEnrolled ? `Go to course ${course.title}` : undefined}
                      >
                        <img
                          src={course.thumbnail ? `/api/uploads/${course.thumbnail}` : 'https://picsum.photos/400/240'}
                          alt={course.title}
                          className="card-img-top mb-3"
                          style={{height: 160, objectFit: 'cover', borderRadius: 14, boxShadow: '0 2px 12px rgba(56,189,248,0.07)'}}
                        />
                        <div className="flex-grow-1 d-flex flex-column justify-content-between">
                          <h5 className="fw-bold mb-2 text-truncate" title={course.title}>{course.title}</h5>
                          <div className="mb-2 text-muted small text-truncate" title={course.category}>{course.category}</div>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <img src={tutors[course.author]?.avatar || '/default-avatar.png'} alt="Tutor" style={{width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e3e3e3'}} />
                            <span className="fw-semibold" style={{fontSize: '1.01rem'}}>{tutors[course.author]?.firstName ? tutors[course.author].firstName + (tutors[course.author].lastName ? ' ' + tutors[course.author].lastName : '') : tutors[course.author]?.name || 'Tutor'}</span>
                          </div>
                          <Link
                            to="#"
                            className="btn btn-primary w-100 mt-auto"
                            style={{borderRadius: 10, padding: '0.7rem 0', fontWeight: 600}}
                            disabled={enrolling[course._id] || isEnrolled}
                            onClick={async (e) => {
                              e.preventDefault();
                              if (enrolling[course._id] || isEnrolled) return;
                              setEnrolling(prev => ({ ...prev, [course._id]: true }));
                              setEnrollError(prev => ({ ...prev, [course._id]: '' }));
                              try {
                                const token = localStorage.getItem('token');
                                await axios.post(`/api/courses/${course._id}/enroll`, {}, {
                                  headers: { Authorization: `Bearer ${token}` }
                                });
                                setEnrollSuccess(prev => ({ ...prev, [course._id]: true }));
                                // Refetch enrolled courses
                                const profileRes = await axios.get('/api/users/profile', {
                                  headers: { Authorization: `Bearer ${token}` }
                                });
                                const enrolledIds = profileRes.data.enrolledCourses || [];
                                const courseDetails = await Promise.all(
                                  enrolledIds.map(async (id) => {
                                    try {
                                      const res = await axios.get(`/api/courses/${id}`);
                                      return res.data;
                                    } catch {
                                      return null;
                                    }
                                  })
                                );
                                setEnrolledCourses(courseDetails.filter(Boolean));
                                // Optionally, refetch approvedCourses to update enrollment counts
                                axios.get('/api/courses/approved').then(res => setApprovedCourses(res.data));
                              } catch (err) {
                                setEnrollError(prev => ({ ...prev, [course._id]: err?.response?.data?.message || 'Failed to enroll' }));
                              } finally {
                                setEnrolling(prev => ({ ...prev, [course._id]: false }));
                              }
                            }}
                          >
                            {isEnrolled ? 'Enrolled' : enrolling[course._id] ? 'Enrolling...' : 'Enroll'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      case 'progress':
        return (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">{t('Progress')}</h5>
            </div>
            <div className="card-body">
              {enrolledCourses.length === 0 ? (
                <div className="alert alert-info">{t('No enrolled courses')}</div>
              ) : (
                <div className="row g-4">
                  {enrolledCourses.map(course => {
                    const completed = courseProgress[course._id] || [];
                    const lessons = Array.isArray(course.content) && course.content.length > 0
                      ? course.content
                      : (Array.isArray(course.videos) ? course.videos : []);
                    return (
                      <div key={course._id} className="col-md-6 col-lg-4">
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
                            <div className="progress mb-2" style={{ height: 8 }}>
                              <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${lessons.length ? (completed.length / lessons.length) * 100 : 0}%` }}
                              />
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <small className="text-muted">{t('Progress')}: {completed.length} / {lessons.length}</small>
                              <Link to={`/course/${course._id}`} className="btn btn-sm btn-primary">{t('Continue')}</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
            </div>
          </div>
        );
      case 'achievements':
        return (
          <div className="container py-4">
            <h2 className="fw-bold mb-4" style={{letterSpacing: '0.01em'}}>Achievements</h2>
            {achievementsLoading ? (
              <div className="text-center py-5">Loading...</div>
            ) : achievementsError ? (
              <div className="alert alert-danger">{achievementsError}</div>
            ) : (
              <>
                <div className="row g-4 mb-4">
                  {badges.length === 0 ? (
                    <div className="col-12"><div className="alert alert-info">No badges earned yet.</div></div>
                  ) : (
                    badges.map(badge => (
                      <div key={badge.id} className="col-12 col-sm-6 col-md-4 d-flex">
                        <div className="card border-0 shadow-sm flex-fill h-100 p-4 text-center" style={{borderRadius: 18, minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                          <div className="display-4 mb-2 text-primary"><FiAward /></div>
                          <h5 className="fw-bold mb-1">{badge.title || 'Badge'}</h5>
                          <div className="text-muted small mb-2">{badge.date ? new Date(badge.date).toLocaleDateString() : ''}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <h4 className="fw-bold mb-3">Certificates</h4>
                <div className="row g-4">
                  {certificates.length === 0 ? (
                    <div className="col-12"><div className="alert alert-info">No certificates earned yet.</div></div>
                  ) : (
                    certificates.map(cert => (
                      <div key={cert.id} className="col-12 col-md-6 d-flex">
                        <div className="card border-0 shadow-sm flex-fill h-100 p-4 d-flex flex-row align-items-center justify-content-between" style={{borderRadius: 18, minHeight: 120}}>
                          <div>
                            <h6 className="fw-bold mb-1">{cert.courseTitle || cert.title}</h6>
                            <div className="text-muted small mb-1">Issued: {cert.date ? new Date(cert.date).toLocaleDateString() : ''}</div>
                          </div>
                          <a href={cert.downloadUrl || '#'} className="btn btn-outline-primary" download>Download</a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        );
      case 'accessibility':
        return (
          <div className="container py-4">
            <h2 className="fw-bold mb-4" style={{letterSpacing: '0.01em'}}>Accessibility Settings</h2>
            <div className="row g-4 mb-4">
              {/* Theme Switcher */}
              <div className="col-12 col-md-6 d-flex">
                <div className="card border-0 shadow-sm flex-fill h-100 p-4" style={{borderRadius: 18}}>
                  <h5 className="fw-bold mb-3">Theme Switcher</h5>
                  <div className="d-flex gap-2 mb-2">
                    <button className={`btn btn-${theme === 'light' ? 'primary' : 'outline-primary'}`} onClick={() => setTheme('light')}>Light</button>
                    <button className={`btn btn-${theme === 'dark' ? 'primary' : 'outline-primary'}`} onClick={() => setTheme('dark')}>Dark</button>
                    <button className={`btn btn-${highContrast ? 'primary' : 'outline-primary'}`} onClick={() => setHighContrast(h => !h)}>High Contrast</button>
                  </div>
                  <div className="text-muted small">Switch between light, dark, and high-contrast modes for better visibility.</div>
                </div>
              </div>
              {/* Text-to-Speech & Voice-to-Text */}
              <div className="col-12 col-md-6 d-flex">
                <div className="card border-0 shadow-sm flex-fill h-100 p-4" style={{borderRadius: 18}}>
                  <h5 className="fw-bold mb-3">Text-to-Speech & Voice-to-Text</h5>
                  <div className="mb-2">
                    <label className="form-label">Language</label>
                    <select className="form-select" value={ttsLang} onChange={e => setTtsLang(e.target.value)}>
                      <option value="en">English</option>
                      <option value="rw">Kinyarwanda</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <textarea className="form-control mb-2" rows={2} placeholder="Enter text to speak..." ref={ttsRef}></textarea>
                    <button className="btn btn-outline-primary me-2" onClick={() => handleSpeak(ttsRef.current.value)}>Speak</button>
                  </div>
                  <div className="mb-2">
                    <button className="btn btn-outline-secondary me-2" onClick={handleVoiceToText}>Start Voice Input</button>
                    <input className="form-control mt-2" value={voiceInput} onChange={e => setVoiceInput(e.target.value)} placeholder="Voice input will appear here..." />
                  </div>
                  <div className="text-muted small">Text-to-speech and voice-to-text support English and Kinyarwanda (browser-based, Google API in production).</div>
                </div>
              </div>
              {/* Transcript Generation */}
              <div className="col-12 col-md-6 d-flex">
                <div className="card border-0 shadow-sm flex-fill h-100 p-4" style={{borderRadius: 18}}>
                  <h5 className="fw-bold mb-3">Auto-Generated Transcripts</h5>
                  <button className="btn btn-outline-primary mb-2" onClick={handleGenerateTranscript}>Generate Transcript</button>
                  <textarea className="form-control" rows={3} value={transcript} readOnly placeholder="Transcript will appear here..." />
                  <div className="text-muted small mt-2">Transcripts are auto-generated for audio/video lessons. (Google Speech-to-Text API integration recommended for production.)</div>
                </div>
              </div>
              {/* Accessibility Enhancements */}
              <div className="col-12 col-md-6 d-flex">
                <div className="card border-0 shadow-sm flex-fill h-100 p-4" style={{borderRadius: 18}}>
                  <h5 className="fw-bold mb-3">Accessibility Enhancements</h5>
                  <ul className="mb-2">
                    <li>Screen reader compatibility (ARIA labels, semantic HTML)</li>
                    <li>High-contrast and large text options</li>
                    <li>Simple voice commands (e.g., "Go to Home", "Open My Courses")</li>
                    <li>Clear, high-contrast interfaces for visually impaired users</li>
                  </ul>
                  <div className="text-muted small">These features ensure usability for people with visual impairments or cognitive challenges.</div>
                </div>
              </div>
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
                  {approvedCourses.length === 0 ? (
                    <div className="alert alert-info">{t('No courses found.')}</div>
                  ) : (
                    approvedCourses.map(course => (
                      <div key={course._id} className="col-md-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <img 
                            src={course.thumbnail ? `/api/uploads/${course.thumbnail}` : 'https://picsum.photos/300/200'}
                          className="card-img-top" 
                          alt={course.title}
                          style={{ height: 160, objectFit: 'cover' }}
                        />
                        <div className="card-body">
                          <h6 className="card-title">{course.title}</h6>
                            <p className="text-muted small mb-2">{course.category} &bull; {course.language?.toUpperCase()}</p>
                            <div className="d-flex align-items-center mt-2">
                              <span className="me-2" style={{ fontSize: 13, color: '#888' }}>{t('By')} {tutors[course.author]?.firstName || ''} {tutors[course.author]?.lastName || 'Tutor'}</span>
                          </div>
                            <Link to={`/course/${course._id}`} className="btn btn-primary btn-sm mt-2">{t('Continue')}</Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
              <span className={`badge rounded-pill ${siteStatus === 'Online' ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '1rem', marginRight: 16 }}>{siteStatus}</span>
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