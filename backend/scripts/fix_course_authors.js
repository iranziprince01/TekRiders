const nano = require('nano');
require('dotenv').config();

const couchUrl = process.env.COUCHDB_URL;
const couchUser = process.env.COUCHDB_USER;
const couchPass = process.env.COUCHDB_PASS;
const tutorEmail = process.env.FIX_TUTOR_EMAIL; // Set this in your .env file

if (!tutorEmail) {
  console.error('Please set FIX_TUTOR_EMAIL in your .env file to the tutor email whose courses you want to fix.');
  process.exit(1);
}

const nanoInstance = nano({
  url: couchUrl,
  requestDefaults: {
    auth: {
      username: couchUser,
      password: couchPass
    }
  }
});

const usersDb = nanoInstance.db.use('users');
const coursesDb = nanoInstance.db.use('courses');

async function fixAuthors() {
  // Find the tutor by email
  const userResult = await usersDb.find({ selector: { email: tutorEmail } });
  if (!userResult.docs.length) {
    console.error('No user found with email', tutorEmail);
    return;
  }
  const tutor = userResult.docs[0];
  console.log('Tutor found:', tutor._id, tutor.email);

  // Find all courses with missing or incorrect author
  const courseResult = await coursesDb.find({ selector: { authorEmail: tutor.email } });
  if (!courseResult.docs.length) {
    console.log('No courses to update for this tutor.');
    return;
  }
  console.log('Found', courseResult.docs.length, 'courses to update.');

  for (const course of courseResult.docs) {
    course.author = tutor._id;
    await coursesDb.insert(course);
    console.log('Updated course:', course._id);
  }
  console.log('Done.');
}

fixAuthors().catch(err => {
  console.error('Error running migration:', err);
});