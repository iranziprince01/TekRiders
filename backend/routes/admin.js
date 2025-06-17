const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAdmin } = require('../middleware/auth');

// Get all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await db.users.list({ include_docs: true });
    res.json(users.rows.map(row => ({
      id: row.doc._id,
      name: row.doc.name,
      email: row.doc.email,
      role: row.doc.role,
      status: row.doc.status || 'active',
      joinDate: row.doc.createdAt,
      lastActive: row.doc.lastActive || row.doc.createdAt,
      firstName: row.doc.firstName,
      lastName: row.doc.lastName,
      address: row.doc.address,
      avatar: row.doc.avatar
    })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update user status
router.put('/users/:id/status', isAdmin, async (req, res) => {
  try {
    const user = await db.users.get(req.params.id);
    user.status = req.body.status;
    await db.users.insert(user);
    res.json({ message: 'User status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
});

// Get all courses
router.get('/courses', isAdmin, async (req, res) => {
  try {
    // Fetch all users to map tutor IDs to names
    const users = await db.users.list({ include_docs: true });
    const userMap = {};
    users.rows.forEach(row => {
      userMap[row.doc._id] = {
        name: row.doc.name || row.doc.email || row.doc._id,
        email: row.doc.email || ''
      };
    });

    const courses = await db.courses.list({ include_docs: true });
    res.json(courses.rows.map(row => ({
      id: row.doc._id,
      title: row.doc.title,
      instructor: userMap[row.doc.author]?.name || row.doc.author || 'Unknown',
      instructorEmail: userMap[row.doc.author]?.email || '',
      status: row.doc.status,
      submittedDate: row.doc.createdAt,
      flags: row.doc.flags || 0,
      description: row.doc.description,
      category: row.doc.category,
      level: row.doc.level,
      duration: row.doc.duration
    })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Update course status
router.put('/courses/:id/status', isAdmin, async (req, res) => {
  try {
    const course = await db.courses.get(req.params.id);
    course.status = req.body.status;
    await db.courses.insert(course);
    res.json({ message: 'Course status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course status' });
  }
});

// Flag course
router.post('/courses/:id/flag', isAdmin, async (req, res) => {
  try {
    const course = await db.courses.get(req.params.id);
    course.flags = (course.flags || 0) + 1;
    course.status = 'flagged';
    await db.courses.insert(course);
    res.json({ message: 'Course flagged' });
  } catch (error) {
    res.status(500).json({ message: 'Error flagging course' });
  }
});

// Moderate course (approve/reject)
router.put('/courses/:id/moderate', isAdmin, async (req, res) => {
  try {
    const course = await db.courses.get(req.params.id);
    course.status = req.body.status;
    await db.courses.insert(course);
    res.json({ message: 'Course status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error moderating course' });
  }
});

// Get all CouchDB database names
router.get('/dbs', isAdmin, async (req, res) => {
  try {
    const dbs = await req.app.get('nano').db.list();
    res.json(dbs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching database list' });
  }
});

// Admin analytics endpoint
router.get('/analytics', isAdmin, async (req, res) => {
  try {
    const users = await db.users.list({ include_docs: true });
    const courses = await db.courses.list({ include_docs: true });
    const totalUsers = users.rows.length;
    const totalCourses = courses.rows.length;
    const coursesByStatus = {};
    const usersByRole = {};
    courses.rows.forEach(row => {
      const status = row.doc.status || 'unknown';
      coursesByStatus[status] = (coursesByStatus[status] || 0) + 1;
    });
    users.rows.forEach(row => {
      const role = row.doc.role || 'unknown';
      usersByRole[role] = (usersByRole[role] || 0) + 1;
    });
    res.json({ totalUsers, totalCourses, coursesByStatus, usersByRole });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

module.exports = router; 