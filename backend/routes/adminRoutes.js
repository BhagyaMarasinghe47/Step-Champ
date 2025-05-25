const express = require('express');
const { 
  getAdmins, 
  getDashboardStats, 
  createAdmin,
  updateProfile
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { logActivity } = require('../middleware/logMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin routes
router.get('/', authorize('SysAdmin'), getAdmins);
router.get('/dashboard', getDashboardStats);
router.post('/', authorize('SysAdmin'), logActivity('INFO', 'AddAdmin', 'User'), createAdmin);
router.put('/profile', logActivity('INFO', 'UpdateProfile', 'User'), updateProfile);

module.exports = router;