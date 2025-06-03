const mongoose = require('mongoose');

const fanStatusSchema = new mongoose.Schema({
  status: { type: String, enum: ['ON', 'OFF'], required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FanStatus', fanStatusSchema);