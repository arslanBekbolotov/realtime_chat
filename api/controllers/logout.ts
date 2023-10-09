import { ActiveUser } from "../models/ActiveUsers";
import sendError from "./sendError";
import { WebSocket } from "ws";
import { IUserMutation } from "../types";

const logout = async (conn: WebSocket, user: IUserMutation) => {
  if (user.username) {
    await ActiveUser.findOneAndDelete({ username: user.username });

    return conn.send(
      JSON.stringify({
        type: "USER_DELETED",
        payload: { message: "success" },
      }),
    );
  }

  sendError(conn, "USER_NOT_DELETED", "Unsuccessful");
};

export default logout;
