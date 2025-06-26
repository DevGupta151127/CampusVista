const mongoose = require('mongoose');
const Student = require('../models/Student');
const Course = require('../models/Course');
require('dotenv').config();

// Sample courses data
const sampleCourses = [
  {
    courseCode: 'CS101',
    title: 'Introduction to Computer Science',
    description: 'Fundamental concepts of computer science and programming',
    credits: 3,
    department: 'Computer Science',
    instructor: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@campusvista.edu',
      phone: '+1-555-0101'
    },
    schedule: {
      days: ['monday', 'wednesday', 'friday'],
      startTime: '09:00',
      endTime: '10:15',
      room: 'Science Hall 101'
    },
    capacity: 30,
    enrolledStudents: 25,
    semester: 'spring',
    year: 2024,
    assignments: [
      {
        title: 'Programming Assignment 1',
        description: 'Basic programming concepts',
        dueDate: new Date('2024-02-15'),
        totalPoints: 100,
        weight: 10
      },
      {
        title: 'Midterm Exam',
        description: 'Midterm examination',
        dueDate: new Date('2024-03-01'),
        totalPoints: 100,
        weight: 30
      }
    ]
  },
  {
    courseCode: 'MATH201',
    title: 'Calculus II',
    description: 'Advanced calculus concepts and applications',
    credits: 4,
    department: 'Mathematics',
    instructor: {
      name: 'Dr. Michael Chen',
      email: 'michael.chen@campusvista.edu',
      phone: '+1-555-0102'
    },
    schedule: {
      days: ['tuesday', 'thursday'],
      startTime: '11:00',
      endTime: '12:30',
      room: 'Math Building 205'
    },
    capacity: 25,
    enrolledStudents: 20,
    semester: 'spring',
    year: 2024,
    assignments: [
      {
        title: 'Integration Problems',
        description: 'Practice integration techniques',
        dueDate: new Date('2024-02-20'),
        totalPoints: 100,
        weight: 15
      }
    ]
  },
  {
    courseCode: 'ENG101',
    title: 'English Composition',
    description: 'College-level writing and communication skills',
    credits: 3,
    department: 'English',
    instructor: {
      name: 'Prof. Emily Davis',
      email: 'emily.davis@campusvista.edu',
      phone: '+1-555-0103'
    },
    schedule: {
      days: ['monday', 'wednesday'],
      startTime: '14:00',
      endTime: '15:15',
      room: 'Humanities Hall 301'
    },
    capacity: 35,
    enrolledStudents: 28,
    semester: 'spring',
    year: 2024,
    assignments: [
      {
        title: 'Essay 1',
        description: 'Argumentative essay',
        dueDate: new Date('2024-02-25'),
        totalPoints: 100,
        weight: 20
      }
    ]
  },
  {
    courseCode: 'PHYS101',
    title: 'Physics I',
    description: 'Introduction to classical mechanics',
    credits: 4,
    department: 'Physics',
    instructor: {
      name: 'Dr. Robert Wilson',
      email: 'robert.wilson@campusvista.edu',
      phone: '+1-555-0104'
    },
    schedule: {
      days: ['tuesday', 'thursday', 'friday'],
      startTime: '13:00',
      endTime: '14:15',
      room: 'Physics Lab 102'
    },
    capacity: 30,
    enrolledStudents: 22,
    semester: 'spring',
    year: 2024
  },
  {
    courseCode: 'HIST101',
    title: 'World History',
    description: 'Survey of world civilizations',
    credits: 3,
    department: 'History',
    instructor: {
      name: 'Dr. Lisa Thompson',
      email: 'lisa.thompson@campusvista.edu',
      phone: '+1-555-0105'
    },
    schedule: {
      days: ['monday', 'wednesday', 'friday'],
      startTime: '10:00',
      endTime: '11:15',
      room: 'History Building 150'
    },
    capacity: 40,
    enrolledStudents: 35,
    semester: 'spring',
    year: 2024
  }
];

// Sample student data
const sampleStudents = [
  {
    studentId: 'STU001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@student.campusvista.edu',
    password: 'password123',
    dateOfBirth: new Date('2000-05-15'),
    gender: 'male',
    phone: '+1-555-0001',
    address: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Mother',
      phone: '+1-555-0002',
      email: 'jane.doe@email.com'
    },
    academicInfo: {
      department: 'Computer Science',
      program: 'Bachelor of Science',
      year: 2,
      semester: 3,
      gpa: 3.45
    }
  },
  {
    studentId: 'STU002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@student.campusvista.edu',
    password: 'password123',
    dateOfBirth: new Date('2001-08-22'),
    gender: 'female',
    phone: '+1-555-0003',
    address: {
      street: '456 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702',
      country: 'USA'
    },
    emergencyContact: {
      name: 'John Smith',
      relationship: 'Father',
      phone: '+1-555-0004',
      email: 'john.smith@email.com'
    },
    academicInfo: {
      department: 'Mathematics',
      program: 'Bachelor of Science',
      year: 1,
      semester: 2,
      gpa: 3.78
    }
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campusvista');
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed courses
const seedCourses = async () => {
  try {
    // Clear existing courses
    await Course.deleteMany({});
    
    // Insert sample courses
    const courses = await Course.insertMany(sampleCourses);
    console.log(`${courses.length} courses seeded successfully`);
    
    return courses;
  } catch (error) {
    console.error('Error seeding courses:', error);
    throw error;
  }
};

// Seed students
const seedStudents = async (courses) => {
  try {
    // Clear existing students
    await Student.deleteMany({});
    
    // Add course enrollments to students
    const studentsWithEnrollments = sampleStudents.map((student, index) => {
      const enrollments = [];
      
      // Enroll first student in first 3 courses
      if (index === 0) {
        enrollments.push(
          { courseId: courses[0]._id, enrollmentDate: new Date(), status: 'active' },
          { courseId: courses[1]._id, enrollmentDate: new Date(), status: 'active' },
          { courseId: courses[2]._id, enrollmentDate: new Date(), status: 'active' }
        );
      }
      // Enroll second student in last 2 courses
      else if (index === 1) {
        enrollments.push(
          { courseId: courses[3]._id, enrollmentDate: new Date(), status: 'active' },
          { courseId: courses[4]._id, enrollmentDate: new Date(), status: 'active' }
        );
      }
      
      return {
        ...student,
        enrolledCourses: enrollments
      };
    });
    
    // Insert students
    const students = await Student.insertMany(studentsWithEnrollments);
    console.log(`${students.length} students seeded successfully`);
    
    return students;
  } catch (error) {
    console.error('Error seeding students:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    // Seed courses first
    const courses = await seedCourses();
    
    // Seed students with course enrollments
    await seedStudents(courses);
    
    console.log('Database seeding completed successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedCourses, seedStudents }; 