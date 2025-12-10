// server/models/SearchHistory.js
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  term: String,           // What user typed (e.g. "iPhone 15")
  searchDate: { type: Date, default: Date.now },
  topResult: {
    title: String,
    price: String,
    image: String,
    source: String
  }
});

module.exports = mongoose.model('SearchHistory', historySchema);