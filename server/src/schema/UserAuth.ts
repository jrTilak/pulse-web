import mongoose from "mongoose";

/**
 * Represents the schema for user authentication.
 * @remarks The data in this schema is used for authentication purposes.
 */
const UserAuthSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    method: {
      type: ["guest", "email", "google"],
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
      min: 8,
      max: 20,
    },
  },
  {
    collection: "UserAuth",
  }
);

export default mongoose.model("UserAuth", UserAuthSchema);
