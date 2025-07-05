import express from 'express';
import Request from '../models/Request.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create a new job request (customer to laborer)
router.post('/', auth, async (req, res) => {
  try {
    const {
      laborerId,
      jobType,
      description,
      location,
      estimatedHours,
      budget,
      urgency,
      scheduledDate
    } = req.body;

    const customerId = req.user.userId;
    const userType = req.user.userType;

    if (userType !== 'customer') {
      return res.status(403).json({ message: 'Only customers can create job requests' });
    }

    // Validate required fields
    if (!laborerId || !jobType || !description || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if laborer exists and is available
    const laborer = await User.findById(laborerId);
    if (!laborer || laborer.userType !== 'laborer') {
      return res.status(404).json({ message: 'Laborer not found' });
    }

    if (!laborer.isAvailable) {
      return res.status(400).json({ message: 'Laborer is not available' });
    }

    // Create the request
    const requestData = {
      customerId,
      laborerId,
      jobType,
      description,
      location,
      estimatedHours,
      budget,
      urgency: urgency || 'medium',
      scheduledDate
    };

    const request = new Request(requestData);
    const savedRequest = await request.save();

    res.status(201).json({
      message: 'Job request created successfully',
      request: savedRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get requests for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;
    const { status } = req.query;

    let requests;
    if (userType === 'customer') {
      requests = await Request.findByCustomerId(userId);
    } else {
      requests = await Request.findByLaborerId(userId);
    }

    // Filter by status if provided
    if (status) {
      requests = requests.filter(req => req.status === status);
    }

    // Populate user details
    const populatedRequests = await Promise.all(
      requests.map(async (req) => {
        const customer = await User.findById(req.customerId);
        const laborer = await User.findById(req.laborerId);
        
        return {
          ...req,
          customer: {
            id: customer._id,
            name: customer.name,
            phone: customer.phone
          },
          laborer: {
            id: laborer._id,
            name: laborer.name,
            phone: laborer.phone,
            skills: laborer.skills,
            hourlyRate: laborer.hourlyRate,
            rating: laborer.rating
          }
        };
      })
    );

    res.json({
      message: 'Requests retrieved successfully',
      requests: populatedRequests,
      count: populatedRequests.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific request
router.get('/:requestId', auth, async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;
    const userType = req.user.userType;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user has access to this request
    if (userType === 'customer' && request.customerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (userType === 'laborer' && request.laborerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Populate user details
    const customer = await User.findById(request.customerId);
    const laborer = await User.findById(request.laborerId);

    const populatedRequest = {
      ...request,
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address
      },
      laborer: {
        id: laborer._id,
        name: laborer.name,
        phone: laborer.phone,
        skills: laborer.skills,
        hourlyRate: laborer.hourlyRate,
        rating: laborer.rating
      }
    };

    res.json({
      message: 'Request retrieved successfully',
      request: populatedRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update request status (accept/decline/complete)
router.put('/:requestId/status', auth, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;
    const userType = req.user.userType;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Validate status transitions
    const validStatuses = ['pending', 'accepted', 'declined', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check permissions
    if (userType === 'laborer' && request.laborerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (userType === 'customer' && request.customerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update status
    const updatedRequest = await Request.updateStatus(requestId, status);

    res.json({
      message: 'Request status updated successfully',
      request: updatedRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get request statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;

    const stats = await Request.getRequestStats(userId, userType);

    res.json({
      message: 'Statistics retrieved successfully',
      stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;