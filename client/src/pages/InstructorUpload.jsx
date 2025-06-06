import { useState } from 'react';

export default function InstructorUpload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submit = async e => {
    e.preventDefault();
    await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description })
    });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Upload Course</h2>
      <form onSubmit={submit} className="mb-3">
        <input className="form-control mb-2" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
        <textarea className="form-control mb-2" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
        <button className="btn btn-primary" type="submit">Submit</button>
      </form>
    </div>
  );
}
