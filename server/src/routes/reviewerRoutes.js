const express = require('express');
const router = express.Router();
const reviewerController = require('../controllers/reviewerController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

router.use(auth);
router.use(requireRole('reviewer'));

router.get('/queue', reviewerController.getQueue);
router.post('/decide/:id', reviewerController.decideProgression);

module.exports = router;
