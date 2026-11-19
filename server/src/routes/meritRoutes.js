const express = require('express');
const router = express.Router();
const meritController = require('../controllers/meritController');
const auth = require('../middleware/auth');

router.get('/', auth, meritController.getMyMerit);

module.exports = router;
