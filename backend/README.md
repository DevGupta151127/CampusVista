# CampusVista Backend

This is the backend for the CampusVista project, built with Node.js, Express, and MongoDB.

## Features
- Secure student login with hashed passwords
- IT/Admin API to add new students

## Setup
1. Copy `.env.example` to `.env` and fill in your MongoDB URI and JWT secret.
2. Run `npm install` in the `backend` directory.
3. Start the server with `npm run dev` (for development) or `npm start` (for production).

## API Endpoints
### POST /api/students/add
Add a new student (IT/Admin only)
```
{
  "rollNumber": "220031020064",
  "password": "Dev@Gupta",
  "name": "Dev Gupta",
  "department": "Computer Science",
  "year": "2nd Year"
}
```

### POST /api/students/login
Student login
```
{
  "rollNumber": "220031020064",
  "password": "Dev@Gupta"
}
```
