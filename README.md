# Digital Gate Pass Management System

A complete full-stack MERN application for managing digital gate passes in educational institutions.

## Features

- **Role-based Authentication** (Student, Faculty, Security, Admin)
- **JWT-based Security** with bcrypt password encryption
- **QR Code Generation** for approved gate passes
- **Real-time Status Tracking** (Pending, Approved, Rejected)
- **Exit/Entry Logging** by security personnel
- **Admin Dashboard** for user and record management
- **Responsive UI** with clean design

## Tech Stack

- **Frontend**: React.js (Hooks, Context API, React Router)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + bcrypt
- **QR Code**: qrcode library

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally or MongoDB Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gatepass
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React app:
```bash
npm start
```

Frontend will run on http://localhost:3000

## User Roles & Access

### Student
- Register and login
- Apply for gate pass
- View pass status and history
- Access QR code for approved passes

### Faculty/Warden
- Login
- View pending requests
- Approve/reject gate passes
- Add remarks

### Security
- Login
- Verify QR codes
- Record exit/entry times
- Validate pass expiry

### Admin
- Manage all users
- View all gate pass records
- Filter by department and date
- Delete users

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Student Routes
- `POST /api/gatepass/apply` - Apply for gate pass
- `GET /api/gatepass/my` - Get my gate passes

### Faculty Routes
- `GET /api/gatepass/pending` - Get pending requests
- `PUT /api/gatepass/approve/:id` - Approve gate pass
- `PUT /api/gatepass/reject/:id` - Reject gate pass

### Security Routes
- `POST /api/gatepass/verify` - Verify QR code
- `PUT /api/gatepass/exit/:id` - Record exit time
- `PUT /api/gatepass/entry/:id` - Record entry time

### Admin Routes
- `GET /api/users` - Get all users
- `DELETE /api/users/:id` - Delete user
- `GET /api/gatepass/all` - Get all gate passes (with filters)

## Database Schema

### User Model
- name, email, password (hashed)
- role (student/faculty/security/admin)
- department, createdAt

### GatePass Model
- studentId (ref User)
- reason, date, outTime, expectedReturnTime, destination
- status (pending/approved/rejected)
- approvedBy (ref User), remarks
- qrCode, exitTime, entryTime, createdAt

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Protected API routes
- Expired pass validation

## Project Structure

```
gate-pass-project/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── GatePass.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── gatepass.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── qrcode.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── StudentDashboard.js
    │   │   ├── FacultyDashboard.js
    │   │   ├── SecurityDashboard.js
    │   │   └── AdminDashboard.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

## Usage

1. Start MongoDB service
2. Run backend server: `cd backend && npm run dev`
3. Run frontend app: `cd frontend && npm start`
4. Register users with different roles
5. Login and access role-specific dashboards

## Default Test Users

Create these users via registration:

- **Student**: role=student
- **Faculty**: role=faculty
- **Security**: role=security
- **Admin**: role=admin

## License

MIT
