import { connect, disconnect } from "mongoose";

export const connectDB = () => {
  console.log("Connecting to MongoDB...");
  return new Promise(async (resolve, reject) => {
    try {
      await connect(process.env.MONGODB_CONNECTION_STRING || "");
      resolve("MongoDB connected 😍");
    } catch (err) {
      reject("MongoDB connection failed 😭");
      console.log(err);
    }
  });
};
export const disconnectDB = async () => {
  try {
    await disconnect();
    console.log("MongoDB disconnected 😒");
  } catch (err) {
    console.log("MongoDB disconnection failed 😭");
    console.log(err);
  }
};
