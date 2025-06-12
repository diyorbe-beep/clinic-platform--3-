const database = require('../config/database');

class ScheduleController {
  async getAllSchedules(req, res) {
    try {
      const { page = 1, limit = 10, nurse_id, date, status } = req.query;
      const offset = (page - 1) * limit;
      const db = database.getDb();

      let query = `
        SELECT s.*, 
               p.first_name || ' ' || p.last_name as patient_name,
               u.first_name || ' ' || u.last_name as nurse_name
        FROM nurse_schedules s
        JOIN patients p ON s.patient_id = p.id
        JOIN users u ON s.nurse_id = u.id
        WHERE 1=1
      `;
      let countQuery = 'SELECT COUNT(*) as total FROM nurse_schedules WHERE 1=1';
      let params = [];
      let countParams = [];

      // Add filters
      if (nurse_id) {
        query += ' AND s.nurse_id = ?';
        countQuery += ' AND nurse_id = ?';
        params.push(nurse_id);
        countParams.push(nurse_id);
      }

      if (date) {
        query += ' AND s.scheduled_date = ?';
        countQuery += ' AND scheduled_date = ?';
        params.push(date);
        countParams.push(date);
      }

      if (status) {
        query += ' AND s.status = ?';
        countQuery += ' AND status = ?';
        params.push(status);
        countParams.push(status);
      }

      query += ' ORDER BY s.scheduled_date DESC, s.scheduled_time ASC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);

      // Get total count
      db.get(countQuery, countParams, (err, countResult) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        // Get schedules
        db.all(query, params, (err, schedules) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error'
            });
          }

          res.json({
            success: true,
            data: {
              schedules,
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

  async getScheduleById(req, res) {
    try {
      const { id } = req.params;
      const db = database.getDb();

      db.get(`
        SELECT s.*, 
               p.first_name || ' ' || p.last_name as patient_name,
               u.first_name || ' ' || u.last_name as nurse_name
        FROM nurse_schedules s
        JOIN patients p ON s.patient_id = p.id
        JOIN users u ON s.nurse_id = u.id
        WHERE s.id = ?
      `, [id], (err, schedule) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (!schedule) {
          return res.status(404).json({
            success: false,
            message: 'Schedule not found'
          });
        }

        res.json({
          success: true,
          data: schedule
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

  async createSchedule(req, res) {
    try {
      const { 
        patient_id, 
        nurse_id, 
        treatment_name, 
        scheduled_date, 
        scheduled_time, 
        duration = 30, 
        notes 
      } = req.body;
      const db = database.getDb();

      // Verify patient exists
      db.get('SELECT id FROM patients WHERE id = ?', [patient_id], (err, patient) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (!patient) {
          return res.status(404).json({
            success: false,
            message: 'Patient not found'
          });
        }

        // Verify nurse exists
        db.get('SELECT id FROM users WHERE id = ? AND role = ?', [nurse_id, 'nurse'], (err, nurse) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error'
            });
          }

          if (!nurse) {
            return res.status(404).json({
              success: false,
              message: 'Nurse not found'
            });
          }

          // Check for scheduling conflicts
          db.get(`
            SELECT id FROM nurse_schedules 
            WHERE nurse_id = ? AND scheduled_date = ? AND scheduled_time = ? AND status != 'cancelled'
          `, [nurse_id, scheduled_date, scheduled_time], (err, conflict) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: 'Database error'
              });
            }

            if (conflict) {
              return res.status(400).json({
                success: false,
                message: 'Nurse is already scheduled at this time'
              });
            }

            // Create schedule
            db.run(`
              INSERT INTO nurse_schedules (patient_id, nurse_id, treatment_name, scheduled_date, scheduled_time, duration, notes)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [patient_id, nurse_id, treatment_name, scheduled_date, scheduled_time, duration, notes], function(err) {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: 'Failed to create schedule'
                });
              }

              res.status(201).json({
                success: true,
                message: 'Schedule created successfully',
                data: { id: this.lastID }
              });
            });
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

  async updateSchedule(req, res) {
    try {
      const { id } = req.params;
      const { 
        treatment_name, 
        scheduled_date, 
        scheduled_time, 
        duration, 
        status, 
        notes 
      } = req.body;
      const db = database.getDb();

      db.run(`
        UPDATE nurse_schedules 
        SET treatment_name = ?, scheduled_date = ?, scheduled_time = ?, 
            duration = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [treatment_name, scheduled_date, scheduled_time, duration, status, notes, id], function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to update schedule'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'Schedule not found'
          });
        }

        res.json({
          success: true,
          message: 'Schedule updated successfully'
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

  async deleteSchedule(req, res) {
    try {
      const { id } = req.params;
      const db = database.getDb();

      db.run('DELETE FROM nurse_schedules WHERE id = ?', [id], function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to delete schedule'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'Schedule not found'
          });
        }

        res.json({
          success: true,
          message: 'Schedule deleted successfully'
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

  async getNurseSchedules(req, res) {
    try {
      const { nurseId } = req.params;
      const { date } = req.query;
      const db = database.getDb();

      let query = `
        SELECT s.*, p.first_name || ' ' || p.last_name as patient_name
        FROM nurse_schedules s
        JOIN patients p ON s.patient_id = p.id
        WHERE s.nurse_id = ?
      `;
      let params = [nurseId];

      if (date) {
        query += ' AND s.scheduled_date = ?';
        params.push(date);
      }

      query += ' ORDER BY s.scheduled_date ASC, s.scheduled_time ASC';

      db.all(query, params, (err, schedules) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        res.json({
          success: true,
          data: schedules
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

  async markScheduleComplete(req, res) {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const db = database.getDb();

      db.run(`
        UPDATE nurse_schedules 
        SET status = 'completed', notes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [notes, id], function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to mark schedule as complete'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'Schedule not found'
          });
        }

        res.json({
          success: true,
          message: 'Schedule marked as completed'
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

  async getNurses(req, res) {
    try {
      const db = database.getDb();

      db.all(`
        SELECT id, first_name, last_name, department
        FROM users 
        WHERE role = 'nurse' AND is_active = 1
        ORDER BY first_name, last_name
      `, [], (err, nurses) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        res.json({
          success: true,
          data: nurses
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

module.exports = new ScheduleController();