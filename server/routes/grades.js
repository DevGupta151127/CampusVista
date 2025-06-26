const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const router = express.Router();

// Middleware to validate JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.studentId);
    
    if (!student) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.student = student;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// @route   GET /api/grades
// @desc    Get all grades for the student
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // For now, return mock grades
    // In a real application, you would have a separate Grade model
    const mockGrades = [
      {
        courseId: 'course1',
        courseCode: 'CS101',
        courseTitle: 'Introduction to Computer Science',
        assignments: 85,
        midterm: 88,
        final: 92,
        overall: 88.5,
        letterGrade: 'B+'
      },
      {
        courseId: 'course2',
        courseCode: 'MATH201',
        courseTitle: 'Calculus II',
        assignments: 90,
        midterm: 85,
        final: 88,
        overall: 87.7,
        letterGrade: 'B+'
      },
      {
        courseId: 'course3',
        courseCode: 'ENG101',
        courseTitle: 'English Composition',
        assignments: 92,
        midterm: 90,
        final: 94,
        overall: 92.0,
        letterGrade: 'A-'
      }
    ];

    res.json(mockGrades);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/grades/course/:id
// @desc    Get grades for a specific course
// @access  Private
router.get('/course/:id', auth, async (req, res) => {
  try {
    const courseId = req.params.id;

    // Check if student is enrolled in this course
    const isEnrolled = req.student.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(404).json({ message: 'Course not found in enrollments' });
    }

    // For now, return mock grade data
    const mockGrade = {
      courseId: courseId,
      courseCode: 'CS101',
      courseTitle: 'Introduction to Computer Science',
      assignments: [
        { name: 'Assignment 1', score: 85, total: 100, weight: 10 },
        { name: 'Assignment 2', score: 90, total: 100, weight: 10 },
        { name: 'Assignment 3', score: 88, total: 100, weight: 10 }
      ],
      midterm: { score: 88, total: 100, weight: 30 },
      final: { score: 92, total: 100, weight: 40 },
      overall: 88.5,
      letterGrade: 'B+',
      gpa: 3.3
    };

    res.json(mockGrade);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/grades/gpa
// @desc    Get student GPA
// @access  Private
router.get('/gpa', auth, async (req, res) => {
  try {
    // Calculate GPA based on grades
    // For now, return mock data
    const gpaData = {
      currentGPA: 3.45,
      cumulativeGPA: 3.52,
      totalCredits: 45,
      semesterCredits: 15,
      gradeDistribution: {
        'A': 8,
        'A-': 3,
        'B+': 5,
        'B': 4,
        'B-': 2,
        'C+': 1,
        'C': 0,
        'C-': 0,
        'D': 0,
        'F': 0
      }
    };

    res.json(gpaData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/grades/transcript
// @desc    Get student transcript
// @access  Private
router.get('/transcript', auth, async (req, res) => {
  try {
    // For now, return mock transcript data
    const transcript = {
      studentId: req.student.studentId,
      studentName: req.student.getFullName(),
      program: req.student.academicInfo.program,
      department: req.student.academicInfo.department,
      currentSemester: req.student.academicInfo.semester,
      currentYear: req.student.academicInfo.year,
      courses: [
        {
          semester: 'Fall 2023',
          courseCode: 'CS101',
          courseTitle: 'Introduction to Computer Science',
          credits: 3,
          grade: 'B+',
          gpa: 3.3
        },
        {
          semester: 'Fall 2023',
          courseCode: 'MATH201',
          courseTitle: 'Calculus II',
          credits: 4,
          grade: 'B+',
          gpa: 3.3
        },
        {
          semester: 'Fall 2023',
          courseCode: 'ENG101',
          courseTitle: 'English Composition',
          credits: 3,
          grade: 'A-',
          gpa: 3.7
        }
      ],
      totalCredits: 10,
      cumulativeGPA: 3.43
    };

    res.json(transcript);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 