import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Machine from '../models/Machine.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all machines with filtering and search
router.get('/', [
  query('search').optional().trim(),
  query('category').optional().trim(),
  query('condition').optional().isIn(['Excellent', 'Good', 'Fair']),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('availability').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      search,
      category,
      condition,
      minPrice,
      maxPrice,
      availability,
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (condition && condition !== 'all') {
      filter.condition = condition;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (availability !== undefined) {
      filter.availability = availability === 'true';
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const machines = await Machine.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Machine.countDocuments(filter);

    res.json({
      machines,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single machine
router.get('/:id', async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    
    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }

    res.json(machine);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Machine not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create machine (Admin only)
router.post('/', authenticate, adminOnly, [
  body('machineName').notEmpty().trim(),
  body('type').notEmpty().trim(),
  body('category').notEmpty().trim(),
  body('condition').isIn(['Excellent', 'Good', 'Fair']),
  body('description').notEmpty().trim(),
  body('price').isNumeric({ min: 0 }),
  body('image').isURL(),
  body('rentalPricing.perDay').isNumeric({ min: 0 }),
  body('rentalPricing.perWeek').isNumeric({ min: 0 }),
  body('rentalPricing.perMonth').isNumeric({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const machine = new Machine({
      ...req.body,
      createdBy: req.user._id
    });

    await machine.save();

    res.status(201).json({
      message: 'Machine created successfully',
      machine
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update machine (Admin only)
router.put('/:id', authenticate, adminOnly, [
  body('machineName').optional().notEmpty().trim(),
  body('type').optional().notEmpty().trim(),
  body('category').optional().notEmpty().trim(),
  body('condition').optional().isIn(['Excellent', 'Good', 'Fair']),
  body('description').optional().notEmpty().trim(),
  body('price').optional().isNumeric({ min: 0 }),
  body('image').optional().isURL(),
  body('rentalPricing.perDay').optional().isNumeric({ min: 0 }),
  body('rentalPricing.perWeek').optional().isNumeric({ min: 0 }),
  body('rentalPricing.perMonth').optional().isNumeric({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }

    res.json({
      message: 'Machine updated successfully',
      machine
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Machine not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete machine (Admin only)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const machine = await Machine.findByIdAndDelete(req.params.id);

    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }

    res.json({ message: 'Machine deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Machine not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Machine.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;