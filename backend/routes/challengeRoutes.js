const express = require('express');
const { 
  getChallenges, 
  getChallenge, 
  createChallenge, 
  updateChallenge, 
  deleteChallenge,
  addTeam
} = require('../controllers/challengeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { logActivity } = require('../middleware/logMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// Challenge routes
router.get('/', getChallenges);
router.get('/:id', getChallenge);
router.post('/', logActivity('INFO', 'CreateNewChallenge', 'Challenge'), createChallenge);
router.put('/:id', logActivity('INFO', 'UpdateChallenge', 'Challenge'), updateChallenge);
router.delete('/:id', logActivity('INFO', 'DeleteChallenge', 'Challenge'), deleteChallenge);
router.post('/:id/teams', logActivity('INFO', 'AddTeam', 'Challenge'), addTeam);

module.exports = router;