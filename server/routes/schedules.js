const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authenticateToken, authorizeRoles, logActivity } = require('../middleware/auth');
const { validateSchedule, validateId } = require('../middleware/validation');

// Get all schedules
router.get('/', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse'), 
  scheduleController.getAllSchedules
);

// Get schedule by ID
router.get('/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse'), 
  validateId,
  scheduleController.getScheduleById
);

// Create new schedule
router.post('/', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse'), 
  validateSchedule,
  logActivity('CREATE', 'nurse_schedules'),
  scheduleController.createSchedule
);

// Update schedule
router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse'), 
  validateId,
  logActivity('UPDATE', 'nurse_schedules'),
  scheduleController.updateSchedule
);

// Delete schedule
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse'), 
  validateId,
  logActivity('DELETE', 'nurse_schedules'),
  scheduleController.deleteSchedule
);

// Get nurse schedules
router.get('/nurse/:nurseId', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse'), 
  validateId,
  scheduleController.getNurseSchedules
);

// Mark schedule as complete
router.post('/:id/complete', 
  authenticateToken, 
  authorizeRoles('admin', 'nurse'), 
  validateId,
  logActivity('COMPLETE', 'nurse_schedules'),
  scheduleController.markScheduleComplete
);

// Get all nurses
router.get('/nurses/list', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse'), 
  scheduleController.getNurses
);

module.exports = router;