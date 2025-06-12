const database = require('../config/database');

class TreatmentController {
  async getAllTreatments(req, res) {
    try {
      const { page = 1, limit = 10, patient_id, doctor_id, status } = req.query;
      const offset = (page - 1) * limit;
      const db = database.getDb();

      let query = `
        SELECT t.*, 
               p.first_name || ' ' || p.last_name as patient_name,
               u.first_name || ' ' || u.last_name as doctor_name
        FROM treatments t
        JOIN patients p ON t.patient_id = p.id
        JOIN users u ON t.doctor_id = u.id
        WHERE 1=1
      `;
      let countQuery = 'SELECT COUNT(*) as total FROM treatments WHERE 1=1';
      let params = [];
      let countParams = [];

      // Add filters
      if (patient_id) {
        query += ' AND t.patient_id = ?';
        countQuery += ' AND patient_id = ?';
        params.push(patient_id);
        countParams.push(patient_id);
      }

      if (doctor_id) {
        query += ' AND t.doctor_id = ?';
        countQuery += ' AND doctor_id = ?';
        params.push(doctor_id);
        countParams.push(doctor_id);
      }

      if (status) {
        query += ' AND t.status = ?';
        countQuery += ' AND status = ?';
        params.push(status);
        countParams.push(status);
      }

      query += ' ORDER BY t.start_date DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);

      // Get total count
      db.get(countQuery, countParams, (err, countResult) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        // Get treatments
        db.all(query, params, (err, treatments) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error'
            });
          }

          // Get medications for each treatment
          const treatmentIds = treatments.map(t => t.id);
          if (treatmentIds.length > 0) {
            const placeholders = treatmentIds.map(() => '?').join(',');
            db.all(`
              SELECT * FROM treatment_medications 
              WHERE treatment_id IN (${placeholders})
            `, treatmentIds, (err, medications) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: 'Database error'
                });
              }

              // Group medications by treatment_id
              const medicationsByTreatment = medications.reduce((acc, med) => {
                if (!acc[med.treatment_id]) {
                  acc[med.treatment_id] = [];
                }
                acc[med.treatment_id].push(med);
                return acc;
              }, {});

              // Add medications to treatments
              treatments.forEach(treatment => {
                treatment.medications = medicationsByTreatment[treatment.id] || [];
              });

              res.json({
                success: true,
                data: {
                  treatments,
                  pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: countResult.total,
                    pages: Math.ceil(countResult.total / limit)
                  }
                }
              });
            });
          } else {
            res.json({
              success: true,
              data: {
                treatments,
                pagination: {
                  page: parseInt(page),
                  limit: parseInt(limit),
                  total: countResult.total,
                  pages: Math.ceil(countResult.total / limit)
                }
              }
            });
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

  async getTreatmentById(req, res) {
    try {
      const { id } = req.params;
      const db = database.getDb();

      db.get(`
        SELECT t.*, 
               p.first_name || ' ' || p.last_name as patient_name,
               u.first_name || ' ' || u.last_name as doctor_name
        FROM treatments t
        JOIN patients p ON t.patient_id = p.id
        JOIN users u ON t.doctor_id = u.id
        WHERE t.id = ?
      `, [id], (err, treatment) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (!treatment) {
          return res.status(404).json({
            success: false,
            message: 'Treatment not found'
          });
        }

        // Get medications
        db.all('SELECT * FROM treatment_medications WHERE treatment_id = ?', [id], (err, medications) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error'
            });
          }

          treatment.medications = medications;

          res.json({
            success: true,
            data: treatment
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

  async createTreatment(req, res) {
    try {
      const { 
        patient_id, 
        treatment_name, 
        description, 
        start_date, 
        end_date, 
        medications = [] 
      } = req.body;
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

        // Create treatment
        db.run(`
          INSERT INTO treatments (patient_id, doctor_id, treatment_name, description, start_date, end_date)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [patient_id, doctor_id, treatment_name, description, start_date, end_date], function(err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Failed to create treatment'
            });
          }

          const treatmentId = this.lastID;

          // Add medications if provided
          if (medications.length > 0) {
            const medicationPromises = medications.map(med => {
              return new Promise((resolve, reject) => {
                db.run(`
                  INSERT INTO treatment_medications (treatment_id, medication_name, dosage, frequency)
                  VALUES (?, ?, ?, ?)
                `, [treatmentId, med.name, med.dosage, med.frequency], (err) => {
                  if (err) reject(err);
                  else resolve();
                });
              });
            });

            Promise.all(medicationPromises)
              .then(() => {
                res.status(201).json({
                  success: true,
                  message: 'Treatment created successfully',
                  data: { id: treatmentId }
                });
              })
              .catch(() => {
                res.status(500).json({
                  success: false,
                  message: 'Treatment created but failed to add medications'
                });
              });
          } else {
            res.status(201).json({
              success: true,
              message: 'Treatment created successfully',
              data: { id: treatmentId }
            });
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

  async updateTreatment(req, res) {
    try {
      const { id } = req.params;
      const { treatment_name, description, start_date, end_date, status } = req.body;
      const db = database.getDb();

      db.run(`
        UPDATE treatments 
        SET treatment_name = ?, description = ?, start_date = ?, end_date = ?, 
            status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [treatment_name, description, start_date, end_date, status, id], function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to update treatment'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'Treatment not found'
          });
        }

        res.json({
          success: true,
          message: 'Treatment updated successfully'
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

  async deleteTreatment(req, res) {
    try {
      const { id } = req.params;
      const db = database.getDb();

      db.run('DELETE FROM treatments WHERE id = ?', [id], function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to delete treatment'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'Treatment not found'
          });
        }

        res.json({
          success: true,
          message: 'Treatment deleted successfully'
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

  async getPatientTreatments(req, res) {
    try {
      const { patientId } = req.params;
      const db = database.getDb();

      db.all(`
        SELECT t.*, u.first_name || ' ' || u.last_name as doctor_name
        FROM treatments t
        JOIN users u ON t.doctor_id = u.id
        WHERE t.patient_id = ?
        ORDER BY t.start_date DESC
      `, [patientId], (err, treatments) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        // Get medications for each treatment
        const treatmentIds = treatments.map(t => t.id);
        if (treatmentIds.length > 0) {
          const placeholders = treatmentIds.map(() => '?').join(',');
          db.all(`
            SELECT * FROM treatment_medications 
            WHERE treatment_id IN (${placeholders})
          `, treatmentIds, (err, medications) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: 'Database error'
              });
            }

            // Group medications by treatment_id
            const medicationsByTreatment = medications.reduce((acc, med) => {
              if (!acc[med.treatment_id]) {
                acc[med.treatment_id] = [];
              }
              acc[med.treatment_id].push(med);
              return acc;
            }, {});

            // Add medications to treatments
            treatments.forEach(treatment => {
              treatment.medications = medicationsByTreatment[treatment.id] || [];
            });

            res.json({
              success: true,
              data: treatments
            });
          });
        } else {
          res.json({
            success: true,
            data: treatments
          });
        }
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

module.exports = new TreatmentController();