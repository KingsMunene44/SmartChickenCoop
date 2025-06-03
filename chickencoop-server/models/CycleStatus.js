const mongoose = require('mongoose');

const cycleStatusSchema = new mongoose.Schema({
  cycle: { type: String, enum: ['STARTED', 'COMPLETED'], required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CycleStatus', cycleStatusSchema);