const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const courseCtrl = require('../controllers/courseController');

router.get('/', auth, courseCtrl.getApproved);
router.post('/', auth, authorize('instructor'), courseCtrl.createCourse);
router.get('/pending', auth, authorize('admin'), courseCtrl.getPending);
router.put('/:id/approve', auth, authorize('admin'), courseCtrl.approve);

module.exports = router;
