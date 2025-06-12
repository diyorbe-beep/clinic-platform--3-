const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('first_name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters'),
  body('last_name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters'),
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('role')
    .isIn(['admin', 'doctor', 'nurse', 'receptionist', 'lab_technician'])
    .withMessage('Invalid role'),
  body('department')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Department must be at least 2 characters'),
  handleValidationErrors
];

// Patient validation rules
const validatePatientRegistration = [
  body('first_name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters'),
  body('last_name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters'),
  body('date_of_birth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('gender')
    .isIn(['male', 'female'])
    .withMessage('Gender must be male or female'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

// Diagnosis validation rules
const validateDiagnosis = [
  body('patient_id')
    .isInt({ min: 1 })
    .withMessage('Valid patient ID is required'),
  body('diagnosis')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Diagnosis must be at least 3 characters'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  handleValidationErrors
];

// Treatment validation rules
const validateTreatment = [
  body('patient_id')
    .isInt({ min: 1 })
    .withMessage('Valid patient ID is required'),
  body('treatment_name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Treatment name must be at least 3 characters'),
  body('start_date')
    .isISO8601()
    .withMessage('Please provide a valid start date'),
  body('end_date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid end date'),
  body('medications')
    .optional()
    .isArray()
    .withMessage('Medications must be an array'),
  handleValidationErrors
];

// Lab result validation rules
const validateLabResult = [
  body('patient_id')
    .isInt({ min: 1 })
    .withMessage('Valid patient ID is required'),
  body('test_name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Test name must be at least 3 characters'),
  body('test_date')
    .isISO8601()
    .withMessage('Please provide a valid test date'),
  handleValidationErrors
];

// Schedule validation rules
const validateSchedule = [
  body('patient_id')
    .isInt({ min: 1 })
    .withMessage('Valid patient ID is required'),
  body('nurse_id')
    .isInt({ min: 1 })
    .withMessage('Valid nurse ID is required'),
  body('treatment_name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Treatment name must be at least 3 characters'),
  body('scheduled_date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('scheduled_time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format'),
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid ID is required'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validatePatientRegistration,
  validateDiagnosis,
  validateTreatment,
  validateLabResult,
  validateSchedule,
  validateId,
  handleValidationErrors
};