import { User } from "../models/User";
import sendError from "./sendError";
import { ActiveUser } from "../models/ActiveUsers";
import { WebSocket } from "ws";
import { IncomingMessage, IUserMutation } from "../types";

const login = async (
  conn: WebSocket,
  decodedMessage: IncomingMessage,
  user: IUserMutation,
) => {
  try {
    const registeredUser = await User.findOne({
      username: decodedMessage.payload.username,
    });

    if (!user) {
      return sendError(conn, "NEW_LOGIN_ERROR", "Wrong password or username!");
    }

    const isMatch = await registeredUser?.checkPassword(
      decodedMessage.payload.password,
    );

    if (!isMatch) {
      return sendError(conn, "NEW_LOGIN_ERROR", "Wrong password or username!");
    }

    registeredUser?.generateToken();
    await registeredUser?.save();
    await ActiveUser.create({
      displayName: registeredUser?.displayName,
      username: registeredUser?.username,
    });

    return conn.send(
      JSON.stringify({
        type: "NEW_USER",
        payload: registeredUser,
      }),
    );
  } catch (error) {
    sendError(conn, "NEW_LOGIN_ERROR", "Wrong password or username!");
  }
};

export default login;
