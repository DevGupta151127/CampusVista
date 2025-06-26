const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const Course = require('../models/Course');

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

// @route   GET /api/assignments
// @desc    Get assignments for enrolled courses
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id)
      .populate({
        path: 'enrolledCourses.courseId',
        select: 'courseCode title assignments'
      });

    const assignments = [];
    
    student.enrolledCourses.forEach(enrollment => {
      if (enrollment.courseId && enrollment.courseId.assignments) {
        enrollment.courseId.assignments.forEach(assignment => {
          assignments.push({
            ...assignment.toObject(),
            courseCode: enrollment.courseId.courseCode,
            courseTitle: enrollment.courseId.title,
            courseId: enrollment.courseId._id
          });
        });
      }
    });

    // Sort by due date
    assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    res.json(assignments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/assignments/:id
// @desc    Get specific assignment
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const assignmentId = req.params.id;
    
    const student = await Student.findById(req.student._id)
      .populate({
        path: 'enrolledCourses.courseId',
        select: 'courseCode title assignments'
      });

    let assignment = null;
    let courseInfo = null;

    // Find assignment in enrolled courses
    for (const enrollment of student.enrolledCourses) {
      if (enrollment.courseId && enrollment.courseId.assignments) {
        const foundAssignment = enrollment.courseId.assignments.id(assignmentId);
        if (foundAssignment) {
          assignment = foundAssignment;
          courseInfo = {
            courseCode: enrollment.courseId.courseCode,
            courseTitle: enrollment.courseId.title,
            courseId: enrollment.courseId._id
          };
          break;
        }
      }
    }

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({
      ...assignment.toObject(),
      ...courseInfo
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/assignments/:id/submit
// @desc    Submit assignment
// @access  Private
router.post('/:id/submit', auth, [
  body('submission').notEmpty().withMessage('Submission content is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const assignmentId = req.params.id;
    const { submission } = req.body;

    // Check if assignment exists and student is enrolled
    const student = await Student.findById(req.student._id)
      .populate('enrolledCourses.courseId');

    let assignment = null;
    let course = null;

    for (const enrollment of student.enrolledCourses) {
      if (enrollment.courseId && enrollment.courseId.assignments) {
        const foundAssignment = enrollment.courseId.assignments.id(assignmentId);
        if (foundAssignment) {
          assignment = foundAssignment;
          course = enrollment.courseId;
          break;
        }
      }
    }

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if due date has passed
    if (new Date() > new Date(assignment.dueDate)) {
      return res.status(400).json({ message: 'Assignment due date has passed' });
    }

    // Create or update submission
    const submissionData = {
      studentId: req.student._id,
      assignmentId: assignmentId,
      submission: submission,
      submittedAt: new Date(),
      status: 'submitted'
    };

    // For now, we'll store submission in a simple way
    // In a real application, you might want a separate Submission model
    res.json({
      message: 'Assignment submitted successfully',
      submission: submissionData
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/assignments/:id/submission
// @desc    Get assignment submission
// @access  Private
router.get('/:id/submission', auth, async (req, res) => {
  try {
    const assignmentId = req.params.id;

    // In a real application, you would fetch from a Submission model
    // For now, return a mock response
    res.json({
      message: 'Submission retrieved successfully',
      submission: {
        studentId: req.student._id,
        assignmentId: assignmentId,
        submission: 'Sample submission content',
        submittedAt: new Date(),
        status: 'submitted'
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 