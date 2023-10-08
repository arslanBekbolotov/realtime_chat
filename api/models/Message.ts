import mongoose, { Schema } from "mongoose";
import { User } from "./User";
import { IMessage } from "../types";

const MessageSchema = new Schema<IMessage>({
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Schema.Types.Date,
    required: true,
    default: () => new Date(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async (value: Schema.Types.ObjectId) => User.findById(value),
      message: "User does not exist!",
    },
  },
});

export const Message = mongoose.model("Message", MessageSchema);
