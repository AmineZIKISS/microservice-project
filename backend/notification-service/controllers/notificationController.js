const Notification = require('../models/Notification');

// ---------------------------------------------------------------------------
// @route   GET /api/notifications
// @desc    Get all notifications (most recent first)
// @access  Public (in production, this would be admin-only)
// ---------------------------------------------------------------------------
const getNotifications = async (req, res) => {
  try {
    const { type, limit = 50 } = req.query;

    // Optional filter by event type
    const filter = {};
    if (type) filter.type = type;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error('Get notifications error:', error.message);
    res
      .status(500)
      .json({ message: 'Erreur lors du chargement des notifications' });
  }
};

// ---------------------------------------------------------------------------
// @route   PUT /api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Public
// ---------------------------------------------------------------------------
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification introuvable' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Mark as read error:', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getNotifications, markAsRead };
