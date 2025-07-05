import express from 'express';
import User from '../models/User.js';
import Request from '../models/Request.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get nearby laborers (for customers)
router.get('/nearby', auth, async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    const userType = req.user.userType;

    if (userType !== 'customer') {
      return res.status(403).json({ message: 'Only customers can search for laborers' });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Location coordinates are required' });
    }

    const nearbyLaborers = await User.findNearbyLaborers(
      parseFloat(latitude), 
      parseFloat(longitude), 
      parseFloat(radius)
    );

    res.json({
      message: 'Nearby laborers found',
      laborers: nearbyLaborers,
      count: nearbyLaborers.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get laborer profile
router.get('/:laborerId', auth, async (req, res) => {
  try {
    const { laborerId } = req.params;
    const laborer = await User.findById(laborerId);

    if (!laborer || laborer.userType !== 'laborer') {
      return res.status(404).json({ message: 'Laborer not found' });
    }

    // Get laborer's request stats
    const stats = await Request.getRequestStats(laborerId, 'laborer');

    res.json({
      laborer: {
        id: laborer._id,
        name: laborer.name,
        phone: laborer.phone,
        address: laborer.address,
        location: laborer.location,
        skills: laborer.skills,
        hourlyRate: laborer.hourlyRate,
        experience: laborer.experience,
        rating: laborer.rating,
        totalJobs: laborer.totalJobs,
        isAvailable: laborer.isAvailable,
        verified: laborer.verified
      },
      stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all available laborers (for admin or general listing)
router.get('/', async (req, res) => {
  try {
    const laborers = await User.find('users', { userType: 'laborer', isAvailable: true });
    
    const formattedLaborers = laborers.map(laborer => ({
      id: laborer._id,
      name: laborer.name,
      skills: laborer.skills,
      hourlyRate: laborer.hourlyRate,
      rating: laborer.rating,
      totalJobs: laborer.totalJobs,
      location: laborer.location
    }));

    res.json({
      message: 'Available laborers found',
      laborers: formattedLaborers,
      count: formattedLaborers.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update laborer profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { skills, hourlyRate, experience } = req.body;
    const userId = req.user.userId;
    const userType = req.user.userType;

    if (userType !== 'laborer') {
      return res.status(403).json({ message: 'Only laborers can update their profile' });
    }

    const updateData = {};
    if (skills) updateData.skills = skills;
    if (hourlyRate) updateData.hourlyRate = hourlyRate;
    if (experience) updateData.experience = experience;

    const updatedUser = await User.update('users', { _id: userId }, updateData);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router; 