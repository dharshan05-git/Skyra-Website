#!/usr/bin/env node
import './src/config/env.js';
import { connectDatabase, disconnectDatabase } from './src/config/database.js';
import User from './src/models/User.js';
import Admin from './src/models/Admin.js';

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node create_admin.js <email>');
    process.exit(1);
  }
  await connectDatabase();
  try {
    const lower = String(email).toLowerCase().trim();
    let user = await User.findOne({ email: lower });
    if (!user) {
      user = await User.create({ firebaseUid: `seed-admin-${lower}`, email: lower, name: 'SKYRA Administrator', active: true });
      console.log('Created user', user._id.toString());
      console.log('The Firebase UID will be linked after the first Google sign-in with this email.');
    } else {
      if (user.active === undefined) user.active = true;
      await user.save();
      console.log('Found existing user', user._id.toString());
    }
    const admin = await Admin.findOneAndUpdate({ user: user._id }, { role: 'superadmin', active: true, createdBy: user._id }, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log('Admin record created/updated:', admin._id.toString());
  } catch (err) {
    console.error('Failed to create admin:', err);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

main();
