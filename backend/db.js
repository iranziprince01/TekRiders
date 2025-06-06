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

// Get users database
const usersDb = nanoInstance.db.use('users');

// Ensure users database exists
const ensureUsersDb = async () => {
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
};

// Call ensureUsersDb when the module loads
ensureUsersDb();

module.exports = { nanoInstance, usersDb }; 