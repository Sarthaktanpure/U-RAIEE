const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middleware/auth');

router.get('/my', auth, roleController.getMyRoles);
router.post('/request', auth, roleController.requestRole);
router.post('/switch', auth, roleController.switchRole);

module.exports = router;
