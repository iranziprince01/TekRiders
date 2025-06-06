const nano = require('nano');
require('dotenv').config();

// Log environment variables (without password)
console.log('CouchDB URL:', process.env.COUCHDB_URL);
console.log('CouchDB User:', process.env.COUCHDB_USER);

const couchUrl = process.env.COUCHDB_URL;
const couchUser = process.env.COUCHDB_USER;
const couchPass = process.env.COUCHDB_PASS;

// Create authenticated nano instance
const nanoInstance = nano({
  url: `http://${couchUrl}`,
  requestDefaults: {
    auth: {
      username: couchUser,
      password: couchPass
    }
  }
});

// Test the connection
nanoInstance.db.list()
  .then(dbs => {
    console.log('Connected to CouchDB. Available databases:', dbs);
  })
  .catch(err => {
    console.error('CouchDB connection error:', err);
  });

// Get databases
const usersDb = nanoInstance.db.use('users');
const coursesDb = nanoInstance.db.use('courses');

// Ensure databases exist
const ensureDbs = async () => {
  try {
    await usersDb.info();
    console.log('Users database exists and is accessible');
  } catch (err) {
    if (err.statusCode === 404) {
      console.log('Creating users database...');
      await nanoInstance.db.create('users');
      console.log('Users database created');
    } else {
      console.error('Error checking/creating users database:', err);
    }
  }

  try {
    await coursesDb.info();
    console.log('Courses database exists and is accessible');
  } catch (err) {
    if (err.statusCode === 404) {
      console.log('Creating courses database...');
      await nanoInstance.db.create('courses');
      console.log('Courses database created');
    } else {
      console.error('Error checking/creating courses database:', err);
    }
  }
};

// Call ensureDbs when the module loads
ensureDbs();

module.exports = { nanoInstance, usersDb, coursesDb };
