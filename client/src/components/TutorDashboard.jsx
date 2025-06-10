import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import CourseCreationForm from './CourseCreationForm';

export default function TutorDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    if (!user || !user._id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courses/instructor/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('TutorDashboard fetched courses:', data);
      console.log('TutorDashboard user._id:', user._id);
      setCourses(data);
    } catch (error) {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, [user]);

  const statusColor = (status) => {
    if (status === 'approved') return 'success';
    if (status === 'pending') return 'warning';
    if (status === 'draft') return 'secondary';
    if (status === 'rejected') return 'danger';
    return 'info';
  };

  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(search.toLowerCase()) ||
    course.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{t('My Courses')}</h2>
        <button className="btn btn-primary" onClick={fetchCourses}>
          {t('Refresh')}
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
            <div key={course._id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className={`badge bg-${statusColor(course.status)}`}>{course.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-5">
        <CourseCreationForm onSuccess={fetchCourses} />
      </div>
    </div>
  );
} 