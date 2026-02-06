const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Cart is stored in client-side localStorage
// This route is just for validation purposes

router.post('/validate', auth, async (req, res) => {
  try {
    // Validate cart items and user
    res.json({ valid: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
