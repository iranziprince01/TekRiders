require('dotenv').config();
const nano = require('nano');

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
    const index = {
      index: {
        fields: ['email']
      },
      name: 'email-index',
      type: 'json'
    };

    await usersDb.createIndex(index);
    console.log('Email index created');

    // 4. Verify index creation
    console.log('\nVerifying indexes...');
    const indexes = await usersDb.listIndexes();
    console.log('Available indexes:', indexes);

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