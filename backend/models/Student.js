import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  department: { type: String },
  year: { type: String },
  feeStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'partial'],
    default: 'unpaid'
  },
  paymentHistory: [
    {
      amount: Number,
      date: Date,
      paymentId: String,
      status: String
    }
  ]
});

export default mongoose.model('Student', studentSchema);
