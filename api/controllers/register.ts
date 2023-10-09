import { User } from "../models/User";
import { ActiveUser } from "../models/ActiveUsers";
import sendError from "./sendError";
import { WebSocket } from "ws";
import { IncomingMessage } from "../types";

const register = async (conn: WebSocket, decodedMessage: IncomingMessage) => {
  try {
    const newUser = new User({
      username: decodedMessage.payload.username,
      password: decodedMessage.payload.password,
      displayName: decodedMessage.payload.displayName,
    });

    newUser.generateToken();

    await newUser.save();
    await ActiveUser.create({
      displayName: decodedMessage.payload.displayName,
      username: decodedMessage.payload.username,
    });

    return conn.send(
      JSON.stringify({
        type: "NEW_USER",
        payload: newUser,
      }),
    );
  } catch (error) {
    sendError(conn, "NEW_REGISTER_ERROR", error);
  }
};

export default register;
