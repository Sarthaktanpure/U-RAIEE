const express = require('express');
const router = express.Router();
const passportController = require('../controllers/passportController');
const auth = require('../middleware/auth');

router.get('/', auth, passportController.getPassport);

module.exports = router;
