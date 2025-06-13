import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FiUser } from 'react-icons/fi';

const API_URL = 'http://localhost:3000/api';

export default function Course() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [owner, setOwner] = useState(null);

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

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!course) return null;

  return (
    <div className="container-fluid py-4" style={{ background: '#f6f8fa', minHeight: '80vh' }}>
      <div className="row g-4 flex-column-reverse flex-lg-row align-items-center justify-content-center" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Left: Main Video */}
        <div className="col-12 col-lg-7 d-flex flex-column align-items-center align-items-lg-end justify-content-center mb-4 mb-lg-0">
          {course.videos && course.videos.length > 0 ? (
            <div className="card border-0 shadow-lg p-4 mb-4" style={{ borderRadius: 28, background: '#fff', width: 480, maxWidth: '100%' }}>
              <video controls style={{ borderRadius: 18, background: '#000', width: '100%', minHeight: 340, maxHeight: 480, objectFit: 'cover', poster: course.thumbnail || course.image ? `${API_URL}/courses/uploads/${course.thumbnail || course.image}` : undefined }}>
                <source src={`${API_URL}/courses/uploads/${course.videos[0].filename}`} type={course.videos[0].mimetype} />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="card border-0 shadow-lg p-5 text-center" style={{ borderRadius: 28, minHeight: 340, background: '#fff', width: 480, maxWidth: '100%' }}>
              <span className="text-muted">No video available</span>
            </div>
          )}
          {/* Additional videos */}
          {course.videos && course.videos.length > 1 && (
            <div className="mt-3 w-100">
              <h6 className="fw-semibold mb-2">More Videos</h6>
              <div className="row g-2">
                {course.videos.slice(1).map((video, idx) => (
                  <div key={video.filename} className="col-12">
                    <div className="card border-0 shadow-sm p-2" style={{ borderRadius: 10, background: '#f8fafc' }}>
                      <video controls style={{ borderRadius: 8, background: '#000', width: '100%', minHeight: 100, maxHeight: 160, objectFit: 'cover', poster: course.thumbnail || course.image ? `${API_URL}/courses/uploads/${course.thumbnail || course.image}` : undefined }}>
                        <source src={`${API_URL}/courses/uploads/${video.filename}`} type={video.mimetype} />
                        Your browser does not support the video tag.
                      </video>
                      <div className="mt-1 text-center text-muted" style={{ fontSize: '0.98rem' }}>Video {idx + 2}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Right: Course & Tutor Info */}
        <div className="col-12 col-lg-5 d-flex flex-column justify-content-center">
          <div className="card border-0 shadow-lg p-4" style={{ borderRadius: 28, background: '#fff', minWidth: 340 }}>
            <h1 className="fw-bold mb-2" style={{ fontSize: '2.1rem' }}>{course.title}</h1>
            <div className="mb-3 text-muted" style={{ fontSize: '1.08rem' }}>{course.category} &bull; {course.language?.toUpperCase()}</div>
            <p className="mb-4" style={{ fontSize: '1.1rem', color: '#444' }}>{course.description}</p>
            {course.price && course.price > 0 && (
              <div className="mb-3">
                <span className="badge bg-success fs-6">${course.price}</span>
              </div>
            )}
            <div className="d-flex align-items-center mt-4">
              <div className="me-3">
                <img
                  src={owner?.avatar || '/default-avatar.png'}
                  alt="Tutor Avatar"
                  style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e3e3e3' }}
                />
              </div>
              <div>
                <div className="fw-semibold" style={{ fontSize: '1.1rem' }}>
                  {owner?.firstName
                    ? `${owner.firstName}${owner.lastName ? ' ' + owner.lastName : ''}`
                    : owner?.name || 'Course Owner'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 