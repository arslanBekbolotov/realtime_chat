import {Schema} from "mongoose";
import {WebSocket} from "ws";

export interface IUser{
    username:string;
    token:string;
    password:string;
    displayName:string;
    googleID?: string,
    role:string;
}

export interface IMessage{
    user:Schema.Types.ObjectId;
    message:string;
}

export interface IncomingMessage{
    type:string;
    payload:any;
}

export interface ActiveConnections {
    [id: string]: WebSocket;
}