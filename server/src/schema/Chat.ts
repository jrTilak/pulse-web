import mongoose, { Schema } from "mongoose";

/**
 * Represents the schema for a chat message.
 **/
const chatSchema = new Schema({
  sentBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  sentAt: { type: String },
  sentTo: { type: mongoose.Schema.Types.ObjectId, required: true },
  isSeen: { type: Boolean, default: false},
  seenAt: { type: String, default: Date.now() },
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
  participants: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  chats: { type: [chatSchema], default: [] },
});

export default mongoose.model("Chats", chatsSchema);
