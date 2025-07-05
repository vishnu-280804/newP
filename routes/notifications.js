import express from 'express';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.findByUser(req.user._id);
    // Sort by creation date, newest first
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.userId !== req.user._id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedNotification = await Notification.markAsRead(req.params.id);
    res.json({
      message: 'Notification marked as read',
      notification: updatedNotification
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.markAllAsReadForUser(req.user._id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.userId !== req.user._id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Notification.deleteById(req.params.id);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create notification (for testing)
router.post('/', auth, async (req, res) => {
  try {
    const { title, message, type, relatedId } = req.body;
    
    const notification = new Notification({
      userId: req.user._id,
      title,
      message,
      type,
      relatedId
    });

    const savedNotification = await notification.save();
    res.status(201).json({
      message: 'Notification created successfully',
      notification: savedNotification
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;