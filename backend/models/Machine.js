import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
  machineName: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  condition: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  repairHistory: [{
    type: String
  }],
  sparePartsReplaced: [{
    type: String
  }],
  warrantyInfo: {
    type: String,
    default: ''
  },
  rentalPricing: {
    perDay: {
      type: Number,
      required: true,
      min: 0
    },
    perWeek: {
      type: Number,
      required: true,
      min: 0
    },
    perMonth: {
      type: Number,
      required: true,
      min: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for search functionality
machineSchema.index({
  machineName: 'text',
  type: 'text',
  description: 'text',
  category: 'text'
});

export default mongoose.model('Machine', machineSchema);