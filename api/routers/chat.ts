import express from "express";
import {ActiveConnections, IncomingMessage} from "../types";
import crypto from "crypto";
import {User} from "../models/User";

const chatRouter = express.Router();
const activeConnections: ActiveConnections = {};


export const chatWrapper = () => {
    chatRouter.ws('/', (ws, req) => {
        const id = crypto.randomUUID();
        activeConnections[id] = ws;

        ws.on("message", async (msg) => {
            const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;
            switch (decodedMessage.type) {
                case "GET_ALL_MEMBERS":
                    const users = await User.find().select('displayName');
                    Object.keys(activeConnections).forEach((connId) => {
                        const conn = activeConnections[connId];
                        conn.send(
                            JSON.stringify({
                                type: "ALL_MEMBERS",
                                payload: users,
                            }),
                        );
                    });

                    break;
            }
        });
    });
};

export default chatRouter;