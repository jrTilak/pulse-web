import mongoose, { Schema } from "mongoose";

/**
 * Represents the file schema.
 * @remarks This schema defines the structure of a file document in the "files" collection.
 */

const fileSchema = new Schema(
  {
    createdBy: { type: String, required: true },
    createdAt: {
      type: String,
      required: true,
      default: new Date().toISOString(),
    },
    content: { type: String, required: true },
    name: { type: String, required: true },
  },
  {
    collection: "files",
  }
);

export default mongoose.model("FilesSchema", fileSchema);
