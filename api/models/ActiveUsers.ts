import mongoose, { HydratedDocument, Schema } from "mongoose";
import { IActiveUser } from "../types";

const ActiveUserSchema = new Schema<IActiveUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (
        this: HydratedDocument<IActiveUser>,
        value: string,
      ) {
        if (!this.isModified("username")) return true;
        const activeUser = await ActiveUser.findOne({ username: value });
        if (activeUser) return false;
      },
      message: "This activeUser is already registered",
    },
  },
  displayName: {
    type: String,
    required: true,
  },
});

export const ActiveUser = mongoose.model("ActiveUser", ActiveUserSchema);
