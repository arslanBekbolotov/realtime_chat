import express from "express";
import { ActiveConnections, IMessage, IncomingMessage } from "../types";
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
      const conn = activeConnections[id];
      const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;
      const user = await auth(
        decodedMessage.payload ? decodedMessage.payload.token : "",
      );

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
          if (user.displayName && conn) {
            return conn.send(
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

          break;

        case "PREVIOUS_MESSAGES":
          const previousMessages = await Message.find()
            .populate("user")
            .sort({ createdAt: -1 })
            .limit(30);

          if (user.displayName && conn) {
            return conn.send(
              JSON.stringify({
                type: "PREVIOUS_MESSAGES",
                payload: previousMessages.reverse(),
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

          break;

        case "SEND_MESSAGE":
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
