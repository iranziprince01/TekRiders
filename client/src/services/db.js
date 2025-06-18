import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

const localCourses = new PouchDB('courses');

const remoteUrl = import.meta.env.VITE_COUCHDB_URL || 'http://localhost:5984';
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

const localDB = new PouchDB('tek_riders');
const remoteDB = new PouchDB(`${import.meta.env.VITE_API_URL}/couchdb/tek_riders`, {
  skip_setup: true
});

export function startSync() {
  localDB.sync(remoteDB, {
    live: true,
    retry: true
  }).on('change', info => {
    // handle change
    console.log('PouchDB sync change:', info);
  }).on('error', err => {
    console.error('PouchDB sync error:', err);
  });
}

export { localDB };

// Example: Fetch all courses from local PouchDB
export async function getLocalCourses() {
  try {
    const result = await localDB.allDocs({ include_docs: true, startkey: 'course_', endkey: 'course_\uffff' });
    return result.rows.map(row => row.doc);
  } catch (e) {
    return [];
  }
}

// Example: Save user progress locally
export async function saveLocalProgress(courseId, progress) {
  try {
    const docId = `progress_${courseId}`;
    let doc;
    try {
      doc = await localDB.get(docId);
      doc.progress = progress;
      await localDB.put(doc);
    } catch (err) {
      if (err.status === 404) {
        await localDB.put({ _id: docId, progress });
      } else {
        throw err;
      }
    }
  } catch (e) {
    // handle error
  }
}
