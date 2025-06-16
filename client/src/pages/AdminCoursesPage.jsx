import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('/admin/courses', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
      .then(res => setCourses(res.data))
      .catch(() => setError('Failed to load courses.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">All Courses</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Instructor</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.instructor}</td>
              <td>{course.status}</td>
              <td>--</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 