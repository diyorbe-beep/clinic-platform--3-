const database = require('../config/database');

class DashboardController {
  async getDashboardStats(req, res) {
    try {
      const db = database.getDb();

      // Get total patients
      db.get('SELECT COUNT(*) as total FROM patients', [], (err, patientsCount) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        // Get active treatments
        db.get('SELECT COUNT(*) as total FROM treatments WHERE status = ?', ['active'], (err, treatmentsCount) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error'
            });
          }

          // Get pending lab results
          db.get('SELECT COUNT(*) as total FROM lab_results WHERE status = ?', ['pending'], (err, labResultsCount) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: 'Database error'
              });
            }

            // Get today's appointments
            const today = new Date().toISOString().split('T')[0];
            db.get('SELECT COUNT(*) as total FROM appointments WHERE appointment_date = ?', [today], (err, appointmentsCount) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: 'Database error'
                });
              }

              res.json({
                success: true,
                data: {
                  totalPatients: patientsCount.total,
                  activeTreatments: treatmentsCount.total,
                  pendingLabResults: labResultsCount.total,
                  todayAppointments: appointmentsCount.total
                }
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

  async getRecentPatients(req, res) {
    try {
      const { limit = 5 } = req.query;
      const db = database.getDb();

      db.all(`
        SELECT id, first_name, last_name, status, created_at
        FROM patients 
        ORDER BY created_at DESC 
        LIMIT ?
      `, [parseInt(limit)], (err, patients) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        res.json({
          success: true,
          data: patients
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

  async getUpcomingAppointments(req, res) {
    try {
      const { limit = 10 } = req.query;
      const db = database.getDb();

      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      db.all(`
        SELECT a.*, 
               p.first_name || ' ' || p.last_name as patient_name,
               u.first_name || ' ' || u.last_name as doctor_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON a.doctor_id = u.id
        WHERE a.appointment_date BETWEEN ? AND ?
        AND a.status = 'scheduled'
        ORDER BY a.appointment_date ASC, a.appointment_time ASC
        LIMIT ?
      `, [today, tomorrow, parseInt(limit)], (err, appointments) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        res.json({
          success: true,
          data: appointments
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

  async getPatientStatistics(req, res) {
    try {
      const db = database.getDb();

      // Get monthly patient statistics for the last 12 months
      db.all(`
        SELECT 
          strftime('%Y-%m', created_at) as month,
          COUNT(*) as total_patients,
          COUNT(CASE WHEN created_at >= date('now', '-30 days') THEN 1 END) as new_patients
        FROM patients 
        WHERE created_at >= date('now', '-12 months')
        GROUP BY strftime('%Y-%m', created_at)
        ORDER BY month ASC
      `, [], (err, statistics) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        res.json({
          success: true,
          data: statistics
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

  async getActivityLog(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;
      const db = database.getDb();

      db.all(`
        SELECT a.*, u.first_name || ' ' || u.last_name as user_name
        FROM audit_logs a
        LEFT JOIN users u ON a.user_id = u.id
        ORDER BY a.created_at DESC
        LIMIT ? OFFSET ?
      `, [parseInt(limit), offset], (err, activities) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        // Get total count
        db.get('SELECT COUNT(*) as total FROM audit_logs', [], (err, countResult) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error'
            });
          }

          res.json({
            success: true,
            data: {
              activities,
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
}

module.exports = new DashboardController();