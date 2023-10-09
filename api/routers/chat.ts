import express from "express";
import { ActiveConnections, IncomingMessage } from "../types";
import crypto from "crypto";
import auth from "../controllers/auth";
import register from "../controllers/register";
import login from "../controllers/login";
import logout from "../controllers/logout";
import getAllMembers from "../controllers/getAllMembers";
import getPreviousMessages from "../controllers/getPreviousMessages";
import sendMessage from "../controllers/sendMessage";
import deleteMessage from "../controllers/deleteMessage";

const chatRouter = express.Router();
const activeConnections: ActiveConnections = {};

export const chatWrapper = () => {
  chatRouter.ws("/", (ws, req) => {
    const id = crypto.randomUUID();
    activeConnections[id] = ws;

    ws.on("message", async (msg) => {
      const conn = activeConnections[id];
      const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;
      const user = await auth(
        decodedMessage.payload ? decodedMessage.payload.token : "",
      );

      switch (decodedMessage.type) {
        case "REGISTER":
          await register(conn, decodedMessage);
          break;

        case "LOGIN":
          await login(conn, decodedMessage, user);
          break;

        case "LOGOUT":
          await logout(conn, user);
          break;

        case "GET_ALL_MEMBERS":
          await getAllMembers(conn, user);
          break;

        case "GET_PREVIOUS_MESSAGES":
          await getPreviousMessages(conn, user);
          break;

        case "SEND_MESSAGE":
          await sendMessage(user, decodedMessage, activeConnections);
          break;

        case "DELETE_MESSAGE":
          await deleteMessage(conn, user, decodedMessage);
          break;
      }
    });
  });
};

export default chatRouter;
