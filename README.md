# CampusVista - Student Management System

A comprehensive student management system built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring payment integration, course management, and academic tracking.

## Features

### Student Features
- **Authentication & Authorization**: Secure login/registration with JWT
- **Dashboard**: Overview of academic progress, payments, and schedule
- **Course Management**: Enroll/drop courses, view course details
- **Payment System**: Integrated Stripe payment processing
- **Grade Tracking**: View grades and academic performance
- **Assignment Submission**: Submit and track assignments
- **Attendance Tracking**: Mark and view attendance
- **Profile Management**: Update personal information

### Admin Features (Future Implementation)
- Student management
- Course creation and management
- Grade management
- Payment tracking
- Report generation

## Tech Stack

### Frontend
- React 18
- Material-UI (MUI)
- Redux Toolkit
- React Router
- Axios
- Chart.js
- Stripe Elements

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Stripe API
- bcryptjs
- Express Validator

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe Account (for payments)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd campusvista
```

### 2. Install dependencies

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd server
npm install
```

### 3. Environment Setup

#### Backend (.env)
Create a `.env` file in the `server` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/campusvista

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

#### Frontend (.env)
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### 4. Database Setup
Make sure MongoDB is running locally or update the MONGODB_URI to point to your MongoDB Atlas cluster.

### 5. Stripe Setup
1. Create a Stripe account
2. Get your API keys from the Stripe Dashboard
3. Update the environment variables with your keys
4. Set up webhook endpoints (optional)

## Running the Application

### Development Mode

#### Backend
```bash
cd server
npm run dev
```

#### Frontend
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Production Mode

#### Backend
```bash
cd server
npm start
```

#### Frontend
```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new student
- `POST /api/auth/login` - Login student
- `GET /api/auth/me` - Get current student info

### Students
- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile` - Update student profile
- `GET /api/students/courses` - Get enrolled courses
- `POST /api/students/enroll` - Enroll in a course
- `DELETE /api/students/courses/:id` - Drop a course

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get specific course
- `GET /api/courses/available` - Get available courses

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm-payment` - Confirm payment
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/outstanding` - Get outstanding payments

### Assignments
- `GET /api/assignments` - Get assignments
- `POST /api/assignments/:id/submit` - Submit assignment
- `GET /api/assignments/:id/submission` - Get submission

### Grades
- `GET /api/grades` - Get grades
- `GET /api/grades/course/:id` - Get course grades

### Attendance
- `GET /api/attendance` - Get attendance
- `POST /api/attendance/mark` - Mark attendance

## Project Structure

```
campusvista/
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── Layout.js
│   │   └── StudentDashboard.js
│   ├── services/
│   │   └── api.js
│   ├── store/
│   │   ├── index.js
│   │   └── studentSlice.js
│   └── App.js
├── server/
│   ├── models/
│   │   ├── Student.js
│   │   └── Course.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── courses.js
│   │   ├── payments.js
│   │   ├── assignments.js
│   │   ├── grades.js
│   │   └── attendance.js
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@campusvista.com or create an issue in the repository.

## Future Enhancements

- [ ] Admin dashboard
- [ ] Email notifications
- [ ] File upload for assignments
- [ ] Real-time chat
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Push notifications

