import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// Register user (customer or laborer)
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      address, 
      userType, 
      location,
      skills,
      hourlyRate,
      experience 
    } = req.body;

    // Validate user type
    if (!['customer', 'laborer'].includes(userType)) {
      return res.status(400).json({ message: 'User type must be either customer or laborer' });
    }

    // Validate location for both user types
    if (!location || !location.latitude || !location.longitude) {
      return res.status(400).json({ message: 'Location is required' });
    }

    // Validate laborer-specific fields
    if (userType === 'laborer') {
      if (!skills || skills.length === 0) {
        return res.status(400).json({ message: 'Skills are required for laborers' });
      }
      if (!hourlyRate || hourlyRate <= 0) {
        return res.status(400).json({ message: 'Valid hourly rate is required for laborers' });
      }
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const userData = {
      name,
      email,
      password,
      phone,
      address,
      userType,
      location,
      skills: userType === 'laborer' ? skills : [],
      hourlyRate: userType === 'laborer' ? hourlyRate : null,
      experience: userType === 'laborer' ? experience : null
    };

    const user = new User(userData);
    const savedUser = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: savedUser._id, userType: savedUser.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        address: savedUser.address,
        userType: savedUser.userType,
        location: savedUser.location,
        skills: savedUser.skills,
        hourlyRate: savedUser.hourlyRate,
        experience: savedUser.experience,
        rating: savedUser.rating,
        totalJobs: savedUser.totalJobs
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        userType: user.userType,
        location: user.location,
        skills: user.skills,
        hourlyRate: user.hourlyRate,
        experience: user.experience,
        rating: user.rating,
        totalJobs: user.totalJobs,
        isAvailable: user.isAvailable
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user location
router.put('/location', async (req, res) => {
  try {
    const { location } = req.body;
    const userId = req.user.userId; // From auth middleware

    if (!location || !location.latitude || !location.longitude) {
      return res.status(400).json({ message: 'Valid location is required' });
    }

    const updatedUser = await User.updateLocation(userId, location);
    res.json({ message: 'Location updated successfully', location });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update laborer availability
router.put('/availability', async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const userId = req.user.userId;
    const userType = req.user.userType;

    if (userType !== 'laborer') {
      return res.status(403).json({ message: 'Only laborers can update availability' });
    }

    const updatedUser = await User.updateAvailability(userId, isAvailable);
    res.json({ message: 'Availability updated successfully', isAvailable });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;