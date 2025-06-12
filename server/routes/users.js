const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles, logActivity } = require('../middleware/auth');
const { validateUserRegistration, validateId } = require('../middleware/validation');

// Get all users (admin only)
router.get('/', 
  authenticateToken, 
  authorizeRoles('admin'), 
  userController.getAllUsers
);

// Get user by ID
router.get('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  validateId,
  userController.getUserById
);

// Create new user (admin only)
router.post('/', 
  authenticateToken, 
  authorizeRoles('admin'), 
  validateUserRegistration,
  logActivity('CREATE', 'users'),
  userController.createUser
);

// Update user (admin only)
router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  validateId,
  logActivity('UPDATE', 'users'),
  userController.updateUser
);

// Delete user (admin only)
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  validateId,
  logActivity('DELETE', 'users'),
  userController.deleteUser
);

// Reset user password (admin only)
router.post('/:id/reset-password', 
  authenticateToken, 
  authorizeRoles('admin'), 
  validateId,
  logActivity('RESET_PASSWORD', 'users'),
  userController.resetPassword
);

module.exports = router;