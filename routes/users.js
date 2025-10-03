
const express = require('express');
const User = require('../models/user');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // استبعاد كلمات المرور
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.role === 'admin' || req.user.id === parseInt(req.params.id)) {
      res.json(user);
    } else {
      
      res.status(403).json({ message: 'Not authorized to access this user data (403 Forbidden)' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    if (req.user.role === 'admin' || req.user.id === parseInt(req.params.id)) {
      
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password; 
      }
      
      
      if (req.user.role === 'admin' && req.body.role) {
        user.role = req.body.role;
      }
      
      const updatedUser = await user.save();
      
      res.json({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        message: 'Profile updated successfully' 
      });

    } else {
      res.status(403).json({ message: 'Not authorized to update this user (403 Forbidden)' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating user' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.user.role === 'admin' || req.user.id === parseInt(req.params.id)) {
      
      if (req.user.role === 'admin' && req.user.id === user.id) {
         
         return res.status(401).json({ message: 'Admin users cannot delete themselves!' }); 
      }
      
      await user.destroy();
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(403).json({ message: 'Not authorized to delete this user (403 Forbidden)' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

module.exports = router;