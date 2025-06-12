const express = require('express');
const router = express.Router();
const labResultController = require('../controllers/labResultController');
const { authenticateToken, authorizeRoles, logActivity } = require('../middleware/auth');
const { validateLabResult, validateId } = require('../middleware/validation');

// Get all lab results
router.get('/', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse', 'lab_technician'), 
  labResultController.getAllLabResults
);

// Get lab result by ID
router.get('/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse', 'lab_technician'), 
  validateId,
  labResultController.getLabResultById
);

// Create new lab result
router.post('/', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'lab_technician'), 
  validateLabResult,
  logActivity('CREATE', 'lab_results'),
  labResultController.createLabResult
);

// Update lab result
router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'lab_technician'), 
  validateId,
  logActivity('UPDATE', 'lab_results'),
  labResultController.updateLabResult
);

// Delete lab result (admin only)
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  validateId,
  logActivity('DELETE', 'lab_results'),
  labResultController.deleteLabResult
);

// Get patient lab results
router.get('/patient/:patientId', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse', 'lab_technician'), 
  validateId,
  labResultController.getPatientLabResults
);

// Download lab result file
router.get('/:id/download', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse', 'lab_technician'), 
  validateId,
  labResultController.downloadLabResultFile
);

module.exports = router;