import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// ...existing code...

// Get all students (for admin/IT use only)
router.get('/all', async (req, res) => {
  try {
    const students = await Student.find({}, '-password'); // Exclude password
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
