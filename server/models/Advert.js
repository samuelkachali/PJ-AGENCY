const mongoose = require('mongoose');

const advertSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 2000 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'MWK', enum: ['MWK', 'USD', 'EUR'] },
  location: { type: String, required: true, trim: true },
  contactPhone: { type: String, required: true, trim: true },
  contactEmail: { type: String, trim: true, lowercase: true },
  images: [{ filename: String, originalName: String, path: String, size: Number }],
  status: { type: String, enum: ['active', 'inactive', 'sold', 'rented'], default: 'active' },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // When set, TTL will auto-delete the document once this time is reached
  deleteAt: { type: Date, default: null }
}, { timestamps: true });

// TTL index: delete document once deleteAt <= now
advertSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Advert', advertSchema);
