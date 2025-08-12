import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import studentRoutes from './routes/student.js';
import coursesRoutes from './routes/courses.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/courses', coursesRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
