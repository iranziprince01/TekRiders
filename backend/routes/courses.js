const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video and image files are allowed'));
    }
  }
});

// Helper: Only allow tutors to manage their own courses
function isTutor(req, res, next) {
  if (!req.user || req.user.role !== 'tutor') {
    return res.status(403).json({ message: 'Tutor access required' });
  }
  next();
}

// Create/upload a new course
router.post('/', isAuth, isTutor, upload.fields([
  { name: 'video', maxCount: 10 }, // Allow multiple video files
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, category, language, price, content } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Parse the content JSON string
    let courseContent;
    try {
      courseContent = JSON.parse(content);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid course content format' });
    }

    // Process uploaded files
    const files = {};
    if (req.files) {
      if (req.files.image) {
        files.thumbnail = req.files.image[0].filename;
      }
      if (req.files.video) {
        files.videos = req.files.video.map(file => ({
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size
        }));
      }
    }

    // Create course document
    const course = {
      title,
      description,
      category,
      language,
      price: parseFloat(price) || 0,
      content: courseContent,
      ...files,
      author: req.user._id,
      authorEmail: req.user.email,
      status: 'pending',
      createdAt: new Date().toISOString(),
      type: 'course',
      enrolled: 0,
      rating: 0,
      reviews: []
    };

    const result = await db.courses.insert(course);
    res.status(201).json({ 
      ...course, 
      _id: result.id, 
      _rev: result.rev 
    });
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ 
      message: 'Error uploading course', 
      error: err.message 
    });
  }
});

// List all courses by the logged-in tutor
router.get('/', isAuth, isTutor, async (req, res) => {
  try {
    const author = req.user._id;
    const result = await db.courses.find({ selector: { author } });
    res.json(result.docs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses', error: err.message });
  }
});

// Get courses by instructor ID
router.get('/instructor/:instructorId', isAuth, async (req, res) => {
  try {
    const { instructorId } = req.params;
    const result = await db.courses.find({ 
      selector: { 
        author: instructorId,
        type: 'course'
      }
    });
    res.json(result.docs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching instructor courses', error: err.message });
  }
});

// Update a course
router.put('/:id', isAuth, isTutor, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    const course = await db.courses.get(id);
    if (course.author !== req.user._id) {
      return res.status(403).json({ message: 'You can only update your own courses' });
    }
    const updates = req.body;
    if (req.files.video) updates.video = req.files.video[0].filename;
    if (req.files.pdf) updates.pdf = req.files.pdf[0].filename;
    if (req.files.image) updates.image = req.files.image[0].filename;
    const updatedCourse = { ...course, ...updates, updatedAt: new Date().toISOString() };
    const result = await db.courses.insert(updatedCourse);
    res.json({ ...updatedCourse, _rev: result.rev });
  } catch (err) {
    res.status(500).json({ message: 'Error updating course', error: err.message });
  }
});

// Delete a course
router.delete('/:id', isAuth, isTutor, async (req, res) => {
  try {
    const { id } = req.params;
    const course = await db.courses.get(id);
    if (course.author !== req.user._id) {
      return res.status(403).json({ message: 'You can only delete your own courses' });
    }
    await db.courses.destroy(id, course._rev);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course', error: err.message });
  }
});

// Serve uploaded files
router.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

// Get all approved courses (for learners)
router.get('/approved', async (req, res) => {
  try {
    const result = await db.courses.find({ selector: { status: 'approved', type: 'course' } });
    res.json(result.docs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching approved courses', error: err.message });
  }
});

// Get a course by ID (public, for learners)
router.get('/:id', async (req, res) => {
  console.log('Fetching course with ID:', req.params.id);
  try {
    const course = await db.courses.get(req.params.id);
    res.json(course);
  } catch (err) {
    console.error('Error fetching course:', err, err.stack);
    res.status(404).json({ message: 'Course not found', error: err.message });
  }
});

// Get enrolled students for a course
router.get('/:id/enrolled', isAuth, isTutor, async (req, res) => {
  try {
    const course = await db.courses.get(req.params.id);
    // Assume course.enrolled is an array of learner IDs
    const learners = course.enrolled && course.enrolled.length > 0
      ? (await db.users.find({ selector: { _id: { $in: course.enrolled } } })).docs
      : [];
    res.json(learners);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enrolled students', error: err.message });
  }
});

// Submit a quiz (learner)
router.post('/:id/quiz', isAuth, async (req, res) => {
  try {
    const { answers } = req.body;
    const quizSubmission = {
      courseId: req.params.id,
      learnerId: req.user._id,
      answers,
      graded: false,
      score: null,
      submittedAt: new Date().toISOString()
    };
    const result = await db.quizzes.insert(quizSubmission);
    res.status(201).json({ ...quizSubmission, _id: result.id });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting quiz', error: err.message });
  }
});

// Get quiz submissions for a course (tutor)
router.get('/:id/quizzes', isAuth, isTutor, async (req, res) => {
  try {
    const result = await db.quizzes.find({ selector: { courseId: req.params.id } });
    res.json(result.docs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quizzes', error: err.message });
  }
});

// Grade a quiz (tutor)
router.put('/quiz/:quizId/grade', isAuth, isTutor, async (req, res) => {
  try {
    const { score } = req.body;
    const quiz = await db.quizzes.get(req.params.quizId);
    quiz.graded = true;
    quiz.score = score;
    quiz.gradedAt = new Date().toISOString();
    const result = await db.quizzes.insert(quiz);
    res.json({ ...quiz, _rev: result.rev });
  } catch (err) {
    res.status(500).json({ message: 'Error grading quiz', error: err.message });
  }
});

// Q&A endpoints (for future use)
router.get('/:id/questions', async (req, res) => {
  // TODO: Fetch all Q&A for a course from CouchDB
  res.status(501).json({ message: 'Not implemented yet' });
});
router.post('/:id/questions', async (req, res) => {
  // TODO: Add a new question to CouchDB
  res.status(501).json({ message: 'Not implemented yet' });
});
// Notes endpoints (for future use)
router.get('/:id/notes', async (req, res) => {
  // TODO: Fetch all notes for the logged-in learner from CouchDB
  res.status(501).json({ message: 'Not implemented yet' });
});
router.post('/:id/notes', async (req, res) => {
  // TODO: Save/update a note for a lesson in CouchDB
  res.status(501).json({ message: 'Not implemented yet' });
});

module.exports = router;
