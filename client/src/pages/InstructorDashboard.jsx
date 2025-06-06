import { useState } from 'react';
import { addCourse } from '../services/db';

export default function InstructorDashboard() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title) return;
    await addCourse({ title, status: 'pending', uploadedAt: new Date().toISOString() });
    setMessage('Course uploaded and pending approval!');
    setTitle('');
  };

  return (
    <div className="container mt-4">
      <h2>Instructor Dashboard</h2>
      <form onSubmit={handleUpload} className="mb-3">
        <div className="mb-2">
          <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} placeholder="Course Title" />
        </div>
        <button className="btn btn-primary" type="submit">Upload Course</button>
      </form>
      {message && <div className="alert alert-success">{message}</div>}
      {/* Add approval status list here */}
    </div>
  );
} 