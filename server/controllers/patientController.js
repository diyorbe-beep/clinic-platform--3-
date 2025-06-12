const database = require('../config/database');

class PatientController {
  async getAllPatients(req, res) {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const offset = (page - 1) * limit;
      const db = database.getDb();

      let query = 'SELECT * FROM patients WHERE 1=1';
      let countQuery = 'SELECT COUNT(*) as total FROM patients WHERE 1=1';
      let params = [];
      let countParams = [];

      // Add filters
      if (status) {
        query += ' AND status = ?';
        countQuery += ' AND status = ?';
        params.push(status);
        countParams.push(status);
      }

      if (search) {
        query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)';
        countQuery += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)';
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

        // Get patients
        db.all(query, params, (err, patients) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error'
            });
          }

          res.json({
            success: true,
            data: {
              patients,
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

  async getPatientById(req, res) {
    try {
      const { id } = req.params;
      const db = database.getDb();

      db.get('SELECT * FROM patients WHERE id = ?', [id], (err, patient) => {
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

        res.json({
          success: true,
          data: patient
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

  async createPatient(req, res) {
    try {
      const {
        first_name,
        last_name,
        date_of_birth,
        gender,
        email,
        phone,
        address,
        city,
        state,
        zip_code,
        emergency_contact_name,
        emergency_contact_phone,
        insurance_provider,
        insurance_policy_number,
        allergies,
        medical_history,
        current_medications
      } = req.body;

      const db = database.getDb();

      db.run(`
        INSERT INTO patients (
          first_name, last_name, date_of_birth, gender, email, phone, address,
          city, state, zip_code, emergency_contact_name, emergency_contact_phone,
          insurance_provider, insurance_policy_number, allergies, medical_history,
          current_medications
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        first_name, last_name, date_of_birth, gender, email, phone, address,
        city, state, zip_code, emergency_contact_name, emergency_contact_phone,
        insurance_provider, insurance_policy_number, allergies, medical_history,
        current_medications
      ], function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to create patient'
          });
        }

        res.status(201).json({
          success: true,
          message: 'Patient created successfully',
          data: { id: this.lastID }
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

  async updatePatient(req, res) {
    try {
      const { id } = req.params;
      const updateFields = req.body;
      const db = database.getDb();

      // Build dynamic update query
      const fields = Object.keys(updateFields).filter(key => key !== 'id');
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => updateFields[field]);
      values.push(id);

      db.run(`
        UPDATE patients 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, values, function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to update patient'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'Patient not found'
          });
        }

        res.json({
          success: true,
          message: 'Patient updated successfully'
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

  async deletePatient(req, res) {
    try {
      const { id } = req.params;
      const db = database.getDb();

      db.run('DELETE FROM patients WHERE id = ?', [id], function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to delete patient'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'Patient not found'
          });
        }

        res.json({
          success: true,
          message: 'Patient deleted successfully'
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

  async getPatientMedicalHistory(req, res) {
    try {
      const { id } = req.params;
      const db = database.getDb();

      // Get diagnoses
      db.all(`
        SELECT d.*, u.first_name || ' ' || u.last_name as doctor_name
        FROM diagnoses d
        JOIN users u ON d.doctor_id = u.id
        WHERE d.patient_id = ?
        ORDER BY d.date DESC
      `, [id], (err, diagnoses) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        // Get treatments
        db.all(`
          SELECT t.*, u.first_name || ' ' || u.last_name as doctor_name
          FROM treatments t
          JOIN users u ON t.doctor_id = u.id
          WHERE t.patient_id = ?
          ORDER BY t.start_date DESC
        `, [id], (err, treatments) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error'
            });
          }

          // Get lab results
          db.all(`
            SELECT l.*, u.first_name || ' ' || u.last_name as doctor_name
            FROM lab_results l
            JOIN users u ON l.doctor_id = u.id
            WHERE l.patient_id = ?
            ORDER BY l.test_date DESC
          `, [id], (err, labResults) => {
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
                treatments,
                labResults
              }
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
}

module.exports = new PatientController();