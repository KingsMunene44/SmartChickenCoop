const mongoose = require('mongoose');

const tempDataSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TempData', tempDataSchema);