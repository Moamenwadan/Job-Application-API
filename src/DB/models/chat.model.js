import { hash } from "../../utils/hashing/hash.js";
import { Schema, Types, model } from "mongoose";

const ChatSchema = new Schema(
  {
    senderId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: {
      type: [
        { message: String, senderId: { type: Types.ObjectId, ref: "User" } },
      ],
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Chat = model("Chat", ChatSchema);

export default Chat;
