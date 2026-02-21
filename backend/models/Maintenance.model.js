import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  type: {
    type: String,
    enum: ['routine', 'repair', 'inspection', 'emergency'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  mileage: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed'],
    default: 'scheduled'
  },
  serviceProvider: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance;
