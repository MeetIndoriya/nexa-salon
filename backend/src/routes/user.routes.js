const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getBarbers,
} = require('../controllers/user.controller');

router.get('/', protect, authorize('Admin', 'Receptionist'), getAllUsers);
router.post('/', protect, authorize('Admin'), createUser);
router.get('/barbers', protect, getBarbers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, authorize('Admin'), updateUser);
router.delete('/:id', protect, authorize('Admin'), deleteUser);

module.exports = router;
