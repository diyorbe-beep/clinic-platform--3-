const bcrypt = require('bcryptjs');
const database = require('../config/database');

class UserController {
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, role, department, search } = req.query;
      const offset = (page - 1) * limit;
      const db = database.getDb();

      let query = `
        SELECT id, first_name, last_name, username, email, role, department, 
               is_active, last_login, created_at
        FROM users WHERE 1=1
      `;
      let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
      let params = [];
      let countParams = [];

      // Add filters
      if (role) {
        query += ' AND role = ?';
        countQuery += ' AND role = ?';
        params.push(role);
        countParams.push(role);
      }

      if (department) {
        query += ' AND department = ?';
        countQuery += ' AND department = ?';
        params.push(department);
        countParams.push(department);
      }

      if (search) {
        query += ' AND (first_name LIKE ? OR last_name LIKE ? OR username LIKE ? OR email LIKE ?)';
        countQuery += ' AND (first_name LIKE ? OR last_name LIKE ? OR username LIKE ? OR email LIKE ?)';
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam, searchParam, searchParam);
        countParams.push(searchParam, searchParam, searchParam, searchParam);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);

      // Get total count
      db.get(countQuery, countParams, (err, countResult) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        // Get users
        db.all(query, params, (err, users) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error'
            });
          }

          res.json({
            success: true,
            data: {
              users,
              pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult.total,
                pages: Math.ceil(countResult.total / limit)
              }
            }
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

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const db = database.getDb();

      db.get(`
        SELECT id, first_name, last_name, username, email, role, department, 
               is_active, last_login, created_at
        FROM users WHERE id = ?
      `, [id], (err, user) => {
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

  async createUser(req, res) {
    try {
      const {
        first_name,
        last_name,
        username,
        email,
        password,
        role,
        department,
        send_welcome_email = false,
        require_password_change = true
      } = req.body;

      const db = database.getDb();

      // Check if username or email already exists
      db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], async (err, existingUser) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Username or email already exists'
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        db.run(`
          INSERT INTO users (first_name, last_name, username, email, password, role, department, require_password_change)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [first_name, last_name, username, email, hashedPassword, role, department, require_password_change ? 1 : 0], function(err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Failed to create user'
            });
          }

          // TODO: Send welcome email if requested
          if (send_welcome_email) {
            // Implement email sending logic here
          }

          res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { id: this.lastID }
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

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { first_name, last_name, email, role, department, is_active } = req.body;
      const db = database.getDb();

      db.run(`
        UPDATE users 
        SET first_name = ?, last_name = ?, email = ?, role = ?, department = ?, 
            is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [first_name, last_name, email, role, department, is_active ? 1 : 0, id], function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to update user'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        res.json({
          success: true,
          message: 'User updated successfully'
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

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const db = database.getDb();

      // Don't allow deleting the current user
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }

      db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to delete user'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        res.json({
          success: true,
          message: 'User deleted successfully'
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

  async resetPassword(req, res) {
    try {
      const { id } = req.params;
      const { new_password } = req.body;
      const db = database.getDb();

      const hashedPassword = await bcrypt.hash(new_password, 10);

      db.run(`
        UPDATE users 
        SET password = ?, require_password_change = 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [hashedPassword, id], function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to reset password'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        res.json({
          success: true,
          message: 'Password reset successfully'
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

module.exports = new UserController();