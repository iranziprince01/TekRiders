import { useEffect, useState } from 'react';
import { localCourses } from '../services/db';

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    localCourses.allDocs({ include_docs: true }).then(res => {
      setCourses(res.rows.map(row => row.doc));
    });
  }, []);

  // Placeholder approve/reject handlers
  const handleApprove = (id) => alert(`Approve course ${id}`);
  const handleReject = (id) => alert(`Reject course ${id}`);

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <ul className="list-group mt-3">
        {courses.map(course => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={course._id}>
            {course.title} <span className="badge bg-secondary">{course.status}</span>
            <div>
              <button className="btn btn-success btn-sm me-2" onClick={() => handleApprove(course._id)}>Approve</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleReject(course._id)}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 