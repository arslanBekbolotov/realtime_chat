
export interface IMember{
    _id:string;
    displayName:string;
}

export interface IMessage{
    user:IMember;
    message:string;
}

export interface IError{
    error:string;
}


export interface IncomingMessage{
    type:string;
    payload:IMember[] | IMessage | IError | IMessage[];
}