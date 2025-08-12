import express from 'express';
import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';

const router = express.Router();

// IT/Admin: Add new student
router.post('/add', async (req, res) => {
  try {
    const { rollNumber, password, name, department, year } = req.body;
    if (!rollNumber || !password || !name) {
      return res.status(400).json({ message: 'Required fields missing' });
    }
    const existing = await Student.findOne({ rollNumber });
    if (existing) {
      return res.status(409).json({ message: 'Student already exists' });
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
    res.status(201).json({ message: 'Student added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Student Login
router.post('/login', async (req, res) => {
  try {
    const { rollNumber, password } = req.body;
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // For demo: return student info (never return password)
    res.json({
      name: student.name,
      rollNumber: student.rollNumber,
      department: student.department,
      year: student.year
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
