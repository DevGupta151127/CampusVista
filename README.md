# CampusVista - World-Class College Portal

## Overview

CampusVista is a comprehensive, modern college portal system that provides a seamless experience for students, faculty, and administrators. Built with cutting-edge technologies and best practices, it offers a complete solution for educational institutions.

## Key Features

### For Students
- Interactive Dashboard
- Course Registration & Management
- Attendance Tracking
- Grade Viewing
- Assignment Submission
- Fee Payment
- Library Access
- Event Calendar
- Career Services
- Alumni Network

### For Faculty
- Course Management
- Attendance Management
- Grade Management
- Assignment Creation
- Student Progress Tracking
- Research Portal
- Department Resources

### For Administrators
- User Management
- Course Management
- Department Management
- Fee Management
- Report Generation
- System Configuration
- Analytics Dashboard

## Technology Stack

### Backend
- Node.js with Express
- MongoDB Database
- JWT Authentication
- Socket.IO for Real-time Features
- Multer for File Uploads
- Nodemailer for Email Services

### Frontend
- React.js
- Material-UI
- Redux for State Management
- Axios for API Calls
- Chart.js for Analytics

## Project Structure

```
CampusVista/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/    # Reusable components
│       ├── pages/        # Page components
│       ├── redux/        # State management
│       ├── services/     # API services
│       └── utils/        # Utility functions
├── server/                # Node.js backend
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── utils/          # Utility functions
├── .env                 # Environment variables
├── package.json        # Project dependencies
└── README.md          # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/DevGupta151127/CampusVista.git
   cd CampusVista
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables with your values

4. Start the development servers:
   ```bash
   # Start both frontend and backend
   npm run dev:full

   # Or start them separately
   npm run dev        # Backend
   npm run client    # Frontend
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Security Features

- JWT-based Authentication
- Role-based Access Control
- Password Encryption
- Secure File Uploads
- Input Validation
- XSS Protection
- CSRF Protection
- Rate Limiting

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or create an issue in the repository.

