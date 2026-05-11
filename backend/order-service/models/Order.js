const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Order Schema
// ---------------------------------------------------------------------------
// Each order belongs to a user and contains an array of items.
// Item details (name, price) are fetched SYNCHRONOUSLY from product-service
// via Axios at order creation time, so we store a snapshot of the data.
// ---------------------------------------------------------------------------

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, 'Le productId est obligatoire'],
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La quantité doit être au moins 1'],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "L'identifiant utilisateur est obligatoire"],
    },
    userEmail: {
      type: String,
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'La commande doit contenir au moins un article',
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Order', orderSchema);
