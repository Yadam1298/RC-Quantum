// createSuperAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Employee = require('./models/Employee');

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const plainPassword = 'B@nti1298'; // ← Change this if you want

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Update or Create Super Admin
    const superAdmin = await Employee.findOneAndUpdate(
      { empID: 'SUPER001' },
      {
        empID: 'SUPER001',
        cardUID: 'SUPER12345',
        name: 'Naveen Kumar',
        phone: '9347772102',
        email: 'y.n.v.n.kumr@gmail.com',
        password: hashedPassword,
        designation: 'Super Admin',
        role: 'superadmin',
      },
      { upsert: true, new: true },
    );

    console.log('✅ Super Admin created/updated successfully!');
    console.log('Email:', superAdmin.email);
    console.log('empID:', superAdmin.empID);
    console.log('Password:', plainPassword);
    console.log('Role: superadmin');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createSuperAdmin();
