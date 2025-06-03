const mongoose = require('mongoose');

const segmentStatusSchema = new mongoose.Schema({
  segmentInfo: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SegmentStatus', segmentStatusSchema);