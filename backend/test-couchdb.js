require('dotenv').config();
const nano = require('nano');

// Log environment variables (without password)
console.log('Testing CouchDB connection...');
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

async function testCouchDB() {
  try {
    // 1. Test basic connection
    console.log('\n1. Testing basic connection...');
    const info = await nanoInstance.info();
    console.log('CouchDB Info:', info);

    // 2. List databases
    console.log('\n2. Listing databases...');
    const dbs = await nanoInstance.db.list();
    console.log('Available databases:', dbs);

    // 3. Test users database
    console.log('\n3. Testing users database...');
    const usersDb = nanoInstance.db.use('users');
    
    // Check if database exists
    try {
      const dbInfo = await usersDb.info();
      console.log('Users database info:', dbInfo);
    } catch (err) {
      if (err.statusCode === 404) {
        console.log('Users database does not exist, creating it...');
        await nanoInstance.db.create('users');
        console.log('Users database created successfully');
      } else {
        throw err;
      }
    }

    // 4. Test write permission
    console.log('\n4. Testing write permission...');
    const testDoc = {
      type: 'test',
      timestamp: new Date().toISOString()
    };
    const result = await usersDb.insert(testDoc);
    console.log('Write test successful:', result);

    // 5. Test read permission
    console.log('\n5. Testing read permission...');
    const doc = await usersDb.get(result.id);
    console.log('Read test successful:', doc);

    // 6. Test delete permission
    console.log('\n6. Testing delete permission...');
    await usersDb.destroy(result.id, result.rev);
    console.log('Delete test successful');

    console.log('\nAll tests passed successfully!');
  } catch (err) {
    console.error('\nTest failed:', err);
    console.error('Error details:', {
      statusCode: err.statusCode,
      message: err.message,
      reason: err.reason
    });
  }
}

// Run the tests
testCouchDB(); 