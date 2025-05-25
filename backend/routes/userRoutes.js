const express = require('express');
const { 
  getUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { logActivity } = require('../middleware/logMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// User routes
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', logActivity('INFO', 'AddUser', 'User'), createUser);
router.put('/:id', logActivity('INFO', 'UpdateUser', 'User'), updateUser);
router.delete('/:id', logActivity('INFO', 'DeleteUser', 'User'), deleteUser);

module.exports = router;