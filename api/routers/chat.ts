import express from "express";
import { ActiveConnections, IncomingMessage } from "../types";
import crypto from "crypto";
import { User } from "../models/User";
import auth from "../middlewares/auth";
import { Message } from "../models/Message";

const chatRouter = express.Router();
const activeConnections: ActiveConnections = {};

export const chatWrapper = () => {
  chatRouter.ws("/", (ws, req) => {
    const id = crypto.randomUUID();
    activeConnections[id] = ws;

    ws.on("message", async (msg) => {
      const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;
      const user = await auth(
        decodedMessage.payload ? decodedMessage.payload.token : "",
      );
      const conn = activeConnections[id];

      switch (decodedMessage.type) {
        case "REGISTER":
          try {
            const newUser = new User({
              username: decodedMessage.payload.username,
              password: decodedMessage.payload.password,
              displayName: decodedMessage.payload.displayName,
            });

            newUser.generateToken();

            await newUser.save();

            return conn.send(
              JSON.stringify({
                type: "NEW_USER",
                payload: newUser,
              }),
            );
          } catch (error) {
            conn.send(
              JSON.stringify({
                type: "NEW_ERROR",
                payload: {
                  error,
                },
              }),
            );
          }

          break;

        case "LOGIN":
          try {
            const registeredUser = await User.findOne({
              username: decodedMessage.payload.username,
            });

            if (!user) {
              return conn.send(
                JSON.stringify({
                  type: "NEW_ERROR",
                  payload: {
                    error: "Wrong password or username!",
                  },
                }),
              );
            }

            const isMatch = await registeredUser?.checkPassword(
              decodedMessage.payload.password,
            );

            if (!isMatch) {
              return conn.send(
                JSON.stringify({
                  type: "NEW_ERROR",
                  payload: {
                    error: "Wrong password or username!",
                  },
                }),
              );
            }

            registeredUser?.generateToken();
            await registeredUser?.save();

            return conn.send(
              JSON.stringify({
                type: "NEW_USER",
                payload: registeredUser,
              }),
            );
          } catch (error) {
            conn.send(
              JSON.stringify({
                type: "NEW_ERROR",
                payload: {
                  error,
                },
              }),
            );
          }

          break;

        case "GET_ALL_MEMBERS":
          const chatMembers = await User.find().select("displayName");
          Object.keys(activeConnections).forEach((connId) => {
            const conn = activeConnections[connId];

            if (user.displayName) {
              conn.send(
                JSON.stringify({
                  type: "ALL_MEMBERS",
                  payload: chatMembers,
                }),
              );
            } else {
              conn.send(
                JSON.stringify({
                  type: "NEW_ERROR",
                  payload: {
                    error: user.error,
                  },
                }),
              );
            }
          });

          break;

        case "PREVIOUS_MESSAGES":
          const previousMessages = await Message.find()
            .populate("user")
            .limit(30);

          Object.keys(activeConnections).forEach((connId) => {
            const conn = activeConnections[connId];

            if (user.displayName) {
              conn.send(
                JSON.stringify({
                  type: "PREVIOUS_MESSAGES",
                  payload: previousMessages,
                }),
              );
            } else {
              conn.send(
                JSON.stringify({
                  type: "NEW_ERROR",
                  payload: {
                    error: user.error,
                  },
                }),
              );
            }
          });

          break;

        case "SEND_MESSAGE":
          if (user.displayName) {
            await Message.create({
              user: user.id,
              message: decodedMessage.payload.message,
            });
          }

          Object.keys(activeConnections).forEach((connId) => {
            const conn = activeConnections[connId];

            if (user.displayName) {
              conn.send(
                JSON.stringify({
                  type: "NEW_MESSAGE",
                  payload: {
                    user,
                    message: decodedMessage.payload.message,
                  },
                }),
              );
            } else {
              conn.send(
                JSON.stringify({
                  type: "NEW_ERROR",
                  payload: {
                    error: user.error,
                  },
                }),
              );
            }
          });

          break;
      }
    });
  });
};

export default chatRouter;
