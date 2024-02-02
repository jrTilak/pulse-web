import mongoose from "mongoose";

/**
 * Represents the schema for a user story.
 */
const UserStorySchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  views: {
    type: [mongoose.Schema.Types.ObjectId],
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
      isUnderlined: Boolean,
      fontSize: Number,
      textColor: String,
      backgroundColor: String,
    },
  },
});

export default mongoose.model("UserStory", UserStorySchema);
