const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/auth');

router.get('/', auth, submissionController.getRecommendations);

module.exports = router;
