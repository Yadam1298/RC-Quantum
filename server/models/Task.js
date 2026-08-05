const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    customerVehicleNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    customerAddress: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'not_recovered', 'not_available'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    // Optional location where the vehicle was recovered (or attempted)
    recoveryLocation: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
      _id: false,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
TaskSchema.index({ employee: 1, status: 1 });
TaskSchema.index({ assignedAt: -1 });

module.exports = mongoose.model('Task', TaskSchema);