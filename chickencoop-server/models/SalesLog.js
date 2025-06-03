const mongoose = require('mongoose');

const salesLogSchema = new mongoose.Schema({
  birdsSold: { type: Number, required: true },
  eggsSold: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SalesLog', salesLogSchema);