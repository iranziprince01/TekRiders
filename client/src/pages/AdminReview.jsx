import { useEffect, useState } from 'react';

export default function AdminReview() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('/api/courses/pending', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(setCourses);
  }, []);

  const approve = async id => {
    await fetch(`/api/courses/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    setCourses(courses.filter(c => c._id !== id));
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Pending Courses</h2>
      <ul className="list-group">
        {courses.map(c => (
          <li key={c._id} className="list-group-item d-flex justify-content-between">
            <div>
              <h5>{c.title}</h5>
              <p>{c.description}</p>
            </div>
            <button className="btn btn-success" onClick={() => approve(c._id)}>Approve</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
