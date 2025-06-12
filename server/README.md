# Clinic Management System - Backend API

A comprehensive backend API for a clinic management system built with Node.js, Express, and SQLite.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Doctor, Nurse, Receptionist, Lab Technician)
- Password hashing with bcrypt
- Session management

### 👥 User Management
- User registration and profile management
- Role-based permissions
- Password reset functionality
- Activity logging

### 🏥 Patient Management
- Patient registration with comprehensive information
- Medical history tracking
- Patient search and filtering
- GDPR-compliant data handling

### 🩺 Medical Records
- Diagnosis management
- Treatment plans with medications
- Lab results with file uploads
- Medical history timeline

### 📅 Scheduling
- Nurse scheduling system
- Appointment management
- Calendar integration
- Conflict detection

### 📊 Dashboard & Analytics
- Real-time statistics
- Patient analytics
- Activity monitoring
- Reporting system

### 🔒 Security Features
- Rate limiting
- Input validation
- SQL injection prevention
- File upload security
- Audit logging

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize database**
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Users
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users` - Create new user (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `POST /api/users/:id/reset-password` - Reset user password (Admin only)

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create new patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient (Admin only)
- `GET /api/patients/:id/medical-history` - Get patient medical history

### Diagnoses
- `GET /api/diagnoses` - Get all diagnoses
- `POST /api/diagnoses` - Create new diagnosis (Doctors only)
- `GET /api/diagnoses/:id` - Get diagnosis by ID
- `PUT /api/diagnoses/:id` - Update diagnosis (Doctors only)
- `DELETE /api/diagnoses/:id` - Delete diagnosis (Admin only)
- `GET /api/diagnoses/patient/:patientId` - Get patient diagnoses

### Treatments
- `GET /api/treatments` - Get all treatments
- `POST /api/treatments` - Create new treatment (Doctors only)
- `GET /api/treatments/:id` - Get treatment by ID
- `PUT /api/treatments/:id` - Update treatment (Doctors only)
- `DELETE /api/treatments/:id` - Delete treatment (Admin only)
- `GET /api/treatments/patient/:patientId` - Get patient treatments

### Lab Results
- `GET /api/lab-results` - Get all lab results
- `POST /api/lab-results` - Create new lab result (with file upload)
- `GET /api/lab-results/:id` - Get lab result by ID
- `PUT /api/lab-results/:id` - Update lab result
- `DELETE /api/lab-results/:id` - Delete lab result (Admin only)
- `GET /api/lab-results/patient/:patientId` - Get patient lab results
- `GET /api/lab-results/:id/download` - Download lab result file

### Schedules
- `GET /api/schedules` - Get all schedules
- `POST /api/schedules` - Create new schedule
- `GET /api/schedules/:id` - Get schedule by ID
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule
- `GET /api/schedules/nurse/:nurseId` - Get nurse schedules
- `POST /api/schedules/:id/complete` - Mark schedule as complete
- `GET /api/schedules/nurses/list` - Get all nurses

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-patients` - Get recent patients
- `GET /api/dashboard/upcoming-appointments` - Get upcoming appointments
- `GET /api/dashboard/patient-statistics` - Get patient statistics
- `GET /api/dashboard/activity-log` - Get activity log (Admin only)

## Database Schema

### Users Table
- User authentication and profile information
- Role-based access control
- Password management

### Patients Table
- Comprehensive patient information
- Contact details and emergency contacts
- Insurance information
- Medical history

### Diagnoses Table
- Medical diagnoses with descriptions
- Doctor and date information
- Patient medical history

### Treatments Table
- Treatment plans and descriptions
- Start and end dates
- Status tracking

### Treatment Medications Table
- Medications associated with treatments
- Dosage and frequency information

### Lab Results Table
- Laboratory test results
- File attachments
- Status tracking

### Nurse Schedules Table
- Nursing care scheduling
- Time and duration management
- Status tracking

### Appointments Table
- Doctor appointments
- Scheduling and status management

### Audit Logs Table
- Activity tracking
- Security monitoring
- Change history

## Security

### Authentication
- JWT tokens with expiration
- Secure password hashing
- Role-based access control

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- File upload restrictions
- Rate limiting

### Audit Trail
- All actions are logged
- User activity tracking
- Change history maintenance

## File Uploads

### Lab Results
- Supported formats: PDF, JPG, JPEG, PNG
- Maximum file size: 10MB
- Secure file storage
- Download protection

### Storage Structure
```
uploads/
└── lab-results/
    ├── lab-result-1234567890-123.pdf
    └── lab-result-1234567890-124.jpg
```

## Error Handling

### Standard Response Format
```json
{
  "success": boolean,
  "message": "string",
  "data": object,
  "errors": array
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Development

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

### Database Seeding
```bash
npm run seed
```

## Deployment

### Environment Variables
Ensure all required environment variables are set:
- `JWT_SECRET` - Strong secret key
- `NODE_ENV` - production
- `PORT` - Server port
- `FRONTEND_URL` - Frontend application URL

### Production Considerations
- Use a strong JWT secret
- Enable HTTPS
- Configure proper CORS settings
- Set up log rotation
- Monitor database performance
- Regular backups

## Default Credentials

After seeding the database:

**Admin User:**
- Username: `admin`
- Password: `admin123`

**Sample Users:**
- Dr. Smith: `dr.smith` / `password123`
- Dr. Johnson: `dr.johnson` / `password123`
- Nurse Emily: `nurse.emily` / `password123`

⚠️ **Important**: Change default passwords in production!

## Support

For issues and questions:
1. Check the API documentation
2. Review error logs
3. Verify environment configuration
4. Check database connectivity

## License

This project is licensed under the MIT License.