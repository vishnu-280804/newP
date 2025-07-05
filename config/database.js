import mongoose from 'mongoose';

const uri = 'mongodb+srv://admin:hello123@labour.nlwthfv.mongodb.net/?retryWrites=true&w=majority&appName=labour';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

export default mongoose;