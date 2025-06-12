const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');
const { authenticateToken, authorizeRoles, logActivity } = require('../middleware/auth');
const { validateTreatment, validateId } = require('../middleware/validation');

// Get all treatments
router.get('/', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse'), 
  treatmentController.getAllTreatments
);

// Get treatment by ID
router.get('/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse'), 
  validateId,
  treatmentController.getTreatmentById
);

// Create new treatment (doctors only)
router.post('/', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor'), 
  validateTreatment,
  logActivity('CREATE', 'treatments'),
  treatmentController.createTreatment
);

// Update treatment (doctors only)
router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor'), 
  validateId,
  logActivity('UPDATE', 'treatments'),
  treatmentController.updateTreatment
);

// Delete treatment (admin only)
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  validateId,
  logActivity('DELETE', 'treatments'),
  treatmentController.deleteTreatment
);

// Get patient treatments
router.get('/patient/:patientId', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse'), 
  validateId,
  treatmentController.getPatientTreatments
);

module.exports = router;