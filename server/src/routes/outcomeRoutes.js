const express = require('express');
const router = express.Router();
const outcomeController = require('../controllers/outcomeController');
const auth = require('../middleware/auth');

router.post('/:submissionId', auth, outcomeController.reportOutcome);

module.exports = router;
