const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
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

// @route   GET /api/attendance
// @desc    Get attendance records for the student
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { courseId, startDate, endDate } = req.query;
    
    let query = { studentId: req.student._id };
    
    if (courseId) {
      query.courseId = courseId;
    }
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // For now, return mock attendance data
    // In a real application, you would query from a separate Attendance model
    const mockAttendance = [
      {
        courseId: 'course1',
        courseCode: 'CS101',
        courseTitle: 'Introduction to Computer Science',
        date: new Date('2024-01-15'),
        status: 'present',
        time: '09:00 AM'
      },
      {
        courseId: 'course1',
        courseCode: 'CS101',
        courseTitle: 'Introduction to Computer Science',
        date: new Date('2024-01-17'),
        status: 'present',
        time: '09:00 AM'
      },
      {
        courseId: 'course1',
        courseCode: 'CS101',
        courseTitle: 'Introduction to Computer Science',
        date: new Date('2024-01-19'),
        status: 'absent',
        time: '09:00 AM'
      },
      {
        courseId: 'course2',
        courseCode: 'MATH201',
        courseTitle: 'Calculus II',
        date: new Date('2024-01-16'),
        status: 'present',
        time: '11:00 AM'
      },
      {
        courseId: 'course2',
        courseCode: 'MATH201',
        courseTitle: 'Calculus II',
        date: new Date('2024-01-18'),
        status: 'late',
        time: '11:15 AM'
      }
    ];

    res.json(mockAttendance);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/attendance/mark
// @desc    Mark attendance for a course
// @access  Private
router.post('/mark', auth, [
  body('courseId').notEmpty().withMessage('Course ID is required'),
  body('status').isIn(['present', 'absent', 'late']).withMessage('Invalid status'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId, status, date } = req.body;

    // Check if student is enrolled in this course
    const isEnrolled = req.student.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(404).json({ message: 'Course not found in enrollments' });
    }

    // Check if attendance already marked for this date
    const existingAttendance = req.student.attendance.find(
      record => record.courseId.toString() === courseId && 
               record.date.toDateString() === new Date(date || Date.now()).toDateString()
    );

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }

    // Add attendance record
    const attendanceRecord = {
      courseId: courseId,
      date: date ? new Date(date) : new Date(),
      status: status
    };

    req.student.attendance.push(attendanceRecord);
    await req.student.save();

    res.json({
      message: 'Attendance marked successfully',
      attendance: attendanceRecord
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/summary
// @desc    Get attendance summary for the student
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const { courseId } = req.query;

    // For now, return mock summary data
    // In a real application, you would calculate from actual attendance records
    const mockSummary = {
      totalClasses: 45,
      present: 38,
      absent: 5,
      late: 2,
      attendancePercentage: 84.4,
      courseBreakdown: [
        {
          courseId: 'course1',
          courseCode: 'CS101',
          courseTitle: 'Introduction to Computer Science',
          totalClasses: 25,
          present: 22,
          absent: 2,
          late: 1,
          percentage: 88.0
        },
        {
          courseId: 'course2',
          courseCode: 'MATH201',
          courseTitle: 'Calculus II',
          totalClasses: 20,
          present: 16,
          absent: 3,
          late: 1,
          percentage: 80.0
        }
      ]
    };

    res.json(mockSummary);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/course/:id
// @desc    Get attendance for a specific course
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

    // For now, return mock course attendance data
    const mockCourseAttendance = {
      courseId: courseId,
      courseCode: 'CS101',
      courseTitle: 'Introduction to Computer Science',
      totalClasses: 25,
      present: 22,
      absent: 2,
      late: 1,
      percentage: 88.0,
      records: [
        {
          date: new Date('2024-01-15'),
          status: 'present',
          time: '09:00 AM'
        },
        {
          date: new Date('2024-01-17'),
          status: 'present',
          time: '09:00 AM'
        },
        {
          date: new Date('2024-01-19'),
          status: 'absent',
          time: '09:00 AM'
        }
      ]
    };

    res.json(mockCourseAttendance);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 