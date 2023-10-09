import { Message } from "../models/Message";
import sendError from "./sendError";
import { WebSocket } from "ws";
import { IUserMutation } from "../types";

const getPreviousMessages = async (conn: WebSocket, user: IUserMutation) => {
  const previousMessages = await Message.find()
    .populate("user")
    .sort({ createdAt: -1 })
    .limit(30);

  if (user.displayName) {
    return conn.send(
      JSON.stringify({
        type: "PREVIOUS_MESSAGES",
        payload: previousMessages.reverse(),
      }),
    );
  } else {
    sendError(conn, "NEW_CHAT_ERROR", user.error);
  }
};

export default getPreviousMessages;
