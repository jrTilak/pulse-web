import mongoose from "mongoose";

/**
 * Represents the schema for the private information of a user.
 * @remarks The data in this schema is private and is not shared with other users.
 */
const UserPrivateInfo = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    savedPosts: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    connectedUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
  },
  {
    collection: "UserPrivateInfo",
  }
);

export default mongoose.model("UserPrivateInfo", UserPrivateInfo);
