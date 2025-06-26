import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (studentData) => api.post('/auth/register', studentData),
  getCurrentUser: () => api.get('/auth/me'),
};

// Student API
export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  getCourses: () => api.get('/students/courses'),
  enrollCourse: (courseId) => api.post('/students/enroll', { courseId }),
  dropCourse: (courseId) => api.delete(`/students/courses/${courseId}`),
};

// Course API
export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  getCourse: (id) => api.get(`/courses/${id}`),
  getAvailableCourses: () => api.get('/courses/available'),
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: (data) => api.post('/payments/create-payment-intent', data),
  confirmPayment: (data) => api.post('/payments/confirm-payment', data),
  getPaymentHistory: () => api.get('/payments/history'),
  getOutstandingPayments: () => api.get('/payments/outstanding'),
};

// Assignment API
export const assignmentAPI = {
  getAssignments: () => api.get('/assignments'),
  submitAssignment: (assignmentId, data) => 
    api.post(`/assignments/${assignmentId}/submit`, data),
  getSubmission: (assignmentId) => 
    api.get(`/assignments/${assignmentId}/submission`),
};

// Grade API
export const gradeAPI = {
  getGrades: () => api.get('/grades'),
  getCourseGrades: (courseId) => api.get(`/grades/course/${courseId}`),
};

// Attendance API
export const attendanceAPI = {
  getAttendance: () => api.get('/attendance'),
  markAttendance: (courseId, status) => 
    api.post('/attendance/mark', { courseId, status }),
};

export default api; 