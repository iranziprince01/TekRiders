import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

const localCourses = new PouchDB('courses');

const remoteUrl = import.meta.env.VITE_COUCHDB_URL || 'http://192.168.1.66:5984';
const remoteCourses = new PouchDB(`${remoteUrl}/courses`, {
  fetch: (url, opts) => {
    // Attach JWT for secure sync if available
    const token = localStorage.getItem('token');
    if (token) opts.headers.set('Authorization', 'Bearer ' + token);
    return PouchDB.fetch(url, opts);
  }
});

export function syncCourses() {
  return localCourses.sync(remoteCourses, {
    live: true,
    retry: true
  });
}

export async function getAllCourses() {
  const res = await localCourses.allDocs({ include_docs: true });
  return res.rows.map(row => row.doc);
}

export async function addCourse(course) {
  return localCourses.post(course);
}

export { localCourses };
