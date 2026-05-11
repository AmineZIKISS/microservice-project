const express = require('express');
const router = express.Router();

const {
  getNotifications,
  markAsRead,
} = require('../controllers/notificationController');

// GET /api/notifications — List all notifications (supports ?type= filter)
router.get('/', getNotifications);

// PUT /api/notifications/:id/read — Mark a notification as read
router.put('/:id/read', markAsRead);

module.exports = router;
