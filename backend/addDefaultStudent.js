// Script to add a default student to MongoDB for CampusVista

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function addDefaultStudent() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const rollNumber = '220031020064';
  const password = 'Dev@Gupta';
  const name = 'Dev Gupta';
  const department = 'Computer Science';
  const year = '2nd Year';

  const existing = await Student.findOne({ rollNumber });
  if (existing) {
    console.log('Student already exists.');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const student = new Student({
    rollNumber,
    password: hashedPassword,
    name,
    department,
    year
  });
  await student.save();
  console.log('Default student added successfully.');
  process.exit(0);
}

addDefaultStudent().catch(err => {
  console.error('Error adding student:', err);
  process.exit(1);
});
