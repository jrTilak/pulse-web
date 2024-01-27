import mongoose from "mongoose";

/**
 * Represents the schema for a user story.
 */
const UserStorySchema = new mongoose.Schema({
  createdBy: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["text", "image", "video"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: [String],
    default: [],
  },
  views: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  storyConfig: {
    type: {
      isBold: Boolean,
      isItalic: Boolean,
      isUnderline: Boolean,
      isUnderlined: Boolean,
      fontSize: Number,
      textColor: String,
      backgroundColor: String,
    },
  },
});

export default mongoose.model("UserStory", UserStorySchema);
