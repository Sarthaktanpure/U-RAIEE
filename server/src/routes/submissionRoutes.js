const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/auth');

router.post('/', auth, submissionController.createSubmission);
router.get('/mine', auth, submissionController.getMySubmissions);
router.get('/:id', auth, submissionController.getSubmissionById);
router.put('/:id/refine', auth, submissionController.refineSubmission);

module.exports = router;
