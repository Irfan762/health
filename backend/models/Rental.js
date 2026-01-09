import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true
  },
  machineName: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  villageName: {
    type: String,
    required: true
  },
  rentalDuration: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'returned', 'cancelled'],
    default: 'ongoing'
  },
  adminStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'cash', 'bank_transfer'],
    default: null
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    paymentAmount: Number,
    paymentGateway: String,
    upiId: String,
    cardLast4: String,
    notes: String
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
rentalSchema.index({ userId: 1, adminStatus: 1 });
rentalSchema.index({ machineId: 1, status: 1 });
rentalSchema.index({ adminStatus: 1, createdAt: -1 });
rentalSchema.index({ paymentStatus: 1, adminStatus: 1 });

export default mongoose.model('Rental', rentalSchema);