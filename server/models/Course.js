const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  instructor: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: String,
  },
  schedule: {
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    }],
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
  },
  capacity: {
    type: Number,
    required: true,
  },
  enrolledStudents: {
    type: Number,
    default: 0,
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  syllabus: [{
    week: Number,
    topic: String,
    description: String,
    readings: [String],
  }],
  assignments: [{
    title: String,
    description: String,
    dueDate: Date,
    totalPoints: Number,
    weight: Number,
  }],
  gradingPolicy: {
    assignments: {
      type: Number,
      default: 30,
    },
    midterm: {
      type: Number,
      default: 30,
    },
    final: {
      type: Number,
      default: 40,
    },
  },
  semester: {
    type: String,
    required: true,
    enum: ['fall', 'spring', 'summer'],
  },
  year: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  courseImage: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Virtual for checking if course is full
courseSchema.virtual('isFull').get(function() {
  return this.enrolledStudents >= this.capacity;
});

// Virtual for available seats
courseSchema.virtual('availableSeats').get(function() {
  return this.capacity - this.enrolledStudents;
});

module.exports = mongoose.model('Course', courseSchema); 