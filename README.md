# CampusVista - Modern College Website

A full-stack, production-ready college website built with React, Node.js, and MongoDB. Features modern authentication, course management, student portal, and responsive design.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI/UX** with Tailwind CSS and Framer Motion
- **Responsive Design** for all devices
- **Authentication System** with JWT tokens
- **Student Dashboard** with profile management
- **Course Catalog** with search and filtering
- **Admission System** with document upload
- **Faculty Directory** with detailed profiles
- **Gallery & Virtual Tour** with image optimization
- **Contact Forms** with email notifications
- **SEO Optimized** with React Helmet

### Backend (Node.js + Express)
- **RESTful API** with proper error handling
- **JWT Authentication** with role-based access
- **MongoDB Database** with Mongoose ODM
- **File Upload** with Multer and image processing
- **Email System** with Nodemailer and templates
- **Rate Limiting** and security middleware
- **Input Validation** with Express Validator
- **Password Reset** and email verification

### Security & Performance
- **HTTPS/SSL** ready for production
- **CORS** configuration for cross-origin requests
- **Helmet.js** for security headers
- **Compression** middleware for performance
- **Input Sanitization** and validation
- **Account Lockout** after failed attempts
- **Password Hashing** with bcrypt

## 🛠️ Tech Stack

### Frontend
- **React 18** with Hooks and Context API
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** for forms
- **Axios** for API calls

### Backend

- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Express Validator** for validation
- **Helmet** for security


- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git
cd Campus-Vista

### 2. Install Dependencies
```bash
# Install server dependencies
# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup
```bash
# Copy environment example
cp env.example .env

# Edit .env file with your configuration
nano .env
```

### 4. Database Setup
```bash
# Start MongoDB (if local)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### 5. Email Configuration
Update the email settings in `.env`:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```
### 6. Run the Application
```bash
# Development (both frontend and backend)
npm run dev

# Or run separately
npm run server    # Backend only
npm run client    # Frontend only
```

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/campusvista

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email (Gmail Example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./server/uploads

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📁 Project Structure

```
campusvista/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── styles/        # Global styles
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── uploads/           # File uploads
│   └── index.js           # Server entry
├── assets/                # Static assets
├── package.json
├── env.example
└── README.md
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/build`
4. Add environment variables in Vercel dashboard

### Backend Deployment (Railway/Render)
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables
5. Set up MongoDB Atlas connection

### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in environment variables

### Domain & SSL
1. Purchase domain (GoDaddy, Namecheap, etc.)
2. Configure DNS settings
3. Set up SSL certificate (Let's Encrypt)
4. Update CORS settings for production

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev              # Run both frontend and backend
npm run server           # Run backend only
npm run client           # Run frontend only

# Production
npm run build            # Build frontend
npm start               # Start production server

# Testing
npm test                # Run tests
npm run lint            # Lint code
npm run format          # Format code
```

### Code Quality
```bash
# Install additional dev dependencies
npm install -D @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio

# Run linting
npm run lint

# Format code
npm run format
```

## 📱 Features Overview

### Public Pages
- **Home**: Hero section, featured courses, stats
- **About**: College history, mission, vision
- **Courses**: Course catalog with search and filters
- **Faculty**: Faculty directory with profiles
- **Admission**: Application process and forms
- **Contact**: Contact forms and information
- **Gallery**: Photo gallery and virtual tour
- **Campus Life**: Student activities and facilities

### Student Portal
- **Dashboard**: Overview of applications and courses
- **Profile**: Personal information management
- **Applications**: Track admission applications
- **Documents**: Upload and manage documents

### Admin Features
- **User Management**: Manage students and faculty
- **Course Management**: Add/edit courses
- **Application Review**: Review admission applications
- **Content Management**: Update website content

## 🔒 Security Features

- **JWT Authentication** with token refresh
- **Password Hashing** with bcrypt
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **CORS** configuration
- **Security Headers** with Helmet
- **Account Lockout** after failed attempts
- **Email Verification** for new accounts

## 📊 Performance Optimizations

- **Image Optimization** with compression
- **Code Splitting** for better loading
- **Lazy Loading** for components
- **Caching** with React Query
- **Compression** middleware
- **CDN** ready for static assets
- **SEO** optimization with meta tags

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@campusvista.edu or create an issue in the repository.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the frontend framework
- [Node.js](https://nodejs.org/) for the backend runtime
- [MongoDB](https://mongodb.com/) for the database
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://framer.com/motion) for animations

---

**Made with ❤️ for modern education** 