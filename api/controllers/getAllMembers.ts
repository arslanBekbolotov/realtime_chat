import { ActiveUser } from "../models/ActiveUsers";
import { WebSocket } from "ws";
import sendError from "./sendError";
import { IUserMutation } from "../types";

const getAllMembers = async (conn: WebSocket, user: IUserMutation) => {
  const chatMembers = await ActiveUser.find().select("displayName");
  if (user.displayName) {
    return conn.send(
      JSON.stringify({
        type: "ALL_MEMBERS",
        payload: chatMembers,
      }),
    );
  } else {
    sendError(conn, "NEW_CHAT_ERROR", user.error);
  }
};

export default getAllMembers;
