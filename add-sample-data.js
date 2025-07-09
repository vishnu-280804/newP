// Script to add sample laborers to the database
// Run this with: node add-sample-data.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Sample laborers data
const sampleLaborers = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    password: 'password123',
    phone: '+91 98765 43210',
    address: 'Hyderabad, Telangana',
    userType: 'laborer',
    location: {
      latitude: 17.416192,
      longitude: 78.462976
    },
    isAvailable: true,
    skills: ['Plumbing', 'Electrical', 'Carpentry'],
    hourlyRate: 500,
    experience: '5 years',
    rating: 4.8,
    totalJobs: 45,
    verified: true
  },
  {
    name: 'Amit Singh',
    email: 'amit@example.com',
    password: 'password123',
    phone: '+91 98765 43211',
    address: 'Hyderabad, Telangana',
    userType: 'laborer',
    location: {
      latitude: 17.415000,
      longitude: 78.464000
    },
    isAvailable: true,
    skills: ['Painting', 'Cleaning', 'Gardening'],
    hourlyRate: 400,
    experience: '3 years',
    rating: 4.6,
    totalJobs: 32,
    verified: true
  },
  {
    name: 'Suresh Reddy',
    email: 'suresh@example.com',
    password: 'password123',
    phone: '+91 98765 43212',
    address: 'Hyderabad, Telangana',
    userType: 'laborer',
    location: {
      latitude: 17.417000,
      longitude: 78.461000
    },
    isAvailable: true,
    skills: ['Masonry', 'Tiling', 'Construction'],
    hourlyRate: 600,
    experience: '8 years',
    rating: 4.9,
    totalJobs: 67,
    verified: true
  },
  {
    name: 'Krishna Prasad',
    email: 'krishna@example.com',
    password: 'password123',
    phone: '+91 98765 43213',
    address: 'Hyderabad, Telangana',
    userType: 'laborer',
    location: {
      latitude: 17.414000,
      longitude: 78.465000
    },
    isAvailable: true,
    skills: ['AC Repair', 'Appliance Repair', 'Electronics'],
    hourlyRate: 700,
    experience: '6 years',
    rating: 4.7,
    totalJobs: 53,
    verified: true
  },
  {
    name: 'Venkatesh Rao',
    email: 'venkatesh@example.com',
    password: 'password123',
    phone: '+91 98765 43214',
    address: 'Hyderabad, Telangana',
    userType: 'laborer',
    location: {
      latitude: 17.418000,
      longitude: 78.460000
    },
    isAvailable: true,
    skills: ['Welding', 'Metal Work', 'Fabrication'],
    hourlyRate: 550,
    experience: '4 years',
    rating: 4.5,
    totalJobs: 28,
    verified: true
  }
];

// Connect to MongoDB
const uri = 'mongodb+srv://admin:hello123@labour.nlwthfv.mongodb.net/?retryWrites=true&w=majority&appName=labour';

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema (same as in your models/User.js)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  userType: { type: String, enum: ['customer', 'laborer'], required: true },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  isAvailable: { type: Boolean, default: true },
  skills: { type: [String], default: [] },
  hourlyRate: { type: Number },
  experience: { type: String },
  rating: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', UserSchema);

// Add sample data
const addSampleData = async () => {
  try {
    console.log('🔄 Adding sample laborers...');
    
    for (const laborerData of sampleLaborers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: laborerData.email });
      
      if (existingUser) {
        console.log(`⚠️ User ${laborerData.name} already exists, skipping...`);
        continue;
      }
      
      // Create new user
      const user = new User(laborerData);
      await user.save();
      console.log(`✅ Added laborer: ${laborerData.name}`);
    }
    
    console.log('🎉 Sample data added successfully!');
    
    // Show summary
    const totalLaborers = await User.countDocuments({ userType: 'laborer' });
    console.log(`📊 Total laborers in database: ${totalLaborers}`);
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
const main = async () => {
  await connectDB();
  await addSampleData();
};

main().catch(console.error); 