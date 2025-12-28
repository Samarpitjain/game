import mongoose from 'mongoose';
import { createOptimizedIndexes } from './indexes';

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/casinobit';

let isConnected = false;

// Production-optimized MongoDB configuration
const mongoOptions = {
  maxPoolSize: 50, // Maximum connections in pool
  minPoolSize: 5,  // Minimum connections in pool
  maxIdleTimeMS: 30000, // Close connections after 30s idle
  serverSelectionTimeoutMS: 5000, // How long to try selecting server
  socketTimeoutMS: 45000, // How long socket stays open
  retryWrites: true, // Retry failed writes
  writeConcern: {
    w: 'majority',
    j: true, // Wait for journal
    wtimeout: 5000
  },
  readPreference: 'primary',
  readConcern: { level: 'majority' }
};

export const connectDB = async () => {
  if (isConnected) return;

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_URI, mongoOptions);
    
    // Create optimized indexes on first connection
    await createOptimizedIndexes();
    
    isConnected = true;
    console.log('✅ MongoDB connected with optimized configuration');
    console.log(`📊 Pool size: ${mongoOptions.maxPoolSize} connections`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
};

export * from './schemas';
export * from './indexes';
