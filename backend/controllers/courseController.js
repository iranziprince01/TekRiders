const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const data = await Course.create({
      title: req.body.title,
      description: req.body.description,
      instructorId: req.user.id
    });
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create course' });
  }
};

exports.getApproved = async (req, res) => {
  try {
    const docs = await Course.findByStatus('approved');
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

exports.getPending = async (req, res) => {
  try {
    const docs = await Course.findByStatus('pending');
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch pending courses' });
  }
};

exports.approve = async (req, res) => {
  try {
    const course = await Course.updateStatus(req.params.id, 'approved');
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to approve course' });
  }
};
