const mongoose = require('mongoose');

const fieldDataSchema = new mongoose.Schema({
  fieldLength: { type: Number, required: true },
  fieldWidth: { type: Number, required: true },
  motorSpeed: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FieldData', fieldDataSchema);