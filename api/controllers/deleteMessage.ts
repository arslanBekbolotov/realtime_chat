import { Message } from "../models/Message";
import sendError from "./sendError";
import { WebSocket } from "ws";
import { IncomingMessage, IUserMutation } from "../types";

const deleteMessage = async (
  conn: WebSocket,
  user: IUserMutation,
  decodedMessage: IncomingMessage,
) => {
  try {
    if (user.role === "moderator") {
      const message = await Message.findOneAndDelete({
        _id: decodedMessage.payload.messageID,
      });

      if (message) {
        return conn.send(
          JSON.stringify({
            type: "MESSAGE_DELETED",
            payload: {
              message: "success",
            },
          }),
        );
      }

      return sendError(conn, "NEW_CHAT_ERROR", "Message not found");
    }

    return sendError(
      conn,
      "NEW_CHAT_ERROR",
      "You have not permission to remove",
    );
  } catch (error) {
    sendError(conn, "NEW_CHAT_ERROR", user.error);
  }
};

export default deleteMessage;
