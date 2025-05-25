const express = require('express');
const { login, getMe, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { logActivity } = require('../middleware/logMiddleware');

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/changepassword', protect, logActivity('INFO', 'ChangePassword', 'User'), changePassword);

module.exports = router;