const bcrypt = require('bcryptjs');
const database = require('../config/database');

async function seedDatabase() {
  const db = database.getDb();
  
  console.log('🌱 Starting database seeding...');

  try {
    // Create sample users
    const users = [
      {
        first_name: 'John',
        last_name: 'Smith',
        username: 'dr.smith',
        email: 'john.smith@clinic.com',
        password: await bcrypt.hash('password123', 10),
        role: 'doctor',
        department: 'Cardiology'
      },
      {
        first_name: 'Sarah',
        last_name: 'Johnson',
        username: 'dr.johnson',
        email: 'sarah.johnson@clinic.com',
        password: await bcrypt.hash('password123', 10),
        role: 'doctor',
        department: 'Neurology'
      },
      {
        first_name: 'Emily',
        last_name: 'Davis',
        username: 'nurse.emily',
        email: 'emily.davis@clinic.com',
        password: await bcrypt.hash('password123', 10),
        role: 'nurse',
        department: 'General'
      },
      {
        first_name: 'Michael',
        last_name: 'Wilson',
        username: 'nurse.michael',
        email: 'michael.wilson@clinic.com',
        password: await bcrypt.hash('password123', 10),
        role: 'nurse',
        department: 'Emergency'
      },
      {
        first_name: 'Lisa',
        last_name: 'Brown',
        username: 'lab.lisa',
        email: 'lisa.brown@clinic.com',
        password: await bcrypt.hash('password123', 10),
        role: 'lab_technician',
        department: 'Laboratory'
      }
    ];

    // Insert users
    for (const user of users) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR IGNORE INTO users (first_name, last_name, username, email, password, role, department, require_password_change)
          VALUES (?, ?, ?, ?, ?, ?, ?, 0)
        `, [user.first_name, user.last_name, user.username, user.email, user.password, user.role, user.department], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // Create sample patients
    const patients = [
      {
        first_name: 'Alice',
        last_name: 'Cooper',
        date_of_birth: '1985-03-15',
        gender: 'female',
        email: 'alice.cooper@email.com',
        phone: '(555) 123-4567',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62701',
        status: 'active'
      },
      {
        first_name: 'Bob',
        last_name: 'Johnson',
        date_of_birth: '1978-07-22',
        gender: 'male',
        email: 'bob.johnson@email.com',
        phone: '(555) 234-5678',
        address: '456 Oak Ave',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62702',
        status: 'active'
      },
      {
        first_name: 'Carol',
        last_name: 'Williams',
        date_of_birth: '1992-11-08',
        gender: 'female',
        email: 'carol.williams@email.com',
        phone: '(555) 345-6789',
        address: '789 Pine St',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62703',
        status: 'critical'
      },
      {
        first_name: 'David',
        last_name: 'Brown',
        date_of_birth: '1965-12-03',
        gender: 'male',
        email: 'david.brown@email.com',
        phone: '(555) 456-7890',
        address: '321 Elm St',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62704',
        status: 'stable'
      }
    ];

    // Insert patients
    for (const patient of patients) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR IGNORE INTO patients (first_name, last_name, date_of_birth, gender, email, phone, address, city, state, zip_code, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [patient.first_name, patient.last_name, patient.date_of_birth, patient.gender, patient.email, patient.phone, patient.address, patient.city, patient.state, patient.zip_code, patient.status], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // Create sample diagnoses
    const diagnoses = [
      {
        patient_id: 1,
        doctor_id: 2, // Dr. Smith
        diagnosis: 'Hypertension',
        description: 'High blood pressure requiring medication and lifestyle changes',
        date: '2024-01-15'
      },
      {
        patient_id: 2,
        doctor_id: 2,
        diagnosis: 'Type 2 Diabetes',
        description: 'Diabetes mellitus requiring insulin therapy',
        date: '2024-01-20'
      },
      {
        patient_id: 3,
        doctor_id: 3, // Dr. Johnson
        diagnosis: 'Migraine',
        description: 'Chronic migraine headaches',
        date: '2024-01-25'
      }
    ];

    // Insert diagnoses
    for (const diagnosis of diagnoses) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR IGNORE INTO diagnoses (patient_id, doctor_id, diagnosis, description, date)
          VALUES (?, ?, ?, ?, ?)
        `, [diagnosis.patient_id, diagnosis.doctor_id, diagnosis.diagnosis, diagnosis.description, diagnosis.date], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // Create sample treatments
    const treatments = [
      {
        patient_id: 1,
        doctor_id: 2,
        treatment_name: 'Hypertension Management',
        description: 'Blood pressure medication and dietary changes',
        start_date: '2024-01-15',
        end_date: '2024-07-15',
        status: 'active'
      },
      {
        patient_id: 2,
        doctor_id: 2,
        treatment_name: 'Diabetes Management',
        description: 'Insulin therapy and blood sugar monitoring',
        start_date: '2024-01-20',
        status: 'active'
      }
    ];

    // Insert treatments
    for (const treatment of treatments) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR IGNORE INTO treatments (patient_id, doctor_id, treatment_name, description, start_date, end_date, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [treatment.patient_id, treatment.doctor_id, treatment.treatment_name, treatment.description, treatment.start_date, treatment.end_date, treatment.status], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // Create sample lab results
    const labResults = [
      {
        patient_id: 1,
        doctor_id: 2,
        test_name: 'Complete Blood Count',
        test_date: '2024-01-10',
        result_date: '2024-01-12',
        results: 'Normal values within range',
        status: 'completed',
        notes: 'All parameters normal'
      },
      {
        patient_id: 2,
        doctor_id: 2,
        test_name: 'HbA1c Test',
        test_date: '2024-01-18',
        result_date: '2024-01-20',
        results: 'HbA1c: 8.2% (elevated)',
        status: 'completed',
        notes: 'Diabetes control needs improvement'
      },
      {
        patient_id: 3,
        doctor_id: 6, // Lab technician
        test_name: 'MRI Brain Scan',
        test_date: '2024-01-22',
        status: 'pending',
        notes: 'Scheduled for migraine evaluation'
      }
    ];

    // Insert lab results
    for (const labResult of labResults) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR IGNORE INTO lab_results (patient_id, doctor_id, test_name, test_date, result_date, results, status, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [labResult.patient_id, labResult.doctor_id, labResult.test_name, labResult.test_date, labResult.result_date, labResult.results, labResult.status, labResult.notes], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('📋 Sample data created:');
    console.log('   - 5 users (doctors, nurses, lab technician)');
    console.log('   - 4 patients');
    console.log('   - 3 diagnoses');
    console.log('   - 2 treatments');
    console.log('   - 3 lab results');
    console.log('');
    console.log('🔐 Login credentials:');
    console.log('   Admin: username=admin, password=admin123');
    console.log('   Dr. Smith: username=dr.smith, password=password123');
    console.log('   Dr. Johnson: username=dr.johnson, password=password123');
    console.log('   Nurse Emily: username=nurse.emily, password=password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    database.close();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;