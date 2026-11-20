const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// Public metrics for Home hero section
router.get('/public-metrics', dashboardController.getPublicMetrics);

// Authenticated user dashboard metrics
router.get('/stats', auth, dashboardController.getStats);

module.exports = router;
