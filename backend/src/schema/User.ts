import mongoose from "mongoose";

/**
 * Represents the schema for a user in the application.
 * @remarks This schema contains the data of the user that is publicly available to other users
 */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 40,
  },
  username: {
    type: String,
    required: true,
    min: 3,
    max: 40,
    unique: true,
  },
  profileImg: {
    type: String,
    default: "",
  },
  coverImg: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bio: {
    type: String,
    default: "",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  followers: {
    type: Number,
    default: 0,
  },
  following: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  socialLinks: {
    type: [
      {
        label: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
          unique: true,
        },
      },
    ],
    default: [],
  },
  stories: {
    type: [String],
    default: [],
  },
  pinnedPosts: {
    type: [String],
    default: [],
  },
  posts: {
    type: [String],
    default: [],
  },
});

export default mongoose.model("User", UserSchema);
