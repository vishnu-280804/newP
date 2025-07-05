import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

// Compare password method
UserSchema.statics.comparePassword = async function (candidate, hash) {
  return bcrypt.compare(candidate, hash);
};

// Find by email
UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

// Update location
UserSchema.statics.updateLocation = function (userId, location) {
  return this.findByIdAndUpdate(userId, { location }, { new: true });
};

// Update availability
UserSchema.statics.updateAvailability = function (userId, isAvailable) {
  return this.findByIdAndUpdate(userId, { isAvailable }, { new: true });
};

// Update rating
UserSchema.statics.updateRating = async function (userId, rating) {
  const user = await this.findById(userId);
  if (!user) return null;
  const newRating = ((user.rating * user.totalJobs) + rating) / (user.totalJobs + 1);
  user.rating = newRating;
  user.totalJobs = user.totalJobs + 1;
  await user.save();
  return user;
};

// Find nearby laborers
UserSchema.statics.findNearbyLaborers = async function (latitude, longitude, radius = 10) {
  const laborers = await this.find({ userType: 'laborer', isAvailable: true });
  // Calculate distance and filter by radius
  const nearbyLaborers = laborers
    .map(laborer => {
      const distance = calculateDistance(
        latitude, longitude,
        laborer.location.latitude, laborer.location.longitude
      );
      return { ...laborer.toObject(), distance };
    })
    .filter(laborer => laborer.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
  return nearbyLaborers;
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const User = mongoose.model('User', UserSchema);
export default User;