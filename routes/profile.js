// const express = require('express');
// const auth = require('../middleware/auth');
// const User = require('../models/user');

// const router = express.Router();

// router.get('/me', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ user });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

import express from 'express';
import auth from '../middleware/auth.js'; // Extension required
import User from '../models/user.js';      // Extension required

const router = express.Router();

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    // Find user by ID and exclude the password field
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;