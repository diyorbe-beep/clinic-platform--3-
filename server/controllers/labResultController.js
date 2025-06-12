const database = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/lab-results');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `lab-result-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
    }
  }
});

class LabResultController {
  constructor() {
    this.upload = upload.single('file');
  }

  async getAllLabResults(req, res) {
    try {
      const { page = 1, limit = 10, patient_id, doctor_id, status } = req.query;
      const offset = (page - 1) * limit;
      const db = database.getDb();

      let query = `
        SELECT l.*, 
               p.first_name || ' ' || p.last_name as patient_name,
               u.first_name || ' ' || u.last_name as doctor_name
        FROM lab_results l
        JOIN patients p ON l.patient_id = p.id
        JOIN users u ON l.doctor_id = u.id
        WHERE 1=1
      `;
      let countQuery = 'SELECT COUNT(*) as total FROM lab_results WHERE 1=1';
      let params = [];
      let countParams = [];

      // Add filters
      if (patient_id) {
        query += ' AND l.patient_id = ?';
        countQuery += ' AND patient_id = ?';
        params.push(patient_id);
        countParams.push(patient_id);
      }

      if (doctor_id) {
        query += ' AND l.doctor_id = ?';
        countQuery += ' AND doctor_id = ?';
        params.push(doctor_id);
        countParams.push(doctor_id);
      }

      if (status) {
        query += ' AND l.status = ?';
        countQuery += ' AND status = ?';
        params.push(status);
        countParams.push(status);
      }

      query += ' ORDER BY l.test_date DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);

      // Get total count
      db.get(countQuery, countParams, (err, countResult) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        // Get lab results
        db.all(query, params, (err, labResults) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error'
            });
          }

          res.json({
            success: true,
            data: {
              labResults,
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

  async getLabResultById(req, res) {
    try {
      const { id } = req.params;
      const db = database.getDb();

      db.get(`
        SELECT l.*, 
               p.first_name || ' ' || p.last_name as patient_name,
               u.first_name || ' ' || u.last_name as doctor_name
        FROM lab_results l
        JOIN patients p ON l.patient_id = p.id
        JOIN users u ON l.doctor_id = u.id
        WHERE l.id = ?
      `, [id], (err, labResult) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (!labResult) {
          return res.status(404).json({
            success: false,
            message: 'Lab result not found'
          });
        }

        res.json({
          success: true,
          data: labResult
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

  async createLabResult(req, res) {
    try {
      this.upload(req, res, (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }

        const { patient_id, test_name, test_date, results, notes } = req.body;
        const doctor_id = req.user.id;
        const file_path = req.file ? req.file.path : null;
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

          // Create lab result
          db.run(`
            INSERT INTO lab_results (patient_id, doctor_id, test_name, test_date, results, file_path, notes, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [patient_id, doctor_id, test_name, test_date, results, file_path, notes, 'completed'], function(err) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: 'Failed to create lab result'
              });
            }

            res.status(201).json({
              success: true,
              message: 'Lab result created successfully',
              data: { 
                id: this.lastID,
                file_uploaded: !!req.file
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

  async updateLabResult(req, res) {
    try {
      const { id } = req.params;
      const { test_name, test_date, result_date, results, status, notes } = req.body;
      const db = database.getDb();

      db.run(`
        UPDATE lab_results 
        SET test_name = ?, test_date = ?, result_date = ?, results = ?, 
            status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [test_name, test_date, result_date, results, status, notes, id], function(err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to update lab result'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'Lab result not found'
          });
        }

        res.json({
          success: true,
          message: 'Lab result updated successfully'
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

  async deleteLabResult(req, res) {
    try {
      const { id } = req.params;
      const db = database.getDb();

      // Get file path before deletion
      db.get('SELECT file_path FROM lab_results WHERE id = ?', [id], (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (!result) {
          return res.status(404).json({
            success: false,
            message: 'Lab result not found'
          });
        }

        // Delete from database
        db.run('DELETE FROM lab_results WHERE id = ?', [id], function(err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Failed to delete lab result'
            });
          }

          // Delete file if exists
          if (result.file_path && fs.existsSync(result.file_path)) {
            fs.unlinkSync(result.file_path);
          }

          res.json({
            success: true,
            message: 'Lab result deleted successfully'
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

  async getPatientLabResults(req, res) {
    try {
      const { patientId } = req.params;
      const db = database.getDb();

      db.all(`
        SELECT l.*, u.first_name || ' ' || u.last_name as doctor_name
        FROM lab_results l
        JOIN users u ON l.doctor_id = u.id
        WHERE l.patient_id = ?
        ORDER BY l.test_date DESC
      `, [patientId], (err, labResults) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        res.json({
          success: true,
          data: labResults
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

  async downloadLabResultFile(req, res) {
    try {
      const { id } = req.params;
      const db = database.getDb();

      db.get('SELECT file_path, test_name FROM lab_results WHERE id = ?', [id], (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (!result || !result.file_path) {
          return res.status(404).json({
            success: false,
            message: 'File not found'
          });
        }

        if (!fs.existsSync(result.file_path)) {
          return res.status(404).json({
            success: false,
            message: 'File not found on server'
          });
        }

        const filename = `${result.test_name}-${Date.now()}${path.extname(result.file_path)}`;
        res.download(result.file_path, filename);
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

module.exports = new LabResultController();