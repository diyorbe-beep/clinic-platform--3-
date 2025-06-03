const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./server/clinic.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      department TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Patients table
    db.run(`CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      date_of_birth DATE NOT NULL,
      gender TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Diagnoses table
    db.run(`CREATE TABLE IF NOT EXISTS diagnoses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      diagnosis TEXT NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id),
      FOREIGN KEY (doctor_id) REFERENCES users (id)
    )`);

    // Treatments table
    db.run(`CREATE TABLE IF NOT EXISTS treatments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      treatment_name TEXT NOT NULL,
      description TEXT,
      start_date DATE NOT NULL,
      end_date DATE,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id),
      FOREIGN KEY (doctor_id) REFERENCES users (id)
    )`);

    // Lab results table
    db.run(`CREATE TABLE IF NOT EXISTS lab_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      test_name TEXT NOT NULL,
      test_date DATE NOT NULL,
      result_date DATE,
      results TEXT,
      status TEXT NOT NULL,
      doctor_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id),
      FOREIGN KEY (doctor_id) REFERENCES users (id)
    )`);
  });
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.password, (err, match) => {
      if (err || !match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    });
  });
});

// Patients routes
app.get('/api/patients', authenticateToken, (req, res) => {
  db.all('SELECT * FROM patients ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/patients', authenticateToken, (req, res) => {
  const { first_name, last_name, date_of_birth, gender, email, phone, address } = req.body;

  db.run(
    `INSERT INTO patients (first_name, last_name, date_of_birth, gender, email, phone, address)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [first_name, last_name, date_of_birth, gender, email, phone, address],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Patient created successfully' });
    }
  );
});

// Diagnoses routes
app.get('/api/diagnoses/:patientId', authenticateToken, (req, res) => {
  db.all(
    `SELECT d.*, u.username as doctor_name 
     FROM diagnoses d 
     JOIN users u ON d.doctor_id = u.id 
     WHERE d.patient_id = ? 
     ORDER BY d.date DESC`,
    [req.params.patientId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});

app.post('/api/diagnoses', authenticateToken, (req, res) => {
  const { patient_id, diagnosis, description, date } = req.body;
  const doctor_id = req.user.id;

  db.run(
    `INSERT INTO diagnoses (patient_id, doctor_id, diagnosis, description, date)
     VALUES (?, ?, ?, ?, ?)`,
    [patient_id, doctor_id, diagnosis, description, date],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Diagnosis created successfully' });
    }
  );
});

// Treatments routes
app.get('/api/treatments/:patientId', authenticateToken, (req, res) => {
  db.all(
    `SELECT t.*, u.username as doctor_name 
     FROM treatments t 
     JOIN users u ON t.doctor_id = u.id 
     WHERE t.patient_id = ? 
     ORDER BY t.start_date DESC`,
    [req.params.patientId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});

app.post('/api/treatments', authenticateToken, (req, res) => {
  const { patient_id, treatment_name, description, start_date, end_date, status } = req.body;
  const doctor_id = req.user.id;

  db.run(
    `INSERT INTO treatments (patient_id, doctor_id, treatment_name, description, start_date, end_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [patient_id, doctor_id, treatment_name, description, start_date, end_date, status],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Treatment created successfully' });
    }
  );
});

// Lab results routes
app.get('/api/lab-results/:patientId', authenticateToken, (req, res) => {
  db.all(
    `SELECT l.*, u.username as doctor_name 
     FROM lab_results l 
     JOIN users u ON l.doctor_id = u.id 
     WHERE l.patient_id = ? 
     ORDER BY l.test_date DESC`,
    [req.params.patientId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});

app.post('/api/lab-results', authenticateToken, (req, res) => {
  const { patient_id, test_name, test_date, results, status } = req.body;
  const doctor_id = req.user.id;

  db.run(
    `INSERT INTO lab_results (patient_id, doctor_id, test_name, test_date, results, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [patient_id, doctor_id, test_name, test_date, results, status],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Lab result created successfully' });
    }
  );
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});