import mongoose from 'mongoose';

export const isPlaceholderMongoUri = (uri) =>
  !uri || uri.includes('username:password') || uri.includes('cluster.mongodb.net');

/**
 * Connect to MongoDB.
 * Requires a real MongoDB connection string. Docker Compose supplies a local
 * MongoDB URI; other environments should provide an Atlas URI.
 * @returns {Promise<typeof mongoose>}
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (isPlaceholderMongoUri(uri)) {
    throw new Error('MONGODB_URI is missing or still contains example values. Configure a real MongoDB URI.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
    });

    console.log(
      `[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`
    );
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    throw error;
  }
};

export default connectDB;
