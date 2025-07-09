import mongoose from 'mongoose';

const uri = 'mongodb+srv://admin:hello123@labour.nlwthfv.mongodb.net/?retryWrites=true&w=majority&appName=labour';

// Connection options for better reliability (using modern options)
const options = {
  serverSelectionTimeoutMS: 15000, // 15 seconds
  socketTimeoutMS: 45000, // 45 seconds
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
};

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(uri, options);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    
    // Provide helpful error messages
    if (err.message.includes('whitelist')) {
      console.error('\n🔧 To fix this issue:');
      console.error('1. Go to MongoDB Atlas Dashboard');
      console.error('2. Navigate to Network Access');
      console.error('3. Add your current IP address');
      console.error('4. Or use "Allow Access from Anywhere" for development');
    }
    
    // Retry connection after 5 seconds
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Start connection
connectWithRetry();

export default mongoose;