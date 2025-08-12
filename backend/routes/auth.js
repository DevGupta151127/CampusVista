const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

// Login route
router.post('/login', async (req, res) => {
    const { rollNumber, password } = req.body;
    try {
        const student = await Student.findOne({ rollNumber });
        if (!student) return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        // Do not send password back
        const { password: _, ...studentData } = student.toObject();
        res.json({ student: studentData });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new student (for IT/admin)
router.post('/add', async (req, res) => {
    const { rollNumber, password, name, department, year } = req.body;
    try {
        const existing = await Student.findOne({ rollNumber });
        if (existing) return res.status(400).json({ message: 'Student already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = new Student({ rollNumber, password: hashedPassword, name, department, year });
        await student.save();
        res.json({ message: 'Student added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
