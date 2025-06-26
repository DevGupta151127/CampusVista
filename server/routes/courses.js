const express = require('express');
const Course = require('../models/Course');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { department, semester, year } = req.query;
    
    let query = { isActive: true };
    
    if (department) {
      query.department = department;
    }
    
    if (semester) {
      query.semester = semester;
    }
    
    if (year) {
      query.year = parseInt(year);
    }

    const courses = await Course.find(query)
      .select('-syllabus -assignments')
      .sort({ courseCode: 1 });

    res.json(courses);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get specific course
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/available
// @desc    Get available courses (not full)
// @access  Public
router.get('/available', async (req, res) => {
  try {
    const courses = await Course.find({
      isActive: true,
      $expr: { $lt: ['$enrolledStudents', '$capacity'] }
    })
    .select('-syllabus -assignments')
    .sort({ courseCode: 1 });

    res.json(courses);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/departments
// @desc    Get all departments
// @access  Public
router.get('/departments', async (req, res) => {
  try {
    const departments = await Course.distinct('department');
    res.json(departments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 