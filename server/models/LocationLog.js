const mongoose = require('mongoose');

const LocationLogSchema = new mongoose.Schema(
  {
    attendance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attendance',
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true },
);

LocationLogSchema.index({ attendance: 1, timestamp: 1 });

module.exports = mongoose.model('LocationLog', LocationLogSchema);