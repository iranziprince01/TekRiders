import { useEffect, useState } from 'react';
import { localCourses, syncCourses } from '../services/db';

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [syncStatus, setSyncStatus] = useState('idle');

  useEffect(() => {
    const sync = syncCourses()
      .on('change', () => setSyncStatus('syncing'))
      .on('paused', () => setSyncStatus('paused'))
      .on('active', () => setSyncStatus('active'))
      .on('error', () => setSyncStatus('error'));
    localCourses.allDocs({ include_docs: true }).then(res => {
      setCourses(res.rows.map(row => row.doc));
    });
    return () => sync.cancel();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Student Dashboard</h2>
      <div>Sync status: {syncStatus}</div>
      <ul className="list-group mt-3">
        {courses.map(course => (
          <li className="list-group-item" key={course._id}>{course.title}</li>
        ))}
      </ul>
    </div>
  );
} 