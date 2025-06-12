const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../config/database');

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const db = database.getDb();

      // Find user by username or email
      db.get(`
        SELECT * FROM users 
        WHERE (username = ? OR email = ?) AND is_active = 1
      `, [username, username], async (err, user) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }

        // Update last login
        db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        // Generate JWT token
        const token = jwt.sign(
          { 
            id: user.id, 
            username: user.username, 
            email: user.email,
            role: user.role,
            department: user.department
          },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );

        res.json({
          success: true,
          message: 'Login successful',
          data: {
            token,
            user: {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              username: user.username,
              email: user.email,
              role: user.role,
              department: user.department,
              require_password_change: user.require_password_change
            }
          }
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      const db = database.getDb();

      // Get current user
      db.get('SELECT password FROM users WHERE id = ?', [userId], async (err, user) => {
        if (err || !user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
          return res.status(400).json({
            success: false,
            message: 'Current password is incorrect'
          });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        db.run(`
          UPDATE users 
          SET password = ?, require_password_change = 0, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `, [hashedPassword, userId], (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Failed to update password'
            });
          }

          res.json({
            success: true,
            message: 'Password updated successfully'
          });
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const db = database.getDb();

      db.get(`
        SELECT id, first_name, last_name, username, email, role, department, 
               is_active, last_login, created_at
        FROM users WHERE id = ?
      `, [userId], (err, user) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        res.json({
          success: true,
          data: user
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { first_name, last_name, email, department } = req.body;
      const db = database.getDb();

      db.run(`
        UPDATE users 
        SET first_name = ?, last_name = ?, email = ?, department = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [first_name, last_name, email, department, userId], function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to update profile'
          });
        }

        res.json({
          success: true,
          message: 'Profile updated successfully'
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();