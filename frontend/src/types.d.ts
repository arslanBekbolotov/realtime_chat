export interface IMember {
  _id: string;
  displayName: string;
}

export interface IUser {
  _id: string;
  username: string;
  token: string;
  password: string;
  displayName: string;
  role: string;
}

export interface IMessage {
  _id: string;
  message: string;
  user: IMember;
}

export interface IError {
  error: string;
}

export interface IncomingMessage {
  type: string;
  payload: IMember[] | IMessage | IError | IMessage[] | IUser;
}

export interface IRegisterResponse {
  username: string;
  displayName?: string;
  password: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}
