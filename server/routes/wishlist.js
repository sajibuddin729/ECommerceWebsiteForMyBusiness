const express = require('express');
const Wishlist = require('../models/Wishlist');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.userId })
      .populate('productId')
      .sort({ createdAt: -1 });

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add to wishlist
router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body;

    const existingItem = await Wishlist.findOne({
      userId: req.userId,
      productId,
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Already in wishlist' });
    }

    const item = new Wishlist({
      userId: req.userId,
      productId,
    });

    await item.save();

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Remove from wishlist
router.delete('/:productId', auth, async (req, res) => {
  try {
    const item = await Wishlist.findOneAndDelete({
      userId: req.userId,
      productId: req.params.productId,
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', auth, async (req, res) => {
  try {
    const item = await Wishlist.findOne({
      userId: req.userId,
      productId: req.params.productId,
    });

    res.json({ inWishlist: !!item });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
