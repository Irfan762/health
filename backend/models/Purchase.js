import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  machineId: {
    type: String,
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
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Purchase', purchaseSchema);