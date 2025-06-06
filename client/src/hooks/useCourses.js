import { useEffect, useState } from 'react';
import { localCourses, syncCourses } from '../services/db';

export default function useCourses(status = 'approved') {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const syncHandler = syncCourses();

    const fetchCourses = async () => {
      const result = await localCourses.find({ selector: { status } });
      setCourses(result.docs);
    };

    fetchCourses();
    localCourses.changes({ live: true, since: 'now', include_docs: true })
      .on('change', fetchCourses);

    return () => {
      syncHandler.cancel();
    };
  }, [status]);

  return courses;
}
