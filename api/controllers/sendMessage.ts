import {
  ActiveConnections,
  IMessage,
  IncomingMessage,
  IUserMutation,
} from "../types";
import { Message } from "../models/Message";
import sendError from "./sendError";

const sendMessage = async (
  user: IUserMutation,
  decodedMessage: IncomingMessage,
  activeConnections: ActiveConnections,
) => {
  let message: IMessage;

  if (user.displayName) {
    message = await Message.create({
      user: user._id,
      message: decodedMessage.payload.message,
    });
  }

  Object.keys(activeConnections).forEach((connId) => {
    const conn = activeConnections[connId];

    if (user.displayName) {
      return conn.send(
        JSON.stringify({
          type: "NEW_MESSAGE",
          payload: { _id: message._id, message: message.message, user },
        }),
      );
    } else {
      sendError(conn, "NEW_CHAT_ERROR", user.error);
    }
  });
};
export default sendMessage;
