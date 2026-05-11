const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du produit est obligatoire'],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Le prix est obligatoire'],
      min: [0, 'Le prix doit être positif'],
    },
    category: {
      type: String,
      required: [true, 'La catégorie est obligatoire'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "L'image est obligatoire"],
    },
    description: {
      type: String,
      default: '',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ---------------------------------------------------------------------------
// Pre-save hook — keep `title` in sync with `name` for frontend compatibility
// Cart.jsx uses `item.title` while Products.jsx uses `product.name`
// ---------------------------------------------------------------------------
productSchema.pre('save', function (next) {
  if (!this.title || this.isModified('name')) {
    this.title = this.name;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
