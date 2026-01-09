import express from 'express';
import { body, validationResult } from 'express-validator';
import RentalRequest from '../models/RentalRequest.js';
import Machine from '../models/Machine.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Create rental request
router.post('/request', authenticate, [
  body('machineId').notEmpty().trim(),
  body('machineName').notEmpty().trim(),
  body('userName').notEmpty().trim(),
  body('phone').notEmpty().trim(),
  body('villageName').notEmpty().trim(),
  body('rentalDuration').notEmpty().trim(),
  body('totalPrice').isNumeric({ min: 0 })
], async (req, res) => {
  try {
    console.log("Rental request received:", req.body);
    console.log("User:", req.user?.fullName, req.user?._id);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { machineId, machineName, userName, phone, villageName, rentalDuration, totalPrice } = req.body;

    // Create rental request
    const rentalRequest = new RentalRequest({
      machineId,
      machineName,
      userId: req.user._id,
      userName,
      phone,
      villageName,
      rentalDuration,
      totalPrice
    });

    console.log("Saving rental request...");
    await rentalRequest.save();
    console.log("Rental request saved successfully:", rentalRequest._id);

    res.status(201).json({
      message: 'Rental request submitted successfully',
      rentalRequest
    });
  } catch (error) {
    console.error("Error in rental request route:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's rental requests
router.get('/my-requests', authenticate, async (req, res) => {
  try {
    const rentalRequests = await RentalRequest.find({ userId: req.user._id })
      .populate('machineId', 'machineName image')
      .sort({ createdAt: -1 });

    res.json(rentalRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all rental requests (Admin only)
router.get('/requests', authenticate, adminOnly, async (req, res) => {
  try {
    const { status, adminStatus } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (adminStatus) filter.adminStatus = adminStatus;

    const rentalRequests = await RentalRequest.find(filter)
      .populate('userId', 'fullName email')
      .populate('machineId', 'machineName image')
      .sort({ createdAt: -1 });

    res.json(rentalRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update rental request status (Admin only)
router.put('/requests/:id/status', authenticate, adminOnly, [
  body('adminStatus').isIn(['approved', 'rejected']),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { adminStatus, notes } = req.body;

    const updateData = { 
      adminStatus, 
      notes,
      ...(adminStatus === 'approved' && { 
        approvedBy: req.user._id,
        approvedAt: new Date(),
        paymentStatus: 'pending' // Set payment status to pending when approved
      })
    };

    const rentalRequest = await RentalRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!rentalRequest) {
      return res.status(404).json({ message: 'Rental request not found' });
    }

    res.json({
      message: `Rental request ${adminStatus} successfully`,
      rentalRequest
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Rental request not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark rental as returned
router.put('/:id/return', authenticate, async (req, res) => {
  try {
    const rentalRequest = await RentalRequest.findById(req.params.id);

    if (!rentalRequest) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    // Check if user owns this rental or is admin
    if (rentalRequest.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    rentalRequest.status = 'returned';
    rentalRequest.endDate = new Date();
    await rentalRequest.save();

    res.json({
      message: 'Rental marked as returned',
      rentalRequest
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Rental not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Process payment for approved rental
router.post('/:id/payment', authenticate, [
  body('paymentMethod').isIn(['upi', 'card', 'cash', 'bank_transfer']),
  body('paymentAmount').isNumeric({ min: 0 }),
  body('transactionId').optional().trim(),
  body('upiId').optional().trim(),
  body('cardLast4').optional().trim(),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentMethod, paymentAmount, transactionId, upiId, cardLast4, notes } = req.body;

    const rentalRequest = await RentalRequest.findById(req.params.id);

    if (!rentalRequest) {
      return res.status(404).json({ message: 'Rental request not found' });
    }

    // Check if user owns this rental
    if (rentalRequest.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if rental is approved
    if (rentalRequest.adminStatus !== 'approved') {
      return res.status(400).json({ message: 'Rental request must be approved before payment' });
    }

    // Check if already paid
    if (rentalRequest.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // Update payment details
    rentalRequest.paymentStatus = 'paid';
    rentalRequest.paymentMethod = paymentMethod;
    rentalRequest.paymentDetails = {
      transactionId,
      paymentDate: new Date(),
      paymentAmount,
      paymentGateway: paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Card' : 'Manual',
      upiId,
      cardLast4,
      notes
    };

    // Start the rental
    rentalRequest.status = 'ongoing';
    rentalRequest.startDate = new Date();

    await rentalRequest.save();

    res.json({
      message: 'Payment processed successfully',
      rentalRequest
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Rental request not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get rental statistics (Admin only)
router.get('/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const stats = await RentalRequest.aggregate([
      {
        $group: {
          _id: '$adminStatus',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    const totalRequests = await RentalRequest.countDocuments();
    const activeRentals = await RentalRequest.countDocuments({ status: 'ongoing' });

    res.json({
      stats,
      totalRequests,
      activeRentals
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;