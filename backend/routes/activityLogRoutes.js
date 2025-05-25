const express = require('express');
const { 
  getActivityLogs,
  getLogTypes
} = require('../controllers/activityLogController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// Activity log routes
router.get('/', getActivityLogs);
router.get('/types', getLogTypes);

module.exports = router;