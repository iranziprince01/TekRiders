import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

const localCourses = new PouchDB('courses');

const remoteUrl = import.meta.env.VITE_COUCHDB_URL || 'http://localhost:5984';
const remoteCourses = new PouchDB(`${remoteUrl}/courses`, {
  auth: {
    username: import.meta.env.VITE_COUCHDB_USER || 'prince',
    password: import.meta.env.VITE_COUCHDB_PASS || 'iranzi123'
  }
});

export function syncCourses() {
  return localCourses.sync(remoteCourses, {
    live: true,
    retry: true
  });
}

export { localCourses };
