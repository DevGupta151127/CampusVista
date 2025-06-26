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

// @route   GET /api/students/profile
// @desc    Get student profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id)
      .select('-password')
      .populate('enrolledCourses.courseId');
    
    res.json(student);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/students/profile
// @desc    Update student profile
// @access  Private
router.put('/profile', auth, [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, phone, address, emergencyContact } = req.body;

    const updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;
    if (emergencyContact) updateFields.emergencyContact = emergencyContact;

    const student = await Student.findByIdAndUpdate(
      req.student._id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json(student);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/students/courses
// @desc    Get enrolled courses
// @access  Private
router.get('/courses', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id)
      .populate('enrolledCourses.courseId');
    
    res.json(student.enrolledCourses);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/students/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/enroll', auth, [
  body('courseId').notEmpty().withMessage('Course ID is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if course is full
    if (course.enrolledStudents >= course.capacity) {
      return res.status(400).json({ message: 'Course is full' });
    }

    // Check if already enrolled
    const isEnrolled = req.student.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (isEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add course to student's enrolled courses
    req.student.enrolledCourses.push({
      courseId: courseId,
      enrollmentDate: new Date(),
      status: 'active'
    });

    // Update course enrollment count
    course.enrolledStudents += 1;
    await course.save();

    await req.student.save();

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/students/courses/:id
// @desc    Drop a course
// @access  Private
router.delete('/courses/:id', auth, async (req, res) => {
  try {
    const courseId = req.params.id;

    // Find the enrollment
    const enrollmentIndex = req.student.enrolledCourses.findIndex(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (enrollmentIndex === -1) {
      return res.status(404).json({ message: 'Course not found in enrollments' });
    }

    // Remove from enrollments
    req.student.enrolledCourses.splice(enrollmentIndex, 1);

    // Update course enrollment count
    const course = await Course.findById(courseId);
    if (course) {
      course.enrolledStudents = Math.max(0, course.enrolledStudents - 1);
      await course.save();
    }

    await req.student.save();

    res.json({ message: 'Successfully dropped course' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 