import mongoose from "mongoose";

/**
 * Represents the data schema for a post.
 */
const PostDataSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
  },
  video: {
    type: String,
  },
  audio: {
    type: String,
  },
  imagesLayout: {
    type: String,
  },
});

/**
 * Represents the schema for a comment.
 */
const CommentSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  content: {
    type: String,
    required: true,
  },
});

/**
 * Represents the schema for a Post in the application.
 */
export const PostSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: PostDataSchema,
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  comments: {
    type: [CommentSchema],
    default: [],
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Post", PostSchema);
