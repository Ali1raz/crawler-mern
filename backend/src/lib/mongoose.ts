import mongoose from "mongoose";
import "dotenv/config"

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async (): Promise<void> => {
  if (cached.conn) {
    return;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        maxPoolSize: 10,
      })
      .then ((mongoose) => {
        console.log("MongoDB connected");

        mongoose.connection.on("disconnected", () => {
          console.warn("MongoDB disconnected");
        });

        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection error:", e);
    process.exit(1);
  }
};

export default connectDB;
