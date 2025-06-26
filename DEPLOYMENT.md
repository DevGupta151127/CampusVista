# CampusVista - Deployment Guide

This guide covers deploying the CampusVista MERN stack application to various platforms.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd campusvista
```

### 2. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 3. Environment Configuration
Create `.env` files:

**Backend (.env in server/)**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/campusvista
JWT_SECRET=your_super_secret_jwt_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**Frontend (.env in root/)**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 4. Database Setup
```bash
# Start MongoDB (if local)
mongod

# Seed database
cd server
npm run seed
```

### 5. Start Application
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm start
```

Access the application at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Build and Run**
```bash
docker-compose up -d
```

2. **Seed Database**
```bash
docker-compose exec backend npm run seed
```

3. **Access Application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

### Manual Docker Build

1. **Build Images**
```bash
# Backend
docker build -t campusvista-backend ./server

# Frontend
docker build -t campusvista-frontend .
```

2. **Run Containers**
```bash
# MongoDB
docker run -d --name mongodb -p 27017:27017 mongo:6.0

# Backend
docker run -d --name backend -p 5000:5000 --link mongodb campusvista-backend

# Frontend
docker run -d --name frontend -p 3000:3000 campusvista-frontend
```

## ☁️ Cloud Deployment

### Heroku Deployment

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Create Heroku App**
```bash
heroku create campusvista-app
```

3. **Add MongoDB Add-on**
```bash
heroku addons:create mongolab:sandbox
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set STRIPE_SECRET_KEY=sk_test_your_key
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

5. **Deploy Backend**
```bash
cd server
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a campusvista-app
git push heroku main
```

6. **Deploy Frontend**
```bash
# Build React app
npm run build

# Deploy to Heroku or use Netlify/Vercel
```

### Vercel Deployment (Frontend)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set Environment Variables**
```bash
vercel env add REACT_APP_API_URL
vercel env add REACT_APP_STRIPE_PUBLISHABLE_KEY
```

### Railway Deployment

1. **Connect Repository**
- Go to railway.app
- Connect your GitHub repository

2. **Configure Services**
- Backend: Set root directory to `server`
- Frontend: Set root directory to `.`
- Add MongoDB service

3. **Set Environment Variables**
- Add all required environment variables

4. **Deploy**
- Railway will automatically deploy on push

## 🔧 Production Configuration

### Environment Variables (Production)

**Backend**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusvista
JWT_SECRET=your_very_secure_jwt_secret_key
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CORS_ORIGIN=https://yourdomain.com
```

**Frontend**
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_key
```

### Security Considerations

1. **HTTPS Only**
```javascript
// In server.js
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

2. **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

3. **CORS Configuration**
```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### Performance Optimization

1. **Database Indexing**
```javascript
// Add indexes to frequently queried fields
studentSchema.index({ email: 1 });
studentSchema.index({ studentId: 1 });
courseSchema.index({ courseCode: 1 });
```

2. **Caching**
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache frequently accessed data
app.get('/api/courses', async (req, res) => {
  const cacheKey = 'courses';
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const courses = await Course.find({ isActive: true });
  await client.setex(cacheKey, 3600, JSON.stringify(courses));
  res.json(courses);
});
```

## 📊 Monitoring and Logging

### PM2 Configuration
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js --env production

# Monitor
pm2 monit

# Logs
pm2 logs
```

### Health Check Endpoint
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        npm install
        cd server && npm install
        
    - name: Run tests
      run: |
        npm test
        cd server && npm test
        
    - name: Build frontend
      run: npm run build
      
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
        heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
```

2. **Port Already in Use**
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

3. **Environment Variables Not Loading**
```bash
# Check if .env file exists
ls -la .env

# Verify environment variables
echo $NODE_ENV
```

4. **Build Failures**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Logs and Debugging

```bash
# Backend logs
cd server
npm run dev

# Frontend logs
npm start

# Docker logs
docker-compose logs -f

# PM2 logs
pm2 logs campusvista-server
```

## 📞 Support

For deployment issues:
1. Check the logs for error messages
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check database connectivity
5. Verify API endpoints are accessible

Contact: support@campusvista.com 