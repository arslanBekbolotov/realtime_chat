import { Schema } from "mongoose";
import { WebSocket } from "ws";

export interface IUser {
  username: string;
  token: string;
  password: string;
  displayName: string;
  role: string;
}

export interface IMessage {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  createdAt: Schema.Types.Date;
  message: string;
}

export interface IncomingMessage {
  type: string;
  payload: any;
}

export interface ActiveConnections {
  [id: string]: WebSocket;
}
