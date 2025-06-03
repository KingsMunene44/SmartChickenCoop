const mongoose = require('mongoose');

const obstacleStatusSchema = new mongoose.Schema({
  status: { type: String, enum: ['DETECTED', 'CLEARED'], required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ObstacleStatus', obstacleStatusSchema);