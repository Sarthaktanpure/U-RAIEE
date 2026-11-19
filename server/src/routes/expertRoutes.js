const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

router.use(auth);
router.use(requireRole('expert'));

router.get('/queue', expertController.getQueue);
router.post('/evaluate/:id', expertController.evaluateSubmission);

module.exports = router;
