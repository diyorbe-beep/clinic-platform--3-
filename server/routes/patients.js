const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken, authorizeRoles, logActivity } = require('../middleware/auth');
const { validatePatientRegistration, validateId } = require('../middleware/validation');

// Get all patients
router.get('/', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse', 'receptionist'), 
  patientController.getAllPatients
);

// Get patient by ID
router.get('/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse', 'receptionist'), 
  validateId,
  patientController.getPatientById
);

// Create new patient
router.post('/', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse', 'receptionist'), 
  validatePatientRegistration,
  logActivity('CREATE', 'patients'),
  patientController.createPatient
);

// Update patient
router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse', 'receptionist'), 
  validateId,
  logActivity('UPDATE', 'patients'),
  patientController.updatePatient
);

// Delete patient (admin only)
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  validateId,
  logActivity('DELETE', 'patients'),
  patientController.deletePatient
);

// Get patient medical history
router.get('/:id/medical-history', 
  authenticateToken, 
  authorizeRoles('admin', 'doctor', 'nurse'), 
  validateId,
  patientController.getPatientMedicalHistory
);

module.exports = router;