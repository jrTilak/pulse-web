import mongoose, { Schema } from "mongoose";

/**
 * Represents the schema for a chat message.
 **/
const chatSchema = new Schema({
  sentBy: { type: String },
  sentAt: { type: String },
  sentTo: { type: String },
  isSeen: { type: Boolean },
  seenAt: { type: String, default: null },
  repliedTo: { type: String },
  isDeleted: { type: Boolean, default: false },
  data: {
    type: {
      content: { type: String, required: true },
      _type: { type: String, required: true },
      caption: { type: String },
    },
    required: true,
  },
});

const chatsSchema = new Schema({
  participants: { type: [String], default: [] },
  chats: { type: [chatSchema], default: [] },
});

export default mongoose.model("Chats", chatsSchema);
