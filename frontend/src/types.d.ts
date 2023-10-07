
export interface IMember{
    _id:string;
    displayName:string;
}

export interface IncomingMessage{
    type:string;
    payload:IMember[];
}