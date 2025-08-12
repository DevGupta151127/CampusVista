import express from 'express';
const router = express.Router();

// Sample courses for demo (replace with DB in production)
const courses = [
  { name: 'Mathematics', code: 'MATH101', instructor: 'Dr. Smith', grade: 'A' },
  { name: 'Physics', code: 'PHY101', instructor: 'Dr. Johnson', grade: 'B+' },
  { name: 'Chemistry', code: 'CHEM101', instructor: 'Dr. Williams', grade: 'A-' }
];

// Get all courses for a student (by roll number)
router.get('/:rollNumber/courses', (req, res) => {
  // In production, filter by rollNumber from DB
  res.json(courses);
});

export default router;
