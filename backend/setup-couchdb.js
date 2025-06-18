require('dotenv').config();
const nano = require('nano');

// Use a default CouchDB URL if not set
const couchUrl = process.env.COUCHDB_URL || 'http://localhost:5984';
const couchUser = process.env.COUCHDB_USER;
const couchPass = process.env.COUCHDB_PASS;

console.log('COUCHDB_URL:', couchUrl);
console.log('COUCHDB_USER:', couchUser);
console.log('COUCHDB_PASS:', couchPass ? '***' : '(not set)');

if (!couchUser || !couchPass) {
  console.error('COUCHDB_USER and COUCHDB_PASS must be set in your .env file.');
  process.exit(1);
}

// Create authenticated nano instance
const nanoInstance = nano({
  url: couchUrl,
  requestDefaults: {
    auth: {
      username: couchUser,
      password: couchPass
    }
  }
});

async function setupCouchDB() {
  try {
    console.log('Setting up CouchDB...');
    
    // 1. Create users database if it doesn't exist
    const usersDb = nanoInstance.db.use('users');
    try {
      await usersDb.info();
      console.log('Users database exists');
    } catch (err) {
      if (err.statusCode === 404) {
        console.log('Creating users database...');
        await nanoInstance.db.create('users');
        console.log('Users database created');
      } else {
        throw err;
      }
    }

    // 2. Set security settings for users database
    console.log('\nSetting security settings for users database...');
    const securityDoc = {
      admins: {
        names: [couchUser],
        roles: []
      },
      members: {
        names: [couchUser],
        roles: []
      }
    };
    
    await usersDb.insert(securityDoc, '_security');
    console.log('Security settings updated');

    // 3. Create index for email field
    console.log('\nCreating index for email field...');
    const emailIndex = {
      index: {
        fields: ['email']
      },
      name: 'email-index',
      type: 'json'
    };

    await usersDb.createIndex(emailIndex);
    console.log('Email index created');

    // 4. Create index for phone field
    console.log('\nCreating index for phone field...');
    const phoneIndex = {
      index: {
        fields: ['phone']
      },
      name: 'phone-index',
      type: 'json'
    };

    await usersDb.createIndex(phoneIndex);
    console.log('Phone index created');

    // 5. Verify index creation
    console.log('\nVerifying indexes...');
    const indexes = await usersDb.get('_index');
    console.log('Available indexes:', indexes);

    // --- COURSES DB SETUP ---
    const coursesDb = nanoInstance.db.use('courses');
    try {
      await coursesDb.info();
      console.log('Courses database exists');
    } catch (err) {
      if (err.statusCode === 404) {
        console.log('Creating courses database...');
        await nanoInstance.db.create('courses');
        console.log('Courses database created');
      } else {
        throw err;
      }
    }

    // Create index for author field in courses
    console.log('\nCreating index for author field in courses...');
    const authorIndex = {
      index: { fields: ['author'] },
      name: 'author-index',
      type: 'json'
    };
    await coursesDb.createIndex(authorIndex);
    console.log('Author index created');

    // Create index for status field in courses
    console.log('\nCreating index for status field in courses...');
    const statusIndex = {
      index: { fields: ['status'] },
      name: 'status-index',
      type: 'json'
    };
    await coursesDb.createIndex(statusIndex);
    console.log('Status index created');

    console.log('\nSetup completed successfully!');
  } catch (err) {
    console.error('\nSetup failed:', err);
    console.error('Error details:', {
      statusCode: err.statusCode,
      message: err.message,
      reason: err.reason
    });
  }
}

// Run the setup
setupCouchDB(); 

module.exports = setupCouchDB; 