const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Notification Schema
// ---------------------------------------------------------------------------
// Stores notifications generated from asynchronous events received via
// RabbitMQ. Each notification captures the event type, a human-readable
// message, and the raw event data for reference.
// ---------------------------------------------------------------------------

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['user.registered', 'order.created'],
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
