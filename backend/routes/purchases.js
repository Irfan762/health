import express from 'express';
import { body, validationResult } from 'express-validator';
import Purchase from '../models/Purchase.js';
import Machine from '../models/Machine.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Create purchase
router.post('/', authenticate, [
  body('machineId').isMongoId(),
  body('shippingAddress.street').notEmpty().trim(),
  body('shippingAddress.city').notEmpty().trim(),
  body('shippingAddress.state').notEmpty().trim(),
  body('shippingAddress.zipCode').notEmpty().trim(),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { machineId, shippingAddress, notes } = req.body;

    // Check if machine exists and is available
    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }

    if (!machine.availability) {
      return res.status(400).json({ message: 'Machine is not available for purchase' });
    }

    // Create purchase
    const purchase = new Purchase({
      machineId,
      machineName: machine.machineName,
      userId: req.user._id,
      price: machine.price,
      shippingAddress,
      notes
    });

    await purchase.save();

    // Mark machine as unavailable
    machine.availability = false;
    await machine.save();

    res.status(201).json({
      message: 'Purchase order created successfully',
      purchase
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's purchases
router.get('/my-purchases', authenticate, async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.user._id })
      .populate('machineId', 'machineName image')
      .sort({ createdAt: -1 });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all purchases (Admin only)
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const { status, paymentStatus } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const purchases = await Purchase.find(filter)
      .populate('userId', 'fullName email phone')
      .populate('machineId', 'machineName image')
      .sort({ createdAt: -1 });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update purchase status (Admin only)
router.put('/:id/status', authenticate, adminOnly, [
  body('status').optional().isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
  body('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded']),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = {};
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.paymentStatus) updateData.paymentStatus = req.body.paymentStatus;
    if (req.body.notes) updateData.notes = req.body.notes;

    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    // If purchase is cancelled, make machine available again
    if (req.body.status === 'cancelled') {
      await Machine.findByIdAndUpdate(purchase.machineId, { availability: true });
    }

    res.json({
      message: 'Purchase updated successfully',
      purchase
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get purchase statistics (Admin only)
router.get('/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const stats = await Purchase.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$price' }
        }
      }
    ]);

    const totalPurchases = await Purchase.countDocuments();
    const totalRevenue = await Purchase.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    res.json({
      stats,
      totalPurchases,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;