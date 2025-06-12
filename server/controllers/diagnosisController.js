const database = require('../config/database');

class DiagnosisController {
  async getAllDiagnoses(req, res) {
    try {
      const { page = 1, limit = 10, patient_id, doctor_id } = req.query;
      const offset = (page - 1) * limit;
      const db = database.getDb();

      let query = `
        SELECT d.*, 
               p.first_name || ' ' || p.last_name as patient_name,
               u.first_name || ' ' || u.last_name as doctor_name
        FROM diagnoses d
        JOIN patients p ON d.patient_id = p.id
        JOIN users u ON d.doctor_id = u.id
        WHERE 1=1
      `;
      let countQuery = 'SELECT COUNT(*) as total FROM diagnoses WHERE 1=1';
      let params = [];
      let countParams = [];

      // Add filters
      if (patient_id) {
        query += ' AND d.patient_id = ?';
        countQuery += ' AND patient_id = ?';
        params.push(patient_id);
        countParams.push(patient_id);
      }

      if (doctor_id) {
        query += ' AND d.doctor_id = ?';
        countQuery += ' AND doctor_id = ?';
        params.push(doctor_id);
        countParams.push(doctor_id);
      }

      query += ' ORDER BY d.date DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);

      // Get total count
      db.get(countQuery, countParams, (err, countResult) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        // Get diagnoses
        db.all(query, params, (err, diagnoses) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error'
            });
          }

          res.json({
            success: true,
            data: {
              diagnoses,
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

  async getDiagnosisById(req, res) {
    try {
      const { id } = req.params;
      const db = database.getDb();

      db.get(`
        SELECT d.*, 
               p.first_name || ' ' || p.last_name as patient_name,
               u.first_name || ' ' || u.last_name as doctor_name
        FROM diagnoses d
        JOIN patients p ON d.patient_id = p.id
        JOIN users u ON d.doctor_id = u.id
        WHERE d.id = ?
      `, [id], (err, diagnosis) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (!diagnosis) {
          return res.status(404).json({
            success: false,
            message: 'Diagnosis not found'
          });
        }

        res.json({
          success: true,
          data: diagnosis
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

  async createDiagnosis(req, res) {
    try {
      const { patient_id, diagnosis, description, date } = req.body;
      const doctor_id = req.user.id;
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

        // Create diagnosis
        db.run(`
          INSERT INTO diagnoses (patient_id, doctor_id, diagnosis, description, date)
          VALUES (?, ?, ?, ?, ?)
        `, [patient_id, doctor_id, diagnosis, description, date], function(err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Failed to create diagnosis'
            });
          }

          res.status(201).json({
            success: true,
            message: 'Diagnosis created successfully',
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

  async updateDiagnosis(req, res) {
    try {
      const { id } = req.params;
      const { diagnosis, description, date } = req.body;
      const db = database.getDb();

      db.run(`
        UPDATE diagnoses 
        SET diagnosis = ?, description = ?, date = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [diagnosis, description, date, id], function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to update diagnosis'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'Diagnosis not found'
          });
        }

        res.json({
          success: true,
          message: 'Diagnosis updated successfully'
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

  async deleteDiagnosis(req, res) {
    try {
      const { id } = req.params;
      const db = database.getDb();

      db.run('DELETE FROM diagnoses WHERE id = ?', [id], function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to delete diagnosis'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'Diagnosis not found'
          });
        }

        res.json({
          success: true,
          message: 'Diagnosis deleted successfully'
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

  async getPatientDiagnoses(req, res) {
    try {
      const { patientId } = req.params;
      const db = database.getDb();

      db.all(`
        SELECT d.*, u.first_name || ' ' || u.last_name as doctor_name
        FROM diagnoses d
        JOIN users u ON d.doctor_id = u.id
        WHERE d.patient_id = ?
        ORDER BY d.date DESC
      `, [patientId], (err, diagnoses) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        res.json({
          success: true,
          data: diagnoses
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

module.exports = new DiagnosisController();