const mongoose = require('mongoose');

const feederStatusSchema = new mongoose.Schema({
  status: { type: String, enum: ['OPEN', 'CLOSED'], required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FeederStatus', feederStatusSchema);