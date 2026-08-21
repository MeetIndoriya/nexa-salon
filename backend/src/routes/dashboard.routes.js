const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAdminDashboard,
  getCustomerDashboard,
  getBarberDashboard,
  getReceptionistDashboard,
} = require('../controllers/dashboard.controller');

router.get('/admin', protect, authorize('Admin'), getAdminDashboard);
router.get('/customer', protect, getCustomerDashboard);
router.get('/barber', protect, getBarberDashboard);
router.get('/receptionist', protect, getReceptionistDashboard);

module.exports = router;
