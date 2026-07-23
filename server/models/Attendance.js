const mongoose = require('mongoose');

const PunchSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['in', 'out'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    method: {
      type: String,
      enum: ['RFID', 'App', 'Auto'],
      default: 'RFID',
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
      _id: false,
    },
    autoCheckout: {
      type: Boolean,
      default: false,
    },
    reason: {
      type: String,
      default: '',
    },
  },
  { _id: false },
);

const AttendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    punches: [PunchSchema],
    lastLocationUpdate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);