// server/models/PriceAlert.js
const mongoose = require('mongoose');

const PriceAlertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productTitle: { type: String, required: true },
  productLink: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  currentPrice: { type: Number },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PriceAlert', PriceAlertSchema);
