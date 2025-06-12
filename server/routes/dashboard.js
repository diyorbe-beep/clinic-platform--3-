const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Get dashboard statistics
router.get('/stats', 
  authenticateToken, 
  dashboardController.getDashboardStats
);

// Get recent patients
router.get('/recent-patients', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse', 'receptionist'), 
  dashboardController.getRecentPatients
);

// Get upcoming appointments
router.get('/upcoming-appointments', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse', 'receptionist'), 
  dashboardController.getUpcomingAppointments
);

// Get patient statistics
router.get('/patient-statistics', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor'), 
  dashboardController.getPatientStatistics
);

// Get activity log (admin only)
router.get('/activity-log', 
  authenticateToken, 
  authorizeRoles('admin'), 
  dashboardController.getActivityLog
);

module.exports = router;