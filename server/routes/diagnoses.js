const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/diagnosisController');
const { authenticateToken, authorizeRoles, logActivity } = require('../middleware/auth');
const { validateDiagnosis, validateId } = require('../middleware/validation');

// Get all diagnoses
router.get('/', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse'), 
  diagnosisController.getAllDiagnoses
);

// Get diagnosis by ID
router.get('/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse'), 
  validateId,
  diagnosisController.getDiagnosisById
);

// Create new diagnosis (doctors only)
router.post('/', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor'), 
  validateDiagnosis,
  logActivity('CREATE', 'diagnoses'),
  diagnosisController.createDiagnosis
);

// Update diagnosis (doctors only)
router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor'), 
  validateId,
  logActivity('UPDATE', 'diagnoses'),
  diagnosisController.updateDiagnosis
);

// Delete diagnosis (admin only)
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  validateId,
  logActivity('DELETE', 'diagnoses'),
  diagnosisController.deleteDiagnosis
);

// Get patient diagnoses
router.get('/patient/:patientId', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse'), 
  validateId,
  diagnosisController.getPatientDiagnoses
);

module.exports = router;