import useCourses from '../hooks/useCourses';

export default function Dashboard() {
  const courses = useCourses();

  return (
    <div className="container py-4">
      <h2 className="mb-4">Available Courses</h2>
      <ul className="list-group">
        {courses.map(c => (
          <li key={c._id} className="list-group-item">
            <h5>{c.title}</h5>
            <p>{c.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
