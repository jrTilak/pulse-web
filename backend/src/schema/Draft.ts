import mongoose from "mongoose";

/**
 * Represents the schema for the DraftData collection.
 */
const DraftDataSchema = new mongoose.Schema({
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
 * Represents the schema for a draft.
 */
export const DraftSchema = new mongoose.Schema({
  createdBy: {
    type: String,
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
    type: DraftDataSchema,
    required: true,
  },
});

export default mongoose.model("Draft", DraftSchema);
