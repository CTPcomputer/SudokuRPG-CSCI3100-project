const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recordTimeSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  totalTime: {
    type: Number, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RecordTime = mongoose.model('RecordTime', recordTimeSchema);

module.exports = RecordTime;