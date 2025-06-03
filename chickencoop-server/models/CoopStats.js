const mongoose = require('mongoose');

const coopStatsSchema = new mongoose.Schema({
  birdCount: { type: Number, required: true },
  eggCount: { type: Number, required: true },
  ailingBirdCount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CoopStats', coopStatsSchema);