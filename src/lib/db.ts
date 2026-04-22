import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("Please define the MONGODB_URI environment variable inside .env.local. Database operations will be mocked until configured.");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (!MONGODB_URI) {
    return null;
  }
  if (cached.conn) {
    return cached.conn;
  }
  try {
    if (!cached.promise) {
      const opts = { bufferCommands: false, serverSelectionTimeoutMS: 5000 };
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("MongoDB Connection Failed (Likely Local DNS Issue):", error);
    cached.promise = null;
    return null; // Gracefully fallback to local data if DB connection fails
  }
}

export default connectToDatabase;
