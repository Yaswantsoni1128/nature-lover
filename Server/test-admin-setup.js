import mongoose from 'mongoose';
import { User } from './src/models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const testAdminSetup = async () => {
  try {
    console.log('🔍 Testing Admin Setup...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin user exists
    const adminEmail = 'admin@gmail.com';
    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      console.log('❌ Admin user NOT found!');
      console.log('\n📝 To create admin user:');
      console.log('1. Register at http://localhost:5173/register with:');
      console.log('   - Email: admin@gmail.com');
      console.log('   - Password: 12345678');
      console.log('   - Name: Admin');
      console.log('   - Phone: 1234567890');
      console.log('\n2. Then run this command in MongoDB:');
      console.log('   db.users.updateOne({ email: "admin@gmail.com" }, { $set: { role: "admin" } })');
    } else {
      console.log('✅ Admin user found!');
      console.log('\n📋 Admin Details:');
      console.log('   Email:', adminUser.email);
      console.log('   Name:', adminUser.name);
      console.log('   Role:', adminUser.role || 'user (NOT ADMIN!)');
      console.log('   Phone:', adminUser.phone);
      console.log('   ID:', adminUser._id);

      if (adminUser.role === 'admin') {
        console.log('\n✅ User has admin role - READY TO GO!');
        console.log('\n🔗 Login at: http://localhost:5173/admin/login');
        console.log('   Email: admin@gmail.com');
        console.log('   Password: 12345678');
      } else {
        console.log('\n⚠️  User exists but role is NOT admin!');
        console.log('\n📝 Run this command to fix:');
        console.log('   db.users.updateOne({ email: "admin@gmail.com" }, { $set: { role: "admin" } })');
      }
    }

    // Test virtual field
    if (adminUser) {
      const userObj = adminUser.toJSON();
      console.log('\n🔍 Testing fullName virtual field:');
      console.log('   name:', userObj.name);
      console.log('   fullName:', userObj.fullName);
      if (userObj.fullName) {
        console.log('   ✅ fullName virtual field working!');
      } else {
        console.log('   ❌ fullName virtual field NOT working!');
      }
    }

    console.log('\n✅ Test Complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testAdminSetup();
