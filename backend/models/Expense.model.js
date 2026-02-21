import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  category: {
    type: String,
    enum: ['fuel', 'maintenance', 'toll', 'parking', 'other'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  receipt: {
    type: String
  }
}, {
  timestamps: true
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
