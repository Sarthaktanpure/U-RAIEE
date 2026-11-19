const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Admin-only routes
router.use(auth);
router.use(requireRole('admin'));

router.get('/role-requests', adminController.getRoleRequests);
router.patch('/role-requests/:id', adminController.decideRoleRequest);
router.get('/users-by-role', adminController.getUsersByRole);
router.patch('/users/:id/role', adminController.assignUserRole);
router.get('/submissions', adminController.getAllSubmissions);
router.patch('/submissions/:id/assign', adminController.assignSubmission);
router.get('/outcomes', adminController.getAdminOutcomes);
router.patch('/outcomes/:id', adminController.decideOutcome);

module.exports = router;
