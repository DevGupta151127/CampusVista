import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  name: '',
  email: '',
  courses: [],
  grades: [],
  attendance: [],
  payments: [],
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudentData: (state, action) => {
      return { ...state, ...action.payload };
    },
    addCourse: (state, action) => {
      state.courses.push(action.payload);
    },
    updateGrade: (state, action) => {
      const { courseId, grade } = action.payload;
      const courseIndex = state.grades.findIndex(g => g.courseId === courseId);
      if (courseIndex !== -1) {
        state.grades[courseIndex].grade = grade;
      } else {
        state.grades.push({ courseId, grade });
      }
    },
    addPayment: (state, action) => {
      state.payments.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setStudentData,
  addCourse,
  updateGrade,
  addPayment,
  setLoading,
  setError,
} = studentSlice.actions;

export default studentSlice.reducer; 