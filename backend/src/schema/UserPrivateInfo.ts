import mongoose from "mongoose";

/**
 * Represents the schema for the private information of a user.
 * @remarks The data in this schema is private and is not shared with other users.
 */
const UserPrivateInfo = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    following: {
      type: [String],
      default: [],
    },
    followers: {
      type: [String],
      default: [],
    },
    savedPosts: {
      type: [String],
      default: [],
    },
    connectedUsers: {
      type: [String],
      default: [],
    },
  },
  {
    collection: "UserPrivateInfo",
  }
);

export default mongoose.model("UserPrivateInfo", UserPrivateInfo);
