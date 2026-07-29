const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EmployeeSchema = new mongoose.Schema(
  {
    empID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    cardUID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    password: { type: String, required: true },
    designation: { type: String, required: true, trim: true },

    role: {
      type: String,
      enum: ['superadmin', 'admin', 'employee'],
      default: 'employee',
    },

    profileImage: {
      type: String,
      default:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQosM3prtK4UTYRUANfeEHS9hRQFfql4Qj-lEDyWnNkBw&s=10',
    },

    // NEW: Tracks the single active session token for single-device login
    activeSessionToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

EmployeeSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

EmployeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Employee', EmployeeSchema);